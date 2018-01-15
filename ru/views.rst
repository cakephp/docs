Views
#####

.. php:namespace:: Cake\View

.. php:class:: View

Виды - это то, что скрывается за буквой **V** в понятии MVC. Виды отвечают за
вывод данных возвращаемых запросом в определенной форме. Часто это происходит
в виде HTML, XML или JSON, но потоковые файлы и создание PDF-файлов, которые
пользователи могут скачивать, также входят в круг обязанностей уровня Вида.

CakePHP поставляется с несколькими встроенными классами Вида для обработки
наиболее распростаненных сценариев рендеринга:

- Для создания веб-сервисов использующих XML или JSON вы можете использовать
  :doc:`views/json-and-xml-views`.
- Для подачи защищенных, либо динамически генерируемых файлов, вы можете
  использовать :ref:`cake-response-file`.
- Для создания видов, использующих несколько тем оформления вы можете
  использовать :doc:`views/themes`.

.. _app-view:

Вид уровня приложения
=====================

``AppView`` - это класс Вида по умолчанию вашего приложения. Сам по себе
``AppView`` наследуется от ``Cake\View\View``, включенный в CakePHP, и определен в **src/View/AppView.php** следующим образом:

``AppView`` is your application’s default View class. ``AppView`` itself extends
the ``Cake\View\View`` class included in CakePHP and is defined in
**src/View/AppView.php** as follows:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }

You can use your ``AppView`` to load helpers that will be used for every view
rendered in your application. CakePHP provides an ``initialize()`` method that
is invoked at the end of a View’s constructor for this kind of use:

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {

        public function initialize()
        {
            // Always enable the MyUtils Helper
            $this->loadHelper('MyUtils');
        }

    }

.. _view-templates:

View Templates
==============

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
