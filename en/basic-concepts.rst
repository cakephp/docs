Basic Concepts
================

Introduction
------------

This chapter is a short, casual introduction to MVC concepts as they are
implemented in Cake. If you're new to MVC (Model View Controller)
patterns, this chapter is definitely for you. We begin with a discussion
of general MVC concepts, work our way into the specific application of
MVC in CakePHP, and show some simple examples of CakePHP using the MVC
pattern.

The MVC Pattern
---------------

Model-View-Controller is a software design pattern that helps you
logically separate your code, make it more reusable, maintainable, and
generally better. Model View Controller was once described by the author
group Gang of Four. Dean Helman wrote (an extract from Objective Toolkit
Pro white paper):

    "The MVC paradigm is a way of breaking an application, or even just
    a piece of an application's interface, into three parts: the model,
    the view, and the controller. MVC was originally developed to map
    the traditional input, processing, output roles into the GUI realm.

    Input -> Processing -> Output

    Controller -> Model -> View

    "The user input, the modeling of the external world, and the visual
    feedback to the user are separated and handled by model, view port
    and controller objects. The controller interprets mouse and keyboard
    inputs from the user and maps these user actions into commands that
    are sent to the model and/or view port to effect the appropriate
    change. The model manages one or more data elements, responds to
    queries about its state, and responds to instructions to change
    state. The view port manages a rectangular area of the display and
    is responsible for presenting data to the user through a combination
    of graphics and text."

In Cake terms, the Model represents a particular database table/record,
and it's relationships to other tables and records. Models also contain
data validation rules, which are applied when model data is inserted or
updated. The View represents Cake's view files, which are regular HTML
files embedded with PHP code. Cake's Controller handles requests from
the server. It takes user input (URL and POST data), applies business
logic, uses Models to read and write data to and from databases and
other sources, and lastly, sends output data to the appropriate view
file.

To make it as easy as possible to organize your application, Cake uses
this pattern not only to manage how objects interact within your
application, but also how files are stored, which is detailed next.

Overview of the Cake File Layout
--------------------------------

When you unpack Cake on your server you will find three main folders::

        app
        cake
        vendors

The **cake** folder is where the core libraries for Cake lay and you
generally won't ever need to touch it.

The **app** folder is where your application specific folders and files
will go. The separation between the **cake** folder and the **app**
folder make it possible for you to have many app folders sharing a
single set of Cake libraries. This also makes it easy to update CakePHP:
you just download the latest version of Cake and overwrite your current
core libraries. No need to worry about overwriting something you wrote
for your app.

You can use the **vendors** directory to keep third-party libraries in.
You will learn more about vendors later, but the basic idea is that you
can access classes you've placed in the vendors directory using Cake's
**vendor()** function.

Let's look at the entire file layout::

    /app
        /config          - Contains config files for your database, ACL, etc. 

        /controllers     - Controllers go here 
            /components  - Components go here

        /index.php       - Allows you to deploy cake with /app as the DocumentRoot

        /models          - Models go here
     
        /plugins         - Plugins go here

        /tmp             - Used for caches and logs

        /vendors         - Contains third-party libaries for this application

        /views           - Views go here
            /elements    - Elements, little bits of views, go here
            /errors      - Your custom error pages go here
            /helpers     - Helpers go here
            /layouts     - Application layout files go here
            /pages       - Static views go here

        /webroot         - The DocumentRoot for the application
            /css
            /files
            /img
            /js

    /cake                - Cake's core libraries. Don't edit any files here.

    index.php           

    /vendors             - Used for server-wide third-party libraries.

    VERSION.txt          - Let's you know what version of Cake you're using.
