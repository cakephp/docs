Хелперы
#######

Хелперы - это схожие с компонентами классы, для слоя представления вашего
приложения. Они содержат логику визуализации, которая является общей для
представлений, элементов или макетов. Эта глава покажет вам как настраивать
хелперы, как их загружать и использовать, а также опишет простые шаги для
создания ваших собственных хелперов.

CakePHP включает ряд хелперов, помогающих в создании представлений. Они
помогают в создании хорошо структурированной разметки (включая формы); в
форматировании текста, чисел, и могут даже повысить производительность
AJAX-запросов. Для более подробной информации о хелперах, входящих в
состав CakePHP, ознакомьтесь с главами рассказывающими о каждом хелпере:

.. toctree::
    :maxdepth: 1

    /views/helpers/breadcrumbs
    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/rss
    /views/helpers/session
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

Настройка хелперов
==================

Вы загружаете хелперы в CakePHP, объявляя их в классе представления. Класс
``AppView`` входит в состав каждого приложения CakePHP и является идеальным
местом для загрузки хелперов::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Html');
            $this->loadHelper('Form');
            $this->loadHelper('Flash');
        }
    }

Для загрузки хелперов из плагинов используйте :term:`plugin syntax`,
используемый повсеместно в CakePHP::

    $this->loadHelper('Blog.Comment');

Вы не обязаны явно загружать хелперы, входящие в состав CakePHP или вашего
приложения. Эти хелперы могут быть лениво загружены при первом
использовании. Например::

    // Загружается FormHelper если он еще не был загружен.
    $this->Form->create($article);

Из представлений, входящих в состав плагинов, хелперы плагинов также могут
быть лениво загружены. Например, шаблоны представления в плагине 'Blog'
могут лениво загружать хелперы из этого же плагина.

Загрузка хелперов по условию
----------------------------

Вы можете использовать имя текщего экшена, чтобы загружать хелперы по
условию::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            if ($this->request->getParam('action') === 'index') {
                $this->loadHelper('ListPage');
            }
        }
    }

Вы можете также использовать метод ``beforeRender()`` вашего контроллера для
загрузки хелперов::

    class ArticlesController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $this->viewBuilder()->helpers(['MyHelper']);
        }
    }

Параметры конфигурации
----------------------

Вы можете передавать параметры конфигурации хелперам. Эти параметры могут быть
для установки значений атрибутов, либо для изменения поведения хелпера::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {

        // Хук initialize() доступен с версии 3.2. Для более ранних версий
        // вы можете переопределить конструктор, если это необходимо.
        public function initialize(array $config)
        {
            debug($config);
        }
    }

Параметры могут быть определены при объявлении хелперов в контроллере,
как показано ниже::

    namespace App\Controller;

    use App\Controller\AppController;

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

По умолчанию все параметры конфигурации будут объединены со свойством
``$_defaultConfig``. Это свойство должно определять значения по умолчанию
для любых настроек, которые требуются вашему хелперу. К примеру::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
    }

Любые настройки, предоставленные конструктору вашего хелпера, будут объеденены
со значениями по умолчанию, и получившиеся в результате объединения данные
будут записаны в ``_config``. Вы можете использовать метод ``config()`` для
чтения настроек во время работы приложения::

    // Чтение параметра конфигурации errorClass.
    $class = $this->Awesome->config('errorClass');

Использование конфигурации хелпера позволяет вам декларативно настраивать ваши
хелперы и держать логику конфигурации за пределами экшенов вашего контроллера.
Если у вас есть параметры конфигурации, которые не могут являться частью
объявления класса, вы можете установить их в коллбеке ``beforeRender()`` вашего
контроллера::

    class PostsController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig(),
            ]);
        }
    }

.. _aliasing-helpers:

Создание псевдонимов для хелперов
---------------------------------

Одним из наиболее часто используемых параметров является ``className``,
который позволяет вам создавать хелперы, использующие псевдонимы внутри
ваших представлений. Эта опция может оказаться полезной, когда вы захотите
заменить стандартный вызов хелпера из представления, такой как например
``$this->Html`` на что-то более простое и понятное::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize()
        {
            $this->loadHelper('Html', [
                'className' => 'MyHtml'
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
        // Добавьте сюда ваш код для переопределения функций HtmlHelper
    }

Приведенный выше пример *установит псевдоним* ``MyHtmlHelper`` для вызова
``$this->Html`` в ваших представлениях.

.. note::

    Назначение псевдонима хелперу змещает его экземпляры везде, где он
    используется, включая вызовы этого хелпера внутри других хелперов.

Использование хелперов
======================

Once you've configured which helpers you want to use in your controller,
each helper is exposed as a public property in the view. For example, if you
were using the :php:class:`HtmlHelper` you would be able to access it by
doing the following::

    echo $this->Html->css('styles');

The above would call the ``css()`` method on the HtmlHelper. You can
access any loaded helper using ``$this->{$helperName}``.

Загрузка хелперов на лету
-------------------------

Иногда могут возникнуть ситуации, когда вам понадобится динамически загружать
хелперы из представления. Вы можете использовать для этого класс представления
:php:class:`Cake\\View\\HelperRegistry`::

    // Можете использовать любой из вариантов.
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

HelperRegistry - это :doc:`реестр </core-libraries/registry-objects>` и он
поддерживает API реестра используемый повсеместно в CakePHP.

Коллбэк-методы
==============

Помощники имеют несколько коллбэк-методов, которые позволяют вам управлять
процессом визуализации представления. Смотрите разделы документации 
:ref:`helper-api` и :doc:`/core-libraries/events` для получения более
подробной информации.

Создание хелперов
=================

Вы можете создавать пользовательские классы хелперов для ваших приложений и
плагинов. Как и большинство компонентов CakePHP, классы хелперов следуют
нескольким соглашениям:

* Файлы классов хелперов должны располагаться в папке **src/View/Helper**.
  Например: **src/View/Helper/LinkHelper.php**
* Имена классов хелперов должны оканчиваться на ``Helper``. Например:
  ``LinkHelper``.
* Если вы ссылаетесь на имена классов хелперов, вы должны опускать суффикс
  ``Helper``. Например: ``$this->loadHelper('Link');``.

Также вы должны наследовать класс ``Helper``, чтобы у вас все работало
корректно::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // Здесь размещается логика создания ссылок с особым
            // форматированием
        }
    }

Встраивание других хелперов
---------------------------

You may wish to use some functionality already existing in another helper. To do
so, you can specify helpers you wish to use with a ``$helpers`` array, formatted
just as you would in a controller::

    /* src/View/Helper/LinkHelper.php (using other helpers) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // Use the HTML helper to output
            // Formatted data:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }

.. _using-helpers:

Using Your Helper
-----------------

Once you've created your helper and placed it in **src/View/Helper/**, you can
load it in your views::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Link');
        }
    }

Once your helper has been loaded, you can use it in your views by accessing the
matching view property::

    <!-- make a link using the new helper -->
    <?= $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5') ?>

.. note::

    The ``HelperRegistry`` will attempt to lazy load any helpers not
    specifically identified in your ``Controller``.

Accessing View Variables Inside Your Helper
-------------------------------------------

If you would like to access a View variable inside a helper, you can use
``$this->_View->get()`` like::

    class AwesomeHelper extends Helper
    {

        public $helpers = ['Html'];

        public someMethod()
        {
            // set meta description
            echo $this->Html->meta(
                'description', $this->_View->get('metaDescription'), ['block' => 'meta']
            );
        }
    }

Rendering A View Element Inside Your Helper
-------------------------------------------

If you would like to render an Element inside your Helper you can use
``$this->_View->element()`` like::

    class AwesomeHelper extends Helper
    {
        public someFunction()
        {
            // output directly in your helper
            echo $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );

            // or return it to your view
            return $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );
        }
    }

.. _helper-api:

Helper Class
============

.. php:class:: Helper

Callbacks
---------

By implementing a callback method in a helper, CakePHP will automatically
subscribe your helper to the relevant event. Unlike previous versions of CakePHP
you should *not* call ``parent`` in your callbacks, as the base Helper class
does not implement any of the callback methods.

.. php:method:: beforeRenderFile(Event $event, $viewFile)

    Is called before each view file is rendered. This includes elements,
    views, parent views and layouts.

.. php:method:: afterRenderFile(Event $event, $viewFile, $content)

    Is called after each view file is rendered. This includes elements, views,
    parent views and layouts. A callback can modify and return ``$content`` to
    change how the rendered content will be displayed in the browser.

.. php:method:: beforeRender(Event $event, $viewFile)

    The beforeRender method is called after the controller's beforeRender method
    but before the controller renders view and layout. Receives the file being
    rendered as an argument.

.. php:method:: afterRender(Event $event, $viewFile)

    Is called after the view has been rendered but before layout rendering has
    started.

.. php:method:: beforeLayout(Event $event, $layoutFile)

    Is called before layout rendering starts. Receives the layout filename as an
    argument.

.. php:method:: afterLayout(Event $event, $layoutFile)

    Is called after layout rendering is complete. Receives the layout filename
    as an argument.


.. meta::
    :title lang=ru: Хелперы
    :keywords lang=ru: класс php,time function,presentation layer,processing power,ajax,markup,массив,функциональность,логика,синтаксис,элементы,cakephp,плагины
