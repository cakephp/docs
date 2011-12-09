Scaffolding
###########

Application scaffolding is a technique that allows a developer to
define and create a basic application that can create, retrieve,
update and delete objects. Scaffolding in CakePHP also allows
developers to define how objects are related to each other, and to
create and break those links.

All that’s needed to create a scaffold is a model and its
controller. Once you set the $scaffold variable in the controller,
you’re up and running.

CakePHP’s scaffolding is pretty cool. It allows you to get a basic
CRUD application up and going in minutes. It's so cool that you'll want
to use it in production apps. Now, we think it's cool too, but
please realize that scaffolding is... well... just scaffolding.
It's a loose structure you throw up real quick during the beginning
of a project in order to get started. It isn't meant to be
completely flexible, it’s meant as a temporary way to get up and
going. If you find yourself really wanting to customize your logic
and your views, it's time to pull your scaffolding down in order to
write some code. CakePHP’s Bake console, covered in the next
section, is a great next step: it generates all the code that would
produce the same result as the most current scaffold.

Scaffolding is a great way of getting the early parts of developing
a web application started. Early database schemas are subject to
change, which is perfectly normal in the early part of the design
process. This has a downside: a web developer hates creating forms
that never will see real use. To reduce the strain on the
developer, scaffolding has been included in CakePHP. Scaffolding
analyzes your database tables and creates standard lists with add,
delete and edit buttons, standard forms for editing and standard
views for inspecting a single item in the database.

To add scaffolding to your application, in the controller, add the
$scaffold variable::

    <?php
    class CategoriesController extends AppController {
        public $scaffold;
    }
    
Assuming you’ve created even the most basic Category model class
file (in /app/Model/Category.php), you’re ready to go. Visit
http://example.com/categories to see your new scaffold.

.. note::

    Creating methods in controllers that are scaffolded can cause
    unwanted results. For example, if you create an index() method in a
    scaffolded controller, your index method will be rendered rather
    than the scaffolding functionality.

Scaffolding is knowledgeable about model associations, so if your
Category model belongsTo a User, you’ll see related User IDs in the
Category listings. While scaffolding "knows" about model
associations, you will not see any related records in the scaffold
views until you manually add the association code to the model. For
example, if Group hasMany User and User belongsTo Group, you have
to manually add the following code in your User and Group models.
Before you add the following code, the view displays an empty
select input for Group in the New User form. After you add the
following code, the view displays a select input populated with IDs
or names from the Group table in the New User form::

    <?php
    // In Group.php
    public $hasMany = 'User';
    // In User.php
    public $belongsTo = 'Group';

If you’d rather see something besides an ID (like the user’s first
name), you can set the $displayField variable in the model. Let’s
set the $displayField variable in our User class so that users
related to categories will be shown by first name rather than just
an ID in scaffolding. This feature makes scaffolding more readable
in many instances::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $displayField = 'first_name';
    }


Creating a simple admin interface with scaffolding
==================================================

If you have enabled admin routing in your app/Config/core.php, with
``Configure::write('Routing.prefixes', array('admin'));`` you can
use scaffolding to generate an admin interface.

Once you have enabled admin routing assign your admin prefix to the
scaffolding variable::

    <?php
    public $scaffold = 'admin';

You will now be able to access admin scaffolded actions::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

This is an easy way to create a simple backend interface quickly.
Keep in mind that you cannot have both admin and non-admin methods
scaffolded at the same time. As with normal scaffolding you can
override individual methods and replace them with your own::
    
    <?php
    function admin_view($id = null) {
      // custom code here
    }

Once you have replaced a scaffolded action you will need to create
a view file for the action as well.

Customizing Scaffold Views
==========================

If you're looking for something a little different in your
scaffolded views, you can create templates. We still don't
recommend using this technique for production applications, but
such a customization may be useful during prototyping iterations.

Custom scaffolding views for a specific controller
(PostsController in this example) should be placed like so::

    /app/View/Posts/scaffold.index.ctp
    /app/View/Posts/scaffold.form.ctp
    /app/View/Posts/scaffold.view.ctp

Custom scaffolding views for all controllers should be placed like so::

    /app/View/Scaffolds/index.ctp
    /app/View/Scaffolds/form.ctp
    /app/View/Scaffolds/view.ctp


.. meta::
    :title lang=en: Scaffolding
    :keywords lang=en: database schemas,loose structure,scaffolding,scaffold,php class,database tables,web developer,downside,web application,logic,developers,cakephp,running,current,delete,database application