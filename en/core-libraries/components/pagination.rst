Pagination
##########

One of the main obstacles of creating flexible and user-friendly
web applications is designing an intuitive UI. Many applications
tend to grow in size and complexity quickly, and designers and
programmers alike find they are unable to cope with displaying
hundreds or thousands of records. Refactoring takes time, and
performance and user satisfaction can suffer.

Displaying a reasonable number of records per page has always been
a critical part of every application and used to cause many
headaches for developers. CakePHP eases the burden on the developer
by providing a quick, easy way to paginate data.

Pagination in CakePHP is affored by a Component in the controller, to make
building paginated queries easier.  In the View :php:class:`PaginatorHelper` is
used to make the generation of pagination links & buttons simple.

Query Setup
===========

In the controller, we start by defining the query conditions pagination will use
by default in the ``$paginate`` controller variable. These conditions, serve as
the basis of your pagination queries.  They are augmented by the sort, direction
limit, and page parameters passed in from the url. It is important to note
here that the order key must be defined in an array structure like below::

    <?php
    class PostsController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

You can also include other :php:meth:`~Model::find()` options, such as
``fields``::

    <?php
    class PostsController extends AppController {
    
        var $paginate = array(
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
additional keys will also be passed directly to the model find methods.  This
makes it very simple to use behaviors like :php:class:`ContainableBehavior` with
pagination::


    <?php
    class RecipesController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

In addition to defining general pagination values, you can define more than one
set of pagination defaults in the controller, you just name the keys of the
array after the model you wish to configure::

    <?php
    class PostsController extends AppController {
    
        var $paginate = array(
            'Post' => array (...),
            'Author' => array (...)
        );
    }

The values of the ``Post`` and ``Author`` keys could contain all the properties
that a model/key less ``$paginate`` array could.
Example of syntax using Containable Behavior::

Once the ``$paginate`` variable has been defined, we can call the
``paginate()`` method in a controller action. This method will dynamically load
the :php:class:`PaginationComponent`, and call its paginate() method. This will return
``find()`` results from the model. It also sets some additional
paging statistics, which are added to the request object. The additional
information is set to ``$this->request->params['paging']``, and is used by
:php:class:`PaginatorHelper` for creating links. ``Controller::paginate()`` also
adds PaginatorHelper to the list of helpers in your controller, if it has not
been added already.::

    <?php
    function list_recipes() {
        // similar to findAll(), but fetches paged results
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }

You can filter the records by passing conditions as second
parameter to the ``paginate()`` function.::

    <?php
    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));

Or you can also set ``conditions`` and other keys in the
``$paginate`` array inside your action.::

    <?php
    function list_recipes() {
        $this->paginate = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->paginate('Recipe');
        $this->set(compact('data'));
    );

Custom Query Pagination
=======================

If you're not able to use the standard find options to create the query you need
to display your data, there are a few options.  You can use a
:ref:`custom find type <model-custom-find>`. You can also implement the
``paginate()`` and ``paginateCount()`` methods on your model, or include them in
a behavior attached to your model. Behaviors implementing ``paginate`` and/or
``paginateCount`` should implement the method signatures defined below with the
normal additional first parameter of ``$model``::

    <?php
    // paginate and paginateCount implemented on a behavior.
    public function paginate(Model $model, $conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        // method content
    }

    public function paginateCount(Model $model, $conditions = null, $recursive = 0, $extra = array()) {
        // method body
    }


Its seldom you'll need to implement paginate() and paginateCount().  You should
make sure  you can't achieve your goal with the core model methods, or a custom
finder.

The ``paginate()`` method should implement the following method signature.  To
use your own method/logic override it in the model you wish to get the data
from::

    <?php
    /**
     * Overridden paginate method - group by week, away_team_id and home_team_id
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

You also need to override the core ``paginateCount()``, this method
expects the same arguments as ``Model::find('count')``. The example
below uses some Postgres-specifc features, so please adjust
accordingly depending on what database you are using::

    <?php
    /**
     * Overridden paginateCount method
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

The observant reader will have noticed that the paginate method
we've defined wasn't actually necessary - All you have to do is add
the keyword in controller's ``$paginate`` class variable::

    <?php
    /**
     * Add GROUP BY clause
     */
    var $paginate = array(
        'MyModel' => array(
            'limit' => 20, 
            'order' => array('week' => 'desc'),
            'group' => array('week', 'home_team_id', 'away_team_id')
        )
    );
    /**
     * Or on-the-fly from within the action
     */
    function index() {
        $this->paginate = array(
            'MyModel' => array(
                'limit' => 20, 
                'order' => array('week' => 'desc'),
                'group' => array('week', 'home_team_id', 'away_team_id')
            )
        );

In CakePHP 2.0, you no longer need to implement ``paginateCount()`` when using
group clauses.  The core ``find('count')`` will correctly count the total number
of rows.

Control which fields used for ordering
======================================

By default sorting can be done with any column on a model.  This is sometimes
undersirable as it can allow users to sort on un-indexed columns, or virtual
fields that can be expensive to calculate. You can use the 3rd parameter of
``Controller::paginate()`` to restrict the columns sorting will be done on::

    <?php
    $this->paginate('Post', array(), array('title', 'slug'));

This would allow sorting on the title and slug columns only. A user that sets
sort to any other value will be ignored.

Limit the maximum number of rows that can be fetched
====================================================

The number of results that are fetched is exposed to the user as the
``limit`` parameter.  It is generally undesirable to allow users to fetch all
rows in a paginated set.  By default CakePHP limits the maximum number of rows
that can be fetched to 100.  If this default is not appropriate for your
application, you can adjust it as part of the pagination options::

    <?php
    var $paginate = array(
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
    
    <?php
    var $paginate = array(
        'paramType' => 'querystring'
    );

The above would enable querystring parameter parsing and generation. You can
also modify the ``$settings`` property on the PaginatorComponent::

    <?php
    $this->Paginator->settings['paramType'] = 'querystring';

By default all of the typical paging parameters will be converted into GET
arguments. When querystring arguments are used. If you want to force other
routing parameters to be treated as querystring parameters you can use the
following in your view::

    <?php
    $this->Paginator->options(array('convertKeys' => array('your', 'keys', 'here)));.

AJAX Pagination
===============

It's very easy to incorporate Ajax functionality into pagination.
Using the :php:class:`JsHelper` and :php:class:`RequestHandlerComponent` you can
easily add Ajax pagination to your application.  See :ref:`ajax-pagination` for
more information.

Configuring the PaginatorHelper to use a custom helper
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default the ``PaginatorHelper`` uses JsHelper to do ajax
features. However, if you don't want that and want to use a custom helper 
for ajax links, you can do so by changing the ``$helpers`` array in your controller. 
After running ``paginate()`` do the following::

    <?php
    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'CustomJs');

Will change the ``PaginatorHelper`` to use the ``CustomJs`` for
ajax operations. You could also set the 'ajax' key to be any
helper, as long as that class implements a ``link()`` method that
behaves like :php:meth:`HtmlHelper::link()`



Pagination in Views
===================

It's up to you to decide how to show records to the user, but most
often this will be done inside HTML tables. The examples below
assume a tabular layout, but the PaginatorHelper available in views
doesn't always need to be restricted as such.

See the details on
`PaginatorHelper <http://api.cakephp.org/class/paginator-helper>`_
in the API.
As mentioned, the PaginatorHelper also offers sorting features
which can be easily integrated into your table column headers::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

The links output from the sort() method of the PaginatorHelper
allow users to click on table headers to toggle the sorting of the
data by a given field.

It is also possible to sort a column based on associations::

    <table>
        <tr> 
            <th><?php echo $this->Paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $this->Paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

The final ingredient to pagination display in views is the addition
of page navigation, also supplied by the PaginationHelper::

    <!-- Shows the page numbers -->
    <?php echo $this->Paginator->numbers(); ?>
    
    <!-- Shows the next and previous links -->
    <?php echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled')); ?>
    <?php echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled')); ?> 
    
    <!-- prints X of Y, where X is current page and Y is number of pages -->
    <?php echo $this->Paginator->counter(); ?>

The wording output by the counter() method can also be customized
using special markers::

    <?php
    echo $this->Paginator->counter(array(
        'format' => 'Page %page% of %pages%, showing %current% records out of
                 %count% total, starting on record %start%, ending on %end%'
    )); 
    ?>

To pass all URL arguments to paginator functions, add the following
to your view::

    <?php
    $this->Paginator->options(array('url' => $this->passedArgs));

Route elements that are not named arguments should manually be
merged with ``$this->passedArgs``::

    <?php
    //for urls like http://www.example.com/en/controller/action
    //that are routed as Router::connect('/:lang/:controller/:action/*', array(), array('lang' => 'ta|en'));
    $this->Paginator->options(array('url' => array_merge(array('lang' => $lang), $this->passedArgs)));

Or you can specify which params to pass manually::

    <?php
    $this->Paginator->options(array('url' => array("0", "1")));
