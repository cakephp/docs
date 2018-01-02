Gestion des Erreurs & Exceptions
################################

Un grand nombre de méthodes internes à PHP utilisent les erreurs pour
communiquer les échecs. Ces erreurs doivent être récupérées et traitées.
CakePHP fournit un récupérateur d'erreurs qui les affiche et/ou les écrit dans
des fichiers de log par défaut lorsqu'elles se produisent. Ce gestionnaire
d'erreurs est utilisé pour capturer les exceptions non interceptées par les
controllers et par les autres parties de votre application.

.. _error-configuration:

Configuration des Erreurs et des Exceptions
===========================================

La configuration des Erreurs est faite à l'intérieur du fichier
**config/app.php** de votre application. Par défaut CakePHP utilise la classe
``ErrorHandler`` ou ``ConsoleErrorHandler`` pour capturer et afficher/mettre
les erreurs dans des fichiers de log. Vous pouvez remplacer ce comportement en
changeant le gestionnaire d'erreurs par défaut. Le gestionnaire d'erreurs par
défaut gère également les exceptions non interceptées.

La gestion des erreurs accepte quelques options qui vous permettent de
personnaliser la gestion des erreurs pour votre application:

* ``errorLevel`` - int - Le niveau d'erreurs que vous souhaitez pour la
  capture. Utilisez les constantes d'erreur intégrées à PHP et les bitmasks
  pour sélectionner le niveau d'erreur qui vous intéresse.
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
  d'allouer un petit espace mémoire supplémentaire pour la journalisation
  (logging) ainsi que la gestion d'erreur.

ErrorHandler affiche par défaut les erreurs quand ``debug`` est ``true`` et les
erreurs de logs quand ``debug`` est ``false``. Le type d'erreurs capté dans les
deux cas est contrôlé par ``errorLevel``. Le gestionnaire d'erreurs fatales va
être appelé indépendamment de ``debug`` ou de la configuration de
``errorLevel``, mais le résultat va être différent, basé sur le niveau de
``debug``. Le comportement par défaut pour les erreurs fatales est d'afficher
une page avec une erreur interne du serveur (``debug`` désactivé) ou une page
avec le message, le fichier et la ligne (``debug`` activé).

.. note::

    Si vous utilisez un gestionnaire d'erreurs personnalisé, les options
    supportées dépendent de votre gestionnaire.

Créer vos Propres Gestionnaires d'Erreurs
=========================================

Vous pouvez créer un gestionnaire d'erreurs à partir de n'importe quel type de
callback. Par exemple, vous pouvez utiliser une classe appelée ``AppError``
pour gérer vos erreurs. En étendant ``BaseErrorHandler``, vous pouvez fournir
une logique de gestion des erreurs personnalisée. Un exemple serait::

    // Dans config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // Dans src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        public function _displayError($error, $debug)
        {
            echo 'Il y a eu une erreur!';
        }
        public function _displayException($exception)
        {
            echo 'Il y a eu un exception';
        }
    }

``BaseErrorHandler`` définit deux méthodes abstraites. ``_displayError()`` est
utilisée lorsque les erreurs sont déclenchées. La méthode
``_displayException()`` est appelée lorsqu'il y a une exception non interceptée.

Changer le Comportement des Erreurs Fatales
===========================================

Le gestionnaire d'erreurs par défaut convertit les erreurs fatales en exceptions
et réutilise la logique de traitement d'exception pour afficher une page
d'erreur. Si vous ne voulez pas montrer la page d'erreur standard, vous pouvez
la surcharger comme ceci::

    // Dans config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // Dans src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Autre méthode.

        public function handleFatalError($code, $description, $file, $line)
        {
            return 'Une erreur fatale est survenue';
        }
    }

.. php:namespace:: Cake\Http\Exception

Classes des Exceptions
======================

Il y a de nombreuses classes d'exception dans CakePHP. Le gestionnaire
d'exception intégré va capturer les exceptions levées et rendre une page
utile. Les exceptions qui n'utilisent pas spécialement un code dans la
plage 400 seront traitées comme une erreur interne au serveur.

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

.. versionadded:: 3.1

    InvalidCsrfTokenException a été ajoutée.

.. php:exception:: InvalidCsrfTokenException

    Utilisée pour faire une erreur 403 causée par un token CSRF invalide.

.. php:exception:: NotFoundException

    Utilisée pour faire une erreur 404 Non Trouvé.

.. php:exception:: MethodNotAllowedException

    Utilisée pour faire une erreur 405 pour les Méthodes Non Autorisées.

.. php:exception:: NotAcceptableException

    Utilisée pour faire une erreur 406 Not Acceptable.

    .. versionadded:: 3.1.7 NotAcceptableException a été ajoutée.

.. php:exception:: ConflictException

    Utilisée pour faire une erreur 409 Conflict.

    .. versionadded:: 3.1.7 ConflictException a été ajoutée.

.. php:exception:: GoneException

    Utilisée pour faire une erreur 410 Gone.

    .. versionadded:: 3.1.7 GoneException a été ajoutée.

Pour plus de détails sur les codes de statut d'erreur HTTP 4xx, regardez
:rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException

    Utilisée pour faire une erreur 500 du Serveur Interne.

.. php:exception:: NotImplementedException

    Utilisée pour faire une erreur 501 Non Implémentée.

.. php:exception:: ServiceUnavailableException

    Utilisée pour faire une erreur 503 Service Unavailable.

    .. versionadded:: 3.1.7 Service Unavailable a été ajoutée.

Pour plus de détails sur les codes de statut d'erreur HTTP 5xx, regardez
:rfc:`2616#section-10.5`.

Vous pouvez lancer ces exceptions à partir de vos controllers pour indiquer
les états d'échecs, ou les erreurs HTTP. Un exemple d'utilisation des
exceptions HTTP pourrait être le rendu de pages 404 pour les items qui n'ont
pas été trouvés::

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

En utilisant les exceptions pour les erreurs HTTP, vous pouvez garder à la
fois votre code propre, et donner les réponses RESTful aux applications
clientes et aux utilisateurs.

De plus, les exceptions de couche du framework suivantes sont disponibles, et
seront lancées à partir de certains components du cœur de CakePHP:

Autres Exceptions Intégrées
---------------------------

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

    .. versionadded:: 3.4.1 PersistenceFailedException a été ajoutée.

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
Toutes les Exceptions standards que CakePHP va lancer étendent également
Exception.

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

Toutes les exceptions Http et CakePHP étendent la classe Exception, qui
a une méthode pour ajouter les en-têtes à la réponse. Par exemple quand vous
lancez une MethodNotAllowedException 405,
le rfc2616 dit::

    "La réponse DOIT inclure un en-tête contenant une liste de méthodes valides
    pour la ressource requêtée."

Utiliser les Exceptions HTTP dans vos Controllers
=================================================

Vous pouvez envoyer n'importe quelle exception HTTP liée à partir des actions
de votre controller pour indiquer les états d'échec. Par exemple::

    // Prior to 3.6 use Cake\Http\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

Ce qui précède va faire que le gestionnaire d'exception attrape et traite la
:php:exc:`NotFoundException`. Par défaut, cela va créer une page d'erreur et
enregistrer l'exception.

.. _error-views:

Exception Renderer
==================

.. php:class:: ExceptionRenderer(Exception $exception)

La classe ExceptionRenderer avec l'aide de ``ErrorController`` s'occupe du rendu
des pages d'erreur pour toutes les exceptions lancées par votre application.

Les vues de la page d'erreur sont localisées dans **src/Template/Error/**. Pour
toutes les erreurs 4xx et 5xx, les fichiers de template **error400.ctp** et
**error500.ctp** sont utilisées respectivement. Vous pouvez les personnaliser
selon vos besoins. Par défaut, votre **src/Template/Layout/error.ctp** est
également utilisé pour les pages d'erreur. Si par exemple, vous voulez utiliser
un autre layout **src/Template/Layout/my_error.ctp** pour vos pages d'erreur,
modifiez simplement les vues d'erreur et ajoutez la ligne
``$this->layout = 'my_error';`` dans **error400.ctp** et **error500.ctp**.

Chaque exception au niveau du framework a son propre fichier de vue localisé
dans les templates du cœur mais vous n'avez pas besoin de les personnaliser
puisqu'ils sont utilisés seulement pendant le développement. Avec debug éteint,
toutes les exceptions au niveau du framework sont converties en
``InternalErrorException``.

.. index:: application exceptions

Créer vos Propres Exceptions dans votre Application
===================================================

Vous pouvez créer vos propres exceptions d'application en utilisant toute
`exception SPL <http://php.net/manual/fr/spl.exceptions.php>`_ intégrée,
``Exception`` lui-même ou ::php:exc:`Cake\\Core\\Exception\\Exception`.

Si votre application contenait l'exception suivante::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {};

Vous pourriez fournir de jolies erreurs de développement, en créant
**src/Template/Error/missing_widget.ctp**. Quand on est en mode production,
l'erreur du dessus serait traitée comme une erreur 500. Le constructeur
pour :php:exc:`Cake\\Core\\Exception\\Exception` a été étendu, vous autorisant
à lui passer des données hashées. Ces hashs sont interpolés dans le
messageTemplate, ainsi que dans la vue qui est utilisée pour représenter
l'erreur dans le mode développement. Cela vous permet de créer des exceptions
riches en données, en fournissant plus de contexte pour vos erreurs. Vous pouvez
aussi fournir un template de message qui permet aux méthodes natives
``__toString()`` de fonctionner normalement::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        protected $_messageTemplate = 'Il semblerait que %s soit manquant.';
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

Lorsque le gestionnaire d'exception intégré attrapera l'exception, vous
obtiendriez une variable ``$widget`` dans votre template de vue d'erreur.
De plus, si vous attrapez l'exception en chaîne ou utilisez sa méthode
``getMessage()``, vous aurez ``Il semblerait que Pointy soit manquant.``.
Cela vous permet de créer rapidement vos propres erreurs de développement
riches, exactement comme CakePHP le fait en interne.

Créer des Codes de Statut Personnalisés
---------------------------------------

Vous pouvez créer des codes de statut HTTP personnalisés en changeant le code
utilisé quand vous créez une exception::

    throw new MissingWidgetHelperException('Widget manquant', 501);

Va créer un code de réponse 501, vous pouvez utiliser le code de statut
HTTP que vous souhaitez. En développement, si votre exception n'a pas
de template spécifique, et que vous utilisez un code supérieur ou égal
à ``500``, vous verrez le template **error500.ctp**. Pour tout autre code
d'erreur, vous aurez le template **error400.ctp**. Si vous avez défini un
template d'erreur pour votre exception personnalisée, ce template sera utilisé
en mode développement. Si vous souhaitez votre propre logique de gestionnaire
d'exception même en production, regardez la section suivante.

Etendre et Implémenter vos Propres Gestionnaires d'Exceptions
=============================================================

Vous pouvez implémenter un gestionnaire d'exception spécifique pour votre
application de plusieurs façons. Chaque approche vous donne différents
niveaux de contrôle sur le processus de gestion d'exception.

- Créer et enregistrer votre propre gestionnaire d'erreurs.
- Etendre le ``BaseErrorHandler`` fourni par CakePHP.
- Configurer l'option ``exceptionRenderer`` dans le gestionnaire d'erreurs par
  défaut.

Dans les prochaines sections, nous allons détailler les différentes approches
et les bénéfices de chacune.

Créer votre Propre Gestionnaire d'Exceptions
--------------------------------------------

Créer votre propre gestionnaire d'exception vous donne le contrôle total sur le
processus de gestion des exceptions. Dans ce cas, vous devrez vous-même appeler
``set_exception_handler``.

Etendre le BaseErrorHandler
---------------------------

La section :ref:`Configurer les erreurs <error-configuration>` comporte un
exemple.

Utiliser l'Option exceptionRenderer dans le Gestionnaire par Défaut
-------------------------------------------------------------------

Si vous ne voulez pas prendre le contrôle sur le gestionnaire d'exception,
mais que vous voulez changer la manière dont les exceptions sont rendues, vous
pouvez utiliser l'option ``exceptionRenderer`` dans **config`/app.php** pour
choisir la classe qui affichera les pages d'exception. Par défaut
:php:class:`Cake\\Core\\Exception\\ExceptionRenderer` est utilisée. Votre
gestionnaire d'exceptions doit être placé dans **src/Error**. Dans une classe
de rendu personnalisé d'exception vous pouvez fournir un traitement particulier
pour les erreurs spécifique à votre application::

    // Dans src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            return 'Oups ce widget est manquant!';
        }
    }

    // Dans config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

Le code ci-dessus gérerait toutes les exceptions de type
``MissingWidgetException``, et vous permettrait un affichage et/ou une logique
de gestion personnalisée pour ces exceptions de l'application.
Les méthodes de gestion d'exceptions obtiennent l'exception étant traitée en
argument. Votre gestionnaire de rendu personnalisé peut retourner une chaîne ou
un objet ``Response``. Retourner une ``Response`` vous donnera le contrôle
total de la réponse.

.. note::

    Votre gestionnaire de rendu doit attendre une exception dans son
    constructeur et implémenter une méthode de rendu. Ne pas le faire
    entraînera des erreurs supplémentaires.

    Si vous utilisez un gestionnaire d'exception personnalisé, configurer le
    moteur de rendu n'aura aucun effet. A moins que vous le référenciez à
    l'intérieur de votre implémentation.

Créer un Controller Personnalisé pour Gérer les Exceptions
----------------------------------------------------------

Par convention CakePHP utilisera ``App\Controller\ErrorController`` s'il existe.
Implémenter cette classe vous offrira une voie pour personnaliser les pages
d'erreur sans aucune configuration supplémentaire.

Si vous utilisez un moteur de rendu d'exceptions personnalisé, vous pouvez
utiliser la méthode ``_getController()`` pour rendre un controller personnalisé.
En implémentant ``_getController()`` dans votre moteur de rendu d'exceptions,
vous pouvez utiliser n'importe quel controller de votre choix::

    // Dans src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController($exception)
        {
            return new SuperCustomErrorController();
        }
    }

    // Dans config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

Le controller d'erreur, qu'il soit conventionnel ou personnalisé, est utilisé
pour rendre la vue de page d'erreurs et reçoit tous les événements standards
du cycle de vie des requêtes.

Logger les Exceptions
---------------------

En Utilisant la gestion d'exception intégrée, vous pouvez logger toutes les
exceptions qui sont gérées par ErrorHandler en configurant l'option ``log`` à
``true`` dans votre **config/app.php**. Activer cela va logger chaque exception
vers :php:class:`Cake\\Log\\Log` et les loggers configurés.

.. note::

    Si vous utilisez un gestionnaire personnalisé, cette configuration
    n'aura aucun effet. A moins que vous ne le référenciez à l'intérieur de
    votre implémentation.

.. meta::
    :title lang=fr: Gestionnaire d'Erreurs & d'Exceptions
    :keywords lang=fr: stack traces,erreur,affichage défaut,fonction anonyme,gestionanire d'erreur,erreur défaut,niveau erreur,gestionnaire exception,eurreur php,erreur écriture,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, erreur fatale
