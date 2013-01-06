Cache
#####

La classe Cache de CakePHP fournit une interface générique pour divers
systèmes de cache en arrière-plan. Différentes configurations et moteurs
de Cache peuvent être paramétrés dans votre app/config/core.php

Cache::read()
=============

Cache::read($key, $config = null)

Cache::read() est utilisé pour lire la valeur mise en cache sous la clé
``$key`` issue de ``$config``. Si $config est null la configuration par
défaut sera utilisée. ``Cache::read()`` retournera la valeur en cache si
elle est une valeur de cache valide ou ``false`` si le cache a expiré ou
n'existe pas. Les contenus du cache pourraient être évalués à false,
donc assurez-vous d'utiliser l'opérateur de comparaison stricte ``===``
ou ``!==``.

Par exemple :

::

    $nuage = Cache::read('nuage');

    if ($nuage !== false) {
    return $nuage;
    }

    // génère un nuage de données
    // ...

    // Stocke les données dans le cache
    Cache::write('nuage', $nuage);
    return $nuage;

Cache::write()
==============

Cache::write($key, $value, $config = null);

Cache::write() va écrire une valeur $value dans le cache. Vous pouvez
lire ou détruire cette valeur plus tard en vous référant à la clef
``$key``. Vous pouvez spécifier également dans quelle configuration de
cache vous voulez stocker cette valeur. Si aucune configuration
``$config`` est spécifiée, celle par défaut sera utilisée.
Cache::write() peut stocker n'importe quel type d'objet et est idéal
pour stocker les retours des méthodes find des modèles.

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Cet exemple utilise Cache::write() et Cache::read() pour réduire le
nombre d'aller-retour à la base de données pour rapatrier les posts.

Cache::delete()
===============

Cache::delete($key, $config = null)

``Cache::delete()`` vous permettra de supprimer complètement un objet
stocké dans le magasin de Cache.

Cache::config()
===============

``Cache::config()`` est utilisé pour créer des configurations
supplémentaires de Cache. Ces configurations supplémentaires peuvent
avoir des durées, des moteurs, des chemins ou des préfixes différents de
ceux de votre configuration de cache par défaut. Utiliser des
configurations de cache multiples peut aider à réduire le nombre de fois
où vous avez besoin d'utiliser ``Cache::set()``, en plus de centraliser
tous vos réglages de cache.

Vous devez spécifier quel moteur utiliser. Il n'utilise **pas** File par
défaut.

::

    Cache::config('court', array(  
        'engine' => 'File',  
        'duration'=> '+1 hours',  
        'path' => CACHE,  
        'prefix' => 'cake_court_'
    ));

    // long  
    Cache::config('long', array(  
        'engine' => 'File',  
        'duration'=> '+1 week',  
        'probability'=> 100,  
        'path' => CACHE . 'long' . DS,  
    ));

En plaçant le code ci-dessus dans votre ``app/config/core.php`` vous
aurez deux configurations de Cache supplémentaires. Le nom de ces
configurations, 'court' ou 'long', est utilisé comme paramètre
``$config`` pour ``Cache::write()`` et ``Cache::read()``.

Cache::set()
============

``Cache::set()`` vous permet de redéfinir de manière temporaire les
paramètres de configuration du cache pour une opération (habituellement
une lecture ou une écriture dans le cache). Si vous utilisez
``Cache::set()`` pour changer le paramétrage d'une opération d'écriture,
vous devez également changer ce paramétrage avec ``Cache::set()`` avant
de lire dans le cache la donnée écrite. Si vous omettez de le faire,
c'est le paramétrage par défaut qui sera pris en compte.

::


    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);

    // Plus loin

    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

Si vous faites cet appel à ``Cache::set()`` très fréquemment, c'est
qu'il est peut-être souhaitable de créer une nouvelle `configuration du
cache </fr/view/772/Cache-config>`_. Il ne sera alors plus nécessaire de
faire appel à ``Cache::set()``.
