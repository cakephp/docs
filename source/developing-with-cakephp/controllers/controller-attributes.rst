3.5.3 Controller Attributes
---------------------------

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`http://api.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_.

$name
~~~~~

PHP4 users should start out their controller definitions using the
``$name`` attribute. The ``$name`` attribute should be set to the
name of the controller. Usually this is just the plural form of the
primary model the controller uses. This takes care of some PHP4
classname oddities and helps CakePHP resolve naming.

::

    <?php
    
    #   $name controller attribute usage example
    
    class RecipesController extends AppController {
       var $name = 'Recipes';
    }
    
    ?>   

$components, $helpers and $uses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by ``$components`` and ``$uses`` available to the controller
as class variables (``$this->ModelName``, for example) and those
given by ``$helpers`` to the view as an object reference variable
(``$helpername``).

Each controller has some of these classes available by default, so
you may not need to configure your controller at all.

Controllers have access to their primary model available by
default. Our RecipesController will have the Recipe model class
available at ``$this->Recipe``, and our ProductsController also
features the Product model at ``$this->Product``. However, when
allowing a controller to access additional models through the
``$uses`` variable, the name of the current controller's model must
also be included. This is illustrated in the example below.

The Html, Form, and Session Helpers are always available by
default, as is the SessionComponent. But if you choose to define
your own $helpers array in AppController, make sure to include
``Html`` and ``Form`` if you want them still available by default
in your own Controllers. To learn more about these classes, be sure
to check out their respective sections later in this manual.

Let’s look at how to tell a CakePHP controller that you plan to use
additional MVC classes.

::

    <?php
    class RecipesController extends AppController {
        var $name = 'Recipes';
    
        var $uses = array('Recipe', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>   

Each of these variables are merged with their inherited values,
therefore it is not necessary (for example) to redeclare the Form
helper, or anything that is declared in your App controller.

If you do not wish to use a Model in your controller, set
``var $uses = array()``. This will allow you to use a controller
without a need for a corresponding Model file.
The Parameters Attribute ($params)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Controller parameters are available at ``$this->params`` in your
CakePHP controller. This variable is used to provide access to
information about the current request. The most common usage of
``$this->params`` is to get access to information that has been
handed to the controller via POST or GET operations.

form
^^^^

``$this->params['form']``

Any POST data from any form is stored here, including information
also found in ``$_FILES``.

admin
^^^^^

``$this->params['admin']``

Is set to 1 if the current action was invoked via admin routing.

bare
^^^^

``$this->params['bare']``

Stores 1 if the current layout is empty, 0 if not.

isAjax
^^^^^^

``$this->params['isAjax']``

Stores 1 if the current request is an ajax call, 0 if not. This
variable is only set if the RequestHandler Component is being used
in the controller.

controller
^^^^^^^^^^

``$this->params['controller']``

Stores the name of the current controller handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['controller']`` would equal "posts".

action
^^^^^^

``$this->params['action']``

Stores the name of the current action handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['action']`` would equal "view".

pass
^^^^

``$this->params['pass']``

Returns an array (numerically indexed) of URL parameters after the
Action.

::

    // URL: /posts/view/12/print/narrow
    
    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
^^^

``$this->params['url']``

Stores the current URL requested, along with key-value pairs of get
variables. For example, if the URL /posts/view/?var1=3&var2=4 was
called, ``$this->params['url']`` would contain:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
^^^^

``$this->data``

Used to handle POST data sent from the FormHelper forms to the
controller.

::

    // The FormHelper is used to create a form element:
    $form->text('User.first_name');

Which when rendered, looks something like:

::

     
    <input name="data[User][first_name]" value="" type="text" />

When the form is submitted to the controller via POST, the data
shows up in ``this->data``

::

     
    //The submitted first name can be found here:
    $this->data['User']['first_name'];

prefix
^^^^^^

``$this->params['prefix']``

Set to the routing prefix. For example, this attribute would
contain the string "admin" during a request to
/admin/posts/someaction.

named
^^^^^

``$this->params['named']``

Stores any named parameters in the url query string in the form
/key:value/. For example, if the URL /posts/view/var1:3/var2:4 was
requested, ``$this->params['named']`` would be an array
containing:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Other Attributes
~~~~~~~~~~~~~~~~

While you can check out the details for all controller attributes
in the API, there are other controller attributes that merit their
own sections in the manual.

The $cacheAction attribute aids in caching views, and the $paginate
attribute is used to set pagination defaults for the controller.
For more information on how to use these attributes, check out
their respective sections later on in this manual.

persistModel
~~~~~~~~~~~~

Stub. Update Me!

Used to create cached instances of models a controller uses. When
set to true, all models related to the controller will be cached.
This can increase performance in many cases.

3.5.3 Controller Attributes
---------------------------

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`http://api.cakephp.org/class/controller <http://api13.cakephp.org/class/controller>`_.

$name
~~~~~

PHP4 users should start out their controller definitions using the
``$name`` attribute. The ``$name`` attribute should be set to the
name of the controller. Usually this is just the plural form of the
primary model the controller uses. This takes care of some PHP4
classname oddities and helps CakePHP resolve naming.

::

    <?php
    
    #   $name controller attribute usage example
    
    class RecipesController extends AppController {
       var $name = 'Recipes';
    }
    
    ?>   

$components, $helpers and $uses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by ``$components`` and ``$uses`` available to the controller
as class variables (``$this->ModelName``, for example) and those
given by ``$helpers`` to the view as an object reference variable
(``$helpername``).

Each controller has some of these classes available by default, so
you may not need to configure your controller at all.

Controllers have access to their primary model available by
default. Our RecipesController will have the Recipe model class
available at ``$this->Recipe``, and our ProductsController also
features the Product model at ``$this->Product``. However, when
allowing a controller to access additional models through the
``$uses`` variable, the name of the current controller's model must
also be included. This is illustrated in the example below.

The Html, Form, and Session Helpers are always available by
default, as is the SessionComponent. But if you choose to define
your own $helpers array in AppController, make sure to include
``Html`` and ``Form`` if you want them still available by default
in your own Controllers. To learn more about these classes, be sure
to check out their respective sections later in this manual.

Let’s look at how to tell a CakePHP controller that you plan to use
additional MVC classes.

::

    <?php
    class RecipesController extends AppController {
        var $name = 'Recipes';
    
        var $uses = array('Recipe', 'User');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>   

Each of these variables are merged with their inherited values,
therefore it is not necessary (for example) to redeclare the Form
helper, or anything that is declared in your App controller.

If you do not wish to use a Model in your controller, set
``var $uses = array()``. This will allow you to use a controller
without a need for a corresponding Model file.
The Parameters Attribute ($params)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Controller parameters are available at ``$this->params`` in your
CakePHP controller. This variable is used to provide access to
information about the current request. The most common usage of
``$this->params`` is to get access to information that has been
handed to the controller via POST or GET operations.

form
^^^^

``$this->params['form']``

Any POST data from any form is stored here, including information
also found in ``$_FILES``.

admin
^^^^^

``$this->params['admin']``

Is set to 1 if the current action was invoked via admin routing.

bare
^^^^

``$this->params['bare']``

Stores 1 if the current layout is empty, 0 if not.

isAjax
^^^^^^

``$this->params['isAjax']``

Stores 1 if the current request is an ajax call, 0 if not. This
variable is only set if the RequestHandler Component is being used
in the controller.

controller
^^^^^^^^^^

``$this->params['controller']``

Stores the name of the current controller handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['controller']`` would equal "posts".

action
^^^^^^

``$this->params['action']``

Stores the name of the current action handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['action']`` would equal "view".

pass
^^^^

``$this->params['pass']``

Returns an array (numerically indexed) of URL parameters after the
Action.

::

    // URL: /posts/view/12/print/narrow
    
    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
^^^

``$this->params['url']``

Stores the current URL requested, along with key-value pairs of get
variables. For example, if the URL /posts/view/?var1=3&var2=4 was
called, ``$this->params['url']`` would contain:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
^^^^

``$this->data``

Used to handle POST data sent from the FormHelper forms to the
controller.

::

    // The FormHelper is used to create a form element:
    $form->text('User.first_name');

Which when rendered, looks something like:

::

     
    <input name="data[User][first_name]" value="" type="text" />

When the form is submitted to the controller via POST, the data
shows up in ``this->data``

::

     
    //The submitted first name can be found here:
    $this->data['User']['first_name'];

prefix
^^^^^^

``$this->params['prefix']``

Set to the routing prefix. For example, this attribute would
contain the string "admin" during a request to
/admin/posts/someaction.

named
^^^^^

``$this->params['named']``

Stores any named parameters in the url query string in the form
/key:value/. For example, if the URL /posts/view/var1:3/var2:4 was
requested, ``$this->params['named']`` would be an array
containing:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Other Attributes
~~~~~~~~~~~~~~~~

While you can check out the details for all controller attributes
in the API, there are other controller attributes that merit their
own sections in the manual.

The $cacheAction attribute aids in caching views, and the $paginate
attribute is used to set pagination defaults for the controller.
For more information on how to use these attributes, check out
their respective sections later on in this manual.

persistModel
~~~~~~~~~~~~

Stub. Update Me!

Used to create cached instances of models a controller uses. When
set to true, all models related to the controller will be cached.
This can increase performance in many cases.
