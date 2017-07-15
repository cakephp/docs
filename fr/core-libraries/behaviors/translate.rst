Le Behavior Translate
#####################

.. php:class:: TranslateBehavior()

Le behavior Translate est en fait assez simple à paramétrer et à faire
fonctionner out of the box, le tout avec très peu de configuration.
Dans cette section, vous apprendrez comment ajouter et configurer ce behavior,
pour l'utiliser dans n'importe quel model.

Si vous utilisez le behavior Translate en parallèle de Containable,
assurez-vous de définir la clé 'fields' pour vos requêtes. Sinon, vous
pourriez vous retrouver avec des fragments SQL générés invalides.

Initialisation des tables  de la Base de donnée i18n
====================================================

Vous pouvez soit utiliser la console CakePHP, soit les créer manuellement.
Il est recommandé d'utiliser la console pour cela, parce qu'il pourrait
arriver que le layout change dans les futures versions de CakePHP. En
restant fidèle à la console, cela garantira que vous ayez le bon layout::

    ./cake i18n

Sélectionner``[I]``, ce qui lancera le script d'initialisation de la base
de données i18n. Il vous sera demandé si vous voulez supprimer toute table
existante et si vous voulez en créer une. Répondez par oui si vous êtes
certain qu'il n'y a pas encore une table i18n et répondez encore par oui
pour créer la table.

Attacher le Behavior Translate à vos Models
===========================================

Ajoutez-le à votre model en utilisant la propriété ``$actsAs`` comme dans
l'exemple suivant. ::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate'
        );
    }

Ceci ne produira encore rien, parce qu'il faut un couple d'options avant
que cela ne commence à fonctionner. Vous devez définir, quels champs
du model courant devront être détectés dans la table de traduction que nous
avons créée précédemment.

Définir les Champs
==================

Vous pouvez définir les champs en étendant simplement la valeur ``'Translate'``
avec un autre tableau, comme::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }

Après avoir fait cela (par exemple, en précisant "title" comme l'un des champs),
vous avez déjà terminé la configuration de base. Super ! D'après notre exemple
courant, le model devrait maintenant ressembler à quelque chose comme cela::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );
    }

Quand vous définissez vos champs à traduire dans le Behavior Translate,
assurez-vous d'omettre les champs du schéma de model traduits.
Si vous laissez les champs en place, il peut y avoir un problème de
récupération de données avec les locales.

.. note::

    Si tous les champs dans votre model sont traduits, assurez-vous d'ajouter
    les colonnes ``created`` et ``modified`` à votre table. CakePHP a besoin
    d'au moins un champ différent d'une clé primaire avant d'enregistrer un
    enregistrement.

Charer les traductions avec des Left Joins
==========================================

Lorsque vous définissez des champs qui sont traduits, vous pouvez aussi configurer
le chargement des traductions pour qu'il se fasse via un ``LEFT JOIN`` à la place
d'un ``INNER JOIN`` (qui est la méthode standard).
Cela vous permettra de charger les enregistrements qui pourrait être partiellement
traduits::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title',
                'body',
                'joinType' => 'left'
            )
        );
    }

.. versionadded:: 2.10.0
    L'option ``joinType`` a été ajoutée dans 2.10.0

Conclusion
==========

A partir de maintenant, chaque mise à jour/création d'un enregistrement fera
que le Behavior Translate copiera la valeur de "title" dans la table de
traduction (par défaut : i18n), avec la locale courante. Une "locale" est un
identifiant d'une langue, pour ainsi dire.

Lire le contenu traduit
=======================

Par défaut, le TranslateBehavior va automatiquement récupérer et ajouter les
données basées sur la locale courante. La locale courante est lue à partir de
``Configure::read('Config.language')`` qui est assignée par la classe
:php:class:`L10n`. Vous pouvez surcharger cette valeur par défaut à la volée
en utilisant ``$Model->locale``.

Récupérer les champs traduits dans une locale spécifique
--------------------------------------------------------

En définissant ``$Model->locale``, vous pouvez lire les traductions pour une
locale spécifique::

    // Lire les données de la locale espagnole.
    $this->Post->locale = 'es';
    $results = $this->Post->find('first', array(
        'conditions' => array('Post.id' => $id)
    ));
    // $results va contenir la traduction espagnole.

Récupérer tous les enregistrements de traduction pour un champ
--------------------------------------------------------------

Si vous voulez avoir tous les enregistrements de traduction attachés à
l'enregistrement de model courant, vous étendez simplement le **tableau champ**
dans votre paramétrage du behavior, comme montré ci-dessous. Vous êtes
complètement libre de choisir le nommage. ::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title' => 'titleTranslation'
            )
        );
    }

Avec ce paramétrage, le résultat de votre ``$this->Post->find()`` devrait
ressembler à quelque chose comme cela ::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [title] => Beispiel Eintrag
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [titleTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Beispiel Eintrag
                     )

             )
    )

.. note::

    L'enregistrement du model contient un champ *virtuel* appelé
    "locale". Il indique quelle locale est utilisée dans ce résultat.

Notez que seuls les champs du model que vous faîtes avec un \`find\`
seront traduits. Les Models attachés via les associations ne seront pas
traduits parce que le déclenchement des callbacks sur les models associés n'est
actuellement pas supporté.

Utiliser la méthode bindTranslation
-----------------------------------

Vous pouvez aussi récupérer toutes les traductions seulement quand vous en
avez besoin, en utilisant la méthode bindTranslation.

.. php:method:: bindTranslation($fields, $reset)

``$fields`` st un tableau associatif composé du champ et du nom de
l'association, dans lequel la clé est le champ traduisible et la valeur
est le nom fictif de l'association. ::

    $this->Post->bindTranslation(array('name' => 'titleTranslation'));
    $this->Post->find('all', array('recursive' => 1)); // il est nécessaire d'avoir au moins un recursive à 1 pour que ceci fonctionne

Avec ce paramétrage, le résultat de votre find() devrait ressembler à quelque
chose comme ceci ::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [title] => Beispiel Eintrag
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [titleTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => title
                         [content] => Beispiel Eintrag
                     )

             )
    )

Sauvegarder dans une autre Langue
=================================

Vous pouvez forcer le model qui utilise le TranslateBehavior à sauvegarder
dans une autre langue que celle détectée.

Pour dire à un model dans quelle langue le contenu devra être sauvé, changez
simplement la valeur de la propriété $locale du model, avant que vous ne
sauvegardiez les données dans la base. Vous pouvez faire cela dans votre
controller ou vous pouvez le définir directement dans le model.

**Exemple A:** Dans votre controller::

    class PostsController extends AppController {

        public function add() {
            if (!empty($this->request->data)) {
                $this->Post->locale = 'de_de'; // we are going to save the german version
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }

**Exemple B:** Dans votre model::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Option 1) just define the property directly
        public $locale = 'en_us';

        // Option 2) create a simple method
        public function setLanguage($locale) {
            $this->locale = $locale;
        }
    }

Traduction de Tables Multiples
==============================

Si vous attendez beaucoup d'entrée, vous vous demandez certainement
comment gérer tout cela dans une base de données qui grossit rapidement. Il y
a deux propriétés introduite dans le Behavior Translate qui permettent de
spécifier quel model doit être relié au model qui contient les traductions.

Ceux-ci sont **$translateModel** et **$translateTable**.

Disons que nous voulons sauver nos traductions pour tous les posts dans la
table "post\_i18ns" au lieu de la valeur par défaut de la table "i18n".
Pour faire cela vous avez besoin de paramétrer votre model comme cela::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Utilise un model différent (et table)
        public $translateModel = 'PostI18n';
    }

.. note::

    Il est important vous mettiez au pluriel la table. C'est maintenant un
    model habituel et il peut être traité en tant que tel avec les conventions
    qui en découlent. Le schéma de la table elle-même doit être identique à
    celui généré par la console CakePHP. Pour vous assurer qu'il s'intègre vous
    pourriez initialiser une table i18n vide au travers de la console et
    renommer la table après coup.

Créer le Model de Traduction
----------------------------

Pour que cela fonctionne vous devez créer le fichier du model actuel dans le
dossier des models. La raison est qu'il n'y a pas de propriété pour définir le
displayField directement dans le model utilisant ce behavior.

Assurez vous de changer le ``$displayField`` en ``'field'``. ::

    class PostI18n extends AppModel {
        public $displayField = 'field'; // important
    }
    // nom de fichier: PostI18n.php

C'est tout ce qu'il faut. Vous pouvez aussi ajouter toutes les propriétés
des models comme $useTable. Mais pour une meilleure cohérence nous
pouvons faire cela dans le model qui utilise ce model de traduction.
C'est là que l'option ``$translateTable`` entre en jeu.

Modification de la Table
------------------------

Si vous voulez changer le nom de la table, il vous suffit simplement
de définir $translateTable dans votre model, comme ceci::

    class Post extends AppModel {
        public $actsAs = array(
            'Translate' => array(
                'title'
            )
        );

        // Utilise un model différent
        public $translateModel = 'PostI18n';

        // Utilise une table différente pour translateModel
        public $translateTable = 'post_translations';
    }

A noter que **vous ne pouvez pas utiliser $translateTable seule**.
Si vous n'avez pas l'intention d'utiliser un Model de traduction
``$translateModel`` personnalisé, alors laissez cette propriété inchangée.
La raison est qu'elle casserait votre configuration et vous afficherait un
message "Missing Table" pour le model I18n par défaut, lequel est créé à
l'exécution.


.. meta::
    :title lang=fr: Translate
    :keywords lang=fr: invalid sql,correct layout,translation table,layout changes,database tables,array,queries,cakephp,models,translate,public name
