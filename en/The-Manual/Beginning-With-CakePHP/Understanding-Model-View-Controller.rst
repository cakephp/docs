Understanding Model-View-Controller
###################################

CakePHP follows the
`MVC <https://en.wikipedia.org/wiki/Model-view-controller>`_ software
design pattern. Programming using MVC separates your application into
three main parts:

#. The Model represents the application data
#. The View renders a presentation of model data
#. The Controller handles and routes requests made by the client

.. figure:: /_static/img/basic_mvc.png
    :align: center
    :alt: Figure 1

    A Basic MVC Request


Figure: 1 shows an example of a bare-bones MVC request in CakePHP. To
illustrate, assume a client named "Ricardo" just clicked on the “Buy A
Custom Cake Now!” link on your application’s home page.

-  Ricardo clicks the link pointing to http://www.example.com/cakes/buy,
   and his browser makes a request to your web server.
-  The dispatcher checks the request URL (/cakes/buy), and hands the
   request to the correct controller.
-  The controller performs application specific logic. For example, it
   may check to see if Ricardo has logged in.
-  The controller also uses models to gain access to the application’s
   data. Models usually represent database tables, but they could also
   represent `LDAP <https://en.wikipedia.org/wiki/Ldap>`_ entries,
   `RSS <https://en.wikipedia.org/wiki/Rss>`_ feeds, or files on the
   system. In this example, the controller uses a model to fetch
   Ricardo’s last purchases from the database.
-  Once the controller has worked its magic on the data, it hands it to
   a view. The view takes this data and gets it ready for presentation
   to the client. Views in CakePHP are usually in HTML format, but a
   view could just as easily be a PDF, XML document, or JSON object
   depending on your needs.
-  Once the view has used the data from the controller to build a fully
   rendered view, the content of that view is returned to Ricardo’s
   browser.

Almost every request to your application will follow this basic pattern.
We'll add some details later on which are specific to CakePHP, so keep
this in mind as we proceed.

Benefits
========

Why use MVC? Because it is a tried and true software design pattern that
turns an application into a maintainable, modular, rapidly developed
package. Crafting application tasks into separate models, views, and
controllers makes your application very light on its feet. New features
are easily added, and new faces on old features are a snap. The modular
and separate design also allows developers and designers to work
simultaneously, including the ability to rapidly
`prototype <https://en.wikipedia.org/wiki/Software_prototyping>`_.
Separation also allows developers to make changes in one part of the
application without affecting others.

If you've never built an application this way, it takes some time
getting used to, but we're confident that once you've built your first
application using CakePHP, you won't want to do it any other way.
