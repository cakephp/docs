Breadcrumbs
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

.. versionadded:: 3.3.6

BreadcrumbsHelper provides a way to easily deal with the creation and rendering
of a breadcrumbs trail for your app.

Creating a breadcrumbs trail
============================

Rendering the breadcrumbs trail
===============================

Basic rendering
---------------

After adding crumbs to the trail, you can easily render it using the
``render()`` methods.
This method accepts two arguments, both of them arrays :

- ``$attributes`` : An array of attributes that will applied to the ``wrapper``
  template. This gives you the ability to add attributes to the HTML tag. It
  accepts the special ``templateVars`` key to allow the insertion of custom
  template variables in the template.
- ``$separator`` : An array of attributes for the ``separator`` template.
  Possible properties are :

    - *separator* The string to be displayed as a separator
    - *innerAttrs* To provide attributes in case your separator is divided
      in two elements
    - *templateVars* Allows the insertion of custom template variable in the
      template

  All other properties will be converted as HTML attributes and will replace
  the *attrs* key in the template. If you use the default for this option
  (empty), it will not render a separator.

Here is an example of how to render a trail::

    echo $this->BreadcrumbsHelper->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Customizing the output
----------------------

Customizing the templates
~~~~~~~~~~~~~~~~~~~~~~~~~

The BreadcrumbsHelper internally uses the ``StringTemplateTrait`` which gives
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

Since your templates will be rendered supporting the ``templateVars``, you can
add your own templates var in the various templates::

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

Defining attributes for the item
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to apply specific HTML attributes to both the item and its sub-item
, you can leverage the ``innerAttrs`` key the ``$options`` argument gives you.
Everything except ``innerAttrs`` and ``templateVars`` will be rendered as HTML
attributes::
    
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
