Breadcrumbs
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

.. versionadded:: 3.3.6

BreadcrumbsHelper provides a way to easily deal with the creation and rendering
of a breadcrumbs trail for your app.

Creating a Breadcrumbs Trail
============================

You can add a crumb to the list using the ``add()`` method. It takes three
arguments:

- **title** The string to be displayed as a the title of the crumb
- **url** A string or an array of parameters that will be given to the
  :doc:`/views/helpers/url`
- **options** An array of attributes for the ``item`` and ``itemWithoutLink``
  templates. See the section about :ref:`defining attributes for the item
  <defining_attributes_item>` for more informations.

In addition to adding to the end of the trail, you can do a variety of operations::

    // Add at the end of the trail
    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Add multiple crumbs at the end of the trail
    $this->Breadcrumbs->add([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Prepended crumbs will be put at the top of the list
    $this->Breadcrumbs->prepend(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Prepend multiple crumbs at the top of the trail, in the order given
    $this->Breadcrumbs->prepend([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // Insert in a specific slot. If the slot is out of
    // bounds, an exception will be raised.
    $this->Breadcrumbs->insertAt(
        2,
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insert before another crumb, based on the title.
    // If the named crumb title cannot be found,
    // an exception will be raised.
    $this->Breadcrumbs->insertBefore(
        'A product name', // the title of the crumb to insert before
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insert after another crumb, based on the title.
    // If the named crumb title cannot be found,
    // an exception will be raised.
    $this->Breadcrumbs->insertAfter(
        'A product name', // the title of the crumb to insert after
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

Using these methods gives you the ability to work with CakePHP's 2-step
rendering process. Since templates and layouts are rendered from the inside out
(meaning, included elements are rendered first), this allows you to define
precisely where you want to add a breadcrumb.

Rendering the Breadcrumbs Trail
===============================

After adding crumbs to the trail, you can easily render it using the
``render()`` method. This method accepts two array arguments:

- ``$attributes`` : An array of attributes that will applied to the ``wrapper``
  template. This gives you the ability to add attributes to the HTML tag. It
  accepts the special ``templateVars`` key to allow the insertion of custom
  template variables in the template.
- ``$separator`` : An array of attributes for the ``separator`` template.
  Possible properties are:

  - ``separator`` The string to be displayed as a separator
  - ``innerAttrs`` To provide attributes in case your separator is divided
    in two elements
  - ``templateVars`` Allows the insertion of custom template variable in the
    template

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
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{custom}}{{separator}}</span></li>'
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
    :title lang=en: BreadcrumbsHelper
    :description lang=en: The role of the BreadcrumbsHelper in CakePHP is provide a way to easily manage breadcrumbs.
    :keywords lang=en: breadcrumbs helper,cakephp crumbs
