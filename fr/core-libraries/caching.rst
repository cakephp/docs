La mise en cache
################

La mise en cache est fréquemment utilisée pour réduire le temps pris pour créer
ou lire depuis une autre ressource. La mise en cache est souvent  utilisée pour
rendre la lecture de ressources consommatrices en temps en ressources moins
consommatrice. Vous pouvez aisément stocker en cache les résultats de requêtes
consommatrices en ressources ou les accès à distance à des services web qui ne
changent pas fréquemment. Une fois mis en cache, re-lire les ressources
stockées depuis le cache est moins consommateur en ressource qu'un accès a une
ressource distante.

La mise en cache dans CakePHP se fait principalement par la classe
:php:class:`Cache`. Cette classe fournit un ensemble de méthodes
statiques qui fournissent une API uniforme pour le traitement des
différentes implémentations de mise en cache. CakePHP arrive avec plusieurs
moteurs de cache intégrés, et fournit un système facile pour implémenter
votre propre système de mise en cache. Les moteurs de cache intégrés sont:

* ``FileCache`` File cache est un cache simple qui utilise des fichiers
  locaux. C'est le moteur de cache le plus lent, et il ne fournit que peu
  de fonctionnalités pour les opérations atomiques. Cependant, le stockage
  sur disque est souvent peu consommateur en ressource, le stockage de
  grands objets ou des éléments qui sont rarement écrits fonctionne
  bien dans les fichiers. C'est le moteur de Cache par défaut pour 2.3+.
* ``ApcCache`` Le cache APC utilise l'extension PHP
  `APC <https://secure.php.net/apc>`_ ou `APCu <https://secure.php.net/apcu>`_. Ces extensions
  utilisent la mémoire partagée du serveur Web pour stocker les objets. Cela le
  rend très rapide, et capable de fournir les fonctionnalités atomiques en
  lecture/écriture. Par défaut CakePHP dans 2.0-2.2 utilisera ce moteur de cache
  si il est disponible.
* ``Wincache`` Utilise l'extension `Wincache <https://secure.php.net/wincache>`_.
  Wincache offre des fonctionnalités et des performances semblables à APC, mais
  optimisées pour Windows et IIS.
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_.
  est une extension PHP qui fournit des fonctionnalités similaires à APC.
* ``MemcacheEngine`` Utilise l'extension `Memcache <https://secure.php.net/memcache>`_.
  Memcache fournit un cache très rapide qui peut être distribué au travers
  de nombreux serveurs et il permet les opérations atomiques.
* ``MemcachedEngine`` Utilise l'extension
  `Memcached <https://secure.php.net/memcached>`_. Il est aussi une interface avec
  memcache mais il fournit une meilleur performance.
* ``RedisEngine`` Utilise l'extension
  `phpredis (2.2.3 minimum) <https://github.com/nicolasff/phpredis>`_. Redis
  fournit un système de cache cohérent et rapide similaire à memcached et il
  permet aussi les opérations atomiques.

.. versionchanged:: 2.3
    FileEngine est toujours le moteur de cache par défaut. Dans le passé, un
    certain nombre de personnes avait des difficultés à configurer et à déployer
    APC correctement dans les deux CLI + web. Utiliser les fichiers devrait
    faciliter la configuration de CakePHP pour les nouveaux développeurs.

.. versionchanged:: 2.5
    Le moteur Memcached a été ajouté. Et le moteur Memcache a été déprécié.

Quelque soit le moteur de cache que vous choisirez d'utiliser, votre
application interagit avec :php:class:`Cache` de manière cohérente. Cela
signifie que vous pouvez aisément permuter les moteurs de cache en fonction de
l'évolution de votre application. En plus de la classe :php:class:`Cache`, le
Helper :doc:`/core-libraries/helpers/cache` vous permet le cache en pleine
page, qui peut ainsi grandement améliorer les performances.

Configuration de la classe Cache
================================

La configuration de la classe Cache peut être effectuée n'importe où, mais
généralement vous voudrez configurer le cache dans
``app/Config/bootstrap.php``. Vous pouvez configurer autant de configurations
de cache dont vous avez besoin, et vous pouvez utiliser tous les mélanges de
moteurs de cache. CakePHP utilise deux configurations de cache en interne, qui
sont configurés dans ``app/Config/core.php``. Si vous utilisez APC ou Memcache
vous devrez vous assurer de définir des clés uniques pour les caches du noyau.
Ceci vous évitera qu'une application vienne réécrire les données cache d'une
autre application.

L'utilisation de plusieurs configurations de cache peut aider à réduire
le nombre de fois où vous aurez à utiliser :php:func:`Cache::set()` et
permettra aussi de centraliser tous vos paramètres de cache. L'utilisation
de plusieurs configurations vous permet également de changer le stockage
comme vous l'entendez.

.. note::

    Vous devez spécifier le moteur à utiliser. Il ne met **pas** File par
    défaut.

Exemple::

    Cache::config('short', array(
        'engine' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ));

    // long
    Cache::config('long', array(
        'engine' => 'File',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ));

En insérant le code ci-dessus dans votre ``app/Config/bootstrap.php`` vous
aurez deux configurations de cache supplémentaires. Le nom de ces
configurations 'short' ou 'long' est utilisé comme paramètre ``$config``
pour :php:func:`Cache::write()` et :php:func:`Cache::read()`.

.. note::

    Quand vous utilisez le moteur FileEngine vous pouvez avoir besoin de
    l'option ``mask`` pour vous assurer que les fichiers cachés sont
    créés avec les bonnes permissions.

.. versionadded:: 2.4

    En mode debug, les répertoires manquants vont être maintenant
    automatiquement créés pour éviter le lancement des erreurs non nécessaires
    lors de l'utilisation de FileEngine.

Création d'un moteur de stockage pour le Cache
==============================================

Vous pouvez fournir vos propre adaptateurs ``Cache`` dans ``app/Lib``
ou dans un plugin en utilisant ``$plugin/Lib``.
Les moteurs de cache App/plugin peuvent aussi remplacer les moteurs
du coeur. Les adaptateurs de cache doivent être dans un répertoire cache.
Si vous avez un moteur de cache nommé ``MonMoteurDeCachePerso`` il devra
être placé soit dans ``app/Lib/Cache/Engine/MonMoteurDeCachePerso.php``
comme une app/librairie ou dans
``$plugin/Lib/Cache/Engine/MonMoteurDeCachePerso.php`` faisant parti d'un
plugin. Les configurations de cache venant d'un plugin doivent utiliser la
notation par points de plugin. ::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        // ...
    ));

.. note::

    Les moteurs de cache App et Plugin doivent être configurés dans
    ``app/Config/bootstrap.php``. Si vous essayez de les configurer
    dans core.php ils ne fonctionneront pas correctement.

Les moteurs de cache personnalisés doivent étendre
:php:class:`CacheEngine` qui définit un certain nombre de méthodes
d'abstraction ainsi que quelques méthodes d'initialisation.

L'API requise pour CacheEngine est

.. php:class:: CacheEngine

    La classe de base pour tous les moteurs de cache utilisée avec le Cache.

.. php:method:: write($key, $value, $config = 'default')

    :retourne: un booléen en cas de succès.

    Écrit la valeur d'une clé dans le cache, la chaîne optionnelle $config
    spécifie le nom de la configuration à écrire.

.. php:method:: read($key, $config = 'default')

    :retourne: La valeur mise en cache ou false en cas d'échec.

    Lit une clé depuis le cache. Retourne false pour indiquer
    que l'entrée a expiré ou n'existe pas.

.. php:method:: delete($key, $config = 'default')

    :retourne: Un booléen true en cas de succès.

    Efface une clé depuis le cache. Retourne false pour indiquer que
    l'entrée n'existe pas ou ne peut être effacée.

.. php:method:: clear($check)

    :retourne: Un Booléen true en cas de succès.

    Efface toutes les clés depuis le cache. Si $check est à true, vous devez
    valider que chacune des valeurs a réellement expirée.

.. php:method:: clearGroup($group)

    :return: Boolean true en cas de succès.

    Supprime toutes les clés à partir du cache appartenant au même groupe.

.. php:method:: decrement($key, $offset = 1)

    :retourne: La valeur décrémentée en en cas de succès, false sinon.

    Décrémente un nombre dans la clé et retourne la valeur décrémentée

.. php:method:: increment($key, $offset = 1)

    :retourne: La valeur incrémentée en en cas de succès, false sinon.

    Incrémente un nombre dans la clé et retourne la valeur incrémentée

.. php:method:: gc()

    Non requise, mais utilisée pour faire du nettoyage quand les ressources
    expirent. Le moteur FileEngine utilise cela pour effacer les fichiers
    qui contiennent des contenus expirés.

.. php:method:: add($key, $value)

    Définit une valeur dans le cache si elle n'existe pas déjà. Devrait
    utiliser une vérification et une définition atomique quand cela est
    possible.

    .. versionadded:: 2.8
        La méthode add a été ajoutée dans 2.8.0.

Utilisation du Cache pour stocker le résultat des requêtes les plus courantes
=============================================================================

Vous pouvez considérablement améliorer les performances de vos applications
en plaçant les résultats qui ne changent que peu fréquemment ou qui peuvent
être sujets à de nombreuses lectures dans le cache. Un exemple parfait de
ceci pourrait être les résultats d'un find :php:meth:`Model::find()`.
Une méthode qui utilise la mise en Cache pour stocker les résultats pourrait
ressembler à cela::

    class Post extends AppModel {

        public function newest() {
            $result = Cache::read('newest_posts', 'longterm');
            if ($result === false) {
                $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
                Cache::write('newest_posts', $result, 'longterm');
            }
            return $result;
        }
    }

Vous pouvez améliorer le code ci-dessus en déplaçant la lecture du cache
dans un comportement, qui lit depuis le cache, ou qui exécute les méthodes
de model. C'est un exercice que vous pouvez faire.

Depuis 2.5, vous pouvez accomplir ce qui est au-dessus de façon bien plus simple
en utilisant :php:meth:`Cache::remember()`. Utiliser la nouvelle
méthode ci-dessous ressemblerait à ceci::

    class Post extends AppModel {

        public function newest() {
            $model = $this;
            return Cache::remember('newest_posts', function() use ($model){
                return $model->find('all', array(
                    'order' => 'Post.updated DESC',
                    'limit' => 10
                ));
            }, 'longterm');
        }
    }

Utilisation du Cache pour stocker les compteurs
===============================================

L'utilisation de compteurs dans le cache peut être une chose intéressante. Par
exemple un simple compte à rebours pour retenir les 'slots' restants d'un
concours pourrait être stocké en Cache. La classe Cache propose des moyens
atomiques pour incrémenter/décrémenter des valeurs de compteur facilement.
Les opérations atomiques sont importantes pour ces valeurs parce que cela réduit
le risque de contention et la capacité de deux utilisateurs à simultanément
en abaisser la valeur et de se retrouver avec une valeur incorrecte.

Après avoir défini une valeur entière vous pouvez la manipuler en utilisant
:php:meth:`Cache::increment()` et :php:meth:`Cache::decrement()`::

    Cache::write('compteur_initial', 10);

    // Plus tard sur
    Cache::decrement('compteur_initial');

    //ou
    Cache::increment('compteur_initial');

.. note::

    L'incrémentation et la décrémentation ne fonctionne pas avec le moteur
    FileEngine. Vous devez utiliser APC ou Memcached en remplacement.

Utilisation des groupes
=======================

.. versionadded:: 2.2

Parfois vous voudrez marquer plusieurs entrées de cache comme appartenant à
un même groupe ou un namespace. C'est une exigence courante pour invalider
des grosses quantités de clés alors que quelques changements d'informations
sont partagés pour toutes les entrées dans un même groupe. Cela est possible
en déclarant les groupes dans la configuration de cache::

    Cache::config('site_home', array(
        'engine' => 'Redis',
        'duration' => '+999 days',
        'groups' => array('comment', 'post')
    ));

Disons que vous voulez stocker le HTML généré pour votre page d'accueil
dans le cache, mais vous voulez aussi invalider automatiquement ce cache à
chaque fois qu'un commentaire ou un post est ajouté à votre base de données.
En ajoutant les groupes ``comment`` et ``post``, nous avons effectivement
taggés les clés stockées dans la configuration du cache avec les noms des
deux groupes.

Par exemple, dès qu'un post est ajouté, nous pouvons dire au moteur de
Cache de retirer toutes les entrées associées au groupe ``post``::

    // Model/Post.php

    public function afterSave($created, $options = array()) {
        if ($created) {
            Cache::clearGroup('post', 'site_home');
        }
    }

.. versionadded:: 2.4

:php:func:`Cache::groupConfigs()` peut être utilisée pour récupérer les
correspondances entre le groupe et les configurations, par ex: en ayant le
même groupe::

    // Model/Post.php

    /**
     * Une variation de l\'exemple précédent qui nettoie toutes les
     * configurations de Cache ayant le même groupe
     */
    public function afterSave($created, $options = array()) {
        if ($created) {
            $configs = Cache::groupConfigs('post');
            foreach ($configs['post'] as $config) {
                Cache::clearGroup('post', $config);
            }
        }
    }

Les groupes sont partagés à travers toutes les configs de cache en utilisant
le même moteur et le même préfixe. Si vous utilisez les groupes et voulez tirer
profit de la suppression de groupe, choisissez un préfixe commun pour toutes
vos configs.

l'API de Cache
==============

.. php:class:: Cache

    La classe Cache dans CakePHP fournit un frontend générique pour
    plusieurs systèmes de cache backend. Différentes configurations
    de Cache et de moteurs peuvent être configurés dans votre
    app/Config/core.php

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` est utilisée pour créer des configurations
    de cache supplémentaires. Ces configurations supplémentaires
    peuvent avoir différentes durées, moteurs, chemins, ou préfixes
    par rapport à la configuration par défaut du cache.

.. php:staticmethod:: read($key, $config = 'default')

    Cache::read() est utilisée pour lire la valeur en cache stockée
    dans ``$key`` depuis le ``$config``. Si $config est null la
    configuration par défaut sera utilisée. ``Cache::read()`` retournera
    la valeur en cache si c'est un cache valide ou ``false`` si le
    cache a expiré ou n'existe pas. Le contenu du cache pourrait
    être vu comme false, donc assurez-vous que vous utilisez les opérateurs
    de comparaison stricte ``===`` ou ``!==``.

    Par exemple::

        $cloud = Cache::read('cloud');

        if ($cloud !== false) {
            return $cloud;
        }

        // génération des données cloud
        // ...

        // stockage des donnée en cache
        Cache::write('cloud', $cloud);
        return $cloud;

.. php:staticmethod:: write($key, $value, $config = 'default')

    Cache::write() va écrire $value dans le cache. Vous pouvez lire ou
    effacer cette valeur plus tard en vous y référant avec ``$key``..
    Vous pouvez spécifier une configuration optionnelle pour stocker
    le cache. Si il n'y a pas de ``$config`` spécifiée c'est la
    configuration par défaut qui sera appliquée. Cache::write()
    peut stocker n'importe quel type d'objet et elle est idéale pour
    stocker les résultats des finds de vos models. ::


            if (($posts = Cache::read('posts')) === false) {
                $posts = $this->Post->find('all');
                Cache::write('posts', $posts);
            }

   Utiliser ``Cache::write()`` et ``Cache::read()`` pour facilement réduire
   le nombre de déplacement fait dans la base de données pour rechercher
   les posts.

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` vous permet d'enlever complètement un objet mis en cache
    de son lieu de stockage de Cache.

.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` vous permet de réécrire temporairement les paramètres
    de configs pour une opération (habituellement une lecture ou écriture).
    Si vous utilisez ``Cache::set()`` pour changer les paramètres pour une
    écriture, vous devez aussi utiliser ``Cache::set()`` avant de lire les
    données en retour. Si vous ne faites pas cela, les paramètres par défaut
    seront utilisés quand la clé de cache est lue. ::

        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);

        // plus tard

        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    Si vous trouvez que vous répétez l'appel à ``Cache::set()`` peut-être
    devriez-vous créer une nouvelle :php:func:`Cache::config()`. Qui
    enlèvera les besoins d'appeler ``Cache::set()``.

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    Incrémente de manière atomique une valeur stockée dans le moteur de cache.
    Idéal pour modifier un compteur ou des valeurs de sémaphore.

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    Décrémente de manière atomique une valeur stockée dans le moteur de cache.
    Idéal pour modifier un compteur ou des valeurs de sémaphore.

.. php:staticmethod:: add($key, $value, $config = 'default')

    Ajoute des données au cache, mais seulement si la clé n'existe pas déjà.
    Dans le cas où cette donnée existe, cette méthode va retourner false.
    Lorsque c'est possible, les données sont vérifiées et définies de façon
    atomique.

    .. versionadded:: 2.8
        La méthode add a été ajoutée dans 2.8.0.

.. php:staticmethod:: clear($check, $config = 'default')

    Détruit toutes les valeurs en cache pour une configuration de cache. Dans
    les moteurs comme Apc, Memcache et Wincache le préfixe de configuration de
    cache est utilisé pour enlever les entrées de cache.
    Assurez-vous que les différentes configurations de cache ont un préfixe
    différent.

.. php:method:: clearGroup($group, $config = 'default')

    :return: Boléen true en cas de succès.

    Supprime toutes les clés du cache appartenant au même groupe.

.. php:staticmethod:: gc($config)

    La Garbage (Poubelle) collecte les entrées dans la configuration du cache.
    Utilisée principalement par FileEngine. Elle doit être mise en œuvre par
    n'importe quel moteur de cache qui requiert des évictions manuelles de
    données de cache.

.. php:staticmethod:: groupConfigs($group = null)

    :return: Tableau de groupes et leurs noms de configuration liés.

    Récupère les noms de groupe pour configurer la correspondance.

.. php:staticmethod:: remember($key, $callable, $config = 'default')

    Fournit une manière facile pour faire la lecture à travers la mise en cache.
    Si la clé cache existe, elle sera retournée. Si la clé n'existe pas, la
    callable sera invoquée et les résultats stockés dans le cache au niveau de
    la clé fournie.

    Par exemple, vous voulez souvent mettre en cache les résultats de requête.
    Vous pouvez utiliser ``remember()`` pour faciliter ceci. En supposant
    que vous utilisez PHP5.3 ou supérieur::

        class Articles extends AppModel {
            function all() {
                $model = $this;
                return Cache::remember('all_articles', function() use ($model){
                    return $model->find('all');
                });
            }
        }

    .. versionadded:: 2.5
        remember() a été ajoutée dans 2.5.

.. meta::
    :title lang=fr: Mise en cache
    :keywords lang=fr: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
