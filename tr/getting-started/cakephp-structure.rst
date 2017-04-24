CakePHP Structure
#################

CakePHP features Controller, Model, and View classes, but it also
features some additional classes and objects that make development
in MVC a little quicker and more enjoyable. Components, Behaviors,
and Helpers are classes that provide extensibility and reusability
to quickly add functionality to the base MVC classes in your
applications. Right now we'll stay at a higher level, so look for
the details on how to use these tools later on.

.. _application-extensions:

Application Extensions
======================

Controllers, helpers and models each have a parent class you can use to define
application-wide changes. AppController (located at
``/app/Controller/AppController.php``), AppHelper (located at
``/app/View/Helper/AppHelper.php``) and AppModel (located at
``/app/Model/AppModel.php``) are great places to put methods you want to share
between all controllers, helpers or models.

Although routes aren't classes or files, they play a role in
requests made to CakePHP. Route definitions tell CakePHP how to map
URLs to controller actions. The default behavior assumes that the
URL ``/controller/action/var1/var2`` maps to
Controller::action($var1, $var2), but you can use routes to
customize URLs and how they are interpreted by your application.

Some features in an application merit packaging as a whole. A
plugin is a package of models, controllers and views that
accomplishes a specific purpose that can span multiple
applications. A user management system or a simplified blog might
be a good fit for CakePHP plugins.


Controller Extensions ("Components")
====================================

A Component is a class that aids in controller logic. If you have
some logic you want to share between controllers (or applications),
a component is usually a good fit. As an example, the core
EmailComponent class makes creating and sending emails a snap.
Rather than writing a controller method in a single controller that
performs this logic, you can package the logic so it can be
shared.

Controllers are also fitted with callbacks. These callbacks are
available for your use, just in case you need to insert some logic
between CakePHP's core operations. Callbacks available include:

-  :php:meth:`~Controller::afterFilter()`, executed after all controller logic,
   including the rendering of the view
-  :php:meth:`~Controller::beforeFilter()`, executed before any controller action logic
-  :php:meth:`~Controller::beforeRender()`, executed after controller logic, but before
   the view is rendered

Model Extensions ("Behaviors")
==============================

Similarly, Behaviors work as ways to add common functionality
between models. For example, if you store user data in a tree
structure, you can specify your User model as behaving like a tree,
and gain free functionality for removing, adding, and shifting
nodes in your underlying tree structure.

Models are also supported by another class called a DataSource.
DataSources are an abstraction that enable models to manipulate
different types of data consistently. While the main source of data
in a CakePHP application is often a database, you might write
additional DataSources that allow your models to represent RSS
feeds, CSV files, LDAP entries, or iCal events. DataSources allow
you to associate records from different sources: rather than being
limited to SQL joins, DataSources allow you to tell your LDAP model
that it is associated with many iCal events.

Like controllers, models have callbacks:

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  afterValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

The names of these methods should be descriptive enough to let you
know what they do. You can find the details in the models chapter.

View Extensions ("Helpers")
===========================

A Helper is a class that aids in view logic. Much like a component
used among controllers, helpers allow presentational logic to be
accessed and shared between views. One of the core helpers,
JsHelper, makes AJAX requests within views much easier and comes with 
support for jQuery (default), Prototype and Mootools.

Most applications have pieces of view code that are used
repeatedly. CakePHP facilitates view code reuse with layouts and
elements. By default, every view rendered by a controller is placed
inside a layout. Elements are used when small snippets of content
need to be reused in multiple views.


.. meta::
    :title lang=en: CakePHP Structure
    :keywords lang=en: user management system,controller actions,application extensions,default behavior,maps,logic,snap,definitions,aids,models,route map,blog,plugins,fit
