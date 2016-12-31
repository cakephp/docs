Simple Acl controlled Application
#################################

In this tutorial you will create a simple application with
:doc:`/The-Manual/Core-Components/Authentication` and :doc:`/The-Manual/Core-Components/Access-Control-Lists`. This tutorial assumes you
have read the :doc:`/The-Manual/Tutorials-Examples/Blog` tutorial, and you are familiar
with :doc:`/The-Manual/Core-Console-Applications/Code-Generation-with-Bake`. You should have
some experience with CakePHP, and be familiar with MVC concepts. This
tutorial is a brief introduction to the
```AuthComponent`` <https://api.cakephp.org/class/auth-component>`_ and
```AclComponent`` <https://api.cakephp.org/class/acl-component>`_.

What you will need

#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get Cake up and running without any
   configuration at all.
#. A database server. We're going to be using MySQL in this tutorial.
   You'll need to know enough about SQL in order to create a database:
   Cake will be taking the reins from there.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.

Preparing our Application
=========================

First, let's get a copy of fresh Cake code.

To get a fresh download, visit the CakePHP project at Cakeforge:
https://github.com/cakephp/cakephp/downloads and download the stable
release. For this tutorial you need the latest 1.3 release.

You can also checkout/export a fresh copy of our trunk code at:
git://github.com/cakephp/cakephp.git

Once you've got a fresh copy of cake setup your database.php config
file, and change the value of Security.salt in your app/config/core.php.
From there we will build a simple database schema to build our
application on. Execute the following SQL statements into your database.

::

    CREATE TABLE users (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password CHAR(40) NOT NULL,
        group_id INT(11) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

     
    CREATE TABLE groups (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created DATETIME,
        modified DATETIME
    );


    CREATE TABLE posts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT(11) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE widgets (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        part_no VARCHAR(12),
        quantity INT(11)
    );

These are the tables we will be using to build the rest of our
application. Once we have the table structure in the database we can
start cooking. Use :doc:`/The-Manual/Core-Console-Applications/Code-Generation-with-Bake`
to quickly create your models, controllers, and views.

To use cake bake, call "cake bake all" and this will list the 4 tables
you inserted into mySQL. Select "1. Group", and follow the prompts.
Repeat for the other 3 tables, and this will have generated the 4
controllers, models and your views for you.

Avoid using Scaffold here. The generation of the ACOs will be seriously
affected if you bake the controllers with the Scaffold feature.

While baking the Models cake will automagically detect the associations
between your Models (or relations between your tables). Let cake supply
the correct hasMany and belongsTo associations. If you are prompted to
pick hasOne or hasMany, generally speaking you'll need a hasMany (only)
relationships for this tutorial.

Leave out admin routing for now, this is a complicated enough subject
without them. Also be sure **not** to add either the Acl or Auth
Components to any of your controllers as you are baking them. We'll be
doing that soon enough. You should now have models, controllers, and
baked views for your users, groups, posts and widgets.

Preparing to Add Auth
=====================

We now have a functioning CRUD application. Bake should have setup all
the relations we need, if not add them in now. There are a few other
pieces that need to be added before we can add the Auth and Acl
components. First add a login and logout action to your
``UsersController``.

::

    function login() {
        //Auth Magic
    }
     
    function logout() {
        //Leave empty for now.
    }

Then create the following view file for login at
app/views/users/login.ctp:

::

    <?php
    echo $this->Session->flash('auth');
    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login', true),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');
    ?>

We don't need to worry about adding anything to hash passwords, as
AuthComponent will do this for us automatically when creating/editing
users, and when they login, once configured properly. Furthermore, if
you hash incoming passwords manually ``AuthComponent`` will not be able
to log you in at all. As it will hash them again, and they will not
match.

Next we need to make some modifications to ``AppController``. If you
don't have ``/app/app_controller.php``, create it. Note that this goes
in /app/, not /app/controllers/. Since we want our entire site
controlled with Auth and Acl, we will set them up in ``AppController``.

::

    <?php
    class AppController extends Controller {
        var $components = array('Acl', 'Auth', 'Session');
        var $helpers = array('Html', 'Form', 'Session');

        function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'logout');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }
    ?>

Before we set up the ACL at all we will need to add some users and
groups. With ``AuthComponent`` in use we will not be able to access any
of our actions, as we are not logged in. We will now add some exceptions
so ``AuthComponent`` will allow us to create some groups and users. In
**both** your ``GroupsController`` and your ``UsersController`` Add the
following.

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allow(array('*'));
    }

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a few
users and groups into our database. Don't add any users or groups just
yet though.

Initialize the Db Acl tables
============================

Before we create any users or groups we will want to connect them to the
Acl. However, we do not at this time have any Acl tables and if you try
to view any pages right now, you will get a missing table error ("Error:
Database table acos for model Aco was not found."). To remove these
errors we need to run a schema file. In a shell run the following:

::

        cake schema create DbAcl

This schema will prompt you to drop and create the tables. Say yes to
dropping and creating the tables.

If you don't have shell access, or are having trouble using the console,
you can run the sql file found in
/path/to/app/config/schema/db\_acl.sql.

With the controllers setup for data entry, and the Acl tables
initialized we are ready to go right? Not entirely, we still have a bit
of work to do in the user and group models. Namely, making them
auto-magically attach to the Acl.

Acts As a Requester
===================

For Auth and Acl to work properly we need to associate our users and
groups to rows in the Acl tables. In order to do this we will use the
``AclBehavior``. The ``AclBehavior`` allows for the automagic connection
of models with the Acl tables. Its use requires an implementation of
``parentNode()`` on your model. In our ``User`` model we will add the
following.

::

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => array('type' => 'requester'));
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        if (isset($this->data['User']['group_id'])) {
        $groupId = $this->data['User']['group_id'];
        } else {
            $groupId = $this->field('group_id');
        }
        if (!$groupId) {
        return null;
        } else {
            return array('Group' => array('id' => $groupId));
        }
    }

Then in our ``Group`` Model Add the following:

::

    var $actsAs = array('Acl' => array('type' => 'requester'));
     
    function parentNode() {
        return null;
    }

What this does, is tie the ``Group`` and ``User`` models to the Acl, and
tell CakePHP that every-time you make a User or Group you want an entry
on the ``aros`` table as well. This makes Acl management a piece of cake
as your AROs become transparently tied to your ``users`` and ``groups``
tables. So anytime you create or delete a user/group the Aro table is
updated.

Our controllers and models are now prepped for adding some initial data,
and our ``Group`` and ``User`` models are bound to the Acl table. So add
some groups and users using the baked forms by browsing to
http://example.com/groups/add and http://example.com/users/add. I made
the following groups:

-  administrators
-  managers
-  users

I also created a user in each group so I had a user of each different
access group to test with later. Write everything down or use easy
passwords so you don't forget. If you do a ``SELECT * FROM aros;`` from
a mysql prompt you should get something like the following:

::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

This shows us that we have 3 groups and 3 users. The users are nested
inside the groups, which means we can set permissions on a per-group or
per-user basis.

11.2.4.1 Group-only ACL
-----------------------

In case we want simplified per-group only permissions, we need to
implement ``bindNode()`` in ``User`` model.

::

    function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

This method will tell ACL to skip checking ``User`` Aro's and to check
only ``Group`` Aro's.

Every user has to have assigned ``group_id`` for this to work.

In this case our ``aros`` table will look like this:

::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

Creating ACOs (Access Control Objects)
======================================

Now that we have our users and groups (aros), we can begin inputting our
existing controllers into the Acl and setting permissions for our groups
and users, as well as enabling login / logout.

Our ARO are automatically creating themselves when new users and groups
are created. What about a way to auto-generate ACOs from our controllers
and their actions? Well unfortunately there is no magic way in CakePHP's
core to accomplish this. The core classes offer a few ways to manually
create ACO's though. You can create ACO objects from the Acl shell or
You can use the ``AclComponent``. Creating Acos from the shell looks
like:

::

    cake acl create aco root controllers

While using the AclComponent would look like:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Both of these examples would create our 'root' or top level ACO which is
going to be called 'controllers'. The purpose of this root node is to
make it easy to allow/deny access on a global application scope, and
allow the use of the Acl for purposes not related to controllers/actions
such as checking model record permissions. As we will be using a global
root ACO we need to make a small modification to our ``AuthComponent``
configuration. ``AuthComponent`` needs to know about the existence of
this root node, so that when making ACL checks it can use the correct
node path when looking up controllers/actions. In ``AppController`` add
the following to the ``beforeFilter``:

::

    $this->Auth->actionPath = 'controllers/';

An Automated tool for creating ACOs
===================================

As mentioned before, there is no pre-built way to input all of our
controllers and actions into the Acl. However, we all hate doing
repetitive things like typing in what could be hundreds of actions in a
large application. We've whipped up an automated set of functions to
build the ACO table. These functions will look at every controller in
your application. It will add any non-private, non ``Controller``
methods to the Acl table, nicely nested underneath the owning
controller. You can add and run this in your ``AppController`` or any
controller for that matter, just be sure to remove it before putting
your application into production.

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
            $Controllers = App::objects('controller');
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
http://localhost/groups/build\_acl, This will build your ACO table.

You might want to keep this function around as it will add new ACO's for
all of the controllers & actions that are in your application any time
you run it. It does not remove nodes for actions that no longer exist
though. Now that all the heavy lifting is done, we need to set up some
permissions, and remove the code that disabled ``AuthComponent``
earlier.

The original code on this page did not take into account that you might
use plugins for your application, and in order for you to have seamless
plugin support in your Acl-controlled application, we have updated the
above code to automatically include the correct plugins wherever
necessary. Note that running this action will place some debug
statements at the top of your browser page as to what
Plugin/Controller/Action was added to the ACO tree and what was not.

Setting up permissions
======================

Creating permissions much like creating ACO's has no magic solution, nor
will I be providing one. To allow ARO's access to ACO's from the shell
interface use the AclShell. For more information on how to use it
consult the aclShell help which can be accessed by running:

::

    cake acl help

Note: \* needs to be quoted ('\*')

In order to allow with the ``AclComponent`` we would use the following
code syntax in a custom method:

::

    $this->Acl->allow($aroAlias, $acoAlias);

We are going to add in a few allow/deny statements now. Add the
following to a temporary function in your ``UsersController`` and visit
the address in your browser to run them (e.g.
http://localhost/cake/app/users/initdb). If you do a
``SELECT * FROM aros_acos`` you should see a whole pile of 1's and -1's.
Once you've confirmed your permissions are set, remove the function.

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

We now have set up some basic access rules. We've allowed administrators
to everything. Managers can access everything in posts and widgets.
While users can only access add and edit in posts & widgets.

We had to get a reference of a ``Group`` model and modify its id to be
able to specify the ARO we wanted, this is due to how ``AclBehavior``
works. ``AclBehavior`` does not set the alias field in the ``aros``
table so we must use an object reference or an array to reference the
ARO we want.

You may have noticed that I deliberately left out index and view from my
Acl permissions. We are going to make view and index public actions in
``PostsController`` and ``WidgetsController``. This allows
non-authorized users to view these pages, making them public pages.
However, at any time you can remove these actions from
``AuthComponent::allowedActions`` and the permissions for view and edit
will revert to those in the Acl.

Now we want to take out the references to ``Auth->allowedActions`` in
your users and groups controllers. Then add the following to your posts
and widgets controllers:

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
default routing has this action as the home page for you application.

Logging in
==========

Our application is now under access control, and any attempt to view
non-public pages will redirect you to the login page. However, we will
need to create a login view before anyone can login. Add the following
to ``app/views/users/login.ctp`` if you haven't done so already.

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

You may also want to add a flash() for Auth messages to your layout.
Copy the default core layout - found at
``cake/libs/view/layouts/default.ctp`` - to your app layouts folder if
you haven't done so already. In ``app/views/layouts/default.ctp`` add

::

    echo $this->Session->flash('auth');

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be displayed if
you added the ``echo $this->Session->flash('auth')``

Logout
======

Now onto the logout. Earlier we left this function blank, now is the
time to fill it. In ``UsersController::logout()`` add the following:

::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

This sets a Session flash message and logs out the User using Auth's
logout method. Auth's logout method basically deletes the Auth Session
Key and returns a url that can be used in a redirect. If there is other
session data that needs to be deleted as well add that code here.

All done
========

You should now have an application controlled by Auth and Acl. Users
permissions are set at the group level, but you can set them by user at
the same time. You can also set permissions on a global and
per-controller and per-action basis. Furthermore, you have a reusable
block of code to easily expand your ACO table as your app grows.
