Helpers
#######

Los Helpers son clases similares a componentes para la capa de presentación de tu aplicación.
Contienen lógica de presentación que se comparte entre muchas vistas, elementos o diseños.
Este capítulo te mostrará cómo configurar los helpers, cómo cargarlos y usarlos, y te guiará
en los simples pasos para crear tus propios helpers personalizados.

CakePHP incluye varios helpers que ayudan en la creación de vistas. Ayudan en la creación de
estructuras bien formadas (incluyendo formularios), ayudan en el formato de texto, horas y números,
e incluso pueden acelerar la funcionalidad AJAX. Para obtener más información sobre los helpers
incluidos en CakePHP, consulta el capítulo correspondiente para cada helper:

.. toctree::
    :maxdepth: 1

    /views/helpers/breadcrumbs
    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

Configurando Helpers
====================

Configuras los helpers en CakePHP declarándolos en una clase de vista. Cada aplicación
CakePHP incluye una clase ``AppView`` que es el lugar ideal para añadir helpers para su uso global::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->addHelper('Html');
            $this->addHelper('Form');
            $this->addHelper('Flash');
        }
    }

Para añadir helpers desde plugins, utiliza la :term:`Sintaxis de plugin` utilizada en otros lugares en CakePHP::

    $this->addHelper('Blog.Comment');

No es necesario añadir explícitamente los Helpers que provienen de CakePHP o de tu aplicación. Estos helpers se pueden cargar de forma tardía (lazy loaded) cuando se utilizan por primera vez. Por ejemplo::

    // Carga el FormHelper si aún no se ha añadido/cargado explícitamente.
    $this->Form->create($article);

Desde las vistas de un plugin, los helpers del plugin también se pueden cargar de forma tardía. Por ejemplo, las plantillas de vista en el plugin 'Blog' pueden cargar los helpers del mismo plugin.

Carga Condicional de Helpers
----------------------------

Puedes utilizar el nombre de la acción actual para añadir helpers de forma condicional::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            if ($this->request->getParam('action') === 'index') {
                $this->addHelper('ListPage');
            }
        }
    }

También puedes utilizar el método ``beforeRender`` de tu controlador para añadir helpers::

    class ArticlesController extends AppController
    {
        public function beforeRender(EventInterface $event)
        {
            parent::beforeRender($event);
            $this->viewBuilder()->addHelper('MyHelper');
        }
    }

Opciones de Configuración
-------------------------

Puedes pasar opciones de configuración a los helpers. Estas opciones se pueden utilizar para establecer valores de atributos o modificar el comportamiento de un helper::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {
        public function initialize(array $config): void
        {
            debug($config);
        }
    }

Por defecto, todas las opciones de configuración se fusionarán con la propiedad ``$_defaultConfig``. Esta propiedad debe definir los valores por defecto de cualquier configuración que tu helper requiera. Por ejemplo::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {
        use StringTemplateTrait;

        /**
         * @var array<string, mixed>
         */
        protected $_defaultConfig = [
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
    }

Cualquier configuración proporcionada al constructor de tu helper se fusionará con los valores por defecto durante la construcción y los datos fusionados se establecerán en ``_config``. Puedes utilizar el método ``getConfig()`` para leer la configuración en tiempo de ejecución::

    // Lee la opción de configuración autoSetCustomValidity .
    $class = $this->Awesome->getConfig('autoSetCustomValidity ');

Usar la configuración del helper te permite configurar declarativamente tus helpers y mantener la lógica de configuración fuera de las acciones de tu controlador. Si tienes opciones de configuración que no se pueden incluir como parte de una declaración de clase, puedes configurarlas en el callback ``beforeRender`` de tu controlador::

    class PostsController extends AppController
    {
        public function beforeRender(EventInterface $event)
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig(),
            ]);
        }
    }

.. _aliasing-helpers:

Alias de Helpers
----------------

Un ajuste común para usar es la opción ``className``, que te permite crear alias para los helpers en tus vistas. Esta característica es útil cuando quieres reemplazar ``$this->Html`` u otra referencia común de Helper con una implementación personalizada::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize(): void
        {
            $this->addHelper('Html', [
                'className' => 'MyHtml',
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
        // Agrega tu código para sobrescribir el HtmlHelper principal
    }

Lo anterior haría que ``MyHtmlHelper`` se pudiera utilizar usando el *alias* ``$this->Html`` en tus vistas.

.. note::

    Hacer un alias de un helper reemplaza esa instancia en cualquier lugar donde se utilice ese helper, incluso dentro de otros Helpers.

Usar Helpers
=============

Una vez que hayas configurado qué helpers quieres usar en tu controlador, cada helper se expone como una propiedad pública en la vista. Por ejemplo, si estás utilizando el :php:class:`HtmlHelper`, podrías acceder a él haciendo lo siguiente::

    echo $this->Html->css('styles');

Lo anterior llamaría al método ``css()`` en el HtmlHelper. Puedes acceder a cualquier helper cargado usando ``$this->{$nombreDelHelper}``.

Cargar Helpers Dinámicamente
----------------------------

Puede haber situaciones en las que necesites cargar dinámicamente un helper desde dentro de una vista. Puedes usar el :php:class:`Cake\\View\\HelperRegistry` de la vista para hacer esto::

    // Cualquiera de los dos funciona.
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

El HelperRegistry es un :doc:`registro </core-libraries/registry-objects>` y es compatible con la API de registro utilizada en otros lugares en CakePHP.

Métodos de Eventos
==================

Los helpers tienen varios métodos que se ejecutan con determinados eventos yque te permiten cambiar el proceso de renderización de la vista. Consulta el :ref:`helper-api` y la documentación de :doc:`/core-libraries/events` para obtener más información.

Creación de Helpers
===================

Puedes crear clases de helper personalizadas para su uso en tu aplicación o plugins. Al igual que la mayoría de los componentes de CakePHP, las clases de helper tienen algunas convenciones:

* Los archivos de clase del helper deben colocarse en **src/View/Helper**. Por ejemplo:
  **src/View/Helper/LinkHelper.php**
* Los nombres de las clases de helper deben llevar el sufijo ``Helper``. Por ejemplo: ``LinkHelper``.
* Al hacer referencia a los nombres de los helper, debes omitir el sufijo ``Helper``. Por ejemplo: ``$this->addHelper('Link');`` o ``$this->loadHelper('Link');``.

También querrás extender ``Helper`` para asegurarte de que todo funcione correctamente::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // Lógica para crear un enlace con formato especial va aquí...
        }
    }

Inclusión de otros Helpers
--------------------------

Es posible que desees utilizar alguna funcionalidad ya existente en otro helper. Para hacerlo, puedes especificar los helpers que deseas utilizar con un array ``$helpers``, formateado de la misma manera que en un controlador::

    /* src/View/Helper/LinkHelper.php (usando otros helpers) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        protected $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // Usa el helper HTML para generar
            // Datos formateados:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }

.. _using-helpers:

Usando tu nuevo Helper
----------------------

Una vez que hayas creado tu helper y lo hayas colocado en **src/View/Helper/**, puedes cargarlo en tus vistas::

    class AppView extends View
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->addHelper('Link');
        }
    }

Una vez que se ha cargado tu helper, puedes usarlo en tus vistas accediendo a la propiedad de vista correspondiente::

    <!-- crea un enlace usando el nuevo helper -->
    <?= $this->Link->makeEdit('Cambiar esta Receta', '/recipes/edit/5') ?>

.. note::

    El ``HelperRegistry`` intentará cargar de forma tardía cualquier helper que no esté
    específicamente identificado en tu ``Controller``.

Acceso a Variables de Vista dentro de tu Helper
-----------------------------------------------

Si deseas acceder a una variable de vista dentro de un helper, puedes utilizar ``$this->getView()->get()`` como sigue::

    class AwesomeHelper extends Helper
    {
        public $helpers = ['Html'];

        public function someMethod()
        {
            // establece la meta descripción
            return $this->Html->meta(
                'description', $this->getView()->get('metaDescription'), ['block' => 'meta']
            );
        }
    }

Renderizar un Elemento de Vista dentro de tu Helper
----------------------------------------------------

Si deseas renderizar un elemento dentro de tu Helper, puedes usar ``$this->getView()->element()`` como sigue::

    class AwesomeHelper extends Helper
    {
        public function someFunction()
        {
            return $this->getView()->element(
                '/ruta/a/elemento',
                ['foo'=>'bar','bar'=>'foo']
            );
        }
    }

.. _helper-api:

Clase Helper
============

.. php:class:: Helper

Métodos de Eventos
-------------------

Implementando un método de evento en un helper, CakePHP suscribirá automáticamente tu helper al evento relevante. A diferencia de las versiones anteriores de CakePHP, *no* debes llamar a ``parent`` en tus métodos, ya que la clase base Helper no implementa ninguno de los métodos de evento.

.. php:method:: beforeRenderFile(EventInterface $event, $viewFile)

    Se llama antes de renderizar cada archivo de vista. Esto incluye elementos, vistas, vistas principales y diseños (layouts).

.. php:method:: afterRenderFile(EventInterface $event, $viewFile, $content)

    Se llama después de renderizar cada archivo de vista. Esto incluye elementos, vistas, vistas principales y diseños (layouts). Este evento puede modificar y devolver ``$content`` para cambiar cómo se mostrará el contenido renderizado en el navegador.

.. php:method:: beforeRender(EventInterface $event, $viewFile)

    El método beforeRender se llama después del método beforeRender del controlador pero antes de que el controlador renderice la vista y el diseño (layout). Recibe el archivo que se está renderizando como argumento.

.. php:method:: afterRender(EventInterface $event, $viewFile)

    Se llama después de que la vista ha sido renderizada pero antes de que comience el renderizado del diseño (layout).

.. php:method:: beforeLayout(EventInterface $event, $layoutFile)

    Se llama antes de que comience el renderizado del diseño (layout). Recibe el nombre del archivo del diseño como argumento.

.. php:method:: afterLayout(EventInterface $event, $layoutFile)

    Se llama después de que se haya completado el renderizado del diseño (layout). Recibe el nombre del archivo del diseño (layout) como argumento.

.. meta::
    :title lang=es: Helpers
    :keywords lang=en: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
