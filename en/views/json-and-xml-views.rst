JSON and XML views
##################

The ``JsonView`` and ``XmlView``
let you create JSON and XML responses, and integrate with the
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`.

By enabling ``RequestHandlerComponent`` in your application, and enabling
support for the ``json`` and or ``xml`` extensions, you can automatically
leverage the new view classes. ``JsonView`` and ``XmlView`` will be referred to
as data views for the rest of this page.

There are two ways you can generate data views. The first is by using the
``_serialize`` key, and the second is by creating normal template files.

Enabling Data Views in Your Application
=======================================

Before you can use the data view classes, you'll first need to load the
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` in your
controller::

    public function initialize()
    {
        ...
        $this->loadComponent('RequestHandler');
    }

This can be done in your `AppController` and will enable automatic view class
switching on content types. You can also set the component up with the
``viewClassMap`` setting, to map types to your custom classes and/or map other
data types.

You can optionally enable the json and or xml extensions with
:ref:`file-extensions`. This will allow you to access the ``JSON``, ``XML`` or
any other special format views by using a custom URL ending with the name of the
response type as a file extension such as ``http://example.com/articles.json``.

By default, when not enabling :ref:`file-extensions`, the request the ``Accept``
header is used for selecting which type of format should be rendered to the
user. An example ``Accept`` format that is used to render ``JSON`` responses is
``application/json``.

Using Data Views with the Serialize Key
=======================================

The ``_serialize`` key is a special view variable that indicates which other
view variable(s) should be serialized when using a data view. This lets you skip
defining template files for your controller actions if you don't need to do any
custom formatting before your data is converted into json/xml.

If you need to do any formatting or manipulation of your view variables before
generating the response, you should use template files. The value of
``_serialize`` can be either a string or an array of view variables to
serialize::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Set the view vars that have to be serialized.
            $this->set('articles', $this->paginate());
            // Specify which view vars JsonView should serialize.
            $this->set('_serialize', ['articles']);
        }
    }

You can also define ``_serialize`` as an array of view variables to combine::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // Some code that created $articles and $comments

            // Set the view vars that have to be serialized.
            $this->set(compact('articles', 'comments'));

            // Specify which view vars JsonView should serialize.
            $this->set('_serialize', ['articles', 'comments']);
        }
    }

Defining ``_serialize`` as an array has the added benefit of automatically
appending a top-level ``<response>`` element when using :php:class:`XmlView`.
If you use a string value for ``_serialize`` and XmlView, make sure that your
view variable has a single top-level element. Without a single top-level
element the Xml will fail to generate.

.. versionadded:: 3.1.0

    In this version the variable is automaticaly set ``_serialize`` to ``true``
    to serialize all view variables instead of explicitly specifying them.

Using a Data View with Template Files
=====================================

You should use template files if you need to do some manipulation of your view
content before creating the final output. For example if we had articles, that had
a field containing generated HTML, we would probably want to omit that from a
JSON response. This is a situation where a view file would be useful::

    // Controller code
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // View code - src/Template/Articles/json/index.ctp
    foreach ($articles as &$article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

You can do more complex manipulations, or use helpers to do formatting as well.
The data view classes don't support layouts. They assume that the view file will
output the serialized content.

.. note::
    As of 3.1.0 AppController, in the application skeleton automatically adds
    ``'_serialize' => true`` to all XML/JSON requests. You will need to remove
    this code from the beforeRender callback or set ``'_serialize' => false`` in
    your controller if you want to use view files.


Creating XML Views
==================

.. php:class:: XmlView

By default when using ``_serialize`` the XmlView will wrap your serialized
view variables with a ``<response>`` node. You can set a custom name for
this node using the ``_rootNode`` view variable.

The XmlView class supports the ``_xmlOptions`` variable that allows you to
customize the options used to generate XML, e.g. ``tags`` vs ``attributes``.

Creating JSON Views
===================

.. php:class:: JsonView

The JsonView class supports the ``_jsonOptions`` variable that allows you to
customize the bit-mask used to generate JSON. See the
`json_encode <http://php.net/json_encode>`_ documentation for the valid
values of this option.

For example, to serialize validation error output of CakePHP entities in a consistent form of JSON do::

    // In your controller's action when saving failed
    $this->set('errors', $articles->errors());
    $this->set('_jsonOptions', JSON_FORCE_OBJECT);
    $this->set('_serialize', ['errors']);

JSONP Responses
---------------

When using ``JsonView`` you can use the special view variable ``_jsonp`` to
enable returning a JSONP response. Setting it to ``true`` makes the view class
check if query string parameter named "callback" is set and if so wrap the json
response in the function name provided. If you want to use a custom query string
parameter name instead of "callback" set ``_jsonp`` to required name instead of
``true``.

Example Usage
=============

While the :doc:`RequestHandlerComponent
</controllers/components/request-handling>` can automatically set the view based
on the request content-type or extension, you could also handle view
mappings in your controller::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Network\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Format to view mapping
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Error on unknown type
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Set Out Format View
            $this->viewBuilder()->className($formats[$format]);

            // Set Force Download
            $this->response->download('report-' . date('YmdHis') . '.' . $format);

            // Get data
            $videos = $this->Videos->find('latest');

            // Set Data View
            $this->set(compact('videos'));
            $this->set('_serialize', ['videos']);
        }
    }

