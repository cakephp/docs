Cache
#####

La clase Cache en CakePHP provee una interfaz generica con varios
metodos de cache. Es posible tener varias configuraciones y motores en
el archivo app/config/core.php

Cache::read()
=============

Cache::read($key, $config = null)

El método Cache::read() se utiliza para leer el valor guardado en el
cache con el nombre ``$key`` de la configuración ``$config``. Si $config
es null se utiliza el configuración por defecto. ``Cache::read()``
retornará el valor almacenado si es un cache valido o ``false`` si el
cache expiró o no existe. Los contenidos del cache podrían evaluarse
como false, así que asegúrate de usar el operador de comparación
estricta ``===`` o ``!==``.

Por ejemplo:

::

    $cloud = Cache::read('cloud');

    if ($cloud !== false) {
        return $cloud;
    }

    // generate cloud data
    // ...

    // store data in cache
    Cache::write('cloud', $cloud);
    return $cloud;

Cache::write()
==============

Cache::write($key, $value, $config = null);

Cache::write() escribirá un valor $value en el Cache. Puedes leer o
borrar ese valor más adelante refiriéndote a él por ``$key``. Puedes
especificar opcionalmente una configuración para guardar el cache. Si no
se especifica ``$config`` se usará la configuración por defecto.
Cache::write() puede almacenar cualquier tipo de objeto y es ideal para
guardar resultados de búsquedas de modelos.

::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

Usa Cache::write() y Cache::read() para reducir con facilidad la
cantidad de viajes a la base de datos para recuperar registros.

Cache::delete()
===============

Cache::delete($key, $config = null)

``Cache::delete()`` te permitirá eliminar completamente cualquier objeto
que tengas guardado en el Cache.

Cache::config()
===============

``Cache::config()`` se usa para crear configuraciones de Cache
adicionales. Estas configuraciones a mayores pueden tener diferente
duración, motores, rutas, o prefijos de los que tiene tu configuración
por defecto. Usar configuraciones múltiples te puede ayudar a reducir la
cantidad de veces que necesitas usar ``Cache::set()`` así como
centralizar todos tus ajustes de Cache.

Debes especificar qué motor usar. **No** se pone por defecto a File.

::

    Cache::config('short', array(  
        'engine' => 'File',  
        'duration'=> '+1 hours',  
        'path' => CACHE,  
        'prefix' => 'cake_short_'
    ));

    // long  
    Cache::config('long', array(  
        'engine' => 'File',  
        'duration'=> '+1 week',  
        'probability'=> 100,  
        'path' => CACHE . 'long' . DS,  
    ));

Añadiendo el código anterior en tu ``app/config/core.php`` tendrás dos
configuraciones de Cache adicionales. El nombre de estas configuraciones
'short' o 'long' se usa como parámetro ``$config`` para
``Cache::write()`` y ``Cache::read()``.

Cache::set()
============

``Cache::set()`` te permite puentear temporalmente los ajustes de
configuración de Cache para una operación (normalmente read o write). Si
usas ``Cache::set()`` para cambiar los ajustes para una escritura,
deberías usar ``Cache::set()`` antes de leer los datos más tarde. Si no
haces eso, se usará la configuración por defecto cuando se lea la clave
de la cache.

::


    Cache::set(array('duration' => '+30 days'));
    Cache::write('results', $data);

    // Later on

    Cache::set(array('duration' => '+30 days'));
    $results = Cache::read('results');

Si usar repetidamente ``Cache::set()`` quizás deberías crear una nueva
`configuración de Cache </es/view/772/Cache-config>`_. Esto eliminará la
necesidad de llamar a ``Cache::set()``.
