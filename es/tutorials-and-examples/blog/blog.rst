Parte 1: Tutorial para desarrollar el Blog
##########################################

Bienvenido a CakePHP. Probablemente estás consultando este tutorial porque
quieres aprender cómo funciona CakePHP. Nuestro objetivo es potenciar tu
productividad y hacer más divertido el desarrollo de aplicaciones. Esperamos que
puedas comprobarlo a medida que vas profundizando en el código.

En este tutorial vamos a crear un blog sencillo desde cero.  Empezaremos
descargando e instalando CakePHP, luego crearemos una base de datos y el código
necesario para listar, añadir, editar o borrar artículos del blog.

Esto es lo que necesitas:

#. Servidor web funcionando. Asumiremos que estás usando Apache, aunque las
   instrucciones para otros servidores son similares. Igual tendremos que ajustar
   un poco la configuración inicial, pero todos los pasos son sencillos. La mayor
   parte de nosotros podrá tener CakePHP funcionando sin tocar nada en su
   configuración.

#. Base de datos funcionando. Usaremos MySQL en este tutorial. Necesitarás saber
   cómo crear una base de datos nueva. CakePHP se encargará del resto.

#. Nivel básico de PHP. Si estás familiarizado con la programación orientada a
   objetos, mucho mejor. Aún así puedes seguir desarrollando con tu estilo
   procedimental si lo prefieres.

#. Conocimiento sobre patrón MVC. Puedes encontrar una definición rápida aquí:
   :doc:`/cakephp-overview/understanding-model-view-controller`. No tengas miedo, sólo
   es media página. 

¡ Vamos allá !

Descargar CakePHP
=================

Vamos a descargar la última versión de CakePHP.

Para ello, visita la web del proyecto en GitHub:
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_ 
y descargar / descomprimir la última versión de la rama 2.0

También puedes clonar el repositorio usando 
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Usa el método que prefieras y coloca la carpeta que has descargado bajo la ruta
de tu servidor web (dentro de tu DocumentRoot). Una vez terminado, tu directorio
debería tener esta estructura:

::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Es buen momento para aprender algo sobre cómo funciona esta estructura de
directorios: echa un vistazo a "Directorios en CakePHP", Sección:
:doc:`/getting-started/cakephp-folder-structure`.

Creando la base de datos para nuestro blog
==========================================

Vamos a crear una nueva base de datos para el blog.
Puedes crear una base de datos en blanco con el nombre que quieras. De momento
vamos a definir sólo una tabla para nuestros artículos ("posts"). Además
crearemos algunos artículos de test para usarlos luego.  Una vez creada la
tabla, ejecuta el siguiente código SQL en ella:

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

La elección de los nombres para el nombre de la tabla y de algunas columnas no
se ha hecho al azar. Si sigues las convenciones para nombres en la Base de
Datos, y las demás convenciones en tus clases (ver más sobre convenciones aquí:
:doc:`/getting-started/cakephp-conventions`), aprovecharás la potencia del
framework y ahorrarás mucho trabajo de configuración.

CakePHP es flexible, si no quieres usar las convenciones puedes configurar luego
cada elemento para que funcione con tu Base de Datos legada. Te recomendamos que
utilices estas convenciones ya que te ahorrarán tiempo.

Al llamar 'posts' a nuestra tabla de artículos, estamos diciendo a CakePHP que
vincule esta tabla por defecto al Modelo 'Post', e incluir los campos 'modified'
y 'created' con ese nombre, serán automáticamente administrados por CakePHP.

Configurando la Base de Datos
==============================

Rápido y sencillo, vamos a decirle a CakePHP dónde está la Base de Datos y cómo
conectarnos a ella. Probabmente ésta será la primera y última vez que lo hagas
en cada proyecto.

Hay un fichero de configuración preparado para que sólo tengas que copiarlo y
modificarlo con tu propia configuración.

Cambia el nombre del fichero ``/app/Config/database.php.default`` por
``/app/Config/database.php`` (hemos eliminado el '.default' del final).

Edita ahora este fichero y verás un array definido en la variable ``$default``
que contiene varios campos. Modifica esos campos para que se correspondan con tu
configuración actual de acceso a la Base de Datos. Debería quedarte algo similar
a esto:

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

Ten en cuenta que los campos 'login', 'password', 'database' tendrás que
cambiarlos por tu usuario de MySQL, tu contraseña de MySQL y el nombre que le
diste a la Base de Datos.

Guarda este fichero.

Ahora ya podrás acceder a la página inicial de bienvenida de CakePHP en tu
máquina. Esta página podrás accederla normalmente en http://localhost/cakeblog
si has llamado a la carpeta raíz del proyecto 'cakeblog'. Verás una página de
bienvenida que muestra varias informaciones de configuración y te indica si
tienes correctamente instalado CakePHP.

Configuración Opcional
======================

Hay otras tres cosas que puedes querer configurar, aunque no son requeridas para
este tutorial no está mal echarles un vistazo. Para ello abre el fichero
``/app/Config/core.php`` que contiene todos estos parámetros.

#. Configurar un string de seguridad 'salt' para usarlo al realizar los 'hash'. 

#. Configurar un número semilla para el encriptado 'seed'.

#. Definir permisos de escritura en la carpeta ``Tmp``. El servidor web (normalmente 'apache') debe poder escribir dentro de esta carpeta y   subcarpetas.

El string de seguridad se utiliza en la generación de 'hashes'. Cambia el valor
inicial y escribe cualquier cosa diferente. Cualquier cosa vale. Para cambiarlo
vete a la línea 203 del fichero ``/app/Config/core.php`` y verás algo así:

::

    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

El número semilla se utiliza para encriptar y desencriptar cadenas. Cambia el
valor por defecto en el ficharo ``/app/Config/core.php`` línea 208. No importa
qué numero pongas, que sea difícil de adivinar.

::

    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

Para dar permisos al directorio ``app/Tmp``, la mejor forma es ver qué usuario
está ejecutando el servidor web (``<?php echo `whoami`; ?>``) y cambiar el
directorio para que el nuevo propietario sea el usuario que ejecuta el servidor
web.

En un sistema \*nix esto se hace así::

    $ chown -R www-data app/tmp

Suponiendo que www-data sea el usuario que ejecuta tu servidor web (en otras
versiones de \*unix como fedora, el usuario suele llamarse 'apache').

Si CakePHP no puede escribir en este directorio, te informará de ello en la
página de bienvenida, siempre que tengas activado el modo depuración, por
defecto está activo.

Sobre mod\_rewrite
==================

Si eres nuevo usuario de Apache, puedes encontrar alguna dificultad con
mod\_rewrite, así que lo trataremos aquí.

Si al cargar la página de bienvenida de CakePHP ves cosas raras (no se cargan
las imágenes ni los estilos y se ve todo en blanco y negro), esto significa que
probablemente la configuración necesita ser revisada en el servidor Apache.
Prueba lo siguiente:


#. Asegúrate de que existe la configuración para procesar los ficheros
   .htaccess. En el fichero de configuración de Apache: 'httpd.conf' debería
   existir una sección para cada 'Directory' de tu servidor. Asegúrate de que
   ``AllowOverride`` está fijado a ``All`` para el directorio que contiene tu
   aplicación web. Para tu seguridad, es mejor que no asignes ``All`` a tu
   directorio raíz ``<Directory />`` sino que busques el bloque ``<Directory>`` que
   se refiera al directorio en el que tienes instalada tu aplicación web.

#. Asegúrate que estás editando el fichero httpd.conf correcto, ya que en
   algunos sistemas hay ficheros de este tipo por usuario o por aplicación web.
   Consulta la documentación de Apache para tu sistema.

#. Comprueba que existen los ficheros .htaccess en el directorio en el que está
   instalada tu aplicación web. A veces al descomprimir el archivo o al copiarlo
   desde otra ubicación, estos ficheros no se copian correctamente. Si no están
   ahí, obtén otra copia de CakePHP desde el servidor oficial de descargas.

#. Asegúrate de tener activado el módulo mod\_rewrite en la configuración de Apache. Deberías tener algo así::

        LoadModule rewrite_module       libexec/httpd/mod_rewrite.so

    (para Apache 1.3)::

        AddModule       mod_rewrite.c

    en tu fichero httpd.conf


Si no puedes (o no quieres) configurar mod\_rewrite o algún otro módulo
compatible, necesitarás activar las url amigables en CakePHP. En el fichero
``/app/Config/core.php``, quita el comentario a la línea::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Borra también los ficheros .htaccess que ya no serán necesarios::

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess

Esto hará que tus url sean así:
www.example.com/index.php/nombredelcontrolador/nombredelaaccion/parametro en vez
de www.example.com/nombredelcontrolador/nombredelaaccion/parametro.

Si estás instalando CakePHP en otro servidor diferente a Apache, encontrarás
instrucciones para que funcione la reescritura de URLs en la sección
:doc:`/installation/advanced-installation`
