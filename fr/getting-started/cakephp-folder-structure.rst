Structure du dossier de CakePHP
###############################

Après avoir téléchargé et extrait CakePHP, voici les fichiers et
répertoires que vous devriez voir :

- App
- Plugin
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

Vous remarquerez quelques dossiers principaux :

- Le dossier *App* sera celui où vous exercerez votre magie : c'est là
  que vous placerez les fichiers de votre application.
- Le dossier *Plugin* est l'endroit où sont stockés les :doc:`/plugins` que
  votre application utilise.
- Le dossier *vendor* est l'endroit où CakePHP et d'autres dépendances de
  l'application vont être installés. Engagez-vous personnellement à ne
  **pas** modifier les fichiers dans ce dossier. Nous ne pourrons pas vous
  aider si vous avez modifié le cœur du framework.
- Le répertoire *webroot* est la racine de votre application public. Il contient
  tous les fichiers que vous souhaitez voir accessibles publiquement.
- Le dossier *tmp* est l'endroit où CakePHP stocke les données temporaires. Les
  données qu'il stocke dépendent de la façon dont vous avez configuré CakePHP,
  mais ce dossier est généralement utilisé pour stocker les descriptions de
  model, les logs, et parfois les informations de session.

  Assurez-vous que ce dossier existe et qu'il est en écriture, autrement la
  performance de votre application sera sévèrement impactée. En mode debug,
  CakePHP vous avertira si ce n'est pas le cas.

Le dossier App
==============

Le répertoire App de CakePHP est l'endroit où vous réaliserez la majorité
du développement de votre application. Regardons de plus près le contenu de
ce répertoire.

Config
    Contient les (quelques) fichiers de configuration utilisés par CakePHP.
    Informations de connexion à la base de données, démarrage, fichiers de
    configuration de base et tous fichiers du même genre doivent être rangés
    ici.
Console
    Contient les commandes de la console et les Tasks de la console pour votre
    application. Ce répertoire peut aussi contenir un répertoire ``Templates``
    pour personnaliser la sortie de bake. Pour plus d'informations, regardez
    :doc:`/console-and-shells`.
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
Test
    Ce répertoire contient tous les cas de test, et les fixtures de test pour
    votre application. Le répertoire ``Test/Case`` devra refléter votre
    application et contenir un ou plusieurs cas de test par classe dans votre
    application. Pour plus d'informations sur les cas de test et les fixtures
    de test, référez-vous à la documentation :doc:`/development/testing`.
View
    Les fichiers de présentation sont placés ici : éléments, pages d'erreur,
    helpers, layouts et vues.


.. meta::
    :title lang=fr: Structure du dossier de CakePHP
    :keywords lang=fr: librairies internes,configuration du coeur,descriptions du model,librairies externes,détails de connexion,structure de dossier,librairies tierces,engagement personnel,connexion base de données,internationalisation,fichiersd e configuration,dossiers,développement de l'application,à lire,lib,configuré,logs,config,tierce partie,cakephp
