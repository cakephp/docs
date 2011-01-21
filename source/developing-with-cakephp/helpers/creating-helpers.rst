3.11.2 Creating Helpers
-----------------------

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

The Html, Form and Session (If sessions are enabled) helpers are
always available.

3.11.2 Creating Helpers
-----------------------

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

The Html, Form and Session (If sessions are enabled) helpers are
always available.
