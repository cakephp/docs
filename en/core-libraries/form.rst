Modelless Forms
###############

.. php:namespace:: Cake\Form

.. php:class:: Form

Most of the time you will have forms backed by :doc:`ORM entities </orm/entities>`
and :doc:`ORM tables </orm/table-objects>` or other persistent stores,
but there are times when you'll need to validate user input and then perform an
action if the data is valid. The most common example of this is a contact form.

Creating a Form
===============

Generally when using the Form class you'll want to use a subclass to define your
form. This makes testing easier, and lets you re-use your form. Forms are put
into **src/Form** and usually have ``Form`` as a class suffix. For example,
a simple contact form would look like::

    // in src/Form/ContactForm.php
    namespace App\Form;

    use Cake\Form\Form;
    use Cake\Form\Schema;
    use Cake\Validation\Validator;

    class ContactForm extends Form
    {
        protected function _buildSchema(Schema $schema): Schema
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        public function validationDefault(Validator $validator): Validator
        {
            $validator->minLength('name', 10)
                ->email('email');

            return $validator;
        }

        protected function _execute(array $data): bool
        {
            // Send an email.
            return true;
        }
    }

In the above example we see the 3 hook methods that forms provide:

* ``_buildSchema`` is used to define the schema data that is used by FormHelper
  to create an HTML form. You can define field type, length, and precision.
* ``validationDefault`` Gets a :php:class:`Cake\\Validation\\Validator` instance
  that you can attach validators to.
* ``_execute`` lets you define the behavior you want to happen when
  ``execute()`` is called and the data is valid.

You can always define additional public methods as you need as well.

Processing Request Data
=======================

Once you've defined your form, you can use it in your controller to process
and validate request data::

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

In the above example, we use the ``execute()`` method to run our form's
``_execute()`` method only when the data is valid, and set flash messages
accordingly. If we want to use a non-default validation set we can use the
``validate`` option::

    if ($contact->execute($this->request->getData(), 'update')) {
        // Handle form success.
    }

This option can also be set to ``false`` to disable validation.

We could have also used the ``validate()`` method to only validate
the request data::

    $isValid = $form->validate($this->request->getData());

    // You can also use other validation sets. The following
    // would use the rules defined by `validationUpdate()`
    $isValid = $form->validate($this->request->getData(), 'update');

Setting Form Values
===================

You can set default values for modelless forms using the ``setData()`` method.
Values set with this method will overwrite existing data in the form object::

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

Values should only be defined if the request method is GET, otherwise
you will overwrite your previous POST Data which might have validation errors
that need corrections. You can use ``set()`` to add or replace individual fields
or a subset of fields::

    // Set one field.
    $contact->set('name', 'John Doe');

    // Set multiple fields;
    $contact->set([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
    ]);

Getting Form Errors
===================

Once a form has been validated you can retrieve the errors from it::

    $errors = $form->getErrors();
    /* $errors contains
    [
        'name' => ['length' => 'Name must be at least two characters long'],
        'email' => ['format' => 'A valid email address is required'],
    ]
    */

    $error = $form->getError('email');
    /* $error contains
    [
        'format' => 'A valid email address is required',
    ]
    */

Invalidating Individual Form Fields from Controller
===================================================

It is possible to invalidate individual fields from the controller without the
use of the Validator class.  The most common use case for this is when the
validation is done on a remote server.  In such case, you must manually
invalidate the fields accordingly to the feedback from the remote server::

    // in src/Form/ContactForm.php
    public function setErrors($errors)
    {
        $this->_errors = $errors;
    }

According to how the validator class would have returned the errors, ``$errors``
must be in this format::

    ['fieldName' => ['validatorName' => 'The error message to display']]

Now you will be able to invalidate form fields by setting the fieldName, then
set the error messages::

    // In a controller
    $contact = new ContactForm();
    $contact->setErrors(['email' => ['_required' => 'Your email is required']]);

Proceed to Creating HTML with FormHelper to see the results.

Creating HTML with FormHelper
=============================

Once you've created a Form class, you'll likely want to create an HTML form for
it. FormHelper understands Form objects just like ORM entities::

    echo $this->Form->create($contact);
    echo $this->Form->control('name');
    echo $this->Form->control('email');
    echo $this->Form->control('body');
    echo $this->Form->button('Submit');
    echo $this->Form->end();

The above would create an HTML form for the ``ContactForm`` we defined earlier.
HTML forms created with FormHelper will use the defined schema and validator to
determine field types, maxlengths, and validation errors.
