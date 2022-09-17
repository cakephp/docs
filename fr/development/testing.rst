Testing
#######

CakePHP fournit un support de test intégré compréhensible. CakePHP permet
l'intégration de `PHPUnit <https://phpunit.de>`_. En plus de toutes les
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
package <https://phpunit.de/#download>`__ ou avec
`Composer <https://getcomposer.org>`_.

Installer PHPUnit avec Composer
-------------------------------

Pour installer PHPUnit avec Composer:

.. code-block:: console

    $ php composer.phar require --dev phpunit/phpunit:"^8.5"

Ceci va ajouter la dépendance à la section ``require-dev`` de votre
``composer.json``, et ensuite installer PHPUnit avec vos autres dépendances.

Vous pouvez maintenant lancer PHPUnit en utilisant:

.. code-block:: console

    $ vendor/bin/phpunit

Utiliser le fichier PHAR
------------------------

Après avoir téléchargé le fichier **phpunit.phar**, vous pouvez l'utiliser pour
lancer vos tests:

.. code-block:: console

    php phpunit.phar

.. tip::

    Par souci de commodité vous pouvez rendre phpunit.phar disponible
    globalement sur Unix ou Linux via les commandes suivantes:

    .. code-block:: shell

          chmod +x phpunit.phar
          sudo mv phpunit.phar /usr/local/bin/phpunit
          phpunit --version

    Référez vous à la documentation de PHPUnit pour les instructions concernant
    `l'installation globale du PHAR PHPUnit sur Windows <https://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Tester la Configuration de la Base de Données
=============================================

Souvenez-vous qu'il faut avoir debug activé dans votre fichier
**config/app_local.php** avant de lancer des tests. Vous devrez aussi vous assurer
d'ajouter une configuration de base de données ``test`` dans **config/app_local.php**.
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

Après avoir installé PHPUnit et configuré la configuration de la base de données de ``test``, vous pouvez vous assurer que vous êtes prêt à écrire et lancer
vos propres tests en lançant un de ceux présents dans le cœur:

.. code-block:: console

    # Pour phpunit.phar
    $ php phpunit.phar

    # Pour un PHPUnit installé avec Composer
    $ vendor/bin/phpunit

Ce qui est au-dessus va lancer tous les tests que vous avez, ou vous indiquer
qu'aucun test n'a été lancé. Pour lancer un test spécifique, vous pouvez fournir
le chemin au test en paramètre de PHPUnit. Par exemple, si vous aviez un cas
de test pour la classe ArticlesTable, vous pourriez le lancer avec:

.. code-block:: console

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
   ``Cake\TestSuite\IntegrationTestCase`` ou ``\PHPUnit\Framework\TestCase``.
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
        public function setUp(): void
        {

        }

        public function testBar(): void
        {

        }
    }

Nous compléterons ce squelette dans une minute. Nous avons ajouté deux méthodes
pour commencer. Tout d'abord ``setUp()``. Cette méthode est appelée avant chaque
méthode de *test* dans une classe de cas de test.
Les méthodes de configuration devraient initialiser les objets souhaités
pour le test, et faire toute configuration souhaitée. Dans notre configuration
nous ajouterons ce qui suit::

    public function setUp(): void
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

    public function testBar(): void
    {
        $result = $this->Progress->bar(90);
        $this->assertStringContainsString('width: 90%', $result);
        $this->assertStringContainsString('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertStringContainsString('width: 33%', $result);
    }

Le test ci-dessus est simple mais montre le potentiel bénéfique de l'utilisation
des cas de test. Nous utilisons ``assertStringContainsString()`` pour nous assurer que notre
helper retourne une chaîne qui contient le contenu que nous attendons. Si le
résultat ne contient pas le contenu attendu le test sera un échec, et nous
savons que notre code est incorrect.

En utilisant les cas de test, vous pouvez décrire la relation entre un ensemble
d'entrées connues et leur sortie attendue. Cela vous aide à être plus confiant
sur le code que vous écrivez puisque vous pouvez vérifier que le code que vous
écrivez remplit les attentes et les assertions que vos tests font. De plus,
puisque les tests sont du code, ils peuvent être re-lancés dès que vous faîtes
un changement. Cela évite la création de nouveaux bugs.

.. note::

    L'EventManager est remis à blanc pour chaque méthode de test. Cela signifie
    que lorsque vous lancez plusieurs tests ensemble, vous perdez les écouteurs
    d'events qui ont été enregistrés dans config/bootstrap.php puisque le
    bootstrap n'est exécuté qu'une seule fois.

.. _running-tests:

Lancer les Tests
================

Une fois que vous avez installé PHPUnit et que quelques cas de tests sont
écrits, vous pouvez lancer les cas de test très fréquemment. C'est une
bonne idée de lancer les tests avant de committer tout changement pour aider
à s'assurer que vous n'avez rien cassé.

En utilisant ``phpunit``, vous pouvez lancer les tests de votre application.
Pour lancer vos tests d'application, vous pouvez simplement lancer:

.. code-block:: console

    vendor/bin/phpunit

    php phpunit.phar

Si vous avez cloné la `source de CakePHP à partir de GitHub <https://github.com/cakephp/cakephp>`__
et que vous souhaitez exécuter les tests unitaires de CakePHP, n'oubliez pas
d'exécuter la commande suivante de ``Composer`` avant de lancer ``phpunit`` pour
que toutes les dépendances soient installées:

.. code-block:: console

    composer install

À partir du répertoire racine de votre application. Pour lancer les tests pour
un plugin qui fait parti de la source de votre application, d'abord faîtes la
commande ``cd`` vers le répertoire du plugin, ensuite utilisez la commande
``phpunit`` qui correspond à la façon dont vous avez installé phpunit:

.. code-block:: console

    cd plugins

    ../vendor/bin/phpunit

    php ../phpunit.phar

Pour lancer les tests sur un plugin séparé, vous devez d'abord installer le
projet dans un répertoire séparé et installer ses dépendances:

.. code-block:: console

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

.. code-block:: console

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

.. code-block:: console

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Cela mettra la couverture des résultats dans le répertoire webroot de votre
application. Vous pourrez voir les résultats en allant à
``http://localhost/votre_app/coverage``.

Vous pouvez aussi utiliser ``phpdbg`` pour générer la couverture des résultats à
la place de xdebug. ``phpdbg`` est généralement plus rapide dans la génération
des rapports de couverture:

.. code-block:: console

    $ phpdbg -qrr phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

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
peut utiliser les **fixtures** comme une façon de créer un état initial pour les
tests de votre application. En utilisant les données de fixture vous réduiser
les étapes de configuration répétitives dans vos tests. Les fixtures sont bien
adaptées pour des données communes, ou partagées entre de nombreux tests, voire
tous. Les données qui ne sont utiles que dans quelques tests devraient plutôt
être crées dans les tests qui en ont besoin.

CakePHP utilise la connexion nommée ``test`` dans votre fichier de configuration
**config/app.php**. Si la connexion n'est pas utilisable, une exception
sera levée et vous ne pourrez pas utiliser les fixtures de la base de données.

CakePHP effectue ce qui suit pendant le déroulement d'un test:

#. Crée les tables pour chacune des fixtures nécessaires.
#. Remplit les tables avec les données.
#. Lance les méthodes de test.
#. Vide les tables de fixture.

Le schéma pour les fixtures est créé au début d'un test par des migrations ou un
dump SQL.

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

.. _fixture-phpunit-configuration:

Configuration de PHPUnit
------------------------

Avant de pouvoir utiliser les fixtures vous devez vous assurer que votre
``phpunit.xml`` contienne l'extension fixture:

.. code-block:: xml

    <!-- dans phpunit.xml -->
    <!-- Configurer l'extension pour les fixtures -->
    <extensions>
        <extension class="\Cake\TestSuite\Fixture\PHPUnitExtension" />
    </extensions>

L'extension est incluse par défaut dans votre application et vos plugins générés
par ``bake``.

Avant 4.3.0, CakePHP utilisait un listener PHPUnit au lieu d'une extension
PHPUnit et votre fichier ``phpunit.xml`` devait contenir:

.. code-block:: xml

    <!-- dans phpunit.xml -->
    <!-- Définir un listener pour les fixtures -->
    <listeners>
        <listener
        class="\Cake\TestSuite\Fixture\FixtureInjector">
            <arguments>
                <object class="\Cake\TestSuite\Fixture\FixtureManager" />
            </arguments>
        </listener>
    </listeners>

Le listener est déprécié et vous devriez
:doc:`mettre à niveau votre configuration de fixture </appendices/fixture-upgrade>`.

.. _creating-test-database-schema:

Créer un Schéma de Base de Données de Test
------------------------------------------

Vous pouvez générer un schéma de base de données de test soit par des migrations
de CakePHP, soit en chargeant un fichier de dump SQL, soit en utilisant un autre
outil externe de gestion de schéma. Vous devez créer votre schéma dans le
fichier ``tests/bootstrap.php`` de votre application.

Si vous utilisez le :doc:`plugin de migrations </migrations>`  de CakePHP pour gérer
les schémas de votre application, vous pouvez tout aussi bien réutiliser ces
migrations pour générer le schéma de votre base de données de test::

    // dans tests/bootstrap.php
    use Migrations\TestSuite\Migrator;

    $migrator = new Migrator();

    // Configuration simple sans plugin
    $migrator->run();

    // Lancer les migrations pour plusieurs plugins
    $migrator->run(['plugin' => 'Contacts']);

    // Lancer les migrations Documents sur la connexion test_docs.
    $migrator->run(['plugin' => 'Documents', 'connection' => 'test_docs']);

Si vous avez besoin de lancer plusieurs ensembles de migrations, vous pouvez le
faire comme ceci::

    $migrator->runMany([
        // Lancer les migrations de l'application sur la connexion test
        ['connection' => 'test'],
        // Lancer les migrations du plugin Contacts sur la connexion test
        ['plugin' => 'Contacts'],
        // Lancer les migrations du plugin Documents sur la connexion test_docs
        ['plugin' => 'Documents', 'connection' => 'test_docs']
    ]);

L'utilisation de ``runMany()`` vous garantit que les plugins qui partagent une
même base de données ne risquent pas de supprimer des tables quand chaque
ensemble de migrations est lancé.

Le plugin de migrations lancera uniquement les migrations qui n'ont pas été
appliquées, et réinitialisera les migrations si l'en-tête de votre migration
actuelle est différente des migrations appliquées.

Vous pouvez aussi configurer dans vos datasources la façon dont les migrations
doivent être lancées dans les tests. Consultez la
:doc:`documentation des migrations </migrations>` pour plus d'information.

Pour charger un fichier de dump SQL, vous pouvez faire ceci::

    // dans tests/bootstrap.php
    use Cake\TestSuite\Fixture\SchemaLoader;

    // Charger un ou plusieurs fichiers SQL.
    (new SchemaLoader())->loadSqlFiles('chemin/vers/le/schema.sql', 'test');

Au début du lancement de chaque test, ``SchemaLoader`` supprimera toutes les
tables dans la connexion et les reconstruira à partir du fichier de schéma
fourni.

.. versionadded:: 4.3.0
    SchemaLoader a été ajouté.

.. _fixture-state-management:

Gestionnaires d'Etat des Fixtures
---------------------------------

Par défaut, CakePHP réinitialise l'état des fixtures à la fin de chaque test en
tronquant toutes les tabes dans la base de données. Cette opération peut devenir
coûteuse quand votre application grossit. Si vous utilisez
``TransactionStrategy``, chaque méthode de test sera lancée à l'intérieur d'une
transaction suivie d'un rollback à la fin du test. Cela peut améliorer vos
performances mais nécessite que vos tests ne dépendent pas trop de données
statiques de fixtures, car les valeurs des auto-incréments ne sont pas
réinitialisées avant chaque test.

La stratégie de gestion de l'état des fixtures peut être définie à l'intérieur
du test::

    use Cake\TestSuite\TestCase;
    use Cake\TestSuite\Fixture\FixtureStrategyInterface;
    use Cake\TestSuite\Fixture\TransactionStrategy;

    class ArticlesTableTest extends TestCase
    {
        /**
         * Crée la stratégie de fixation utilisée pour ce cas de test.
         * Vous pouvez utiliser une classe/un trait de base pour modifier
         * plusieurs classes.
         */
        protected function getFixtureStrategy(): FixtureStrategyInterface
        {
            return new TransactionStrategy();
        }
    }

.. versionadded:: 4.3.0

Créer les Fixtures
------------------

Les fixtures définissent les enregistrements qui seront insérés dans la base de
données au démarrage de chaque test. Créons notre
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

Nous pouvons définir un ensemble d'enregistrements qui seront remplis après que
la table de fixture est créée. Le format est assez simple, ``$records`` est un
tableau d'enregistrements. Chaque item dans ``$records`` doit être
un enregistrement (une seule ligne). A l'intérieur de chaque ligne, il doit y
avoir un tableau associatif des colonnes et valeurs pour la ligne. Gardez juste
à l'esprit que tous les enregistrements dans le tableau ``$records`` doivent
avoir les mêmes clés car les lignes sont insérées en une seule requête SQL.

.. versionchanged:: 4.3.0

    Avant 4.3.0 les fixtures définissaient aussi le schéma de la table. Pour en
    savoir plus, consultez :ref:`fixture-schema` si vous avez encore besoin de
    définir le schéma dans vos fixtures.

Les Données Dynamiques
----------------------

Pour utiliser des fonctions ou d'autres données dynamiques dans les
enregistrements de vos fixtures, vous pouvez définir vos enregistrements dans la
méthode ``init()`` des fixtures::

    namespace App\Test\Fixture;

    use Cake\TestSuite\Fixture\TestFixture;

    class ArticlesFixture extends TestFixture
    {
        public function init(): void
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

.. note::
    Quand vous surchargez ``init()``, rappelez-vous juste de toujours appeler
    ``parent::init()``.

Charger les Fixtures dans vos Tests (TestCase)
----------------------------------------------

Après avoir créé vos fixtures, vous pouvez les utiliser dans vos cas de test.
Dans chaque cas de test vous devriez charger les fixtures dont vous aurez
besoin. Vous devriez charger une fixture pour chaque model qui aura une requête
lancée contre elle. Pour charger les fixtures, vous définissez la propriété
``$fixtures`` dans votre model::

    class ArticleTest extends TestCase
    {
        protected $fixtures = ['app.articles', 'app.comments'];
    }

Ce qui est au-dessus va charger les fixtures d'Article et de Comment à partir
du répertoire de fixture de l'application. Vous pouvez aussi charger les
fixtures à partir du cœur de CakePHP ou des plugins::

    class ArticlesTest extends TestCase
    {
        public $fixtures = ['plugin.DebugKit.articles', 'plugin.MyVendorName/MyPlugin.messages', 'core.comments'];
    }

Utiliser le préfixe ``core`` va charger les fixtures à partir de CakePHP, et
utiliser un nom de plugin en préfixe chargera la fixture à partir d'un plugin
nommé.

À partir de 4.1.0 vous pouvez utiliser ``getFixtures()`` pour définir votre
liste de fixtures avec une méthode::

    public function getFixtures(): array
    {
        return [
            'app.Articles',
            'app.Comments',
        ];

    }

Vous pouvez charger les fixtures dans les sous-répertoires.
Utiliser plusieurs répertoires peut faciliter l'organisation de vos fixtures si
vous avez une application plus grande. Pour charger les fixtures dans les
sous-répertoires, incluez simplement le nom du sous-répertoire dans le nom de
la fixture::

    class ArticlesTableTest extends CakeTestCase
    {
        protected $fixtures = ['app.blog/articles', 'app.blog/comments'];
    }

Dans l'exemple ci-dessus, les deux fixtures seront chargées à partir de
``tests/Fixture/blog/``.

Fixture Factories
-----------------

Le nombre et la taille de vos fixtures vont croissantes avec la taille votre application. Il est possible qu'à
un certain point, vous ne soyez plus en mesure les maintenir.

Le `fixture factories plugin <https://github.com/vierge-noire/cakephp-fixture-factories>`__ propose une
alternative efficace pour des applications de taille moyenne et plus.

Le plugin utilise le `test suite light plugin <https://github.com/vierge-noire/cakephp-test-suite-light>`__
afin de tronquer les tables non vierges avant chaque test.

La commande bake suivante vous assistera pour créer vos factories::

    bin/cake bake fixture_factory -h

Une fois vos factories
`mises en place <https://github.com/vierge-noire/cakephp-fixture-factories/blob/main/docs/factories.md>`__,
vous voilà équipés pour créer vos fixtures de test à vitesse folle.

Les intéractions non nécessaires avec la base de donnée ralentissent les tests, ainsi que votre application.
Il est possible de créer des fixtures sans les insérer. Ceci est utile lorsque vous testez des méthodes
qui n'intéragissent pas avec la base de donnée::

    $article = ArticleFactory::make()->getEntity();

Pour insérer dans la base de donnée::

    $article = ArticleFactory::make()->persist();

En supposant que les articles appartiennent à plusieurs auteurs, il est possible de créer 5 articles ayant chacun
2 auteurs de la manière suivante::

    $articles = ArticleFactory::make(5)->with('Authors', 2)->getEntities();

Notez que bien que les factories ne nécessitent ni la création, ni la déclaration de fixtures, elles sont
parfaitement compatibles avec ces dernières. Pour plus de détails,
rendez-vous `ici <https://github.com/vierge-noire/cakephp-fixture-factories>`_.

Charger des Routes dans les Tests
---------------------------------

Si vous testez des mailers, des composants de controllers ou d'autres classes
qui ont besoin de routes et qui résolvent des URLs, vous aurez besoin de charger
des routes. Pendant le ``setUp()`` d'une classe ou pendant les méthodes de tests
individuelles vous pouvez utiliser ``loadRoutes()`` pour vous assurer que les
routes de votre application sont chargées::

    public function setUp(): void
    {
        parent::setUp();
        $this->loadRoutes();
    }

Cette méthode construira une instance de votre ``Application`` et appellera la
méthode ``routes()`` dessus. Si votre classe ``Application`` a besoin de
paramètres de constructeur spécialisés, vous pouvez les fournir à
``loadRoutes($constructorArgs)``.

Création de routes dans les tests
---------------------------------

Parfois, il peut être nécessaire d'ajouter dynamiquement des routes dans les tests,
par exemple lors du développement de plugins, ou d'applications qui sont extensibles.

Tout comme le chargement de routes d'applications existantes, ceci peut être fait
pendant ``setup()`` d'une méthode de test, et/ou dans les méthodes de test individuelles
elles-mêmes::

    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Router;
    use Cake\TestSuite\TestCase;

    class PluginHelperTest extends TestCase
    {
        protected RouteBuilder $routeBuilder;

        public function setUp(): void
        {
            parent::setUp();

            $this->routeBuilder = Router::createRouteBuilder('/');
            $this->routeBuilder->scope('/', function (RouteBuilder $routes) {
                $routes->setRouteClass(DashedRoute::class);
                $routes->get(
                    '/test/view/{id}',
                    ['controller' => 'Tests', 'action' => 'view']
                );
                // ...
            });

            // ...
        }
    }

Ceci créera une nouvelle instance de route builder qui fusionnera les routes connectées
dans la même collection de routes utilisée par toutes les autres instances de route
builder qui qui peuvent déjà exister, ou qui doivent encore être créées dans
l'environnement.

Charger des Plugins dans les Tests
----------------------------------

Si votre application est censée charger des plugins dynamiquement, vous pouvez
utiliser ``loadPlugins()`` pour charger un ou plusieurs plugins pendant les
tests::

    public function testMethodUsingPluginResources()
    {
        $this->loadPlugins(['Company/Cms']);
        // Tester la logique qui nécessite d'avoir chargé Company/Cms.
    }

Tester les Classes Table
========================

Disons que nous avons déjà notre table Articles définie dans
**src/Model/Table/ArticlesTable.php**, qui ressemble à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options): Query
        {
            $query->where([
                $this->alias() . '.published' => 1
            ]);
            return $query;
        }
    }

Nous voulons maintenant configurer un test qui va tester ce model tout
en utilisant les Fixtures pour garder nos Tests isolés. Créons  un fichier
nommé **ArticlesTableTest.php** dans notre répertoire
**tests/TestCase/Model/Table**, avec le contenu suivant::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.articles'];
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
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.articles'];

        public function setUp(): void
        {
            parent::setUp();
            $this->Articles = $this->getTableLocator()->get('Articles');
        }

        public function testFindPublished(): void
        {
            $query = $this->Articles->find('published')->all();
            $this->assertInstanceOf('Cake\ORM\Query', $query);
            $result = $query->enableHydration(false)->toArray();
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
enregistrements qui sont remplis initialement dans la table articles). Nous
testons que les résultats correspondent à nos attentes en utilisant la méthode
``assertEquals()``. Regardez la section sur les :ref:`running-tests` pour plus
d'informations sur la façon de lancer les cas de test.

En utilisant les fixture factories, le test se présente ainsi::

    namespace App\Test\TestCase\Model\Table;

    use App\Test\Factory\ArticleFactory;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        public function testFindPublished(): void
        {
            // Insérer 3 articles publiés
            $articles = ArticleFactory::make(['published' => 1], 3)->persist();
            // Insérer 2 articles non publiés
            ArticleFactory::make(['published' => 0], 2)->persist();

            $result = ArticleFactory::find('published')->find('list')->toArray();

            $expected = [
                $articles[0]->id => $articles[0]->title,
                $articles[1]->id => $articles[1]->title,
                $articles[2]->id => $articles[2]->title,
            ];

            $this->assertEquals($expected, $result);
        }
    }

Aucune fixture n'est déclarée. Les 5 articles créés n'existeront que pour ce test. La méthode statique ``::find()``
permet d'explorer la base de donnée sans évènements et sans recours à la table ``ArticlesTable``.

Méthodes de Mocking des Models
------------------------------

Il y aura des fois où vous voudrez mocker les méthodes sur les models quand vous
les testez. Vous devrez utiliser ``getMockForModel`` pour créer les mocks de
test des models. Cela évite des problèmes avec les propriétés réfléchies que
les mocks normaux ont::

    public function testSendingEmails(): void
    {
        $model = $this->getMockForModel('EmailVerification', ['send']);
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

Dans votre méthode ``tearDown()``, assurez-vous de retirer le mock avec ceci::

    $this->getTableLocator()->clear();

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
                $article = $this->Articles->newEntity($this->request->getData());
                if ($this->Articles->save($article)) {
                    // Redirige selon le pattern PRG
                    return $this->redirect(['action' => 'index']);
                }
            }
            if (!empty($short)) {
                $result = $this->Article->find('all', [
                        'fields' => ['id', 'title']
                    ])
                    ->all();
            } else {
                $result = $this->Article->find()->all();
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

    use Cake\TestSuite\IntegrationTestTrait;
    use Cake\TestSuite\IntegrationTestCase;

    class ArticlesControllerTest extends IntegrationTestCase
    {
        protected $fixtures = ['app.articles'];

        public function testIndex(): void
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexQueryData(): void
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // D'autres asserts.
        }

        public function testIndexShort(): void
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // D'autres asserts.
        }

        public function testIndexPostData(): void
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

            $articles = $this->getTableLocator()->get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

Cet exemple montre quelques méthodes d'envoi de requête et quelques
assertions qu'intègre ``IntegrationTestCase``. Avant de pouvoir utiliser les
assertions, vous aurez besoin de simuler une requête. Vous pouvez utiliser
l'une des méthodes suivantes pour simuler une requête:

* ``get()`` Envoie une requête GET.
* ``post()`` Envoie une requête POST.
* ``put()`` Envoie une requête PUT.
* ``delete()`` Envoie une requête DELETE.
* ``patch()`` Envoie une requête PATCH.
* ``options()`` Envoie une requête OPTIONS.
* ``head()`` Envoie une requête HEAD.

Toutes les méthodes exceptées ``get()`` et ``delete()`` acceptent un second
paramètre qui vous permet de saisir le corps d'une requête. Après avoir émis
une requête, vous pouvez utiliser les différentes assertions que fournit
``IntegrationTestCase`` ou PHPUnit afin de vous assurer que votre requête
possède de correctes effets secondaires.

Configurer la Requête
---------------------

La classe ``IntegrationTestCase`` intègre de nombreux helpers pour configurer
les requêtes que vous allez envoyer à votre controller::

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

    public function testAddUnauthenticatedFails(): void
    {
        // Pas de données de session définies.
        $this->get('/articles/add');

        $this->assertRedirect(['controller' => 'Users', 'action' => 'login']);
    }

    public function testAddAuthenticated(): void
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

Test de l'Authentification stateless (sans état) et des APIs
------------------------------------------------------------

Pour tester les APIs qui utilisent l'authentification stateless, vous pouvez,
comme pour l'authentification basic, configurer la demande de manière à ce
qu'elle injecte des variables d'environnement et des headers (en-têtes), ce qui
permettra de simuler les en-têtes d'une demande d'authentification réelle.

Lorsque vous testez l'authentification simple (Basic) ou de type "Digest", vous
pouvez ajouter les variables d'environnement que PHP crée
`<https://php.net/manual/fr/features.http-auth.php> `_ automatiquement.
Ces variables d'environnement utilisées dans l'adaptateur d'authentification sont
décrites dans: ref: `basic-authentication` ::

    public function testBasicAuthentication(): void
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

Si vous testez d'autres types d'authentification, tel que OAuth2, vous pouvez définir
l'en-tête d'autorisation directement::

    public function testOauthToken(): void
    {
        $this->configRequest([
            'headers' => [
                'authorization' => 'Bearer: oauth-token'
            ]
        ]);

        $this->get('/api/posts');
        $this->assertResponseOk();
    }

La clé des en-têtes dans ``configRequest()`` peut être utilisée pour configurer
tout en-tête HTTP supplémentaires nécessaires à une action.

Tester les Actions Protégées par CsrfComponent ou SecurityComponent
-------------------------------------------------------------------

Quand vous testez les actions protégées par SecurityComponent ou CsrfComponent,
vous pouvez activer la génération automatique de token pour vous assurer que vos
tests ne vont pas être en échec à cause d'un token non présent::

    public function testAdd(): void
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

Si votre action a besoin de champs déverrouillés vous pouvez les déclarer avec
``setUnlockedFields()``::

    $this->setUnlockedFields(['dynamic_field']);

Test d'intégration sur les middlewares PSR-7
--------------------------------------------

Les tests d'intégration peuvent aussi être utilisés pour tester entièrement vos
applications PSR-7 et les :doc:`/controllers/middleware`. Par défaut,
``IntegrationTestCase`` détectera automatiquement la présence d'une classe
``App\Application`` et activera automatiquement les tests d'intégration sur
votre Application.

Vous pouvez personnaliser le nom de la classe Application utilisé ainsi que les
arguments du contructeur en utilisant la méthode ``configApplication()``::

    public function setUp(): void
    {
        $this->configApplication('App\App', [CONFIG]);
    }

Vous devriez également faire en sorte d'utiliser :ref:`application-bootstrap`
pour charger les plugins qui contiennent des événements et des routes. De cette
manière, vous vous assurez que les événements et les routes seront connectés pour
chacun de vos "test case".

Tester avec des cookies chiffrés
--------------------------------

Si vous utilisez le :ref:`encrypted-cookie-middleware` dans votre application,
il y a des méthodes pratiques pour définir des cookies chiffrés dans vos
*test cases*::

    // Définit un cookie en utilisant AES et la clé par défaut.
    $this->cookieEncrypted('my_cookie', 'Some secret values');

    // Partons du principe que cette requête modifie le cookie.
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('An updated value', 'my_cookie');

Tester les Messages Flash
-------------------------

Si vous souhaitez faire une assertion sur la présence de messages Flash en
session et pas sur le rendu du HTML, vous pouvez utiliser ``enableRetainFlashMessages()``
dans vos tests pour que les messages Flash soient conservés dans la session
pour que vous puissez écrire vos assertions::

    // Active la rétention des messages flash plutôt que leur consommation
    $this->enableRetainFlashMessages();
    $this->get('/bookmarks/delete/9999');

    $this->assertSession('That bookmark does not exist', 'Flash.flash.0.message');

Tester un controller retournant du JSON
---------------------------------------

JSON est un format commun à utiliser lors de la conception de web service. Tester les
points de terminaisons (endpoints) de votre web service est très simple avec CakePHP.
Commençons avec un simple exemple de controller qui renvoie du JSON::

    class MarkersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function view($id)
        {
            $marker = $this->Markers->get($id);
            $this->set('marker', $marker);
            $this->viewBuilder()->setOption('serialize', ['marker']);
        }
    }

Créons maintenant le fichier **tests/TestCase/Controller/MarkersControllerTest.php**
et assurons-nous que le web service répond correctement::

    class MarkersControllerTest extends IntegrationTestCase
    {

        public function testGet(): void
        {
            $this->configRequest([
                'headers' => ['Accept' => 'application/json']
            ]);
            $result = $this->get('/markers/view/1.json');

            // Vérification que la réponse était bien une 200
            $this->assertResponseOk();

            $expected = [
                ['id' => 1, 'lng' => 66, 'lat' => 45],
            ];
            $expected = json_encode($expected, JSON_PRETTY_PRINT);
            $this->assertEquals($expected, $this->_response->body());
        }
    }

Nous utilisons l'option ``JSON_PRETTY_PRINT`` car la vue qui retourne la représentation
JSON intégrée à CakePHP (JsonView) utilise cette option quand le mode ``debug`` est
activé.

Test avec téléchargement de fichiers
------------------------------------

La simulation du téléchargement de fichiers est simple lorsque vous utilisez le
mode par défaut ":ref:`fichiers téléchargés en tant qu'objets <request-file-uploads>`".
Vous pouvez simplement créer des instances qui implémentent
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__
(l'implémentation par défaut actuellement utilisée par CakePHP est
``\Laminas\Diactoros\UploadedFile``), et les passer dans vos données de demande
de test. Dans l'environnement CLI, ces objets passeront par défaut les contrôles
de validation qui testent si le fichier a été téléchargé via HTTP. Il n'en va pas
de même pour les données de type tableau comme celles que l'on trouve dans
``$_FILES``, ce contrôle échouerait.

Afin de simuler exactement comment les objets de fichiers téléchargés seraient
présents dans une requête normale, vous devez non seulement les passer dans les
données de la requête, mais aussi les passer dans la configuration de la requête
de test via l'option "files". Ce n'est pas techniquement nécessaire, sauf si
votre code accède aux fichiers téléchargés via les méthodes
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` ou
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()`.

Supposons que les articles aient une image d'accroche, et une association
``Articles hasMany Attachments``, le formulaire ressemblerait à quelque chose
comme ceci en conséquence, où un fichier image, et plusieurs fichiers/attaches
seraient acceptés::

    <?= $this->Form->create($article, ['type' => 'file']) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('teaser_image', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.description']) ?>
    <?= $this->Form->control('attachments.1.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.1.description']) ?>
    <?= $this->Form->button('Submit') ?>
    <?= $this->Form->end() ?>

Le test qui simulerait la demande correspondante pourrait ressembler à ceci::

    public function testAddWithUploads(): void
    {
        $teaserImage = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.jpg', // flux ou chemin d'accès au fichier représentant le fichier temporaire
            12345,                    // la taille des fichiers en octets
            \UPLOAD_ERR_OK,           // le statut de téléchargement ou d'erreur
            'teaser.jpg',             // le nom du fichier tel qu'il a été envoyé par le client
            'image/jpeg'              // le mimétisme tel qu'envoyé par le client
        );

        $textAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.txt',
            'text/plain'
        );

        $pdfAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.pdf',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.pdf',
            'application/pdf'
        );

        // Ce sont les données accessibles via `$this->request->getUploadedFile()`
        // et `$this->request->getUploadedFiles()`.
        $this->configRequest([
            'files' => [
                'teaser_image' => $teaserImage,
                'attachments' => [
                    0 => [
                        'attachment' => $textAttachment,
                    ],
                    1 => [
                        'attachment' => $pdfAttachment,
                    ],
                ],
            ],
        ]);

        // Ce sont les données accessibles via `$this->request->getData()`.
        $postData = [
            'title' => 'Nouvel Article',
            'teaser_image' => $teaserImage,
            'attachments' => [
                0 => [
                    'attachment' => $textAttachment,
                    'description' => 'Fichier texte',
                ],
                1 => [
                    'attachment' => $pdfAttachment,
                    'description' => 'Fichier PDF',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage('L'article a été sauvegardé avec succès');
        $this->assertFileExists('/path/to/uploads/teaser.jpg');
        $this->assertFileExists('/path/to/uploads/attachment.txt');
        $this->assertFileExists('/path/to/uploads/attachment.pdf');
    }

.. tip::

    Si vous configurez la demande de test avec des fichiers, alors elle *doit*
    correspondre à la structure de vos données POST (mais n'inclure que les
    objets de fichiers téléchargés)!

De même, vous pouvez simuler des `erreurs de téléchargement <https://www.php.net/manual/en/features.file-upload.errors.php>`_
ou d'autres fichiers invalides qui ne passent pas la validation::

    public function testAddWithInvalidUploads(): void
    {
        $missingTeaserImageUpload = new \Laminas\Diactoros\UploadedFile(
            '',
            0,
            \UPLOAD_ERR_NO_FILE,
            '',
            ''
        );

        $uploadFailureAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.txt',
            1234567890,
            \UPLOAD_ERR_INI_SIZE,
            'attachment.txt',
            'text/plain'
        );

        $invalidTypeAttachment = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.exe',
            12345,
            \UPLOAD_ERR_OK,
            'attachment.exe',
            'application/vnd.microsoft.portable-executable'
        );

        $this->configRequest([
            'files' => [
                'teaser_image' => $missingTeaserImageUpload,
                'attachments' => [
                    0 => [
                        'file' => $uploadFailureAttachment,
                    ],
                    1 => [
                        'file' => $invalidTypeAttachment,
                    ],
                ],
            ],
        ]);

        $postData = [
            'title' => 'Nouvel Article',
            'teaser_image' => $missingTeaserImageUpload,
            'attachments' => [
                0 => [
                    'file' => $uploadFailureAttachment,
                    'description' => 'Pièce jointe de d'échec du téléchargement',
                ],
                1 => [
                    'file' => $invalidTypeAttachment,
                    'description' => 'Pièce jointe de type invalide',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage("L'article n'a pas pu être sauvé");
        $this->assertResponseContains("Une image d'accroche est nécessaire");
        $this->assertResponseContains('Dépassement de la taille maximale autorisée des fichiers');
        $this->assertResponseContains('Type de fichier non supporté');
        $this->assertFileNotExists('/path/to/uploads/teaser.jpg');
        $this->assertFileNotExists('/path/to/uploads/attachment.txt');
        $this->assertFileNotExists('/path/to/uploads/attachment.exe');
    }

Désactiver le Middleware de Gestion d'Erreurs dans les Tests
------------------------------------------------------------

Quand vous debuggez des tests qui échouent car l'application a rencontré des
erreurs, il peut être utile de désactiver temporairement le middleware de gestion
des erreurs pour permettre aux erreurs de remonter. Vous pouvez utiliser la méthode
``disableErrorHandlerMiddleware()`` pour permettre ce comportement::

    public function testGetMissing(): void
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

Dans l'exemple ci-dessus, le test échouera et le message d'exception et le stack-trace
seront affichés à la place de la page d'erreur de l'application.

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

    // Vérifie que l'en-tête location ne contient pas...
    $this->assertRedirectNotContains('/articles/edit/');

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

    // Vérifie l'en-tête de la réponse.
    $this->assertHeader('Content-Type', 'application/json');
    $this->assertHeaderContains('Content-Type', 'html');

    // Vérifie que l'en-tête de la réponse ne contient pas de xml
    $this->assertHeaderNotContains('Content-Type', 'xml');

    // Vérifie le contenu d'une variable.
    $user =  $this->viewVariable('user');
    $this->assertEquals('jose', $user->username);

    // Vérifie les cookies.
    $this->assertCookie('1', 'thingid');

    // Vérifie le type de contenu
    $this->assertContentType('application/json');

En plus des méthodes d'assertion ci-dessus, vous pouvez également utiliser
toutes les assertions de `TestSuite
<https://api.cakephp.org/4.x/class-Cake.TestSuite.TestCase.html>`_ et celles
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

        public function setUp(): void
        {
            $this->_compareBasePath = APP . 'tests' . DS . 'comparisons' . DS;
            parent::setUp();
        }

        public function testExample(): void
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

.. code-block:: console

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


Tests d'Intégration de la Console
=================================

Voir la :ref:`console-integration-testing` pour savoir comment tester les
commandes.

Mocker les Injections de Dépendances
====================================

Voir :ref:`mocking-services-in-tests` pour savoir comment remplacer des services
injectés avec le conteneur d'injection de dépendances dans vos tests
d'intégration.

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
`Selenium webdriver <https://www.selenium.dev/>`_.

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
            $this->setController($event->getSubject());
        }

        public function adjust($length = 'short'): void
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
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;
    use Cake\TestSuite\TestCase;

    class PagematronComponentTest extends TestCase
    {
        protected $component;
        protected $controller;

        public function setUp(): void
        {
            parent::setUp();
            // Configuration de notre component et de notre faux controller de test.
            $request = new ServerRequest();
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

        public function testAdjust(): void
        {
            // Test de notre méthode avec différents paramètres.
            $this->component->adjust();
            $this->assertEquals(20, $this->controller->paginate['limit']);

            $this->component->adjust('medium');
            $this->assertEquals(50, $this->controller->paginate['limit']);

            $this->component->adjust('long');
            $this->assertEquals(100, $this->controller->paginate['limit']);
        }

        public function tearDown(): void
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

Tout d'abord, nous créons un exemple de helper à tester.
``CurrencyRendererHelper`` va nous aider à afficher les monnaies dans nos vues
et pour simplifier, il ne va avoir qu'une méthode ``usd()``::

    // src/View/Helper/CurrencyRendererHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper;

    class CurrencyRendererHelper extends Helper
    {
        public function usd($amount): string
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
        public function setUp(): void
        {
            parent::setUp();
            $View = new View();
            $this->helper = new CurrencyRendererHelper($View);
        }

        // Test de la fonction usd()
        public function testUsd(): void
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

        public function place($order): bool
        {
            if ($this->save($order)) {
                // moved cart removal to CartsTable
                $event = new Event('Model.Order.afterPlace', $this, [
                    'order' => $order
                ]);
                $this->getEventManager()->dispatch($event);
                return true;
            }
            return false;
        }
    }

    class CartsTable extends Table
    {

        public function implementedEvents(): array
        {
            return [
                'Model.Order.afterPlace' => 'removeFromCart'
            ];
        }

        public function removeFromCart(EventInterface $event): void
        {
            $order = $event->getData('order');
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
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {

        protected $fixtures = ['app.orders'];

        public function setUp(): void
        {
            parent::setUp();

            $this->Orders = $this->getTableLocator()->get('Orders');

            // enable event tracking
            $this->Orders->eventManager()->setEventList(new EventList());
        }

        public function testPlace(): void
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
        protected $fixtures = ['plugin.blog.blog_posts'];

        public function testSomething(): void
        {
            // Teste quelque chose.
        }
    }

Si vous voulez utiliser les fixtures de plugin dans les app tests, vous pouvez
y faire référence en utilisant la syntaxe ``plugin.pluginName.fixtureName``
dans le tableau ``$fixtures``.

Avant d'utiliser des fixtures, assurez-vous que le
:ref:`listener de fixture <fixture-phpunit-configuration>` soit configuré dans
votre fichier ``phpunit.xml``.
Vous devez également vous assurer que vos fixtures sont chargeables.
Vérifiez que le code suivant est présent dans votre fichier **composer.json**::

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

.. code-block:: console

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

.. meta::
    :title lang=fr: Test
    :keywords lang=fr: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
