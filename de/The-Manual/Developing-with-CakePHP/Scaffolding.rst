Scaffolding
###########

Application scaffolding is a technique that allows a developer to define
and create a basic application that can create, retrieve, update and
delete objects. Scaffolding in CakePHP also allows developers to define
how objects are related to each other, and to create and break those
links.

All that’s needed to create a scaffold is a model and its controller.
Once you set the $scaffold variable in the controller, you’re up and
running.

CakePHP’s scaffolding is pretty cool. It allows you to get a basic CRUD
application up and going in minutes. So cool that you'll want to use it
in production apps. Now, we think its cool too, but please realize that
scaffolding is... well... just scaffolding. It's a loose structure you
throw up real quick during the beginning of a project in order to get
started. It isn't meant to be completely flexible, it’s meant as a
temporary way to get up and going. If you find yourself really wanting
to customize your logic and your views, its time to pull your
scaffolding down in order to write some code. CakePHP’s Bake console,
covered in the next section, is a great next step: it generates all the
code that would produce the same result as the most current scaffold.

Scaffolding is a great way of getting the early parts of developing a
web application started. Early database schemas are subject to change,
which is perfectly normal in the early part of the design process. This
has a downside: a web developer hates creating forms that never will see
real use. To reduce the strain on the developer, scaffolding has been
included in CakePHP. Scaffolding analyzes your database tables and
creates standard lists with add, delete and edit buttons, standard forms
for editing and standard views for inspecting a single item in the
database.

To add scaffolding to your application, in the controller, add the
$scaffold variable:

::

    <?php

    class CategoriesController extends AppController {
        var $scaffold;
    }

    ?>

Assuming you’ve created even the most basic Category model class file
(in /app/models/category.php), you’re ready to go. Visit
http://example.com/categories to see your new scaffold.

Creating methods in controllers that are scaffolded can cause unwanted
results. For example, if you create an index() method in a scaffolded
controller, your index method will be rendered rather than the
scaffolding functionality.

Scaffolding is knowledgeable about model associations, so if your
Category model belongsTo a User, you’ll see related User IDs in the
Category listings. While scaffolding "knows" about model associations,
you will not see any related records in the scaffold views until you
manually add the association code to the model. For example, if Group
hasMany User and User belongsTo Group, you have to manually add the
following code in your User and Group models. Before you add the
following code, the view displays an empty select input for Group in the
New User form. After you add the following code, the view displays a
select input populated with IDs or names from the Group table in the New
User form.

::

    // In group.php
    var $hasMany = 'User';
    // In user.php
    var $belongsTo = 'Group';

If you’d rather see something besides an ID (like the user’s first
name), you can set the $displayField variable in the model. Let’s set
the $displayField variable in our User class so that users related to
categories will be shown by first name rather than just an ID in
scaffolding. This feature makes scaffolding more readable in many
instances.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $displayField = 'first_name';
    }

    ?>

Erstellen eines einfachen Administrations-Backends mit Scaffolding
==================================================================

Wenn Sie in Ihrer Anwendung das Admin-Routing in der Datei
app/config/core.php mit
``Configure::write('Routing.prefixes', array('admin'));`` konfiguriert
haben, dann können Sie mit Scaffolding ein Gerüst für ein
Admin-Interface generieren.

Sobald Sie das Admin-Routing aktiviert haben, weisen Sie auf die
$scaffold-Variable Ihr Admin-Präfix zu.

::

    var $scaffold = 'admin';

Sie können nun im Adminbereich auf folgende Scaffolding-Aktionen
zugreifen:

::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

Dies ist eine einfache Möglichkeit, eine einfache Schnittstelle zum
Backend schnell zu erstellen. Bitte beachten Sie, dass "Admin"- und
"Nicht-Admin"-Methoden NICHT zur gleichen Zeit als Scaffold-Gerüst zur
Verfügung stehen. Wie beim normalen Scaffolding können Sie einzelne
Methoden überschreiben und Sie sie mit Ihren eigenen ersetzen.

::

    function admin_view($id = null) {
      //benutzerdefinierter Code hier
    }

Sobald Sie eine Scaffolding-Aktion nachgebildet und ersetzt haben,
müssen Sie auch einen View für die Aktion nachbilden und zur Verfügung
stellen.

Customizing Scaffold Views
==========================

If you're looking for something a little different in your scaffolded
views, you can create templates. We still don't recommend using this
technique for production applications, but such a customization may be
useful during prototyping iterations.

Customization is done by creating view templates:

::

    Custom scaffolding views for a specific controller 
    (PostsController in this example) should be placed like so:

    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp

    Custom scaffolding views for all controllers should be placed like so:

    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

