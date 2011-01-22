4.1.5 Custom Validation Rules
-----------------------------

If you haven’t found what you need thus far, you can always create
your own validation rules. There are two ways you can do this: by
defining custom regular expressions, or by creating custom
validation methods.

Custom Regular Expression Validation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If the validation technique you need to use can be completed by
using regular expression matching, you can define a custom
expression as a field validation rule.

::

    var $validate = array(
        'login' => array(
            'rule' => '/^[a-z0-9]{3,}$/i',  
            'message' => 'Only letters and integers, min 3 characters'
        )
    );

The example above checks if the login contains only letters and
integers, with a minimum of three characters.

The regular expression in the ``rule`` must be delimited by
slashes. The optional trailing 'i' after the last slash means the
reg-exp is case *i*nsensitive.

Adding your own Validation Methods
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sometimes checking data with regular expression patterns is not
enough. For example, if you want to ensure that a promotional code
can only be used 25 times, you need to add your own validation
function, as shown below:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
      
        var $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'This code has been used too many times.'
            )
        );
     
        function limitDuplicates($check, $limit){
            //$check will have value: array('promomotion_code' => 'some-value')
            //$limit will have value: 25
            $existing_promo_count = $this->find( 'count', array('conditions' => $check, 'recursive' => -1) );
            return $existing_promo_count < $limit;
        }
    }
    ?>

The current field to be validated is passed into the function as
first parameter as an associated array with field name as key and
posted data as value.

If you want to pass extra parameters to your validation function,
add elements onto the ‘rule’ array, and handle them as extra params
(after the main ``$check`` param) in your function.

Your validation function can be in the model (as in the example
above), or in a behavior that the model implements. This includes
mapped methods.

Model/behavior methods are checked first, before looking for a
method on the ``Validation`` class. This means that you can
override existing validation methods (such as ``alphaNumeric()``)
at an application level (by adding the method to ``AppModel``), or
at model level.

When writing a validation rule which can be used by multiple
fields, take care to extract the field value from the $check array.
The $check array is passed with the form field name as its key and
the field value as its value. The full record being validated is
stored in $this->data member variable.

::

    <?php
    class Post extends AppModel {
      var $name = 'Post';
      
      var $validate = array(
        'slug' => array(
          'rule' => 'alphaNumericDashUnderscore',
          'message' => 'Slug can only be letters, numbers, dash and underscore'
          )
        );
        
        function alphaNumericDashUnderscore($check) {
          // $data array is passed using the form field name as the key
          // have to extract the value to make the function generic
          $value = array_values($check);
          $value = $value[0];
          
          return preg_match('|^[0-9a-zA-Z_-]*$|', $value);
        }
    }
    ?>
