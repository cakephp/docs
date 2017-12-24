Modelless Forms
###############

.. php:namespace:: Cake\Form

.. php:class:: Form

Most of the time you will have forms backed by :doc:`ORM entities </orm/entities>`
and :doc:`ORM tables </orm/table-objects>` or other peristent stores,
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

        protected function _buildSchema(Schema $schema)
        {
            return $schema->addField('name', 'string')
                ->addField('email', ['type' => 'string'])
                ->addField('body', ['type' => 'text']);
        }

        public function validationDefault(Validator $validator)
        {
            $validator->add('name', 'length', [
                    'rule' => ['minLength', 10],
                    'message' => 'A name is required'
                ])->add('email', 'format', [
                    'rule' => 'email',
                    'message' => 'A valid email address is required',
                ]);
        }

        protected function _execute(array $data)
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
accordingly. We could have also used the ``validate()`` method to only validate
the request data::

    $isValid = $form->validate($this->request->getData());

Setting Form Values
===================

In order to set the values for the fields of a modelless form, one can define
the values using ``$this->request->data()``, like in all other forms created by
the FormHelper::

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
                // Values from the User Model e.g.
                $this->request->data('name', 'John Doe');
                $this->request->data('email','john.doe@example.com');
            }

            $this->set('contact', $contact);
        }
    }

Values should only be defined if the request method is GET, otherwise
you will overwrite your previous POST Data which might have been incorrect
and not been saved.

Getting Form Errors
===================

Once a form has been validated you can retrieve the errors from it::

    $errors = $form->errors();
    /* $errors contains
    [
        'email' => ['A valid email address is required']
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

    ["fieldName" => ["validatorName" => "The error message to display"]]

Now you will be able to invalidate form fields by setting the fieldName, then
set the error messages::

    // In a controller
    $contact = new ContactForm();
    $contact->setErrors(["email" => ["_required" => "Your email is required"]]);

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
