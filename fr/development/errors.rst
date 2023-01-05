Gestion des Erreurs & Exceptions
################################

Les applications CakePHP sont fournies avec une gestion des erreurs et
exceptions prête à l'emploi. Les erreurs PHP sont récupérées et affichées ou
loggées. Les exceptions non interceptées sont affichées automatiquement
dans des pages d'erreur.

.. _error-configuration:

Configuration des Erreurs et des Exceptions
===========================================

La configuration des Erreurs est faite dans le fichier **config/app.php** de
votre application. Par défaut CakePHP utilise ``Cake\Error\ErrorHandler`` pour
traiter aussi bien les erreurs PHP que les exceptions par défaut. La
configuration des erreurs vous permet de personnaliser le traitement de l'erreur
pour votre application. Les options proposées sont les suivantes:

* ``errorLevel`` - int - Le niveau d'erreurs que vous souhaitez pour la
  capture. Utilisez les constantes d'erreur intégrées à PHP et les bitmasks
  pour sélectionner le niveau d'erreur qui vous intéresse.
  Cf. :ref:`deprecation-warnings` pour supprimer les avertissements de
  dépréciation.
* ``trace`` - bool - Inclut les stack traces (contexte de débuggage) pour les
  erreurs dans les fichiers de log. Les Stack traces seront inclus dans le log
  après chaque erreur. Ceci est utile pour trouver où/quand des erreurs sont
  générées.
* ``exceptionRenderer`` - string - La classe responsable de rendre les
  exceptions non interceptées. Si vous choisissez une classe personnalisée,
  vous devrez placer le fichier de cette classe dans le dossier **src/Error**.
  Cette classe doit implémenter une méthode ``render()``.
* ``log`` - bool - Si ``true``, les exceptions et leur stack traces seront
  loguées vers :php:class:`Cake\\Log\\Log`.
* ``skipLog`` - array - Un tableau des noms de classe d'exception qui ne
  doivent pas être mises dans des fichiers de log. C'est utile pour supprimer
  les NotFoundExceptions ou toute autre message de log sans intérêt.
* ``extraFatalErrorMemory`` - int - Définit le nombre de megaoctets duquel doit
  être augmenté la limite de mémoire en cas d'erreur fatale. Cela permet
  d'allouer un petit espace mémoire supplémentaire pour les logs ainsi que la
  gestion d'erreurs.
* ``errorLogger`` - ``Cake\Error\ErrorLoggerInterface`` - La classe chargée de
  logger les erreurs et les exceptions non interceptées. Par défaut, il s'agit
  de ``Cake\Error\ErrorLogger``.
* ``ignoredDeprecationPaths`` - array - Une liste de chemins compatibles glob à
  l'intérieur desquels les erreurs de dépréciation devraient être ignorées.
  Ajouté dans la version 4.2.0

Par défaut, les erreurs PHP sont affichées quand ``debug`` est ``true`` et
loggées quand ``debug`` est ``false``. Le gestionnaire d'erreurs fatales va
être appelé indépendamment de ``debug`` ou de la configuration de
``errorLevel``, mais le résultat va être différent, basé sur le niveau de
``debug``. Le comportement par défaut pour les erreurs fatales est d'afficher
une page avec une erreur interne du serveur (``debug`` désactivé) ou une page
avec le message, le fichier et la ligne (``debug`` activé).

.. note::

    Si vous utilisez un gestionnaire d'erreurs personnalisé, les options
    supportées dépendent de votre gestionnaire.


.. _deprecation-warnings:

Avertissements de dépréciation
------------------------------

CakePHP utilise les avertissements de dépréciation pour indiquer quand des
fonctionnalités ont été dépréciées. Nous recommandons également ce système pour
le code de vos plugins ou de vos applications quand c'est utile. Vous pouvez
déclencher un avertissement de dépréciation avec ``deprecationWarning()``::

    deprecationWarning('5.0', 'La méthode example() est dépréciée. Veuillez utiliser
    getExample() à la place.');

Quand vous mettez à jour CakePHP ou des plugins, vous pouvez y découvrir de
nouveaux avertissements de dépréciation. Vous pouvez les désactiver
temporairement en utilisant un de ces moyens:

#. Placer le paramètre ``Error.errorLevel`` à ``E_ALL ^ E_USER_DEPRECATED`` pour
   ignorer *tous* les avertissements de dépréciation.
#. Utiliser l'option de configuration ``Error.ignoredDeprecationPaths`` pour
   ignorer les dépréciations selon une expression glob. Par exemple::

        'Error' => [
            'ignoredDeprecationPaths' => [
                'vendors/company/contacts/*',
                'src/Models/*',
            ]
        ],

   ignorerait toutes les dépréciations depuis votre répertoire ``Models`` et le
   plugin ``Contacts`` dans votre application.

.. php:class:: ExceptionRenderer(Exception $exception)

Modifier la gestion des exceptions
==================================

La gestion des exceptions vous offre plusieurs moyens pour affiner la façon dont
les exceptions sont gérées. Chaque approche vous donne un avantage différent
dans le contrôle du processus de gestion de l'exception.

#. *Templates d'erreur personnalisés* vous permet de changer les templates de la
   vue affichée, de la même façon que vous changeriez n'importe quel autre
   template de votre application..
#. *ErrorController personnalisé* vous permet de contrôler comment les pages
   d'exception sont affichées.
#. *ExceptionRenderer personnalisé* vous permet de contrôler comment les pages
   d'exception et de log sont réalisées.
#. *Créez et enregistrez votre propre gestionnaire d'erreurs* vous donne le
   contrôle total sur la façon dont les erreurs et exceptions sont gérées,
   loggées et affichées.

.. _error-views:

Templates d'erreur personnalisés
================================

Le gestionnaire d'erreur par défaut affiche toutes les exceptions non
interceptées soulevées par votre application en s'appuyant sur
``Cake\Error\ExceptionRenderer``, et sur l'``ErrorController`` de votre
application.

Les vues de la page d'erreur sont situées dans **templates/Error/**. Toutes les
erreurs 4xx errors utilisent le template **error400.php**, et les erreurs 5xx
utilisent **error500.php**. Vos templates d'erreur disposeront des variables
suivantes:

* ``message`` Le message de l'exception.
* ``code`` Le code de l'exception.
* ``url`` L'URL demandée.
* ``error`` L'objet exception.

En mode debug, si votre erreur sous-classe ``Cake\Core\Exception\Exception``,
les données renvoyées par ``getAttributes()`` seront aussi exposées comme
variables de vue.

.. note::
    Vous aurez besoin de définir ``debug`` à false pour voir vos templates
    **error404** et **error500**. En mode debug, vous verrez la page d'erreur de
    développement de CakePHP.

Layout personnalisé de la page d'erreur
---------------------------------------

Par défaut les templates d'erreur utilisent comme layout
**templates/layout/error.php**. Vous pouvez utiliser la propriété ``layout``
pour aller chercher un layout différent::

    // à l'intérieur de templates/Error/error400.php
    $this->layout = 'my_error';

Le code ci-dessus utiliserait **templates/layout/my_error.php** comme layout
pour vos pages d'erreur.

Beaucoup d'exceptions soulevées par CakePHP vont afficher des templates de vue
spécifiques en mode debug. Lorsque le mode debug est désactivé, toutes les
exceptions soulevées par CakePHP utiliseront soit **error400.php** soit
**error500.php** selon leur code de statut.

ErrorController personnalisé
============================

La classe ``App\Controller\ErrorController`` est utilisée par le moteur de rendu
des exceptions de CakePHP pour rendre la vue de la page d'erreur. Elle reçoit
tous les événements du cycle de vie d'une requête standard. En modifiant cette
classe, vous pouvez contrôler quels composants sont utilisés et quels templates
sont rendus.

Si votre application utilise :ref:`prefix-routing`, vous pouvez créer des
contrôleurs d'erreur personnalisés pour chaque préfixe de route. Par exemple, si
vous aviez un préfixe ``Admin``, vous pourriez créer la classe suivante::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        /**
         * Initialization hook method.
         *
         * @return void
         */
        public function initialize(): void
        {
            $this->loadComponent('RequestHandler');
        }

        /**
         * beforeRender callback.
         *
         * @param \Cake\Event\EventInterface $event Event.
         * @return void
         */
        public function beforeRender(EventInterface $event)
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

Ce contrôleur serait seulement utilisé quand une erreur est rencontrée dans un
contrôleur préfixé, et vous permet de définir une logique ou des templates
spécifiques au préfixe en tant que de besoin.

.. _custom-exceptionrenderer:

ExceptionRenderer personnalisé
==============================

Si vous voulez contrôler tout l'affichage de l'exception et le processus de
log, vous pouvez utiliser l'option ``Error.exceptionRenderer`` dans
**config/app.php** pour choisir une classe qui va faire le rendu des pages
d'exception. Le fait de changer l'ExceptionRenderer est utile quand vous voulez
changer la logique utilisée pour créer un contrôleur d'erreur, choisir un
template d'erreur, ou contrôler l'intégralité du processus de rendu.

Votre classe personnalisée d'affichage des erreurs devrait être placée dans
**src/Error**. Supposons que notre application utilise
``App\Exception\MissingWidgetException`` pour indiquer un widget manquant. Nous
pourrions créer un renderer d'exceptions qui affiche des pages d'erreur
spécifiques quand l'erreur est traitée::

    // Dans src/Error/AppExceptionRenderer.php
    namespace App\Error;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->getResponse();

            return $response->withStringBody('Oups ! Ce widget est introuvable.');
        }
    }

    // Dans config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

Le code ci-dessus traiterait notre ``MissingWidgetException``, et nous
permettrait de fournir une logique personnalisée d'affichage et/ou de gestion
pour ces exceptions de l'application.
Les méthodes de rendu des exceptions reçoivent en argument l'exception traitée,
et devraient retourner un objet ``Response``. Vous pouvez aussi implémenter des
méthodes pour ajouter une logique supplémentaire dans la gestion des erreurs
CakePHP::

    // Dans src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function notFound($error)
        {
            // Faire quelque chose avec les objets NotFoundException.
        }
    }

Changer la classe ErrorController
---------------------------------

Le renderer d'exception dicte le contrôleur à utiliser pour le rendu des
exceptions. Si vous voulez changer le contrôleur à utiliser pour rendre les
exceptions, réécrivez la méthode ``_getController()`` dans votre renderer
d'exceptions::

    // dans src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Controller\Controller;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController(): Controller
        {
            return new SuperCustomErrorController();
        }
    }

    // dans config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...


Créer vos Propres Gestionnaires d'Erreurs
=========================================

En remplaçant le gestionnaire d'erreurs, vous pouvez personnaliser la façon dont
sont gérées les erreurs PHP et les exceptions qui ne sont pas interceptées par
un middleware. Les gestionnaires d'erreurs sont différents pour la partie HTTP
et la partie Console de votre application.

Pour créer un gestionnaire d'erreurs pour les requêtes HTTP, vous devriez
étendre ``Cake\Error\ErrorHandler``. À titre d'exemple, nous
pourrions définir une classe appelée ``AppError`` pour gérer les erreurs dans
les requêtes HTTP::

    // Dans src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\ErrorHandler;
    use Throwable;


    class AppError extends ErrorHandler
    {
        protected function _displayError(array $error, bool $debug): void
        {
            echo 'Il y a eu une erreur!';
        }

        protected function _displayException(Throwable $exception): void
        {
            echo 'Il y a eu un exception';
        }
    }

Ensuite nous pouvons enregistrer notre gestionnaire en tant que gestionnaire
d'erreurs PHP::

    // Dans config/bootstrap.php
    use App\Error\AppError;

    if (PHP_SAPI !== 'cli') {
        $errorHandler = new AppError();
        $errorHandler->register();
    }

Pour finir, nous pouvons utiliser notre gestionnaire d'erreurs dans
l'``ErrorHandlerMiddleware``::

    // dans src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $error = new AppError(Configure::read('Error'));
        $middleware->add(new ErrorHandlerMiddleware($error));

        return $middleware;
    }

Pour la gestion d'erreurs par console, vous devez étendre
``Cake\Error\ConsoleErrorHandler`` au lieu de ``Cake\Error\ErrorHandler``::

    // Dans /src/Error/AppConsoleErrorHandler.php
    namespace App\Error;
    use Cake\Error\ConsoleErrorHandler;

    class AppConsoleErrorHandler extends ConsoleErrorHandler {

        protected function _displayException(Throwable $exception): void {
            parent::_displayException($exception);
            if (isset($exception->queryString)) {
                $this->_stderr->write('Query String: ' . $exception->queryString);
            }
        }

    }

Puis nous pouvons enregistrer notre gestionnaire d'erreurs sur console en tant
que gestionnaire d'erreurs PHP::

    // Dans config/bootstrap.php
    use App\Error\AppConsoleErrorHandler;
    $isCli = PHP_SAPI === 'cli';
    if ($isCli) {
        (new AppConsoleErrorHandler(Configure::read('Error')))->register();
    }

Les objets ErrorHandler ont quelques méthodes que vous pourriez vouloir
implémenter:

* ``_displayError(array $error, bool $debug)`` est utilisée quand des erreurs sont déclenchées.
* ``_displayException(Throwable $exception)`` est appelée lorsqu'il y a une exception non interceptée.
* ``_logError($level, array $error)`` est appelée lorsqu'une erreur doit être loggée.
* ``logException(Throwable $exception)`` est appelée lorsqu'une exception doit être loggée.


Changer le Comportement des Erreurs Fatales
-------------------------------------------

Les gestionnaires d'erreurs convertissent les erreurs fatales en exceptions et
réutilisent la logique de gestion des erreurs pour rendre une page d'erreur. Si
vous ne voulez pas montrer la page d'erreur standard, vous pouvez la réécrire::

    // Dans src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Autres méthodes.

        public function handleFatalError(int $code, string $description, string $file, int $line): bool
        {
            echo 'Une erreur fatale est survenue';
        }
    }

Logging Personnalisé des Erreurs
================================

Les gestionnaires d'erreurs utilisent des instances de
``Cake\Error\ErrorLoggingInterface`` pour créer des messages de log et les
logger au bon endroit. Vous pouvez remplacer le logger d'erreurs en utilisant la
propriété de configuration ``Error.errorLogger``. Un exemple d'<em>error
logger</em>::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Logger vers `Cake\Log\Log` les erreurs et les exceptions non interceptées
     */
    class ErrorLogger implements ErrorLoggerInterface
    {
        /**
         * @inheritDoc
         */
        public function logMessage($level, string $message, array $context = []): bool
        {
            // Logger les erreurs PHP
        }

        public function log(Throwable $exception, ?ServerRequestInterface $request = null): bool
        {
            // Logger les exceptions
        }
    }

.. index:: application exceptions

Créer vos propres Exceptions d'Application
==========================================

Vous pouvez créer vos propres exceptions d'application en utilisant l'une des
exceptions intégrées
`SPL exceptions <https://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
, ou :php:exc:`Cake\\Core\\Exception\\Exception`.
Si votre application contenait l'exception suivante::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
    }

Vous pourriez produire des erreurs de développement élégantes en créant
**templates/Error/missing_widget.php**. En production, l'erreur ci-dessus serait
traitée comme une erreur 500 et utiliserait le template **error500**.

Si vos exceptions ont un code compris entre ``400`` et ``506``, le code de
l'exception sera utilisé comme code de réponse HTTP.

Le constructeur pour :php:exc:`Cake\\Core\\Exception\\Exception` vous permet de
passer des données supplémentaires. Ces données supplémentaires sont interpolées
dans le ``_messageTemplate``. Cela vous permet de créer des exceptions riches en
données, qui fournissent plus de contexte autour de vos erreurs::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        // Les données de contexte sont interpolées dans cette chaîne formatée.
        protected $_messageTemplate = 'On dirait qu'il manque %s.';

        // Vous pouvez aussi définir un code d'exception par défaut.
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

Lors du rendu, le template de votre vue disposerait d'une variable ``$widget``
déjà définie. Si vous castez l'exception en <em>string</em> ou si vous utilisez
sa méthode ``getMessage()``, vous obtiendrez ``On dirait qu'il manque Pointy.``.

Logger des Exceptions
--------------------------

Avec la gestion d'erreurs intégrée, vous pouvez faire logger par ErrorHandler
toutes les exceptions auxquelles vous aurez affaire en définissant l'option
``log`` à ``true`` dans votre **config/app.php**. Le fait de l'activer va logger
toutes les exceptions dans :php:class:`Cake\\Log\\Log` et les <em>loggers</em>
configurés.

.. note::

    Si vous utilisez un gestionnaire d'exceptions personnalisé, ce paramètre
    n'aura aucun effet. À moins que vous ne le référenciez depuis votre
    implémentation.


.. php:namespace:: Cake\Http\Exception

.. _built-in-exceptions:

Exceptions Intégrées de CakePHP
===============================

Il existe plusieurs exceptions intégrées à l'intérieur de CakePHP, en plus des
exceptions d'infrastructure internes, et il existe plusieurs exceptions pour les
méthodes HTTP.

Exceptions HTTP
---------------

.. php:exception:: BadRequestException

    Utilisée pour faire une erreur 400 de Mauvaise Requête.

.. php:exception:: UnauthorizedException

    Utilisée pour faire une erreur 401 Non Autorisé.

.. php:exception:: ForbiddenException

    Utilisée pour faire une erreur 403 Interdite.

.. php:exception:: InvalidCsrfTokenException

    Utilisée pour faire une erreur 403 causée par un token CSRF invalide.

.. php:exception:: NotFoundException

    Utilisée pour faire une erreur 404 Non Trouvé.

.. php:exception:: MethodNotAllowedException

    Utilisée pour faire une erreur 405 pour les Méthodes Non Autorisées.

.. php:exception:: NotAcceptableException

    Utilisée pour faire une erreur 406 Not Acceptable.

.. php:exception:: ConflictException

    Utilisée pour faire une erreur 409 Conflict.

.. php:exception:: GoneException

    Utilisée pour faire une erreur 410 Gone.

Pour plus de détails sur les codes de statut d'erreur HTTP 4xx, regardez
:rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException

    Utilisée pour faire une erreur 500 du Serveur Interne.

.. php:exception:: NotImplementedException

    Utilisée pour faire une erreur 501 Non Implémentée.

.. php:exception:: ServiceUnavailableException

    Utilisée pour faire une erreur 503 Service Unavailable.

Pour plus de détails sur les codes de statut d'erreur HTTP 5xx, regardez
:rfc:`2616#section-10.5`.

Vous pouvez lancer ces exceptions à partir de vos controllers pour indiquer
les états d'échecs, ou les erreurs HTTP. Un exemple d'utilisation des
exceptions HTTP pourrait être le rendu de pages 404 pour les items qui n'ont
pas été trouvés::

    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->viewBuilder()->setOption('serialize', ['article']);

    }

En utilisant les exceptions pour les erreurs HTTP, vous pouvez garder à la
fois votre code propre, et donner les réponses RESTful aux applications
clientes et aux utilisateurs.

Utiliser des Exceptions HTTP dans vos Contrôleurs
-------------------------------------------------

Vous pouvez lancer n'importe quelle exception HTTP depuis les actions de vos
contrôleurs pour indiquer des états d'échec. Par exemple::

    use Cake\Network\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article introuvable'));
        }
        $this->set('article', 'article');
        $this->viewBuilder()->setOption('serialize', ['article']);
    }

Ce qui précède va faire que le gestionnaire d'exception qui a été configuré
attrape et traite la :php:exc:`NotFoundException`. Par défaut, cela créera une
page d'erreur et loggera l'exception.

Autres Exceptions Intégrées
---------------------------

De plus, CakePHP utilise les exceptions suivantes:

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException

    La classe View choisie n'a pas pu être trouvée.

.. php:exception:: MissingTemplateException

    Le fichier de template choisi n'a pas pu être trouvé.

.. php:exception:: MissingLayoutException

    Le layout choisi n'a pas pu être trouvé.

.. php:exception:: MissingHelperException

    Un helper n'a pas pu être trouvé.

.. php:exception:: MissingElementException

   L'element n'a pas pu être trouvé.

.. php:exception:: MissingCellException

    La classe Cell choisie n'a pas pu être trouvée.

.. php:exception:: MissingCellViewException

    La vue de Cell choisie n'a pas pu être trouvée.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    Un component configuré n'a pas pu être trouvé.

.. php:exception:: MissingActionException

    L'action demandée du controller n'a pas pu être trouvé.

.. php:exception:: PrivateActionException

    Accès à une action préfixée par \_, privée ou protégée.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    Une classe de la librairie console a rencontré une erreur

.. php:exception:: MissingTaskException

    Une tâche configurée n'a pas pu être trouvée.

.. php:exception:: MissingShellException

    Une classe de shell n'a pas pu être trouvée.

.. php:exception:: MissingShellMethodException

    Une classe de shell choisie n'a pas de méthode de ce nom.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException

    Une connexion à un model n'existe pas.

.. php:exception:: MissingDriverException

    Un driver de base de donnée de n'a pas pu être trouvé.

.. php:exception:: MissingExtensionException

    Une extension PHP est manquante pour le driver de la base de données.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    Une table du model n'a pas pu être trouvé.

.. php:exception:: MissingEntityException

    Une entity du model n'a pas pu être trouvé.

.. php:exception:: MissingBehaviorException

    Une behavior du model n'a pas pu être trouvé.

.. php:exception:: PersistenceFailedException

    Une entity n'a pas pu être sauvegardée / supprimée en utilisant :php:meth:`Cake\\ORM\\Table::saveOrFail()` ou
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()`

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

    L'enregistrement demandé n'a pas pu être trouvé. Génère une réponse avec
    une entête 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    Le controller requêté n'a pas pu être trouvé.

.. php:exception:: MissingRouteException

    L'URL demandée ne pas peut pas être inversée ou ne peut pas être parsée.

.. php:exception:: MissingDispatcherFilterException

    Le filtre du dispatcher n'a pas pu être trouvé.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    Classe de base des exceptions dans CakePHP. Toutes les exceptions
    lancées par CakePHP étendent cette classe.

Ces classes d'exception étendent toutes :php:exc:`Exception`.
En étendant Exception, vous pouvez créer vos propres erreurs 'framework'.

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

Toutes les exceptions Http et CakePHP étendent la classe Exception, qui
a une méthode pour ajouter les en-têtes à la réponse. Par exemple quand vous
lancez une MethodNotAllowedException 405,
le rfc2616 dit::

    "La réponse DOIT inclure un en-tête contenant une liste de méthodes valides
    pour la ressource requêtée."

.. meta::
    :title lang=fr: Gestionnaire d'Erreurs & d'Exceptions
    :keywords lang=fr: stack traces,erreur,affichage défaut,fonction anonyme,gestionanire d'erreur,erreur défaut,niveau erreur,gestionnaire exception,eurreur php,erreur écriture,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, erreur fatale
