Structure du dossier de CakePHP
###############################

Après avoir téléchargé et extrait CakePHP, voici les fichiers et
répertoires que vous devriez voir :

-  app
-  lib
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

Vous remarquerez trois dossiers principaux :

-  Le dossier *app* sera celui où vous exercerez votre magie : c'est là
   que vous placerez les fichiers de votre application.
-  Le dossier *lib* est l'endroit où nous avons exercé notre propre magie.
   Engagez-vous personnellement à ne **pas** modifier les fichiers dans ce
   dossier. Nous ne pourrons pas vous aider si vous avez modifié le cœur
   du framework. A la place, regardez dans les :ref:`application-extensions`
   modifiées.
-  Enfin, le dossier *vendors* est l'endroit où vous placerez vos librairies
   PHP tierces dont vous avez besoin pour vos applications CakePHP.

Le dossier App
==============

Le répertoire *app* de CakePHP est l'endroit où vous réaliserez la majorité
du développement de votre application. Regardons de plus près les dossier à
l'intérieur de *app*.

Config
    Contient les (quelques) fichiers de configuration utilisés par CakePHP.
    Informations de connexion à la base de données, démarrage, fichiers de
    configuration de base et tous fichiers du même genre doivent être rangés
    ici.
Console
    Contient les commandes de la console et les Tasks de la console pour votre
    application. Ce répertoire peut aussi contenir un répertoire ``Templates``
    pour personnaliser la sortie de bake. Pour plus d'informations, regardez
    :doc:`/console-shells-and-tasks`.
Controller
    Contient vos Controllers et leurs Components.
Lib
    Contient les librairies qui ne proviennent pas de librairies
    externes. Cela vous permet de séparer les librairies internes de votre
    organisme des librairies externes.
Locale
    Stocke les fichiers pour l'internationalisation.
Model
    Pour les Models, Behaviors et Sources de Données de votre
    application.
Plugin
    Contient les packages des Plugins.
Test
    Ce répertoire contient tous les cas de test, et les fixtures de test pour
    votre application. Le répertoire ``Test/Case`` devra refléter votre
    application et contenir un ou plusieurs cas de test par classe dans votre
    application. Pour plus d'informations sur les cas de test et les fixtures
    de test, référez-vous à la documentation :doc:`/development/testing`.
tmp
    C'est ici que CakePHP enregistre les données temporaires. La manière dont
    sont stockées les données actuelles dépend de la configuration que vous
    avez effectuée, mais ce répertoire est habituellement utilisé pour déposer
    les descriptions de models, les logs et parfois les informations de
    session.

    Assurez-vous que ce dossier existe et qu'il est en écriture, autrement la
    performance de votre application sera sévèrement impactée. En mode debug,
    CakePHP vous avertira si ce n'est pas le cas.

Vendor
    Toute classe ou librairie tierce doit être mise ici, de sorte qu'il
    sera facile d'y accéder par la fonction App::import('vendor','name'). Les
    observateurs avisés noteront que cela semble redondant avec le répertoire
    *vendors* à la racine de l'arborescence. Nous aborderons les différences
    entre les deux lorsque nous discuterons de la gestion multi-applications
    et des configurations systèmes plus complexes.

View
    Les fichiers de présentation sont placés ici : éléments, pages d'erreur,
    helpers, layouts et vues.

webroot
    Dans un environnement de production, ce dossier doit être la racine de
    votre application. Les sous-répertoires sont utilisés pour les feuilles
    de style CSS, les images et les fichiers Javascript.


.. meta::
    :title lang=fr: Structure du dossier de CakePHP
    :keywords lang=fr: librairies internes,configuration du coeur,descriptions du model,librairies externes,détails de connexion,structure de dossier,librairies tierces,engagement personnel,connexion base de données,internationalisation,fichiersd e configuration,dossiers,développement de l'application,à lire,lib,configuré,logs,config,tierce partie,cakephp
