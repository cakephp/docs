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
