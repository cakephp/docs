Déploiement
###########

Une fois que votre application est terminée, ou même avant que vous
souhaitiez la déployer. Il y a quelques choses que vous devriez faire quand
vous déployez une application CakePHP.

Mise à jour de config/app.php
=============================

Mettre à jour core.php, spécialement la valeur de ``debug`` est extrêmement
important. Mettre debug = ``false`` désactive un certain nombre de
fonctionnalités de développement qui ne devraient jamais être exposées sur
internet. Désactiver le debug change les types de choses suivantes:

* Les messages de Debug, créés avec :php:func:`pr()` et :php:func:`debug()`
  sont désactivés.
* Les caches du Coeur de CakePHP sont flushés tous les 999 jours, au lieu de
  tous les 10 seconds en développement.
* Les vues d'Erreur sont moins informatives, et renvoient des messages
  génériques d'erreur à la place.
* Les Erreurs PHP ne sont pas affichées.
* Les traces de pile d'Exception sont désactivées.

En plus des éléments ci-desssus, beaucoup de plugins et d'extensions
d'application utilisent ``debug`` pour modifier leur comportement.

Vous pouvez créer une variable d'environnement pour définir le niveau de
debug dynamiquement entre plusieurs environnements. Cela va éviter de déployer
une application avec debug à ``true`` et vous permet de ne pas avoir à changer
de niveau de debug chaque fois avant de déployer vers un environnement de
production.

Par exemple, vous pouvez définir une variable d'environment dans votre
configuration Apache::

    SetEnv CAKEPHP_DEBUG 1

Et ensuite vous pouvez définir le niveau de debug dynamiquement dans
``app.php``::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    $config = [
        'debug' => $debug,
        .....
    ];

Vérifier Votre Sécurité
=======================

Si vous sortez votre application dans la nature, il est bon de vous assurer
qu'elle n'a pas de fuites:

* Assurez-vous que vous utilisez le
  :doc:`/core-libraries/components/csrf-component` activé.
* Vous pouvez activer :doc:`/core-libraries/components/security-component`.
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
soient executés en-dehors du répertoire webroot.

.. _symlink-assets:

Améliorer les performances de votre application
===============================================

Le chargement des classes peut facilement prendre une bonne part du temps
d'execution de votre application. Afin d'éviter ce problème, il est recommandé
que vous lanciez cette commande dans votre serveur de production une fois
que l'application est déployée::

    php composer.phar dumpautoload -o

Comme la gestion des éléments statiques, comme les images, le Javascript et
les fichiers CSS des plugins à travers le Dispatcher est incroyablement
inefficace, il est chaudement recommandé de les symlinker pour la
production. Par exemple comme ceci::

    ln -s plugins/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css

.. meta::
    :title lang=fr: Déploiement
    :keywords lang=fr: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
