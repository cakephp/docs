FormHelper
##########

.. php:class:: FormHelper(View $view, array $settings = array())

The FormHelper does most of the heavy lifting in form creation.
The FormHelper focuses on creating forms quickly, in a way that
will streamline validation, re-population and layout. The
FormHelper is also flexible - it will do almost everything for
you using conventions, or you can use specific methods to get
only what you need.

Creating Forms
==============

The first method you'll need to use in order to take advantage of
the FormHelper is ``create()``. This special method outputs an
opening form tag.

.. php:method:: create(string $model = null, array $options = array())

    All parameters are optional. If ``create()`` is called with no
    parameters supplied, it assumes you are building a form that
    submits to the current controller, via the current URL.
    The default method for form submission is POST.
    The form element is also returned with a DOM ID. The ID is
    generated using the name of the model, and the name of the
    controller action, CamelCased. If I were to call ``create()``
    inside a UsersController view, I'd see something like the following
    output in the rendered view:

    .. code-block:: html

        <form id="UserAddForm" method="post" action="/users/add">

    .. note::

        You can also pass ``false`` for ``$model``. This will place your
        form data into the array: ``$this->request->data`` (instead of in the
        sub-array: ``$this->request->data['Model']``). This can be handy for short
        forms that may not represent anything in your database.

    The ``create()`` method allows us to customize much more using the
    parameters, however. First, you can specify a model name. By
    specifying a model for a form, you are creating that form's
    *context*. All fields are assumed to belong to this model (unless
    otherwise specified), and all models referenced are assumed to be
    associated with it. If you do not specify a model, then it assumes
    you are using the default model for the current controller::

        // If you are on /recipes/add
        echo $this->Form->create('Recipe');

    Output:

    .. code-block:: php

        <form id="RecipeAddForm" method="post" action="/recipes/add">

    This will POST the form data to the ``add()`` action of
    RecipesController. However, you can also use the same logic to
    create an edit form. The FormHelper uses the ``$this->request->data``
    property to automatically detect whether to create an add or edit
    form. If ``$this->request->data`` contains an array element named after the
    form's model, and that array contains a non-empty value of the
    model's primary key, then the FormHelper will create an edit form
    for that record. For example, if we browse to
    http://site.com/recipes/edit/5, we would get the following::

        // Controller/RecipesController.php:
        public function edit($id = null) {
            if (empty($this->request->data)) {
                $this->request->data = $this->Recipe->findById($id);
            } else {
                // Save logic goes here
            }
        }

        // View/Recipes/edit.ctp:
        // Since $this->request->data['Recipe']['id'] = 5,
        // we will get an edit form
        <?php echo $this->Form->create('Recipe'); ?>

    Output:

    .. code-block:: html

        <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
        <input type="hidden" name="_method" value="PUT" />

    .. note::

        Since this is an edit form, a hidden input field is generated to
        override the default HTTP method.

    When creating forms for models in plugins, you should always use
    :term:`plugin syntax` when creating a form. This will ensure the form is
    correctly generated::

        echo $this->Form->create('ContactManager.Contact');

    The ``$options`` array is where most of the form configuration
    happens. This special array can contain a number of different
    key-value pairs that affect the way the form tag is generated.

    .. versionchanged:: 2.0
        The default URL for all forms, is now the current URL including
        passed, named, and querystring parameters. You can override this
        default by supplying ``$options['url']`` in the second parameter of
        ``$this->Form->create()``.

Options for create()
--------------------

There are a number of options for create():

* ``$options['type']`` This key is used to specify the type of form to be created. Valid
  values include 'post', 'get', 'file', 'put' and 'delete'.

  Supplying either 'post' or 'get' changes the form submission method
  accordingly::

      echo $this->Form->create('User', array('type' => 'get'));

  Output:

  .. code-block:: html

     <form id="UserAddForm" method="get" action="/users/add">

  Specifying 'file' changes the form submission method to 'post', and
  includes an enctype of "multipart/form-data" on the form tag. This
  is to be used if there are any file elements inside the form. The
  absence of the proper enctype attribute will cause the file uploads
  not to function::

      echo $this->Form->create('User', array('type' => 'file'));

  Output:

  .. code-block:: html

     <form id="UserAddForm" enctype="multipart/form-data"
        method="post" action="/users/add">

  When using 'put' or 'delete', your form will be functionally
  equivalent to a 'post' form, but when submitted, the HTTP request
  method will be overridden with 'PUT' or 'DELETE', respectively.
  This allows CakePHP to emulate proper REST support in web
  browsers.

* ``$options['action']`` The action key allows you to point the form to a
  specific action in your current controller. For example, if you'd like to
  point the form to the login() action of the current controller, you would
  supply an $options array like the following::

    echo $this->Form->create('User', array('action' => 'login'));

  Output:

  .. code-block:: html

     <form id="UserLoginForm" method="post" action="/users/login">

  .. deprecated:: 2.8.0
     The ``$options['action']`` option was deprecated as of 2.8.0.
     Use the ``$options['url']`` and ``$options['id']`` options instead.

* ``$options['url']`` If the desired form action isn't in the current
  controller, you can specify a URL for the form action using the 'url' key of
  the $options array. The supplied URL can be relative to your CakePHP
  application::

    echo $this->Form->create(false, array(
        'url' => array('controller' => 'recipes', 'action' => 'add'),
        'id' => 'RecipesAdd'
    ));

  Output:

  .. code-block:: html

     <form method="post" action="/recipes/add">

  or can point to an external domain::

    echo $this->Form->create(false, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ));

  Output:

  .. code-block:: html

    <form method="get" action="http://www.google.com/search">

  Also check :php:meth:`HtmlHelper::url()` method for more examples of
  different types of URLs.

  .. versionchanged:: 2.8.0

     Use ``'url' => false`` if you don’t want to output a URL as the form action.

* ``$options['default']`` If 'default' has been set to boolean false, the form's
  submit action is changed so that pressing the submit button does not submit
  the form. If the form is meant to be submitted via AJAX, setting 'default' to
  false suppresses the form's default behavior so you can grab the data and
  submit it via AJAX instead.

* ``$options['inputDefaults']`` You can declare a set of default options for
  ``input()`` with the ``inputDefaults`` key to customize your default input
  creation::

    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call::

    echo $this->Form->input('password'); // No div, no label
    // has a label element
    echo $this->Form->input(
        'username',
        array('label' => 'Username')
    );

Closing the Form
================

.. php:method:: end($options = null, $secureAttributes = array())

    The FormHelper includes an ``end()`` method that completes the
    form. Often, ``end()`` only outputs a closing form tag, but
    using ``end()`` also allows the FormHelper to insert needed hidden
    form elements that :php:class:`SecurityComponent` requires:

    .. code-block:: php

        <?php echo $this->Form->create(); ?>

        <!-- Form elements go here -->

        <?php echo $this->Form->end(); ?>

    If a string is supplied as the first parameter to ``end()``, the
    FormHelper outputs a submit button named accordingly along with the
    closing form tag::

        <?php echo $this->Form->end('Finish'); ?>

    Will output:

    .. code-block:: html

        <div class="submit">
            <input type="submit" value="Finish" />
        </div>
        </form>

    You can specify detail settings by passing an array to ``end()``::

        $options = array(
            'label' => 'Update',
            'div' => array(
                'class' => 'glass-pill',
            )
        );
        echo $this->Form->end($options);

    Will output:

    .. code-block:: html

        <div class="glass-pill"><input type="submit" value="Update" name="Update">
        </div>

    See the `Form Helper API <http://api.cakephp.org/2.8/class-FormHelper.html>`_ for further details.

    .. note::

        If you are using :php:class:`SecurityComponent` in your application you
        should always end your forms with ``end()``.

    .. versionchanged:: 2.5
        The ``$secureAttributes`` parameter was added in 2.5.

.. _automagic-form-elements:

Creating form elements
======================

There are a few ways to create form inputs with the FormHelper. We'll start by
looking at ``input()``. This method will automatically inspect the model field it
has been supplied in order to create an appropriate input for that
field. Internally ``input()`` delegates to other methods in FormHelper.

.. php:method:: input(string $fieldName, array $options = array())

    Creates the following elements given a particular ``Model.field``:

    * Wrapping div.
    * Label element
    * Input element(s)
    * Error element with message if applicable.

    The type of input created depends on the column datatype:

    Column Type
        Resulting Form Field
    string (char, varchar, etc.)
        text
    boolean, tinyint(1)
        checkbox
    text
        textarea
    text, with name of password, passwd, or psword
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

    The ``$options`` parameter allows you to customize how ``input()`` works,
    and finely control what is generated.

    The wrapping div will have a ``required`` class name appended if the
    validation rules for the Model's field do not specify ``allowEmpty =>
    true``. One limitation of this behavior is the field's model must have
    been loaded during this request. Or be directly associated to the
    model supplied to :php:meth:`~FormHelper::create()`.

    .. versionadded:: 2.5
        The binary type now maps to a file input.

    .. versionadded:: 2.3

    .. _html5-required:

    Since 2.3 the HTML5 ``required`` attribute will also be added to the input
    based on validation rules. You can explicitly set ``required`` key in
    options array to override it for a field. To skip browser validation
    triggering for the whole form you can set option ``'formnovalidate' => true``
    for the input button you generate using :php:meth:`FormHelper::submit()` or
    set ``'novalidate' => true`` in options for :php:meth:`FormHelper::create()`.

    For example, let's assume that your User model includes fields for a
    username (varchar), password (varchar), approved (datetime) and
    quote (text). You can use the input() method of the FormHelper to
    create appropriate inputs for all of these form fields::

        echo $this->Form->create();

        echo $this->Form->input('username');   //text
        echo $this->Form->input('password');   //password
        echo $this->Form->input('approved');   //day, month, year, hour, minute,
                                               //meridian
        echo $this->Form->input('quote');      //textarea

        echo $this->Form->end('Add');

    A more extensive example showing some options for a date field::

        echo $this->Form->input('birth_dt', array(
            'label' => 'Date of birth',
            'dateFormat' => 'DMY',
            'minYear' => date('Y') - 70,
            'maxYear' => date('Y') - 18,
        ));

    Besides the specific options for ``input()`` found below, you can specify
    any option for the input type & any HTML attribute (for instance onfocus).
    For more information on ``$options`` and ``$htmlAttributes`` see
    :doc:`/core-libraries/helpers/html`.

    Assuming that User hasAndBelongsToMany Group. In your controller, set a
    camelCase plural variable (group -> groups in this case, or ExtraFunkyModel
    -> extraFunkyModels) with the select options. In the controller action you
    would put the following::

        $this->set('groups', $this->User->Group->find('list'));

    And in the view a multiple select can be created with this simple
    code::

        echo $this->Form->input('Group');

    If you want to create a select field while using a belongsTo - or
    hasOne - Relation, you can add the following to your Users-controller
    (assuming your User belongsTo Group)::

        $this->set('groups', $this->User->Group->find('list'));

    Afterwards, add the following to your form-view::

        echo $this->Form->input('group_id');

    If your model name consists of two or more words, e.g.,
    "UserGroup", when passing the data using set() you should name your
    data in a pluralised and camelCased format as follows::

        $this->set('userGroups', $this->UserGroup->find('list'));
        // or
        $this->set(
            'reallyInappropriateModelNames',
            $this->ReallyInappropriateModelName->find('list')
        );

    .. note::

        Try to avoid using `FormHelper::input()` to generate submit buttons. Use
        :php:meth:`FormHelper::submit()` instead.

.. php:method:: inputs(mixed $fields = null, array $blacklist = null, $options = array())

    Generate a set of inputs for ``$fields``. If ``$fields`` is null all fields,
    except of those defined in ``$blacklist``, of the current model will be used.

    In addition to controller fields output, ``$fields`` can be used to control
    legend and fieldset rendering with the ``fieldset`` and ``legend`` keys.
    ``$this->Form->inputs(array('legend' => 'My legend'));``
    Would generate an input set with a custom legend. You can customize
    individual inputs through ``$fields`` as well. ::

        echo $this->Form->inputs(array(
            'name' => array('label' => 'custom label')
        ));

    In addition to fields control, inputs() allows you to use a few additional
    options.

    - ``fieldset`` Set to false to disable the fieldset. If a string is supplied
      it will be used as the class name for the fieldset element.
    - ``legend`` Set to false to disable the legend for the generated input set.
      Or supply a string to customize the legend text.

Field naming conventions
------------------------

The Form helper is pretty smart. Whenever you specify a field name
with the form helper methods, it'll automatically use the current
model name to build an input with a format like the following:

.. code-block:: html

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

This allows you to omit the model name when generating inputs for the model that
the form was created for. You can create inputs for associated models, or
arbitrary models by passing in Modelname.fieldname as the first parameter::

    echo $this->Form->input('Modelname.fieldname');

If you need to specify multiple fields using the same field name,
thus creating an array that can be saved in one shot with
saveAll(), use the following convention::

    echo $this->Form->input('Modelname.0.fieldname');
    echo $this->Form->input('Modelname.1.fieldname');

Output:

.. code-block:: html

    <input type="text" id="Modelname0Fieldname"
        name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname"
        name="data[Modelname][1][fieldname]">


FormHelper uses several field-suffixes internally for datetime input creation.
If you are using fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` and having issues getting the correct input, you can
set the ``name`` attribute to override the default behavior::

    echo $this->Form->input('Model.year', array(
        'type' => 'text',
        'name' => 'data[Model][year]'
    ));


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
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>
    <div class="input email">
        <label for="UserEmail">Email</label>
        <input type="email" name="data[User][email]" value="" id="UserEmail" />
    </div>

* ``$options['div']`` Use this option to set attributes of the input's
  containing div. Using a string value will set the div's class name. An array
  will set the div's attributes to those specified by the array's keys/values.
  Alternatively, you can set this key to false to disable the output of the div.

  Setting the class name::

    echo $this->Form->input('User.name', array(
        'div' => 'class_name'
    ));

  Output:

  .. code-block:: html

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Setting multiple attributes::

    echo $this->Form->input('User.name', array(
        'div' => array(
            'id' => 'mainDiv',
            'title' => 'Div Title',
            'style' => 'display:block'
        )
    ));

  Output:

  .. code-block:: html

    <div class="input text" id="mainDiv" title="Div Title"
        style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Disabling div output::

    echo $this->Form->input('User.name', array('div' => false)); ?>

  Output:

  .. code-block:: html

    <label for="UserName">Name</label>
    <input name="data[User][name]" type="text" value="" id="UserName" />

* ``$options['label']`` Set this key to the string you would like to be
  displayed within the label that usually accompanies the input::

    echo $this->Form->input('User.name', array(
        'label' => 'The User Alias'
    ));

  Output:

  .. code-block:: html

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Alternatively, set this key to false to disable the output of the
  label::

    echo $this->Form->input('User.name', array('label' => false));

  Output:

  .. code-block:: html

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
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
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>


* ``$options['error']`` Using this key allows you to override the default model
  error messages and can be used, for example, to set i18n messages. It has a
  number of suboptions which control the wrapping element, wrapping element
  class name, and whether HTML in the error message will be escaped.

  To disable error message output & field classes set the error key to false::

    $this->Form->input('Model.field', array('error' => false));

  To disable only the error message, but retain the field classes, set the
  errorMessage key to false::

    $this->Form->input('Model.field', array('errorMessage' => false));

  To modify the wrapping element type and its class, use the
  following format::

    $this->Form->input('Model.field', array(
        'error' => array(
            'attributes' => array('wrap' => 'span', 'class' => 'bzzz')
        )
    ));

  To prevent HTML being automatically escaped in the error message
  output, set the escape suboption to false::

    $this->Form->input('Model.field', array(
        'error' => array(
            'attributes' => array('escape' => false)
        )
    ));

  To override the model error messages use an array with
  the keys matching the validation rule names::

    $this->Form->input('Model.field', array(
        'error' => array('tooShort' => __('This is not long enough'))
    ));

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

  .. versionadded:: 2.3
    Support for the ``errorMessage`` option was added in 2.3

* ``$options['before']``, ``$options['between']``, ``$options['separator']``,
  and ``$options['after']``

  Use these keys if you need to inject some markup inside the output
  of the input() method::

      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---'
      ));

  Output:

  .. code-block:: html

      <div class="input">
      --before--
      <label for="UserField">Field</label>
      --between---
      <input name="data[User][field]" type="text" value="" id="UserField" />
      --after--
      </div>

  For radio inputs the 'separator' attribute can be used to
  inject markup to separate each input/label pair::

      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---',
          'separator' => '--separator--',
          'options' => array('1', '2'),
          'type' => 'radio'
      ));

  Output:

  .. code-block:: html

      <div class="input">
      --before--
      <input name="data[User][field]" type="radio" value="1" id="UserField1" />
      <label for="UserField1">1</label>
      --separator--
      <input name="data[User][field]" type="radio" value="2" id="UserField2" />
      <label for="UserField2">2</label>
      --between---
      --after--
      </div>

  For ``date`` and ``datetime`` type elements the 'separator'
  attribute can be used to change the string between select elements.
  Defaults to '-'.

* ``$options['format']`` The ordering of the HTML generated by FormHelper is
  controllable as well. The 'format' options supports an array of strings
  describing the template you would like said element to follow. The supported
  array keys are:
  ``array('before', 'input', 'between', 'label', 'after','error')``.


* ``$options['inputDefaults']`` If you find yourself repeating the same options
  in multiple input() calls, you can use `inputDefaults`` to keep your code dry::

    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call::

    // No div, no label
    echo $this->Form->input('password');

    // has a label element
    echo $this->Form->input('username', array('label' => 'Username'));

  If you need to later change the defaults you can use
  :php:meth:`FormHelper::inputDefaults()`.

* ``$options['maxlength']`` Set this key to set the ``maxlength`` attribute of the ``input``
  field to a specific value. When this key is omitted and the input-type is ``text``,
  ``textarea``, ``email``, ``tel``, ``url`` or ``search`` and the field-definition is not
  one of ``decimal``, ``time`` or ``datetime``, the length option of the database field is
  used.

GET Form Inputs
---------------

When using ``FormHelper`` to generate inputs for ``GET`` forms, the input names
will automatically be shortened to provide more human friendly names. For
example::

    // Makes <input name="email" type="text" />
    echo $this->Form->input('User.email');

    // Makes <select name="Tags" multiple="multiple">
    echo $this->Form->input('Tags.Tags', array('multiple' => true));

If you want to override the generated name attributes you can use the ``name``
option::

    // Makes the more typical <input name="data[User][email]" type="text" />
    echo $this->Form->input('User.email', array('name' => 'data[User][email]'));

Generating specific types of inputs
===================================

In addition to the generic ``input()`` method, ``FormHelper`` has specific
methods for generating a number of different types of inputs. These can be used
to generate just the input widget itself, and combined with other methods like
:php:meth:`~FormHelper::label()` and :php:meth:`~FormHelper::error()` to
generate fully custom form layouts.

.. _general-input-options:

Common options
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
    echo $this->Form->input(
        'size',
        array('options' => $sizes, 'default' => 'm')
    );

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


Options for select, checkbox and  radio inputs
----------------------------------------------

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
          <select name="data[User][field]" id="UserField">
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

  A list of key-value pairs can be supplied for a date or datetime field::

    echo $this->Form->dateTime('Contact.date', 'DMY', '12',
        array(
            'empty' => array(
                'day' => 'DAY', 'month' => 'MONTH', 'year' => 'YEAR',
                'hour' => 'HOUR', 'minute' => 'MINUTE', 'meridian' => false
            )
        )
    );

  Output:

  .. code-block:: html

    <select name="data[Contact][date][day]" id="ContactDateDay">
        <option value="">DAY</option>
        <option value="01">1</option>
        // ...
        <option value="31">31</option>
    </select> - <select name="data[Contact][date][month]" id="ContactDateMonth">
        <option value="">MONTH</option>
        <option value="01">January</option>
        // ...
        <option value="12">December</option>
    </select> - <select name="data[Contact][date][year]" id="ContactDateYear">
        <option value="">YEAR</option>
        <option value="2036">2036</option>
        // ...
        <option value="1996">1996</option>
    </select> <select name="data[Contact][date][hour]" id="ContactDateHour">
        <option value="">HOUR</option>
        <option value="01">1</option>
        // ...
        <option value="12">12</option>
        </select>:<select name="data[Contact][date][min]" id="ContactDateMin">
        <option value="">MINUTE</option>
        <option value="00">00</option>
        // ...
        <option value="59">59</option>
    </select> <select name="data[Contact][date][meridian]" id="ContactDateMeridian">
        <option value="am">am</option>
        <option value="pm">pm</option>
    </select>

* ``$options['hiddenField']`` For certain input types (checkboxes, radios) a
  hidden input is created so that the key in $this->request->data will exist
  even without a value specified:

  .. code-block:: html

    <input type="hidden" name="data[Post][Published]" id="PostPublished_"
        value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1"
        id="PostPublished" />

  This can be disabled by setting the ``$options['hiddenField'] = false``::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

  Which outputs:

  .. code-block:: html

    <input type="checkbox" name="data[Post][Published]" value="1"
        id="PostPublished" />

  If you want to create multiple blocks of inputs on a form that are
  all grouped together, you should use this parameter on all inputs
  except the first. If the hidden input is on the page in multiple
  places, only the last group of input's values will be saved

  In this example, only the tertiary colors would be passed, and the
  primary colors would be overridden:

  .. code-block:: html

    <h2>Primary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="data[Color][Color][]" value="5"
        id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5"
        id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

  Disabling the ``'hiddenField'`` on the second input group would
  prevent this behavior.

  You can set a different hidden field value other than 0 such as 'N'::

      echo $this->Form->checkbox('published', array(
          'value' => 'Y',
          'hiddenField' => 'N',
      ));

Datetime options
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

All elements are created under a form for the ``User`` model as in the examples above.
For this reason, the HTML code generated will contain attributes that reference to the User model.
Ex: name=data[User][username], id=UserUsername

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

        <input name="data[User][username]" type="text" class="users"
            id="UserUsername" />

.. php:method:: password(string $fieldName, array $options)

    Creates a password field. ::

        echo $this->Form->password('password');

    Will output:

    .. code-block:: html

        <input name="data[User][password]" value="" id="UserPassword"
            type="password" />

.. php:method:: hidden(string $fieldName, array $options)

    Creates a hidden form input. Example::

        echo $this->Form->hidden('id');

    Will output:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden" />

    If the form is edited (that is, the array ``$this->request->data`` will
    contain the information saved for the ``User`` model), the value
    corresponding to ``id`` field will automatically be added to the HTML
    generated. Example for data[User][id] = 10:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden" value="10" />

    .. versionchanged:: 2.0
        Hidden fields no longer remove the class attribute. This means
        that if there are validation errors on hidden fields, the
        error-field class name will be applied.

.. php:method:: textarea(string $fieldName, array $options)

    Creates a textarea input field. ::

        echo $this->Form->textarea('notes');

    Will output:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes"></textarea>

    If the form is edited (that is, the array ``$this->request->data`` will
    contain the information saved for the ``User`` model), the value
    corresponding to ``notes`` field will automatically be added to the HTML
    generated. Example:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes">
        This text is to be edited.
        </textarea>

    .. note::

        The ``textarea`` input type allows for the ``$options`` attribute
        of ``'escape'`` which determines whether or not the contents of the
        textarea should be escaped. Defaults to ``true``.

    ::

        echo $this->Form->textarea('notes', array('escape' => false);
        // OR....
        echo $this->Form->input(
            'notes',
            array('type' => 'textarea', 'escape' => false)
        );


    **Options**

    In addition to the :ref:`general-input-options`, textarea() supports a few
    specific options:

    * ``$options['rows'], $options['cols']`` These two keys specify the number of
      rows and columns::

        echo $this->Form->textarea(
            'textarea',
            array('rows' => '5', 'cols' => '5')
        );

      Output:

      .. code-block:: html

        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    Creates a checkbox form element. This method also generates an
    associated hidden form input to force the submission of data for
    the specified field. ::

        echo $this->Form->checkbox('done');

    Will output:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

    It is possible to specify the value of the checkbox by using the
    $options array::

        echo $this->Form->checkbox('done', array('value' => 555));

    Will output:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

    If you don't want the Form helper to create a hidden input::

        echo $this->Form->checkbox('done', array('hiddenField' => false));

    Will output:

    .. code-block:: html

        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />


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

    * ``$attributes['legend']`` Radio elements are wrapped with a legend and
      fieldset by default. Set ``$attributes['legend']`` to false to remove
      them. ::

        $options = array('M' => 'Male', 'F' => 'Female');
        $attributes = array('legend' => false);
        echo $this->Form->radio('gender', $options, $attributes);

      Will output:

      .. code-block:: html

        <input name="data[User][gender]" id="UserGender_" value=""
            type="hidden" />
        <input name="data[User][gender]" id="UserGenderM" value="M"
            type="radio" />
        <label for="UserGenderM">Male</label>
        <input name="data[User][gender]" id="UserGenderF" value="F"
            type="radio" />
        <label for="UserGenderF">Female</label>


    If for some reason you don't want the hidden input, setting
    ``$attributes['value']`` to a selected value or boolean false will
    do just that.

    * ``$attributes['fieldset']`` If legend attribute is not set to false, then this
      attribute can be used to set the class of the fieldset element.


    .. versionchanged:: 2.1
        The ``$attributes['disabled']`` option was added in 2.1.

    .. versionchanged:: 2.8.5
        The ``$attributes['fieldset']`` option was added in 2.8.5.


.. php:method:: select(string $fieldName, array $options, array $attributes)

    Creates a select element, populated with the items in ``$options``,
    with the option specified by ``$attributes['value']`` shown as selected by
    default. Set the 'empty' key in the ``$attributes`` variable to false to
    turn off the default empty option::

        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options);

    Will output:

    .. code-block:: html

        <select name="data[User][gender]" id="UserGender">
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

        <select name="data[User][field]" id="UserField">
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

        <select name="data[User][field]" id="UserField">
            <option value=""></option>
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

        <select name="data[User][field]" id="UserField">
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

        echo $this->Form->select(
            'Model.field',
            $options,
            array('multiple' => true)
        );

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
           <input name="data[Model][field]" value="" id="ModelField"
            type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 1"
                id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2"
                id="ModelField2" type="checkbox">
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
           <input name="data[Model][field]" value="" id="ModelField"
            type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" disabled="disabled"
                value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2"
                id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    .. versionchanged:: 2.3
        Support for arrays in ``$attributes['disabled']`` was added in 2.3.

.. php:method:: file(string $fieldName, array $options)

    To add a file upload field to a form, you must first make sure that
    the form enctype is set to "multipart/form-data", so start off with
    a create function such as the following::

        echo $this->Form->create('Document', array(
            'enctype' => 'multipart/form-data'
        ));
        // OR
        echo $this->Form->create('Document', array('type' => 'file'));

    Next add either of the two lines to your form view file::

        echo $this->Form->input('Document.submittedfile', array(
            'between' => '<br />',
            'type' => 'file'
        ));

        // OR

        echo $this->Form->file('Document.submittedfile');

    Due to the limitations of HTML itself, it is not possible to put
    default values into input fields of type 'file'. Each time the form
    is displayed, the value inside will be empty.

    Upon submission, file fields provide an expanded data array to the
    script receiving the form data.

    For the example above, the values in the submitted data array would
    be organized as follows, if the CakePHP was installed on a Windows
    server. 'tmp\_name' will have a different path in a Unix
    environment::

        $this->request->data['Document']['submittedfile'] = array(
            'name' => 'conference_schedule.pdf',
            'type' => 'application/pdf',
            'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
            'error' => 0,
            'size' => 41737,
        );

    This array is generated by PHP itself, so for more detail on the
    way PHP handles data passed via file fields
    `read the PHP manual section on file uploads <http://php.net/features.file-upload>`_.

Validating Uploads
------------------

Below is an example validation method you could define in your
model to validate whether a file has been successfully uploaded::

    public function isUploadedFile($params) {
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
            (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
        ) {
            return is_uploaded_file($val['tmp_name']);
        }
        return false;
    }

Creates a file input::

    echo $this->Form->create('User', array('type' => 'file'));
    echo $this->Form->file('avatar');

Will output:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

.. note::

    When using ``$this->Form->file()``, remember to set the form
    encoding-type, by setting the type option to 'file' in
    ``$this->Form->create()``


Creating buttons and submit elements
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
    caption parameter instead of caption text. ::

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

        echo $this->Form->button('Submit Form', array(
            'type' => 'submit',
            'escape' => true
        ));

.. php:method:: postButton(string $title, mixed $url, array $options = array ())

    Create a ``<button>`` tag with a surrounding ``<form>`` that submits via
    POST.

    This method creates a ``<form>`` element. So do not use this method in some
    opened form. Instead use :php:meth:`FormHelper::submit()` or
    :php:meth:`FormHelper::button()` to create buttons inside opened forms.

.. php:method:: postLink(string $title, mixed $url = null, array $options = array ())

    Creates an HTML link, but access the URL using method POST. Requires
    JavaScript to be enabled in browser.

    This method creates a ``<form>`` element. If you want to use this method
    inside of an existing form, you must use the ``inline`` or ``block`` options
    so that the new form can be rendered outside of the existing form.

    If all you are looking for is a button to submit your form, then you should
    use :php:meth:`FormHelper::submit()` instead.

    .. versionchanged:: 2.3
        The ``method`` option was added.

    .. versionchanged:: 2.5
        The ``inline`` and ``block`` options were added. They allow buffering
        the generated form tag, instead of returning with the link. This helps
        avoiding nested form tags. Setting ``'inline' => false`` will add
        the form tag to the ``postLink`` content block, if you want to use a
        custom block you can specify it using the ``block`` option instead.

    .. versionchanged:: 2.6
        The argument ``$confirmMessage`` was deprecated. Use ``confirm`` key
        in ``$options`` instead.

Creating date and time inputs
=============================

.. php:method:: dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

    Creates a set of select inputs for date and time. Valid values for
    $dateformat are 'DMY', 'MDY', 'YMD' or 'NONE'. Valid values for
    $timeFormat are '12', '24', and null.

    You can specify not to display empty values by setting
    "array('empty' => false)" in the attributes parameter. It will also
    pre-select the fields with the current datetime.

.. php:method:: year(string $fieldName, int $minYear, int $maxYear, array $attributes)

    Creates a select element populated with the years from ``$minYear``
    to ``$maxYear``. HTML attributes may be supplied in $attributes. If
    ``$attributes['empty']`` is false, the select will not include an
    empty option::

        echo $this->Form->year('purchased', 2000, date('Y'));

    Will output:

    .. code-block:: html

        <select name="data[User][purchased][year]" id="UserPurchasedYear">
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

        <select name="data[User][mob][month]" id="UserMobMonth">
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

        echo $this->Form->month('mob', array('monthNames' => false));

.. php:method:: day(string $fieldName, array $attributes)

    Creates a select element populated with the (numerical) days of the
    month.

    To create an empty option with prompt text of your choosing (e.g.
    the first option is 'Day'), you can supply the text as the final
    parameter as follows::

        echo $this->Form->day('created');

    Will output:

    .. code-block:: html

        <select name="data[User][created][day]" id="UserCreatedDay">
        <option value=""></option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        ...
        <option value="31">31</option>
        </select>

.. php:method:: hour(string $fieldName, boolean $format24Hours, array $attributes)

    Creates a select element populated with the hours of the day.

.. php:method:: minute(string $fieldName, array $attributes)

    Creates a select element populated with the minutes of the hour.

.. php:method:: meridian(string $fieldName, array $attributes)

    Creates a select element populated with 'am' and 'pm'.


Displaying and checking errors
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

.. php:method:: isFieldError(string $fieldName)

    Returns true if the supplied $fieldName has an active validation
    error. ::

        if ($this->Form->isFieldError('gender')) {
            echo $this->Form->error('gender');
        }

    .. note::

        When using :php:meth:`FormHelper::input()`, errors are rendered by default.

.. php:method:: tagIsInvalid()

    Returns false if given form field described by the current entity has no
    errors. Otherwise it returns the validation message.


Setting Defaults for all fields
===============================

.. versionadded:: 2.2

You can declare a set of default options for ``input()`` using
:php:meth:`FormHelper::inputDefaults()`. Changing the default options allows
you to consolidate repeated options into a single method call::

    $this->Form->inputDefaults(array(
            'label' => false,
            'div' => false,
            'class' => 'fancy'
        )
    );

All inputs created from that point forward will inherit the options declared in
inputDefaults. You can override the default options by declaring the option in the
input() call::

    echo $this->Form->input('password'); // No div, no label with class 'fancy'
    // has a label element same defaults
    echo $this->Form->input(
        'username',
        array('label' => 'Username')
    );

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

.. _form-improvements-1-3:

2.0 updates
===========

**$selected parameter removed**

The ``$selected`` parameter was removed from several methods in
FormHelper. All methods now support a ``$attributes['value']`` key
now which should be used in place of ``$selected``. This change
simplifies the FormHelper methods, reducing the number of
arguments, and reduces the duplication that ``$selected`` created.
The effected methods are:

    * FormHelper::select()
    * FormHelper::dateTime()
    * FormHelper::year()
    * FormHelper::month()
    * FormHelper::day()
    * FormHelper::hour()
    * FormHelper::minute()
    * FormHelper::meridian()

**Default URLs on forms is the current action**

The default URL for all forms, is now the current URL including
passed, named, and querystring parameters. You can override
this default by supplying ``$options['url']`` in the second
parameter of ``$this->Form->create()``


**FormHelper::hidden()**

Hidden fields no longer remove the class attribute. This means
that if there are validation errors on hidden fields,
the error-field class name will be applied.


.. meta::
    :title lang=en: FormHelper
    :description lang=en: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=en: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
