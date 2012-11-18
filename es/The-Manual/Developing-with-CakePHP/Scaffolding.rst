Scaffolding
###########

El scaffolding (andamiaje) en aplicaciones es una técnica que permite a
un desarrollador definir y crear aplicaciones básicas que pueden crear,
leer, actualizar y borrar objetos. El scaffolding en CakePHP también
permite a los desarrolladores establecer los enlaces que vinculan unos
objetos con otros, y crear y romper dichos enlaces.

Todo lo que se necesita para crear un scaffold (andamio) es un modelo y
su controlador. Sólo tienes ahora que declarar la variable $scaffold en
el controlador y el proyecto estará en marcha.

El scaffolding de CakePHP mola bastante. Te permite tener una aplicación
CRUD básica funcional en minutos. Mola tanto, que querrás usarlo en
aplicaciones de producción. Nosotros pensamos también que mola, pero por
favor, ten en cuenta lo que el scaffoldding (andamiaje) es... bueno...
es solo una plataforma temporal. Una estructura precaria que levantas
rápidamente al inicio de un proyecto para poder arrancar. No fue pensada
para ser completamente flexible, fue pensada como una manera temporal de
iniciar un proyecto rápidamente. Si te encuentras realmente tratando de
personalizar la lógica de tus vistas, ha llegado el momento de derrumbar
el andamio y ponerse ha escribir código. La consola Bake de CakePHP,
cubierta en la siguiente sección, es tu gran segundo paso: genera todo
el código que produciría el mismo resultado que el más reciente de los
andamios.

El scaffolding es una manera fantastica de dar los primeros pasos de
desarrollo de una aplicación web. Los esquemas de base de datos
iniciales están sujetos a cambio, lo cual es perfectamente normal cuando
el proceso de diseño todavía no está maduro. Esto tiene un
inconveniente: un desarrollador web odia crear formularios para que
después no tengan un uso real. Así que CakePHP introduce el scaffolding
como una técnica para quitarle estrés al desarrollador. El scaffolding
analiza las tablas de tu base de datos y crea listas estándar con
botones para añadir, borrar y editar, formularios estándar de edición y
vistas estándar para inspeccionar elementos individuales de la base de
datos.

Para agregar scaffolding a tu aplicación, agrega la variable $scaffold
en el controlador:

::

    <?php

    class CategoriesController extends AppController {
        var $scaffold;
    }

    ?>

Si has creado la clase basica del modelo Category en el archivo
/app/models/category.php, ya estás listo para comenzar!. Visita
http://example.com/categories para ver tu nuevo scaffold.

El crear métodos en controladores que se hayan sido "scaffoldeados"
pueden causar resultados no deseados. Por ejemplo, si crea un método
index() en un controlador "scaffoldeado", su método index será mostrado
en lugar que la funcionalidad de scaffoling.

El scaffolding es reconocido por sus asociaciones de modelos, así que si
tu modelo Category pertenece a un User ["belongsTo" User], verás las IDs
del modelo User relacionadas en el listado del modelo Category. Si
quisieras ver algo aparte de un ID (como el apellido del usuario), lo
lograrás activando la variable $displayField en el modelo.

Inicializaremos la variable $displayField en nuestra clase de User para
que los usuarios relacionados con categorías serán mostrados por el
primer nombre en lugar de solo el ID en el scaffolding. Esta
característica hace el scaffolding más leíble en muchas circunstancias.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $displayField = 'first_name';
    }

    ?>

Creating a simple admin interface with scaffolding
==================================================

If you have enabled admin routing in your app/config/core.php, with
``Configure::write('Routing.prefixes', array('admin'));`` you can use
scaffolding to generate an admin interface.

Once you have enabled admin routing assign your admin prefix to the
scaffolding variable.

::

    var $scaffold = 'admin';

You will now be able to access admin scaffolded actions:

::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

This is an easy way to create a simple backend interface quickly. Keep
in mind that you cannot have both admin and non-admin methods scaffolded
at the same time. As with normal scaffolding you can override individual
methods and replace them with your own.

::

    function admin_view($id = null) {
      //custom code here
    }

Once you have replaced a scaffolded action you will need to create a
view file for the action as well.

Personalizando Vistas Scaffold
==============================

Si estás buscando para algo un poco diferente a tus vistas scaffolded,
puees crear templetes. Nosotros aún no recomendamos esta técnica para
aplicaciones de producción, pero semejante personalización puede ser muy
útil durante el esarrollo e prototipos.

La personalización se hace creando templetes de vistas:

::

    Vistas personalizadas para un controlador específico (para este ejemplo PostsController) debe ser colocado como lo siguiente:

    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp

    Las vistas scaffolding personalizadas para todos los controladores deberían ser colocadas como las siguientes:

    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

