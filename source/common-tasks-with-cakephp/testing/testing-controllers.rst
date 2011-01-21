4.7.6 Testing controllers
-------------------------

Creating a test case
~~~~~~~~~~~~~~~~~~~~

Say you have a typical articles controller, with its corresponding
model, and it looks like this:

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>


#. ``<?php``
#. ``class ArticlesController extends AppController {``
#. ``var $name = 'Articles';``
#. ``var $helpers = array('Ajax', 'Form', 'Html');``
#. ````
#. ``function index($short = null) {``
#. ``if (!empty($this->data)) {``
#. ``$this->Article->save($this->data);``
#. ``}``
#. ``if (!empty($short)) {``
#. ``$result = $this->Article->findAll(null, array('id',``
#. ``'title'));``
#. ``} else {``
#. ``$result = $this->Article->findAll();``
#. ``}``
#. ````
#. ``if (isset($this->params['requested'])) {``
#. ``return $result;``
#. ``}``
#. ````
#. ``$this->set('title', 'Articles');``
#. ``$this->set('articles', $result);``
#. ``}``
#. ``}``
#. ``?>``

Create a file named articles\_controller.test.php in your
app/tests/cases/controllers directory and put the following
inside:

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Starting Test Case</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Ending Test Case</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>Starting method ' . $method . '</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 


#. ``<?php``
#. ``class ArticlesControllerTest extends CakeTestCase {``
#. ``function startCase() {``
#. ``echo '<h1>Starting Test Case</h1>';``
#. ``}``
#. ``function endCase() {``
#. ``echo '<h1>Ending Test Case</h1>';``
#. ``}``
#. ``function startTest($method) {``
#. ``echo '<h3>Starting method ' . $method . '</h3>';``
#. ``}``
#. ``function endTest($method) {``
#. ``echo '<hr />';``
#. ``}``
#. ``function testIndex() {``
#. ``$result = $this->testAction('/articles/index');``
#. ``debug($result);``
#. ``}``
#. ``function testIndexShort() {``
#. ``$result = $this->testAction('/articles/index/short');``
#. ``debug($result);``
#. ``}``
#. ``function testIndexShortGetRenderedHtml() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('return' => 'render'));``
#. ``debug(htmlentities($result));``
#. ``}``
#. ``function testIndexShortGetViewVars() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('return' => 'vars'));``
#. ``debug($result);``
#. ``}``
#. ``function testIndexFixturized() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('fixturize' => true));``
#. ``debug($result);``
#. ``}``
#. ``function testIndexPostFixturized() {``
#. ``$data = array('Article' => array('user_id' => 1, 'published'``
#. ``=> 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body'));``
#. ``$result = $this->testAction('/articles/index',``
#. ``array('fixturize' => true, 'data' => $data, 'method' => 'post'));``
#. ``debug($result);``
#. ``}``
#. ``}``
#. ``?>``

The testAction method
~~~~~~~~~~~~~~~~~~~~~

The new thing here is the **testAction** method. The first argument
of that method is the Cake url of the controller action to be
tested, as in '/articles/index/short'.

The second argument is an array of parameters, consisting of:

return
    Set to what you want returned.
    Valid values are:
    
    -  'vars' - You get the view vars available after executing action
    -  'view' - You get The rendered view, without the layout
    -  'contents' - You get the rendered view's complete html,
       including the layout
    -  'result' - You get the returned value when action uses
       $this->params['requested'].

    The default is 'result'.
fixturize
    Set to true if you want your models auto-fixturized (so your
    application tables get copied, along with their records, to test
    tables so if you change data it does not affect your real
    application.) If you set 'fixturize' to an array of models, then
    only those models will be auto-fixturized while the other will
    remain with live tables. If you wish to use your fixture files with
    testAction() do not use fixturize, and instead just use fixtures as
    you normally would.
method
    set to 'post' or 'get' if you want to pass data to the controller
data
    the data to be passed. Set it to be an associative array consisting
    of fields => value. Take a look at
    ``function testIndexPostFixturized()`` in above test case to see
    how we emulate posting form data for a new article submission.

Pitfalls
~~~~~~~~

If you use testAction to test a method in a controller that does a
redirect, your test will terminate immediately, not yielding any
results.
See
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
for a possible fix.

4.7.6 Testing controllers
-------------------------

Creating a test case
~~~~~~~~~~~~~~~~~~~~

Say you have a typical articles controller, with its corresponding
model, and it looks like this:

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $result = $this->Article->findAll(null, array('id', 
              'title')); 
         } else { 
           $result = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $result; 
         } 
     
         $this->set('title', 'Articles'); 
         $this->set('articles', $result); 
       } 
    } 
    ?>


#. ``<?php``
#. ``class ArticlesController extends AppController {``
#. ``var $name = 'Articles';``
#. ``var $helpers = array('Ajax', 'Form', 'Html');``
#. ````
#. ``function index($short = null) {``
#. ``if (!empty($this->data)) {``
#. ``$this->Article->save($this->data);``
#. ``}``
#. ``if (!empty($short)) {``
#. ``$result = $this->Article->findAll(null, array('id',``
#. ``'title'));``
#. ``} else {``
#. ``$result = $this->Article->findAll();``
#. ``}``
#. ````
#. ``if (isset($this->params['requested'])) {``
#. ``return $result;``
#. ``}``
#. ````
#. ``$this->set('title', 'Articles');``
#. ``$this->set('articles', $result);``
#. ``}``
#. ``}``
#. ``?>``

Create a file named articles\_controller.test.php in your
app/tests/cases/controllers directory and put the following
inside:

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Starting Test Case</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Ending Test Case</h1>'; 
       } 
       function startTest($method) { 
         echo '<h3>Starting method ' . $method . '</h3>'; 
       } 
       function endTest($method) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $result = $this->testAction('/articles/index'); 
         debug($result); 
       } 
       function testIndexShort() { 
         $result = $this->testAction('/articles/index/short'); 
         debug($result); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'render')); 
         debug(htmlentities($result)); 
       } 
       function testIndexShortGetViewVars() { 
         $result = $this->testAction('/articles/index/short', 
         array('return' => 'vars')); 
         debug($result); 
       } 
       function testIndexFixturized() { 
         $result = $this->testAction('/articles/index/short', 
         array('fixturize' => true)); 
         debug($result); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'published' 
              => 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body')); 
         $result = $this->testAction('/articles/index', 
         array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($result); 
       } 
    } 
    ?> 


#. ``<?php``
#. ``class ArticlesControllerTest extends CakeTestCase {``
#. ``function startCase() {``
#. ``echo '<h1>Starting Test Case</h1>';``
#. ``}``
#. ``function endCase() {``
#. ``echo '<h1>Ending Test Case</h1>';``
#. ``}``
#. ``function startTest($method) {``
#. ``echo '<h3>Starting method ' . $method . '</h3>';``
#. ``}``
#. ``function endTest($method) {``
#. ``echo '<hr />';``
#. ``}``
#. ``function testIndex() {``
#. ``$result = $this->testAction('/articles/index');``
#. ``debug($result);``
#. ``}``
#. ``function testIndexShort() {``
#. ``$result = $this->testAction('/articles/index/short');``
#. ``debug($result);``
#. ``}``
#. ``function testIndexShortGetRenderedHtml() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('return' => 'render'));``
#. ``debug(htmlentities($result));``
#. ``}``
#. ``function testIndexShortGetViewVars() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('return' => 'vars'));``
#. ``debug($result);``
#. ``}``
#. ``function testIndexFixturized() {``
#. ``$result = $this->testAction('/articles/index/short',``
#. ``array('fixturize' => true));``
#. ``debug($result);``
#. ``}``
#. ``function testIndexPostFixturized() {``
#. ``$data = array('Article' => array('user_id' => 1, 'published'``
#. ``=> 1, 'slug'=>'new-article', 'title' => 'New Article', 'body' => 'New Body'));``
#. ``$result = $this->testAction('/articles/index',``
#. ``array('fixturize' => true, 'data' => $data, 'method' => 'post'));``
#. ``debug($result);``
#. ``}``
#. ``}``
#. ``?>``

The testAction method
~~~~~~~~~~~~~~~~~~~~~

The new thing here is the **testAction** method. The first argument
of that method is the Cake url of the controller action to be
tested, as in '/articles/index/short'.

The second argument is an array of parameters, consisting of:

return
    Set to what you want returned.
    Valid values are:
    
    -  'vars' - You get the view vars available after executing action
    -  'view' - You get The rendered view, without the layout
    -  'contents' - You get the rendered view's complete html,
       including the layout
    -  'result' - You get the returned value when action uses
       $this->params['requested'].

    The default is 'result'.
fixturize
    Set to true if you want your models auto-fixturized (so your
    application tables get copied, along with their records, to test
    tables so if you change data it does not affect your real
    application.) If you set 'fixturize' to an array of models, then
    only those models will be auto-fixturized while the other will
    remain with live tables. If you wish to use your fixture files with
    testAction() do not use fixturize, and instead just use fixtures as
    you normally would.
method
    set to 'post' or 'get' if you want to pass data to the controller
data
    the data to be passed. Set it to be an associative array consisting
    of fields => value. Take a look at
    ``function testIndexPostFixturized()`` in above test case to see
    how we emulate posting form data for a new article submission.

Pitfalls
~~~~~~~~

If you use testAction to test a method in a controller that does a
redirect, your test will terminate immediately, not yielding any
results.
See
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
for a possible fix.
