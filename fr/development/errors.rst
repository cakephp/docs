Gestion des Error
#################

Pour 2.0 ``Object::cakeError()`` a été retiré. A la place, il a été remplacé 
par un certain nombre d'exceptions. Toutes les classes du coeur qui appelaient 
avant cakeError envoient maintenant des exceptions. Cela vous laisse choisir 
soit la gestion des erreurs dans le code de votre application, soit laisser 
la gestion intégrée des exceptions le faire pour vous.

Il y a plus de contrôles que jamais pour les erreurs et la gestion des 
exceptions dans CakePHP 2.0. Vous pouvez configurer quelles méthodes vous 
voulez définir en tant que gestionnaire d'erreur, et en gestionnaire 
d'exception en utilisant configure.

Configuration d'Error
=====================

La configuration des Error est faite à l'intérieur du fichier 
``app/Config/core.php`` de votre application. Vous pouvez définir un callback 
pour être effectué chaque fois que votre application attrape une erreur PHP - 
les exceptions sont gérées séparément :doc:`/development/exceptions`.
Le callback peut être n'importe quel PHP appelable, incluant une fontion 
anonyme. L'erreur par défaut de la configuration de gestion ressemble à 
ceci::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

Vous avez 3 options intégrées quand vous gérez la configuration des erreurs:

* ``handler`` - callback - Le callback pour la gestion des erreurs. Vous pouvez 
  définir ceci à n'importe quel type, incluant des fonctions anonymes.
* ``level`` - int - Le niveau d'erreurs qui vous interesse dans la capture.
  Utilisez les constantes d'erreur intégrées dans PHP, et bitmasks pour 
  séléctionner le niveau d'erreur qui vous intéressent.
* ``trace`` - boolean - Inclut stack traces pour les erreurs dans les fichiers 
  de log. Les Stack traces seront inclus dans le log après chaque erreur. C'est 
  utile pour trouver où/quand les erreurs ont été faites.

ErrorHandler par défaut, affiche les erreurs quand ``debug`` > 0, et les 
erreurs de logs quand debug = 0. Le type d'erreurs capté dans les deux cas est 
contrôlé par ``Error.level``.

.. note::

    Si vous utilisez un gestionnaire d'erreur personnalisé, le trace setting 
    n'aura aucun effet, à moins que vous y fassiez référence dans votre 
    fonction de gestion d'erreur.

Créer vos propres gestionnaires d'erreurs
=========================================

Vous pouvez créer un gestionnaire d'erreur à partir de n'importe quel type 
de callback. Par exemple, vous pouvez utiliser une classe appelée ``AppError`` 
pour gérer vos erreurs. Ce qui suit serait à faire::

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

Cete classe/méthode va afficher 'Il y a eu une erreur!' chaque fois qu'une 
erreur apparaît. Depuis que vous pouvez définir un gestionnaire d'erreur comme 
tout type de callback, vous pouvez utiliser une fonction anonyme si vous 
utilisez PHP5.3 ou supérieur.::

    Configure::write('Error.handler', function($code, $description, $file = null, $line = null, $context = null) {
        echo 'Oh non quelque chose est apparu';
    });

Il est important de se rappeler que les erreurs captées par le gestionnaire 
d'erreurs configuré seront des erreurs php, et si vous avez besoin de gestion 
d'erreurs personnalisée, vous aurez probablement aussi envie de configurer la 
gestion des :doc:`/development/exceptions`.


.. meta::
    :title lang=fr: Gestion des Erreurs
    :keywords lang=fr: stack traces,error constants,tableau erreur,défaut affichages,fonctions anonymes,gestionnaires d'erreurs,erreur par défaut,niveau erreur,gestionnaite handler exception,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks
