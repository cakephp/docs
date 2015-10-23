Structure du dossier de CakePHP
###############################

Après avoir téléchargé et extrait l'application CakePHP, voici les fichiers et
répertoires que vous devriez voir:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

Vous remarquerez quelques dossiers principaux:

- Le dossier *bin* contient les executables de la console Cake.
- Le dossier *config* contient les (quelques) fichiers de
  :doc:`/development/configuration` que CakePHP utilise. Les détails sur la
  connexion à la base de données, le bootstrapping, les fichiers de
  configuration du cœur et consorts doivent être stockés ici.
- Le dossier *logs* contient normalement vos fichiers de log dépendant de votre
  configuration des logs.
- Le dossier *plugins* est l'endroit où sont stockés les :doc:`/plugins` que
  votre application utilise.
- Le dossier *src* sera celui où vous exercerez votre magie : c'est là
  que vous placerez les fichiers de votre application.
- Le dossier *tests* est l'endroit où vous mettez les cas de test pour votre
  application.
- Le dossier *tmp* est l'endroit où CakePHP stocke les données temporaires. Les
  données qu'il stocke dépendent de la façon dont vous avez configuré CakePHP
  mais ce dossier est généralement utilisé pour stocker les descriptions de
  model, les logs, et parfois les informations de session.
- Le dossier *vendor* est l'endroit où CakePHP et d'autres dépendances de
  l'application vont être installés. Engagez-vous personnellement à ne
  **pas** modifier les fichiers dans ce dossier. Nous ne pourrons pas vous
  aider si vous avez modifié le cœur du framework.
- Le répertoire *webroot* est la racine publique de votre application. Il
  contient tous les fichiers que vous souhaitez voir accessibles publiquement.

  Assurez-vous que les dossiers *tmp* et *logs* existent et qu'ils sont en
  écriture, autrement la performance de votre application sera sévèrement
  impactée. En mode debug, CakePHP vous avertira si ce n'est pas le cas.

Le Dossier Src
==============

Le répertoire *src* de CakePHP est l'endroit où vous réaliserez la majorité
du développement de votre application. Regardons d'un peu plus près les dossiers
à l'intérieur de *src*.

Console
    Contient les commandes de la console et les Tasks de la console pour votre
    application. Pour plus d'informations, regardez
    :doc:`/console-shells-and-tasks`.
Controller
    Contient les Controllers et les Components de votre application.
Locale
    Stocke les fichiers pour l'internationalisation.
Model
    Pour les Tables, Entity et Behaviors de votre application.
View
    Les fichiers de présentation sont placés ici : Vue Grille, helpers et
    templates de vues.
Template
    Les fichiers de présentation se trouvent ici: elements, pages d'erreur,
    les layouts, et les fichiers de template de vue.


.. meta::
    :title lang=fr: Structure du dossier de CakePHP
    :keywords lang=fr: librairies internes,configuration du cœur,descriptions du model,librairies externes,détails de connexion,structure de dossier,librairies tierces,engagement personnel,connexion base de données,internationalisation,fichiersd e configuration,dossiers,développement de l'application,à lire,lib,configuré,logs,config,tierce partie,cakephp
