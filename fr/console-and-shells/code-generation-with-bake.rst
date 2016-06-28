Génération de code avec Bake
############################

La console Bake de CakePHP est un autre outil permettant de réaliser son
application rapidement. La console Bake peut créer chacun des ingrédients
basiques de CakePHP : models, vues et controllers. Et nous ne parlons pas
seulement des squelettes de classes : Bake peut créer une application
fonctionnelle complète en seulement quelques minutes. En réalité, Bake est
une étape naturelle à suivre une fois qu'une application a été prototypée.

Suivant la configuration de votre installation, vous devrez peut être donner
les droits d'exécution au script bash cake ou l'appeler avec la commande
./cake bake.
La console cake est exécutée en utilisant le CLI PHP
(Interface de Ligne de Commande). Si vous avez des problèmes en exécutant ce
script, vérifiez que le CLI PHP est installé et qu'il a les modules adéquats
autorisés (ex: MySQL). Certains utilisateurs peuvent aussi rencontrer des
problèmes si la base de donnée host est 'localhost' et devront essayer
'127.0.0.1' à la place. Cela peut causer des soucis avec le CLI PHP.

En exécutant Bake la première fois, vous serez invité à créer un fichier de
configuration de la base de données, si vous n'en avez pas créé un auparavant.

Après que vous avez créé un fichier de configuration de la base de données,
exécuter Bake vous présentera les options suivantes::

    ---------------------------------------------------------------
    App : app
    Path: /path-to/project/app (Chemin: /chemin/vers/app/du/projet)
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

Sinon, vous pouvez exécuter chacune de ces commandes directement depuis la
ligne de commande::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view
    $ cake bake controller
    $ cake bake project
    $ cake bake fixture
    $ cake bake test
    $ cake bake plugin plugin_name
    $ cake bake all

.. versionchanged:: 2.5
    Les fichiers Test créés par ``bake test`` incluent les appels vers
    `PHPunit's markTestIncomplete() <http://phpunit.de/manual/3.7/en/incomplete-and-skipped-tests.html>`_
    pour attirer votre attention sur les méthodes de test vides. Avant 2.5, les
    tests vides passaient sans messages.


Modifier le HTML par défaut produit par les templates de bake
=============================================================

Si vous souhaitez modifier la sortie HTML par défaut produite par la commande
"bake", suivez les étapes simples suivantes:

Pour fabriquer des vues sur mesure
----------------------------------

#. Aller dans le dossier: lib/Cake/Console/Templates/default/views.
#. Remarquez les 4 fichiers ici.
#. Copiez les dans le dossier: app/Console/Templates/[themename]/views.
#. Faire les changements pour la sortie HTML pour contrôler la façon dont
   "bake" fabrique vos vues.

La partie du chemin ``[themename]`` est le nom du thème de bake que vous créez.
Les noms des thèmes de Bake doivent être uniques, donc n'utilisez pas
'default'.

Pour baker des projets personnalisés
------------------------------------

#. Allez dans : lib/Cake/Console/Templates/skel
#. Trouvez-y la base des fichiers d'application.
#. Copiez les dans votre: app/Console/Templates/skel
#. Faîtes des changements vers la sortie HTML pour contrôler la façon dont "bake"
   va construire vos vues.
#. Passez le paramètre de squelette du chemin à la tâche du projet.

::

    cake bake project --skel Console/Templates/skel

.. note::

    -  Vous devez lancer la tâche du projet spécifique ``cake bake project``
       afin que le paramètre du chemin soit passé.
    -  Le chemin du template est relatif au chemin courant de l'Interface
       de Commande en Ligne.
    -  Puisque le chemin complet du squelette doit être entré manuellement,
       vous pouvez spécifier n'importe quel dossier avec le template que vous
       souhaitez construire, ainsi que l'utilisation de plusieurs templates.
       (Sauf si CakePHP commence par outrepasser le dossier
       squelette comme il fait pour les vues)


Amélioration de Bake dans la version 1.3
========================================

Dans CakePHP 1.3, bake a connu une révision importante,
avec le rajout de fonctionnalités et améliorations.

-  Deux nouvelles tâches (FixtureTask et TestTask) sont accessibles à partir
   du menu principal de bake.
-  Une troisième tâche (TemplateTask) a été rajoutée pour l'utilisation dans
   vos shells.
-  Toutes ces différentes tâches de bake vous permettent maintenant d'utiliser
   d'autres connexions de bake que le 'default'.
   Utilisez le paramètre ``-connection``.
-  Le support de Plugin a été fortement amélioré. Vous pouvez maintenant
   utiliser ``--plugin NomDuPlugin`` ou ``Plugin.class``.
-  Les Questions ont été clarifiées, et sont plus facilement compréhensibles.
-  Les validations multiples sur les models ont été ajoutées.
-  Les associations des models sur eux-mêmes utilisant ``parent_id`` sont
   maintenant détectées.
   Par exemple, si votre model est appelé Thread, une association ParentThread
   et ChildThread sera créée.
-  Fixtures et Tests peuvent être 'cuits' séparément.
-  Les Tests 'Cuits' incluent autant de fixtures connues,
   ainsi que la détection des plugins (La détection plugin ne fonctionne
   pas avec PHP4).

Ainsi, avec cette liste de fonctionnalités, nous allons prendre le temps de
regarder certaines nouvelles commandes, certains nouveaux paramètres et les
fonctionnalités mises à jour.

**Nouveaux FixtureTask, TestTask et TemplateTask.**

Fixture et le test baking étaient un peu ardus dans le passé.
Vous pouviez seulement générer des tests quand vous bakiez des classes, et
les fixtures pouvaient seulement être générées quand on bakait les models.
Cela faisait que l'ajout ultérieur de tests à vos applications ou même
la régénération de fixtures avec de nouveaux schémas étaient difficiles.
Dans 1.3, nous avons séparé Fixture et la fabrication des Tests en tâches
différentes. Cela vous permet de les relancer et de regénérer des tests
et fixtures à n'importe quel moment dans votre processus de développement.

En plus d'être reconstructibles à n'importe quel moment, les tests cuits
sont maintenant capable de trouver autant de fixtures que possible.
Dans le passé, tester impliquait souvent de se battre à travers de
nombreuses erreurs 'Manque la table'. Avec une détection des fixtures
plus poussée, nous espérons rendre le test plus simple plus accessible.

Les cas de test génèrent aussi des méthodes squelettes de test pour chaque
méthode publique non héritée dans vos classes. Vous enlevant une étape
supplémentaire.

``TemplateTask`` est une tâche en arrière plan, et elle gère la génération
des fichiers à partir de templates. Dans les versions précédentes de CakePHP
les vues cuites étaient basées sur des templates, mais tout le reste du code
ne l'était pas. Avec 1.3, presque tout le contenu dans les fichiers générés par
bake sont contrôlés par les templates et la ``TemplateTask``.

``FixtureTask`` ne génère plus seulement les fixtures avec les données
factices mais en utilisant les options interactives ou l'option ``-records``
vous pouvez activer la génération de fixture en utilisant les données live.

**Nouvelle commande bake**
De nouvelles commandes ont été ajoutées pour rendre le baking plus facile
et plus rapide. Les bakings des controllers, Models et Vues ont tous
la fonctionnalité de sous-commande ``all``, qui construit tout en une fois
et reconstruit rapidement et facilement.

::

    cake bake model all

Bakerait tous les models pour une application en une fois. De même,
``cake bake controller all`` bakerait tous les controllers et
``cake bake view all`` génèrerait tous les fichiers vues. Les paramètres de
la tâche ``ControllerTask`` ont aussi changé.
``cake bake controller scaffold`` est maintenant
``cake bake controller public``. ``ViewTask`` a eu un drapeau ``-admin``
ajouté, en utilisant ``-admin`` cela vous autorise à baker les vues pour les
actions qui commencent par ``Routing.admin``.

Comme mentionné avant ``cake bake fixture`` et ``cake bake test``
sont nouveaux, et ont plusieurs sous-commandes chacun.
``cake bake fixture all`` va regénérer tous les fixtures basiques pour votre
application. Le paramètre ``-count`` vous autorise à configurer le nombre
d'enregistrements faux qui sont créés. En lançant la tâche de fixture de façon
interactive, vous pouvez générer les fixtures en utilisant les données dons vos
tables live. Vous pouvez utiliser ``cake bake test <type> <class>`` pour créer
les cas de test pour les objets déjà créés dans votre app. Le type doit être
l'un des types standards de CakePHP ('component',
'controller', 'model', 'helper', 'behavior') mais peut ne pas exister.
Les classes doivent être un objet existant d'un type choisi.

**Des templates en abondance**

Une nouveauté dans bake pour 1.3 est l'ajout de plus de templates.
Dans 1.2, les vues bakées utilisaient les templates qui pouvaient être
changés pour modifier les fichiers vues bakés générées. Dans 1.3, les
templates sont utilisés pour générer toute sortie de bake générée.
Il y a des templates séparés pour les controllers, les ensembles d'action
des controllers, les fixtures, les models, les cas de test, et les fichiers
de vue de 1.2. Comme de plus en plus de templates, vous pouvez aussi avoir des
ensembles de template multiple ou, de thèmes bakés. Les thèmes bakés peuvent
être fournis dans votre app, ou dans une partie des plugins. Un exemple de
chemin de plugin pour le thème baké serait
``app/Plugin/BakeTheme/Console/Templates/dark_red/``. Un thème d'app
bakée appelé ``blue_bunny`` serait placé dans
``app/Console/Templates/blue_bunny``. Vous pouvez regarder dans
``lib/Cake/Console/Templates/default/`` pour voir quels répertoires et fichiers
sont requis pour un thème baké. Cependant, comme les fichiers vues, si votre
thème baké n'implémente pas un template, les autres thèmes installés seront
vérifiés jusqu'à ce que le template correct soit trouvé.

**Support de plugins supplémentaires.**

Nouveau dans 1.3 sont les chemins supplémentaires pour spécifier les noms de
plugin quand on utilise bake. En plus de ``cake bake plugin Todo controller
Posts``, il y a deux nouvelles formes. ``cake bake controller Todo.Posts`` et
``cake bake controller Posts --plugin Todo``. Le paramètre de plugin peut aussi
exister en utilisant le bake interactif.
``cake bake controller --plugin Todo``, par exemple vous autorisera
à utiliser le bake interactif pour ajouter des controllers à votre plugin Todo.
Des chemins de plugin supplémentaires / multiples sont aussi supportés. Dans
le passé, bake nécessitait que le plugin soit dans app/plugins. Dans 1.3, bake
trouvera le chemin du plugin pour le plugin nommé, et y ajoutera les fichiers.


.. meta::
    :title lang=fr: Génération de code avec Bake
    :keywords lang=fr: interface de commande en ligne,application fonctionnel,base de données,configuration de la base de données,script bash,ingrédients basiques,projet,model,chemin,génération de code,scaffolding,utilisateurs windows,configuration du fichier,quelques minutes,config,vue,shell,models,execution,mysql
