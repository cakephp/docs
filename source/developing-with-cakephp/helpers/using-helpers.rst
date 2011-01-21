3.11.1 Using Helpers
--------------------

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


#. ``<?php``
#. ``class BakeriesController extends AppController {``
#. ``var $helpers = array('Form', 'Html', 'Javascript', 'Time');``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class BakeriesController extends AppController {``
#. ``function bake {``
#. ``$this->helpers[] = 'Time';``
#. ``}``
#. ``function mix {``
#. ``// The Time helper is not loaded here and thus not available``
#. ``}``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class AppController extends Controller {``
#. ``var $helpers = array('Form', 'Html', 'Javascript', 'Time');``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class AwesomeHelper extends AppHelper {``
#. ``function __construct($options = null) {``
#. ``parent::__construct($options);``
#. ``debug($options);``
#. ``}``
#. ``}``
#. ``?>``
#. ``<?php``
#. ``class AwesomeController extends AppController {``
#. ``var $helpers = array('Awesome' => array('option1' => 'value1'));``
#. ``}``
#. ``?>``

3.11.1 Using Helpers
--------------------

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


#. ``<?php``
#. ``class BakeriesController extends AppController {``
#. ``var $helpers = array('Form', 'Html', 'Javascript', 'Time');``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class BakeriesController extends AppController {``
#. ``function bake {``
#. ``$this->helpers[] = 'Time';``
#. ``}``
#. ``function mix {``
#. ``// The Time helper is not loaded here and thus not available``
#. ``}``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class AppController extends Controller {``
#. ``var $helpers = array('Form', 'Html', 'Javascript', 'Time');``
#. ``}``
#. ``?>``

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


#. ``<?php``
#. ``class AwesomeHelper extends AppHelper {``
#. ``function __construct($options = null) {``
#. ``parent::__construct($options);``
#. ``debug($options);``
#. ``}``
#. ``}``
#. ``?>``
#. ``<?php``
#. ``class AwesomeController extends AppController {``
#. ``var $helpers = array('Awesome' => array('option1' => 'value1'));``
#. ``}``
#. ``?>``
