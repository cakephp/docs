ACL Shell
#########

The AclShell is useful for managing and inspecting your Acl databases records.
It's often more convenient than adding one time modifications to your
controllers.

Most acl shell subcommands involve referencing aco/aro nodes.  As there are two
'forms' of these nodes, there is two notations in the shell::

    # A Model + foreign_key reference
    ./Console/cake acl view Model.1

    # An alias path reference
    ./Console/cake acl view root/controllers

Using a ``.`` indicates that you are going to use a bound record style reference
while using a ``/`` indicates an alias path.

Installing the database tables
==============================

Before using the database ACL you'll need to setup the tables.  You can do that
using::

    ./Console/cake acl initdb

Create and delete nodes
=======================

You can use the create and delete subcommands to create and delete nodes::

    ./Console/cake acl create aco controllers/Posts

Would create an aco record using an alias path.  You could do the following as
well::

    ./Console/cake acl create aro Group.1

To create an aro node for the Group id = 1.

Grant and deny access
=====================

Use the grant command to grant ACL permissions. Once executed, the ARO
specified (and its children, if any) will have ALLOW access to the
specified ACO action (and the ACO's children, if any)::

    ./Console/cake acl grant Group.1 controllers/Posts 

The above would grant all privileges.  You could grant only the read privilege
using the following::

    ./Console/cake acl grant Group.1 controllers/Posts read

Denying permission works in the exact same way.  The only difference is you
switch 'deny' in for 'grant'.

Check permissions
=================

Use this command to grant ACL permissions. Once executed, the ARO
specified (and its children, if any) will have ALLOW access to the
specified ACO action (and the ACO's children, if any)::

    ./Console/cake acl check Group.1 controllers/Posts read

The output will either be ``success`` or ``not allowed``.

View the node trees
===================

The view command will return the ARO or ACO tree.  The optional node parameter
allows you to return only a portion of the requested tree::

    ./Console/cake acl view



.. meta::
    :title lang=en: ACL Shell
    :keywords lang=en: record style,style reference,acl,database tables,group id,notations,alias,privilege,node,privileges,shell,databases