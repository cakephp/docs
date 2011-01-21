7.1 AJAX
--------

Both the JavascriptHelper and the AjaxHelper are deprecated, and
the JsHelper + HtmlHelper should be used in their place. See
`The Migration Guide <http://book.cakephp.org/view/1561/Migrating-from-CakePHP-1-2-to-1-3#View-and-Helpers-1566>`_

The AjaxHelper utilizes the ever-popular Prototype and
script.aculo.us libraries for Ajax operations and client side
effects. To use the AjaxHelper, you must have a current version of
the JavaScript libraries from
`www.prototypejs.org <http://www.prototypejs.org>`_ and
`http://script.aculo.us <http://script.aculo.us/>`_ placed in
/app/webroot/js/. In addition, you must include the Prototype and
script.aculo.us JavaScript libraries in any layouts or views that
require AjaxHelper functionality.



You'll need to include the Ajax and Javascript helpers in your
controller:

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Once you have the javascript helper included in your controller,
you can use the javascript helper link() method to include
Prototype and Scriptaculous:

::

    echo $html->script('prototype');
    echo $html->script('scriptaculous'); 

Now you can use the Ajax helper in your view:

::

    $ajax->whatever();

If the `RequestHandler Component </view/174/request-handling>`_ is
included in the controller then CakePHP will automatically apply
the Ajax layout when an action is requested via AJAX

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

7.1 AJAX
--------

Both the JavascriptHelper and the AjaxHelper are deprecated, and
the JsHelper + HtmlHelper should be used in their place. See
`The Migration Guide <http://book.cakephp.org/view/1561/Migrating-from-CakePHP-1-2-to-1-3#View-and-Helpers-1566>`_

The AjaxHelper utilizes the ever-popular Prototype and
script.aculo.us libraries for Ajax operations and client side
effects. To use the AjaxHelper, you must have a current version of
the JavaScript libraries from
`www.prototypejs.org <http://www.prototypejs.org>`_ and
`http://script.aculo.us <http://script.aculo.us/>`_ placed in
/app/webroot/js/. In addition, you must include the Prototype and
script.aculo.us JavaScript libraries in any layouts or views that
require AjaxHelper functionality.



You'll need to include the Ajax and Javascript helpers in your
controller:

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Once you have the javascript helper included in your controller,
you can use the javascript helper link() method to include
Prototype and Scriptaculous:

::

    echo $html->script('prototype');
    echo $html->script('scriptaculous'); 

Now you can use the Ajax helper in your view:

::

    $ajax->whatever();

If the `RequestHandler Component </view/174/request-handling>`_ is
included in the controller then CakePHP will automatically apply
the Ajax layout when an action is requested via AJAX

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }
