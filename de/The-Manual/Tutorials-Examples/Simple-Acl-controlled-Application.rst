Eine einfache ACL kontrollierte Anwendung.
##########################################

Willkommen zu CakePHP. Wenn Du dich noch nicht mit CakePHP auskennst,
arbeite erstmal das Blog-Tutorial durch. Wenn Du das Blog-Tutorial
bereits durch hast und Dich mit Bake auskennst, kannst Du Dich nun mit
dem Einrichten einer Access Control List (ACL) und der dazugehörigen
Authentifizierung (Auth) beschäftigen.

Wie bereits gesagt, musst Du mit CakePHP Erfahrung haben, um dieses
Tutorial durchzuarbeiten. Du kennst Dich mit allen MVC Kernkonzepten
aus. Du bist bereit die Cake-Konsole mit Bake zu nutzen. Falls nein,
musst Du Dich erst damit beschäftigen und dann wieder kommen. So wird
Dir das Tutorial viel leichter fallen und macht mehr Sinn für Dich. In
diesem Tutorial nutzen wir die
```AuthComponent`` </de/view/172/Authentication>`_ und
```AclComponent`` </de/view/171/Access-Control-Lists>`_. Wenn Du deren
Nutzen nicht kennst, gehe die Seiten zuerst durch.

**Was Du benötigst:**

#. **Einen laufenden Webserver.** Wir nehmen an, dass Du Apache nutzt,
   jedoch ist es für andere Server sehr ähnlich. Wir müssen vielleicht
   ein bisschen mit der Konfiguration spielen aber die meisten bekommen
   auch ohne Konfiguration Cake zum laufen.
#. **Einen Datenbankserver.** Wir werden in diesem Tutorial MySQL
   verwenden. Du musst genug über SQL wissen um eine Datenbank zu
   erstellen: CakePHP übernimmt danach alles andere.
#. **PHP Basiswissen.** Je mehr Erfahrung Du in objektorientierter
   Programmierung hast, desto besser. Aber keine Angst, wenn Du ein Fan
   prozeduraler Programmierung bist.

Vorbereiten der Anwendung
=========================

Als erstes musst Du eine frische CakePHP Kopie holen.

Um an den Download zu kommen, besuche das CakePHP Projekt in der und lade das
stable Release herunter. Für dieses Tutorial benötigst Du die Version
1.2.x.x.

Du kannst auch einen SVN checkout/export von unserem trunk code machen
unter: https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/

Jetzt wo Du die frische Kopie hast, konfiguriere Deine database.php
Datei und ändere den Wert des Security.salt in deinem Ordner:
app/config/core.php. Von dort an, werden wir ein einfaches Datenbank
Schema erstellen, um unsere Anwendung zu entwickeln. Führe den folgenden
SQL Code in deiner Datenbank aus.

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

Dies sind die Tabellen mit welchen wir den Rest unserer Anwendung
erstellen. Nun wo wir die Tabellenstruktur in der Datenbank haben,
koennen wir anfangen zu backen. Benutze cake bake um schnell deine
Models, Controller und Views zu erstellen. Lasse das Admin-Routing
ausgeschaltet, dieses Thema ist kompliziert genug, auch ohne
Admin-Routing. Sei Dir sicher, dass Du **keinem** Controller, welchen Du
bäckst, entweder die ACL oder Auth Komponente zugewiesen hast. Wir
werden das schnell genug machen. Du solltest nun Models, Controller und
gebackene Views für Users, Groups, Posts und Widgets haben.

Im ``actions`` Modus, wird dies ARO (Gruppen und Benutzer) gegen die ACO
Objekte (Controller & Actions) authentifizieren.

Vorbereiten zum hinzuzufügen von Auth
=====================================

Wir haben nun eine funktionierende CRUD-Anwendung. *Bake* sollte all die
benötigten Verbindungen der *Models* erstellt haben. Falls nicht,
erstelle sie jetzt. Es gibt noch einige weitere Dinge, die eingefügt
werden müssen, bevor wir die Auth und ACL Komponenten integrieren
können. Als erstes, füge eine login und logout Action deinem
``UsersController`` hinzu.

::

    function login() {
        //Auth Magic
    }

    function logout() {
        //Leave empty for now.
    }

Wir müssen uns keine Gedanken um das einfügen einer Hashfunktion für die
Passwörter machen, da die Auth Komponente das für uns automatisch
erledigt, wenn man einen User anlegt, bearbeitet oder einloggt.
Vorausgesetzt es ist alles richtig konfiguriert. Darüberhinaus solltest
Du wissen, dass wenn Du eingehende Passwörter manuell durch eine
Hashfunktion leitest, ist die ``AuthComponent`` nicht in der lage, Dich
einzuloggen. Die Komponente wird die Passwörter erneut hashen und diese
können daraufhin nicht übereinstimmen.

Als nächstes müssen wir ein paar Modifikationen an unserem
``AppController`` durchführen. Falls Du noch keinen
``app_controller.php`` oder ``AppController`` hast, erstelle einen in
``app/app_controller.php``. Seit wir unsere Seite durch Auth und ACL
kontrolliert haben möchten, müssen wir diese in unserem
``AppController`` einrichten. Füge folgende Zeilen in Deinen
``AppController`` ein:

::

    var $components = array('Auth', 'Acl');

    function beforeFilter() {
        //Configure AuthComponent
        $this->Auth->authorize = 'actions';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
        $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
    }

Bevor wir die gesamte ACL einrichten, müssen wir einige Benutzer und
Gruppen erstellen. Mit der ``AuthComponent`` in Benutzung, sind wir aber
nicht in der Lage irgendeine Action auszuführen, ohne das wir eingeloggt
sind. Wir müssen einige Ausnahmen hinzufügen, welche uns erlauben die
Benutzer und Gruppen zu erstellen. Füge in **beidem**, also dem
``GroupsController`` und dem ``UsersController``, folgenden Code hinzu:

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('*');
    }

Diese Angaben teilen der ``AuthComponent`` mit, öffentlichen Zugang zu
allen *Actions* zu gewähren. Das ist nur temporär nötig und wird wieder
gelöscht, wenn wir einige Benutzer und Gruppen, in unsere Datenbank
eingefügt haben. Aber fang jetzt noch nicht an, irgendwelche Benutzer
und Gruppen zu erstellen.

Initialisieren der ACL Datenbanktabellen
========================================

Bevor wir irgendwelche Benutzer oder Gruppen anlegen, verbinden wir
diese mit der ACL. Wir haben im Moment aber noch keine ACL Tabellen und
somit bekommen wir einen „Missing Table“ Fehler, wenn wir versuchen eine
Seite aufrufen. Um diesen Fehler zu beheben, müssen wir eine Schema
Datei ausführen. Führe folgenden Code in der Konsole aus:
``cake schema run create DbAcl``. Dieses Schema wird dich auffordern die
entsprechenden Tabellen zu entfernen und (neu) zu erstellen. Stimme der
Aufforderung zu.

Mit den eingerichteten *Controllern* für das Einfügen der Daten und den
ACL Tabellen welche wir initialisiert haben, sind wir bereit zum
fortfahren, richtig? Nicht ganz. Wir haben noch ein bisschen Arbeit an
den *User* und *Group Models* zu erledigen. Sprich, wir wollen diese
automatisch an die ACL koppeln.

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
    var $actsAs = array('Acl' => 'requester');
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (empty($data['User']['group_id'])) {
            return null;
        } else {
            return array('Group' => array('id' => $data['User']['group_id']));
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

When modifying a user, you must manually update the ARO. This code
should be executed wherever you're updating the user information:

::

    // Check if their permission group is changing
    $oldgroupid = $this->User->field('group_id');
    if ($oldgroupid !== $this->data['User']['group_id']) {
        $aro =& $this->Acl->Aro;
        $user = $aro->findByForeignKeyAndModel($this->data['User']['id'], 'User');
        $group = $aro->findByForeignKeyAndModel($this->data['User']['group_id'], 'Group');
                    
        // Save to ARO table
        $aro->id = $user['Aro']['id'];
        $aro->save(array('parent_id' => $group['Aro']['id']));
    }

An alternative to the above Aro update after group\_id is changed, is to
add the below to your User model. Then you don't have to worry about
duplicate code.

::

    /**    
     * After save callback
     *
     * Update the aro for the user.
     *
     * @access public
     * @return void
     */
    function afterSave($created) {
            if (!$created) {
                $parent = $this->parentNode();
                $parent = $this->node($parent);
                $node = $this->node();
                $aro = $node[0];
                $aro['Aro']['parent_id'] = $parent[0]['Aro']['id'];
                $this->Aro->save($aro);
            }
    }

ACOs anlegen
============

Jetzt, da wir unsere Benutzer und Gruppen erstellt haben (aros), können
wir anfangen unsere existierenden Controller in die Acl zu
implementieren und Berechtigungen für unsere Benutzer und Gruppen zu
vergeben, ebenso können wir den login / logout aktivieren.

Unsere ARO's legen sich automatisch an, sobald neue Benutzer und/oder
Gruppen angelegt werden. Wie wäre es jetzt noch mit einer Möglichkeit
ACO's automatisch von unseren Controllern und deren "actions" generieren
zu lassen? Leider gibt es dafür keinen magischen Weg in Cake PHP's
Kern-Komponenten. Die Kern-Klassen bieten allerdings einige Wege die
ACO's manuell anzulegen. Es lassen sich ACO-Objekte über die Acl-Shell
anlegen oder man kann die ``Acl-Komponente`` benutzen. Aco's über die
Shell anzulegen sieht so aus:

::

    cake acl create aco root controllers

Über die Acl-Komponente würde es so aussehen:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Beide dieser Beispiele würden unser sogenanntes 'root' oder 'top level'
Acess Control Objekt anlegen, welches 'controller' genannt wird. Der
Zweck dieses Objektes ist es uns einen vereinfachten Zugriff auf Basis
eines globalen Anwendungsbereichs zu ermöglichen bzw. zu verweigern und
die Nutzung der Acl für Zwecke, die nicht mit dem Controller bzw.
Actions in Zusammenhang stehen, wie z. B. die Überprüfung der
Modeleinträge und deren Berechtigungen. Wenn wir das globale root-ACO
benutzen, müssen wir eine kleinere Veränderung an unserer
``AuthComponent``-Konfiguration vornehmen. Die ``AuthComponent`` muss
von der Existenz dieses root-ACOs wissen, damit sie auch die richtigen
Pfade benutzt, wenn die ACL über Controller/Actions überprüft wird. Füge
in Deinem ``AppController`` folgenden Code zu dem ``beforeFilter``
hinzu:

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
            $Controllers = Configure::listObjects('controller');
            $appIndex = array_search('App', $Controllers);
            if ($appIndex !== false ) {
                unset($Controllers[$appIndex]);
            }
            $baseMethods = get_class_methods('Controller');
            $baseMethods[] = 'buildAcl';

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

\* needs to be quoted ('\*')

To allow with the ``AclComponent`` do the following:

::

    $this->Acl->allow($aroAlias, $acoAlias);

We are going to add in a few allow/deny statements now. Add the
following to a temporary function in your ``UsersController`` and visit
the address in your browser to run them. If you do a
``SELECT * FROM aros_acos`` you should see a whole pile of 1's and 0's.
Once you've confirmed your permissions are set remove the function.

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
    echo $form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $form->input('User.username');
    echo $form->input('User.password');
    echo $form->end('Login');
    ?>

If a user is already logged in, redirect him:

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

    $session->flash('auth');

You should now be able to login and everything should work
auto-magically. When access is denied Auth messages will be displayed if
you added the ``$session->flash('auth')``

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

Schlusswort
===========

Du solltest nun eine Anwendung haben welche mit Auth und Acl prüft. User
Rechte werden durch Gruppen festgelegt, sie können dennoch auch direkt
für einen User gesetzt werden. Du kannst Rechte nun global, per
controller und per action setzen. Außerdem hast du ein Code welcher es
dir leicht macht deine ACO Tabellen leicht zu erweitern, wenn deine App
wächst.
