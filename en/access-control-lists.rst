15 Access Control Lists
-----------------------

Understanding How ACL Works
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Most important, powerful things require some sort of access control.
Access control lists are a way to manage application permissions in a
fine-grained, yet easily maintainable and manageable way. Access control
lists, or ACL, handle two main things: things that want stuff, and
things that are wanted. In ACL lingo, things (most often users) that
want to use stuff are called access request objects, or AROs. Things in
the system that are wanted (most often actions or data) are called
access control objects, or ACOs. The entities are called 'objects'
because sometimes the requesting object isn't a person - sometimes you
might want to limit the access certain Cake controllers have to initiate
logic in other parts of your application. ACOs could be anything you
want to control, from a controller action, to a web service, to a line
on your grandma's online diary.

To use all the acronyms at once: ACL is what is used to decide when an
ARO can have access to an ACO.

Now, in order to help you understand this, let's use a practial example.
Imagine, for a moment, a computer system used by a group of adventurers.
The leader of the group wants to forge ahead on their quest while
maintaining a healthy amount of privacy and security for the other
members of the party. The AROs involved are as following:

-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

These are the entities in the system that will be requesting things (the
ACOs) from the system. It should be noted that ACL is \*not\* a system
that is meant to authenticate users. You should already have a way to
store user information and be able to verify that user's identity when
they enter the system. Once you know who a user is, that's where ACL
really shines. Okay - back to our adventure.

The next thing Gandalf needs to do is make an initial list of things, or
ACOs, the system will handle. His list might look something like:

-  Weapons
-  The One Ring
-  Salted Pork
-  Diplomacy
-  Ale

Traditionally, systems were managed using a sort of matrix, that showed
a basic set of users and permissions relating to objects. If this
information were stored in a table, it might look like the following,
with X's indicating denied access, and O's indicating allowed access.

+-----------+-----------+----------------+---------------+-------------+-------+
|           | Weapons   | The One Ring   | Salted Pork   | Diplomacy   | Ale   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Gandalf   | No        | No             | Yes           | Yes         | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Aragorn   | Yes       | No             | Yes           | Yes         | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Bilbo     | No        | No             | No            | No          | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Frodo     | No        | Yes            | No            | No          | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Gollum    | No        | No             | Yes           | No          | No    |
+-----------+-----------+----------------+---------------+-------------+-------+
| Legolas   | Yes       | No             | Yes           | Yes         | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Gimli     | Yes       | No             | Yes           | No          | No    |
+-----------+-----------+----------------+---------------+-------------+-------+
| Pippin    | No        | No             | No            | Yes         | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+
| Merry     | No        | No             | No            | No          | Yes   |
+-----------+-----------+----------------+---------------+-------------+-------+

At first glance, it seems that this sort of system could work rather
well. Assignments can be made to protect security (only Frodo can access
the ring) and protect against accidents (keeping the hobbits out of the
salted pork). It seems fine grained enough, and easy enough to read,
right?

For a small system like this, maybe a matrix setup would work. But for a
growing system, or a system with a large amount of resources (ACOs) and
users (AROs), a table can become unwieldy rather quickly. Imagine trying
to control access to the hundreds of war encampments and trying to
manage them by unit, for example. Another drawback to matrices is that
you can't really logically group sections of users, or make cascading
permissions changes to groups of users based on those logical groupings.
For example, it would sure be nice to automatically allow the hobbits
access to the ale and pork once the battle is over: Doing it on an
indivudual user basis would be tedious and error prone, while making a
cascading permissions change to all 'hobbits' would be easy.

ACL is most usually implemented in a tree structure. There is usually a
tree of AROs and a tree of ACOs. By organizing your objects in trees,
permissions can still be dealt out in a granular fashion, while still
maintaining a good grip on the big picture. Being the wise leader he is,
Gandalf elects to use ACL in his new system, and organizes his objects
along the following lines:

Fellowship of the Ring:

Warriors

-  Aragorn
-  Legolas
-  Gimli

Wizards

-  Gandalf

Hobbits

-  Frodo
-  Bilbo
-  Merry
-  Pippin

Vistors

-  Gollum

By structuring our party this way, we can define access controls to the
tree, and apply those permissions to any children. The default
permission is to deny access to everything. As you work your way down
the tree, you pick up permissions and apply them. The last permission
applied (that applies to the ACO you're wondering about) is the one you
keep. So, using our ARO tree, Gandalf can hang on a few permissions:

Fellowship of the Ring: [Deny: ALL]

Warriors [Allow: Weapons, Ale, Elven Rations, Salted Pork]

-  Aragorn
-  Legolas
-  Gimli

Wizards [Allow: Salted Pork, Diplomacy, Ale]

-  Gandalf

Hobbits [Allow: Ale]

-  Frodo
-  Bilbo
-  Merry
-  Pippin

Vistors [Allow: Salted Pork]

-  Gollum

If we wanted to use ACL to see if the Pippin was allowed to access the
ale, we'd first get his path in the tree, which is
Fellowship->Hobbits->Pippin. Then we see the different permissions that
reside at each of those points, and use the most specific permission
relating to Pippin and the Ale.

#. Fellowship = DENY Ale, so deny (because it is set to deny all ACOs)

#. Hobbits = ALLOW Ale, so allow

#. Pippin = ?; There really isn't any ale-specific information so we
   stick with ALLOW.

#. Final Result: allow the ale.

The tree also allows us to make finer adjustments for more granular
control - while still keeping the ability to make sweeping changes to
groups of AROs:

Warriors [Allow: Weapons, Ale, Elven Rations, Salted Pork]

-  Aragorn [Allow: Diplomacy]
-  Legolas
-  Gimli

Wizards [Allow: Salted Pork, Diplomacy, Ale]

-  Gandalf

Hobbits [Allow: Ale]

-  Frodo [Allow: Ring]
-  Bilbo
-  Merry [Deny: Ale]
-  Pippin [Allow: Diplomacy]

Vistors [Allow: Salted Pork]

-  Gollum

You can see this because the Aragorn ARO maintains is permissions just
like others in the Warriors ARO group, but you can still make fine-tuned
adjustments and special cases when you see fit. Again, permissions
default to DENY, and only change as the traversal down the tree forces
an ALLOW. To see if Merry can access the Ale, we'd find his path in the
tree: Fellowship->Hobbits->Merry and work our way down, keeping track of
ale-related permissions:

#. Fellowship = DENY (because it is set to deny all), so deny the ale.

#. Hobbits = ALLOW: ale, so allow the ale

#. Merry = DENY ale, so deny the ale

#. Final Result: deny the ale.

Defining Permissions: Cake's INI-based ACL
------------------------------------------

Cake's first ACL implementation was based off of INI files stored in the
Cake installation. While its useful and stable, we recommend that you
use the database backed ACL solution, mostly because of its ability to
create new ACOs and AROs on the fly. We meant it for usage in simple
applications - and especially for those folks who might not be using a
database for some reason.

By default, CakePHP's ACL is database-driven. To enable INI-based ACL,
set ACL\_CLASSNAME to INI\_ACL, and ACL\_FILENAME to **ini\_acl** in
core.php.

ARO/ACO permissions are specified in **/app/config/acl.ini.php**.
Instructions on specifying access can be found at the beginning of
acl.ini.php:

::

    ; acl.ini.php - Cake ACL Configuration
    ; ---------------------------------------------------------------------
    ; Use this file to specify user permissions.
    ; aco = access control object (something in your application)
    ; aro = access request object (something requesting access)
    ;
    ; User records are added as follows:
    ;
    ; [uid]
    ; groups = group1, group2, group3
    ; allow = aco1, aco2, aco3
    ; deny = aco4, aco5, aco6
    ;
    ; Group records are added in a similar manner:
    ;
    ; [gid]
    ; allow = aco1, aco2, aco3
    ; deny = aco4, aco5, aco6
    ;
    ; The allow, deny, and groups sections are all optional.
    ; NOTE: groups names *cannot* ever be the same as usernames!

Using the INI file, you can specify users (AROs), the group(s) they
belong to, and their own personal permissions. You can also specify
groups along with their permissions. To learn how to use Cake's ACL
component to check permissions using this INI file, see section 11.4.

Defining Permissions: Cake's Database ACL
-----------------------------------------

Getting Started
~~~~~~~~~~~~~~~

The default ACL permissions implementation is database stored. Database
ACL, or dbACL consists of a set of core models, and a command-line
script that comes with your Cake installation. The models are used by
Cake to interact with your database in order to store and retrieve nodes
the ACL trees. The command-line script is used to help you get started
and be able to interact with your trees.

To get started, first you'll need to make sure your
**/app/config/database.php** is present and correctly configured. For a
new Cake installation, the easiest way to tell that this is so is to
bring up the installation directory using a web browser. Near the top of
the page, you should see the messages "Your database configuration file
is present." and "Cake is able to connect to the database." if you've
done it correctly. See section 4.1 for more information on database
configuration.

Next, use the the ACL command-line script to initialize your database to
store ACL information. The script found at /cake/scripts/acl.php will
help you accomplish this. Initialize the your database for ACL by
executing the following command (from your **/cake/scripts/**
directory):

Initializing your database using acl.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    $ php acl.php initdb

    Initializing Database...
    Creating access control objects table (acos)...
    Creating access request objects table (aros)...
    Creating relationships table (aros_acos)...

    Done.

At this point, you should be able to check your project's database to
see the new tables. If you're curious about how Cake stores tree
information in these tables, read up on modified database tree
traversal. Basically, it stores nodes, and their place in the tree. The
acos and aros tables store the nodes for their respective trees, and the
aros\_acos table is used to link your AROs to the ACOs they can access.

Now, you should be able to start creating your ARO and ACO trees.

Creating Access Request Objects (AROs) and Access Control Objects (ACOs)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

There are two ways of referring to AROs/ACOs. One is by giving them an
numeric id, which is usually just the primary key of the table they
belong to. The other way is by giving them a string alias. The two are
not mutually exclusive.

The way to create a new ARO is by using the methods defined the the Aro
Cake model. The create() method of the Aro class takes three parameters:
$link\_id, $parent\_id, and $alias. This method creates a new ACL object
under the parent specified by a parent\_id - or as a root object if the
$parent\_id passed is null. The $link\_id allows you to link a current
user object to Cake's ACL structures. The alias parameter allows you
address your object using a non-integer ID.

Before we can create our ACOs and AROs, we'll need to load up those
classes. The easiest way to do this is to include Cake's ACL Component
in your controller using the $components array:

::

    var $components = array('Acl');

Once we've got that done, let's see what some examples of creating these
objects might look like. The following code could be placed in a
controller action somewhere:

::

    $aro = new Aro();

First, set up a few AROs. These objects will have no parent initially.

::

    $aro->create( 1, null, 'Bob Marley' );<br />
    $aro->create( 2, null, 'Jimi Hendrix');<br />
    $aro->create( 3, null, 'George Washington');<br />
    $aro->create( 4, null, 'Abraham Lincoln');

Now, we can make groups to organize these users. Notice that the IDs for
these objects are 0, because they will never tie to users in our system.

::

    $aro->create(0, null, 'Presidents');<br />
    $aro->create(0, null, 'Artists');

Now, hook AROs to their respective groups:

::

    $aro->setParent('Presidents', 'George Washington');<br />
    $aro->setParent('Presidents', 'Abraham Lincoln');<br />
    $aro->setParent('Artists', 'Jimi Hendrix');<br />
    $aro->setParent('Artists', 'Bob Marley');

In short, here is how to create an ARO:

::

    $aro = new Aro();
    $aro->create($user_id, $parent_id, $alias);

You can also create AROs using the command line script using

::

    $acl.php create aro <link_id> <parent_id> <alias>

Creating an ACO is done in a similar manner:

::

    $aco = new Aco();

    //Create some access control objects:
    $aco->create(1, null, 'Electric Guitar');
    $aco->create(2, null, 'United States Army');
    $aco->create(3, null, 'Fans');

We could create groups for these objects using setParent(), but we'll
skip that
 for this particular example. To create an ACO:

::

    $aco = new Aco();
    $aco->create($id, $parent, $alias);

The corresponding command line script command would be:

::

    $acl.php create aco <link_id> <parent_id> <alias>

Assigning Permissions
~~~~~~~~~~~~~~~~~~~~~

After creating our ACOs and AROs, we can finally assign permission
between the two groups. This is done using Cake's core Acl component.
Let's continue on with our example:

::

    // First, in a controller, we'll need access
    // to Cake's ACL component:

    class SomethingsController extends AppController
    {
        // You might want to place this in the AppController
        // instead, but here works great too.

        var $components = array('Acl');

        // Remember: ACL will always deny something
        // it doesn't have information on. If any
        // checks were made on anything, it would
        // be denied. Let's allow an ARO access to an ACO.

        function someAction()
        {
            //ALLOW

            // Here is how you grant an ARO full access to an ACO
            $this->Acl->allow('Jimi Hendrix', 'Electric Guitar');
            $this->Acl->allow('Bob Marley',   'Electric Guitar');

            // We can also assign permissions to groups, remember?
            $this->Acl->Allow('Presidents', 'United States Army');

            // The allow() method has a third parameter, $action.
            // You can specify partial access using this parameter.
            // $action can be set to create, read, update or delete.
            // If no action is specified, full access is assumed.

            // Look, don't touch, gentlemen:
            $this->Acl->allow('George Washington', 'Electric Guitar', 'read');
            $this->Acl->allow('Abraham Lincoln',   'Electric Guitar', 'read');

            //DENY

            //Denies work in the same manner:

            //When his term is up...
            $this->Acl->deny('Abraham Lincoln', 'United States Army');


        }
    }

This particular controller isn't especially useful, but it is mostly
meant to show you how the process works. Using the Acl component in
connection with your user management controller would be the best usage.
Once a user has been created on the system, her ARO could be created and
placed at the right point of the tree, and permissions could be assigned
to specific ACO or ACO groups based on her identity.

Permissions can also be assigned using the command line script packaged
with Cake. The syntax is similar to the model functions, and can be
viewed by executing $php acl.php help.

Checking Permissions: The ACL Component
---------------------------------------

Checking permissions is the easiest part of using Cake's ACL: it
consists of using a single method in the Acl component: check(). A good
way to implement ACL in your application might be to place an action in
your AppController that performs ACL checks. Once placed there, you can
access the Acl component and perform permissions checks
application-wide. Here's an example implementation:

::

    class AppController extends Controller
    {
        // Get our component
        var $components = array('Acl');

        function checkAccess($aco)
        {
            // Check access using the component:
            $access = $this->Acl->check($this->Session->read('user_alias'), $aco, $action = "*");

            //access denied
            if ($access === false)
            {
                echo "access denied";
                exit;
            }
            //access allowed
            else
            {
                echo "access allowed";
                exit;
            }
        }
    }

Basically, by making the Acl component available in the AppController,
it will be visible for use in any controller in your application. Here's
the basic format:

::

    $this->Acl->Check($aro, $aco, $action = '*');
