Access Control Lists
####################

.. php:class:: AclComponent(ComponentCollection $collection, array $settings = array())

CakePHP's access control list functionality is one of the most
oft-discussed, most likely because it is the most sought after, but
also because it can be the most confusing. If you're looking for a
good way to get started with ACLs in general, read on.

Be brave and stick with it, even if the going gets rough. Once you
get the hang of it, it's an extremely powerful tool to have on hand
when developing your application.

Understanding How ACL Works
===========================

Powerful things require access control. Access control lists are a
way to manage application permissions in a fine-grained, yet easily
maintainable and manageable way.

Access control lists, or ACL, handle two main things: things that
want stuff, and things that are wanted. In ACL lingo, things (most
often users) that want to use stuff are called access request
objects, or AROs. Things in the system that are wanted (most often
actions or data) are called access control objects, or ACOs. The
entities are called 'objects' because sometimes the requesting
object isn't a person - sometimes you might want to limit the
access certain Cake controllers have to initiate logic in other
parts of your application. ACOs could be anything you want to
control, from a controller action, to a web service, to a line on
your grandma's online diary.

To review:

-  ACO - Access Control Object - Something that is wanted
-  ARO - Access Request Object - Something that wants something

Essentially, ACL is what is used to decide when an ARO can have
access to an ACO.

In order to help you understand how everything works together,
let's use a semi-practical example. Imagine, for a moment, a
computer system used by a familiar group of fantasy novel
adventurers from the *Lord of the Rings*. The leader of the group,
Gandalf, wants to manage the party's assets while maintaining a
healthy amount of privacy and security for the other members of the
party. The first thing he needs to do is create a list of the AROs
involved:


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
things, or ACOs, the system will handle. His list might look
something like:


-  Weapons
-  The One Ring
-  Salted Pork
-  Diplomacy
-  Ale

Traditionally, systems were managed using a sort of matrix, that
showed a basic set of users and permissions relating to objects. If
this information were stored in a table, it might look like the
following table:

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
the hobbits out of the salted pork and weapons). It seems fine
grained enough, and easy enough to read, right?

For a small system like this, maybe a matrix setup would work. But
for a growing system, or a system with a large amount of resources
(ACOs) and users (AROs), a table can become unwieldy rather
quickly. Imagine trying to control access to the hundreds of war
encampments and trying to manage them by unit. Another drawback to
matrices is that you can't really logically group sections of users
or make cascading permissions changes to groups of users based on
those logical groupings. For example, it would sure be nice to
automatically allow the hobbits access to the ale and pork once the
battle is over: Doing it on an individual user basis would be
tedious and error prone. Making a cascading permissions change to
all 'hobbits' would be easy.

ACL is most usually implemented in a tree structure. There is
usually a tree of AROs and a tree of ACOs. By organizing your
objects in trees, permissions can still be dealt out in a granular
fashion, while still maintaining a good grip on the big picture.
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



If we wanted to use ACL to see if the Pippin was allowed to access
the ale, we'd first get his path in the tree, which is
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
control - while still keeping the ability to make sweeping changes
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



This approach allows us both the ability to make wide-reaching
permissions changes, but also fine-grained adjustments. This allows
us to say that all hobbits can have access to ale, with one
exception—Merry. To see if Merry can access the Ale, we'd find his
path in the tree: Fellowship->Hobbits->Merry and work our way down,
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

Defining Permissions: Cake's INI-based ACL
==========================================

Cake's first ACL implementation was based on INI files stored in
the Cake installation. While it's useful and stable, we recommend
that you use the database backed ACL solution, mostly because of
its ability to create new ACOs and AROs on the fly. We meant it for
usage in simple applications - and especially for those folks who
might not be using a database for some reason.

By default, CakePHP's ACL is database-driven. To enable INI-based
ACL, you'll need to tell CakePHP what system you're using by
updating the following lines in app/Config/core.php

::

    <?php
    // Change these lines:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');
    
    // To look like this:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

ARO/ACO permissions are specified in **/app/Config/acl.ini.php**.
The basic idea is that AROs are specified in an INI section that
has three properties: groups, allow, and deny.


-  groups: names of ARO groups this ARO is a member of.
-  allow: names of ACOs this ARO has access to
-  deny: names of ACOs this ARO should be denied access to

ACOs are specified in INI sections that only include the allow and
deny properties.

As an example, let's see how the Fellowship ARO structure we've
been crafting would look like in INI syntax:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    groups = warriors
    allow = diplomacy
    
    [legolas]
    groups = warriors
    
    [gimli]
    groups = warriors
    
    [gandalf]
    groups = wizards
    
    [frodo]
    groups = hobbits
    allow = ring
    
    [bilbo]
    groups = hobbits
    
    [merry]
    groups = hobbits
    deny = ale
    
    [pippin]
    groups = hobbits
    
    [gollum]
    groups = visitors
    
    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [warriors]
    allow = weapons, ale, salted_pork
    
    [wizards]
    allow = salted_pork, diplomacy, ale
    
    [hobbits]
    allow = ale
    
    [visitors]
    allow = salted_pork

Now that you've got your permissions defined, you can skip along to
:ref:`the section on checking permissions <checking-permissions>`
using the ACL component.


Defining Permissions: Cake's Database ACL
=========================================

Now that we've covered INI-based ACL permissions, let's move on to
the (more commonly used) database ACL.

Getting Started
---------------

The default ACL permissions implementation is database powered.
Cake's database ACL consists of a set of core models, and a console
application that comes with your Cake installation. The models are
used by Cake to interact with your database in order to store and
retrieve nodes in tree format. The console application is used to
initialize your database and interact with your ACO and ARO trees.

To get started, first you'll need to make sure your
``/app/Config/database.php`` is present and correctly configured.
See section 4.1 for more information on database configuration.

Once you've done that, use the CakePHP console to create your ACL
database tables:

::

    $ cake schema create DbAcl

Running this command will drop and re-create the tables necessary
to store ACO and ARO information in tree format. The output of the
console application should look something like the following:

::

    ---------------------------------------------------------------
    Cake Schema Shell
    ---------------------------------------------------------------
    
    The following tables will be dropped.
    acos
    aros
    aros_acos
    
    Are you sure you want to drop the tables? (y/n) 
    [n] > y
    Dropping tables.
    acos updated.
    aros updated.
    aros_acos updated.
    
    The following tables will be created.
    acos
    aros
    aros_acos
    
    Are you sure you want to create the tables? (y/n) 
    [y] > y
    Creating tables.
    acos updated.
    aros updated.
    aros_acos updated.
    End create.

.. note::

    This replaces an older deprecated command, "initdb".

You can also use the SQL file found in
``app/Config/Schema/db_acl.sql``, but that's nowhere near as fun.

When finished, you should have three new database tables in your
system: acos, aros, and aros\_acos (the join table to create
permissions information between the two trees).

.. note::

    If you're curious about how Cake stores tree information in these
    tables, read up on modified database tree traversal. The ACL
    component uses CakePHP's :doc:`/core-libraries/behaviors/tree`
    to manage the trees' inheritances. The model class files for ACL
    are all compiled in a single file
    `db\_acl.php <http://api.cakephp.org/file/cake/libs/model/db_acl.php>`_.

Now that we're all set up, let's work on creating some ARO and ACO
trees.

Creating Access Request Objects (AROs) and Access Control Objects (ACOs)
------------------------------------------------------------------------

In creating new ACL objects (ACOs and AROs), realize that there are
two main ways to name and access nodes. The *first* method is to
link an ACL object directly to a record in your database by
specifying a model name and foreign key value. The *second* method
can be used when an object has no direct relation to a record in
your database - you can provide a textual alias for the object.

.. note::

    In general, when you're creating a group or higher level object,
    use an alias. If you're managing access to a specific item or
    record in the database, use the model/foreign key method.

You create new ACL objects using the core CakePHP ACL models. In
doing so, there are a number of fields you'll want to use when
saving data: ``model``, ``foreign_key``, ``alias``, and
``parent_id``.

The ``model`` and ``foreign_key`` fields for an ACL object allows
you to link up the object to its corresponding model record (if
there is one). For example, many AROs will have corresponding User
records in the database. Setting an ARO's ``foreign_key`` to the
User's ID will allow you to link up ARO and User information with a
single User model find() call if you've set up the correct model
associations. Conversely, if you want to manage edit operation on a
specific blog post or recipe listing, you may choose to link an ACO
to that specific model record.

The ``alias`` for an ACL object is just a human-readable label you
can use to identify an ACL object that has no direct model record
correlation. Aliases are usually useful in naming user groups or
ACO collections.

The ``parent_id`` for an ACL object allows you to fill out the tree
structure. Supply the ID of the parent node in the tree to create a
new child.

Before we can create new ACL objects, we'll need to load up their
respective classes. The easiest way to do this is to include Cake's
ACL Component in your controller's $components array:

::

    <?php
    public $components = array('Acl');

Once we've got that done, let's see what some examples of creating
these objects might look like. The following code could be placed
in a controller action somewhere:

.. note::

    While the examples here focus on ARO creation, the same techniques
    can be used to create an ACO tree.

Keeping with our Fellowship setup, let's first create our ARO
groups. Because our groups won't really have specific records tied
to them, we'll use aliases to create these ACL objects. What we're
doing here is from the perspective of a controller action, but
could be done elsewhere. What we'll cover here is a bit of an
artificial approach, but you should feel comfortable using these
techniques to build AROs and ACOs on the fly.

This shouldn't be anything drastically new - we're just using
models to save data like we always do:

::

    <?php
    function anyAction() {
        $aro =& $this->Acl->Aro;
        
        // Here's all of our group info in an array we can iterate through
        $groups = array(
            0 => array(
                'alias' => 'warriors'
            ),
            1 => array(
                'alias' => 'wizards'
            ),
            2 => array(
                'alias' => 'hobbits'
            ),
            3 => array(
                'alias' => 'visitors'
            ),
        );
        
        // Iterate and create ARO groups
        foreach ($groups as $data) {
            // Remember to call create() when saving in loops...
            $aro->create();
            
            // Save data
            $aro->save($data);
        }
    
        // Other action logic goes here...
    }

Once we've got them in there, we can use the ACL console
application to verify the tree structure.

::

    $ cake acl view aro
    
    Aro tree:
    ---------------------------------------------------------------
      [1]warriors
    
      [2]wizards
    
      [3]hobbits
    
      [4]visitors
    
    ---------------------------------------------------------------

I suppose it's not much of a tree at this point, but at least we've
got some verification that we've got four top-level nodes. Let's
add some children to those ARO nodes by adding our specific user
AROs under these groups. Every good citizen of Middle Earth has an
account in our new system, so we'll tie these ARO records to
specific model records in our database.

.. note::

    When adding child nodes to a tree, make sure to use the ACL node
    ID, rather than a foreign\_key value.

::

    <?php
    function anyAction() {
        $aro = new Aro();
        
        // Here are our user records, ready to be linked up to new ARO records
        // This data could come from a model and modified, but we're using static
        // arrays here for demonstration purposes.
        
        $users = array(
            0 => array(
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ),
            1 => array(
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ),
            2 => array(
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ),
            3 => array(
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ),
            4 => array(
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ),
            5 => array(
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ),
            6 => array(
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ),
            7 => array(
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ),
            8 => array(
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ),
        );
        
        // Iterate and create AROs (as children)
        foreach ($users as $data) {
            // Remember to call create() when saving in loops...
            $aro->create();
    
            //Save data
            $aro->save($data);
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

    $ cake acl view aro
    
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
structure more of an abstract representation of our ACO's, it's
often more practical to model an ACO tree after Cake's
Controller/Action setup. We've got five main objects we're handling
in this Fellowship scenario, and the natural setup for that in a
Cake application is a group of models, and ultimately the
controllers that manipulate them. Past the controllers themselves,
we'll want to control access to specific actions in those
controllers.

Based on that idea, let's set up an ACO tree that will mimic a Cake
app setup. Since we have five ACOs, we'll create an ACO tree that
should end up looking something like the following:


-  Weapons
-  Rings
-  PorkChops
-  DiplomaticEfforts
-  Ales

One nice thing about a Cake ACL setup is that each ACO
automatically contains four properties related to CRUD (create,
read, update, and delete) actions. You can create children nodes
under each of these five main ACOs, but using Cake's built in
action management covers basic CRUD operations on a given object.
Keeping this in mind will make your ACO trees smaller and easier to
maintain. We'll see how these are used later on when we discuss how
to assign permissions.

Since you're now a pro at adding AROs, use those same techniques to
create this ACO tree. Create these upper level groups using the
core Aco model.

Assigning Permissions
---------------------

After creating our ACOs and AROs, we can finally assign permissions
between the two groups. This is done using Cake's core Acl
component. Let's continue on with our example.

Here we'll work in the context of a controller action. We do that
because permissions are managed by the Acl Component.

::

    <?php
    class SomethingsController extends AppController {
        // You might want to place this in the AppController
        // instead, but here works great too.
    
        public $components = array('Acl');
    
    }

Let's set up some basic permissions using the AclComponent in an
action inside this controller.

::

    <?php
    function index() {
        // Allow warriors complete access to weapons
        // Both these examples use the alias syntax
        $this->Acl->allow('warriors', 'Weapons');
        
        // Though the King may not want to let everyone
        // have unfettered access
        $this->Acl->deny('warriors/Legolas', 'Weapons', 'delete');
        $this->Acl->deny('warriors/Gimli',   'Weapons', 'delete');
        
        die(print_r('done', 1));
    }

The first call we make to the AclComponent allows any user under
the 'warriors' ARO group full access to anything under the
'Weapons' ACO group. Here we're just addressing ACOs and AROs by
their aliases.

Notice the usage of the third parameter? That's where we use those
handy actions that are in-built for all Cake ACOs. The default
options for that parameter are ``create``, ``read``, ``update``,
and ``delete`` but you can add a column in the ``aros_acos``
database table (prefixed with \_ - for example ``_admin``) and use
it alongside the defaults.

The second set of calls is an attempt to make a more fine-grained
permission decision. We want Aragorn to keep his full-access
privileges, but deny other warriors in the group the ability to
delete Weapons records. We're using the alias syntax to address the
AROs above, but you might want to use the model/foreign key syntax
yourself. What we have above is equivalent to this:

::

    <?php
    // 6342 = Legolas
    // 1564 = Gimli
    
    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 6342), 'Weapons', 'delete');
    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 1564), 'Weapons', 'delete');

.. note::

    Addressing a node using the alias syntax uses a slash-delimited
    string ('/users/employees/developers'). Addressing a node using
    model/foreign key syntax uses an array with two parameters:
    ``array('model' => 'User', 'foreign_key' => 8282)``.

The next section will help us validate our setup by using the
AclComponent to check the permissions we've just set up.

.. _checking-permissions:

Checking Permissions: The ACL Component
---------------------------------------

Let's use the AclComponent to make sure dwarves and elves can't
remove things from the armory. At this point, we should be able to
use the AclComponent to make a check between the ACOs and AROs
we've created. The basic syntax for making a permissions check is:

::

    <?php
    $this->Acl->check($aro, $aco, $action = '*');

Let's give it a try inside a controller action:

::

    <?php
    function index() {
        // These all return true:
        $this->Acl->check('warriors/Aragorn', 'Weapons');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'create');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'read');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'update');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'delete');
        
        // Remember, we can use the model/id syntax 
        // for our user AROs
        $this->Acl->check(array('User' => array('id' => 2356)), 'Weapons');
        
        // These also return true:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'create');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'read');
        
        // But these return false:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'delete');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'delete');
    }

The usage here is demonstrational, but hopefully you can see how
checking like this can be used to decide whether or not to allow
something to happen, show an error message, or redirect the user to
a login.


.. meta::
    :title lang=en: Access Control Lists
    :keywords lang=en: fantasy novel,access control list,request objects,online diary,request object,acls,adventurers,gandalf,lingo,web service,computer system,grandma,lord of the rings,entities,assets,logic,cakephp,stuff,control objects,control object
