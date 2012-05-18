The Request Handler Component
#############################

The Request Handler component is used in Cake to determine information
about the incoming HTTP request. You can use it to better inform your
controller about AJAX requests, get information about the remote
client's IP address and request type, or strip unwanted data from
output. To use the Request Handler component, you'll need to make sure
it is specified in your controller's $components array::

    <?php
    class ThingsController extends AppController
    {
        var $components = array('RequestHandler');

        // ...
    }

Getting Client/Request Information
==================================

Let's just dive in:

-  **accepts**
-  string *$type*

Returns information about the content-types that the client accepts,
depending on the value of $type. If null or no value is passed, it will
return an array of content-types the client accepts. If a string is
passed, it returns true if the client accepts the given type, by
checking $type against the content-type map (see setContent()). If $type
is an array, each string is evaluated individually, and accepts() will
return true if just one of them matches an accepted content-type. For
example::

    <?php
    class PostsController extends AppController
    {
        var $components = array('RequestHandler');

        function beforeFilter ()
        {
            if ($this->RequestHandler->accepts('html'))
            {
                // Execute code only if client accepts an HTML (text/html) response
            }
            elseif ($this->RequestHandler->accepts('rss'))
            {
                // Execute RSS-only code
            }
            elseif ($this->RequestHandler->accepts('atom'))
            {
                // Execute Atom-only code
            }
            elseif ($this->RequestHandler->accepts('xml'))
            {
                // Execute XML-only code
            }

            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom')))
            {
                // Executes if the client accepts any of the above: XML, RSS or Atom
            }
        }
    }

-  **getAjaxVersion**

If you are using the Prototype JS libraries, you can fetch a special
header it sets on AJAX requests. This function returns the Prototype
version used.

-  **getClientIP**

Returns the remote client's IP address.

-  **getReferrer**

Returns the server name from which the request originated.

-  **isAjax**

Returns true if the current request was an XMLHttpRequest.

-  **isAtom**

Returns true if the client accepts Atom feed content
(application/atom+xml).

-  **isDelete**

Returns true if the current request was via DELETE.

-  **isGet**

Returns true if the current request was via GET.

-  **isMobile**

Returns true if the user agent string matches a mobile web browser.

-  **isPost**

Returns true if the current request was via POST.

-  **isPut**

Returns true if the current request was via PUT.

-  **isRss**

Returns true if the clients accepts RSS feed content
(application/rss+xml).

-  **isXml**

Returns true if the client accepts XML content (application/xml or
text/xml).

-  **setContent**
-  string *$name*
-  string *$type*

Adds a content-type alias mapping, for use with accepts() and prefers(),
where $name is the name of the mapping (string), and $type is either a
string or an array of strings, each of which is a MIME type. The
built-in type mappings are as follows::

    // Name     => Type
      'js'      => 'text/javascript',
      'css'     => 'text/css',
      'html'    => 'text/html',
      'form'    => 'application/x-www-form-urlencoded',
      'file'    => 'multipart/form-data',
      'xhtml'   => array('application/xhtml+xml', 'application/xhtml', 'text/xhtml'),
      'xml'     => array('application/xml', 'text/xml'),
      'rss'     => 'application/rss+xml',
      'atom'    => 'application/atom+xml'

Stripping Data
==============

Occasionally you will want to remove data from a request or output. Use
the following Request Handler functions to perform these sorts of
operations.

-  **stripAll**
-  string *$str*

Strips the white space, images, and scripts from $str (using
stripWhitespace(), stripImages(), and stripScripts()).

-  **stripImages**
-  string *$str*

Strips any HTML embedded images from $str.

-  **stripScripts**
-  string *$str*

Strips any <script> and <style> related tags from $str.

-  **stripTags**
-  string *$str*
-  string *$tag1*
-  string *$tag2...*

Removes the tags specified by $tag1, $tag2, etc. from $str::

    <?php
    $someString = '<font color="#FF0000"><bold>Foo</bold></font> <em>Bar</em>';

    echo $this->RequestHandler->stripTags($someString, 'font', 'bold');

    // output: Foo <em>Bar</em>

-  **stripWhiteSpace**
-  string *$str*

Strips whitespace from $str.

Other Useful Functions
======================

The Request Handler component is especially useful when your application
includes AJAX requests. The setAjax() function is used to automatically
detect AJAX requests, and set the controller's layout to an AJAX layout
for that request. The benefit here is that you can make small modular
views that can also double as AJAX views::

    // list.thtml
    <ul>
    <?php foreach ($things as $thing):?>
    <li><?php echo $thing;?></li>
    <?endforeach;?>
    </ul>

    //-------------------------------------------------------------

    //The list action of my ThingsController:
    function list()
    {
        $this->RequestHandler->setAjax($this);
        $this->set('things', $this->Thing->findAll());
    } 

When a normal browser request is made to /things/list, the unordered
list is rendered inside of the default layout for the application. If
the URL is requested as part of an AJAX operation, the list is
automatically rendered in the bare AJAX layout.
