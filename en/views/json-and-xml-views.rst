JSON and XML views
##################

New in CakePHP 2.1 are two new view classes. The ``XmlView`` and ``JsonView``
let you easily create XML and JSON responses, and integrate with the
:php:class:`RequestHandlerComponent`.

By enabling ``RequestHandlerComponent`` in your application, and enabling
support for the ``xml`` and or ``json`` extensions you can automatically
leverage the new view classes.  ``XmlView`` and ``JsonView`` will be referred to
as data views for the rest of this page.

There are two ways you can generate data views.  The first is by using the
``serialize`` key, and the second is by creating normal view files.

Using data views with the serialize key
=======================================

The ``serialize`` key is a special view variable that indicates which other view
variable(s) should be serialized when using a data view.  This lets you skip
defining view files for your controller actions if you don't need to do any
custom formatting before your data is converted into json/xml.

If you need to do any formatting or manipulation of your view variables before
generating the response, you should use view files.  The value of ``serialize``
can be either a string or an array of view variables to serialize::

    <?php
    class PostsController extends AppController {
        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('serialize', 'posts');
        }
    }

You can also define ``serialize`` as an array of view variables to combine::

    <?php
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
            $this->set('serialize', array('posts', 'comments'));
        }
    }

Using data view with view files
===============================

If you need to do some manipulation of your view content before creating the
final output.  The data view classes don't support layouts.  They assume that
the view file will output the serialized content.


.. php:class:: XmlView

    A view class for generating Xml view data.

.. php:class:: JsonView

    A view class for generating Json view data.
