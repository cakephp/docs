Core Libraries
##############

CakePHP comes with a plethora of built-in functions and classes.  These classes
and functions try to cover some of the most common features required in web
applications.

General purpose
===============

General purpose libraries are available and reused in many places across
CakePHP.

.. toctree::
    :maxdepth: 2

    core-libraries/global-constants-and-functions
    core-libraries/events
    core-libraries/collections

.. _core-components:

Components
==========

CakePHP has a selection of components to help take care of basic tasks in your
controllers.  See the section on :doc:`/controllers/components` for how to
configure and use components.

.. toctree::
    :maxdepth: 2

    core-libraries/components/access-control-lists
    core-libraries/components/authentication
    core-libraries/components/cookie
    core-libraries/components/email
    core-libraries/components/request-handling
    core-libraries/components/pagination
    core-libraries/components/security-component
    core-libraries/components/sessions

.. _core-helpers:

Helpers
=======

CakePHP features a number of helpers that aid in view creation. They assist in
creating well-formed markup (including forms), aid in formatting text, times and
numbers, and can even integrate with popular javascript libraries. Here is a
summary of the built-in helpers. 

Read :doc:`/views/helpers` to learn more about helpers, their api, and how you
can create and use your own helpers.

.. toctree::
    :maxdepth: 2

    core-libraries/helpers/cache
    core-libraries/helpers/form
    core-libraries/helpers/html
    core-libraries/helpers/js
    core-libraries/helpers/number
    core-libraries/helpers/paginator
    core-libraries/helpers/rss
    core-libraries/helpers/session
    core-libraries/helpers/text
    core-libraries/helpers/time

.. _core-behaviors:

Behaviors
=========

Behaviors add extra functionality to your models. CakePHP comes
with a number of built-in behaviors such as :php:class:`TreeBehavior`
and :php:class:`ContainableBehavior`.

To learn about creating and using behaviors, read the section
on :doc:`/models/behaviors`.

.. toctree::
    :maxdepth: 2

    core-libraries/behaviors/acl
    core-libraries/behaviors/containable
    core-libraries/behaviors/translate
    core-libraries/behaviors/tree

Core libraries
==============

Beyond the core MVC components, CakePHP includes a great selection of utility
classes that help you do everything from webservice requests, to caching, to
logging, internationalization and more.

.. toctree::
    :maxdepth: 2

    core-utility-libraries/app
    core-libraries/caching
    core-utility-libraries/sanitize
    core-utility-libraries/email
    core-utility-libraries/file-folder
    core-utility-libraries/httpsocket
    core-utility-libraries/inflector
    core-libraries/internationalization-and-localization
    core-libraries/logging
    core-utility-libraries/router
    core-utility-libraries/security
    core-utility-libraries/set
    core-utility-libraries/string
    core-utility-libraries/xml


.. meta::
    :title lang=en: Core Libraries
    :keywords lang=en: core libraries,global constants,cookie,access control lists,number,text,time,security component,core components,general purpose,web applications,markup,authentication,api,cakephp,functionality,sessions,collections,events