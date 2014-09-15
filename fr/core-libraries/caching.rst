La mise en cache
################

.. php:namespace::  Cake\Cache

.. php:class:: Cache

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
  `APC <http://php.net/apc>`_. Cette extension utilise la mémoire partagée du
  serveur Web pour stocker les objets. Cela le rend très rapide, et capable de
  fournir les fonctionnalités atomiques en lecture/écriture.
  Par défaut CakePHP dans 2.0-2.2 utilisera ce moteur de cache si il est
  disponible.
* ``Wincache`` Utilise l'extension `Wincache <http://php.net/wincache>`_.
  Wincache a des fonctionnalités et des performances semblables à APC, mais
  optimisé pour Windows et IIS.
* ``XcacheEngine`` Similaire à APC, `Xcache <http://xcache.lighttpd.net/>`_.
  est une extension PHP qui fournit des fonctionnalités similaires à APC.
* ``MemcacheEngine`` Utilise l'extension `Memcache <http://php.net/memcache>`_.
  Memcache fournit un cache très rapide qui peut être distribué au travers
  de nombreux serveurs et il permet les opérations atomiques.
* ``MemcachedEngine`` Utilise l'extension
  `Memcached <http://php.net/memcached>`_. Il est aussi une interface avec
  memcache mais il fournit une meilleur performance.
* ``RedisEngine`` Utilise l'extension
  `phpredis <https://github.com/nicolasff/phpredis>`_. Redis fournit un système
  de cache cohérent et rapide similaire à memcached et il permet aussi les
  opérations atomiques.

Quelque soit le moteur de cache que vous choisirez d'utiliser, votre
application interagit avec :php:class:`Cake\\Cache\\Cache` de manière cohérente.
Cela signifie que vous pouvez aisément permuter les moteurs de cache en fonction de
l'évolution de votre application.

.. _cache-configuration:

Configuration de la classe Cache
================================

.. php:staticmethod:: config($key, $config = null)

La configuration de la classe Cache peut être effectuée n'importe où, mais
généralement vous voudrez configurer le cache dans
``config/bootstrap.php``. Vous pouvez configurer autant de configurations
de cache dont vous avez besoin, et vous pouvez utiliser tous les mélanges de
moteurs de cache. CakePHP utilise deux configurations de cache en interne, qui
sont configurés dans ``config/core.php``. Si vous utilisez APC ou Memcache
vous devrez vous assurer de définir des clés uniques pour les caches du noyau.
Ceci vous évitera qu'une application vienne réécrire les données cache d'une
autre application.

L'utilisation de plusieurs configurations de cache peut aider à réduire
le nombre de fois où vous aurez à utiliser :php:func:`Cache::set()` et
permettra aussi de centraliser tous vos paramètres de cache. L'utilisation
de plusieurs configurations vous permet également de changer le stockage
comme vous l'entendez. Exemple::

    // Using a short name
    Cache::config('short', array(
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ));

    // Using a fully namespaced name.
    Cache::config('long', array(
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ));

    // Using a constructed object.
    $object = new FileEngine($config);
    Cache::config('other', $object);

.. note::

    Vous devez spécifier le moteur à utiliser. Il ne met **pas** File par
    défaut.

En insérant le code ci-dessus dans votre ``config/app.php`` vous
aurez deux configurations de cache supplémentaires. Le nom de ces
configurations 'short' ou 'long' est utilisé comme paramètre ``$config``
pour :php:meth:`Cake\\Cache\\Cache::write()` et
:php:meth:`Cake\\Cache\\Cache::read()`. When configuring Cache engines you can
refer to the class name using the following syntaxes:

* Short classname without 'Engine' or a namespace.  This will infer that you
  want to use a Cache engine in ``Cake\Cache\Engine`` or ``App\Cache\Engine``.
* Using :term:`syntaxe de plugin` which allows you to load engines from a specific
  plugin.
* Using a fully qualified namespaced classname.  This allows you to use
  classes located outside of the conventional locations.
* Using an object that extends the ``CacheEngine`` class.

Removing Configured Cache Engines
---------------------------------

.. php:staticmethod:: drop($key)

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using :php:meth:`Cake\\Cache\\Cache::drop()` and
:php:meth:`Cake\\Cache\\Cache::config()`. Dropping a cache engine will remove
the config and destroy the adapter if it was constructed.

Other Cache Related Configuration
---------------------------------

Other than configuring caching adapters, there are a few other cache related
configuration properties:

enabled
    When set to ``true``, persistent caching is disabled site-wide.
    This will make all read/writes to :php:class:`Cake\\Cache\\Cache` fail.
    You can control this value with :php:meth:`Cake\\Cache\\Cache::enable()` and
    :php:meth:`Cake\\Cache\\Cache::disable()`. The current state can be read with
    :php:meth:`Cake\\Cache\\Cache::enabled()`.

.. note::

    When using the FileEngine you might need to use the ``mask`` option to
    ensure cache files are made with the correct permissions.

Writing to a Cache
==================

.. php:staticmethod:: write($key, $value, $config = 'default')

``Cache::write()`` will write a $value to the Cache. You can read or
delete this value later by referring to it by ``$key``. You may
specify an optional configuration to store the cache in as well. If
no ``$config`` is specified, default will be used. ``Cache::write()``
can store any type of object and is ideal for storing results of
model finds::

    if (($posts = Cache::read('posts')) === false) {
        $posts = $unService->getAllPosts();
        Cache::write('posts', $posts);
    }

Using ``Cache::write()`` and ``Cache::read()`` to easily reduce the number
of trips made to the database to fetch posts.

.. note::

    If you plan to cache the result of queries made with the CakePHP ORM,
    it is better to use the built-in cache capabilities of the Query object
    as described in the :ref:`caching-query-results` section

Writing Multiple Keys at Once
-----------------------------

.. php:staticmethod:: writeMany($data, $config = 'default')

You may find yourself needing to write multiple cache keys at once. While you
can use multiple calls to ``write()``, ``writeMany()`` allows CakePHP to use
more efficient storage API's where available. For example using ``writeMany()``
save multiple network connections when using Memcached::

    $result = Cache::writeMany([
        'article-' . $slug => $article,
        'article-' . $slug . '-comments' => $comments
    ]);

    // $result will contain
    ['article-first-post' => true, 'article-first-post-comments' => true]

Read Through Caching
--------------------

.. php:staticmethod:: remember($key, $callable, $config = 'default')

Cache makes it easy to do read-through caching. If the named cache key exists,
it will be returned. If the key does not exist, the callable will be invoked
and the results stored in the cache at the provided key.

For example, you often want to cache remote service call results. You could use
``remember()`` to make this simple::

    class IssueService  {

        function allIssues($repo) {
            return Cache::remember($repo . '-issues', function() use ($repo) {
                return $this->fetchAll($repo);
            });
        }

    }


Reading From a Cache
====================

.. php:staticmethod:: read($key, $config = 'default')

``Cache::read()`` is used to read the cached value stored under
``$key`` from the ``$config``. If $config is null the default
config will be used. ``Cache::read()`` will return the cached value
if it is a valid cache or ``false`` if the cache has expired or
doesn't exist. The contents of the cache might evaluate false, so
make sure you use the strict comparison operators: ``===`` or
``!==``.

For example::

    $cloud = Cache::read('cloud');

    if ($cloud !== false) {
        return $cloud;
    }

    // Generate cloud data
    // ...

    // Store data in cache
    Cache::write('cloud', $cloud);
    return $cloud;

Reading Multiple Keys at Once
-----------------------------

.. php:staticmethod:: readMany($keys, $config = 'default')

After you've written multiple keys at once, you'll probably want to read them as
well. While you could use multiple calls to ``read()``, ``readMany()`` allows
CakePHP to use more efficient storage API's where available. For example using
``readMany()`` save multiple network connections when using Memcached::

    $result = Cache::readMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result will contain
    ['article-first-post' => '...', 'article-first-post-comments' => '...']


Deleting From a Cache
=====================

.. php:staticmethod:: delete($key, $config = 'default')

``Cache::delete()`` will allow you to completely remove a cached
object from the store::

    // Remove a key
    Cache::delete('my_key');

Deleting Multiple Keys at Once
------------------------------

.. php:staticmethod:: deleteMany($keys, $config = 'default')

After you've written multiple keys at once, you may want to delete them.  While
you could use multiple calls to ``delete()``, ``deleteMany()`` allows CakePHP to use
more efficient storage API's where available. For example using ``deleteMany()``
save multiple network connections when using Memcached::

    $result = Cache::deleteMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result will contain
    ['article-first-post' => true, 'article-first-post-comments' => true]


Clearing Cached Data
====================

.. php:staticmethod:: clear($check, $config = 'default')

Destroy all cached values for a cache configuration. In engines like Apc,
Memcached and Wincache, the cache configuration's prefix is used to remove
cache entries. Make sure that different cache configurations have different
prefixes::

    // Will only clear expired keys.
    Cache::clear(true);

    // Will clear all keys.
    Cache::clear(false);


.. php:staticmethod:: gc($config)

Garbage collects entries in the cache configuration. This is primarily
used by FileEngine. It should be implemented by any Cache engine
that requires manual eviction of cached data.

Using Cache to Store Counters
=============================

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

Counters for various things are easily stored in a cache. For example, a simple
countdown for remaining 'slots' in a contest could be stored in Cache. The
Cache class exposes atomic ways to increment/decrement counter values in an easy
way. Atomic operations are important for these values as it reduces the risk of
contention, and ability for two users to simultaneously lower the value by one,
resulting in an incorrect value.

After setting an integer value you can manipulate it using ``increment()`` and
``decrement()``::

    Cache::write('initial_count', 10);

    // Later on
    Cache::decrement('initial_count');

    // Or
    Cache::increment('initial_count');

.. note::

    Incrementing and decrementing do not work with FileEngine. You should use
    APC, Wincache, Redis or Memcached instead.


Using Cache to Store Common Query Results
=========================================

You can greatly improve the performance of your application by putting results
that infrequently change, or that are subject to heavy reads into the cache.
A perfect example of this are the results from
:php:meth:`Cake\\ORM\\Table::find()`. The Query object allows you to cache
results using the ``cache`` method. See the :ref:`caching-query-results` section
for more information.

Utilisation des Groupes
=======================

Parfois vous voudrez marquer plusieurs entrées de cache comme appartenant à
un même groupe ou un namespace. C'est une exigence courante pour invalider
des grosses quantités de clés alors que quelques changements d'informations
sont partagés pour toutes les entrées dans un même groupe. Cela est possible
en déclarant les groupes dans la configuration de cache::

    Cache::config('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article']
    ]);

Disons que vous voulez stocker le HTML généré pour votre page d'accueil
dans le cache, mais vous voulez aussi invalider automatiquement ce cache à
chaque fois qu'un commentaire ou un post est ajouté à votre base de données.
En ajoutant les groupes ``comment`` et ``article``, nous avons effectivement
taggés les clés stockées dans la configuration du cache avec les noms des
deux groupes.

Par exemple, dès qu'un post est ajouté, nous pouvons dire au moteur de
Cache de retirer toutes les entrées associées au groupe ``article``::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($entity, $options = []) {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` can be used to retrieve mapping between group and
configurations, i.e.: having the same group::

    // src/Model/Table/ArticlesTable.php

    /**
     * A variation of previous example that clears all Cache configurations
     * having the same group
     */
    public function afterSave($entity, $options = []) {
        if ($entity->isNew()) {
            $configs = Cache::groupConfigs('article');
            foreach ($configs['article'] as $config) {
                Cache::clearGroup('article', $config);
            }
        }
    }

Les groupes sont partagés à travers toutes les configs de cache en utilisant
le même moteur et le même préfixe. Si vous utilisez les groupes et voulez tirer
profit de la suppression de groupe, choisissez un préfixe commun pour toutes
vos configs.

Globally Enable or Disable Cache
================================

.. php:staticmethod:: disable()

You may need to disable all Cache read & writes when trying to figure out cache
expiration related issues. You can do this using ``enable()`` and
``disable()``::

    // Disable all cache reads, and cache writes.
    Cache::disable();

Once disabled, all reads and writes will return ``null``.

.. php:staticmethod:: enable()

Once disabled, you can use ``enable()`` to re-enable caching::

    // Re-enable all cache reads, and cache writes.
    Cache::enable();

.. php:staticmethod:: enabled()

If you need to check on the state of Cache, you can use ``enabled()``.

Création d'un moteur de stockage pour le Cache
==============================================

Vous pouvez fournir vos propre adaptateurs ``Cache`` dans ``App\Cache\Engine``
ou dans un plugin en utilisant ``$plugin\Cache\Engine``.
Les moteurs de cache src/plugin peuvent aussi remplacer les moteurs
du coeur. Les adaptateurs de cache doivent être dans un répertoire cache.
Si vous avez un moteur de cache nommé ``MyCustomCacheEngine`` il devra
être placé soit dans ``src/Cache/Engine/MyCustomCacheEngine.php``
comme une app/libs ou dans
``$plugin/Cache/Engine/MyCustomCacheEngine.php`` faisant parti d'un
plugin. Les configurations de cache venant d'un plugin doivent utiliser la
notation par points de plugin.::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        // ...
    ));

Les moteurs de cache personnalisés doivent étendre
:php:class:`Cake\\Cache\\CacheEngine` qui définit un certain nombre de méthodes
d'abstraction ainsi que quelques méthodes d'initialisation.

L'API requise pour CacheEngine est

.. php:class:: CacheEngine

    La classe de base pour tous les moteurs de cache utilisée avec le Cache.

.. php:method:: write($key, $value, $config = 'default')

    :retourne: un booléen en cas de succès.

    Écrit la valeur d'une clé dans le cache, la chaîne optionnelle $config
    spécifie le nom de la configuration à écrire.

.. php:method:: read($key)

    :retourne: La valeur mise en cache ou false en cas d'échec.

    Lit une clé depuis le cache. Retourne false pour indiquer
    que l'entrée a expiré ou n'existe pas.

.. php:method:: delete($key)

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

    :retourne: Un boléen true en cas de succès.

    Décrémente un nombre dans la clé et retourne la valeur décrémentée

.. php:method:: increment($key, $offset = 1)

    :retourne: Un boléen true en cas de succès.

    Incrémente un nombre dans la clé et retourne la valeur incrémentée

.. php:staticmethod:: gc()

    Non requise, mais utilisée pour faire du nettoyage quand les ressources
    expirent. Le moteur FileEngine utilise cela pour effacer les fichiers
    qui contiennent des contenus expirés.


.. meta::
    :title lang=fr: Mise en cache
    :keywords lang=fr: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
