3.11.3 Creating Functionality for All Helpers
---------------------------------------------

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
