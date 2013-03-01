Déploiement
###########

Une fois que votre application est terminée, ou même avant que vous 
souhaitiez la déployer. Il y a quelques choses que vous devriez faire quand 
vous déployez une application CakePHP.

Vérifier votre sécurité
=======================

Si vous sortez votre application dans la nature, il est bon de vous assurer 
qu'elle n'a pas de fuites. Allez voir 
:doc:`/core-libraries/components/security-component` pour vous sécuriser contre 
les attaques CSRF, form field tampering, etc... Utiliser 
:doc:`/models/data-validation`, et/ou :doc:`/core-utility-libraries/sanitize` 
est aussi une bonne idée, pour protéger votre base de données et aussi contre 
les attaques XSS. Vérifiez que seul votre répertoire ``webroot`` est visible 
publiquement, et que vos secrets (comme le salt de votre app, et les clés de 
sécurité) sont privés et uniques aussi!

Set document root
=================

Configurer le document root correctement dans votre application est aussi
une étape importante pour garder votre code sécurisé et votre application 
plus sûre. Les applications CakePHP devraient avoir le document root configuré 
au répertoire ``app/webroot`` de l'application. Cela rend les fichiers de 
l'application et de configuration inaccessibles via une URL.
Configurer le document root est différent selon les webserveurs. Regardez 
la documentation :doc:`/installation/advanced-installation` pour une 
information sur la spécificité de chaque webserveur.

Mise à jour core.php
====================

Mettre à jour core.php, spécialement la valeur de ``debug`` est extrêmement 
important. Mettre debug = 0 désactive un certain nombre de fonctionnalités de 
développement qui ne devraient jamais être exposées sur internet. Désactiver 
le debug change les types de choses suivantes:

* Les messages de Debug, créés avec :php:func:`pr()` et :php:func:`debug()` sont
  désactivés.
* Les caches du Coeur de CakePHP sont flushés tous les 99 years, au lieu de 
  tous les 10 seconds en développement.
* Les vues d'Erreur sont moins informatives, et renvoient des messages 
  génériques d'erreur à la place.
* Les Erreurs ne sont pas affichées.
* Les traces de pile d'Exception sont désactivées.

En plus des éléments ci-desssus, beaucoup de plugins et d'extensions 
d'application utilisent ``debug`` pour modifier leur comportement.

De multiples applications CakePHP en utilisant le même coeur
============================================================

Vous avez peu de façons de configurer de multiples applications qui utilisent 
le même coeur de CakePHP. Vous pouvez soit utiliser le ``include_path`` de 
PHP, ou configurer ``CAKE_CORE_INCLUDE_PATH`` dans le fichier 
``webroot/index.php`` de votre application.
Généralement, utiliser le ``include_path`` de PHP est plus facile et plus 
robuste. CakePHP est fourni pré-configuré pour aussi regarder le 
``include_path`` donc il est facile à utiliser.

Dans votre fichier de ``php.ini``, repérez la directive existante 
``include_path``, et vous pouvez soit ajouter à la suite de la directive, 
soit créer la directive ``include_path``::

    include_path = '.:/usr/share/php:/usr/share/cakephp-2.0/lib'

Cela suppose que vous êtes sur un serveur \*nix, et que CakePHP est dans 
``/usr/share/cakephp-2.0``.

Améliorer les performances de votre application
===============================================

Comme la gestion des éléments statiques, comme les images, le Javascript et 
les fichiers css des plugins à travers le Dispatcher est incroyablement 
inéfficace, il est chaudement recommandé de les symlinker pour la 
production. Par exemple comme ceci::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

.. meta::
    :title lang=fr: Deploiement
    :keywords lang=fr: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
