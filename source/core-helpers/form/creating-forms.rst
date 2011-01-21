7.3.1 Creating Forms
--------------------

The first method you’ll need to use in order to take advantage of
the FormHelper is ``create()``. This special method outputs an
opening form tag.

``create(string $model = null, array $options = array())``

All parameters are optional. If ``create()`` is called with no
parameters supplied, it assumes you are building a form that
submits to the current controller, via either the ``add()`` or
``edit()`` action. The default method for form submission is POST.
The form element is also returned with a DOM ID. The ID is
generated using the name of the model, and the name of the
controller action, CamelCased. If I were to call ``create()``
inside a UsersController view, I’d see something like the following
output in the rendered view:

::

    <form id="UserAddForm" method="post" action="/users/add">

You can also pass ``false`` for ``$model``. This will place your
form data into the array: ``$this->data`` (instead of in the
sub-array: ``$this->data['Model']``). This can be handy for short
forms that may not represent anything in your database.

The ``create()`` method allows us to customize much more using the
parameters, however. First, you can specify a model name. By
specifying a model for a form, you are creating that form's
*context*. All fields are assumed to belong to this model (unless
otherwise specified), and all models referenced are assumed to be
associated with it. If you do not specify a model, then it assumes
you are using the default model for the current controller.

::

    <?php echo $this->Form->create('Recipe'); ?>
     
    //Output:
    <form id="RecipeAddForm" method="post" action="/recipes/add">

This will POST the form data to the ``add()`` action of
RecipesController. However, you can also use the same logic to
create an edit form. The FormHelper uses the ``$this->data``
property to automatically detect whether to create an add or edit
form. If ``$this->data`` contains an array element named after the
form's model, and that array contains a non-empty value of the
model's primary key, then the FormHelper will create an edit form
for that record. For example, if we browse to
http://site.com/recipes/edit/5, we might get the following:

::

    // controllers/recipes_controller.php:
    <?php
    function edit($id = null) {
        if (empty($this->data)) {
            $this->data = $this->Recipe->findById($id);
        } else {
            // Save logic goes here
        }
    }
    ?>
    
    // views/recipes/edit.ctp:
    
    // Since $this->data['Recipe']['id'] = 5, we should get an edit form
    <?php echo $this->Form->create('Recipe'); ?>
    
    //Output:
    <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
    <input type="hidden" name="_method" value="PUT" />

Since this is an edit form, a hidden input field is generated to
override the default HTTP method.

The ``$options`` array is where most of the form configuration
happens. This special array can contain a number of different
key-value pairs that affect the way the form tag is generated.

$options[‘type’]
~~~~~~~~~~~~~~~~

This key is used to specify the type of form to be created. Valid
values include ‘post’, ‘get’, ‘file’, ‘put’ and ‘delete’.

Supplying either ‘post’ or ‘get’ changes the form submission method
accordingly.

::

    <?php echo $this->Form->create('User', array('type' => 'get')); ?>
     
    //Output:
    <form id="UserAddForm" method="get" action="/users/add">

Specifying ‘file’ changes the form submission method to ‘post’, and
includes an enctype of “multipart/form-data” on the form tag. This
is to be used if there are any file elements inside the form. The
absence of the proper enctype attribute will cause the file uploads
not to function.

::

    <?php echo $this->Form->create('User', array('type' => 'file')); ?>
     
    //Output:
    <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add">

When using ‘put’ or ‘delete’, your form will be functionally
equivalent to a 'post' form, but when submitted, the HTTP request
method will be overridden with 'PUT' or 'DELETE', respectively.
This allows CakePHP to emulate proper REST support in web
browsers.

$options[‘action’]
~~~~~~~~~~~~~~~~~~

The action key allows you to point the form to a specific action in
your current controller. For example, if you’d like to point the
form to the login() action of the current controller, you would
supply an $options array like the following:

::

    <?php echo $this->Form->create('User', array('action' => 'login')); ?>
     
    //Output:
    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

$options[‘url’]
~~~~~~~~~~~~~~~

If the desired form action isn’t in the current controller, you can
specify a URL for the form action using the ‘url’ key of the
$options array. The supplied URL can be relative to your CakePHP
application, or can point to an external domain.

::

    <?php echo $this->Form->create(null, array('url' => '/recipes/add')); ?>
    // or
    <?php echo $this->Form->create(null, array('url' => array('controller' => 'recipes', 'action' => 'add'))); ?>
    
    
    //Output:
    <form method="post" action="/recipes/add">
     
    <?php echo $this->Form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    //Output:
    <form method="get" action="http://www.google.com/search">

Also check
`HtmlHelper::url <http://book.cakephp.org/view/1448/url>`_ method
for more examples of different types of urls.

$options[‘default’]
~~~~~~~~~~~~~~~~~~~

If ‘default’ has been set to boolean false, the form’s submit
action is changed so that pressing the submit button does not
submit the form. If the form is meant to be submitted via AJAX,
setting ‘default’ to false suppresses the form’s default behavior
so you can grab the data and submit it via AJAX instead.

7.3.1.5 $options['inputDefaults']
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can declare a set of default options for ``input()`` with the
``inputDefaults`` key to customize your default input creation.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div' => false
            )
        ));

All inputs created from that point forward would inherit the
options declared in inputDefaults. You can override the
defaultOptions by declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

7.3.1 Creating Forms
--------------------

The first method you’ll need to use in order to take advantage of
the FormHelper is ``create()``. This special method outputs an
opening form tag.

``create(string $model = null, array $options = array())``

All parameters are optional. If ``create()`` is called with no
parameters supplied, it assumes you are building a form that
submits to the current controller, via either the ``add()`` or
``edit()`` action. The default method for form submission is POST.
The form element is also returned with a DOM ID. The ID is
generated using the name of the model, and the name of the
controller action, CamelCased. If I were to call ``create()``
inside a UsersController view, I’d see something like the following
output in the rendered view:

::

    <form id="UserAddForm" method="post" action="/users/add">

You can also pass ``false`` for ``$model``. This will place your
form data into the array: ``$this->data`` (instead of in the
sub-array: ``$this->data['Model']``). This can be handy for short
forms that may not represent anything in your database.

The ``create()`` method allows us to customize much more using the
parameters, however. First, you can specify a model name. By
specifying a model for a form, you are creating that form's
*context*. All fields are assumed to belong to this model (unless
otherwise specified), and all models referenced are assumed to be
associated with it. If you do not specify a model, then it assumes
you are using the default model for the current controller.

::

    <?php echo $this->Form->create('Recipe'); ?>
     
    //Output:
    <form id="RecipeAddForm" method="post" action="/recipes/add">

This will POST the form data to the ``add()`` action of
RecipesController. However, you can also use the same logic to
create an edit form. The FormHelper uses the ``$this->data``
property to automatically detect whether to create an add or edit
form. If ``$this->data`` contains an array element named after the
form's model, and that array contains a non-empty value of the
model's primary key, then the FormHelper will create an edit form
for that record. For example, if we browse to
http://site.com/recipes/edit/5, we might get the following:

::

    // controllers/recipes_controller.php:
    <?php
    function edit($id = null) {
        if (empty($this->data)) {
            $this->data = $this->Recipe->findById($id);
        } else {
            // Save logic goes here
        }
    }
    ?>
    
    // views/recipes/edit.ctp:
    
    // Since $this->data['Recipe']['id'] = 5, we should get an edit form
    <?php echo $this->Form->create('Recipe'); ?>
    
    //Output:
    <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
    <input type="hidden" name="_method" value="PUT" />

Since this is an edit form, a hidden input field is generated to
override the default HTTP method.

The ``$options`` array is where most of the form configuration
happens. This special array can contain a number of different
key-value pairs that affect the way the form tag is generated.

$options[‘type’]
~~~~~~~~~~~~~~~~

This key is used to specify the type of form to be created. Valid
values include ‘post’, ‘get’, ‘file’, ‘put’ and ‘delete’.

Supplying either ‘post’ or ‘get’ changes the form submission method
accordingly.

::

    <?php echo $this->Form->create('User', array('type' => 'get')); ?>
     
    //Output:
    <form id="UserAddForm" method="get" action="/users/add">

Specifying ‘file’ changes the form submission method to ‘post’, and
includes an enctype of “multipart/form-data” on the form tag. This
is to be used if there are any file elements inside the form. The
absence of the proper enctype attribute will cause the file uploads
not to function.

::

    <?php echo $this->Form->create('User', array('type' => 'file')); ?>
     
    //Output:
    <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add">

When using ‘put’ or ‘delete’, your form will be functionally
equivalent to a 'post' form, but when submitted, the HTTP request
method will be overridden with 'PUT' or 'DELETE', respectively.
This allows CakePHP to emulate proper REST support in web
browsers.

$options[‘action’]
~~~~~~~~~~~~~~~~~~

The action key allows you to point the form to a specific action in
your current controller. For example, if you’d like to point the
form to the login() action of the current controller, you would
supply an $options array like the following:

::

    <?php echo $this->Form->create('User', array('action' => 'login')); ?>
     
    //Output:
    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

$options[‘url’]
~~~~~~~~~~~~~~~

If the desired form action isn’t in the current controller, you can
specify a URL for the form action using the ‘url’ key of the
$options array. The supplied URL can be relative to your CakePHP
application, or can point to an external domain.

::

    <?php echo $this->Form->create(null, array('url' => '/recipes/add')); ?>
    // or
    <?php echo $this->Form->create(null, array('url' => array('controller' => 'recipes', 'action' => 'add'))); ?>
    
    
    //Output:
    <form method="post" action="/recipes/add">
     
    <?php echo $this->Form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    //Output:
    <form method="get" action="http://www.google.com/search">

Also check
`HtmlHelper::url <http://book.cakephp.org/view/1448/url>`_ method
for more examples of different types of urls.

$options[‘default’]
~~~~~~~~~~~~~~~~~~~

If ‘default’ has been set to boolean false, the form’s submit
action is changed so that pressing the submit button does not
submit the form. If the form is meant to be submitted via AJAX,
setting ‘default’ to false suppresses the form’s default behavior
so you can grab the data and submit it via AJAX instead.

7.3.1.5 $options['inputDefaults']
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can declare a set of default options for ``input()`` with the
``inputDefaults`` key to customize your default input creation.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div' => false
            )
        ));

All inputs created from that point forward would inherit the
options declared in inputDefaults. You can override the
defaultOptions by declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element
