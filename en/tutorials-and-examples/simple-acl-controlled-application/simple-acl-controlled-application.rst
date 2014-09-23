Simple Acl controlled Application
#################################

.. note::

    This isn't a beginner level tutorial. If you are just starting out with
    CakePHP we would advise you to get a better overall experience of the
    framework's features before trying out this tutorial.


In this tutorial you will create a simple application with
:doc:`/core-libraries/components/authentication` and
:doc:`/core-libraries/components/access-control-lists`. This
tutorial assumes you have read the :doc:`/tutorials-and-examples/blog/blog`
tutorial, and you are familiar with
:doc:`/console-and-shells/code-generation-with-bake`. You should have
some experience with CakePHP, and be familiar with MVC concepts.
This tutorial is a brief introduction to the
:php:class:`AuthComponent` and :php:class:`AclComponent`\.

What you will need


#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get CakePHP up and running without
   any configuration at all.
#. A database server. We're going to be using MySQL in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: CakePHP will be taking the reins from there.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.

Preparing our Application
=========================

First, let's get a copy of fresh CakePHP code.

To get a fresh download, visit the CakePHP project at GitHub:
https://github.com/cakephp/cakephp/tags and download the stable
release. For this tutorial you need the latest 2.0 release.


You can also clone the repository using
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Once you've got a fresh copy of cake setup your database.php config
file, and change the value of Security.salt in your
app/Config/core.php. From there we will build a simple database
schema to build our application on. Execute the following SQL
statements into your database::

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
application. Once we have the table structure in the database we
can start cooking. Use
:doc:`/console-and-shells/code-generation-with-bake` to quickly
create your models, controllers, and views.

To use cake bake, call "cake bake all" and this will list the 4
tables you inserted into mySQL. Select "1. Group", and follow the
prompts. Repeat for the other 3 tables, and this will have
generated the 4 controllers, models and your views for you.

Avoid using Scaffold here. The generation of the ACOs will be
seriously affected if you bake the controllers with the Scaffold
feature.

While baking the Models cake will automagically detect the
associations between your Models (or relations between your
tables). Let cake supply the correct hasMany and belongsTo
associations. If you are prompted to pick hasOne or hasMany,
generally speaking you'll need a hasMany (only) relationships for
this tutorial.

Leave out admin routing for now, this is a complicated enough
subject without them. Also be sure **not** to add either the Acl or
Auth Components to any of your controllers as you are baking them.
We'll be doing that soon enough. You should now have models,
controllers, and baked views for your users, groups, posts and
widgets.

Preparing to Add Auth
=====================

We now have a functioning CRUD application. Bake should have setup
all the relations we need, if not add them in now. There are a few
other pieces that need to be added before we can add the Auth and
Acl components. First add a login and logout action to your
``UsersController``::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirect());
            }
            $this->Session->setFlash(__('Your username or password was incorrect.'));
        }
    }

    public function logout() {
        //Leave empty for now.
    }

Then create the following view file for login at
``app/View/Users/login.ctp``::

    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');

Next we'll have to update our User model to hash passwords before they go into
the database. Storing plaintext passwords is extremely insecure and
AuthComponent will expect that your passwords are hashed. In
``app/Model/User.php`` add the following::

    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // other code.

        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password(
              $this->data['User']['password']
            );
            return true;
        }
    }

Next we need to make some modifications to ``AppController``. If
you don't have ``/app/Controller/AppController.php``, create it. Since we want our entire
site controlled with Auth and Acl, we will set them up in
``AppController``::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );
        public $helpers = array('Html', 'Form', 'Session');

        public function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->loginAction = array(
              'controller' => 'users', 
              'action' => 'login'
            );
            $this->Auth->logoutRedirect = array(
              'controller' => 'users', 
              'action' => 'login'
            );
            $this->Auth->loginRedirect = array(
              'controller' => 'posts', 
              'action' => 'add'
            );
        }
    }

Before we set up the ACL at all we will need to add some users and
groups. With :php:class:`AuthComponent` in use we will not be able to access
any of our actions, as we are not logged in. We will now add some
exceptions so :php:class:`AuthComponent` will allow us to create some groups
and users. In **both** your ``GroupsController`` and your
``UsersController`` Add the following::

    public function beforeFilter() {
        parent::beforeFilter();

        // For CakePHP 2.0
        $this->Auth->allow('*');

        // For CakePHP 2.1 and up
        $this->Auth->allow();
    }

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a
few users and groups into our database. Don't add any users or
groups just yet though.

Initialize the Db Acl tables
============================

Before we create any users or groups we will want to connect them
to the Acl. However, we do not at this time have any Acl tables and
if you try to view any pages right now, you will get a missing
table error ("Error: Database table acos for model Aco was not
found."). To remove these errors we need to run a schema file. In a
shell run the following::

    ./Console/cake schema create DbAcl

This schema will prompt you to drop and create the tables. Say yes
to dropping and creating the tables.

If you don't have shell access, or are having trouble using the
console, you can run the sql file found in
/path/to/app/Config/Schema/db\_acl.sql.

With the controllers setup for data entry, and the Acl tables
initialized we are ready to go right? Not entirely, we still have a
bit of work to do in the user and group models. Namely, making them
auto-magically attach to the Acl.

Acts As a Requester
===================

For Auth and Acl to work properly we need to associate our users
and groups to rows in the Acl tables. In order to do this we will
use the ``AclBehavior``. The ``AclBehavior`` allows for the
automagic connection of models with the Acl tables. Its use
requires an implementation of ``parentNode()`` on your model. In
our ``User`` model we will add the following::

    class User extends AppModel {
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
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
    }

Then in our ``Group`` Model Add the following::

    class Group extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            return null;
        }
    }

What this does, is tie the ``Group`` and ``User`` models to the
Acl, and tell CakePHP that every-time you make a User or Group you
want an entry on the ``aros`` table as well. This makes Acl
management a piece of cake as your AROs become transparently tied
to your ``users`` and ``groups`` tables. So anytime you create or
delete a user/group the Aro table is updated.

Our controllers and models are now prepped for adding some initial
data, and our ``Group`` and ``User`` models are bound to the Acl
table. So add some groups and users using the baked forms by
browsing to http://example.com/groups/add and
http://example.com/users/add. I made the following groups:

-  administrators
-  managers
-  users

I also created a user in each group so I had a user of each
different access group to test with later. Write everything down or
use easy passwords so you don't forget. If you do a
``SELECT * FROM aros;`` from a mysql prompt you should get
something like the following::

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

This shows us that we have 3 groups and 3 users. The users are
nested inside the groups, which means we can set permissions on a
per-group or per-user basis.

Group-only ACL
--------------

In case we want simplified per-group only permissions, we need to
implement ``bindNode()`` in ``User`` model::

    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

Then modify the ``actsAs`` for the model ``User`` and disable the requester directive::

    public $actsAs = array('Acl' => array('type' => 'requester', 'enabled' => false));

These two changes will tell ACL to skip checking ``User`` Aro's and to check only ``Group`` 
Aro's. This also avoids the afterSave being called.

Note: Every user has to have ``group_id`` assigned for this to work.

Now the ``aros`` table will look like this::

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

Now that we have our users and groups (aros), we can begin
inputting our existing controllers into the Acl and setting
permissions for our groups and users, as well as enabling login /
logout.

Our ARO are automatically creating themselves when new users and
groups are created. What about a way to auto-generate ACOs from our
controllers and their actions? Well unfortunately there is no magic
way in CakePHP's core to accomplish this. The core classes offer a
few ways to manually create ACO's though. You can create ACO
objects from the Acl shell or You can use the ``AclComponent``.
Creating Acos from the shell looks like::

    ./Console/cake acl create aco root controllers

While using the AclComponent would look like::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

Both of these examples would create our 'root' or top level ACO
which is going to be called 'controllers'. The purpose of this root
node is to make it easy to allow/deny access on a global
application scope, and allow the use of the Acl for purposes not
related to controllers/actions such as checking model record
permissions. As we will be using a global root ACO we need to make
a small modification to our ``AuthComponent`` configuration.
``AuthComponent`` needs to know about the existence of this root
node, so that when making ACL checks it can use the correct node
path when looking up controllers/actions. In ``AppController`` ensure
that your ``$components`` array contains the ``actionPath`` defined earlier::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );

Continue to :doc:`part-two` to continue the tutorial.


.. meta::
    :title lang=en: Simple Acl controlled Application
    :keywords lang=en: core libraries,auto increment,object oriented programming,database schema,sql statements,php class,stable release,code generation,database server,server configuration,reins,access control,shells,mvc,authentication,web server,cakephp,servers,checkout,apache
