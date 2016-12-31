Blog
####

Bienvenidos a CakePHP! Probablemente estás viendo este tutorial porque
deseas aprender más acerca de cómo funciona Cake. Es nuestro deseo
incrementar la productividad y hacer la programación más agradable:
esperamos que notes esto a medida que vayas avanzando con el tutorial.

Este tutorial te guiará para que puedas crear un blog simple.
Obtendremos e instalaremos Cake, creando la base de datos y
configurándola, y creando luego la lógica necesaria para mostrar,
añadir, editar y borrar posts del blog.

Esto es lo que necesitas:

#. Un servidor web. Aquí asumiremos que estás usando Apache, aunque las
   instrucciones para utilizar otros servidores deberían ser similares.
   Tal vez necesitemos jugar un poco con la configuración del servidor,
   pero la mayoría de pueden obtener y poner en marcha Cake sin
   modificar la configuración para nada.

#. Un servidor de base de datos. Nosotros utilizaremos MySQL es este
   tutorial. Deberás saber lo suficiente de SQL como para crear una base
   de datos: Cake se encarga del resto a partir de ahí.

#. Conocimiento básico de PHP. Cuanto más programación orientada a
   objetos hayas hecho, mejor, pero no tengas miedo si eres un fan de la
   programación procedural.

#. Finalmente, necesitarás un conocimiento básico del patrón MVC. Puedes
   darle un vistazo al capítulo "Comenzando con CakePHP", en la sección:
   `Entendiendo
   Modelo-Vista-Controlador </es/view/10/Entendiendo-Modelo-Vista-Controlador>`_.
   No te preocupes, es menos de una página.

Comencemos!

Obteniendo Cake
===============

Primero debemos conseguir una copia reciente de CakePHP.

Para esto debes visitar la sección del proyecto CakePHP en Cakeforge
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_
y descargar la versión estable. Para este tutorial vamos a usar la
1.2.x.x

También puedes obtener una copia mediante svn en
`https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/ <https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/>`_

Sin importar cómo hayas conseguido Cake, deber colocar los archivos en
el directorio raíz del servidor (*DocumentRoot*). Una vez terminado, los
directorios deberían lucir algo así:

::

    /ruta_al_directorio_raiz
        /app
        /cake
        /docs
        /vendors
        .htaccess
        index.php

Este es un buen momento para aprender un poco más acerca de cómo Cake
utiliza la estructura de directorios: puedes verlo en el capítulo
"Principios básicos de CakePHP", sección : `Estructura de archivos de
CakePHP </es/view/19/Estructura-de-archivos-de-CakePHP>`_.

Creando la Base de Datos del Blog
=================================

A continuación debemos crear la base de datos en la que se basará
nuestro blog. Lo primero que haremos será crear una tabla para almacenar
nuestros posts. También insertaremos algunos posts para poder
utilizarlos de testeo. Ejecuta el siguiente código SQL en tu base de
datos:

::

    /* Primero, crear la tabla para los posts: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Luego insertar algunos posts de ejemplo: */
    INSERT INTO posts (title,body,created)
        VALUES ('El título', 'Este es el cuerpo del post.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Un título otra vez', 'Y el cuerpo del post a continuación.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Título ataca de nuevo', 'Esto es realmente exitante! No.', NOW());

La elección de los nombres de la tabla y las columnas no es arbitrario.
Si sigues las convenciones de Cake relacionadas a la base de datos, y
las convenciones relacionadas a los nombres de las clases (puedes
consultar ambas en `"Convenciones de
CakePHP" </es/view/22/Convenciones-de-CakePHP>`_), tendrás la
posibilidad de aprovechar muchas ventajas y evitar la configuración.
Cake es lo suficientemente flexible como para acomodarse inclusive al
peor esquema de base de datos de aplicaciones antiguas, sin embargo, si
utilizas las convenciones ahorrarás mucho tiempo de desarrollo.

Puedes ver las `"Convenciones de
CakePHP" </es/view/22/Convenciones-de-CakePHP>`_ para más información,
pero es suficiente con decir que al llamar a la tabla 'posts'
automáticamente estará asociada con el modelo Post, y al tener los
campos 'modified' y 'created', éstos serán manejados automáticamente por
Cake.

Configuración de la Base de Datos en Cake
=========================================

Vamos a decirle a Cake dónde está nuestra base de datos y cómo
conectarse a ella. Para muchos, esta será la primera y última vez que
configuren algo.

Una copia del archivo de configuración de la base de datos se encuentra
en ``/app/config/database.php.default``. Haz una copia en el mismo
directorio, pero nombrándola ``database.php``.

El archivo de configuración debería ser fácil de seguir: sólo debes
reemplazar los valores en el arreglo ``$default`` con la información que
se corresponda a tu configuración. Un ejemplo completo deberíe verse
como el siguiente:

::

    var $default = array(
        'driver' => 'mysql',
        'persistent' => 'false',
        'host' => 'localhost',
        'port' => '',
        'login' => 'usuario_de_la_BD',
        'password' => 'c4k3-rUl3Z',
        'database' => 'tutorial_blog',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Una vez que hayas guardado el nuevo ``database.php``, deberías poder
abrir el navegador en la página de inicio de Cake y ver que puede
conectarse a la base de datos sin problemas.

Configuración Opcional
======================

Hay dos ítems más que pueden ser configurados. La mayoría de los
desarrolladores realiza estos pasos, pero para este tutorial no son
necesarios. El primero es definir una cadena (o "salt") para darle más
seguridad a los hash. El segundo ítem es darle acceso de escritura a
Cake, a su directorio ``tmp``.

La cadena de seguridad (o "salt") es usada para generar hashes. Puedes
cambiarla editando el archivo ``/app/config/core.php``. No importan
tanto cuál es el nuevo valor del salt, siempre y cuando no sea fácil de
adivinar.

::

    <?php
    /**
     * Una cadena aleatoria usada en los métodos de hashing de seguridad.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

La segunda tarea es darle al servidor web permisos de escritura sobre el
directorio ``app/tmp``. La mejor forma de hacer esto es encontrar con
qué nombre de usuario está corriendo el servidor
(``<?php echo `whoami`; ?>``) y cambiar el propietario de ``app/tmp`` a
ese usuario. El comando a ejecutar (en sistemas \*nix) puede lucir
similar a esto:

::

    $ chown -R www-data app/tmp

Si por alguna razón CakePHP no puede escribir en ese directorio, podrás
ver un aviso cuando te encuentres navegando la aplicación en modo debug.

Una aclaración para mod\_rewrite
================================

Es muy probable que los usuarios novatos tengan problemas con
mod\_rewrite, así que haremos una mención aquí. Si la página de
bienvenida de CakePHP se ve un poco rara (sin imágenes o estilos CSS),
probablemente no tengas funcionando el módulo mod\_rewrite en tu
sistema. Algunos consejos para que hacerlo funcionar:

#. Asegúrate que la sobreescritura (*override*) esté permitida
   (*allowed*): en tu httpd.conf, deberías tener una sección en la que
   se definen los permisos sobre cada Directorio en tu servidor.
   Asegúrate que ``AllowOverride`` esté puesto en ``All`` para el
   Directorio correcto. Por razones de seguridad y de performance, *no*
   setees ``AllowOverride`` en ``All`` dentro de ``<Directory />``. A su
   vez, busca el bloque ``<Directory>`` que haga referencia al
   directorio de tu sitio web..

#. Asegúrate que estás editando el httpd.conf correcto en vez de un
   httpd.conf específico de usuario o sitio web.

#. Por una u otra razón, puedes haber conseguido una copia de CakePHP
   sin los archivos .htaccess necesarios. Esto a veces sucede porque
   algunos sistemas operativos tratan a los archivos cuyo nombre
   comienza con '.' como ocultos, y no los copia. Asegúrate que tu copia
   de CakePHP proviene de la sección de descargas del sitio o desde
   nuestro repositorio SVN.

#. Asegúrate que Apache esté cargando mod\_rewrite correctamente!
   Deberías ver algo como
   ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``
   o (en Apache 1.3) ``AddModule             mod_rewrite.c`` en tu
   httpd.conf.

Si no quieres o no puedes hacer funcionar mod\_rewrite (o algún otro
módulo compatible), necesitarás usar las 'pretty' URLs proporcionadas
por CakePHP. En ``/app/config/core.php``, descomenta la línea que diga
algo como:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Also remove these .htaccess files:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

Esto hará que tus URLs se vean de la forma
www.example.com/index.php/controllername/actionname/param en vez de
www.example.com/controllername/actionname/param.

Crear un modelo Post
====================

La clase Model es el pan y manteca de las aplicaciones CakePHP. Creando
un modelo CakePHP que interactúe con nuestra base de datos, tendremos la
base para poder hacer luego nuestras acciones de vista, agregar, editar,
y eliminar.

Los archivos de clases de modelo de CakePHP van en la carpeta
``/app/models``, y el archivo que crearemos lo grabaremos en
``/app/models/post.php``. El archivo completo debería verse así:

::

    <?php

    class Post extends AppModel {
        var $name = 'Post';
    }

    ?>

La convención en la nomenclatura es muy importante en CakePHP. Nombrando
nuestro modelo como *Post*, CakePHP puede automáticamente inferir que
este modelo será usado en el controlador *PostsController*, y será atado
a la tabla de la base de datos llamada ``posts``.

CakePHP dinámicamente creará un objeto de modelo por ti, si no puede
encontrar el archivo correspondiente en /app/models. Esto también dice
que si nombras incorrectamente tu archivo (i.e. Post.php or posts.php)
CakePHP no reconocerá ninguna de tus configuraciones y usará las
opciones por defecto.

Siempre es una buena idea agregar la variable ``$name``, y suele
ahorrarnos problemas con los nombres de las clases en PHP4.

Para más información sobre modelos, como prefijos de tabla, callbacks, y
validación, revisar el capítulo `Models </es/view/66/>`_ del Manual.

Crear un controlador para Post
==============================

A continuación, crearemos un controlador para nuestros posts. El
controlador es donde existe toda la lógica del negocio para la
interacción con los posts. En pocas palabras, es el lugar en el que
juegas con los modelos y realizas el trabajo con los posts. Ubicaremos
este nuevo controlador en un archivo llamado ``posts_controller.php``
dentro del directorio ``/app/controllers``. Así es como debe verse un
controlador básico:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';
    }
    ?>

Ahora, agreguemos una acción a nuestro controlador. Las acciones a
menudo representan una función o una interfase en una aplicación. Por
ejemplo, cuando los usuarios ingresan www.example.com/posts/index (que
es lo mismo que www.example.com/posts/), esperan ver un listado de
posts. El código para esa acción se vería como esto:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }
    ?>

Déjenme explicar un poquito la acción. Definiendo la función ``index()``
en nuestro PostsController, los usuarios pueden ahora acceder a la
lógica ubicada en www.example.com/posts/index. De forma similar, si
definimos una función llamada ``foobar()``, los usuarios podrían acceder
a ella en www.example.com/posts/foobar.

Puede tentarte querer nombrar a tus controladores y acciones de cierta
forma para obtener cierto URL. Resiste la tentación. Sigue las
convenciones de CakePHP (nombres en plural para los controladores, etc.)
y crea nombres legibles y entendibles para las acciones. Puedes mapear
luego URLs a tu código usando "routes".

La única instrucción en la acción usa ``set()`` para pasar datos desde
el controlador a la vista (que crearemos a continuación). La línea
iguala la variable de vista llamada 'posts' al valor retornado por el
método del modelo Post ``find('all')``. Nuestro modelo Post está
disponible automáticamente en ``$this->Post`` porque hemos seguido la
convención de nombres de Cake.

Para aprender más sobre los controladores de Cake, chequea el capítulo
"Desarrollando con CakePHP": `"Controllers" </es/view/49/>`_.

Creando las Vistas(Views) de los Post
=====================================

Ahora que tenemos los datos que fluyen a nuestro modelo y la lógica de
nuestra aplicación y el flujo definido por nuestro controlador, vamos a
crear una vista (view) para la acción “index” que hemos creado
anteriormente.

Cake view(vistas) son solo fragmentos de presentaciones-sabrosas que se
adaptan dentro de las aplicaciones diseñadas. Para la mayoría de las
aplicaciones estaremos mezclando HTML con PHP, pero puede terminar
usando XML, CSV, o incluso de datos binarios.

Los Diseños (Layouts) de presentación son el código que se envuelve
alrededor de las vista (views), y pueden ser definidas y modificadas,
pero por ahora, vamos a usar el valor por defecto.

¿Recuerda que en la última sección la forma en que asigno la variable
"posts" a de la vista fue usando método ``set()``? La forma que
transmite datos a la vista sería algo como esto:

::

    // print_r($posts) output:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

Los archivos de las Cake’s views (vistas de cake) se almacenan en
``/app/views`` dentro de una carpeta con el nombre del controlador que
corresponden (tendremos que crear una carpeta llamada "posts" en este
caso). Para dar formato a los datos de los posts en un cuadro lindo, el
código de nuestra vista podría ser algo como esto:

::

    <!-- Archivo: /app/views/posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Aqui se hace el ciclo que recorre nuestros arreglo $posts , imprimiendo la información de cada post-->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'], 
    "/posts/view/".$post['Post']['id']); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

Creemos que esto debería ser algo sencillo.

Usted puede haber notado el uso de un objeto llamado ``$html``. Esta es
una instancia de la clase CakePHP ``HtmlHelper``. CakePHP viene con un
conjunto de "view helpers" (vistas de ayuda) que hacen cosas como la
vinculación, la forma de salida, manejo JavaScript y Ajax. Puede obtener
más información sobre cómo utilizarlas en el `capítulo "Built-in
Helpers" </es/view/181/>`_, pero lo que es importante señalar aquí es
que el método ``link()`` generará un vínculo HTML con un título
determinado (el primer parámetro) y la URL (la segunda parámetro).

Al especificar las URL en Cake, sólo tiene que dar una ruta relativa de
la base de la aplicación, y cake llena en el resto. Es así, que las URL
se suelen quedar de la forma de
/controlador/acción/parametro1/parametro2
(/controller/action/param1/param2).

En este punto, usted debería ser capaz de escribir en el navegador
http://www.example.com/posts/index. Usted debe observar en la vista, el
formato correcto con el título y la lista de los posts.

Si le sucedió que hizo click en uno de los enlaces que hemos creado en
esta vista (que vinculan el título de un post a una URL
/posts/view/some\_id), probablemente ha sido informado por CakePHP que
la acción aún no ha sido definida. Si no recibió el informe, es que algo
ha ido mal, o que realmente ya la a definido, en cuyo caso es muy
astuto. De lo contrario, la vamos a crear ahora en el PostsController:

::

    <?php
    class PostsController extends AppController {

        var $name = 'Posts';

        function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        function view($id = null) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
        }
    }
    ?>

La llamada ``set()`` les debe lucir familiar. Informamos de que estamos
usando ``read()`` en lugar de ``find('all')`` porque realmente solo
queremos la información de un único post.

Tenga en cuenta que la acción de nuestra vista toma un parámetro: la ID
del post que nos gustaría ver. Este parámetro se entrega a la acción a
través de la URL solicitada. Si un usuario solicita /posts/view/3,
entonces el valor '3' es pasado como ``$id``.

Ahora vamos a crear la vista para las “view” de nuestra nueva acción y
lo colocaremos en /app/views/posts/view.ctp.

::

    <!-- archivo: /app/views/posts/view.ctp -->

    <h1><?php echo $post['Post']['title']?></h1>

    <p><small>Created: <?php echo $post['Post']['created']?></small></p>

    <p><?php echo $post['Post']['body']?></p>

Verifique que esto esta funcionando en los vínculos de /posts/index o
manualmente solicitando un post accediendo a /posts/view/1.

Agregando Posts
===============

Leer y mostrar de la base de datos nuestros post’s es un gran comienzo,
pero debe habilitarse para agregar nuevos post’s.

En primer lugar, empezar por crear la acción ``add()`` controlador
PostsController:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';

        function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());

        }

        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

Lo que esta acción ``add()`` hace es lo siguiente: si los datos del
formulario presentado no están vacíos, trate de guardar los datos
utilizando el modelo Post. Si por alguna razón, no guarda, simplemente
hacer que se quede en la vista. Esto nos da la oportunidad de mostrar
los errores de validación de usuario u otras advertencias.

Cuando un usuario utiliza un formulario de datos POST en su aplicación,
esta información está disponible en ``$this->data``. Usted puede usar
las funciones ``pr()`` o ``debug`` para imprimir, si quieres ver como
luce esto.

Usamos la función del componente ``Session``
```setFlash()`` </es/view/400/setFlash>`_ para adjuntar un mensaje a una
variable de sesión que se mostrará en la página después de la
redirección. En el diseño tenemos
```$session->flash()`` </es/view/568/flash>`_ , que muestra el mensaje y
borra la variable de sesión correspondiente. La función
```redirect`` </es/view/425/redirect>`_\ del controlador redirige a otra
dirección URL. El parámetro ``array('action'=>'index)`` se traduce en la
URL /posts es decir, la acción index del controlador posts. Puede
referirse a
`Router::url <https://api.cakephp.org/class/router#method-Routerurl>`_ en
función de la API para ver los formatos en los que se puede especificar
una dirección URL para diversas funciones de cake.

Llamando al método ``save()`` haremos comprobación de errores de
validación y abortar el guardado si algo ocurre. Hablaremos de cómo se
manejan los errores en las siguientes secciones.

Validación de Datos
===================

Cake lleva un largo camino recogiendo la monotonía de la validación de
formularios de entrada. Todo el mundo odia a la codificación de sus
infinitos formularios y rutinas de validación. CakePHP hace que sea más
fácil y más rápido.

Para aprovechar las características de la validación, tendrás que
utilizar FormHelper de Cake en tus vistas. El FormHelper está disponible
por defecto en todas las vista en ``$form``.

Esta es nuestra Vista Agregar(add view):

::

    <!-- File: /app/views/posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $form->create('Post');
    echo $form->input('title');
    echo $form->input('body', array('rows' => '3'));
    echo $form->end('Save Post');
    ?>

Aquí, nosotros usamos el FormHelper para generar la etiqueta de apertura
de un formulario HTML. Aquí está el código HTML que genera
``$form->create()`` :

::

    <form id="PostAddForm" method="post" action="/posts/add">

Si ``create()`` es llamado sin suministrarle parámetros, este supone que
está construyendo un formulario que suministra datos a la acción
``add()`` (o a la acción ``edit()`` cuando el parámetro ``id`` esta
incluído en los datos del formulario
(``$form->data``)), a través del metodo POST.

El método ``$form->input()`` es utilizado para crear elementos de
formulario del mismo nombre. El primer parámetro le dice a CakePHP a que
campo corresponden, y el segundo parámetro le permite especificar una
amplia gama de opciones - en este caso, el número de filas para el
textarea. Hay un poco de introspección y automátizacion aquí:
``input()`` es la salida de diferentes elementos basados en el modelo
del campo especificado.

El ``$form->end()`` genera una llamada al botón de enviar y termina el
formulario. Si una cadena se suministra como el primer parámetro a
``end()``, FormHelper producirá un botón de enviar con ese nombre
seguido del cierre de la etiqueta. Una vez más, consulte el `Chapter
"Built-in Helpers" </es/view/181/>`_ para conocer más acerca de los
helpers.

Ahora vamos a volver y actualizar nuestro ``/app/views/posts/index.ctp``
para incluir un nuevo enlace "Añadir entrada". Antes de el ``<table>``,
añada la siguiente línea:

::

    <?php echo $html->link('Add Post',array('controller' => 'posts', 'action' => 'add'))?>

Puede estar preguntandose: ¿cómo le digo a mi CakePHP sobre los
requisitos de validación? Las reglas de validación se definen en el
modelo. Vamos a mirar atrás en nuestro modelo y después haremos algunos
ajustes:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>

El arreglo ``$validate`` le dice a CakePHP cómo validar sus datos cuando
el método se llama ``save()`` . Aquí, he especificado que tanto el campo
cuerpo como el campo título no deben estar vacíos. El motor de
validación de CakePHP es fuerte, con una serie de normas pre-construidas
(números de tarjetas de crédito, direcciones de correo electrónico, etc)
y la flexibilidad para añadir sus propias reglas de validación. Para
obtener más información sobre esta configuración, consulte el `Capítulo
Validación de Datos </es/view/125/data-validation>`_.

Ahora que tiene las reglas de validación en su lugar, utilice la
aplicación para tratar de añadir un post con un título o el cuerpo vacío
para ver cómo funciona. Como hemos utilizado el método ``input()`` del
componente FormHelper para crear elementos de nuestro formulario,
nuestros mensajes de error de validación se mostrará automáticamente.

Borrando Posts
==============

A continuación, vamos a crear un medio para que los usuarios eliminen
post’s. Comenzaremos con la acción ``delete()`` en el PostsController:

::

    function delete($id) {
        $this->Post->del($id);
        $this->Session->setFlash('The post with id: '.$id.' has been deleted.');
        $this->redirect(array('action'=>'index'));
    }

Esta lógica es eliminar el post por $ id, y utiliza
``$this->Session->setFlash()`` para mostrar al usuario un mensaje de
confirmación después de la reorientación a /posts.

Porque estamos sólo ejecutando una lógica y redireccionando, esta acción
no tiene ninguna vista. Es posible que desee actualizar su vista de
índice (index) con vínculos que permitan a los usuarios eliminar posts,
entonces:

::

    /app/views/posts/index.ctp

    <h1>Blog posts</h1>
    <p><?php echo $html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Aquí esta el ciclo que muestra $posts a través de nuestro arreglo, imprimiendo la información de los posts -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
            <?php echo $html->link($post['Post']['title'], array('action' => 'view', 'id' => $post['Post']['id']));?>
            </td>
            <td>
            <?php echo $html->link('Delete', array('action' => 'delete', $post['Post']['id']), null, 'Are you sure?' )?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>

    </table>

El código de esta vista también utiliza HtmlHelper para que pregunte al
usuario con un diálogo de confirmación JavaScript de antes de intentar
borrar un post.

Editando Posts
==============

Editando Post: ¡aquí vamos! Eres un CakePHP pro por ahora, por lo que
deberías haber adoptado un patrón. Hacer la acción, luego la vista. Aquí
esta la acción ``edit()`` del PostsController que se vería como:

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

Esta acción primero chequea los datos del formulario para enviarlos. Si
no fue enviado, este busca el post y se lo pasa a la vista. Si algunos
datos *se* han enviado, intenta guardar los datos utilizando el modelo
Post (o los rechazará y mostrara al usuario los errores de validación).

La vista de edición puede tener un aspecto parecido a este:

::

    /app/views/posts/edit.ctp
        
    <h1>Edit Post</h1>
    <?php
        echo $form->create('Post', array('action' => 'edit'));
        echo $form->input('title');
        echo $form->input('body', array('rows' => '3'));
        echo $form->input('id', array('type'=>'hidden')); 
        echo $form->end('Save Post');
    ?>

Esta vista muestra el formulario de edición (con los valores de
publicados), junto con los mensajes de errores de validación necesarios.

Cabe destacar aquí: que CakePHP asumirá que usted está editando un
registro si el campo 'id' está presente en el arreglo de datos. Si 'id'
no está presente (mirar hacia atrás en nuestra opinión de añadir), Cake
asumirá que usted está añadiendo un nuevo registro para llamar a
``save()``

Ahora puede actualizar su vista de indice, con enlaces para ir a editar
posts específicos:

::

    /app/views/posts/index.ctp (edit links added)
        
    <h1>Blog posts</h1>
    <p><?php echo $html->link("Add Post", array('action'=>'add')); ?>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Aqui se hace el ciclo que recorre nuestros arreglo $posts , imprimiendo la información de cada post -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $html->link($post['Post']['title'],array('action'=>'view', 'id'=>$post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $html->link(
                    'Delete', 
                    array('action'=>'delete', 'id'=>$post['Post']['id']), 
                    null, 
                    'Are you sure?'
                )?>
                <?php echo $html->link('Edit', array('action'=>'edit', 'id'=>$post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>

    </table>

Rutas
=====

Para algunos, el enrutamiento por defecto de CakePHP funciona lo
suficientemente bien. Los desarrolladores que son sensibles a la
facilidad de uso y compatibilidad del motor de búsqueda general aprecian
la forma en que CakePHP URL mapea acciones específicas. Así que vamos a
hacer un cambio rápido a las rutas en este tutorial.

Para obtener más información sobre las técnicas avanzadas de
enrutamiento, consulte `"Configuración de Rutas" </es/view/46/>`_.

Por defecto, CakePHP responde a una petición de la raíz de su sitio (es
decir, http://www.example.com) con su PagesController, haciendo una
vista llamada "home". En lugar de ello, vamos a sustituir esto con
nuestros PostsController mediante la creación de una regla de
enrutamiento.

El enrutamiento de Cake se encuentra en ``/app/config/routes.php``.
Usted querrá comentar o eliminar la línea que define la ruta raíz
predeterminada. El aspecto que presenta es:

::

    Router::connect ('/', array('controller'=>'pages', 'action'=>'display', 'home'));

Esta línea conecta a la URL "/" con la página de inicio por defecto de
CakePHP. Queremos que esto se conecte con nuestro propio controlador,
por lo que añadiremos una línea que tiene que ver asi:

::

    Router::connect ('/', array('controller'=>'posts', 'action'=>'index'));

Esto debe conectar a los usuarios que solicitan '/' a la acción índex()
de nuestra pronto-a-ser-creado PostsController.

CakePHP también hace uso de "enrutamiento inverso" - si con la citada
ruta que definió ``array('controller'=>'posts', 'action'=>'index')``
pasa a una función que espera un arreglo, la url resultante utilizada es
'/'. Es, por tanto, una buena idea utilizar siempre los arreglos
(arrays) de urls como rutas, esto significa definir a dónde va una url,
y también se asegura de que los enlaces llevan al mismo sitio.

Conclusión
==========

Creado aplicaciones de esta manera ganará paz, honor, amor, y dinero,
incluso más allá de sus fantasías más salvajes. Simple, ¿no? Tenga en
cuenta que este tutorial es muy básico. CakePHP tiene *muchas* más
características que ofrecer, y es flexible en formas que no se quiso
cubrir aquí para simplificar. Utilice el resto de este manual como una
guía para la construcción de aplicaciones con más ricas-características.

Ahora que ha creado la base de una aplicación Cake está listo para algo
real. Comience su propio proyecto, lea el resto del `Manual </es/>`_ y
`API <https://api.cakephp.org>`_.

Si necesita ayuda, vengan a vernos en el #cakephp. Bienvenido a CakePHP!
