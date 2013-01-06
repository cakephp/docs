Traduction
##########

Le comportement de traduction (*TranslateBehavior*) est en fait assez
simple à paramétrer et à faire fonctionner *out of the box*, le tout
avec très peu de configuration. Dans cette section, vous apprendrez
comment ajouter et configurer ce comportement, pour l'utiliser dans
n'importe quel modèle.

Si vous utilisez le comportement Translate en parallèle de Containable,
assurez-vous de définir la clé 'fields' pour vos requêtes. Sinon, vous
pourriez vous retrouver avec des fragments SQL générés invalides.

Initialiser les tables i18n
===========================

Vous pouvez soit utiliser la console CakePHP, soit les créer
manuellement. Il est recommandé d'utiliser la console pour cela, parce
qu'il pourrait arriver que le gabarit change dans les futures versions
de CakePHP. En restant fidèle à la console, cela garantira que vous ayez
le gabarit correct.

::

    ./cake i18n

Sélectionner ``[I]``, ce qui lancera le script d'initialisation de la
base de données i18n. Il vous sera demandé si vous voulez supprimer
toute base existante et si vous voulez en créer une. Répondez par oui si
vous êtes certain qu'il n'y a pas encore une table i18n et répondez
encore par oui pour créer la table.

Attacher le Comportement Translate à vos Modèles
================================================

Ajoutez-le à votre modèle en utilisant la propriété ``$actsAs`` comme
dans l'exemple suivant.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>

Ceci ne produira encore rien, parce qu'il faut un couple d'options avant
que que cela ne commence à fonctionner. Vous devez définir, quels champs
du modèle courant devront être détectés dans la table de traduction que
nous avons créée à la première étape.

Définir les Champs
==================

Vous pouvez définir les champs en étendant simplement la valeur
``'Translate'`` avec un autre tableau, comme çà :

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'champUn', 'champDeux', 'etc'
            )
        );
    }
    ?>

Après avoir fait cela (par exemple, en précisant "nom" comme l'un des
champs), vous avez déjà terminé la configuration de base. Super !
D'après notre exemple courant, le modèle devrait maintenant ressembler à
quelque chose comme çà :

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nom'
            )
        );
    }
    ?>

Conclusion
==========

A partir de maintenant, chaque mise à jour/création d'un enregistrement
fera que le TranslateBehavior copiera la valeur de "nom" dans la table
de traduction (par défaut : i18n), avec la locale courante. Une "locale"
est un identifiant de langue.

La *locale courante* est la valeur actuelle de
``Configure::read('Config.language')``. La valeur de *Config.language*
est assignée dans la Classe L10n - à moins qu'elle ne soit déjà définie.
Cependant, le Comportement Translate vous autorise à surcharger ceci à
la volée, ce qui permet à l'utilisateur de votre page de créer de
multiples versions sans avoir besoin de modifier ses préférences. Plus
d'information sur ce point dans la prochaine section.

Récupérer tous les enregistrements de traduction pour un champ
==============================================================

Si vous voulez avoir tous les enregistrements de traduction attachés à
l'enregistrement de modèle courant, vous étendez simplement le *tableau
champ* dans votre paramétrage du comportement, comme montré ci-dessous.
Vous êtes complètement libre de choisir le nommage.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nom' => 'nomTraduction'
            )
        );
    }
    ?>

Avec ce paramétrage, le résultat de votre find() devrait ressembler à
quelque chose comme çà :

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [nom] => Exemple d\'entrée 
                 [corps] => lorem ipsum...
                 [locale] => fr_fr
             )

         [nomTraduction] => Array
             (
                 [0] Array
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
                         [field] => nom
                         [content] => Exemple d'entrée
                     )

             )
    )

**Note** : L'enregistrement de modèle contient un champ *virtuel*
appelée "locale". Il indique quelle locale est utilisée dans ce
résultat.

Utiliser la méthode bindTranslation
-----------------------------------

Vous pouvez aussi récupérer toutes les traductions seulement quand vous
en avez besoin, en utilisant la méthode bindTranslation

``bindTranslation($fields, $reset)``

``$fields`` est un tableau associatif composé du champ et du nom de
l'association, dans lequel la clé est le champ traduisible et la valeur
est le nom fictif de l'association.

::

    $this->Post->bindTranslation(array ('nom' => 'nomTraduction'));
    $this->Post->find('all', array ('recursive'=>1)); // il est nécessaire d'avoir au moins un recursive à 1 pour que ceci fonctionne

Avec ce paramétrage, le résultat de votre find() devrait ressembler à
quelque chose comme çà :

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [nom] => Exemple d'entrée 
                 [corps] => lorem ipsum...
                 [locale] => fr_fr
             )

         [nomTraduction] => Array
             (
                 [0] Array
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
                         [field] => nom
                         [content] => Exemple d'entrée
                     )

             )
    )

Sauvegarder dans une autre langue
=================================

Vous pouvez forcer le modèle qui utilise le TranslateBehavior à
sauvegarder dans une autre langue que celle détectée.

Pour dire à un modèle dans quelle langue le contenu devra être sauvé,
changez simplement la valeur de la propriété ``$locale`` du modèle,
avant que vous ne sauvegardiez les données dans la base. Vous pouvez
faire çà dans votre contrôleur ou vous pouvez le définir directement
dans le modèle.

**Exemple A :** dans votre contrôleur

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // nous allons sauvegarder la version allemande
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

**Exemple B :** dans votre modèle

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nom'
            )
        );
        
        // Option 1) définir simplement la propriété directement
        var $locale = 'fr_fr';
        
        // Option 2) créer une méthode simple 
        function setLangue($locale) {
            $this->locale = $locale;
        }
    }
    ?>

Tables de traduction multiple
=============================

Si vous vous attendez à beaucoup d'entrées, vous vous demandez
probablement comment traiter une table qui grossit rapidement. Il y a
deux propriétés, introduites par le comportement Translate, qui
permettent de spécifier le "Modèle" à associer en tant que modèle
contenant les traductions.

Ce sont **$translateModel** et **$translateTable**.

Disons que nous voulons sauvegarder nos traductions pour tous les posts
dans la table "post\_i18ns", au lieu de la table par défaut "i18n". Pour
faire çà, vous avez besoin de configurer votre modèle comme ceci :

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nom'
            )
        );
        
        // Utiliser un modèle différent (et une table)
        var $translateModel = 'PostI18n';
    }
    ?>

**Important** : vous devez "pluraliser" le nom de la table. C'est
maintenant un modèle classique, qui peut être traité comme tel et qui,
par conséquent, dispose des conventions impliquées. Le schéma de table
lui-même doit être identique à celui généré par le script en mode
console de CakePHP. Pour être certain qu'il correspond, vous pouvez
simplement initialiser une table i18n vide en utilisant la console et
renommer la table après.

Créer le modèle de traduction
-----------------------------

Pour que cela fonctionne vous devez créer le fichier de l'actuel modèle
dans le dossier des modèles. La raison est qu'il n'y a pas de propriété
pour définir le *displayField* directement dans le modèle utilisant ce
comportement.

Assurez vous de changer le ``$displayField`` en ``'champ'``.

::

    <?php
    class PostI18n extends AppModel { 
        var $displayField = 'champ'; // Important
    }
    // Nom du fichier : post_i18n.php
    ?>

C'est tout ce qu'il faut. Vous pouvez aussi ajouter toutes les
propriétés des modèles comme $useTable. Mais pour une meilleure
cohérence nous pouvons faire cela dans le modèle qui utilise ce modèle
de traduction. C'est là que l'option ``$translateTable`` entre en jeu.

Modification d'une Table
------------------------

Si vous voulez changer le nom de la table, il vous suffit simplement de
définir $translateTable dans votre modèle, comme ceci :

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nom'
            )
        );
        
        // Utilise un Modèle différent
        var $translateModel = 'PostI18n';
        
        // Utilise une table différente pour translateModel
        var $translateTable = 'post_traductions';
    }
    ?>

A noter que **vous ne pouvez pas utiliser $translateTable seul**. Si
vous n'avez pas l'intention d'utiliser un ``$translateModel``
personnalisé, alors laissez cette propriété inchangée. La raison est
qu'elle casserait votre configuration et vous afficherait un message
"Missing Table" pour le modèle I18n par défaut, lequel est créé à
l'exécution.
