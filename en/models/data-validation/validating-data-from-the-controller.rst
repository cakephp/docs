Validating Data from the Controller
###################################

While normally you would just use the save method of the model,
there may be times where you wish to validate the data without
saving it. For example, you may wish to display some additional
information to the user before actually saving the data to the
database. Validating data requires a slightly different process
than just saving the data.

First, set the data to the model:

::

    <?php
    $this->ModelName->set($this->request->data);

Then, to check if the data validates, use the validates method of
the model, which will return true if it validates and false if it
doesn't:

::

    <?php
    if ($this->ModelName->validates()) {
        // it validated logic
    } else {
        // didn't validate logic
    }

It may be desirable to validate your model only using a subset of
the validations specified in your model. For example say you had a
User model with fields for first\_name, last\_name, email and
password. In this instance when creating or editing a user you
would want to validate all 4 field rules. Yet when a user logs in
you would validate just email and password rules. To do this you
can pass an options array specifying the fields to validate. e.g.

::

    <?php
    if ($this->User->validates(array('fieldList' => array('email', 'password')))) {
        // valid
    } else {
        // invalid
    }

The validates method invokes the invalidFields method which
populates the validationErrors property of the model. The
invalidFields method also returns that data as the result.

::

    <?php
    $errors = $this->ModelName->invalidFields(); // contains validationErrors array

It is important to note that the data must be set to the model
before the data can be validated. This is different from the save
method which allows the data to be passed in as a parameter. Also,
keep in mind that it is not required to call validates prior to
calling save as save will automatically validate the data before
actually saving.

To validate multiple models, the following approach should be
used:

::

    <?php
    if ($this->ModelName->saveAll($this->request->data, array('validate' => 'only'))) {
      // validates
    } else {
      // does not validate
    }

If you have validated data before save, you can turn off validation
to avoid second check.

::

    <?php
    if ($this->ModelName->saveAll($this->request->data, array('validate' => false))) {
        // saving without validation
    } 


.. meta::
    :title lang=en: Validating Data from the Controller
    :keywords lang=en: password rules,validations,subset,array,logs,logic,email,first name last name,models,options,data model