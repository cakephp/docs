Cache
#####

L'assistant Cache permet de mettre en cache des vues et layouts, ce qui
permet de sauver le temps de récupération des données répétitives. Le
système de cache des vues de Cake sauvegarde les vues et layouts avec le
moteur de stockage de votre choix. Il faut noter que l'assistant Cache
fonctionne de façon assez différente des autres assistants. Il ne
possède pas de méthodes appelées directement. A la place, une vue est
marquée de tags, indiquant quels blocs de contenus ne doivent pas être
mis en cache.

Quand une URL est appelée, Cake vérifie si cette requête a déjà été mise
en cache. Si c'est le cas, le processus de distribution de l'URL est
abandonné. Chacun des blocs non mis en cache sont rendus selon le
processus normal, et la vue est servie. Cela sauve véritablement du
temps pour chaque requête d'une URL mise en cache, puisqu'un minimum de
code est exécuté. Si Cake ne trouve pas une vue mise en cache, ou si le
cache a expiré pour l'URL appelée, le processus de requête normal se
poursuit.

Généralités sur la mise en cache
================================

Mettre en cache permet un stockage temporaire pour aider à réduire les
chargements sur le serveur. Par exemple, il est possible de stocker les
résultats des requêtes coûteuses en temps sur la base de données, de
manière à ne pas les demander pour chaque page.

Gardons ça à l'esprit, le cache n'est pas un stockage permanent et ne
devrait jamais être utilisé à cette fin. Il faut mettre en cache des
choses qu'on est capable de générer de nouveau au besoin.

Les moteurs de cache de Cake
============================

Nouveauté depuis la version 1.2 : les moteurs de cache. Ce sont des
interfaces transparentes avec l'assistant Cache qui vous autorisent à
stocker des vues de différentes façons sans vous préoccuper du comment.
Le choix du moteur de cache est positionné dans le fichier de
configuration app/config/core.php. La plupart des options sont listées
dans la version du fichier qui vient avec la distribution et des
informations plus détaillées sur chaque moteur se trouve dans la section
Cache.

Fichiers

Le moteur de cache de type fichier est celui que Cake utilise par
défaut. Il écrit des fichiers plats dans l'arborescence de fichier, il
possède des options mais fonctionne bien avec les options par défaut.

APC

Le moteur de cache APC implémente l'alternative APC : `Alternative PHP
Cache <https://secure.php.net/apc>`_, le cache d'opcode libre et ouvert pour
PHP. Comme XCache, ce moteur met en cache le code intermédiaire PHP.

XCache

Ce moteur de cache est fonctionnellement similaire à APC met implémente
`XCache <http://xcache.lighttpd.net/>`_, le cache d'opcode. Il nécessite
de rentrer une authentification utilisateur pour fonctionner
correctement.

Memcache

Le moteur de cache Memcache fonctionne avec serveur Memcache: un démon
vous autorisant à créer un objet cache dans la mémoire vive du système.
Plus d'information sur le module Memcache qui sert d'interface au démon
sur `php.net <http://www.php.net/memcache>`_ et sur le `démon memcached
ici. <http://www.danga.com/memcached/>`_

La configuration de l'assistant Cache
=====================================

La mise en cache de vue et l'Assistant Cache possèdent plusieurs
éléments de configuration détaillés ci-dessous.

Pour utiliser l'Assistant Cache dans n'importe quel vue ou contrôleur,
vous devez d'abord dé-commenter et définir Configure::Cache.check à true
à la ligne 80 de ``core.php`` dans votre /app/config. Si ce n'est pas le
cas, alors le cache ne sera pas vérifié, ni créé.

Mettre en cache depuis le contrôleur
====================================

Tout contrôleur qui utilise des fonctionnalités de cache doit inclure
l'assistant cache (CacheHelper) dans son tableau d'assistants
($helpers).

::

    var $helpers = array('Cache');

Vous devez aussi indiquer quelles actions doivent être mises en cache et
pour combien de temps. On fait cela avec la variable $cacheAction du
contrôleur. $cacheAction devrait être un tableau qui contient les
actions concernées et la durée de mise en cache exprimée en seconde. La
durée peut aussi être exprimé au format de la fonction strtotime() (ie :
"1 hour", ou "3 minutes").

En utilisant l'exemple d'un contrôleur ArticlesController, qui reçoit
beaucoup de trafic qu'on a besoin de mettre en cache.

Mise en cache des articles fréquemment lus pour des durées de temps
variables :

::

    var $cacheAction = array(
        'view/23/' => 21600,
        'view/48/' => 36000,
        'view/52'  => 48000
    );

Mise en cache d'une action complète, dans notre cas un listing
d'articles :

::

    var $cacheAction = array(
        'archives/' => '60000'
    );

Mise en cache de toutes les actions du contrôleur en utilisant un format
strtotime() pour indiquer un temps long.

::

    var $cacheAction = "1 hour";

Vous pouvez aussi activer les callbacks des contrôleurs/composants pour
les vues mises en cache et créées avec le ``CacheHelper``. Pour faire
çà, vous devez utiliser le format tableau pour ``$cacheAction`` et créer
un tableau comme celui-ci :

::

    var $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index'  => array('callbacks' => true, 'duration' => 48000)
    );

En définissant ``callbacks => true``, vous indiquez à l'assistant Cache
que vous voulez les fichiers générés pour créer les composants et
modèles du contrôleur. En plus, cela lance les méthodes initialize et
startup du composant, le beforeFilter du contrôleur.

Définir ``callbacks => true`` fait échouer en partie l'objectif de la
mise en cache. C'est la raison pour laquelle ceci est désactivé par
défaut.

Contenus non mis en cache dans les Vues
=======================================

Il y aura des fois où vous ne voudrez par mettre en cache une vue
*intégrale*. Par exemple, certaines parties d'une page peuvent être
différentes, selon que l'utilisateur est actuellement identifié ou qu'il
visite votre site en tant qu'invité.

Pour indiquer que des blocs de contenu *ne doivent pas* être mis en
cache, entourez-les par ``<cake:nocache> </cake:nocache>`` comme
ci-dessous :

::

    <cake:nocache>
    <?php if ($session->check('Utilisateur.nom')) : ?>
        Bienvenue, <?php echo $session->read('Utilisateur.nom')?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    </cake:nocache>

Il est à noter, qu'une fois une action mise en cache, la méthode du
contrôleur correspondante ne sera plus appelée - sinon il n'y aurait pas
d'intérêt à mettre la page en cache. Par conséquent, ce n'est pas
possible d'entourer par ``<cake:nocache> </cake:nocache>``, des
variables qui ont été définies dans le contrôleur, puisqu'elles auront
la valeur *null*.

Nettoyer le cache
=================

Il est important de se rappeler que Cake va nettoyer le cache si un
modèle utilisé dans la vue mise en cache a été modifié. Par exemple, si
une vue mise en cache utilise des données du modèle Post et qu'il y a eu
une requête INSERT, UPDATE, ou DELETE sur Post, le cache est nettoyé, et
un nouveau contenu est généré à la prochaine requête.

Si vous avez besoin de nettoyer le cache manuellement, vous pouvez le
faire en appelant Cache::clear(). Cela nettoiera **toutes** les données
mises en cache, à l'exception des fichiers de vues mis en cache. Si vous
avez besoin de nettoyer les fichiers de vues, utilisez ``clearCache``
