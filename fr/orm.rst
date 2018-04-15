Accès Base de Données & ORM
###########################

La manipulation de données de la base de donnés dans CakePHP est réalisée
avec deux types d'objets principaux. Les premiers sont des **repositories** ou
**table objects**.
Ces objets fournissent un accès aux collections de données. Ils vous permettent
de sauvegarder de nouveaux enregistrements, de modifier/supprimer des
enregistrements existants, définir des relations et d'effectuer des opérations
en masse. Les seconds types d'objets sont les **entities**. Les Entities
représentent des enregistrements individuels et vous permettent de définir
des comportements et des fonctionnalités au niveau des lignes/enregistrements.

Ces deux classes sont habituellement responsables de la gestion de presque
tout ce qui concerne les données, leur validité, les interactions et
l’évolution du flux d’informations dans votre domaine de travail.

L'ORM intégré dans CakePHP se spécialise dans les bases de données
relationnelles, mais peut être étendu pour supporter des sources de données
alternatives.

L'ORM de CakePHP emprunte des idées et concepts à la fois des patterns
de ActiveRecord et de Datamapper. Il a pour objectif de créer une implémentation
hybride qui combine les aspects des deux patterns pour créer un ORM rapide et
facile d'utilisation.

Avant de commencer à explorer l'ORM, assurez-vous de :ref:`configurer votre
connexion à la base de données <database-configuration>`.

.. note::

    Si vous êtes familier avec les versions précédentes de CakePHP, vous devriez
    lire le :doc:`/appendices/orm-migration` pour voir les différences
    importantes entre CakePHP 3.0 et les versions antérieures de CakePHP.

Exemple Rapide
==============

Pour commencer, vous n'avez à écrire aucun code. Si vous suivez les
:ref:`conventions de CakePHP pour vos tables de base de données <model-and-database-conventions>`,
vous pouvez simplement commencer à utiliser l'ORM. Par exemple si vous voulez
charger des données de la table ``articles``, vous pourriez faire::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

    $query = $articles->find();

    foreach ($query as $row) {
        echo $row->title;
    }

Notez que nous n'avons créé aucun code ou généré aucune configuration. Les
conventions dans CakePHP nous permettent d'éviter un code bancal et permettent au
framework d'insérer des classes de base lorsque votre application n'a pas créé
de classe concrète. Si nous voulions personnaliser notre classe ArticlesTable en
ajoutant des associations ou en définissant des méthodes supplémentaires, nous
ajouterions ce qui suit dans **src/Model/Table/ArticlesTable.php** après la
balise d'ouverture ``<?php``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

Les classes de Table utilisent la version CamelCased du nom de la table avec le
suffixe ``Table`` en nom de classe. Une fois que votre classe a été créée vous
obtenez une référence vers celle-ci en utilisant
:php:class:`~Cake\\ORM\\TableRegistry` comme avant::

    use Cake\ORM\TableRegistry;

    // Maintenant $articles est une instance de notre classe ArticlesTable.
    $articles = TableRegistry::get('Articles');

Maintenant que nous avons une classe de table concrète, nous allons
probablement vouloir utiliser une classe entity concrète. Les classes Entity
vous laissent définir les méthodes accesseurs et mutateurs, définissant la
logique personnalisée pour des enregistrements individuels et plus encore. Nous
commencerons par ajouter ce qui suit à **src/Model/Entity/Article.php** après la
balise d'ouverture ``<?php``::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

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

CakePHP utilise des conventions de nommage pour lier ensemble les classes Table
et Entity. Si vous avez besoin de personnaliser l'entity qu'une table utilise,
vous pouvez utiliser la méthode ``entityClass()`` pour définir un nom de
classe spécifique.

Regardez les chapitres sur :doc:`/orm/table-objects` et :doc:`/orm/entities`
pour plus d'informations sur la façon d'utiliser les objets table et les
entities dans votre application.

Pour en savoir plus sur les Models
==================================

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/associations
    orm/behaviors
    orm/schema-system
    console-and-shells/schema-cache
