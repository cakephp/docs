# FormHelper

`class` **FormHelper**(View $view, array $settings = array())

The FormHelper does most of the heavy lifting in form creation.
The FormHelper focuses on creating forms quickly, in a way that
will streamline validation, re-population and layout. The
FormHelper is also flexible - it will do almost everything for
you using conventions, or you can use specific methods to get
only what you need.

## Creating Forms

The first method you'll need to use in order to take advantage of
the FormHelper is `create()`. This special method outputs an
opening form tag.

`method` FormHelper::**create**(string $model = null, array $options = array())

### Options for create()

There are a number of options for create():

- `$options['type']` This key is used to specify the type of form to be created. Valid
  values include 'post', 'get', 'file', 'put' and 'delete'.

  Supplying either 'post' or 'get' changes the form submission method
  accordingly:

  ``` php
  echo $this->Form->create('User', array('type' => 'get'));
  ```

  Output:

  ``` html
  <form id="UserAddForm" method="get" action="/users/add">
  ```

  Specifying 'file' changes the form submission method to 'post', and
  includes an enctype of "multipart/form-data" on the form tag. This
  is to be used if there are any file elements inside the form. The
  absence of the proper enctype attribute will cause the file uploads
  not to function:

  ``` php
  echo $this->Form->create('User', array('type' => 'file'));
  ```

  Output:

  ``` html
  <form id="UserAddForm" enctype="multipart/form-data"
     method="post" action="/users/add">
  ```

  When using 'put' or 'delete', your form will be functionally
  equivalent to a 'post' form, but when submitted, the HTTP request
  method will be overridden with 'PUT' or 'DELETE', respectively.
  This allows CakePHP to emulate proper REST support in web
  browsers.

- `$options['action']` The action key allows you to point the form to a
  specific action in your current controller. For example, if you'd like to
  point the form to the login() action of the current controller, you would
  supply an \$options array like the following:

  ``` php
  echo $this->Form->create('User', array('action' => 'login'));
  ```

  Output:

  ``` html
  <form id="UserLoginForm" method="post" action="/users/login">
  ```

  <div class="deprecated">

  2.8.0
  The `$options['action']` option was deprecated as of 2.8.0.
  Use the `$options['url']` and `$options['id']` options instead.

  </div>

- `$options['url']` If the desired form action isn't in the current
  controller, you can specify a URL for the form action using the 'url' key of
  the \$options array. The supplied URL can be relative to your CakePHP
  application:

  ``` php
  echo $this->Form->create(false, array(
      'url' => array('controller' => 'recipes', 'action' => 'add'),
      'id' => 'RecipesAdd'
  ));
  ```

  Output:

  ``` html
  <form method="post" action="/recipes/add">
  ```

  or can point to an external domain:

  ``` php
  echo $this->Form->create(false, array(
      'url' => 'https://www.google.com/search',
      'type' => 'get'
  ));
  ```

  Output:

  ``` html
  <form method="get" action="https://www.google.com/search">
  ```

  Also check `HtmlHelper::url()` method for more examples of
  different types of URLs.

  ::: info Changed in version 2.8.0
  Use `'url' => false` if you don’t want to output a URL as the form action.
  :::

- `$options['default']` If 'default' has been set to boolean false, the form's
  submit action is changed so that pressing the submit button does not submit
  the form. If the form is meant to be submitted via AJAX, setting 'default' to
  false suppresses the form's default behavior so you can grab the data and
  submit it via AJAX instead.

- `$options['inputDefaults']` You can declare a set of default options for
  `input()` with the `inputDefaults` key to customize your default input
  creation:

  ``` php
  echo $this->Form->create('User', array(
      'inputDefaults' => array(
          'label' => false,
          'div' => false
      )
  ));
  ```

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call:

  ``` php
  echo $this->Form->input('password'); // No div, no label
  // has a label element
  echo $this->Form->input(
      'username',
      array('label' => 'Username')
  );
  ```

## Closing the Form

`method` FormHelper::**end**($options = null, $secureAttributes = array())

<a id="automagic-form-elements"></a>

## Creating form elements

There are a few ways to create form inputs with the FormHelper. We'll start by
looking at `input()`. This method will automatically inspect the model field it
has been supplied in order to create an appropriate input for that
field. Internally `input()` delegates to other methods in FormHelper.

`method` FormHelper::**input**(string $fieldName, array $options = array())

`method` FormHelper::**inputs**(mixed $fields = null, array $blacklist = null, $options = array())

### Field naming conventions

The Form helper is pretty smart. Whenever you specify a field name
with the form helper methods, it'll automatically use the current
model name to build an input with a format like the following:

``` html
<input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">
```

This allows you to omit the model name when generating inputs for the model that
the form was created for. You can create inputs for associated models, or
arbitrary models by passing in Modelname.fieldname as the first parameter:

``` php
echo $this->Form->input('Modelname.fieldname');
```

If you need to specify multiple fields using the same field name,
thus creating an array that can be saved in one shot with
saveAll(), use the following convention:

``` php
echo $this->Form->input('Modelname.0.fieldname');
echo $this->Form->input('Modelname.1.fieldname');
```

Output:

``` html
<input type="text" id="Modelname0Fieldname"
    name="data[Modelname][0][fieldname]">
<input type="text" id="Modelname1Fieldname"
    name="data[Modelname][1][fieldname]">
```

FormHelper uses several field-suffixes internally for datetime input creation.
If you are using fields named `year`, `month`, `day`, `hour`,
`minute`, or `meridian` and having issues getting the correct input, you can
set the `name` attribute to override the default behavior:

``` php
echo $this->Form->input('Model.year', array(
    'type' => 'text',
    'name' => 'data[Model][year]'
));
```

### Options

`FormHelper::input()` supports a large number of options. In addition to its
own options `input()` accepts options for the generated input types, as well as
HTML attributes. The following will cover the options specific to
`FormHelper::input()`.

- `$options['type']` You can force the type of an input, overriding model
  introspection, by specifying a type. In addition to the field types found in
  the [Automagic Form Elements](#automagic-form-elements), you can also create 'file', 'password',
  and any type supported by HTML5:

  ``` php
  echo $this->Form->input('field', array('type' => 'file'));
  echo $this->Form->input('email', array('type' => 'email'));
  ```

  Output:

  ``` html
  <div class="input file">
      <label for="UserField">Field</label>
      <input type="file" name="data[User][field]" value="" id="UserField" />
  </div>
  <div class="input email">
      <label for="UserEmail">Email</label>
      <input type="email" name="data[User][email]" value="" id="UserEmail" />
  </div>
  ```

- `$options['div']` Use this option to set attributes of the input's
  containing div. Using a string value will set the div's class name. An array
  will set the div's attributes to those specified by the array's keys/values.
  Alternatively, you can set this key to false to disable the output of the div.

  Setting the class name:

  ``` php
  echo $this->Form->input('User.name', array(
      'div' => 'class_name'
  ));
  ```

  Output:

  ``` html
  <div class="class_name">
      <label for="UserName">Name</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  Setting multiple attributes:

  ``` php
  echo $this->Form->input('User.name', array(
      'div' => array(
          'id' => 'mainDiv',
          'title' => 'Div Title',
          'style' => 'display:block'
      )
  ));
  ```

  Output:

  ``` html
  <div class="input text" id="mainDiv" title="Div Title"
      style="display:block">
      <label for="UserName">Name</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  Disabling div output:

  ``` php
  echo $this->Form->input('User.name', array('div' => false)); ?>
  ```

  Output:

  ``` html
  <label for="UserName">Name</label>
  <input name="data[User][name]" type="text" value="" id="UserName" />
  ```

- `$options['label']` Set this key to the string you would like to be
  displayed within the label that usually accompanies the input:

  ``` php
  echo $this->Form->input('User.name', array(
      'label' => 'The User Alias'
  ));
  ```

  Output:

  ``` html
  <div class="input">
      <label for="UserName">The User Alias</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  Alternatively, set this key to false to disable the output of the
  label:

  ``` php
  echo $this->Form->input('User.name', array('label' => false));
  ```

  Output:

  ``` html
  <div class="input">
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

  Set this to an array to provide additional options for the
  `label` element. If you do this, you can use a `text` key in
  the array to customize the label text:

  ``` php
  echo $this->Form->input('User.name', array(
      'label' => array(
          'class' => 'thingy',
          'text' => 'The User Alias'
      )
  ));
  ```

  Output:

  ``` html
  <div class="input">
      <label for="UserName" class="thingy">The User Alias</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />
  </div>
  ```

- `$options['error']` Using this key allows you to override the default model
  error messages and can be used, for example, to set i18n messages. It has a
  number of suboptions which control the wrapping element, wrapping element
  class name, and whether HTML in the error message will be escaped.

  To disable error message output & field classes set the error key to false:

  ``` php
  $this->Form->input('Model.field', array('error' => false));
  ```

  To disable only the error message, but retain the field classes, set the
  errorMessage key to false:

  ``` php
  $this->Form->input('Model.field', array('errorMessage' => false));
  ```

  To modify the wrapping element type and its class, use the
  following format:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array(
          'attributes' => array('wrap' => 'span', 'class' => 'bzzz')
      )
  ));
  ```

  To prevent HTML being automatically escaped in the error message
  output, set the escape suboption to false:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array(
          'attributes' => array('escape' => false)
      )
  ));
  ```

  To override the model error messages use an array with
  the keys matching the validation rule names:

  ``` php
  $this->Form->input('Model.field', array(
      'error' => array('tooShort' => __('This is not long enough'))
  ));
  ```

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

  ::: info Added in version 2.3
  Support for the `errorMessage` option was added in 2.3
  :::

- `$options['before']`, `$options['between']`, `$options['separator']`,
  and `$options['after']`

  Use these keys if you need to inject some markup inside the output
  of the input() method:

  ``` php
  echo $this->Form->input('field', array(
      'before' => '--before--',
      'after' => '--after--',
      'between' => '--between---'
  ));
  ```

  Output:

  ``` html
  <div class="input">
  --before--
  <label for="UserField">Field</label>
  --between---
  <input name="data[User][field]" type="text" value="" id="UserField" />
  --after--
  </div>
  ```

  For radio inputs the 'separator' attribute can be used to
  inject markup to separate each input/label pair:

  ``` php
  echo $this->Form->input('field', array(
      'before' => '--before--',
      'after' => '--after--',
      'between' => '--between---',
      'separator' => '--separator--',
      'options' => array('1', '2'),
      'type' => 'radio'
  ));
  ```

  Output:

  ``` html
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
  ```

  For `date` and `datetime` type elements the 'separator'
  attribute can be used to change the string between select elements.
  Defaults to '-'.

- `$options['format']` The ordering of the HTML generated by FormHelper is
  controllable as well. The 'format' options supports an array of strings
  describing the template you would like said element to follow. The supported
  array keys are:
  `array('before', 'input', 'between', 'label', 'after','error')`.

- `$options['inputDefaults']` If you find yourself repeating the same options
  in multiple input() calls, you can use <span class="title-ref">inputDefaults</span>\` to keep your code dry:

  ``` php
  echo $this->Form->create('User', array(
      'inputDefaults' => array(
          'label' => false,
          'div' => false
      )
  ));
  ```

  All inputs created from that point forward would inherit the
  options declared in inputDefaults. You can override the
  defaultOptions by declaring the option in the input() call:

  ``` php
  // No div, no label
  echo $this->Form->input('password');

  // has a label element
  echo $this->Form->input('username', array('label' => 'Username'));
  ```

  If you need to later change the defaults you can use
  `FormHelper::inputDefaults()`.

- `$options['maxlength']` Set this key to set the `maxlength` attribute of the `input`
  field to a specific value. When this key is omitted and the input-type is `text`,
  `textarea`, `email`, `tel`, `url` or `search` and the field-definition is not
  one of `decimal`, `time` or `datetime`, the length option of the database field is
  used.

### GET Form Inputs

When using `FormHelper` to generate inputs for `GET` forms, the input names
will automatically be shortened to provide more human friendly names. For
example:

``` php
// Makes <input name="email" type="text" />
echo $this->Form->input('User.email');

// Makes <select name="Tags" multiple="multiple">
echo $this->Form->input('Tags.Tags', array('multiple' => true));
```

If you want to override the generated name attributes you can use the `name`
option:

``` php
// Makes the more typical <input name="data[User][email]" type="text" />
echo $this->Form->input('User.email', array('name' => 'data[User][email]'));
```

## Generating specific types of inputs

In addition to the generic `input()` method, `FormHelper` has specific
methods for generating a number of different types of inputs. These can be used
to generate just the input widget itself, and combined with other methods like
`~FormHelper::label()` and `~FormHelper::error()` to
generate fully custom form layouts.

<a id="general-input-options"></a>

### Common options

Many of the various input element methods support a common set of options. All
of these options are also supported by `input()`. To reduce repetition the
common options shared by all input methods are as follows:

- `$options['class']` You can set the class name for an input:

  ``` php
  echo $this->Form->input('title', array('class' => 'custom-class'));
  ```

- `$options['id']` Set this key to force the value of the DOM id for the input.

- `$options['default']` Used to set a default value for the input field. The
  value is used if the data passed to the form does not contain a value for the
  field (or if no data is passed at all).

  Example usage:

  ``` php
  echo $this->Form->input('ingredient', array('default' => 'Sugar'));
  ```

  Example with select field (Size "Medium" will be selected as
  default):

  ``` php
  $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
  echo $this->Form->input(
      'size',
      array('options' => $sizes, 'default' => 'm')
  );
  ```

  > [!NOTE]
  > You cannot use `default` to check a checkbox - instead you might
  > set the value in `$this->request->data` in your controller,
  > or set the input option `checked` to true.
  >
  > Date and datetime fields' default values can be set by using the
  > 'selected' key.
  >
  > Beware of using false to assign a default value. A false value is used to
  > disable/exclude options of an input field, so `'default' => false` would
  > not set any value at all. Instead use `'default' => 0`.

In addition to the above options, you can mixin any HTML attribute you wish to
use. Any non-special option name will be treated as an HTML attribute, and
applied to the generated HTML input element.

### Options for select, checkbox and radio inputs

- `$options['selected']` Used in combination with a select-type input (i.e.
  For types select, date, time, datetime). Set 'selected' to the value of the
  item you wish to be selected by default when the input is rendered:

  ``` php
  echo $this->Form->input('close_time', array(
      'type' => 'time',
      'selected' => '13:30:00'
  ));
  ```

  > [!NOTE]
  > The selected key for date and datetime inputs may also be a UNIX
  > timestamp.

- `$options['empty']` If set to true, forces the input to remain empty.

  When passed to a select list, this creates a blank option with an
  empty value in your drop down list. If you want to have a empty
  value with text displayed instead of just a blank option, pass in a
  string to empty:

  ``` php
  echo $this->Form->input('field', array(
      'options' => array(1, 2, 3, 4, 5),
      'empty' => '(choose one)'
  ));
  ```

  Output:

  ``` html
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
  ```

  > [!NOTE]
  > If you need to set the default value in a password field to blank,
  > use 'value' =\> '' instead.

  A list of key-value pairs can be supplied for a date or datetime field:

  ``` php
  echo $this->Form->dateTime('Contact.date', 'DMY', '12',
      array(
          'empty' => array(
              'day' => 'DAY', 'month' => 'MONTH', 'year' => 'YEAR',
              'hour' => 'HOUR', 'minute' => 'MINUTE', 'meridian' => false
          )
      )
  );
  ```

  Output:

  ``` html
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
  ```

- `$options['hiddenField']` For certain input types (checkboxes, radios) a
  hidden input is created so that the key in \$this-\>request-\>data will exist
  even without a value specified:

  ``` html
  <input type="hidden" name="data[Post][Published]" id="PostPublished_"
      value="0" />
  <input type="checkbox" name="data[Post][Published]" value="1"
      id="PostPublished" />
  ```

  This can be disabled by setting the `$options['hiddenField'] = false`:

  ``` php
  echo $this->Form->checkbox('published', array('hiddenField' => false));
  ```

  Which outputs:

  ``` html
  <input type="checkbox" name="data[Post][Published]" value="1"
      id="PostPublished" />
  ```

  If you want to create multiple blocks of inputs on a form that are
  all grouped together, you should use this parameter on all inputs
  except the first. If the hidden input is on the page in multiple
  places, only the last group of input's values will be saved

  In this example, only the tertiary colors would be passed, and the
  primary colors would be overridden:

  ``` html
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
  ```

  Disabling the `'hiddenField'` on the second input group would
  prevent this behavior.

  You can set a different hidden field value other than 0 such as 'N':

  ``` php
  echo $this->Form->checkbox('published', array(
      'value' => 'Y',
      'hiddenField' => 'N',
  ));
  ```

### Datetime options

- `$options['timeFormat']` Used to specify the format of the select inputs for
  a time-related set of inputs. Valid values include `12`, `24`, and `null`.

- `$options['dateFormat']` Used to specify the format of the select inputs for
  a date-related set of inputs. Valid values include any combination of 'D',
  'M' and 'Y' or `null`. The inputs will be put in the order defined by the
  dateFormat option.

- `$options['minYear'], $options['maxYear']` Used in combination with a
  date/datetime input. Defines the lower and/or upper end of values shown in the
  years select field.

- `$options['orderYear']` Used in combination with a date/datetime input.
  Defines the order in which the year values will be set. Valid values include
  'asc', 'desc'. The default value is 'desc'.

- `$options['interval']` This option specifies the number of minutes between
  each option in the minutes select box:

  ``` php
  echo $this->Form->input('Model.time', array(
      'type' => 'time',
      'interval' => 15
  ));
  ```

  Would create 4 options in the minute select. One for each 15
  minutes.

- `$options['round']` Can be set to <span class="title-ref">up</span> or <span class="title-ref">down</span> to force rounding in either direction.
  Defaults to null which rounds half up according to <span class="title-ref">interval</span>.

  ::: info Added in version 2.4
  :::

## Form Element-Specific Methods

All elements are created under a form for the `User` model as in the examples above.
For this reason, the HTML code generated will contain attributes that reference to the User model.
Ex: name=data\[User\]\[username\], id=UserUsername

`method` FormHelper::**label**(string $fieldName, string $text, array $options)

`method` FormHelper::**text**(string $name, array $options)

`method` FormHelper::**password**(string $fieldName, array $options)

`method` FormHelper::**hidden**(string $fieldName, array $options)

`method` FormHelper::**textarea**(string $fieldName, array $options)

`method` FormHelper::**checkbox**(string $fieldName, array $options)

`method` FormHelper::**radio**(string $fieldName, array $options, array $attributes)

`method` FormHelper::**select**(string $fieldName, array $options, array $attributes)

`method` FormHelper::**file**(string $fieldName, array $options)

### Validating Uploads

Below is an example validation method you could define in your
model to validate whether a file has been successfully uploaded:

``` php
public function isUploadedFile($params) {
    $val = array_shift($params);
    if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
    ) {
        return is_uploaded_file($val['tmp_name']);
    }
    return false;
}
```

Creates a file input:

``` php
echo $this->Form->create('User', array('type' => 'file'));
echo $this->Form->file('avatar');
```

Will output:

``` html
<form enctype="multipart/form-data" method="post" action="/users/add">
<input name="data[User][avatar]" value="" id="UserAvatar" type="file">
```

> [!NOTE]
> When using `$this->Form->file()`, remember to set the form
> encoding-type, by setting the type option to 'file' in
> `$this->Form->create()`

## Creating buttons and submit elements

`method` FormHelper::**submit**(string $caption, array $options)

`method` FormHelper::**button**(string $title, array $options = array())

`method` FormHelper::**postButton**(string $title, mixed $url, array $options = array ())

`method` FormHelper::**postLink**(string $title, mixed $url = null, array $options = array ())

## Creating date and time inputs

`method` FormHelper::**dateTime**($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

`method` FormHelper::**year**(string $fieldName, int $minYear, int $maxYear, array $attributes)

`method` FormHelper::**month**(string $fieldName, array $attributes)

`method` FormHelper::**day**(string $fieldName, array $attributes)

`method` FormHelper::**hour**(string $fieldName, boolean $format24Hours, array $attributes)

`method` FormHelper::**minute**(string $fieldName, array $attributes)

`method` FormHelper::**meridian**(string $fieldName, array $attributes)

## Displaying and checking errors

`method` FormHelper::**error**(string $fieldName, mixed $text, array $options)

`method` FormHelper::**isFieldError**(string $fieldName)

`method` FormHelper::**tagIsInvalid**()

## Setting Defaults for all fields

::: info Added in version 2.2
:::

You can declare a set of default options for `input()` using
`FormHelper::inputDefaults()`. Changing the default options allows
you to consolidate repeated options into a single method call:

``` php
$this->Form->inputDefaults(array(
        'label' => false,
        'div' => false,
        'class' => 'fancy'
    )
);
```

All inputs created from that point forward will inherit the options declared in
inputDefaults. You can override the default options by declaring the option in the
input() call:

``` php
echo $this->Form->input('password'); // No div, no label with class 'fancy'
// has a label element same defaults
echo $this->Form->input(
    'username',
    array('label' => 'Username')
);
```

## Working with SecurityComponent

`SecurityComponent` offers several features that make your forms safer
and more secure. By simply including the `SecurityComponent` in your
controller, you'll automatically benefit from CSRF and form tampering features.

As mentioned previously when using SecurityComponent, you should always close
your forms using `FormHelper::end()`. This will ensure that the
special `_Token` inputs are generated.

`method` FormHelper::**unlockField**($name)

`method` FormHelper::**secure**(array $fields = array())

<a id="form-improvements-1-3"></a>

## 2.0 updates

**\$selected parameter removed**

The `$selected` parameter was removed from several methods in
FormHelper. All methods now support a `$attributes['value']` key
now which should be used in place of `$selected`. This change
simplifies the FormHelper methods, reducing the number of
arguments, and reduces the duplication that `$selected` created.
The effected methods are:

- FormHelper::select()
- FormHelper::dateTime()
- FormHelper::year()
- FormHelper::month()
- FormHelper::day()
- FormHelper::hour()
- FormHelper::minute()
- FormHelper::meridian()

**Default URLs on forms is the current action**

The default URL for all forms, is now the current URL including
passed, named, and querystring parameters. You can override
this default by supplying `$options['url']` in the second
parameter of `$this->Form->create()`

**FormHelper::hidden()**

Hidden fields no longer remove the class attribute. This means
that if there are validation errors on hidden fields,
the error-field class name will be applied.
