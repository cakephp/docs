#####
Blog
#####

Bienvenido a CakePHP. Probablemente estás consultando este tutorial porque quieres aprender cómo funciona CakePHP. Nuestro objetivo es potenciar tu productividad y hacer más divertido el desarrollo de aplicaciones. Esperamos que puedas comprobarlo a medida que vas profundizando en el código.

En este tutorial vamos a crear un blog sencillo desde cero.
Empezaremos descargando e instalando CakePHP, luego crearemos una base de datos y el código necesario para listar, añadir, editar o borrar artículos del blog.

Esto es lo que necesitas:

#. Servidor web funcionando. Asumiremos que estás usando Apache, aunque las instrucciones para otros servidores son similares. Igual tendremos que ajustar un poco la configuración inicial, pero todos los pasos son sencillos. La mayor parte de nosotros podrá tener CakePHP funcionando sin tocar nada en su configuración.

#. Base de datos funcionando. Usaremos MySQL en este tutorial. Necesitarás saber cómo crear una base de datos nueva. CakePHP se encargará del resto.

#. Nivel básico de PHP. Si estás familiarizado con la programación orientada a objetos, mucho mejor. Aún así puedes seguir desarrollando con tu estilo procedimental si lo prefieres.

#. Conocimiento sobre patrón MVC. Puedes encontrar una definición rápida aquí: `/cakephp-overview/understanding-model-view-controller`. No tengas miedo, sólo es media página. 

¡ Vamos allá !

Descargar CakePHP
=================

Vamos a descargar la última versión de CakePHP.

Para ello, visita la web del proyecto en github:
`http://github.com/cakephp/cakephp/downloads <http://github.com/cakephp/cakephp/downloads>`_ y descargar / descomprimir la última versión de la rama 2.0

También puedes clonar el repositorio usando 
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Usa el método que prefieras y coloca la carpeta que has descargado bajo la ruta de tu servidor web (dentro de tu DocumentRoot). Una vez terminado, tu directorio debería tener esta estructura:

::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Es buen momento para aprender algo sobre cómo funciona esta estructura de directorios: echa un vistazo a "Directorios en CakePHP", Sección: :doc:`/getting-started/cakephp-folder-structure`.

Creando la base de datos para nuestro blog
==========================================

Vamos a crear una nueva base de datos para el blog.
Puedes crear una base de datos en blanco con el nombre que quieras. De momento vamos a definir sólo una tabla para nuestros artículos ("posts"). Además crearemos algunos artículos de test para usarlos luego.
Una vez creada la tabla, ejecuta el siguiente código SQL en ella:

::

    /* tabla para nuestros articulos */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );
    
     
    /* algunos valores de test */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

La elección de los nombres para el nombre de la tabla y de algunas columnas no se ha hecho al azar. Si sigues las convenciones para nombres en la Base de Datos, y las demás convenciones en tus clases (ver más sobre convenciones aquí: :doc:`/getting-started/cakephp-conventions`), aprovecharás la potencia del framework y ahorrarás mucho trabajo de configuración.
CakePHP es flexible, si no quieres usar las convenciones puedes configurar luego cada elemento para que funcione con tu Base de Datos legada. Te recomendamos que utilices estas convenciones ya que te ahorrarán tiempo.

Al llamar 'posts' a nuestra tabla de artículos, estamos diciendo a CakePHP que vincule esta tabla por defecto al Modelo 'Post', e incluir los campos 'modified' y 'created' con ese nombre, serán automáticamente administrados por CakePHP.

CakePHP Database Configuration
==============================

Rápido y sencillo, vamos a decirle a CakePHP dónde está la Base de Datos y cómo conectarnos a ella. Probabmente ésta será la primera y última vez que lo hagas en cada proyecto.

Hay un fichero de configuración preparado para que sólo tengas que copiarlo y modificarlo con tu propia configuración.

Cambia el nombre del fichero ``/app/Config/database.php.default`` por ``/app/Config/database.php`` (hemos eliminado el '.default' del final).

Edita ahora este fichero y verás un array definido en la variable ``$default`` que contiene varios campos. Modifica esos campos para que se correspondan con tu configuración actual de acceso a la Base de Datos. Debería quedarte algo similar a esto:

::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Ten en cuenta que los campos 'login', 'password', 'database' tendrás que cambiarlos por tu usuario de MySQL, tu contraseña de MySQL y el nombre que le diste a la Base de Datos.

Guarda este fichero.

Ahora ya podrás acceder a la página inicial de bienvenida de CakePHP en tu máquina. Esta página podrás accederla normalmente en http://localhost/cakeblog si has llamado a la carpeta raíz del proyecto 'cakeblog'. Verás una página de bienvenida que muestra varias informaciones de configuración y te indica si tienes correctamente instalado CakePHP.

Configuración Opcional
======================

Hay otras tres cosas que puedes querer configurar, aunque no son requeridas para este tutorial no está mal echarles un vistazo. Para ello abre el fichero ``/app/Config/core.php`` que contiene todos estos parámetros.

#. Configurar un string de seguridad 'salt' para usarlo al realizar los 'hash'. 

#. Configurar un número semilla para el encriptado 'seed'.

#. Definir permisos de escritura en la carpeta ``Tmp``. El servidor web (normalmente 'apache') debe poder escribir dentro de esta carpeta y subcarpetas.

El string de seguridad se utiliza en la generación de 'hashes'. Cambia el valor inicial y escribe cualquier cosa diferente. Cualquier cosa vale. Para cambiarlo vete a la línea 203 del fichero ``/app/Config/core.php`` y verás algo así:

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

El número semilla se utiliza para encriptar y desencriptar cadenas. Cambia el valor por defecto en el ficharo ``/app/Config/core.php`` línea 208. No importa qué numero pongas, que sea difícil de adivinar.

::

    <?php
    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

Para dar permisos al directorio ``app/Tmp``, la mejor forma es ver qué usuario está ejecutando el servidor web (``<?php echo `whoami`; ?>``) y cambiar el directorio para que el nuevo propietario sea el usuario que ejecuta el servidor web.
En un sistema *nix esto se hace así:

::

        $ chown -R www-data app/tmp

Suponiendo que www-data sea el usuario que ejecuta tu servidor web (en otras versiones de *unix como fedora, el usuario suele llamarse 'apache').

Si CakePHP no puede 





























First, let's get a copy of fresh Cake code.

To get a fresh download, visit the CakePHP project on github:
`http://github.com/cakephp/cakephp/downloads <http://github.com/cakephp/cakephp/downloads>`_
and download the latest release of 2.0

You can also clone the the repository using
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Regardless of how you downloaded it, place the code inside of your
DocumentRoot. Once finished, your directory setup should look
something like the following:

::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Now might be a good time to learn a bit about how Cake's directory
structure works: check out "CakePHP Folder Structure",
Section :
:doc:`/getting-started/cakephp-folder-structure`.

Creating the Blog Database
==========================

Next, lets set up the underlying database for our blog. if you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice. Right now, we'll just create
a single table to store our posts. We'll also throw in a few posts
right now to use for testing purposes. Execute the following SQL
statements into your database:

::

    /* First, create our posts table: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );
    
    /* Then insert some posts for testing: */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow Cake's database naming conventions, and Cake's class naming
conventions (both outlined in
:doc:`/getting-started/cakephp-conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
Cake is flexible enough to accommodate even the worst legacy
database schema, but adhering to convention will save you time.

Check out :doc:`/getting-started/cakephp-conventions` for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by Cake.

Cake Database Configuration
===========================

Onward and upward: let's tell Cake where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's database configuration file is found in
``/app/Config/database.php.default``. Make a copy of this file in
the same directory, but name it ``database.php``.

The config file should be pretty straightforward: just replace the
values in the ``$default`` array with those that apply to your
setup. A sample completed configuration array might look something
like the following:

::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Once you've saved your new ``database.php`` file, you should be
able to open your browser and see the Cake welcome page. It should
also tell you that your database connection file was found, and
that Cake can successfully connect to the database.

Optional Configuration
======================

There are three other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes. The second is defining a custom number (or
"seed") for use in encryption. The third item is allowing CakePHP
write access to its ``Tmp`` folder.

The security salt is used for generating hashes. Change the default
salt value by editing ``/app/Config/core.php`` line 203. It doesn't
much matter what the new value is, as long as it's not easily
guessed.

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

The cipher seed is used for encrypt/decrypt strings. Change the
default seed value by editing ``/app/Config/core.php`` line 208. It
doesn't much matter what the new value is, as long as it's not
easily guessed.

::

    <?php
    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

The final task is to make the ``app/tmp`` directory web-writable.
The best way to do this is to find out what user your webserver
runs as (``<?php echo `whoami`; ?>``) and change the ownership of
the ``app/tmp`` directory to that user. The final command you run
(in \*nix) might look something like this::

    $ chown -R www-data app/tmp

If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.

A Note on mod\_rewrite
======================

Occasionally a new user will run in to mod\_rewrite issues, so I'll
mention them marginally here. If the CakePHP welcome page looks a
little funny (no images or css styles), it probably means
mod\_rewrite isn't functioning on your system. Here are some tips
to help get you up and running:


#. Make sure that an .htaccess override is allowed: in your
   httpd.conf, you should have a section that defines a section for
   each Directory on your server. Make sure the ``AllowOverride`` is
   set to ``All`` for the correct Directory. For security and
   performance reasons, do *not* set ``AllowOverride`` to ``All`` in
   ``<Directory />``. Instead, look for the ``<Directory>`` block that
   refers to your actual website directory.

#. Make sure you are editing the correct httpd.conf rather than a
   user- or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of
   CakePHP without the needed .htaccess files. This sometimes happens
   because some operating systems treat files that start with '.' as
   hidden, and don't copy them. Make sure your copy of CakePHP is from
   the downloads section of the site or our git repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You
   should see something like::

       LoadModule rewrite_module             libexec/httpd/mod_rewrite.so

   or (for Apache 1.3)::

       AddModule             mod_rewrite.c
   
   in your httpd.conf.


If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use Cake's built in pretty URLs. In ``/app/Config/core.php``,
uncomment the line that looks like::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Also remove these .htaccess files::

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess
            

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the :doc:`/installation/advanced-installation` section.
