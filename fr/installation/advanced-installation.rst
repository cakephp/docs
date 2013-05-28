Installation avancée
####################

Installer CakePHP avec l'installeur PEAR
========================================

CakePHP publie un package PEAR que vous pouvez installer en utilisant
l'installeur pear. L'installation avec l'installeur PEAR peut simplifier
le partage des librairies de CakePHP sur plusieurs applications. Pour installer
CakePHP avec pear, vous devrez faire comme suit::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    Sur certains systèmes, l'installation de librairies avec pear nécessitera
    la commande ``sudo``.

Après avoir installé CakePHP avec pear, si pear est configuré correctement,
vous devriez pouvoir utiliser la commande ``cake`` pour créer une nouvelle
application. Puisque CakePHP sera localisé dans l'``include_path`` de PHP,
vous n'aurez pas besoin de faire d'autres changements.


Installer CakePHP avec composer
===============================

Composer est un outil de gestion de dépendance pour PHP 5.3+. Il règle
plusieurs problèmes que l'installeur PEAR a, et simplifie la gestion de
plusieurs versions de librairies. Puisque CakePHP publie un package PEAR,
vous pouvez installer CakePHP en utilisant
`composer <http:://getcomposer.org>`_. Avant d'installer CakePHP, vous devrez
configurer un fichier ``composer.json``. Un fichier composer.json pour une
application CakePHP ressemblerait à ce qui suit::

    {
        "name": "example-app",
        "repositories": [
            {
                "type": "pear",
                "url": "http://pear.cakephp.org"
            }
        ],
        "require": {
            "pear-cakephp/cakephp": ">=2.3.4"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

Sauvegarder ce JSON dans ``composer.json`` dans le répetoire racine de votre
projet. Ensuite, télécharger le fichier composer.phar dans votre projet. Après
avoir téléchargé composer, installez CakePHP. Dans le même répertoire que votre
fichier ``composer.json``, lancez ce qui suit::

    $ php composer.phar install

Une fois que composer a terminé son exécution, vous devriez avoir une structure
de répertoire qui ressemble à::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            pear-pear.cakephp.org/

Vous êtes maintenant prêt à générer le reste du squelette de votre
application::

    $ Vendor/bin/cake bake project <path to project>

Par défaut ``bake`` va hard-code :php:const:`CAKE_CORE_INCLUDE_PATH`. Pour
rendre votre application plus portable, vous devrez modifier
``webroot/index.php``, en changeant ``CAKE_CORE_INCLUDE_PATH`` en un chemin
relatif::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . DS . APP_DIR . '/Vendor/pear-pear.cakephp.org/CakePHP'
    );

Si vous installez d'autres librairies avec composer, vous devrez configurer
l'autoloader, et régler un problème dans l'autoloader de composer. Dans votre
fichier ``Config/bootstrap.php``, ajoutez ce qui suit::

    // Charger l'autoload de composer.
    require APP . '/Vendor/autoload.php';
    
    // Retire et re-prepend l'autoloader de CakePHP puisque composer pense que c'est le plus important.
    // See https://github.com/composer/composer/commit/c80cb76b9b5082ecc3e5b53b1050f76bb27b127b
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

Vous devriez maintenant avoir une application CakePHP fonctionnelle avec
CakePHP installé via composer. Assurez-vous de garder les fichiers 
composer.json et composer.lock.json avec le reste de votre code source.


Partager les librairies de CakePHP pour plusieurs applications
==============================================================

Il peut y avoir des situations où vous voulez placer les répertoires de CakePHP
à différents endroits du système de fichiers. Cela est peut être dû à des 
restrictions de l'hôte partagé, ou peut-être souhaitez-vous juste que 
quelques-unes de vos apps puissent partager les mêmes librairies de CakePHP. 
Cette section décrit comment déployer vos répertoires de CakePHP à travers 
le système de fichiers.

Premièrement, réalisez qu'il y a trois parties principales d'une application 
Cake:

#. Les librairies du coeur de CakePHP, dans /lib/Cake.
#. Le code de votre application, dans /app.
#. Le webroot de l'application, habituellement dans /app/webroot.

Chacun de ces répertoires peut être situé n'importe où dans votre 
système de fichier, avec l'exception de webroot, qui a besoin d'être acessible 
pour votre serveur web. Vous pouvez même déplacer le dossier webroot en-dehors 
du dossier app tant que vous dîtes à Cake où vous le mettez.

Pour configurer votre installation de Cake, vous aurez besoin de faire quelques 
changements aux fichiers suivants.

-  /app/webroot/index.php
-  /app/webroot/test.php (si vous utilisez la fonctionnalité de
   :doc:`Testing </development/testing>`.)

Il y a trois constantes que vous devrez modifier: ``ROOT``,
``APP_DIR``, et ``CAKE_CORE_INCLUDE_PATH``.


- ``ROOT`` doit être définie vers le chemin du répertoire qui contient le 
  dossier app.
- ``APP_DIR`` doit être définie vers le nom (de base) de votre dossier app.
- ``CAKE_CORE_INCLUDE_PATH`` doit être définie vers le chemin du dossier 
  des librairies de CakePHP.

Testons cela avec un exemple pour que vous puissiez voir ce à quoi peut 
ressembler une installation avancée en pratique. Imaginez que je souhaite 
configurer CakePHP pour travailler comme ce qui suit:

-  Les librairies du coeur de CakePHP seront placées dans /usr/lib/cake.
-  Le répertoire webroot de l'application sera /var/www/monsite/.
-  Le répertoire app de mon application sera /home/moi/monapp.

Etant donné ce type de configuration, j'aurais besoin de modifier mon fichier 
webroot/index.php (ce qui finira dans /var/www/mysite/index.php, dans cet 
exemple) pour ressembler à ce qui suit::

    // /app/webroot/index.php (partiel, commentaires retirés) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'moi');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'monapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

Il est recommandé d'utiliser la constante ``DS`` plutôt que des slashes pour 
délimiter des chemins de fichier. Cela empêche les erreurs de fichiers 
manquants que vous pourriez obtenir en résultats en utilisant le mauvais
délimiteur, et cela rend votre code plus portable.

Cette section a été déplacée vers :doc:`URL rewriting </installation/url-rewriting>`.


.. meta::
    :title lang=fr: Installation avancée
    :keywords lang=fr: dossier des libraries,librairies du coeur,code de l'application,différents endroits,système de fichiers,constantes,webroot,restrictions,apps,serveur web,lib,cakephp,répertoires,chemin
