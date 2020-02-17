Containable
###########

Une nouvelle intégration au coeur de CakePHP est le Comportement
"Containable". Ce comportement de modèle vous permet de filtrer et
limiter les opérations de récupération de données "find". Utiliser
Containable vous aidera a réduire l'utilisation inutile de votre base de
données et augmentera la vitesse et la plupart des performances de votre
application. La class vous aidera aussi a chercher et filtrer vos
données pour vos utilisateurs d'une façon propre et consistante.

Pour utiliser le nouveau comportement, vous pouvez l'ajouter à la
propriété $actsAs de votre modèle :

::

    class Post extends AppModel {
        var $actsAs = array('Containable');
    }

Vous pouvez aussi attacher le comportement à la volée :

::

    $this->Post->Behaviors->attach('Containable');

Pour voir comment Containable fonctionne, regardons quelques exemples.
Premièrement, nous commencerons avec un appel find() sur un modèle nommé
Post. Disons que ce Post a plusieurs (hasMany) Comment, et Post a et
appartient à plusieurs (hasAndBelongsToMany) Tag. La quantité de données
récupérées par un appel find() normal est assez étendue :

::

    debug($this->Post->find('all'));

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Second comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => A
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => B
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

For some interfaces in your application, you may not need that much
information from the Post model. One thing the ContainableBehavior does
is help you cut down on what find() returns.

For example, to get only the post-related information, you can do the
following:

::

    $this->Post->contain();
    $this->Post->find('all');

You can also invoke Containable's magic from inside the find() call:

::

    $this->Post->find('all', array('contain' => false));

Having done that, you end up with something a lot more concise:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

This sort of help isn't new: in fact, you can do that without the
ContainableBehavior doing something like this:

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable really shines when you have complex associations, and you
want to pare down things that sit at the same level. The model's
$recursive property is helpful if you want to hack off an entire level
of recursion, but not when you want to pick and choose what to keep at
each level. Let's see how it works by using the contain() method. The
contain method's first argument accepts the name, or an array of names,
of the models to keep in the find operation. If we wanted to fetch all
posts and their related tags (without any comment information), we'd try
something like this:

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Again, we can use the contain key inside a find() call:

::

    $this->Post->find('all', array('contain' => 'Tag'));

Without Containable, you'd end up needing to use the unbindModel()
method of the model, multiple times if you're paring off multiple
models. Containable creates a cleaner way to accomplish this same task.

Containable also goes a step deeper: you can filter the data of the
*associated* models. If you look at the results of the original find()
call, notice the author field in the Comment model. If you are
interested in the posts and the names of the comment authors—and nothing
else—you could do something like the following:

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //or..

    $this->Post->find('all', array('contain' => 'Comment.author'));

Here, we've told Containable to give us our post information, and just
the author field of the associated Comment model. The output of the find
call might look something like this:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

As you can see, the Comment arrays only contain the author field (plus
the post\_id which is needed by CakePHP to map the results).

You can also filter the associated Comment data by specifying a
condition:

::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //or...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

This gives us a result that gives us posts with comments authored by
Daniel:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Additional filtering can be performed by supplying the standard
``Model->find()`` options:

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Here's an example of using the Containble behavior when you've got deep
and complex model relationships.

Let's consider the following model associations:

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

This is how we retrieve the above associations with Containable:

::

    $this->User->find('all', array(
        'contain'=>array(
            'Profile',
            'Account' => array(
                'AccountSummary'
            ),
            'Post' => array(
                'PostAttachment' => array(
                    'fields' => array('id', 'name'),
                    'PostAttachmentHistory' => array(
                        'HistoryNotes' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.name LIKE' => '%happy%')
                )
            )
        )
    ));

Keep in mind that 'contain' key is only used once in the main model, you
don't use 'contain' again for related models

When using 'fields' and 'contain' options - be careful to include all
foreign keys that your query directly or indirectly requires. Please
also note that because Containable must to be attached to all models
used in containment, you may consider attaching it to your AppModel.

Here's an example of how to contain associations when paginating.

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

Utiliser Containable
====================

Pour voir comment Containable fonctionne, regardons quelques exemples.
D'abord, nous commencerons par un appel à find() sur un modèle nommé
Post. Disons que Post hasMany Commentaire et Post hasAndBelongsToMany
Tag. La quantité de données récupérées dans un appel à find() normal est
plutôt vaste :

::

    debug($this->Post->find('all'));

::

    [0] Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Commentaire] => Array
                    (
                        [0] Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [auteur] => Daniel
                                [email] => dan@exemple.com
                                [site_web] => http://exemple.com
                                [commentaire] => Premier commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [auteur] => Sam
                                [email] => sam@exemple.net
                                [site_web] => http://exemple.net
                                [commentaire] => Second commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] Array
                            (
                                [id] => 1
                                [nom] => Grandiose
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [nom] => Cuisson
                            )
                    )
            [1] => Array
            (
                [Post] => Array
                    (...

Pour certaines interfaces de votre application, vous n'aurez peut-être
pas besoin d'autant d'informations issues du modèle Post. L'une des
choses que réalise le ``ContainableBehavior``, c'est de vous aider à
réduire ce que retourne un find().

Par exemple, pour obtenir uniquement les informations liées à un post,
vous pouvez faire la chose suivante :

::

    $this->Post->contain();
    $this->Post->find('all');

Vous pouvez aussi invoqué la magie de Containable à l'intérieur de
l'appel à find() :

::

    $this->Post->find('all', array('contain' => false));

En faisant çà, vous vous retrouvez avec quelque chose de plus concis :

::

    [0] Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [titre] => Second article
                        [contenu] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

Ce type d'optimisation n'est pas nouveau : en fait, vous pouvez réaliser
çà sans le comportement ``Containable``, en faisant quelque chose comme
ceci :

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable se distingue réellement, lorsque vous avez des associations
complexes et que vous voulez réduire les choses qui se situent au même
niveau. La propriété de modèle ``$recursive`` est pratique si vous
voulez déconnecter un niveau de récursion entier, mais pas lorsque vous
voulez sélectionner et choisir que garder à chaque niveau. Voyons
comment cela fonctionne en utilisant la méthode ``contain()``.

Le premier argument de la méthode contain accepte le nom, ou un tableau
de noms, des modèles à conserver dans l'opération find. Si nous avions
voulu récupérer tous les posts et leurs tags liés (sans aucune
information de commentaire, nous aurions essayé quelque chose comme çà :

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Là encore, nous pouvons utiliser la clé contain à l'intérieur de l'appel
à find() :

::

    $this->Post->find('all', array('contain' => 'Tag'));

Sans Containable, si vous avez plusieurs modèles, vous finiriez par
avoir besoin d'utiliser la méthode ``unbindModel()`` du modèle de
nombreuses fois. Le comportement Containable offre une manière plus
propre d'accomplir cette même tâche.

Limiter des associations plus profondes
=======================================

Le comportement Containable fonctionne également à un niveau plus
profond : vous pouvez filtrer les données des modèles *associés*. Si
vous regardez les résultats d'un appel au find() original, vous
remarquez le champ auteur dans le modèle Commentaire. Si vous êtes
intéressé par les posts et les noms des auteurs de commentaire — et rien
d'autre — vous pourriez faire quelque chose comme çà :

::

    $this->Post->contain('Commentaire.auteur');
    $this->Post->find('all');

    // ou...

    $this->Post->find('all', array('contain' => 'Commentaire.auteur'));

Ici, nous avons dit au Containable de nous transmettre des informations
sur notre post et seulement le champ auteur du modèle associé
Commentaire. La sortie de l'appel à find devrait ressembler à quelque
chose comme çà :

::

    [0] Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Commentaire] => Array
                    (
                        [0] Array
                            (
                                [auteur] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [auteur] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

Comme vous pouvez le voir, les tableaux Commentaires contiennent
seulement le champ auteur (plus le post\_id qui est utilisé par CakePHP
pour relier les résultats).

Vous pouvez aussi filtrer les données du Commentaire associé en
spécifiant une condition :

::

    $this->Post->contain('Commentaire.auteur = "Daniel"');
    $this->Post->find('all');

    // ou...

    $this->Post->find('all', array('contain' => 'Commentaire.auteur = "Daniel"'));

Ceci nous donne un résultat qui contient les posts avec des commentaires
rédigés par Daniel :

::

    [0] Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Commentaire] => Array
                    (
                        [0] Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [auteur] => Daniel
                                [email] => dan@exemple.com
                                [site_web] => http://exemple.com
                                [commentaire] => Premier commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Des filtrages aditionnels peuvent être effectués, en passant les options
standards de ``Model->find()`` :

::

    $this->Post->find('all', array('contain' => array(
        'Commentaire' => array(
            'conditions' => array('Commentaire.auteur =' => "Daniel"),
            'order'    => 'Commentaire.created DESC',
        )
    )));

Voici un exemple d'utilisation du comportement ``Containable``, lorsque
vous avez des relations profondes et complexes entre modèles.

Considérons les associations de modèles suivantes :

::

    Utilisateur->Profil
    Utilisateur->Compte->SyntheseCompte
    Utilisateur->Post->PieceJointePost->HistoriquePieceJointePost->NoteHistorique
    Utilisateur->Post->Tag

Voici comment nous récupérons les associations ci-dessus avec
Containable :

::

    $this->Utilisateur->find('all', array(
        'contain'=>array(
            'Profil',
            'Compte' => array(
                'SyntheseCompte'
            ),
            'Post' => array(
                'PieceJointePost' => array(
                    'fields' => array('id', 'nom'),
                    'HistoriquePieceJointePost' => array(
                        'NoteHistorique' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.nom LIKE' => '%joyeux%')
                )
            )
        )
    ));

Gardez à l'esprit que la clé ``contain`` est utilisée une seule fois
dans le modèle principal, vous n'avez pas à utiliser 'contain' de
nouveau pour les modèles liés.

Quand vous utilisez les options 'fields' et 'contain', prenez soin
d'inclure toutes les clés étrangères que votre requête nécessite,
directement ou indirectement. Merci de noter également que, puisque le
comportement Containable doit être attaché à tous les modèles utilisés
par la limitation, vous devriez envisager de l'attacher à votre
AppModel.

Utiliser Containable avec la pagination
=======================================

Voici un exemple sur la manière de limiter les associations en paginant.

::

    $this->paginate['Utilisateur'] = array(
        'contain' => array('Profil', 'Compte'),
        'order' => 'Utilisateur.pseudo'
    );

    $utilisateurs = $this->paginate('Utilisateur');

En incluant le paramètre 'contain' dans la propriété ``$paginate``, elle
sera appliquée à la fois au find('count') et au find('all') réalisés
dans le modèle.

Les options du comportement Containable
=======================================

Le ``ContainableBehavior`` a plusieurs options qui peuvent être définies
quand le comportement est attaché à un modèle. Ces paramètres vous
permettent d'affiner le comportement de Containable et de travailler
plus facilement avec les autres comportements.

-  **recursive** (boolean, optional), définir à true pour permettre au
   comportement Containable, de déterminer automatiquement le niveau de
   récursivité nécessaire pour récupérer les modèles spécifiés et de
   paramétrer la récursivité du modèle à ce niveau. Le définir à false
   désactive cette fonctionnalité. La valeur par défaut est ``true``.
-  **notices** (boolean, optional), émet des alertes E\_NOTICES pour les
   liaisons référencées dans un appel containable et qui ne sont pas
   valides. La valeur par défaut est ``true``.
-  **autoFields** (boolean, optional), ajout automatique des champs
   nécessaires pour récupérer les liaisons requêtées. La valeur par
   défaut est ``true``.

Vous pouvez changer les paramètres du ContainableBehavior à l'exécution,
en ré-attachant le comportement comme vu au chapitre `Utiliser les
comportements </fr/view/90/Using-Behaviors>`_

Le comportement Containable peut quelque fois causer des problèles avec
d'autres comportements ou des requêtes qui utilisent des fonctions
d'aggrégations et/ou des clauses GROUP BY. Si vous obtenez des erreurs
SQL invalides à cause du mélange de champs aggrégés et non-aggrégés,
essayer de désactiver le paramètre ``autoFields``.

::

    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

