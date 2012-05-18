Views
#####

A view is a page template, usually named after an action. For example,
the view for **PostsController::add()** would be found at
**/app/views/posts/add.thtml**. Cake views are quite simply PHP files,
so you can use any PHP code inside them. Although most of your view
files will contain HTML, a view could be any perspective on a certain
set of data, be it XML, and image, etc.

In the view template file, you can use the data from the corresponding
Model. This data is passed as an array called **$data**. Any data that
you've handed to the view using set() in the controller is also now
available in your view.

The HTML helper is available in every view by default, and is by far the
most commonly used helper in views. It is very helpful in creating
forms, including scripts and media, linking and aiding in data
validation. Please see section 1 in Chapter "Helpers" for a discussion
on the HTML helper.

Most of the functions available in the views are provided by Helpers.
Cake comes with a great set of helpers (discussed in Chapter "Helpers"),
and you can also include your own. Because views shouldn't contain much
logic, there aren't many well used public functions in the view class.
One that is helpful is renderElement(), which will be discussed in
section 1.2.

Layouts
=======

A layout contains all the presentational code that wraps around a view.
Anything you want to see in all of your views should be placed in your
layout.

Layout files are placed in **/app/views/layouts**. Cake's default layout
can be overridden by placing a new default layout at
**/app/views/layouts/default.thtml**. Once a new default layout has been
created, controller view code is placed inside of the default layout
when the page is rendered.

When you create a layout, you need to tell Cake where to place your
controller view code: to do so, make sure your layout includes a place
for **$content\_for\_layout** (and optionally, **$title\_for\_layout**).
Here's an example of what a default layout might look like::

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title><?php echo $title_for_layout?></title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    </head>
    <body>

    <!-- If you'd like some sort of menu to show up on all of your views, include it here -->
    <div id="header">
        <div id="menu">...</div>
    </div>

    <!-- Here's where I want my views to be displayed -->
    <?php echo $content_for_layout ?>

    <!-- Add a footer to each displayed page -->
    <div id="footer">...</div>

    </body>
    </html>

To set the title for the layout, it's easiest to do so in the
controller, using the $pageTitle controller variable::

    <?php
    class UsersController extends AppController
    {
        function viewActive()
        {
            $this->pageTitle = 'View Active Users';
        }
    }

You can create as many layouts as you wish for your Cake site, just
place them in the app/views/layouts directory, and switch between them
inside of your controller actions using the controller's **$layout**
variable, or setLayout() function.

For example, if a section of my site included a smaller ad banner space,
I might create a new layout with the smaller advertising space and
specify it as the layout for all controller's actions using something
like::

    <?php
    var $layout = 'default_small_ad';

Elements
========

Many applications have small blocks of presentational code that needs to
be repeated from page to page, sometimes in different places in the
layout. Cake can help you repeat parts of your website that need to be
reused. These reusable parts are called Elements. Ads, help boxes,
navigational controls, extra menus, and callouts are often implemented
in Cake as elements. An Element is basically a mini-view that can be
included in other Views.

Elements live in the **/app/views/elements/** folder, and have the
**.thtml** filename extension.

The Element, by default, has access to any data declared for use in the
View.

Rendering an Element
--------------------

::

    <?php echo $this->renderElement('helpbox'); ?>

You can also directly hand data to an Element for use, by passing an
array of data as the second parameter of the renderElement method.

Calling an Element passing a data array
---------------------------------------

::

    <?php echo
    $this->renderElement('helpbox', array("helptext" => "Oh, this text is very helpful."));
     ?>

Inside the Element file, all the passed variables are available as the
names of the keys of the passed array (much like how set() in the
controller works with the views). In the above example, the
**/app/views/elements/helpbox.thtml** file can use the **$helptext**
variable. Of course, it would be more useful to pass an array to the
Element.

Elements can be used to make a View more readable, placing the rendering
of repeating elements in its own file. They can also help you re-use
content fragments in your website.

Error Views
===========

There are a number of different situations where CakePHP needs to show
some sort of error message. Many times during development you can see
these error views - when you try to access a controller or view that
doesn't exist, for example. You can customize these views by creating
special view files in **app/views/error**.

Here are the error views that are supported by CakePHP:

Error view files (app/views/error)
----------------------------------

::

    error404.thtml
    missing_action.thtml
    missing_component_class.thtml
    missing_component_file.thtml
    missing_connection.thtml
    missing_controller.thtml
    missing_helper_class.thtml
    missing_helper_file.thtml
    missing_layout.thtml
    missing_model.thtml
    missing_scaffolddb.thtml
    missing_table.thtml
    missing_view.thtml
    private_action.thtml
    scaffold_error.thtml

To customize any of these error views, create the file in
app/views/error. When an error occurs, the respective error view will be
displayed. You can copy any of these error views from
**cake/libs/view/templates/errors** in the core to use as examples, but
remember not to edit these files where they reside in the CakePHP core.

By default, most of these views are not shown when DEBUG is set to a
value greater than 0. As such, the main error view you'll need to focus
on is the error404.thtml error view.
