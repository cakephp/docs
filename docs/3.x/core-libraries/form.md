# Modelless Forms

`class` Cake\\Form\\**Form**

Most of the time you will have forms backed by [ORM entities](../orm/entities)
and [ORM tables](../orm/table-objects) or other persistent stores,
but there are times when you'll need to validate user input and then perform an
action if the data is valid. The most common example of this is a contact form.

## Creating a Form

Generally when using the Form class you'll want to use a subclass to define your
form. This makes testing easier, and lets you re-use your form. Forms are put
into **src/Form** and usually have `Form` as a class suffix. For example,
a simple contact form would look like:

``` php
// in src/Form/ContactForm.php
namespace App\Form;

use Cake\Form\Form;
use Cake\Form\Schema;
use Cake\Validation\Validator;

class ContactForm extends Form
{
    protected function _buildSchema(Schema $schema)
    {
        return $schema->addField('name', 'string')
            ->addField('email', ['type' => 'string'])
            ->addField('body', ['type' => 'text']);
    }

    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('name', 'length', [
                'rule' => ['minLength', 5],
                'message' => 'A name is required'
            ])
            ->add('email', 'format', [
                'rule' => 'email',
                'message' => 'A valid email address is required',
            ]);

        return $validator;
    }

    protected function _execute(array $data)
    {
        // Send an email.
        return true;
    }
}
```

In the above example we see the 3 hook methods that forms provide:

- `_buildSchema` is used to define the schema data that is used by FormHelper
  to create an HTML form. You can define field type, length, and precision.
- `validationDefault` Gets a `Cake\Validation\Validator` instance
  that you can attach validators to.
- `_execute` lets you define the behavior you want to happen when
  `execute()` is called and the data is valid.

You can always define additional public methods as you need as well.

## Setting Form Values

You can set default values for modelless forms using the `setData()` method.
Values set with this method will overwrite existing data in the form object:

``` php
// In a controller
namespace App\Controller;

use App\Controller\AppController;
use App\Form\ContactForm;

class ContactController extends AppController
{
    public function index()
    {
        $contact = new ContactForm();
        if ($this->request->is('post')) {
            if ($contact->execute($this->request->getData())) {
                $this->Flash->success('We will get back to you soon.');
            } else {
                $this->Flash->error('There was a problem submitting your form.');
            }
        }

        if ($this->request->is('get')) {
            $contact->setData([
                'name' => 'John Doe',
                'email' => 'john.doe@example.com'
            ]);
        }

        $this->set('contact', $contact);
    }
}
```

Prior to 3.7.0 you must set default values for form by modifying the request:

``` php
// Set default values on get
if ($this->request->is('get')) {
    // Values from the User Model e.g.
    $this->request->data('name', 'John Doe');
    $this->request->data('email','john.doe@example.com');
}
```

Values should only be defined if the request method is GET, otherwise
you will overwrite your previous POST Data which might have validation errors
that need corrections.

::: info Added in version 3.7.0
`Form::setData()` was added.
:::

## Getting Form Values

You can get values from modelless forms using the `getData()` method:

``` php
// In a controller
namespace App\Controller;

use App\Controller\AppController;
use App\Form\ContactForm;

class ContactController extends AppController
{
    public function index()
    {
        $contact = new ContactForm();
        if ($this->request->is('post')) {
            if ($contact->execute($this->request->getData())) {
                $contact->setData($this->request->getData());
                $name = $contact->getData('name');
                $this->Flash->success("Dear $name, we will get back to you soon.");
            } else {
                $this->Flash->error('There was a problem submitting your form.');
            }
        }

        if ($this->request->is('get')) {
            $contact->setData([
                'name' => 'John Doe',
                'email' => 'john.doe@example.com'
            ]);
        }

        $this->set('contact', $contact);
    }
}
```

::: info Added in version 3.7.0
`Form::getData()` was added.
:::

## Processing Request Data

Once you've defined your form, you can use it in your controller to process
and validate request data:

``` php
// In a controller
namespace App\Controller;

use App\Controller\AppController;
use App\Form\ContactForm;

class ContactController extends AppController
{
    public function index()
    {
        $contact = new ContactForm();
        if ($this->request->is('post')) {
            if ($contact->execute($this->request->getData())) {
                $this->Flash->success('We will get back to you soon.');
            } else {
                $this->Flash->error('There was a problem submitting your form.');
            }
        }
        $this->set('contact', $contact);
    }
}
```

In the above example, we use the `execute()` method to run our form's
`_execute()` method only when the data is valid, and set flash messages
accordingly. We could have also used the `validate()` method to only validate
the request data:

``` php
$isValid = $form->validate($this->request->getData());
```

## Getting Form Errors

Once a form has been validated you can retrieve the errors from it:

``` php
$errors = $form->getErrors(); // $form->errors(); // prior to 3.7.0
/* $errors contains
[
    'email' => ['A valid email address is required']
]
*/
```

::: info Added in version 3.7.0
`errors()` has been deprecated in favor of `getErrors()`
:::

## Invalidating Individual Form Fields from Controller

It is possible to invalidate individual fields from the controller without the
use of the Validator class. The most common use case for this is when the
validation is done on a remote server. In such case, you must manually
invalidate the fields accordingly to the feedback from the remote server:

``` php
// in src/Form/ContactForm.php
public function setErrors($errors)
{
    $this->_errors = $errors;
}
```

::: info Changed in version 3.5.1
You are not required to specify `setErrors` anymore as this hasalready been included in the `Form` class for your convenience.
:::

According to how the validator class would have returned the errors, `$errors`
must be in this format:

``` php
["fieldName" => ["validatorName" => "The error message to display"]]
```

Now you will be able to invalidate form fields by setting the fieldName, then
set the error messages:

``` php
// In a controller
$contact = new ContactForm();
$contact->setErrors(["email" => ["_required" => "Your email is required"]]);
```

Proceed to Creating HTML with FormHelper to see the results.

## Creating HTML with FormHelper

Once you've created a Form class, you'll likely want to create an HTML form for
it. FormHelper understands Form objects just like ORM entities:

``` php
echo $this->Form->create($contact);
echo $this->Form->control('name');
echo $this->Form->control('email');
echo $this->Form->control('body');
echo $this->Form->button('Submit');
echo $this->Form->end();
```

The above would create an HTML form for the `ContactForm` we defined earlier.
HTML forms created with FormHelper will use the defined schema and validator to
determine field types, maxlengths, and validation errors.
