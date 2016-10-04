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

Customizing the output
----------------------

The BreadcrumbsHelper internally uses the ``StringTemplateTrait`` which gives
the ability to easily customize output of various HTML strings.
It includes four templates, with the following default declaration::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{link}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
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
        'item' => '<li{{attrs}}>{{icon}}<a href="{{link}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
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

