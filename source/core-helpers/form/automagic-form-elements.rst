7.3.3 Automagic Form Elements
-----------------------------

First, let’s look at some of the more automatic form creation
methods in the FormHelper. The main method we’ll look at is
input(). This method will automatically inspect the model field it
has been supplied in order to create an appropriate input for that
field.

input(string $fieldName, array $options = array())
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
For example, let’s assume that my User model includes fields for a
username (varchar), password (varchar), approved (datetime) and
quote (text). I can use the input() method of the FormHelper to
create appropriate inputs for all of these form fields.

::

    <?php echo $this->Form->create(); ?>
     
        <?php
            echo $this->Form->input('username');   //text
            echo $this->Form->input('password');   //password
            echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
            echo $this->Form->input('quote');      //textarea
        ?>
     
    <?php echo $this->Form->end('Add'); ?>


#. ``<?php echo $this->Form->create(); ?>``
#. ````
#. ``<?php``
#. ``echo $this->Form->input('username');   //text``
#. ``echo $this->Form->input('password');   //password``
#. ``echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian``
#. ``echo $this->Form->input('quote');      //textarea``
#. ``?>``
#. ````
#. ``<?php echo $this->Form->end('Add'); ?>``

A more extensive example showing some options for a date field:

::

            echo $this->Form->input('birth_dt', array( 'label' => 'Date of birth'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));


#. ``echo $this->Form->input('birth_dt', array( 'label' => 'Date of birth'``
#. ``, 'dateFormat' => 'DMY'``
#. ``, 'minYear' => date('Y') - 70``
#. ``, 'maxYear' => date('Y') - 18 ));``

Besides the specific input options found below you can specify any
html attribute (for instance onfocus). For more information on
$options and $htmlAttributes see `HTML Helper </view/1434/HTML>`_.

And to round off, here's an example for creating a
hasAndBelongsToMany select. Assume that User hasAndBelongsToMany
Group. In your controller, set a camelCase plural variable (group
-> groups in this case, or ExtraFunkyModel -> extraFunkyModels)
with the select options. In the controller action you would put the
following:

::

    $this->set('groups', $this->User->Group->find('list'));


#. ``$this->set('groups', $this->User->Group->find('list'));``

And in the view a multiple select can be expected with this simple
code:

::

    echo $this->Form->input('Group');


#. ``echo $this->Form->input('Group');``

If you want to create a select field while using a belongsTo- or
hasOne-Relation, you can add the following to your Users-controller
(assuming your User belongsTo Group):

::

    $this->set('groups', $this->User->Group->find('list'));


#. ``$this->set('groups', $this->User->Group->find('list'));``

Afterwards, add the following to your form-view:

::

    echo $this->Form->input('group_id');


#. ``echo $this->Form->input('group_id');``

If your model name consists of two or more words, e.g.,
"UserGroup", when passing the data using set() you should name your
data in a pluralised and camelCased format as follows:

::

    $this->set('userGroups', $this->UserGroup->find('list'));
    // or
    $this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));


#. ``$this->set('userGroups', $this->UserGroup->find('list'));``
#. ``// or``
#. ``$this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));``

Field naming convention
~~~~~~~~~~~~~~~~~~~~~~~

The Form helper is pretty smart. Whenever you specify a field name
with the form helper methods, it'll automatically use the current
model name to build an input with a format like the following:

::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">


#. ``<input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">``

You can manually specify the model name by passing in
Modelname.fieldname as the first parameter.

::

    echo $this->Form->input('Modelname.fieldname');


#. ``echo $this->Form->input('Modelname.fieldname');``

If you need to specify multiple fields using the same field name,
thus creating an array that can be saved in one shot with
saveAll(), use the following convention:

::

    <?php 
       echo $this->Form->input('Modelname.0.fieldname');
       echo $this->Form->input('Modelname.1.fieldname');
    ?>
    
    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">


#. ``<?php``
#. ``echo $this->Form->input('Modelname.0.fieldname');``
#. ``echo $this->Form->input('Modelname.1.fieldname');``
#. ``?>``
#. `` ``
#. ``<input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">``
#. ``<input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">``

$options[‘type’]
~~~~~~~~~~~~~~~~

You can force the type of an input (and override model
introspection) by specifying a type. In addition to the field types
found in the `table above </view/1390/Automagic-Form-Elements>`_,
you can also create ‘file’, and ‘password’ inputs.

::

    <?php echo $this->Form->input('field', array('type' => 'file')); ?>
     
    Output:
     
    <div class="input">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>


#. ``<?php echo $this->Form->input('field', array('type' => 'file')); ?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``<label for="UserField">Field</label>``
#. ``<input type="file" name="data[User][field]" value="" id="UserField" />``
#. ``</div>``

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use these keys if you need to inject some markup inside the output
of the input() method.

::

    <?php echo $this->Form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---'
    ));?>
     
    Output:
     
    <div class="input">
    --before--
    <label for="UserField">Field</label>
    --between---
    <input name="data[User][field]" type="text" value="" id="UserField" />
    --after--
    </div>


#. ``<?php echo $this->Form->input('field', array(``
#. ``'before' => '--before--',``
#. ``'after' => '--after--',``
#. ``'between' => '--between---'``
#. ``));?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``--before--``
#. ``<label for="UserField">Field</label>``
#. ``--between---``
#. ``<input name="data[User][field]" type="text" value="" id="UserField" />``
#. ``--after--``
#. ``</div>``

For radio type input the 'separator' attribute can be used to
inject markup to separate each input/label pair.

::

    <?php echo $this->Form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---',
        'separator' => '--separator--',
        'options' => array('1', '2') 
    ));?>
     
    Output:
     
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


#. ``<?php echo $this->Form->input('field', array(``
#. ``'before' => '--before--',``
#. ``'after' => '--after--',``
#. ``'between' => '--between---',``
#. ``'separator' => '--separator--',``
#. ``'options' => array('1', '2')``
#. ``));?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``--before--``
#. ``<input name="data[User][field]" type="radio" value="1" id="UserField1" />``
#. ``<label for="UserField1">1</label>``
#. ``--separator--``
#. ``<input name="data[User][field]" type="radio" value="2" id="UserField2" />``
#. ``<label for="UserField2">2</label>``
#. ``--between---``
#. ``--after--``
#. ``</div>``

For ``date`` and ``datetime`` type elements the 'separator'
attribute can be used to change the string between select elements.
Defaults to '-'.

$options[‘options’]
~~~~~~~~~~~~~~~~~~~

This key allows you to manually specify options for a select input,
or for a radio group. Unless the ‘type’ is specified as ‘radio’,
the FormHelper will assume that the target output is a select
input.

::

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

Options can also be supplied as key-value pairs.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Value 1'=>'Label 1',
        'Value 2'=>'Label 2',
        'Value 3'=>'Label 3'
     ))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(``
#. ``'Value 1'=>'Label 1',``
#. ``'Value 2'=>'Label 2',``
#. ``'Value 3'=>'Label 3'``
#. ``))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>
    </div>

If you would like to generate a select with optgroups, just pass
data in hierarchical format. Works on multiple checkboxes and radio
buttons too, but instead of optgroups wraps elements in fieldsets.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Label1' => array(
           'Value 1'=>'Label 1',
           'Value 2'=>'Label 2'
        ),
        'Label2' => array(
           'Value 3'=>'Label 3'
        )
     ))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(``
#. ``'Label1' => array(``
#. ``'Value 1'=>'Label 1',``
#. ``'Value 2'=>'Label 2'``
#. ``),``
#. ``'Label2' => array(``
#. ``'Value 3'=>'Label 3'``
#. ``)``
#. ``))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <optgroup label="Label1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Label2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>
    </div>

$options[‘multiple’]
~~~~~~~~~~~~~~~~~~~~

If ‘multiple’ has been set to true for an input that outputs a
select, the select will allow multiple selections.

::

    echo $this->Form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));


#. ``echo $this->Form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));``

Alternatively set ‘multiple’ to ‘checkbox’ to output a list of
related check boxes.

::

    echo $this->Form->input('Model.field', array(
        'type' => 'select', 
        'multiple' => 'checkbox',
        'options' => array(
                'Value 1' => 'Label 1',
                'Value 2' => 'Label 2'
        )
    ));


#. ``echo $this->Form->input('Model.field', array(``
#. ``'type' => 'select',``
#. ``'multiple' => 'checkbox',``
#. ``'options' => array(``
#. ``'Value 1' => 'Label 1',``
#. ``'Value 2' => 'Label 2'``
#. ``)``
#. ``));``

Output:

::

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

$options[‘maxLength’]
~~~~~~~~~~~~~~~~~~~~~

Defines the maximum number of characters allowed in a text input.

$options[‘div’]
~~~~~~~~~~~~~~~

Use this option to set attributes of the input's containing div.
Using a string value will set the div's class name. An array will
set the div's attributes to those specified by the array's
keys/values. Alternatively, you can set this key to false to
disable the output of the div.

Setting the class name:

::

        echo $this->Form->input('User.name', array('div' => 'class_name'));


#. ``echo $this->Form->input('User.name', array('div' => 'class_name'));``

Output:

::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Setting multiple attributes:

::

        echo $this->Form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));


#. ``echo $this->Form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));``

Output:

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Disabling div output:

::

        <?php echo $this->Form->input('User.name', array('div' => false));?>


#. ``<?php echo $this->Form->input('User.name', array('div' => false));?>``

Output:

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
~~~~~~~~~~~~~~~~~

Set this key to the string you would like to be displayed within
the label that usually accompanies the input.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>``

Output:

::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Alternatively, set this key to false to disable the output of the
label.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => false ) ); ?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => false ) ); ?>``

Output:

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Set this to an array to provide additional options for the
``label`` element. If you do this, you can use a ``text`` key in
the array to customize the label text.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>``

Output:

::

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

$options['legend']
~~~~~~~~~~~~~~~~~~

Some inputs like radio buttons will be automatically wrapped in a
fieldset with a legend title derived from the fields name. The
title can be overridden with this option. Setting this option to
false will completely eliminate the fieldset.

$options[‘id’]
~~~~~~~~~~~~~~

Set this key to force the value of the DOM id for the input.

$options['error']
~~~~~~~~~~~~~~~~~

Using this key allows you to override the default model error
messages and can be used, for example, to set i18n messages. It has
a number of suboptions which control the wrapping element, wrapping
element class name, and whether HTML in the error message will be
escaped.

To disable error message output set the error key to false.

::

    $this->Form->input('Model.field', array('error' => false));


#. ``$this->Form->input('Model.field', array('error' => false));``

To modify the wrapping element type and its class, use the
following format:

::

    $this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));


#. ``$this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));``

To prevent HTML being automatically escaped in the error message
output, set the escape suboption to false:

::

    $this->Form->input('Model.field', array('error' => array('escape' => false)));


#. ``$this->Form->input('Model.field', array('error' => array('escape' => false)));``

To override the model error messages use an associate array with
the keyname of the validation rule:

::

    $this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));


#. ``$this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));``

As seen above you can set the error message for each validation
rule you have in your models. In addition you can provide i18n
messages for your forms.

$options['default']
~~~~~~~~~~~~~~~~~~~

Used to set a default value for the input field. The value is used
if the data passed to the form does not contain a value for the
field (or if no data is passed at all).

Example usage:

::

    <?php 
        echo $this->Form->input('ingredient', array('default'=>'Sugar')); 
    ?>


#. ``<?php``
#. ``echo $this->Form->input('ingredient', array('default'=>'Sugar'));``
#. ``?>``

Example with select field (Size "Medium" will be selected as
default):

::

    <?php 
        $sizes = array('s'=>'Small', 'm'=>'Medium', 'l'=>'Large');
        echo $this->Form->input('size', array('options'=>$sizes, 'default'=>'m')); 
    ?>


#. ``<?php``
#. ``$sizes = array('s'=>'Small', 'm'=>'Medium', 'l'=>'Large');``
#. ``echo $this->Form->input('size', array('options'=>$sizes, 'default'=>'m'));``
#. ``?>``

You cannot use ``default`` to check a checkbox - instead you might
set the value in ``$this->data`` in your controller,
``$this->Form->data`` in your view, or set the input option
``checked`` to true.

Date and datetime fields' default values can be set by using the
'selected' key.

$options[‘selected’]
~~~~~~~~~~~~~~~~~~~~

Used in combination with a select-type input (i.e. For types
select, date, time, datetime). Set ‘selected’ to the value of the
item you wish to be selected by default when the input is
rendered.

::

    echo $this->Form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));


#. ``echo $this->Form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));``

The selected key for date and datetime inputs may also be a UNIX
timestamp.

$options[‘rows’], $options[‘cols’]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

These two keys specify the number of rows and columns in a textarea
input.

::

    echo $this->Form->input('textarea', array('rows' => '5', 'cols' => '5'));


#. ``echo $this->Form->input('textarea', array('rows' => '5', 'cols' => '5'));``

Output:

::

    <div class="input text">
        <label for="FormTextarea">Textarea</label>
        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >
        </textarea>
    </div>


#. ``<div class="input text">``
#. ``<label for="FormTextarea">Textarea</label>``
#. ``<textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >``
#. ``</textarea>``
#. ``</div>``

$options[‘empty’]
~~~~~~~~~~~~~~~~~

If set to true, forces the input to remain empty.

When passed to a select list, this creates a blank option with an
empty value in your drop down list. If you want to have a empty
value with text displayed instead of just a blank option, pass in a
string to empty.

::

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>``

Output:

::

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

If you need to set the default value in a password field to blank,
use 'value' => '' instead.

Options can also supplied as key-value pairs.

$options[‘timeFormat’]
~~~~~~~~~~~~~~~~~~~~~~

Used to specify the format of the select inputs for a time-related
set of inputs. Valid values include ‘12’, ‘24’, and ‘none’.

$options[‘dateFormat’]
~~~~~~~~~~~~~~~~~~~~~~

Used to specify the format of the select inputs for a date-related
set of inputs. Valid values include ‘DMY’, ‘MDY’, ‘YMD’, and
‘NONE’.

$options['minYear'], $options['maxYear']
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Used in combination with a date/datetime input. Defines the lower
and/or upper end of values shown in the years select field.

$options['interval']
~~~~~~~~~~~~~~~~~~~~

This option specifies the number of minutes between each option in
the minutes select box.

::

    <?php echo $this->Form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>


#. ``<?php echo $this->Form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>``

Would create 4 options in the minute select. One for each 15
minutes.

$options['class']
~~~~~~~~~~~~~~~~~

You can set the classname for an input field using
``$options['class']``

::

    echo $this->Form->input('title', array('class' => 'custom-class'));


#. ``echo $this->Form->input('title', array('class' => 'custom-class'));``

$options['hiddenField']
~~~~~~~~~~~~~~~~~~~~~~~

For certain input types (checkboxes, radios) a hidden input is
created so that the key in $this->data will exist even without a
value specified.

::

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />


#. ``<input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />``
#. ``<input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />``

This can be disabled by setting the
``$options['hiddenField'] = false``.

::

    echo $this->Form->checkbox('published', array('hiddenField' => false));


#. ``echo $this->Form->checkbox('published', array('hiddenField' => false));``

Which outputs:

::

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />


#. ``<input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />``

If you want to create multiple blocks of inputs on a form that are
all grouped together, you should use this parameter on all inputs
except the first. If the hidden input is on the page in multiple
places, only the last group of input's values will be saved

In this example, only the tertiary colors would be passed, and the
primary colors would be overridden

::

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


#. ``<h2>Primary Colors</h2>``
#. ``<input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsRed" />``
#. ``<label for="ColorsRed">Red</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsBlue" />``
#. ``<label for="ColorsBlue">Blue</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsYellow" />``
#. ``<label for="ColorsYellow">Yellow</label>``
#. ``<h2>Tertiary Colors</h2>``
#. ``<input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsGreen" />``
#. ``<label for="ColorsGreen">Green</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsPurple" />``
#. ``<label for="ColorsPurple">Purple</label>``
#. ``<input type="checkbox" name="data[Addon][Addon][]" value="5" id="ColorsOrange" />``
#. ``<label for="ColorsOrange">Orange</label>``

Disabling the ``'hiddenField'`` on the second input group would
prevent this behavior

7.3.3 Automagic Form Elements
-----------------------------

First, let’s look at some of the more automatic form creation
methods in the FormHelper. The main method we’ll look at is
input(). This method will automatically inspect the model field it
has been supplied in order to create an appropriate input for that
field.

input(string $fieldName, array $options = array())
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
For example, let’s assume that my User model includes fields for a
username (varchar), password (varchar), approved (datetime) and
quote (text). I can use the input() method of the FormHelper to
create appropriate inputs for all of these form fields.

::

    <?php echo $this->Form->create(); ?>
     
        <?php
            echo $this->Form->input('username');   //text
            echo $this->Form->input('password');   //password
            echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
            echo $this->Form->input('quote');      //textarea
        ?>
     
    <?php echo $this->Form->end('Add'); ?>


#. ``<?php echo $this->Form->create(); ?>``
#. ````
#. ``<?php``
#. ``echo $this->Form->input('username');   //text``
#. ``echo $this->Form->input('password');   //password``
#. ``echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian``
#. ``echo $this->Form->input('quote');      //textarea``
#. ``?>``
#. ````
#. ``<?php echo $this->Form->end('Add'); ?>``

A more extensive example showing some options for a date field:

::

            echo $this->Form->input('birth_dt', array( 'label' => 'Date of birth'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));


#. ``echo $this->Form->input('birth_dt', array( 'label' => 'Date of birth'``
#. ``, 'dateFormat' => 'DMY'``
#. ``, 'minYear' => date('Y') - 70``
#. ``, 'maxYear' => date('Y') - 18 ));``

Besides the specific input options found below you can specify any
html attribute (for instance onfocus). For more information on
$options and $htmlAttributes see `HTML Helper </view/1434/HTML>`_.

And to round off, here's an example for creating a
hasAndBelongsToMany select. Assume that User hasAndBelongsToMany
Group. In your controller, set a camelCase plural variable (group
-> groups in this case, or ExtraFunkyModel -> extraFunkyModels)
with the select options. In the controller action you would put the
following:

::

    $this->set('groups', $this->User->Group->find('list'));


#. ``$this->set('groups', $this->User->Group->find('list'));``

And in the view a multiple select can be expected with this simple
code:

::

    echo $this->Form->input('Group');


#. ``echo $this->Form->input('Group');``

If you want to create a select field while using a belongsTo- or
hasOne-Relation, you can add the following to your Users-controller
(assuming your User belongsTo Group):

::

    $this->set('groups', $this->User->Group->find('list'));


#. ``$this->set('groups', $this->User->Group->find('list'));``

Afterwards, add the following to your form-view:

::

    echo $this->Form->input('group_id');


#. ``echo $this->Form->input('group_id');``

If your model name consists of two or more words, e.g.,
"UserGroup", when passing the data using set() you should name your
data in a pluralised and camelCased format as follows:

::

    $this->set('userGroups', $this->UserGroup->find('list'));
    // or
    $this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));


#. ``$this->set('userGroups', $this->UserGroup->find('list'));``
#. ``// or``
#. ``$this->set('reallyInappropriateModelNames', $this->ReallyInappropriateModelName->find('list'));``

Field naming convention
~~~~~~~~~~~~~~~~~~~~~~~

The Form helper is pretty smart. Whenever you specify a field name
with the form helper methods, it'll automatically use the current
model name to build an input with a format like the following:

::

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">


#. ``<input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">``

You can manually specify the model name by passing in
Modelname.fieldname as the first parameter.

::

    echo $this->Form->input('Modelname.fieldname');


#. ``echo $this->Form->input('Modelname.fieldname');``

If you need to specify multiple fields using the same field name,
thus creating an array that can be saved in one shot with
saveAll(), use the following convention:

::

    <?php 
       echo $this->Form->input('Modelname.0.fieldname');
       echo $this->Form->input('Modelname.1.fieldname');
    ?>
    
    <input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">


#. ``<?php``
#. ``echo $this->Form->input('Modelname.0.fieldname');``
#. ``echo $this->Form->input('Modelname.1.fieldname');``
#. ``?>``
#. `` ``
#. ``<input type="text" id="Modelname0Fieldname" name="data[Modelname][0][fieldname]">``
#. ``<input type="text" id="Modelname1Fieldname" name="data[Modelname][1][fieldname]">``

$options[‘type’]
~~~~~~~~~~~~~~~~

You can force the type of an input (and override model
introspection) by specifying a type. In addition to the field types
found in the `table above </view/1390/Automagic-Form-Elements>`_,
you can also create ‘file’, and ‘password’ inputs.

::

    <?php echo $this->Form->input('field', array('type' => 'file')); ?>
     
    Output:
     
    <div class="input">
        <label for="UserField">Field</label>
        <input type="file" name="data[User][field]" value="" id="UserField" />
    </div>


#. ``<?php echo $this->Form->input('field', array('type' => 'file')); ?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``<label for="UserField">Field</label>``
#. ``<input type="file" name="data[User][field]" value="" id="UserField" />``
#. ``</div>``

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use these keys if you need to inject some markup inside the output
of the input() method.

::

    <?php echo $this->Form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---'
    ));?>
     
    Output:
     
    <div class="input">
    --before--
    <label for="UserField">Field</label>
    --between---
    <input name="data[User][field]" type="text" value="" id="UserField" />
    --after--
    </div>


#. ``<?php echo $this->Form->input('field', array(``
#. ``'before' => '--before--',``
#. ``'after' => '--after--',``
#. ``'between' => '--between---'``
#. ``));?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``--before--``
#. ``<label for="UserField">Field</label>``
#. ``--between---``
#. ``<input name="data[User][field]" type="text" value="" id="UserField" />``
#. ``--after--``
#. ``</div>``

For radio type input the 'separator' attribute can be used to
inject markup to separate each input/label pair.

::

    <?php echo $this->Form->input('field', array(
        'before' => '--before--',
        'after' => '--after--',
        'between' => '--between---',
        'separator' => '--separator--',
        'options' => array('1', '2') 
    ));?>
     
    Output:
     
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


#. ``<?php echo $this->Form->input('field', array(``
#. ``'before' => '--before--',``
#. ``'after' => '--after--',``
#. ``'between' => '--between---',``
#. ``'separator' => '--separator--',``
#. ``'options' => array('1', '2')``
#. ``));?>``
#. ````
#. ``Output:``
#. ````
#. ``<div class="input">``
#. ``--before--``
#. ``<input name="data[User][field]" type="radio" value="1" id="UserField1" />``
#. ``<label for="UserField1">1</label>``
#. ``--separator--``
#. ``<input name="data[User][field]" type="radio" value="2" id="UserField2" />``
#. ``<label for="UserField2">2</label>``
#. ``--between---``
#. ``--after--``
#. ``</div>``

For ``date`` and ``datetime`` type elements the 'separator'
attribute can be used to change the string between select elements.
Defaults to '-'.

$options[‘options’]
~~~~~~~~~~~~~~~~~~~

This key allows you to manually specify options for a select input,
or for a radio group. Unless the ‘type’ is specified as ‘radio’,
the FormHelper will assume that the target output is a select
input.

::

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

Options can also be supplied as key-value pairs.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Value 1'=>'Label 1',
        'Value 2'=>'Label 2',
        'Value 3'=>'Label 3'
     ))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(``
#. ``'Value 1'=>'Label 1',``
#. ``'Value 2'=>'Label 2',``
#. ``'Value 3'=>'Label 3'``
#. ``))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>
    </div>

If you would like to generate a select with optgroups, just pass
data in hierarchical format. Works on multiple checkboxes and radio
buttons too, but instead of optgroups wraps elements in fieldsets.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Label1' => array(
           'Value 1'=>'Label 1',
           'Value 2'=>'Label 2'
        ),
        'Label2' => array(
           'Value 3'=>'Label 3'
        )
     ))); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(``
#. ``'Label1' => array(``
#. ``'Value 1'=>'Label 1',``
#. ``'Value 2'=>'Label 2'``
#. ``),``
#. ``'Label2' => array(``
#. ``'Value 3'=>'Label 3'``
#. ``)``
#. ``))); ?>``

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <optgroup label="Label1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Label2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>
    </div>

$options[‘multiple’]
~~~~~~~~~~~~~~~~~~~~

If ‘multiple’ has been set to true for an input that outputs a
select, the select will allow multiple selections.

::

    echo $this->Form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));


#. ``echo $this->Form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));``

Alternatively set ‘multiple’ to ‘checkbox’ to output a list of
related check boxes.

::

    echo $this->Form->input('Model.field', array(
        'type' => 'select', 
        'multiple' => 'checkbox',
        'options' => array(
                'Value 1' => 'Label 1',
                'Value 2' => 'Label 2'
        )
    ));


#. ``echo $this->Form->input('Model.field', array(``
#. ``'type' => 'select',``
#. ``'multiple' => 'checkbox',``
#. ``'options' => array(``
#. ``'Value 1' => 'Label 1',``
#. ``'Value 2' => 'Label 2'``
#. ``)``
#. ``));``

Output:

::

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

$options[‘maxLength’]
~~~~~~~~~~~~~~~~~~~~~

Defines the maximum number of characters allowed in a text input.

$options[‘div’]
~~~~~~~~~~~~~~~

Use this option to set attributes of the input's containing div.
Using a string value will set the div's class name. An array will
set the div's attributes to those specified by the array's
keys/values. Alternatively, you can set this key to false to
disable the output of the div.

Setting the class name:

::

        echo $this->Form->input('User.name', array('div' => 'class_name'));


#. ``echo $this->Form->input('User.name', array('div' => 'class_name'));``

Output:

::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Setting multiple attributes:

::

        echo $this->Form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));


#. ``echo $this->Form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));``

Output:

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Disabling div output:

::

        <?php echo $this->Form->input('User.name', array('div' => false));?>


#. ``<?php echo $this->Form->input('User.name', array('div' => false));?>``

Output:

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
~~~~~~~~~~~~~~~~~

Set this key to the string you would like to be displayed within
the label that usually accompanies the input.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>``

Output:

::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Alternatively, set this key to false to disable the output of the
label.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => false ) ); ?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => false ) ); ?>``

Output:

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Set this to an array to provide additional options for the
``label`` element. If you do this, you can use a ``text`` key in
the array to customize the label text.

::

    <?php echo $this->Form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>


#. ``<?php echo $this->Form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>``

Output:

::

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

$options['legend']
~~~~~~~~~~~~~~~~~~

Some inputs like radio buttons will be automatically wrapped in a
fieldset with a legend title derived from the fields name. The
title can be overridden with this option. Setting this option to
false will completely eliminate the fieldset.

$options[‘id’]
~~~~~~~~~~~~~~

Set this key to force the value of the DOM id for the input.

$options['error']
~~~~~~~~~~~~~~~~~

Using this key allows you to override the default model error
messages and can be used, for example, to set i18n messages. It has
a number of suboptions which control the wrapping element, wrapping
element class name, and whether HTML in the error message will be
escaped.

To disable error message output set the error key to false.

::

    $this->Form->input('Model.field', array('error' => false));


#. ``$this->Form->input('Model.field', array('error' => false));``

To modify the wrapping element type and its class, use the
following format:

::

    $this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));


#. ``$this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));``

To prevent HTML being automatically escaped in the error message
output, set the escape suboption to false:

::

    $this->Form->input('Model.field', array('error' => array('escape' => false)));


#. ``$this->Form->input('Model.field', array('error' => array('escape' => false)));``

To override the model error messages use an associate array with
the keyname of the validation rule:

::

    $this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));


#. ``$this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));``

As seen above you can set the error message for each validation
rule you have in your models. In addition you can provide i18n
messages for your forms.

$options['default']
~~~~~~~~~~~~~~~~~~~

Used to set a default value for the input field. The value is used
if the data passed to the form does not contain a value for the
field (or if no data is passed at all).

Example usage:

::

    <?php 
        echo $this->Form->input('ingredient', array('default'=>'Sugar')); 
    ?>


#. ``<?php``
#. ``echo $this->Form->input('ingredient', array('default'=>'Sugar'));``
#. ``?>``

Example with select field (Size "Medium" will be selected as
default):

::

    <?php 
        $sizes = array('s'=>'Small', 'm'=>'Medium', 'l'=>'Large');
        echo $this->Form->input('size', array('options'=>$sizes, 'default'=>'m')); 
    ?>


#. ``<?php``
#. ``$sizes = array('s'=>'Small', 'm'=>'Medium', 'l'=>'Large');``
#. ``echo $this->Form->input('size', array('options'=>$sizes, 'default'=>'m'));``
#. ``?>``

You cannot use ``default`` to check a checkbox - instead you might
set the value in ``$this->data`` in your controller,
``$this->Form->data`` in your view, or set the input option
``checked`` to true.

Date and datetime fields' default values can be set by using the
'selected' key.

$options[‘selected’]
~~~~~~~~~~~~~~~~~~~~

Used in combination with a select-type input (i.e. For types
select, date, time, datetime). Set ‘selected’ to the value of the
item you wish to be selected by default when the input is
rendered.

::

    echo $this->Form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));


#. ``echo $this->Form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));``

The selected key for date and datetime inputs may also be a UNIX
timestamp.

$options[‘rows’], $options[‘cols’]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

These two keys specify the number of rows and columns in a textarea
input.

::

    echo $this->Form->input('textarea', array('rows' => '5', 'cols' => '5'));


#. ``echo $this->Form->input('textarea', array('rows' => '5', 'cols' => '5'));``

Output:

::

    <div class="input text">
        <label for="FormTextarea">Textarea</label>
        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >
        </textarea>
    </div>


#. ``<div class="input text">``
#. ``<label for="FormTextarea">Textarea</label>``
#. ``<textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >``
#. ``</textarea>``
#. ``</div>``

$options[‘empty’]
~~~~~~~~~~~~~~~~~

If set to true, forces the input to remain empty.

When passed to a select list, this creates a blank option with an
empty value in your drop down list. If you want to have a empty
value with text displayed instead of just a blank option, pass in a
string to empty.

::

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>


#. ``<?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choose one)')); ?>``

Output:

::

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

If you need to set the default value in a password field to blank,
use 'value' => '' instead.

Options can also supplied as key-value pairs.

$options[‘timeFormat’]
~~~~~~~~~~~~~~~~~~~~~~

Used to specify the format of the select inputs for a time-related
set of inputs. Valid values include ‘12’, ‘24’, and ‘none’.

$options[‘dateFormat’]
~~~~~~~~~~~~~~~~~~~~~~

Used to specify the format of the select inputs for a date-related
set of inputs. Valid values include ‘DMY’, ‘MDY’, ‘YMD’, and
‘NONE’.

$options['minYear'], $options['maxYear']
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Used in combination with a date/datetime input. Defines the lower
and/or upper end of values shown in the years select field.

$options['interval']
~~~~~~~~~~~~~~~~~~~~

This option specifies the number of minutes between each option in
the minutes select box.

::

    <?php echo $this->Form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>


#. ``<?php echo $this->Form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>``

Would create 4 options in the minute select. One for each 15
minutes.

$options['class']
~~~~~~~~~~~~~~~~~

You can set the classname for an input field using
``$options['class']``

::

    echo $this->Form->input('title', array('class' => 'custom-class'));


#. ``echo $this->Form->input('title', array('class' => 'custom-class'));``

$options['hiddenField']
~~~~~~~~~~~~~~~~~~~~~~~

For certain input types (checkboxes, radios) a hidden input is
created so that the key in $this->data will exist even without a
value specified.

::

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />


#. ``<input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />``
#. ``<input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />``

This can be disabled by setting the
``$options['hiddenField'] = false``.

::

    echo $this->Form->checkbox('published', array('hiddenField' => false));


#. ``echo $this->Form->checkbox('published', array('hiddenField' => false));``

Which outputs:

::

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />


#. ``<input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />``

If you want to create multiple blocks of inputs on a form that are
all grouped together, you should use this parameter on all inputs
except the first. If the hidden input is on the page in multiple
places, only the last group of input's values will be saved

In this example, only the tertiary colors would be passed, and the
primary colors would be overridden

::

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


#. ``<h2>Primary Colors</h2>``
#. ``<input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsRed" />``
#. ``<label for="ColorsRed">Red</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsBlue" />``
#. ``<label for="ColorsBlue">Blue</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsYellow" />``
#. ``<label for="ColorsYellow">Yellow</label>``
#. ``<h2>Tertiary Colors</h2>``
#. ``<input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsGreen" />``
#. ``<label for="ColorsGreen">Green</label>``
#. ``<input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsPurple" />``
#. ``<label for="ColorsPurple">Purple</label>``
#. ``<input type="checkbox" name="data[Addon][Addon][]" value="5" id="ColorsOrange" />``
#. ``<label for="ColorsOrange">Orange</label>``

Disabling the ``'hiddenField'`` on the second input group would
prevent this behavior
