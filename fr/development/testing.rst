Testing
#######

CakePHP fournit un support de test intégré complet. CakePHP permet
l'intégration de `PHPUnit <https://phpunit.de>`_. En plus de toutes les
fonctionnalités offertes par PHPUnit, CakePHP offre quelques fonctionnalités
supplémentaires pour faciliter le test. Cette section va couvrir l'installation
de PHPUnit, comment démarrer avec les Tests Unitaires, et comment utiliser les
extensions offertes par CakePHP.

Installer PHPUnit
=================

CakePHP utilise PHPUnit comme framework de test sous-jacent. PHPUnit est *de
facto* le standard des tests unitaires en PHP. Il offre un ensemble de
fonctionnalités profondes et puissantes pour s'assurer que votre code fait ce
que vous pensez qu'il fait. PHPUnit peut être installé soit avec le `package PHAR
<https://phpunit.de/#download>`__, soit avec
`Composer <https://getcomposer.org>`_.

Installer PHPUnit avec Composer
-------------------------------

Pour installer PHPUnit avec Composer:

.. code-block:: console

    $ php composer.phar require --dev phpunit/phpunit:"^8.5"

Cela va ajouter la dépendance à la section ``require-dev`` de votre
``composer.json``, et ensuite installer PHPUnit au même endroit que vos autres
dépendances.

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

Pensez à activer le débogage dans votre fichier **config/app_local.php** avant
de lancer des tests. Vous devrez aussi vous assurer d'avoir ajouté une
configuration de base de données ``test`` dans **config/app_local.php**.
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
    votre base de données actuelle. Cela évitera les erreurs embarrassantes qui
    ne manqueront pas d'arriver.

Vérifier la Configuration Test
==============================

Après avoir installé PHPUnit et configuré la configuration de la base de données
de ``test``, vous pouvez vous assurer que vous êtes prêt à écrire et lancer
vos propres tests en lançant un de ceux présents dans le cœur:

.. code-block:: console

    # Pour phpunit.phar
    $ php phpunit.phar

    # Pour un PHPUnit installé avec Composer
    $ vendor/bin/phpunit

Ceci va lancer tous les tests que vous avez, ou vous indiquer
qu'aucun test n'a été lancé. Pour lancer un test spécifique, vous pouvez fournir
le chemin du test en paramètre à PHPUnit. Par exemple, si vous aviez un cas
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
#. Les noms de ces fichiers doivent finir par **Test.php** et pas seulement
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
helper très simple. Le helper que nous allons tester fomatera une
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

C'est un exemple très simple, mais ce sera utile pour montrer comment
créer un cas de test simple. Après avoir créé et sauvegardé notre
helper, nous allons créer le fichier de cas de tests dans
**tests/TestCase/View/Helper/ProgressHelperTest.php**. Dans ce fichier, nous
allons commencer avec ceci::

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
Ces méthodes d'initialisation devraient initialiser les objets dont nous aurons
besoin pour le test, et faire toute configuration nécessaire. Dans notre méthode
d'initialisation, nous allons ajouter ce code::

    public function setUp(): void
    {
        parent::setUp();
        $View = new View();
        $this->Progress = new ProgressHelper($View);
    }

Appeler la méthode parente est importante dans les cas de test, puisque
``TestCase::setUp()`` fait un certain nombre de choses comme sauvegarder les
valeurs dans :php:class:`~Cake\\Core\\Configure` et stocker les chemins dans
:php:class:`~Cake\\Core\\App`.

Ensuite, nous allons remplir la méthode de test. Nous utiliserons quelques
assertions pour nous assurer que notre code crée la sortie que nous attendons::

    public function testBar(): void
    {
        $result = $this->Progress->bar(90);
        $this->assertStringContainsString('width: 90%', $result);
        $this->assertStringContainsString('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertStringContainsString('width: 33%', $result);
    }

C'est un test simple mais il montre le bénéfice potentiel de l'utilisation
des cas de test. Nous utilisons ``assertStringContainsString()`` pour nous assurer que notre
helper retourne une chaîne qui contient le contenu que nous attendons. Si le
résultat ne contient pas le contenu attendu le test sera un échec, et nous
savons que notre code est incorrect.

En utilisant les cas de test, vous pouvez décrire la relation entre un ensemble
d'entrées connues et leur sortie attendue. Cela vous rend plus confiant dans
le code que vous écrivez puisque vous pouvez vérifier que le code que vous avez
déjà écrit remplit les attentes et les assertions vérifiées dans vos tests. De
plus, puisque les tests sont du code, ils peuvent être re-lancés à chaque
changement. Cela évite la création de nouveaux bugs.

.. note::

    L'EventManager est remis à blanc pour chaque méthode de test. Cela signifie
    que lorsque vous lancez plusieurs tests en une fois, vous perdez les
    écouteurs d'events qui ont été enregistrés dans config/bootstrap.php puisque
    le bootstrap n'est exécuté qu'une seule fois.

.. _running-tests:

Lancer les Tests
================

Une fois que vous aurez installé PHPUnit et écrit quelques cas de tests, vous
voudrez probablement lancer les cas de test très fréquemment. C'est une
bonne idée de lancer les tests avant de committer chaque changement pour aider
à vous assurer que vous n'avez rien cassé.

En utilisant ``phpunit``, vous pouvez lancer les tests de votre application.
Pour lancer vos tests d'application, vous pouvez simplement lancer:

.. code-block:: console

    vendor/bin/phpunit

    php phpunit.phar

Si vous avez cloné le `code source de CakePHP à partir de GitHub
<https://github.com/cakephp/cakephp>`__
et que vous souhaitez exécuter les tests unitaires de CakePHP, n'oubliez pas
d'exécuter la commande suivante de ``Composer`` avant de lancer ``phpunit`` pour
que toutes les dépendances soient installées:

.. code-block:: console

    composer install

À partir du répertoire racine de votre application. Pour lancer les tests pour
un plugin qui fait partie de la source de votre application, appliquez d'abord
la commande ``cd`` vers le répertoire du plugin, puis utilisez la commande
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

Filtrer les Cas de Test
-----------------------

Quand vous avez de nombreux cas de test et que vous travaillez sur un seul test
qui échoue, vous préférerez lancer seulement une partie des méthodes de test.
Avec l'exécuteur en ligne de commande vous pouvez utiliser une option pour
filtrer les méthodes de test:

.. code-block:: console

    $ phpunit --filter testSave tests/TestCase/Model/Table/ArticlesTableTest

Le paramètre filter est utilisé comme une expression régulière sensible à la
casse pour filtrer les méthodes de test à lancer.

Générer une Couverture de Code (Code Coverage)
----------------------------------------------

Vous pouvez générer un rapport de couverture de code depuis la ligne de commande
en utilisant les outils de couverture de code intégrés à PHPUnit.
PHPUnit va générer un ensemble de fichiers statiques en HTML contenant les
résultats de couverture. Vous pouvez générer un rapport de couverture pour un
seul cas de test de la façon suivante:

.. code-block:: console

    $ phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Cela placera le résultat de couverture de code dans le répertoire webroot de
votre application. Vous pourrez voir les résultats en consultant
``http://localhost/votre_app/coverage``.

Vous pouvez aussi utiliser ``phpdbg`` pour générer la couverture des résultats à
la place de xdebug. ``phpdbg`` est généralement plus rapide dans la génération
des rapports de couverture:

.. code-block:: console

    $ phpdbg -qrr phpunit --coverage-html webroot/coverage tests/TestCase/Model/Table/ArticlesTableTest

Combiner les Suites de Test pour les Plugins
--------------------------------------------

Souvent, votre application sera composée de plusieurs plugins. Dans ces
situations, il peut être assez fastidieux d'effectuer des tests pour chaque
plugin. Vous pouvez faire lancer des tests pour chaque plugin qui compose votre
application en ajoutant une section ``<testsuite>`` supplémentaire dans le
fichier ``phpunit.xml.dist`` de votre application:

.. code-block:: xml

    <testsuites>
        <testsuite name="app">
            <directory>./tests/TestCase</directory>
        </testsuite>

        <!-- Ajouter vos plugins -->
        <testsuite name="forum">
            <directory>./plugins/Forum/tests/TestCase/</directory>
        </testsuite>
    </testsuites>

Les suites de tests supplémentaires ajoutées à l'élément ``<testsuites>`` seront
exécutées automatiquement quand vous utiliserez ``phpunit``.

Si vous vous servez de ``<testsuites>`` pour utiliser des fixtures à partir de
plugins que vous avez installés avec composer, le fichier ``composer.json`` du
plugin doit ajouter le namespace de la fixture dans la section autoload.
Par exemple::

    "autoload-dev": {
        "psr-4": {
            "PluginName\\Test\\Fixture\\": "tests/Fixture/"
        }
    },

Callbacks du Cycle de Vie des Cas de Test
=========================================

Les cas de test de nombreux callbacks que vous pouvez utiliser quand pendant les
tests:

* ``setUp`` est appelé avant chaque méthode de test. Doit être utilisé pour
  créer les objets qui vont être testés, et initialiser les données pour le
  test. Rappelez-vous de toujours appeler ``parent::setUp()``.
* ``tearDown`` est appelé après chaque méthode de test. Doit être utilisé pour
  tout nettoyer une fois que le test est terminé. Rappelez-vous de toujours
  appeler ``parent::tearDown()``.
* ``setupBeforeClass`` est appelé une fois dans chaque cas de test avant que les
  méthodes de test aient démarré. Cette méthode doit être *statique*.
* ``tearDownAfterClass`` est appelé une fois dans chaque cas de test après que
  les méthodes de test aient démarré. Cette méthode doit être *statique*.

.. _test-fixtures:

Fixtures
========

Pour tester du code qui dépend de models et d'une base de données, il est
possible d'utiliser les **fixtures** comme une façon de créer un état initial
pour les tests de votre application. En utilisant des données de fixture, vous
réduisez des étapes de configuration répétitives dans vos tests. Les fixtures
sont bien adaptées pour des données qui sont communes, ou partagées entre de
nombreux tests, voire tous. Les données qui ne sont utiles que dans quelques
tests devraient plutôt être créées dans les tests qui en ont besoin.

CakePHP utilise la connexion nommée ``test`` dans votre fichier de configuration
**config/app.php**. Si cette connexion n'est pas utilisable, une exception
sera levée et vous ne pourrez pas utiliser les fixtures de base de données.

CakePHP accomplit les étapes suivantes pendant le déroulement d'un test:

#. Création des tables pour chacune des fixtures nécessaires.
#. Remplissage des tables avec des données.
#. Lancement des méthodes de test.
#. Vidage des tables de fixture.

Le schéma pour les fixtures est créé au début d'un test par des migrations ou un
dump SQL.

Connexions de Test
------------------

Par défaut, CakePHP va faire un alias pour chaque connexion de votre
application. Pour chaque connexion définie dans le bootstrap de votre
application qui ne commence pas par ``test_``, un alias va être créé avec le
préfixe ``test_``.
Le fait d'ajouter des alias de connexions garantit que vous n'utiliserez pas
accidentellement la mauvaise connexion dans les cas de test. Les alias de
connexions sont transparents pour le reste de votre application. Par exemple, si
vous utilisez la connexion 'default', vous obtiendrez à la place la connexion
``test`` dans les cas de test. Si vous utilisez la connexion 'replica', la suite
de tests tentera d'utiliser 'test_replica'.

.. _fixture-phpunit-configuration:

Configuration de PHPUnit
------------------------

Avant d'utiliser les fixtures vous devez vous assurer que votre
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

Si vous utilisez le `plugin de migrations <https://book.cakephp.org/migrations>`  de CakePHP pour gérer
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

.. _fixture-state-management:

Gestionnaires d'Etat des Fixtures
---------------------------------

Par défaut, CakePHP réinitialise l'état des fixtures à la fin de chaque test en
tronquant toutes les tables dans la base de données. Cette opération peut devenir
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
         * Crée la stratégie de fixtures utilisée pour ce cas de test.
         * Vous pouvez utiliser une classe/un trait pour modifier plusieurs classes.
         */
        protected function getFixtureStrategy(): FixtureStrategyInterface
        {
            return new TransactionStrategy();
        }
    }

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
                  'title' => 'Premier Article',
                  'body' => 'Contenu du premier Article',
                  'published' => '1',
                  'created' => '2007-03-18 10:39:23',
                  'modified' => '2007-03-18 10:41:31'
              ],
              [
                  'title' => 'Deuxième Article',
                  'body' => 'Contenu du deuxième Article',
                  'published' => '1',
                  'created' => '2007-03-18 10:41:23',
                  'modified' => '2007-03-18 10:43:31'
              ],
              [
                  'title' => 'Troisième Article',
                  'body' => 'Contenu du troisième Article',
                  'published' => '1',
                  'created' => '2007-03-18 10:43:23',
                  'modified' => '2007-03-18 10:45:31'
              ]
          ];
     }

.. note::

    Il est recommandé de ne pas ajouter manuellement des valeurs dans les
    colonnesavec autoincrément car cela interfère avec la génération
    de séquence dans PostgreSQL et SQLServer.

La propriété ``$connection`` définit la source de données que la fixture
va utiliser. Si votre application utilise plusieurs sources de données, vous
devriez faire correspondre les fixtures avec les sources de données du model,
en ajoutant le préfixe ``test_``.
Par exemple, si votre model utilise la source de données ``mydb``, votre
fixture devra utiliser la source de données ``test_mydb``. Si la connexion
``test_mydb`` n'existe pas, vos models utiliseront la source de données
``test`` par défaut. Les sources de données des fixtures doivent être préfixées
par ``test`` pour réduire la possibilité de tronquer accidentellement toutes
les données de votre application en lançant vos tests.

Nous pouvons définir un ensemble d'enregistrements qui seront insérés après la
création de la table de fixture. Le format parle de lui-même. ``$records`` est
un tableau d'enregistrements. Chaque item dans ``$records`` correspond à
un enregistrement (une seule ligne). À l'intérieur de chaque ligne, il doit y
avoir un tableau associatif des colonnes et valeurs pour la ligne. Gardez juste
à l'esprit que tous les enregistrements dans le tableau ``$records`` doivent
avoir les mêmes clés car les lignes sont insérées en une seule requête SQL.

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
                    'title' => 'Premier Article',
                    'body' => 'Contenu du premier Article',
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

Charger les Fixtures dans vos Tests
-----------------------------------

Une fois que vous avez créé vos fixtures, vous pouvez les utiliser dans vos cas
de test. Vous devez charger dans chaque cas de test les fixtures dont vous aurez
besoin. Vous devriez charger une fixture pour chaque model sur lequel une
requête sera exécutée. Pour charger les fixtures, définissez la propriété
``$fixtures`` dans votre model::

    class ArticleTest extends TestCase
    {
        protected $fixtures = ['app.Articles', 'app.Comments'];
    }

À partir de 4.1.0 vous pouvez utiliser ``getFixtures()`` pour définir votre
liste de fixtures depuis une méthode::

    public function getFixtures(): array
    {
        return [
            'app.Articles',
            'app.Comments',
        ];
    }

Ceci va charger les fixtures d'Article et de Comment à partir du répertoire
Fixture de votre application. Vous pouvez aussi charger des fixtures du cœur de
CakePHP ou des plugins::

    class ArticlesTest extends TestCase
    {
        protected $fixtures = [
            'plugin.DebugKit.Articles',
            'plugin.MonNomDeVendor/MonPlugin.Messages',
            'core.Comments'
        ];
    }

Utiliser le préfixe ``core`` va charger des fixtures de CakePHP, et utiliser un
nom de plugin en préfixe chargera la fixture à partir de ce plugin.

Vous pouvez charger les fixtures dans des sous-répertoires. Si votre application
est volumineuse, il est plus facile d'organiser vos fixtures en utilisant
plusieurs répertoires. Pour charger des fixtures dans des sous-répertoires,
incluez simplement le nom du sous-répertoire dans le nom de la fixture::

    class ArticlesTest extends CakeTestCase
    {
        protected $fixtures = ['app.Blog/Articles', 'app.Blog/Comments'];
    }

Dans l'exemple ci-dessus, les deux fixtures seront chargées à partir de
``tests/Fixture/Blog/``.

Fixture Factories
-----------------

Le nombre et la taille de vos fixtures vont croissant avec la taille votre
application. Il est possible qu'à un certain point, vous ne soyez plus en mesure
de les maintenir et de suivre leur contenu.

Le `plugin fixture factories <https://github.com/vierge-noire/cakephp-fixture-factories>`__ propose une
alternative efficace pour des applications de grande taille.

Le plugin utilise le `plugin test suite light <https://github.com/vierge-noire/cakephp-test-suite-light>`__
pour tronquer avant chaque test toutes les tables modifiées.

Cette commande bake vous aidera créer vos factories::

    bin/cake bake fixture_factory -h

Une fois vos factories
`mises en place <https://github.com/vierge-noire/cakephp-fixture-factories/blob/main/docs/factories.md>`__,
vous voilà équipés pour créer vos fixtures de test à une vitesse folle.

Les interactions inutiles avec la base de donnée vont ralentir les tests ainsi
que votre application.
Il est possible de créer des fixtures sans les insérer. Ceci est utile lorsque
vous testez des méthodes qui n'interagissent pas avec la base de donnée::

    $article = ArticleFactory::make()->getEntity();

Pour insérer dans la base de donnée::

    $article = ArticleFactory::make()->persist();

Les factories peuvent aussi aider à créer des fixtures associées.
En supposant que les *Articles belongs to many Authors*, il est possible de
créer 5 articles ayant chacun 2 auteurs de la manière suivante::

    $articles = ArticleFactory::make(5)->with('Authors', 2)->getEntities();

Notez que bien que les factories ne nécessitent ni création, ni déclaration de
fixtures. Elles sont toujours parfaitement compatibles avec les fixtures qui
viennent de CakePHP. Pour plus de détails,
rendez-vous `ici <https://github.com/vierge-noire/cakephp-fixture-factories>`_.

Charger des Routes dans les Tests
---------------------------------

Si vous testez des mailers, des components de controllers ou d'autres classes
qui ont besoin de routes et de résoudre des URLs, vous aurez besoin de charger
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
paramètres spécialisés dans le constructeur, vous pouvez les fournir dans
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

Tester les Classes De Tables
============================

Supposons que nous avons déjà notre table Articles définie dans
**src/Model/Table/ArticlesTable.php**, et qu'elle ressemble à ceci::

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

Nous voulons maintenant configurer un test qui va tester cette classe de table.
Créons  un fichier nommé **ArticlesTableTest.php** dans notre répertoire
**tests/TestCase/Model/Table**, avec le contenu suivant::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\ArticlesTable;
    use Cake\TestSuite\TestCase;

    class ArticlesTableTest extends TestCase
    {
        protected $fixtures = ['app.Articles'];
    }

Dans la variable ``$fixtures`` de notre cas de test, nous définissons l'ensemble
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
        protected $fixtures = ['app.Articles'];

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
                ['id' => 1, 'title' => 'Premier Article'],
                ['id' => 2, 'title' => 'Deuxième Article'],
                ['id' => 3, 'title' => 'Troisième Article']
            ];

            $this->assertEquals($expected, $result);
        }
    }

Vous pouvez voir que nous avons ajouté une méthode appelée
``testFindPublished()``. Nous commençons par créer une instance de notre classe
``ArticleTable``, et lançons ensuite notre méthode ``find('published')``. Dans
``$expected``, nous définissons ce qui devrait être le résultat approprié (que
nous connaissons puisque nous avons défini les enregistrements qui sont remplis
initialement dans la table articles). Nous testons si les résultats
correspondent à nos attentes en utilisant la méthode ``assertEquals()``.
Lisez la section sur les :ref:`running-tests` pour plus d'informations sur la
façon de lancer les cas de test.

En utilisant les fixture factories, le test se présenterait ainsi::

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

Aucune fixture n'a besoin d'être déclarée. Les 5 articles créés n'existeront que
dans ce test. La méthode statique ``::find()`` va requêter la base de donnée
sans utiliser la table ``ArticlesTable`` ni ses évènements.

Méthodes de Mocking des Models
------------------------------

Il y aura des fois où vous voudrez mocker les méthodes des models quand vous les
testez. Vous devrez utiliser ``getMockForModel`` pour créer des mocks de test
des classes de tables. Cela évite des problèmes avec les propriétés réfléchies
qu'ont les mocks normaux::

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

Tests d'Intégration des Controllers
===================================

Alors que vous pouvez tester les controllers de la même manière que les Helpers,
Models et Components, CakePHP offre une classe spécialisée
``IntegrationTestCase``. L'utilisation de ce trait dans vos cas de test de vos
controllers vous offre une interface de test de haut niveau.

Si vous n'êtes pas familier avec les tests d'intégration, dites-vous qu'il
s'agit d'une approche de test qui permet de test de plusieurs éléments qui
fonctionnent de concert. Les fonctionnalités de test d'intégration dans CakePHP
simulent une requête HTTP à traiter par votre application. Par exemple, tester
vos controllers impactera également vos components, models et helpers qui
auraient été invoqués pour traiter la requête HTTP. Cela vous donne un test de
plus haut niveau sur votre application et tous ses composants.

Supposons que vous ayez un controller typique ArticlesController, et son model
correspondant. Le code du controller ressemble à ceci::

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
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
                $result = $this->Articles->find('all', [
                        'fields' => ['id', 'title']
                    ])
                    ->all();
            } else {
                $result = $this->Articles->find()->all();
            }

            $this->set([
                'title' => 'Articles',
                'articles' => $result
            ]);
        }
    }

Créez un fichier nommé **ArticlesControllerTest.php** dans votre répertoire
**tests/TestCase/Controller** et mettez-y ce qui suit::

    namespace App\Test\TestCase\Controller;

    use Cake\TestSuite\IntegrationTestTrait;
    use Cake\TestSuite\TestCase;

    class ArticlesControllerTest extends TestCase
    {
        use IntegrationTestTrait;

        protected $fixtures = ['app.Articles'];

        public function testIndex(): void
        {
            $this->get('/articles');

            $this->assertResponseOk();
            // D'autres assertions.
        }

        public function testIndexQueryData(): void
        {
            $this->get('/articles?page=1');

            $this->assertResponseOk();
            // D'autres assertions.
        }

        public function testIndexShort(): void
        {
            $this->get('/articles/index/short');

            $this->assertResponseOk();
            $this->assertResponseContains('Articles');
            // D'autres assertions.
        }

        public function testIndexPostData(): void
        {
            $data = [
                'user_id' => 1,
                'published' => 1,
                'slug' => 'nouvel-article',
                'title' => 'Nouvel Article',
                'body' => 'Nouveau Contenu'
            ];
            $this->post('/articles', $data);

            $this->assertResponseSuccess();
            $articles = $this->getTableLocator()->get('Articles');
            $query = $articles->find()->where(['title' => $data['title']]);
            $this->assertEquals(1, $query->count());
        }
    }

Cet exemple montre quelques exemples de méthodes qui envoient des requêtes et
quelques assertions fournies par ``IntegrationTestTrait``. Avant de pouvoir
utiliser les assertions, vous aurez besoin de simuler une requête. Vous pouvez
utiliser l'une des méthodes suivantes pour envoyer une requête:

* ``get()`` Envoie une requête GET.
* ``post()`` Envoie une requête POST.
* ``put()`` Envoie une requête PUT.
* ``delete()`` Envoie une requête DELETE.
* ``patch()`` Envoie une requête PATCH.
* ``options()`` Envoie une requête OPTIONS.
* ``head()`` Envoie une requête HEAD.

Toutes les méthodes exceptées ``get()`` et ``delete()`` acceptent un second
paramètre qui vous permet d'envoyer le corps d'une requête. Après avoir émis
une requête, vous pouvez utiliser les différentes assertions fournies par
``IntegrationTestTrait`` ou PHPUnit afin de vous assurer que votre requête a les
effets attendus.

Configurer la Requête
---------------------

Le trait ``IntegrationTestTrait`` comporte de nombreux helpers pour configurer
les requêtes que vous allez envoyer à l'application testée::

    // Définit des cookies
    $this->cookie('name', 'Oncle Bob');

    // Définit des données de session
    $this->session(['Auth.User.id' => 1]);

    // Configure les en-têtes
    $this->configRequest([
        'headers' => ['Accept' => 'application/json']
    ]);

Les états définis par les méthodes de cet utilitaire sont remis à zéro dans la
méthode ``tearDown()``.

.. _testing-authentication:

Tester Des Actions Qui Nécessitent Une Authentification
-------------------------------------------------------

Si vous utilisez ``AuthComponent``, vous aurez besoin de simuler les données
de session utilisées par AuthComponent pour valider l'identité d'un utilisateur.
Pour ce faire, vous pouvez utiliser les méthodes utilitaires fournies par
``IntegrationTestTrait``. En admettant que vous ayez un ``ArticlesController``
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

Test de l'Authentification Stateless (sans état) et des APIs
------------------------------------------------------------

Pour tester les APIs qui utilisent une authentification stateless, telles que
l'authentification Basic, vous pouvez configurer la requête de manière à y
injecter des variables d'environnement et des en-têtes qui vont simuler de
vraies en-têtes d'authentification.

Lorsque vous testez les authentifications Basic ou Digest, vous pouvez ajouter
les variables d'environnement `créées automatiquement par PHP <https://php.net/manual/fr/features.http-auth.php> `_.
Ces variables d'environnement utilisées dans l'adaptateur d'authentification
sont décrites dans: ref: `basic-authentication` ::

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

Vous pouvez utiliser la clé ``headers`` dans ``configRequest()`` pour configurer
n'importe quelle autre en-tête HTTP dont vous auriez besoin pour cette action.

Tester les Actions Protégées par CsrfProtectionMiddleware ou FormProtectionComponent
------------------------------------------------------------------------------------

Quand vous testez des actions protégées par ``CsrfProtectionMiddleware`` ou ``FormProtectionComponent``,
vous pouvez activer la génération automatique de token pour vous assurer que vos
tests ne vont pas échoué à cause d'un problème de  token::

    public function testAdd(): void
    {
        $this->enableCsrfToken();
        $this->enableSecurityToken();
        $this->post('/posts/add', ['title' => 'News excitante!']);
    }

Il est aussi important d'activer le débogage dans les tests qui utilisent des
tokens pour éviter que le ``FormProtectionComponent`` ne pense que le token de débogage
est utilisé dans un environnement non-debug. Quand vous faites des tests avec
d'autres méthodes comme ``requireSecure()``, vous pouvez utiliser
``configRequest()`` pour définir les bonnes variables d'environnement::

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
``IntegrationTestTrait`` détectera automatiquement la présence d'une classe
``App\Application`` et activera automatiquement les tests d'intégration sur
votre Application.

Vous pouvez personnaliser le nom de la classe Application utilisée ainsi que les
arguments du contructeur, en utilisant la méthode ``configApplication()``::

    public function setUp(): void
    {
        $this->configApplication('App\App', [CONFIG]);
    }

Vous devriez également faire en sorte d'utiliser :ref:`application-bootstrap`
pour charger les plugins qui contiennent des événements ou des routes. De cette
manière, vous vous assurez que les événements et les routes seront connectés
pour tous vos *test cases*.

Tester avec des Cookies Cryptés
-------------------------------

Si vous utilisez le :ref:`encrypted-cookie-middleware` dans votre application,
il y a des méthodes pratiques pour définir des cookies chiffrés dans vos
*test cases*::

    // Définit un cookie en utilisant AES et la clé par défaut.
    $this->cookieEncrypted('mon_cookie', 'Des valeurs secrètes');

    // Partons du principe que cette action modifie le cookie.
    $this->get('/bookmarks/index');

    $this->assertCookieEncrypted('Une nouvelle valeur', 'mon_cookie');

Tester les Messages Flash
-------------------------

Si vous souhaitez faire une assertion sur la présence de messages Flash en
session et pas sur le rendu du HTML, vous pouvez utiliser
``enableRetainFlashMessages()`` dans vos tests pour que les messages Flash
soient conservés dans la session et que vous puissez ainsi effectuer vos
assertions::

    // Active la rétention des messages flash plutôt que leur consommation
    $this->enableRetainFlashMessages();
    $this->get('/bookmarks/delete/9999');

    $this->assertSession("Ce marque-page n'existe pas", 'Flash.flash.0.message');

    // Vérifie un message flash sous la clé 'flash'.
    $this->assertFlashMessage('Marque-page supprimé', 'flash');

    // Vérifie le deuxième message flash, également sous la clé 'flash'.
    $this->assertFlashMessageAt(1, 'Marque-page vraiment supprimé');

    // Vérifie un message flash en première position sous la clé 'auth'
    $this->assertFlashMessageAt(0, "Vous n'avez pas le droit d'entrer dans ce donjon !", 'auth');

    // Vérifie qu'un message flash utilise l'élément error
    $this->assertFlashElement('Flash/error');

    // Vérifie l'élément du deuxième message flash
    $this->assertFlashElementAt(1, 'Flash/error')

Tester un Controller Retournant du JSON
---------------------------------------

JSON est un format commun et agréable à utiliser lors de la conception d'un
service web. Avec CakePHP, il est très simple de tester les terminaux de votre
service web. Commençons avec un exemple simple  de controller qui renvoie du
JSON::

    use Cake\View\JsonView;

    class MarkersController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
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
            $this->assertEquals($expected, (string)$this->_response->getBody());
        }
    }

Nous utilisons l'option ``JSON_PRETTY_PRINT`` car la vue JsonView intégrée à
CakePHP utilise cette option quand le mode ``debug`` est activé.

Test avec Téléversement de Fichiers
-----------------------------------

La simulation d'un téléversement de fichiers est enfantine lorsque vous utilisez
le mode par défaut de
":ref:`téléversement de fichiers en tant qu'objets <request-file-uploads>`".
Vous pouvez créer tout simplement des instances qui implémentent
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__
(l'implémentation par défaut actuellement utilisée par CakePHP est
``\Laminas\Diactoros\UploadedFile``), et les passer dans les données de vos
requêtes de test. Dans l'environnement CLI, ces objets passeront par défaut les contrôles
de validation qui testent si le fichier a été téléversé via HTTP. Il n'en va pas
de même pour les données de type tableau comme celles que l'on trouve dans
``$_FILES`` ; ce contrôle échouerait.

Afin de simuler exactement la façon dont les objets de fichiers téléversés
seraient présents dans une requête normale, vous devez non seulement les passer
dans les données de la requête, mais aussi les passer dans la configuration de
la requête de test via l'option ``files``. Ce n'est toutefois pas techniquement
nécessaire, sauf si votre code accède aux fichiers téléversés via les méthodes
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` ou
:php:meth:`Cake\\Http\\ServerRequest::getUploadedFiles()`.

Supposons que les articles aient une image d'accroche, et une association
``Articles hasMany Attachments``. Le formulaire ressemblerait à quelque chose
comme ceci en conséquence, où un fichier image et plusieurs fichiers ou pièces
jointes seraient acceptés::

    <?= $this->Form->create($article, ['type' => 'file']) ?>
    <?= $this->Form->control('title') ?>
    <?= $this->Form->control('teaser_image', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.0.description']) ?>
    <?= $this->Form->control('attachments.1.attachment', ['type' => 'file']) ?>
    <?= $this->Form->control('attachments.1.description']) ?>
    <?= $this->Form->button('Submit') ?>
    <?= $this->Form->end() ?>

Le test qui simulerait la requête correspondante pourrait ressembler à ceci::

    public function testAddWithUploads(): void
    {
        $teaserImage = new \Laminas\Diactoros\UploadedFile(
            '/path/to/test/file.jpg', // flux ou chemin d'accès au fichier représentant le fichier temporaire
            12345,                    // la taille du fichier en octets
            \UPLOAD_ERR_OK,           // le statut de téléversement ou d'erreur
            'teaser.jpg',             // le nom du fichier tel qu'il aurait été envoyé par le client
            'image/jpeg'              // le type mime tel qu'il aurait été envoyé par le client
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

        // Voici les données accessibles via `$this->request->getUploadedFile()`
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

        // Voici les données accessibles via `$this->request->getData()`.
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
        $this->assertFlashMessage("L'article a été sauvegardé avec succès");
        $this->assertFileExists('/path/to/uploads/teaser.jpg');
        $this->assertFileExists('/path/to/uploads/attachment.txt');
        $this->assertFileExists('/path/to/uploads/attachment.pdf');
    }

.. tip::

    Si vous configurez la requête de test avec des fichiers, alors elle *doit*
    correspondre à la structure de vos données POST (mais n'inclure que les
    objets de fichiers téléversés)!

De même, vous pouvez simuler des `erreurs de téléversement <https://www.php.net/manual/fr/features.file-upload.errors.php>`_
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
                    'description' => 'Pièce jointe en échec de téléversement',
                ],
                1 => [
                    'file' => $invalidTypeAttachment,
                    'description' => 'Pièce jointe de type invalide',
                ],
            ],
        ];
        $this->post('/articles/add', $postData);

        $this->assertResponseOk();
        $this->assertFlashMessage("L'article n'a pas pu être sauvegardé");
        $this->assertResponseContains("Une image d'accroche est nécessaire");
        $this->assertResponseContains('Dépassement de la taille maximale autorisée des fichiers');
        $this->assertResponseContains('Type de fichier non supporté');
        $this->assertFileNotExists('/path/to/uploads/teaser.jpg');
        $this->assertFileNotExists('/path/to/uploads/attachment.txt');
        $this->assertFileNotExists('/path/to/uploads/attachment.exe');
    }

Désactiver le Middleware de Gestion d'Erreurs dans les Tests
------------------------------------------------------------

Quand vous déboguez des tests qui échouent parce que votre application rencontre
des erreurs, il peut être utile de désactiver temporairement le middleware de
gestion des erreurs pour permettre aux erreurs de remonter. Pour cela, vous
pouvez utiliser la méthode ``disableErrorHandlerMiddleware()``::

    public function testGetMissing(): void
    {
        $this->disableErrorHandlerMiddleware();
        $this->get('/markers/not-there');
        $this->assertResponseCode(404);
    }

Dans l'exemple ci-dessus, le test échouera et le message d'exception et la
stack-trace seront affichés à la place de la page d'erreur de l'application.

Méthodes d'Assertion
--------------------

Le trait ``IntegrationTestTrait`` fournit de nombreuses méthodes
d'assertions afin de tester les réponses plus simplement. Quelques exemples::

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
    $this->assertResponseEquals('Ouais !');

    // Vérifie que le contenu de la réponse n'est pas égal à...
    $this->assertResponseNotEquals('Non !');

    // Vérifie un contenu partiel de la réponse
    $this->assertResponseContains("C'est gagné !");
    $this->assertResponseNotContains("Encore raté !");

    // Vérifie un fichier renvoyé
    $this->assertFileResponse('/chemin/absolu/vers/le/fichier.ext');

    // Vérifie le layout
    $this->assertLayout('default');

    // Vérifie quel Template a été rendu (s'il y en a un)
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
`PHPUnit <https://phpunit.de/manual/current/fr/appendixes.assertions.html>`__.

Comparer les Résultats du Test avec un Fichier
----------------------------------------------

Pour certains types de test, il peut être plus simple de comparer les résultats
d'un test avec le contenu d'un fichier - par exemple, quand vous testez le
rendu d'une vue.
``StringCompareTrait`` ajoute une méthode d'assertion simple pour cela.

Pour l'utiliser, vous devez inclure le trait, définir le répertoire contenant le
fichier servant de base de comparaison et appeler ``assertSameAsFile``::

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

Cet exemple va comparer ``$result`` au contenu du fichier
``APP/tests/comparisons/example.php``.

Il existe un mécanisme pour écrire/mettre à jour les fichiers de test, en
définissant la variable d'environment ``UPDATE_TEST_COMPARISON_FILES``, ce qui
va créer et/ou mettre à jour les fichiers de comparaison de test dès qu'ils
seront référencés:

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

Tests d'Intégration en Console
==============================

Voir la :ref:`console-integration-testing` pour savoir comment tester les
commandes.

Mocker les Injections de Dépendances
====================================

Voir :ref:`mocking-services-in-tests` pour savoir comment remplacer des services
injectés avec le conteneur d'injection de dépendances dans vos tests
d'intégration.

Mocker les Réponses du Client HTTP
==================================

Voir :ref:`httpclient-testing` pour savoir comment créer des mocks de réponses
vers des API externes.

Tester les Views
================

Généralement, la plupart des applications ne vont pas directement tester leur
code HTML. Le faire donne souvent des suites de tests fragiles, difficiles à
maintenir et sujettes à se casser. En écrivant des tests fonctionnels avec
:php:class:`IntegrationTestTrait`, vous pouvez inspecter le contenu de la vue
rendue en configurant l'option ``return`` à 'view'. Bien qu'il soit possible de
tester le contenu de la vue en utilisant ``IntegrationTestTrait``, il est aussi
possible de réaliser des tests d'intégration/de vue plus robustes plus
maintenables en utilisant des outils comme
`Selenium webdriver <https://www.selenium.dev/>`_.

Tester les Components
=====================

Imaginons que nous ayons dans notre application un component appelé
PagematronComponent. Ce component nous aide à fixer la valeur limite de
pagination dans tous les controllers qui l'utilisent. Voici notre exemple de
component situé dans **src/Controller/Component/PagematronComponent.php**::

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

        public function startup(EventInterface $event)
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

Puisqu'une bonne quantité de logique se situe dans les classes de helpers, il est
important de s'assurer que ces classes sont couvertes par des tests.

Tout d'abord, créons un exemple de helper à tester. Le
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

Ici nous configurons deux décimales après la virgule, le séparateur décimal est
un point, le séparateur de milliers est une virgule, et nous plaçons la chaîne
'USD' en préfixe.

Maintenant, créons nos tests::

    // tests/TestCase/View/Helper/CurrencyRendererHelperTest.php

    namespace App\Test\TestCase\View\Helper;

    use App\View\Helper\CurrencyRendererHelper;
    use Cake\TestSuite\TestCase;
    use Cake\View\View;

    class CurrencyRendererHelperTest extends TestCase
    {

        public $helper = null;

        // Ici nous instancions notre helper
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

Ici nous appelons ``usd()`` avec différents paramètres et demandons à notre test
de vérifier si les valeurs retournées sont égales à ce que nous attendons.

Sauvegardez cela et exécutez le test. Vous devriez voir une barre verte et
un message indiquant 1 test passé et 4 assertions.

Lorsque vous testez un Helper qui utilise d'autres helpers, assurez-vous de
mocker la méthode ``loadHelpers`` de la classe View.

.. _testing-events:

Tester les Events
=================

Les :doc:`/core-libraries/events` sont un bon moyen pour découpler le code de
votre application. Mais parfois quand vous les testez, vous aurez tendance à
tester les événements dans les cas de test qui exécutent ces événements. C'est
une forme supplémentaire de couplage qui peut être évitée en utilisant
à la place ``assertEventFired`` et ``assertEventFiredWith``.

En poursuivant l'exemple sur les Orders, supposons que nous avons les tables
suivantes::

    class OrdersTable extends Table
    {
        public function place($order): bool
        {
            if ($this->save($order)) {
                // la suppression du panier a été déplacée dans CartsTable
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
    d'événements sur lequel vous souhaitez faire des assertions.

Pour tester la ``OrdersTable`` ci-dessus, nous devons activer le tracking dans
la méthode ``setUp()`` puis vérifier que l'événement a été déclenché, puis que
l'entity ``$order`` a été passée dans les données de l'événement::

    namespace App\Test\TestCase\Model\Table;

    use App\Model\Table\OrdersTable;
    use Cake\Event\EventList;
    use Cake\TestSuite\TestCase;

    class OrdersTableTest extends TestCase
    {
        protected $fixtures = ['app.Orders'];

        public function setUp(): void
        {
            parent::setUp();

            $this->Orders = $this->getTableLocator()->get('Orders');

            // activer le suivi de la trace des événements
            $this->Orders->getEventManager()->setEventList(new EventList());
        }

        public function testPlace(): void
        {
            $order = new Order([
                'user_id' => 1,
                'item' => 'Cake',
                'quantity' => 42,
            ]);

            $this->assertTrue($this->Orders->place($order));

            $this->assertEventFired('Model.Order.afterPlace', $this->Orders->getEventManager());
            $this->assertEventFiredWith('Model.Order.afterPlace', 'order', $order, $this->Orders->getEventManager());
        }
    }

Par défaut, les assertions utilisent l'``EventManager`` global, donc il n'est
pas nécessaire de passer le gestionnaire d'événements pour tester les événements
globaux::

    $this->assertEventFired('Mon.Event.Global');
    $this->assertEventFiredWith('Mon.Event.Global', 'user', 1);

Testing Email
=============

Consultez :ref:`email-testing` pour savoir comment tester les emails.

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

Les Tests pour les plugins sont créés dans leur propre répertoire dans le
dossier des plugins::

    /src
    /plugins
        /Blog
            /tests
                /TestCase
                /Fixture

Ils fonctionnent comme des tests normaux mais vous devrez vous souvenir
d'utiliser les conventions de nommage pour les plugins quand vous importez des
classes. Ceci est un exemple d'un cas de test pour le model ``BlogPost`` tiré du
chapitre des plugins de ce manuel. Une différence par rapport aux autres tests
se situe dans la première ligne, où on importe 'Blog.BlogPost'. Vous devrez
aussi préfixer les fixtures de votre plugin avec ``plugin.Blog.BlogPosts``::

    namespace Blog\Test\TestCase\Model\Table;

    use Blog\Model\Table\BlogPostsTable;
    use Cake\TestSuite\TestCase;

    class BlogPostsTableTest extends TestCase
    {

        // Fixtures de plugin se trouvant dans /plugins/Blog/tests/Fixture/
        protected $fixtures = ['plugin.Blog.BlogPosts'];

        public function testSomething(): void
        {
            // Teste quelque chose.
        }
    }

Si vous voulez utiliser des fixtures de plugin dans les tests de l'application,
vous pouvez y faire référence en utilisant la syntaxe
``plugin.pluginName.fixtureName`` dans le tableau ``$fixtures``.

Avant d'utiliser des fixtures, assurez-vous que le
:ref:`listener de fixture <fixture-phpunit-configuration>` soit configuré dans
votre fichier ``phpunit.xml``.
Vous devez également vous assurer que vos fixtures sont chargeables.
Vérifiez que le code suivant est présent dans votre fichier **composer.json**::

    "autoload-dev": {
        "psr-4": {
            "MonPlugin\\Test\\": "plugins/MonPlugin/tests"
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
générer le squelette de test pour du code que vous avez écrit, vous pouvez
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
#. Task
#. ShellHelper
#. Cell
#. Form
#. Mailer
#. Command

Où ``<name>`` est le nom de l'objet dont vous voulez générer le squelette de
tests.

.. meta::
    :title lang=fr: Test
    :keywords lang=fr: phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
