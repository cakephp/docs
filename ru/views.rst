Представления
#############

.. php:namespace:: Cake\View

.. php:class:: View

Представления (Виды) - это то, что скрывается за буквой **V** в понятии MVC.
Представления отвечают за вывод данных возвращаемых запросом в определенной
форме. Часто это происходит в виде HTML, XML или JSON, но потоковые файлы и
создание PDF-файлов, которые пользователи могут скачивать, также входят в
круг обязанностей уровня Представления.

CakePHP поставляется с несколькими встроенными классами Представлений для
обработки наиболее распростаненных сценариев рендеринга:

- Для создания веб-сервисов использующих XML или JSON вы можете использовать
  :doc:`views/json-and-xml-views`.
- Для подачи защищенных, либо динамически генерируемых файлов, вы можете
  использовать :ref:`cake-response-file`.
- Для создания видов, использующих несколько тем оформления вы можете
  использовать :doc:`views/themes`.

.. _app-view:

Представление уровня приложения
===============================

``AppView`` - это класс Представления по умолчанию вашего приложения. Сам по
себе ``AppView`` наследуется от ``Cake\View\View``, который включен в CakePHP,
и определен в **src/View/AppView.php** следующим образом:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }


Вы можете использовать ``AppView`` для загрузки хелперов, которые будут
использоваться для каждого вида, отображаемого в вашем приложении. CakePHP
предоставляет метод ``initialize()``, который вызывается в конце конструктора
класса ``View`` для такого использования:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {

        public function initialize()
        {
            // Всегда активировать хелпер MyUtils
            $this->loadHelper('MyUtils');
        }

    }

.. _view-templates:

Шаблоны Представления
=====================

Слой представления CakePHP - это то, как вы общаетесь с вашими пользователями.
Большую часть времени ваши представления будут выводить HTML/XHTML-документы в
браузеры, но вам так же может понадобиться генерировать ответ удаленному
клиентскому приложению посредством формаиа JSON, либо вывести пользователю
CSV-файл.

Файлы шаблонов CakePHP имеют стандартное расширение **.ctp** (CakePHP Template)
и используют `альтернативный синтаксис управляющих структур PHP
<http://php.net/manual/en/control-structures.alternative-syntax.php>`_
для управляющих структур и вывода. Эти файлы содержат логику, необходимую для
подготовки данных, полученных от контроллера, в формат представления,
подготовленный для вашей аудитории.

Варианты вывода значений переменных
-----------------------------------

C помщью стандартных чзыковых конструкций ``echo`` или ``print``::

  <?php echo $variable; ?>

С использованием сокращенного синтаксиса::

  <?= $variable ?>

Альтернативные управляющие конструкции
--------------------------------------

Управляющие конструкции, такие как ``if``, ``for``, ``foreach``, ``switch``,
и ``while`` могут быть записаны в упрощенном формате. Заметьте, что в этом
случае не используются фигурные скобки. Вместо этого, к примеру для закрытия
конструкции ``foreach`` закрывающая фигурная скобка заменяется на
``endforeach``. Каждая из перечисленных выше управляющих конструкций, имеет
схожий синтаксис закрытия: ``endif``, ``endfor``, ``endforeach``, и
``endwhile``.Также заметьте, что вместо использования ``точки с запятой``
после каждой структуры (за исключением последней) используется знак
``двоеточие``.

Пример использования ``foreach``:

.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

Еще пример, использование if/elseif/else. Обратите внимание на двоеточия:

.. code-block:: php

  <?php if ($username === 'салли'): ?>
     <h3>Привет Салли</h3>
  <?php elseif ($username === 'джо'): ?>
     <h3>Привет Джо</h3>
  <?php else: ?>
     <h3>Привет неизвестный пользователь</h3>
  <?php endif; ?>

Если же вы предпочтете использовать шаблонизаторы, подобные
`Twig <http://twig.sensiolabs.org>`_, подкласс Представления будет посредничать
между вашим шаблонизатором и CakePHP.

Файлы шаблонов хранятся в **src/Template/** в папке с именем, соответствующим
имени контроллера, использующего файлы, и имеют названия в честь экшенов,
которые им соответствуют. Например, файл представления для экшена ``view()``
контроллера ``Products``, обычно располагается по следующему пути - 
**src/Template/Products/view.ctp**.


Слой представления в CakePHP может быть разбит на несколько составляющих
частей. Каждая часть имеет свое предназначение и будет рассмотрена далее в этой
главе:

- **шаблоны**: Шаблоны - это часть страницы уникальная для текущего экшена.
  Они формируют основной костяк ответа на запрос в вашем приложении.
- **элементы**: небольшая часть кода представления, которую можно использовать
  повторно. Элементы как правило выводятся внутри представлений.
- **макеты**: файлы шаблонов, содержащие код визуализации, которые оборачивают
  собой множество интерфейсов в вашем приложении. Большинство представлений
  выводятся внутри макета.
- **хелперы**: эти классы инкапсулируют логику представления, которая необходима
  во многих местах слоя представления. Наряду с другими вещами, хелперы в CakePHP
  могут помочь вам создать формы, построить AJAX-функциональность, разбить на
  страницы данные модели или транслировать RSS-каналы.
- **ячейки**: эти классы предоставляют возможности схожие с функционалом
  контроллеров, но в меньшем масштабе, используемые при создании самодостаточных
  UI-компоненов.  Для более подробной информации смотрите :doc:`/views/cells`.

Переменные Представления
------------------------

Любые переменные, заданные в вашем контроллере с помощью метода ``set()``,
будут доступны как в представлении, так и в макете вашего экшена. Кроме того,
любые заданные переменные также будут доступны в любом элементе. Если вам нужно
передать дополнительные переменные из представления в макет, вы можете либо
вызвать ``set()`` в шаблоне представления, либо использовать :ref:`view-blocks`.

Помните, вы **всегда** должны экранировать любые пользовательские данные перед
их выводом. Вы можете сделать это с помощью функции ``h()``::

    <?= h($user->bio); ?>

Назначение переменных Представления
-----------------------------------

.. php:method:: set(string $var, mixed $value)

Представления имеют метод ``set()`` аналогичный методу ``set()`` в объектах
Контроллера. Использование метода ``set()`` из вашего файла представления
добавит переменные в макет и элементы, которые будут отображаться позже.
См. :ref:`setting-view_variables` для более подробной информации.

Вы можете сделать следующее в вашем файле представления::

    $this->set('activeMenuButton', 'posts');

Тогда в вашем макете будет доступна переменная ``$activeMenuButton`` со
значением 'posts'.

.. _extending-views:

Расширение Представлений
------------------------

Расширение представлений дает вам возможность оборачивать одно представление
в другое. Комбинирование этой возможности с
:ref:`блоками представления <view-blocks>` дает вам мощный способ для
соблюдения принципа :term:`DRY`. К примеру ваше приложение имеет сайдбар,
который должен меняться в зависимости от конкретного отображаемого
представления. Расширяя наиболее обобщенный файл представления, вы можете
предотвратить повторение шаблонного кода для вашего сайдбара, и описывать
только меняющиеся части:

.. code-block:: php

    <!-- src/Template/Common/view.ctp -->
    <h1><?= $this->fetch('title') ?></h1>
    <?= $this->fetch('content') ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?= $this->fetch('sidebar') ?>
        </ul>
    </div>

Приведенный выше файл представления может быть использован в качестве
родительского представления. Он ожидает, что представление,
расширяющее его определит блоки ``sidebar`` и ``title``. Блок ``content`` -
это специальный блок, создаваемый CakePHP. Он будет содержать весь
неохваченный контент из расширяющегося представления. Предположим, что
в нашем файле представления имеется переменная ``$post``, содержащая данные
о нашем посте, в таком случае файл представления выглядел бы следующим
образом:

.. code-block:: php

    <!-- src/Template/Posts/view.ctp -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post->title);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', [
        'action' => 'edit',
        $post->id
    ]);
    ?>
    </li>
    <?php $this->end(); ?>

    // Остальное содержимое будет доступно как блок 'content'
    // в родительском представлении.
    <?= h($post->body) ?>

Представление поста, приведенное выше, показывает, как вы можете расширить
представление и заполнить набор блоков. Любое содержимое, которое не
принадлежит определенному блоку, будет захвачено и помещено в специальный
блок с именем ``content``. Когда представление содержит обращение к методу
``extend()``, выполнение продолжается до конца текущего файла представления.
После завершения данного процесса, расширенный вид будет отображен. Вызов
``extend()`` более одного раза в файле представления будет переопределять
родительское представление, которое будет обработано следующим::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

В результате исполнения кода приведенного выше, для текущего представления
родительским станет **/Common/index.ctp**.

У расширяемых представлений может быть столько уровней вложенности, сколько
вы посчитаете нужным. При желании любое представление может расширять
какое-нибудь другое представление. Каждое родительское представление будет
получать содержимое предшествующего представления как содержимое блока
``content``.

.. note::

    Вы должны избегать использование слова ``content`` в качестве имени
    блока в вашем приложении. CakePHP использует данное имя для вывода
    неохваченного содержимого в расширенных представлениях.

Вы можете получить перечень всех заполненных блоков с помощью метода
``blocks()``::

    $list = $this->blocks();

.. _view-blocks:

Использование блоков Представления
==================================

Блоки представления предоставляют гибкий API, позволяющий вам определять
блоки вашего представления/макета, которые будут определены где-либо еще.
Например, блоки идеально подходят для реализации таких вещей, как сайдбар
или области для загрузки контента в нижней/верхней части макета. Методы
``start()``, ``append()``, ``prepend()``, ``assign()``, ``fetch()``,
и ``end()``  позволяют работать с захватом блоков::

    // Создание блока сайдбара.
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();

    // Добавление новых блоков в конец сайдбара.
    $this->start('sidebar');
    echo $this->fetch('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

Так же вы можете добавить новое содержимое в конец имеющегося блока
с помощью метода ``append()``::

    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

    // То же самое что и в примере выше
    $this->append('sidebar', $this->element('sidebar/popular_topics'));

Если вам нужно очистить или переписать блок, существует пара альтернатив.
Метод ``reset()`` очистит или перепишет блок в любое время. Метод
``assign()``, в который передается пустая строка также может быть использован
в этом случае.::

    // Очистить старое содержимое блока сайдбара.
    $this->reset('sidebar');

    // Присвоение пустой строки также очистит содержимое блока.
    $this->assign('sidebar', '');

.. versionadded:: 3.2
    Метод View::reset() был добавлен в версии 3.2

Назначение содержимого блоку часто может быть полезным, если вы хотите
преобразовать переменную представления в блок. К примеру, вы захотите
использовать блок для заголовка страницы и в некоторых случаях назначить
заголовок в качестве переменной предсавления внутри контроллера::

    // В файле представления или макета выше строки $this->fetch('title')
    $this->assign('title', $title);

Метод ``prepend()`` позволяет вам вставить содержимое перед существующим
блоком::

    // Добавить перед блоком сайдбара
    $this->prepend('sidebar', 'это содержимое попадет в верхнюю часть сайдбара');

Отображение блоков
------------------

Вы можете выводить блоки, используя метод ``fetch()``. Данный метод выведет блок,
возвращающий '' если указанный блок не будет существовать::

    <?= $this->fetch('sidebar') ?>

Вы также можете использовать ``fetch()`` для условного отображения контента,
который должен окружать блок, если он существует. Это полезно в макетах или
расширенных представлениях, где вы хотите по условию показать заголовки или
другую разметку:

.. code-block:: php

    // В макете src/Template/Layout/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Опции меню</h3>
        <?= $this->fetch('menu') ?>
    </div>
    <?php endif; ?>

Вы также можете указать значение по умолчанию для блока, если оно не
существует. Это позволяет добавлять содержимое-заполнитель, когда блок
не существует. Вы можете указать значение по умолчанию, используя
второй аргумент:

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?= $this->fetch('cart', 'Your cart is empty') ?>
    </div>

Использование блоков для скриптов и CSS-файлов
----------------------------------------------

``HtmlHelper`` связывается с блоками представления, а каждый из его
методов ``script()``, ``css()`` и ``meta()``  обновляет блок с
соответствующим именем при использовании с параметром ``block = true``:

.. code-block:: php

    <?php
    // В вашем файле представления
    $this->Html->script('carousel', ['block' => true]);
    $this->Html->css('carousel', ['block' => true]);
    ?>

    // В вашем файле макета.
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?= $this->fetch('title') ?></title>
        <?= $this->fetch('script') ?>
        <?= $this->fetch('css') ?>
        </head>
        // Остальная часть макета

:php:meth:`Cake\\View\\Helper\\HtmlHelper` также позволяет вам
контролировать в каких именно блоках будут размещены скрипты и
файлы CSS::

    // В вашем файле представления
    $this->Html->script('carousel', ['block' => 'scriptBottom']);

    // В вашем файле макета.
    <?= $this->fetch('scriptBottom') ?>

.. _view-layouts:

Макеты
======

Макет содержит код визуализации, который оборачивает собой представления. Любая
вещь, которую вы желаете видеть в каждом вашем представлении должна быть
расположена в макете.

Макет, используемый в CakePHP по умолчанию располжен в файле
**src/Template/Layout/default.ctp**. Если вы хотите полностью изменить внешний
вид вашего приложения, это то место, с которого вам следует начать, так как
выводимый контроллером код представлений располагается внутри этого стандартного
макета при отображении страницы.

Все файлы макетов должны располагаться в папке **src/Template/Layout**. Когда вы
создаете макет, вы должны указать, где CakePHP должен выводить ваши представления

Other layout files should be placed in **src/Template/Layout**. When you create
a layout, you need to tell CakePHP where to place the output of your views. To
do so, make sure your layout includes a place for ``$this->fetch('content')``
Here's an example of what a default layout might look like:

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?= h($this->fetch('title')) ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- Include external files and scripts here (See HTML helper for more info.) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- If you'd like some sort of menu to
   show up on all of your views, include it here -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- Here's where I want my views to be displayed -->
   <?= $this->fetch('content') ?>

   <!-- Add a footer to each displayed page -->
   <div id="footer">...</div>

   </body>
   </html>

The ``script``, ``css`` and ``meta`` blocks contain any content defined in the
views using the built-in HTML helper. Useful for including JavaScript and CSS
files from views.

.. note::

    When using ``HtmlHelper::css()`` or ``HtmlHelper::script()`` in template
    files, specify ``'block' => true`` to place the HTML source in a block with
    the same name. (See API for more details on usage).

The ``content`` block contains the contents of the rendered view.

You can set the ``title`` block content from inside your view file::

    $this->assign('title', 'View Active Users');

You can create as many layouts as you wish: just place them in the
**src/Template/Layout** directory, and switch between them inside of your
controller actions using the controller or view's ``$layout`` property::

    // From a controller
    public function view()
    {
        // Назначение макета.
        $this->viewBuilder()->setLayout('admin');

        // До версии 3.4
        $this->viewBuilder()->layout('admin');

        // До версии 3.1
        $this->layout = 'admin';
    }

    // From a view file
    $this->layout = 'loggedin';

For example, if a section of my site included a smaller ad banner space, I might
create a new layout with the smaller advertising space and specify it as the
layout for all controllers' actions using something like::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function viewActive()
        {
            $this->set('title', 'View Active Users');
            $this->viewBuilder()->setLayout('default_small_ad');

            // or the following before 3.4
            $this->viewBuilder()->layout('default_small_ad');

            // or the following before 3.1
            $this->layout = 'default_small_ad';
        }

        public function viewImage()
        {
            $this->viewBuilder()->setLayout('image');

            // Output user image
        }
    }

Besides a default layout CakePHP's official skeleton app also has an 'ajax'
layout. The Ajax layout is handy for crafting AJAX responses - it's an empty
layout. (Most AJAX calls only require a bit of markup in return, rather than a
fully-rendered interface.)

The skeleton app also has a default layout to help generate RSS.

Using Layouts from Plugins
--------------------------

If you want to use a layout that exists in a plugin, you can use :term:`plugin
syntax`. For example, to use the contact layout from the Contacts plugin::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function view_active()
        {
            $this->viewBuilder()->layout('Contacts.contact');
            // or the following before 3.1
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

Элементы
========

.. _view-events:

View Events
===========

Подробнее о Представлениях
==========================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=ru: Представления
    :keywords lang=ru: view logic,файл csv,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
