FormHelper
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $settings = [])

The FormHelper does most of the heavy lifting in form creation.  The FormHelper
focuses on creating forms quickly, in a way that will streamline validation,
re-population and layout. The FormHelper is also flexible - it will do almost
everything for you using conventions, or you can use specific methods to get
only what you need.

Starting a Form
===============

.. php:method:: create(mixed $model = null, array $options = [])

The first method you'll need to use in order to take advantage of the FormHelper
is ``create()``. This method outputs an opening form tag.

All parameters are optional. If ``create()`` is called with no parameters
supplied, it assumes you are building a form that submits to the current
controller, via the current URL. The default method for form submission is POST.
If you were to call ``create()`` inside the view for UsersController::add(), you would see
something like the following output in the rendered view:

.. code-block:: html

    <form method="post" action="/users/add">

The ``$model`` argument is used as the form's 'context'. There are several
built-in form contexts and you can add your own, which we'll cover in the next
section. The built-in providers map to the following values of ``$model``:

* An ``Entity`` instance or, an iterator map to the ``EntityContext``, this
  context allows FormHelper to work with results from the built-in ORM.
* An array containing the ``schema`` key, maps to ``ArrayContext`` which allows
  you to create simple data structures to build forms against.
* ``null`` and ``false`` map to the ``NullContext``, this context class simply
  satisifies the interface FormHelper requires. This context is useful if you
  want to build a short form that doesn't require ORM persistence.

All contexts classes also have access to the request data, making it simpler to
build forms.

Once a form has been created with a context, all inputs you create will use the
active context. In the case of an ORM backed form, FormHelper can access
associated data, validation errors and schema metadata easily making building
forms simple.  You can close the active context using the ``end()`` method, or
by calling ``create()`` again. To create a form for an entity, do the
following::

    // If you are on /articles/add
    // $article should be an empty Article entity.
    echo $this->Form->create($article);

Output:

.. code-block:: html

    <form method="post" action="/articles/add">

This will POST the form data to the ``add()`` action of ArticlesController.
However, you can also use the same logic to create an edit form. The FormHelper
uses the ``$this->request->data`` property to automatically detect whether to
create an add or edit form. If the provided entity is not 'new', the form will
be created as an edit form.  For example, if we browse to
http://example.org/articles/edit/5, we could do the following::

    // App/Controller/ArticlesController.php:
    public function edit($id = null) {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // Save logic goes here
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // Since $article->isNew() is false, we will get an edit form
    <?php echo $this->Form->create($article); ?>

Output:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    Since this is an edit form, a hidden input field is generated to
    override the default HTTP method.

The ``$options`` array is where most of the form configuration
happens. This special array can contain a number of different
key-value pairs that affect the way the form tag is generated.


Options for create()
--------------------

There are a number of options for create():

* ``$options['type']`` This key is used to specify the type of form to be created. Valid
  values include 'post', 'get', 'file', 'patch', 'put' and 'delete'.

  Supplying either 'post' or 'get' changes the form submission method
  accordingly::

      echo $this->Form->create($article, ['type' => 'get']);

  Output:

  .. code-block:: html

     <form method="get" action="/articles/edit/5">

  Specifying 'file' changes the form submission method to 'post', and
  includes an enctype of "multipart/form-data" on the form tag. This
  is to be used if there are any file elements inside the form. The
  absence of the proper enctype attribute will cause the file uploads
  not to function::

      echo $this->Form->create($article, ['type' => 'file']);

  Output:

  .. code-block:: html

     <form enctype="multipart/form-data" method="post" action="/articles/add">

  When using 'put' or 'delete', your form will be functionally equivalent to
  a 'post' form, but when submitted, the HTTP request method will be overridden
  with 'PUT' or 'DELETE', respectively.  This allows CakePHP to emulate proper
  REST support in web browsers.

* ``$options['action']`` The action key allows you to point the form to a
  specific action in your current controller. For example, if you'd like to
  point the form to the login() action of the current controller, you would
  supply an $options array like the following::

    echo $this->Form->create($article, ['action' => 'login']);

  Output:

  .. code-block:: html

     <form id="UserLoginForm" method="post" action="/users/login">

* ``$options['url']`` If the desired form action isn't in the current
  controller, you can specify a URL for the form action using the 'url' key of
  the $options array. The supplied URL can be relative to your CakePHP
  application::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'articles', 'action' => 'publish']
    ]);

  Output:

  .. code-block:: html

     <form method="post" action="/articles/publish">

  or can point to an external domain::

    echo $this->Form->create(null, [
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ]);

  Output:

  .. code-block:: html

    <form method="get" action="http://www.google.com/search">

  Also check :php:meth:`Cake\\View\\Helper\\HtmlHelper::url()` method for more
  examples of different types of URLs.

* ``$options['default']`` If 'default' has been set to boolean false, the form's
  submit action is changed so that pressing the submit button does not submit
  the form. If the form is meant to be submitted via AJAX, setting 'default' to
  false suppresses the form's default behavior so you can grab the data and
  submit it via AJAX instead.

Creating context classes
------------------------

While the built-in context classes are intended to cover the basic cases you'll
encounter you may need to build a new context class if you are using a different
ORM. In these situations you need to implement the
`Cake\\View\\Form\\ContextInterface
<http://api.cakephp.org/3.0/class-Cake.View.Form.ContextInterface.html>`_ . Once
you have implemented this interface you can wire your new context into the
FormHelper. It is often best to do this in a ``View.beforeRender`` event
listener, or in an application view class::

    $this->Form->addContextProvider('myprovider', function($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data['entity']);
        }
    });

Context factory functions are where you can add logic for checking the form
options for the correct type of entity. If matching input data is found you can
return an object. If there is no match return null.

Closing the Form
================

.. php:method:: end($secureAttributes = [])

The ``end()`` method closes and completes a form. Often, ``end()`` will only output
a closing form tag, but using ``end()`` is a good practice as it enables FormHelper to insert
hidden form elements that :php:class:`SecurityComponent` requires:

.. code-block:: php

    <?php echo $this->Form->create(); ?>

    <!-- Form elements go here -->

    <?php echo $this->Form->end(); ?>

The ``$secureAttributes`` parameter allows you to pass additional HTML
attributes to the hidden inputs that are generated when your application is
using ``SecurityComponent``.

.. note::

    If you are using :php:class:`SecurityComponent` in your application you
    should always end your forms with ``end()``.

.. _automagic-form-elements:

Creating Form Elements
======================

There are a few ways to create form inputs with the FormHelper. We'll start by
looking at ``input()``. This method will automatically inspect the model
meta-data supplied to ``create()``, and choose an appropriate input for that
field. Internally ``input()`` delegates to other methods in FormHelper.

.. php:method:: input(string $fieldName, array $options = array())

Creates the following elements given a particular field name:

* Wrapping markup.
* Label element
* Input element(s)
* Error element with message if applicable.

The type of input created depends on the column datatype:

Column Type
    Resulting Form Field
string, uuid (char, varchar, etc.)
    text
boolean, tinyint(1)
    checkbox
decimal
    number
float
    number
integer
    number
text
    textarea
text, with name of password, passwd
    password
text, with name of email
    email
text, with name of tel, telephone, or phone
    tel
date
    day, month, and year selects
datetime, timestamp
    day, month, year, hour, minute, and meridian selects
time
    hour, minute, and meridian selects
binary
    file

The ``$options`` parameter allows you to choose a specific input type if
you need to::

    echo $this->Form->input('published', ['type' => 'checkbox']);

.. _html5-required:

The wrapping div will have a ``required`` class name appended if the
validation rules for the model's field indicate that it is required and not
allowed to be empty. You can disable automatic required flagging using the
required option::

    echo $this->Form->input('title', ['required' => false]);

To skip browser validation triggering for the whole form you can set option
``'formnovalidate' => true`` for the input button you generate using
:php:meth:`FormHelper::submit()` or set ``'novalidate' => true`` in options for
:php:meth:`FormHelper::create()`.

For example, let's assume that your User model includes fields for a
username (varchar), password (varchar), approved (datetime) and
quote (text). You can use the input() method of the FormHelper to
create appropriate inputs for all of these form fields::

    echo $this->Form->create($user);

    echo $this->Form->input('username');   //text
    echo $this->Form->input('password');   //password
    echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
    echo $this->Form->input('quote');      //textarea

    echo $this->Form->button('Add');
    echo $this->Form->end();

A more extensive example showing some options for a date field::

    echo $this->Form->input('birth_dt', array(
        'label' => 'Date of birth',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ));

Besides the specific options for ``input()`` found below, you can specify
any option for the input type & any HTML attribute (for instance ``onfocus``).

Assuming that User BelongsToMany Group. In your controller, set a
camelCase plural variable (group -> groups in this case, or ExtraFunkyModel
-> extraFunkyModels) with the select options. In the controller action you
would put the following::

    $this->set('groups', $this->Users->association('Groups')->find('list'));

And in the view a multiple select can be created with this simple
code::

    echo $this->Form->input('groups._ids', ['options' => $groups]);

If you want to create a select field while using a belongsTo - or
hasOne - Relation, you can add the following to your Users-controller
(assuming your User belongsTo Group)::

    $this->set('groups', $this->Users->association('Groups')->find('list'));

Afterwards, add the following to your form-view::

    echo $this->Form->input('group_id', ['options' => $groups]);

If your model name consists of two or more words, e.g.,
"UserGroup", when passing the data using set() you should name your
data in a pluralised and camelCased format as follows::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    You should not use ``FormHelper::input()`` to generate submit buttons. Use
    :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` instead.

Field Naming Conventions
------------------------

When creating input widgets you should name your fields after the matching
attributes in the form's entity. For example, if you created a form for an
``$article``, you would create fields named after the properities. E.g
``title``, ``body`` and ``published``.

You can create inputs for associated models, or arbitrary models by passing in
``association.fieldname`` as the first parameter::

    echo $this->Form->input('association.fieldname');

Any dots in your field names will be converted into nested request data. For
example, if you created a field with a name ``0.comments.body`` you would get
a name attribute that looks like ``0[comments][body]``. This convention makes it
easy to save data with the ORM.

When creating datetime related inputs, FormHelper will append a field-suffix.
You may notice additional fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` being added. These fields will be automatically converted into 
``DateTime`` objects when entities are marshalled.


Options
-------

``FormHelper::input()`` supports a large number of options. In addition to its
own options ``input()`` accepts options for the generated input types, as well as
HTML attributes. The following will cover the options specific to
``FormHelper::input()``.

* ``$options['type']`` You can force the type of an input, overriding model
  introspection, by specifying a type. In addition to the field types found in
  the :ref:`automagic-form-elements`, you can also create 'file', 'password',
  and any type supported by HTML5::

    echo $this->Form->input('field', array('type' => 'file'));
    echo $this->Form->input('email', array('type' => 'email'));

  Output:

  .. code-block:: html

    <div class="input file">
        <label for="field">Field</label>
        <input type="file" name="field" value="" id="field" />
    </div>
    <div class="input email">
        <label for="email">Email</label>
        <input type="email" name="email" value="" id="email" />
    </div>

* ``$options['label']`` Set this key to the string you would like to be
  displayed within the label that usually accompanies the input::

    echo $this->Form->input('User.name', array(
        'label' => 'The User Alias'
    ));

  Output:

  .. code-block:: html

    <div class="input">
        <label for="user-name">The User Alias</label>
        <input name="User[name]" type="text" value="" id="user-name" />
    </div>

  Alternatively, set this key to false to disable the output of the
  label::

    echo $this->Form->input('User.name', array('label' => false));

  Output:

  .. code-block:: html

    <div class="input">
        <input name="User[name]" type="text" value="" id="user-name" />
    </div>

  Set this to an array to provide additional options for the
  ``label`` element. If you do this, you can use a ``text`` key in
  the array to customize the label text::

    echo $this->Form->input('User.name', array(
        'label' => array(
            'class' => 'thingy',
            'text' => 'The User Alias'
        )
    ));

  Output:

  .. code-block:: html

    <div class="input">
        <label for="user-name" class="thingy">The User Alias</label>
        <input name="User[name]" type="text" value="" id="user-name" />
    </div>


* ``$options['error']`` Using this key allows you to override the default model
  error messages and can be used, for example, to set i18n messages. It has a
  number of suboptions which control the wrapping element, wrapping element
  class name, and whether HTML in the error message will be escaped.

  To disable error message output & field classes set the error key to false::

    echo $this->Form->input('Model.field', array('error' => false));

  .. TODO:: Continue here.

  To override the model error messages use an array with
  the keys matching the validation rule names::

    $this->Form->input('Model.field', array(
        'error' => array('tooShort' => __('This is not long enough'))
    ));

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

Customizing the templates FormHelper uses
=========================================

Like many helpers in CakePHP, FormHelper uses string templates to format the
HTML it creates. While the default templates are intended to be a reasonable set
of defaults. You may need to customize the templates to suit your application.

To change the templates when the helper is loaded you can set the ``templates``
option when including the helper in your controller::

    public $helpers = [
        'Form' => [
            'templates' => 'app_form.php',
        ]
    ];

This would load the tags in ``App/Config/app_form.php``. This file should
contain an array of templates indexed by name::

    $config = [
        'groupContainer' => '<div class="form-control">{{content}}</div>',
    ];

Any templates you define will replace the default ones included in the helper.
You can also change the templates at runtime using the ``templates()`` method::

    $this->Form->templates($myTemplates);

List of templates
-----------------

A list of the default templates and the variables they can expect are:

* ``button`` {{attrs}}, {{text}}
* ``checkbox`` {{name}}, {{value}}, {{attrs}}
* ``checkboxContainer`` {{input}}, {{label}}
* ``dateWidget`` {{month}}, {{day}}, {{year}}, {{hour}}, {{minute}}, {{second}}, {{meridian}}
* ``error`` {{content}}
* ``errorList`` {{content}}
* ``errorItem`` {{text}}
* ``file`` {{name}}, {{attrs}}
* ``formstart`` {{attrs}}
* ``formend`` No variables are provided.
* ``hiddenblock`` {{content}}
* ``input`` {{type}}, {{name}}, {{attrs}}
* ``label`` {{attrs}}, {{text}}
* ``option`` {{value}}, {{attrs}}, {{text}}
* ``optgroup`` {{label}}, {{attrs}}, {{content}}
* ``select`` {{name}}, {{attrs}}, {{content}}
* ``selectMultiple`` {{name}}, {{attrs}}, {{content}}
* ``radio`` {{name}}, {{value}}, {{attrs}}
* ``radioContainer``  {{input}}, {{label}},
* ``textarea``  {{name}}, {{attrs}}, {{value}}
* ``formGroup`` {{label}}, {{input}},
* ``checkboxFormGroup`` {{input}}, {{label}},
* ``groupContainer`` {{type}}, {{required}}, {{content}}
* ``groupContainerError`` {{type}}, {{required}}, {{content}}, {{error}}


Generating Specific Types of Inputs
===================================

In addition to the generic ``input()`` method, ``FormHelper`` has specific
methods for generating a number of different types of inputs. These can be used
to generate just the input widget itself, and combined with other methods like
:php:meth:`~FormHelper::label()` and :php:meth:`~FormHelper::error()` to
generate fully custom form layouts.

.. _general-input-options:

Common Options
--------------

Many of the various input element methods support a common set of options. All
of these options are also supported by ``input()``. To reduce repetition the
common options shared by all input methods are as follows:

* ``$options['class']`` You can set the class name for an input::

    echo $this->Form->input('title', array('class' => 'custom-class'));

* ``$options['id']`` Set this key to force the value of the DOM id for the input.

* ``$options['default']`` Used to set a default value for the input field. The
  value is used if the data passed to the form does not contain a value for the
  field (or if no data is passed at all).

  Example usage::

    echo $this->Form->input('ingredient', array('default' => 'Sugar'));

  Example with select field (Size "Medium" will be selected as
  default)::

    $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
    echo $this->Form->input('size', array('options' => $sizes, 'default' => 'm'));

  .. note::

    You cannot use ``default`` to check a checkbox - instead you might
    set the value in ``$this->request->data`` in your controller,
    or set the input option ``checked`` to true.

    Date and datetime fields' default values can be set by using the
    'selected' key.

    Beware of using false to assign a default value. A false value is used to
    disable/exclude options of an input field, so ``'default' => false`` would
    not set any value at all. Instead use ``'default' => 0``.

In addition to the above options, you can mixin any HTML attribute you wish to
use. Any non-special option name will be treated as an HTML attribute, and
applied to the generated HTML input element.


Options for Select, Checkbox and Radio Inputs
---------------------------------------------

* ``$options['selected']`` Used in combination with a select-type input (i.e.
  For types select, date, time, datetime). Set 'selected' to the value of the
  item you wish to be selected by default when the input is rendered::

    echo $this->Form->input('close_time', array(
        'type' => 'time',
        'selected' => '13:30:00'
    ));

  .. note::

    The selected key for date and datetime inputs may also be a UNIX
    timestamp.

* ``$options['empty']`` If set to true, forces the input to remain empty.

  When passed to a select list, this creates a blank option with an
  empty value in your drop down list. If you want to have a empty
  value with text displayed instead of just a blank option, pass in a
  string to empty::

      echo $this->Form->input('field', array(
          'options' => array(1, 2, 3, 4, 5),
          'empty' => '(choose one)'
      ));

  Output:

  .. code-block:: html

      <div class="input">
          <label for="UserField">Field</label>
          <select name="User[field]" id="UserField">
              <option value="">(choose one)</option>
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
          </select>
      </div>

  .. note::

      If you need to set the default value in a password field to blank,
      use 'value' => '' instead.

  Options can also supplied as key-value pairs.

* ``$options['hiddenField']`` For certain input types (checkboxes, radios) a
  hidden input is created so that the key in $this->request->data will exist
  even without a value specified:

  .. code-block:: html

    <input type="hidden" name="Post[Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="Post[Published]" value="1" id="PostPublished" />

  This can be disabled by setting the ``$options['hiddenField'] = false``::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

  Which outputs:

  .. code-block:: html

    <input type="checkbox" name="Post[Published]" value="1" id="PostPublished" />

  If you want to create multiple blocks of inputs on a form that are
  all grouped together, you should use this parameter on all inputs
  except the first. If the hidden input is on the page in multiple
  places, only the last group of input's values will be saved

  In this example, only the tertiary colors would be passed, and the
  primary colors would be overridden:

  .. code-block:: html

    <h2>Primary Colors</h2>
    <input type="hidden" name="Color[Color]" id="Colors_" value="0" />
    <input type="checkbox" name="Color[Color][]" value="5" id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="Color[Color][]" value="5" id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="Color[Color][]" value="5" id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="Color[Color]" id="Colors_" value="0" />
    <input type="checkbox" name="Color[Color][]" value="5" id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="Color[Color][]" value="5" id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="Addon[Addon][]" value="5" id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

  Disabling the ``'hiddenField'`` on the second input group would
  prevent this behavior.

  You can set a different hidden field value other than 0 such as 'N'::

      echo $this->Form->checkbox('published', array(
          'value' => 'Y',
          'hiddenField' => 'N',
      ));

Datetime Options
----------------

* ``$options['timeFormat']`` Used to specify the format of the select inputs for
  a time-related set of inputs. Valid values include ``12``, ``24``, and ``null``.

* ``$options['dateFormat']`` Used to specify the format of the select inputs for
  a date-related set of inputs. Valid values include any combination of 'D',
  'M' and 'Y' or ``null``. The inputs will be put in the order defined by the
  dateFormat option.

* ``$options['minYear'], $options['maxYear']`` Used in combination with a
  date/datetime input. Defines the lower and/or upper end of values shown in the
  years select field.

* ``$options['orderYear']`` Used in combination with a date/datetime input.
  Defines the order in which the year values will be set. Valid values include
  'asc', 'desc'. The default value is 'desc'.

* ``$options['interval']`` This option specifies the number of minutes between
  each option in the minutes select box::

    echo $this->Form->input('Model.time', array(
        'type' => 'time',
        'interval' => 15
    ));

  Would create 4 options in the minute select. One for each 15
  minutes.

* ``$options['round']`` Can be set to `up` or `down` to force rounding in either direction.
  Defaults to null which rounds half up according to `interval`.

  .. versionadded:: 2.4

Form Element-Specific Methods
=============================

.. php:method:: label(string $fieldName, string $text, array $options)

    Create a label element. ``$fieldName`` is used for generating the
    DOM id. If ``$text`` is undefined, ``$fieldName`` will be used to inflect
    the label's text::

        echo $this->Form->label('User.name');
        echo $this->Form->label('User.name', 'Your username');

    Output:

    .. code-block:: html

        <label for="UserName">Name</label>
        <label for="UserName">Your username</label>

    ``$options`` can either be an array of HTML attributes, or a string that
    will be used as a class name::

        echo $this->Form->label('User.name', null, array('id' => 'user-label'));
        echo $this->Form->label('User.name', 'Your username', 'highlight');

    Output:

    .. code-block:: html

        <label for="UserName" id="user-label">Name</label>
        <label for="UserName" class="highlight">Your username</label>

.. php:method:: text(string $name, array $options)

    The rest of the methods available in the FormHelper are for
    creating specific form elements. Many of these methods also make
    use of a special $options parameter. In this case, however,
    $options is used primarily to specify HTML tag attributes (such as
    the value or DOM id of an element in the form)::

        echo $this->Form->text('username', array('class' => 'users'));

    Will output:

    .. code-block:: html

        <input name="User[username]" type="text" class="users" id="UserUsername" />

.. php:method:: password(string $fieldName, array $options)

    Creates a password field.::

        echo $this->Form->password('password');

    Will output:

    .. code-block:: html

        <input name="User[password]" value="" id="UserPassword" type="password" />

.. php:method:: hidden(string $fieldName, array $options)

    Creates a hidden form input. Example::

        echo $this->Form->hidden('id');

    Will output:

    .. code-block:: html

        <input name="User[id]" value="10" id="UserId" type="hidden" />

    .. versionchanged:: 2.0
        Hidden fields no longer remove the class attribute. This means
        that if there are validation errors on hidden fields, the
        error-field class name will be applied.

.. php:method:: textarea(string $fieldName, array $options)

    Creates a textarea input field.::

        echo $this->Form->textarea('notes');

    Will output:

    .. code-block:: html

        <textarea name="User[notes]" id="UserNotes"></textarea>

    .. note::

        The ``textarea`` input type allows for the ``$options`` attribute
        of ``'escape'`` which determines whether or not the contents of the
        textarea should be escaped. Defaults to ``true``.

    ::

        echo $this->Form->textarea('notes', array('escape' => false);
        // OR....
        echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false);


    **Options**

    In addition to the :ref:`general-input-options`, textarea() supports a few
    specific options:

    * ``$options['rows'], $options['cols']`` These two keys specify the number of
      rows and columns::

        echo $this->Form->textarea('textarea', array('rows' => '5', 'cols' => '5'));

      Output:

    .. code-block:: html

        <textarea name="Form[textarea]" cols="5" rows="5" id="FormTextarea">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    Creates a checkbox form element. This method also generates an
    associated hidden form input to force the submission of data for
    the specified field.::

        echo $this->Form->checkbox('done');

    Will output:

    .. code-block:: html

        <input type="hidden" name="User[done]" value="0" id="UserDone_" />
        <input type="checkbox" name="User[done]" value="1" id="UserDone" />

    It is possible to specify the value of the checkbox by using the
    $options array::

        echo $this->Form->checkbox('done', array('value' => 555));

    Will output:

    .. code-block:: html

        <input type="hidden" name="User[done]" value="0" id="UserDone_" />
        <input type="checkbox" name="User[done]" value="555" id="UserDone" />

    If you don't want the Form helper to create a hidden input::

        echo $this->Form->checkbox('done', array('hiddenField' => false));

    Will output:

    .. code-block:: html

        <input type="checkbox" name="User[done]" value="1" id="UserDone" />


.. php:method:: radio(string $fieldName, array $options, array $attributes)

    Creates a set of radio button inputs.

    **Options**

    * ``$attributes['value']`` to set which value should be selected default.

    * ``$attributes['separator']`` to specify HTML in between radio
      buttons (e.g. <br />).

    * ``$attributes['between']`` specify some content to be inserted between the
      legend and first element.

    * ``$attributes['disabled']`` Setting this to ``true`` or ``'disabled'``
      will disable all of the generated radio buttons.

    * ``$attributes['legend']`` Radio elements are wrapped with a label and
      fieldset by default. Set ``$attributes['legend']`` to false to remove
      them.::

        $options = array('M' => 'Male', 'F' => 'Female');
        $attributes = array('legend' => false);
        echo $this->Form->radio('gender', $options, $attributes);

      Will output:

      .. code-block:: html

        <input name="User[gender]" id="UserGender_" value="" type="hidden" />
        <input name="User[gender]" id="UserGenderM" value="M" type="radio" />
        <label for="UserGenderM">Male</label>
        <input name="User[gender]" id="UserGenderF" value="F" type="radio" />
        <label for="UserGenderF">Female</label>

    If for some reason you don't want the hidden input, setting
    ``$attributes['value']`` to a selected value or boolean false will
    do just that.

    .. versionchanged:: 2.1
        The ``$attributes['disabled']`` option was added in 2.1.


.. php:method:: select(string $fieldName, array $options, array $attributes)

    Creates a select element, populated with the items in ``$options``,
    with the option specified by ``$attributes['value']`` shown as selected by
    default. Set the 'empty' key in the ``$attributes`` variable to false to
    turn off the default empty option::

        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options);

    Will output:

    .. code-block:: html

        <select name="User[gender]" id="UserGender">
        <option value=""></option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        </select>

    The ``select`` input type allows for a special ``$option``
    attribute called ``'escape'`` which accepts a bool and determines
    whether to HTML entity encode the contents of the select options.
    Defaults to true::

        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options, array('escape' => false));

    * ``$attributes['options']`` This key allows you to manually specify options for a
      select input, or for a radio group. Unless the 'type' is specified as 'radio',
      the FormHelper will assume that the target output is a select input::

        echo $this->Form->select('field', array(1,2,3,4,5));

      Output:

      .. code-block:: html

        <select name="User[field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

      Options can also be supplied as key-value pairs::

        echo $this->Form->select('field', array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2',
            'Value 3' => 'Label 3'
        ));

      Output:

      .. code-block:: html

        <select name="User[field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>

      If you would like to generate a select with optgroups, just pass
      data in hierarchical format. This works on multiple checkboxes and radio
      buttons too, but instead of optgroups wraps elements in fieldsets::

        $options = array(
           'Group 1' => array(
              'Value 1' => 'Label 1',
              'Value 2' => 'Label 2'
           ),
           'Group 2' => array(
              'Value 3' => 'Label 3'
           )
        );
        echo $this->Form->select('field', $options);

      Output:

      .. code-block:: html

        <select name="User[field]" id="UserField">
            <optgroup label="Group 1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Group 2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>

    * ``$attributes['multiple']`` If 'multiple' has been set to true for an input that
      outputs a select, the select will allow multiple selections::

        echo $this->Form->select('Model.field', $options, array('multiple' => true));

      Alternatively set 'multiple' to 'checkbox' to output a list of
      related check boxes::

        $options = array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox'
        ));

      Output:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="Model[field]" value="" id="ModelField" type="hidden">
           <div class="checkbox">
              <input name="Model[field][]" value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="Model[field][]" value="Value 2" id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    * ``$attributes['disabled']`` When creating checkboxes, this option can be set
      to disable all or some checkboxes. To disable all checkboxes set disabled
      to ``true``::

        $options = array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox',
            'disabled' => array('Value 1')
        ));

      Output:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField" type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" disabled="disabled" value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2" id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

.. php:method:: file(string $fieldName, array $options)

To add a file upload field to a form, you must first make sure that
the form enctype is set to "multipart/form-data", so start off with
a create function such as the following::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OR
    echo $this->Form->create($document, ['type' => 'file']);

Next add either of the two lines to your form view file::

    echo $this->Form->input('submittedfile', [
        'type' => 'file'
    ]);

    // OR
    echo $this->Form->file('submittedfile');

Due to the limitations of HTML itself, it is not possible to put
default values into input fields of type 'file'. Each time the form
is displayed, the value inside will be empty.

Upon submission, file fields provide an expanded data array to the
script receiving the form data.

For the example above, the values in the submitted data array would
be organized as follows, if the CakePHP was installed on a Windows
server. 'tmp\_name' will have a different path in a Unix
environment::

    $this->request->data['submittedfile'] = array(
        'name' => 'conference_schedule.pdf',
        'type' => 'application/pdf',
        'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
        'error' => 0, // On windows this can be a string.
        'size' => 41737,
    );

This array is generated by PHP itself, so for more detail on the
way PHP handles data passed via file fields
`read the PHP manual section on file uploads <http://php.net/features.file-upload>`_.

.. note::

    When using ``$this->Form->file()``, remember to set the form
    encoding-type, by setting the type option to 'file' in
    ``$this->Form->create()``


Creating Buttons and Submit Elements
====================================

.. php:method:: submit(string $caption, array $options)

    Creates a submit button with caption ``$caption``. If the supplied
    ``$caption`` is a URL to an image (it contains a '.' character),
    the submit button will be rendered as an image.

    It is enclosed between ``div`` tags by default; you can avoid this
    by declaring ``$options['div'] = false``::

        echo $this->Form->submit();

    Will output:

    .. code-block:: html

        <div class="submit"><input value="Submit" type="submit"></div>

    You can also pass a relative or absolute URL to an image for the
    caption parameter instead of caption text.::

        echo $this->Form->submit('ok.png');

    Will output:

    .. code-block:: html

        <div class="submit"><input type="image" src="/img/ok.png"></div>

.. php:method:: button(string $title, array $options = array())

Creates an HTML button with the specified title and a default type
of "button". Setting ``$options['type']`` will output one of the
three possible button types:

#. submit: Same as the ``$this->Form->submit`` method - (the
   default).
#. reset: Creates a form reset button.
#. button: Creates a standard push button.

::

    echo $this->Form->button('A Button');
    echo $this->Form->button('Another Button', array('type' => 'button'));
    echo $this->Form->button('Reset the Form', array('type' => 'reset'));
    echo $this->Form->button('Submit Form', array('type' => 'submit'));

Will output:

.. code-block:: html

    <button type="submit">A Button</button>
    <button type="button">Another Button</button>
    <button type="reset">Reset the Form</button>
    <button type="submit">Submit Form</button>


The ``button`` input type supports the ``escape`` option, which accepts a
bool and determines whether to HTML entity encode the $title of the button.
Defaults to false::

    echo $this->Form->button('Submit Form', array('type' => 'submit', 'escape' => true));

.. php:method:: postButton(string $title, mixed $url, array $options = array ())

Create a ``<button>`` tag with a surrounding ``<form>`` that submits via
POST.

This method creates a ``<form>`` element. So do not use this method in some
opened form. Instead use :php:meth:`FormHelper::submit()` or
:php:meth:`FormHelper::button()` to create buttons inside opened forms.

.. php:method:: postLink(string $title, mixed $url = null, array $options = [], string $confirmMessage = false)

Creates an HTML link, but accesses the URL using method POST. Requires
JavaScript to be enabled in browser.

This method creates a ``<form>`` element. So do not use this method inside
an existing form. Instead you should add a submit button using
:php:meth:`FormHelper::submit()`


Creating Date and Time Inputs
=============================

.. php:method:: dateTime($fieldName, $options = [])

Creates a set of select inputs for date and time. This method accepts a number
of options:

* ``monthNames`` If false, 2 digit numbers will be used instead of text.
  If an array, the given array will be used.
* ``minYear`` The lowest year to use in the year select
* ``maxYear`` The maximum year to use in the year select
* ``interval`` The interval for the minutes select. Defaults to 1
* ``empty`` - If true, the empty select option is shown. If a string,
  that string is displayed as the empty element.
* ``round`` - Set to ``up`` or ``down`` if you want to force rounding in either direction. Defaults to null.
* ``default`` The default value to be used by the input. A value in ``$this->request->data``
  matching the field name will override this value. If no default is provided ``time()`` will be used.
* ``timeFormat`` The time format to use, either 12 or 24.
* ``second`` Set to true to enable seconds drop down.

To control the order of inputs, and any elements/content between the inputs you
can override the ``dateWidget`` template. By default the ``dateWidget`` template
is::

    {{month}}{{day}}{{year}}{{hour}}{{minute}}{{second}}{{meridian}}

.. php:method:: year(string $fieldName, array $options = [])

Creates a select element populated with the years from ``minYear``
to ``maxYear``. Additionally, HTML attributes may be supplied in $options. If
``$options['empty']`` is false, the select will not include an
empty option:

* ``empty`` - If true, the empty select option is shown. If a string,
  that string is displayed as the empty element.
* ``orderYear`` - Ordering of year values in select options.
  Possible values 'asc', 'desc'. Default 'desc'
* ``value`` The selected value of the input.
* ``maxYear`` The max year to appear in the select element.
* ``minYear`` The min year to appear in the select element.

For example, to create a year range range from 2000 to the current year you
would do the following::

    echo $this->Form->year('purchased', [
        'minYear' => 2000,
        'maxYear' => date('Y')
    ]);

If it was 2009, you would get the following:

.. code-block:: html

    <select name="purchased[year]">
    <option value=""></option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    <option value="2004">2004</option>
    <option value="2003">2003</option>
    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
    </select>

.. php:method:: month(string $fieldName, array $attributes)

Creates a select element populated with month names::

    echo $this->Form->month('mob');

Will output:

.. code-block:: html

    <select name="mob[month]">
    <option value=""></option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
    </select>

You can pass in your own array of months to be used by setting the
'monthNames' attribute, or have months displayed as numbers by
passing false. (Note: the default months are internationalized and
can be translated using localization.)::

    echo $this->Form->month('mob', ['monthNames' => false]);

.. php:method:: day(string $fieldName, array $attributes)

Creates a select element populated with the (numerical) days of the
month.

To create an empty option with prompt text of your choosing (e.g.
the first option is 'Day'), you can supply the text as the final
parameter as follows::

    echo $this->Form->day('created');

Will output:

.. code-block:: html

    <select name="created[day]">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

.. php:method:: hour(string $fieldName, array $attributes)

Creates a select element populated with the hours of the day. You can
create either 12 or 24 hour pickers using the format option::

    echo $this->Form->hour('created', [
        'format' => 12
    ]);
    echo $this->Form->hour('created', [
        'format' => 24
    ]);

.. php:method:: minute(string $fieldName, array $attributes)

Creates a select element populated with the minutes of the hour. You
can create a select that only contains specific values using the ``interval``
option. For example, if you wanted 10 minute increments you would do the
following::

    echo $this->Form->minute('created', [
        'interval' => 10
    ]);

.. php:method:: meridian(string $fieldName, array $attributes)

Creates a select element populated with 'am' and 'pm'.

.. php:method:: inputs(mixed $fields = null, array $blacklist = null)

Generates a set of inputs for ``$fields``. If $fields is null the current model
will be used.

In addition to controller fields output, ``$fields`` can be used to control
legend and fieldset rendering with the ``fieldset`` and ``legend`` keys.
``$this->Form->inputs(array('legend' => 'My legend'));``
Would generate an input set with a custom legend. You can customize
individual inputs through ``$fields`` as well.::

    echo $this->Form->inputs(array(
        'name' => array('label' => 'custom label')
    ));

In addition to fields control, inputs() allows you to use a few additional
options.

- ``fieldset`` Set to false to disable the fieldset. If a string is supplied
  it will be used as the class name for the fieldset element.
- ``legend`` Set to false to disable the legend for the generated input set.
  Or supply a string to customize the legend text.

Displaying and Checking Errors
==============================

.. php:method:: error(string $fieldName, mixed $text, array $options)

Shows a validation error message, specified by $text, for the given
field, in the event that a validation error has occurred.

Options:

-  'escape' bool Whether or not to HTML escape the contents of the
   error.
-  'wrap' mixed Whether or not the error message should be wrapped
   in a div. If a string, will be used as the HTML tag to use.
-  'class' string The class name for the error message


.. TODO:: Add examples.

.. php:method:: isFieldError(string $fieldName)

Returns true if the supplied $fieldName has an active validation
error.::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. note::

    When using :php:meth:`FormHelper::input()`, errors are rendered by default.


Working with SecurityComponent
==============================

:php:meth:`SecurityComponent` offers several features that make your forms safer
and more secure. By simply including the ``SecurityComponent`` in your
controller, you'll automatically benefit from CSRF and form tampering features.

As mentioned previously when using SecurityComponent, you should always close
your forms using :php:meth:`FormHelper::end()`. This will ensure that the
special ``_Token`` inputs are generated.

.. php:method:: unlockField($name)

    Unlocks a field making it exempt from the ``SecurityComponent`` field
    hashing. This also allows the fields to be manipulated by JavaScript.
    The ``$name`` parameter should be the entity name for the input::

        $this->Form->unlockField('User.id');

.. php:method:: secure(array $fields = array())

    Generates a hidden field with a security hash based on the fields used
    in the form.


.. meta::
    :title lang=en: FormHelper
    :description lang=en: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=en: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
