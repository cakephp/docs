4.1.4 Core Validation Rules
---------------------------

The Validation class in CakePHP contains many validation rules that
can make model data validation much easier. This class contains
many oft-used validation techniques you won’t need to write on your
own. Below, you'll find a complete list of all the rules, along
with usage examples.

alphaNumeric
~~~~~~~~~~~~

The data for the field must only contain letters and numbers.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Usernames must only contain letters and numbers.'
        )
    );

between
~~~~~~~

The length of the data for the field must fall within the specified
numeric range. Both minimum and maximum values must be supplied.
Uses
= not
.
::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Passwords must be between 5 and 15 characters long.'
        )
    );

The length of data is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

blank
~~~~~

This rule is used to make sure that the field is left blank or only
white space characters are present in its value. White space
characters include space, tab, carriage return, and newline.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
~~~~~~~

The data for the field must be a boolean value. Valid values are
true or false, integers 0 or 1 or strings '0' or '1'.

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Incorrect value for myCheckbox'
        )
    );

cc
~~

This rule is used to check whether the data is a valid credit card
number. It takes three parameters: ‘type’, ‘deep’ and ‘regex’.

The ‘type’ key can be assigned to the values of ‘fast’, ‘all’ or
any of the following:


-  amex
-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

If ‘type’ is set to ‘fast’, it validates the data against the major
credit cards’ numbering formats. Setting ‘type’ to ‘all’ will check
with all the credit card types. You can also set ‘type’ to an array
of the types you wish to match.

The ‘deep’ key should be set to a boolean value. If it is set to
true, the validation will check the Luhn algorithm of the credit
card
(`http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_).
It defaults to false.

The ‘regex’ key allows you to supply your own regular expression
that will be used to validate the credit card number.

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'The credit card number you supplied was invalid.'
        )
    );

comparison
~~~~~~~~~~

Comparison is used to compare numeric values. It supports “is
greater”, “is less”, “greater or equal”, “less or equal”, “equal
to”, and “not equal”. Some examples are shown below:

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Must be at least 18 years old to qualify.'
        )
    );
    
    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Must be at least 18 years old to qualify.'
        )
    );

date
~~~~

This rule ensures that data is submitted in valid date formats. A
single parameter (which can be an array) can be passed that will be
used to check the format of the supplied date. The value of the
parameter can be one of the following:


-  ‘dmy’ e.g. 27-12-2006 or 27-12-06 (separators can be a space,
   period, dash, forward slash)
-  ‘mdy’ e.g. 12-27-2006 or 12-27-06 (separators can be a space,
   period, dash, forward slash)
-  ‘ymd’ e.g. 2006-12-27 or 06-12-27 (separators can be a space,
   period, dash, forward slash)
-  ‘dMy’ e.g. 27 December 2006 or 27 Dec 2006
-  ‘Mdy’ e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
-  ‘My’ e.g. (December 2006 or Dec 2006)
-  ‘my’ e.g. 12/2006 or 12/06 (separators can be a space, period,
   dash, forward slash)

If no keys are supplied, the default key that will be used is
‘ymd’.

::

    var $validate = array(
        'born' => array(
            'rule' => array('date','ymd'),
            'message' => 'Enter a valid date in YY-MM-DD format.',
            'allowEmpty' => true
        )
    );

While many data stores require a certain date format, you might
consider doing the heavy lifting by accepting a wide-array of date
formats and trying to convert them, rather than forcing users to
supply a given format. The more work you can do for your users, the
better.

decimal
~~~~~~~

This rule ensures that the data is a valid decimal number. A
parameter can be passed to specify the number of digits required
after the decimal point. If no parameter is passed, the data will
be validated as a scientific float, which will cause validation to
fail if no digits are found after the decimal point.

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
~~~~~

This checks whether the data is a valid email address. Passing a
boolean true as the second parameter for this rule will also
attempt to verify that the host for the address is valid.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Please supply a valid email address.'
        )
    );

equalTo
~~~~~~~

This rule will ensure that the value is equal to, and of the same
type as the given value.

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'This value must be the string cake'
        )
    );

extension
~~~~~~~~~

This rule checks for valid file extensions like .jpg or .png. Allow
multiple extensions by passing them in array form.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
            'message' => 'Please supply a valid image.'
        )
    );

file
~~~~

This rule ensures that the value is a valid file name. This
validation rule is currently non-functional.

ip
~~

This rule will ensure that a valid IPv4 or IPv6 address has been
submitted. Accepts as option 'both' (default), 'IPv4' or 'IPv6'.

::

    var $validate = array(
        'clientip' => array(
            'rule' => array('ip', 'IPv4'), // or 'IPv6' or 'both' (default)
            'message' => 'Please supply a valid IP address.'
        )
    );

isUnique
~~~~~~~~

The data for the field must be unique, it cannot be used by any
other rows.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'This username has already been taken.'
        )
    );

minLength
~~~~~~~~~

This rule ensures that the data meets a minimum length
requirement.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', 8),  
            'message' => 'Usernames must be at least 8 characters long.'
        )
    );

The length here is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

maxLength
~~~~~~~~~

This rule ensures that the data stays within a maximum length
requirement.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', 15),  
            'message' => 'Usernames must be no larger than 15 characters long.'
        )
    );

The length here is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

money
~~~~~

This rule will ensure that the value is in a valid monetary
amount.

Second parameter defines where symbol is located (left/right).

::

    var $validate = array(
        'salary' => array(
            'rule' => array('money', 'left'),
            'message' => 'Please supply a valid monetary amount.'
        )
    );

multiple
~~~~~~~~

Use this for validating a multiple select input. It supports
parameters "in", "max" and "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('do', 'ray', 'me', 'fa', 'so', 'la', 'ti'), 'min' => 1, 'max' => 3)),
            'message' => 'Please select one, two or three options'
        )
    );

inList
~~~~~~

This rule will ensure that the value is in a given set. It needs an
array of values. The field is valid if the field's value matches
one of the values in the given array.

Example:
::

        var $validate = array(
          'function' => array(
            'allowedChoice' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => 'Enter either Foo or Bar.'
            )
          )
        );

numeric
~~~~~~~

Checks if the data passed is a valid number.

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => 'Please supply the number of cars.'
        )
    );

notEmpty
~~~~~~~~

The basic rule to ensure that a field is not empty.

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'This field cannot be left blank'
        )
    );

Do not use this for a multiple select input as it will cause an
error. Instead, use "multiple".

phone
~~~~~

Phone validates US phone numbers. If you want to validate non-US
phone numbers, you can provide a regular expression as the second
parameter to cover additional number formats.

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
~~~~~~

Postal is used to validate ZIP codes from the U.S. (us), Canada
(ca), U.K (uk), Italy (it), Germany (de) and Belgium (be). For
other ZIP code formats, you may provide a regular expression as the
second parameter.

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
~~~~~

This rule ensures that the value is in a given range. If no range
is supplied, the rule will check to ensure the value is a legal
finite on the current platform.

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', -1, 11),
            'message' => 'Please enter a number between 0 and 10'
        )
    );

The above example will accept any value which is larger than 0
(e.g., 0.01) and less than 10 (e.g., 9.99). Note: The range
lower/upper are not inclusive!!!

ssn
~~~

Ssn validates social security numbers from the U.S. (us), Denmark
(dk), and the Netherlands (nl). For other social security number
formats, you may provide a regular expression.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
~~~

This rule checks for valid URL formats. Supports http(s), ftp(s),
file, news, and gopher protocols.

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

To ensure that a protocol is in the url, strict mode can be enabled
like so.

::

    var $validate = array(
        'website' => array(
            'rule' => array('url', true)
        )
    );

4.1.4 Core Validation Rules
---------------------------

The Validation class in CakePHP contains many validation rules that
can make model data validation much easier. This class contains
many oft-used validation techniques you won’t need to write on your
own. Below, you'll find a complete list of all the rules, along
with usage examples.

alphaNumeric
~~~~~~~~~~~~

The data for the field must only contain letters and numbers.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Usernames must only contain letters and numbers.'
        )
    );

between
~~~~~~~

The length of the data for the field must fall within the specified
numeric range. Both minimum and maximum values must be supplied.
Uses
= not
.
::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Passwords must be between 5 and 15 characters long.'
        )
    );

The length of data is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

blank
~~~~~

This rule is used to make sure that the field is left blank or only
white space characters are present in its value. White space
characters include space, tab, carriage return, and newline.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
~~~~~~~

The data for the field must be a boolean value. Valid values are
true or false, integers 0 or 1 or strings '0' or '1'.

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Incorrect value for myCheckbox'
        )
    );

cc
~~

This rule is used to check whether the data is a valid credit card
number. It takes three parameters: ‘type’, ‘deep’ and ‘regex’.

The ‘type’ key can be assigned to the values of ‘fast’, ‘all’ or
any of the following:


-  amex
-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

If ‘type’ is set to ‘fast’, it validates the data against the major
credit cards’ numbering formats. Setting ‘type’ to ‘all’ will check
with all the credit card types. You can also set ‘type’ to an array
of the types you wish to match.

The ‘deep’ key should be set to a boolean value. If it is set to
true, the validation will check the Luhn algorithm of the credit
card
(`http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_).
It defaults to false.

The ‘regex’ key allows you to supply your own regular expression
that will be used to validate the credit card number.

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'The credit card number you supplied was invalid.'
        )
    );

comparison
~~~~~~~~~~

Comparison is used to compare numeric values. It supports “is
greater”, “is less”, “greater or equal”, “less or equal”, “equal
to”, and “not equal”. Some examples are shown below:

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Must be at least 18 years old to qualify.'
        )
    );
    
    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Must be at least 18 years old to qualify.'
        )
    );

date
~~~~

This rule ensures that data is submitted in valid date formats. A
single parameter (which can be an array) can be passed that will be
used to check the format of the supplied date. The value of the
parameter can be one of the following:


-  ‘dmy’ e.g. 27-12-2006 or 27-12-06 (separators can be a space,
   period, dash, forward slash)
-  ‘mdy’ e.g. 12-27-2006 or 12-27-06 (separators can be a space,
   period, dash, forward slash)
-  ‘ymd’ e.g. 2006-12-27 or 06-12-27 (separators can be a space,
   period, dash, forward slash)
-  ‘dMy’ e.g. 27 December 2006 or 27 Dec 2006
-  ‘Mdy’ e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
-  ‘My’ e.g. (December 2006 or Dec 2006)
-  ‘my’ e.g. 12/2006 or 12/06 (separators can be a space, period,
   dash, forward slash)

If no keys are supplied, the default key that will be used is
‘ymd’.

::

    var $validate = array(
        'born' => array(
            'rule' => array('date','ymd'),
            'message' => 'Enter a valid date in YY-MM-DD format.',
            'allowEmpty' => true
        )
    );

While many data stores require a certain date format, you might
consider doing the heavy lifting by accepting a wide-array of date
formats and trying to convert them, rather than forcing users to
supply a given format. The more work you can do for your users, the
better.

decimal
~~~~~~~

This rule ensures that the data is a valid decimal number. A
parameter can be passed to specify the number of digits required
after the decimal point. If no parameter is passed, the data will
be validated as a scientific float, which will cause validation to
fail if no digits are found after the decimal point.

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
~~~~~

This checks whether the data is a valid email address. Passing a
boolean true as the second parameter for this rule will also
attempt to verify that the host for the address is valid.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Please supply a valid email address.'
        )
    );

equalTo
~~~~~~~

This rule will ensure that the value is equal to, and of the same
type as the given value.

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'This value must be the string cake'
        )
    );

extension
~~~~~~~~~

This rule checks for valid file extensions like .jpg or .png. Allow
multiple extensions by passing them in array form.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
            'message' => 'Please supply a valid image.'
        )
    );

file
~~~~

This rule ensures that the value is a valid file name. This
validation rule is currently non-functional.

ip
~~

This rule will ensure that a valid IPv4 or IPv6 address has been
submitted. Accepts as option 'both' (default), 'IPv4' or 'IPv6'.

::

    var $validate = array(
        'clientip' => array(
            'rule' => array('ip', 'IPv4'), // or 'IPv6' or 'both' (default)
            'message' => 'Please supply a valid IP address.'
        )
    );

isUnique
~~~~~~~~

The data for the field must be unique, it cannot be used by any
other rows.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'This username has already been taken.'
        )
    );

minLength
~~~~~~~~~

This rule ensures that the data meets a minimum length
requirement.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', 8),  
            'message' => 'Usernames must be at least 8 characters long.'
        )
    );

The length here is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

maxLength
~~~~~~~~~

This rule ensures that the data stays within a maximum length
requirement.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', 15),  
            'message' => 'Usernames must be no larger than 15 characters long.'
        )
    );

The length here is "the number of bytes in the string
representation of the data". Be careful that it may be larger than
the number of characters when handling non-ASCII characters.

money
~~~~~

This rule will ensure that the value is in a valid monetary
amount.

Second parameter defines where symbol is located (left/right).

::

    var $validate = array(
        'salary' => array(
            'rule' => array('money', 'left'),
            'message' => 'Please supply a valid monetary amount.'
        )
    );

multiple
~~~~~~~~

Use this for validating a multiple select input. It supports
parameters "in", "max" and "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('do', 'ray', 'me', 'fa', 'so', 'la', 'ti'), 'min' => 1, 'max' => 3)),
            'message' => 'Please select one, two or three options'
        )
    );

inList
~~~~~~

This rule will ensure that the value is in a given set. It needs an
array of values. The field is valid if the field's value matches
one of the values in the given array.

Example:
::

        var $validate = array(
          'function' => array(
            'allowedChoice' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => 'Enter either Foo or Bar.'
            )
          )
        );

numeric
~~~~~~~

Checks if the data passed is a valid number.

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => 'Please supply the number of cars.'
        )
    );

notEmpty
~~~~~~~~

The basic rule to ensure that a field is not empty.

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'This field cannot be left blank'
        )
    );

Do not use this for a multiple select input as it will cause an
error. Instead, use "multiple".

phone
~~~~~

Phone validates US phone numbers. If you want to validate non-US
phone numbers, you can provide a regular expression as the second
parameter to cover additional number formats.

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
~~~~~~

Postal is used to validate ZIP codes from the U.S. (us), Canada
(ca), U.K (uk), Italy (it), Germany (de) and Belgium (be). For
other ZIP code formats, you may provide a regular expression as the
second parameter.

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
~~~~~

This rule ensures that the value is in a given range. If no range
is supplied, the rule will check to ensure the value is a legal
finite on the current platform.

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', -1, 11),
            'message' => 'Please enter a number between 0 and 10'
        )
    );

The above example will accept any value which is larger than 0
(e.g., 0.01) and less than 10 (e.g., 9.99). Note: The range
lower/upper are not inclusive!!!

ssn
~~~

Ssn validates social security numbers from the U.S. (us), Denmark
(dk), and the Netherlands (nl). For other social security number
formats, you may provide a regular expression.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
~~~

This rule checks for valid URL formats. Supports http(s), ftp(s),
file, news, and gopher protocols.

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

To ensure that a protocol is in the url, strict mode can be enabled
like so.

::

    var $validate = array(
        'website' => array(
            'rule' => array('url', true)
        )
    );
