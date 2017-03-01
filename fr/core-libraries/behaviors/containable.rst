Containable
###########

.. php:class:: ContainableBehavior

Une nouvelle intégration au coeur de CakePHP 1.2 est le Behavior "Containable"
``ContainableBehavior``. Ce behavior vous permet de filtrer et de
limiter les opérations de récupération de données "find". Utiliser Containable
vous aidera a réduire l'utilisation inutile de votre base de données et
augmentera la vitesse et la plupart des performances de votre application. La
classe vous aidera aussi a chercher et filtrer vos données pour vos
utilisateurs d'une façon propre et cohérente.

Le behavior "Containable" vous permet de rationaliser et de simplifier les
opérations de construction du model. Il agit en modifiant temporairement ou
définitivement les associations de vos models. Il fait cela en utilisant
des "containements" pour générer une série d'appels ``bindModel`` et
``unbindModel``. Étant donné que Containable modifie seulement les relations
déjà existantes, il ne vous permettra pas de restreindre les résultats pour
des associations distantes. Pour cela, vous devriez voir les
:ref:`joining-tables`.

Pour utiliser le nouveau behavior, vous pouvez l'ajouter à la propriété
$actsAs de votre model::

    class Post extends AppModel {
        public $actsAs = array('Containable');
    }

Vous pouvez aussi attacher le behavior à la volée::

    $this->Post->Behaviors->attach('Containable');

.. _using-containable:

Utilisation de Containable
~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour voir comment Containable fonctionne, regardons quelques exemples.
Premièrement, nous commencerons avec un appel ``find()`` sur un model nommé
'Post'. Disons que ce 'Post' a plusieurs (hasMany) 'Comment', et 'Post' a et
appartient à plusieurs (hasAndBelongsToMany) 'Tag'. La quantité de données
récupérées par un appel ``find()`` normal est assez étendue::

    debug($this->Post->find('all'));

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [auteur] => Daniel
                                [email] => dan@example.com
                                [siteweb] => http://example.com
                                [commentaire] => Premier commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [auteur] => Sam
                                [email] => sam@example.net
                                [siteweb] => http://example.net
                                [commentaire] => Second commentaire
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

Pour certaines interfaces de votre application, vous pouvez ne pas avoir
besoin d'autant d'information depuis le model Post. Le
``Behavior containable`` permet de réduire ce que le find() retourne.

Par exemple, pour ne récupérer que les informations liées au post vous
pouvez faire cela::

    $this->Post->contain();
    $this->Post->find('all');

Vous pouvez utiliser la magie de "Containable" à l'intérieur d'un appel
find()::

    $this->Post->find('all', array('contain' => false));

Après avoir fait cela, vous vous retrouvez avec quelque chose de plus concis::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
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

Ceci n'est pas nouveau: en fait, vous pouvez obtenir le même résultat sans
le ``behavior Containable`` en faisant quelque chose comme::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Le ``behavior Containable`` s'impose vraiment quand vous avez des associations
complexes, et que vous voulez rogner le nombre d'information au même niveau. La
propriété $recursive des models est utile si vous voulez éviter un niveau de
récursivité entier, mais pas pour choisir ce que vous garder à chaque niveau.
Regardons ensemble comment la methode ``contain()`` agit.

Le premier argument de la méthode accepte le nom, ou un tableau de noms, des
models à garder lors du find. Si nous désirons aller chercher tous les posts
et les tags annexes (sans aucune information de commentaire), nous devons
essayer quelque chose comme::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Nous pouvons à nouveau utiliser la clé contain dans l'appel find()::

    $this->Post->find('all', array('contain' => 'Tag'));

Sans le behavior Containable, nous finirions par utiliser la méthode
``unbindModel()`` du model, plusieurs fois si nous épluchons plusieurs models.
Le ``behavior Containable`` fournit un moyen plus propre pour accomplir cette
même tâche.

Des associations plus profondes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Containable permet également d'aller un peu plus loin : vous pouvez filtrer les
données des models *associés*. si vous regardez les résultats d'un appel find()
classique, notez le champ "auteur" dans le model "Comment". Si vous êtes
intéressés par les posts et les noms des commentaires des auteurs - et rien
d'autre - vous devez faire quelque chose comme::

    $this->Post->contain('Comment.auteur');
    $this->Post->find('all');

    // ou..

    $this->Post->find('all', array('contain' => 'Comment.auteur'));

ici, nous avons dit au behavior Containable de nous donner les informations
du post, et uniquement le champ auteur du model Comment associé. Le résultat
du find ressemble à::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [titre] => Premier article
                        [contenu] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
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

Comme vous pouvez le voir, les tableaux de Comment ne contiennent uniquement
que le champ auteur (avec le post\_id qui est requis par CakePHP pour présenter
le résultat)

Vous pouvez également filtrer les données associées à Comment en spécifiant une
condition::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //ou...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

Ceci nous donne comme résultat les posts et commentaires dont daniel est
l'auteur::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => Premier article
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
                                [comment] => Premier commentaire
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Il y a un important gain à utiliser Containable quand on filtre sur des
associations plus profondes. Dans l'exemple précédent, imaginez que vous
avez 3 posts dans votre base de données et que Daniel a commenté sur 2 de ces
posts. L'opération
$this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));
retournerait TOUS les 3 posts, pas juste les 3 posts que Daniel a commenté.
Cela ne va pas retourner tous les comments cependant, juste les comments de
Daniel. ::

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
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                    )
            )
    [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Third article
                        [content] => ccc
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 22
                                [post_id] => 3
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => Another comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Si vous voulez filtrer les posts selon les comments, pour que les posts non
commentés par Daniel ne soient pas retournés, le plus simple est de
trouver tous les comments de Daniel et de faire un contain sur les Posts. ::

    $this->Comment->find('all', array(
        'conditions' => 'Comment.author = "Daniel"',
        'contain' => 'Post'
    ));

Des filtres supplémentaires peuvent être utilisées en utilisant les options
de recherche standard :ref:`model-find`::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Voici un exemple d'utilisation de ``ContainableBehavior`` quand vous avez des
relations profondes et complexes entre les models.

Examinons les associations des models suivants::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

Voici comment nous récupérons les associations ci-dessus avec le behavior
Containable::

    $this->User->find('all', array(
        'contain' => array(
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

Gardez à l'esprit que la clé 'contain' n'est utilisée qu'une seule fois dans
le model principal, vous n'avez pas besoin d'utiliser 'contain' à nouveau
dans les models liés.

.. note::

    En utilisant les options 'fields' et 'contain' - n'oubliez pas d'inclure
    toutes les clés étrangères que votre requête requiert directement ou
    indirectement.
    Notez également que pour que le behavior Containable puisse fonctionner
    avec le contain pour tous les models, vous devez l'attacher à votre
    AppModel.

.. _containablebehavior-options:

Les options du Behavior Containable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Le ``Behavior Containable`` a plusieurs options qui peuvent être définies
quand le behavior est attaché à un model. Ces paramètres vous permettent
d'affiner le behavior de Containable et de travailler plus facilement avec
les autres behaviors.


- **recursive** (boolean, optional), définir à true pour permettre au behavior
  Containable, de déterminer automatiquement le niveau de récursivité nécessaire
  pour récupérer les models spécifiés et pour paramétrer la récursivité du model
  à ce niveau. Le définir à false désactive cette fonctionnalité. La valeur par
  défaut est ``true``.
- **notices** (boolean, optional), émet des alertes E_NOTICES pour les liaisons
  référencées dans un appel containable et qui ne sont pas valides. La valeur
  par défaut est true.
- **autoFields** (boolean, optional), ajout automatique des champs nécessaires
  pour récupérer les liaisons requêtées. La valeur par défaut est ``true``.
-  **order**: (string, optional) l'ordre dans lequel les elements contenus sont
   triés.

A partir de l'exemple précédent, ceci est un exemple de la façon de forcer
les Posts à être triés selon la date de dernière modification::

    $this->User->find('all', array(
        'contain' => array(
            'Profile',
            'Post' => array(
                'order' => 'Post.updated DESC'
            )
        )
    ));


Vous pouvez changer les paramètres du Behavior Containable à l'exécution, en
ré-attachant le behavior comme vu au chapitre
:doc:`/models/behaviors` (Utiliser les Behaviors).

Le behavior Containable peut quelque fois causer des problèmes avec d'autres
behaviors ou des requêtes qui utilisent des fonctions d'agrégations et/ou des
clauses GROUP BY. Si vous obtenez des erreurs SQL invalides à cause du mélange
de champs agrégés et non-agrégés, essayer de désactiver le paramètre
``autoFields``::

    $this->Post->Behaviors->load('Containable', array('autoFields' => false));

Utiliser Containable avec la pagination
=======================================

En incluant le paramètre 'contain' dans la propriété ``$paginate``,
la pagination sera appliquée à la fois au find('count') et au find('all') dans
le model.

Voir la section :ref:`using-containable` pour plus de détails.

Voici un exemple pour limiter les associations en paginant::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

.. note::

    Si vous faîtes un contain des associations à travers le model à la place,
    il n'honorera pas l':ref:`option récursive <containableBehavior-options>`
    de Containable. Donc si vous définissez à -1 par exemple pour le model,
    cela ne marchera pas::

        $this->User->recursive = -1;
        $this->User->contain(array('Profile', 'Account'));

        $users = $this->paginate('User');


.. meta::
    :title lang=fr: Containable
    :keywords lang=fr: model behavior,author daniel,article content,new addition,wear and tear,array,aaa,email,fly,models
