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
* ``console`` Utilisé pour ajouter des :doc:`commandes de console </console-and-shells>`
  à votre application. Par défaut, cela découvrira automatiquement les shells
  et les commandes dans votre application et dans tous les plugins.
* ``events`` Utilisé pour ajouter des :doc:`écouteurs (listener) d'événement </core-libraries/events>`
  au gestionnaire d'événements de l'application.

.. _adding-http-stack:

Ajout de la nouvelle pile HTTP à une application existante
==========================================================

L'utilisation de la classe Application et du middleware HTTP dans une
application existante nécessite quelques modifications de votre code.

#. Premièrement mettez à jour **webroot/index.php**. Copiez le contenu du
   fichier depuis le `squelette de l'application <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Créez une classe ``Application``. Référez-vous à la section
   :ref:`using-middleware` pour savoir comment. Ou copiez l'exemple
   dans le `squelette de l'application <https://github.com/cakephp/app/tree/master/src/Application.php>`__.
#. Créez **config/requirements.php** si il n'existe pas et ajoutez le contenu
   du `squelette de l'application <https://github.com/cakephp/app/blob/master/config/requirements.php>`__.

Une fois ces trois étapes terminées, vous êtes prêt à réimplémenter n'importe
quel filtre du dispatcher d'application/plugin comme middleware HTTP.

Si vous effectuez des tests, vous devrez également mettre à jour votre fichier
**tests/bootstrap.php** en copiant le contenu du fichier à partir du
`squelette de l'application <https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_.

.. meta::
    :title lang=fr: Application CakePHP
    :keywords lang=fr: http, middleware, psr-7, events, plugins, application, événements, baseapplication
