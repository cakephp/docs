Pagination
##########

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

One of the main obstacles of creating flexible and user-friendly web
applications is designing an intuitive user interface. Many applications tend to
grow in size and complexity quickly, and designers and programmers alike find
they are unable to cope with displaying hundreds or thousands of records.
Refactoring takes time, and performance and user satisfaction can suffer.

Displaying a reasonable number of records per page has always been
a critical part of every application and used to cause many
headaches for developers. CakePHP eases the burden on the developer
by providing a quick, easy way to paginate data.

Pagination in CakePHP is offered by a Component in the controller, to make
building paginated queries easier. In the View
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` is used to make the generation
of pagination links & buttons simple.

Using Controller::paginate()
============================

In the controller, we start by defining the query conditions pagination will use
by default in the ``$paginate`` controller variable. These conditions, serve as
the basis of your pagination queries. They are augmented by the sort, direction
limit, and page parameters passed in from the URL. It is important to note
here that the order key must be defined in an array structure like below::

    class PostsController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'limit' => 25,
            'order' => [
                'Posts.title' => 'asc'
            ]
        ];
    }

You can also include any of the options supported by
:php:meth:`~Cake\\ORM\\Table::find()`, such as ``fields``::

    class PostsController extends AppController {

        public $components = ['Paginator'];

        public $paginate = [
            'fields' => ['Posts.id', 'Posts.created'],
            'limit' => 25,
            'order' => [
                'Post.title' => 'asc'
            ]
        ];
    }

While you can pass most of the query options from the paginate property it is
often cleaner and simpler to bundle up your pagination options into
a :ref:`custom-find-methods`. You can define the finder pagination uses by
setting the ``findType`` option::

    class PostsController extends AppController {

        public $paginate = [
            'findType' => 'published',
        ];
    }

In addition to defining general pagination values, you can define more than one
set of pagination defaults in the controller, you just name the keys of the
array after the model you wish to configure::

    class PostsController extends AppController {

        public $paginate = [
            'Posts' => [],
            'Authors' => [],
        ];
    }

The values of the ``Posts`` and ``Authors`` keys could contain all the properties
that a model/key less ``$paginate`` array could.

Once the ``$paginate`` property has been defined, we can use the
:php:meth:`~Cake\\Controller\Controller::paginate()` method to create the
pagination data, and add the ``PaginatorHelper`` if it hasn't already been
added. The controller's paginate method will return the result set of the
paginated query, and set pagination metadata to the request. You can access the
pagination metadata at ``$this->request->params['paging']``. A more complete
example of using ``paginate()`` would be::

    class ArticlesController extends AppController {

        public function index() {
            $this->set('articles', $this->paginate());
        }
    }

By default the ``paginate()`` method will use the default model for
a controller. You can also pass the resulting query of a find method::

     public function index() {
        $query = $this->Articles->find('popular')->where(['author_id' => 1]);
        $this->set('articles', $this->paginate($query));
    }

If you want to paginate a different model you can provide a query for it, the
table object itself, or its name::

    //Using a query
    $comments = $this->paginate($commentsTable->find());

    // Using the model name.
    $comments = $this->paginate('Comments');

    // Using a table object.
    $comments = $this->paginate($commentTable);

Using the Paginator Directly
============================

If you need to paginate data from another component you may want to use the
PaginatorComponent directly. It features a similar API to the controller
method::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    //Or just
    $articles = $this->Paginator->paginate($articleTable, $config);

The first parameter should be the query object from a find on table object you wish
to paginate results from. Optionally, you can pass the table object and let the query
be constructed for you. The second parameter should be the array of settings to use for
pagination. This array should have the same structure as the ``$paginate``
property on a controller.

Control which Fields Used for Ordering
======================================

By default sorting can be done on any non-virtual column a table has. This is
sometimes undesirable as it allows users to sort on un-indexed columnsthat can
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

Limit the Maximum Number of Rows that can be Fetched
====================================================

The number of results that are fetched is exposed to the user as the
``limit`` parameter. It is generally undesirable to allow users to fetch all
rows in a paginated set. By default CakePHP limits the maximum number of rows
that can be fetched to 100. If this default is not appropriate for your
application, you can adjust it as part of the pagination options::

    public $paginate = array(
        // other keys here.
        'maxLimit' => 10
    );

If the request's limit param is greater than this value, it will be reduced to
the ``maxLimit`` value.

Out of Range Page Requests
==========================

The PaginatorComponent will throw a ``NotFoundException`` when trying to
access a non-existent page, i.e. page number requested is greater than total
page count.

So you could either let the normal error page be rendered or use a try catch
block and take appropriate action when a ``NotFoundException`` is caught::

    public function index() {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Do something here like redirecting to first or last page.
            // $this->request->params['paging'] will give you required info.
        }
    }

Pagination in the View
======================

Check the :php:class:`~Cake\\View\\Helper\\PaginatorHelper` documentation for
how to create links for pagination navigation.


.. meta::
    :title lang=en: Pagination
    :keywords lang=en: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
