Application
###########

``Application`` est le cœur de votre application. Il contrôle comment
votre application est configurée, et quels plugins, middleware, commandes
de console et routes sont inclus.

Vous pouvez trouver votre classe ``Application`` dans **src/Application.php**.
Par défaut, elle sera assez petite et ne définira que quelques valeurs par défaut.
:doc:`/controllers/middleware`. Les applications peuvent définir les
methodes de hook suivantes:

* ``bootstrap`` Utilisé pour chargé les :doc:`fichiers de configuration
  </development/configuration>`, définir des constantes et d'autres fonctions
  globales. Par défaut, cela inclura **config/bootstrap.php**. C'est
  l'endroit idéal pour charger les :doc:`/plugins` et :doc:`les listeners d'évènements </core-libraries/events>`
  globaux que votre application utilise.
* ``routes`` Utilisé pour charger les :doc:`routes </development/routing>`.
  Par défaut, cela inclura **config/routes.php**.
* ``middleware`` Utilisé pour ajouter des :doc:`middleware </controllers/middleware>`
  dans votre application.
* ``console`` Utilisé pour ajouter des :doc:`commandes de console
  </console-commands>`
  à votre application. Par défaut, cela découvrira automatiquement les shells
  et les commandes dans votre application et dans tous les plugins.

Bootstrapping CakePHP
=====================

Si vous avez des besoins de configuration supplémentaires, utilisez le fichier
bootstrap de CakePHP dans **config/bootstrap.php**. Ce fichier est inclus juste
avant chaque requête et commande CLI.

Ce fichier est idéal pour un certain nombre de tâches de bootstrapping
courantes:

- Définir des fonctions utilitaires.
- Déclarer des constantes.
- Créer des configurations de cache.
- Définir la configuration des logs.
- Configurer les inflections personnalisées.
- Charger les fichiers de configuration.

Il pourrait être tentant de placer des fonctions de formatage ici pour les
utiliser dans vos controllers. Comme vous le verrez dans les documentations sur
les :doc:`/controllers` et les :doc:`/views`, il y a de meilleurs moyens pour
vous d'ajouter de la logique personnalisée dans votre application.

.. _application-bootstrap:

Application::bootstrap()
------------------------

En plus du fichier **config/bootstrap.php** qui doit être utilisé pour faire de
la configuration "bas niveau" de votre application, vous pouvez également
utiliser la méthode "hook" ``Application::bootstrap()`` pour charger /
initialiser des plugins et attacher des écouteurs d'événements globaux::

    // in src/Application.php
    namespace App;

    use Cake\Core\Plugin;
    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // Appeler la méthode parente permet de faire le `require_once`
            // pour charger le fichier config/bootstrap.php
            parent::bootstrap();

            // Charger mon plugin
            Plugin::load('MyPlugin');
        }
    }

Charger les plugins et les événements dans ``Application::bootstrap()`` rend
les :ref:`integration-testing` plus faciles car les événements et les routes
seront ainsi à nouveau traités pour chaque méthode de test.

.. meta::
    :title lang=fr: Application CakePHP
    :keywords lang=fr: http, middleware, psr-7, events, plugins, application, événements, baseapplication
