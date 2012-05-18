16 Data Sanitation: The Sanitize Class
--------------------------------------

Cake comes with Sanitize, a class you can use to rid user-submitted data
of malicious attacks and other unwanted data. Sanitize is a core
library, so it can be used anywhere inside of your code, but is probably
best used in controllers or models.

Include the library and then create a new Sanitize object.

::

    uses('sanitize');
    $mrClean = new Sanitize();

Making Data Safe for use in SQL and HTML
----------------------------------------

This section explains how to use some of the functions that Sanitize
offers.

-  **paranoid**
-  string *$string*
-  array *$allowedChars*

This function strips anything out of the target $string that is not a
plain-jane alphanumeric character. You can, however, let it overlook
certain characters by passing them along inside the $allowedChars array.

::

    $badString = ";:<script><html><   // >@@#";

    echo $mrClean->paranoid($badString);

    // output: scripthtml

    echo $mrClean->paranoid($badString, array(' ', '@'));

    // output: scripthtml    @@

-  **html**
-  string *$string*
-  boolean *$remove = false*

This method helps you get user submitted data ready for display inside
an existing HTML layout. This is especially useful if you don't want
users to be able to break your layouts or insert images or scripts
inside of blog comments, forum posts, and the like. If the $remove
option is set to true, any HTML is removed rather than rendered as HTML
entities.

::

    $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';

    echo $mrClean->html($badString);

    // output: <font size="99" color="#FF0000">HEY</font><script>...</script>

    echo $mrClean->html($badString, true);

    // output: font size=99 color=#FF0000 HEY fontscript...script

-  **sql**
-  string *$string*

Used to escape SQL statements by adding slashes, depending on the
system's current magic\_quotes\_gpc setting.

-  **cleanArray**
-  array @\ *$dirtyArray*

This function is an industrial strength, multi-purpose cleaner, meant to
be used on entire arrays (like $this->params['form'], for example). The
function takes an array and cleans it: nothing is returned because the
array is passed by reference. The following cleaning operations are
performed on each element in the array (recursively):

#. Odd spaces (including 0xCA) are replaced with regular spaces.

#. HTML is replaced by its corresponding HTML entities (including \\n to
   <br>).

#. Double-check special chars and remove carriage returns for increased
   SQL security.

#. Add slashes for SQL (just calls the sql function outlined above).

#. Swap user-inputted backslashes with trusted backslashes.

