4.2.1 paranoid
--------------

paranoid(string $string, array $allowedChars);
This function strips anything out of the target $string that is not
a plain-jane alphanumeric character. The function can be made to
overlook certain characters by passing them in $allowedChars
array.

::

    $badString = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($badString);
    // output: scripthtml
    echo Sanitize::paranoid($badString, array(' ', '@'));
    // output: scripthtml    @@


#. ``$badString = ";:<script><html><   // >@@#";``
#. ``echo Sanitize::paranoid($badString);``
#. ``// output: scripthtml``
#. ``echo Sanitize::paranoid($badString, array(' ', '@'));``
#. ``// output: scripthtml    @@``

4.2.1 paranoid
--------------

paranoid(string $string, array $allowedChars);
This function strips anything out of the target $string that is not
a plain-jane alphanumeric character. The function can be made to
overlook certain characters by passing them in $allowedChars
array.

::

    $badString = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($badString);
    // output: scripthtml
    echo Sanitize::paranoid($badString, array(' ', '@'));
    // output: scripthtml    @@


#. ``$badString = ";:<script><html><   // >@@#";``
#. ``echo Sanitize::paranoid($badString);``
#. ``// output: scripthtml``
#. ``echo Sanitize::paranoid($badString, array(' ', '@'));``
#. ``// output: scripthtml    @@``
