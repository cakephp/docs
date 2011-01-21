7.5.5 Ajax Pagination
---------------------

Much like Ajax Pagination in 1.2, you can use the JsHelper to
handle the creation of Ajax pagination links instead of plain HTML
links.

Making Ajax Links
~~~~~~~~~~~~~~~~~

Before you can create ajax links you must include the Javascript
library that matches the adapter you are using with ``JsHelper``.
By default the ``JsHelper`` uses jQuery. So in your layout include
jQuery (or whichever library you are using). Also make sure to
include ``RequestHandlerComponent`` in your components. Add the
following to your controller:

::

    var $components = array('RequestHandler');
    var $helpers = array('Js');


#. ``var $components = array('RequestHandler');``
#. ``var $helpers = array('Js');``

Next link in the javascript library you want to use. For this
example we'll be using jQuery.

::

    echo $this->Html->script('jquery');


#. ``echo $this->Html->script('jquery');``

Similar to 1.2 you need to tell the ``PaginatorHelper`` that you
want to make Javascript enhanced links instead of plain HTML ones.
To do so you use ``options()``

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true
    ));


#. ``$this->Paginator->options(array(``
#. ``'update' => '#content',``
#. ``'evalScripts' => true``
#. ``));``

The ``PaginatorHelper`` now knows to make javascript enhanced
links, and that those links should update the ``#content`` element.
Of course this element must exist, and often times you want to wrap
``$content_for_layout`` with a div matching the id used for the
``update`` option. You also should set ``evalScripts`` to true if
you are using the Mootools or Prototype adapters, without
``evalScripts`` these libraries will not be able to chain requests
together. The ``indicator`` option is not supported by ``JsHelper``
and will be ignored.

You then create all the links as needed for your pagination
features. Since the ``JsHelper`` automatically buffers all
generated script content to reduce the number of ``<script>`` tags
in your source code you **must** call write the buffer out. At the
bottom of your view file. Be sure to include:

::

    echo $this->Js->writeBuffer();


#. ``echo $this->Js->writeBuffer();``

If you omit this you will **not** be able to chain ajax pagination
links. When you write the buffer, it is also cleared, so you don't
have worry about the same Javascript being output twice.

Adding effects and transitions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Since ``indicator`` is no longer supported, you must add any
indicator effects yourself.

::

    <html>
        <head>
            <?php echo $this->Html->script('jquery'); ?>
            //more stuff here.
        </head>
        <body>
        <div id="content">
            <?php echo $content_for_layout; ?>
        </div>
        <?php echo $this->Html->image('indicator.gif', array('id' => 'busy-indicator')); ?>
        </body>
    </html>


#. ``<html>``
#. ``<head>``
#. ``<?php echo $this->Html->script('jquery'); ?>``
#. ``//more stuff here.``
#. ``</head>``
#. ``<body>``
#. ``<div id="content">``
#. ``<?php echo $content_for_layout; ?>``
#. ``</div>``
#. ``<?php echo $this->Html->image('indicator.gif', array('id' => 'busy-indicator')); ?>``
#. ``</body>``
#. ``</html>``

Remember to place the indicator.gif file inside app/webroot/img
folder. You may see a situation where the indicator.gif displays
immediately upon the page load. You need to put in this css
``#busy-indicator { display:none; }`` in your main css file.

With the above layout, we've included an indicator image file, that
will display a busy indicator animation that we will show and hide
with the ``JsHelper``. To do that we need to update our
``options()`` function.

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true,
        'before' => $this->Js->get('#busy-indicator')->effect('fadeIn', array('buffer' => false)),
        'complete' => $this->Js->get('#busy-indicator')->effect('fadeOut', array('buffer' => false)),
    ));


#. ``$this->Paginator->options(array(``
#. ``'update' => '#content',``
#. ``'evalScripts' => true,``
#. ``'before' => $this->Js->get('#busy-indicator')->effect('fadeIn', array('buffer' => false)),``
#. ``'complete' => $this->Js->get('#busy-indicator')->effect('fadeOut', array('buffer' => false)),``
#. ``));``

This will show/hide the busy-indicator element before and after the
``#content`` div is updated. Although ``indicator`` has been
removed, the new features offered by ``JsHelper`` allow for more
control and more complex effects to be created.

7.5.5 Ajax Pagination
---------------------

Much like Ajax Pagination in 1.2, you can use the JsHelper to
handle the creation of Ajax pagination links instead of plain HTML
links.

Making Ajax Links
~~~~~~~~~~~~~~~~~

Before you can create ajax links you must include the Javascript
library that matches the adapter you are using with ``JsHelper``.
By default the ``JsHelper`` uses jQuery. So in your layout include
jQuery (or whichever library you are using). Also make sure to
include ``RequestHandlerComponent`` in your components. Add the
following to your controller:

::

    var $components = array('RequestHandler');
    var $helpers = array('Js');


#. ``var $components = array('RequestHandler');``
#. ``var $helpers = array('Js');``

Next link in the javascript library you want to use. For this
example we'll be using jQuery.

::

    echo $this->Html->script('jquery');


#. ``echo $this->Html->script('jquery');``

Similar to 1.2 you need to tell the ``PaginatorHelper`` that you
want to make Javascript enhanced links instead of plain HTML ones.
To do so you use ``options()``

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true
    ));


#. ``$this->Paginator->options(array(``
#. ``'update' => '#content',``
#. ``'evalScripts' => true``
#. ``));``

The ``PaginatorHelper`` now knows to make javascript enhanced
links, and that those links should update the ``#content`` element.
Of course this element must exist, and often times you want to wrap
``$content_for_layout`` with a div matching the id used for the
``update`` option. You also should set ``evalScripts`` to true if
you are using the Mootools or Prototype adapters, without
``evalScripts`` these libraries will not be able to chain requests
together. The ``indicator`` option is not supported by ``JsHelper``
and will be ignored.

You then create all the links as needed for your pagination
features. Since the ``JsHelper`` automatically buffers all
generated script content to reduce the number of ``<script>`` tags
in your source code you **must** call write the buffer out. At the
bottom of your view file. Be sure to include:

::

    echo $this->Js->writeBuffer();


#. ``echo $this->Js->writeBuffer();``

If you omit this you will **not** be able to chain ajax pagination
links. When you write the buffer, it is also cleared, so you don't
have worry about the same Javascript being output twice.

Adding effects and transitions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Since ``indicator`` is no longer supported, you must add any
indicator effects yourself.

::

    <html>
        <head>
            <?php echo $this->Html->script('jquery'); ?>
            //more stuff here.
        </head>
        <body>
        <div id="content">
            <?php echo $content_for_layout; ?>
        </div>
        <?php echo $this->Html->image('indicator.gif', array('id' => 'busy-indicator')); ?>
        </body>
    </html>


#. ``<html>``
#. ``<head>``
#. ``<?php echo $this->Html->script('jquery'); ?>``
#. ``//more stuff here.``
#. ``</head>``
#. ``<body>``
#. ``<div id="content">``
#. ``<?php echo $content_for_layout; ?>``
#. ``</div>``
#. ``<?php echo $this->Html->image('indicator.gif', array('id' => 'busy-indicator')); ?>``
#. ``</body>``
#. ``</html>``

Remember to place the indicator.gif file inside app/webroot/img
folder. You may see a situation where the indicator.gif displays
immediately upon the page load. You need to put in this css
``#busy-indicator { display:none; }`` in your main css file.

With the above layout, we've included an indicator image file, that
will display a busy indicator animation that we will show and hide
with the ``JsHelper``. To do that we need to update our
``options()`` function.

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true,
        'before' => $this->Js->get('#busy-indicator')->effect('fadeIn', array('buffer' => false)),
        'complete' => $this->Js->get('#busy-indicator')->effect('fadeOut', array('buffer' => false)),
    ));


#. ``$this->Paginator->options(array(``
#. ``'update' => '#content',``
#. ``'evalScripts' => true,``
#. ``'before' => $this->Js->get('#busy-indicator')->effect('fadeIn', array('buffer' => false)),``
#. ``'complete' => $this->Js->get('#busy-indicator')->effect('fadeOut', array('buffer' => false)),``
#. ``));``

This will show/hide the busy-indicator element before and after the
``#content`` div is updated. Although ``indicator`` has been
removed, the new features offered by ``JsHelper`` allow for more
control and more complex effects to be created.
