7.4.2 Changing the tags output by HtmlHelper
--------------------------------------------

The built in tag sets for ``HtmlHelper`` are XHTML compliant,
however if you need to generate HTML for HTML4 you will need to
create and load a new tags config file containing the tags you'd
like to use. To change the tags used create ``app/config/tags.php``
containing:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );


#. ``$tags = array(``
#. ``'metalink' => '<link href="%s"%s >',``
#. ``'input' => '<input name="%s" %s >',``
#. ``//...``
#. ``);``

You can then load this tag set by calling
``$html->loadConfig('tags');``

7.4.2 Changing the tags output by HtmlHelper
--------------------------------------------

The built in tag sets for ``HtmlHelper`` are XHTML compliant,
however if you need to generate HTML for HTML4 you will need to
create and load a new tags config file containing the tags you'd
like to use. To change the tags used create ``app/config/tags.php``
containing:

::

    $tags = array(
        'metalink' => '<link href="%s"%s >',
        'input' => '<input name="%s" %s >',
        //...
    );


#. ``$tags = array(``
#. ``'metalink' => '<link href="%s"%s >',``
#. ``'input' => '<input name="%s" %s >',``
#. ``//...``
#. ``);``

You can then load this tag set by calling
``$html->loadConfig('tags');``
