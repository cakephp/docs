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

- **views**: Templates are the part of the page that is unique to the action
  being run. They form the meat of your application's response.
- **elements**: small, reusable bits of view code. Elements are usually rendered
  inside views.
- **layouts**: template files that contain presentational code that wraps many
  interfaces in your application. Most views are rendered inside a layout.
- **helpers**: these classes encapsulate view logic that is needed in many
  places in the view layer. Among other things, helpers in CakePHP can help you
  build forms, build AJAX functionality, paginate model data, or serve RSS
  feeds.
- **cells**: these classes provide miniature controller-like features for
  creating self contained UI components. See the :doc:`/views/cells`
  documentation for more information.

Переменные Представления
------------------------

Any variables you set in your controller with ``set()`` will be available in
both the view and the layout your action renders. In addition, any set variables
will also be available in any element. If you need to pass additional variables
from the view to the layout you can either call ``set()`` in the view template,
or use a :ref:`view-blocks`.

You should remember to **always** escape any user data before outputting it as
CakePHP does not automatically escape output. You can escape user content with
the ``h()`` function::

    <?= h($user->bio); ?>

Назначение переменных Представления
-----------------------------------

.. php:method:: set(string $var, mixed $value)

Views have a ``set()`` method that is analogous to the ``set()`` found in
Controller objects. Using set() from your view file will add the variables to
the layout and elements that will be rendered later. See
:ref:`setting-view_variables` for more information on using ``set()``.

In your view file you can do::

    $this->set('activeMenuButton', 'posts');

Then, in your layout, the ``$activeMenuButton`` variable will be available and
contain the value 'posts'.

.. _extending-views:

Extending Views
---------------

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
