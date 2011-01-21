4.9.3 AJAX Pagination
---------------------

It's very easy to incorporate Ajax functionality into pagination.
Using the JsHelper and RequestHandlerComponent you can easily add
Ajax pagination to your application.
`See here for more information on Ajax pagination </view/1600/Ajax-Pagination>`_
Configuring the PaginatorHelper to use a custom helper
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default in 1.3 the ``PaginatorHelper`` uses JsHelper to do ajax
features. However, if you don't want that and want to use the
``AjaxHelper`` or a custom helper for ajax links, you can do so by
changing the ``$helpers`` array in your controller. After running
``paginate()`` do the following.

::

    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'Ajax');


#. ``$this->set('posts', $this->paginate());``
#. ``$this->helpers['Paginator'] = array('ajax' => 'Ajax');``

Will change the ``PaginatorHelper`` to use the ``AjaxHelper`` for
ajax operations. You could also set the 'ajax' key to be any
helper, as long as that class implements a ``link()`` method that
behaves like ``HtmlHelper::link()``

4.9.3 AJAX Pagination
---------------------

It's very easy to incorporate Ajax functionality into pagination.
Using the JsHelper and RequestHandlerComponent you can easily add
Ajax pagination to your application.
`See here for more information on Ajax pagination </view/1600/Ajax-Pagination>`_
Configuring the PaginatorHelper to use a custom helper
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default in 1.3 the ``PaginatorHelper`` uses JsHelper to do ajax
features. However, if you don't want that and want to use the
``AjaxHelper`` or a custom helper for ajax links, you can do so by
changing the ``$helpers`` array in your controller. After running
``paginate()`` do the following.

::

    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'Ajax');


#. ``$this->set('posts', $this->paginate());``
#. ``$this->helpers['Paginator'] = array('ajax' => 'Ajax');``

Will change the ``PaginatorHelper`` to use the ``AjaxHelper`` for
ajax operations. You could also set the 'ajax' key to be any
helper, as long as that class implements a ``link()`` method that
behaves like ``HtmlHelper::link()``
