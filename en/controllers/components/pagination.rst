Pagination
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

One of the main obstacles of creating flexible and user-friendly web
applications is designing an intuitive user interface. Many applications tend to
grow in size and complexity quickly, and designers and programmers alike find
they are unable to cope with displaying hundreds or thousands of records.
Refactoring takes time, and performance and user satisfaction can suffer.

Displaying a reasonable number of records per page has always been a critical
part of every application and used to cause many headaches for developers.
CakePHP eases the burden on the developer by providing a quick, easy way to
paginate data.

Pagination in CakePHP is offered by a component in the controller. You then use
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` in your view templates to
generate pagination controls.

Basic Usage
===========

To paginate a query we first need to load the ``PaginatorComponent``::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Once loaded we can paginate an ORM table class or ``Query`` object::

    public function index()
    {
        // Paginate the ORM table.
        $this->set('articles', $this->paginate($this->Articles));

        // Paginate a partially completed query
        $query = $this->Articles->find('published');
        $this->set('articles', $this->paginate($query));
    }

Advanced Usage
==============

``PaginatorComponent`` supports more complex use cases by configuring the ``$paginate``
controller property or as the ``$settings`` argument to ``paginate()``. These
conditions serve as the basis for you pagination queries. They are augmented
by the ``sort``, ``direction``, ``limit``, and ``page`` parameters passed in
from the URL::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

.. tip::
    Default ``order`` options must be defined as an array.

While you can include any of the options supported by
:php:meth:`~Cake\\ORM\\Table::find()` such as ``fields`` in your pagination
settings. It is cleaner and simpler to bundle your pagination options into
a :ref:`custom-find-methods`. You can use your finder in pagination by using the
``finder`` option::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

If your finder method requires additional options you can pass those
as values for the finder::

    class ArticlesController extends AppController
    {
        // find articles by tag
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];
            // We're using the $settings argument to paginate() here.
            // But the same structure could be used in $this->paginate
            //
            // Our custom finder is called findTagged inside ArticlesTable.php
            // which is why we're using `tagged` as the key.
            // Our finder should look like:
            // public function findTagged(Query $query, array $options) {
            $settings = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles, $settings);
            $this->set(compact('articles', 'tags'));
        }
    }

In addition to defining general pagination values, you can define more than one
set of pagination defaults in the controller. The name of each model can be used
as a key in the ``$paginate`` property::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

The values of the ``Articles`` and ``Authors`` keys could contain all the
properties that a basic ``$paginate`` array would.

Once you have used ``paginate()`` to create results. The controller's request
will be updated with paging parameters. You can access the pagination metadata
at ``$this->request->getParam('paging')``.

Simple Pagination
=================

By default pagination uses a ``count()`` query to calculate the size of the
result set so that page number links can be rendered. On very large datasets
this count query can be very expensive. In situations where you only want to
show 'Next' and 'Previous' links you can use the 'simple' paginator which does
not do a count query::

    public function initialize(): void
    {
        parent::initialize();

        // Load the paginator component with the simple paginator strategy.
        $this->loadComponent('Paginator', [
            'paginator' => new \Cake\Datasource\SimplePaginator(),
        ]);
    }

When using the ``SimplePaginator`` you will not be able to generate page
numbers, counter data, links to the last page, or total record count controls.

Using the PaginatorComponent Directly
=====================================

If you need to paginate data from another component you may want to use the
``PaginatorComponent`` directly. It features a similar API to the controller
method::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Or
    $articles = $this->Paginator->paginate($articleTable, $config);

The first parameter should be the query object from a find on table object you
wish to paginate results from. Optionally, you can pass the table object and let
the query be constructed for you. The second parameter should be the array of
settings to use for pagination. This array should have the same structure as the
``$paginate`` property on a controller. When paginating a ``Query`` object, the
``finder`` option will be ignored. It is assumed that you are passing in
the query you want paginated.

.. _paginating-multiple-queries:

Paginating Multiple Queries
===========================

You can paginate multiple models in a single controller action, using the
``scope`` option both in the controller's ``$paginate`` property and in the
call to the ``paginate()`` method::

    // Paginate property
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // In a controller action
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

The ``scope`` option will result in ``PaginatorComponent`` looking in
scoped query string parameters. For example, the following URL could be used to
paginate both tags and articles at the same time::

    /dashboard?article[page]=1&tag[page]=3

See the :ref:`paginator-helper-multiple` section for how to generate scoped HTML
elements and URLs for pagination.

Paginating the Same Model multiple Times
----------------------------------------

To paginate the same model multiple times within a single controller action you
need to define an alias for the model. See :ref:`table-registry-usage` for
additional details on how to use the table registry::

    // In a controller action
    $this->paginate = [
        'ArticlesTable' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticlesTable' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];

    // Load an additional table object to allow differentiating in pagination component
    $this->loadModel('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', [
            'scope' => 'published_articles'
        ])->where(['published' => true])
    );

    $unpublishedArticles = $this->paginate(
        $this->UnpublishedArticles->find('all', [
            'scope' => 'unpublished_articles'
        ])->where(['published' => false])
    );

.. _control-which-fields-used-for-ordering:

Control which Fields Used for Ordering
======================================

By default sorting can be done on any non-virtual column a table has. This is
sometimes undesirable as it allows users to sort on un-indexed columns that can
be expensive to order by. You can set the whitelist of fields that can be sorted
using the ``sortWhitelist`` option. This option is required when you want to
sort on any associated data, or computed fields that may be part of your
pagination query::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

Any requests that attempt to sort on fields not in the whitelist will be
ignored.

Limit the Maximum Number of Rows per Page
=========================================

The number of results that are fetched per page is exposed to the user as the
``limit`` parameter. It is generally undesirable to allow users to fetch all
rows in a paginated set. The ``maxLimit`` option asserts that no one can set
this limit too high from the outside. By default CakePHP limits the maximum
number of rows that can be fetched to 100. If this default is not appropriate
for your application, you can adjust it as part of the pagination options, for
example reducing it to ``10``::

    public $paginate = [
        // Other keys here.
        'maxLimit' => 10
    ];

If the request's limit param is greater than this value, it will be reduced to
the ``maxLimit`` value.

Joining Additional Associations
===============================

Additional associations can be loaded to the paginated table by using the
``contain`` parameter::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

Out of Range Page Requests
==========================

The PaginatorComponent will throw a ``NotFoundException`` when trying to
access a non-existent page, i.e. page number requested is greater than total
page count.

So you could either let the normal error page be rendered or use a try catch
block and take appropriate action when a ``NotFoundException`` is caught::

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Do something here like redirecting to first or last page.
            // $this->request->getAttribute('paging') will give you required info.
        }
    }

Pagination in the View
======================

Check the :php:class:`~Cake\\View\\Helper\\PaginatorHelper` documentation for
how to create links for pagination navigation.

.. meta::
    :title lang=en: Pagination
    :keywords lang=en: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
