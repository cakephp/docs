4.9.1 Controller Setup
----------------------

In the controller, we start by defining the pagination defaults in
the *$paginate* controller variable. It is important to note here
that the order key must be defined in the array structure given.

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'limit' => 25,``
#. ``'order' => array(``
#. ``'Post.title' => 'asc'``
#. ``)``
#. ``);``
#. ``}``

You can also include other find() options, such as *fields*:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'fields' => array('Post.id', 'Post.created'),``
#. ``'limit' => 25,``
#. ``'order' => array(``
#. ``'Post.title' => 'asc'``
#. ``)``
#. ``);``
#. ``}``

Other keys that can be included in the *$paginate* array are
similar to the parameters of the *Model->find('all')* method, that
is: *conditions*, *fields*, *order*, *limit*, *page*, *contain*,
*joins*, and *recursive*. In fact, you can define more than one set
of pagination defaults in the controller, you just name the pieces
of the array after the model you wish to configure:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'Recipe' => array (...),
            'Author' => array (...)
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'Recipe' => array (...),``
#. ``'Author' => array (...)``
#. ``);``
#. ``}``

Example of syntax using Containable Behavior:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'limit' => 25,``
#. ``'contain' => array('Article')``
#. ``);``
#. ``}``

Once the *$paginate* variable has been defined, we can call the
*paginate()* method in controller actions. This method returns
paged *find()* results from the model, and grabs some additional
paging statistics, which are passed to the View behind the scenes.
This method also adds PaginatorHelper to the list of helpers in
your controller, if it has not been added already.

::

    function list_recipes() {
        // similar to findAll(), but fetches paged results
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }


#. ``function list_recipes() {``
#. ``// similar to findAll(), but fetches paged results``
#. ``$data = $this->paginate('Recipe');``
#. ``$this->set('data', $data);``
#. ``}``

You can filter the records by passing conditions as second
parameter to the ``paginate()`` function.
::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));


#. ``$data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));``

Or you can also set *conditions* and other keys in the
``$paginate`` array inside your action.
::

    function list_recipes() {
        $this->paginate = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->paginate('Recipe');
        $this->set(compact('data'));
    );


#. ``function list_recipes() {``
#. ``$this->paginate = array(``
#. ``'conditions' => array('Recipe.title LIKE' => 'a%'),``
#. ``'limit' => 10``
#. ``);``
#. ``$data = $this->paginate('Recipe');``
#. ``$this->set(compact('data'));``
#. ``);``

4.9.1 Controller Setup
----------------------

In the controller, we start by defining the pagination defaults in
the *$paginate* controller variable. It is important to note here
that the order key must be defined in the array structure given.

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'limit' => 25,``
#. ``'order' => array(``
#. ``'Post.title' => 'asc'``
#. ``)``
#. ``);``
#. ``}``

You can also include other find() options, such as *fields*:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'fields' => array('Post.id', 'Post.created'),``
#. ``'limit' => 25,``
#. ``'order' => array(``
#. ``'Post.title' => 'asc'``
#. ``)``
#. ``);``
#. ``}``

Other keys that can be included in the *$paginate* array are
similar to the parameters of the *Model->find('all')* method, that
is: *conditions*, *fields*, *order*, *limit*, *page*, *contain*,
*joins*, and *recursive*. In fact, you can define more than one set
of pagination defaults in the controller, you just name the pieces
of the array after the model you wish to configure:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'Recipe' => array (...),
            'Author' => array (...)
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'Recipe' => array (...),``
#. ``'Author' => array (...)``
#. ``);``
#. ``}``

Example of syntax using Containable Behavior:

::

    class RecipesController extends AppController {
    
        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }


#. ``class RecipesController extends AppController {``
#. ``var $paginate = array(``
#. ``'limit' => 25,``
#. ``'contain' => array('Article')``
#. ``);``
#. ``}``

Once the *$paginate* variable has been defined, we can call the
*paginate()* method in controller actions. This method returns
paged *find()* results from the model, and grabs some additional
paging statistics, which are passed to the View behind the scenes.
This method also adds PaginatorHelper to the list of helpers in
your controller, if it has not been added already.

::

    function list_recipes() {
        // similar to findAll(), but fetches paged results
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }


#. ``function list_recipes() {``
#. ``// similar to findAll(), but fetches paged results``
#. ``$data = $this->paginate('Recipe');``
#. ``$this->set('data', $data);``
#. ``}``

You can filter the records by passing conditions as second
parameter to the ``paginate()`` function.
::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));


#. ``$data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));``

Or you can also set *conditions* and other keys in the
``$paginate`` array inside your action.
::

    function list_recipes() {
        $this->paginate = array(
            'conditions' => array('Recipe.title LIKE' => 'a%'),
            'limit' => 10
        );
        $data = $this->paginate('Recipe');
        $this->set(compact('data'));
    );


#. ``function list_recipes() {``
#. ``$this->paginate = array(``
#. ``'conditions' => array('Recipe.title LIKE' => 'a%'),``
#. ``'limit' => 10``
#. ``);``
#. ``$data = $this->paginate('Recipe');``
#. ``$this->set(compact('data'));``
#. ``);``
