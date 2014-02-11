JSON and XML views
##################

New in CakePHP 2.1 are two new view classes. The ``XmlView`` and ``JsonView``
let you easily create XML and JSON responses, and integrate with the
:php:class:`RequestHandlerComponent`.

By enabling ``RequestHandlerComponent`` in your application, and enabling
support for the ``xml`` and or ``json`` extensions, you can automatically
leverage the new view classes. ``XmlView`` and ``JsonView`` will be referred to
as data views for the rest of this page.

There are two ways you can generate data views. The first is by using the
``_serialize`` key, and the second is by creating normal view files.

Enabling data views in your application
=======================================

Before you can use the data view classes, you'll need to do a bit of setup:

#. Enable the json and or xml extensions with
   :php:meth:`Router::parseExtensions()`. This will enable Router to handle
   multiple extensions.
#. Add the :php:class:`RequestHandlerComponent` to your controller's list of
   components. This will enable automatic view class switching on content
   types. You can also set the component up with the ``viewClassMap`` setting,
   to map types to your custom classes and/or map other data types.

.. versionadded:: 2.3
    :php:meth:`RequestHandlerComponent::viewClassMap()` method has been added to map types to viewClasses.
    The viewClassMap setting will not work on earlier versions.

After adding ``Router::parseExtensions('json');`` to your routes file, CakePHP
will automatically switch view classes when a request is done with the ``.json``
extension, or the Accept header is ``application/json``.

Using data views with the serialize key
=======================================

The ``_serialize`` key is a special view variable that indicates which other view
variable(s) should be serialized when using a data view. This lets you skip
defining view files for your controller actions if you don't need to do any
custom formatting before your data is converted into json/xml.

If you need to do any formatting or manipulation of your view variables before
generating the response, you should use view files. The value of ``_serialize``
can be either a string or an array of view variables to serialize::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('_serialize', array('posts'));
        }
    }

You can also define ``_serialize`` as an array of view variables to combine::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            // some code that created $posts and $comments
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

Defining ``_serialize`` as an array has the added benefit of automatically
appending a top-level ``<response>`` element when using :php:class:`XmlView`.
If you use a string value for ``_serialize`` and XmlView, make sure that your
view variable has a single top-level element. Without a single top-level
element the Xml will fail to generate.

Using a data view with view files
=================================

You should use view files if you need to do some manipulation of your view
content before creating the final output. For example if we had posts, that had
a field containing generated HTML, we would probably want to omit that from a
JSON response. This is a situation where a view file would be useful::

    // Controller code
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
        }
    }

    // View code - app/View/Posts/json/index.ctp
    foreach ($posts as &$post) {
        unset($post['Post']['generated_html']);
    }
    echo json_encode(compact('posts', 'comments'));

You can do more complex manipulations, or use helpers to do formatting as
well.

.. note::

    The data view classes don't support layouts. They assume that the view file
    will output the serialized content.

.. php:class:: XmlView

    A view class for generating Xml view data. See above for how you can use
    XmlView in your application.

    By default when using ``_serialize`` the XmlView will wrap your serialized
    view variables with a ``<response>`` node. You can set a custom name for
    this node using the ``_rootNode`` view variable.

    .. versionadded:: 2.3
        The ``_rootNode`` feature was added.

.. php:class:: JsonView

    A view class for generating Json view data. See above for how you can use
    JsonView in your application.

JSONP response
==============

.. versionadded:: 2.4

When using JsonView you can use the special view variable ``_jsonp`` to enable
returning a JSONP response. Setting it to ``true`` makes the view class check if query
string parameter named "callback" is set and if so wrap the json response in the
function name provided. If you want to use a custom query string parameter name
instead of "callback" set ``_jsonp`` to required name instead of ``true``.
