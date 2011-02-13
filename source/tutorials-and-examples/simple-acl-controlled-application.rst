11.2 Simple Acl controlled Application
--------------------------------------

In this tutorial you will create a simple application with
:doc:`/core-components/authentication` and
:doc:`/core-components/access-control-lists`. This
tutorial assumes you have read the :doc:`/tutorials-and-examples/blog/blog`
tutorial, and you are familiar with
:doc:`/core-console-applications/code-generation-with-bake`. You should have
some experience with CakePHP, and be familiar with MVC concepts.
This tutorial is a brief introduction to the
```AuthComponent`` <http://api.cakephp.org/class/auth-component>`_
and
```AclComponent`` <http://api.cakephp.org/class/acl-component>`_.

What you will need


#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get Cake up and running without
   any configuration at all.
#. A database server. We're going to be using MySQL in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: Cake will be taking the reins from there.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.
