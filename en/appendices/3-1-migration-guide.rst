3.1 Migration Guide
###################

CakePHP 3.1 is a fully API compatible upgrade from 3.0. This page outlines
the changes and improvements made in 3.1.

Routing
=======

The default route class has been changed to ``DashedRoute`` in the
``cakephp/app`` repo. Your current code base is not affected by this, but it is
recommended to use this route class from now on.

Console
=======

- ``Shell::dispatchShell()`` no longer outputs the welcome message from the
  dispatched shell.
- :doc:`/console-and-shells/helpers` were added. Shell Helpers allow you to
  package up complex output logic in a reusable way.

Controller
==========

AuthComponent
-------------

- New config ``storage`` has been added. It contains the storage class name that
  ``AuthComponent`` uses to store user record. By default ``SessionStorage`` is used.
  If using a stateless authenticator you should configure ``AuthComponent`` to
  use ``MemoryStorage`` instead.

FlashComponent
--------------

- ``FlashComponent`` now stacks Flash messages when set with the ``set()``
  or ``__call()`` method. This means that the structure in the Session for
  stored Flash messages has changed.

View
====

- You can now set ``_serialized`` to ``true`` for ``JsonView`` and ``XmlView``
  to serialize all view variables instead of explicitly specifying them.

Helper
======

SessionHelper
-------------

- The ``SessionHelper`` has been deprecated. You can use
  ``$this->request->session()`` directly.

FlashHelper
-----------

- ``FlashHelper`` can render multiple messages if multiple messages where
  set with the ``FlashComponent``. Each message will be rendered in its own
  element. Messages will be rendered in the order they were set.
