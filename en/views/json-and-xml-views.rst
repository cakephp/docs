JSON and XML views
##################

The ``JsonView`` and ``XmlView`` integration with CakePHP's
:ref:`controller-viewclasses` features and  let you create JSON and XML responses.

These view classes are most commonly used alongside :php:meth:`Cake\\Controller\\Controller::viewClasses()`.

There are two ways you can generate data views. The first is by using the
``serialize`` option, and the second is by creating normal template files.

Defining View Classes to Negotiate With
=======================================

In your ``AppController`` or in an individual controller you can implement the
``viewClasses()`` method and provide all of the views you want to support::

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [JsonView::class, XmlView::class];
    }

You can optionally enable the json and/or xml extensions with
:ref:`file-extensions`. This will allow you to access the ``JSON``, ``XML`` or
any other special format views by using a custom URL ending with the name of the
response type as a file extension such as ``http://example.com/articles.json``.

By default, when not enabling :ref:`file-extensions`, the ``Accept``
header in the request is used for selecting which type of format should be rendered to the
user. An example ``Accept`` format that is used to render ``JSON`` responses is
``application/json``.

Using Data Views with the Serialize Key
=======================================

The ``serialize`` option indicates which view variable(s) should be
serialized when using a data view. This lets you skip defining template files
for your controller actions if you don't need to do any custom formatting before
your data is converted into json/xml.

If you need to do any formatting or manipulation of your view variables before
generating the response, you should use template files. The value of
``serialize`` can be either a string or an array of view variables to
serialize::


    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Set the view vars
            $this->set('articles', $this->paginate());
            // Specify which view vars JsonView should serialize.
            $this->viewBuilder()->setOption('serialize', 'articles');
        }
    }

You can also define ``serialize`` as an array of view variables to combine::

    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Some code that created $articles and $comments

            // Set the view vars
            $this->set(compact('articles', 'comments'));

            // Specify which view vars JsonView should serialize.
            $this->viewBuilder()->setOption('serialize', ['articles', 'comments']);
        }
    }

Defining ``serialize`` as an array has added the benefit of automatically
appending a top-level ``<response>`` element when using :php:class:`XmlView`.
If you use a string value for ``serialize`` and XmlView, make sure that your
view variable has a single top-level element. Without a single top-level
element the Xml will fail to generate.

Using a Data View with Template Files
=====================================

You should use template files if you need to manipulate your view
content before creating the final output. For example, if we had articles with a field containing generated HTML, we would probably want to omit that from a
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

    // View code - templates/Articles/json/index.php
    foreach ($articles as $article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

You can do more complex manipulations, or use helpers to do formatting as well.
The data view classes don't support layouts. They assume that the view file will
output the serialized content.

Creating XML Views
==================

.. php:class:: XmlView

By default when using ``serialize`` the XmlView will wrap your serialized
view variables with a ``<response>`` node. You can set a custom name for
this node using the ``rootNode`` option.

The XmlView class supports the ``xmlOptions`` option that allows you to
customize the options, such as ``tags`` or ``attributes``, used to generate XML.

An example of using ``XmlView`` would be to generate a `sitemap.xml
<https://www.sitemaps.org/protocol.html>`_. This document type requires that you
change ``rootNode`` and set attributes. Attributes are defined using the ``@``
prefix::

    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [XmlView::class];
    }

    public function sitemap()
    {
        $pages = $this->Pages->find()->all();
        $urls = [];
        foreach ($pages as $page) {
            $urls[] = [
                'loc' => Router::url(['controller' => 'Pages', 'action' => 'view', $page->slug, '_full' => true]),
                'lastmod' => $page->modified->format('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => '0.5',
            ];
        }

        // Define a custom root node in the generated document.
        $this->viewBuilder()
            ->setOption('rootNode', 'urlset')
            ->setOption('serialize', ['@xmlns', 'url']);
        $this->set([
            // Define an attribute on the root node.
            '@xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'url' => $urls,
        ]);
    }

Creating JSON Views
===================

.. php:class:: JsonView

The JsonView class supports the ``jsonOptions`` option that allows you to
customize the bit-mask used to generate JSON. See the
`json_encode <https://php.net/json_encode>`_ documentation for the valid
values of this option.

For example, to serialize validation error output of CakePHP entities in a consistent form of JSON do::

    // In your controller's action when saving failed
    $this->set('errors', $articles->errors());
    $this->viewBuilder()
        ->setOption('serialize', ['errors'])
        ->setOption('jsonOptions', JSON_FORCE_OBJECT);

JSONP Responses
---------------

When using ``JsonView`` you can use the special view variable ``jsonp`` to
enable returning a JSONP response. Setting it to ``true`` makes the view class
check if query string parameter named "callback" is set and if so wrap the json
response in the function name provided. If you want to use a custom query string
parameter name instead of "callback" set ``jsonp`` to required name instead of
``true``.

Choosing a View Class
=====================

While you can use the ``viewClasses`` hook method most of the time, if you want
total control over view class selection you can directly choose the view class::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Http\Exception\NotFoundException;

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
            $this->viewBuilder()->setClassName($formats[$format]);

            // Get data
            $videos = $this->Videos->find('latest')->all();

            // Set Data View
            $this->set(compact('videos'));
            $this->viewBuilder()->setOption('serialize', ['videos']);

            // Set Force Download
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }

.. meta::
    :title lang=en: JSON and XML views
    :keywords lang=en: json,xml,presentation layer,view,ajax,logic,syntax,templates,cakephp
