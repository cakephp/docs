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

The first method you’ll need to use in order to take advantage of
the FormHelper is ``create()``. This special method outputs an
opening form tag.

.. php:method:: create(string $model = null, array $options = array())

    All parameters are optional. If ``create()`` is called with no
    parameters supplied, it assumes you are building a form that
    submits to the current controller, via either the current URL. 
    The default method for form submission is POST.
    The form element is also returned with a DOM ID. The ID is
    generated using the name of the model, and the name of the
    controller action, CamelCased. If I were to call ``create()``
    inside a UsersController view, I’d see something like the following
    output in the rendered view::

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
        <?php echo $this->Form->create('Recipe'); ?>

    Output::

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
        <?php
        function edit($id = null) {
            if (empty($this->request->data)) {
                $this->data = $this->Recipe->findById($id);
            } else {
                // Save logic goes here
            }
        }

        // View/Recipes/edit.ctp:
        // Since $this->request->data['Recipe']['id'] = 5, we will get an edit form
        <?php echo $this->Form->create('Recipe'); ?>

    Output::

        <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
        <input type="hidden" name="_method" value="PUT" />

    .. note::

        Since this is an edit form, a hidden input field is generated to
        override the default HTTP method.

    When creating forms for models in plugins, you should always use
    :term:`plugin syntax` when creating a form.  This will ensure the form is
    correctly generated::
    
        <?php
        echo $this->Form->create('ContactManager.Contact');

    The ``$options`` array is where most of the form configuration
    happens. This special array can contain a number of different
    key-value pairs that affect the way the form tag is generated.

    .. versionchanged:: 2.0

    The default url for all forms, is now the current url including 
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
  
      <?php echo $this->Form->create('User', array('type' => 'get')); ?>
      
  Output::

      <form id="UserAddForm" method="get" action="/users/add">
  
  Specifying 'file' changes the form submission method to 'post', and
  includes an enctype of "multipart/form-data" on the form tag. This
  is to be used if there are any file elements inside the form. The
  absence of the proper enctype attribute will cause the file uploads
  not to function::
  
      <?php echo $this->Form->create('User', array('type' => 'file')); ?>
      
  Output::

      <form id="UserAddForm" enctype="multipart/form-data" method="post" action="/users/add">
  
  When using 'put' or 'delete', your form will be functionally
  equivalent to a 'post' form, but when submitted, the HTTP request
  method will be overridden with 'PUT' or 'DELETE', respectively.
  This allows CakePHP to emulate proper REST support in web
  browsers.

* ``$options['action']`` The action key allows you to point the form to a
  specific action in your current controller. For example, if you’d like to
  point the form to the login() action of the current controller, you would
  supply an $options array like the following::

    <?php echo $this->Form->create('User', array('action' => 'login')); ?>

  Output::

    <form id="UserLoginForm" method="post" action="/users/login">
    </form>

* ``$options['url']`` If the desired form action isn’t in the current
  controller, you can specify a URL for the form action using the ‘url’ key of
  the $options array. The supplied URL can be relative to your CakePHP
  application::

    <?php
    echo $this->Form->create(null, array('url' => '/recipes/add'));
    // or
    echo $this->Form->create(null, array(
        'url' => array('controller' => 'recipes', 'action' => 'add')
    ));

  Output::

    <form method="post" action="/recipes/add">

  or can point to an external domain::

    <?php
    echo $this->Form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ));

  Output::

    <form method="get" action="http://www.google.com/search">

  Also check :php:meth:`HtmlHelper::url()` method for more examples of
  different types of urls.

* ``$options['default']`` If 'default' has been set to boolean false, the form's
  submit action is changed so that pressing the submit button does not submit
  the form. If the form is meant to be submitted via AJAX, setting 'default' to
  false suppresses the form's default behavior so you can grab the data and
  submit it via AJAX instead.

* ``$options['inputDefaults']`` You can declare a set of default options for
  ``input()`` with the ``inputDefaults`` key to customize your default input
  creation::

    <?php
    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call::

    <?php
    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

Closing the Form
================

.. php:method:: end($options = null)

    The FormHelper includes an ``end()`` method that completes the
    form. Often, ``end()`` only outputs a closing form tag, but
    using ``end()`` also allows the FormHelper to insert needed hidden
    form elements that :php:class:`SecurityComponent` requires::

        <?php echo $this->Form->create(); ?>

        <!-- Form elements go here -->

        <?php echo $this->Form->end(); ?>

    If a string is supplied as the first parameter to ``end()``, the
    FormHelper outputs a submit button named accordingly along with the
    closing form tag::

        <?php echo $this->Form->end('Finish'); ?>

    Will output::

        <div class="submit">
            <input type="submit" value="Finish" />
        </div>
        </form>

    You can specify detail settings by passing an array to ``end()``::

        <?php 
        $options = array(
            'label' => 'Update',
            'value' => 'Update!',
            'div' => array(
                'class' => 'glass-pill',
            )
        );
        echo $this->Form->end($options);

    Will output::

        <div class="glass-pill"><input type="submit" value="Update!" name="Update"></div>

    See the `API <http://api20.cakephp.org>`_ for further details.

    .. note::

        If you are using :php:class:`SecurityComponent` in your application you
        should always end your forms with ``end()``.

.. _automagic-form-elements:

Creating form elements
======================

There are a few ways to create form inputs with the FormHelper.  We'll start by
looking at ``input()``. This method will automatically inspect the model field it
has been supplied in order to create an appropriate input for that
field.  Internally ``input()`` delegates to other methods in FormHelper.

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
    date
        day, month, and year selects
    datetime, timestamp
        day, month, year, hour, minute, and meridian selects
    time
        hour, minute, and meridian selects

    The ``$options`` parameter allows you to customize how ``input()`` works,
    and finely control what is generated.

    For example, let’s assume that your User model includes fields for a
    username (varchar), password (varchar), approved (datetime) and
    quote (text). You can use the input() method of the FormHelper to
    create appropriate inputs for all of these form fields::

        <?php 
        echo $this->Form->create(); 

        echo $this->Form->input('username');   //text
        echo $this->Form->input('password');   //password
        echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
        echo $this->Form->input('quote');      //textarea

        echo $this->Form->end('Add'); 

    A more extensive example showing some options for a date field::

        <?php
        echo $this->Form->input('birth_dt', array(
            'label' => 'Date of birth',
            'dateFormat' => 'DMY',
            'minYear' => date('Y') - 70,
            'maxYear' => date('Y') - 18,
        ));

    Besides the specific options for ``input()`` found below, you can specify
    any option for the input type & any html attribute (for instance onfocus).
    For more information on ``$options`` and ``$htmlAttributes`` see
    :doc:`/core-libraries/helpers/html`.

    Assuming that User hasAndBelongsToMany Group. In your controller, set a
    camelCase plural variable (group -> groups in this case, or ExtraFunkyModel
    -> extraFunkyModels) with the select options. In the controller action you
    would put the following::

        <?php
        $this->set('groups', $this->User->Group->find('list'));

    And in the view a multiple select can be created with this simple
    code::

        <?php
        echo $this->Form->input('Group');

    If you want to create a select field while using a belongsTo - or
    hasOne - Relation, you can add the following to your Users-controller
    (assuming your User belongsTo Group)::

        <?php
        $this->set('groups', $this->User->Group->find('list'));

    Afterwards, add the following to your form-view::

        <?php
        echo $this->Form->input('group_id');

    If your model name consists of two or more words, e.g.,
    "UserGroup", when passing the data using set() you should name your
    data in a pluralised and camelCased format as follows::

        <?php
        $this->set('userGroups', $this->UserGroup->find('list'));
        // or
        $this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));

.. php:method:: inputs(mixed $fields = null, array $blacklist = null)

    Generate a set of inputs for ``$fields``. If $fields is null the current model 
    will be used.

    In addition to controller fields output, ``$fields`` can be used to control 
    legend and fieldset rendering with the ``fieldset`` and ``legend`` keys. 
    ``$form->inputs(array('legend' => 'My legend'));``
    Would generate an input set with a custom legend. You can customize 
    individual inputs through ``$fields`` as well.::

        <?php
        echo $form->inputs(array(
            'name' => array('label' => 'custom label')
        ));

    In addition to fields control, inputs() allows you to use a few additional 
    options.

    - ``fieldset`` Set to false to disable the fieldset. If a string is supplied 
      it will be used as the classname for the fieldset element.
    - ``legend`` Set to false to disable the legend for the generated input set. 
      Or supply a string to customize the legend text.

Field naming conventions
------------------------

The Form helper is pretty smart. Whenever you specify a field name
with the form helper methods, it'll automatically use the current
model name to build an input with a format like the following::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

This allows you to omit the model name when generating inputs for the model that
the form was created for. You can create inputs for associated models, or
arbitrary models by passing in Modelname.fieldname as the first parameter::

    <?php
    echo $this->Form->input('Modelname.fieldname');

If you need to specify multiple fields using the same field name,
thus creating an array that can be saved in one shot with
saveAll(), use the following convention::

    <?php 
    echo $this->Form->input('Modelname.0.fieldname');
    echo $this->Form->input('Modelname.1.fieldname');

Output::

    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">


FormHelper uses several field-suffixes internally for datetime input creation.
If you are using fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` and having issues getting the correct input, you can
set the ``name`` attribute to override the default behavior::

    <?php
    echo $this->Form->input('Model.year', array(
        'type' => 'text',
        'name' => 'data[Model][year]'
    ));


Options
-------

``FormHelper::input()`` supports a large number of options. In addition to its
own options ``input()`` accepts options for the generated input types, as well as
html attributes. The following will cover the options specific to
``FormHelper::input()``.

* ``$options['type']`` You can force the type of an input, overriding model
  introspection, by specifying a type. In addition to the field types found in
  the :ref:`automagic-form-elements`, you can also create 'file', 'password',
  and any type supported by HTML5::

    <?php 
    echo $this->Form->input('field', array('type' => 'file'));
    echo $this->Form->input('email', array('type' => 'email'));

  Output::

    <div class="input file">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>
    <div class="input email">
        <label for="UserEmail">Email</label>
        <input type="email" name="data[User][email]" value="" id="UserEmail" />
    </div>

* ``$options['div']`` Use this option to set attributes of the input's
  containing div.  Using a string value will set the div's class name. An array
  will set the div's attributes to those specified by the array's keys/values.
  Alternatively, you can set this key to false to disable the output of the div.

  Setting the class name::

    <?php
    echo $this->Form->input('User.name', array(
        'div' => 'class_name'
    ));

  Output::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Setting multiple attributes::

    <?php
    echo $this->Form->input('User.name', array(
        'div' => array(
            'id' => 'mainDiv',
            'title' => 'Div Title',
            'style' => 'display:block'
        )
    ));

  Output::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Disabling div output::

    <?php
    echo $this->Form->input('User.name', array('div' => false)); ?>

  Output::

    <label for="UserName">Name</label>
    <input name="data[User][name]" type="text" value="" id="UserName" />

* ``$options['label']`` Set this key to the string you would like to be
  displayed within the label that usually accompanies the input::

    <?php
    echo $this->Form->input('User.name', array(
        'label' => 'The User Alias'
    ));

  Output::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Alternatively, set this key to false to disable the output of the
  label::

    <?php
    echo $this->Form->input('User.name', array('label' => false));

  Output::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

  Set this to an array to provide additional options for the
  ``label`` element. If you do this, you can use a ``text`` key in
  the array to customize the label text::

    <?php
    echo $this->Form->input('User.name', array(
        'label' => array(
            'class' => 'thingy',
            'text' => 'The User Alias'
        )
    ));

  Output::

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>


* ``$options['error']`` Using this key allows you to override the default model
  error messages and can be used, for example, to set i18n messages. It has a
  number of suboptions which control the wrapping element, wrapping element
  class name, and whether HTML in the error message will be escaped.

  To disable error message output set the error key to false::

    <?php
    $this->Form->input('Model.field', array('error' => false));

  To modify the wrapping element type and its class, use the
  following format::

    <?php
    $this->Form->input('Model.field', array(
        'error' => array('attributes' => array('wrap' => 'span', 'class' => 'bzzz'))
    ));

  To prevent HTML being automatically escaped in the error message
  output, set the escape suboption to false::

    <?php
    $this->Form->input('Model.field', array(
        'error' => array('escape' => false)
    ));

  To override the model error messages use an array with
  the keys matching the validation rule names::

    <?php
    $this->Form->input('Model.field', array(
        'error' => array('tooShort' => __('This is not long enough'))
    ));

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

* ``$options['before']``, ``$options['between']``, ``$options['separator']``,
  and ``$options['after']``

  Use these keys if you need to inject some markup inside the output
  of the input() method::
  
      <?php
      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---'
      ));
      
  Output::
      
      <div class="input">
      --before--
      <label for="UserField">Field</label>
      --between---
      <input name="data[User][field]" type="text" value="" id="UserField" />
      --after--
      </div>
  
  For radio inputs the 'separator' attribute can be used to
  inject markup to separate each input/label pair::
  
      <?php
      echo $this->Form->input('field', array(
          'before' => '--before--',
          'after' => '--after--',
          'between' => '--between---',
          'separator' => '--separator--',
          'options' => array('1', '2') 
      ));
      
  Output::
      
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

* ``$options['format']`` The ordering of the html generated FormHelper is 
  controllable as well. The 'format' options supports an array of strings
  describing the template you would like said element to follow. The supported
  array keys are:
  ``array('before', 'input', 'between', 'label', 'after','error')``.


* ``$options['inputDefaults']`` If you find yourself repeating the same options
  in multiple input() calls, you can use `inputDefaults`` to keep your code dry::

    <?php
    echo $this->Form->create('User', array(
        'inputDefaults' => array(
            'label' => false,
            'div' => false
        )
    ));

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call::

    <?php
    // No div, no label
    echo $this->Form->input('password');
    
    // has a label element
    echo $this->Form->input('username', array('label' => 'Username')); 

Generating specific types of inputs
===================================

In addition to the generic ``input()`` method, ``FormHelper`` has specific
methods for generating a number of different types of inputs.  These can be used
to generate just the input widget itself, and combined with other methods like
:php:meth:`~FormHelper::label()` and :php:meth:`~FormHelper::error()` to
generate fully custom form layouts.

.. _general-input-options:

Common options
--------------

Many of the various input element methods support a common set of options.  All
of these options are also supported by ``input()``. To reduce repetition the
common options shared by all input methods are as follows:

* ``$options['class']`` You can set the classname for an input::

    <?php
    echo $this->Form->input('title', array('class' => 'custom-class'));

* ``$options['id']`` Set this key to force the value of the DOM id for the input.

* ``$options['default']`` Used to set a default value for the input field. The
  value is used if the data passed to the form does not contain a value for the
  field (or if no data is passed at all).

  Example usage::

    <?php 
    echo $this->Form->input('ingredient', array('default' => 'Sugar')); 

  Example with select field (Size "Medium" will be selected as
  default)::

    <?php 
    $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
    echo $this->Form->input('size', array('options' => $sizes, 'default' => 'm')); 

  .. note::

    You cannot use ``default`` to check a checkbox - instead you might
    set the value in ``$this->request->data`` in your controller,
    or set the input option ``checked`` to true.

  .. note::

    Date and datetime fields' default values can be set by using the
    'selected' key.

In addition to the above options, you can mixin any html attribute you wish to
use.  Any non-special option name will be treated as an HTML attribute, and
applied to the generated HTML input element.


Options for select, checkbox and  radio inputs
----------------------------------------------


* ``$options['selected']`` Used in combination with a select-type input (i.e.
  For types select, date, time, datetime). Set ‘selected’ to the value of the
  item you wish to be selected by default when the input is rendered::

    <?php
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
  
      <?php
      echo $this->Form->input('field', array(
          'options' => array(1, 2, 3, 4, 5),
          'empty' => '(choose one)'
      ));
  
  Output::
  
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
  
  Options can also supplied as key-value pairs.

* ``$options['hiddenField']`` For certain input types (checkboxes, radios) a
  hidden input is created so that the key in $this->data will exist even without
  a value specified::

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

  This can be disabled by setting the ``$options['hiddenField'] = false``::

    <?php
    echo $this->Form->checkbox('published', array('hiddenField' => false));

  Which outputs::

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

  If you want to create multiple blocks of inputs on a form that are
  all grouped together, you should use this parameter on all inputs
  except the first. If the hidden input is on the page in multiple
  places, only the last group of input's values will be saved

  In this example, only the tertiary colors would be passed, and the
  primary colors would be overridden::

    <h2>Primary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5" id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

  Disabling the ``'hiddenField'`` on the second input group would
  prevent this behavior.

Datetime options
----------------

* ``$options['timeFormat']`` Used to specify the format of the select inputs for
  a time-related set of inputs. Valid values include '12', '24', and ``null``.

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

    <?php
    echo $this->Form->input('Model.time', array(
        'type' => 'time',
        'interval' => 15
    ));

  Would create 4 options in the minute select. One for each 15
  minutes.

Form Element-Specific Methods
=============================

.. php:method:: label(string $fieldName, string $text, array $options)

    Create a label element.  ``$fieldName`` is used for generating the 
    DOM id.  If ``$text`` is undefined, ``$fieldName`` will be used to inflect
    the label's text::

        <?php
        echo $this->Form->label('User.name');
        echo $this->Form->label('User.name', 'Your username');

    Output::

        <label for="UserName">Name</label>
        <label for="UserName">Your username</label>

    ``$options`` can either be an array of html attributes, or a string that
    will be used as a classname::

        <?php
        echo $this->Form->label('User.name', array('id' => 'user-label'));
        echo $this->Form->label('User.name', 'Your username', 'highlight');

    Output::

        <label for="UserName" id="user-label">Name</label>
        <label for="UserName" class="highlight">Your username</label>

.. php:method:: text(string $name, array $options)

    The rest of the methods available in the FormHelper are for
    creating specific form elements. Many of these methods also make
    use of a special $options parameter. In this case, however,
    $options is used primarily to specify HTML tag attributes (such as
    the value or DOM id of an element in the form)::

        <?php echo $this->Form->text('username', array('class' => 'users')); ?>

    Will output::

        <input name="data[User][username]" type="text" class="users" id="UserUsername" />

.. php:method:: password(string $fieldName, array $options)

    Creates a password field.::

        <?php
        echo $this->Form->password('password');

    Will output::

        <input name="data[User][password]" value="" id="UserPassword" type="password">

.. php:method:: hidden(string $fieldName, array $options)

    Creates a hidden form input. Example::

        <?php
        echo $this->Form->hidden('id');

    Will output::

        <input name="data[User][id]" value="10" id="UserId" type="hidden">

    .. versionchanged:: 2.0
    
    Hidden fields no longer remove the class attribute. This means 
    that if there are validation errors on hidden fields, the 
    error-field classname will be applied. 

.. php:method:: textarea(string $fieldName, array $options)

    Creates a textarea input field.::

        <?php
        echo $this->Form->textarea('notes');

    Will output::

        <textarea name="data[User][notes]" id="UserNotes"></textarea>

    .. note::

        The ``textarea`` input type allows for the ``$options`` attribute
        of ``'escape'`` which determines whether or not the contents of the
        textarea should be escaped. Defaults to ``true``.

    ::

        <?php
        echo $this->Form->textarea('notes', array('escape' => false);
        // OR....
        echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false);


    **Options**

    In addition to the :ref:`general-input-options`, textarea() supports a few
    specific options:

    * ``$options['rows'], $options['cols']`` These two keys specify the number of
      rows and columns::

        <?php
        echo $this->Form->textarea('textarea', array('rows' => '5', 'cols' => '5'));

      Output::

        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    Creates a checkbox form element. This method also generates an
    associated hidden form input to force the submission of data for
    the specified field.::

        <?php echo $this->Form->checkbox('done'); ?>

    Will output::

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

    It is possible to specify the value of the checkbox by using the
    $options array::

        <?php echo $this->Form->checkbox('done', array('value' => 555)); ?>

    Will output::

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

    If you don't want the Form helper to create a hidden input::

        <?php echo $this->Form->checkbox('done', array('hiddenField' => false)); ?>

    Will output::

        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />


.. php:method:: radio(string $fieldName, array $options, array $attributes)

    Creates a set of radio button inputs. 
    
    **Options**

    * ``$attributes['value']`` to set which value should be selected default.

    * ``$attributes['separator']`` to specify HTML in between radio
      buttons (e.g. <br />).

    * ``$attributes['legend']`` Radio elements are wrapped with a label and
      fieldset by default.  Set ``$attributes['legend']`` to false to remove
      them.::

        <?php
        $options = array('M' => 'Male', 'F' => 'Female');
        $attributes = array('legend' => false);
        echo $this->Form->radio('gender', $options, $attributes);

      Will output::

        <input name="data[User][gender]" id="UserGender_" value="" type="hidden">
        <input name="data[User][gender]" id="UserGenderM" value="M" type="radio">
        <label for="UserGenderM">Male</label>
        <input name="data[User][gender]" id="UserGenderF" value="F" type="radio">
        <label for="UserGenderF">Female</label>

    If for some reason you don't want the hidden input, setting
    ``$attributes['value']`` to a selected value or boolean false will
    do just that.

.. php:method:: select(string $fieldName, array $options, array $attributes)

    Creates a select element, populated with the items in ``$options``,
    with the option specified by ``$attributes['value']`` shown as selected by
    default. Set to false the the 'empty' key in the ``$attributes`` variable
    to turn off the default empty option::

        <?php
        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options)

    Will output::

        <select name="data[User][gender]" id="UserGender">
        <option value=""></option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        </select>

    The ``select`` input type allows for a special ``$option``
    attribute called ``'escape'`` which accepts a bool and determines
    whether to HTML entity encode the contents of the select options.
    Defaults to true::

        <?php
        $options = array('M' => 'Male', 'F' => 'Female');
        echo $this->Form->select('gender', $options, array('escape' => false));

    * ``$attributes['options']`` This key allows you to manually specify options for a
      select input, or for a radio group. Unless the 'type' is specified as 'radio',
      the FormHelper will assume that the target output is a select input::

        <?php echo $this->Form->select('field', array(1,2,3,4,5));

      Output::

        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

      Options can also be supplied as key-value pairs::

        <?php
        echo $this->Form->select('field', $options, array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2',
            'Value 3' => 'Label 3'
        ));

      Output::

        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>

      If you would like to generate a select with optgroups, just pass
      data in hierarchical format. This works on multiple checkboxes and radio
      buttons too, but instead of optgroups wraps elements in fieldsets::

        <?php
        $options = array(
           'Group 1' => array(
              'Value 1' => 'Label 1',
              'Value 2' => 'Label 2'
           ),
           'Group 2' => array(
              'Value 3' => 'Label 3'
           )
        ));
        echo $this->Form->select('field', $options);

      Output::

        <select name="data[User][field]" id="UserField">
            <optgroup label="Group 1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Group 2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>

    * ``$options['multiple']`` If 'multiple' has been set to true for an input that
      outputs a select, the select will allow multiple selections::

        <?php
        echo $this->Form->select('Model.field', $options, array('multiple' => true));

      Alternatively set 'multiple' to 'checkbox' to output a list of
      related check boxes::

        <?php
        $options =  array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox'
        ));

      Output::

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField" type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 1" id="ModelField1" type="checkbox">
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

        <?php
        echo $this->Form->create('Document', array('enctype' => 'multipart/form-data'));
        // OR
        echo $this->Form->create('Document', array('type' => 'file'));

    Next add either of the two lines to your form view file::

        <?php
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

        <?php
        $this->request->data['Document']['submittedfile'] = array(
            'name' => conference_schedule.pdf,
            'type' => application/pdf,
            'tmp_name' => C:/WINDOWS/TEMP/php1EE.tmp,
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

    <?php
    function isUploadedFile($params) {
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
            (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
        ) {
            return is_uploaded_file($val['tmp_name']);
        }
        return false;
    }

Creates a file input::

    <?php
    echo $this->Form->create('User', array('type' => 'file'));
    echo $this->Form->file('avatar');

Will output::

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
    ``$caption`` is a URL to an image (it contains a ‘.’ character),
    the submit button will be rendered as an image.

    It is enclosed between ``div`` tags by default; you can avoid this
    by declaring ``$options['div'] = false``::

        <?php
        echo $this->Form->submit();

    Will output::

        <div class="submit"><input value="Submit" type="submit"></div>

    You can also pass a relative or absolute url to an image for the
    caption parameter instead of caption text.::

        <?php
        echo $this->Form->submit('ok.png');

    Will output::

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

        <?php
        echo $this->Form->button('A Button');
        echo $this->Form->button('Another Button', array('type' => 'button'));
        echo $this->Form->button('Reset the Form', array('type' => 'reset'));
        echo $this->Form->button('Submit Form', array('type' => 'submit'));

    Will output::

        <button type="submit">A Button</button>
        <button type="button">Another Button</button>
        <button type="reset">Reset the Form</button>
        <button type="submit">Submit Form</button>


    The ``button`` input type supports the ``escape`` option, which accepts a
    bool and determines whether to HTML entity encode the $title of the button.
    Defaults to false::

        <?php 
        echo $this->Form->button('Submit Form', array('type' => 'submit', 'escape' => true));

.. php:method:: postButton(string $title, mixed $url, array $options = array ())

    Create a ``<button>`` tag with a surrounding ``<form>`` that submits via 
    POST.

    This method creates a ``<form>`` element. So do not use this method in some 
    opened form. Instead use :php:meth:`FormHelper::submit()` or 
    :php:meth:`FormHelper::button()` to create buttons inside opened forms.

.. php:method:: postLink(string $title, mixed $url = null, array $options = array (), string $confirmMessage = false)

    Creates an HTML link, but access the url using method POST. Requires 
    javascript to be enabled in browser.

    This method creates a ``<form>`` element. So do not use this method inside 
    an existing form. Instead you should add a submit button using 
    :php:meth:`FormHelper::submit()`

Creating date and time inputs
=============================

.. php:method:: dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

    Creates a set of select inputs for date and time. Valid values for
    $dateformat are ‘DMY’, ‘MDY’, ‘YMD’ or ‘NONE’. Valid values for
    $timeFormat are ‘12’, ‘24’, and null.

    You can specify not to display empty values by setting
    "array('empty' => false)" in the attributes parameter. It will also 
    pre-select the fields with the current datetime. 

.. php:method:: year(string $fieldName, int $minYear, int $maxYear, array $attributes)

    Creates a select element populated with the years from ``$minYear``
    to ``$maxYear``. HTML attributes may be supplied in $attributes. If
    ``$attributes['empty']`` is false, the select will not include an
    empty option::

        <?php
        echo $this->Form->year('purchased', 2000, date('Y'));

    Will output::

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

        <?php
        echo $this->Form->month('mob');

    Will output::

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

        <?php
        echo $this->Form->month('mob', null, array('monthNames' => false));

.. php:method:: day(string $fieldName, array $attributes)

    Creates a select element populated with the (numerical) days of the
    month.

    To create an empty option with prompt text of your choosing (e.g.
    the first option is 'Day'), you can supply the text as the final
    parameter as follows::

        <?php
        echo $this->Form->day('created');

    Will output::

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

    Creates a select element populated with ‘am’ and ‘pm’.


Displaying and checking errors
==============================

.. php:method:: error(string $fieldName, mixed $text, array $options)

    Shows a validation error message, specified by $text, for the given
    field, in the event that a validation error has occurred.

    Options:

    -  'escape' bool Whether or not to html escape the contents of the
       error.
    -  'wrap' mixed Whether or not the error message should be wrapped
       in a div. If a string, will be used as the HTML tag to use.
    -  'class' string The classname for the error message

.. php:method:: isFieldError(string $fieldName)

    Returns true if the supplied $fieldName has an active validation
    error.::

        <?php
        if ($this->Form->isFieldError('gender')) {
            echo $this->Form->error('gender');
        }

    .. note::

        When using :php:meth:`FormHelper::input()`, errors are rendered by default.

.. php:method:: tagIsInvalid()

    Returns false if given form field described by the current entity has no 
    errors. Otherwise it returns the validation message.


Working with SecurityComponent
==============================

:php:meth:`SecurityComponent` offers several features that make your forms safer
and more secure.  By simply including the ``SecurityComponent`` in your
controller, you'll automatically benefit from CSRF and form tampering features.

As mentioned previously when using SecurityComponent, you should always close
your forms using :php:meth:`FormHelper::end()`.  This will ensure that the
special ``_Token`` inputs are generated.

.. php:method:: unlockField($name)

    Unlocks a field making it exempt from the ``SecurityComponent`` field
    hashing.  This also allows the fields to be manipulated by Javascript.
    The ``$name`` parameter should be the entity name for the input::

        <?php
        $this->Form->unlockField('User.id');

.. php:method:: secure(array $fields = array())

    Generates a hidden field with a security hash based on the fields used 
    in the form.

.. _form-improvements-1-3:

2.0 updates
================

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

**Default urls on forms is the current action**

The default url for all forms, is now the current url including 
passed, named, and querystring parameters. You can override 
this default by supplying ``$options['url']`` in the second 
parameter of ``$this->Form->create()``


**FormHelper::hidden()**

Hidden fields no longer remove the class attribute. This means 
that if there are validation errors on hidden fields, 
the error-field classname will be applied.


.. meta::
    :title lang=en: FormHelper
    :description lang=en: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=en: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
