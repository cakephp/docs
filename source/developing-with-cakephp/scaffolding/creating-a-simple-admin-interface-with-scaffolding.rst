3.12.1 Creating a simple admin interface with scaffolding
---------------------------------------------------------

If you have enabled admin routing in your app/config/core.php, with
``Configure::write('Routing.prefixes', array('admin'));`` you can
use scaffolding to generate an admin interface.

Once you have enabled admin routing assign your admin prefix to the
scaffolding variable.

::

    var $scaffold = 'admin';

You will now be able to access admin scaffolded actions:
::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

This is an easy way to create a simple backend interface quickly.
Keep in mind that you cannot have both admin and non-admin methods
scaffolded at the same time. As with normal scaffolding you can
override individual methods and replace them with your own.

::

    function admin_view($id = null) {
      //custom code here
    }

Once you have replaced a scaffolded action you will need to create
a view file for the action as well.
