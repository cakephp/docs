3.1 Migration Guide
###################

CakePHP 3.1 is a fully API compatible upgrade from 3.0. This page outlines
the changes and improvements made in 3.1.

Controller
==========

FlashComponent
--------------

- ``FlashComponent`` now stacks Flash messages when set with the ``set()``
  or ``__call()`` method. This means that the structure in the Session for
  stored Flash messages has changed.

Helper
==========

SessionHelper
-------------

- The ``SessionHelper`` has been deprecated. You can use ``$this->request->session()`` directly.

FlashHelper
-----------

- ``FlashHelper`` can render multiple messages if multiple messages where
  set with the ``FlashComponent``. Each message will be rendered in its own
  element. Messages will be rendered in the order they were set.