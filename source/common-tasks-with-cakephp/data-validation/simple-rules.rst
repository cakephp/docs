4.1.1 Simple Rules
------------------

As the name suggests, this is the simplest way to define a
validation rule. The general syntax for defining rules this way
is:

::

    var $validate = array('fieldName' => 'ruleName');

Where, 'fieldName' is the name of the field the rule is defined
for, and ‘ruleName’ is a pre-defined rule name, such as
'alphaNumeric', 'email' or 'isUnique'.

For example, to ensure that the user is giving a well formatted
email address, you could use this rule:

::

    var $validate = array('user_email' => 'email');

4.1.1 Simple Rules
------------------

As the name suggests, this is the simplest way to define a
validation rule. The general syntax for defining rules this way
is:

::

    var $validate = array('fieldName' => 'ruleName');

Where, 'fieldName' is the name of the field the rule is defined
for, and ‘ruleName’ is a pre-defined rule name, such as
'alphaNumeric', 'email' or 'isUnique'.

For example, to ensure that the user is giving a well formatted
email address, you could use this rule:

::

    var $validate = array('user_email' => 'email');
