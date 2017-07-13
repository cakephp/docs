Exceptions
##########

Les Exceptions peuvent être utilisées pour une variété d'utilisations dans
votre application. CakePHP utilise les exceptions en interne pour indiquer les
erreurs logiques ou les erreurs d'utilisation. Toutes les exceptions levées de
CakePHP étendent :php:exc:`CakeException`, et il y a des exceptions spécifiques
selon les classes/tâches qui étendent la classe de base.

CakePHP fournit aussi un nombre de classes d'exceptions qui peuvent être
utilisées pour les erreurs HTTP. Regardez la section sur
:ref:`built-in-exceptions` pour plus d'informations.

Configuration de Exception
==========================

Il y a certaines clés disponibles pour configurer les exceptions::

    Configure::write('Exception', array(
        'handler' => 'ErrorHandler::handleException',
        'renderer' => 'ExceptionRenderer',
        'log' => true
    ));

* ``handler`` - callback - Le callback pour gérer les exceptions. Vous pouvez
  définir ceci pour n'importe quel type de callback, incluant les fonctions
  anonymes.
* ``renderer`` - string - La classe responsable du rendu des exceptions non
  attrapées.
  Si vous choisissez une classe personnalisée, vous devriez placer ce fichier
  pour cette classe dans app/Lib/Error.
  Cette classe a besoin d'implémenter une méthode ``render()``.
* ``log`` - boolean - Quand à true, les exceptions + leurs stack traces seront
  logged à CakeLog.
* ``consoleHandler`` - callback - The callback used to handle exceptions, in a
  console context. If undefined, CakePHP's default handler will be used.

Le rendu d'Exception par défaut affiche une page HTML, vous pouvez
personnaliser soit le gestionnaire soit le rendu en changeant les
configurations. Changer le gestionnaire, vous permet de prendre le contrôle
total sur le processus de gestion d'exception, tandis que changer le rendu
vous permet de changer facilement la sortie type/contenu, ainsi que d'ajouter
une gestion d'exception spécifique dans l'application.

.. versionadded:: 2.2
    L'option ``Exception.consoleHandler`` a été ajoutée dans 2.2.

Classes d'Exception
===================

Il y a un certain nombre de classes d'exception dans CakePHP. Chaque exception
remplace un message d'erreur ``cakeError()`` du passé. Les Exceptions offrent
une flexibilité supplémentaire dans laquelle elles peuvent étendre et contenir
de la logique. L'exception intégrée va capturer toute exception non attrapée
et rendre une page utile. Les Exceptions qui n'utilisent pas spécifiquement
un code 400, seront traitées comme une Erreur Interne du Serveur.

.. _built-in-exceptions:

Exceptions intégrées pour CakePHP
=================================

Il y a plusieurs exceptions intégrées dans CakePHP, en-dehors des exceptions
internes du framework, il y a plusieurs exceptions pour les méthodes HTTP.

.. php:exception:: BadRequestException

    Utilisé pour faire une erreur 400 de Mauvaise Requête.

.. php:exception:: UnauthorizedException

    Utilisé pour faire une erreur 401 Non Autorisé.

.. php:exception:: ForbiddenException

    Utilisé pour faire une erreur 403 Interdite.

.. php:exception:: NotFoundException

    Utilisé pour faire une erreur 404 Non Trouvé.

.. php:exception:: MethodNotAllowedException

    Utilisé pour faire une erreur 405 pour les Méthodes Non Autorisées.

.. php:exception:: InternalErrorException

    Utilisé pour faire une Erreur 500 du Serveur Interne.

.. php:exception:: NotImplementedException

    Utilisé pour faire une Erreur 501 Non Implémentée.

Vous pouvez lancer ces exceptions à partir de vos controllers pour indiquer
les états d'échecs, ou les erreurs HTTP. Un exemple d'utilisation des
exceptions HTTP pourrait être le rendu de pages 404 pour les items qui n'ont
pas été trouvés::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('Impossible de trouver ce poste');
        }
        $this->set('post', $post);
    }

En utilisant les exceptions pour les erreurs HTTP, vous pouvez garder à la
fois votre code propre, et donner les réponses complètement REST aux
applications clientes et aux utilisateurs.

De plus, les exceptions de couche du framework suivantes sont disponibles, et
seront lancées à partir de certains components du coeur de CakePHP:

.. php:exception:: CakeException

    Classe d'exception de base dans CakePHP. Toutes les exceptions lancées par
    CakePHP étendront cette classe.

Ces classes d'exception étendent toutes :php:exc:`CakeException`.
En étendant CakeException, vous pouvez créer vos propres erreurs 'framework'.
Toutes les Exceptions standards que CakePHP va aussi lancer les CakeException
étendues.

.. versionadded:: 2.3
    CakeBaseException a été ajoutée

.. php:exception:: CakeBaseException

    La classe d'exception de base dans CakePHP.
    Toutes les CakeExceptions et HttpExceptions ci-dessus étendent cette
    classe.

.. php:method:: responseHeader($header = null, $value = null)

    Voir :php:func:`CakeResponse::header()`.

Toutes les exceptions Http et CakePHP étendent la classe CakeBaseException, qui
a une méthode pour ajouter les en-têtes à la réponse. Par exemple quand vous
lancez une MethodNotAllowedException 405,
le rfc2616 dit:
"La réponse DOIT inclure un en-tête contenant une liste de méthodes valides
pour la ressource requêtée."

.. php:exception:: MissingViewException

    Le fichier de vue choisi n'a pas pu être trouvé.

.. php:exception:: MissingLayoutException

    Le layout choisi n'a pas pu être trouvé.

.. php:exception:: MissingHelperException

    Un helper n'a pas pu être trouvé.

.. php:exception:: MissingBehaviorException

    Un behavior configuré n'a pas pu être trouvé.

.. php:exception:: MissingComponentException

    Un component configuré n'a pas pu être trouvé.

.. php:exception:: MissingTaskException

    Une tâche configurée n'a pas pu être trouvée.

.. php:exception:: MissingShellException

    La classe shell n'a pas pu être trouvée.

.. php:exception:: MissingShellMethodException

    La classe de shell choisi n'a pas de méthode avec ce nom.

.. php:exception:: MissingDatabaseException

    La base de donnée configurée n'existe pas.

.. php:exception:: MissingConnectionException

    Une connexion à un model n'existe pas.

.. php:exception:: MissingTableException

    Une table de model est manquante du cache de CakePHP ou de la source de
    données. Après l'ajout d'une nouvelle table à une source de données, le
    cache du model (trouvé dans tmp/cache/models par défaut) devra être retiré.

.. php:exception:: MissingActionException

    L'action du controller requêté n'a pas pu être trouvé.

.. php:exception:: MissingControllerException

    Le controller requêté n'a pas pu être trouvé.

.. php:exception:: PrivateActionException

    Accès privé à l'action. Soit les actions ont un accès
    privé/protegé/préfixé par _, ou essaient d'accéder aux routes préfixés de
    manière incorrecte.

Utiliser les exceptions HTTP dans vos controllers
=================================================

Vous pouvez envoyer n'importe quelle exception HTTP liée à partir des actions
de votre controller pour indiquer les états d'échec. Par exemple::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

Ce qui est au-dessus causerait l'``Exception.handler`` configurée pour attraper
et traiter :php:exc:`NotFoundException`. Par défaut, cela va créer une page
d'erreur et enregistrer l'exception.

.. _error-views:

Exception Renderer
==================

.. php:class:: ExceptionRenderer(Exception $exception)

La classe ExceptionRenderer avec l'aide de ``CakeErrorController`` s'occupe
du rendu des pages d'erreur pour toutes les exceptions lancées par votre
application.

Les vues de la page d'erreur sont localisées dans ``app/View/Errors/``. Pour
toutes les erreurs 4xx et 5xx, les fichiers de vue ``error400.ctp`` et
``error500.ctp`` sont utilisées respectivement. Vous pouvez les personnaliser
selon vos besoins. Par défaut, votre ``app/Layouts/default.ctp`` est utilisé
aussi pour les pages d'erreur. Si par exemple, vous voulez utiliser un autre
layout ``app/Layouts/my_error.ctp`` pour vos pages d'erreur, alors modifiez
simplement les vues d'erreur et ajoutez le statement
``$this->layout = 'my_error';`` à ``error400.ctp`` et ``error500.ctp``.

Chaque exception de layer framework a son propre fichier de vue localisé dans
les templates du coeur mais vous n'avez pas besoin de personnaliser les deux
puisqu'ils sont utilisés seulement pendant le développement. Avec debug éteint,
toutes les exceptions du layer framework sont converties en
``InternalErrorException``.

.. index:: application exceptions

Créer vos propres exceptions dans votre application
===================================================

Vous pouvez créer vos propres exceptions d'application en utilisant toute
`exception SPL <https://secure.php.net/manual/en/spl.exceptions.php>`_ intégrée,
``Exception`` lui-même, ou :php:exc:`CakeException`. Les exceptions
d'Application qui étendent les Exceptions ou les exceptions SPL vont être
traitées comme une erreur 500 dans le mode de production.
:php:exc:`CakeException` est spécial dans le fait que tous les objets
:php:exc:`CakeException` sont contraints d'être soit dans des erreurs 500
soit 404, selon le code qu'ils utilisent.
Quand vous êtes en mode développement, les objets :php:exc:`CakeException`
ont besoin simplement d'un nouveau template qui matche le nom de classe afin
fournir des informations utiles. Si votre application contenait l'exception
suivante::

    class MissingWidgetException extends CakeException {};

Vous pourriez fournir des erreurs de bon développement, en créant
``app/View/Errors/missing_widget.ctp``. Quand on est en mode production,
l'erreur du dessus serait traitée comme une erreur 500. Le constructeur
pour :php:exc:`CakeException` a été étendu, vous autorisant à passer
des données hashées. Ces hashs sont interpolés dans le messageTemplate,
ainsi que dans la vue qui est utilisée pour représenter l'erreur dans le
mode développement. Cela vous permet de créer des exceptions de données
riches, en fournissant plus de contexte pour vos erreurs. Vous pouvez
aussi fournir un template de message qui permet les méthodes natives
``__toString()`` pour fonctionner normalement::


    class MissingWidgetException extends CakeException {
        protected $_messageTemplate = 'Il semblerait que %s soit manquant.';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));


Quand attrapé par le gestionnaire d'exception intégré, vous obtiendriez
une variable ``$widget`` dans votre template de vue d'erreur. De plus,
si vous attrapez l'exception en chaîne ou utilisez sa méthode ``getMessage()``,
vous auriez ``Il semblerait que Pointy soit manquant.``. Cela vous permet de
créer facilement et rapidement vos propres erreurs de développement riche,
juste comme CakePHP en interne.

Créer des codes de statut personnalisés
---------------------------------------

Vous pouvez créer des codes de statut HTTP personnalisés en changeant le code
utilisé quand vous créez une exception::

    throw new MissingWidgetHelperException('Widget manquant', 501);

Va créer un code de réponse ``501``, vous pouvez utiliser le code de statut
HTTP que vous souhaitez. En développement, si votre exception n'a pas
de template spécifique, et que vous utilisez un code égal ou supérieur
à ``500``, vous verrez le template ``error500``. Pour tout autre code
d'erreur, vous aurez le template ``error400``. Si vous avez défini un template
d'erreur pour votre exception personnalisée, ce template va être utilisé
en mode développement. Si vous souhaitez votre propre gestionnaire d'exception
logique même en production, regardez la section suivante.

Etendre et Implementer vos Propres Gestionnaires d'Exception
============================================================

Vous pouvez implémenter un gestionnaire d'exception spécifique pour votre
application de plusieurs façons. Chaque approche vous donne différents
montants de contrôle sur le processus de gestion d'exception.

- Set ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
- Create ``AppController::appError();``
- Set ``Configure::write('Exception.renderer', 'YourClass');``

Dans les prochaines sections, nous allons détailler les différentes approches
et les bénéfices de chacun.

Créer vos Propres Gestionnaires d'Exception avec `Exception.handler`
====================================================================

Créer votre propre gestionnaire d'exception vous donne plus de contrôle
sur le processus de gestion des exceptions. La classe que vous choisissez
devra être chargée dans votre ``app/Config/bootstrap.php``, ainsi elle
sera disponible pour gérer toute exception. Vous pouvez définir le gestionnaire
comme tout type de callback. En configurant ``Exception.handler`` CakePHP
va ignorer toutes les configurations d'Exception. Une configuration de
gestionnaire d'exception personnalisée pourrait par exemple ressembler à
ceci::

    // dans app/Config/core.php
    Configure::write('Exception.handler', 'AppExceptionHandler::handle');

    // dans app/Config/bootstrap.php
    App::uses('AppExceptionHandler', 'Lib');

    // dans app/Lib/AppExceptionHandler.php
    class AppExceptionHandler {
        public static function handle($error) {
            echo 'Oh noes! ' . $error->getMessage();
            // ...
        }
        // ...
    }

Vous pouvez lancer tout code que vous souhaitez à l'intérieur de
``handleException``. Le code ci-dessus afficherait simplement 'Oh noes! '
plus le message d'exception. Vous pouvez définir des gestionnaires d'exception
comme tout type de callback, même une fonction anonyme si vous utilisez
PHP 5.3::

    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });

En créant un gestionnaire d'exception personnalisé, vous pouvez fournir un
gestionnaire d'erreur personnalisé pour les exceptions de l'application. Dans
la méthode fournie comme un gestionnaire d'exception, vous pourriez faire
comme suit::

    // dans app/Lib/AppErrorHandler.php
    class AppErrorHandler {
        public static function handleException($error) {
            if ($error instanceof MissingWidgetException) {
                return self::handleMissingWidget($error);
            }
            // faire d'autres trucs.
        }
    }

.. index:: appError

Utiliser AppController::appError()
==================================

Implémenter cette méthode est une alternative pour implémenter un gestionnaire
d'exception personnalisé. Il est fourni principalement pour une compatibilité
backwards, et il n'est pas recommandé pour les nouvelles applications. Cette
méthode de controller est appelée à la place du rendu d'exception par défaut.
Il reçoit l'exception lancée comme son seul argument. Vous devriez implémenter
votre gestionnaire d'erreur dans cette méthode::

    class AppController extends Controller {
        public function appError($error) {
            // logique personnalisée va ici.
        }
    }

Utiliser un rendu personnalisé avec Exception.renderer pour gérer les exceptions d'application
==============================================================================================

Si vous ne voulez pas prendre contrôle du gestionnaire d'exception, mais que
vous voulez changer la façon dont les exceptions sont rendues, vous pouvez
utiliser ``Configure::write('Exception.renderer','AppExceptionRenderer');``
pour choisir une classe qui va rendre les pages d'exception.
Par défaut :php:class`ExceptionRenderer` est utilisée. Votre classe de rendu
d'exception personnalisée doit être placée dans ``app/Lib/Error``. Ou un
répertoire ``Error`` dans tout chemin bootstrapped Lib. Dans une classe
de rendu d'exception, vous pouvez fournir une gestion spécialisée pour les
erreurs spécifiques de l'application::

    // dans app/Lib/Error/AppExceptionRenderer.php
    App::uses('ExceptionRenderer', 'Error');

    class AppExceptionRenderer extends ExceptionRenderer {
        public function missingWidget($error) {
            echo 'Oops that widget is missing!';
        }
    }


Ce qui est au-dessus gérerait tout exception de type ``MissingWidgetException``,
et vous permettrait de fournir une logique d'affichage/de gestionnaire
personnalisé pour ces applications. Les méthodes de gestion d'exception
récupèrent l'exception en étant géré comme leur argument.

.. note::

    Votre rendu personnalisé devrait avoir une exception comme constructeur,
    et implémenter une méthode de rendu. Ne pas le faire entraînera des
    erreurs supplémentaires.

.. note::

    Si vous utilisez un ``Exception.handler`` personnalisé, cette configuration
    n'aura aucun effet. A moins que vous le référenciez à l'intérieur de votre
    implémentation.

Créer un controller personnalisé pour gérer les exceptions
----------------------------------------------------------

Dans votre sous-classe ExceptionRenderer, vous pouvez utiliser la méthode
``_getController`` pour vous permettre de retourner un controller personnalisé
pour gérer vos erreurs/ Par défaut, CakePHP utilise ``CakeErrorController``
qui enlève quelques callbacks habituels pour aider à s'assurer que les
erreurs s'affichent toujours. Cependant, vous aurez peut-être besoin d'un
controller de gestionnaire d'erreur plus personnalisé dans votre application.
En implémentant ``_getController`` dans votre classe ``AppExceptionRenderer``,
vous pouvez utiliser tout controller que vous souhaitez::

    class AppExceptionRenderer extends ExceptionRenderer {
        protected function _getController($exception) {
            App::uses('SuperCustomErrorController', 'Controller');
            return new SuperCustomErrorController();
        }
    }

De façon alternative, vous pouvez simplement écraser le CakeErrorController
du coeur, en en incluant un dans ``app/Controller``. Si vous utilisez un
controller personnalisé pour la gestion des erreurs, assurez-vous de faire
toutes les configurations dont vous aurez besoin dans votre constructeur,
ou dans la méthode de rendu. Puisque celles-ci sont les seules méthodes
que la classe ``ErrorHandler`` intégrée appelle directement.


Logging Exceptions
------------------

Utiliser la gestion d'exception intégrée, vous pouvez lancer les exceptions
qui sont gérées avec ErrorHandler en configurant ``Exception.log`` à true
dans votre core.php. Activer cela va lacer chaque exception vers
:php:class:`CakeLog` et les loggers configurés.

.. note::

    Si vous utilisez un ``Exception.handler`` personnalisé, cette configuration
    n'aura aucun effet. A moins que vous le référenciez à l'intérieur de votre
    implémentation.

.. meta::
    :title lang=fr: Exceptions
    :keywords lang=fr: exceptions non attrapées,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
