Application
###########

``Application`` est le cœur de votre application. Il contrôle comment
votre application est configurée, et quels plugins, middleware, commandes
de console et routes sont inclus.

Vous pouvez trouver votre classe ``Application`` dans **src/Application.php**.
Par défaut il sera assez petit et ne définira que quelques valeurs par défaut.
:doc:`/controllers/middleware`. Les applications peuvent définir les
methodes de hook suivantes:

* ``bootstrap`` Utilisé pour chargé les :doc:`fichiers de configuration
  </development/configuration>`, définir des constantes et d'autres fonctions
  globales. Par défaut, cela inclura **config/bootstrap.php**. C'est
  l'endroit idéal pour charger les :doc:`/plugins` que votre application
  utilise.
* ``routes`` Utilisé pour charger les :doc:`routes </development/routing>`.
  Par défaut, cela inclura **config/routes.php**.
* ``middleware`` Utilisé pour ajouter des :doc:`middleware </controllers/middleware>`
  dans votre application.
* ``console`` Utilisé pour ajouter des :doc:`commandes de console
  </console-commands>`
  à votre application. Par défaut, cela découvrira automatiquement les shells
  et les commandes dans votre application et dans tous les plugins.
* ``events`` Utilisé pour ajouter des :doc:`écouteurs (listener) d'événement </core-libraries/events>`
  au gestionnaire d'événements de l'application.

.. meta::
    :title lang=fr: Application CakePHP
    :keywords lang=fr: http, middleware, psr-7, events, plugins, application, événements, baseapplication
