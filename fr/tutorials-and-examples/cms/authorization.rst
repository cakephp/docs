Tutoriel CMS - Autorisation
############################

Maintenant que nos utilisateurs peuvent se connecter à notre CMS, nous voulons appliquer des règles d'autorisation
pour nous assurer que chaque utilisateur ne puisse éditer que les messages dont il est l'auteur. Nous allons
utiliser le `plugin authorization <https://book.cakephp.org/authorization/2>`__ pour nous en assurer.

Installer le plugin Authorization
=================================

Utilisez composer pour installer le plugin Authorization:

.. code-block:: console

    composer require "cakephp/authorization:^2.0"

Chargez le plugin en ajoutant le code suivant à la méthode ``bootstrap()`` dans le fichier **src/Application.php**::

    $this->addPlugin('Authorization');

Activer le plugin Authorization
===============================

Le plugin Authorization s'intègre dans votre application grâce à la couche middleware et
optionnellement par un composant dans vos contrôleurs pour faciliter les vérifications des droits.
Premièrement, attachons-nous au middleware. Dans **src/Application.php** ajoutez le code suivant
dans les import de la classe::

    use Authorization\AuthorizationService;
    use Authorization\AuthorizationServiceInterface;
    use Authorization\AuthorizationServiceProviderInterface;
    use Authorization\Middleware\AuthorizationMiddleware;
    use Authorization\Policy\OrmResolver;
    use Psr\Http\Message\ResponseInterface;

Ajoutez ``AuthorizationProviderInterface`` aux interfaces déjà importées par votre application::

    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface,
        AuthorizationServiceProviderInterface

Enfin, ajoutez le code suivant à votre méthode ``middleware()``::

    // Attention: Ajoutez Authorization **après** Authentication
    $middlewareQueue->add(new AuthorizationMiddleware($this));

``AuthorizationMiddleware`` va appeler une méthode hook sur votre application qui va permettre
de définir le ``AuthorizationService`` à utiliser. Ajoutez la méthode suivante au
fichier **src/Application.php**::

    public function getAuthorizationService(ServerRequestInterface $request): AuthorizationServiceInterface
    {
        $resolver = new OrmResolver();

        return new AuthorizationService($resolver);
    }

L'OrmResolver permet au plugin Authorization de trouver les classes de stratégies (policies) pour les
entités et les requêtes de l'ORM. Des resolvers supplémentaires peuvent être utilisés pour
trouver des stratégies pour d'autres types de ressources.

Maintenant, ajoutons ``AuthorizationComponent`` à ``AppController``. Dans
**src/Controller/AppController.php** ajoutez le code suivant à la méthode ``initialize()``::

    $this->loadComponent('Authorization.Authorization');

Enfin, nous allons définir les actions add, login et logout comme ne nécessitant pas
d'autorisation en ajoutant le code suivante à **src/Controller/UsersController.php**::

    // Dans les méthodes add, login, et logout
    $this->Authorization->skipAuthorization();

La méthode ``skipAuthorization()`` doit être appelée dans chaque controller ayant des
actions accessibles à tous les utilisateurs, même ceux qui ne sont pas identifiés.

Créons notre Première Stratégie
===============================

Le plugin Authorization représente les autorisation et les permissions par des classes Policy.
Ces classes contiennent la logique pour vérifier qu'une **identity** a la permission
de **faire une action** sur une **ressource**. Notre **identity** sera un utilisateur authentifié,
et nos **ressources** sont des entités de l'ORM ainsi que des requêtes sur la base de données.
Utilisons **bake** pour créer la base de notre première stratégie.

.. code-block:: console

    bin/cake bake policy --type entity Article

Cette commande va générer une classe de Police vide pour notre entity ``Article``.
Vous retrouverez le fichier généré dans **src/Policy/ArticlePolicy.php**. Maintenant,
modifiez la stratégie pour qu'elle ressemble à cela::

    <?php
    namespace App\Policy;

    use App\Model\Entity\Article;
    use Authorization\IdentityInterface;

    class ArticlePolicy
    {
        public function canAdd(IdentityInterface $user, Article $article)
        {
            //Tous les utilisateurs authentifiés peuvent créer des articles.
            return true;
        }

        public function canEdit(IdentityInterface $user, Article $article)
        {
            // Les utilisateurs authentifiés ne peuvent modifier que leurs articles.
            return $this->isAuthor($user, $article);
        }

        public function canDelete(IdentityInterface $user, Article $article)
        {
            // Les utilisateurs authentfiés ne peuvent supprimer que leurs articles.
            return $this->isAuthor($user, $article);
        }

        protected function isAuthor(IdentityInterface $user, Article $article)
        {
            return $article->user_id === $user->getIdentifier();
        }
    }

Ici nous n'avons défini que quelques règles basiques, libre à vous d'utiliser des logiques plus
complexes.

Utiliser Authorization dans ArticlesController
==============================================

Maintenant que nos stratégies sont créées nous pouvons vérifier les autorisations
dans chaque action de notre controller. Si nous oublions de vérifier les autorisations
dans une action du controller, le plugin Authorization lèvera une exception.
Dans **src/Controller/ArticlesController.php**, ajoutez le code suivant aux méthodes
``add``, ``edit`` et ``delete``::

    public function add()
    {
        $article = $this->Articles->newEmptyEntity();
        $this->Authorization->authorize($article);
        // Le reste de la méthode..
    }

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // charge les Tags associés
            ->firstOrFail();
        $this->Authorization->authorize($article);
        // Le reste de la méthode..
    }

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->Authorization->authorize($article);
        // Le reste de la méthode..
    }

La méthode ``AuthorizationComponent::authorize()`` va utiliser le nom de l'action pour
retrouver la méthode de la stratégie à appeler. Si vous préférez définir vous-même la méthode
de la stratégie à utiliser vous devrez passer le nom de l'opération à ``authorize``::

    $this->Authorization->authorize($article, 'update');

Maintenant, ajoutez le code suivant aux méthodes ``tags``, ``view``, et ``index`` de votre
``ArticlesController``::

    // Les actions view, index et tags sont des méthodes accessibles
    // à tous et ne nécessitent pas de vérifications.
    $this->Authorization->skipAuthorization();

Amélioration des actions Add & Edit
===================================

Bien que nous ayons bloqué l'accès à l'édition, nous sommes toujours vulnérables
au changement de l'attribut ``user_id`` de l'article par l'utilisateur durant l'édition.
Nous allons remédier à cela. Commençons avec l'action ``add``.

Lorsque nous créons des articles, nous voulons fixer le ``user_id`` comme étant
l'utilisateur actuellement authentifié. Remplacez l'action ``add`` par le code suivant::

    // Dans src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEmptyEntity();
        $this->Authorization->authorize($article);

        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Changement: Chercher le user_id de l'utilisateur authentifié.
            $article->user_id = $this->request->getAttribute('identity')->getIdentifier();

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été enregistré avec succès.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible d\'ajouter votre article.'));
        }
        $tags = $this->Articles->Tags->find('list')->all();
        $this->set(compact('article', 'tags'));
    }

Ensuite nous allons modifier l'action ``edit``. Remplacez la méthode d'édition par ce qui suit::

    // Dans src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // charge les Tags associés
            ->firstOrFail();
        $this->Authorization->authorize($article);

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Ajout: Empêcher la modification de user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Votre article a été sauvegardé.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Impossible de mettre à jour votre article.'));
        }
        $tags = $this->Articles->Tags->find('list')->all();
        $this->set(compact('article', 'tags'));
    }

Ici nous définissons les propriétés qui peuvent être assignées en masse en
utilisant ``patchEntity()``. Voir la section :ref:`changing-accessible-fields`
pour plus d'informations. N'oubliez pas d'enlever le contrôle du ``user_id``
dans **templates/Articles/edit.php**, nous n'en avons plus besoin.

Conclusion
==========

Nous avons construit une application CMS basique qui permet à des utilisateurs de
s'authentifier, d'écrire des articles, d'y ajouter des tags, de parcourir les
articles rédigés, et avons mis en place des contrôles pour nos articles.
Nous avons même ajouté des améliorations à l'interface en exploitant le
FormHelper et les capacités de l'ORM

Merci d'avoir pris le temps d'explorer CakePHP. Nous vous proposons de continuer
votre apprentissage avec :doc:`/orm` ou de lire attentivement :doc:`/topics`.
