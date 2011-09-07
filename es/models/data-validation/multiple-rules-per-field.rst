4.1.3 Multiple Rules per Field
------------------------------

The technique outlined above gives us much more flexibility than
simple rules assignment, but there’s an extra step we can take in
order to gain more fine-grained control of data validation. The
next technique we’ll outline allows us to assign multiple
validation rules per model field.

If you would like to assign multiple validation rules to a single
field, this is basically how it should look:

::

     
    var $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // extra keys like on, required, etc. go here...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // extra keys like on, required, etc. go here...
            )
        )
    );

As you can see, this is quite similar to what we did in the
previous section. There, for each field we had only one array of
validation parameters. In this case, each ‘fieldName’ consists of
an array of rule indices. Each ‘ruleName’ contains a separate array
of validation parameters.

This is better explained with a practical example:

::

    var $validate = array(
        'login' => array(
            'loginRule-1' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Only alphabets and numbers allowed',
                'last' => true
             ),
            'loginRule-2' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Minimum length of 8 characters'
            )  
        )
    );

The above example defines two rules for the login field:
loginRule-1 and loginRule-2. As you can see, each rule is
identified with an arbitrary name.

By default CakePHP tries to validate a field using all the
validation rules declared for it and returns the error message for
the last failing rule. But if the key ``last`` is set to ``true``
for a rule and it fails, then the error message for that rule is
returned and further rules are not validated. So if you prefer to
show the error message for the first failing rule then set
``'last' => true`` for each rule.

When using multiple rules per field the 'required' and 'allowEmpty'
keys need to be used only once in the first rule.

If you plan on using internationalized error messages, you may want
to specify error messages in your view instead:

::

    echo $form->input('login', array(
        'label' => __('Login', true), 
        'error' => array(
                'loginRule-1' => __('Only alphabets and numbers allowed', true),
                'loginRule-2' => __('Minimum length of 8 characters', true)
            )
        )
    );

The field is now fully internationalized, and you are able to
remove the messages from the model. For more information on the
\_\_() function, see "Localization & Internationalization"
