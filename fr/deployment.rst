Déploiement
###########

Une fois que votre application CakePHP est prête à être déployée, il reste un
certains nombre de choses à faire.

Déplacer les Fichiers
=====================

Vous pouvez cloner votre dépôt sur votre serveur de production, puis faire un
checkout du commit/tag que vous voulez lancer. Puis, exécutez
``composer install``.
Bien que cela nécessite quelques connaissances de git et que vous ayez ``git``
et ``composer`` installés, cette façon de faire vous permettra de gérer les
dépendances de librairies et les permissions des fichiers et des dossiers.

Rappelez-vous que lors d'un déploiement via FTP, vous devrez au moins mettre les
bonnes permissions pour les fichiers et les dossiers.

Vous pouvez aussi utiliser cette technique de déploiement pour configurer des
versions staging ou demo (pre-production) et les garder à jour avec votre
environnement local.

Ajuster la Configuration
========================

Vous voudrez faire quelques ajustements à la configuration de votre application
pour un environnement de production. La valeur de ``debug`` est extrêmement
importante. Mettre debug = ``false`` désactive un certain nombre de
fonctionnalités de développement qui ne devraient jamais être exposées sur
internet. Désactiver le debug change les types de choses suivantes:

* Les messages de Debug, créés avec :php:func:`pr()`, :php:func:`debug()` et :php:func:`dd()`
  sont désactivés.
* Les caches du Cœur de CakePHP sont flushés tous les ans (environ 365 jours),
  au lieu de toutes les 10 secondes en développement.
* Les vues d'Erreur sont moins informatives, et renvoient des messages
  génériques d'erreur à la place.
* Les Erreurs PHP ne sont pas affichées.
* Les traces de pile d'Exception sont désactivées.

En plus des éléments ci-dessus, beaucoup de plugins et d'extensions
d'application utilisent ``debug`` pour modifier leur comportement.

Vous pouvez créer une variable d'environnement pour définir le niveau de
debug dynamiquement entre plusieurs environnements. Cela va éviter de déployer
une application avec debug à ``true`` et vous permet de ne pas avoir à changer
de niveau de debug chaque fois avant de déployer vers un environnement de
production.

Par exemple, vous pouvez définir une variable d'environnement dans votre
configuration Apache::

    SetEnv CAKEPHP_DEBUG 1

Et ensuite vous pouvez définir le niveau de debug dynamiquement dans
**config/app_local.php**::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

Vérifier Votre Sécurité
=======================

Si vous sortez votre application dans la nature, il est bon de vous assurer
qu'elle n'a pas de fuites:

* Assurez-vous que vous utilisez le middleware
  :ref:`csrf-middleware` activé.
* Vous pouvez activer le component :doc:`/controllers/components/security`.
  Il évite plusieurs types de form tampering et réduit la possibilité
  des problèmes de mass-assignment.
* Assurez-vous que vos models ont les bonnes règles de
  :doc:`/core-libraries/validation` activées.
* Vérifiez que seul votre répertoire ``webroot`` est visible publiquement, et
  que vos secrets (comme votre sel de app, et toutes les clés de sécurité) sont
  privées et aussi uniques.

Définir le Document Root
========================

Configurer le document root correctement dans votre application est aussi
une étape importante pour garder votre code sécurisé et votre application
plus sûre. Les applications CakePHP devraient avoir le document root configuré
au répertoire ``webroot`` de l'application. Cela rend les fichiers de
l'application et de configuration inaccessibles via une URL.
Configurer le document root est différent selon les webserveurs. Regardez
la documentation :ref:`url-rewriting` pour avoir des
informations sur la spécificité de chaque webserveur.

Dans tous les cas, vous devez définir le document de l'hôte/domaine virtuel
pour qu'il soit ``webroot/``. Cela retire la possibilité que des fichiers
soient exécutés en-dehors du répertoire webroot.

.. _symlink-assets:

Améliorer les Performances de votre Application
===============================================

Le chargement des classes peut prendre une bonne part du temps d'exécution de
votre application. Afin d'éviter ce problème, il est recommandé que vous lanciez
cette commande dans votre serveur de production une fois que l'application est
déployée::

    php composer.phar dumpautoload -o

Étant donné que la gestion des éléments statiques, comme les images, le
Javascript et les fichiers CSS des plugins à travers le ``Dispatcher`` est
incroyablement inefficace, il est chaudement recommandé d'utiliser les liens
symboliques pour la production. Ceci peut être fait facilement en utilisant
le shell ``plugin``::

    bin/cake plugin assets symlink

La commande ci-dessus va faire un lien symbolique du répertoire ``webroot``
de tous les plugins chargés vers les chemins appropriés dans le répertoire
``webroot`` de l'application.

Si votre système de fichier ne permet pas de créer des liens symboliques, les
répertoires seront copiés à la place des liens symboliques. Vous pouvez aussi
explicitement copier les répertoires en utilisant::

    bin/cake plugin assets copy

Déployer une Mise à Jour
========================

Après un déploiement ou une mise à jour, vous pouvez aussi lancer ``bin/cake
schema_cache clear``, qui fait parti du shell :doc:`/console-commands/schema-cache`.

À chaque dépoloiement, vous aurez sans doute quelques tâches à coordonner sur
votre serveur web. Les plus typiques sont:

1. Installer des dépendances avec ``composer install``. Évitez d'utiliser
   ``composer update`` en déploiement car vous pourriez obtenir des versions
   inattendues des packages.
2. Lancez les `migrations </migrations/>`__ de bases de données, que ce soit
   avec le plugin Migrations ou un autre outil.
3. Vider le cache du schéma du modèle avec ``bin/cake schema_cache clear``. La
   section :doc:`/console-commands/schema-cache` vous en apprendra plus sur
   cette commande.

.. meta::
    :title lang=fr: Déploiement
    :keywords lang=fr: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
