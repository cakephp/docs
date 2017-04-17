Pagination
##########

.. php:class:: PaginatorComponent(ComponentCollection $collection, array $settings = array())

One of the main obstacles of creating flexible and user-friendly
web applications is designing an intuitive user interface. Many applications
tend to grow in size and complexity quickly, and designers and
programmers alike find they are unable to cope with displaying
hundreds or thousands of records. Refactoring takes time, and
performance and user satisfaction can suffer.

Displaying a reasonable number of records per page has always been
a critical part of every application and used to cause many
headaches for developers. CakePHP eases the burden on the developer
by providing a quick, easy way to paginate data.

Pagination in CakePHP is offered by a component in the controller, to make
building paginated queries easier. In the View :php:class:`PaginatorHelper` is
used to make the generation of pagination links & buttons simple.

Query Setup
===========

In the controller, we start by defining the query conditions pagination will use
by default in the ``$paginate`` controller variable. These conditions, serve as
the basis of your pagination queries. They are augmented by the ``sort``, ``direction``,
``limit``, and ``page`` parameters passed in from the URL. It is important to note
here that the ``order`` key must be defined in an array structure like below::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

You can also include other :php:meth:`~Model::find()` options, such as
``fields``::

    class PostsController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

Other keys that can be included in the ``$paginate`` array are
similar to the parameters of the ``Model->find('all')`` method, that
is: ``conditions``, ``fields``, ``order``, ``limit``, ``page``, ``contain``,
``joins``, and ``recursive``. In addition to the aforementioned keys, any
additional keys will also be passed directly to the model find methods. This
makes it very simple to use behaviors like :php:class:`ContainableBehavior` with
pagination::


    class RecipesController extends AppController {

        public $components = array('Paginator');

        public $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

In addition to defining general pagination values, you can define more than one
set of pagination defaults in the controller, you just name the keys of the
array after the model you wish to configure::

    class PostsController extends AppController {

        public $paginate = array(
            'Post' => array (...),
            'Author' => array (...)
        );
    }

The values of the ``Post`` and ``Author`` keys could contain all the properties
that a model/key less ``$paginate`` array could.

.. note::
    The ``$paginate`` variable is not automatically passed to the :php:class:`PaginatorComponent`'s settings. You must explicitly set the :php:class:`PaginatorComponent`'s settings using the following line::

        $this->Paginator->settings = $this->paginate;

Once the ``$paginate`` variable has been defined, we can use the
:php:class:`PaginatorComponent`'s ``paginate()`` method from our controller
action. This will return ``find()`` results from the model. It also sets some
additional paging parameters, which are added to the request object. The
additional information is set to ``$this->request->params['paging']``, and is
used by :php:class:`PaginatorHelper` for creating links.
:php:meth:`PaginatorComponent::paginate()` also adds
:php:class:`PaginatorHelper` to the list of helpers in your controller, if it
has not been added already::

    public function list_recipes() {
        $this->Paginator->settings = $this->paginate;

        // similar to findAll(), but fetches paged results
        $data = $this->Paginator->paginate('Recipe');
        $this->set('data', $data);
    }

You can filter the records by passing conditions as second
parameter to the ``paginate()`` function::

    $data = $this->Paginator->paginate(
        'Recipe',
        array('Recipe.title LIKE' => 'a%')
    );

Or you can also set ``conditions`` and other pagination settings array inside
your action::

    public function list_recipes() {
        $this->Paginator->settings = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->Paginator->paginate('Recipe');
        $this->set(compact('data'));
    }

Custom Query Pagination
=======================

If you're not able to use the standard find options to create the query you need
to display your data, there are a few options. You can use a
:ref:`custom find type <model-custom-find>`. You can also implement the
``paginate()`` and ``paginateCount()`` methods on your model, or include them in
a behavior attached to your model. Behaviors implementing ``paginate`` and/or
``paginateCount`` should implement the method signatures defined below with the
normal additional first parameter of ``$model``::

    // paginate and paginateCount implemented on a behavior.
    public function paginate(Model $model, $conditions, $fields, $order, $limit,
        $page = 1, $recursive = null, $extra = array()) {
        // method content
    }

    public function paginateCount(Model $model, $conditions = null, $recursive = 0,
        $extra = array()) {
        // method body
    }

It's seldom you'll need to implement paginate() and paginateCount(). You should
make sure  you can't achieve your goal with the core model methods, or a custom
finder. To paginate with a custom find type, you should set the ``0``'th
element, or the ``findType`` key as of 2.3::

    public $paginate = array(
        'popular'
    );

Since the 0th index is difficult to manage, in 2.3 the ``findType`` option was
added::

    public $paginate = array(
        'findType' => 'popular'
    );

The ``paginate()`` method should implement the following method signature. To
use your own method/logic override it in the model you wish to get the data
from::

    /**
     * Overridden paginate method - group by week, away_team_id and home_team_id
     */
    public function paginate($conditions, $fields, $order, $limit, $page = 1,
        $recursive = null, $extra = array()) {

        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
        return $this->find(
            'all',
            compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group')
        );
    }

You also need to override the core ``paginateCount()``, this method
expects the same arguments as ``Model::find('count')``. The example
below uses some PostgresSQL-specifc features, so please adjust
accordingly depending on what database you are using::

    /**
     * Overridden paginateCount method
     */
    public function paginateCount($conditions = null, $recursive = 0,
                                    $extra = array()) {
        $sql = "SELECT
            DISTINCT ON(
                week, home_team_id, away_team_id
            )
                week, home_team_id, away_team_id
            FROM
                games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

The observant reader will have noticed that the paginate method
we've defined wasn't actually necessary - All you have to do is add
the keyword in controller's ``$paginate`` class variable::

    /**
     * Add GROUP BY clause
     */
    public $paginate = array(
        'MyModel' => array(
            'limit' => 20,
            'order' => array('week' => 'desc'),
            'group' => array('week', 'home_team_id', 'away_team_id')
        )
    );
    /**
     * Or on-the-fly from within the action
     */
    public function index() {
        $this->Paginator->settings = array(
            'MyModel' => array(
                'limit' => 20,
                'order' => array('week' => 'desc'),
                'group' => array('week', 'home_team_id', 'away_team_id')
            )
        );
    }

In CakePHP 2.0, you no longer need to implement ``paginateCount()`` when using
group clauses. The core ``find('count')`` will correctly count the total number
of rows.

Control which fields used for ordering
======================================

By default sorting can be done with any column on a model. This is sometimes
undesirable as it can allow users to sort on un-indexed columns, or virtual
fields that can be expensive to calculate. You can use the 3rd parameter of
``PaginatorComponent::paginate()`` to restrict the columns that sorting will be
done on::

    $this->Paginator->paginate('Post', array(), array('title', 'slug'));

This would allow sorting on the title and slug columns only. A user that sets
sort to any other value will be ignored.

Limit the maximum number of rows per page
=========================================

The number of results that are fetched per page is exposed to the user as the
``limit`` parameter. It is generally undesirable to allow users to fetch all
rows in a paginated set. The ``maxLimit`` option asserts that no one can set
this limit too high from the outside. By default CakePHP limits the maximum
number of rows that can be fetched to 100. If this default is not appropriate
for your application, you can adjust it as part of the pagination options, for
example reducing it to ``10``::

    public $paginate = array(
        // other keys here.
        'maxLimit' => 10
    );

If the request's limit param is greater than this value, it will be reduced to
the ``maxLimit`` value.

.. _pagination-with-get:

Pagination with GET parameters
==============================

In previous versions of CakePHP you could only generate pagination links using
named parameters. But if pages were requested with GET parameters they would
still work. For 2.0, we decided to make how you generate pagination parameters
more controlled and consistent. You can choose to use either querystring or
named parameters in the component. Incoming requests will accept only the chosen
type, and the :php:class:`PaginatorHelper` will generate links with the chosen type of
parameter::

    public $paginate = array(
        'paramType' => 'querystring'
    );

The above would enable querystring parameter parsing and generation. You can
also modify the ``$settings`` property on the PaginatorComponent::

    $this->Paginator->settings['paramType'] = 'querystring';

By default all of the typical paging parameters will be converted into GET
arguments.

.. note::

    You can run into a situation where assigning a value to a nonexistent property will throw errors::

        $this->paginate['limit'] = 10;

    will throw the error "Notice: Indirect modification of overloaded property $paginate has no effect."
    Assigning an initial value to the property solves the issue::

        $this->paginate = array();
        $this->paginate['limit'] = 10;
        //or
        $this->paginate = array('limit' => 10);

    Or just declare the property in the controller class::

        class PostsController {
            public $paginate = array();
        }

    Or use ``$this->Paginator->settings = array('limit' => 10);``

    Make sure you have added the Paginator component to your $components array if
    you want to modify the ``$settings`` property of the PaginatorComponent.

    Either of these approaches will solve the notice errors.

Out of range page requests
==========================
As of 2.3 the PaginatorComponent will throw a `NotFoundException` when trying to
access a non-existent page, i.e. page number requested is greater than total
page count.

So you could either let the normal error page be rendered or use a try catch
block and take appropriate action when a `NotFoundException` is caught::

    public function index() {
        try {
            $this->Paginator->paginate();
        } catch (NotFoundException $e) {
            //Do something here like redirecting to first or last page.
            //$this->request->params['paging'] will give you required info.
        }
    }

AJAX Pagination
===============

It's very easy to incorporate AJAX functionality into pagination.
Using the :php:class:`JsHelper` and :php:class:`RequestHandlerComponent` you can
easily add AJAX pagination to your application. See :ref:`ajax-pagination` for
more information.

Pagination in the view
======================

Check the :php:class:`PaginatorHelper` documentation for how to create links for
pagination navigation.


.. meta::
    :title lang=en: Pagination
    :keywords lang=en: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
