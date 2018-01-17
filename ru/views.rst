Views
#####

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

The above view file could be used as a parent view. It expects that the view
extending it will define the ``sidebar`` and ``title`` blocks. The ``content``
block is a special block that CakePHP creates. It will contain all the
uncaptured content from the extending view. Assuming our view file has a
``$post`` variable with the data about our post, the view could look like:

.. code-block:: php

    <!-- src/Template/Posts/view.ctp -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post);

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

    // The remaining content will be available as the 'content' block
    // In the parent view.
    <?= h($post->body) ?>

The post view above shows how you can extend a view, and populate a set of
blocks. Any content not already in a defined block will be captured and put into
a special block named ``content``. When a view contains a call to ``extend()``,
execution continues to the bottom of the current view file. Once it is complete,
the extended view will be rendered. Calling ``extend()`` more than once in a
view file will override the parent view that will be processed next::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

The above will result in **/Common/index.ctp** being rendered as the parent view
to the current view.

You can nest extended views as many times as necessary. Each view can extend
another view if desired. Each parent view will get the previous view's content
as the ``content`` block.

.. note::

    You should avoid using ``content`` as a block name in your application.
    CakePHP uses this for uncaptured content in extended views.

You can get the list of all populated blocks using the ``blocks()`` method::

    $list = $this->blocks();

.. _view-blocks:

Using View Blocks
=================

.. _view-layouts:

Макеты
======

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
