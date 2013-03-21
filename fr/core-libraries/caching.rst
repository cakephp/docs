La mise en cache
################

La mise en cache est fréquemment utilisée pour réduire le temps pris pour
créer ou lire depuis une autre ressource. La mise en cache est souvent 
utilisée pour rendre la lecture de ressources consommatrices en temps en 
ressources moins consommatrices. Vous pouvez aisément stocker le résultats
de requêtes consommatrices en ressources, ou des accès a distance a des 
services web qui ne changent pas fréquemment dans un cache.Une fois dans 
un cache, re-lire les ressources stockées depuis le cache est moins  
consommateur en ressource qu'un accès a une ressource distante. 

Mettre en cache dans CakePHP est principalement facilité par la classe 
:php:class:`Cache`. Cette classe fournit un ensemble de méthodes
statiques qui fournissent une API uniforme pour le traitement des 
différentes implémentations de mise en cache. CakePHP arrive avec plusieurs
moteurs de cache intégrés, et fournit un système facile pour implémenter
votre propre système de mise en cache. Les moteurs de cache intégrés sont:

* ``FileCache`` File cache est un cache simple qui utilise des fichiers
  locaux. C'est le moteur de cache le plus lent, et ne fournit que peut
  de fonctionnalité pour les opérations atomiques. Cependant, le stockage
  sur disque est souvent peu consommateur en ressource, au stockage de 
  grands objets, ou des éléments qui sont rarement écrits fonctionnent
  bien dans les fichiers. C'est le moteur de Cache par défaut pour 2.3+.
* ``ApcCache`` Le cache APC utilise l'extension PHP `APC <http://php.net/apc>`_.
  Cette extension utilise la mémoire partagée du serveur Web pour stocker
  les objets. Cela le rend très rapide, et capable de fournir les 
  fonctionnalités atomiques en lecture/écriture.
  Par défaut CakePHP dans 2.0-2.2 utilisera ce moteur de cache si il est
  disponible.
* ``Wincache`` utilise l'extension `Wincache <http://php.net/wincache>`_.
  Wincache est similaire aux fonctionnalités APC au niveau des fonctionnalités
  et des performances, mais optimisé pour Windows et IIS.
* ``XcacheEngine``  Similaire à APC, `Xcache <http://xcache.lighttpd.net/>`_.
  est une extension PHP qui fournit des fonctionnalités similaires à APC.
* ``MemcacheEngine`` Utilise l'extension `Memcache <http://php.net/memcache>`_.
  Memcache fournit un cache très rapide qui peut être distribué au travers
  de nombreux serveurs, et fournit les opérations atomiques.

. versionchanged:: 2.3
    FileEngine est toujours le moteur de cache par défaut. Dans le passé, un 
    certain nombre de personnes avait des difficultés à configurer et déployer 
    APC correctement dans les deux cli + web. Utiliser les fichiers devrait
    faciliter la configuration de CakePHP pour les nouveaux développeurs.

Quelque soit le moteur de cache que vous choisirez d'utiliser, votre application
interagit avec :php:class:`Cache` de manière cohérente. Cela signifie que vous
pouvez aisément permuter les moteurs de cache en fonction de l'évolution de
votre application. En plus de la classe :php:class:`Cache`, le Helper
:doc:`/core-libraries/helpers/cache` vous permets la cache pleine page, qui
peut ainsi grandement améliorer les performances.

Configuration de la classe Cache
================================

La configuration de la classe Cache peut être effectuée n'importe où, mais
généralement vous voudrez configurer le cache dans ``app/Config/bootstrap.php``.
Vous pouvez configurer autant de configurations de cache dont vous avez
besoin, et utiliser tous les mélanges de moteurs de cache. CakePHP utilise
deux configurations de cache en interne, qui sont configurés dans
``app/Config/core.php``. Si vous utilisez APC ou Memcache vous devrez vous
assurer de définir des clefs uniques pour les caches du noyau. Ceci vous
évitera que de multiples applications viennent réécrire les données cache
de l'autre. 

L'utilisation de multiples configurations de cache peut aider à réduire 
le nombre de fois ou vous aurez à utiliser :php:func:`Cache::set()` .
Aussi bien que centraliser tout vos paramètres de cache. L'utilisation
de configurations multiples vous permets également de changer le stockage
comme vous l'entendez.

.. note::

    Vous devez spécifier quel moteur utiliser. Il ne met **pas** par défaut
    à `File`.

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
aurez deux configurations de cache additionnelles. Le nom de ces 
configurations 'short' ou 'long' est utilisé comme le paramètre ``$config``
pour :php:func:`Cache::write()` et  :php:func:`Cache::read()`.

.. note::

    Quand vous utilisez le moteur FileEngine vous pourriez avoir besoin de
    l'option ``mask`` pour vous assurer que les fichiers cachés sont
    créés avec les bonnes permissions.
    
Création d'un moteur de stockage pour le cache
==============================================

Vous pouvez fournir vos propre adaptateurs ``Cache`` dans ``app/Lib``
aussi bien que dans un plugin en utilisant  ``$plugin/Lib``.
Les moteurs de cache App/plugin peuvent aussi  remplacer les moteurs
du noyau. Les adaptateurs de cache doivent être dans un répertoire cache.
Si vous avez un moteur de cache nommé ``MonMoteurDeCachePerso`` il devra
être placé soit dans ``app/Lib/Cache/Engine/MonMoteurDeCachePerso.php``
comme une app/libs. Ou dans ``$plugin/Lib/Cache/Engine/MonMoteurDeCachePerso.php``
comme partie d'un plugin. Les configurations de cache provenant de plugin
doivent utiliser la notation par points de plugin.::

    Cache::config('custom', array(
        'engine' => 'PackCache.MonCachePerso',
        ...
    ));

.. note::

    Le cache App et plugin doit être configuré dans
    ``app/Config/bootstrap.php``. Si vous essayez de les configurer
    dans core.php il ne fonctionneront pas correctement.

Les moteurs de cache personnalisés doivent entendre 
:php:class:`CacheEngine` qui définit un nombre de méthodes d'abstraction
ainsi que quelques méthodes d'initialisation.    

L'API requise pour le moteur de cache est

.. php:class:: CacheEngine

    La classe de base pour tous les moteurs de cache utilisé avec le Cache.

.. php:method:: write($key, $value, $config = 'default')

    :retourne: un booléen en cas de succès.

    Écrit la valeur d'une clef dans le cache, la chaîne optionnel $config 
    spécifie le nom de la configuration à écrire.

.. php:method:: read($key)

    :retourne: La valeur cachée ou false en cas d'échec.

    Lit une clef depuis le cache. Retourne false pour indiquer
    que l'entrée à expirée ou n'existe pas.
    
.. php:method:: delete($key)

    :retourne: Un booléen true en cas de succès.

    Efface une clef depuis le cache. Retourne false pour indiquer que
    l'entrée n'existe pas ou ne peut être effacée.

.. php:method:: clear($check)

    :retourne: Un Booléen true en cas de succès.

    Efface toutes les clefs depuis le cache. Si $check est true, vous devez 
    valider que chacune des valeurs est actuellement expirée.

.. php:method:: decrement($key, $offset = 1)

    :retourne: Un booléen true en cas de succès.

    Décrémente un nombre dans la clef et retourne la valeur décrémentée
   
.. php:method:: increment($key, $offset = 1)

    :retourne: Un bouléen true en cas de succès.

    Incrémente un nombre dans la clef et retourne la valeur incrémentée
   
.. php:method:: gc()

    Non requit, mais utilisé pour faire du nettoyage quand les ressources 
    expires. Le moteur FileEngine utilise cela pour effacer les fichiers 
    qui contiennent des contenus expirés
 
Utilisation du Cache pour stocker le résultat des requêtes les plus courantes
=============================================================================

Vous pouvez considérablement améliorer les performances de vos applications
en plaçant les résultats qui ne changent que peu fréquemment, ou qui peuvent
être sujets à de nombreuses lectures dans le cache. Un exemple parfait de
ceci sont les résultats d'un find :php:meth:`Model::find()`.
Une méthode qui utilise Le Cache pour stocker les résultats pourrait ressembler à
cela ::

    <?php 
    class Post extends AppModel {
    
        public function newest() {
            $result = Cache::read('newest_posts', 'longterm');
            if (!$result) {
                $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
                Cache::write('newest_posts', $result, 'longterm');
            }
            return $result;
        }
    }

Vous pouvez améliorer le code ci-dessus en déplaçant la lecture du cache 
dans un comportement, qui lit depuis le cache, ou qui exécute les méthodes
de modèle. 
C'est un exercice que vous pouvez faire.

Utilisation du Cache pour stocker les compteurs
===============================================

L'utilisation de compteurs dans le cache peut être une chose intéressante. Par 
exemple un simple compte à rebours pour retenir les 'slots' restants d'un 
concours pourraient être stockés en Cache. La classe Cache propose des moyens 
atomiques pour incrémenter/décrémenter des valeurs de compteur facilement.
Les opérations atomiques sont importantes pour ces valeurs parce que ça réduit 
le risque de contention, et la capacité de deux utilisateurs à simultanément 
en abaisser la valeur et de résulter à une valeur incorrecte.

Après avoir définit une valeur entière vous pouvez la manipuler en utilisant
:php:meth:`Cache::increment()` and :php:meth:`Cache::decrement()`::

    Cache::write('compteur_initial', 10);

    // Plus tard sur 
    Cache::decrement('compteur_initial');

    //ou 
    Cache::increment('compteur_initial');

.. note::

    L'incrémentation et la décrémentation ne fonctionne pas avec le moteur 
    FileEngine. Vous devez utiliser APC ou Memcache en remplacement.

Utilisation des groupes
=======================

.. versionadded:: 2.2

Parfois vous voudrez marquer plusieurs entrées de cache comme appartenant à 
un même groupe ou un namespace. C'est une exigence courante pour invalider 
des grosses quantités de clés alors que quelques changements d'informations 
sont partagés pour toutes les entrées dans un même groupe. Cela est possible 
en déclarant les groupes dans la configuration deu cache::

    Cache::config('site_home', array(
        'engine' => 'Redis',
        'duration' => '+999 days',
        'groups' => array('comment', 'post')
    ));

Disons que vous voulez stocker le HTML généré pour votre page d'accueil 
dans le cache, mais voulez aussi invalider automatiquement ce cache à chaque 
fois qu'un commentaire ou un post est ajouté à votre base de données.
En ajoutant les groupes ``comment`` et ``post``, nous avons effectivement 
taggés les clés stockées dans la configuration du cache avec les noms des 
deux groupes.

Par exemple, dès qu'un post est ajouté, nous pouvons dire au moteur de 
Cache de retirer toutes les entrées associées au groupe ``post``::

    // Model/Post.php

    public function afterSave($created) {
        if ($created) {
            Cache::clearGroup('post', 'site_home');
        }
    }

Les groupes son partagés à travers toutes les configs de cache en utilisant 
le même moteur et le même préfixe. Si vous utilisez les groupes et voulez tirer 
profit de la suppression de groupe, choisissez un préfixe commun pour toutes 
vos configs.

l'API Cache
===========

.. php:class:: Cache

    La classe Cache dans CakePHP fournit un frontend générique pour
    plusieurs systèmes de cache backend. Différentes configurations
    de Cache et de moteurs peuvent être configurés dans votre
    app/Config/core.php

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` est utilisé pour créer des configurations 
    de cache supplémentaire. Ces configurations supplémentaires
    peuvent avoir différentes durées, moteurs, chemins, ou préfixes
    que la configuration par défaut du cache.

.. php:staticmethod:: read($key, $config = 'default')

    Cache::read() est utilisé pour lire la valeur en cache stockée
    dans ``$key`` depuis le ``$config``. Si $config est null la
    configuration par défaut sera utilisée. ``Cache::read()`` retournera
    la valeur en cache si c'est un cache valide ou ``false`` si le
    cache a expiré ou n'existe pas. Le contenu du cache pourrait
    évaluer false, donc soyez sure que vous utilisez l'opérateur
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

    Cache::write() Ecrira $value dans le cache. Vous pouvez lire ou 
    effacer cette valeur plus tard en vous y référant avec ``$key``..
    Vous pouvez spécifier une configuration optionnelle pour stocker
    le cache. Si il n'y a pas de ``$config`` de spécifié c'est la
    configuration par défaut qui sera appliquée. Cache::write()
    peut stocker n'importe quel type d'objet est est idéal pour
    stocker les résultats des finds de vos modèles.::

   
            if (($posts = Cache::read('posts')) === false) {
                $posts = $this->Post->find('all');
                Cache::write('posts', $posts);
            }

   Utiliser ``Cache::write()`` et ``Cache::read()`` pour aisément réduire 
   le nombre de déplacement fait dans la base de donnée pour rechercher 
   les posts.

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` vous permets d'enlever complètement un objet en cache
    du lieu de stockage.
    
.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` vous permets de réécrire temporairement les paramètres 
    de configs pour une opération (habituellement une lecture ou écriture). 
    Si vous utilisez ``Cache::set()`` pour changer les paramètres pour une
    écriture, vous devez aussi utiliser ``Cache::set()`` avant de lire les 
    données en retour. Si vous ne faites pas cela, les paramètres par défauts 
    seront utilisés quand la clef de cache est lu.::
   
        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);
    
        // plus tard
    
        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    Si vous trouvez que vous répétez l'appel à ``Cache::set()`` peut être
    devriez-vous créer une nouvelle  :php:func:`Cache::config()`. Qui 
    enlèvera les besoins d'appeler ``Cache::set()``.

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    Incrémente de manière atomique une valeur stockée dans le moteur de cache.
    Idéal pour modifier un compteur ou des valeurs de sémaphore.
   
.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    Décrémente de manière atomique une valeur stockée dans le moteur de cache.
    Idéal pour modifier un compteur ou des valeurs de sémaphore.

.. php:staticmethod:: clear($check, $config = 'default')

    Détruit toutes les valeurs en cache pour une configuration de cache. Dans 
    les moteurs comme Apc, Memcache et Wincache le préfixe de configuration de 
    cache est utilisé pour enlever les entrées de cache.
    Soyez sûre que différentes configuration de cache ont différent préfixe.

.. php:staticmethod:: gc($config)

    Entrée Garbage collects dans la configuration du cache . Utiliser 
    principalement par FileEngine. Il devrait être mis en œuvre par n'importe 
    quel moteur de cache qui requiert des évictions manuelle de donnée en cache.
    

.. meta::
    :title lang=fr: Mise en cache
    :keywords lang=fr: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
