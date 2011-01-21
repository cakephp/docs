7.1.1 AjaxHelper Options
------------------------

Most of the methods of the AjaxHelper allow you to supply an
$options array. You can use this array to configure how the
AjaxHelper behaves. Before we cover the specific methods in the
helper, let’s look at the different options available through this
special array. You’ll want to refer to this section as you start
using the methods in the AjaxHelper later on.

General Options
~~~~~~~~~~~~~~~

``$option`` keys
Description
``$options['evalScripts']``

Determines if script tags in the returned content are evaluated.
Set to *true* by default.

``$options['frequency']``

The number of seconds between interval based checks.

``$options['indicator']``

The DOM id of an element to show while a request is loading and to
hide when a request is completed.

``$options['position']``

To insert rather than replace, use this option to specify an
insertion position of *top*, *bottom*, *after*, or *before*.

``$options['update']``

The id of the DOM element to be updated with returned content.

``$options['url']``

The url of the controller/action that you want to call.

``$options['type']``

Indicate whether the request should be 'synchronous' or
'asynchronous' (default).

``$options['with']``

A URL-encoded string which will be added to the URL for get methods
or in to the post body for any other method. Example:
``x=1&foo=bar&y=2``. The parameters will be available in
``$this->params['form']`` or available in ``$this->data`` depending
on formatting. For more information see the
`Prototype Serialize <http://www.prototypejs.org/api/form/serialize>`_
method.

Callback Options
~~~~~~~~~~~~~~~~

Callback options allow you to call JavaScript functions at specific
points in the request process. If you’re looking for a way to
inject a bit of logic before, after, or during your AjaxHelper
operations, use these callbacks to set things up.

$options keys
Description
$options['condition']

JavaScript code snippet that needs to evaluate to *true* before
request is initiated.

$options['before']

Executed before request is made. A common use for this callback is
to enable the visibility of a progress indicator.

$options['confirm']

Text to display in a JavaScript confirmation alert before
proceeding.

$options['loading']

Callback code to be executed while data is being fetched from
server.

$options['after']

JavaScript called immediately after request has run; fires before
the $options['loading'] callback runs.

$options['loaded']

Callback code to be executed when the remote document has been
received by client.

$options['interactive']

Called when the user can interact with the remote document, even
though it has not finished loading.

$options['complete']

JavaScript callback to be run when XMLHttpRequest is complete.

7.1.1 AjaxHelper Options
------------------------

Most of the methods of the AjaxHelper allow you to supply an
$options array. You can use this array to configure how the
AjaxHelper behaves. Before we cover the specific methods in the
helper, let’s look at the different options available through this
special array. You’ll want to refer to this section as you start
using the methods in the AjaxHelper later on.

General Options
~~~~~~~~~~~~~~~

``$option`` keys
Description
``$options['evalScripts']``

Determines if script tags in the returned content are evaluated.
Set to *true* by default.

``$options['frequency']``

The number of seconds between interval based checks.

``$options['indicator']``

The DOM id of an element to show while a request is loading and to
hide when a request is completed.

``$options['position']``

To insert rather than replace, use this option to specify an
insertion position of *top*, *bottom*, *after*, or *before*.

``$options['update']``

The id of the DOM element to be updated with returned content.

``$options['url']``

The url of the controller/action that you want to call.

``$options['type']``

Indicate whether the request should be 'synchronous' or
'asynchronous' (default).

``$options['with']``

A URL-encoded string which will be added to the URL for get methods
or in to the post body for any other method. Example:
``x=1&foo=bar&y=2``. The parameters will be available in
``$this->params['form']`` or available in ``$this->data`` depending
on formatting. For more information see the
`Prototype Serialize <http://www.prototypejs.org/api/form/serialize>`_
method.

Callback Options
~~~~~~~~~~~~~~~~

Callback options allow you to call JavaScript functions at specific
points in the request process. If you’re looking for a way to
inject a bit of logic before, after, or during your AjaxHelper
operations, use these callbacks to set things up.

$options keys
Description
$options['condition']

JavaScript code snippet that needs to evaluate to *true* before
request is initiated.

$options['before']

Executed before request is made. A common use for this callback is
to enable the visibility of a progress indicator.

$options['confirm']

Text to display in a JavaScript confirmation alert before
proceeding.

$options['loading']

Callback code to be executed while data is being fetched from
server.

$options['after']

JavaScript called immediately after request has run; fires before
the $options['loading'] callback runs.

$options['loaded']

Callback code to be executed when the remote document has been
received by client.

$options['interactive']

Called when the user can interact with the remote document, even
though it has not finished loading.

$options['complete']

JavaScript callback to be run when XMLHttpRequest is complete.
