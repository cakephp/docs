11.1.9 Adding Posts
-------------------

Reading from the database and showing us the posts is a great
start, but let's allow for the adding of new posts.

First, start by creating an ``add()`` action in the
PostsController:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        var $components = array('Session');
    
        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    
        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
    
        }
    
        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $name = 'Posts';``
#. ``var $components = array('Session');``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``function view($id) {``
#. ``$this->Post->id = $id;``
#. ``$this->set('post', $this->Post->read());``
#. ``}``
#. ``function add() {``
#. ``if (!empty($this->data)) {``
#. ``if ($this->Post->save($this->data)) {``
#. ``$this->Session->setFlash('Your post has been saved.');``
#. ``$this->redirect(array('action' => 'index'));``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

You need to include the SessionComponent - and SessionHelper - in
any controller where you will use it. If necessary, include it in
your AppController.

Here's what the ``add()`` action does: if the submitted form data
isn't empty, try to save the data using the Post model. If for some
reason it doesn't save, just render the view. This gives us a
chance to show the user validation errors or other warnings.

When a user uses a form to POST data to your application, that
information is available in ``$this->data``. You can use the
``pr()`` or ``debug`` functions to print it out if you want to see
what it looks like.

We use the ``Session`` component's
```setFlash()`` </view/1313/setFlash>`_ function to set a message
to a session variable to be displayed on the page after
redirection. In the layout we have
```$session->flash()`` </view/1467/flash>`_ which displays the
message and clears the corresponding session variable. The
controller's ```redirect`` </view/982/redirect>`_ function
redirects to another URL. The param ``array('action'=>'index)``
translates to URL /posts i.e the index action of posts controller.
You can refer to
`Router::url <http://api.cakephp.org/class/router#method-Routerurl>`_
function on the api to see the formats in which you can specify a
URL for various cake functions.

Calling the ``save()`` method will check for validation errors and
abort the save if any occur. We'll discuss how those errors are
handled in the following sections.

11.1.9 Adding Posts
-------------------

Reading from the database and showing us the posts is a great
start, but let's allow for the adding of new posts.

First, start by creating an ``add()`` action in the
PostsController:

::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        var $components = array('Session');
    
        function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    
        function view($id) {
            $this->Post->id = $id;
            $this->set('post', $this->Post->read());
    
        }
    
        function add() {
            if (!empty($this->data)) {
                if ($this->Post->save($this->data)) {
                    $this->Session->setFlash('Your post has been saved.');
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $name = 'Posts';``
#. ``var $components = array('Session');``
#. ``function index() {``
#. ``$this->set('posts', $this->Post->find('all'));``
#. ``}``
#. ``function view($id) {``
#. ``$this->Post->id = $id;``
#. ``$this->set('post', $this->Post->read());``
#. ``}``
#. ``function add() {``
#. ``if (!empty($this->data)) {``
#. ``if ($this->Post->save($this->data)) {``
#. ``$this->Session->setFlash('Your post has been saved.');``
#. ``$this->redirect(array('action' => 'index'));``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

You need to include the SessionComponent - and SessionHelper - in
any controller where you will use it. If necessary, include it in
your AppController.

Here's what the ``add()`` action does: if the submitted form data
isn't empty, try to save the data using the Post model. If for some
reason it doesn't save, just render the view. This gives us a
chance to show the user validation errors or other warnings.

When a user uses a form to POST data to your application, that
information is available in ``$this->data``. You can use the
``pr()`` or ``debug`` functions to print it out if you want to see
what it looks like.

We use the ``Session`` component's
```setFlash()`` </view/1313/setFlash>`_ function to set a message
to a session variable to be displayed on the page after
redirection. In the layout we have
```$session->flash()`` </view/1467/flash>`_ which displays the
message and clears the corresponding session variable. The
controller's ```redirect`` </view/982/redirect>`_ function
redirects to another URL. The param ``array('action'=>'index)``
translates to URL /posts i.e the index action of posts controller.
You can refer to
`Router::url <http://api.cakephp.org/class/router#method-Routerurl>`_
function on the api to see the formats in which you can specify a
URL for various cake functions.

Calling the ``save()`` method will check for validation errors and
abort the save if any occur. We'll discuss how those errors are
handled in the following sections.
