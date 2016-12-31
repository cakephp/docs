Cache
#####

El helper Cache permite almacenar temporalmente (caching) layouts y
vistas completas, ahorrando tiempo en descargar y retornar algunos
datos. El caching de vistas en CakePHP almacena temporalmente los
layouts y vistas utilizando el motor de almacenamiento seleccionado. Es
importante notar que el helper de Cache opera de manera diferente a
otros helpers. No tiene metodos que se puedan llamar directamente. En
vez de eso, una vista es marcada con tags, que permiten decirle cuales
bloques no deben ser cacheados.

Cuando una URL es requerida, CakePHP verifica si aquel requerimiento
esta cacheado.Si lo está, el resto del proceso es saltado. Cualquier
bloque no cacheado se procesa normalmente y la vista es entregada. Esto
crea grandes ahorros en tiempos de proceso para cada requerimiento para
una URL cacheada, asi tambien menos código es ejecutado. Si CakePHP no
encuentra una vista cacheada, o el cache ha expirado para la URL
requerida, se continúa normalmente con el requerimiento.

Generalidades en Caching
========================

El caching tiene como intención ser un medio de almacenamiento temporal
que reduce la carga del servidor. Por ejemplo podrías almacenar el
resultado de una consulta que requiere mucho tiempo de modo de no
realizarla nuevamente en cada actualización de la página.

El Caching no debe utilizarze nunca para almacenar datos en forma
permanente. Solo debes cachear elementos que puedan ser eventualmente
regenerados si es necesario.

Motores de Cache en Cake
========================

Lo nuevo en la version 1.2 de CakePHP son varios motores de cache. El
helper de cache interactua transparentemente con estos motores,
permitiendo almacenar vistas en multiples formas sin preocuparse de las
caracteristicas especificas del medio de almacenamiento. La elección del
motor de cache es controlada a traves del archivo app/config/core.php
config. Muchas opciones para cada motor de cache son listados en el
archivo de configuracion core.php, mas detalles acerca de cada motor se
puede encontrar en la seccion de Caching.

File

El File Engine es el motor por defecto en CakePHP. Escribe archivos
planos en el sistema de archivos y cuenta con numerosos parámetros, pero
funciona bien con los valores por defecto.

APC

EL motor APC implementa el método `Alternative PHP
Cache <https://secure.php.net/apc>`_. Asi como XCache, este motor almacena
codigo ya compilado de PHP.

XCache

El motor XCache opera en forma similar al APC, pero implementanto el
método `XCache <http://xcache.lighttpd.net/>`_. Requiere la
autenticacion de usuarios para funcionar apropiadamente.

Memcache

El motor Memcache funciona utilizando un servidor de almacenamiento en
memoria, lo que permite crear objetos cache en la memoria del sistema.
Mas informacion acerca de este método puede ser encontrada en
`php.net <http://www.php.net/memcache>`_ y
`memcached <http://www.danga.com/memcached/>`_

Configuracion del Cache Helper
==============================

El caching de vistas y el helper de cache tienen varioes elementos de
configuración importantes. Estos se detallan más abajo.

Para usar el cache helper en cualquier vista o controlador, debes
primero configurar Configure::Cache.check a true en la linea 80 de
``core.php``. Si no se configura a true, entonces el cache no sera
verificado o creado.

Caching en los Controllers
==========================

Cualquier controlador que utilice la funcionalidad de caching necesita
incluir el CacheHelper en el arreglo $helpers.

::

    var $helpers = array('Cache');

Necesitas ademas indicar cuales acciones necesitan caching, y cuanto
tiempo durará cacheada cada acción. Esto se hace a traves de la variable
$cacheAction en tus controladores. $cacheAction debería ser configurada
como un arreglo el cual contiene las acciones a ser cacheadas y la
duracion en segundos que deben permanecer en tal condicion. EL tiempo
puede expresarse en formato strtotime(). (ie. "1 hour", o "3 minutes").

Usando como ejemplo ArticlesController, que recibe un gran tráfico que
necesita cachearse.

Por ejemplo, cachear los articulos visitados frecuentemente por diversos
periodos de tiempo

::

    var $cacheAction = array(
        'view/23/' => 21600,
        'view/48/' => 36000,
        'view/52'  => 48000
    );

Hacer caching de una acción completa en este caso un listado de
articulos

::

    var $cacheAction = array(
        'archives/' => '60000'
    );

Cachear todas las acciones del controlador usando un formato amigable
strtotime() para indicar el tiempo de cacheo.

::

    var $cacheAction = "1 hour";

Marking Non-Cached Content in Views
===================================

There will be times when you don't want an *entire* view cached. For
example, certain parts of the page may look different whether a user is
currently logged in or browsing your site as a guest.

To indicate blocks of content that are *not* to be cached, wrap them in
``<cake:nocache> </cake:nocache>`` like so:

::

    <cake:nocache>
    <?php if ($session->check('User.name')) : ?>
        Welcome, <?php echo $session->read('User.name')?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    </cake:nocache>

It should be noted that once an action is cached, the controller method
for the action will not be called - otherwise what would be the point of
caching the page. Therefore, it is not possible to wrap
``<cake:nocache> </cake:nocache>`` around variables which are set from
the controller as they will be *null*.

Clearing the Cache
==================

It is important to remember that the Cake will clear a cached view if a
model used in the cached view is modified. For example, if a cached view
uses data from the Post model, and there has been an INSERT, UPDATE, or
DELETE query made to a Post, the cache for that view is cleared, and new
content is generated on the next request.

If you need to manually clear the cache, you can do so by calling
Cache::clear(). This will clear **all** cached data, excluding cached
view files. If you need to clear the cached view files, use
``clearCache()``.
