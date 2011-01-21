7.3.5 Form Element-Specific Methods
-----------------------------------

The rest of the methods available in the FormHelper are for
creating specific form elements. Many of these methods also make
use of a special $options parameter. In this case, however,
$options is used primarily to specify HTML tag attributes (such as
the value or DOM id of an element in the form).

::

    <?php echo $this->Form->text('username', array('class' => 'users')); ?>

Will output:

::

     
    <input name="data[User][username]" type="text" class="users" id="UserUsername" />

checkbox
~~~~~~~~

``checkbox(string $fieldName, array $options)``

Creates a checkbox form element. This method also generates an
associated hidden form input to force the submission of data for
the specified field.

::

    <?php echo $this->Form->checkbox('done'); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

It is possible to specify the value of the checkbox by using the
$options array:

::

    <?php echo $this->Form->checkbox('done', array('value' => 555)); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

If you don't want the Form helper to create a hidden input:

::

    <?php echo $this->Form->checkbox('done', array('hiddenField' => false)); ?>

Will output:

::

    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

button
~~~~~~

``button(string $title, array $options = array())``

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
    echo $this->Form->button('Another Button', array('type'=>'button'));
    echo $this->Form->button('Reset the Form', array('type'=>'reset'));
    echo $this->Form->button('Submit Form', array('type'=>'submit'));
    ?>

Will output:

::

    <button type="submit">A Button</button>
    <button type="button">Another Button</button>
    <button type="reset">Reset the Form</button>
    <button type="submit">Submit Form</button>

The ``button`` input type allows for a special ``$option``
attribute called ``'escape'`` which accepts a bool and determines
whether to HTML entity encode the $title of the button. Defaults to
false.

::

    <?php 
        echo $this->Form->button('Submit Form', array('type'=>'submit','escape'=>true));
    ?>

year
~~~~

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes)``

Creates a select element populated with the years from ``$minYear``
to ``$maxYear``, with the $selected year selected by default. HTML
attributes may be supplied in $attributes. If
``$attributes['empty']`` is false, the select will not include an
empty option.

::

    <?php
    echo $this->Form->year('purchased',2000,date('Y'));
    ?>

Will output:

::

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

month
~~~~~

``month(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with month names.

::

    <?php
    echo $this->Form->month('mob');
    ?>

Will output:

::

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
can be translated using localization.)

::

    <?php
    echo $this->Form->month('mob', null, array('monthNames' => false));
    ?>

dateTime
~~~~~~~~

``dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $selected = null, $attributes = array())``

Creates a set of select inputs for date and time. Valid values for
$dateformat are ‘DMY’, ‘MDY’, ‘YMD’ or ‘NONE’. Valid values for
$timeFormat are ‘12’, ‘24’, and null.

You can specify not to display empty values by setting
"array('empty' => false)" in the attributes parameter. You also can
pre-select the current datetime by setting $selected = null and
$attributes = array("empty" => false).

day
~~~

``day(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the (numerical) days of the
month.

To create an empty option with prompt text of your choosing (e.g.
the first option is 'Day'), you can supply the text as the final
parameter as follows:

::

    <?php
    echo $this->Form->day('created');
    ?>

Will output:

::

    <select name="data[User][created][day]" id="UserCreatedDay">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

hour
~~~~

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the hours of the day.

minute
~~~~~~

``minute(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the minutes of the hour.

meridian
~~~~~~~~

``meridian(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with ‘am’ and ‘pm’.

error
~~~~~

``error(string $fieldName, mixed $text, array $options)``

Shows a validation error message, specified by $text, for the given
field, in the event that a validation error has occurred.

Options:


-  'escape' bool Whether or not to html escape the contents of the
   error.
-  'wrap' mixed Whether or not the error message should be wrapped
   in a div. If a string, will be used as the HTML tag to use.
-  'class' string The classname for the error message

file
~~~~

``file(string $fieldName, array $options)``

Creates a file input.

::

    <?php
    echo $this->Form->create('User',array('type'=>'file'));
    echo $this->Form->file('avatar');
    ?>

Will output:

::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

When using ``$this->Form->file()``, remember to set the form
encoding-type, by setting the type option to 'file' in
``$this->Form->create()``
hidden
~~~~~~

``hidden(string $fieldName, array $options)``

Creates a hidden form input. Example:

::

    <?php
    echo $this->Form->hidden('id');
    ?>

Will output:

::

    <input name="data[User][id]" value="10" id="UserId" type="hidden">

isFieldError
~~~~~~~~~~~~

``isFieldError(string $fieldName)``

Returns true if the supplied $fieldName has an active validation
error.

::

    <?php
    if ($this->Form->isFieldError('gender')){
        echo $this->Form->error('gender');
    }
    ?>

When using ``$this->Form->input()``, errors are rendered by
default.
label
~~~~~

``label(string $fieldName, string $text, array $attributes)``

Creates a label tag, populated with $text.

::

    <?php
    echo $this->Form->label('status');
    ?>

Will output:

::

    <label for="UserStatus">Status</label>

password
~~~~~~~~

``password(string $fieldName, array $options)``

Creates a password field.

::

    <?php
    echo $this->Form->password('password');
    ?>

Will output:

::

    <input name="data[User][password]" value="" id="UserPassword" type="password">

radio
~~~~~

``radio(string $fieldName, array $options, array $attributes)``

Creates a radio button input. Use ``$attributes['value']`` to set
which value should be selected default.

Use ``$attributes['separator']`` to specify HTML in between radio
buttons (e.g. <br />).

Radio elements are wrapped with a label and fieldset by default.
Set ``$attributes['legend']`` to false to remove them.

::

    <?php
    $options=array('M'=>'Male','F'=>'Female');
    $attributes=array('legend'=>false);
    echo $this->Form->radio('gender',$options,$attributes);
    ?>

Will output:

::

    <input name="data[User][gender]" id="UserGender_" value="" type="hidden">
    <input name="data[User][gender]" id="UserGenderM" value="M" type="radio">
    <label for="UserGenderM">Male</label>
    <input name="data[User][gender]" id="UserGenderF" value="F" type="radio">
    <label for="UserGenderF">Female</label>

If for some reason you don't want the hidden input, setting
``$attributes['value']`` to a selected value or boolean false will
do just that.

select
~~~~~~

``select(string $fieldName, array $options, mixed $selected, array $attributes)``

Creates a select element, populated with the items in ``$options``,
with the option specified by ``$selected`` shown as selected by
default. If you wish to display your own default option, add your
string value to the 'empty' key in the ``$attributes`` variable, or
set it to false to turn off the default empty option

::

    <?php
    $options = array('M' => 'Male', 'F' => 'Female');
    echo $this->Form->select('gender', $options)
    ?>

Will output:

::

    <select name="data[User][gender]" id="UserGender">
    <option value=""></option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    </select>

The ``select`` input type allows for a special ``$option``
attribute called ``'escape'`` which accepts a bool and determines
whether to HTML entity encode the contents of the select options.
Defaults to true.

::

    <?php
    $options = array('M' => 'Male', 'F' => 'Female');
    echo $this->Form->select('gender', $options, null, array('escape' => false));
    ?>

submit
~~~~~~

``submit(string $caption, array $options)``

Creates a submit button with caption ``$caption``. If the supplied
``$caption`` is a URL to an image (it contains a ‘.’ character),
the submit button will be rendered as an image.

It is enclosed between ``div`` tags by default; you can avoid this
by declaring ``$options['div'] = false``.

::

    <?php
    echo $this->Form->submit();
    ?>

Will output:

::

    <div class="submit"><input value="Submit" type="submit"></div>

You can also pass a relative or absolute url to an image for the
caption parameter instead of caption text.

::

    <?php
    echo $this->Form->submit('ok.png');
    ?>

Will output:

::

    <div class="submit"><input type="image" src="/img/ok.png"></div>

text
~~~~

``text(string $fieldName, array $options)``

Creates a text input field.

::

    <?php
    echo $this->Form->text('first_name');
    ?>

Will output:

::

    <input name="data[User][first_name]" value="" id="UserFirstName" type="text">

textarea
~~~~~~~~

``textarea(string $fieldName, array $options)``

Creates a textarea input field.

::

    <?php
    echo $this->Form->textarea('notes');
    ?>

Will output:

::

    <textarea name="data[User][notes]" id="UserNotes"></textarea>

The ``textarea`` input type allows for the ``$options`` attribute
of ``'escape'`` which determines whether or not the contents of the
textarea should be escaped. Defaults to ``true``.
::

    <?php
    echo $this->Form->textarea('notes', array('escape' => false);
    // OR....
    echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false);
    ?>

7.3.5 Form Element-Specific Methods
-----------------------------------

The rest of the methods available in the FormHelper are for
creating specific form elements. Many of these methods also make
use of a special $options parameter. In this case, however,
$options is used primarily to specify HTML tag attributes (such as
the value or DOM id of an element in the form).

::

    <?php echo $this->Form->text('username', array('class' => 'users')); ?>

Will output:

::

     
    <input name="data[User][username]" type="text" class="users" id="UserUsername" />

checkbox
~~~~~~~~

``checkbox(string $fieldName, array $options)``

Creates a checkbox form element. This method also generates an
associated hidden form input to force the submission of data for
the specified field.

::

    <?php echo $this->Form->checkbox('done'); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

It is possible to specify the value of the checkbox by using the
$options array:

::

    <?php echo $this->Form->checkbox('done', array('value' => 555)); ?>

Will output:

::

    <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
    <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

If you don't want the Form helper to create a hidden input:

::

    <?php echo $this->Form->checkbox('done', array('hiddenField' => false)); ?>

Will output:

::

    <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

button
~~~~~~

``button(string $title, array $options = array())``

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
    echo $this->Form->button('Another Button', array('type'=>'button'));
    echo $this->Form->button('Reset the Form', array('type'=>'reset'));
    echo $this->Form->button('Submit Form', array('type'=>'submit'));
    ?>

Will output:

::

    <button type="submit">A Button</button>
    <button type="button">Another Button</button>
    <button type="reset">Reset the Form</button>
    <button type="submit">Submit Form</button>

The ``button`` input type allows for a special ``$option``
attribute called ``'escape'`` which accepts a bool and determines
whether to HTML entity encode the $title of the button. Defaults to
false.

::

    <?php 
        echo $this->Form->button('Submit Form', array('type'=>'submit','escape'=>true));
    ?>

year
~~~~

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes)``

Creates a select element populated with the years from ``$minYear``
to ``$maxYear``, with the $selected year selected by default. HTML
attributes may be supplied in $attributes. If
``$attributes['empty']`` is false, the select will not include an
empty option.

::

    <?php
    echo $this->Form->year('purchased',2000,date('Y'));
    ?>

Will output:

::

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

month
~~~~~

``month(string $fieldName, mixed $selected, array $attributes)``

Creates a select element populated with month names.

::

    <?php
    echo $this->Form->month('mob');
    ?>

Will output:

::

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
can be translated using localization.)

::

    <?php
    echo $this->Form->month('mob', null, array('monthNames' => false));
    ?>

dateTime
~~~~~~~~

``dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $selected = null, $attributes = array())``

Creates a set of select inputs for date and time. Valid values for
$dateformat are ‘DMY’, ‘MDY’, ‘YMD’ or ‘NONE’. Valid values for
$timeFormat are ‘12’, ‘24’, and null.

You can specify not to display empty values by setting
"array('empty' => false)" in the attributes parameter. You also can
pre-select the current datetime by setting $selected = null and
$attributes = array("empty" => false).

day
~~~

``day(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the (numerical) days of the
month.

To create an empty option with prompt text of your choosing (e.g.
the first option is 'Day'), you can supply the text as the final
parameter as follows:

::

    <?php
    echo $this->Form->day('created');
    ?>

Will output:

::

    <select name="data[User][created][day]" id="UserCreatedDay">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

hour
~~~~

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the hours of the day.

minute
~~~~~~

``minute(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with the minutes of the hour.

meridian
~~~~~~~~

``meridian(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Creates a select element populated with ‘am’ and ‘pm’.

error
~~~~~

``error(string $fieldName, mixed $text, array $options)``

Shows a validation error message, specified by $text, for the given
field, in the event that a validation error has occurred.

Options:


-  'escape' bool Whether or not to html escape the contents of the
   error.
-  'wrap' mixed Whether or not the error message should be wrapped
   in a div. If a string, will be used as the HTML tag to use.
-  'class' string The classname for the error message

file
~~~~

``file(string $fieldName, array $options)``

Creates a file input.

::

    <?php
    echo $this->Form->create('User',array('type'=>'file'));
    echo $this->Form->file('avatar');
    ?>

Will output:

::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

When using ``$this->Form->file()``, remember to set the form
encoding-type, by setting the type option to 'file' in
``$this->Form->create()``
hidden
~~~~~~

``hidden(string $fieldName, array $options)``

Creates a hidden form input. Example:

::

    <?php
    echo $this->Form->hidden('id');
    ?>

Will output:

::

    <input name="data[User][id]" value="10" id="UserId" type="hidden">

isFieldError
~~~~~~~~~~~~

``isFieldError(string $fieldName)``

Returns true if the supplied $fieldName has an active validation
error.

::

    <?php
    if ($this->Form->isFieldError('gender')){
        echo $this->Form->error('gender');
    }
    ?>

When using ``$this->Form->input()``, errors are rendered by
default.
label
~~~~~

``label(string $fieldName, string $text, array $attributes)``

Creates a label tag, populated with $text.

::

    <?php
    echo $this->Form->label('status');
    ?>

Will output:

::

    <label for="UserStatus">Status</label>

password
~~~~~~~~

``password(string $fieldName, array $options)``

Creates a password field.

::

    <?php
    echo $this->Form->password('password');
    ?>

Will output:

::

    <input name="data[User][password]" value="" id="UserPassword" type="password">

radio
~~~~~

``radio(string $fieldName, array $options, array $attributes)``

Creates a radio button input. Use ``$attributes['value']`` to set
which value should be selected default.

Use ``$attributes['separator']`` to specify HTML in between radio
buttons (e.g. <br />).

Radio elements are wrapped with a label and fieldset by default.
Set ``$attributes['legend']`` to false to remove them.

::

    <?php
    $options=array('M'=>'Male','F'=>'Female');
    $attributes=array('legend'=>false);
    echo $this->Form->radio('gender',$options,$attributes);
    ?>

Will output:

::

    <input name="data[User][gender]" id="UserGender_" value="" type="hidden">
    <input name="data[User][gender]" id="UserGenderM" value="M" type="radio">
    <label for="UserGenderM">Male</label>
    <input name="data[User][gender]" id="UserGenderF" value="F" type="radio">
    <label for="UserGenderF">Female</label>

If for some reason you don't want the hidden input, setting
``$attributes['value']`` to a selected value or boolean false will
do just that.

select
~~~~~~

``select(string $fieldName, array $options, mixed $selected, array $attributes)``

Creates a select element, populated with the items in ``$options``,
with the option specified by ``$selected`` shown as selected by
default. If you wish to display your own default option, add your
string value to the 'empty' key in the ``$attributes`` variable, or
set it to false to turn off the default empty option

::

    <?php
    $options = array('M' => 'Male', 'F' => 'Female');
    echo $this->Form->select('gender', $options)
    ?>

Will output:

::

    <select name="data[User][gender]" id="UserGender">
    <option value=""></option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    </select>

The ``select`` input type allows for a special ``$option``
attribute called ``'escape'`` which accepts a bool and determines
whether to HTML entity encode the contents of the select options.
Defaults to true.

::

    <?php
    $options = array('M' => 'Male', 'F' => 'Female');
    echo $this->Form->select('gender', $options, null, array('escape' => false));
    ?>

submit
~~~~~~

``submit(string $caption, array $options)``

Creates a submit button with caption ``$caption``. If the supplied
``$caption`` is a URL to an image (it contains a ‘.’ character),
the submit button will be rendered as an image.

It is enclosed between ``div`` tags by default; you can avoid this
by declaring ``$options['div'] = false``.

::

    <?php
    echo $this->Form->submit();
    ?>

Will output:

::

    <div class="submit"><input value="Submit" type="submit"></div>

You can also pass a relative or absolute url to an image for the
caption parameter instead of caption text.

::

    <?php
    echo $this->Form->submit('ok.png');
    ?>

Will output:

::

    <div class="submit"><input type="image" src="/img/ok.png"></div>

text
~~~~

``text(string $fieldName, array $options)``

Creates a text input field.

::

    <?php
    echo $this->Form->text('first_name');
    ?>

Will output:

::

    <input name="data[User][first_name]" value="" id="UserFirstName" type="text">

textarea
~~~~~~~~

``textarea(string $fieldName, array $options)``

Creates a textarea input field.

::

    <?php
    echo $this->Form->textarea('notes');
    ?>

Will output:

::

    <textarea name="data[User][notes]" id="UserNotes"></textarea>

The ``textarea`` input type allows for the ``$options`` attribute
of ``'escape'`` which determines whether or not the contents of the
textarea should be escaped. Defaults to ``true``.
::

    <?php
    echo $this->Form->textarea('notes', array('escape' => false);
    // OR....
    echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false);
    ?>
