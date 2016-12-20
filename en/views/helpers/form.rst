Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

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
If you were to call ``create()`` inside the view for UsersController::add(), you
would see something like the following output in the rendered view:

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
associated data, validation errors and schema metadata. You can close the active
context using the ``end()`` method, or by calling ``create()`` again. To create
a form for an entity, do the following::

    // If you are on /articles/add
    // $article should be an empty Article entity.
    echo $this->Form->create($article);

Output:

.. code-block:: html

    <form method="post" action="/articles/add">

This will POST the form data to the ``add()`` action of ArticlesController.
However, you can also use the same logic to create an edit form. The FormHelper
uses the ``Entity`` object to automatically detect whether to
create an add or edit form. If the provided entity is not 'new', the form will
be created as an edit form.  For example, if we browse to
**http://example.org/articles/edit/5**, we could do the following::

    // src/Controller/ArticlesController.php:
    public function edit($id = null)
    {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // Save logic goes here
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // Since $article->isNew() is false, we will get an edit form
    <?= $this->Form->create($article) ?>

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


Changing the HTTP Method for a Form
-----------------------------------

By using the ``type`` option you can change the HTTP method a form will use::

    echo $this->Form->create($article, ['type' => 'get']);

Output:

.. code-block:: html

    <form method="get" action="/articles/edit/5">

Specifying a ``'file'`` value for ``type`` changes the form submission method to 'post', and includes an
enctype of "multipart/form-data" on the form tag. This is to be used if there
are any file elements inside the form. The absence of the proper enctype
attribute will cause the file uploads not to function::

    echo $this->Form->create($article, ['type' => 'file']);

Output:

.. code-block:: html

   <form enctype="multipart/form-data" method="post" action="/articles/add">

When using ``'put'``, ``'patch'`` or ``'delete'`` as ``type`` values, your form will be functionally equivalent
to a 'post' form, but when submitted, the HTTP request method will be overridden
with 'PUT', 'PATCH' or 'DELETE', respectively.  This allows CakePHP to emulate
proper REST support in web browsers.

Setting a URL for the Form
--------------------------

Using the ``url`` option allows you to point the form to a specific action in
your current controller or another controller in your application.  For example,
if you'd like to point the form to the ``login()`` action of the current
controller, you would supply an $options array like the following::

    echo $this->Form->create($article, ['url' => ['action' => 'login']]);

Output:

.. code-block:: html

    <form method="post" action="/users/login">

If the desired form action isn't in the current controller, you can specify
a complete URL for the form action. The supplied URL can be relative to your
CakePHP application::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'Articles', 'action' => 'publish']
    ]);

Output:

.. code-block:: html

    <form method="post" action="/articles/publish">

Or you can point to an external domain::

    echo $this->Form->create(null, [
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ]);

Output:

.. code-block:: html

    <form method="get" action="http://www.google.com/search">

Use ``'url' => false`` if you don't want to output a URL as the form action.

Using Custom Validators
-----------------------

Often models will have multiple validation sets, and you will want FormHelper to
mark fields required based on a the specific validation rules your controller
action is going to apply. For example, your Users table has specific validation
rules that only apply when an account is being registered::

    echo $this->Form->create($user, [
        'context' => ['validator' => 'register']
    ]);

The above will use the rules defined in the ``register`` validator, which are
defined by ``UsersTable::validationRegister()``, for the ``$user`` and all
related associations. If you are creating a form for associated entities, you
can define validation rules for each association by using an array::

    echo $this->Form->create($user, [
        'context' => [
            'validator' => [
                'Users' => 'register',
                'Comments' => 'default'
            ]
        ]
    ]);

The above would use ``register`` for the user, and ``default`` for the user's
comments.

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

    $this->Form->addContextProvider('myprovider', function ($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data);
        }
    });

Context factory functions are where you can add logic for checking the form
options for the correct type of entity. If matching input data is found you can
return an object. If there is no match return null.

.. _automagic-form-elements:

Creating Form Inputs
====================

.. php:method:: input(string $fieldName, array $options = [])

* ``$fieldName`` - A field name from the model;
* ``$options`` - An optional array of options that can include ``input``-specific options,
options for the other methods (which ``input()`` employs internally to generate 
various HTML elements) as well as any valid HTML attributes.

The ``input()`` method lets you to generate complete form inputs. These
inputs will include a wrapping div, label, input widget, and validation error if
necessary. By using the metadata in the form context, this method will choose an
appropriate input type for each field. Internally ``input()`` uses the other
methods of FormHelper.

By default the ``input()`` method will employ the following widget templates::

'inputContainer' => '<div class="input {{type}}{{required}}">{{content}}</div>
'input' => '<input type="{{type}}" name="{{name}}"{{attrs}}/>'

In case of validation errors it will also use::

'inputContainerError' => '<div class="input {{type}}{{required}} error">{{content}}{{error}}</div>'

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

.. note::
As a small subtelty, generating specific types of input via the ``input()`` form method by providing a specific input ``type`` option (e.g. ``'type' => 'checkbox'`` as in the example above) will always also generate the wrapping ``div``, by default. Generating the same type of input element via one of the specific form methods (e.g. ``$this->Form->checkbox('published');``) in most cases won't generate the wrapping ``div``. Depending on your need you can use one or another when both are available.


.. _html5-required:

The wrapping div will have a ``required`` class name appended if the
validation rules for the model's field indicate that it is required and not
allowed to be empty. You can disable automatic ``required`` flagging using the
``'required'`` option::

    echo $this->Form->input('title', ['required' => false]);

To skip browser validation triggering for the whole form you can set option
``'formnovalidate' => true`` for the input button you generate using
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` or set ``'novalidate' =>
true`` in options for :php:meth:`~Cake\\View\\Helper\\FormHelper::create()`.

For example, let's assume that your Users model includes fields for a
*username* (varchar), *password* (varchar), *approved* (datetime) and
*quote* (text). You can use the ``input()`` method of the FormHelper to
create appropriate inputs for all of these form fields::

    echo $this->Form->create($user);
    // The following generates a Text input
    echo $this->Form->input('username');
    // The following generates a Password input
    echo $this->Form->input('password');
    // The following generates Day, Month, Year, Hour, Minute, Meridian
    echo $this->Form->input('approved');
    // The following generates a Textarea input
    echo $this->Form->input('quote');

    echo $this->Form->button('Add');
    echo $this->Form->end();

A more extensive example showing some options for a date field::

    echo $this->Form->input('birth_dt', [
        'label' => 'Date of birth',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

Besides the specific :ref:`options <input-specific-options>` for ``input()`` found below, you also can specify
any option for the chosen (or inferred by Cake) input type and any HTML attribute (for instance ``onfocus``).

If you want to create a ``select`` form field while using a *belongsTo* (or
*hasOne*) relation, you can add the following to your UsersController
(assuming your User *belongsTo* Group)::

    $this->set('groups', $this->Users->Groups->find('list'));

Afterwards, add the following to your view template::

    echo $this->Form->input('group_id', ['options' => $groups]);

To make a ``select`` box for a User *belongsToMany* Groups association you can add the
following to your UsersController::

    $this->set('groups', $this->Users->Groups->find('list'));

Afterwards, add the following to your view template::

    echo $this->Form->input('groups._ids', ['options' => $groups]);

If your model name consists of two or more words (e.g.
"UserGroup"), when passing the data using ``set()`` you should name your
data in a pluralised and `lower camelCased <https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms>` format as follows::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    You should not use ``FormHelper::input()`` to generate submit buttons. Use
    :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` instead.

Field Naming Conventions
------------------------

When creating input widgets you should name your fields after the matching
attributes in the form's entity. For example, if you created a form for an
``$article`` entity, you would create fields named after the properities. E.g.
``title``, ``body`` and ``published``.

You can create inputs for associated models, or arbitrary models by passing in
``association.fieldname`` as the first parameter::

    echo $this->Form->input('association.fieldname');

Any dots in your field names will be converted into nested request data. For
example, if you created a field with a name ``0.comments.body`` you would get
a name attribute that looks like ``0[comments][body]``. This convention makes it
easy to save data with the ORM. Details for the various association types can
be found in the :ref:`associated-form-inputs` section.

When creating datetime related inputs, FormHelper will append a field-suffix.
You may notice additional fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` being added. These fields will be automatically
converted into ``DateTime`` objects when entities are marshalled.

.. _input-specific-options:

Options
-------

``FormHelper::input()`` supports a large number of options. In addition to its
own options ``input()`` accepts options for the inferred/chosen input types (e.g. for ``checkbox`` or ``textarea``), as well as
HTML attributes. This subsection will cover the options specific to
``FormHelper::input()``.

* ``$options['type']`` - You can force the type of an input, overriding model
  introspection, by specifying a ``type``. In addition to the field types found in
  the :ref:`automagic-form-elements`, you can also create ``'file'``, ``'password'``,
  and any other type supported by HTML5::

    echo $this->Form->input('field', ['type' => 'file']);
    echo $this->Form->input('email', ['type' => 'email']);

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

* ``$options['label']`` - Set this key to the string you would like to be
  displayed within the label that usually accompanies the input::

    echo $this->Form->input('name', [
        'label' => 'The User Alias'
    ]);

  Output:

  .. code-block:: html

    <div class="input">
        <label for="name">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

  Alternatively, set this key to ``false`` to disable the generation of the
  ``label`` element::

    echo $this->Form->input('name', ['label' => false]);

  Output:

  .. code-block:: html

    <div class="input">
        <input name="name" type="text" value="" id="name" />
    </div>

  Set this to an array to provide additional options for the
  ``label`` element. If you do this, you can use a ``text`` key in
  the array to customize the label text::

    echo $this->Form->input('name', [
        'label' => [
            'class' => 'thingy',
            'text' => 'The User Alias'
        ]
    ]);

  Output:

  .. code-block:: html

    <div class="input">
        <label for="name" class="thingy">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

* ``$options['error']`` - Using this key allows you to override the default model
  error messages and can be used, for example, to set i18n messages.

  To disable error message output & field classes set the ``error`` key to ``false``::

    echo $this->Form->input('name', ['error' => false]);

  To override the model error messages use an array with
  the keys matching the original validation error messages::

    $this->Form->input('name', [
        'error' => ['Not long enough' => __('This is not long enough')]
    ]);

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

Generating Specific Types of Inputs
===================================

In addition to the generic ``input()`` method, ``FormHelper`` has specific
methods for generating a number of different types of inputs. These can be used
to generate just the input widget itself, and combined with other methods like
:php:meth:`~Cake\\View\\Helper\\FormHelper::label()` and
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` to generate fully custom
form layouts.

.. _general-input-options:

Common Options For Specific Inputs
----------------------------------

Many of the various input element methods support a common set of options which,
depending on the form method used, must be provided inside the ``$options`` or
in the ``$attributes`` array argument. All of these options are also supported by the ``input()`` method.
To reduce repetition, the common options shared by all input methods are described
in this subsection:

* ``['id']`` - Set this key to force the value of the DOM id for the input.
  This will override the idPrefix that may be set.

* ``['default']`` - Used to set a default value for the input field. The
  value is used if the data passed to the form does not contain a value for the
  field (or if no data is passed at all). An explicit default value will
  override any default values defined in the schema.

  Example usage::

    echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  Example with ``select`` field (size "Medium" will be selected as
  default)::

    $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
    echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

    You cannot use ``default`` to check a checkbox - instead you might
    set the value in ``$this->request->data`` in your controller,
    or set the input option ``checked`` to ``true``.

    Beware of using ``false`` to assign a default value. A ``false`` value is
    used to disable/exclude options of an input field, so ``'default' => false``
    would not set any value at all. Instead use ``'default' => 0``.

* ``['value']`` - Used to set a specific value for the input field. This
  will override any value that may else be injected from the context, such as
  Form, Entity or ``request->data`` etc.

  .. note::
  
    If you want to set a field to not render its value fetched from
    context or valuesSource you will need to set ``'value'`` to ``''``
    (instead of setting it to ``null``).

In addition to the above options, you can mixin any HTML attribute you wish to
use. Any non-special option name will be treated as an HTML attribute, and
applied to the generated HTML input element.

.. versionchanged:: 3.3.0
    As of 3.3.0, FormHelper will automatically use any default values defined
    in your database schema. You can disable this behavior by setting
    the ``schemaDefault`` option to ``false``.

Options for Select, Checkbox and Radio Inputs
---------------------------------------------

* ``['value']`` - may also be used in combination with a select-type input
  (i.e. for types ``select``, ``date``, ``time``, ``datetime``). Set ``'value'`` to the value of the
  item you wish to be selected by default when the input is rendered::

    echo $this->Form->time('close_time', [
        'value' => '13:30:00'
    ]);

  .. note::

    The value key for date and datetime inputs may also be a UNIX
    timestamp, or a DateTime object.

  For a ``select`` input where you set the ``multiple`` attribute to ``true``,
  you can use an array of the values you want to select by default::

    echo $this->Form->select('rooms', [
        'multiple' => true,
        // options with values 1 and 3 will be selected as default
        'default' => [1, 3]
    ]);

* ``['empty']`` - If set to ``true``, forces the input to remain empty.

  When passed to a ``select`` method, this creates a blank HTML ``option``
  element with an empty value in your drop down list. If you want to have an empty
  value with text displayed instead of just a blank ``option``, pass in a
  string to ``'empty'``::

      echo $this->Form->select(
          'field',
          [1, 2, 3, 4, 5],
          ['empty' => '(choose one)']
      );

  Output:

  .. code-block:: html

      <select name="field">
          <option value="">(choose one)</option>
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
          <option value="3">4</option>
          <option value="4">5</option>
      </select>

  Options can also be upplied as key-value pairs.

* ``['hiddenField']`` - For certain input types (checkboxes, radios) a
  hidden input is created so that the key in ``$this->request->data`` will exist
  even without a value specified:

  .. code-block:: html

    <input type="hidden" name="published" value="0" />
    <input type="checkbox" name="published" value="1" />

  This can be disabled by setting ``'hiddenField'`` to ``false``::

    echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Which outputs:

  .. code-block:: html

    <input type="checkbox" name="published" value="1">

  If you want to create multiple blocks of inputs on a form that are
  all grouped together, you should set this parameter to ``false`` on all inputs
  except the first. If the hidden input is on the page in multiple
  places, only the last group of input's values will be saved.

  In this example, only the tertiary colors would be passed, and the
  primary colors would be overridden:

  .. code-block:: html
  
    <h2>Primary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <label for="color-red">
        <input type="checkbox" name="color[]" value="5" id="color-red" />
        Red
    </label>

    <label for="color-blue">
        <input type="checkbox" name="color[]" value="5" id="color-blue" />
        Blue
    </label>

    <label for="color-yellow">
        <input type="checkbox" name="color[]" value="5" id="color-yellow" />
        Yellow
    </label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <label for="color-green">
        <input type="checkbox" name="color[]" value="5" id="color-green" />
        Green
    </label>
    <label for="color-purple">
        <input type="checkbox" name="color[]" value="5" id="color-purple" />
        Purple
    </label>
    <label for="color-orange">
        <input type="checkbox" name="color[]" value="5" id="color-orange" />
        Orange
    </label>

  Disabling ``'hiddenField'`` on the second input group would
  prevent this behavior.

  You can set a hidden field to value other than 0, such as 'N'::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

Datetime Options
----------------

* ``['timeFormat']`` - Used to specify the format of the ``select`` inputs for
  a time-related set of inputs. Valid values include ``12``, ``24``, and ``null``.

* ``['minYear'], ['maxYear']`` - Used in combination with a
  date/datetime input. Defines the lower and/or upper end of values shown in the
  years ``select`` field.

* ``['orderYear']`` - Used in combination with a date/datetime input.
  Defines the order in which the year values will be set. Valid values include
  ``'asc'``, ``'desc'``. The default value is ``'desc'``.

* ``['interval']`` - This option specifies the number of minutes between
  what is displayed in each ``option`` element in the minutes ``select`` box::

    echo $this->Form->input('time', [
        'type' => 'time',
        'interval' => 15
    ]);

  Would create 4 ``option`` HTML elements in the minute ``select`` element.
  One for each 15 minutes.

* ``['round']`` - Can be set to ``'up'`` or ``'down'`` to force rounding in either
  direction. Defaults to ``null`` which rounds half up according to ``'interval'``.

* ``['monthNames']`` - If ``false``, 2 digit numbers will be used instead
  of text names of the months. If it is given an array like
   ``['01' => 'Jan', '02' => 'Feb', ...]`` then the given array will be used.

Creating Input Elements
=======================

The rest of the methods available in the FormHelper are for
creating specific form elements. Many of these methods also make
use of a special ``$options`` or ``$attributes`` parameter. In this case, however,
this parameter is used primarily to specify HTML tag attributes (such as
the value or DOM id of an element in the form).

Creating Text Inputs
--------------------

.. php:method:: text(string $name, array $options)

* ``$name`` - A field name from the model.
* ``$options`` - An optional array icluding any of the common :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a simple ``input`` HTML element of ``text`` type. ::

    echo $this->Form->text('username', ['class' => 'users']);

Will output:

.. code-block:: html

    <input name="username" type="text" class="users">

Creating Password Inputs
------------------------

.. php:method:: password(string $fieldName, array $options)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`
  as well as any valid HTML attributes.

Creates a simple ``input`` element of ``password`` type. ::

    echo $this->Form->password('password');

Will output:

.. code-block:: html

    <input name="password" value="" type="password">

Creating Hidden Inputs
----------------------

.. php:method:: hidden(string $fieldName, array $options)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`
  as well as any valid HTML attributes.

Creates a hidden form input. Example::

    echo $this->Form->hidden('id');

Will output:

.. code-block:: html

    <input name="id" type="hidden" />

Creating Textareas
------------------

.. php:method:: textarea(string $fieldName, array $options)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`, 
  the specific textarea options (see below) as well as any valid HTML attributes.

Creates a textarea input field.
The default widget template used is::

    'textarea' => '<textarea name="{{name}}"{{attrs}}>{{value}}</textarea>'

For example::

    echo $this->Form->textarea('notes');

Will output:

.. code-block:: html

    <textarea name="notes"></textarea>

If the form is being edited (that is, the array ``$this->request->data`` will
contain the information previously saved for the ``User`` model), the value
corresponding to ``notes`` field will automatically be added to the HTML
generated. Example:

.. code-block:: html

    <textarea name="notes" id="notes">
    This text is to be edited.
    </textarea>

.. note::

    The ``textarea`` input type allows for the ``$options`` attribute
    of ``'escape'`` which determines whether or not the contents of the
    textarea should be escaped. Defaults to ``true``.

::

    echo $this->Form->textarea('notes', ['escape' => false]);
    // OR....
    echo $this->Form->input('notes', ['type' => 'textarea', 'escape' => false]);

**Options for Textarea**

In addition to the :ref:`general-input-options`, ``textarea()`` supports a few
specific options:

* ``$options['rows'], $options['cols']`` - These two keys specify the number of
  rows and columns for the textarea field ::

    echo $this->Form->textarea('comment', ['rows' => '5', 'cols' => '5']);

  Output:
  
  .. code-block:: html

    <textarea name="comment" cols="5" rows="5">
    </textarea>

Creating Checkboxes
-------------------

.. php:method:: checkbox(string $fieldName, array $options)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``checkbox`` form element. By default it uses the following
widget template::

'checkbox' => '<input type="checkbox" name="{{name}}" value="{{value}}"{{attrs}}>'

This method also generates an associated hidden 
form ``input`` element to force the submission of data for
the specified field::

    echo $this->Form->checkbox('done');

Will output:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

It is possible to specify the value of the checkbox by using the
``$options`` array::

    echo $this->Form->checkbox('done', ['value' => 555]);

Will output:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="555">

If you don't want the Form helper to create a hidden input::

    echo $this->Form->checkbox('done', ['hiddenField' => false]);

Will output:

.. code-block:: html

    <input type="checkbox" name="done" value="1">

Creating Radio Buttons
----------------------

.. php:method:: radio(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array containing the labels for the radio buttons.
  When this array is missing, the method will either generate only 
  the hidden input (if ``hiddenField`` is ``true``) or no element at all 
  (if ``hiddenField`` is ``false``).
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options`,
  the specific radio attributes (see below) as well as any valid HTML attributes.

Creates a set of radio button inputs. The defaultwidget template used is: ::
    
    'radio' => '<input type="radio" name="{{name}}" value="{{value}}"{{attrs}}>'
    'radioWrapper' => '{{label}}'

For example::

    $this->Form->radio('gender', ['Masculine','Feminine','Neuter']);

will output:

.. code-block:: html

    <input name="gender" value="" type="hidden">
    <label for="gender-0">
        <input name="gender" value="0" id="gender-0" type="radio">
        Masculine
    </label>
    <label for="gender-1">
        <input name="gender" value="1" id="gender-1" type="radio">
        Feminine
    </label>
    <label for="gender-2">
        <input name="gender" value="2" id="gender-2" type="radio">
        Neuter
    </label>

**Attributes for Radio Buttons**

* ``value`` - Indicates the value when this radio button is checked. By default
  starts at 0 and auto-increments by one unit for each extra button.
* ``label`` - Boolean to indicate whether or not labels for widgets should be
  displayed. Defaults to ``true``.
* ``hiddenField`` - Boolean to indicate if you want the results of ``radio()`` to
  include a hidden input with a value of ``''``. This is useful for creating radio
  sets that are non-continuous. Defaults to ``true``.
* ``disabled`` - Set to ``true`` or ``disabled`` to disable all the radio
  buttons. Defaults to ``false``.
* ``empty`` - Set it to ``true`` to create an extra button with the value ``''`` as the first
  option. When ``true``, the radio label will be the string: 'empty'. Set this option to
  a string to control the label value. The attribute defaults to ``false``.

Generally ``$options`` contain simple ``key => value`` pairs. However, if you need to
put custom attributes on your radio buttons you can use an expanded format::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

Will output:

.. code-block:: html

    <input type="hidden" name="favorite_color" value="">
    <label for="favorite-color-r">
        <input type="radio" name="favorite_color" value="r" style="color:red;" id="favorite-color-r">
        Red
    </label>
    <label for="favorite-color-u">
        <input type="radio" name="favorite_color" value="u" style="color:blue;" id="favorite-color-u">
        Blue
    </label>
    <label for="favorite-color-g">
        <input type="radio" name="favorite_color" value="g" style="color:green;" id="favorite-color-g">
        Green
    </label>

Creating Select Pickers
-----------------------

.. php:method:: select(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array containing the list items for the select picker.
  When this array is missing, the method will generate only the 
  empty ``select`` element without any ``option`` elements inside it.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options`,
  as well as any valid HTML attributes.

Creates a ``select`` element, populated with the items from the ``$options`` array,
with the ``option`` element specified by ``$attributes['value']`` shown as selected by
default. Set the ``'empty'`` key in the ``$attributes`` variable to ``true`` 
(the default value is ``false``) to add a blank option with an empty value 
on the top of your dropdown list. 

By default ``select`` uses the following widget template::

    'select' => '<select name="{{name}}"{{attrs}}>{{content}}</select>

For example::

    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['empty' => true]);

Will output:

.. code-block:: html

    <select name="gender">
        <option value=""></option>
        <option value="M">Male</option>
        <option value="F">Female</option>
    </select>

The ``select`` method allows for a special ``$attributes``
option called ``'escape'`` which accepts a boolean value and determines
whether to HTML entity encode the contents of the ``select option``
elements.
Defaults to ``true``::

    // This will prevent HTML-encoding the contents of each option element
    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['escape' => false]);

* ``$options`` - This argument also allows you to manually specify 
  option element contents for a select input::
  
    echo $this->Form->select('field', [1,2,3,4,5]);
  
  Output:
  
  .. code-block:: html
  
    <select name="field">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
    </select>
  
  Options can also be supplied as key-value pairs::

    echo $this->Form->select('field', [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2',
        'Value 3' => 'Label 3'
    ]);

  Output:

  .. code-block:: html

    <select name="field">
        <option value="Value 1">Label 1</option>
        <option value="Value 2">Label 2</option>
        <option value="Value 3">Label 3</option>
    </select>

  If you would like to generate a ``select`` with optgroups, just pass
  data in hierarchical format. This works on multiple checkboxes and radio
  buttons too, but instead of optgroups it wraps the elements in ``fieldsets``::

    $options = [
       'Group 1' => [
          'Value 1' => 'Label 1',
          'Value 2' => 'Label 2'
       ],
       'Group 2' => [
          'Value 3' => 'Label 3'
       ]
    ];
    echo $this->Form->select('field', $options);

  Output:

  .. code-block:: html

    <select name="field">
        <optgroup label="Group 1">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
        </optgroup>
        <optgroup label="Group 2">
            <option value="Value 3">Label 3</option>
        </optgroup>
    </select>

    To generate attributes within an option tag::

        $options = [
            [ 'text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1' ],
            [ 'text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2' ],
            [ 'text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value' ],
        ];
        echo $this->Form->select('field', $options);

    Output:

    .. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

* ``$attributes['multiple']`` - If ``'multiple'`` has been set to ``true``, 
  the ``select`` field will allow multiple selections::

    echo $this->Form->select('field', $options, ['multiple' => true]);

  Alternatively, set ``'multiple'`` to ``'checkbox'`` to output a list of
  related checkboxes::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox'
    ]);
  
  Output:

  .. code-block:: html

      <input name="field" value="" type="hidden">
      <div class="checkbox">
        <label for="field-1">
         <input name="field[]" value="Value 1" id="field-1" type="checkbox">
         Label 1
         </label>
      </div>
      <div class="checkbox">
         <label for="field-2">
         <input name="field[]" value="Value 2" id="field-2" type="checkbox">
         Label 2
         </label>
      </div>

* ``$attributes['disabled']`` - This option can be set in order to
  to disable all or some of the ``select option`` items. To disable all items 
  set ``'disabled'`` to ``true``. To disable only certain items assign 
  as value of ``'disabled'`` an array containing the values of the items to
  be disabled::
  
      $options = [
            'M' => 'Masculine', 
            'F' => 'Feminine', 
            'N' => 'Neuter'
      ];
      echo $this->Form->select('gender', $options, [
          'disabled' => ['M', 'N']
      ]);
  
  Will output:

  .. code-block:: html

      <select name="gender">
          <option value="M" disabled="disabled">Masculine</option>
          <option value="F">Feminine</option>
          <option value="N" disabled="disabled">Neuter</option>
      </select>
  
  This option also works when ``'multiple'`` is set to ``'checkbox'``::
  
    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox',
        'disabled' => ['Value 1']
    ]);

  Output:

  .. code-block:: html

       <input name="field" value="" type="hidden">
       <div class="checkbox">
          <label for="field-1">
          <input name="field[]" disabled="disabled" value="Value 1" type="checkbox">
          Label 1
          </label>
       </div>
       <div class="checkbox">
          <label for="field-2">
          <input name="field[]" value="Value 2" id="field-2" type="checkbox">
          Label 2
          </label>
       </div>

Creating File Inputs
--------------------

.. php:method:: file(string $fieldName, array $options)

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a file upload field in the form. The widget template used by default is::

    'file' => '<input type="file" name="{{name}}"{{attrs}}>'

To add a file upload field to a form, you must first make sure that
the form enctype is set to ``'multipart/form-data'``, so start off with
a create method such as the following::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OR
    echo $this->Form->create($document, ['type' => 'file']);

Next add a line that looks like either of the following two lines 
to your form view template file::

    echo $this->Form->input('submittedfile', [
        'type' => 'file'
    ]);

    // OR
    echo $this->Form->file('submittedfile');

.. note::

    Due to the limitations of HTML itself, it is not possible to put
    default values into input fields of type 'file'. Each time the form
    is displayed, the value inside will be empty.

Upon submission, file fields provide an expanded data array to the
script receiving the form data.

For the example above, the values in the submitted data array would
be organized as follows, if CakePHP was installed on a Windows
server. The key ``'tmp\_name'`` will contain a different path 
in a Unix environment. ::

    $this->request->data['submittedfile'] === [
        'name' => 'conference_schedule.pdf',
        'type' => 'application/pdf',
        'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
        'error' => 0, // On Windows this can be a string.
        'size' => 41737,
    ];

This array is generated by PHP itself, so for more detail on the
way PHP handles data passed via file fields
`read the PHP manual section on file uploads <http://php.net/features.file-upload>`_.

.. note::

    When using ``$this->Form->file()``, remember to set the form
    encoding-type, by setting the ``'type'`` option to ``'file'`` in
    ``$this->Form->create()``.

Creating DateTime Inputs
------------------------

.. php:method:: dateTime($fieldName, $options = [])

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`, 
  of the specific options (see below), as well as any valid HTML attributes.

Creates a set of ``select`` elements for date and time. This method accepts 
a number of options:

* ``monthNames`` - If ``false``, 2 digit numbers will be used instead of text.
  If set to an array, the given array will be used.
* ``minYear`` - The lowest year to use in the year select picker.
* ``maxYear`` - The maximum year to use in the year select picker.
* ``interval`` - The interval for the minutes select picker. Defaults to 1.
* ``empty`` - If ``true`` an extra, empty, select option is shown. If a string,
  that string is displayed as the empty element.
* ``round`` - Set to ``up`` or ``down`` if you want to force rounding in either
  direction. Defaults to ``null``.
* ``default`` - The default value to be used by the field. A value in
  ``$this->request->data`` matching the field name will override this value. If
  no default is provided ``time()`` will be used.
* ``timeFormat`` - The time format to use; either ``12`` or ``24``.
* ``second`` - Set to ``true`` to enable the seconds drop down.

To control the order of inputs, and any elements/content between the inputs you
can override the ``dateWidget`` template. By default the ``dateWidget`` template
is::

    {{year}}{{month}}{{day}}{{hour}}{{minute}}{{second}}{{meridian}}

To create datetime inputs with custom classes/attributes on a specific select
box, you can provide options in each component::

    echo $this->Form->datetime('released', [
        'year' => [
            'class' => 'year-classname',
        ],
        'month' => [
            'class' => 'month-class',
            'data-type' => 'month',
        ],
    ]);

Which would create the following two selects:

.. code-block:: html

    <select name="released[year]" class="year-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. snipped for brevity .. -->
    </select>
    <select name="released[month]" class="month-class" data-type="month">
        <option value="" selected="selected"></option>
        <option value="01">January</option>
        <!-- .. snipped for brevity .. -->
    </select>

Creating Time Inputs
--------------------

.. php:method:: time($fieldName, $options = [])

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`, 
  of the specific options (see below), as well as any valid HTML attributes.

Creates two ``select`` elements populated with 24 hours and 60 minutes for ``hour``
and ``minute``, respectively.
Additionally, HTML attributes may be supplied in ``$options`` for each specific
component. If ``$options['empty']`` is ``false``, the select picker will not include an
empty option:

* ``empty`` - If ``true`` an extra, empty, select option is shown. If a string,
  that string is displayed as the empty element.
* ``default`` | ``value`` - The default value to be used by the input. A value in
  ``$this->request->data`` matching the field name will override this value.
  If no default is provided ``time()`` will be used.
* ``timeFormat`` - The time format to use; either ``12`` or ``24``. Defaults to ``24``.
* ``second`` - Set to ``true`` to enable the seconds drop down.
* ``interval`` - The interval for the minutes select picker. Defaults to 1.

For example, to create a time range with minutes selectable in 15 minute
increments, and to apply classes to the select boxes, you could do the
following::

    echo $this->Form->time('released', [
        'interval' => 15,
        'hour' => [
            'class' => 'foo-class',
        ],
        'minute' => [
            'class' => 'bar-class',
        ],
    ]);

Which would create the following two selects:

.. code-block:: html

    <select name="released[hour]" class="foo-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. snipped for brevity .. -->
        <option value="22">22</option>
        <option value="23">23</option>
    </select>
    <select name="released[minute]" class="bar-class">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
    </select>

Creating Year Inputs
--------------------

.. php:method:: year(string $fieldName, array $options = [])

* ``$fieldName`` - A field name from the model.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`, 
  of the specific options (see below), as well as any valid HTML attributes.

Creates a ``select`` element populated with the years from ``minYear``
to ``maxYear``. Additionally, HTML attributes may be supplied in ``$options``. If
``$options['empty']`` is ``false``, the select picker will not include an
empty ``option``:

* ``empty`` - If ``true``, the empty ``select option`` is shown. If a string,
  that string is displayed as the empty element.
* ``orderYear`` - Ordering of year values in ``select option`` elements.
  Possible values ``'asc'``, ``'desc'``. Default ``'desc'``.
* ``value`` - The value value selected by default in the field.
* ``maxYear`` - The max year to appear in the ``select`` element.
* ``minYear`` - The min year to appear in the ``select`` element.

For example, to create a year range from 2000 to the current year you
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

Creating Month Inputs
---------------------

.. php:method:: month(string $fieldName, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``select`` element populated with month names::

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

You can pass in, your own array of months to be used by setting the
``'monthNames'`` attribute, or have months displayed as numbers by
passing ``false``. (Note: the default months can be localized with CakePHP
:doc:`/core-libraries/internationalization-and-localization` features.)::

    echo $this->Form->month('mob', ['monthNames' => false]);

Creating Day Inputs
--------------------

.. php:method:: day(string $fieldName, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``select`` element populated with the (numerical) days of the
month.

To create an empty ``option`` element with a prompt text of your choosing (e.g.
the first option is 'Day'), you can supply the text as the ``'empty'``
parameter as follows::

    echo $this->Form->day('created', ['empty' => 'Day']);

Will output:

.. code-block:: html

    <select name="created[day]">
    <option value="" selected="selected">Day</option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

Creating Hour Inputs
--------------------

.. php:method:: hour(string $fieldName, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``select`` element populated with the hours of the day. You can
create either 12 or 24 hour pickers using the ``'format'`` option::

    echo $this->Form->hour('created', [
        'format' => 12
    ]);
    echo $this->Form->hour('created', [
        'format' => 24
    ]);

Creating Minute Inputs
----------------------

.. php:method:: minute(string $fieldName, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``select`` element populated with the minutes of the hour. You
can create a select picker that only contains specific values using the ``'interval'``
option. For example, if you wanted 10 minute increments you would do the
following::

    echo $this->Form->minute('created', [
        'interval' => 10
    ]);

Creating Meridian Inputs
------------------------

.. php:method:: meridian(string $fieldName, array $attributes)

* ``$fieldName`` - A field name from the model.
* ``$attributes`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes.

Creates a ``select`` element populated with 'am' and 'pm'.

Creating Labels
===============

.. php:method:: label(string $fieldName, string $text, array $options)

* ``$fieldName`` - A field name from the model.
* ``$text`` - An optional string providing the label caption text.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options` 
  as well as any valid HTML attributes or a string.

Creates a ``label`` element. The argument ``$fieldName`` is used for 
generating the DOM id. If ``$text`` is undefined, ``$fieldName`` will 
be used to inflect the label's ``text`` attribute::

    echo $this->Form->label('User.name');
    echo $this->Form->label('User.name', 'Your username');

Output:

.. code-block:: html

    <label for="user-name">Name</label>
    <label for="user-name">Your username</label>

``$options`` - Can either be an array of HTML attributes, or a string that
will be used as a class name::

    echo $this->Form->label('User.name', null, ['id' => 'user-label']);
    echo $this->Form->label('User.name', 'Your username', 'highlight');

Output:

.. code-block:: html

    <label for="user-name" id="user-label">Name</label>
    <label for="user-name" class="highlight">Your username</label>

Displaying and Checking Errors
==============================

.. php:method:: error(string $fieldName, mixed $text, array $options)

* ``$fieldName`` - A field name from the model.
* ``$text`` - An optional string providing the error message.
* ``$options`` - An optional array.
  
Shows a validation error message, specified by ``$text``, for the given
field, in the event that a validation error has occurred.

Uses the following template widgets::

    'error' => '<div class="error-message">{{content}}</div>'
    'errorList' => '<ul>{{content}}</ul>'
    'errorItem' => '<li>{{text}}</li>'

Options:

* ``'escape'`` - Boolean that controls whether or not to HTML escape 
  the contents of the error.

.. TODO:: Add examples.

Example::

    // If in TicketsTable you have:
    public function validationDefault(Validator $validator)
    {
        $validator
            ->requirePresence('ticket', 'create')
            ->notEmpty('ticket');
    }
    
    // And inside Templates/Tickets/add.ctp you have:
    $this->Form->input('ticket');

If you would click the *Submit* button of your form without providing a value for
the *Ticket* field your form would output:

.. code-block:: html

    <div class="input  text required error">
        <label for="ticket">Ticket</label>
        <input name="ticket" required="required" id="ticket" class="form-error" value="" type="text">
        <div class="error-message">This field cannot be left empty</div>
    </div>

.. php:method:: isFieldError(string $fieldName)

* ``$fieldName`` - A field name from the model.

Returns ``true`` if the supplied ``$fieldName`` has an active validation
error. ::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. note::

    When using :php:meth:`~Cake\\View\\Helper\\FormHelper::input()`, errors are
    rendered by default.

Creating Buttons and Submit Elements
====================================

Creating Submit Elements
------------------------

.. php:method:: submit(string $caption, array $options)

* ``$caption`` - An optional string providing the button's text or a path to
  an image to use as caption. Defaults to ``'Submit'``.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`,
  or specific options (see below) as well as any valid HTML attributes.

Creates a submit input with ``$caption`` as the text. If the supplied
``$caption`` is a URL pointing to an image, an image submit button 
will be generated.

By default it will use the following widget template::

    'inputSubmit' => '<input type="{{type}}"{{attrs}}/>'
    'submitContainer' => '<div class="submit">{{content}}</div>'

**Options for Submit**

* ``type`` - Set this option to ``'reset'`` in order to generate reset buttons.
  It defaults to ``'submit'``.
* ``'templateVars'`` - Set this array to provide additional template variables for
  the input element and its container.

The following::

    echo $this->Form->submit();

Will output:

.. code-block:: html

    <div class="submit"><input value="Submit" type="submit"></div>

You can pass a relative or absolute URL to an image for the
caption parameter instead of the caption text::

    echo $this->Form->submit('ok.png');

Will output:

.. code-block:: html

    <div class="submit"><input type="image" src="/img/ok.png"></div>

Submit inputs are useful when you only need basic text or images. If you need
more complex button content you should use ``button()``.

Creating Button Elements
------------------------

.. php:method:: button(string $title, array $options = [])

* ``$title`` - Mandatory string providing the button's text caption.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`,
  or specific options (see below) as well as any valid HTML attributes.

Creates an HTML button with the specified title and a default type
of ``'button'``. 

**Options for Button**

* ``$options['type']`` - You can set this to one of the following three 
  possible values:

    #. ``'submit'`` - Similar to ``$this->Form->submit()`` method it will 
        create a submit button. However this won't generate a wrapping ``div`` 
        as ``submit()`` does. This is the default.
    #. ``'reset'`` - Creates a form reset button.
    #. ``'button'`` - Creates a standard push button.

* ``$options['escape']`` - Boolean. If set to ``true`` it will HTML encode 
  the value provided inside ``$title``. Defaults to ``false``.
  
Example::

    echo $this->Form->button('A Button');
    echo $this->Form->button('Another Button', ['type' => 'button']);
    echo $this->Form->button('Reset the Form', ['type' => 'reset']);
    echo $this->Form->button('Submit Form', ['type' => 'submit']);

Will output:

.. code-block:: html

    <button type="submit">A Button</button>
    <button type="button">Another Button</button>
    <button type="reset">Reset the Form</button>
    <button type="submit">Submit Form</button>

Example of use of the ``'escape'`` option::

    // Will render escaped HTML.
    echo $this->Form->button('<em>Submit Form</em>', [
        'type' => 'submit',
        'escape' => true
    ]);

Closing the Form
================

.. php:method:: end($secureAttributes = [])

* ``$secureAttributes`` - Optional. Allow you to provide secure attributes 
  which will be passed as HTML attributes into the hidden input elements 
  generated for the Security Component.

The ``end()`` method closes and completes a form. Often, ``end()`` will only
output a closing form tag, but using ``end()`` is a good practice as it
enables FormHelper to insert hidden form elements that
:php:class:`Cake\\Controller\\Component\\SecurityComponent` requires:

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- Form elements go here -->

    <?= $this->Form->end(); ?>

If you need to add additional attributes to the generated hidden inputs 
you can use the ``$secureAttributes`` argument, like this::

    echo $this->Form->end(['data-type' => 'hidden']);

Will output:

.. code-block:: html

    <div style="display:none;">
        <input type="hidden" name="_Token[fields]" data-type="hidden"
            value="2981c38990f3f6ba935e6561dc77277966fabd6d%3AAddresses.id">
        <input type="hidden" name="_Token[unlocked]" data-type="hidden"
            value="address%7Cfirst_name">
    </div>

.. note::

    If you are using
    :php:class:`Cake\\Controller\\Component\\SecurityComponent` in your
    application you should always end your forms with ``end()``.

Creating Standalone Buttons and POST links
==========================================

Creating POST Buttons
---------------------

.. php:method:: postButton(string $title, mixed $url, array $options = [])

* ``$title`` - Mandatory string providing the button's text caption. By default
  not HTML encoded.
* ``$url`` - String or array which contains the URL of the form.
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`,
  or specific options (see below) as well as any valid HTML attributes.

Creates a ``<button>`` tag and a surrounding ``<form>`` element that submits via
POST, by default along. By default it also generates hidden input fields for the 
Security Component.

**Options for POST Button**

* ``'data'`` - Array with key/value to pass in hidden input.
* ``'method'`` - Request method to use. Set to ``'delete'`` (or other) to simulate 
  HTTP/1.1 DELETE request (or others). Defaults to ``'post'``.
* ``'form'`` - Array with any option that ``FormHelper::create()`` can take.
* Also, the ``postButton`` method wil accept the options which are valid for 
  the ``button()`` method.

 Example::

    // In Templates/Tickets/index.ctp
    <?= $this->Form->postButton('Delete Record', ['controller' => 'Tickets', 'action' => 'delete', 5]) ?>

Will output HTML similar to:

.. code-block:: html

    <form method="post" accept-charset="utf-8" action="/Qtools/tickets/delete/5">
        <div style="display:none;">
            <input name="_method" value="POST" type="hidden">
        </div>
        <button type="submit">Delete Record</button>
        <div style="display:none;">
            <input name="_Token[fields]" value="ccb3a444683eb6a66b2b1319bbd4b713200a2437%3A" type="hidden">
            <input name="_Token[unlocked]" value="" type="hidden">
            <input name="_Token[debug]" value="%5B%22%5C%2FQtools%5C%2Fmtbttickets%5C%2Fedit%5C%2F5%22%2C%5B%5D%2C%5B%5D%5D" type="hidden">
        </div>
    </form>

Since this method generates a ``form`` element, do not use this method in an already
opened form. Instead use
:php:meth:`Cake\\View\\Helper\\FormHelper::submit()`
or :php:meth:`Cake\\View\\Helper\\FormHelper::button()` to create buttons
inside opened forms.

Creating POST Links
-------------------

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

* ``$title`` - Mandatory string providing the text to be wrapped in ``<a>`` tags. 
  By default not HTML encoded.
* ``$url`` - Optional. String or array which contains the URL 
  of the form (Cake-relative or external URL starting with ``http://``).
* ``$options`` - An optional array icluding any of the :ref:`general-input-options`,
  or specific options (see below) as well as any valid HTML attributes.

Creates an HTML link, but accesses the URL using the method you specify 
(defaults to POST). Requires JavaScript to be enabled in browser.

**Options for POST Link**

* ``'data'`` - Array with key/value to pass in hidden input.
* ``'method'`` - Request method to use. Set to ``'delete'`` (or other) to simulate 
  HTTP/1.1 DELETE request (or others). Defaults to ``'post'``.
* ``'confirm'`` - The confirmation message to display on click.
* ``'block'`` - Set this option to ``true`` to append the form to view block 
  ``'postLink'`` or provide a custom block name. Defaults to ``null``.
* Also, the ``postLink`` method wil accept the options which are valid for 
  the ``link()`` method.

This method creates a ``<form>`` element. If you want to use this method
inside of an existing form, you must use the ``block`` option so that the
new form is being set to a :ref:`view block <view-blocks>` that can be
rendered outside of the main form.

If all you are looking for is a button to submit your form, then you should
use :php:meth:`Cake\\View\\Helper\\FormHelper::button()` or
:php:meth:`Cake\\View\\Helper\\FormHelper::submit()` instead.

.. note::
    Be careful to not put a postLink inside an open form. Instead use the
    ``block`` option to buffer the form into a :ref:`view block <view-blocks>`

Customizing the Templates FormHelper Uses
=========================================

Like many helpers in CakePHP, FormHelper uses string templates to format the
HTML it creates. While the default templates are intended to be a reasonable set
of defaults. You may need to customize the templates to suit your application.

To change the templates when the helper is loaded you can set the ``'templates'``
option when including the helper in your controller::

    // In a View class
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

This would load the tags in **config/app_form.php**. This file should
contain an array of templates *indexed by name*::

    // in config/app_form.php
    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

Any templates you define will replace the default ones included in the helper.
Templates that are not replaced, will continue to use the default values.
You can also change the templates at runtime using the ``templates()`` method::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->templates($myTemplates);

.. warning::

    Template strings containing a percentage sign (``%``) need special attention,
    you should prefix this character with another percentage so it looks like
    ``%%``. The reason is that internally templates are compiled to be used with
    ``sprintf()``. Example: ``<div style="width:{{size}}%%">{{content}}</div>``

List of Templates
-----------------

The list of default templates, their default format and the variables they
expect can be found at the
`FormHelper API documentation <http://api.cakephp.org/3.2/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_.

Using Distinct Custom Input Containers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
In addition to these templates, the ``input()`` method will attempt to use
distinct templates for each input container. For example, when creating
a datetime input the ``datetimeContainer`` will be used if it is present.
If that container is missing the ``inputContainer`` template will be used. For
example::

    // Add custom radio wrapping HTML
    $this->Form->templates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // Create a radio set with our custom wrapping div.
    echo $this->Form->input('User.email_notifications', [
        'options' => ['y', 'n'], 
        'type' => 'radio'
    ]);

Using Distinct Custom Form Groups
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Similar to input containers, the ``input()`` method will also attempt to use
distinct templates for each form group. A form group is a combo of label and
input. For example, when creating a radio input the ``radioFormGroup`` will be
used if it is present. If that template is missing by default each set of label
& input is rendered using the default ``formGroup`` template. For example::

    // Add custom radio form group
    $this->Form->templates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

Adding Additional Template Variables to Templates
-------------------------------------------------

You can add additional template placeholders in custom templates, and populate
those placeholders when generating inputs::

    // Add a template with the help placeholder.
    $this->Form->templates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // Generate an input and populate the help variable
    echo $this->Form->input('password', [
        'templateVars' => ['help' => 'At least 8 characters long.']
    ]);

Will output::

    .. code-block:: html
    
    <div class="input password">
        <label for="password">
            Password
        </label>
        <input name="password" id="password" type="password"> 
        <span class="help">At least 8 characters long.</span>
    </div>

.. versionadded:: 3.1
    The templateVars option was added in 3.1.0

Moving Checkboxes & Radios Outside of a Label
---------------------------------------------

By default CakePHP nests checkboxes and radio buttons within label elements.
This helps make it easier to integrate popular CSS frameworks. If you need to
place checkbox/radio inputs outside of the label you can do so by modifying the
templates::

    $this->Form->templates([
        'nestingLabel' => '{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

This will make radio buttons and checkboxes render outside of their labels.

Generating Entire Forms
=======================

.. php:method:: inputs(array $fields = [], $options = [])

* ``$fields`` - Optional. An array of fields to generate. Allows setting 
  custom types, labels and other options for each specified field.
* ``$options`` - Optional. An array of options. Valid keys are:
    #. ``'fieldset'`` - Can also be an array of parameters to be applied as HTMl 
       attributes to the ``fieldset`` tag. Set this to ``false`` to disable the 
       fieldset. If empty the fieldset will be enabled.
    #. ``legend`` - String used to customize the ``legend`` text. Set this to 
       ``false`` to disable the legend for the generated input set. 

Generates a set of ``input`` elements for the given context wrapped in a ``fieldset``. 
You can specify the generated fields by including them::

    echo $this->Form->inputs([
        'name',
        'email'
    ]);

You can customize the legend text using an option::

    echo $this->Form->inputs($fields, ['legend' => 'Update news post']);

You can customize the generated inputs by defining additional options in the
``$fields`` parameter::

    echo $this->Form->inputs([
        'name' => ['label' => 'custom label']
    ]);

When customizing, ``fields``, you can use the ``$options`` parameter to
control the generated legend/fieldset.

For example pass an array of parameters to be applied as HTML attributes 
to the ``fieldset`` tag. Also supply a string into ``legend`` to customize 
the legend text::

    echo $this->Form->allInputs(
        [
            'name' => ['label' => 'custom label']
        ],
        null,
        ['legend' => 'Update your post']
    );

If you disable the fieldset, the legend will not print.

.. php:method:: allInputs(array $fields, $options = [])

This method is closely related to ``inputs()``, however the ``$fields`` argument
is defaulted to *all* fields in the current top-level entity. To exclude
specific fields from the generated inputs, set them to ``false`` in the fields
parameter::

    echo $this->Form->allInputs(['password' => false]);

.. _associated-form-inputs:

Creating Inputs for Associated Data
===================================

Creating forms for associated data is straightforward and is closely related to
the paths in your entity's data. Assuming the following table relations:

* Authors HasOne Profiles
* Authors HasMany Articles
* Articles HasMany Comments
* Articles BelongsTo Authors
* Articles BelongsToMany Tags

If we were editing an article with its associations loaded we could
create the following inputs::

    $this->Form->create($article);

    // Article inputs.
    echo $this->Form->input('title');

    // Author inputs (belongsTo)
    echo $this->Form->input('author.id');
    echo $this->Form->input('author.first_name');
    echo $this->Form->input('author.last_name');

    // Author profile (belongsTo + hasOne)
    echo $this->Form->input('author.profile.id');
    echo $this->Form->input('author.profile.username');

    // Tags inputs (belongsToMany)
    echo $this->Form->input('tags.0.id');
    echo $this->Form->input('tags.0.name');
    echo $this->Form->input('tags.1.id');
    echo $this->Form->input('tags.1.name');

    // Multiple select element for belongsToMany
    echo $this->Form->input('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);

    // Inputs for the joint table (articles_tags)
    echo $this->Form->input('tags.0._joinData.starred');
    echo $this->Form->input('tags.1._joinData.starred');

    // Comments inputs (hasMany)
    echo $this->Form->input('comments.0.id');
    echo $this->Form->input('comments.0.comment');
    echo $this->Form->input('comments.1.id');
    echo $this->Form->input('comments.1.comment');

The above inputs could then be marshalled into a completed entity graph using
the following code in your controller::

    $article = $this->Articles->patchEntity($article, $this->request->data, [
        'associated' => [
            'Authors',
            'Authors.Profiles',
            'Tags',
            'Comments'
        ]
    ]);

Adding Custom Widgets
=====================

CakePHP makes it easy to add custom input widgets in your application, and use
them like any other input type. All of the core input types are implemented as
widgets, which means you can override any core widget with your own
implemenation as well.

Building a Widget Class
-----------------------

Widget classes have a very simple required interface. They must implement the
:php:class:`Cake\\View\\Widget\\WidgetInterface`. This interface requires
the ``render(array $data)`` and ``secureFields(array $data)`` methods to be
implemented. The ``render()`` method expects an array of data to build the
widget and is expected to return a string of HTML for the widget.
The ``secureFields()`` method expects an array of data as well and is expected
to return an array containing the list of fields to secure for this widget.
If CakePHP is constructing your widget you can expect to
get a ``Cake\View\StringTemplate`` instance as the first argument, followed by
any dependencies you define. If we wanted to build an Autocomplete widget you
could do the following::

    namespace App\View\Widget;

    use Cake\View\Form\ContextInterface;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        protected $_templates;

        public function __construct($templates)
        {
            $this->_templates = $templates;
        }

        public function render(array $data, ContextInterface $context)
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data)
        {
            return [$data['name']];
        }
    }

Obviously, this is a very simple example, but it demonstrates how a custom
widget could be built.

Using Widgets
-------------

You can load custom widgets when loading FormHelper or by using the
``addWidget()`` method. When loading FormHelper, widgets are defined as
a setting::

    // In View class
    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => ['Autocomplete']
        ]
    ]);

If your widget requires other widgets, you can have FormHelper populate those
dependencies by declaring them::

    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => [
                'App\View\Widget\AutocompleteWidget',
                'text',
                'label'
            ]
        ]
    ]);

In the above example, the autocomplete widget would depend on the ``text`` and
``label`` widgets. If your widget needs access to the View, you should use the
``_view`` 'widget'.  When the autocomplete widget is created, it will be passed
the widget objects that are related to the ``text`` and ``label`` names. To add
widgets using the ``addWidget()`` method would look like::

    // Using a classname.
    $this->Form->addWidget(
        'autocomplete',
        ['Autocomplete', 'text', 'label']
    );

    // Using an instance - requires you to resolve dependencies.
    $autocomplete = new AutocompleteWidget(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

Once added/replaced, widgets can be used as the input 'type'::

    echo $this->Form->input('search', ['type' => 'autocomplete']);

This will create the custom widget with a label and wrapping div just like
``input()`` always does. Alternatively, you can create just the input widget
using the magic method::

    echo $this->Form->autocomplete('search', $options);

Working with SecurityComponent
==============================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` offers several
features that make your forms safer and more secure. By simply including the
``SecurityComponent`` in your controller, you'll automatically benefit from
form tampering features.

As mentioned previously when using SecurityComponent, you should always close
your forms using :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`. This will
ensure that the special ``_Token`` inputs are generated.

.. php:method:: unlockField($name)

    Unlocks a field making it exempt from the ``SecurityComponent`` field
    hashing. This also allows the fields to be manipulated by JavaScript.
    The ``$name`` parameter should be the entity property name for the input::

        $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [])

    Generates a hidden field with a security hash based on the fields used
    in the form.


.. meta::
    :title lang=en: FormHelper
    :description lang=en: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=en: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
