7.4 HTML
--------

The role of the HtmlHelper in CakePHP is to make HTML-related
options easier, faster, and more resilient to change. Using this
helper will enable your application to be more light on its feet,
and more flexible on where it is placed in relation to the root of
a domain.

Before we look at HtmlHelper's methods, you'll need to know about a
few configuration and usage situations that will help you use this
class. First in an effort to assuage those who dislike short tags
(<?= ?>) or many echo() calls in their view code all methods of
HtmlHelper are passed to the output() method. If you wish to enable
automatic output of the generated helper HTML you can simply
implement output() in your AppHelper.

::

    function output($str) {
        echo $str;
    }

Doing this will remove the need to add echo statements to your view
code.

Many HtmlHelper methods also include a $htmlAttributes parameter,
that allow you to tack on any extra attributes on your tags. Here
are a few examples of how to use the $htmlAttributes parameter:

::

    Desired attributes: <tag class="someClass" />      
    Array parameter: array('class'=>'someClass')
     
    Desired attributes: <tag name="foo" value="bar" />  
    Array parameter:  array('name' => 'foo', 'value' => 'bar')

The HtmlHelper is available in all views by default. If you're
getting an error informing you that it isn't there, it's usually
due to its name being missing from a manually configured $helpers
controller variable.
