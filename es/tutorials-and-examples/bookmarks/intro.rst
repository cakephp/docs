Tutorial Bookmarker (Favoritos)
###############################

Este tutorial te guiará en la creación de una aplicación sencilla para el guardado de favoritos (Bookmaker).

Para comenzar instalaremos CakePHP creando nuestra base de datos y utilizaremos las herramientas que CakePHP provee para realizar nuestra aplicación rápidamente.

Esto es lo que necesitarás:

#. Un servidor de base de datos. Nosotros utilizaremos MySQL en este tutorial. Necesitarás tener los conocimientos suficientes de SQL para crear una base de datos; CakePHP tomará las riendas desde ahí. Al utilizar MySQL asegúrate de que tienes habilitado ``pdo_mysql`` en PHP.
#. Conocimientos básicos de PHP.

Antes de empezar deberías de asegurarte de que tienes actualizada la versión de PHP:

.. code-block:: bash

    php -v

Deberías tener instalado PHP |minphpversion| (CLI) o superior. La versión PHP de tu servidor web deberá ser |minphpversion| o superior y lo ideal es que coincida con la versión de la interfaz de línea de comandos (CLI) de PHP. Si quieres ver la aplicación ya finalizada puedes consultar `cakephp/bookmarker <https://github.com/cakephp/bookmarker-tutorial>`__.

Empecemos!

Instalar CakePHP
================

La forma más sencilla de instalar CakePHP es utilizando Composer, una manera sencilla de instalar CakePHP desde tu terminal o prompt de línea de comandos.

Primero necesitarás descargar e instalar Composer si aún no lo tienes. Si ya tienes instalado cURL es tan sencillo como ejecutar::

    curl -s https://getcomposer.org/installer | php

O puedes descargar ``composer.phar`` desde la `Página web de Composer <https://getcomposer.org/download/>`_.

Después sencillamente escribe la siguiente línea en tu terminal desde tu directorio de instalación para instalar el esqueleto de la aplicación CakePHP en el directorio **bookmarker**::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

Si descargaste y ejecutaste el `Instalador Windows de Composer <https://getcomposer.org/Composer-Setup.exe>`_, entonces escribe la siguiente línea en tu terminal desde tu directorio de instalación (ie. C:\\wamp\\www\\dev\\cakephp3)::

    composer self-update && composer create-project --prefer-dist cakephp/app bookmarker

La ventaja de utilizar Composer es que automáticamente realizará algunas tareas importantes como configurar correctamente el archivo de permisos y crear tu archivo **config/app.php**.

Hay otras formas de instalar CakePHP. Si no puedes o no quieres utilizar Composer comprueba la sección :doc:`/installation`.

Sin importar como hayas descargado e instalado CakePHP, una vez hayas finalizado, tu directorio de instalación debería ser algo como::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Ahora podría ser un buen momento para que aprendas un poco sobre como funciona la estructura de directorios de CakePHP: :doc:`/intro/cakephp-folder-structure`.

Comprobar la instalación
========================

Podemos comprobar rápidamente que nuestra instalación ha sido correcta accediendo a la página principal que se crea por defecto.

Pero antes necesitarás inicializar el servidor de desarrollo::

    bin/cake server

.. note::

    Para Windows introduce el comando ``bin\cake server`` (fíjate en la \\ ).

Esto arrancará el servidor integrado en el puerto 8765. Accede a  **http://localhost:8765** a través de tu navegador para ver la página de bienvenida. Todos los items deberán estar marcados como correctos para que CakePHP pueda conectarse a tu base de datos. Si no, puede que necesites instalar extensiones adicionales de PHP, o dar permisos de directorio.

Crear la base de datos
======================

Continuamos, creemos ahora la base de datos para nuestra aplicación de favoritos.

Si aún no lo has hecho, crea una base de datos vacía para usar en este tutorial con el nombre que tu quieras, e.g. ``cake_bookmarks``.

Puedes ejecutar la siguiente sentencia SQL para crear las tablas necesarias::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

Puedes ver que la tabla ``bookmarks_tags`` utiliza una clave primaria compuesta. CakePHP soporta claves primarias compuestas en casi cualquier lado, haciendo más fácil construir aplicaciones multi-anidadas.

Los nombres de las tablas y columnas que hemos utilizado no son aleatorios. Utilizando las :doc:`convenciones de nombres </intro/conventions>` podemos hacer mejor uso de CakePHP y evitar tener que configurar el framework.

CakePHP es lo suficientemente flexible para acomodarse incluso a esquemas inconsistentes de bases de datos heredados, pero siguiendo las convenciones ahorrarás tiempo.

Configuración de la base de datos
=================================

Siguiente, indiquémosle a CakePHP donde está nuestra base de datos y como conectarse a ella. Para la mayoría de las veces esta será la primera y última vez que necesitarás configurar algo.

La configuración debería ser bastante sencilla: sólo cambia los valores del array ``Datasources.default`` en el archivo **config/app.php** por aquellos que apliquen a tu instalación. Un ejemplo de array de configuración completado puede lucir así::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

Una vez hayas guardado tu archivo **config/app.php** deberías ver que la sección 'CakePHP is
able to connect to the database' tiene un chechmark de correcto.

.. note::

    Puedes encontrar una copia de la configuración por defecto de CakePHP en **config/app.default.php**.

Crear el esqueleto del código
==============================

Gracias a que nuestra base de datos sigue las convenciones de CakePHP podemos utilizar la :doc:`consola de bake </bake/usage>` de la aplicación para crear rápidamente una aplicación básica.

En tu línea de comandos ejecuta las siguientes instrucciones::

    // En Windows necesitarás utilizar bin\cake.
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

Esto creará los controladores, modelos, vistas, sus correspondientes casos de prueba y accesorios para nuestros recursos de users, bookmarks y tags.

Si detuviste tu servidor reinícialo.

Vete a **http://localhost:8765/bookmarks**, deberías poder ver una básica pero funcional aplicación provista de acceso a las tablas de tu base de datos.

Una vez estés en la lista de bookmarks añade unos cuantos usuarios (users), favoritos (bookmarks) y etiquetas (tags)

.. note::

    Si ves una página de error Not Found (404) comprueba que el módulo de Apache mod_rewrite está cargado.

Añadir encriptación (hashing) a la contraseña
==============================================

Cuando creaste tus usuarios (visitando **http://localhost:8765/users**) probablemente te darías cuenta de que las contraseñas (password) se almacenaron en texto plano. Algo muy malo desde un punto de vista de seguridad, así que arreglémoslo.

Éste es también un buen momento para hablar de la capa de modelo en CakePHP.

En CakePHP separamos los métodos que operan con una colección de objetos y los que lo hacen con un único objeto en diferentes clases.

Los métodos que operan con una coleccion de entidades van en la clase ``Table``, mientras que los que lo hacen con una sola van en la clase ``Entity``.

Por ejemplo: el encriptado de una contraseña se hace en un registro individual, por lo que implementaremos este comportamiento en el objeto Entity.

Ya que lo que queremos es encriptar la contraseña cada vez que la introduzcamos en la base de datos utilizaremos un método mutador/setter.

CakePHP utilizará la convención para métodos setter cada vez que una propiedad se introducida en una de tus entidades.

Añadamos un setter para la contraseña añadiendo el siguiente código en **src/Model/Entity/User.php**::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; //include this line
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Ahora actualiza uno de los usuarios que creaste antes, si cambias su contraseña deberías ver una contraseña encriptada en vez del valor original en la lista de usuarios o en su página de View.

CakePHP encripta contraseñas con `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ por defecto. Puedes usar también sha1 o md5 si estás trabajando con bases de datos ya existentes.

.. note::

      Si la contraseña no se ha encriptado asegúrate de que has usado el mismo estilo de escritura que el del atributo password de la clase cuando nombraste la función setter.

Obtener bookmarks con un tag específico
========================================

Ahora que estamos almacenando contraseñas con seguridad podemos añadir alguna funcionalidad interesante a nuestra aplicación.

Cuando acumulas una colección de favoritos es útil poder buscarlos a través de etiquetas.

Implementemos una ruta, una acción de controlador y un método finder para buscar bookmarks mediante etiquetas.

Idealmente tendríamos una URL como **http://localhost:8765/bookmarks/tagged/funny/cat/gifs** que nos permitiría encontrar todos los bookmarks que tienen las etiquetas 'funny', 'cat' o 'gifs'.

Antes de que podamos implementarlo añadiremos una nueva ruta.

Modifica tu **config/routes.php** para que se vea como ésto::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // Nueva ruta que añadimos para nuestra acción tagged
    // The trailing `*` tells CakePHP that this action has
    // passed parameters.
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // Connect the default home and /pages/* routes.
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // Connect the conventions based default routes.
        $routes->fallbacks();
    });

Lo cual define una nueva 'ruta' que conecta el path **/bookmarks/tagged/** a ``BookmarksController::tags()``.

Con la definición de rutas puedes separar como se ven tus URLs de como se implementan. Si visitamos **http://localhost:8765/bookmarks/tagged**, podremos ver una página de error bastante útil de CakePHP informando que no existe la acción del controlador.

Implementemos ahora ese método.

En **src/Controller/BookmarksController.php** añade::

    public function tags()
    {
        // The 'pass' key is provided by CakePHP and contains all
        // the passed URL path segments in the request.
        $tags = $this->request->getParam('pass');

        // Use the BookmarksTable to find tagged bookmarks.
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

Para acceder a otras partes del request consulta :ref:`cake-request`.

Crear el método finder
----------------------

En CakePHP nos gusta mantener las acciones de los controladores sencillas y poner la mayoría de la lógica de la aplicación en los modelos. Si visitas ahora la URL **/bookmarks/tagged** verás un error de que el método ``findTagged()`` no ha sido implementado todavía, asi que hagámoslo.

En **src/Model/Table/BookmarksTable.php** añade lo siguiente::

    // El argumento $query es una instancia de query.
    // El array $options contendrá las opciones de 'tags' que pasemos
    // para encontrar'tagged') en nuestra acción del controlador.
    public function findTagged(Query $query, array $options)
    {
        $bookmarks = $this->find()
            ->select(['id', 'url', 'title', 'description']);

        if (empty($options['tags'])) {
            $bookmarks
                ->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            $bookmarks
                ->innerJoinWith('Tags')
                ->where(['Tags.title IN ' => $options['tags']]);
        }

        return $bookmarks->group(['Bookmarks.id']);
    }

Acabamos de implementar un :ref:`método finder personalizado <custom-find-methods>`.

Esto es un concepto muy poderoso en CakePHP que te permite empaquetar queries re-utilizables.

Los métodos finder siempre reciben un objeto :doc:`/orm/query-builder` y un array de opciones como parámetros. Estos métodos pueden manipular la query y añadir cualquier condición o criterio requerido; cuando se completan devuelven un objeto query modificado.

En nuestro método finder sacamos provecho de los métodos ``distinct()`` y ``matching()`` que nos permiten encontrar distintos ('distincts') bookmarks que tienen un tag coincidente (matching). El método ``matching()`` acepta una  `función anónima <http://php.net/manual/es/functions.anonymous.php>`_ que recibe un generador de consultas. Dentro del callback usaremos este generador para definir las condiciones que filtrarán bookmarks que tienen las etiquetas (tags) especificadas.

Crear la vista
--------------

Ahora si visitas la URL **/bookmarks/tagged**, CakePHP mostrará un error advirtiéndote de que no has creado un archivo de vista.

Siguiente paso, creemos un archivo de vista para nuestro método ``tags()``.

En **src/Template/Bookmarks/tags.ctp** añade el siguiente código::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
        </article>
    <?php endforeach; ?>
    </section>

En el código de arriba utilizamos los helpers :doc:`/views/helpers/html` y :doc:`/views/helpers/text` para que asistan en la generación de nuestra salida de la vista.

También utilizamos la función de atajo ``h()`` para salidas de código HTML. Deberías acordarte siempre de utilizar ``h()`` cuando muestres datos del usuario para evitar problemas de inyección HTML.

El archivo **tags.ctp** que acabamos de crear sigue las convenciones de CakePHP para archivos de vistas. La convención es que el nombre del archivo sea una versión en minúsculas y subrayados del nombre de la acción del controlador.

Puedes observar que hemos podido usar las variables ``$tags`` y ``$bookmarks`` en nuestra vista.

Cuando utilizamos el método ``set()`` en nuestro controlador especificamos variables para enviarlas a la vista. Ésta hará disponibles todas las variables que se le pasen como variables locales.

Ahora deberías poder visitar la URL **/bookmarks/tagged/funny** y ver todos los favoritos etiquetados con 'funny'.

Hasta aquí hemos creado una aplicación básica para manejar favoritos (bookmarks), etiquetas (tags) y usuarios (users). Sin embargo todo el mundo puede ver las etiquetas de los demás. En el siguiente capítulo implementaremos autenticación y restringiremos el uso de etiquetas únicamente a aquellas que pertenezcan al usuario actual.

Ahora ve a :doc:`/tutorials-and-examples/bookmarks/part-two` para continuar construyendo tu apliación o :doc:`sumérgete en la documentación </topics>` para aprender más sobre que puede hacer CakePHP por ti.

.. meta::
    :title lang=es: Tutorial Bookmarker (Favoritos)