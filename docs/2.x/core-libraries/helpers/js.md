# JsHelper

`class` **JsHelper**(View $view, array $settings = array())

> [!WARNING]
> The JsHelper is currently deprecated and completely removed in 3.x.
> We recommend using regular JavaScript and directly interacting with
> JavaScript libraries where possible.

Since the beginning CakePHP's support for JavaScript has been with
Prototype/Scriptaculous. While we still think these are
excellent JavaScript libraries, the community has been asking for
support for other libraries. Rather than drop Prototype in favour
of another JavaScript library. We created an Adapter based helper,
and included 3 of the most requested libraries.
Prototype/Scriptaculous, Mootools/Mootools-more, and jQuery/jQuery
UI. While the API is not as expansive as the previous
AjaxHelper we feel that the adapter based solution allows for a
more extensible solution giving developers the power and
flexibility they need to address their specific application needs.

JavaScript Engines form the backbone of the new JsHelper. A
JavaScript engine translates an abstract JavaScript element into
concrete JavaScript code specific to the JavaScript library being
used. In addition they create an extensible system for others to
use.

## Using a specific JavaScript engine

First of all download your preferred JavaScript library and place
it in `app/webroot/js`

Then you must include the library in your page. To include it in
all pages, add this line to the \<head\> section of
`app/View/Layouts/default.ctp`:

``` php
echo $this->Html->script('jquery'); // Include jQuery library
```

Replace `jquery` with the name of your library file (.js will be
added to the name).

By default scripts are cached, and you must explicitly print out
the cache. To do this at the end of each page, include this line
just before the ending `</body>` tag:

``` php
echo $this->Js->writeBuffer(); // Write cached scripts
```

> [!WARNING]
> You must include the library in your page and print the cache for
> the helper to function.

JavaScript engine selection is declared when you include the helper
in your controller:

``` php
public $helpers = array('Js' => array('Jquery'));
```

The above would use the Jquery Engine in the instances of JsHelper
in your views. If you do not declare a specific engine, the jQuery
engine will be used as the default. As mentioned before, there are
three engines implemented in the core, but we encourage the
community to expand the library compatibility.

### Using jQuery with other libraries

The jQuery library, and virtually all of its plugins are
constrained within the jQuery namespace. As a general rule,
"global" objects are stored inside the jQuery namespace as well, so
you shouldn't get a clash between jQuery and any other library
(like Prototype, MooTools, or YUI).

That said, there is one caveat:
**By default, jQuery uses "\$" as a shortcut for "jQuery"**

To override the "\$" shortcut, use the jQueryObject variable:

``` php
$this->Js->JqueryEngine->jQueryObject = '$j';
echo $this->Html->scriptBlock(
    'var $j = jQuery.noConflict();',
    array('inline' => false)
);
// Tell jQuery to go into noconflict mode
```

### Using the JsHelper inside customHelpers

Declare the JsHelper in the `$helpers` array in your
customHelper:

``` php
public $helpers = array('Js');
```

> [!NOTE]
> It is not possible to declare a JavaScript engine inside a custom
> helper. Doing that will have no effect.

If you are willing to use an other JavaScript engine than the
default, do the helper setup in your controller as follows:

``` php
public $helpers = array(
    'Js' => array('Prototype'),
    'CustomHelper'
);
```

> [!WARNING]
> Be sure to declare the JsHelper and its engine **on top** of the
> `$helpers` array in your controller.

The selected JavaScript engine may disappear (replaced by the
default) from the JsHelper object in your helper, if you miss to do
so and you will get code that does not fit your JavaScript
library.

## Creating a JavaScript Engine

JavaScript engine helpers follow normal helper conventions, with a
few additional restrictions. They must have the `Engine` suffix.
`DojoHelper` is not good, `DojoEngineHelper` is correct.
Furthermore, they should extend `JsBaseEngineHelper` in order to
leverage the most of the new API.

## JavaScript engine usage

The `JsHelper` provides a few methods, and acts as a facade for
the the Engine helper. You should not directly access the Engine
helper except in rare occasions. Using the facade features of the
`JsHelper` allows you to leverage the buffering and method
chaining features built-in; (method chaining only works in PHP5).

The `JsHelper` by default buffers almost all script code
generated, allowing you to collect scripts throughout the view,
elements and layout, and output it in one place. Outputting
buffered scripts is done with `$this->Js->writeBuffer();` this
will return the buffer contents in a script tag. You can disable
buffering wholesale with the `$bufferScripts` property or setting
`buffer => false` in methods taking `$options`.

Since most methods in JavaScript begin with a selection of elements
in the DOM, `$this->Js->get()` returns a \$this, allowing you to
chain the methods using the selection. Method chaining allows you
to write shorter, more expressive code:

``` php
$this->Js->get('#foo')->event('click', $eventCode);
```

Is an example of method chaining. Method chaining is not possible
in PHP4 and the above sample would be written like:

``` php
$this->Js->get('#foo');
$this->Js->event('click', $eventCode);
```

### Common options

In attempts to simplify development where JavaScript libraries can change,
a common set of options is supported by `JsHelper`, these common
options will be mapped out to the library specific options
internally. If you are not planning on switching JavaScript
libraries, each library also supports all of its native callbacks
and options.

### Callback wrapping

By default all callback options are wrapped with the an anonymous
function with the correct arguments. You can disable this behavior
by supplying the `wrapCallbacks = false` in your options array.

### Working with buffered scripts

One drawback to previous implementation of 'Ajax' type features was
the scattering of script tags throughout your document, and the
inability to buffer scripts added by elements in the layout. The
new JsHelper if used correctly avoids both of those issues. It is
recommended that you place `$this->Js->writeBuffer()` at the
bottom of your layout file above the `</body>` tag. This will
allow all scripts generated in layout elements to be output in one
place. It should be noted that buffered scripts are handled
separately from included script files.

`method` JsHelper::**writeBuffer**($options = array())

Writes all JavaScript generated so far to a code block or caches
them to a file and returns a linked script.

**Options**

- `inline` - Set to true to have scripts output as a script
  block inline if `cache` is also true, a script link tag will be
  generated. (default true)
- `cache` - Set to true to have scripts cached to a file and
  linked in (default false)
- `clear` - Set to false to prevent script cache from being
  cleared (default true)
- `onDomReady` - wrap cached scripts in domready event (default
  true)
- `safe` - if an inline block is generated should it be wrapped
  in \<\![CDATA\[ ... \]\]\> (default true)

Creating a cache file with `writeBuffer()` requires that
`webroot/js` be world writable and allows a browser to cache
generated script resources for any page.

`method` JsHelper::**buffer**($content)

Add `$content` to the internal script buffer.

`method` JsHelper::**getBuffer**($clear = true)

Get the contents of the current buffer. Pass in false to not clear
the buffer at the same time.

**Buffering methods that are not normally buffered**

Some methods in the helpers are buffered by default. The engines
buffer the following methods by default:

- event
- sortable
- drag
- drop
- slider

Additionally you can force any other method in JsHelper to use the
buffering. By appending an boolean to the end of the arguments you
can force other methods to go into the buffer. For example the
`each()` method does not normally buffer:

``` php
$this->Js->each('alert("whoa!");', true);
```

The above would force the `each()` method to use the buffer.
Conversely if you want a method that does buffer to not buffer, you
can pass a `false` in as the last argument:

``` php
$this->Js->event('click', 'alert("whoa!");', false);
```

This would force the event function which normally buffers to
return its result.

## Other Methods

The core JavaScript Engines provide the same feature set across all
libraries, there is also a subset of common options that are
translated into library specific options. This is done to provide
end developers with as unified an API as possible. The following
list of methods are supported by all the Engines included in the
CakePHP core. Whenever you see separate lists for `Options` and
`Event Options` both sets of parameters are supplied in the
`$options` array for the method.

`method` JsHelper::**object**($data, $options = array())

`method` JsHelper::**sortable**($options = array())

`method` JsHelper::**request**($url, $options = array())

`method` JsHelper::**get**($selector)

`method` JsHelper::**set**(mixed $one, mixed $two = null)

`method` JsHelper::**drag**($options = array())

`method` JsHelper::**drop**($options = array())

`method` JsHelper::**slider**($options = array())

`method` JsHelper::**effect**($name, $options = array())

`method` JsHelper::**event**($type, $content, $options = array())

`method` JsHelper::**domReady**($callback)

`method` JsHelper::**each**($callback)

`method` JsHelper::**alert**($message)

`method` JsHelper::**confirm**($message)

`method` JsHelper::**prompt**($message, $default)

`method` JsHelper::**submit**($caption = null, $options = array())

`method` JsHelper::**link**($title, $url = null, $options = array())

`method` JsHelper::**serializeForm**($options = array())

`method` JsHelper::**redirect**($url)

`method` JsHelper::**value**($value)

<a id="ajax-pagination"></a>

## AJAX Pagination

Much like AJAX Pagination in 1.2, you can use the JsHelper to
handle the creation of AJAX pagination links instead of plain HTML
links.

### Making AJAX Links

Before you can create AJAX links you must include the JavaScript
library that matches the adapter you are using with `JsHelper`.
By default the `JsHelper` uses jQuery. So in your layout include
jQuery (or whichever library you are using). Also make sure to
include `RequestHandlerComponent` in your components. Add the
following to your controller:

``` php
public $components = array('RequestHandler');
public $helpers = array('Js');
```

Next link in the JavaScript library you want to use. For this
example we'll be using jQuery:

``` php
echo $this->Html->script('jquery');
```

Similar to 1.2 you need to tell the `PaginatorHelper` that you
want to make JavaScript enhanced links instead of plain HTML ones.
To do so, call the `options()` at the top of your view:

``` php
$this->Paginator->options(array(
    'update' => '#content',
    'evalScripts' => true
));
```

The `PaginatorHelper` now knows to make JavaScript enhanced
links, and that those links should update the `#content` element.
Of course this element must exist, and often times you want to wrap
`$content_for_layout` with a div matching the id used for the
`update` option. You also should set `evalScripts` to true if
you are using the Mootools or Prototype adapters, without
`evalScripts` these libraries will not be able to chain requests
together. The `indicator` option is not supported by `JsHelper`
and will be ignored.

You then create all the links as needed for your pagination
features. Since the `JsHelper` automatically buffers all
generated script content to reduce the number of `<script>` tags
in your source code you **must** write the buffer out. At the
bottom of your view file. Be sure to include:

``` php
echo $this->Js->writeBuffer();
```

If you omit this you will **not** be able to chain AJAX pagination
links. When you write the buffer, it is also cleared, so you don't
have worry about the same JavaScript being output twice.

### Adding effects and transitions

Since `indicator` is no longer supported, you must add any
indicator effects yourself:

``` php
<!DOCTYPE html>
<html>
    <head>
        <?php echo $this->Html->script('jquery'); ?>
        //more stuff here.
    </head>
    <body>
    <div id="content">
        <?php echo $this->fetch('content'); ?>
    </div>
    <?php
        echo $this->Html->image(
            'indicator.gif',
            array('id' => 'busy-indicator')
        );
    ?>
    </body>
</html>
```

Remember to place the indicator.gif file inside app/webroot/img
folder. You may see a situation where the indicator.gif displays
immediately upon the page load. You need to put in this CSS
`#busy-indicator { display:none; }` in your main CSS file.

With the above layout, we've included an indicator image file, that
will display a busy indicator animation that we will show and hide
with the `JsHelper`. To do that we need to update our
`options()` function:

``` php
$this->Paginator->options(array(
    'update' => '#content',
    'evalScripts' => true,
    'before' => $this->Js->get('#busy-indicator')->effect(
        'fadeIn',
        array('buffer' => false)
    ),
    'complete' => $this->Js->get('#busy-indicator')->effect(
        'fadeOut',
        array('buffer' => false)
    ),
));
```

This will show/hide the busy-indicator element before and after the
`#content` div is updated. Although `indicator` has been
removed, the new features offered by `JsHelper` allow for more
control and more complex effects to be created.
