Mise à Niveau des Fixtures
##########################

À partir de la version 4.3.0, le schéma de fixture et les responsabilités de
gestion des données sont scindés.
Maintenir le schéma dans les classes de fixtures et les migrations rajoutait de
la complexité et un coût de maintenance pour les applications. Dans 4.3.0, de
nouvelles APIs ont été ajoutées pour permettre de réutiliser plus facilement les
migrations existantes ou des outils de gestion de schéma avec des tests.

Pour mettre à niveau vers le nouveau système de fixtures, vous devrez faire
quelques mises à jour:

#. Tout d'abord, enlevez le bloc ``<listeners>`` de votre fichier
   ``phpunit.xml``.
#. Ajoutez ceci à votre fichier ``phpunit.xml``::

        <extensions>
            <extension class="\Cake\TestSuite\Fixture\PHPUnitExtension" />
        </extensions>

   Cela enlève la gestion de schéma du gestionnaire de fixture de test. À la
   place, votre application a besoin de créer/mettre à jour le schéma au début
   de chaque test.
#. Ensuite, mettez à jour ``tests/boostrap.php`` pour créer le schéma. Il y a
   plusieurs façons de créer le schéma. Consultez
   :ref:`creating-test-database-schema` pour les méthodes fournies par CakePHP.
#. Puis supprimez toutes les propriétés ``$fields`` et ``$import`` de vos
   fixtures. Ces propriétés ne sont plus utilisées dans le nouveau système de
   fixture.

Vos tests devraient continuer à passer, et vous pouvez essayer avec
:ref:`fixture-state-management`. ``TransactionStrategy`` qui apporte des
gains de performance significatifs. La contrepartie est qu'avec
``TransactionStrategy``, vos valeurs auto-incrémentées ne commenceront plus
à 1 à chaque test.

Documentation des Anciennes Fixture
===================================

La documentation suivante s'applique uniquement aux fixtures basées sur des
listeners, ce qui était par défaut avant 4.3.0.

.. _fixture-schema:

Schéma de Fixture
-----------------

Nous utilisons ``$fields`` pour spécifier quels champs feront partie de cette
table, et comment ils sont définis. Le format utilisé pour définir les champs
est le même que celui de :php:class:`Cake\\Database\\Schema\\Table`. Les clés
disponibles pour la définition de la table sont:

type
    Type de données interne à CakePHP. Actuellement supportés:

    - ``string``: mappe ``VARCHAR``
    - ``char``: mappe ``CHAR``
    - ``uuid``: mappe ``UUID``
    - ``text``: mappe ``TEXT``
    - ``integer``: mappe ``INT``
    - ``biginteger``: mappe ``BIGINTEGER``
    - ``decimal``: mappe ``DECIMAL``
    - ``float``: mappe ``FLOAT``
    - ``datetime``: mappe ``DATETIME``
    - ``datetimefractional``: mappe ``DATETIME(6)`` or ``TIMESTAMP``
    - ``timestamp``: mappe ``TIMESTAMP``
    - ``timestampfractional``: mappe ``TIMESTAMP(6)`` or ``TIMESTAMP``
    - ``time``: mappe ``TIME``
    - ``date``: mappe ``DATE``
    - ``binary``: mappe ``BLOB``
length
    La longueur spécifique que le champ devrait avoir.
precision
    Le nombre de décimales utilisées pour les champs float & decimal.
null
    Soit ``true`` (pour autoriser les valeurs NULLs), soit ``false`` (pour les
    interdire NULLs).
default
    La valeur par défaut pour le champ.

Importer les Informations de la Table
-------------------------------------

Il peut devenir vraiment délicat de définir le schéma dans les fichiers de
fixture quand vous créez des plugins, ou des bibliothèques, ou si vous créez des
applications qui doivent pouvoir être portées entre plusieurs logiciels de bases
de données.Dans de grandes applications, il peut être difficile de maintenir la
redéfinition du schéma dans les fixtures. Pour ces raisons, CakePHP propose
d'importer le schéma depuis une connexion existante et d'utiliser les
fonctionnalités de réflexion pour obtenir la définition de la table, et créer la
définition de table qui sera utilisée dans les tests.

Prenons un exemple. Supposons que nous avons une table nommée articles, et
changeons de la façon suivante la fixture d'exemple donnée dans la section
précédente (**tests/Fixture/ArticlesFixture.php**)::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
    }

Si vous voulez utiliser une autre connexion, utilisez::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

Généralement, vous avez une classe Table parallèlement à votre fixture. Vous
pouvez donc vous en servir pour récupérer le nom de la table::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['model' => 'Articles'];
    }

Cela supporte aussi la syntaxe de plugin.

Vous pouvez bien entendu importer la définition de votre table depuis un modèle
ou une table existants, mais avoir vos enregistrements définis directement sur
la fixture, comme montré dans la précédente section. Par exemple::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
        public $records = [
            [
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'modified' => '2007-03-18 10:41:31'
            ],
            [
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'modified' => '2007-03-18 10:43:31'
            ],
            [
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'modified' => '2007-03-18 10:45:31'
            ]
        ];
    }

Pour finir, il est aussi possible de ne pas charger ni créer de schéma dans la
fixture. C'est utile si vous avez déjà une configuration de base de données de
test avec toutes les tables vides déjà créées. Si ni ``$fields`` ni ``$import``
ne sont définis, une fixture se contentera d'insérer ses enregistrements et de
tronquer les enregistrements à chaque méthode de test.
