# Validation

The validation package in CakePHP provides features to build validators that can
validate arbitrary arrays of data with ease. You can find a [list of available
Validation rules in the API](https://api.cakephp.org/5.x/class-Cake.Validation.Validation.html).

<a id="creating-validators"></a>

## Creating Validators

`class` Cake\\Validation\\**Validator**

Validator objects define the rules that apply to a set of fields.
Validator objects contain a mapping between fields and validation sets. In
turn, the validation sets contain a collection of rules that apply to the field
they are attached to. Creating a validator is simple:

``` php
use Cake\Validation\Validator;

$validator = new Validator();
```

Once created, you can start defining sets of rules for the fields you want to
validate:

``` php
$validator
    ->requirePresence('title')
    ->notEmptyString('title', 'Please fill this field')
    ->add('title', [
        'length' => [
            'rule' => ['minLength', 10],
            'message' => 'Titles need to be at least 10 characters long',
        ]
    ])
    ->allowEmptyDateTime('published')
    ->add('published', 'boolean', [
        'rule' => 'boolean',
    ])
    ->requirePresence('body')
    ->add('body', 'length', [
        'rule' => ['minLength', 50],
        'message' => 'Articles must have a substantial body.',
    ]);
```

As seen in the example above, validators are built with a fluent interface that
allows you to define rules for each field you want to validate.

There were a few methods called in the example above, so let's go over the
various features. The `add()` method allows you to add new rules to
a validator. You can either add rules individually or in groups as seen above.

### Requiring Field Presence

The `requirePresence()` method requires the field to be present in any
validated array. If the field is absent, validation will fail. The
`requirePresence()` method has 4 modes:

- `true` The field's presence is always required.
- `false` The field's presence is not required.
- `create` The field's presence is required when validating a **create**
  operation.
- `update` The field's presence is required when validating an **update**
  operation.

By default, `true` is used. Key presence is checked by using
`array_key_exists()` so that null values will count as present. You can set
the mode using the second parameter:

``` php
$validator->requirePresence('author_id', 'create');
```

If you have multiple fields that are required, you can define them as a list:

``` php
// Define multiple fields for create
$validator->requirePresence(['author_id', 'title'], 'create');

// Define multiple fields for mixed modes
$validator->requirePresence([
    'author_id' => [
        'mode' => 'create',
        'message' => 'An author is required.',
    ],
    'published' => [
        'mode' => 'update',
        'message' => 'The published state is required.',
    ],
]);
```

### Allowing Empty Fields

Validators offer several methods to control which fields accept empty values and
which empty values are accepted and not forwarded to other validation rules for
the named field. CakePHP provides empty value support for different shapes
of data:

1.  `allowEmptyString()` Should be used when you want to only accept
    an empty string.
2.  `allowEmptyArray()` Should be used when you want to accept an array.
3.  `allowEmptyDate()` Should be used when you want to accept an empty string,
    or an array that is marshalled into a date field.
4.  `allowEmptyTime()` Should be used when you want to accept an empty string,
    or an array that is marshalled into a time field.
5.  `allowEmptyDateTime()` Should be used when you want to accept an empty
    string or an array that is marshalled into a datetime or timestamp field.
6.  `allowEmptyFile()` Should be used when you want to accept an array that
    contains an empty uploaded file.

You also can use following specific validators: `notEmptyString()`, `notEmptyArray()`, `notEmptyFile()`, `notEmptyDate()`, `notEmptyTime()`, `notEmptyDateTime()`.

The `allowEmpty*` methods support a `when` parameter that allows you to control
when a field can or cannot be empty:

- `false` The field is not allowed to be empty.
- `create` The field can be empty when validating a **create**
  operation.
- `update` The field can be empty when validating an **update**
  operation.
- A callback that returns `true` or `false` to indicate whether a field is
  allowed to be empty. See the [Conditional Validation](#conditional-validation) section for examples on
  how to use this parameter.

An example of these methods in action is:

``` php
$validator->allowEmptyDateTime('published')
    ->allowEmptyString('title', 'Title cannot be empty', false)
    ->allowEmptyString('body', 'Body cannot be empty', 'update')
    ->allowEmptyFile('header_image', 'update');
    ->allowEmptyDateTime('posted', 'update');
```

### Adding Validation Rules

The `Validator` class provides methods that make building validators simple
and expressive. For example adding validation rules to a username could look
like:

``` php
$validator = new Validator();
$validator
    ->email('username')
    ->ascii('username')
    ->lengthBetween('username', [4, 8]);
```

See the [Validator API documentation](https://api.cakephp.org/5.x/class-Cake.Validation.Validator.html) for the
full set of validator methods.

<a id="custom-validation-rules"></a>

### Using Custom Validation Rules

In addition to using methods on the `Validator`, and coming from providers, you
can also use any callable, including anonymous functions, as validation rules:

``` php
// Use a global function
$validator->add('title', 'custom', [
    'rule' => 'validate_title',
    'message' => 'The title is not valid'
]);

// Use an array callable that is not in a provider
$validator->add('title', 'custom', [
    'rule' => [$this, 'method'],
    'message' => 'The title is not valid'
]);

// Use a closure
$extra = 'Some additional value needed inside the closure';
$validator->add('title', 'custom', [
    'rule' => function ($value, $context) use ($extra) {
        // Custom logic that returns true/false
    },
    'message' => 'The title is not valid'
]);

// Use a rule from a custom provider
$validator->add('title', 'custom', [
    'rule' => 'customRule',
    'provider' => 'custom',
    'message' => 'The title is not unique enough'
]);
```

Closures or callable methods will receive 2 arguments when called. The first
will be the value for the field being validated. The second is a context array
containing data related to the validation process:

- **data**: The original data passed to the validation method, useful if you
  plan to create rules comparing values.
- **providers**: The complete list of rule provider objects, useful if you
  need to create complex rules by calling multiple providers.
- **newRecord**: Whether the validation call is for a new record or
  a preexisting one.
- **entity**: The entity being validated if provided to `validate()`.

Closures should return boolean true if the validation passes. If it fails,
return boolean false or for a custom error message return a string, see the
[Conditional/Dynamic Error Messages](#dynamic_validation_error_messages)
section for further details.

::: info Changed in version 5.3.0
The `entity` key was added to validation context.
:::

<a id="dynamic_validation_error_messages"></a>

### Conditional/Dynamic Error Messages

Validation rule methods, being it [custom callables](#custom-validation-rules),
or [methods supplied by providers](#adding-validation-providers), can either
return a boolean, indicating whether the validation succeeded, or they can return
a string, which means that the validation failed, and that the returned string
should be used as the error message.

Possible existing error messages defined via the `message` option will be
overwritten by the ones returned from the validation rule method:

``` php
$validator->add('length', 'custom', [
    'rule' => function ($value, $context) {
        if (!$value) {
            return false;
        }

        if ($value < 10) {
            return 'Error message when value is less than 10';
        }

        if ($value > 20) {
            return 'Error message when value is greater than 20';
        }

        return true;
    },
    'message' => 'Generic error message used when `false` is returned'
]);
```

<a id="conditional-validation"></a>

### Conditional Validation

When defining validation rules, you can use the `on` key to define when
a validation rule should be applied. If left undefined, the rule will always be
applied. Other valid values are `create` and `update`. Using one of these
values will make the rule apply to only create or update operations.

Additionally, you can provide a callable function that will determine whether or
not a particular rule should be applied:

``` php
$validator->add('picture', 'file', [
    'rule' => ['mimeType', ['image/jpeg', 'image/png']],
    'on' => function ($context) {
        return !empty($context['data']['show_profile_picture']);
    }
]);
```

You can access the other submitted field values using the `$context['data']`
array. The above example will make the rule for 'picture' optional depending on
whether the value for `show_profile_picture` is empty. You could also use the
`uploadedFile` validation rule to create optional file upload inputs:

``` php
$validator->add('picture', 'file', [
    'rule' => ['uploadedFile', ['optional' => true]],
]);
```

The `allowEmpty*`, `notEmpty*` and `requirePresence()` methods will also
accept a callback function as their last argument. If present, the callback
determines whether or not the rule should be applied. For example, a field is
sometimes allowed to be empty:

``` php
$validator->allowEmptyString('tax', 'This field is required', function ($context) {
    return !$context['data']['is_taxable'];
});
```

Likewise, a field can be required to be populated when certain conditions are
met:

``` php
$validator->notEmptyString('email_frequency', 'This field is required', function ($context) {
    return !empty($context['data']['wants_newsletter']);
});
```

In the above example, the `email_frequency` field cannot be left empty if the
the user wants to receive the newsletter.

Further it's also possible to require a field to be present under certain
conditions only:

``` php
$validator->requirePresence('full_name', function ($context) {
    if (isset($context['data']['action'])) {
        return $context['data']['action'] === 'subscribe';
    }

    return false;
});
$validator->requirePresence('email');
```

This would require the `full_name` field to be present only in case the user
wants to create a subscription, while the `email` field would always be
required.

The `$context` parameter passed to custom conditional callbacks contains the
following keys:

- `data` The data being validated.
- `newRecord` a boolean indicating whether a new or existing record is being
  validated.
- `field` The current field being validated.
- `providers` The validation providers attached to the current validator.

### Marking Rules as the Last to Run

When fields have multiple rules, each validation rule will be run even if the
previous one has failed. This allows you to collect as many validation errors as
you can in a single pass. If you want to stop execution after
a specific rule has failed, you can set the `last` option to `true`:

``` php
$validator = new Validator();
$validator
    ->add('body', [
        'minLength' => [
            'rule' => ['minLength', 10],
            'last' => true,
            'message' => 'Comments must have a substantial body.',
        ],
        'maxLength' => [
            'rule' => ['maxLength', 250],
            'message' => 'Comments cannot be too long.',
        ],
    ]);
```

If the minLength rule fails in the example above, the maxLength rule will not be
run.

## Make Rules 'last' by default

You can have the `last` option automatically applied to each rule you can use
the `setStopOnFailure()` method to enable this behavior:

``` php
public function validationDefault(Validator $validator): Validator
{
    $validator
        ->setStopOnFailure()
        ->requirePresence('email', 'create')
        ->notBlank('email')
        ->email('email');

    return $validator;
}
```

When enabled all fields will stop validation on the first failing rule instead
of checking all possible rules. In this case only a single error message will
appear under the form field.

<a id="adding-validation-providers"></a>

### Adding Validation Providers

The `Validator`, `ValidationSet` and `ValidationRule` classes do not
provide any validation methods themselves. Validation rules come from
'providers'. You can bind any number of providers to a Validator object.
Validator instances come with a 'default' provider setup automatically. The
default provider is mapped to the `Cake\Validation\Validation`
class. This makes it simple to use the methods on that class as validation
rules. When using Validators and the ORM together, additional providers are
configured for the table and entity objects. You can use the `setProvider()`
method to add any additional providers your application needs:

``` php
$validator = new Validator();

// Use an object instance.
$validator->setProvider('custom', $myObject);

// Use a class name. Methods must be static.
$validator->setProvider('custom', 'App\Model\Validation');
```

Validation providers can be objects, or class names. If a class name is used the
methods must be static. To use a provider other than 'default', be sure to set
the `provider` key in your rule:

``` php
// Use a rule from the table provider
$validator->add('title', 'custom', [
    'rule' => 'customTableMethod',
    'provider' => 'table'
]);
```

If you wish to add a `provider` to all `Validator` objects that are created
in the future, you can use the `addDefaultProvider()` method as follows:

``` php
use Cake\Validation\Validator;

// Use an object instance.
Validator::addDefaultProvider('custom', $myObject);

// Use a class name. Methods must be static.
Validator::addDefaultProvider('custom', 'App\Model\Validation');
```

> [!NOTE]
> DefaultProviders must be added before the `Validator` object is created
> therefore **config/bootstrap.php** is the best place to set up your
> default providers.

You can use the [Localized plugin](https://github.com/cakephp/localized) to
get providers based on countries. With this plugin, you'll be able to validate
model fields, depending on a country, ie:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class PostsTable extends Table
{
    public function validationDefault(Validator $validator): Validator
    {
        // add the provider to the validator
        $validator->setProvider('fr', 'Cake\Localized\Validation\FrValidation');
        // use the provider in a field validation rule
        $validator->add('phoneField', 'myCustomRuleNameForPhone', [
            'rule' => 'phone',
            'provider' => 'fr'
        ]);

        return $validator;
    }
}
```

The localized plugin uses the two letter ISO code of the countries for
validation, like en, fr, de.

There are a few methods that are common to all classes, defined through the
[ValidationInterface interface](https://github.com/cakephp/localized/blob/master/src/Validation/ValidationInterface.php):

``` text
phone() to check a phone number
postal() to check a postal code
personId() to check a country specific person ID
```

### Nesting Validators

When validating [Modelless Forms](../core-libraries/form) with nested data, or when working
with models that contain array data types, it is necessary to validate the
nested data you have. CakePHP makes it simple to add validators to specific
attributes. For example, assume you are working with a non-relational database
and need to store an article and its comments:

``` php
$data = [
    'title' => 'Best article',
    'comments' => [
        ['comment' => ''],
    ],
];
```

To validate the comments you would use a nested validator:

``` php
$validator = new Validator();
$validator->add('title', 'not-blank', ['rule' => 'notBlank']);

$commentValidator = new Validator();
$commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

// Connect the nested validators.
$validator->addNestedMany('comments', $commentValidator);

// Get all errors including those from nested validators.
$validator->validate($data);
```

You can create 1:1 'relationships' with `addNested()` and 1:N 'relationships'
with `addNestedMany()`. With both methods, the nested validator's errors will
contribute to the parent validator's errors and influence the final result.
Like other validator features, nested validators support error messages and
conditional application:

``` php
$validator->addNestedMany(
    'comments',
    $commentValidator,
    'Invalid comment',
    'create'
);
```

The error message for a nested validator can be found in the `_nested` key.

<a id="reusable-validators"></a>

### Creating Reusable Validators

While defining validators inline where they are used makes for good example
code, it doesn't lead to maintainable applications. Instead, you should
create `Validator` sub-classes for your reusable validation logic:

``` php
// In src/Model/Validation/ContactValidator.php
namespace App\Model\Validation;

use Cake\Validation\Validator;

class ContactValidator extends Validator
{
    public function __construct()
    {
        parent::__construct();
        // Add validation rules here.
    }
}
```

## Validating Data

Now that you've created a validator and added the rules you want to it, you can
start using it to validate data. Validators are able to validate array
data. For example, if you wanted to validate a contact form before creating and
sending an email you could do the following:

``` php
use Cake\Validation\Validator;

$validator = new Validator();
$validator
    ->requirePresence('email')
    ->add('email', 'validFormat', [
        'rule' => 'email',
        'message' => 'E-mail must be valid',
    ])
    ->requirePresence('name')
    ->notEmptyString('name', 'We need your name.')
    ->requirePresence('comment')
    ->notEmptyString('comment', 'You need to give a comment.');

$errors = $validator->validate($this->request->getData());
if (empty($errors)) {
    // Send an email.
}
```

The `getErrors()` method will return a non-empty array when there are validation
failures. The returned array of errors will be structured like:

``` php
$errors = [
    'email' => ['E-mail must be valid'],
];
```

If you have multiple errors on a single field, an array of error messages will
be returned per field. By default the `getErrors()` method applies rules for
the 'create' mode. If you'd like to apply 'update' rules you can do the
following:

``` php
$errors = $validator->validate($this->request->getData(), false);
if (!$errors) {
    // Send an email.
}
```

> [!NOTE]
> If you need to validate entities you should use methods like
> `Cake\ORM\Table::newEntity()`,
> `Cake\ORM\Table::newEntities()`,
> `Cake\ORM\Table::patchEntity()`,
> `Cake\ORM\Table::patchEntities()`
> as they are designed for that.

## Validating Entity Data

Validation is meant for checking request data coming from forms or other user
interfaces used to populate the entities.

The request data is validated automatically when using the `newEntity()`,
`newEntities()`, `patchEntity()` or `patchEntities()` methods of `Table` class:

``` php
// In the ArticlesController class
$article = $this->Articles->newEntity($this->request->getData());
if ($article->getErrors()) {
    // Do work to show error messages.
}
```

Similarly, when you need to validate multiple entities at a time, you can
use the `newEntities()` method:

``` php
// In the ArticlesController class
$entities = $this->Articles->newEntities($this->request->getData());
foreach ($entities as $entity) {
    if (!$entity->getErrors()) {
        $this->Articles->save($entity);
    }
}
```

The `newEntity()`, `patchEntity()`, `newEntities()` and `patchEntities()`
methods allow you to specify which associations are validated, and which
validation sets to apply using the `options` parameter:

``` php
$valid = $this->Articles->newEntity($article, [
    'associated' => [
        'Comments' => [
            'associated' => ['User'],
            'validate' => 'special',
        ],
    ],
]);
```

Apart from validating user provided data maintaining integrity of data regardless
where it came from is important. To solve this problem CakePHP offers a second
level of validation which is called "application rules". You can read more about
them in the [Applying Application Rules](../orm/validation#application-rules) section.

## Core Validation Rules

CakePHP provides a basic suite of validation methods in the `Validation`
class. The Validation class contains a variety of static methods that provide
validators for several common validation situations.

The [API documentation](https://api.cakephp.org/5.x/class-Cake.Validation.Validation.html) for the
`Validation` class provides a good list of the validation rules that are
available, and their basic usage.

Some of the validation methods accept additional parameters to define boundary
conditions or valid options. You can provide these boundary conditions and
options as follows:

``` php
$validator = new Validator();
$validator
    ->add('title', 'minLength', [
        'rule' => ['minLength', 10],
    ])
    ->add('rating', 'validValue', [
        'rule' => ['range', 1, 5],
    ]);
```

Core rules that take additional parameters should have an array for the
`rule` key that contains the rule as the first element, and the additional
parameters as the remaining parameters.
