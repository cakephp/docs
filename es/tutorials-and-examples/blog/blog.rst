Tutorial Blog
#############

Bienvenido a CakePHP. Probablemente estás consultando este tutorial porque
quieres aprender más sobre cómo funciona CakePHP. Nuestro objetivo es potenciar
tu productividad y hacer más divertido el desarrollo de aplicaciones. Esperamos
que puedas comprobarlo a medida que vas profundizando en el código.

Este tutorial te guiará en la creación de una aplicación sencilla de blog.
Obtendremos e instalaremos CakePHP, crearemos y configuraremos la base de datos
y añadiremos suficiente lógica como para listar, añadir, editar y eliminar
artículos del blog.

Esto es lo que necesitarás:

#. Servidor web funcionando. Asumiremos que estás usando Apache, aunque las
   instrucciones para otros servidores son similares. Igual tendremos que ajustar
   un poco la configuración inicial, pero la mayoría pueden poner en marcha
   CakePHP sin configuración alguna. Asegúrate de tener PHP |minphpversion| o superior
   así como tener las extensiones ``mbstring``, ``intl`` y ``mcrypt`` activadas
   en PHP.
#. Servidor de base de datos. Usaremos MySQL en este tutorial. Necesitarás saber
   cómo crear una base de datos nueva. CakePHP se encargará del resto. Dado que
   utilizamos MySQL, asegúrate también de tener ``pdo_mysql`` habilitado en PHP.
#. Conocimientos básicos de PHP.

¡Vamos allá!

Obtener CakePHP
===============

La manera más sencilla de ponerse en marcha es utilizando Composer. Composer te
permite instalar fácilmente CakePHP desde tu terminal o consola. Primero, debes
descargar e instalar Composer si todavía no lo has hecho. Si tienes cURL
instalado, es tan fácil como ejecutar lo siguiente:

    curl -s https://getcomposer.org/installer | php

O puedes descargar ``composer.phar`` desde
`la página web de Composer <https://getcomposer.org/download/>`_.

Instalando Composer de manera global evitarás tener que repetir este paso para
cada proyecto.

Luego, simplemente escribe la siguiente línea en tu terminal desde tu directorio
de instalación para instalar el esqueleto de la aplicación de CakePHP en el
directorio [nombre_app]. ::

    php composer.phar create-project --prefer-dist cakephp/app [nombre_app]

O si tienes Composer instalado globalmente::

    composer create-project --prefer-dist cakephp/app [nombre_app]

La ventaja de utilizar Composer es que automáticamente completará algunas tareas
de inicialización, como aplicar permisos a ficheros y crear tu fichero
config/app.php por ti.

Existen otros modos de instalar CakePHP si no te sientes cómodo con Composer.
Para más información revisa la sección :doc:`/installation`.

Dejando de lado cómo has descargado e instalado CakePHP, una vez ha terminado
la configuración, tu directorio de instalación debería tener la siguiente
estructura::

    /directorio_raiz
        /config
        /logs
        /src
        /plugins
        /tests
        /tmp
        /vendor
        /webroot
        .gitignore
        .htaccess
        .travis.yml
        README.md
        composer.json
        phpunit.xml.dist

Quizás sea buen momento para aprender algo sobre cómo funciona esta estructura
de directorios: echa un vistazo a la sección
:doc:`/intro/cakephp-folder-structure`.

Permisos de directorio en tmp
=============================

También necesitarás aplicar los permisos adecuados en el directorio ``/tmp``
para que el servidor web pueda escribir en él. El mejor modo de hacer esto es
encontrar con qué usuario corre tu servidor web (``<?= `whoami`; ?>``) y cambiar
la propiedad del directorio ``tmp`` hacia dicho usuario. El comando final que
ejecutarás (en \*nix) se parecerá al siguiente::

    $ chown -R www-data tmp

Si por alguna razón CakePHP no puede escribir en ese directorio, serás informado
mediante una alerta mientras no estés en modo producción.

A pesar de que no se recomienda, si no eres capaz de aplicar la propiedad del
directorio al mismo usuario que el servidor web, puedes simplemente aplicar
permisos de escritura al directorio ejecutando un comando tipo::

    $ chmod -R 777 tmp

Creando la base de datos del Blog
=================================

Vamos a crear una nueva base de datos para el blog.
Puedes crear una base de datos en blanco con el nombre que quieras. De momento
vamos a definir sólo una tabla para nuestros artículos ("posts"). Además
crearemos algunos artículos de test para usarlos luego.  Una vez creada la
tabla, ejecuta el siguiente código SQL en ella::

    /* Primero, creamos la tabla artículos: */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Luego insertamos algunos artículos para probar */
    INSERT INTO articles (title,body,created)
        VALUES ('El título', 'Esto es el cuerpo del artículo.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Un título de nuevo', 'Y el cuerpo sigue.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('El título ataca de nuevo', '¡Esto es realmente emocionante! No.', NOW());

La elección de los nombres para el nombre de la tabla y de algunas columnas no
se ha hecho al azar. Si sigues las convenciones para nombres en la Base de
Datos, y las demás convenciones en tus clases (ver más sobre convenciones aquí:
:doc:`/intro/conventions`), aprovecharás la potencia del
framework y ahorrarás mucho trabajo de configuración. CakePHP es suficientemente
flexible como para acomodarse hasta en el peor esquema de base de datos, pero
utilizando las convenciones ahorrarás tiempo.

Echa un vistazo a :doc:`las convencionnes </intro/conventions>`
para más información, pero basta decir que nombrando nuestra tabla 'articles'
automáticamente lo vincula a nuestro modelo Articles y que campos
llamados `modified` y `created` serán gestionados automáticamente por CakePHP.

Configurando la Base de Datos
=============================

Rápido y sencillo, vamos a decirle a CakePHP dónde está la Base de Datos y cómo
conectarnos a ella. Seguramente esta sea la primera y última vez que configuras
nada.

Una copia del fichero de configuración de CakePHP puede ser hallado en
**config/app.default.php**. Copia este fichero en su mismo directorio, pero
nómbralo **app.php**.

El fichero de configuración debería de ser bastante sencillo: simplemente
reemplaza los valores en la matriz `` Datasources.default`` con los que
encajen con tu configuración. Una configuración completa de ejemplo podría
parecerse a esto::

    return [
        // Más configuración arriba
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // Más configuración abajo
    ];

En cuanto guardes tu nuevo fichero **app.php** deberías de ser capaz de acceder
mediante tu navegador web y ver la página de bienvenida de CakePHP. También
debería decirte que se ha encontrado el fichero de configuración así como que
ha podido conectarse a la base de datos.

.. note::

    Recuerda que debes tener PDO y pdo_mysql habilitados en tu php.ini.

Configuración Opcional
======================

Aún hay unas pocas cosas que puedes configurar. La mayoría de desarrolladores
acaban estos ítems de la lista de la compra, pero no se necesitan para este
tutorial. Uno de ellos es definir un string de seguridad (security salt) para realizar
los 'hash' de seguridad.

El string de seguridad se utiliza para generar 'hashes'. Cambia el valor por
defecto editando el fichero **config/app.php**. No importa mucho el valor que
contenga, cuanto más largo más difícil de averiguar::

    'Security' => [
        'salt' => 'Algo largo y conteniendo un montón de distintos valores.',
    ],

Sobre mod\_rewrite
==================

Si eres nuevo usuario de apache, puedes encontrar alguna dificultad con
mod\_rewrite, así que lo trataremos aquí.

Si al cargar la página de bienvenida de CakePHP ves cosas raras (no se cargan
las imágenes ni los estilos y se ve todo en blanco y negro), esto significa que
probablemente mod\_rewrite no está funcionando en tu sistema. Por favor,
consulta la sección para tu servidor entre las siguientes acerca de re-escritura
de URLs para poder poner en marcha la aplicación:

#. Comprueba que existen los ficheros .htaccess en el directorio en el que está
   instalada tu aplicación web. A veces al descomprimir el archivo o al copiarlo
   desde otra ubicación, estos ficheros no se copian correctamente. Si no están
   ahí, obtén otra copia de CakePHP desde el servidor oficial de descargas.

#. Asegúrate de tener activado el módulo mod\_rewrite en la configuración de
   apache. Deberías tener algo así::

        LoadModule rewrite_module       libexec/httpd/mod_rewrite.so

    (para apache 1.3)::

        AddModule       mod_rewrite.c

    en tu fichero httpd.conf

Si no puedes (o no quieres) configurar mod\_rewrite o algún otro módulo
compatible, necesitarás activar las url amigables en CakePHP. En el fichero
**config/app.php**, quita el comentario a la línea::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Borra también los ficheros .htaccess que ya no serán necesarios::

    /.htaccess
    /webroot/.htaccess

Esto hará que tus url sean así:
www.example.com/index.php/nombredelcontrolador/nombredelaaccion/parametro en vez
de www.example.com/nombredelcontrolador/nombredelaaccion/parametro.

Si estás instalando CakePHP en otro servidor diferente a Apache, encontrarás
instrucciones para que funcione la reescritura de URLs en la sección
url-rewriting

Ahora continúa hacia :doc:`/tutorials-and-examples/blog/part-two` para empezar
a construir tu primera aplicación en CakePHP.

.. meta::
    :title lang=es: Tutorial Blog
