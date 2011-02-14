Helpers
#######

Helpers are the component-like classes for the presentation layer
of your application. They contain presentational logic that is
shared between many views, elements, or layouts. This chapter will
show you how to create your own helpers, and outline the basic
tasks CakePHP’s core helpers can help you accomplish. For more
information on core helpers, check out
:doc:`/core-helpers`.

Using Helpers
=============

You use helpers in CakePHP by making a controller aware of them.
Each controller has a $helpers property that lists the helpers to
be made available in the view. To enable a helper in your view, add
the name of the helper to the controller’s $helpers array.

::

    <?php
    class BakeriesController extends AppController {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

You can also add helpers from within an action, so they will only
be available to that action and not the other actions in the
controller. This saves processing power for the other actions that
do not use the helper as well as help keep the controller better
organized.

::

    <?php
    class BakeriesController extends AppController {
        function bake {
            $this->helpers[] = 'Time';
        }
        function mix {
            // The Time helper is not loaded here and thus not available
        }
    }
    ?>

If you need to enable a helper for all controllers add the name of
the helper to the $helpers array in */app/app\_controller.php* (or
create if not present). Remember to include the default Html and
Form helpers.

::

    <?php
    class AppController extends Controller {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

You can pass options to helpers. These options can be used to set
attribute values or modify behavior of a helper.

::

    <?php
    class AwesomeHelper extends AppHelper {
        function __construct($options = null) {
            parent::__construct($options);
            debug($options);
        }
    }
    ?>
    <?php
    class AwesomeController extends AppController {
        var $helpers = array('Awesome' => array('option1' => 'value1'));
    }
    ?>


Creating Helpers
================

If a core helper (or one showcased on Cakeforge or the Bakery)
doesn’t fit your needs, helpers are easy to create.

Let's say we wanted to create a helper that could be used to output
a specifically crafted CSS-styled link you needed many different
places in your application. In order to fit your logic in to
CakePHP's existing helper structure, you'll need to create a new
class in /app/views/helpers. Let's call our helper LinkHelper. The
actual PHP class file would look something like this:

::

    <?php
    /* /app/views/helpers/link.php */
    
    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // Logic to create specially formatted link goes here...
        }
    }
    
    ?>

Including other Helpers
~~~~~~~~~~~~~~~~~~~~~~~

You may wish to use some functionality already existing in another
helper. To do so, you can specify helpers you wish to use with a
$helpers array, formatted just as you would in a controller.

::

    <?php
    /* /app/views/helpers/link.php (using other helpers) */
    class LinkHelper extends AppHelper {
        var $helpers = array('Html');
    
        function makeEdit($title, $url) {
            // Use the HTML helper to output
            // formatted data:
    
            $link = $this->Html->link($title, $url, array('class' => 'edit'));
    
            return "<div class=\"editOuter\">$link</div>";
        }
    }
    ?>

Callback method
~~~~~~~~~~~~~~~

Helpers feature a callback used by the parent controller class.

``beforeRender()``

The beforeRender method is called after the controller's
beforeRender method but before the controller's renders views and
layout.

.. _using-helpers:

Using your Helper
~~~~~~~~~~~~~~~~~

Once you've created your helper and placed it in
/app/views/helpers/, you'll be able to include it in your
controllers using the special variable $helpers.

Once your controller has been made aware of this new class, you can
use it in your views by accessing an object named after the
helper:

::

    <!-- make a link using the new helper -->
    <?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>

This is the new syntax introduced in 1.3. You can also access
helpers using the form $link->makeEdit(), however the newer format
allows view variables and helpers to share names and not create
collisions.

.. note::

    The Html, Form helpers are always available.

Creating Functionality for All Helpers
======================================

All helpers extend a special class, AppHelper (just like models
extend AppModel and controllers extend AppController). To create
functionality that would be available to all helpers, create
/app/app\_helper.php.

::

    <?php
    class AppHelper extends Helper {
        function customMethod () {
        }
    }
    ?>

Core Helpers
============

CakePHP features a number of helpers that aid in view creation.
They assist in creating well-formed markup (including forms), aid
in formatting text, times and numbers, and can even speed up Ajax
functionality. Here is a summary of the built-in helpers. For more
information, check out :doc:`/core-helpers`.

CakePHP Helper
	Description
:doc:`/core-utility-libraries/cache`
    Used by the core to cache view content.
:doc:`/core-helpers/form`
    Creates HTML forms and form elements that self populate and handle
    validation problems.
:doc:`/core-helpers/html`
    Convenience methods for crafting well-formed markup. Images, links,
    tables, header tags and more.
:doc:`/core-helpers/js`
    Used to create Javascript compatible with various Javascript
    libraries. Replaces JavascriptHelper and AjaxHelper with a more
    flexible solution.
:doc:`/core-helpers/number`
    Number and currency formatting.
:doc:`/core-helpers/paginator`
    Model data pagination and sorting.
:doc:`/core-helpers/rss`
    Convenience methods for outputting RSS feed XML data.
:doc:`/core-helpers/session`
    Access for reading session values in views.
:doc:`/core-helpers/text`
    Smart linking, highlighting, word smart truncation.
:doc:`/core-helpers/time`
    Proximity detection (is this next year?), nice string
    formatting(Today, 10:30 am) and time zone conversion.
:doc:`/core-helpers/xml`
    Convenience methods for creating XML headers and elements.
