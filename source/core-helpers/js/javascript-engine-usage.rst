7.5.3 Javascript engine usage
-----------------------------

The ``JsHelper`` provides a few methods, and acts as a facade for
the the Engine helper. You should not directly access the Engine
helper except in rare occasions. Using the facade features of the
``JsHelper`` allows you to leverage the buffering and method
chaining features built-in; (method chaining only works in PHP5).

The ``JsHelper`` by default buffers almost all script code
generated, allowing you to collect scripts throughout the view,
elements and layout, and output it in one place. Outputting
buffered scripts is done with ``$this->Js->writeBuffer();`` this
will return the buffer contents in a script tag. You can disable
buffering wholesale with the ``$bufferScripts`` property or setting
``buffer => false`` in methods taking ``$options``.

Since most methods in Javascript begin with a selection of elements
in the DOM, ``$this->Js->get()`` returns a $this, allowing you to
chain the methods using the selection. Method chaining allows you
to write shorter, more expressive code. It should be noted that
method chaining **Will not** work in PHP4.

::

    $this->Js->get('#foo')->event('click', $eventCode);

Is an example of method chaining. Method chaining is not possible
in PHP4 and the above sample would be written like:

::

    $this->Js->get('#foo');
    $this->Js->event('click', $eventCode);

Common options
~~~~~~~~~~~~~~

In attempts to simplify development where Js libraries can change,
a common set of options is supported by ``JsHelper``, these common
options will be mapped out to the library specific options
internally. If you are not planning on switching Javascript
libraries, each library also supports all of its native callbacks
and options.

Callback wrapping
~~~~~~~~~~~~~~~~~

By default all callback options are wrapped with the an anonymous
function with the correct arguments. You can disable this behavior
by supplying the ``wrapCallbacks = false`` in your options array.

Working with buffered scripts
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

One drawback to previous implementation of 'Ajax' type features was
the scattering of script tags throughout your document, and the
inability to buffer scripts added by elements in the layout. The
new JsHelper if used correctly avoids both of those issues. It is
recommended that you place ``$this->Js->writeBuffer()`` at the
bottom of your layout file above the ``</body>`` tag. This will
allow all scripts generated in layout elements to be output in one
place. It should be noted that buffered scripts are handled
separately from included script files.

writeBuffer($options = array())

Writes all Javascript generated so far to a code block or caches
them to a file and returns a linked script.

**Options**


-  ``inline`` - Set to true to have scripts output as a script
   block inline if ``cache`` is also true, a script link tag will be
   generated. (default true)
-  ``cache`` - Set to true to have scripts cached to a file and
   linked in (default false)
-  ``clear`` - Set to false to prevent script cache from being
   cleared (default true)
-  ``onDomReady`` - wrap cached scripts in domready event (default
   true)
-  ``safe`` - if an inline block is generated should it be wrapped
   in <![CDATA[ ... ]]> (default true)

Creating a cache file with ``writeBuffer()`` requires that
``webroot/js`` be world writable and allows a browser to cache
generated script resources for any page.

buffer($content)

Add ``$content`` to the internal script buffer.

getBuffer($clear = true)

Get the contents of the current buffer. Pass in false to not clear
the buffer at the same time.

**Buffering methods that are not normally buffered**

Some methods in the helpers are buffered by default. The engines
buffer the following methods by default:


-  event
-  sortable
-  drag
-  drop
-  slider

Additionally you can force any other method in JsHelper to use the
buffering. By appending an boolean to the end of the arguments you
can force other methods to go into the buffer. For example the
``each()`` method does not normally buffer.

::

    $this->Js->each('alert("whoa!");', true);

The above would force the ``each()`` method to use the buffer.
Conversely if you want a method that does buffer to not buffer, you
can pass a ``false`` in as the last argument.

::

    $this->Js->event('click', 'alert("whoa!");', false);

This would force the event function which normally buffers to
return its result.
