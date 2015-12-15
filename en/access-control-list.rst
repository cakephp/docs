Access Control Lists
####################

.. warning::
    This is a non-stable plugin for CakePHP 3.0 at this time. It is
    currently under development and should be considered experimental.

Powerful things require access control. Access Control Lists are a
way to manage application permissions in a fine-grained, yet easily
maintainable and manageable way.

This plugin can be found on GitHub `ACL Plugin <https://github.com/cakephp/acl/>`_.

Installation
============

In CakePHP 3, ACL is now in a separate plugin. To install the ACL
plugin, you can use ``composer``. From your application's ROOT
directory (where composer.json file is located) run the following::

    php composer.phar require cakephp/acl "dev-master"

You will need to add the following line to your application's
**config/bootstrap.php** file::

    Plugin::load('Acl', ['bootstrap' => true]);

Understanding How ACL Works
===========================

Access control lists, or ACL, handle two main things: things that
want stuff, and things that are wanted. In ACL lingo, things (most
often users) that want to use stuff are represented by access request
objects, or AROs. Things in the system that are wanted (most often
actions or data) are represented by access control objects, or ACOs. The
entities are called 'objects' because sometimes the requesting
object isn't a person. Sometimes you might want to limit the
ability of certain CakePHP controllers to initiate logic in other
parts of your application. ACOs could be anything you want to
control, from a controller action, to a web service, to a line in
your grandma's online diary.

To review:

-  ACO - Access Control Object - Represents something that is wanted
-  ARO - Access Request Object - Represents something that wants something else

Essentially, ACLs are used to decide when an ARO can have
access to an ACO.

In order to help you understand how everything works together,
let's use a semi-practical example. Imagine, for a moment, a
computer system used by a familiar group of adventurers
from the fantasy novel *Lord of the Rings*. The leader of the group,
Gandalf, wants to manage the party's assets while maintaining a
healthy amount of privacy and security for the other members of the
party. The first thing he needs to do is create a list of the AROs
(requesters) involved:


-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

.. note::

    Realize that ACL is *not* the same as authentication. ACL is what
    happens *after* a user has been authenticated. Although the two are
    usually used in concert, it's important to realize the difference
    between knowing who someone is (authentication) and knowing what
    they can do (ACL).

The next thing Gandalf needs to do is make an initial list of
ACOs (resources) the system will handle. His list might look
something like:


-  Weapons
-  The One Ring
-  Salted Pork
-  Diplomacy
-  Ale

Traditionally, systems were managed using a sort of matrix that
showed a basic set of users and permissions relating to objects. If
this information were stored in a table, it might look like this:

======== ======== ========= ============ ========== =======
x        Weapons  The Ring  Salted Pork  Diplomacy  Ale
======== ======== ========= ============ ========== =======
Gandalf                     Allow        Allow      Allow
-------- -------- --------- ------------ ---------- -------
Aragorn  Allow              Allow        Allow      Allow
-------- -------- --------- ------------ ---------- -------
Bilbo                                               Allow
-------- -------- --------- ------------ ---------- -------
Frodo             Allow                             Allow
-------- -------- --------- ------------ ---------- -------
Gollum                      Allow
-------- -------- --------- ------------ ---------- -------
Legolas  Allow              Allow        Allow      Allow
-------- -------- --------- ------------ ---------- -------
Gimli    Allow              Allow
-------- -------- --------- ------------ ---------- -------
Pippin                                   Allow      Allow
-------- -------- --------- ------------ ---------- -------
Merry                                    Allow      Allow
======== ======== ========= ============ ========== =======

At first glance, it seems that this sort of system could work
rather well. Assignments can be made to protect security (only
Frodo can access the ring) and protect against accidents (keeping
the hobbits out of the salted pork and weapons). It seems sufficiently
fine-grained and easy to read, right?

For a small system like this, maybe a matrix setup would work. But
for a growing system, or a system with a large number of resources
(ACOs) and users (AROs), a table can quickly become unwieldy.
Imagine trying to control access to the hundreds of war
encampments and trying to manage them by unit. Another drawback to
matrices is that you can't create logical groups of users
or make cascading permissions changes to groups of users based on
those logical groupings. For example, it would sure be nice to
automatically allow the hobbits access to the ale and pork once the
battle is over. Doing it on an individual user basis would be
tedious and error prone. Making a cascading permissions change to
all members of the 'hobbit' group at once would be easy.

ACL is most usually implemented in a tree structure, with
a tree of AROs and a tree of ACOs. By organizing your
objects in trees, you can deal out permissions in a granular
fashion while maintaining a good grip on the big picture.
Being the wise leader he is, Gandalf elects to use ACL in his new
system, and organizes his objects along the following lines:

-  Fellowship of the Ring™

   -  Warriors

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards

      -  Gandalf

   -  Hobbits

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors

      -  Gollum

Using a tree structure for AROs allows Gandalf to define
permissions that apply to entire groups of users at once. So, using
our ARO tree, Gandalf can tack on a few group-based permissions:

-  Fellowship of the Ring
   (**Deny**: all)

   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)

      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors
      (**Allow**: Salted Pork)

      -  Gollum

If we wanted to use ACL to see whether Pippin was allowed to access
the ale, we'd first consult the tree to retrieve his path through it, which is
Fellowship->Hobbits->Pippin. Then we see the different permissions
that reside at each of those points, and use the most specific
permission relating to Pippin and the Ale.

======================= ================ =======================
ARO Node                Permission Info  Result
======================= ================ =======================
Fellowship of the Ring  Deny all         Denying access to ale.
----------------------- ---------------- -----------------------
Hobbits                 Allow 'ale'      Allowing access to ale!
----------------------- ---------------- -----------------------
Pippin                  --               Still allowing ale!
======================= ================ =======================

.. note::

    Since the 'Pippin' node in the ACL tree doesn't specifically deny
    access to the ale ACO, the final result is that we allow access to
    that ACO.

The tree also allows us to make finer adjustments for more granular
control, while still keeping the ability to make sweeping changes
to groups of AROs:

-  Fellowship of the Ring
   (**Deny**: all)

   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)

      -  Aragorn
         (Allow: Diplomacy)
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)

      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)

      -  Frodo
         (Allow: Ring)
      -  Bilbo
      -  Merry
         (Deny: Ale)
      -  Pippin
         (Allow: Diplomacy)

   -  Visitors
      (**Allow**: Salted Pork)

      -  Gollum

This approach allows us the ability to make both wide-reaching
permissions changes and fine-grained adjustments. This allows
us to say that all hobbits can have access to ale, with one
exception: Merry. To see whether Merry can access the Ale, we'd find his
path in the tree: Fellowship->Hobbits->Merry. Then we'd work our way down,
keeping track of ale-related permissions:

======================= ================ =======================
ARO Node                Permission Info  Result
======================= ================ =======================
Fellowship of the Ring  Deny all         Denying access to ale.
----------------------- ---------------- -----------------------
Hobbits                 Allow 'ale'      Allowing access to ale!
----------------------- ---------------- -----------------------
Merry                   Deny Ale         Denying ale.
======================= ================ =======================

Defining Permissions: CakePHP's Database ACL
============================================

By default, this ACL plugin is database-driven. We recommend
that you use the database backed ACL solution, mostly because of
its ability to create new ACOs and AROs on the fly.

Getting Started
---------------

The default ACL permissions implementation is powered by a database.
CakePHP's database ACL consists of a set of models, behavior,
component and a console application that comes with the ACL plugin.
The models and behavior are used by the plugin to interact with your
database in order to store and retrieve nodes in tree format.
The console application is used to initialize your database and
interact with your ACO and ARO trees.

To get started, first you'll need to make sure your
``config/database.php`` is present and correctly configured.

Once you've done that, you will need to create ACL related tables by
running the following :doc:`/migrations` command::

    bin/cake migrations migrate -p Acl

Running this command will create the tables necessary to store ACO
and ARO information in tree format.

.. note::

    This replaces the older command in CakePHP 2.x ``cake schema create DbAcl``.

You can also use the SQL file found in the plugin directory
`config/Schema/acl.sql <https://github.com/cakephp/acl/blob/master/config/Schema/acl.sql/>`_,
but that's nowhere near as fun.

When finished, you should have three new database tables in your
system: acos, aros, and aros\_acos (the join table to create
permissions information between the two trees).

.. note::

    If you're curious about how work the tree traversal, read up
    on the :doc:`/orm/behaviors/tree` behavior.

Now that we're all set up, let's work on creating some ARO and ACO
trees.

Creating Access Request Objects (AROs) and Access Control Objects (ACOs)
------------------------------------------------------------------------

When creating new ACL objects (ACOs and AROs), realize that there are
two main ways to name and access nodes. The *first* method is to
link an ACL object directly to a record in your database by
specifying a model name and foreign key value. The *second*
can be used when an object has no direct relation to a record in
your database - you can provide a textual alias for the object.

.. note::

    In general, when you're creating a group or higher-level object,
    use an alias. If you're managing access to a specific item or
    record in the database, use the model/foreign key method.

You create new ACL objects using the plugin ACL models. In
doing so, there are a number of fields you'll want to use when
saving data: ``model``, ``foreign_key``, ``alias``, and
``parent_id``.

The ``model`` and ``foreign_key`` fields for an ACL object allow
you to link the object to its corresponding model record (if
there is one). For example, many AROs will have corresponding User
records in the database. Setting an ARO's ``foreign_key`` to the
User's ID will allow you to link up ARO and User information with a
single User model find() call if you've set up the correct model
associations. Conversely, if you want to manage edit operation on a
specific blog post or recipe listing, you may choose to link an ACO
to that specific model record.

An ``alias`` is just a human-readable label you
can use to identify an ACL object that has no direct model record
correlation. Aliases are generally useful in naming user groups or
ACO collections.

The ``parent_id`` for an ACL object allows you to fill out the tree
structure. Supply the ID of the parent node in the tree to create a
new child.

Before we can create new ACL objects, we'll need to load up their
respective classes. The easiest way to do this is to include the
ACL Component in the ``initialize()`` controller's method using the
``$this->loadComponent()`` method::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Acl.Acl');
        }
    }

You can also include the ACL Component in your controller's
``$components`` array::

    class PostsController extends AppController
    {
        public $components = [
            'Acl.Acl'
        ];
    }

.. note::

    More information about loading/configuring Components can be found in the
    :ref:`Configuring Components <configuring-components>` part.

Once we've got that done, let's see some examples of creating
these objects. The following code could be placed
in a controller action:

.. note::

    While the examples here focus on ARO creation, the same techniques
    can be used to create an ACO tree.

In order, to get our ACO working properly, let's first create our ARO
groups. Because they won't have specific records tied to them,
we'll use aliases to create the ACL objects. Here, we create them
via a controller action, but we could do it elsewhere.

Our approach shouldn't be drastically new - we're just using
models to save data like we always do::

    public function createAro()
    {
        // Load the ARO Table
        $aro = $this->loadModel('Aros');

        // Here's all of our group info in an array we can iterate through
        $groups = [
            [
                'alias' => 'warriors'
            ],
            [
                'alias' => 'wizards'
            ],
            [
                'alias' => 'hobbits'
            ],
            [
                'alias' => 'visitors'
            ]
        ];

        // Iterate and create ARO groups
        foreach ($groups as $data) {
            // Create the new entity
            $entity = $aro->newEntity($data);

            // Save the entity
            $aro->save($entity);
        }

        // Other action logic goes here...
    }

Once we've got the groups, we can use the ACL console
application to verify the tree structure::

    $ bin/cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors.1

      [2]wizards.2

      [3]hobbits.3

      [4]visitors.4

    ---------------------------------------------------------------

The tree is still simple at this point, but at least we've
got some verification that we've got four top-level nodes. Let's
add some children to those ARO nodes by putting our specific user
AROs under these groups. Every good citizen of Middle Earth has an
account in our new system, so we'll tie these ARO records to
specific model records in our database.

.. note::

    When adding child nodes to a tree, make sure to use the ACL node
    ID, rather than a ``foreign_key`` value.

::

    public function createChildsAro()
    {
        // Load the ARO Table
        $aro = $this->loadModel('Aros');

        // Here are our user records, ready to be linked to new ARO records.
        // This data could come from a model and be modified, but we're using static
        // arrays here for demonstration purposes.

        $users = [
            [
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ],
            [
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ],
            [
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ],
            [
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ],
            [
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ],
            [
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ],
            [
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ],
            [
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ],
            [
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ]
        ];

        // Iterate and create AROs (as children)
        foreach ($users as $data) {
            // Create the new entity
            $entity = $aro->newEntity($data);

            // Save the entity
            $aro->save($entity);
        }

        // Other action logic goes here...
    }

.. note::

    Typically you won't supply both an alias and a model/foreign\_key,
    but we're using both here to make the structure of the tree easier
    to read for demonstration purposes.

The output of that console application command should now be a
little more interesting. Let's give it a try:

::

    $ bin/cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors

        [5]Aragorn

        [6]Legolas

        [7]Gimli

      [2]wizards

        [8]Gandalf

      [3]hobbits

        [9]Frodo

        [10]Bilbo

        [11]Merry

        [12]Pippin

      [4]visitors

        [13]Gollum

    ---------------------------------------------------------------

Now that we've got our ARO tree setup properly, let's discuss a
possible approach for structuring an ACO tree. While we can
put together a more abstract representation of our ACO's, it's
often more practical to model an ACO tree after CakePHP's
Controller/Action setup. We've got five main objects we're handling
in this Fellowship scenario. The natural setup for this in a
CakePHP application consists of a group of models, and ultimately the
controllers that manipulate them. Beyond the controllers themselves,
we'll want to control access to specific actions in those
controllers.

Let's set up an ACO tree that will mimic a CakePHP
app setup. Since we have five ACOs, we'll create an ACO tree that
should end up looking something like the following:

-  Weapons
-  Rings
-  PorkChops
-  DiplomaticEfforts
-  Ales

You can create children nodes under each of these five main ACOs,
but using CakePHP's built-in action management covers basic CRUD
operations on a given object. Keeping this in mind will make your
ACO trees smaller and easier to maintain. We'll see how these are
used later on when we discuss how to assign permissions.

Since you're now a pro at adding AROs, use those same techniques to
create this ACO tree. Create these upper level groups using the
core Aco model.

Assigning Permissions
---------------------

After creating our ACOs and AROs, we can finally assign permissions
between the two groups. This is done using the plugin Acl
Component. Let's continue with our example.

Here we'll work with Acl permisions in the context of a controller
action. Let's set up some basic permissions using the plugin Acl
Component in an action inside our controller::

    class SomethingsController extends AppController
    {
        // You might want to place this in the AppController
        // instead, but here works great too.
        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Acl.Acl');
        }

        public function setPermissions()
        {
            // Allow warriors complete access to weapons
            // Both these examples use the alias syntax
            $this->Acl->allow('warriors', 'Weapons');

            // Though the King may not want to let everyone
            // have unfettered access
            $this->Acl->deny('warriors/Legolas', 'Weapons', 'delete');
            $this->Acl->deny('warriors/Gimli',   'Weapons', 'delete');

            die(print_r('done', 1));
        }

The first call we make to the Acl Component allows any user under
the 'warriors' ARO group full access to anything under the
'Weapons' ACO group. Here we're just addressing ACOs and AROs by
their aliases.

Notice the usage of the third parameter? One nice thing about the CakePHP
ACL setup is that permissions contain four built-in properties related
to CRUD (create, read, update, and delete) actions for convenience. The
default options for that parameter are ``create``, ``read``, ``update``,
and ``delete`` but you can add a column in the ``aros_acos``
database table (prefixed with \_ - for example ``_admin``) and use
it alongside the defaults.

The second set of calls is an attempt to make a more fine-grained
permission decision. We want Aragorn to keep his full-access
privileges, but we want to deny other warriors in the group the ability to
delete Weapons records. We're using the alias syntax to address the
AROs above, but you might want to use the model/foreign\_key syntax
yourself. What we have above is equivalent to this::

    // 6342 = Legolas
    // 1564 = Gimli

    $this->Acl->deny(
      ['model' => 'User', 'foreign_key' => 6342],
      'Weapons',
      'delete'
    );
    $this->Acl->deny(
      ['model' => 'User', 'foreign_key' => 1564],
      'Weapons',
      'delete'
    );

.. note::

    Addressing a node using the alias syntax uses a slash-delimited
    ``'/users/employees/developers'``. Addressing a node using
    model/foreign\_key syntax uses an array with two parameters:
    ``['model' => 'User', 'foreign_key' => 8282]``.

The next section will help us validate our setup by using the plugin
Acl Component to check the permissions we've just set up.

Checking Permissions: The ACL Component
---------------------------------------

Let's use the plugin Acl Component to make sure dwarves and elves can't
remove things from the armory. At this point, we should be able to
use the Acl Component to make a check between the ACOs and AROs
we've created. The basic syntax for making a permissions check is::

    $this->Acl->check($aro, $aco, $action = '*');

Let's give it a try inside a controller action::

    public function index()
    {
        // These all return true:
        $this->Acl->check('warriors/Aragorn', 'Weapons');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'create');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'read');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'update');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'delete');

        // Remember, we can use the model/id syntax
        // for our user AROs
        // /!\ NEED TO VERIFY THAT STILL WORK IN THE 3.0 /!\
        $this->Acl->check(['User' => ['id' => 2356]], 'Weapons');

        // These also return true:
        $this->Acl->check('warriors/Legolas', 'Weapons', 'create');
        $this->Acl->check('warriors/Gimli', 'Weapons', 'read');

        // But these return false:
        $this->Acl->check('warriors/Legolas', 'Weapons', 'delete');
        $this->Acl->check('warriors/Gimli', 'Weapons', 'delete');
    }

The usage here is for demonstration, but this type of checking
can be used to decide whether to allow an action, show an error message,
or redirect the user to a login.
