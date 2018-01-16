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
``endforeach``. Каждая из перечисленных выше

Control structures, like ``if``, ``for``, ``foreach``, ``switch``, and ``while``
can be written in a simplified format. Notice that there are no braces. Instead,
the end brace for the ``foreach`` is replaced with ``endforeach``. Each of the
control structures listed below has a similar closing syntax: ``endif``,
``endfor``, ``endforeach``, and ``endwhile``. Also notice that instead of using
a ``semicolon`` after each structure (except the last one), there is a
``colon``.

The following is an example using ``foreach``:

.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

Another example, using if/elseif/else. Notice the colons:

.. code-block:: php

  <?php if ($username === 'sally'): ?>
     <h3>Hi Sally</h3>
  <?php elseif ($username === 'joe'): ?>
     <h3>Hi Joe</h3>
  <?php else: ?>
     <h3>Hi unknown user</h3>
  <?php endif; ?>

If you'd prefer using a templating language like
`Twig <http://twig.sensiolabs.org>`_, a subclass of View will bridge your
templating language and CakePHP.

Template files are stored in **src/Template/**, in a folder named after the
controller that uses the files, and named after the action it corresponds to.
For example, the view file for the Products controller's "view()" action, would
normally be found in **src/Template/Products/view.ctp**.

The view layer in CakePHP can be made up of a number of different parts. Each
part has different uses, and will be covered in this chapter:

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

View Variables
--------------

Any variables you set in your controller with ``set()`` will be available in
both the view and the layout your action renders. In addition, any set variables
will also be available in any element. If you need to pass additional variables
from the view to the layout you can either call ``set()`` in the view template,
or use a :ref:`view-blocks`.

You should remember to **always** escape any user data before outputting it as
CakePHP does not automatically escape output. You can escape user content with
the ``h()`` function::

    <?= h($user->bio); ?>

Setting View Variables
----------------------

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

Layouts
=======

.. _view-elements:

Elements
========

.. _view-events:

View Events
===========

More About Views
================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=ru: Views
    :keywords lang=ru: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
