4.2.4 clean
-----------

``Sanitize::clean(mixed $data, mixed $options)``

This function is an industrial-strength, multi-purpose cleaner,
meant to be used on entire arrays (like $this->data, for example).
The function takes an array (or string) and returns the clean
version. The following cleaning operations are performed on each
element in the array (recursively):


-  Odd spaces (including 0xCA) are replaced with regular spaces.
-  Double-checking special chars and removal of carriage returns
   for increased SQL security.
-  Adding of slashes for SQL (just calls the sql function outlined
   above).
-  Swapping of user-inputted backslashes with trusted backslashes.

The $options argument can either be a string or an array. When a
string is provided it's the database connection name. If an array
is provided it will be merged with the following options:


-  connection
-  odd\_spaces
-  encode
-  dollar
-  carriage
-  unicode
-  escape
-  backslash
-  remove\_html (must be used in conjunction with the encode
   parameter)

Usage of clean() with options looks something like the following:

::

    $this->data = Sanitize::clean($this->data, array('encode' => false));

4.2.4 clean
-----------

``Sanitize::clean(mixed $data, mixed $options)``

This function is an industrial-strength, multi-purpose cleaner,
meant to be used on entire arrays (like $this->data, for example).
The function takes an array (or string) and returns the clean
version. The following cleaning operations are performed on each
element in the array (recursively):


-  Odd spaces (including 0xCA) are replaced with regular spaces.
-  Double-checking special chars and removal of carriage returns
   for increased SQL security.
-  Adding of slashes for SQL (just calls the sql function outlined
   above).
-  Swapping of user-inputted backslashes with trusted backslashes.

The $options argument can either be a string or an array. When a
string is provided it's the database connection name. If an array
is provided it will be merged with the following options:


-  connection
-  odd\_spaces
-  encode
-  dollar
-  carriage
-  unicode
-  escape
-  backslash
-  remove\_html (must be used in conjunction with the encode
   parameter)

Usage of clean() with options looks something like the following:

::

    $this->data = Sanitize::clean($this->data, array('encode' => false));
