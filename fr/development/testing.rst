Testing
#######

CakePHP fournit un support de test intégré compréhensible. CakePHP
permet l'intégration de `PHPUnit <http://phpunit.de>`_. En plus de toutes
les fonctionnalités offertes par PHPUnit, CakePHP offre quelques
fonctionnalités supplémentaires pour faciliter le test. Cette section va
couvrir l'installation de PHPUnit, comment commencer avec le Test Unitaire,
et comment vous pouvez utiliser les extensions que CakePHP offre.

Installer PHPUnit
=================

CakePHP utilise PHPUnit as its underlying test framework. PHPUnit est le
standard de-facto pour le test unitaire dans PHP. Il offre un ensemble de
fonctionnalités profondes et puissantes pour s'assurer que votre code fait
ce que vous pensez qu'il doit faire. PHPUnit peut être installé avec
le `PHAR package <http://phpunit.de/#download>`_ ou avec
`Composer <http://getcomposer.org>`_.

Installer PHPUnit avec Composer
-------------------------------

Pour installer PHPUnit avec Composer, ajoutez ce qui suit à la section
``require`` de votre application dans son ``composer.json``::

    "phpunit/phpunit": "*",

Après avoir mis à jour votre package.json, lancez à nouveau Composer dans votre
répertoire d'application::

    $ php composer.phar install

Vous pouvez maintenant lancer PHPUnit en utilisant::

    $ vendor/bin/phpunit

Utiliser le fichier PHAR
------------------------

Après avoir téléchargé le fichier ``phpunit.phar``, vous pouvez l'utiliser pour
lancer vos tests::

    php phpunit.phar

Tester la Configuration de la Base de Données
=============================================

Souvenez-vous qu'il faut avoir un niveau de debug d'au moins 1 dans votre
fichier ``config/app.php`` avant de lancer des tests. Les tests ne sont
pas accessibles via le navigateur quand le debug est égal à 0. Avant de lancer
des tests, vous devrez vous assurer d'ajouter une configuration de base de
données ``test`` dans ``config/app.php``. Cette configuration est utilisée
par CakePHP pour les tables fixture et les données::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'login' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database'
        ],
    ],

.. note::

    C'est une bonne idée de faire une base de données de test différente de
    votre base de données actuelle. Cela évitera toute erreur embarrassante
    pouvant arriver plus tard.

Vérifier la Configuration Test
==============================

Après avoir installé PHPUnit et configuré le ``test`` de la configuration de
la base de données, vous pouvez vous assurer que vous êtes prêt à écrire et
lancer vos propres tests en lancant un de ceux présents dans le coeur::

    // Pour un PHPunit installé sur l'ensemble du système
    $ phpunit

    // Pour phpunit.phar
    $ php phpunit.phar

    // Pour un PHPUnit installé avec Composer
    $ vendor/bin/phpunit

Ce qui est au-dessus va lancer tous les tests que vous avez, ou vous indiquer
qu'aucun test n'a été lancé. Pour lancer un test spécifique, vous pouvez fournir
le chemin au test en paramètre de PHPUnit. Par exemple, si vous aviez un cas
de test pour la classe ArticlesTable, vous pourriez le lancer avec::

    $ phpunit Test/TestCase/Model/Table/ArticlesTableTest

Vous devriez voir une barre verte avec quelques informations supplémentaires sur
les tests executés et le nombre qui a été passé.

.. note::

    Si vous êtes sur un système windows, vous ne verrez probablement pas les
    couleurs.

Conventions des cas de Test
===========================

Comme beaucoup de choses dans CakePHP, les cas de test ont quelques
conventions. En ce qui concerne les tests:

#. Les fichiers PHP contenant les tests devraient être dans votre répertoire
   ``tests/Case/[Type]``.
#. Les noms de fichier de ces fichiers devraient finir avec ``Test.php`` à la
   place de .php.
#. Les classes contenant les tests devraient étendre ``Cake\TestSuite\TestCase``,
   ``Cake\TestSuite\ControllerTestCase`` ou ``\PHPUnit_Framework_TestCase``.
#. Comme les autres noms de classe, les noms de classe des cas de test doivent
   correspondre au nom de fichier. ``RouterTest.php`` doit contenir
   ``class RouterTest extends TestCase``.
#. Le nom de toute méthode contenant un test (par ex: contenant une assertion)
   devrait commencer par ``test``, comme dans ``testPublished()``.
   Vous pouvez aussi utiliser l'annotation ``@test`` pour marquer les méthodes
   en méthodes de test.

Créer Votre Premier Cas de Test
===============================

Dans l'exemple suivant, nous allons créer un cas de test pour une méthode de
helper très simple. Le helper que nous allons tester sera formaté en progress
bar HTML. Notre helper ressemblera à cela::

    namespace App\View\Helper;

    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

C'est un exemple très simple, mais ce sera utile pour montrer comment vous
pouvez créer un cas de test simple. Après avoir créer et sauvegardé notre
helper, nous allons créer le fichier de cas de tests dans
``tests/TestCase/View/Helper/ProgressHelperTest.php``. Dans ce fichier, nous
allons commencer avec ce qui suit::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\Controller\Controller;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase {
        public function setUp() {

        }

        public function testBar() {

        }
    }

Nous compléterons ce squelette dans une minute. Nous avons ajouté deux
méthodes pour commencer. Tout d'abord ``setUp()``. Cette méthode est
appelée avant chaque méthode de *test* dans une classe de cas de test.
Les méthodes de configuration devraient initialiser les objets souhaités
pour le test, et faire toute configuration souhaitée. Dans notre configuration
nous ajouterons ce qui suit::

    public function setUp() {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

Appeler la méthode parente est importante dans les cas de test, puisque
TestCase::setUp() fait un nombre de choses comme fabriquer les valeurs
dans :php:class:`~Cake\\Core\\Configure` et stocker les chemins dans
:php:class:`~Cake\\Core\\App`.

Ensuite, nous allons remplir les méthodes de test. Nous utiliserons quelques
assertions pour nous assurer que notre code crée la sortie que nous attendions::

    public function testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

Le test ci-dessus est simple mais montre le bénéfice potentiel de l'utilisation
des cas de test. Nous utilisons ``assertContains()`` pour nous assurer que
notre helper retourne une chaîne qui contient le contenu que nous attendons.
Si le résultat ne contient pas le contenu attendu le test serait un échec, et
saurait que notre code est incorrect.

En utilisant les cas de test, vous pouvez facilement décrire la relation entre
un ensemble d'entrées connus et leur sortie attendue. Cela vous aide à être
plus confiant sur le code que vous écrivez puisque vous pouvez facilement
vérifier que le code que vous écrivez remplit les attentes et les assertions
que vos tests font. De plus, puisque les tests sont du code, ils peuvent
facilement être re-lancés dès que vous faîtes un changement. Cela évite
la création de nouveaux bugs.

.. _running-tests:

Lancer les Tests
================

Une fois que vous avez installé PHPUnit et que quelques cas de tests sont
écrits, vous voudrez lancer les cas de test très fréquemment. C'est une
bonne idée de lancer les tests avant de committer tout changement pour aider
à s'assurer que vous n'avez rien cassé.

En utilisant ``phpunit``, vous pouvez lancer votre application et les tests de
plugin. Pour lancer vos tests d'application, vous pouvez simplement lancer::

    $ phpunit

A partir du répertoire racine de votre application. Pour lancer les tests pour
les plugin, faîtes d'abord ``cd`` vers le répertoire du plugin, et ensuite
utilisez ``phpunit`` pour lancer les tests.

.. note::

    Si vous lancez des tests qui intéragissent avec la session, c'est
    généralement une bonne idée d'utiliser l'option ``--stderr``. Cela va régler
    des problèmes avec les tests en échec à cause des avertissements
    headers_sent.

Filtrer les cas de test
-----------------------

Quand vous avez des cas de test plus larges, vous voulez souvent lancer
un sous-ensemble de méthodes de test quand vous essayez de travailler sur un
cas unique d'échec. Avec l'exécuteur cli vous pouvez utiliser une option pour
filtrer les méthodes de test::

    $ phpunit --filter testSave Test/TestCase/Model/Table/ArticlesTableTest

Le paramètre filter est utilisé commme une expression régulière sensible à la
casse pour filtrer les méthodes de test à lancer.

Générer une couverture de code
------------------------------

Vous pouvez générer un rapport de couverture de code à partir d'une ligne de
commande en utilisant les outils de couverture de code intégrés dans PHPUnit.
PHPUnit va générer un ensemble de fichiers en HTML statique contenant les
résultats de la couverture. Vous pouvez générer une couverture pour un cas de
test en faisant ce qui suit::

    $ phpunit --coverage-html webroot/coverage Test/TestCase/Model/Table/ArticlesTableTest

Cela mettra la couverture des résultats dans le répertoire webroot de votre
application. Vous pourrez voir les résultats en allant à
``http://localhost/votre_app/coverage``.

Lancer les tests qui utilisent des sessions
-------------------------------------------

Quand vous lancez des tests en ligne de commande qui utilisent des sessions,
vous devrez inclure le flag ``--stderr``. Ne pas le faire ne fera pas
fonctionner les sessions. PHPUnit outputs test progress to stdout par défaut,
cela entraine le fait que PHP suppose que les headers ont été envoyés ce qui
empêche les sessions de démarrer. En changeant PHPUnit pour qu'il affiche avec
stderr, ce problème sera évité.

Combiner les Suites de Test pour les plugins
--------------------------------------------

Often times your application will be composed of several plugins. In these
situations it can be pretty tedious to run tests for each plugin. You can make
running tests for each of the plugins that compose your application by adding
additional ``<testsuite>`` sections to your application's ``phpunit.xml`` file::

    <testsuites>
        <testsuite name="App Test Suite">
            <directory>./Test/TestCase</directory>
        </testsuite>

        <!-- Add your plugin suites -->
        <testsuite name="Forum plugin">
            <directory>./plugins/Forum/Test/TestCase</directory>
        </testsuite>
    </testsuites>

Any additional test suites added to the ``<testsuites>`` element will
automatically be run when you use ``phpunit``.

Les Callbacks du Cycle de vie des cas de Test
=============================================

Les cas de Test ont un certain nombre de callbacks de cycle de vue que vous
pouvez utiliser quand vous faîtes les tests:

* ``setUp`` est appelé avant chaque méthode de test. Doit être utilisé pour
  créer les objets qui vont être testés, et initialiser toute donnée pour le
  test. Toujours se rappeler d'appeler ``parent::setUp()``.
* ``tearDown`` est appelé après chaque méthode de test. Devrait être utilisé
  pour nettoyer une fois que le test est terminé. Toujours se rappeler
  d'appeler ``parent::tearDown()``.
* ``setupBeforeClass`` est appelé une fois avant que les méthodes de test
  aient commencées dans un cas.
  Cette méthode doit être *statique*.
* ``tearDownAfterClass`` est appelé une fois après que les méthodes de test
  ont commencé dans un cas.
  Cette méthode doit être *statique*.

.. _test-fixtures:

Fixtures
========

Quand on teste du code qui dépend de models et d'une base de données, on
peut utiliser les **fixtures** comme une façon de générer
temporairement des tables de données chargées avec des données d'exemple
qui peuvent être utilisées par le test. Le bénéfice de l'utilisation de
fixtures est que votre test n'a aucune chance d'abimer les données
de l'application qui tourne. De plus, vous pouvez commencer à tester
votre code avant dee développer réellement en live le contenu pour
une application.

CakePHP utilise la connection nommée ``test`` dans votre fichier de
configuration ``config/datasources.php`` Si la connection n'est pas
utilisable, une exception sera levée et vous ne serez pas capable
d'utiliser les fixtures de la base de données.

CakePHP effectue ce qui suit pendant le chemin d'une fixture basée sur un cas
de test:

#. Crée les tables pour chacun des fixtues necéssaires.
#. Remplit les tables avec les données, si les données sont fournis dans la fixture.
#. Lance les méthodes de test.
#. Vide les tables de fixture.
#. Retire les tables de fixture de la base de données.

Test Connections
----------------

By default CakePHP will alias each connection in your application. Each
connection defined in your application's bootstrap that does not start with
``test_`` will have a ``test_`` prefixed alias created. Aliasing connections
ensures, you don't accidentally use the wrong connection in test cases.
Connection aliasing is transparent to the rest of your application. For example
if you use the 'default' connection, instead you will get the ``test``
connection in test cases. If you use the 'replica' connection, the test suite
will attempt to use 'test_replica'.

Créer les fixtures
------------------

A la création d'une fixture, vous pouvez définir principalement deux choses:
comment la table est créée (quels champs font parti de la table), et quels
enregistrements seront remplis initialement dans la table. Créons notre
première fixture, qui sera utilisée pour tester notre propre model Article.
Crée un fichier nommé ``ArticleFixture.php`` dans votre répertoire
``tests/Fixture`` avec le contenu suivant::

    namespace App\Test\Fixture;

    use Cake\Test\TestFixture;

    class ArticleFixture extends TestFixture {

          // Optional. Set this property to load fixtures to a different test datasource
          public $connection = 'test';

          public $fields = [
              'id' => ['type' => 'integer'],
              'title' => ['type' => 'string', 'length' => 255, 'null' => false],
              'body' => 'text',
              'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
              'created' => 'datetime',
              'updated' => 'datetime',
              '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']]
              ]
          ];
          public $records = [
              [
                  'id' => 1,
                  'title' => 'First Article',
                  'body' => 'First Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:39:23',
                  'updated' => '2007-03-18 10:41:31'
              ],
              [
                  'id' => 2,
                  'title' => 'Second Article',
                  'body' => 'Second Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:41:23',
                  'updated' => '2007-03-18 10:43:31'
              ],
              [
                  'id' => 3,
                  'title' => 'Third Article',
                  'body' => 'Third Article Body',
                  'published' => '1',
                  'created' => '2007-03-18 10:43:23',
                  'updated' => '2007-03-18 10:45:31'
              ]
          ];
     }

La propriété ``$connection`` définit la source de données que la fixture
va utiliser. Si votre application utilise plusieurs sources de données, vous
devriez faire correspondre les fixtures avec les sources de données du model,
mais préfixé avec ``test_``.
Par exemple, si votre model utilise la source de données ``mydb``, votre
fixture devra utiliser la source de données ``test_mydb``. Si la connexion
``test_mydb`` n'existe pas, vos models vont utiliser la source de données
``test`` par défaut. Les sources de données de fixture doivent être préfixées
par ``test`` pour réduire la possibilité de trucher accidentellement toutes
les données de votre application quand vous lancez des tests.

Nous utilisons ``$fields`` pour spécifier les champs qui feront parti de cette
table, et comment ils sont définis. Le format utilisé pour définir ces champs
est le même qu'utilisé avec :php:class:`CakeSchema`. Les clés disponibles pour
la définition de la table sont:

``type``
    Type de données interne à CakePHP. Actuellement supportés:
    - ``string``: redirige vers ``VARCHAR``.
    - ``uuid``: redirige vers ``UUID``
    - ``text``: redirige vers ``TEXT``.
    - ``integer``: redirige vers ``INT``.
    - ``biginteger``: redirige vers ``BIGINTEGER``
    - ``decimal``: redirige vers ``DECIMAL``
    - ``float``: redirige vers ``FLOAT``.
    - ``datetime``: redirige vers ``DATETIME``.
    - ``timestamp``: redirige vers ``TIMESTAMP``.
    - ``time``: redirige vers ``TIME``.
    - ``date``: redirige vers ``DATE``.
    - ``binary``: redirige vers ``BLOB``.
fixed
    Used with string types to create CHAR columns in platforms that support
    them. Also used to force UUID types in Postgres when the length is also 36.
length
    Défini à la longueur spécifique que le champ doit prendre.
precision
    Set the number of decimal places used on float & decimal fields.
null
    Défini soit à ``true`` (pour permettre les NULLs) soit à ``false`` (pour
    ne pas permettre les NULLs).
default
    Valeur par défaut que le champ prend.

Nos pouvons définir un ensemble d'enregistrements qui seront remplis après que
la table de fixture est crée. Le format est directement fairly forward,
``$records`` est un tableau d'enregistrements. Chaque item dans ``$records``
devrait être une unique ligne. A l'intérieur de chaque ligne, il devrait y
avoir un tableau associatif des colonnes et valeurs pour la ligne. Gardez juste
à l'esprit que chaque enregistrement dans le tableau $records doit avoir une
clé pour **chaque** champ spécifié dans le tableau ``$fields``. Si un champ
pour un enregistrement particulier a besoin d'avoir une valeur ``null``,
spécifiez juste la valeur de cette clé à ``null``.

Les données dynamiques et les fixtures
--------------------------------------

Depuis que les enregistrements pour une fixture sont déclarées en propriété
de classe, vous ne pouvez pas facilement utiliser les fonctions ou autres
données dynamiques pour définir les fixtures. Pour résoudre ce problème,
vous pouvez définir ``$records`` dans la fonction init() de votre fixture. Par
exemple, si vous voulez tous les timestamps crées et mis à jours pour
refléter la date d'aujourd'hui, vous pouvez faire ce qui suit::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticleFixture extends TestFixture {

        public $fields = [
            'id' => ['type' => 'integer'],
            'title' => ['type' => 'string', 'length' => 255, 'null' => false],
            'body' => 'text',
            'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
            'created' => 'datetime',
            'updated' => 'datetime',
            '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']],
            ]
        ];

        public function init() {
            $this->records = [
                [
                    'id' => 1,
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'updated' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

Quand vous surchargez ``init()``, rappelez-vous juste de toujours appeler
``parent::init()``.

Importer les informations de table et les enregistrements
---------------------------------------------------------

Votre application peut avoir déjà des models travaillant avec des données
réelles associées à eux, et vous pouvez décider de tester votre application
avec ces données. Ce serait alors un effort dupliqué pour avoir à définir
une définition de table et/ou des enregistrements sur vos fixtures.
Heureusement, il y a une façon pour vous de définir cette définition de
table et/ou d'enregistrements pour une fixture particulière venant d'un
model existant ou d'une table existante.

Commençons par un exemple. Imaginons que vous ayez un model nommé Article
disponible dans votre application (qui est lié avec une table nommée
articles), on changerait le fixture donné dans la section précédente
(``tests/Fixture/ArticleFixture.php``) en ce qui suit::

    class ArticleFixture extends TestFixture {
        public $import = ['table' => 'articles']
    }

Si vous voulez utiliser une autre connection, utilisez::

    class ArticleFixture extends TestFixture {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

Vous pouvez naturellement importer la définition de votre table à partir d'un
model/d'une table existante, mais vous avez vos enregistrements directement
définis dans le fixture comme il a été montré dans la section précédente.
Par exemple::

    class ArticleFixture extends TestFixture {
        public $import = ['table' => 'articles'];
        public $records = [
            [
              'id' => 1,
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'updated' => '2007-03-18 10:41:31'
            ],
            [
              'id' => 2,
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'updated' => '2007-03-18 10:43:31'
            ],
            [
              'id' => 3,
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'updated' => '2007-03-18 10:45:31'
            ]
        ];
    }

Finally, you can not load/create any schema in a fixture. This is useful if you
already have a test database setup with all the empty tables created. By
defining neither ``$fields`` or ``$import`` a fixture will only insert its
records and truncate the records on each test method.

Charger les fixtures dans vos cas de test
-----------------------------------------

Après avoir créé vos fixtures, vous voudrez les utiliser dans vos cas de test.
Dans chaque cas de test vous devriez charger les fixtures dont vous aurez
besoin. Vous devriez charger une fixture pour chaque model qui aura une requête
lancée contre elle. Pour charger les fixtures, vous définissez la propriété
``$fixtures`` dans votre model::

    class ArticleTest extends TestCase {
        public $fixtures = ['app.article', 'app.comment'];
    }

Ce qui est au-dessus va charger les fixtures d'Article et de Comment à partir
du répertoire de fixture de l'application. Vous pouvez aussi charger les
fixtures à partir du coeur de CakePHP ou des plugins::

    class ArticlesTest extends TestCase {
        public $fixtures = ['plugin.debug_kit.article', 'core.comment'];
    }

Utiliser le préfixe ``core`` va charger les fixtures à partir de CakePHP, et
utiliser un nom de plugin en préfixe chargera le fixture à partir d'un plugin
nommé.

Vous pouvez contrôler quand vos fixtures sont chargés en configurant
:php:attr:`Cake\\TestSuite\\TestCase::$autoFixtures` à ``false`` et plus tard
les charger en utilisant :php:meth:`Cake\\TestSuite\\TestCase::loadFixtures()`::

    class ArticlesTest extends TestCase {
        public $fixtures = ['app.article', 'app.comment'];
        public $autoFixtures = false;

        public function testMyFunction() {
            $this->loadFixtures('Article', 'Comment');
        }
    }

Vous pouvez charger les fixtures dans les sous-répertoires.
Utiliser plusieurs répertoires peut faciliter l'organisation de vos fixtures si
vous avez une application plus grande. Pour charger les fixtures dans les
sous-répertoires, incluez simplement le nom du sous-répertoire dans le nom de
la fixture::

    class ArticlesTest extends CakeTestCase {
        public $fixtures = ['app.blog/article', 'app.blog/comment'];
    }

Dans l'exemple ci-dessus, les deux fixtures seront chargés à partir de
``tests/Fixture/blog/``.

Tester les Models
=================

Disons que nous avons déjà notre table Articles définie dans
``src/Model/Table/ArticlesTable.php``, qui ressemble à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table {

        public function findPublished(Query $query, array $options) {
            $query->where([
                $this->alias() . '.published' => 1
            ]);
            return $query;
        }
    }

Nous voulons maintenant configurer un test qui va utiliser la définition du
model, mais à travers les fixtures, pour tester quelques fonctionnalités dans
le model. Le test suite de CakePHP charge un petit ensemble minimum de fichiers
(pour garder les test isolés), ainsi nous devons commencer par charger notre
model - dans ce cas le model Article que nous avons déjà défini.

Créons maintenant un fichier nommé ``ArticlesTableTest.php`` dans notre
répertoire ``tests/TestCase/Model/Table``, avec les contenus suivants::

    namespace App\Test\TestCase\Model\Table;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticleTest extends TestCase {
        public $fixtures = ['app.article'];
    }

Dans notre variable de cas de test ``$fixtures``, nous définissons l'ensemble
des fixtures que nous utiliserons. Vous devriez vous rappeler d'inclure tous
les fixtures qui vont avoir des requêtes lancées contre elles.

Créer une méthode de test
-------------------------

Ajoutons maintenant une méthode pour tester la fonction published() dans le
model Article. Modifions le fichier
``tests/TestCase/Model/Table/ArticlesTableTest.php`` afin qu'il ressemble
maintenant à ceci::

    namespace App\Test\TestCase\Model\Table;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticleTest extends TestCase {
        public $fixtures = ['app.article'];

        public function setUp() {
            parent::setUp();
            $this->Articles = TableRegistry::get('Articles');
        }

        public function testFindPublished() {
            $query = $this->Articles->find('published');
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->hydrate(false)->toArray();
            $expected = [
                ['id' => 1, 'title' => 'First Article'],
                ['id' => 2, 'title' => 'Second Article'],
                ['id' => 3, 'title' => 'Third Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

Vous pouvez voir que nous avons ajouté une méthode appelée ``testPublished()``.
Nous commençons par créer une instance de notre model ``Article``, et lançons
ensuite notre méthode ``published()``. Dans ``$expected``, nous définissons
ce que nous en attendons, ce qui devrait être le résultat approprié (que nous
connaissons depuis que nous avons défini quels enregistrements sont remplis
initialement dans la table articles.). Nous testons que les résultats
correspondent à nos attentes en utilisant la méthode ``assertEquals``.
Regarder la section sur les :ref:`running-tests` pour plus d'informations
sur la façon de lancer les cas de test.

Méthodes de Mocking des models
------------------------------

Il y aura des fois où vous voudrez mock les méhodes sur les models quand vous
les testez. Vous devrez utiliser ``getMockForModel`` pour créer les mocks de
test des models. Cela évite des problèmes avec les reflected properties that
normal mocks have::

    public function testSendingEmails() {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

Test d'intégrations des Controllers
======================

Alors que vous pouvez tester les controller de la même manière que les Helpers,
Models et Components, CakePHP offre une classe spécialisée ``IntegrationTestCase``.
L'utilisation de cette classe en tant que classe de base pour les cas de test de
votre controller vous permet de mettre plus facilement en place des tests
d'intégration pour vos controllers.

Si vous n'êtes pas familiés avec les tests d'intégrations, il s'agit d'une 
approche de test qui rend facile à tester plusieurs éléments en même temps. Les 
fonctionnalités de test d'intégration dans CakePHP simule une requête HTTP à 
traiter par votre application. Par exemple, tester vos controllers impactera 
les Models, Components et Helpers qui auraient été invoqués suite à une requête
HTTP. Cela vous permet d'écrire des tests au plus haut niveau de votre
application en impactant sur chacun de ses travaux.

Disons que vous avez un controller typique Articles, et son model
correspondant. Le code du controller ressemble à ceci::

    namespace App\Controller;

    use App\Controller\AppController;
    
    class ArticlesController extends AppController {
        public $helpers = ['Form', 'Html'];

        public function index($short = null) {
            if (!empty($this->request->data)) {
                $article = $this->Articles->newEntity($this->request->data);
                $this->Articles->save($article);
            }
            if (!empty($short)) {
                $result = $this->Article->find('all', [
                    'fields' => ['id', 'title']
                ]);
            } else {
                $result = $this->Article->find();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

Créez un fichier nommé ``ArticlesControllerTest.php`` dans votre répertoire
``tests/TestCase/Controller`` et mettez ce qui suit à l'intérieur::

    namespace App\Test\TestCase\Controller;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\IntegrationTestCase;

    class ArticlesControllerTest extends IntegrationTestCase {
        public $fixtures = ['app.article'];

        public function testIndex() {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexQueryData() {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexShort() {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // D'autres asserts.
        }

        public function testIndexPostData() {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles/add', $data);

            $this->assertResponseOk();
            $articles = TableRegistry::get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

Cet exemple montre quelques façons d'utiliser l'envoie de requête et quelques
assertions qu'``IntegrationTestCase dispose``. Avant de pouvoir utiliser les
assertions, vous aurez besoin de simulez une requête. Vous pouvez utilisez
l'une des méthodes suivantes pour simuler une requête:

* ``get()`` Sends a GET request.
* ``post()`` Sends a POST request.
* ``put()`` Sends a PUT request.
* ``delete()`` Sends a DELETE request.
* ``patch()`` Sends a PATCH request.

Toutes les méthodes exceptées ``get()`` and ``delete()`` accepte un second
paramètre qui vous permet de saisir le corp d'une requête. Après avoir émis
une requête, vous pouvez utiliser les différents assertions que fournis
``IntegrationTestCase`` ou PHPUnit afin de vous assurer que votre requête
possède de correctes effets secondaires.

    
Méthodes d'assertion
--------------------

La classe ``IntegrationTestCase`` vous fournis de nombreuses méthodes
d'assertions afin de tester plus simplement les réponses. Quelques exemples::

    // Verifie pour un code de réponse 2xx
    $this->assertResponseOk();

    // Verifie pour un code de réponse 4xx
    $this->assertResponseError();

    // Verifie pour un code de réponse 5xx
    $this->assertResponseFailure();

    // Vérifie l'entête d'emplacement
    $this->assertRedirect(['controller' => 'articles', 'action' => 'index']);

    // Verifie le contenu de la réponse
    $this->assertResponseContains('You won!');

    // Vérifie le layout
    $this->assertLayout('default');

    // Vérifie quel Template a été rendue.
    $this->assertTemplate('index');

    // Vérifie les données de la session
    $this->assertSession(1, 'Auth.User.id');

    // Vérifie l'entête de la réponse.
    $this->assertHeader('Content-Type', 'application/json');

    // Vérifie le contenu d'une variable.
    $this->assertEquals('jose', $this->viewVariable('user.username'));

    // Vérifie les cookies.
    $this->assertEquals('1', $this->cookies());
    
    
Tester un Controller dont la Réponse est au format JSON
-------------------------------------------------------

JSON est un format sympa et courant à utiliser quand on construit un service web.
Tester les endpoints de votre service web est très simple avec CakePHP. Commençons
par un exemple de controller simple qui répond en JSON:

    class MarkersController extends AppController {
        public $components = ['RequestHandler'];

        public function view($id) {
            $marker = $this->Markers->get($id);
            $this->set([
                '_serialize' => ['marker'],
                'marker' => $marker,
            ]);
        }
    }

Maintenant créons un fichier ``tests/TestCase/Controller/MarkersControllerTest.php``
et assurons nous que notre service web retourne une réponse appropriée::

    class MarkersControllerTest extends IntegrationTestCase {

        public function testGet() {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // Vérifie que le code de réponse est 200
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, $this->_response->body());
        }
    }

Nous utilisons l'option ``JSON_PRETTY_PRINT`` comme le fait CakePHP à partir de
la classe JsonView. Ce dernier utilise cette option quand le mode ``debug`` est
activés. Vous pouvez utiliser ceci afin que votre test marche dans les deux cas::

    json_encode($data, Configure::read('debug') ? JSON_PRETTY_PRINT : 0);

    
Tester les Views
================

Généralement, la plupart des applications ne va pas directement tester leur
code HTML. Faire ça donne souvent des résultats fragiles, il est difficile de
maintenir les suites de test qui sont sujet à se casser. En écrivant des
tests fonctionnels en utilisant :php:class:`ControllerTestCase`, vous
pouvez inspecter le contenu de la vue rendue en configurant l'option
``return`` à 'view'. Alors qu'il est possible de tester le contenu de la vue
en utilisant ControllerTestCase, un test d'intégration/vue plus robuste
et maintenable peut être effectué en utilisant des outils comme
`Selenium webdriver <http://seleniumhq.org>`_.


Tester les Components
=====================

Imaginons que nous avons un component appelé PagematronComponent dans notre
application. Ce component nous aide à paginer la valeur limite à travers tous
les controllers qui l'utilisent. Voici notre exemple de component localisé dans
``app/Controller/Component/PagematronComponent.php``::

    class PagematronComponent extends Component {
        public $controller = null;

        public function setController($controller) {
            $this->controller = $controller;
            // Make sure the controller is using pagination
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(Event $event) {
            $this->setController($event->subject());
        }

        public function adjust($length = 'short') {
            switch ($length) {
                case 'long':
                    $this->controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->controller->paginate['limit'] = 50;
                break;
                default:
                    $this->controller->paginate['limit'] = 20;
                break;
            }
        }
    }

Maintenant nous pouvons écrire des tests pour nous assurer que notre paramètre
de pagination ``limit`` est défini correctement par la méthode ``adjust``
dans notre component. Nous créons le fichier
``tests/TestCase/Controller/Component/PagematronComponentTest.php``::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentCollection;
    use Cake\Network\Request;
    use Cake\Network\Response;

    class PagematronComponentTest extends TestCase {

        public $component = null;
        public $controller = null;

        public function setUp() {
            parent::setUp();
            // Setup our component and fake test controller
            $collection = new ComponentCollection();
            $this->component = new PagematronComponent($collection);

            $request = new Request();
            $response = new Response();
            $this->controller = $this->getMock(
                'Cake\Controller\Controller',
                [],
                [$request, $response]
            );
            $this->component->setController($this->controller);
        }

        public function testAdjust() {
            // Test our adjust method with different parameter settings
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown() {
            parent::tearDown();
            // Clean up after we're done
            unset($this->component, $this->controller);
        }
    }

Tester les Helpers
==================

Puisqu'un bon nombre de logique se situe dans les classes Helper, il est
important de s'assurer que ces classes sont couvertes par des cas de test.

Tout d'abord, nous créons un helper d'exemple à tester.
``CurrencyRendererHelper`` va nous aider à afficher les monnaies dans nos vues
et pour siplifier, il ne va avoir qu'une méthode ``usd()``::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

Ici nous définissons la décimale à 2 après la virgule, le séparateur de
décimal, le séparateur des centaines avec une virgule, et le nombre formaté
avec la chaîne 'USD' en préfixe.

Maintenant nous créons nos tests::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase {

        public $helper = null;

        // Here we instantiate our helper
        public function setUp() {
            parent::setUp();
            $view = new View();
            $this->helper = new CurrencyRendererHelper($view);
        }

        // Testing the usd() function
        public function testUsd() {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // We should always have 2 decimal digits
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // Testing the thousands separator
            $this->assertEquals(
              'USD 12,000.70',
              $this->helper->usd(12000.70)
            );
        }
    }

Ici nous appelons ``usd()`` avec des paramètres différents et disons à test
suite de vérifier si les valeurs retournées sont égales à ce que nous en
attendons.

Sauvegardons cela et exécutons le test. Vous devriez voir une barre verte et
un message indiquant 1 passé et 4 assertions.

Créer les Test Suites
=====================

If you want several of your tests to run at the same time, you can create a test
suite. A test suite is composed of several test cases.  You can either create
test suites in your application's ``phpunit.xml`` file, or by creating suite
classes using ``CakeTestSuite``. Using ``phpunit.xml`` is good when you only
need simple include/exclude rules to define your test suite. A simple example
would be::

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

``CakeTestSuite`` offers several methods for easily creating test suites based
on the file system. It allows you to run any code you want to prepare your test
suite. If we wanted to create a test suite for all our model tests we could
would create ``tests/TestCase/AllModelTest.php``. Put the following in it::

    class AllModelTest extends TestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All model tests');
            $suite->addTestDirectory(TESTS . 'Case/Model');
            return $suite;
        }
    }

Le code ci-dessus va grouper tous les cas de test trouvés dans le dossier
``/tests/TestCase/Model/``. Pour ajouter un fichier individuel, utilisez
``$suite->addTestFile($filename);``. Vous pouvez ajouter de façon récursive
un répertoire pour tous les tests en utilisant::

    $suite->addTestDirectoryRecursive(TESTS . 'TestCase');

Ajouterait de façon récursive tous les cas de test dans le répertoire
``tests/TestCase/Model``.

Créer des Tests pour les Plugins
================================

Les Tests pour les plugins sont crées dans leur propre répertoire à
l'intérieur du dossier des plugins.::

    /src
        /plugins
            /Blog
                /tests
                    /TestCase
                    /Fixture

Ils travaillent comme des tests normaux mais vous devrez vous souvenir
d'utiliser les conventions de nommage pour les plugins quand vous
importez des classes. Ceci est un exemple d'un testcase pour le model
``BlogPost`` à partir du chapitre des plugins de ce manuel.
Une différence par rapport aux autres test est dans la première
ligne où 'Blog.BlogPost' est importé. Vous devrez aussi préfixer
les fixtures de votre plugin avec ``plugin.blog.blog_post``::

    namespace Blog\Test\TestCase\Model;

    use Blog\Model\BlogPost;
    use Cake\TestSuite\TestCase;

    class BlogPostTest extends TestCase {

        // Plugin fixtures located in /plugins/Blog/tests/Fixture/
        public $fixtures = ['plugin.blog.blog_post'];
        public $BlogPost;

        public function testSomething() {
            // Test something.
        }
    }

Si vous voulez utiliser les fixures de plugin dans les app tests, vous pouvez
y faire référence en utilisant la syntaxe ``plugin.pluginName.fixtureName``
dans le tableau ``$fixtures``.

Generating Tests with Bake
==========================

If you use :doc:`bake </console-and-shells/code-generation-with-bake>` to
generate scaffolding, it will also generate test stubs. If you need to
re-generate test case skeletons, or if you want to generate test skeletons for
code you wrote, you can use ``bake``:

.. code-block:: bash

    bin/cake bake test <type> <name>

``<type>`` should be one of:

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Cell

While ``<name>`` should be the name of the object you want to bake a test
skeleton for.

Intégration avec Jenkins
========================

`Jenkins <http://jenkins-ci.org>`_ est un serveur d'intégration continu, qui
peut vous aider à automatiser l'exécution de vos cas de test. Cela aide à
s'assurer que tous les tests passent et que votre application est déjà
prête.

Intégrer une application CakePHP avec Jenkins est fairly straightforward. Ce
qui suit suppose que vous avez déjà installé Jenkins sur un système \*nix,
et que vous êtes capable de l'administrer. Vous savez aussi comment créer des
jobs, et lancer des builds. Si vous n'êtes pas sur de tout cela,
réferez vous à la `documentation de Jenkins <http://jenkins-ci.org/>`_.

Créer un job
------------

Commençons par créer un job pour votre application, et connectons votre
répertoire afin que jenkins puisse accéder à votre code.

Ajouter une config de base de données de test
---------------------------------------------

Utiliser une base de données séparée juste pour Jenkins est généralement une
bonne idée, puisque cela évite au sang de couler et évite un certain nombre
de problèmes basiques. Une fois que vous avez crée une nouvelle base de données
dans un serveur de base de données auquel jenkins peut accéder (habituellement
localhost). Ajoutez une *étape de script shell* au build qui contient ce qui
suit:

.. code-block:: bash

    cat > config/app_local.php <<'CONFIG'
    <?php
    $config = [
        'Datasources' => [
            'test' => [
                'datasource' => 'Database/Mysql',
                'host'       => 'localhost',
                'database'   => 'jenkins_test',
                'login'      => 'jenkins',
                'password'   => 'cakephp_jenkins',
                'encoding'   => 'utf8'
            ]
        ]
    ];
    CONFIG

Then uncomment the following line in your ``config/bootstrap.php`` file::

    //Configure::load('app_local.php', 'default');

By creating an ``app_local.php`` file, you have an easy way to define
configuration specific to Jenkins. You can use this same configuration file to
override any other configuration files you need on Jenkins.

Il est souvent une bonne idée de supprimer et re-créer la base de données avant
chaque build aussi. Cela vous évite des echecs de chaînes, où un buid cassé
entraîne l'echec des autres. Ajoutez une autre *étape de script shell* au build
qui contient ce qui suit::

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

Ajouter vos tests
-----------------

Ajoutez une autre *étape de script shell* à votre build. Dans cette étape,
lancez les tests pour votre application. Créer un fichier de log junit, ou
clover coverage est souvent un bonus sympa, puisqu'il vous donne une vue
graphique sympa des résultats de votre test:

.. code-block:: bash

    # Download Composer if it is missing.
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer| php
    # Install dependencies
    php composer.phar install
    vendor/bin/phpunit --stderr --log-junit junit.xml --coverage-clover clover.xml

Si vous utilisez le clover coverage, ou les résultats junit, assurez-vous de
les configurer aussi dans Jenkins. Ne pas configurer ces étapes signifiera
que vous ne verrez pas les résultats.

Lancer un build
---------------

Vous devriez être capable de lancer un build maintenant. Vérifiez la sortie de
la console et faites tous les changements necéssaires pour obtenir un build
précédent.



.. meta::
    :title lang=fr: Test
    :keywords lang=fr: web runner,phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
