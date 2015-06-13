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
les attaques CSRF, la falsification de champ de formulaire, etc... Utiliser
:doc:`/models/data-validation`, et/ou :doc:`/core-utility-libraries/sanitize`
est aussi une bonne idée, pour protéger votre base de données et aussi contre
les attaques XSS. Vérifiez que seul votre répertoire ``webroot`` est visible
publiquement, et que vos secrets (comme le salt de votre app, et les clés de
sécurité) sont privés et uniques aussi!

Définir le document root
========================

Configurer le document root correctement dans votre application est aussi
une étape importante pour garder votre code sécurisé et votre application
plus sûre. Les applications CakePHP devraient avoir le document root configuré
au répertoire ``app/webroot`` de l'application. Cela rend les fichiers de
l'application et de configuration inaccessibles via une URL.
Configurer le document root est différent selon les webserveurs. Regardez
la documentation :doc:`/installation/url-rewriting` pour une
information sur la spécificité de chaque webserveur.

Dans tous les cas, vous devez définir le document de l'hôte/domaine virtuel
pour qu'il soit ``app/webroot/``. Cela retire la possibilité que des fichiers
soient exécutés en-dehors du répertoire webroot.

Mise à jour de core.php
=======================

Mettre à jour core.php, spécialement la valeur de ``debug`` est extrêmement
important. Mettre debug = 0 désactive un certain nombre de fonctionnalités de
développement qui ne devraient jamais être exposées sur internet. Désactiver
le debug change les types de choses suivantes:

* Les messages de Debug, créés avec :php:func:`pr()` et :php:func:`debug()`
  sont désactivés.
* Les caches du Coeur de CakePHP sont flushés tous les 999 jours, au lieu de
  toutes les 10 secondes en développement.
* Les vues d'Erreur sont moins informatives, et renvoient des messages
  génériques d'erreur à la place.
* Les Erreurs ne sont pas affichées.
* Les traces de pile d'Exception sont désactivées.

En plus des éléments ci-dessus, beaucoup de plugins et d'extensions
d'application utilisent ``debug`` pour modifier leur comportement.

Vous pouvez créer une variable d'environnement pour définir le niveau de
debug dynamiquement entre plusieurs environnements. Cela va éviter de déployer
une application avec debug > 0 et vous permet de ne pas avoir à changer de
niveau de debug chaque fois avant de déployer vers un environnement de
production.

Par exemple, vous pouvez définir une variable d'environnement dans votre
configuration Apache::

	SetEnv CAKEPHP_DEBUG 2

Et ensuite vous pouvez définir le niveau de debug dynamiquement dans
``core.php``::

	if (getenv('CAKEPHP_DEBUG')) {
		Configure::write('debug', 2);
	} else {
		Configure::write('debug', 0);
	}

Améliorer les performances de votre application
===============================================

Comme la gestion des éléments statiques, comme les images, le Javascript et
les fichiers CSS des plugins à travers le Dispatcher est incroyablement
inefficace, il est chaudement recommandé de les symlinker pour la
production. Par exemple comme ceci::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

.. meta::
    :title lang=fr: Déploiement
    :keywords lang=fr: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
