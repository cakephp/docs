Le tutoriel du blog CakePHP
###########################

Bienvenue dans Cake ! Vous êtes probablement en train de lire ce
tutoriel car vous voulez en savoir plus sur le fonctionnement de
CakePHP. Notre but est d'augmenter votre productivité de rendre la
programmation plus agréable : nous espérons que vous le remarquerez
lorsque vous vous plongerez dans le code.

Ce tutoriel va vous guider à travers la création d'un blog simple. Nous
allons obtenir et installer Cake, créer et configurer une base de
données et créer suffisamment de logique applicative pour lister,
ajouter, éditer et supprimer les articles du blog.

Voici ce dont vous aurez besoin :

#. **Un serveur web fonctionnel**. Nous supposerons que vous utilisez
   Apache, bien que les instructions pour l'utilisation d'autres
   serveurs devraient être très semblables. Nous aurons peut-être besoin
   de jouer un peu sur la configuration du serveur, mais la plupart des
   personnes peuvent faire fonctionner Cake sans aucune configuration
   préalable.
#. **Un serveur de base de données**. Dans ce tutoriel, nous utiliserons
   MySQL. Vous aurez besoin d'un minimum de connaissance en SQL afin de
   créer une base de données : Cake prendra les rênes à partir de là.
#. **Des connaissances de base en PHP**. Le plus vous aurez d'expérience
   en programmation orienté objet, le mieux ce sera ; mais n'ayez
   crainte, même si vous êtes adepte de la programmation procédurale.
#. Enfin, vous aurez besoin de connaissances de base à propos du **motif
   de conception MVC**. Un bref aperçu de ce motif dans le chapître
   "Débuter avec CakePHP",  Ne vous inquiétez pas : il n'y a qu'une
   demi-page de lecture.

Maintenant, lançons-nous !

Obtenir Cake
============

Tout d'abord, récupérons une copie récente de Cake.

Pour télécharger la dernière révision, visitez le projet CakePHP sur
Cakeforge :
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_
et téléchargez la version stable. Pour ce tutoriel, vous avez besoin de
la version 1.2.x.x

Vous pouvez également faire un "checkout" ou un "export" SVN d'une copie
récente de notre "trunk" à l'adresse suivante :
`https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ <https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/>`_

Quelque soit le moyen utilisé pour le télécharger, placez le code dans
le "DocumentRoot" de votre serveur. Une fois terminé, votre répertoire
d'installation devrait ressembler à celui-ci :

::

    /chemin_du_document_root
        /app
        /cake
        /docs
        /vendors
        .htaccess
        index.php

A présent, il est peut-être temps de voir un peu comment fonctionne la
structure de fichiers de Cake : lisez le chapitre "Principes de base de
CakePHP", section `Structure de fichiers dans CakePHP </fr/view/19/>`_.

Créer la base de données du blog
================================

Maintenant, mettons en place la base de données pour notre blog. Si vous
ne l'avez pas déjà fait, créez une base de donnée vide du nom de votre
choix. Pour le moment, nous allons juste créer une simple table pour
stocker nos posts. Nous allons également insérer quelques posts à des
fins de tests. Exécutez les requêtes SQL suivantes sur votre base de
données :

::

    /* D'abord, créons la table des posts : */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Puis insérons quelques posts pour les tests : */
    INSERT INTO posts (title,body,created)
        VALUES ('Le titre', 'Voici le contenu du post.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Encore un titre', 'Et le contenu du post qui suit.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Le retour du titre', 'C\'est vraiment excitant, non ?', NOW());

Les choix des noms pour la table et les colonnes ne sont pas
arbitraires. Si vous respectez les conventions de nommage Cake pour la
base de données et les classes, vous tirerez avantage d'un grand
nombre de fonctionnalités automatiques et vous éviterez des étapes de
configuration. Cake est suffisamment souple pour implémenter les pires
schémas de base de données, mais respecter les conventions vous fera
gagner du temps.

Consultez le chapître `Conventions CakePHP` pour plus
d'information, mais il suffit de dire que nommer notre table 'posts'
permet de la relier automatiquement à notre modèle Post, et que les
champs nommés 'modified' et 'created' seront automatiquement gérés par
Cake.

Configurer la base de données Cake
==================================

En avant : indiquons à Cake où se trouve notre base de données et
comment s'y connecter. Pour la plupart d'entre vous, c'est la première
et la dernière fois que vous configurerez quelque chose.

Une copie du fichier de configuration de CakePHP pour la base de données
se trouve dans ``/app/config/database.php.default``. Faites une copie de
ce fichier dans le même répertoire, mais nommez-le ``database.php``.

Le fichier de configuration devrait être assez simple : remplacez
simplement les valeurs du tableau $default par celles qui correspondent
à votre installation. Un exemple de tableau de configuration complet
pourrait ressembler à ce qui suit :

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Une fois que vous avez sauvegardé votre nouveau fichier
``database.php``, vous devriez être en mesure d'ouvrir votre navigateur
et de voir la page d'accueil de Cake. Elle devrait également vous
indiquer que votre fichier de connexion à la base de données a été
trouvé et que Cake peut s'y connecter avec succès.

Configuration facultative
=========================

Il y a deux autres éléments qui peuvent être configurés. La plupart des
développeurs configurent les éléments de cette petite liste, mais cela
n'est pas requis pour ce tutoriel. Le premier point consiste à définir
une chaîne de caractères personnalisée (ou "grain de sel") afin de
sécuriser les hashs. Le second point est de permettre l'accès en
écriture à CakePHP pour son dossier ``tmp``.

Le "grain" de sécurité est utilisé pour générer des hashs. Changez sa
valeur par défaut en éditant : ``/app/config/core.php`` à la ligne 151.
La nouvelle valeur n'a pas beaucoup d'importance, du moment qu'elle
n'est pas facile à deviner.

::

    <?php
    /**
     * Une chaîne aléatoire utilisée dans les méthodes de hachage sécurisées
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

La dernière étape consiste à rendre le répertoire ``app/tmp`` accessible
en écriture. Le meilleur moyen de faire cela est de trouver sous quel
utilisateur votre serveur web s'exécute (``<?php echo `whoami`; ?>``) et
de modifier les propriétés du répertoire ``app/tmp`` pour cet
utilisateur. La commande finale à exécuter (sous \*nix) devrait
ressembler à quelque chose comme cela.

::

    $ chown -R www-data app/tmp

Si pour une raison quelconque CakePHP ne peut pas écrire dans ce
répertoire, vous en serez informé par un message d'avertissement tant
que vous n'êtes pas en mode production.

Une note sur mod\_rewrite
=========================

De temps en temps, un nouvel utilisateur rencontrera des problèmes avec
*mod\_rewrite*, je vais donc les mentionner ici en marge. Si la page
d'accueil de CakePHP vous semble un peu singulière (pas d'images ou de
style CSS), cela signifie probablement que *mod\_rewrite* n'est pas
activé sur votre système. Voici quelques conseils pour vous aider à le
faire fonctionner :

#. Assurez-vous qu'une neutralisation (*override*) .htaccess est permise
   : dans votre fichier ``httpd.conf``, vous devriez avoir une rubrique
   qui définit une section pour chaque répertoire de votre serveur.
   Vérifiez que ``AllowOverride`` est défini à ``All`` pour le bon
   répertoire.

#. Assurez-vous que vous éditez le bon ``httpd.conf`` et non celui d'un
   utilisateur ou d'un site spécifique.

#. Pour une raison ou une autre, vous avez peut être téléchargé une
   copie de CakePHP sans les fichiers .htaccess nécessaires. Cela arrive
   parfois car certains systèmes d'exploitation masquent les fichiers
   qui commencent par '.' et ne les copient pas. Assurez vous que votre
   copie de CakePHP provient de la section téléchargements du site ou de
   notre dépôt SVN.

#. Assurez-vous qu'Apache charge correctement le *mod\_rewrite* ! Vous
   devriez voir quelque chose comme :
   ``LoadModule rewrite_module libexec/httpd/mod_rewrite.so`` et
   ``AddModule mod_rewrite.c`` dans votre ``httpd.conf``.

Si vous ne voulez pas ou ne pouvez pas faire fonctionner le
*mod\_rewrite* (ou tout autre module compatible) sur votre serveur, vous
devrez utiliser les "URLs enjolivées" intégrées à Cake. Dans
``/app/config/core.php``, décommentez la ligne qui ressemble à cela :

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Supprimez également ces fichiers .htaccess :

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

Vos URLs seront ainsi transformées en :
www.example.com/index.php/controllername/actionname/param plutôt que
www.example.com/controllername/actionname/param.

Créer un Modèle "Post"
======================

La classe Modèle c'est le pain quotidien des applications CakePHP. En
créant un modèle CakePHP qui interagira avec notre base de données, nous
aurons mis en place les fondations nécessaires pour faire plus tard nos
opérations de lecture, d'insertion, d'édition et de suppression.

Les fichiers des classes Modèle de CakePHP se placent dans
``/app/models``, et le fichier que nous allons créer maintenant sera
enregistré dans ``/app/models/post.php``. Le fichier complet devrait
ressembler à ceci :

::

    <?php

    class Post extends AppModel
    {
        var $name = 'Post';
    }

    ?>

La convention de nommage est très importante dans CakePHP. En nommant
notre modèle "Post", CakePHP peut automatiquement déduire que ce modèle
sera utilisé dans le Contrôleur "Posts" et qu'il sera lié à une table de
la base de données appelée ``posts``.

CakePHP créé un modèle automatiquement s'il ne trouve pas de fichier
correspondant dans /app/models. En clair, si vous faites une erreur de
nommage accidentelle (i.e. Post.php ou posts.php) CakePHP n'utilisera
pas vos paramètres et les remplacera par ceux par défaut.

C'est toujours une bonne idée d'ajouter la variable $name, elle est en
effet utilisée pour surmonter quelques bizarreries dans les noms des
classes en PHP4.

Pour plus d'informations sur les modèles, comme les préfixes des tables,
les callbacks et la validation, consultez le chapitre
`Modèles </fr/view/66/>`_ du manuel.

Créer un Contrôleur "Posts"
===========================

Nous allons maintenant créer un contrôleur pour nos posts. Le contrôleur
est l'endroit où s'exécutera toute la logique métier pour l'interaction
du processus de post. En un mot, c'est l'endroit où vous jouez avec les
modèles et où les tâches liées aux posts s'exécutent. Nous placerons ce
nouveau contrôleur dans un fichier appelé ``posts_controller.php`` au
sein du répertoire ``/app/controllers``. Voici à quoi devrait ressembler
le contrôleur de base :

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
    }
    ?>

A présent, ajoutons une action à notre contrôleur. Les actions
représentent souvent une simple fonction ou une interface dans une
application. Par exemple, lorsque les utilisateurs requêtent la page
www.exemple.com/posts/index (ce qui est équivalent à
www.exemple.com/posts/), ils pourraient s'attendre à voir une liste de
posts. Le code pour cette action devrait ressembler à quelque chose
comme çà :

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

Laissez-moi vous expliquer un peu cette action. En définissant la
fonction index() dans notre Contrôleur "Posts", les utilisateurs peuvent
maintenant accéder à cette logique en demandant
www.exemple.com/posts/index. De la même façon, si nous devions définir
une fonction nommée foobar(), les utilisateurs auraient la possibilité
d'accéder à www.exemple.com/posts/foobar.

*Note:* vous pourriez être tenté de nommer vos contrôleurs et vos
actions d'une certaine manière pour obtenir une certaine URL. Résistez à
cette tentation. Suivez les conventions CakePHP (le nom des contrôleurs
au pluriel, etc.) et nommez vos actions de façon lisible et
compréhensible. Vous pouvez lier les URLs à votre code en utilisant ce
qu'on appelle des "routes", on le verra plus tard.

La seule instruction que cette action utilise est ``set()``, pour
transmettre les données du contrôleur à la vue (que nous créerons à la
prochaine étape). La ligne définit la variable de vue appelée 'posts'
qui est égale à la valeur de retour de la méthode ``find('all')`` du
modèle Post. Notre modèle Post est automatiquement disponible via
``$this->Post``, parce que nous avons suivi les conventions de nommage
de Cake.

Pour en apprendre plus sur les contrôleurs de Cake, consultez notre
chapitre "Développer avec CakePHP" à la section :
`"Contrôleurs" </fr/view/49/>`_.

Créer les Vues Post
===================

Maintenant que nous avons nos données en provenance du modèle, ainsi que
la logique applicative et les flux définis par notre contrôleur, nous
allons créer une vue pour l'action "index" que nous avons créée
ci-dessus.

Les vues de Cake sont juste des fragments de présentation "assaisonnée",
qui s'intègrent au sein d'un *layout* applicatif. Pour la plupart des
applications, elles sont un mélange de HTML et PHP, mais les vues
peuvent aussi être constituées de XML, CSV ou même de données binaires.

Les Layouts sont du code de présentation, encapsulé autour d'une vue,
ils peuvent être définis et interchangés, mais pour le moment, utilisons
juste celui par défaut.

Vous souvenez-vous, dans la dernière section, comment nous avions
assigné la variable "posts" à la vue en utilisant la méthode ``set()`` ?
Cela devrait transmettre les données à la vue qui ressemblerait à
quelque chose comme ça :

::

    // print_r($posts) retourne :

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Le titre
                        [body] => Voici le contenu du Post.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Un titre encore une fois
                        [body] => Et le contenu du Post qui suit.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Le retour du titre
                        [body] => C'est vraiment excitant ! non ?.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Les fichiers des vues de Cake sont stockés dans ``/app/views`` à
l'intérieur d'un dossier dont le nom correspond à celui du contrôleur
(nous aurons à créer un dossier appelé 'posts' dans ce cas). Pour mettre
en forme les données de ces posts dans un joli tableau, le code de notre
vue devrait ressembler à quelque chose comme cela :

::

    /app/views/posts/index.ctp

    <h1>Les posts du Blog</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- C'est ici que nous bouclons sur le tableau $posts afin d'afficher les informations des posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], 
    "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Bien entendu, cela donnera quelque chose de simple.

Vous devez avoir remarqué l'utilisation d'un objet appelé ``$html``.
C'est une instance de la classe ``HtmlHelper`` de CakePHP. CakePHP est
livré avec un ensemble de "helpers" (des assistants) pour les vues, qui
réalisent en un clin d'oeil des choses comme le "linking" (mettre les
liens dans un texte), l'affichage de formulaires, du JavaScript et de
l'Ajax. Vous pouvez en apprendre plus sur la manière de les utiliser
dans le `chapitre "Helpers intégrés" </fr/view/181/>`_, mais ce qu'il
est important de noter ici, c'est que la méthode ``link()`` génèrera un
lien HTML à partir d'un titre (le premier paramètre) et d'une URL (le
second paramètre).

Lorsque vous indiquez des URLs dans Cake, vous donnez simplement un
chemin relatif à partir de la base de l'application et Cake s'occupe du
reste. En tant que tel, vos URLs prendront généralement la forme
suivante : ``/controleur/action/parametre1/parametre2``.

A ce stade, vous devriez être en mesure de pointer votre navigateur sur
la page http://www.exemple.com/posts/index. Vous devriez voir votre vue,
correctement formatée avec le titre et le tableau listant les posts.

Si vous avez essayé de cliquer sur l'un des liens que nous avons créés
dans cette vue (le lien sur le titre d'un post mène à l'URL :
``/posts/view/un_id_quelconque``), vous avez sûrement été informé par
CakePHP que l'action n'a pas encore été définie. Si vous n'avez pas été
informé, soit quelque chose s'est mal passé, soit en fait vous aviez
déjà défini l'action, auquel cas vous êtes vraiment sournois ! Sinon,
nous allons la créer sans plus tarder dans le Contrôleur Posts :

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

L'appel de ``set()`` devrait vous être familier. Notez que nous
utilisons ``read()`` plutôt que ``find('all')`` parce que nous voulons
seulement récupérer les informations d'un post unique.

Remarquez que notre action "view" prend un paramètre : l'ID du post que
nous aimerions voir. Ce paramètre est transmis à l'action grâce l'URL
demandée. Si un utilisateur demande ``/posts/view/3``, alors la valeur
'3' est transmise à la variable $id.

Maintenant, créons la vue pour notre nouvelle action "view" et plaçons
la dans : ``/app/views/posts/view.ctp``.

::

    /app/views/posts/view.ctp

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Créé le : <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Vérifiez que cela fonctionne en testant les liens de la page
``/posts/index`` ou en affichant directement un billet via la page
``/posts/view/1``.

Ajouter des Posts
=================

Lire depuis la base de données et nous afficher les posts est un bon
début, mais lançons-nous dans l'ajout de nouveaux posts.

D'abord, commençons par créer une action ``add()`` dans le Contrôleur
Posts :

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->flash('Votre post a été sauvegardé.','/posts');
                }
            }
        }
    }
    ?>

Voici ce que fait l'action ``add()`` : si le formulaire de données
envoyé n'est pas vide, nous essayons d'enregistrer les données en
utilisant le modèle Post. Si pour une raison quelconque cela ne
s'enregistre pas, nous effectuons juste un rendu de la vue. Cela nous
donne une chance de voir les erreurs de validation de l'utilisateur et
d'autres alertes.

Lorsqu'un utilisateur utilise un formulaire pour POSTER des données à
votre application, cette information est disponible dans
``$this->data``. Vous pouvez vous servir de ``pr()`` pour l'afficher si
vous souhaitez voir à quoi cela ressemble.

La fonction ``$this->flash()`` appelée ici est une méthode du contrôleur
qui affiche un message à l'utilisateur pendant une seconde (en utilisant
la mise en page des messages flashs), puis redirige l'utilisateur vers
une autre URL (``/posts``, dans ce cas). Si DEBUG est paramétré à 0,
``$this->flash()`` redirigera automatiquement, au contraire, si DEBUG
est > à 0, vous serez en mesure de voir la mise en page des flashs et de
cliquer sur le message pour réaliser la redirection.

L'appel de la méthode ``save()`` vérifiera les erreurs de validation et
interrompra l'enregistrement s'il y en a une qui survient. Nous verrons
la façon dont les erreurs sont traitées dans les sections suivantes.

Validation des données
======================

Cake place la barre très haut pour briser la monotonie de la validation
des champs de formulaires. Tout le monde déteste le codage de
formulaires interminables et que leurs routines de validation. CakePHP
rend tout cela plus facile et plus rapide.

Pour tirer avantage des fonctionnalités de validation, vous devrez
utiliser le Helper "Form" de Cake dans vos vues. Le Helper "Form" est
disponible, par défaut, pour toutes les vues, avec la variable
``$form``.

Voici le code de notre vue "add" (ajout) :

::

    /app/views/posts/add.ctp
        
    <h1>Ajouter un Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Sauvegarder le Post');
    ?>

Ici, nous utilisons le Helper "Form" pour générer la balise d'ouverture
d'un formulaire HTML. Voici le code HTML produit par ``$form->create()``
:

::

    <form id="PostAddForm" method="post" action="/posts/add">

Si ``create()`` est appelé sans aucun paramètre, on suppose que vous
construisez un formulaire qui envoie les données à l'action ``add()`` du
contrôleur courant, via POST.

La méthode ``$form->input()`` est utilisée pour créer des éléments de
formulaire du même nom. Le premier paramètre indique à CakePHP à quels
champs ils correspondent et le second permet de spécifier un large
éventail d'options, par exemple dans ce cas, le nombre de lignes du
textarea. Il y a un peu d'introspection et "d'automagie" ici : input()
affichera les différents éléments de formulaire selon le champ spécifié
du modèle.

L'appel de ``$form->end()`` génère un bouton de soumission et termine le
formulaire. Si une chaîne de caractères est passée comme premier
paramètre de la méthode ``end()``, le Helper "Form" affiche un bouton de
soumission dont le nom correspond à celle-ci, ainsi que la balise de
fermeture du formulaire. Encore une fois, référez-vous au `Chapitre
"Helpers intégrés" </fr/view/181/>`_ pour en savoir plus sur les
helpers.

Si vous le souhaitez, vous pouvez mettre à jour votre vue
``/app/views/posts/index.ctp`` pour y inclure un nouveau lien "Ajouter
un post" qui pointe vers www.exemple.com/posts/add.

Vous vous demandez peut-être : comment je fais pour indiquer à CakePHP
mes exigences de validation ? Les règles de validation sont définies
dans le modèle. Retournons donc à notre modèle Post et faisons quelques
ajustements :

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => array('minLength', 1)
            ),
            'body' => array(
                'rule' => array('minLength', 1)
            )
        );
    }
    ?>

Le tableau ``$validate`` indique à CakePHP comment valider vos données
lorsque la méthode ``save()`` est appelée. Ici, j'ai spécifié que les
deux champs "body" et "title" ne doivent pas être vides. Le moteur de
validation de CakePHP est puissant, dispose d'un certain nombre de
règles pré-fabriquées (codes de carte bancaire, adresses emails, etc.)
et d'une souplesse pour la personnalisation des règles de validation.
Pour plus d'informations sur cette configuration, consultez le `chapitre
sur la validation des données </fr/view/125/data-validation>`_.

Maintenant que vous avez mis en place vos règles de validation, lancez
l'application pour essayer d'ajouter un post avec un titre ou un contenu
vide, afin de voir comment cela fonctionne. Puisque nous avons utilisé
la méthode input() du Helper "Form" pour créer nos éléments de
formulaire, nos messages d'erreurs de validation seront affichés
automatiquement.

Supprimer des Posts
===================

A présent, mettons en place un moyen de suppression des billets pour les
utilisateurs. Démarrons avec une action ``delete()`` dans le
PostsController :

::

    function delete($id) {
        $this->Post->delete($id);
        $this->flash('Le post avec l\'id: '.$id.' a été supprimé.', '/posts');
    }

Cette logique supprime le billet spécifié par "$id" et utilise
``flash()`` pour afficher à l'utilisateur un message de confirmation
avant de le rediriger vers /posts.

Parce que nous exécutons juste un peu de logique et de redirection,
cette action n'a pas de vue. Vous voudrez peut-être mettre à jour votre
vue "index" avec des liens qui permettent aux utilisateurs de supprimer
des billets, ainsi :

::

    /app/views/posts/index.ctp

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Ajouter un Post', '/posts/add'); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Titre</th>
                    <th>Actions</th>
            <th>Créé le</th>
        </tr>

    <!-- C'est ici que nous bouclons sur le tableau $posts afin d'afficher les informations des posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $html->link($post['Post']['title'], '/posts/view/'.$post['Post']['id']);?>
            </td>
            <td>
            <?php echo $html->link('Supprimer', "/posts/delete/{$post['Post']['id']}", null, 'Etes-vous sûr ?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

*Note* : le code de cette vue utilise également le Helper "Html" pour
afficher à l'utilisateur un message de confirmation JavaScript avant
qu'il ne tente de supprimer un billet.

Editer des Posts
================

Edition de posts : allons-y ! Vous êtes un pro de CakePHP maintenant,
vous devriez donc avoir adopté le principe. Créer l'action puis la vue.
Voici à quoi devrait ressembler l'action ``edit()`` du Contrôleur Posts
:

::

    function edit($id = null) {
        if (empty($this->data)) {
            $this->Post->id = $id;
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data['Post'])) {
                $this->flash('Votre post a été mis à jour.','/posts');
            }
        }
    }

Cette action contrôle d'abord les données soumises par le formulaire. Si
rien n'a été envoyé, elle trouve le post et transmet les données à la
vue. Si des données *ont* été transmises, elle essaye d'enregistrer les
données en utilisant le modèle Post (ou retourne en arrière et affiche à
l'utilisateur les erreurs de validation).

La vue "edit" devrait ressembler à quelque chose comme cela :

::

    /app/views/posts/edit.ctp
        
    <h1>Editer le Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->hidden('id');
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
        echo $form->end('Sauvegarder le Post');
    ?>

Cette vue affiche le formulaire d'édition (avec les valeurs
pré-remplies), ainsi que les messages d'erreur de validation
nécessaires.

Une chose à noter ici : CakePHP supposera que vous éditez un modèle si
le champ 'id' est présent dans le tableau de données. Si aucun 'id'
n'est présent (ce qui revient à notre vue "add"), Cake supposera que
vous insérez un nouveau modèle lorsque ``save()`` sera appelé.

Vous pouvez maintenant mettre à jour votre vue "index" avec des liens
pour éditer des posts particuliers :

::

    /app/views/posts/index.ctp (lien d'édition ajouté)
        
    <h1>Blog posts</h1>
    <p><?php echo $html->link("Ajouter un Post", "/posts/add"); ?>
    <table>
        <tr>
            <th>Id</th>
            <th>Titre</th>
                    <th>Action</th>
            <th>Créé le</th>
        </tr>

    <!-- Ici, nous bouclons sur le tableau $posts afin d'afficher les informations des posts -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'],'/posts/view/'.$post['Post']['id']);?>
                    </td>
                    <td>
                <?php echo $html->link('Supprimer', "/posts/delete/{$post['Post']['id']}", 
    null, 'Etes-vous sûr ?')?>
                <?php echo $html->link('Editer', '/posts/edit/'.$post['Post']['id']);?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Routes
======

Maintenant, abordons les Routes. Pour certains, le routage par défaut de
CakePHP fonctionne suffisamment bien. Les développeurs qui sont
sensibles à la facilité d'utilisation et à la compatibilité avec les
moteurs de recherche apprécieront de comprendre comment lier des URLs à
des appels spécifiques de fonction dans CakePHP. Nous allons juste faire
une rapide modification des routes dans ce tutoriel. Pour plus
d'informations sur les techniques avancées de routage, consultez le
chapitre "Développer avec CakePHP" section: `"Configuration des
routes" </fr/view/46/>`_.

Pour le moment, CakePHP redirigera une personne visitant la racine de
votre site (c'est-à-dire http://www.exemple.com) vers le Contrôleur
Pages et rentourne une vue appelée "home". Au lieu de cela, nous
voudrions que les utilisateurs de notre blog soient redirigés vers notre
Contrôleur Posts.

Le routage de Cake se trouve dans ``/app/config/routes.php``. Vous
devrez commenter ou supprimer la ligne qui définit la route par défaut
de la racine. Elle ressemble à cela :

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

Cette ligne connecte l'URL '/' à la page d'accueil par défaut de
CakePHP. Nous voulons que cette URL soit connectée à notre propre
contrôleur, ajoutons donc une ligne ressemblant à ceci :

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

Cela devrait connecter les utilisateurs demandant '/' à l'action index()
de notre Contrôleur Posts fraîchement créé.

CakePHP peut aussi faire du '*reverse routing*\ ' (ou routage inversé).
Par exemple pour la route définie plus haut, en ajoutant
``array('controller'=>'posts', 'action'=>'index')`` à une fonction
retournant un tableau, l'URL '/' sera utilisée. Il est d'ailleurs bien
avisé de toujours utiliser un tableau pour les URLs afin que vos routes
définissent où vont les URLs mais aussi pour s'assurer qu'elles aillent
vers la même destination.

Conclusion
==========

Créer des applications de cette manière vous apportera la paix,
l'honneur, des femmes (ou des hommes) et de l'argent au-delà même de vos
fantasmes les plus fous. Simple, n'est-ce-pas ? Gardez à l'esprit que ce
tutoriel était très basique. CakePHP a *beaucoup* plus de
fonctionnalités à offrir et il est aussi souple dans d'autres domaines
que nous n'avons pas souhaités couvrir ici pour simplifier les choses.
Utilisez le reste de ce manuel comme un guide pour développer des
applications plus riches en fonctionnalités.

Maintenant que vous avez créé une application Cake basique, vous êtes
prêt pour les choses sérieuses. Lancez votre propre projet, lisez le
reste du `Manuel </fr/fr>`_ et `l'API <https://api.cakephp.org>`_.

Si vous avez besoin d'aide, venez nous voir sur le canal irc #cakephp.
Bienvenue sur CakePHP !

Prochaines lectures suggérrées
------------------------------

Voici les prochains sujets sur lesquels se penchent le plus souvent les
apprentis cuisiniers :

#. `Gabarits : <https://book.cakephp.org/fr/view/1080/Gabarits-layouts>`_
   Personnaliser les Gabarits (Layouts) de votre application
#. `Eléments : <https://book.cakephp.org/fr/view/1081/Elements>`_ Inclure
   et ré-utiliser les portions de vues
#. `Scaffolding : <https://book.cakephp.org/fr/view/1103/Scaffolding>`_
   Construire une ébauche d'application sans avoir à coder
#. `Utiliser Bake
   : <https://book.cakephp.org/fr/view/1522/Generation-de-code-avec-Bake>`_
   Générer un code `CRUD <http://fr.wikipedia.org/wiki/CRUD>`_ basique
#. `Authentification
   : <https://book.cakephp.org/fr/view/1250/Authentification>`_
   Enregistrement et connexion d'utilisateurs

