Translate
#########

TranslateBehavior es bastante fácil de configurar y trabaja fuera de la
caja con muy poca configuración. En esta sección, usted aprenderá cómo
añadir y configurar el comportamiento (behavior) para usarlo en
cualquier modelo.

Inicializando las tablas de la Base de datos i18n
=================================================

Puede utilizar la consola de CakePHP o puede crearlo manualmente. Se
recomienda utilizar la consola para esto, por que podrían pasar que
hallan cambios de diseño en las futuras versiones de CakePHP. Si lo
haces por consola, puedes estar seguro que tiene el correcto diseño.

::

    ./cake i18n

Seleccione ``[I]`` y se ejecuta el script e inicializa la Base de datos
i18n. Se le preguntará si desea eliminar cualquiera que exista y si
desea crearla.Responde un Sí, si usted esta seguro de que no existe una
tabla i18n, y responda con Sí para crear la tabla de nuevo.

Adjuntando el Comportamiento de Traducción a tus Modelos
========================================================

Se debe incorporar al modelo haciendo uso de la propiedad ``$actsAs``
como en el siguiente ejemplo.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate'
        );
    }
    ?>

Esto no hará nada aún, pues es necesario configurar algunas opciones
antes de comenzar a funcionar. Se deben definir qué campos de el modelo
actual serán rastreados en la tabla de traducciones creada en el paso
anterior.

Definiendo los Campos
=====================

Se pueden establecer los campos simplemente extendiendo el valor
``'Translate'`` con otro array, por ejemplo:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'campoUno', 'campoDos', 'campoN'
            )
        );
    }
    ?>

Luego de haber hecho esto (por ejemplo poner "nombre" como uno de los
campos) ya has terminado la configuración básica. Genial! De acuerdo con
el ejemplo anterior, ahora el modelo debería verse algo así:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'nombre'
            )
        );
    }
    ?>

Conclusiones
============

Desde ahora en cada actualización/creación de un registro hará que
TranslateBehavior copie el valor "nombre" en la tabla de traducciones
(por defecto: i18n) de acuerdo a la localización actual. Una
localización corresponde al identificador de una lengua

La *localización actual* es el valor actual de
``Configure::read('Config.language')``. El valor de *Config.language* es
establecido en la Clase L10n - a no ser que ya se haya establecido. Sin
embargo, TranlateBehavior te permite invalidar esto último 'al vuelo',
lo cual permite al usuario de tus páginas crear multiples versiones sin
la necesidad de que este cambie sus preferencias. Más sobre esto en la
siguiente sección.

Obtener todos los registros de traducción para un campo determinado
===================================================================

Si se desea obtener todos los registros de traducción asociados al
modelo actual, simplemente se extiende el *arreglo de campos* en la
configuracion como se muestra abajo. El nombre se puede definir sin
restricciones

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name' => 'nameTranslation'
            )
        );
    }
    ?>

Con esta configuración el resultado de find() se verá similar a esto:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )

             )
    )

**Nota**: El registro del modelo contiene un campo *virtual* llamado
"locale", el cual indica que "locale" es usado en el resultado.

Using the bindTranslation method
--------------------------------

You can also retrieve all translations, only when you need them, using
the bindTranslation method

``bindTranslation($fields, $reset)``

``$fields`` is a named-key array of field and association name, where
the key is the translatable field and the value is the fake association
name.

::

    $this->Post->bindTranslation(array ('name' => 'nameTranslation'));
    $this->Post->find('all', array ('recursive'=>1)); // need at least recursive 1 for this to work.

With this setup the result of your find() should look something like
this:

::

    Array
    (
         [Post] => Array
             (
                 [id] => 1
                 [name] => Beispiel Eintrag 
                 [body] => lorem ipsum...
                 [locale] => de_de
             )

         [nameTranslation] => Array
             (
                 [0] => Array
                     (
                         [id] => 1
                         [locale] => en_us
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Example entry
                     )

                 [1] => Array
                     (
                         [id] => 2
                         [locale] => de_de
                         [model] => Post
                         [foreign_key] => 1
                         [field] => name
                         [content] => Beispiel Eintrag
                     )

             )
    )

Saving in another language
==========================

You can force the model which is using the TranslateBehavior to save in
a language other than the on detected.

To tell a model in what language the content is going to be you simply
change the value of the ``$locale`` property on the model before you
save the data to the database. You can do that either in your controller
or you can define it directly in the model.

**Example A:** In your controller

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // we are going to save the german version
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>

**Example B:** In your model

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Option 1) just define the property directly
        var $locale = 'en_us';
        
        // Option 2) create a simple method 
        function setLanguage($locale) {
            $this->locale = $locale;
        }
    }
    ?>

Multiple Translation Tables
===========================

If you expect a lot entries you probably wonder how to deal with a
rapidly growing database table. There are two properties introduced by
TranslateBehavior that allow to specify which "Model" to bind as the
model containing the translations.

These are **$translateModel** and **$translateTable**.

Lets say we want to save our translations for all posts in the table
"post\_i18ns" instead of the default "i18n" table. To do so you need to
setup your model like this:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Use a different model (and table)
        var $translateModel = 'PostI18n';
    }
    ?>

**Important** is that you have to pluralize the table. It is now a usual
model and can be treated as such and thus comes with the conventions
involved. The table schema itself must be identical with the one
generated by the CakePHP console script. To make sure it fits one could
just initialize a empty i18n table using the console and rename the
table afterwards.

Create the TranslateModel
-------------------------

For this to work you need to create the actual model file in your models
folder. Reason is that there is no property to set the displayField
directly in the model using this behavior yet.

Make sure that you change the ``$displayField`` to ``'field'``.

::

    <?php
    class PostI18n extends AppModel { 
        var $displayField = 'field'; // important
    }
    // filename: post_i18n.php
    ?>

That's all it takes. You can also add all other model stuff here like
$useTable. But for better consistency we could do that in the model
which actually uses this translation model. This is where the optional
``$translateTable`` comes into play.

Changing the Table
------------------

If you want to change the name of the table you simply define
$translateTable in your model, like so:

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Use a different model
        var $translateModel = 'PostI18n';
        
        // Use a different table for translateModel
        var $translateTable = 'post_translations';
    }
    ?>

Please note that **you can't use $translateTable alone**. If you don't
intend to use a custom ``$translateModel`` then leave this property
untouched. Reason is that it would break your setup and show you a
"Missing Table" message for the default I18n model which is created in
runtime.
