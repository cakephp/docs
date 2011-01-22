3.5.1 The App Controller
------------------------

As stated in the introduction, the AppController class is the
parent class to all of your application's controllers.
AppController itself extends the Controller class included in the
CakePHP core library. As such, AppController is defined in
/app/app\_controller.php like so:

::

    <?php
    class AppController extends Controller {
    }
    ?>

Controller attributes and methods created in your AppController
will be available to all of your application's controllers. It is
the ideal place to create code that is common to all of your
controllers. Components (which you'll learn about later) are best
used for code that is used in many (but not necessarily all)
controllers.

While normal object-oriented inheritance rules apply, CakePHP also
does a bit of extra work when it comes to special controller
attributes, like the list of components or helpers used by a
controller. In these cases, AppController value arrays are merged
with child controller class arrays.

CakePHP merges the following variables from the AppController to
your application's controllers:


-  $components
-  $helpers
-  $uses

Remember to add the default Html and Form helpers, if you define
var $helpers in your AppController

Please also remember to call AppController's callbacks within child
controller callbacks for best results:

::

    function beforeFilter(){
        parent::beforeFilter();
    }
