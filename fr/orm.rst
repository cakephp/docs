Models (Modèles)
################

Les Models sont les classes qui représentent la couche de logique dans votre
application. Cela signifie qu'ils sont responsables de la gestion de presque
tout ce qui concerne les données, leur validité, les interactions et
l'évolution du flux d'informations dans votre domaine de travail.

Dans CakePHP, le domaine d'application du model est séparé en 2 types d'objet
principaux. Les premiers sont des **repositories** ou **table objects**.
Ces objets fournissent un accès aux collections de données. Ils vous permettent
de sauvegarder de nouveaux enregistrements, de modifier/supprimer des
enregistrements existants, définir des relations et d'effectuer des informations
en vrac. Les seconds types d'objet sont des **entities**. Les Entities
représentent des enregistrements individuels et vous permettent de définir
des niveau de ligne/enregistrement (row/record level behavior) &
fonctionnalités.

L'ORM intégré dans CakePHP se spécialise dans les bases de données
relationnelles, mais peut être étendu pour supporter des sources de données
alternatives.

L'ORM de CakePHP emprunte des idées et concepts à la fois des patterns
de ActiveRecord et de Datamapper. Il a pour objectif de créer une implémentation
hybride qui combine les aspects des deux patterns pour créer un ORM rapide et
facile d'utilisation.

Avant de commencer à explorer ORM, assurez-vous de :ref:`configurer votre
connection à la base de données <database-configuration>`.

.. note::

    Si vous etes familier avec les versions précédentes de CakePHP, vous devriez
    lire :doc:`/appendices/orm-migration` pour voir les différences importantes
    entre CakePHP 3.0 et les versions anciennes de CakePHP.

Exemple rapide
==============

Pour commencer, vous n'avez à écrire aucun code. Si vous suivez les conventions
de CakePHP pour vos tables de base de données, vous pouvez simplement commencer
à utiliser l'ORM. Par exemple si vous voulez charger des données de la table
``articles``, vous pourriez faire::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    foreach ($query as $row) {
        echo $row->title;
    }

Notez que nous n'avons créé aucun code ou gérer aucune configuration. Les
conventions dans CakePHP nous permettent d'éviter un code bancal et permet au
framework d'inserer des classes de base lorsque votre application n'a pas créé
de classe concrète. Si nous voulions personnaliser notre classe ArticlesTable en
ajoutant des associations ou en définissant des méthodes supplémentaires, nous
ajouterions ce qui suit dans ``App/Model/Repository/ArticlesTable.php``::

    <?php
    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

    }

Les classes de Table utilisent la version CamelCased du nom de la table avec le
suffix ``Table`` en nom de classe. Une fois que votre classe a été créée vous
obtenez une référence pour elle en utilisant
:php:class:`~Cake\\ORM\\TableRegistry` comme avant::

    use Cake\ORM\TableRegistry;
    // Maintenant $articles est une instance de notre classe ArticlesTable.
    $articles = TableRegistry::get('Articles');

Maintenant que nous avons une classe de table concrète, nous allons
probablement vouloir utiliser une classe entity concrète. Les classes Entity
vous laissent définir les méthodes accesseurs et mutateurs, définissent la
logique personnalisée pour des enegistrements individuels et plus encore. Nous
commencerons par ajouter ce qui suit à ``App/Model/Entity/Article.php``::

    <?php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {

    }

Les Entities utilisent la version CamelCase du nom de la table comme nom de
classe par défaut. Maintenant que nous avons créé notre classe entity, quand
nous chargeons les entities de la base de données, nous obtenons les instances
de notre nouvelle classe Article::

    use Cake\ORM\TableRegistry;

    // Maintenant une instance de ArticlesTable.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
        // Chaque ligne est maintenant une instance de notre classe Article.
        echo $row->title;
    }

CakePHP utilise les conventions de nommage pour lier ensemble les classes Table
et Entity. Si vous avez besoin de personnaliser l'entity qu'une table utilise,
vous pouvez utiliser la méthode ``entityClass()`` pour définir un nom de
classe spécifique.

Regardez les chapitres sur :ref:`table-objects` et :ref:`entities` pour plus
d'informations sur la façon d'utiliser les objets de table et les entities dans
votre application.

Pour en savoir plus sur les Models
==================================

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/table-objects
    orm/entities
    orm/behaviors
    orm/query-builder
    orm/schema-system


.. meta::
    :title lang=fr: Models (Modèles)
    :keywords lang=fr: flux d'informations,fichier csv,programmation orientée objet,classe de modèle,classes de modèle,définition de modèle,modèle interne,modèle du coeur,déclaration simple,modèle application,classe php,table de base de données,modèle de données,accès aux données,web externe,héritage,différentes façons,validité,fonctionnalité,requêtes
