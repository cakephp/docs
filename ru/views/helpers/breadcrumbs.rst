Хлебные крошки
##############

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

.. versionadded:: 3.3.6

``BreadcrumbsHelper`` предоставляет возможность легко справиться с созданием и
отображением навигационных цепочек (хлебных крошек) для вашего приложения.

Создание навигационных цепочек
==============================

Вы можете добавлять звенья в список, используя метод ``add()``. Он принимает
три аргумента:

- **title** Строка для отображения в качестве заголовка хлебной крошки
- **url** Строка или массив параметров, передаваемых хелперу
  :doc:`/views/helpers/url`
- **options** Массив атрибутов для шаблонов ``item`` и ``itemWithoutLink``.
  Смотрите раздел :ref:`определение атрибутов для элемента
  <defining_attributes_item>` для более полной информации.

В дополнение к добавлению элементов в конец цепочки, вы также можете осуществить
ряд других операций::

    // Добавить элемен в конец цепочки
    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Добавить несколько элементов в конец цепочки
    $this->Breadcrumbs->add([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Элементы будут добавлены в начало списка
    $this->Breadcrumbs->prepend(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Добавить несколько элементов в начало списка в том порядке,
    // в котором они указаны
    $this->Breadcrumbs->prepend([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Вставка в определенную позицию. Если позиция находится вне диапазона
    // допустимых значений, будет выброшено исключение.
    $this->Breadcrumbs->insertAt(
        2,
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Вставка перед другим элементом, в соответствии с заголовком.
    // Если указанный элемент не будет обнаружен,
    // будет выброшено исключение.
    $this->Breadcrumbs->insertBefore(
        'A product name', // заголовок элемента, перед которым вставлять новый
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Вставка после другого элемента, в соответствии с заголовком.
    // Если указанный элемент не будет обнаружен,
    // будет выброшено исключение.
    $this->Breadcrumbs->insertAfter(
        'A product name', // заголовок элемента, после которого вставлять новый
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

Использование этих методов дает вам возможность работать с двухэтапным процессом
рендеринга CakePHP. Поскольку шаблоны и макеты визуализируются изнутри (что
означает, что включенные элементы отображаются первыми), это позволяет точно
определить, где вы хотите добавить хлебную крошку.

Вывод цепочки хлебных крошек
============================

После добавления элементов в цепочку, вы можете с легкостью вывести
ее, используя метод ``render()``. Этот метод принимает два массива
в качестве аргументов:

- ``$attributes`` : Массив аттрибутов, которые будут применены к шаблону
  ``wrapper``. Это дает вам возможность добавлять аттрибуты тегам HTML. Он
  принимает специальный ключ ``templateVars``, чтобы позволить вставку
  пользовательских переменных в шаблон.
- ``$separator`` : Массив аттрибутов для шаблона ``separator``.
  Доступные свойства:

  - ``separator`` Строка для отображения в качестве разделителя
  - ``innerAttrs`` Предоставление атрибутов в случае, если разделитель
    разбит на две части
  - ``templateVars`` Позволяет добавить пользовательские переменные в
    шаблон

  Все другие свойства будут конвертированы как HTML-аттрибуты и будут заменять
  ключ ``attrs`` в шаблоне.
  
  All other properties will be converted as HTML attributes and will replace
  the ``attrs`` key in the template. If you use the default for this option
  (empty), it will not render a separator.

Here is an example of how to render a trail::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Customizing the Output
----------------------

The BreadcrumbsHelper internally uses the ``StringTemplateTrait``, which gives
the ability to easily customize output of various HTML strings.
It includes four templates, with the following default declaration::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{separator}}</span></li>'
    ]

You can easily customize them using the ``templates()`` method from the
``StringTemplateTrait``::

    $this->Breadcrumbs->templates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

Since your templates will be rendered, the ``templateVars`` option
allows you to add your own template variables in the various templates::

    $this->Breadcrumbs->templates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

And to define the ``{{icon}}`` parameter, just specify it when adding the
crumb to the trail::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'templateVars' => [
                'icon' => '<i class="fa fa-money"></i>'
            ]
        ]
    );

.. _defining_attributes_item:

Defining Attributes for the Item
--------------------------------

If you want to apply specific HTML attributes to both the item and its sub-item
, you can leverage the ``innerAttrs`` key, which the ``$options`` argument
provides. Everything except ``innerAttrs`` and ``templateVars`` will be
rendered as HTML attributes::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'class' => 'products-crumb',
            'data-foo' => 'bar',
            'innerAttrs' => [
                'class' => 'inner-products-crumb',
                'id' => 'the-products-crumb'
            ]
        ]
    );

    // Based on the default template, this will render the following HTML :
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Products</a>
    </li>

Clearing the Breadcrumbs
========================

You can clear the bread crumbs using the ``reset()`` method. This can be useful
when you want to transform the crumbs and overwrite the list::

    $crumbs = $this->Breadcrumbs->getCrumbs();
    $crumbs = collection($crumbs)->map(function ($crumb) {
        $crumb['options']['class'] = 'breadcrumb-item';
        return $crumb;
    })->toArray();

    $this->Breadcrumbs->reset()->add($crumbs);

.. versionadded:: 3.4.0
    The ``reset()`` method was added in 3.4.0

.. meta::
    :title lang=ru: BreadcrumbsHelper
    :description lang=ru: Роль хелпера BreadcrumbsHelper в CakePHP - предоставить способ простого управления хлебными крошками.
    :keywords lang=ru: breadcrumbs helper,cakephp crumbs
