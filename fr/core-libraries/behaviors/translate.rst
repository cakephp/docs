Le behavior Translate
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
de données i18n. Il vous sera demandé si vous voulez supprimer toute base 
existante et si vous voulez en créer une. Répondez par oui si vous êtes 
certain qu'il n'y a pas encore une table i18n et répondez encore par oui 
pour créer la table.

Attacher le Behavior Translate à vos Models
============================================

Ajoutez-le à votre model en utilisant la propriété ``$actsAs`` comme dans 
l'exemple suivant.::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate'
        );
    }

Ceci ne produira encore rien, parce qu'il faut un couple d'options avant 
que que cela ne commence à fonctionner. Vous devez définir, quels champs 
du model courant devront être détectés dans la table de traduction que nous 
avons créée précédemment.

Définir les Champs
==================

Vous pouvez définir les champs en étendant simplement la valeur ``'Translate'`` 
avec un autre tableau, comme ::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'fieldOne', 'fieldTwo', 'and_so_on'
            )
        );
    }

Après avoir fait cela (par exemple, en précisant "nom" comme l'un des champs), 
vous avez déjà terminé la configuration de base. Super ! D'après notre exemple 
courant, le model devrait maintenant ressembler à quelque chose comme cela ::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
    }

Quand vous définissez vos champs à traduire dans le Behavior Translate, 
assurez-vous d'omettre les champs du schéma de model traduits.
Si vous laissez les champs en place, il peut y avoir un problème de 
récupération de donnée avec fallback locales (traduction très approximative).

Conclusion
==========

A partir de maintenant, chaque mise à jour/création d'un enregistrement fera 
que le Behavior Translate copiera la valeur de "nom" dans la table de 
traduction (par défaut : i18n), avec la locale courante. Une "locale" est un 
identifiant de langue.

La *locale courante* est la valeur actuelle de 
``Configure::read('Config.language')``. La valeur de *Config.language* est 
assignée dans la Classe L10n - à moins qu'elle ne soit déjà définie. Cependant, 
le Behavior Translate vous autorise à surcharger ceci à la volée, ce qui 
permet à l'utilisateur de votre page de créer de multiples versions sans avoir 
besoin de modifier ses préférences. Plus d'information sur ce point dans la 
prochaine section.

Récupérer tous les enregistrements de traduction pour un champ
==============================================================

Si vous voulez avoir tous les enregistrements de traduction attachés à 
l'enregistrement de model courant, vous étendez simplement le *tableau champ* 
dans votre paramétrage du behavior, comme montré ci-dessous. Vous êtes 
complètement libre de choisir le nommage.::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'name' => 'nomTraduction'
            )
        );
    }

Avec ce paramétrage, le résultat de votre find() devrait ressembler à quelque 
chose comme cela ::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [nom] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )
    
         [nomTraduction] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => fr_fr
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Entree exemple
                     )
    
                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )
    
             )
    )

**Note**: L'enregistrement de model contient un champ *virtuel* appelée 
"locale". Il indique quelle locale est utilisée dans ce résultat.

Note that only fields of the model you are directly doing \`find\`
on will be translated. Models attached via associations won't be
translated because triggering callbacks on associated models is
currently not supported.

Utiliser la méthode bindTranslation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vous pouvez aussi récupérer toutes les traductions seulement quand vous en 
avez besoin, en utilisant la méthode bindTranslation.

``bindTranslation($fields, $reset)``

``$fields`` st un tableau associatif composé du champ et du nom de 
l'association, dans lequel la clé est le champ traduisible et la valeur 
est le nom fictif de l'association.::

    $this->Post->bindTranslation(array('name' => 'nomTraduction'));
    $this->Post->find('all', array('recursive' => 1)); // il est nécessaire 
    d'avoir au moins un recursive à 1 pour que ceci fonctionne

Avec ce paramétrage, le résultat de votre find() devrait ressembler à quelque 
chose comme ceci ::
   
    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [nom] => Exemple d'entrée
                 [body] => lorem ipsum...
                 [locale] => fr_fr
             )

         [nomTraduction] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => nom
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => fr_fr
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Exemple d'entrée
                     )

             )
    )

Sauvegarder dans une autre Langue
=================================

Vous pouvez forcer le model qui utilise le TranslateBehavior à sauvegarder 
dans une autre langue que celle détectée.

Pour dire à un model dans quelle langue le contenu devra être sauvé, changez 
simplement la valeur de la propriété $locale du model, avant que vous ne 
sauvegardiez les données dans la base. Vous pouvez faire çà dans votre 
controller ou vous pouvez le définir directement dans le model.

**Example A:** Dans votre controller::
    
    class PostsController extends AppController {
        public $name = 'Posts';

        public function add() {
            if (!empty($this->request->data)) {
                $this->Post->locale = 'de_de'; // nous allons sauvegarder la version allemande
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }

**Exemple B:** Dans votre model::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'nom'
            )
        );

        // Option 1) definir la propriété directement tout simplement
        public $locale = 'fr_fr';

        // Option 2) créer une méthode simple 
        public function setLanguage($locale) {
            $this->locale = $locale;
        }
    }

Traduction de Tables Multiples
==============================

Si vous attendez beaucoup d'entrée, vous vous demandez certainement
comment gérer tout cela dans une base de donnée qui grossit rapidement.

Il y a deux propriétés introduite dans le Behavior Translate
qui permettent de spécifier quel model doit être relié au model
qui contient les traductions.

Les voici **$translateModel** et **$translateTable**.

Disons que nous voulons sauver nos traductions pour tous les posts dans la
table "post-Files _i18ns" au lieu de la valeur par défaut "i18n" de la table.
Pour faire cela vous avez besoin de paramétrer votre model comme cela ::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Utilise un model différent (ainsi qu'une table)
        public $translateModel = 'PostI18n';
    }

**Important** vous devez mettre au pluriel la table.C'est maintenant
un model habituel et il peut être traité en tant que tel avec les conventions 
qui en découlent.

Le schéma de la table elle-même doit être identique à celui généré par la 
console CakePHP. Pour vous assurer qu'il s'intègre vous pourriez initialiser 
une table i18n vide au travers de la console et renommer la table après coup.

Créer le Model de Traduction
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour que cela fonctionne vous devez créer le fichier de l'actuel
model dans le dossier des models. La raison est qu'il n'y a pas de propriété 
pour définir le displayField directement dans le model utilisant ce behavior.

Assurez vous de changer le ``$displayField`` en ``'field'``.::

    class PostI18n extends AppModel { 
        public $displayField = 'field'; // important
    }
    // nom du fichier: post_i18n.php

C'est tout ce qu'il faut. Vous pouvez aussi ajouter toutes les propriétés 
des models comme $useTable. Mais pour une meilleure cohérence nous 
pouvons faire cela dans le model qui utilise ce model de traduction. 
C'est là que l'option ``$translateTable`` entre en jeu. 

Modification d'une Table
~~~~~~~~~~~~~~~~~~~~~~~~

Si vous voulez changer le nom de la table, il vous suffit simplement 
de définir $translateTable dans votre model, comme ceci ::

    class Post extends AppModel {
        public $name = 'Post';
        public $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Utiliser un model différent
        public $translateModel = 'PostI18n';
        
        // Utiliser une table différente pour translateModel
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
