Injection de Dépendance
#######################

.. warning::
    Le conteneur Dependency Injection est une fonctionnalité expérimentale dont
    l'API n'est pas encore stabilisé.

Le conteneur de services de CakePHP vous permet de gérer les dépendances de
classes de vos services applicatifs par l'injection de dépendance. L'injection
de dépendance "injecte" automatiquement les dépendances d'un objet dans son
constructeur, sans qu'il soit besoin de les instancier manuellement.

Vous pouvez utiliser le conteneur de services pour définir des 'services
applicatifs'. Ces classes peuvent utiliser les modèles et interagir avec
d'autres objets tels que les <em>loggers</em> et les <em>mailers</em> pour
construire des tâches réutilisables et la logique métier de votre application.

CakePHP utilisera le conteneur de services lors de l'appel d'actions dans vos
contrôleurs et l'invocation de commandes dans la console. Vous pouvez aussi
avoir des dépendances qui soient injectées dans les constructeurs de vos
contrôleurs.

Un exemple simple serait::

    // Dans src/Controller/UsersController.php
    class UsersController extends AppController
    {
        // Le service $users sera créé via le conteneur de services.
        public function ssoCallback(UsersService $users)
        {
            if ($this->request->is('post')) {
                // Utilise le UsersService pour créer/obtenir l'utilisateur à
                // partir d'un Single Signon Provider.
                $user = $users->ensureExists($this->request->getData());
            }
        }
    }

    // Dans src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->add(UsersService::class);
    }

Dans cet exemple, l'action ``UsersController::ssoCallback()`` a besoin de
récupérer un utilisateur à partir d'un fournisseur Single-Sign-On et de
s'assurer qu'il existe dans la base de données locale. Puisque le service est
injecté dans notre contrôleur, nous pouvons facilement substituer à cette
implémentation un objet mocké ou une sous-classe factice pour les tests.

Voici un exemple de service injecté dans une commande::

    // Dans src/Command/CheckUsersCommand.php
    class CheckUsersCommand extends Command
    {
        /** @var UsersService */
        public $users;

        public function __construct(UsersService $users)
        {
            parent::__construct();
            $this->users = $users;
        }

        public function execute( Arguments $args, ConsoleIo $io )
        {
            $valid = $this->users->check('all');
        }

    }

    // Dans src/Application.php
    public function services( ContainerInterface $container ): void
    {
        $container
            ->add(CheckUsersCommand::class)
            ->addArgument(UsersService::class);
        $container->add(UsersService::class);
    }

Ici, le processus d'injection est un peu différent. Au lieu d'ajouter le
``UsersService`` au conteneur, nous devons d'abord ajouter la commande comme un
tout dans le <em>Container</em> et ajouter le ``UsersService`` en argument. Avec
cela, vous pouvez alors accéder au service depuis l'intérieur du constructeur de
la commande.

Ajouter des Services
====================

Pour disposer de services créés par le conteneur, vous devez lui dire quelles
classes il peut créer et comment construire ces classes. La définition la plus
simple se fait par le nom de la classe::

    // Ajouter une classe par son nom.
    $container->add(BillingService::class);

Votre application et vos plugins définissent leurs services dans la méthode
crochet ``services()``::

    // dans src/Application.php
    namespace App;

    use App\Service\BillingService;
    use Cake\Core\ContainerInterface;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function services(ContainerInterface $container): void
        {
            $container->add(BillingService::class);
        }
    }

Vous pouvez définir des implémentations pour les interfaces utilisées par votre
application::

    use App\Service\AuditLogServiceInterface;
    use App\Service\AuditLogService;

    // dans votre méthode Application::services()

    // Ajouter une implémentation pour une interface.
    $container->add(AuditLogServiceInterface::class, AuditLogService::class);

Le conteneur peut exploiter les fonctions de fabrique pour créer des objets si
nécessaire::

    $container->add(AuditLogServiceInterface::class, function (...$args) {
        return new AuditLogService(...$args);
    });

Les fonctions de fabrique recevront en arguments toutes les dépendances de
classe résolues.

Une fois que vous avez défini une classe, vous devez aussi définir les
dépendances dont elle a besoin. Ces dépendances peuvent être soit des objets,
soit des valeurs primitives::

    // Ajouter une valeur primitive telle qu'une chaîne, un tableau ou un
    // nombre.
    $container->add('apiKey', 'abc123');

    $container->add(BillingService::class)
        ->addArgument('apiKey');

Vos services peuvent faire référence à la ``ServerRequest`` dans les actions du
controller car elle sera chargée automatiquement.

.. versionchanged:: 4.4.0
    La ``$request`` est désormais enregistrée automatiquement.

Ajouter des Services Partagés
-----------------------------

Par défaut, les services ne sont pas partagés. Chaque objet (et dépendance) est
recréé à chaque récupération auprès du conteneur. Si vous voulez réutiliser une
instance, souvent référencée comme un singleton, vous pouvez marquer un service
comme 'partagé'::

    // dans votre méthode Application::services()

    $container->share(BillingService::class);

Étendre des Définitions
-----------------------

Après avoir défini un service, vous pouvez modifier ou mettre à jour sa
définition en l'étendant. Cela vous permet d'ajouter des arguments
supplémentaires définis ailleurs::

    // Ajouter un argument à un service partiellement défini ailleurs.
    $container->extend(BillingService::class)
        ->addArgument('logLevel');

Étiqueter des Services
----------------------

En ajoutant une étiquette (<em>tag</em>) à des services, vous pouvez les
résoudre tous en même temps. Cela peut servir à construire des services qui
combinent des collections d'autres services, comme dans un système de
reporting::

    $container->add(BillingReport::class)->addTag('reports');
    $container->add(UsageReport::class)->addTag('reports');

    $container->add(ReportAggregate::class, function () use ($container) {
        return new ReportAggregate($container->get('reports'));
    });

Utiliser les Données de Configuration
-------------------------------------

Souvent, vous aurez besoin des données de configuration dans vos services. Bien
que vous puissiez ajouter dans le conteneur toutes les clés de configuration
dont votre service a besoin, cela risque d'être fastidieux. Pour faciliter le
travail de configuration, CakePHP inclut un lecteur de configuration
injectable::

    use Cake\Core\ServiceConfig;

    // Utilisez une instance partagée
    $container->share(ServiceConfig::class);

La classe ``ServiceConfig`` fournit une vue en lecture seule de toutes les
données disponibles dans ``Configure``, ainsi vous n'avez pas à vous soucier
d'une modification accidentelle de la configuration.

Service Providers
=================

Les <em>Service Providers</em> (fournisseurs de services) vous permettent de
regrouper des services qui vont ensemble, et vous aident ainsi à organiser vos
services. Les fournisseurs de service peuvent vous aider à améliorer les
performances de votre application car les services définis sont chargés
paresseusement (<em>lazily</em>) lors de leur première utilisation.

Créer des Service Providers
---------------------------

Un exemple de <em>Service Provider</em> pourrait être::

    namespace App\ServiceProvider;

    use Cake\Core\ContainerInterface;
    use Cake\Core\ServiceProvider;
    // Autres imports ici.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function services(ContainerInterface $container): void
        {
            $container->add(StripService::class);
            $container->add('configKey', 'some value');
        }
    }

Les fournisseurs de services utilisent leur méthode ``services()`` pour définir
tous les services qu'ils proposent. De plus, ces services **doivent** être
définis dans la propriété ``$provides``. Ne pas inclure un service dans la
propriété ``$provides`` empêchera son chargement par le conteneur.

Utiliser des Service Providers
------------------------------

Pour charger un <em>service provider</em>, ajoutez-le au conteneur en utilisant
la méthode ``addServiceProvider()``::

    // dans votre méthode Application::services()
    $container->addServiceProvider(new BillingServiceProvider());

ServiceProviders Bootables
--------------------------

Si votre <em>service provider</em> a besoin d'exécuter un traitement au moment
où il est ajouté au conteneur, vous pouvez implémenter la méthode
``bootstrap()``. Cette situation peut se produire si votre
<em>service provider</em> a besoin de charger des fichiers de configuration
supplémentaires, de charger des <em>service providers</em> supplémentaires, ou
de modifier un service défini ailleurs dans votre application. Un exemple de
service bootable serait::

    namespace App\ServiceProvider;

    use Cake\Core\ServiceProvider;
    // Autres imports ici.

    class BillingServiceProvider extends ServiceProvider
    {
        protected $provides = [
            StripeService::class,
            'configKey',
        ];

        public function bootstrap($container)
        {
            $container->addServiceProvider(new InvoicingServiceProvider());
        }
    }


.. _mocking-services-in-tests:

Mocker des Services dans les Tests
==================================

Dans les tests qui utilisent ``ConsoleIntegrationTestTrait`` ou
``IntegrationTestTrait``, vous pouvez remplacer les services injectés dans le
conteneur par des Mocks ou des stubs::

    // Dans une méthode de test ou dans setup().
    $this->mockService(StripeService::class, function () {
        return new FakeStripe();
    });

    // Si vous avez besoin de supprimer un Mock
    $this->removeMockService(StripeService::class);

Tous les Mocks définis seront remplacés dans le conteneur de votre application
pendant le test, et automatiquement injectés dans vos contrôleurs et vos
commandes. Les Mocks sont supprimés à la fin de chaque test.

Auto Wiring
===========

L'auto Wiring est désactivé par défaut. Pour l'activer::

    // Dans src/Application.php
    public function services(ContainerInterface $container): void
    {
        $container->delegate(
            new \League\Container\ReflectionContainer()
        );
    }

À présent, vos dépendances sont résolues automatiquement. Cette approche ne
mettra pas les résolutions en cache les résolutions, au détriment de la
performance. Pour activer la mise en cache::

    $container->delegate(
        new \League\Container\ReflectionContainer(true) // ou utilisez la valeur de Configure::read('debug') 
    );

Pour en savoir plus sur l'auto wiring, consultez la
`PHP League Container documentation <https://container.thephpleague.com/4.x/auto-wiring/>`.
