Scaffolding
###########

El scaffolding (creación de plataformas temporales) en aplicaciones es
una técnica que permite a un desarrollador definir y crear aplicaciones
básicas que pueden crear, retirar, actualizar y borrar objetos. El
scaffolding en CakePHP también permite a los desarrolladores definir
cómo los objetos están relacionados unos con otros, y para crear y
romper estos enlaces.

Todo lo que se necesita para crear un scaffold (plataforma temporal) es
un modelo y su controlador. Una vez que se declare la variable $scaffold
en el controlador, ya estas listo y corriendo.

El scaffolding de CakePHP es bastante agradable. Te permite tener una
aplicación CRUD básica funcional en minutos. Es tan agradable, que
querrás usarla en aplicaciones de producción. Ahora, nosotros pensamos
que es agradable también, pero por favor, ese cuenta lo que el
scaffoldding (plataforma temporal) es... bueno... es solo una plataforma
temporal. Su estructura flexible la deshaces rápidamente al inicio de un
proyecto para poder iniciar. No fue pensada para ser completamente
flexible, fue pensada como una manera temporal de iniciar un proyecto
rápidamente. Si usted se encuentra realmente tratando de personalizar la
lógica en sus vistas, es momento de derrumbar su scaffolding para poder
escribir más código. La consola Bake de CakePHP, vista en la siguiente
sección, es un gran segundo paso: genera todo el código que produciría
el mismo resultado que el más reciente escalonado.

Scaffolding es una gran manera de iniciar las primeras partes de una
aplicación web iniciada. Los esquemas de bases de datos tempranos son
sujetos a cambios, lo cual es perfectamente normal en una parte temprana
del proceso de diseño. Esto tiene su inconveniente: un desarrollador web
detesta formas que nunca serán utilizadas. Para reducir el estrés en el
desarrollador, el scaffolding ha sido incluido en CakePHP. El
scaffolding analiza sus tablas en la base de datos y crea listas
estandard con botones de agregar, borrar y editar, forms estandar para
editar y vistas estandar para inspeccionar un único elemento en la base
de datos.

Para agregar scaffolding a tu aplicación, en el controlador, , agrega la
variable $scaffold:

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
tu modelo Category pertenece a un User ["belongsTo" User], usted verá
las IDs del modelo User relacionadas en el listado del modelo Category.
Si usted quisiera ver algo aparte de un ID (como el apellido del
usuario), lo logrará activando la variable $displayField en el modelo.

Inicializaremos la variable $displayField en nuestra clase de User para
que los usuarios relacionados con categorías serán mostrados por el
primer nombre en lugar de solo el ID en el scaffolding. Esta
característica hace el scaffolding más leíble en muchas instancias.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $displayField = 'first_name';
    }

    ?>

Creación de una interfaz sencilla de administración con scaffolding
===================================================================

Si Ud. tiene habilitado el enrutamieto de admin en su carpeta
app/config/core.php, con el código
``Configure::write('Routing.admin', 'admin');`` puede utilizar
scaffolding para generar una interfaz de administración.

Una ves habilitado el enrutamieto de admin asigne su prefijo ’admin’ a
la variable de andamiaje

::

    var $scaffold = 'admin';

Ahora Ud. podrá acceder a las acciones de administración del andamiaje
creado por scaffold:

::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

Esta es una manera fácil de crear rápidamente una interfaz sencilla de
backend. Tenga en mente que Ud. no puede tener a la vez ambos métodos de
scaffold: admin y no-admin. Como ocurre con el andamiaje normal puede
sobreescribir los métodos individuales y reemplazarlos con el suyo
propio.

::

    function admin_view($id = null) {
      //custom code here
    }

Una vez que Ud. ha reemplazado una acció de andamiaje (scaffold) también
necesitará crear un archivo de vista.

Personalizando Vistas Scaffold
==============================

Si estás buscando para algo un poco diferente a tus vistas scaffolded,
puees crear templetes. Nosotros aún no recomendamos esta técnica para
aplicaciones de producción, pero semejante personalización puede ser muy
útil durante el desarrollo de prototipos.

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

