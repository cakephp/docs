Dependency Injection
####################

.. warning::
    The Dependency Injection container is an experimental feature that is not
    API stable yet.

The CakePHP service container enables you to manage class dependencies for your
application services and perform dependency injection. Dependency injection is
a phrase that means that an object's dependencies are 'injected' into objects
via the constructor and in rare cases via 'setter' methods.

You can use the service container to define 'application services'. These
classes are use models and interact with other objects like loggers and mailers
to build re-usable workflows and business logic for your application.

CakePHP will use the service container when calling actions on your controllers,
and invoking console commands. You can also have dependencies injected into
controller constructors.

A short example would be::

    // In src/Controller/UsersController.php
    class UsersController extends AppController
    {
        // The $users service will be created via the service container.
        public function ssoCallback(UsersService $users)
        {
            if ($this->request->is('post')) {
                // Use the UsersService to create/get the user from a
                // Single Signon Provider.
                $user = $users->ensureExists($this->request->getData());
            }
        }
    }

In this example, the ``UsersController::ssoCallback()`` action needs to fetch
a user from a Single-Sign-On provider and ensure it exists in the local
database. Because this service is injected into our controller we can easily
swap the implementation out with a mock object or a dummy sub-class when
testing.

Adding Services
===============

* Class mappings
* Primitive values.
* Factory functions
* Mapping an interface to an implementation.

Adding Shared Services
----------------------

* Creating singletons and shared services.

Extending Definitions
---------------------

* Modify services defined in plugins.

Tagging Services
----------------

* Defining tagged services.
* Consuming tagged services with a factory function.

Using Configuration Data
------------------------

* Using ServiceConfig

Service Providers
=================

* What is a service provider.
* Why use service providers

Creating Service Providers
--------------------------

* Example of service provider.
