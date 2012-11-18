Js
##

Desde el comienzo, el soporte de CakePHP para Javascript ha sido con
Prototyp/Scriptaculous. Mientras seguimos pensando que estas son unas
excelentes bibliotecas de Javascript, la comunidad ha estado pidiendo
soporte hacia otras bibliotecas. En lugar de tirar Prototype en favor de
otra biblioteca de Javascript. Hemos creado un adaptador basado en los
ayudantes, e incluimos 3 de las bilbiotecas mas solicitadas.
Prototype/Scriptaculous, Mootools/Mootools-more, y jQuery/jQuery UI. And
while the API is not as expansive as the previous AjaxHelper we feel
that the adapter based solution allows for a more extensible solution
giving developers the power and flexibility they need to address their
specific application needs.

Javascript Engines form the backbone of the new JsHelper. A Javascript
engine translates an abstract Javascript element into concrete
Javascript code specific to the Javascript library being used. In
addition they create an extensible system for others to use.

Using a specific Javascript engine
==================================

First of all download your preferred javascript library and place it in
``app/webroot/js``

Then you must include the library in your page. To include it in all
pages, add this ****\ line to the <head> section of
``app/views/layouts/default.ctp`` (copy this file from
``cake/libs/view/layouts/default.ctp`` if you have not created your
own).

::

    echo $this->Html->script('jquery'); // Include jQuery library

Replace ``jquery`` with the name of your library file (.js will be added
to the name).

By default scripts are cached, and you must explicitly print out the
cache. To do this at the end of each page, include this line just before
the ending ``</body>`` tag

::

    echo $this->Js->writeBuffer(); // Write cached scripts

You must include the library in your page and print the cache for the
helper to function.

Javascript engine selection is declared when you include the helper in
your controller.

::

    var $helpers = array('Js' => array('Jquery'));

The above would use the Jquery Engine in the instances of JsHelper in
your views. If you do not declare a specific engine, the jQuery engine
will be used as the default. As mentioned before, there are three
engines implemented in the core, but we encourage the community to
expand the library compatibility.

Using jQuery with other libraries
---------------------------------

The jQuery library, and virtually all of its plugins are constrained
within the jQuery namespace. As a general rule, "global" objects are
stored inside the jQuery namespace as well, so you shouldn't get a clash
between jQuery and any other library (like Prototype, MooTools, or YUI).

That said, there is one caveat: **By default, jQuery uses "$" as a
shortcut for "jQuery"**

To override the "$" shortcut, use the jQueryObject variable.

::

    $this->Js->JqueryEngine->jQueryObject = '$j';
    print $this->Html->scriptBlock('var $j = jQuery.noConflict();', 
        array('inline' => false)); //Tell jQuery to go into noconflict mode

Using the JsHelper inside customHelpers
---------------------------------------

Declare the JsHelper in the ``$helpers`` array in your customHelper.

::

    var $helpers = array('Js');

It is not possible to declare a javascript engine inside a custom
helper. Doing that will have no effect.

If you are willing to use an other javascript engine than the default,
do the helper setup in your controller as follows:

::

    var $helpers = array(
        'Js' => array('Prototype'),
        'CustomHelper'
    );

Be sure to declare the JsHelper and its engine **on top** of the
``$helpers`` array in your controller.

The selected javascript engine may disappear (replaced by the default)
from the jsHelper object in your helper, if you miss to do so and you
will get code that does not fit your javascript library.

Creating a Javascript Engine
============================

Javascript engine helpers follow normal helper conventions, with a few
additional restrictions. They must have the ``Engine`` suffix.
``DojoHelper`` is not good, ``DojoEngineHelper`` is correct.
Furthermore, they should extend ``JsBaseEngineHelper`` in order to
leverage the most of the new API.

Javascript engine usage
=======================

The ``JsHelper`` provides a few methods, and acts as a facade for the
the Engine helper. You should not directly access the Engine helper
except in rare occasions. Using the facade features of the ``JsHelper``
allows you to leverage the buffering and method chaining features
built-in; (method chaining only works in PHP5).

The ``JsHelper`` by default buffers almost all script code generated,
allowing you to collect scripts throughout the view, elements and
layout, and output it in one place. Outputting buffered scripts is done
with ``$this->Js->writeBuffer();`` this will return the buffer contents
in a script tag. You can disable buffering wholesale with the
``$bufferScripts`` property or setting ``buffer => false`` in methods
taking ``$options``.

Since most methods in Javascript begin with a selection of elements in
the DOM, ``$this->Js->get()`` returns a $this, allowing you to chain the
methods using the selection. Method chaining allows you to write
shorter, more expressive code. It should be noted that method chaining
**Will not** work in PHP4.

::

    $this->Js->get('#foo')->event('click', $eventCode);

Is an example of method chaining. Method chaining is not possible in
PHP4 and the above sample would be written like:

::

    $this->Js->get('#foo');
    $this->Js->event('click', $eventCode);

Common options
--------------

In attempts to simplify development where Js libraries can change, a
common set of options is supported by ``JsHelper``, these common options
will be mapped out to the library specific options internally. If you
are not planning on switching Javascript libraries, each library also
supports all of its native callbacks and options.

Callback wrapping
-----------------

By default all callback options are wrapped with the an anonymous
function with the correct arguments. You can disable this behavior by
supplying the ``wrapCallbacks = false`` in your options array.

Working with buffered scripts
-----------------------------

One drawback to previous implementation of 'Ajax' type features was the
scattering of script tags throughout your document, and the inability to
buffer scripts added by elements in the layout. The new JsHelper if used
correctly avoids both of those issues. It is recommended that you place
``$this->Js->writeBuffer()`` at the bottom of your layout file above the
``</body>`` tag. This will allow all scripts generated in layout
elements to be output in one place. It should be noted that buffered
scripts are handled separately from included script files.

writeBuffer($options = array())

Writes all Javascript generated so far to a code block or caches them to
a file and returns a linked script.

**Options**

-  ``inline`` - Set to true to have scripts output as a script block
   inline if ``cache`` is also true, a script link tag will be
   generated. (default true)
-  ``cache`` - Set to true to have scripts cached to a file and linked
   in (default false)
-  ``clear`` - Set to false to prevent script cache from being cleared
   (default true)
-  ``onDomReady`` - wrap cached scripts in domready event (default true)
-  ``safe`` - if an inline block is generated should it be wrapped in
   <![CDATA[ ... ]]> (default true)

Creating a cache file with ``writeBuffer()`` requires that
``webroot/js`` be world writable and allows a browser to cache generated
script resources for any page.

buffer($content)

Add ``$content`` to the internal script buffer.

getBuffer($clear = true)

Get the contents of the current buffer. Pass in false to not clear the
buffer at the same time.

**Buffering methods that are not normally buffered**

Some methods in the helpers are buffered by default. The engines buffer
the following methods by default:

-  event
-  sortable
-  drag
-  drop
-  slider

Additionally you can force any other method in JsHelper to use the
buffering. By appending an boolean to the end of the arguments you can
force other methods to go into the buffer. For example the ``each()``
method does not normally buffer.

::

    $this->Js->each('alert("whoa!");', true);

The above would force the ``each()`` method to use the buffer.
Conversely if you want a method that does buffer to not buffer, you can
pass a ``false`` in as the last argument.

::

    $this->Js->event('click', 'alert("whoa!");', false);

This would force the event function which normally buffers to return its
result.

Methods
=======

The core Javascript Engines provide the same feature set across all
libraries, there is also a subset of common options that are translated
into library specific options. This is done to provide end developers
with as unified an API as possible. The following list of methods are
supported by all the Engines included in the CakePHP core. Whenever you
see separate lists for ``Options`` and ``Event Options`` both sets of
parameters are supplied in the ``$options`` array for the method.

object($data, $options = array())

Converts values into JSON. There are a few differences between this
method and JavascriptHelper::object(). Most notably there is no
affordance for ``stringKeys`` or ``q`` options found in the
JavascriptHelper. Furthermore ``$this->Js->object();`` cannot make
script tags.

**Options:**

-  ``prefix`` - String prepended to the returned data.
-  ``postfix`` - String appended to the returned data.

**Example Use:**

::

    $json = $this->Js->object($data);

sortable($options = array())

Sortable generates a javascript snippet to make a set of elements
(usually a list) drag and drop sortable.

The normalized options are:

**Options**

-  ``containment`` - Container for move action
-  ``handle`` - Selector to handle element. Only this element will start
   sort action.
-  ``revert`` - Whether or not to use an effect to move sortable into
   final position.
-  ``opacity`` - Opacity of the placeholder
-  ``distance`` - Distance a sortable must be dragged before sorting
   starts.

**Event Options**

-  ``start`` - Event fired when sorting starts
-  ``sort`` - Event fired during sorting
-  ``complete`` - Event fired when sorting completes.

Other options are supported by each Javascript library, and you should
check the documentation for your javascript library for more detailed
information on its options and parameters.

**Example use:**

::

    $this->Js->get('#my-list');
        $this->Js->sortable(array(
            'distance' => 5,
            'containment' => 'parent',
            'start' => 'onStart',
            'complete' => 'onStop',
            'sort' => 'onSort',
            'wrapCallbacks' => false
        ));

Assuming you were using the jQuery engine, you would get the following
code in your generated Javascript block:

::

    $("#myList").sortable({containment:"parent", distance:5, sort:onSort, start:onStart, stop:onStop});

request($url, $options = array())

Generate a javascript snippet to create an ``XmlHttpRequest`` or 'AJAX'
request.

**Event Options**

-  ``complete`` - Callback to fire on complete.
-  ``success`` - Callback to fire on success.
-  ``before`` - Callback to fire on request initialization.
-  ``error`` - Callback to fire on request failure.

**Options**

-  ``method`` - The method to make the request with defaults to GET in
   more libraries
-  ``async`` - Whether or not you want an asynchronous request.
-  ``data`` - Additional data to send.
-  ``update`` - Dom id to update with the content of the request.
-  ``type`` - Data type for response. 'json' and 'html' are supported.
   Default is html for most libraries.
-  ``evalScripts`` - Whether or not <script> tags should be eval'ed.
-  ``dataExpression`` - Should the ``data`` key be treated as a
   callback. Useful for supplying ``$options['data']`` as another
   Javascript expression.

**Example use**

::

    $this->Js->event('click',
    $this->Js->request(array(
    'action' => 'foo', param1), array(
    'async' => true,
    'update' => '#element')));

get($selector)

Set the internal 'selection' to a CSS selector. The active selection is
used in subsequent operations until a new selection is made.

::

    $this->Js->get('#element');

The ``JsHelper`` now will reference all other element based methods on
the selection of ``#element``. To change the active selection, call
``get()`` again with a new element.

drag($options = array())

Make an element draggable.

**Options**

-  ``handle`` - selector to the handle element.
-  ``snapGrid`` - The pixel grid that movement snaps to, an array(x, y)
-  ``container`` - The element that acts as a bounding box for the
   draggable element.

**Event Options**

-  ``start`` - Event fired when the drag starts
-  ``drag`` - Event fired on every step of the drag
-  ``stop`` - Event fired when dragging stops (mouse release)

**Example use**

::

    $this->Js->get('#element');
    $this->Js->drag(array(
        'container' => '#content',
        'start' => 'onStart',
        'drag' => 'onDrag',
        'stop' => 'onStop',
        'snapGrid' => array(10, 10),
        'wrapCallbacks' => false
    ));

If you were using the jQuery engine the following code would be added to
the buffer.

::

    $("#element").draggable({containment:"#content", drag:onDrag, grid:[10,10], start:onStart, stop:onStop});

drop($options = array())

Make an element accept draggable elements and act as a dropzone for
dragged elements.

**Options**

-  ``accept`` - Selector for elements this droppable will accept.
-  ``hoverclass`` - Class to add to droppable when a draggable is over.

**Event Options**

-  ``drop`` - Event fired when an element is dropped into the drop zone.
-  ``hover`` - Event fired when a drag enters a drop zone.
-  ``leave`` - Event fired when a drag is removed from a drop zone
   without being dropped.

**Example use**

::

    $this->Js->get('#element');
    $this->Js->drop(array(
        'accept' => '.items',
        'hover' => 'onHover',
        'leave' => 'onExit',
        'drop' => 'onDrop',
        'wrapCallbacks' => false
    ));

If you were using the jQuery engine the following code would be added to
the buffer:

::

    <code class=
    "php">$("#element").droppable({accept:".items", drop:onDrop, out:onExit, over:onHover});</code>

**''Note'' about MootoolsEngine::drop**

Droppables in Mootools function differently from other libraries.
Droppables are implemented as an extension of Drag. So in addtion to
making a get() selection for the droppable element. You must also
provide a selector rule to the draggable element. Furthermore, Mootools
droppables inherit all options from Drag.

slider()

Create snippet of Javascript that converts an element into a slider ui
widget. See your libraries implementation for additional usage and
features.

**Options**

-  ``handle`` - The id of the element used in sliding.
-  ``direction`` - The direction of the slider either 'vertical' or
   'horizontal'
-  ``min`` - The min value for the slider.
-  ``max`` - The max value for the slider.
-  ``step`` - The number of steps or ticks the slider will have.
-  ``value`` - The initial offset of the slider.

**Events**

-  ``change`` - Fired when the slider's value is updated
-  ``complete`` - Fired when the user stops sliding the handle

**Example use**

::

    $this->Js->get('#element');
    $this->Js->slider(array(
        'complete' => 'onComplete',
        'change' => 'onChange',
        'min' => 0,
        'max' => 10,
        'value' => 2,
        'direction' => 'vertical',
        'wrapCallbacks' => false
    ));

If you were using the jQuery engine the following code would be added to
the buffer:

::

    $("#element").slider({change:onChange, max:10, min:0, orientation:"vertical", stop:onComplete, value:2});

effect($name, $options = array())

Creates a basic effect. By default this method is not buffered and
returns its result.

**Supported effect names**

The following effects are supported by all JsEngines

-  ``show`` - reveal an element.
-  ``hide`` - hide an element.
-  ``fadeIn`` - Fade in an element.
-  ``fadeOut`` - Fade out an element.
-  ``slideIn`` - Slide an element in.
-  ``slideOut`` - Slide an element out.

**Options**

-  ``speed`` - Speed at which the animation should occur. Accepted
   values are 'slow', 'fast'. Not all effects use the speed option.

**Example use**

If you were using the jQuery engine.

::

    $this->Js->get('#element');
    $result = $this->Js->effect('fadeIn');

    //$result contains $("#foo").fadeIn();

event($type, $content, $options = array())

Bind an event to the current selection. ``$type`` can be any of the
normal DOM events or a custom event type if your library supports them.
``$content`` should contain the function body for the callback.
Callbacks will be wrapped with ``function (event) { ... }`` unless
disabled with the ``$options``.

**Options**

-  ``wrap`` - Whether you want the callback wrapped in an anonymous
   function. (defaults to true)
-  ``stop`` - Whether you want the event to stopped. (defaults to true)

**Example use**

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'));

If you were using the jQuery library you would get the following
Javascript code.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
        return false;
    });

You can remove the ``return false;`` by passing setting the ``stop``
option to false.

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'), array('stop' => false));

If you were using the jQuery library you would the following Javascript
code would be added to the buffer. Note that the default browser event
is not cancelled.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
    });

domReady($callback)

Creates the special 'DOM ready' event. ``writeBuffer()`` automatically
wraps the buffered scripts in a domReady method.

each($callback)

Create a snippet that iterates over the currently selected elements, and
inserts ``$callback``.

**Example**

::

    $this->Js->get('div.message');
    $this->Js->each('$(this).css({color: "red"});');

Using the jQuery engine would create the following Javascript

::

    $('div.message').each(function () { $(this).css({color: "red"});});

alert($message)

Create a javascript snippet containing an ``alert()`` snippet. By
default, ``alert`` does not buffer, and returns the script snippet.

::

    $alert = $this->Js->alert('Hey there');

confirm($message)

Create a javascript snippet containing a ``confirm()`` snippet. By
default, ``confirm`` does not buffer, and returns the script snippet.

::

    $alert = $this->Js->confirm('Are you sure?');

prompt($message, $default)

Create a javascript snippet containing a ``prompt()`` snippet. By
default, ``prompt`` does not buffer, and returns the script snippet.

::

    $prompt = $this->Js->prompt('What is your favorite color?', 'blue');

submit()

Create a submit input button that enables ``XmlHttpRequest`` submitted
forms. Options can include
 both those for FormHelper::submit() and JsBaseEngine::request(),
JsBaseEngine::event();

Forms submitting with this method, cannot send files. Files do not
transfer over ``XmlHttpRequest``
 and require an iframe, or other more specialized setups that are beyond
the scope of this helper.

**Options**

-  ``confirm`` - Confirm message displayed before sending the request.
   Using confirm, does not replace any ``before`` callback methods in
   the generated XmlHttpRequest.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.
-  ``wrapCallbacks`` - Set to false to disable automatic callback
   wrapping.

**Example use**

::

    echo $this->Js->submit('Save', array('update' => '#content'));

Will create a submit button with an attached onclick event. The click
event will be buffered by default.

::

    echo $this->Js->submit('Save', array('update' => '#content', 'div' => false, 'type' => 'json', 'async' => false));

Shows how you can combine options that both ``FormHelper::submit()`` and
``Js::request()`` when using submit.

link($title, $url = null, $options = array())

Create an html anchor element that has a click event bound to it.
Options can include both those for HtmlHelper::link() and
JsBaseEngine::request(), JsBaseEngine::event(); ``$htmlAttributes`` is
used to specify additional options that are supposed to be appended to
the generated anchor element. If an option is not part of the standard
attributes or ``$htmlAttributes`` it will be passed to ``request()`` as
an option. If an id is not supplied, a randomly generated one will be
created for each link generated.

**Options**

-  ``confirm`` - Generate a confirm() dialog before sending the event.
-  ``id`` - use a custom id.
-  ``htmlAttributes`` - additional non-standard htmlAttributes. Standard
   attributes are class, id, rel, title, escape, onblur and onfocus.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.

**Example use**

::

    echo $this->Js->link('Page 2', array('page' => 2), array('update' => '#content'));

Will create a link pointing to ``/page:2`` and updating #content with
the response.

You can use the ``htmlAttributes`` option to add in additional custom
attributes.

::

    echo $this->Js->link('Page 2', array('page' => 2), array(
        'update' =&gt; '#content',
        'htmlAttributes' =&gt; array('other' =&gt; 'value')
    ));


    //Creates the following html
    <a href="/es/posts/index/page:2" other="value">Page 2</a>

serializeForm($options = array())

Serialize the form attached to $selector. Pass ``true`` for $isForm if
the current selection is a form element. Converts the form or the form
element attached to the current selection into a string/json object
(depending on the library implementation) for use with XHR operations.

**Options**

-  ``isForm`` - is the current selection a form, or an input? (defaults
   to false)
-  ``inline`` - is the rendered statement going to be used inside
   another JS statement? (defaults to false)

Setting inline == false allows you to remove the trailing ``;``. This is
useful when you need to serialize a form element as part of another
Javascript operation, or use the serialize method in an Object literal.

redirect($url)

Redirect the page to ``$url`` using ``window.location``.

value($value)

Converts a PHP-native variable of any type to a JSON-equivalent
representation. Escapes any string values into JSON compatible strings.
UTF-8 characters will be escaped.

Ajax Pagination
===============

Much like Ajax Pagination in 1.2, you can use the JsHelper to handle the
creation of Ajax pagination links instead of plain HTML links.

Making Ajax Links
-----------------

Before you can create ajax links you must include the Javascript library
that matches the adapter you are using with ``JsHelper``. By default the
``JsHelper`` uses jQuery. So in your layout include jQuery (or whichever
library you are using). Also make sure to include
``RequestHandlerComponent`` in your components. Add the following to
your controller:

::

    var $components = array('RequestHandler');
    var $helpers = array('Js');

Next link in the javascript library you want to use. For this example
we'll be using jQuery.

::

    echo $this->Html->script('jquery');

Similar to 1.2 you need to tell the ``PaginatorHelper`` that you want to
make Javascript enhanced links instead of plain HTML ones. To do so you
use ``options()``

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true
    ));

The ``PaginatorHelper`` now knows to make javascript enhanced links, and
that those links should update the ``#content`` element. Of course this
element must exist, and often times you want to wrap
``$content_for_layout`` with a div matching the id used for the
``update`` option. You also should set ``evalScripts`` to true if you
are using the Mootools or Prototype adapters, without ``evalScripts``
these libraries will not be able to chain requests together. The
``indicator`` option is not supported by ``JsHelper`` and will be
ignored.

You then create all the links as needed for your pagination features.
Since the ``JsHelper`` automatically buffers all generated script
content to reduce the number of ``<script>`` tags in your source code
you **must** call write the buffer out. At the bottom of your view file.
Be sure to include:

::

    echo $this->Js->writeBuffer();

If you omit this you will **not** be able to chain ajax pagination
links. When you write the buffer, it is also cleared, so you don't have
worry about the same Javascript being output twice.

Adding effects and transitions
------------------------------

Since ``indicator`` is no longer supported, you must add any indicator
effects yourself.

::

    <html>
        <head>
            <?php echo $this->Html->script('jquery'); ?>
            //more stuff here.
        </head>
        <body>
        <div id="content">
            <?php echo $content_for_layout; ?>
        </div>
        <?php echo $this->Html->image('indicator.gif', array('id' => 'busy-indicator')); ?>
        </body>
    </html>

Remember to place the indicator.gif file inside app/webroot/img folder.
You may see a situation where the indicator.gif displays immediately
upon the page load. You need to put in this css
``#busy-indicator { display:none; }`` in your main css file.

With the above layout, we've included an indicator image file, that will
display a busy indicator animation that we will show and hide with the
``JsHelper``. To do that we need to update our ``options()`` function.

::

    $this->Paginator->options(array(
        'update' => '#content',
        'evalScripts' => true,
        'before' => $this->Js->get('#busy-indicator')->effect('fadeIn', array('buffer' => false)),
        'complete' => $this->Js->get('#busy-indicator')->effect('fadeOut', array('buffer' => false)),
    ));

This will show/hide the busy-indicator element before and after the
``#content`` div is updated. Although ``indicator`` has been removed,
the new features offered by ``JsHelper`` allow for more control and more
complex effects to be created.
