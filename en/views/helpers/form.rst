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

.. php:method:: create(mixed $context = null, array $options = [])

* ``$context`` - The context for which the form is being defined. Can be an ORM
  entity, ORM resultset, ``Form`` instance, array of metadata or ``null`` (to make a
  model-less form).
* ``$options`` - An array of options and/or HTML attributes.

The first method you'll need to use in order to take advantage of the FormHelper
is ``create()``. This method outputs an opening form tag.

All parameters are optional. If ``create()`` is called with no parameters
supplied, it assumes you are building a form that submits to the current
controller, via the current URL. The default method for form submission is POST.
If you were to call ``create()`` inside the view for ``UsersController::add()``,
you would see something like the following output in the rendered view:

.. code-block:: html

    <form method="post" action="/users/add">

The ``$context`` argument is used as the form's 'context'. There are several
built-in form contexts and you can add your own, which we'll cover below, in
a following section. The built-in providers map to the following values of
``$context``:

* An ``Entity`` instance or an iterator will map to
  `EntityContext
  <https://api.cakephp.org/4.x/class-Cake.View.Form.EntityContext.html>`_;
  this context class allows FormHelper to work with results from the
  built-in ORM.

* An array containing the ``'schema'`` key, will map to
  `ArrayContext <https://api.cakephp.org/4.x/class-Cake.View.Form.ArrayContext.html>`_
  which allows you to create simple data structures to build forms against.

* ``null`` will map to
  `NullContext <https://api.cakephp.org/4.x/class-Cake.View.Form.NullContext.html>`_;
  this context class
  simply satisfies the interface FormHelper requires. This context is useful if
  you want to build a short form that doesn't require ORM persistence.

Once a form has been created with a context, all controls you create will use the
active context. In the case of an ORM backed form, FormHelper can access
associated data, validation errors and schema metadata. You can close the active
context using the ``end()`` method, or by calling ``create()`` again.

To create a form for an entity, do the following::

    // If you are on /articles/add
    // $article should be an empty Article entity.
    echo $this->Form->create($article);

Output:

.. code-block:: html

    <form method="post" action="/articles/add">

This will POST the form data to the ``add()`` action of ArticlesController.
However, you can also use the same logic to create an edit form. The FormHelper
uses the ``Entity`` object to automatically detect whether to
create an *add* or *edit* form. If the provided entity is not 'new', the form
will be created as an *edit* form.

For example, if we browse to **http://example.org/articles/edit/5**, we could
do the following::

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

    // View/Articles/edit.php:
    // Since $article->isNew() is false, we will get an edit form
    <?= $this->Form->create($article) ?>

Output:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    Since this is an *edit* form, a hidden ``input`` field is generated to
    override the default HTTP method.

In some cases, the entity's ID is automatically appended to the end of the form's ``action`` URL. If you would like to *avoid* an ID being added to the URL, you can pass a string to ``$options['url']``, such as ``'/my-account'`` or ``\Cake\Routing\Router::url(['controller' => 'Users', 'action' => 'myAccount'])``.

Options for Form Creation
-------------------------

The ``$options`` array is where most of the form configuration
happens. This special array can contain a number of different
key-value pairs that affect the way the form tag is generated.
Valid values:

* ``'type'`` - Allows you to choose the type of form to create. If no type is
  provided then it will be autodetected based on the form context.
  Valid values:

  * ``'get'`` - Will set the form method to HTTP GET.
  * ``'file'`` - Will set the form method to POST and the ``'enctype'`` to
    "multipart/form-data".
  * ``'post'`` - Will set the method to POST.
  * ``'put', 'delete', 'patch'`` - Will override the HTTP method with PUT,
    DELETE or PATCH respectively, when the form is submitted.

* ``'method'`` - Valid values are the same as above. Allows you to explicitly
  override the form's method.

* ``'url'`` - Specify the URL the form will submit to. Can be a string or a URL
  array.

* ``'encoding'`` - Sets the ``accept-charset`` encoding for the form. Defaults
  to ``Configure::read('App.encoding')``.

* ``'enctype'`` - Allows you to set the form encoding explicitly.

* ``'templates'`` - The templates you want to use for this form. Any templates
  provided will be merged on top of the already loaded templates. Can be either
  a filename (without extension) from ``/config`` or an array of templates to use.

* ``'context'`` - Additional options for the form context class. (For example
  the ``EntityContext`` accepts a ``'table'`` option that allows you to set the
  specific Table class the form should be based on.)

* ``'idPrefix'`` - Prefix for generated ID attributes.

* ``'templateVars'`` - Allows you to provide template variables for the
  ``formStart`` template.

* ``autoSetCustomValidity`` - Set to ``true`` to use custom required and notBlank
  validation messages in the control's HTML5 validity message. Default is ``true``.

.. tip::

    Besides the above options you can provide, in the ``$options`` argument,
    any valid HTML attributes that you want to pass to the created ``form``
    element.

.. _form-values-from-query-string:

Getting form values from other values sources
-----------------------------------------------

A FormHelper's values sources define where its rendered elements, such as
input-tags, receive their values from.

The supported sources are ``context``, ``data`` and ``query``. You can use one
or more sources by setting ``valueSources`` option or by using ``setValuesSource()``.
Any widgets generated by ``FormHelper`` will gather their values from the sources,
in the order you setup.

By default ``FormHelper`` draws its values from ``data`` or ``context``, i.e. it will
fetch data from ``$request->getData()`` or, if not present, from the active context's
data, that are the entity's data in the case of ``EntityContext``.

If however, you are building a form that needs to read from the query string, you can
change where ``FormHelper`` reads input data from::

    // Use query string instead of request data:
    echo $this->Form->create($article, [
        'type' => 'get',
        'valueSources' => ['query', 'context']
    ]);

    // Same effect:
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles, ['type' => 'get']);

When input data has to be processed by the entity, i.e. marshal transformations, table
query result or entity computations, and displayed after one or multiple form submissions
where request data is retained, you need to put ``context`` first::

    // Prioritize context over request data:
    echo $this->Form->create($article,
        'valueSources' => ['context', 'data']
    ]);

The value sources will be reset to the default ``['data', 'context']`` when ``end()``
is called.

Changing the HTTP Method for a Form
-----------------------------------

By using the ``type`` option you can change the HTTP method a form will use::

    echo $this->Form->create($article, ['type' => 'get']);

Output:

.. code-block:: html

    <form method="get" action="/articles/edit/5">

Specifying a ``'file'`` value for ``type``, changes the form submission method
to 'post', and includes an ``enctype`` of "multipart/form-data" on the form tag.
This is to be used if there are any file elements inside the form. The absence
of the proper ``enctype`` attribute will cause the file uploads not to function.

For example::

    echo $this->Form->create($article, ['type' => 'file']);

Output:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/articles/add">

When using ``'put'``, ``'patch'`` or ``'delete'`` as ``'type'`` values, your
form will be functionally equivalent to a 'post' form, but when submitted, the
HTTP request method will be overridden with 'PUT', 'PATCH' or 'DELETE',
respectively.
This allows CakePHP to emulate proper REST support in web browsers.

Setting a URL for the Form
--------------------------

Using the ``'url'`` option allows you to point the form to a specific action in
your current controller or another controller in your application.

For example,
if you'd like to point the form to the ``publish()`` action of the current
controller, you would supply an ``$options`` array, like the following::

    echo $this->Form->create($article, ['url' => ['action' => 'publish']]);

Output:

.. code-block:: html

    <form method="post" action="/articles/publish">

If the desired form action isn't in the current controller, you can specify
a complete URL for the form action. The supplied URL can be relative to your
CakePHP application::

    echo $this->Form->create(null, [
        'url' => [
            'controller' => 'Articles',
            'action' => 'publish'
        ]
    ]);

Output:

.. code-block:: html

    <form method="post" action="/articles/publish">

Or you can point to an external domain::

    echo $this->Form->create(null, [
        'url' => 'https://www.google.com/search',
        'type' => 'get'
    ]);

Output:

.. code-block:: html

    <form method="get" action="https://www.google.com/search">

Use ``'url' => false`` if you don't want to output a URL as the form action.

Using Custom Validators
-----------------------

Often models will have multiple validator sets, you can have FormHelper
mark fields required based on the specific validator your controller
action is going to apply. For example, your Users table has specific validation
rules that only apply when an account is being registered::

    echo $this->Form->create($user, [
        'context' => ['validator' => 'register']
    ]);

The above will use validation rules defined in the ``register`` validator, which
are defined by ``UsersTable::validationRegister()``, for ``$user`` and all
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
comments. FormHelper uses validators to generate HTML5 required attributes,
relevant ARIA attributes, and set error messages with the `browser validator API
<https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation#Customized_error_messages>`_
. If you would like to disable HTML5 validation messages use::

    $this->Form->setConfig('autoSetCustomValidity', false);

This will not disable ``required``/``aria-required`` attributes.

Creating context classes
------------------------

While the built-in context classes are intended to cover the basic cases you'll
encounter you may need to build a new context class if you are using a different
ORM. In these situations you need to implement the
`Cake\\View\\Form\\ContextInterface
<https://api.cakephp.org/4.x/interface-Cake.View.Form.ContextInterface.html>`_ . Once
you have implemented this interface you can wire your new context into the
FormHelper. It is often best to do this in a ``View.beforeRender`` event
listener, or in an application view class::

    $this->Form->addContextProvider('myprovider', function ($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($data);
        }
    });

Context factory functions are where you can add logic for checking the form
options for the correct type of entity. If matching input data is found you can
return an object. If there is no match return null.

.. _automagic-form-elements:

Creating Form Controls
======================

.. php:method:: control(string $fieldName, array $options = [])

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array that can include both
  :ref:`control-specific-options`, and options of the other methods (which
  ``control()`` employs internally to generate various HTML elements) as
  well as any valid HTML attributes.

The ``control()`` method lets you generate complete form controls. These
controls will include a wrapping ``div``, ``label``, control widget, and validation error if
necessary. By using the metadata in the form context, this method will choose an
appropriate control type for each field. Internally ``control()`` uses the other
methods of FormHelper.

.. tip::

    Please note that while the fields generated by the ``control()`` method are
    called generically "inputs" on this page, technically speaking, the
    ``control()`` method can generate not only all of the HTML ``input`` type
    elements, but also other HTML form elements such as ``select``,
    ``button``, ``textarea``.

By default the ``control()`` method will employ the following widget templates::

    'inputContainer' => '<div class="input {{type}}{{required}}">{{content}}</div>'
    'input' => '<input type="{{type}}" name="{{name}}"{{attrs}}/>'
    'requiredClass' => 'required'

In case of validation errors it will also use::

    'inputContainerError' => '<div class="input {{type}}{{required}} error">{{content}}{{error}}</div>'

The type of control created (when we provide no additional options to specify the
generated element type) is inferred via model introspection and
depends on the column datatype:

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
    date
datetime, timestamp
    datetime-local
datetimefractional, timestampfractional
    datetime-local
time
    time
month
    month
year
    select with years
binary
    file

The ``$options`` parameter allows you to choose a specific control type if
you need to::

    echo $this->Form->control('published', ['type' => 'checkbox']);

.. tip::

    As a small subtlety, generating specific elements via the ``control()``
    form method will always also generate the wrapping ``div``, by default.
    Generating the same type of element via one of the specific form methods
    (e.g. ``$this->Form->checkbox('published');``) in most cases won't generate
    the wrapping ``div``. Depending on your needs you can use one or another.

.. _html5-required:

The wrapping ``div`` will have a ``required`` class name appended if the
validation rules for the model's field indicate that it is required and not
allowed to be empty. You can disable automatic ``required`` flagging using the
``'required'`` option::

    echo $this->Form->control('title', ['required' => false]);

To skip browser validation triggering for the whole form you can set option
``'formnovalidate' => true`` for the input button you generate using
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` or set ``'novalidate' =>
true`` in options for :php:meth:`~Cake\\View\\Helper\\FormHelper::create()`.

For example, let's assume that your Users model includes fields for a
*username* (varchar), *password* (varchar), *approved* (datetime) and
*quote* (text). You can use the ``control()`` method of the FormHelper to
create appropriate controls for all of these form fields::

    echo $this->Form->create($user);
    // The following generates a Text input
    echo $this->Form->control('username');
    // The following generates a Password input
    echo $this->Form->control('password');
    // Assuming 'approved' is a datetime or timestamp field the following
    //generates an input of type "datetime-local"
    echo $this->Form->control('approved');
    // The following generates a Textarea element
    echo $this->Form->control('quote');

    echo $this->Form->button('Add');
    echo $this->Form->end();

A more extensive example showing some options for a date field::

    echo $this->Form->control('birth_date', [
        'label' => 'Date of birth',
        'min' => date('Y') - 70,
        'max' => date('Y') - 18,
    ]);

Besides the specific :ref:`control-specific-options`,
you also can specify any option accepted by corresponding specific method
for the chosen (or inferred by CakePHP)
control type and any HTML attribute (for instance ``onfocus``).

If you want to create a ``select`` form field while using a *belongsTo* (or
*hasOne*) relation, you can add the following to your UsersController
(assuming your User *belongsTo* Group)::

    $this->set('groups', $this->Users->Groups->find('list')->all());

Afterwards, add the following to your view template::

    echo $this->Form->control('group_id', ['options' => $groups]);

To make a ``select`` box for a *belongsToMany* Groups association you can
add the following to your UsersController::

    $this->set('groups', $this->Users->Groups->find('list')->all());

Afterwards, add the following to your view template::

    echo $this->Form->control('groups._ids', ['options' => $groups]);

If your model name consists of two or more words (e.g.
"UserGroups"), when passing the data using ``set()`` you should name your
data in a pluralised and
`lower camelCased <https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms>`_
format as follows::

    $this->set('userGroups', $this->UserGroups->find('list')->all());

.. note::

    You should not use ``FormHelper::control()`` to generate submit buttons. Use
    :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` instead.

Field Naming Conventions
------------------------

When creating control widgets you should name your fields after the matching
attributes in the form's entity. For example, if you created a form for an
``$article`` entity, you would create fields named after the properties. E.g.
``title``, ``body`` and ``published``.

You can create controls for associated models, or arbitrary models by passing in
``association.fieldname`` as the first parameter::

    echo $this->Form->control('association.fieldname');

Any dots in your field names will be converted into nested request data. For
example, if you created a field with a name ``0.comments.body`` you would get
a name attribute that looks like ``0[comments][body]``. This convention matches
the conventions you use with the ORM. Details for the various association types
can be found in the :ref:`associated-form-inputs` section.

When creating datetime related controls, FormHelper will append a field-suffix.
You may notice additional fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` being added. These fields will be automatically
converted into ``DateTime`` objects when entities are marshalled.

.. _control-specific-options:

Options for Control
-------------------

``FormHelper::control()`` supports a large number of options via its ``$options``
argument. In addition to its own options, ``control()`` accepts options for the
inferred/chosen generated control types (e.g. for ``checkbox`` or ``textarea``),
as well as HTML attributes. This subsection will cover the options specific to
``FormHelper::control()``.

* ``$options['type']`` - A string that specifies the widget type
  to be generated. In addition to the field types found in the
  :ref:`automagic-form-elements`, you can also create ``'file'``,
  ``'password'``, and any other type supported by HTML5. By specifying a
  ``'type'`` you will force the type of the generated control, overriding model
  introspection. Defaults to ``null``.

  For example::

      echo $this->Form->control('field', ['type' => 'file']);
      echo $this->Form->control('email', ['type' => 'email']);

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

* ``$options['label']`` - Either a string caption or an array of
  :ref:`options for the label<create-label>`. You can set this key to the
  string you would like to be displayed within the label that usually
  accompanies the ``input`` HTML element. Defaults to ``null``.

  For example::

      echo $this->Form->control('name', [
          'label' => 'The User Alias'
      ]);

  Output:

  .. code-block:: html

      <div class="input">
          <label for="name">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

  Alternatively, set this key to ``false`` to disable the generation of the
  ``label`` element.

  For example::

      echo $this->Form->control('name', ['label' => false]);

  Output:

  .. code-block:: html

      <div class="input">
          <input name="name" type="text" value="" id="name" />
      </div>

  If the label is disabled, and a ``placeholder`` attribute is provided, the
  generated input will have ``aria-label`` set.

  Set the ``label`` option to an array to provide additional options for the
  ``label`` element. If you do this, you can use a ``'text'`` key in
  the array to customize the label text.

  For example::

      echo $this->Form->control('name', [
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

* ``$options['options']`` - You can provide in here an array containing
  the elements to be generated for widgets such as ``radio`` or ``select``,
  which require an array of items as an argument (see
  :ref:`create-radio-button` and :ref:`create-select-picker` for more details).
  Defaults to ``null``.

* ``$options['error']`` - Using this key allows you to override the default
  model error messages and can be used, for example, to set i18n messages. To
  disable the error message output & field classes set the ``'error'`` key to
  ``false``. Defaults to ``null``.

  For example::

      echo $this->Form->control('name', ['error' => false]);

  To override the model error messages use an array with
  the keys matching the original validation error messages.

  For example::

      $this->Form->control('name', [
          'error' => ['Not long enough' => __('This is not long enough')]
      ]);

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.
  
  To disable the HTML entity encoding for error messages only, the ``'escape'``
  sub key can be used::
  
      $this->Form->control('name', [
          'error' => ['escape' => false],
      ]);

* ``$options['nestedInput']`` - Used with checkboxes and radio buttons.
  Controls whether the input element is generated
  inside or outside the ``label`` element. When ``control()`` generates a
  checkbox or a radio button, you can set this to ``false`` to force the
  generation of the HTML ``input`` element outside of the ``label`` element.

  On the other hand you can set this to ``true`` for any control type to force the
  generated input element inside the label. If you change this for radio buttons
  then you need to also modify the default
  :ref:`radioWrapper<create-radio-button>` template. Depending on the generated
  control type it defaults to ``true`` or ``false``.

* ``$options['templates']`` - The templates you want to use for this input. Any
  specified templates will be merged on top of the already loaded templates.
  This option can be either a filename (without extension) in ``/config`` that
  contains the templates you want to load, or an array of templates to use.

* ``$options['labelOptions']`` - Set this to ``false`` to disable labels around
  nestedWidgets or set it to an array of attributes to be provided to the
  ``label`` tag.

* ``$options['readonly']`` - Set the field to ``readonly`` in form.

  For example::

      echo $this->Form->control('name', ['readonly' => true]);

Generating Specific Types of Controls
=====================================

In addition to the generic ``control()`` method, ``FormHelper`` has specific
methods for generating a number of different types of controls. These can be used
to generate just the control widget itself, and combined with other methods like
:php:meth:`~Cake\\View\\Helper\\FormHelper::label()` and
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` to generate fully custom
form layouts.

.. _general-control-options:

Common Options For Specific Controls
------------------------------------

Many of the various control element methods support a common set of options which,
depending on the form method used, must be provided inside the ``$options`` or
in the ``$attributes`` array argument. All of these options are also supported
by the ``control()`` method.
To reduce repetition, the common options shared by all control methods are
as follows:

* ``'id'`` - Set this key to force the value of the DOM id for the control.
  This will override the ``'idPrefix'`` that may be set.

* ``'default'`` - Used to set a default value for the control field. The
  value is used if the data passed to the form does not contain a value for the
  field (or if no data is passed at all). If no default value is provided, the
  column's default value will be used.

  Example usage::

      echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  Example with ``select`` field (size "Medium" will be selected as
  default)::

      $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
      echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

      You cannot use ``default`` to check a checkbox - instead you might
      set the value in ``$this->request->getData()`` in your controller,
      or set the control option ``'checked'`` to ``true``.

      Beware of using ``false`` to assign a default value. A ``false`` value is
      used to disable/exclude options of a control field, so ``'default' => false``
      would not set any value at all. Instead use ``'default' => 0``.

* ``'value'`` - Used to set a specific value for the control field. This
  will override any value that may else be injected from the context, such as
  Form, Entity or ``request->getData()`` etc.

  .. note::

      If you want to set a field to not render its value fetched from
      context or valuesSource you will need to set ``'value'`` to ``''``
      (instead of setting it to ``null``).

In addition to the above options, you can mixin any HTML attribute you wish to
use. Any non-special option name will be treated as an HTML attribute, and
applied to the generated HTML control element.

Creating Input Elements
=======================

The rest of the methods available in the FormHelper are for
creating specific form elements. Many of these methods also make
use of a special ``$options`` or ``$attributes`` parameter. In this case,
however, this parameter is used primarily to specify HTML tag attributes
(such as the value or DOM id of an element in the form).

Creating Text Inputs
--------------------

.. php:method:: text(string $name, array $options)

* ``$name`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

Creates a simple ``input`` HTML element of ``text`` type.

For example::

    echo $this->Form->text('username', ['class' => 'users']);

Will output:

.. code-block:: html

    <input name="username" type="text" class="users">

Creating Password Inputs
------------------------

.. php:method:: password(string $fieldName, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

Creates a simple ``input`` element of ``password`` type.

For example::

    echo $this->Form->password('password');

Will output:

.. code-block:: html

    <input name="password" value="" type="password">

Creating Hidden Inputs
----------------------

.. php:method:: hidden(string $fieldName, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

Creates a hidden form input.

For example::

    echo $this->Form->hidden('id');

Will output:

.. code-block:: html

    <input name="id" type="hidden" />

Creating Textareas
------------------

.. php:method:: textarea(string $fieldName, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, of the specific textarea options (see below)
  as well as any valid HTML attributes.

Creates a textarea control field. The default widget template used is::

    'textarea' => '<textarea name="{{name}}"{{attrs}}>{{value}}</textarea>'

For example::

    echo $this->Form->textarea('notes');

Will output:

.. code-block:: html

    <textarea name="notes"></textarea>

If the form is being edited (i.e. the array ``$this->request->getData()``
contains the information previously saved for the ``User`` entity), the value
corresponding to ``notes`` field will automatically be added to the HTML
generated.

Example:

.. code-block:: html

    <textarea name="notes" id="notes">
        This text is to be edited.
    </textarea>

**Options for Textarea**

In addition to the :ref:`general-control-options`, ``textarea()`` supports a
couple of specific options:

* ``'escape'`` - Determines whether or not the contents of the textarea should
  be escaped. Defaults to ``true``.

  For example::

      echo $this->Form->textarea('notes', ['escape' => false]);
      // OR....
      echo $this->Form->control('notes', ['type' => 'textarea', 'escape' => false]);

* ``'rows', 'cols'`` - You can use these two keys to set the HTML attributes
  which specify the number of rows and columns for the ``textarea`` field.

  For example::

      echo $this->Form->textarea('comment', ['rows' => '5', 'cols' => '5']);

  Output:

  .. code-block:: html

      <textarea name="comment" cols="5" rows="5">
      </textarea>

Creating Select, Checkbox and Radio Controls
--------------------------------------------

These controls share some commonalities and a few options and thus, they are
all grouped in this subsection for easier reference.

.. _checkbox-radio-select-options:

Options for Select, Checkbox and Radio Controls
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can find below the options which are shared by ``select()``,
``checkbox()`` and ``radio()`` (the options particular only to one of the
methods are described in each method's own section.)

* ``'value'`` - Sets or selects the value of the affected element(s):

  * For checkboxes, it sets the HTML ``'value'`` attribute assigned
    to the ``input`` element to whatever you provide as value.

  * For radio buttons or select pickers it defines which element will be
    selected when the form is rendered (in this case ``'value'`` must be
    assigned a valid, existent element value). May also be used in
    combination with any select-type control,
    such as ``date()``, ``time()``, ``dateTime()``::

        echo $this->Form->time('close_time', [
            'value' => '13:30:00'
        ]);

  .. note::

      The ``'value'`` key for ``date()`` and ``dateTime()`` controls may also have
      as value a UNIX timestamp, or a DateTime object.

  For a ``select`` control where you set the ``'multiple'`` attribute to
  ``true``, you can provide an array with the values you want to select
  by default::

      // HTML <option> elements with values 1 and 3 will be rendered preselected
      echo $this->Form->select(
          'rooms',
          [1, 2, 3, 4, 5],
          [
              'multiple' => true,
              'value' => [1, 3]
          ]
      );

* ``'empty'`` - Applies to ``radio()`` and ``select()``. Defaults to ``false``.

  * When passed to ``radio()`` and set to ``true`` it will create an extra
    input element as the first radio button, with a value of ``''`` and a
    label caption equal to the string ``'empty'``. If you want to control
    the label caption set this option to a string instead.

  * When passed to a ``select`` method, this creates a blank HTML ``option``
    element with an empty value in your drop down list. If you want to have an
    empty value with text displayed instead of just a blank ``option``, pass a
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

* ``'hiddenField'`` - For checkboxes and radio buttons, by default,
  a hidden ``input`` element is also created, along with the main
  element, so that the key in ``$this->request->getData()``
  will exist even without a value specified. For checkboxes its value
  defaults to ``0`` and for radio buttons to ``''``.

  Example of default output:

  .. code-block:: html

      <input type="hidden" name="published" value="0" />
      <input type="checkbox" name="published" value="1" />

  This can be disabled by setting ``'hiddenField'`` to ``false``::

      echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Which outputs:

  .. code-block:: html

      <input type="checkbox" name="published" value="1">

  If you want to create multiple blocks of controls on a form, that are
  all grouped together, you should set this parameter to ``false`` on all
  controls except the first. If the hidden input is on the page in multiple
  places, only the last group of ``inputs``' values will be saved.

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

  Disabling ``'hiddenField'`` on the second control group would
  prevent this behavior.

  You can set a hidden field to a value other than 0, such as 'N'::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

Using Collections to build options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

It's possible to use the Collection class to build your options array. This approach is ideal if you already have a
collection of entities and would like to build a select element from them.

You can use the ``combine`` method to build a basic options array.::

    $options = $examples->combine('id', 'name');

It's also possible to add extra attributes by expanding the array. The following will create a data attribute on the
option element, using the ``map`` collection method.::

    $options = $examples->map(function ($value, $key) {
        return [
            'value' => $value->id,
            'text' => $value->name,
            'data-created' => $value->created
        ];
    });

Creating Checkboxes
~~~~~~~~~~~~~~~~~~~

.. php:method:: checkbox(string $fieldName, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, or of the :ref:`checkbox-radio-select-options`
  above, of the checkbox-specific options (see below), as well as any valid
  HTML attributes.

Creates a ``checkbox`` form element. The widget template used is::

    'checkbox' => '<input type="checkbox" name="{{name}}" value="{{value}}"{{attrs}}>'

**Options for Checkboxes**

* ``'checked'`` - Boolean to indicate whether this checkbox will be checked.
  Defaults to ``false``.

* ``'disabled'`` - Create a disabled checkbox input.

This method also generates an associated hidden
form ``input`` element to force the submission of data for
the specified field.

For example::

    echo $this->Form->checkbox('done');

Will output:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

It is possible to specify the value of the checkbox by using the
``$options`` array.

For example::

    echo $this->Form->checkbox('done', ['value' => 555]);

Will output:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="555">

If you don't want the FormHelper to create a hidden input use
``'hiddenField'``.

For example::

    echo $this->Form->checkbox('done', ['hiddenField' => false]);

Will output:

.. code-block:: html

    <input type="checkbox" name="done" value="1">

.. _create-radio-button:

Creating Radio Buttons
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: radio(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array containing at minimum the labels for the
  radio buttons. Can also contain values and HTML attributes.
  When this array is missing, the method will either generate only
  the hidden input (if ``'hiddenField'`` is ``true``) or no element at all
  (if ``'hiddenField'`` is ``false``).
* ``$attributes`` - An optional array including any of the
  :ref:`general-control-options`, or of the :ref:`checkbox-radio-select-options`,
  of the radio button specific attributes (see below), as well as any valid
  HTML attributes.

Creates a set of radio button inputs. The default widget templates used are::

    'radio' => '<input type="radio" name="{{name}}" value="{{value}}"{{attrs}}>'
    'radioWrapper' => '{{label}}'

**Attributes for Radio Buttons**

* ``'label'`` - Boolean to indicate whether or not labels for widgets should be
  displayed, or an array of attributes to apply to all labels. In case a ``class``
  attribute is defined, ``selected`` will be added to the ``class`` attribute of
  checked buttons. Defaults to ``true``.

* ``'hiddenField'`` - If set to ``true`` a hidden input with a value of ``''``
  will be included. This is useful for creating radio sets that are
  non-continuous. Defaults to ``true``.

* ``'disabled'`` - Set to ``true`` or ``'disabled'`` to disable all the radio
  buttons. Defaults to ``false``.

You must provide the label captions for the radio buttons via the ``$options``
argument.

For example::

    $this->Form->radio('gender', ['Masculine', 'Feminine', 'Neuter']);

Will output:

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

Generally ``$options`` contains simple ``key => value`` pairs. However, if you
need to put custom attributes on your radio buttons you can use an expanded
format.

For example::

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

You can define additional attributes for an individual option's label as well::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'label' => ['class' => 'red']],
            ['value' => 'u', 'text' => 'Blue', 'label' => ['class' => 'blue']],
        ]
    );

Will output:

.. code-block:: html

    <input type="hidden" name="favorite_color" value="">
    <label for="favorite-color-r" class="red">
        <input type="radio" name="favorite_color" value="r" style="color:red;" id="favorite-color-r">
        Red
    </label>
    <label for="favorite-color-u" class="blue">
        <input type="radio" name="favorite_color" value="u" style="color:blue;" id="favorite-color-u">
        Blue
    </label>

If the ``label`` key is used on an option, the attributes in
``$attributes['label']`` will be ignored.

.. _create-select-picker:

Creating Select Pickers
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: select(string $fieldName, array $options, array $attributes)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``. This
  will provide the ``name`` attribute of the ``select`` element.
* ``$options`` - An optional array containing the list of items for the select
  picker. When this array is missing, the method will generate only the
  empty ``select`` HTML element without any ``option`` elements inside it.
* ``$attributes`` - An optional array including any of the
  :ref:`general-control-options`, or of the :ref:`checkbox-radio-select-options`,
  or of the select-specific attributes (see below), as well as any valid
  HTML attributes.

Creates a ``select`` element, populated with the items from the ``$options``
array. If ``$attributes['value']`` is provided, then the HTML ``option``
element(s) which have the specified value(s) will be shown as selected when
rendering the select picker.

By default ``select`` uses the following widget templates::

    'select' => '<select name="{{name}}"{{attrs}}>{{content}}</select>'
    'option' => '<option value="{{value}}"{{attrs}}>{{text}}</option>'

May also use::

    'optgroup' => '<optgroup label="{{label}}"{{attrs}}>{{content}}</optgroup>'
    'selectMultiple' => '<select name="{{name}}[]" multiple="multiple"{{attrs}}>{{content}}</select>'

**Attributes for Select Pickers**

* ``'multiple'`` - If set to ``true`` allows multiple selections in the select
  picker. If set to ``'checkbox'``, multiple checkboxes will be created instead.
  Defaults to ``null``.

* ``'escape'`` - Boolean. If ``true`` the contents of the ``option`` elements
  inside the select picker will be HTML entity encoded. Defaults to ``true``.

* ``'val'`` - Allows preselecting a value in the select picker.

* ``'disabled'`` - Controls the ``disabled`` attribute. If set to ``true``
  disables the whole select picker. If set to an array it will disable
  only those specific ``option`` elements whose values are provided in
  the array.

The ``$options`` argument allows you to manually specify
the contents of the ``option`` elements of a ``select`` control.

For example::

    echo $this->Form->select('field', [1, 2, 3, 4, 5]);

Output:

.. code-block:: html

    <select name="field">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
    </select>

The array for ``$options`` can also be supplied as key-value pairs.

For example::

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
data in hierarchical format (nested array). This works on multiple
checkboxes and radio buttons too, but instead of ``optgroup`` it wraps
the elements in ``fieldset`` elements.

For example::

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

To generate HTML attributes within an ``option`` tag::

    $options = [
        ['text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1'],
        ['text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2'],
        ['text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value'],
    ];
    echo $this->Form->select('field', $options);

Output:

.. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

**Controlling Select Pickers via Attributes**

By using specific options in the ``$attributes`` parameter you can control
certain behaviors of the ``select()`` method.

* ``'empty'`` - Set the ``'empty'`` key in the ``$attributes`` argument
  to ``true`` (the default value is ``false``) to add a blank option with an
  empty value at the top of your dropdown list.

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

* ``'escape'`` - The ``select()`` method allows for an attribute
  called ``'escape'`` which accepts a boolean value and determines
  whether to HTML entity encode the contents of the ``select``'s ``option``
  elements.

  For example::

      // This will prevent HTML-encoding the contents of each option element
      $options = ['M' => 'Male', 'F' => 'Female'];
      echo $this->Form->select('gender', $options, ['escape' => false]);

* ``'multiple'`` - If set to ``true``, the select picker will allow
  multiple selections.

  For example::

      echo $this->Form->select('field', $options, ['multiple' => true]);

  Alternatively, set ``'multiple'`` to ``'checkbox'`` in order to output a
  list of related checkboxes::

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

* ``'disabled'`` - This option can be set in order to disable all or some
  of the ``select``'s ``option`` items. To disable all items set ``'disabled'``
  to ``true``. To disable only certain items, assign to ``'disabled'``
  an array containing the keys of the items to be disabled.

  For example::

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

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

Creates a file upload field in the form.
The widget template used by default is::

    'file' => '<input type="file" name="{{name}}"{{attrs}}>'

To add a file upload field to a form, you must first make sure that
the form enctype is set to ``'multipart/form-data'``.

So start off with a ``create()`` method such as the following::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OR
    echo $this->Form->create($document, ['type' => 'file']);

Next add a line that looks like either of the following two lines
to your form's view template file::

    echo $this->Form->control('submittedfile', [
        'type' => 'file'
    ]);

    // OR
    echo $this->Form->file('submittedfile');

.. note::

    Due to the limitations of HTML itself, it is not possible to put
    default values into input fields of type 'file'. Each time the form
    is displayed, the value inside will be empty.

To prevent the ``submittedfile`` from being over-written as blank, remove it
from ``$_accessible``.  Alternatively, you can unset the index by using
``beforeMarshal``::

    public function beforeMarshal(\Cake\Event\EventInterface $event, \ArrayObject $data, \ArrayObject $options)
    {
       if ($data['submittedfile'] === '') {
          unset($data['submittedfile']);
       }
    }


Upon submission, file fields can be accessed though ``UploadedFileInterface``
objects on the request. To move uploaded files to a permanent location, you can
use::

    $fileobject = $this->request->getData('submittedfile');
    $destination = UPLOAD_DIRECTORY . $fileobject->getClientFilename();

    // Existing files with the same name will be replaced.
    $fileobject->moveTo($destination);

.. note::

    When using ``$this->Form->file()``, remember to set the form
    encoding-type, by setting the ``'type'`` option to ``'file'`` in
    ``$this->Form->create()``.

.. _create-datetime-controls:

Creating Date & Time Related Controls
-------------------------------------

.. php:method:: dateTime($fieldName, $options = [])

* ``$fieldName`` - A string that will be used as a prefix for the HTML ``name``
  attribute of the ``select`` elements.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

This method will generate an input tag with type "datetime-local".

For example ::

    <?= $this->form->dateTime('registered') ?>

Output:

.. code-block:: html

    <input type="datetime-local" name="registered" />

The value for the input can be any valid datetime string or ``DateTime`` instance.

For example ::

    <?= $this->form->dateTime('registered', ['value' => new DateTime()]) ?>

Output:

.. code-block:: html

    <input type="datetime-local" name="registered" value="2019-02-08T18:20:10" />

Creating Date Controls
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: date($fieldName, $options = [])

* ``$fieldName`` - A field name that will be used as a prefix for the HTML
  ``name`` attribute of the ``select`` elements.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

This method will generate an input tag with type "date".

For example ::

    <?= $this->form->date('registered') ?>

Output:

.. code-block:: html

    <input type="date" name="registered" />

Creating Time Controls
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: time($fieldName, $options = [])

* ``$fieldName`` - A field name that will be used as a prefix for the HTML
  ``name`` attribute of the ``select`` elements.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

This method will generate an input tag with type "time".

For example ::

    echo $this->Form->time('released');

Output:

.. code-block:: html

    <input type="time" name="released" />

Creating Month Controls
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: month(string $fieldName, array $attributes)

* ``$fieldName`` - A field name that will be used as a prefix for the HTML
  ``name`` attribute of the ``select`` element.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

This method will generate an input tag with type "month".

For example::

    echo $this->Form->month('mob');

Will output:

.. code-block:: html

    <input type="month" name="mob" />

Creating Year Controls
~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: year(string $fieldName, array $options = [])

* ``$fieldName`` - A field name that will be used as a prefix for the HTML
  ``name`` attribute of the ``select`` element.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options` as well as any valid HTML attributes.
  Other valid options are:

  * ``min``: The lowest value to use in the year select picker.
  * ``max``: The maximum value to use in the year select picker.
  * ``order``: The order of year values in the year select picker.
    Possible values are ``'asc'`` and ``'desc'``. Defaults to ``'desc'``.

Creates a ``select`` element populated with the years from ``min`` to ``max``
(when these options are provided) or else with values starting from -5 years
to +5 years counted from today. Additionally, HTML attributes may be supplied
in ``$options``. If ``$options['empty']`` is ``false``, the select picker will
not include an empty item in the list.

For example, to create a year range from 2000 to the current year you
would do the following::

    echo $this->Form->year('purchased', [
        'min' => 2000,
        'max' => date('Y')
    ]);

If it was 2009, you would get the following:

.. code-block:: html

    <select name="purchased">
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

.. _create-label:

Creating Labels
===============

.. php:method:: label(string $fieldName, string $text, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$text`` - An optional string providing the label caption text.
* ``$options`` - Optional. Array containing any of the
  :ref:`general-control-options` as well as any valid HTML attributes.

Creates a ``label`` element. The argument ``$fieldName`` is used for generating
the HTML ``for`` attribute of the element; if ``$text`` is undefined,
``$fieldName`` will also be used to inflect the label's ``text`` attribute.

For example::

    echo $this->Form->label('name');
    echo $this->Form->label('name', 'Your username');

Output:

.. code-block:: html

    <label for="name">Name</label>
    <label for="name">Your username</label>

With the third parameter ``$options`` you can set the id or class::

    echo $this->Form->label('name', null, ['id' => 'user-label']);
    echo $this->Form->label('name', 'Your username', ['class' => 'highlight']);

Output:

.. code-block:: html

    <label for="name" id="user-label">Name</label>
    <label for="name" class="highlight">Your username</label>

Displaying and Checking Errors
==============================

FormHelper exposes a couple of methods that allow us to easily check for
field errors and when necessary display customized error messages.

Displaying Errors
-----------------

.. php:method:: error(string $fieldName, mixed $text, array $options)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.
* ``$text`` - Optional. A string or array providing the error message(s). If an
  array, then it should be a hash of key names => messages.  Defaults to
  ``null``.
* ``$options`` - An optional array that can only contain a boolean with the key
  ``'escape'``, which will define whether to HTML escape the
  contents of the error message. Defaults to ``true``.

Shows a validation error message, specified by ``$text``, for the given
field, in the event that a validation error has occurred. If ``$text`` is not
provided then the default validation error message for that field will be used.

Uses the following template widgets::

    'error' => '<div class="error-message">{{content}}</div>'
    'errorList' => '<ul>{{content}}</ul>'
    'errorItem' => '<li>{{text}}</li>'

The ``'errorList'`` and ``'errorItem'`` templates are used to format mutiple
error messages per field.

Example::

    // If in TicketsTable you have a 'notEmptyString' validation rule:
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->requirePresence('ticket', 'create')
            ->notEmptyString('ticket');
    }

    // And inside templates/Tickets/add.php you have:
    echo $this->Form->text('ticket');

    if ($this->Form->isFieldError('ticket')) {
        echo $this->Form->error('ticket', 'Completely custom error message!');
    }

If you would click the *Submit* button of your form without providing a value
for the *Ticket* field, your form would output:

.. code-block:: html

    <input name="ticket" class="form-error" required="required" value="" type="text">
    <div class="error-message">Completely custom error message!</div>

.. note::

    When using :php:meth:`~Cake\\View\\Helper\\FormHelper::control()`, errors are
    rendered by default, so you don't need to use ``isFieldError()`` or call
    ``error()`` manually.

.. tip::

    If you use a certain model field to generate multiple form fields via
    ``control()``, and you want the same validation error message displayed for
    each one, you will probably be better off defining a custom error message
    inside the respective :ref:`validator rules<creating-validators>`.

Checking for Errors
-------------------

.. php:method:: isFieldError(string $fieldName)

* ``$fieldName`` - A field name in the form ``'Modelname.fieldname'``.

Returns ``true`` if the supplied ``$fieldName`` has an active validation
error, otherwise returns ``false``.

Example::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }


.. _html5-validity-messages:

Displaying validation messages in HTML5 validity messages
---------------------------------------------------------

If the ``autoSetCustomValidity`` FormHelper option is set to ``true``, error messages for
the field's required and notBlank validation rules will be used in lieu of the default
browser HTML5 required messages. Enabling the option will add the ``onvalid`` and ``oninvalid``
event attributes to your fields, for example::

    <input type="text" name="field" required onvalid="this.setCustomValidity('')" oninvalid="this.setCustomValidity('Custom notBlank message')" />

If you want to manually set those events with custom JavaScript, you can set the ``autoSetCustomValidity``
option to ``false`` and use the special ``customValidityMessage`` template variable instead. This
template variable is added when a field is required::

    // example template
    [
        'input' => '<input type="{{type}}" name="{{name}}" data-error-message="{{customValidityMessage}}" {{attrs}}/>',
    ]

    // would create an input like this
    <input type="text" name="field" required data-error-message="Custom notBlank message" />

You could then use JavaScript to set the ``onvalid`` and ``oninvalid`` events as you like.

Creating Buttons and Submit Elements
====================================

Creating Submit Elements
------------------------

.. php:method:: submit(string $caption, array $options)

* ``$caption`` - An optional string providing the button's text caption or a
  path to an image. Defaults to ``'Submit'``.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, or of the specific submit options (see below)
  as well as any valid HTML attributes.

Creates an ``input`` element of ``submit`` type, with ``$caption`` as value.
If the supplied ``$caption`` is a URL pointing to an image (i.e. if the string
contains '://' or contains any of the extensions '.jpg, .jpe, .jpeg, .gif'),
an image submit button will be generated, using the specified image if it
exists. If the first character is '/' then the image path is relative to
*webroot*, else if the first character is not '/' then the image path is
relative to *webroot/img*.

By default it will use the following widget templates::

    'inputSubmit' => '<input type="{{type}}"{{attrs}}/>'
    'submitContainer' => '<div class="submit">{{content}}</div>'

**Options for Submit**

* ``'type'`` - Set this option to ``'reset'`` in order to generate reset buttons.
  It defaults to ``'submit'``.

* ``'templateVars'`` - Set this array to provide additional template variables
  for the input element and its container.

* Any other provided attributes will be assigned to the ``input`` element.

The following::

    echo $this->Form->submit('Click me');

Will output:

.. code-block:: html

    <div class="submit"><input value="Click me" type="submit"></div>

You can pass a relative or absolute URL of an image to the
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
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, or of the specific button options (see below)
  as well as any valid HTML attributes.

Creates an HTML button with the specified title and a default type
of ``'button'``.

**Options for Button**

* ``'type'`` - You can set this to one of the following three
  possible values:

  #. ``'submit'`` - Similarly to the ``$this->Form->submit()`` method it will
     create a submit button. However this won't generate a wrapping ``div``
     as ``submit()`` does. This is the default type.
  #. ``'reset'`` - Creates a form reset button.
  #. ``'button'`` - Creates a standard push button.

* ``'escapeTitle'`` - Boolean. If set to ``true`` it will HTML encode
  the value provided inside ``$title``. Defaults to ``true``.

* ``'escape'`` - Boolean. If set to ``true`` it will HTML encode
  all the HTML attributes generated for the button. Defaults to ``true``.

* ``'confirm'`` - The confirmation message to display on click. Defaults to
  ``null``.

For example::

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

Example use of the ``'escapeTitle'`` option::

    // Will render unescaped HTML.
    echo $this->Form->button('<em>Submit Form</em>', [
        'type' => 'submit',
        'escapeTitle' => false,
    ]);

Closing the Form
================

.. php:method:: end($secureAttributes = [])

* ``$secureAttributes`` - Optional. Allows you to provide secure attributes
  which will be passed as HTML attributes into the hidden input elements
  generated for the SecurityComponent.

The ``end()`` method closes and completes a form. Often, ``end()`` will only
output a closing form tag, but using ``end()`` is a good practice as it
enables FormHelper to insert the hidden form elements that
:php:class:`Cake\\Controller\\Component\\SecurityComponent` requires:

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- Form elements go here -->

    <?= $this->Form->end(); ?>

If you need to add additional attributes to the generated hidden inputs
you can use the ``$secureAttributes`` argument.

For example::

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

Creating Standalone Buttons and POST Links
==========================================

Creating POST Buttons
---------------------

.. php:method:: postButton(string $title, mixed $url, array $options = [])

* ``$title`` - Mandatory string providing the button's text caption. By default
  not HTML encoded.
* ``$url`` - The URL of the form provided as a string or as array.
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, or of the specific options (see below) as well
  as any valid HTML attributes.

Creates a ``<button>`` tag with a surrounding ``<form>`` element that submits
via POST, by default. Also, by default, it generates hidden input fields for the
SecurityComponent.

**Options for POST Button**

* ``'data'`` - Array with key/value to pass in hidden input.

* ``'method'`` - Request method to use. E.g. set to ``'delete'`` to
  simulate a HTTP/1.1 DELETE request. Defaults to ``'post'``.

* ``'form'`` - Array with any option that ``FormHelper::create()`` can take.

* Also, the ``postButton()`` method will accept the options which are valid for
  the ``button()`` method.

For example::

    // In templates/Tickets/index.php
    <?= $this->Form->postButton('Delete Record', ['controller' => 'Tickets', 'action' => 'delete', 5]) ?>

Will output HTML similar to:

.. code-block:: html

    <form method="post" accept-charset="utf-8" action="/Rtools/tickets/delete/5">
        <div style="display:none;">
            <input name="_method" value="POST" type="hidden">
        </div>
        <button type="submit">Delete Record</button>
        <div style="display:none;">
            <input name="_Token[fields]" value="186cfbfc6f519622e19d1e688633c4028229081f%3A" type="hidden">
            <input name="_Token[unlocked]" value="" type="hidden">
            <input name="_Token[debug]" value="%5B%22%5C%2FRtools%5C%2Ftickets%5C%2Fdelete%5C%2F1%22%2C%5B%5D%2C%5B%5D%5D" type="hidden">
        </div>
    </form>

Since this method generates a ``form`` element, do not use this method in an
already opened form. Instead use
:php:meth:`Cake\\View\\Helper\\FormHelper::submit()`
or :php:meth:`Cake\\View\\Helper\\FormHelper::button()` to create buttons
inside opened forms.

Creating POST Links
-------------------

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

* ``$title`` - Mandatory string providing the text to be wrapped in ``<a>``
  tags.
* ``$url`` - Optional. String or array which contains the URL
  of the form (Cake-relative or external URL starting with ``http://``).
* ``$options`` - An optional array including any of the
  :ref:`general-control-options`, or of the specific options (see below) as well
  as any valid HTML attributes.

Creates an HTML link, but accesses the URL using the method you specify
(defaults to POST). Requires JavaScript to be enabled in browser::

    // In your template, to delete an article, for example
    <?= $this->Form->postLink(
    	'Delete',
    	['action' => 'delete', $article->id],
    	['confirm' => 'Are you sure?'])
    ?>

**Options for POST Link**

* ``'data'`` - Array with key/value to pass in hidden input.

* ``'method'`` - Request method to use. For example, setting it to ``'delete'``
  will simulate a HTTP/1.1 DELETE request. Defaults to ``'post'``.

* ``'confirm'`` - The confirmation message to display on click. Defaults to
  ``null``.

* ``'block'`` - Set this option to ``true`` to append the form to view block
  ``'postLink'`` or provide a custom block name. Defaults to ``null``.

* Also, the ``postLink`` method will accept the options which are valid for
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

.. _customizing-templates:

Customizing the Templates FormHelper Uses
=========================================

Like many helpers in CakePHP, FormHelper uses string templates to format the
HTML it creates. While the default templates are intended to be a reasonable set
of defaults, you may need to customize the templates to suit your application.

To change the templates when the helper is loaded you can set the ``'templates'``
option when including the helper in your controller::

    // In a View class
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

This would load the tags found in **config/app_form.php**. This file should
contain an array of templates *indexed by name*::

    // in config/app_form.php
    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

Any templates you define will replace the default ones included in the helper.
Templates that are not replaced, will continue to use the default values.

You can also change the templates at runtime using the ``setTemplates()`` method::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->setTemplates($myTemplates);

.. warning::

    Template strings containing a percentage sign (``%``) need special attention;
    you should prefix this character with another percentage so it looks like
    ``%%``. The reason is that internally templates are compiled to be used with
    ``sprintf()``. Example: ``'<div style="width:{{size}}%%">{{content}}</div>'``

List of Templates
-----------------

The list of default templates, their default format and the variables they
expect can be found in the
`FormHelper API documentation <https://api.cakephp.org/4.x/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_.

Using Distinct Custom Control Containers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
In addition to these templates, the ``control()`` method will attempt to use
distinct templates for each control container. For example, when creating
a datetime control the ``datetimeContainer`` will be used if it is present.
If that container is missing the ``inputContainer`` template will be used.

For example::

    // Add custom radio wrapping HTML
    $this->Form->setTemplates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // Create a radio set with our custom wrapping div.
    echo $this->Form->control('email_notifications', [
        'options' => ['y', 'n'],
        'type' => 'radio'
    ]);

Using Distinct Custom Form Groups
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Similar to controlling containers, the ``control()`` method will also attempt to use
distinct templates for each form group. A form group is a combo of label and
control. For example, when creating a radio control the ``radioFormGroup`` will be
used if it is present. If that template is missing by default each set of ``label``
& ``input`` is rendered using the default ``formGroup`` template.

For example::

    // Add custom radio form group
    $this->Form->setTemplates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

Adding Additional Template Variables to Templates
-------------------------------------------------

You can add additional template placeholders in custom templates, and populate
those placeholders when generating controls.

For example::

    // Add a template with the help placeholder.
    $this->Form->setTemplates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // Generate an input and populate the help variable
    echo $this->Form->control('password', [
        'templateVars' => ['help' => 'At least 8 characters long.']
    ]);

Output:

.. code-block:: html

    <div class="input password">
        <label for="password">
            Password
        </label>
        <input name="password" id="password" type="password">
        <span class="help">At least 8 characters long.</span>
    </div>

Moving Checkboxes & Radios Outside of a Label
---------------------------------------------

By default CakePHP nests checkboxes created via ``control()`` and radio buttons
created by both ``control()`` and ``radio()`` within label elements.
This helps make it easier to integrate popular CSS frameworks. If you need to
place checkbox/radio inputs outside of the label you can do so by modifying the
templates::

    $this->Form->setTemplates([
        'nestingLabel' => '{{hidden}}{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

This will make radio buttons and checkboxes render outside of their labels.

Generating Entire Forms
=======================

Creating Multiple Controls
--------------------------

.. php:method:: controls(array $fields = [], $options = [])

* ``$fields`` - An array of fields to generate. Allows setting
  custom types, labels and other options for each specified field.
* ``$options`` - Optional. An array of options. Valid keys are:

  #. ``'fieldset'`` - Set this to ``false`` to disable the fieldset.
     If empty, the fieldset will be enabled. Can also be an array of parameters
     to be applied as HTML attributes to the ``fieldset`` tag.
  #. ``legend`` - String used to customize the ``legend`` text. Set this to
     ``false`` to disable the legend for the generated input set.

Generates a set of controls for the given context wrapped in a
``fieldset``. You can specify the generated fields by including them::

    echo $this->Form->controls([
        'name',
        'email'
    ]);

You can customize the legend text using an option::

    echo $this->Form->controls($fields, ['legend' => 'Update news post']);

You can customize the generated controls by defining additional options in the
``$fields`` parameter::

    echo $this->Form->controls([
        'name' => ['label' => 'custom label']
    ]);

When customizing, ``$fields``, you can use the ``$options`` parameter to
control the generated legend/fieldset.

For example::

    echo $this->Form->controls(
        [
            'name' => ['label' => 'custom label']
        ],
        ['legend' => 'Update your post']
    );

If you disable the ``fieldset``, the ``legend`` will not print.

Creating Controls for a Whole Entity
------------------------------------

.. php:method:: allControls(array $fields, $options = [])

* ``$fields`` - Optional. An array of customizations for the fields that will
  be generated. Allows setting custom types, labels and other options.
* ``$options`` - Optional. An array of options. Valid keys are:

  #. ``'fieldset'`` - Set this to ``false`` to disable the fieldset.
     If empty, the fieldset will be enabled. Can also be an array of
     parameters to be applied as HTMl attributes to the ``fieldset`` tag.
  #. ``legend`` - String used to customize the ``legend`` text. Set this to
     ``false`` to disable the legend for the generated control set.

This method is closely related to ``controls()``, however the ``$fields`` argument
is defaulted to *all* fields in the current top-level entity. To exclude
specific fields from the generated controls, set them to ``false`` in the
``$fields`` parameter::

    echo $this->Form->allControls(['password' => false]);

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
create the following controls::

    $this->Form->create($article);

    // Article controls.
    echo $this->Form->control('title');

    // Author controls (belongsTo)
    echo $this->Form->control('author.id');
    echo $this->Form->control('author.first_name');
    echo $this->Form->control('author.last_name');

    // Author profile (belongsTo + hasOne)
    echo $this->Form->control('author.profile.id');
    echo $this->Form->control('author.profile.username');

    // Tags controls (belongsToMany)
    // as separate inputs
    echo $this->Form->control('tags.0.id');
    echo $this->Form->control('tags.0.name');
    echo $this->Form->control('tags.1.id');
    echo $this->Form->control('tags.1.name');

    // Inputs for the joint table (articles_tags)
    echo $this->Form->control('tags.0._joinData.starred');
    echo $this->Form->control('tags.1._joinData.starred');

    // Comments controls (hasMany)
    echo $this->Form->control('comments.0.id');
    echo $this->Form->control('comments.0.comment');
    echo $this->Form->control('comments.1.id');
    echo $this->Form->control('comments.1.comment');

The above controls could then be marshalled into a completed entity graph using
the following code in your controller::

    $article = $this->Articles->patchEntity($article, $this->request->getData(), [
        'associated' => [
            'Authors',
            'Authors.Profiles',
            'Tags',
            'Comments'
        ]
    ]);

The above example shows an expanded example for belongs to many associations,
with separate inputs for each entity and join data record. You can also create
a multiple select input for belongs to many associations::

    // Multiple select element for belongsToMany
    // Does not support _joinData
    echo $this->Form->control('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);


Adding Custom Widgets
=====================

You can add custom control widgets in CakePHP, and use them like any other
control type. All of the core control types are implemented as widgets, which
means you can override any core widget with your own implementation as well.

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
    use Cake\View\StringTemplate;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        /**
         * StringTemplate instance.
         *
         * @var \Cake\View\StringTemplate
         */
        protected $_templates;

        /**
         * Constructor.
         *
         * @param \Cake\View\StringTemplate $templates Templates list.
         */
        public function __construct(StringTemplate $templates)
        {
            $this->_templates = $templates;
        }

        /**
         * Methods that render the widget.
         *
         * @param array $data The data to build an input with.
         * @param \Cake\View\Form\ContextInterface $context The current form context.
         *
         * @return string
         */
        public function render(array $data, ContextInterface $context): string
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data): array
        {
            return [$data['name']];
        }
    }

Obviously, this is a very simple example, but it demonstrates how a custom
widget could be built. This widget would render the "autocomplete" string
template, such as::

    $this->Form->setTemplates([
        'autocomplete' => '<input type="autocomplete" name="{{name}}" {{attrs}} />'
    ]);

For more information on string templates, see :ref:`customizing-templates`.

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

In the above example, the ``autocomplete`` widget would depend on the ``text`` and
``label`` widgets. If your widget needs access to the View, you should use the
``_view`` 'widget'.  When the ``autocomplete`` widget is created, it will be passed
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
        $this->Form->getWidgetLocator()->get('text'),
        $this->Form->getWidgetLocator()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

Once added/replaced, widgets can be used as the control 'type'::

    echo $this->Form->control('search', ['type' => 'autocomplete']);

This will create the custom widget with a ``label`` and wrapping ``div`` just
like ``controls()`` always does. Alternatively, you can create just the control
widget using the magic method::

    echo $this->Form->autocomplete('search', $options);

Working with SecurityComponent
==============================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` offers several
features that make your forms safer and more secure. By simply including the
``SecurityComponent`` in your controller, you'll automatically benefit from
form tampering-prevention features.

As mentioned previously when using SecurityComponent, you should always close
your forms using :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`. This will
ensure that the special ``_Token`` inputs are generated.

.. php:method:: unlockField($name)

* ``$name`` - Optional. The dot-separated name for the field.

Unlocks a field making it exempt from the ``SecurityComponent`` field
hashing. This also allows the fields to be manipulated by JavaScript.
The ``$name`` parameter should be the entity property name for the field::

    $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [], array $secureAttributes = [])

* ``$fields`` - Optional. An array containing the list of fields to use when
  generating the hash. If not provided, then ``$this->fields`` will be used.
* ``$secureAttributes`` - Optional. An array of HTML attributes to be passed
  into the generated hidden input elements.

Generates a hidden ``input`` field with a security hash based on the fields used
in the form or an empty string when secured forms are not in use.
If ``$secureAttributes`` is set, these HTML attributes will be
merged into the hidden input tags generated for the SecurityComponent. This is
especially useful to set HTML5 attributes like ``'form'``.

.. meta::
    :title lang=en: FormHelper
    :description lang=en: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=en: form helper,cakephp form,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
