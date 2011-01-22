11.2.7 Setting up permissions
-----------------------------

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
