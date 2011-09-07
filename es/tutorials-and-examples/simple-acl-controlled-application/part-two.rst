An Automated tool for creating ACOs
===================================

As mentioned before, there is no pre-built way to input all of our
controllers and actions into the Acl. However, we all hate doing
repetitive things like typing in what could be hundreds of actions
in a large application. We've whipped up an automated set of
functions to build the ACO table. These functions will look at
every controller in your application. It will add any non-private,
non ``Controller`` methods to the Acl table, nicely nested
underneath the owning controller. You can add and run this in your
``AppController`` or any controller for that matter, just be sure
to remove it before putting your application into production.

::

        function build_acl() {
            if (!Configure::read('debug')) {
                return $this->_stop();
            }
            $log = array();

            $aco =& $this->Acl->Aco;
            $root = $aco->node('controllers');
            if (!$root) {
                $aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
                $root = $aco->save();
                $root['Aco']['id'] = $aco->id; 
                $log[] = 'Created Aco node for controllers';
            } else {
                $root = $root[0];
            }   

            App::import('Core', 'File');
            $Controllers = Configure::listObjects('controller');
            $appIndex = array_search('App', $Controllers);
            if ($appIndex !== false ) {
                unset($Controllers[$appIndex]);
            }
            $baseMethods = get_class_methods('Controller');
            $baseMethods[] = 'build_acl';

            $Plugins = $this->_getPluginControllerNames();
            $Controllers = array_merge($Controllers, $Plugins);

            // look at each controller in app/controllers
            foreach ($Controllers as $ctrlName) {
                $methods = $this->_getClassMethods($this->_getPluginControllerPath($ctrlName));

                // Do all Plugins First
                if ($this->_isPlugin($ctrlName)){
                    $pluginNode = $aco->node('controllers/'.$this->_getPluginName($ctrlName));
                    if (!$pluginNode) {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginName($ctrlName)));
                        $pluginNode = $aco->save();
                        $pluginNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $this->_getPluginName($ctrlName) . ' Plugin';
                    }
                }
                // find / make controller node
                $controllerNode = $aco->node('controllers/'.$ctrlName);
                if (!$controllerNode) {
                    if ($this->_isPlugin($ctrlName)){
                        $pluginNode = $aco->node('controllers/' . $this->_getPluginName($ctrlName));
                        $aco->create(array('parent_id' => $pluginNode['0']['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginControllerName($ctrlName)));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $this->_getPluginControllerName($ctrlName) . ' ' . $this->_getPluginName($ctrlName) . ' Plugin Controller';
                    } else {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $ctrlName));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Created Aco node for ' . $ctrlName;
                    }
                } else {
                    $controllerNode = $controllerNode[0];
                }

                //clean the methods. to remove those in Controller and private actions.
                foreach ($methods as $k => $method) {
                    if (strpos($method, '_', 0) === 0) {
                        unset($methods[$k]);
                        continue;
                    }
                    if (in_array($method, $baseMethods)) {
                        unset($methods[$k]);
                        continue;
                    }
                    $methodNode = $aco->node('controllers/'.$ctrlName.'/'.$method);
                    if (!$methodNode) {
                        $aco->create(array('parent_id' => $controllerNode['Aco']['id'], 'model' => null, 'alias' => $method));
                        $methodNode = $aco->save();
                        $log[] = 'Created Aco node for '. $method;
                    }
                }
            }
            if(count($log)>0) {
                debug($log);
            }
        }

        function _getClassMethods($ctrlName = null) {
            App::import('Controller', $ctrlName);
            if (strlen(strstr($ctrlName, '.')) > 0) {
                // plugin's controller
                $num = strpos($ctrlName, '.');
                $ctrlName = substr($ctrlName, $num+1);
            }
            $ctrlclass = $ctrlName . 'Controller';
            $methods = get_class_methods($ctrlclass);

            // Add scaffold defaults if scaffolds are being used
            $properties = get_class_vars($ctrlclass);
            if (array_key_exists('scaffold',$properties)) {
                if($properties['scaffold'] == 'admin') {
                    $methods = array_merge($methods, array('admin_add', 'admin_edit', 'admin_index', 'admin_view', 'admin_delete'));
                } else {
                    $methods = array_merge($methods, array('add', 'edit', 'index', 'view', 'delete'));
                }
            }
            return $methods;
        }

        function _isPlugin($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) > 1) {
                return true;
            } else {
                return false;
            }
        }

        function _getPluginControllerPath($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0] . '.' . $arr[1];
            } else {
                return $arr[0];
            }
        }

        function _getPluginName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0];
            } else {
                return false;
            }
        }

        function _getPluginControllerName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[1];
            } else {
                return false;
            }
        }

    /**
     * Get the names of the plugin controllers ...
     * 
     * This function will get an array of the plugin controller names, and
     * also makes sure the controllers are available for us to get the 
     * method names by doing an App::import for each plugin controller.
     *
     * @return array of plugin names.
     *
     */
        function _getPluginControllerNames() {
            App::import('Core', 'File', 'Folder');
            $paths = Configure::getInstance();
            $folder =& new Folder();
            $folder->cd(APP . 'plugins');

            // Get the list of plugins
            $Plugins = $folder->read();
            $Plugins = $Plugins[0];
            $arr = array();

            // Loop through the plugins
            foreach($Plugins as $pluginName) {
                // Change directory to the plugin
                $didCD = $folder->cd(APP . 'plugins'. DS . $pluginName . DS . 'controllers');
                // Get a list of the files that have a file name that ends
                // with controller.php
                $files = $folder->findRecursive('.*_controller\.php');

                // Loop through the controllers we found in the plugins directory
                foreach($files as $fileName) {
                    // Get the base file name
                    $file = basename($fileName);

                    // Get the controller name
                    $file = Inflector::camelize(substr($file, 0, strlen($file)-strlen('_controller.php')));
                    if (!preg_match('/^'. Inflector::humanize($pluginName). 'App/', $file)) {
                        if (!App::import('Controller', $pluginName.'.'.$file)) {
                            debug('Error importing '.$file.' for plugin '.$pluginName);
                        } else {
                            /// Now prepend the Plugin name ...
                            // This is required to allow us to fetch the method names.
                            $arr[] = Inflector::humanize($pluginName) . "/" . $file;
                        }
                    }
                }
            }
            return $arr;
        }

Now run the action in your browser, eg.
http://localhost/groups/build\_acl, This will build your ACO
table.

You might want to keep this function around as it will add new
ACO's for all of the controllers & actions that are in your
application any time you run it. It does not remove nodes for
actions that no longer exist though. Now that all the heavy lifting
is done, we need to set up some permissions, and remove the code
that disabled ``AuthComponent`` earlier.

The original code on this page did not take into account that you
might use plugins for your application, and in order for you to
have seamless plugin support in your Acl-controlled application, we
have updated the above code to automatically include the correct
plugins wherever necessary. Note that running this action will
place some debug statements at the top of your browser page as to
what Plugin/Controller/Action was added to the ACO tree and what
was not.


Setting up permissions
======================

Creating permissions much like creating ACO's has no magic
solution, nor will I be providing one. To allow ARO's access to
ACO's from the shell interface use the AclShell. For more
information on how to use it consult the aclShell help which can be
accessed by running:

::

    cake acl help

Note: \* needs to be quoted ('\*')

In order to allow with the ``AclComponent`` we would use the
following code syntax in a custom method:

::

    $this->Acl->allow($aroAlias, $acoAlias);

We are going to add in a few allow/deny statements now. Add the
following to a temporary function in your ``UsersController`` and
visit the address in your browser to run them (e.g.
http://localhost/cake/app/users/initdb). If you do a
``SELECT * FROM aros_acos`` you should see a whole pile of 1's and
-1's. Once you've confirmed your permissions are set, remove the
function.

::

    function initDB() {
        $group =& $this->User->Group;
        //Allow admins to everything
        $group->id = 1;     
        $this->Acl->allow($group, 'controllers');
     
        //allow managers to posts and widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');
     
        //allow users to only add and edit on posts and widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');        
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');        
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
        //we add an exit to avoid an ugly "missing views" error message
        echo "all done";
        exit;
    }

We now have set up some basic access rules. We've allowed
administrators to everything. Managers can access everything in
posts and widgets. While users can only access add and edit in
posts & widgets.

We had to get a reference of a ``Group`` model and modify its id to
be able to specify the ARO we wanted, this is due to how
``AclBehavior`` works. ``AclBehavior`` does not set the alias field
in the ``aros`` table so we must use an object reference or an
array to reference the ARO we want.

You may have noticed that I deliberately left out index and view
from my Acl permissions. We are going to make view and index public
actions in ``PostsController`` and ``WidgetsController``. This
allows non-authorized users to view these pages, making them public
pages. However, at any time you can remove these actions from
``AuthComponent::allowedActions`` and the permissions for view and
edit will revert to those in the Acl.

Now we want to take out the references to ``Auth->allowedActions``
in your users and groups controllers. Then add the following to
your posts and widgets controllers:

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('index', 'view');
    }

This removes the 'off switches' we put in earlier on the users and
groups controllers, and gives public access on the index and view
actions in posts and widgets controllers. In
``AppController::beforeFilter()`` add the following:

::

     $this->Auth->allowedActions = array('display');

This makes the 'display' action public. This will keep our
PagesController::display() public. This is important as often the
default routing has this action as the home page for you
application.

Logging in
==========

Our application is now under access control, and any attempt to
view non-public pages will redirect you to the login page. However,
we will need to create a login view before anyone can login. Add
the following to ``app/views/users/login.ctp`` if you haven't done
so already.

::

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');
    ?>

If a user is already logged in, redirect him by adding this to your
UsersController:

::

    function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            $this->redirect('/', null, false);
        }
    }       

You may also want to add a flash() for Auth messages to your
layout. Copy the default core layout - found at
``cake/libs/view/layouts/default.ctp`` - to your app layouts folder
if you haven't done so already. In
``app/views/layouts/default.ctp`` add

::

    echo $this->Session->flash('auth');

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be
displayed if you added the ``echo $this->Session->flash('auth')``

Logout
======

Now onto the logout. Earlier we left this function blank, now is
the time to fill it. In ``UsersController::logout()`` add the
following:

::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

This sets a Session flash message and logs out the User using
Auth's logout method. Auth's logout method basically deletes the
Auth Session Key and returns a url that can be used in a redirect.
If there is other session data that needs to be deleted as well add
that code here.

All done
========

You should now have an application controlled by Auth and Acl.
Users permissions are set at the group level, but you can set them
by user at the same time. You can also set permissions on a global
and per-controller and per-action basis. Furthermore, you have a
reusable block of code to easily expand your ACO table as your app
grows.
