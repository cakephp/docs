Scaffolding
###########

Cake's Scaffolding is Pretty Cool
=================================

So cool that you'll want to use it in production apps. Now, we think its
cool, too, but please realize that scaffolding is... well... just
scaffolding. It's a bunch of stuff you throw up real quick during the
beginning of a project in order to get started. It isn't meant to be
completely flexible. So, if you find yourself really wanting to
customize your logic and your views, its time to pull your scaffolding
down in order to write some code.

Scaffolding is a great way of getting the early parts of developing a
web application started. Early database schemas are volatile and subject
to change, which is perfectly normal in the early part of the design
process. This has a downside: a web developer hates creating forms that
never will see real use. To reduce the strain on the developer,
scaffolding has been included in Cake. Scaffolding analyzes your
database tables and creates standard lists with add, delete and edit
buttons, standard forms for editing and standard views for inspecting a
single item in the database. To add scaffolding to your application, in
the controller, add the **$scaffold** variable::

    <?php
    class CategoriesController extends AppController
    {
    var $scaffold;
    }

One important thing to note about scaffold: it expects that any field
name that ends with **\_id** is a foreign key to a table which has a
name that precedes the underscore. So, for example, if you have nested
categories, you'd probably have a column called **category\_id** in your
categories table.

Also, when you have a foreign key in a table (e.g. titles table has
**category\_id**), and you have associated your models appropriately
(see Understanding Associations, 6.2), a select box will be
automatically populated with the rows from the foreign table (titles) in
the show/edit/new views. To set which field in the foreign table is
shown, set the **$displayField** variable in the foreign model. To
continue our example of a category having a title::

    <?php
    class Category extends AppModel
    {
    var $name = 'Category';

    var $displayField = 'title';
    }

Customizing Scaffold Views
==========================

If you're looking for something a little different in your scaffolded
views, you can create them yourself. We still don't recommend using this
technique for production applications, but such a customization may be
extremely useful for prototyping iterations.

If you'd like to change your scaffolding views, you'll need to supply
your own:

Custom Scaffolding Views for a Single Controller
================================================

Custom scaffolding views for a PostsController should be placed like so::

    /app/views/posts/scaffold/scaffold.index.thtml
    /app/views/posts/scaffold/scaffold.show.thtml
    /app/views/posts/scaffold/scaffold.edit.thtml
    /app/views/posts/scaffold/scaffold.new.thtml

Custom Scaffolding Views for an Entire Application
==================================================

Custom scaffolding views for all controllers should be placed like so::

    /app/views/scaffold/scaffold.index.thtml
    /app/views/scaffold/scaffold.show.thtml
    /app/views/scaffold/scaffold.edit.thtml
    /app/views/scaffold/scaffold.new.thtml

If you find yourself wanting to change the controller logic at this
point, it's time to take the scaffolding down from your application and
start building it.

One feature you might find helpful is Cake's code generator: Bake. Bake
allows you to generate a coded version of scaffolded code you can then
move on to modify and customize as your application requires.
