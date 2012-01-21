Data Sanitization
#################

.. php:class:: Sanitize

The CakePHP Sanitize class can be used to rid user-submitted data
of malicious data and other unwanted information. Sanitize is a
core library, so it can be used anywhere inside of your code, but
is probably best used in controllers or models.

CakePHP already protects you against SQL Injection **if** you use
CakePHP's ORM methods (such as find() and save()) and proper array
notation (ie. array('field' => $value)) instead of raw SQL. For
sanitization against XSS it's generally better to save raw HTML in
database without modification and sanitize at the time of
output/display.

All you need to do is include the Sanitize core library (e.g.
before the controller class definition)::

    <?php
    App::uses('Sanitize', 'Utility');
    
    class MyController extends AppController {
        ...
        ...
    }

Once you've done that, you can make calls to Sanitize statically.

.. php:staticmethod:: Sanitize::clean($data, $options)

    :param mixed $data: Data to clean.
    :param mixed $options: Options to use when cleaning, see below.

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

    Usage of clean() with options looks something like the following::

        <?php
        $this->data = Sanitize::clean($this->data, array('encode' => false));


.. php:staticmethod:: Sanitize::escape($string, $connection)

    :param string $string: Data to clean.
    :param string $connection: The name of the database to quote the string for, 
        as named in your app/Config/database.php file.

    Used to escape SQL statements by adding slashes, depending on the
    system's current magic\_quotes\_gpc setting,


.. php:staticmethod:: Sanitize::html($string, $options = array())

    :param string $string: Data to clean.
    :param array $options: An array of options to use, see below.

    This method prepares user-submitted data for display inside HTML.
    This is especially useful if you don't want users to be able to
    break your layouts or insert images or scripts inside of your HTML
    pages. If the $remove option is set to true, HTML content detected
    is removed rather than rendered as HTML entities::

        <?php
        $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
        echo Sanitize::html($badString);
        // output: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
        echo Sanitize::html($badString, array('remove' => true));
        // output: HEY...

    Escaping is often a better strategy than stripping, as it has less room
    for error, and isn't vulnerable to new types of attacks, the stripping 
    function does not know about.

.. php:staticmethod:: Sanitize::paranoid($string, $allowedChars)

    :param string $string: Data to clean.
    :param string $allowedChars: An array of non alpha numeric characters allowed.

    This function strips anything out of the target $string that is not
    a plain-jane alphanumeric character. The function can be made to
    overlook certain characters by passing them in $allowedChars
    array::

        <?php
        $badString = ";:<script><html><   // >@@#";
        echo Sanitize::paranoid($badString);
        // output: scripthtml
        echo Sanitize::paranoid($badString, array(' ', '@'));
        // output: scripthtml    @@


.. meta::
    :title lang=en: Data Sanitization
    :keywords lang=en: array notation,sql security,sql function,malicious data,controller class,data options,raw html,core library,carriage returns,database connection,orm,industrial strength,slashes,chars,multi purpose,arrays,cakephp,element,models