7.5.1 Using a specific Javascript engine
----------------------------------------

First of all download your preferred javascript library and place
it in ``app/webroot/js``

Then you must include the library in your page. To include it in
all pages, add this ****line to the <head> section of
``app/views/layouts/default.ctp`` (copy this file from
``cake/libs/view/layouts/default.ctp`` if you have not created your
own).

::

    echo $this->Html->script('jquery'); // Include jQuery library

Replace ``jquery`` with the name of your library file (.js will be
added to the name).

By default scripts are cached, and you must explicitly print out
the cache. To do this at the end of each page, include this line
just before the ending ``</body>`` tag

::

    echo $this->Js->writeBuffer(); // Write cached scripts

You must include the library in your page and print the cache for
the helper to function.



Javascript engine selection is declared when you include the helper
in your controller.

::

    var $helpers = array('Js' => array('Jquery'));

The above would use the Jquery Engine in the instances of JsHelper
in your views. If you do not declare a specific engine, the jQuery
engine will be used as the default. As mentioned before, there are
three engines implemented in the core, but we encourage the
community to expand the library compatibility.

Using jQuery with other libraries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The jQuery library, and virtually all of its plugins are
constrained within the jQuery namespace. As a general rule,
"global" objects are stored inside the jQuery namespace as well, so
you shouldn't get a clash between jQuery and any other library
(like Prototype, MooTools, or YUI).

That said, there is one caveat:
**By default, jQuery uses "$" as a shortcut for "jQuery"**

To override the "$" shortcut, use the jQueryObject variable.

::

    $this->Js->JqueryEngine->jQueryObject = '$j';
    print $this->Html->scriptBlock('var $j = jQuery.noConflict();', 
        array('inline' => false)); //Tell jQuery to go into noconflict mode

Using the JsHelper inside customHelpers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Declare the JsHelper in the ``$helpers`` array in your
customHelper.

::

    var $helpers = array('Js');

It is not possible to declare a javascript engine inside a custom
helper. Doing that will have no effect.

If you are willing to use an other javascript engine than the
default, do the helper setup in your controller as follows:

::

    var $helpers = array(
        'Js' => array('Prototype'),
        'CustomHelper'
    );

Be sure to declare the JsHelper and its engine **on top** of the
``$helpers`` array in your controller.

The selected javascript engine may disappear (replaced by the
default) from the jsHelper object in your helper, if you miss to do
so and you will get code that does not fit your javascript
library.
