7.5.4 Methods
-------------

The core Javascript Engines provide the same feature set across all
libraries, there is also a subset of common options that are
translated into library specific options. This is done to provide
end developers with as unified an API as possible. The following
list of methods are supported by all the Engines included in the
CakePHP core. Whenever you see separate lists for ``Options`` and
``Event Options`` both sets of parameters are supplied in the
``$options`` array for the method.

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


#. ``$json = $this->Js->object($data);``

sortable($options = array())

Sortable generates a javascript snippet to make a set of elements
(usually a list) drag and drop sortable.

The normalized options are:

**Options**


-  ``containment`` - Container for move action
-  ``handle`` - Selector to handle element. Only this element will
   start sort action.
-  ``revert`` - Whether or not to use an effect to move sortable
   into final position.
-  ``opacity`` - Opacity of the placeholder
-  ``distance`` - Distance a sortable must be dragged before
   sorting starts.

**Event Options**


-  ``start`` - Event fired when sorting starts
-  ``sort`` - Event fired during sorting
-  ``complete`` - Event fired when sorting completes.

Other options are supported by each Javascript library, and you
should check the documentation for your javascript library for more
detailed information on its options and parameters.

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


#. ``$this->Js->get('#my-list');``
#. ``$this->Js->sortable(array(``
#. ``'distance' => 5,``
#. ``'containment' => 'parent',``
#. ``'start' => 'onStart',``
#. ``'complete' => 'onStop',``
#. ``'sort' => 'onSort',``
#. ``'wrapCallbacks' => false``
#. ``));``

Assuming you were using the jQuery engine, you would get the
following code in your generated Javascript block:

::

    $("#myList").sortable({containment:"parent", distance:5, sort:onSort, start:onStart, stop:onStop});


#. ``$("#myList").sortable({containment:"parent", distance:5, sort:onSort, start:onStart, stop:onStop});``

request($url, $options = array())

Generate a javascript snippet to create an ``XmlHttpRequest`` or
'AJAX' request.

**Event Options**


-  ``complete`` - Callback to fire on complete.
-  ``success`` - Callback to fire on success.
-  ``before`` - Callback to fire on request initialization.
-  ``error`` - Callback to fire on request failure.

**Options**


-  ``method`` - The method to make the request with defaults to GET
   in more libraries
-  ``async`` - Whether or not you want an asynchronous request.
-  ``data`` - Additional data to send.
-  ``update`` - Dom id to update with the content of the request.
-  ``type`` - Data type for response. 'json' and 'html' are
   supported. Default is html for most libraries.
-  ``evalScripts`` - Whether or not <script> tags should be
   eval'ed.
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


#. ``$this->Js->event('click',``
#. ``$this->Js->request(array(``
#. ``'action' => 'foo', param1), array(``
#. ``'async' => true,``
#. ``'update' => '#element')));``

get($selector)

Set the internal 'selection' to a CSS selector. The active
selection is used in subsequent operations until a new selection is
made.

::

    $this->Js->get('#element');


#. ``$this->Js->get('#element');``

The ``JsHelper`` now will reference all other element based methods
on the selection of ``#element``. To change the active selection,
call ``get()`` again with a new element.

drag($options = array())

Make an element draggable.

**Options**


-  ``handle`` - selector to the handle element.
-  ``snapGrid`` - The pixel grid that movement snaps to, an
   array(x, y)
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


#. ``$this->Js->get('#element');``
#. ``$this->Js->drag(array(``
#. ``'container' => '#content',``
#. ``'start' => 'onStart',``
#. ``'drag' => 'onDrag',``
#. ``'stop' => 'onStop',``
#. ``'snapGrid' => array(10, 10),``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer.

::

    $("#element").draggable({containment:"#content", drag:onDrag, grid:[10,10], start:onStart, stop:onStop});


#. ``$("#element").draggable({containment:"#content", drag:onDrag, grid:[10,10], start:onStart, stop:onStop});``

drop($options = array())

Make an element accept draggable elements and act as a dropzone for
dragged elements.

**Options**


-  ``accept`` - Selector for elements this droppable will accept.
-  ``hoverclass`` - Class to add to droppable when a draggable is
   over.

**Event Options**


-  ``drop`` - Event fired when an element is dropped into the drop
   zone.
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


#. ``$this->Js->get('#element');``
#. ``$this->Js->drop(array(``
#. ``'accept' => '.items',``
#. ``'hover' => 'onHover',``
#. ``'leave' => 'onExit',``
#. ``'drop' => 'onDrop',``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer:

::

    <code class=
    "php">$("#element").droppable({accept:".items", drop:onDrop, out:onExit, over:onHover});</code>


#. ``<code class=``
#. ``"php">$("#element").droppable({accept:".items", drop:onDrop, out:onExit, over:onHover});</code>``

**''Note'' about MootoolsEngine::drop**

Droppables in Mootools function differently from other libraries.
Droppables are implemented as an extension of Drag. So in addtion
to making a get() selection for the droppable element. You must
also provide a selector rule to the draggable element. Furthermore,
Mootools droppables inherit all options from Drag.

slider()

Create snippet of Javascript that converts an element into a slider
ui widget. See your libraries implementation for additional usage
and features.

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


#. ``$this->Js->get('#element');``
#. ``$this->Js->slider(array(``
#. ``'complete' => 'onComplete',``
#. ``'change' => 'onChange',``
#. ``'min' => 0,``
#. ``'max' => 10,``
#. ``'value' => 2,``
#. ``'direction' => 'vertical',``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer:

::

    $("#element").slider({change:onChange, max:10, min:0, orientation:"vertical", stop:onComplete, value:2});


#. ``$("#element").slider({change:onChange, max:10, min:0, orientation:"vertical", stop:onComplete, value:2});``

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


#. ``$this->Js->get('#element');``
#. ``$result = $this->Js->effect('fadeIn');``
#. ``//$result contains $("#foo").fadeIn();``

event($type, $content, $options = array())

Bind an event to the current selection. ``$type`` can be any of the
normal DOM events or a custom event type if your library supports
them. ``$content`` should contain the function body for the
callback. Callbacks will be wrapped with
``function (event) { ... }`` unless disabled with the
``$options``.

**Options**


-  ``wrap`` - Whether you want the callback wrapped in an anonymous
   function. (defaults to true)
-  ``stop`` - Whether you want the event to stopped. (defaults to
   true)

**Example use**

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'));


#. ``$this->Js->get('#some-link');``
#. ``$this->Js->event('click', $this->Js->alert('hey you!'));``

If you were using the jQuery library you would get the following
Javascript code.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
        return false;
    });


#. ``$('#some-link').bind('click', function (event) {``
#. ``alert('hey you!');``
#. ``return false;``
#. ``});``

You can remove the ``return false;`` by passing setting the
``stop`` option to false.

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'), array('stop' => false));


#. ``$this->Js->get('#some-link');``
#. ``$this->Js->event('click', $this->Js->alert('hey you!'), array('stop' => false));``

If you were using the jQuery library you would the following
Javascript code would be added to the buffer. Note that the default
browser event is not cancelled.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
    });


#. ``$('#some-link').bind('click', function (event) {``
#. ``alert('hey you!');``
#. ``});``

domReady($callback)

Creates the special 'DOM ready' event. ``writeBuffer()``
automatically wraps the buffered scripts in a domReady method.

each($callback)

Create a snippet that iterates over the currently selected
elements, and inserts ``$callback``.

**Example**

::

    $this->Js->get('div.message');
    $this->Js->each('$(this).css({color: "red"});');


#. ``$this->Js->get('div.message');``
#. ``$this->Js->each('$(this).css({color: "red"});');``

Using the jQuery engine would create the following Javascript

::

    $('div.message').each(function () { $(this).css({color: "red"});});


#. ``$('div.message').each(function () { $(this).css({color: "red"});});``

alert($message)

Create a javascript snippet containing an ``alert()`` snippet. By
default, ``alert`` does not buffer, and returns the script
snippet.

::

    $alert = $this->Js->alert('Hey there');


#. ``$alert = $this->Js->alert('Hey there');``

confirm($message)

Create a javascript snippet containing a ``confirm()`` snippet. By
default, ``confirm`` does not buffer, and returns the script
snippet.

::

    $alert = $this->Js->confirm('Are you sure?');


#. ``$alert = $this->Js->confirm('Are you sure?');``

prompt($message, $default)

Create a javascript snippet containing a ``prompt()`` snippet. By
default, ``prompt`` does not buffer, and returns the script
snippet.

::

    $prompt = $this->Js->prompt('What is your favorite color?', 'blue');


#. ``$prompt = $this->Js->prompt('What is your favorite color?', 'blue');``

submit()

Create a submit input button that enables ``XmlHttpRequest``
submitted forms. Options can include
both those for FormHelper::submit() and JsBaseEngine::request(),
JsBaseEngine::event();

Forms submitting with this method, cannot send files. Files do not
transfer over ``XmlHttpRequest``
and require an iframe, or other more specialized setups that are
beyond the scope of this helper.

**Options**


-  ``confirm`` - Confirm message displayed before sending the
   request. Using confirm, does not replace any ``before`` callback
   methods in the generated XmlHttpRequest.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.
-  ``wrapCallbacks`` - Set to false to disable automatic callback
   wrapping.

**Example use**

::

    echo $this->Js->submit('Save', array('update' => '#content'));


#. ``echo $this->Js->submit('Save', array('update' => '#content'));``

Will create a submit button with an attached onclick event. The
click event will be buffered by default.

::

    echo $this->Js->submit('Save', array('update' => '#content', 'div' => false, 'type' => 'json', 'async' => false));


#. ``echo $this->Js->submit('Save', array('update' => '#content', 'div' => false, 'type' => 'json', 'async' => false));``

Shows how you can combine options that both
``FormHelper::submit()`` and ``Js::request()`` when using submit.

link($title, $url = null, $options = array())

Create an html anchor element that has a click event bound to it.
Options can include both those for HtmlHelper::link() and
JsBaseEngine::request(), JsBaseEngine::event(); ``$htmlAttributes``
is used to specify additional options that are supposed to be
appended to the generated anchor element. If an option is not part
of the standard attributes or ``$htmlAttributes`` it will be passed
to ``request()`` as an option. If an id is not supplied, a randomly
generated one will be created for each link generated.

**Options**


-  ``confirm`` - Generate a confirm() dialog before sending the
   event.
-  ``id`` - use a custom id.
-  ``htmlAttributes`` - additional non-standard htmlAttributes.
   Standard attributes are class, id, rel, title, escape, onblur and
   onfocus.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.

**Example use**

::

    echo $this->Js->link('Page 2', array('page' => 2), array('update' => '#content'));


#. ``echo $this->Js->link('Page 2', array('page' => 2), array('update' => '#content'));``

Will create a link pointing to ``/page:2`` and updating #content
with the response.

You can use the ``htmlAttributes`` option to add in additional
custom attributes.

::

    echo $this->Js->link('Page 2', array('page' => 2), array(
        'update' =&gt; '#content',
        'htmlAttributes' =&gt; array('other' =&gt; 'value')
    ));
    
    
    //Creates the following html
    <a href="/posts/index/page:2" other="value">Page 2</a>


#. ``echo $this->Js->link('Page 2', array('page' => 2), array(``
#. ``'update' =&gt; '#content',``
#. ``'htmlAttributes' =&gt; array('other' =&gt; 'value')``
#. ``));``
#. ``//Creates the following html``
#. ``<a href="/posts/index/page:2" other="value">Page 2</a>``

serializeForm($options = array())

Serialize the form attached to $selector. Pass ``true`` for $isForm
if the current selection is a form element. Converts the form or
the form element attached to the current selection into a
string/json object (depending on the library implementation) for
use with XHR operations.

**Options**


-  ``isForm`` - is the current selection a form, or an input?
   (defaults to false)
-  ``inline`` - is the rendered statement going to be used inside
   another JS statement? (defaults to false)

Setting inline == false allows you to remove the trailing ``;``.
This is useful when you need to serialize a form element as part of
another Javascript operation, or use the serialize method in an
Object literal.

redirect($url)

Redirect the page to ``$url`` using ``window.location``.

value($value)

Converts a PHP-native variable of any type to a JSON-equivalent
representation. Escapes any string values into JSON compatible
strings. UTF-8 characters will be escaped.

7.5.4 Methods
-------------

The core Javascript Engines provide the same feature set across all
libraries, there is also a subset of common options that are
translated into library specific options. This is done to provide
end developers with as unified an API as possible. The following
list of methods are supported by all the Engines included in the
CakePHP core. Whenever you see separate lists for ``Options`` and
``Event Options`` both sets of parameters are supplied in the
``$options`` array for the method.

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


#. ``$json = $this->Js->object($data);``

sortable($options = array())

Sortable generates a javascript snippet to make a set of elements
(usually a list) drag and drop sortable.

The normalized options are:

**Options**


-  ``containment`` - Container for move action
-  ``handle`` - Selector to handle element. Only this element will
   start sort action.
-  ``revert`` - Whether or not to use an effect to move sortable
   into final position.
-  ``opacity`` - Opacity of the placeholder
-  ``distance`` - Distance a sortable must be dragged before
   sorting starts.

**Event Options**


-  ``start`` - Event fired when sorting starts
-  ``sort`` - Event fired during sorting
-  ``complete`` - Event fired when sorting completes.

Other options are supported by each Javascript library, and you
should check the documentation for your javascript library for more
detailed information on its options and parameters.

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


#. ``$this->Js->get('#my-list');``
#. ``$this->Js->sortable(array(``
#. ``'distance' => 5,``
#. ``'containment' => 'parent',``
#. ``'start' => 'onStart',``
#. ``'complete' => 'onStop',``
#. ``'sort' => 'onSort',``
#. ``'wrapCallbacks' => false``
#. ``));``

Assuming you were using the jQuery engine, you would get the
following code in your generated Javascript block:

::

    $("#myList").sortable({containment:"parent", distance:5, sort:onSort, start:onStart, stop:onStop});


#. ``$("#myList").sortable({containment:"parent", distance:5, sort:onSort, start:onStart, stop:onStop});``

request($url, $options = array())

Generate a javascript snippet to create an ``XmlHttpRequest`` or
'AJAX' request.

**Event Options**


-  ``complete`` - Callback to fire on complete.
-  ``success`` - Callback to fire on success.
-  ``before`` - Callback to fire on request initialization.
-  ``error`` - Callback to fire on request failure.

**Options**


-  ``method`` - The method to make the request with defaults to GET
   in more libraries
-  ``async`` - Whether or not you want an asynchronous request.
-  ``data`` - Additional data to send.
-  ``update`` - Dom id to update with the content of the request.
-  ``type`` - Data type for response. 'json' and 'html' are
   supported. Default is html for most libraries.
-  ``evalScripts`` - Whether or not <script> tags should be
   eval'ed.
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


#. ``$this->Js->event('click',``
#. ``$this->Js->request(array(``
#. ``'action' => 'foo', param1), array(``
#. ``'async' => true,``
#. ``'update' => '#element')));``

get($selector)

Set the internal 'selection' to a CSS selector. The active
selection is used in subsequent operations until a new selection is
made.

::

    $this->Js->get('#element');


#. ``$this->Js->get('#element');``

The ``JsHelper`` now will reference all other element based methods
on the selection of ``#element``. To change the active selection,
call ``get()`` again with a new element.

drag($options = array())

Make an element draggable.

**Options**


-  ``handle`` - selector to the handle element.
-  ``snapGrid`` - The pixel grid that movement snaps to, an
   array(x, y)
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


#. ``$this->Js->get('#element');``
#. ``$this->Js->drag(array(``
#. ``'container' => '#content',``
#. ``'start' => 'onStart',``
#. ``'drag' => 'onDrag',``
#. ``'stop' => 'onStop',``
#. ``'snapGrid' => array(10, 10),``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer.

::

    $("#element").draggable({containment:"#content", drag:onDrag, grid:[10,10], start:onStart, stop:onStop});


#. ``$("#element").draggable({containment:"#content", drag:onDrag, grid:[10,10], start:onStart, stop:onStop});``

drop($options = array())

Make an element accept draggable elements and act as a dropzone for
dragged elements.

**Options**


-  ``accept`` - Selector for elements this droppable will accept.
-  ``hoverclass`` - Class to add to droppable when a draggable is
   over.

**Event Options**


-  ``drop`` - Event fired when an element is dropped into the drop
   zone.
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


#. ``$this->Js->get('#element');``
#. ``$this->Js->drop(array(``
#. ``'accept' => '.items',``
#. ``'hover' => 'onHover',``
#. ``'leave' => 'onExit',``
#. ``'drop' => 'onDrop',``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer:

::

    <code class=
    "php">$("#element").droppable({accept:".items", drop:onDrop, out:onExit, over:onHover});</code>


#. ``<code class=``
#. ``"php">$("#element").droppable({accept:".items", drop:onDrop, out:onExit, over:onHover});</code>``

**''Note'' about MootoolsEngine::drop**

Droppables in Mootools function differently from other libraries.
Droppables are implemented as an extension of Drag. So in addtion
to making a get() selection for the droppable element. You must
also provide a selector rule to the draggable element. Furthermore,
Mootools droppables inherit all options from Drag.

slider()

Create snippet of Javascript that converts an element into a slider
ui widget. See your libraries implementation for additional usage
and features.

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


#. ``$this->Js->get('#element');``
#. ``$this->Js->slider(array(``
#. ``'complete' => 'onComplete',``
#. ``'change' => 'onChange',``
#. ``'min' => 0,``
#. ``'max' => 10,``
#. ``'value' => 2,``
#. ``'direction' => 'vertical',``
#. ``'wrapCallbacks' => false``
#. ``));``

If you were using the jQuery engine the following code would be
added to the buffer:

::

    $("#element").slider({change:onChange, max:10, min:0, orientation:"vertical", stop:onComplete, value:2});


#. ``$("#element").slider({change:onChange, max:10, min:0, orientation:"vertical", stop:onComplete, value:2});``

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


#. ``$this->Js->get('#element');``
#. ``$result = $this->Js->effect('fadeIn');``
#. ``//$result contains $("#foo").fadeIn();``

event($type, $content, $options = array())

Bind an event to the current selection. ``$type`` can be any of the
normal DOM events or a custom event type if your library supports
them. ``$content`` should contain the function body for the
callback. Callbacks will be wrapped with
``function (event) { ... }`` unless disabled with the
``$options``.

**Options**


-  ``wrap`` - Whether you want the callback wrapped in an anonymous
   function. (defaults to true)
-  ``stop`` - Whether you want the event to stopped. (defaults to
   true)

**Example use**

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'));


#. ``$this->Js->get('#some-link');``
#. ``$this->Js->event('click', $this->Js->alert('hey you!'));``

If you were using the jQuery library you would get the following
Javascript code.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
        return false;
    });


#. ``$('#some-link').bind('click', function (event) {``
#. ``alert('hey you!');``
#. ``return false;``
#. ``});``

You can remove the ``return false;`` by passing setting the
``stop`` option to false.

::

    $this->Js->get('#some-link');
    $this->Js->event('click', $this->Js->alert('hey you!'), array('stop' => false));


#. ``$this->Js->get('#some-link');``
#. ``$this->Js->event('click', $this->Js->alert('hey you!'), array('stop' => false));``

If you were using the jQuery library you would the following
Javascript code would be added to the buffer. Note that the default
browser event is not cancelled.

::

    $('#some-link').bind('click', function (event) {
        alert('hey you!');
    });


#. ``$('#some-link').bind('click', function (event) {``
#. ``alert('hey you!');``
#. ``});``

domReady($callback)

Creates the special 'DOM ready' event. ``writeBuffer()``
automatically wraps the buffered scripts in a domReady method.

each($callback)

Create a snippet that iterates over the currently selected
elements, and inserts ``$callback``.

**Example**

::

    $this->Js->get('div.message');
    $this->Js->each('$(this).css({color: "red"});');


#. ``$this->Js->get('div.message');``
#. ``$this->Js->each('$(this).css({color: "red"});');``

Using the jQuery engine would create the following Javascript

::

    $('div.message').each(function () { $(this).css({color: "red"});});


#. ``$('div.message').each(function () { $(this).css({color: "red"});});``

alert($message)

Create a javascript snippet containing an ``alert()`` snippet. By
default, ``alert`` does not buffer, and returns the script
snippet.

::

    $alert = $this->Js->alert('Hey there');


#. ``$alert = $this->Js->alert('Hey there');``

confirm($message)

Create a javascript snippet containing a ``confirm()`` snippet. By
default, ``confirm`` does not buffer, and returns the script
snippet.

::

    $alert = $this->Js->confirm('Are you sure?');


#. ``$alert = $this->Js->confirm('Are you sure?');``

prompt($message, $default)

Create a javascript snippet containing a ``prompt()`` snippet. By
default, ``prompt`` does not buffer, and returns the script
snippet.

::

    $prompt = $this->Js->prompt('What is your favorite color?', 'blue');


#. ``$prompt = $this->Js->prompt('What is your favorite color?', 'blue');``

submit()

Create a submit input button that enables ``XmlHttpRequest``
submitted forms. Options can include
both those for FormHelper::submit() and JsBaseEngine::request(),
JsBaseEngine::event();

Forms submitting with this method, cannot send files. Files do not
transfer over ``XmlHttpRequest``
and require an iframe, or other more specialized setups that are
beyond the scope of this helper.

**Options**


-  ``confirm`` - Confirm message displayed before sending the
   request. Using confirm, does not replace any ``before`` callback
   methods in the generated XmlHttpRequest.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.
-  ``wrapCallbacks`` - Set to false to disable automatic callback
   wrapping.

**Example use**

::

    echo $this->Js->submit('Save', array('update' => '#content'));


#. ``echo $this->Js->submit('Save', array('update' => '#content'));``

Will create a submit button with an attached onclick event. The
click event will be buffered by default.

::

    echo $this->Js->submit('Save', array('update' => '#content', 'div' => false, 'type' => 'json', 'async' => false));


#. ``echo $this->Js->submit('Save', array('update' => '#content', 'div' => false, 'type' => 'json', 'async' => false));``

Shows how you can combine options that both
``FormHelper::submit()`` and ``Js::request()`` when using submit.

link($title, $url = null, $options = array())

Create an html anchor element that has a click event bound to it.
Options can include both those for HtmlHelper::link() and
JsBaseEngine::request(), JsBaseEngine::event(); ``$htmlAttributes``
is used to specify additional options that are supposed to be
appended to the generated anchor element. If an option is not part
of the standard attributes or ``$htmlAttributes`` it will be passed
to ``request()`` as an option. If an id is not supplied, a randomly
generated one will be created for each link generated.

**Options**


-  ``confirm`` - Generate a confirm() dialog before sending the
   event.
-  ``id`` - use a custom id.
-  ``htmlAttributes`` - additional non-standard htmlAttributes.
   Standard attributes are class, id, rel, title, escape, onblur and
   onfocus.
-  ``buffer`` - Disable the buffering and return a script tag in
   addition to the link.

**Example use**

::

    echo $this->Js->link('Page 2', array('page' => 2), array('update' => '#content'));


#. ``echo $this->Js->link('Page 2', array('page' => 2), array('update' => '#content'));``

Will create a link pointing to ``/page:2`` and updating #content
with the response.

You can use the ``htmlAttributes`` option to add in additional
custom attributes.

::

    echo $this->Js->link('Page 2', array('page' => 2), array(
        'update' =&gt; '#content',
        'htmlAttributes' =&gt; array('other' =&gt; 'value')
    ));
    
    
    //Creates the following html
    <a href="/posts/index/page:2" other="value">Page 2</a>


#. ``echo $this->Js->link('Page 2', array('page' => 2), array(``
#. ``'update' =&gt; '#content',``
#. ``'htmlAttributes' =&gt; array('other' =&gt; 'value')``
#. ``));``
#. ``//Creates the following html``
#. ``<a href="/posts/index/page:2" other="value">Page 2</a>``

serializeForm($options = array())

Serialize the form attached to $selector. Pass ``true`` for $isForm
if the current selection is a form element. Converts the form or
the form element attached to the current selection into a
string/json object (depending on the library implementation) for
use with XHR operations.

**Options**


-  ``isForm`` - is the current selection a form, or an input?
   (defaults to false)
-  ``inline`` - is the rendered statement going to be used inside
   another JS statement? (defaults to false)

Setting inline == false allows you to remove the trailing ``;``.
This is useful when you need to serialize a form element as part of
another Javascript operation, or use the serialize method in an
Object literal.

redirect($url)

Redirect the page to ``$url`` using ``window.location``.

value($value)

Converts a PHP-native variable of any type to a JSON-equivalent
representation. Escapes any string values into JSON compatible
strings. UTF-8 characters will be escaped.
