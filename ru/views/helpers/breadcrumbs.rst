Хлебные крошки
##############

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

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

- ``$attributes`` : Массив атрибутов, которые будут применены к шаблону
  ``wrapper``. Это дает вам возможность добавлять атрибуты тегам HTML. Он
  принимает специальный ключ ``templateVars``, чтобы позволить вставку
  пользовательских переменных в шаблон.
- ``$separator`` : Массив атрибутов для шаблона ``separator``.
  Доступные свойства:

  - ``separator`` Строка для отображения в качестве разделителя
  - ``innerAttrs`` Предоставление атрибутов в случае, если разделитель
    разбит на две части
  - ``templateVars`` Позволяет добавить пользовательские переменные в
    шаблон

  Все другие свойства будут конвертированы как HTML-атрибуты и будут заменять
  ключ ``attrs`` в шаблоне. Если вы используете значение этой опции по
  умолчанию (empty), разделитель не будет выводиться.

Вот пример того, как выводится навигационная цепочка::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Кастомизация вывода
-------------------

``BreadcrumbsHelper`` внутренне использует ``StringTemplateTrait``, дающий
возможность с легкостью изменять вывод различных строк HTML.
В него входят четыре шаблона, со следующими стандартными значениями::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{separator}}</span></li>'
    ]

Вы можете с легкостью изменять их, используя метод ``setTemplates()``, из
``StringTemplateTrait``::

    $this->Breadcrumbs->setTemplates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

Как только ваши шаблоны будут обработаны, опция ``templateVars`` позволит
вам добавить ваши собственные переменные в различные шаблоны::

    $this->Breadcrumbs->setTemplates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

Чтобы определить параметр ``{{icon}}``, просто пропишите его при добавлении
элементов в навигационную цепочку::

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

Определение атрибутов для элементов
-----------------------------------

Если вы хотите применить специфические HTML-атрибуты к элементу цепочки, а также
к его дочернему элементу, вы можете использовать ключ ``innerAttrs``, предлагаемый
аргументом ``$options``. Все кроме параметров ``innerAttrs`` и ``templateVars``
будет выведено как HTML-атрибуты элемента цепочки::

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

    // В соответствии с шаблоном по умолчанию, это сформирует следующий HTML:
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Products</a>
    </li>

Очистка хлебных крошек
======================

Вы можете очистить хлебные крошки, используя метод ``reset()``. Это может
быть полезным если вы хотите преобразовать крошки и переписать список::

    $crumbs = $this->Breadcrumbs->getCrumbs();
    $crumbs = collection($crumbs)->map(function ($crumb) {
        $crumb['options']['class'] = 'breadcrumb-item';
        return $crumb;
    })->toArray();

    $this->Breadcrumbs->reset()->add($crumbs);

.. meta::
    :title lang=ru: BreadcrumbsHelper
    :description lang=ru: Роль хелпера BreadcrumbsHelper в CakePHP - предоставить способ простого управления хлебными крошками.
    :keywords lang=ru: хелпер breadcrumbs,cakephp crumbs
