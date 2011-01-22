5.6.3 Usage
-----------

Using the security component is generally done in the controller
beforeFilter(). You would specify the security restrictions you
want and the Security Component will enforce them on its startup.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

In this example the delete action can only be successfully
triggered if it recieves a POST request.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

This example would force all actions that had admin routing to
require secure SSL requests.

::

    <?php
    class WidgetController extends AppController {
    
        var $components = array('Security');
    
        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->blackHoleCallback = 'forceSSL';
                $this->Security->requireSecure();
            }
        }
    
        function forceSSL() {
            $this->redirect('https://' . env('SERVER_NAME') . $this->here);
        }
    }
    ?>

This example would force all actions that had admin routing to
require secure SSL requests. When the request is black holed, it
will call the nominated forceSSL() callback which will redirect
non-secure requests to secure requests automatically.
