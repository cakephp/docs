11.2.5 Creating ACOs (Access Control Objects)
---------------------------------------------

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
Creating Acos from the shell looks like:

::

    cake acl create aco root controllers

While using the AclComponent would look like:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();


#. ``$this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));``
#. ``$this->Acl->Aco->save();``

Both of these examples would create our 'root' or top level ACO
which is going to be called 'controllers'. The purpose of this root
node is to make it easy to allow/deny access on a global
application scope, and allow the use of the Acl for purposes not
related to controllers/actions such as checking model record
permissions. As we will be using a global root ACO we need to make
a small modification to our ``AuthComponent`` configuration.
``AuthComponent`` needs to know about the existence of this root
node, so that when making ACL checks it can use the correct node
path when looking up controllers/actions. In ``AppController`` add
the following to the ``beforeFilter``:

::

    $this->Auth->actionPath = 'controllers/';


#. ``$this->Auth->actionPath = 'controllers/';``

11.2.5 Creating ACOs (Access Control Objects)
---------------------------------------------

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
Creating Acos from the shell looks like:

::

    cake acl create aco root controllers

While using the AclComponent would look like:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();


#. ``$this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));``
#. ``$this->Acl->Aco->save();``

Both of these examples would create our 'root' or top level ACO
which is going to be called 'controllers'. The purpose of this root
node is to make it easy to allow/deny access on a global
application scope, and allow the use of the Acl for purposes not
related to controllers/actions such as checking model record
permissions. As we will be using a global root ACO we need to make
a small modification to our ``AuthComponent`` configuration.
``AuthComponent`` needs to know about the existence of this root
node, so that when making ACL checks it can use the correct node
path when looking up controllers/actions. In ``AppController`` add
the following to the ``beforeFilter``:

::

    $this->Auth->actionPath = 'controllers/';


#. ``$this->Auth->actionPath = 'controllers/';``
