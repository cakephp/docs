Understanding Model-View-Controller
###################################

CakePHP follows the
`MVC <http://en.wikipedia.org/wiki/Model-view-controller>`_
software design pattern. Programming using MVC separates your
application into three main parts:

The Model layer
================

The Model layer represents the part of your application that
implements the business logic. this means that it is responsible
for retrieving data, converting it into meaningful concepts to your
application, as well as processing, validating, associating and any
other task relative to handling this data.

At a first glance, Model objects can be looked at as the first layer
of interaction with any database you might be using for your application. 
But in general they stand for the major concepts around which you
implement your application.

In the case of a social network, the Model layer would take care of
tasks such as Saving the user data, saving friends associations, storing
and retrieving user photos, finding new friends for suggestions, etc.
While the model objects can be thought as "Friend", "User", "Comment", "Photo"

The View layer
==============

The View renders a presentation of modeled data. Being separated from the
Model objects, it is responsible for using the information it has available
to produce any presentational interface your application might need.

For example, as the Model layer returns a set of data, the view would use it
to render a HTML page containing it. Or a XML formatted result for others to
consume.

The View layer is not only limited to HTML or text representation of the data,
it can be used to deliver a wide variety of formats depending on your needs,
such as videos, music, documents and any other format you can think of.

The Controller layer
====================

The Controller layer handles requests from users. It's responsible for rendering
back a response with the aid of both the Model and the View Layer.

Controllers can be seen as managers taking care that all needed resources for
completing a task are delegated to the correct workers. It waits for petitions
from clients, checks their validity according to authentication or authorization rules,
delegates data fetching or processing to the model, and selects the correct
type of presentational data that the client is accepting, to finally delegate
this rendering process to the View layer.


CakePHP request cycle
=====================

|Figure 1|
Figure: 1: A Basic MVC Request

Figure: 1 Shows the typical handling of a client request in CakePHP


The typical CakePHP request cycle starts with a user requesting a page or
resource in your application. This request is first processed by a dispatcher
which will select the correct controller object to handle it.

Once the request arrives at the controller, it will communicate with the Model layer
to process any data fetching or saving operation that might be needed.
After this communication is over, the controller will proceed at delegating to the
correct view object the task of generating an output resulting from the data
provided by the model.

Finally, when this output is generated, it is immediately rendered to the user

Almost every request to your application will follow this basic
pattern. We'll add some details later on which are specific to
CakePHP, so keep this in mind as we proceed.

Benefits
========

Why use MVC? Because it is a tried and true software design pattern
that turns an application into a maintainable, modular, rapidly
developed package. Crafting application tasks into separate models,
views, and controllers makes your application very light on its
feet. New features are easily added, and new faces on old features
are a snap. The modular and separate design also allows developers
and designers to work simultaneously, including the ability to
rapidly
`prototype <http://en.wikipedia.org/wiki/Software_prototyping>`_.
Separation also allows developers to make changes in one part of
the application without affecting the others.

If you've never built an application this way, it takes some time
getting used to, but we're confident that once you've built your
first application using CakePHP, you won't want to do it any other
way.

To get started on your first CakePHP application,
:doc:`try the blog tutorial now </tutorials-and-examples/blog/blog>`

.. |Figure 1| image:: /_static/img/basic_mvc.png


.. meta::
    :title lang=en: Understanding Model-View-Controller
    :keywords lang=en: model view controller,model layer,formatted result,model objects,music documents,business logic,text representation,first glance,retrieving data,software design,html page,videos music,new friends,interaction,cakephp,interface,photo,presentation,mvc,photos