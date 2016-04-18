Gestion des Erreurs
###################

Pour 2.0 ``Object::cakeError()`` a été retirée. A la place, elle a été remplacée
par un certain nombre d'exceptions. Toutes les classes du coeur qui appelaient
avant cakeError envoient maintenant des exceptions. Cela vous donne la
possibilité de gérer les erreurs vous-même dans le code de votre application, ou
bien de laisser la gestion intégrée des exceptions.

Il n'y a jamais eu autant de contrôle pour les erreurs et la gestion des
exceptions dans CakePHP 2.0. Vous pouvez configurer les méthodes que vous voulez
pour gérer les erreurs et les exceptions en utilisant configure.

Configuration des Erreurs
=========================

La configuration des Erreurs se fait dans le fichier ``app/Config/core.php`` de
votre application. Vous pouvez définir un callback pour qu'il soit effectué à
chaque fois que votre application attrape une erreur PHP. Les
:doc:`/development/exceptions` sont gérées séparément. Le callback peut être
n'importe quel PHP appelable, avec la possibilité d'appeler une fonction
anonyme. L'erreur par défaut de la configuration de gestion ressemble à ceci::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

Vous avez 5 options intégrées quand vous gérez la configuration des erreurs:

* ``handler`` - callback - Le callback pour la gestion des erreurs. Vous pouvez
  définir ceci à n'importe quel type, y compris des fonctions anonymes.
* ``level`` - int - Le niveau d'erreurs qui vous interesse dans la capture.
  Utilisez les constantes d'erreur intégrées dans PHP, et bitmasks pour
  sélectionner le niveau d'erreur qui vous intéresse.
* ``trace`` - boolean - Inclut stack traces pour les erreurs dans les fichiers
  de log. Les Stack traces seront inclus dans le log après chaque erreur. C'est
  utile pour trouver où/quand les erreurs ont été faites.
* ``consoleHandler`` - callback - Le callback utilisé pour gérer les erreurs
  quand vous lancez la console. S'il n'est pas défini, les gestionnaires par
  défaut de CakePHP seront utilisés.

ErrorHandler par défaut, affiche les erreurs quand ``debug`` > 0, et les erreurs
de logs quand debug = 0. Le type d'erreurs capté dans les deux cas est contrôlé
par ``Error.level``. Le gestionnaire d'erreurs fatales va être appelé
indépendamment du niveau de ``debug`` ou de la configuration de ``Error.level``,
mais le résultat va être différent, selon le niveau de ``debug``.

.. note::

    Si vous utilisez un gestionnaire d'erreur personnalisé, le trace setting
    n'aura aucun effet, à moins que vous y fassiez référence dans votre
    fonction de gestion d'erreur.

.. versionadded:: 2.2
    L'option ``Error.consoleHandler`` a été ajoutée dans la version 2.2.

.. versionchanged:: 2.2
    ``Error.handler`` et ``Error.consoleHandler`` vont aussi recevoir les codes
    d'erreur fatal. Le comportement par défaut est de montrer une page d'erreur
    interne du serveur (``debug`` désactivé) ou une page avec le message, le
    fichier et la ligne (``debug`` activé).

Créer vos Propres Gestionnaires d'Erreurs
=========================================

Vous pouvez créer un gestionnaire d'erreur à partir de n'importe quel type de
callback. Par exemple, vous pouvez utiliser une classe appelée ``AppError`` pour
gérer vos erreurs. Ce qui suit serait à faire::

    //dans app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //dans app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //dans app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null, $line = null, $context = null) {
            echo 'Il y a eu une erreur!';
        }
    }

Cette classe/méthode va afficher 'Il y a eu une erreur!' chaque fois qu'une
erreur apparaît. Depuis que vous pouvez définir un gestionnaire d'erreur comme
tout type de callback, vous pouvez utiliser une fonction anonyme si vous
utilisez PHP5.3 ou supérieur. ::

    Configure::write('Error.handler', function($code, $description, $file = null, $line = null, $context = null) {
        echo 'Oh non quelque chose est apparu';
    });

Il est important de se rappeler que les erreurs captées par le gestionnaire
d'erreurs configuré seront des erreurs php, et si vous avez besoin de gestion
d'erreurs personnalisée, vous aurez probablement aussi envie de configurer la
gestion des :doc:`/development/exceptions`.

Changer le comportement des erreurs fatales
===========================================

Depuis CakePHP 2.2, ``Error.handler`` va aussi recevoir les codes d'erreur
fatal. Si vous ne voulez pas montrer la page d'erreur de cake, vous pouvez la
remplacer comme cela::

    //dans app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //dans app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //dans app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null, $line = null, $context = null) {
            list(, $level) = ErrorHandler::mapErrorCode($code);
            if ($level === LOG_ERR) {
                // Ignore l\'erreur fatale. Cela ne va garder seulement le message d\'erreur PHP
                return false;
            }
            return ErrorHandler::handleError($code, $description, $file, $line, $context);
        }
    }

Si vous voulez garder le comportement d'erreur fatal par défaut, vous pouvez
appeler ``ErrorHandler::handleFatalError()`` à partir du gestionnaire
personnalisé.

.. meta::
    :title lang=fr: Gestion des Erreurs
    :keywords lang=fr: stack traces,error constants,tableau erreur,défaut affichages,fonctions anonymes,gestionnaires d'erreurs,erreur par défaut,niveau erreur,gestionnaite handler exception,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks
