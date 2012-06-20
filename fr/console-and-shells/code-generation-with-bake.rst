Génération de code avec Bake
############################

La console Bake de CakePHP est un autre outil permettant de réaliser son application rapidement.
La console Bake peut créer chacun des ingrédients basiques de CakePHP : modèles, vues et contrôleurs.
Et nous ne parlons pas seulement des squelettes de classes : Bake peut créer une application fonctionnelle
complète en seulement quelques minutes. En réalité, Bake est une étape naturelle
à suivre une fois qu'une application a été prototypée.

Ceux qui sont novices avec Bake (spécialement les utilisateurs de Windows)
pourraient trouver le `Bake screencast <http://tv.cakephp.org/video/gwoo/2010/12/24/setting_up_the_cakephp_console_on_windows>`_ 
utile pour paramétrer les choses avant de continuer.

Suivant la configuration de votre installation, 
vous devrez peut être donner les droits d'exécution au script bash cake ou l'appeler avec la commande ./cake bake.
La console cake est exécutée en utilisant le CLI PHP (Interface de Ligne de Commande). 
Si vous avez des problèmes en exécutant ce script, vérifiez que le CLI PHP est installé 
et qu'il a les modules adéquats autorisés (ex: MySQL).

En exécutant Bake la première fois, vous serez invité à créer un fichier de configuration 
de la base de données, si vous n'en avez pas créé auparavant.

Après que vous ayez créé un fichier de configuration de base de données, 
exécuter Bake vous présentera les options suivantes ::

    ---------------------------------------------------------------
    App : app
    Path: /path-to/project/app
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [F]ixture
    [T]est case
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/F/T/Q)
    >  

Sinon, vous pouvez exécuter chacune de ces commandes directement depuis la ligne de commande ::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view
    $ cake bake controller
    $ cake bake project
    $ cake bake fixture
    $ cake bake test
    $ cake bake plugin plugin_name
    $ cake bake all


Modifier le HTML par défault produit par les templates de bake
==============================================================

Si vous souhaitez modifier la sortie HTML par défaut produite par la commande bake, suivez les étapes simples suivantes:

Pour fabriquer des vues sur mesure
----------------------------------


#. Aller dans le dossier: lib/Cake/Console/Templates/default/views
#. Remarquez les 4 fichiers ici
#. Copier les dans le dossier:
   app/Console/Templates/[themename]/views
#. Faire les changement pour la sortie HTML pour controler la façon dont "bake" fabrique vos vues

La partie du chemin ``[themename]`` est le nom du theme de bake que vous créez.
Les noms des thèmes de Bake doivent être unique, donc n'utilisez pas 'default'.

Pour fabriquer des projets sur mesure
------------------------------------

Allez dans le dossier: lib/Cake/Console/Templates/skel
Remarquez l'application de base ici
Copier les dans le dossier: app/Console/Templates/skel
Faire les changement pour la sortie HTML pour controler la façon dont "bake" fabrique vos vues.
Passez le squelette du chemin en paramètre de la tâche du projet::

    cake bake project -skel Console/Templates/skel

.. note::

    -  Vous devez lancer la tâche du projet spécifique ``cake bake project`` afin que
       le paramètre du chemin soit passé.
    -  Le chemin du template est relatif au chemin courant de l'Interface de Commande en Ligne.
    -  Puisque le chemin complet du squelette doit être entré manuellement,
       vous pouvez spécifier n'importe quel dossier avec le template que vous souhaiter construire,
       ainsi que l'utilisation de plusieurs templates. (Sauf si Cake commence par outrepasser le dossier
       squelette comme il fait pour les vues)


Amélioration de Bake dans la version 1.3
========================================

Dans CakePHP 1.3, bake a connu une révision importante,
avec le rajout de fonctionnalités et améliorations.



-  Deux nouvelles tâches (FixtureTask and TestTask) sont accessibles à partir du menu principal de bake.
-  Une troisième tâche (TemplateTask) a été rajoutée pour l'utilisation dans vos shells.
-  Toutes ces différentes tâches de bake vous permettent maintenant d'utiliser d'autres connections de bake que le 'default'
   Utilisez le paramètre ``-connection``.
-  Le support de Plugin a été fortement amélioré. Vous pouvez maintenant utiliser
   ``-plugin NomDuPlugin`` ou ``Plugin.class``.
-  Les Questions ont été clarifiées, et sont plus facilement compréhensibles.
-  Les validations multiples sur les modèles ont été ajoutées.
-  Les associations des modèles sur eux-mêmes utilisant ``parent_id`` sont maintenant détectées.
   Par exemple, si votre modèle est appelé Thread, une association ParentThread et ChildThread sera créee.
-  Fixtures et Tests peuvent être 'cuits' séparément.
-  Les Tests 'Cuits' incluent autant de fixtures connues,
   ainsi que la détéction des plugin (La détection plugin ne fonctionne pas avec PHP4).

Ainsi avec cette liste de fonctionnalités, nous allons prendre le temps de regarder certaines nouvelles
commandes, certains nouveaux paramètres et les fonctionnalités mises à jour.

**Nouveaux FixtureTask, TestTask et TemplateTask.**

Fixture and test baking were a bit of a pain in the past. You could
only generate tests when baking the classes, and fixtures could
only be generated when baking models. This made adding tests to
your applications later or even regenerating fixtures with new
schemas a bit painful. For 1.3 we've separated out Fixture and Test
making them separate tasks. This allows you to re-run them and
regenerate tests and fixtures at any point in your development
process.

In addition to being rebuildable at any time, baked tests are now
attempt to find as many fixtures as possible. In the past getting
into testing often involved fighting through numerous 'Missing
Table' errors. With more advanced fixture detection we hope to make
testing easier and more accessible.

Test cases also generate skeleton test methods for every
non-inherited public method in your classes. Saving you one extra
step.

``TemplateTask`` is a behind the scenes task, and it handles file
generation from templates. In previous versions of CakePHP baked
views were template based, but all other code was not. With 1.3
almost all the content in the files generated by bake are
controlled by templates and the ``TemplateTask``.

The ``FixtureTask`` not only generates fixtures with dummy data,
but using the interactive options or the ``-records`` option you
can enable fixture generation using live data.

**New bake command**
New commands have been added to make baking easier and faster.
Controller, Model, View baking all feature an ``all`` subcommand,
that builds everything at once and makes speedy rebuilds easy.

::

    cake bake model all

Would bake all the models for an application in one shot. Similarly
``cake bake controller all`` would bake all controllers and
``cake bake view all`` would generate all view files. Parameters on
the ``ControllerTask`` have changed as well.
``cake bake controller scaffold`` is now
``cake bake controller public``. ``ViewTask`` has had an ``-admin``
flag added, using ``-admin`` will allow you to bake views for
actions that begin with ``Routing.admin``

As mentioned before ``cake bake fixture`` and ``cake bake test``
are new, and have several subcommands each.
``cake bake fixture all`` will regenerate all the basic fixtures
for your application. The ``-count`` parameter allows you to set
the number of fake records that are created. By running fixture
task interactively you can generate fixtures using the data in your
live tables. You can use ``cake bake test <type> <class>`` to
create test cases for already created objects in your app. Type
should be one of the standard CakePHP types ('component',
'controller', 'model', 'helper', 'behavior') but doesn't have to
be. Class should be an existing object of the chosen type.

**Templates Galore**

New in bake for 1.3 is the addition of more templates. In 1.2 baked
views used templates that could be changed to modify the view files
bake generated. In 1.3 templates are used to generate all output
from bake. There are separate templates for controllers, controller
action sets, fixtures, models, test cases, and the view files from
1.2. As well as more templates, you can also have multiple template
sets or, bake themes. Bake themes can be provided in your app, or
as part of plugins. An example plugin path for bake theme would be
``app/Plugin/BakeTheme/Console/Templates/dark_red/``. An
app bake theme called ``blue_bunny`` would be placed in
``app/Console/Templates/blue_bunny``. You can look at
``lib/Cake/Console/Templates/default/`` to see what directories and
files are required of a bake theme. However, like view files, if
your bake theme doesn't implement a template, other installed
themes will be checked until the correct template is found.

**Additional plugin support.**

New in 1.3 are additional ways to specify plugin names when using
bake. In addition to ``cake bake plugin Todo controller Posts``,
there are two new forms. ``cake bake controller Todo.Posts`` and
``cake bake controller Posts -plugin Todo``. The plugin parameter
can be while using interactive bake as well.
``cake bake controller -plugin Todo``, for example will allow you
to use interactive bake to add controllers to your Todo plugin.
Additional / multiple plugin paths are supported as well. In the
past bake required your plugin to be in app/plugins. In 1.3 bake
will find which of the pluginPaths the named plugin is located on,
and add the files there.




.. meta::
    :title lang=en: Code Generation with Bake
    :keywords lang=en: command line interface,functional application,atabase,database configuration,bash script,basic ingredients,roject,odel,path path,code generation,scaffolding,windows users,configuration file,few minutes,config,iew,shell,models,running,mysql