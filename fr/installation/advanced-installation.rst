Installation avancée
####################

Il peut y avoir des situations où vous voulez placer les répertoires de CakePHP
à différents endroits du système de fichiers. Cela est peut être du à des 
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
   `Testing <view/1196/Testing>`\_.)

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
