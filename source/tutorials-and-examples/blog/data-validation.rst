11.1.10 Data Validation
-----------------------

Cake goes a long way in taking the monotony out of form input
validation. Everyone hates coding up endless forms and their
validation routines. CakePHP makes it easier and faster.

To take advantage of the validation features, you'll need to use
Cake's FormHelper in your views. The FormHelper is available by
default to all views at ``$this->Form``.

Here's our add view:

::

    <!-- File: /app/views/posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>


#. ``<!-- File: /app/views/posts/add.ctp -->``
#. ````
#. ``<h1>Add Post</h1>``
#. ``<?php``
#. ``echo $this->Form->create('Post');``
#. ``echo $this->Form->input('title');``
#. ``echo $this->Form->input('body', array('rows' => '3'));``
#. ``echo $this->Form->end('Save Post');``
#. ``?>``

Here, we use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that ``$this->Form->create()`` generates:

::

    <form id="PostAddForm" method="post" action="/posts/add">


#. ``<form id="PostAddForm" method="post" action="/posts/add">``

If ``create()`` is called with no parameters supplied, it assumes
you are building a form that submits to the current controller's
``add()`` action (or ``edit()`` action when ``id`` is included in
the form data), via POST.

The ``$this->Form->input()`` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and automagic here:
``input()`` will output different form elements based on the model
field specified.

The ``$this->Form->end()`` call generates a submit button and ends
the form. If a string is supplied as the first parameter to
``end()``, the FormHelper outputs a submit button named accordingly
along with the closing form tag. Again, refer to
`Chapter "Built-in Helpers" </view/1102/>`_ for more on helpers.

Now let's go back and update our ``/app/views/posts/index.ctp``
view to include a new "Add Post" link. Before the ``<table>``, add
the following line:
::

    <?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>


#. ``<?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>``

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look
back at our Post model and make a few adjustments:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';
    
        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel``
#. ``{``
#. ``var $name = 'Post';``
#. ``var $validate = array(``
#. ``'title' => array(``
#. ``'rule' => 'notEmpty'``
#. ``),``
#. ``'body' => array(``
#. ``'rule' => 'notEmpty'``
#. ``)``
#. ``);``
#. ``}``
#. ``?>``

The ``$validate`` array tells CakePHP how to validate your data
when the ``save()`` method is called. Here, I've specified that
both the body and title fields must not be empty. CakePHP's
validation engine is strong, with a number of pre-built rules
(credit card numbers, email addresses, etc.) and flexibility for
adding your own validation rules. For more information on that
setup, check the
`Data Validation chapter </view/1143/data-validation>`_.

Now that you have your validation rules in place, use the app to
try to add a post with an empty title or body to see how it works.
Since we've used the ``input()`` method of the FormHelper to create
our form elements, our validation error messages will be shown
automatically.

11.1.10 Data Validation
-----------------------

Cake goes a long way in taking the monotony out of form input
validation. Everyone hates coding up endless forms and their
validation routines. CakePHP makes it easier and faster.

To take advantage of the validation features, you'll need to use
Cake's FormHelper in your views. The FormHelper is available by
default to all views at ``$this->Form``.

Here's our add view:

::

    <!-- File: /app/views/posts/add.ctp -->   
        
    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>


#. ``<!-- File: /app/views/posts/add.ctp -->``
#. ````
#. ``<h1>Add Post</h1>``
#. ``<?php``
#. ``echo $this->Form->create('Post');``
#. ``echo $this->Form->input('title');``
#. ``echo $this->Form->input('body', array('rows' => '3'));``
#. ``echo $this->Form->end('Save Post');``
#. ``?>``

Here, we use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that ``$this->Form->create()`` generates:

::

    <form id="PostAddForm" method="post" action="/posts/add">


#. ``<form id="PostAddForm" method="post" action="/posts/add">``

If ``create()`` is called with no parameters supplied, it assumes
you are building a form that submits to the current controller's
``add()`` action (or ``edit()`` action when ``id`` is included in
the form data), via POST.

The ``$this->Form->input()`` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and automagic here:
``input()`` will output different form elements based on the model
field specified.

The ``$this->Form->end()`` call generates a submit button and ends
the form. If a string is supplied as the first parameter to
``end()``, the FormHelper outputs a submit button named accordingly
along with the closing form tag. Again, refer to
`Chapter "Built-in Helpers" </view/1102/>`_ for more on helpers.

Now let's go back and update our ``/app/views/posts/index.ctp``
view to include a new "Add Post" link. Before the ``<table>``, add
the following line:
::

    <?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>


#. ``<?php echo $this->Html->link('Add Post', array('controller' => 'posts', 'action' => 'add')); ?>``

You may be wondering: how do I tell CakePHP about my validation
requirements? Validation rules are defined in the model. Let's look
back at our Post model and make a few adjustments:

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';
    
        var $validate = array(
            'title' => array(
                'rule' => 'notEmpty'
            ),
            'body' => array(
                'rule' => 'notEmpty'
            )
        );
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel``
#. ``{``
#. ``var $name = 'Post';``
#. ``var $validate = array(``
#. ``'title' => array(``
#. ``'rule' => 'notEmpty'``
#. ``),``
#. ``'body' => array(``
#. ``'rule' => 'notEmpty'``
#. ``)``
#. ``);``
#. ``}``
#. ``?>``

The ``$validate`` array tells CakePHP how to validate your data
when the ``save()`` method is called. Here, I've specified that
both the body and title fields must not be empty. CakePHP's
validation engine is strong, with a number of pre-built rules
(credit card numbers, email addresses, etc.) and flexibility for
adding your own validation rules. For more information on that
setup, check the
`Data Validation chapter </view/1143/data-validation>`_.

Now that you have your validation rules in place, use the app to
try to add a post with an empty title or body to see how it works.
Since we've used the ``input()`` method of the FormHelper to create
our form elements, our validation error messages will be shown
automatically.
