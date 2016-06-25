La mise en cache
################

.. php:namespace::  Cake\Cache

.. php:class:: Cache

La mise en cache est fréquemment utilisée pour réduire le temps pris pour créer
ou lire depuis une autre ressource. La mise en cache est souvent utilisée pour
rendre la lecture de ressources consommatrices en temps, en ressources moins
consommatrice. Vous pouvez aisément stocker en cache les résultats de requêtes
consommatrices en ressources ou les accès à distance à des services web qui ne
changent pas fréquemment. Une fois mis en cache, re-lire les ressources
stockées depuis le cache est moins consommateur en ressource qu'un accès à une
ressource distante.

La mise en cache dans CakePHP se fait principalement par la classe
``Cache``. Cette classe fournit un ensemble de méthodes
statiques qui fournissent une API uniforme pour le traitement des
différentes implémentations de mise en cache. CakePHP dispose de plusieurs
moteurs de cache intégrés, et fournit un système facile pour implémenter
votre propre système de mise en cache. Les moteurs de cache intégrés sont:

* ``FileCache`` File cache est un cache simple qui utilise des fichiers
  locaux. C'est le moteur de cache le plus lent, et il ne fournit que peu
  de fonctionnalités pour les opérations atomiques. Cependant, le stockage
  sur disque est souvent peu consommateur en ressource, le stockage de
  grands objets ou des éléments qui sont rarement écrits fonctionne
  bien dans les fichiers.
* ``ApcCache`` Le cache APC utilise l'extension PHP
  `APCu <http://php.net/apcu>`_. Cette extension utilise la mémoire partagée du
  serveur Web pour stocker les objets. Cela le rend très rapide, et capable de
  fournir les fonctionnalités atomiques en lecture/écriture.
* ``Wincache`` Utilise l'extension `Wincache <http://php.net/wincache>`_.
  Wincache offre des fonctionnalités et des performances semblables à APC, mais
  optimisées pour Windows et IIS.
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_.
  est une extension PHP qui fournit des fonctionnalités similaires à APC.
* ``MemcachedEngine`` Utilise l'extension
  `Memcached <http://php.net/memcached>`_.
* ``RedisEngine`` Utilise l'extension
  `phpredis <https://github.com/nicolasff/phpredis>`_. Redis fournit un système
  de cache cohérent et rapide similaire à Memcached et il permet aussi les
  opérations atomiques.

Quelque soit le moteur de cache que vous choisirez d'utiliser, votre
application interagit avec :php:class:`Cake\\Cache\\Cache` de manière cohérente.
Cela signifie que vous pouvez aisément permuter les moteurs de cache en fonction
de l'évolution de votre application.

.. _cache-configuration:

Configuration de la classe Cache
================================

.. php:staticmethod:: config($key, $config = null)

La configuration de la classe Cache peut être effectuée n'importe où, mais
généralement vous voudrez configurer le cache pendant la phase de bootstrap.
le fichier **config/app.php** est le lieu approprié pour cette configuration.
Vous pouvez configurer autant de configurations de cache dont vous avez besoin,
et vous pouvez utiliser tous les mélanges de
moteurs de cache. CakePHP utilise deux configurations de cache en interne.
``_cake_core_`` est utilisé pour stocker des correspondances de fichiers,
et les résultats parsés des fichiers de
:doc:`traduction </core-libraries/internationalization-and-localization>` .
``_cake_model_`` est utilisé pour stocker les schémas des models de vos
applications. Si vous utilisez APC ou Memcached
vous devrez vous assurer de définir des clés uniques pour les caches du noyau.
Ceci vous évitera qu'une application vienne réécrire les données cache d'une
autre application.

L'utilisation de plusieurs configurations vous permet également de changer le
stockage comme vous l'entendez. Par exemple vous pouvez mettre ceci dans votre
**config/app.php**::

    // ...
    'Cache' => [
        'short' => [
            'className' => 'File',
            'duration' => '+1 hours',
            'path' => CACHE,
            'prefix' => 'cake_short_'
        ],
        // Utilisation d'un espace de nom complet.
        'long' => [
            'className' => 'Cake\Cache\Engine\FileEngine',
            'duration' => '+1 week',
            'probability' => 100,
            'path' => CACHE . 'long' . DS,
        ]
    ]
    // ...

Les options de configuration peuvent également être fournies en tant que chaine
:term:`DSN`. C'est utile lorsque vous travaillez avec des variables
d'environnement ou des fournisseurs :term:`PaaS`::

    Cache::config('short', [
        'url' => 'memcached://user:password@cache-host/?timeout=3600&prefix=myapp_',
    ]);

Lorsque vous utilisez une chaine DSN, vous pouvez définir des paramètres/options
supplémentaires en tant qu'arguments de query string.

Vous pouvez également configurer les moteurs de cache pendant l'exécution::

    // Utilisation d'un nom court
    Cache::config('short', [
        'className' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ]);

    // Utilisation d'un espace de nom complet.
    Cache::config('long', [
        'className' => 'Cake\Cache\Engine\FileEngine',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ]);

    // utilisation d'un objet.
    $object = new FileEngine($config);
    Cache::config('other', $object);

.. note::

    Vous devez spécifier le moteur à utiliser. Il ne met **pas** File par
    défaut.

En insérant le code ci-dessus dans votre **config/app.php** vous
aurez deux configurations de cache supplémentaires. Le nom de ces
configurations 'short' ou 'long' est utilisé comme paramètre ``$config``
pour :php:meth:`Cake\\Cache\\Cache::write()` et
:php:meth:`Cake\\Cache\\Cache::read()`. Lors de la configuration des moteurs
de cache, vous pouvez vous référer au nom de la classe en utilisant les
syntaxes suivantes:

* Un nom raccourci sans 'Engine' ou namespace (espace de nom).  Il déduira que
  que vous voulez utiliser ``Cake\Cache\Engine`` ou ``App\Cache\Engine``.
* Utiliser la :term:`syntaxe de plugin` qui permet de charger des moteurs
  depuis un plugin spécifique.
* Utiliser un nom de classe complet incluant le namespace. Cela vous permet
  d'utiliser des classes situées en dehors des emplacements classiques.
* Utiliser un objet qui étend la classe ``CacheEngine``

.. note::

    Lorsque vous utilisez le FileEngine vous pourriez avoir besoin d'utiliser
    l'option ``mask`` pour assurer que les fichiers de cache sont créés avec
    les autorisations nécessaires.

Suppression de Configuration de Cache
-------------------------------------

.. php:staticmethod:: drop($key)

Une fois la configuration créée, vous ne pouvez pas la changer. Au lieu de
cela, vous devriez supprimer la configuration et la re-créer à l'aide de
:php:meth:`Cake\\Cache\\Cache::drop()` et
:php:meth:`Cake\\Cache\\Cache::config()`.
Supprimer un moteur de cache va supprimer la configuration et détruire
l'adaptateur s'il a été construit.

Ecrire dans un Cache
====================

.. php:staticmethod:: write($key, $value, $config = 'default')

``Cache::write()`` stocke $value dans le Cache. Vous pouvez lire ou supprimer
cette valeur plus tard en vous y reférant via ``$key``. Vous pouvez spécifier
une configuration optionnelle pour y stocker le cache.
Si aucune ``$config`` n'est spécifiée, la configuration par défaut sera
utilisée. ``Cache::write()`` peut stocker tout type d'objet et est idéale pour
stocker les résultats des 'finds' de vos models::

    if (($posts = Cache::read('posts')) === false) {
        $posts = $unService->getAllPosts();
        Cache::write('posts', $posts);
    }

Utiliser ``Cache::write()`` et ``Cache::read()`` réduira le nombre
d'allers-retours effectués vers la base de données pour récupérer les messages.

.. note::

    Si vous prévoyez de mettre en cache le résultat de requêtes faites avec
    l'ORM de CakePHP, il est préférable d'utiliser les fonctionnalités de cache
    intégrées dans l'objet Query, telles que décrites dans la section
    :ref:`mettre les résultats de requête en cache <caching-query-results>`

Ecrire Plusieurs Clés d'un Coup
-------------------------------

.. php:staticmethod:: writeMany($data, $config = 'default')

Vous pouvez avoir besoin d'écrire plusieurs clés du cache à la fois. Bien que
vous pouvez utiliser plusieurs appels à ``write()``, ``writeMany()`` permet
à CakePHP l'utilisation d'une API de stockage plus efficace quand cela est
possible. Par exemple utiliser ``writeMany()`` permet de gagner de nombreuses
connections réseau lors de l'utilisation de Memcached::

    $result = Cache::writeMany([
        'article-' . $slug => $article,
        'article-' . $slug . '-comments' => $comments
    ]);

    // $result va contenir
    ['article-first-post' => true, 'article-first-post-comments' => true]

Lire un Cache Distribué
------------------------

.. php:staticmethod:: remember($key, $callable, $config = 'default')

Cache facilite la lecture d'un cache distribué. Si la clé de cache demandée
existe, elle sera retournée. Si la clé n'existe pas, le callable sera invoqué
et les résultats stockés dans le cache pour la clé fournie.

Par exemple, vous souhaitez souvent mettre en cache les résultats du appel à un
service distant. Vous pouvez utiliser ``remember()`` pour faciliter cela::

    class IssueService
    {

        function allIssues($repo)
        {
            return Cache::remember($repo . '-issues', function () use ($repo) {
                return $this->fetchAll($repo);
            });
        }

    }


Lire depuis un Cache
====================

.. php:staticmethod:: read($key, $config = 'default')

``Cache::read()``  est utilisée pour lire la valeur mise en cache stockée dans
``$key`` dans la ``$config``. Si ``$config`` est null la configuration par
défaut sera utilisée. ``Cache::read()`` renverra la valeur mise en cache si le
cache est valide ou ``false`` si le cache a expiré ou n'existe pas. Le contenu
du cache peut être mal évalué, donc assurez vous d'utiliser les opérateurs de
comparaison stricts: `===`` ou ``!==``.

Par exemple::

    $cloud = Cache::read('cloud');

    if ($cloud !== false) {
        return $cloud;
    }

    // Genère des données cloud
    // ...

    // Stocke les données en cache
    Cache::write('cloud', $cloud);
    return $cloud;

Lire Plusieurs Clés d'un Coup
-----------------------------

.. php:staticmethod:: readMany($keys, $config = 'default')

Après avoir écrit plusieurs clés d'un coup, vous voudrez probablement les lire
également. Bien que vous pouvez utiliser plusieurs appels à ``read()``,
``readMany()``permet à CakePHP l'utilisation d'une API de stockage plus
efficace quand cela est possible. Par exemple utiliser ``readMany()``
permet de gagner de nombreuses connections réseau lors de l'utilisation de
Memcached::

    $result = Cache::readMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result contiendra
    ['article-first-post' => '...', 'article-first-post-comments' => '...']


Suppression d'un Cache
======================

.. php:staticmethod:: delete($key, $config = 'default')

``Cache::delete()`` vous permettra de supprimer complètement un objet mis en
cache du stockage::

    // Supprime la clé
    Cache::delete('my_key');

Supprimer Plusieurs Clés d'un Coup
----------------------------------

.. php:staticmethod:: deleteMany($keys, $config = 'default')

Après avoir écrit plusieurs clés d'un coup, vous voudrez probablement les
supprimer également. Bien que vous pouvez utiliser plusieurs appels à
``delete()``, ``deleteMany()`` permet à CakePHP l'utilisation d'une API de
stockage plus efficace quand cela est possible. Par exemple utiliser
``deleteMany()`` permet de gagner de nombreuses connections réseau lors de
l'utilisation de Memcached::

    $result = Cache::deleteMany([
        'article-' . $slug,
        'article-' . $slug . '-comments'
    ]);
    // $result contiendra
    ['article-first-post' => true, 'article-first-post-comments' => true]


Effacer les Données du Cache
============================

.. php:staticmethod:: clear($check, $config = 'default')

Détruit toute les valeurs pour une configuration de cache. Pour les moteurs
tels que APC, Memcached et Wincache, le préfixe de la configuration du cache
est utilisé pour supprimer les données de cache. Assurez-vous que les
différentes configurations de cache ont des préfixes différents::

    // Détruira uniquement les clés expirées.
    Cache::clear(true);

    // Détruira toutes les clés.
    Cache::clear(false);


.. php:staticmethod:: gc($config)

Garbage collects entries in the cache configuration. C'est principalement
utilisé par FileEngine. Elle ne devra être implémentée par tout moteur
de Cache qui a besoin d'une suppresion manuelle des données mises en cache.

.. note::

    Comme APC et Wincache utilisent des caches isolés pour le serveur web et le
    CLI, ils doivent être supprimés séparément (CLI ne peut pas nettoyer le
    serveur web et vice et versa).

Utiliser le Cache pour Stocker les Compteurs
============================================

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

Les compteurs de votre application sont de bons candidats pour le stockage dans
un cache. Par exemple, un simple compte à rebours pour des places restantes dans
un concours peut être stocké dans le cache. La classe Cache expose des
opérations atomiques pour incrémenter/décrémenter les valeurs du compteur de
manière simple. Les opérations atomiques sont importantes pour ces valeurs, car
elle réduisent le risque de contention, et la capacité pour deux utilisateurs
d'abaisser simultanément la valeur, ce qui entraînerait une valeur incorrecte.

Après avoir défini une valeur entière, vous pouvez la manipuler à l'aide des
fonctions ``increment()`` et ``decrement()``::

    Cache::write('initial_count', 10);

    // Plus tard
    Cache::decrement('initial_count');

    // Ou
    Cache::increment('initial_count');

.. note::

    L'incrémentation et la décrementation ne fonctionne pas avec FileEngine.
    A la place, vous devez utiliser APC, Wincache, Redis ou Memcached.

Utiliser le Cache pour Stocker les Résultats de Requêtes Courantes
==================================================================

Vous pouvez considérablement améliorer les performances de votre application en
mettant dans le cache les résultats qui changent rarement, ou qui sont soumis à
de nombreuses lectures.
Un exemple parfait serait les résultats de
:php:meth:`Cake\\ORM\\Table::find()`. l'objet Query vous permet de mettre les
résultats en cache en utilisant la méthode ``cache``. Voir la section
:ref:`mettre les résultats de requête en cache <caching-query-results>` pour
plus d'information.

Utilisation des Groupes
=======================

Parfois vous voudrez marquer plusieurs entrées de cache comme appartenant à
un même groupe ou un namespace. C'est une exigence courante pour invalider
de sgrosses quantités de clés alors que quelques changements d'informations
sont partagés pour toutes les entrées dans un même groupe. Cela est possible
en déclarant les groupes dans la configuration de cache::

    Cache::config('site_home', [
        'className' => 'Redis',
        'duration' => '+999 days',
        'groups' => ['comment', 'article']
    ]);

.. php:method:: clearGroup($group, $config = 'default')

Disons que vous voulez stocker le HTML généré pour votre page d'accueil
dans le cache, mais vous voulez aussi invalider automatiquement ce cache à
chaque fois qu'un commentaire ou un post est ajouté à votre base de données.
En ajoutant les groupes ``comment`` et ``article``, nous avons effectivement
taggé les clés stockées dans la configuration du cache avec les noms des
deux groupes.

Par exemple, dès qu'un post est ajouté, nous pouvons dire au moteur de
Cache de retirer toutes les entrées associées au groupe ``article``::

    // src/Model/Table/ArticlesTable.php
    public function afterSave($entity, $options = [])
    {
        if ($entity->isNew()) {
            Cache::clearGroup('article', 'site_home');
        }
    }

.. php:staticmethod:: groupConfigs($group = null)

``groupConfigs()`` peut être utilisée pour récupérer la correspondance
entre des groupes et des configurations, par exemple ayant le même groupe::

    // src/Model/Table/ArticlesTable.php

    /**
     * Une variante de l'exemple précédent qui efface toutes les configurations
     * ayant le même groupe
     */
    public function afterSave($entity, $options = [])
    {
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

Activer ou Désactiver Globalement le Cache
==========================================

.. php:staticmethod:: disable()

Vous pourriez avoir besoin de désactiver toutes les lectures/écritures du Cache
en essayant de comprendre des problèmes liés à l'expiration du cache. Vous
pouvez le faire en utilisant ``enable()`` et ``disable()``::

    // Désactive toutes les lectures/écritures
    Cache::disable();

Une fois désactivé, toutes lecture/écriture renverra ``null``.

.. php:staticmethod:: enable()

Une fois désactivé, utilisez ``enable()`` pour réactiver le cache::

    // Active de nouveau toutes les lectures/écritures
    Cache::enable();

.. php:staticmethod:: enabled()

Si vous voulez vérifier l'état du Cache, utilisez ``enabled()``.

Création d'un moteur de stockage pour le Cache
==============================================

Vous pouvez fournir vos propre adaptateurs ``Cache`` dans ``App\Cache\Engine``
ou dans un plugin en utilisant ``$plugin\Cache\Engine``.
Les moteurs de cache src/plugin peuvent aussi remplacer les moteurs
du cœur. Les adaptateurs de cache doivent être dans un répertoire cache.
Si vous avez un moteur de cache nommé ``MyCustomCacheEngine`` il devra
être placé soit dans **src/Cache/Engine/MyCustomCacheEngine.php**
comme une app/libs ou dans
**plugin/Cache/Engine/MyCustomCacheEngine.php** faisant parti d'un
plugin. Les configurations de cache venant d'un plugin doivent utiliser la
notation par points de plugin::

    Cache::config('custom', [
        'engine' => 'CachePack.MyCustomCache',
        // ...
    ]);

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

    :retourne: La valeur mise en cache ou ``false`` en cas d'échec.

    Lit une clé depuis le cache. Retourne ``false`` pour indiquer
    que l'entrée a expiré ou n'existe pas.

.. php:method:: delete($key)

    :retourne: Un booléen ``true`` en cas de succès.

    Efface une clé depuis le cache. Retourne ``false`` pour indiquer que
    l'entrée n'existe pas ou ne peut être effacée.

.. php:method:: clear($check)

    :retourne: Un booléen ``true`` en cas de succès.

    Efface toutes les clés depuis le cache. Si $check est à ``true``, vous devez
    valider que chacune des valeurs a réellement expirée.

.. php:method:: clearGroup($group)

    :return: Un booléen ``true`` en cas de succès.

    Supprime toutes les clés à partir du cache appartenant au même groupe.

.. php:method:: decrement($key, $offset = 1)

    :retourne: Un booléen ``true`` en cas de succès.

    Décrémente un nombre dans la clé et retourne la valeur décrémentée

.. php:method:: increment($key, $offset = 1)

    :retourne: Un booléen ``true`` en cas de succès.

    Incrémente un nombre dans la clé et retourne la valeur incrémentée

.. php:staticmethod:: gc()

    Non requise, mais utilisée pour faire du nettoyage quand les ressources
    expirent. Le moteur FileEngine utilise cela pour effacer les fichiers
    qui contiennent des contenus expirés.

.. meta::
    :title lang=fr: Mise en cache
    :keywords lang=fr: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
