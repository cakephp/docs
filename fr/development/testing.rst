Testing
#######

.. note::
    The documentation is not currently supported in French language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the English version in the select top menu to have
    information about this page's topic.

CakePHP fournit un support de test intégré compréhensible. CakePHP permet
l'intégration de `PHPUnit <http://phpunit.de>`_. En plus de toutes les
fonctionnalités offertes par PHPUnit, CakePHP offre quelques fonctionnalités
supplémentaires pour faciliter le test. Cette section va couvrir l'installation
de PHPUnit, comment commencer avec le Test Unitaire, et comment vous pouvez
utiliser les extensions que CakePHP offre.

Installer PHPUnit
=================

CakePHP utilise PHPUnit comme framework de test sous-jacent. PHPUnit est le
standard de-facto pour le test unitaire dans PHP. Il offre un ensemble de
fonctionnalités profondes et puissantes pour s'assurer que votre code fait ce
que vous pensez qu'il doit faire. PHPUnit peut être installé avec le `PHAR
package <http://phpunit.de/#download>`__ ou avec
`Composer <http://getcomposer.org>`_.

Installer PHPUnit avec Composer
-------------------------------

Pour installer PHPUnit avec Composer:

.. code-block:: bash

    $ php composer.phar require --dev phpunit/phpunit

Ceci va ajouter la dépendance à la section ``require-dev`` de votre
``composer.json``, et ensuite installer PHPUnit avec vos autres dépendances.

Vous pouvez maintenant lancer PHPUnit en utilisant:

.. code-block:: bash

    $ vendor/bin/phpunit

Utiliser le fichier PHAR
------------------------

Après avoir téléchargé le fichier **phpunit.phar**, vous pouvez l'utiliser pour
lancer vos tests:

.. code-block:: bash

    php phpunit.phar

.. tip::

    Par souci de commodité vous pouvez rendre phpunit.phar disponible
    globalement sur Unix ou Linux via les commandes suivantes:

    .. code-block:: shell

          chmod +x phpunit.phar
          sudo mv phpunit.phar /usr/local/bin/phpunit
          phpunit --version

    Référez vous à la documentation de PHPUnit pour les instructions concernant
    `l'installation globale du PHAR PHPUnit sur Windows <http://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Tester la Configuration de la Base de Données
=============================================

Souvenez-vous qu'il faut avoir debug activé dans votre fichier
**config/app.php** avant de lancer des tests. Vous devrez aussi vous assurer
d'ajouter une configuration de base de données ``test`` dans **config/app.php**.
Cette configuration est utilisée par CakePHP pour les tables de fixture et les
données::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'username' => 'dblogin',
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

Après avoir installé PHPUnit et configuré le ``test`` de la configuration de la
base de données, vous pouvez vous assurer que vous êtes prêt à écrire et lancer
vos propres tests en lançant un de ceux présents dans le cœur:

.. code-block:: bash

    # Pour phpunit.phar
    $ php phpunit.phar

    # Pour un PHPUnit installé avec Composer
    $ vendor/bin/phpunit

Ce qui est au-dessus va lancer tous les tests que vous avez, ou vous indiquer
qu'aucun test n'a été lancé. Pour lancer un test spécifique, vous pouvez fournir
le chemin au test en paramètre de PHPUnit. Par exemple, si vous aviez un cas
de test pour la classe ArticlesTable, vous pourriez le lancer avec:

.. code-block:: bash

    $ vendor/bin/phpunit tests/TestCase/Model/Table/ArticlesTableTest

Vous devriez voir une barre verte avec quelques informations supplémentaires sur
les tests exécutés et le nombre de tests réussis.

.. note::

    Si vous êtes sur un système Windows, vous ne verrez probablement pas les
    couleurs.

Conventions des Cas de Test (TestCase)
======================================

Comme beaucoup de choses dans CakePHP, les cas de test ont quelques
conventions. En ce qui concerne les tests:

#. Les fichiers PHP contenant les tests doivent être dans votre répertoire
   ``tests/TestCase/[Type]``.
#. Les noms de ces fichiers doivent finir par **Test.php** plutôt que juste
   **.php**.
#. Les classes contenant les tests doivent étendre ``Cake\TestSuite\TestCase``,
   ``Cake\TestSuite\ControllerTestCase`` ou ``\PHPUnit_Framework_TestCase``.
#. Comme les autres noms de classe, les noms de classe des cas de test doivent
   correspondre au nom de fichier. **RouterTest.php** doit contenir
   ``class RouterTest extends TestCase``.
#. Le nom de toute méthode contenant un test (par ex: contenant une assertion)
   doit commencer par ``test``, comme dans ``testPublished()``.
   Vous pouvez aussi utiliser l'annotation ``@test`` pour marquer les méthodes
   en méthodes de test.

Créer Votre Premier Cas de Test
===============================

Dans l'exemple suivant, nous allons créer un cas de test pour une méthode de
helper très simple. Le helper que nous allons tester sera le formatage d'une
barre de progression HTML. Notre helper ressemblera à cela::

    namespace App\View\Helper;

    use Cake\View\Helper;

    class ProgressHelper extends Helper
    {
        public function bar($value)
        {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

C'est un exemple très simple, mais ce sera utile pour montrer comment vous
pouvez créer un cas de test simple. Après avoir créé et sauvegardé notre
helper, nous allons créer le fichier de cas de tests dans
**tests/TestCase/View/Helper/ProgressHelperTest.php**. Dans ce fichier, nous
allons commencer avec ce qui suit::

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\ProgressHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class ProgressHelperTest extends TestCase
    {
        public function setUp()
        {

        }

        public function testBar()
        {

        }
    }

Nous compléterons ce squelette dans une minute. Nous avons ajouté deux méthodes
pour commencer. Tout d'abord ``setUp()``. Cette méthode est appelée avant chaque
méthode de *test* dans une classe de cas de test.
Les méthodes de configuration devraient initialiser les objets souhaités
pour le test, et faire toute configuration souhaitée. Dans notre configuration
nous ajouterons ce qui suit::

    public function setUp()
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

Appeler la méthode parente est importante dans les cas de test, puisque
``TestCase::setUp()`` fait un certain nombre de choses comme fabriquer les
valeurs dans :php:class:`~Cake\\Core\\Configure` et stocker les chemins dans
:php:class:`~Cake\\Core\\App`.

Ensuite, nous allons remplir les méthodes de test. Nous utiliserons quelques
assertions pour nous assurer que notre code crée la sortie que nous attendons::

    public function testBar()
    {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

Le test ci-dessus est simple mais montre le potentiel bénéfique de l'utilisation
des cas de test. Nous utilisons ``assertContains()`` pour nous assurer que notre
helper retourne une chaîne qui contient le contenu que nous attendons. Si le
résultat ne contient pas le contenu attendu le test sera un échec, et nous
savons que notre code est incorrect.

En utilisant les cas de test, vous pouvez décrire la relation entre un ensemble
d'entrées connues et leur sortie attendue. Cela vous aide à être plus confiant
sur le code que vous écrivez puisque vous pouvez vérifier que le code que vous
écrivez remplit les attentes et les assertions que vos tests font. De plus,
puisque les tests sont du code, ils peuvent être re-lancés dès que vous faîtes
un changement. Cela évite la création de nouveaux bugs.

.. _running-tests:

Lancer les Tests
================

Une fois que vous avez installé PHPUnit et que quelques cas de tests sont
écrits, vous pouvez lancer les cas de test très fréquemment. C'est une
bonne idée de lancer les tests avant de committer tout changement pour aider
à s'assurer que vous n'avez rien cassé.

En utilisant ``phpunit``, vous pouvez lancer les tests de votre application.
Pour lancer vos tests d'application, vous pouvez simplement lancer:

.. code-block:: bash

    # avec l'installation de composer
    $ vendor/bin/phpunit

    # avec le fichier phar
    php phpunit.phar

Si vous avez cloné la `source de CakePHP à partir de GitHub <https://github.com/cakephp/cakephp>`__
et que vous souhaitez exécuter les tests unitaires de CakePHP, n'oubliez pas
d'exécuter la commande suivante de ``Composer`` avant de lancer ``phpunit`` pour
que toutes les dépendances soient installées:

.. code-block:: bash

    $ composer install --dev

À partir du répertoire racine de votre application. Pour lancer les tests pour
un plugin qui fait parti de la source de votre application, d'abord faîtes la
commande ``cd`` vers le répertoire du plugin, ensuite utilisez la commande
``phpunit`` qui correspond à la façon dont vous avez installé phpunit:

.. code-block:: bash

    cd plugins

    # En utilisant phpunit installé avec composer
    ../vendor/bin/phpunit

    # En utilisant le fichier phar
    php ../phpunit.phar

Pour lancer les tests sur un plugin séparé, vous devez d'abord installer le
projet dans un répertoire séparé et installer ses dépendances:

.. code-block:: bash

    git clone git://github.com/cakephp/debug_kit.git
    cd debug_kit
    php ~/composer.phar install
    php ~/phpunit.phar

Filtrer les Cas de Test (TestCase)
----------------------------------

Quand vous avez des cas de test plus larges, vous pouvez lancer un
sous-ensemble de méthodes de test quand vous essayez de travailler sur un
cas unique d'échec. Avec l'exécuteur CLI vous pouvez utiliser une option pour
filtrer les méthodes de test:

.. code-block:: bash

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

Le paramètre filter est utilisé comme une expression régulière sensible à la
casse pour filtrer les méthodes de test à lancer.

Générer une Couverture de Code (Code Coverage)
----------------------------------------------

Vous pouvez générer un rapport de couverture de code en une ligne de
commande en utilisant les outils de couverture de code intégrés à PHPUnit.
PHPUnit va générer un ensemble de fichiers en HTML statique contenant les
résultats de la couverture. Vous pouvez générer une couverture pour un cas de
test en faisant ce qui suit:

.. code-block:: bash

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Cela mettra la couverture des résultats dans le répertoire webroot de votre
application. Vous pourrez voir les résultats en allant à
``http://localhost/votre_app/coverage``.

Combiner les Suites de Test pour les Plugins
--------------------------------------------

Souvent, votre application sera composé de plusieurs plugins. Dans ces
situations, il peut être assez fastidieux d'effectuer des tests pour chaque
plugin. Vous pouvez faire des tests pour chaque plugin qui compose votre
application en ajoutant une section ``<testsuite>`` supplémentaire au fichier
``phpunit.xml.dist`` de votre application:

.. code-block:: xml

    <testsuites>
        <testsuite name="App Test Suite">
            <directory>./tests/TestCase</directory>
        </testsuite>

        <!-- Ajouter vos plugins -->
        <testsuite name="Forum plugin">
            <directory>./plugins/Forum/tests/TestCase</directory>
        </testsuite>
    </testsuites>

Les tests supplémentaires ajoutés à l'élément ``<testsuites>`` seront exécutés
automatiquement quand quand vous utiliserez ``phpunit``.

Si vous utilisez ``<testsuites>`` pour utiliser les fixtures à partir des
plugins que vous avez installé avec composer, le fichier ``composer.json`` du
plugin doit ajouter le namespace de la fixture à la section autoload. Exemple::

    "autoload": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests\\Fixture"
        }
    },

Les Callbacks du Cycle de Vie des Cas de Test
=============================================

Les cas de Test ont un certain nombre de callbacks de cycle de vie que vous
pouvez utiliser quand vous faîtes les tests:

* ``setUp`` est appelé avant chaque méthode de test. Doit être utilisé pour
  créer les objets qui vont être testés, et initialiser toute donnée pour le
  test. Toujours se rappeler d'appeler ``parent::setUp()``.
* ``tearDown`` est appelé après chaque méthode de test. Devrait être utilisé
  pour nettoyer une fois que le test est terminé. Toujours se rappeler
  d'appeler ``parent::tearDown()``.
* ``setupBeforeClass`` est appelé une fois avant que les méthodes de test
  aient commencées dans un cas. Cette méthode doit être *statique*.
* ``tearDownAfterClass`` est appelé une fois après que les méthodes de test
  ont commencé dans un cas. Cette méthode doit être *statique*.

.. _test-fixtures:

Fixtures
========

Quand on teste du code qui dépend de models et d'une base de données, on
peut utiliser les **fixtures** comme une façon de générer temporairement des
tables de données chargées avec des données d'exemple qui peuvent être utilisées
par le test. Le bénéfice de l'utilisation de fixtures est que votre test n'a
aucune chance d'abîmer les données de l'application qui tourne. De plus, vous
pouvez commencer à tester votre code avant de développer réellement en live le
contenu pour une application.

CakePHP utilise la connexion nommée ``test`` dans votre fichier de configuration
**config/app.php**. Si la connexion n'est pas utilisable, une exception
sera levée et vous ne pourrez pas utiliser les fixtures de la base de données.

CakePHP effectue ce qui suit pendant le chemin d'une fixture basée sur un cas
de test:

#. Crée les tables pour chacune des fixtures nécessaires.
#. Remplit les tables avec les données, si les données sont fournies dans la fixture.
#. Lance les méthodes de test.
#. Vide les tables de fixture.
#. Retire les tables de fixture de la base de données.

Connexions de Test
------------------

Par défaut, CakePHP va faire un alias pour chaque connexion de votre
application. Chaque connexion définie dans le bootstrap de votre application qui
ne commence pas par ``test_``, va avoir un alias avec le prefix ``test_`` créé.
Les alias de connexion assurent que vous n'utiliserez pas accidentellement la
mauvaise connexion dans les cas de test. Les alias de connexion sont
transparents pour le reste de votre application. Par exemple, si vous utilisez
la connexion 'default', à la place, vous obtiendrez la connexion ``test`` dans
les cas de test. Si vous utilisez la connexion 'replica', la suite de tests va
tenter d'utiliser 'test_replica'.

Créer les Fixtures
------------------

A la création d'une fixture, vous pouvez définir principalement deux choses:
comment la table est créée (quels champs font partie de la table), et quels
enregistrements seront remplis initialement dans la table. Créons notre
première fixture, qui sera utilisée pour tester notre propre model Article.
Créez un fichier nommé **ArticlesFixture.php** dans votre répertoire
**tests/Fixture** avec le contenu suivant::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {

          // Facultatif. Définissez cette variable pour charger des fixtures avec
          // une base de données de test différente.
          public $connection = 'test';

          public $fields = [
              'id' => ['type' => 'integer'],
              'title' => ['type' => 'string', 'length' => 255, 'null' => false],
              'body' => 'text',
              'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
              'created' => 'datetime',
              'modified' => 'datetime',
              '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']]
              ]
          ];
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

.. note::

    Il est recommandé de ne pas ajouter manuellement les valeurs aux colonnes
    qui s'incrémentent automatiquement car cela interfère avec la génération
    de séquence dans PostgreSQL et SQLServer.

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
    Utilisé avec les types ``string`` pour créer des colonnes de type ``CHAR``
    dans les plates-formes qui les supportent.
length
    Défini à la longueur spécifique que le champ doit prendre.
precision
    Défini le nombre de décimales utilisées sur les champs ``float`` et
    ``decimal``.
null
    Défini soit à ``true`` (pour permettre les NULLs) soit à ``false`` (pour
    ne pas permettre les NULLs).
default
    Valeur par défaut que le champ prend.

Nos pouvons définir un ensemble d'enregistrements qui seront remplis après que
la table de fixture est créée. Le format est assez simple, ``$records`` est un
tableau d'enregistrements. Chaque item dans ``$records`` doit être
un enregistrement (une seule ligne). A l'intérieur de chaque ligne, il doit y
avoir un tableau associatif des colonnes et valeurs pour la ligne. Gardez juste
à l'esprit que chaque enregistrement dans le tableau $records doit avoir une
clé pour **chaque** champ spécifié dans le tableau ``$fields``. Si un champ
pour un enregistrement particulier a besoin d'avoir une valeur ``null``,
spécifiez juste la valeur de cette clé à ``null``.

Les Données Dynamiques et les Fixtures
--------------------------------------

Depuis que les enregistrements pour une fixture sont déclarés en propriété
de classe, vous ne pouvez pas utiliser les fonctions ou autres données
dynamiques pour définir les fixtures. Pour résoudre ce problème, vous pouvez
définir ``$records`` dans la fonction ``init()`` de votre fixture. Par exemple,
si vous voulez que tous les timestamps soient créés et mis à jours pour refléter
la date d'aujourd'hui, vous pouvez faire ce qui suit::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {

        public $fields = [
            'id' => ['type' => 'integer'],
            'title' => ['type' => 'string', 'length' => 255, 'null' => false],
            'body' => 'text',
            'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
            'created' => 'datetime',
            'modified' => 'datetime',
            '_constraints' => [
                'primary' => ['type' => 'primary', 'columns' => ['id']],
            ]
        ];

        public function init()
        {
            $this->records = [
                [
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'modified' => date('Y-m-d H:i:s'),
                ],
            ];
            parent::init();
        }
    }

Quand vous surchargez ``init()``, rappelez-vous juste de toujours appeler
``parent::init()``.

Importer les Informations de Table
----------------------------------

Définir le schema des fixtures peut être vraiment pratique lorsque vous créez
des plugins, des librairies ou si vous créez un application qui doit être
portable. La redéfinition du schéma dans les fixtures peut devenir difficile à
maintenir pour les applications de grandes échelles. A cause de cela, CakePHP
fournit la possibilité d'importer le schema depuis une connexion existante et
utilise une définition de la table réfléchie pour créer la définition de la
table utilisée par la suite de tests.

Commençons par un exemple. Imaginons que vous ayez un model nommé articles
disponible dans votre application (qui est lié avec une table nommée
articles), on changerait la fixture donnée dans la section précédente
(**tests/Fixture/ArticlesFixture.php**) en ce qui suit::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles'];
    }

Si vous voulez utiliser une autre connexion, utilisez::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['table' => 'articles', 'connection' => 'other'];
    }

.. versionadded:: 3.1.7

En général vous avez une classe Table avec votre fixture. Vous pouvez aussi
utiliser ceci pour récupérer le nom de la table::

    class ArticlesFixture extends TestFixture
    {
        public $import = ['model' => 'Articles'];
    }

Puisqu'on utilise ``TableRegistry::get()``, on peut aussi utiliser la syntaxe de
plugin.

Vous pouvez naturellement importer la définition de votre table à partir d'un
model/d'une table existante, mais vous avez vos enregistrements directement
définis dans le fixture comme il a été montré dans la section précédente.
Par exemple::

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

Vous pouvez ne pas charger/créer schéma dans une fixture. Ceci est utile si
vous aviez déjà une configuration de base de données de test, avec toutes
les tables vides créées. En ne définissant ni ``$fields`` ni ``$import``, une
fixture va seulement insérer les enregistrements et tronquer les
enregistrements sur chaque méthode de test.

Charger les Fixtures dans vos Tests (TestCase)
----------------------------------------------

Après avoir créé vos fixtures, vous pouvez les utiliser dans vos cas de test.
Dans chaque cas de test vous devriez charger les fixtures dont vous aurez
besoin. Vous devriez charger une fixture pour chaque model qui aura une requête
lancée contre elle. Pour charger les fixtures, vous définissez la propriété
``$fixtures`` dans votre model::

    class ArticleTest extends TestCase
    {
        public $fixtures = ['app.articles', 'app.comments'];
    }

Ce qui est au-dessus va charger les fixtures d'Article et de Comment à partir
du répertoire de fixture de l'application. Vous pouvez aussi charger les
fixtures à partir du cœur de CakePHP ou des plugins::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['plugin.debug_kit.articles', 'core.comments'];
    }

Utiliser le préfixe ``core`` va charger les fixtures à partir de CakePHP, et
utiliser un nom de plugin en préfixe chargera la fixture à partir d'un plugin
nommé.

Vous pouvez contrôler quand vos fixtures sont chargées en configurant
:php:attr:`Cake\\TestSuite\\TestCase::$autoFixtures` à ``false`` et plus tard
les charger en utilisant :php:meth:`Cake\\TestSuite\\TestCase::loadFixtures()`::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['app.articles', 'app.comments'];
        public $autoFixtures = false;

        public function testMyFunction()
        {
            $this->loadFixtures('Articles', 'Comments');
        }
    }

Vous pouvez charger les fixtures dans les sous-répertoires.
Utiliser plusieurs répertoires peut faciliter l'organisation de vos fixtures si
vous avez une application plus grande. Pour charger les fixtures dans les
sous-répertoires, incluez simplement le nom du sous-répertoire dans le nom de
la fixture::

    class ArticlesTableTest extends CakeTestCase
    {
        public $fixtures = ['app.blog/articles', 'app.blog/comments'];
    }

Dans l'exemple ci-dessus, les deux fixtures seront chargées à partir de
``tests/Fixture/blog/``.

Tester les Classes Table
========================

Disons que nous avons déjà notre table Articles définie dans
**src/Model/Table/ArticlesTable.php**, qui ressemble à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options)
        {
            $query->where([
                $this->alias() . '.published' => 1
            ]);
            return $query;
        }
    }

Nous voulons maintenant configurer un test qui va utiliser la définition du
model, mais à travers les fixtures, pour tester quelques fonctionnalités dans
le model. Le test suite de CakePHP charge un petit ensemble minimum de fichiers
(pour garder les tests isolés), ainsi nous devons commencer par charger notre
model - dans ce cas le model Article que nous avons déjà défini.

Créons maintenant un fichier nommé **ArticlesTableTest.php** dans notre
répertoire **tests/TestCase/Model/Table**, avec le contenu suivant::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.articles'];
    }

Dans notre variable de cas de test ``$fixtures``, nous définissons l'ensemble
des fixtures que nous utiliserons. Vous devriez vous rappeler d'inclure tous
les fixtures sur lesquelles des requêtes vont être lancées.

Créer une Méthode de Test
-------------------------

Ajoutons maintenant une méthode pour tester la fonction ``published()`` dans la
table Articles. Modifions le fichier
**tests/TestCase/Model/Table/ArticlesTableTest.php** afin qu'il ressemble
maintenant à ceci::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public $fixtures = ['app.articles'];

        public function setUp()
        {
            parent::setUp();
            $this->Articles = TableRegistry::get('Articles');
        }

        public function testFindPublished()
        {
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

Vous pouvez voir que nous avons ajouté une méthode appelée
``testFindPublished()``. Nous commençons par créer une instance de notre model
``Article``, et lançons ensuite notre méthode ``published()``. Dans
``$expected``, nous définissons ce que nous en attendons, ce qui devrait être le
résultat approprié (que nous connaissons depuis que nous avons défini les
enregistrements qui sont remplis initialement dans la table articles.). Nous
testons que les résultats correspondent à nos attentes en utilisant la méthode
``assertEquals()``. Regardez la section sur les :ref:`running-tests` pour plus
d'informations sur la façon de lancer les cas de test.

Méthodes de Mocking des Models
------------------------------

Il y aura des fois où vous voudrez mocker les méthodes sur les models quand vous
les testez. Vous devrez utiliser ``getMockForModel`` pour créer les mocks de
test des models. Cela évite des problèmes avec les propriétés réfléchies que
les mocks normaux ont::

    public function testSendingEmails()
    {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

Dans votre méthode ``tearDown()``, assurez-vous de retirer le mock avec ceci::

    TableRegistry::clear();

.. _integration-testing:

Test d'Intégrations des Controllers
===================================

Alors que vous pouvez tester les controllers de la même manière que les Helpers,
Models et Components, CakePHP offre une classe spécialisée
``IntegrationTestCase``. L'utilisation de cette classe en tant que classe de
base pour les cas de test de votre controller vous permet de mettre en place des
tests d'intégration pour vos controllers.

Si vous n'êtes pas familier avec les tests d'intégrations, il s'agit d'une
approche de test qui facilite le test de plusieurs éléments en même temps. Les
fonctionnalités de test d'intégration dans CakePHP simulent une requête HTTP à
traiter par votre application. Par exemple, tester vos controllers impactera
les Models, Components et Helpers qui auraient été invoqués suite à une requête
HTTP. Cela vous permet d'écrire des tests au plus haut niveau de votre
application en ayant un impact sur chacun de ses travaux.

Disons que vous avez un controller typique ArticlesController, et son model
correspondant. Le code du controller ressemble à ceci::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public $helpers = ['Form', 'Html'];

        public function index($short = null)
        {
            if ($this->request->is('post')) {
                $article = $this->Articles->newEntity($this->request->data);
                if ($this->Articles->save($article)) {
                    // Redirige selon le pattern PRG
                    return $this->redirect(['action' => 'index']);
                }
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

Créez un fichier nommé **ArticlesControllerTest.php** dans votre répertoire
**tests/TestCase/Controller** et mettez ce qui suit à l'intérieur::

    namespace App\Test\TestCase\Controller;

    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\IntegrationTestCase;

    class ArticlesControllerTest extends IntegrationTestCase
    {
        public $fixtures = ['app.articles'];

        public function testIndex()
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexQueryData()
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexShort()
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // D'autres asserts.
        }

        public function testIndexPostData()
        {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'new-article',
                'title' => 'New Article',
                'body' => 'New Body'
            ];
            $this->post('/articles', $data);

            $this->assertResponseSuccess();
            $articles = TableRegistry::get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

Cet exemple montre quelques façons d'utiliser l'envoi de requête et quelques
assertions qu'intègre ``IntegrationTestCase``. Avant de pouvoir utiliser les
assertions, vous aurez besoin de simuler une requête. Vous pouvez utiliser
l'une des méthodes suivantes pour simuler une requête:

* ``get()`` Sends a GET request.
* ``post()`` Sends a POST request.
* ``put()`` Sends a PUT request.
* ``delete()`` Sends a DELETE request.
* ``patch()`` Sends a PATCH request.

Toutes les méthodes exceptées ``get()`` et ``delete()`` acceptent un second
paramètre qui vous permet de saisir le corps d'une requête. Après avoir émis
une requête, vous pouvez utiliser les différentes assertions que fournit
``IntegrationTestCase`` ou PHPUnit afin de vous assurer que votre requête
possède de correctes effets secondaires.

Configurer la Requête
---------------------

La classe ``IntegrationTestCase`` intègre de nombreux helpers pour faciliter
la configuration des requêtes que vous allez envoyer à votre controller::

    // Définit des cookies
    $this->cookie('name', 'Uncle Bob');

    // Définit des données de session
    $this->session(['Auth.User.id', 1]);

    // Configure les en-têtes
    $this->configRequest([
        'headers' => ['Accept' => 'application/json']
    ]);

Les états de ces helpers définis par ces méthodes est remis à zéro dans la
méthode ``tearDown()``.

.. _testing-authentication:

Tester des Actions Protégées par AuthComponent
----------------------------------------------

Si vous utilisez ``AuthComponent``, vous aurez besoin de simuler les données
de session utilisées par AuthComponent pour valider l'identité d'un utilisateur.
Pour ce faire, vous pouvez utiliser les méthodes de helper fournies par
``IntegrationTestCase``. En admettant que vous ayez un ``ArticlesController``
qui contient une méthode add, et que cette méthode nécessite une
authentification, vous pourriez écrire les tests suivants::

    public function testAddUnauthenticatedFails()
    {
        // Pas de données de session définies.
        $this->get('/articles/add');

        $this->assertRedirect(['controller' => 'Users', 'action' => 'login']);
    }

    public function testAddAuthenticated()
    {
        // Définit des données de session
        $this->session([
            'Auth' => [
                'User' => [
                    'id' => 1,
                    'username' => 'testing',
                    // autres clés.
                ]
            ]
        ]);
        $this->get('/articles/add');

        $this->assertResponseOk();
        // Autres assertions.
    }

Testing Stateless Authentication and APIs
-----------------------------------------

To test APIs that use stateless authentication, such as Basic authentication,
you can configure the request to inject environment conditions or headers that
simulate actual authentication request headers.

When testing Basic or Digest Authentication, you can add the environment
variables that `PHP creates <http://php.net/manual/en/features.http-auth.php>`_
automatically. These environment variables used in the authentication adapter
outlined in :ref:`basic-authentication`::

    public function testBasicAuthentication()
    {
        $this->configRequest([
            'environment' => [
                'PHP_AUTH_USER' => 'username',
                'PHP_AUTH_PW' => 'password',
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

If you are testing other forms of authentication, such as OAuth2, you can set
the Authorization header directly::

    public function testOauthToken()
    {
        $this->configRequest([
            'headers' => [
                'authorization' => 'Bearer: oauth-token'
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

The headers key in ``configRequest()`` can be used to configure any additional
HTTP headers needed for an action.

Tester les Actions Protégées par CsrfComponent ou SecurityComponent
-------------------------------------------------------------------

Quand vous testez les actions protégées par SecurityComponent ou CsrfComponent,
vous pouvez activer la génération automatique de token pour vous assurer que vos
tests ne vont pas être en échec à cause d'un token non présent::

    public function testAdd()
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'News excitante!']);
    }

Il est aussi important d'activer debug dans les tests qui utilisent les tokens
pour éviter que le SecurityComponent pense que le token debug est utilisé dans
un environnement non-debug. Quand vous testez avec d'autres méthodes comme
``requireSecure()``, vous pouvez utiliser ``configRequest()`` pour définir les
bonnes variables d'environnement::

    // Fake out SSL connections.
    $this->configRequest([
        'environment' => ['HTTPS' => 'on']
    ]);

.. versionadded:: 3.1.2
    Les méthodes ``enableCsrfToken()`` et ``enableSecurityToken()`` ont été
    ajoutées dans la version 3.1.2.

Integration Testing PSR7 Middleware
-----------------------------------

Integration testing can also be used to test your entire PSR7 application and
:doc:`/controllers/middleware`. By default ``IntegrationTestCase`` will
auto-detect the presence of an ``App\Application`` class and automatically
enable integration testing of your Application. You can toggle this behavior
with the ``useHttpServer()`` method::

    public function setUp()
    {
        // Enable PSR7 integration testing.
        $this->useHttpServer(true);

        // Disable PSR7 integration testing.
        $this->useHttpServer(false);
    }

You can customize the application class name used, and the constructor
arguments, by using the ``configApplication()`` method::

    public function setUp()
    {
        $this->configApplication('App\App', [CONFIG]);
    }

After enabling the PSR7 mode, and possibly configuring your application class,
you can use the remaining ``IntegrationTestCase`` features as normal.

You should also take care to try and use :ref:`application-bootstrap` to load
any plugins containing events/routes. Doing so will ensure that your
events/routes are connected for each test case.

.. versionadded:: 3.3.0
    PSR7 Middleware and the ``useHttpServer()`` method were added in 3.3.0.

Méthodes d'Assertion
--------------------

La classe ``IntegrationTestCase`` vous fournis de nombreuses méthodes
d'assertions afin de tester plus simplement les réponses. Quelques exemples::

    // Vérifie un code de réponse 2xx
    $this->assertResponseOk();

    // Vérifie un code de réponse 2xx/3xx
    $this->assertResponseSuccess();

    // Vérifie un code de réponse 4xx
    $this->assertResponseError();

    // Vérifie un code de réponse 5xx
    $this->assertResponseFailure();

    // Vérifie un code de réponse spécifique, par exemple 200
    $this->assertResponseCode(200);

    // Vérifie l'en-tête Location
    $this->assertRedirect(['controller' => 'Articles', 'action' => 'index']);

    // Vérifie qu'aucun en-tête Location n'a été envoyé
    $this->assertNoRedirect();

    // Vérifie une partie de l'en-tête Location
    $this->assertRedirectContains('/articles/edit/');

    // Vérifie que le contenu de la réponse n'est pas vide
    $this->assertResponseNotEmpty();

    // Vérifie que le contenu de la réponse est vide
    $this->assertResponseEmpty();

    // Vérifie le contenu de la réponse
    $this->assertResponseEquals('Yeah!');

    // Vérifie un contenu partiel de la réponse
    $this->assertResponseContains('You won!');
    $this->assertResponseNotContains('You lost!');

    // Vérifie le layout
    $this->assertLayout('default');

    // Vérifie quel Template a été rendu.
    $this->assertTemplate('index');

    // Vérifie les données de la session
    $this->assertSession(1, 'Auth.User.id');

    // Vérifie l'entête de la réponse.
    $this->assertHeader('Content-Type', 'application/json');

    // Vérifie le contenu d'une variable.
    $this->assertEquals('jose', $this->viewVariable('user.username'));

    // Vérifie les cookies.
    $this->assertCookie('1', 'thingid');

    // Vérifie le type de contenu
    $this->assertContentType('application/json');

En plus des méthodes d'assertion ci-dessus, vous pouvez également utiliser
toutes les assertions de `TestSuite
<https://api.cakephp.org/3.0/class-Cake.TestSuite.TestCase.html>`_ et celles
de
`PHPUnit <https://phpunit.de/manual/current/en/appendixes.assertions.html>`__.

Comparer les Résultats du Test avec un Fichier
----------------------------------------------

Pour certains types de test, il peut être plus simple de comparer les résultats
d'un test avec le contenu d'un fichier - par exemple, quand vous testez la
sortie rendue d'une view.
``StringCompareTrait`` ajoute une méthode d'assertion simple pour cela.

Pour l'utiliser, vous devez inclure un Trait, définir le chemin de base de
comparaison et appeler ``assertSameAsFile``::

    use Cake\TestSuite\StringCompareTrait;
    use Cake\TestSuite\TestCase;

    class SomeTest extends TestCase
    {
        use StringCompareTrait;

        public function setUp()
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample()
        {
            $result = ...;
            $this->assertSameAsFile('example.php', $result);
        }
    }

L'exemple ci-dessus va comparer ``$result`` au contenu du fichier
``APP/tests/comparisons/example.php``.

Un mécanisme est fourni pour écrire/mettre à jour les fichiers de test, en
définissant la variable d'environment ``UPDATE_TEST_COMPARISON_FILES``, ce qui
va créer et/ou mettre à jour les fichiers de comparaison de test au fur et à
mesure où ils sont rendus:

.. code-block:: bash

    phpunit
    ...
    FAILURES!
    Tests: 6, Assertions: 7, Failures: 1

    UPDATE_TEST_COMPARISON_FILES=1 phpunit
    ...
    OK (6 tests, 7 assertions)

    git status
    ...
    # Changes not staged for commit:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   tests/comparisons/example.php

Tester avec des Cookies Chiffrés
--------------------------------

Si vous utilisez :php:class:`Cake\\Controller\\Component\\CookieComponent` dans
vos controllers, vos cookies sont probablement chiffrés. Depuis 3.1.7, CakePHP
fournit des méthodes pour intéragir avec les cookies chiffrés dans vos cas de
test::

    // Définit un cookie en utilisant aes et la clé par défaut.
    $this->cookieEncrypted('my_cookie', 'Some secret values');

    // En supposant que cette action modifie le cookie.
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('Une valeur mise à jour', 'my_cookie');

.. versionadded: 3.1.7
    ``assertCookieEncrypted`` et ``cookieEncrypted`` ont été ajoutées dans la
    version 3.1.7.

Tester un Controller dont la Réponse est au format JSON
-------------------------------------------------------

JSON est un format sympa et courant à utiliser quand on construit un service
web. Tester les endpoints de votre service web est très simple avec CakePHP.
Commençons par un exemple de controller simple qui répond en JSON::

    class MarkersController extends AppController
    {
        public $components = ['RequestHandler'];

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set([
                '_serialize' => ['marker'],
                'marker' => $marker,
            ]);
        }
    }

Maintenant créons un fichier
**tests/TestCase/Controller/MarkersControllerTest.php** et assurons-nous que
notre service web retourne une réponse appropriée::

    class MarkersControllerTest extends IntegrationTestCase
    {

        public function testGet()
        {
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
activé. Vous pouvez utiliser ceci afin que votre test marche dans les deux cas::

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
**src/Controller/Component/PagematronComponent.php**::

    class PagematronComponent extends Component
    {
        public $controller = null;

        public function setController($controller)
        {
            $this->controller = $controller;
            // Assurez-vous que le controller utilise la pagination.
            if (!isset($this->controller->paginate)) {
                $this->controller->paginate = [];
            }
        }

        public function startup(Event $event)
        {
            $this->setController($event->subject());
        }

        public function adjust($length = 'short')
        {
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
de pagination ``limit`` est défini correctement par la méthode ``adjust()``
dans notre component. Nous créons le fichier
**tests/TestCase/Controller/Component/PagematronComponentTest.php**::

    namespace App\Test\TestCase\Controller\Component;

    use App\Controller\Component\PagematronComponent;
    use Cake\Controller\Controller;
    use Cake\Controller\ComponentRegistry;
    use Cake\Event\Event;
    use Cake\Network\Request;
    use Cake\Network\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {

        public $component = null;
        public $controller = null;

        public function setUp()
        {
            parent::setUp();
            // Configuration de notre component et de notre faux controller de test.
            $request = new Request();
            $response = new Response();
            $this->controller = $this->getMockBuilder('Cake\Controller\Controller')
                ->setConstructorArgs([$request, $response])
                ->setMethods(null)
                ->getMock();
            $registry = new ComponentRegistry($this->controller);
            $this->component = new PagematronComponent($registry);
            $event = new Event('Controller.startup', $this->controller);
            $this->component->startup($event);
        }

        public function testAdjust()
        {
            // Test de notre méthode avec différents paramètres.
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown()
        {
            parent::tearDown();
            // Nettoie les variables quand les tests sont finis.
            unset($this->component, $this->controller);
        }
    }

Tester les Helpers
==================

Puisqu'un bon nombre de logique se situe dans les classes Helper, il est
important de s'assurer que ces classes sont couvertes par des cas de test.

Tout d'abord, nous créons un helper d'exemple à tester.
``CurrencyRendererHelper`` va nous aider à afficher les monnaies dans nos vues
et pour simplifier, il ne va avoir qu'une méthode ``usd()``::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function usd($amount)
        {
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

    class CurrencyRendererHelperTest extends TestCase
    {

        public $helper = null;

        // Nous instancions notre helper
        public function setUp()
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // Test de la fonction usd()
        public function testUsd()
        {
            $this->assertEquals('USD 5.30', $this->helper->usd(5.30));

            // Nous devrions toujours avoir 2 chiffres après la virgule
            $this->assertEquals('USD 1.00', $this->helper->usd(1));
            $this->assertEquals('USD 2.05', $this->helper->usd(2.05));

            // Test du séparateur de milliers
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

Lorsque vous testez un Helper qui utilise d'autres Helpers, assurez-vous de
créer un mock de la méthode ``loadHelpers`` de la classe View.

.. _testing-events:

Tester les Events
=================

Les :doc:`/core-libraries/events` sont un bon moyen pour découpler le code de
votre application, mais parfois quand nous les testons, nous avons tendance à
tester les événements dans les cas de test qui éxecutent ces événements. C'est
une forme supplémentaire de couplage qui peut être évitée en utilisant
à la place ``assertEventFired`` et ``assertEventFiredWith``.

En poursuivant l'exemple sur les Orders, disons que nous avons les tables
suivantes::

    class OrdersTable extends Table
    {

        public function place($order)
        {
            if ($this->save($order)) {
                // moved cart removal to CartsTable
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->eventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

    class CartsTable extends Table
    {

        public function implementedEvents()
        {
            return [
                'Model.Order.afterPlace' => 'removeFromCart'
            ];
        }

        public function removeFromCart(Event $event)
        {
            $order = $event->data('order');
            $this->delete($order->cart_id);
        }
    }

.. note::
    Pour faire des assertions sur le fait que des événements sont déclenchés,
    vous devez d'abord activer :ref:`tracking-events` sur le gestionnaire
    d'événements pour lequel vous souhaitez faire des asserts.

Pour tester le ``OrdersTable`` du dessus, vous devez activer le tracking dans la
méthode ``setUp()`` puis vérifier par exemple que l'événement a été déclenché,
puis que l'entity ``$order`` a été passée dans les données de l'événement::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\ORM\TableRegistry;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {

        public $fixtures = ['app.orders'];

        public function setUp()
        {
            parent::setUp();
            $this->Orders = TableRegistry::get('Orders');
            // enable event tracking
            $this->Orders->eventManager()->setEventList(new EventList());
        }

        public function testPlace()
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->eventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->eventManager());
        }
    }

Par défaut, l'``EventManager`` global est utilisé pour les assertions, donc
tester les événements globaux ne nécessitent pas de passer le gestionnaire
d'événements::

    $this->assertEventFired('My.Global.Event');
    $this->assertEventFiredWith('My.Global.Event', 'user', 1);

.. versionadded:: 3.2.11

    Le tracking d'événement, ``assertEventFired()``, et ``assertEventFiredWith``
    ont été ajoutés.

Créer des Suites de Test (Test Suites)
======================================

Si vous voulez que plusieurs de vos tests s'exécutent en même temps, vous pouvez
créer une suite de tests. Une suite de test est composée de plusieurs cas de
test. Vous pouvez créer des suites de tests dans le fichier ``phpunit.xml`` de
votre application. Un exemple simple serait:

.. code-block:: xml

    <testsuites>
      <testsuite name="Models">
        <directory>src/Model</directory>
        <file>src/Service/UserServiceTest.php</file>
        <exclude>src/Model/Cloud/ImagesTest.php</exclude>
      </testsuite>
    </testsuites>

Créer des Tests pour les Plugins
================================

Les Tests pour les plugins sont créés dans leur propre répertoire à
l'intérieur du dossier des plugins::

    /src
        /plugins
            /Blog
                /tests
                    /TestCase
                    /Fixture

Ils fonctionnent comme des tests normaux mais vous devrez vous souvenir
d'utiliser les conventions de nommage pour les plugins quand vous importez des
classes. Ceci est un exemple d'un cas de test pour le model ``BlogPost`` à
partir du chapitre des plugins de ce manuel. Une différence par rapport aux
autres test est dans la première ligne où 'Blog.BlogPost' est importé. Vous
devrez aussi préfixer les fixtures de votre plugin avec
``plugin.blog.blog_posts``::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {

        // Fixtures de plugin se trouvant dans /plugins/Blog/tests/Fixture/
        public $fixtures = ['plugin.blog.blog_posts'];

        public function testSomething()
        {
            // Teste quelque chose.
        }
    }

Si vous voulez utiliser les fixtures de plugin dans les app tests, vous pouvez
y faire référence en utilisant la syntaxe ``plugin.pluginName.fixtureName``
dans le tableau ``$fixtures``.

Avant d'utiliser des fixtures assurez-vous que votre ``phpunit.xml``
contienne un listener (écouteur) pour les fixtures::

    <!-- Configure un listener pour les fixtures -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector"
        file="./vendor/cakephp/cakephp/src/TestSuite/Fixture/FixtureInjector.php">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

Vous devez également vous assurer que vos fixtures sont chargeables.
Vérifiez que le code suivant est présent dans votre fichier ``composer.json``::

    "autoload-dev": {
        "psr-4": {
            "MyPlugin\\Test\\": "./plugins/MyPlugin/tests"
        }
    }

.. note::

    N'oubliez pas de lancer ``composer.phar dumpautoload`` lorsque vous modifiez
    le mapping de l'autoloader.

Générer des Tests avec Bake
===========================

Si vous utilisez :doc:`bake </bake/usage>` pour générer votre code, il va
également générer le squelette de vos fichiers de tests. Si vous avez besoin
de re-générer le squelette de vos fichiers de tests, ou si vous souhaitez
générer le squelette de test pour le code que vous avez écrit, vous pouvez
utiliser ``bake``:

.. code-block:: bash

    bin/cake bake test <type> <name>

``<type>`` doit être une de ces options:

#. Entity
#. Table
#. Controller
#. Component
#. Behavior
#. Helper
#. Shell
#. Cell

``<name>`` doit être le nom de l'objet dont vous voulez générer le squelette de
tests.

Intégration avec Jenkins
========================

`Jenkins <http://jenkins-ci.org>`_ est un serveur d'intégration continu, qui
peut vous aider à automatiser l'exécution de vos cas de test. Cela aide à
s'assurer que tous les tests passent et que votre application est déjà
prête.

Intégrer une application CakePHP avec Jenkins est assez simple. Ce qui suit
suppose que vous avez déjà installé Jenkins sur un système \*nix, et que vous
êtes capable de l'administrer. Vous savez aussi comment créer des jobs, et
lancer des builds. Si vous n'êtes pas sur de tout cela, référez vous à la
`documentation de Jenkins <http://jenkins-ci.org/>`_.

Créer un Job
------------

Commençons par créer un job pour votre application, et connectons votre
répertoire afin que jenkins puisse accéder à votre code.

Ajouter une Config de Base de Données de Test
---------------------------------------------

Utiliser une base de données séparée juste pour Jenkins est généralement une
bonne idée, puisque cela évite au sang de couler et évite un certain nombre
de problèmes basiques. Une fois que vous avez créé une nouvelle base de données
dans un serveur de base de données auquel jenkins peut accéder (habituellement
localhost). Ajoutez une *étape de script shell* au build qui contient ce qui
suit:

.. code-block:: bash

    cat > config/app_local.php <<'CONFIG'
    <?php
    return [
        'Datasources' => [
            'test' => [
                'datasource' => 'Database/Mysql',
                'host'       => 'localhost',
                'database'   => 'jenkins_test',
                'username'   => 'jenkins',
                'password'   => 'cakephp_jenkins',
                'encoding'   => 'utf8'
            ]
        ]
    ];
    CONFIG

Ensuite, décommentez la ligne suivante dans votre fichier
**config/bootstrap.php**::

    //Configure::load('app_local', 'default');

En créant un fichier **app_local.php**, vous avez un moyen facile de définir une
configuration spécifique pour Jenkins. Vous pouvez utiliser ce même fichier de
configuration pour remplacer tous les autres fichiers de configuration dont vous
avez besoin sur Jenkins.

Il est souvent une bonne idée de supprimer et re-créer la base de données avant
chaque build aussi. Cela vous évite des echecs de chaînes, où un build cassé
entraîne l'echec des autres. Ajoutez une autre *étape de script shell* au build
qui contient ce qui suit:

.. code-block:: bash

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

Ajouter vos Tests
-----------------

Ajoutez une autre *étape de script shell* à votre build. Dans cette étape,
lancez les tests pour votre application. Créer un fichier de log junit, ou
clover coverage est souvent un bonus sympa, puisqu'il vous donne une vue
graphique sympa des résultats de votre test:

.. code-block:: bash

    # Télécharger Composer s'il est manquant.
    test -f 'composer.phar' || curl -sS https://getcomposer.org/installer | php
    # Installer les dépendances.
    php composer.phar install
    vendor/bin/phpunit --log-junit junit.xml --coverage-clover clover.xml

Si vous utilisez le clover coverage, ou les résultats junit, assurez-vous de
les configurer aussi dans Jenkins. Ne pas configurer ces étapes signifiera
que vous ne verrez pas les résultats.

Lancer un Build
---------------

Vous devriez être capable de lancer un build maintenant. Vérifiez la sortie de
la console et faites tous les changements nécessaires pour obtenir le build
précédent.

.. meta::
    :title lang=fr: Test
    :keywords lang=fr: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
