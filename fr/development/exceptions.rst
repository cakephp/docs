Exceptions
##########

Les Exceptions peuvent être utilisées pour une variété d'utilisations dans 
votre application. CakePHP utilise les exceptions en interne pour indiquer les 
erreurs logiques ou les erreurs d'utilisation. Toutes les exceptions raises de 
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
  logged à CakePHP.

Le rendu d'Exception par défaut affiche une page HTML, vous pouvez 
personnaliser soit le gestionnaire soit le rendu en changeant les 
configurations. Changer le gestionnaire, vous permet de prendre le contrôle 
total sur le processus de gestion d'exception, tandis que changer le rendu 
vous permet de changer facilement la sortie type/contenu, ainsi que d'ajouter 
une gestion d'exception spécifique dans l'application.

Classes d'Exception
===================

Il y a un certain nombre de classes d'exception dans CakePHP. Chaque exception 
remplace un message d'erreur ``cakeError()`` du passé. Les Exceptions offrent 
une flexibilité supplémentaire dans laquelle elles peuvent étendre et contenir 
de la logique. L'exception intégrée va capturer toute exception non attrapée 
et rendre une page utile. Les Exceptions qui n'utilisent pas spécifiquement 
un code 400, seront traitées comme des Erreurs Interne du Serveur.

.. index:: application exceptions

Créer vos propres exceptions dans votre application
===================================================

Vous pouvez créer vos propres exception d'application en utilisant toute 
`exception SPL <http://php.net/manual/en/spl.exceptions.php>`_ intégrée, 
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
        protected $_messageTemplate = 'Seems that %s is missing.';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));


Quand attrapé par le gestionnaire d'exception intégré, vous obtiendriez 
une variable ``$widget`` dans votre template de vue d'erreur. De plus, 
si vous attrapez l'exception en chaîne ou utilisez sa méthode ``getMessage()``, 
vous auriez ``Il semble que Pointy soit manquant.``. Cela vous permet de 
créer facilement et rapidement vos propres erreurs de développement riche, 
juste comme CakePHP en interne.

Créer des codes de statut personnalisés
---------------------------------------

Vous pouvez créer des codes de statut HTTP personnalisés en changeant le code 
utilisé quand vous créez une exception::

    throw new MissingWidgetHelperException('Its not here', 501);

Va créer un code de réponse ``501``, vous pouvez utiliser le code de statut 
HTTP que vous souhaitez. En développement, si votre exception n'a pas 
de template spécifique, et que vous utilisez un code égal ou supérieur 
à ``500``, vous verrez le template ``error500``. Pour toute autre code 
d'erreur, vous aurez le template ``error400``. Si vous avez défini un template 
d'erreur pour votre exception personnalisée, ce template va être utilisé 
en mode développement. Si vous souhaitez votre propre gestionnaire d'exception 
logique même en production, regardez la section suivante.

Etendre et Implementer vos propres gestionnaires d'Exception
============================================================

Vous pouvez implémenter un gestionnaire d'exception spécifique pour votre 
application de plusieurs façons. Chaque approche vous donne différents 
montants de contrôle sur le processus de gestion d'exception.

- Set ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
- Create ``AppController::appError();``
- Set ``Configure::write('Exception.renderer', 'YourClass');``

Dans les quelques section prochaines, nous allons détailler les approches 
variables et les bénéfices de chacun.

Créer vos propress gestionnaires d'Exception avec `Exception.handler`
=====================================================================

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
plus le message d'exception. Vouspouvez définir des gestionnaires d'exception 
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

Utiliser AppController::appError();
===================================

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
répertoire ``Error``` dans tout chemin bootstrapped Lib. Dans une classe 
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
            App::uses('SuperCustomError', 'Controller');
            return new SuperCustomErrorController();
        }
    }

De façon alternative, vous pouvez simplement écraser le CakeErrorController 
du coeur, en en incluant un dans ``app/Controller``. Si vous utilisez un 
controller personnalisé pour la gestion des erreurs, assurez-vous de faire 
toutes les configurations dont vous aurez besoin dans votre constructeur, 
ou dans la méthode de rendu. Puisque celles-ci sont les seules méthodes 
que la classe ``ErrorHandler`` intégrée appelle directement.


Logging exceptions
------------------

Utiliser la gestion d'exception intégrée, vous pouvez lancer les exceptions 
qui sont gérées avec ErrorHandler en configurant ``Exception.log`` à true
dans votre core.php. Activer cela va lacer chaque exception vers 
:php:class:`CakeLog` et les loggers configurés.

.. note::

    Si vous utilisez un ``Exception.handler`` personnalisé, cette configuration 
    n'aura aucun effet. A moins que vous le référenciez à l'intérieur de votre 
    implémentation.

.. _built-in-exceptions:

Exceptions intégrées pour CakePHP
=================================

There are several built-in exceptions inside CakePHP, outside of the 
internal framework exceptions, there are several 
exceptions for HTTP methods

.. php:exception:: BadRequestException

    Utilisé pour faire une erreur 400 de Mauvaise Requête.

.. php:exception::UnauthorizedException

    Utilisé pour faire une erreur 401 Non Trouvé.

.. php:exception:: ForbiddenException

    Utilisé pour faire une erreur 403 Interdite.

.. php:exception:: NotFoundException

    Utilisé pour faire une erreur 404 Non Trouvé.

.. php:exception:: MethodNotAllowedException

    Utilisé pour faire une erreur 405 pour les Méthodes Non Autorisées.

.. php:exception:: InternalErrorException

    Utilisé pour faire une Erreur 500 du Serveur Interne.

Vous pouvez lancer ces exceptions à partir de vos controllers pour indiquer 
les états d'échec, ou les erreurs HTTP. Un exemple d'utilisation des exceptions 
HTTP pourraient rendre les pages 404 pour les items qui n'ont pas été trouvés::

    <?php 
    public function view ($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('N a pas trouvé ce post');
        }
        $this->set('post', $post);
    }

En utilisant les exceptions pour les erreurs HTTP, vous pouvez garder à la 
fois votre code propre, et donner les réponses complètement REST aux 
appications clientes et aux utilisateurs.

De plus, les exceptions de couche du framework suivantes sont disponibles, et 
seront lancées à partir de certains comonents du coeur de CakePHP:

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

    Une connection à un model n'existe pas.

.. php:exception:: MissingTableException

    Une table de model est manquante.

.. php:exception:: MissingActionException

    L'action du controller requêté n'a pas pu être trouvé.

.. php:exception:: MissingControllerException

    Le controller requêté n'a pas pu être trouvé.

.. php:exception:: PrivateActionException

    Accès privé à l'action. Soit les actions ont un accès 
    privé/protegé/préfixé par _, ou essaient d'accéder aux routes préfixés de 
    manière incorrecte.

.. php:exception:: CakeException

    Classe d'exception de base dans CakePHP. Toutes les exceptions lancées par 
    CakePHP étendront cette classe.

Ces classes d'exception étendent toutes :php:exc:`CakeException`. 
En étendant CakeException, vous pouvez créer vos propres erreurs 'framework'.
Toutes les Exceptions standardes que CakePHP va aussi lancer les CakeException 
étendues.

Utiliser les exceptions HTTP dans vos controllers
=================================================

Vous pouvez envoyer n'importe quelle exception HTTP lié à partir des actions 
de votre controller pour indiquer les états d'échec. Par exemple::

    public function view($id) {
        $post = $this->Post->read(null, $id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

Ce qui est au-dessus causerait l'``Exception.handler`` configurée pour attraper 
et traiter :php:exc:`NotFoundException`. Par défaut, cela va créer une page 
d'erreur et enregistrer l'exception.


.. meta::
    :title lang=fr: Exceptions
    :keywords lang=fr: exceptions non attrapées,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
