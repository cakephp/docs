JSON and XML views
##################

New in CakePHP 2.1 are two new view classes. The ``XmlView`` and ``JsonView``
let you easily create XML and JSON responses, and integrate with the
:php:class:`RequestHandlerComponent`.

By enabling ``RequestHandlerComponent`` in your application, and enabling
support for the ``xml`` and or ``json`` extensions, you can automatically
leverage the new view classes.  ``XmlView`` and ``JsonView`` will be referred to
as data views for the rest of this page.

There are two ways you can generate data views.  The first is by using the
``_serialize`` key, and the second is by creating normal view files.

Enabling data views in your application
=======================================

Before you can use the data view classes, you'll need to do a bit of setup:

#. Enable the json and or xml extensions with
   :php:meth:`Router::parseExtensions()`.  This will enable Router to handle
   mulitple extensions.
#. Add the :php:class:`RequestHandlerComponent` to your controller's list of
   components.  This will enable automatic view class switching on content
   types.

After adding ``Router::parseExtensions('json');`` to your routes file, CakePHP
will automatically switch view classes when a request is done with the ``.json``
extension, or the Accept header is ``application/json``.

Using data views with the serialize key
=======================================

The ``_serialize`` key is a special view variable that indicates which other view
variable(s) should be serialized when using a data view.  This lets you skip
defining view files for your controller actions if you don't need to do any
custom formatting before your data is converted into json/xml.

If you need to do any formatting or manipulation of your view variables before
generating the response, you should use view files.  The value of ``_serialize``
can be either a string or an array of view variables to serialize::

    <?php
    class PostsController extends AppController {
        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('_serialize', 'posts');
        }
    }

You can also define ``_serialize`` as an array of view variables to combine::

    <?php
    class PostsController extends AppController {
        public function index() {
            // some code that created $posts and $comments
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

Using a data view with view files
=================================

You should use view files if you need to do some manipulation of your view
content before creating the final output. For example if we had posts, that had
a field containing generated HTML, we would probably want to omit that from a
JSON response.  This is a situation where a view file would be useful::

    <?php
    // Controller code
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

    // View code - app/View/Posts/
    foreach ($posts as &$post) {
        unset($post['Post']['generated_html']);
    }
    echo json_encode(compact('posts', 'comments'));

You can do more more complex manipulations, or use helpers to do formatting as
well.

.. note::

    The data view classes don't support layouts.  They assume that the view file
    will output the serialized content. 

.. php:class:: XmlView

    A view class for generating Xml view data.  See above for how you can use
    XmlView in your application

.. php:class:: JsonView

    A view class for generating Json view data.  See aboice for how you can use
    JsonView in your application.
