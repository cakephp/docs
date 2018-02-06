Flash
#####

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = array())

FlashComponent provides a way to set one-time notification messages to be
displayed after processing a form or acknowledging data. CakePHP refers to these
messages as "flash messages". FlashComponent writes flash messages to
``$_SESSION``, to be rendered in a View using
:doc:`FlashHelper </core-libraries/helpers/flash>`.

The FlashComponent replaces the ``setFlash()`` method on ``SessionComponent``
and should be used instead of that method.

Setting Flash Messages
======================

FlashComponent provides two ways to set flash messages: its ``__call``
magic method and its ``set()`` method.

To use the default flash message handler, you can use the ``set()``
method::

    $this->Flash->set('This is a message');

.. versionadded:: 2.10.0

    Flash messages now stack. Successive calls to ``set()`` or ``__call()`` with
    the same key will append the messages in the ``$_SESSION``. If you want to
    keep the old behavior (one message even after consecutive calls), set the
    ``clear`` option to true when setting messages.

To create custom Flash elements, FlashComponent's ``__call`` magic
method allows you use a method name that maps to an element located under
the ``app/View/Elements/Flash`` directory. By convention, camelcased
methods will map to the lowercased and underscored element name::

    // Uses app/View/Elements/Flash/success.ctp
    $this->Flash->success('This was successful');

    // Uses app/View/Elements/Flash/great_success.ctp
    $this->Flash->greatSuccess('This was greatly successful');

FlashComponent's ``__call`` and ``set()`` methods optionally take a second
parameter, an array of options:

* ``key`` Defaults to 'flash'. The array key found under the 'Flash' key in
  the session.
* ``element`` Defaults to null, but will automatically be set when using the
  ``__call()`` magic method. The element name to use for rendering.
* ``params`` An optional array of keys/values to make available as variables
  within an element.
* ``clear`` Set to ``true`` to remove any existing flash messages of the given
  key/element. (Added in 2.10.0).

An example of using these options::

    // In your Controller
    $this->Flash->success('The user has been saved', array(
        'key' => 'positive',
        'params' => array(
            'name' => $user['User']['name'],
            'email' => $user['User']['email']
        )
    ));

    // In your View
    <?php echo $this->Flash->render('positive') ?>

    <!-- In app/View/Elements/Flash/success.ctp -->
    <div id="flash-<?php echo h($key) ?>" class="message-info success">
        <?php echo h($message) ?>: <?php echo h($params['name']) ?>, <?php echo h($params['email']) ?>.
    </div>

If you are using the ``__call()`` magic method, the ``element`` option will
always be replaced. In order to retrieve a specific element from a plugin, you
should set the ``plugin`` parameter. For example::

    // In your Controller
    $this->Flash->warning('My message', array('plugin' => 'PluginName'));

The code above will use the warning.ctp element under ``plugins/PluginName/View/Elements/Flash``
for rendering the flash message.

.. note::
    By default, CakePHP does not escape the HTML in flash messages. If you
    are using any request or user data in your flash messages, you should
    escape it with :php:func:`h` when formatting your messages.

For more information about rendering your flash messages, please refer to the
:doc:`FlashHelper </core-libraries/helpers/flash>` section.
