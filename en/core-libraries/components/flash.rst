FlashComponent
##############

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

FlashComponent provides a way to set one-time notification messages to be
displayed after processing a form or acknowledging data. CakePHP refers to these
messages as "flash messages". FlashComponent writes flash messages to
``$_SESSION``, to be rendered in a View using
:doc:`FlashHelper </core-libraries/helpers/flash>`.

Setting Flash Messages
======================

FlashComponent provides two ways to set flash messages: its ``__call`` magic
method and its ``set()`` method.  To furnish your application with verbosity,
FlashComponent's ``__call`` magic method allows you use a method name that maps
to an element located under the ``src/Template/Element/Flash`` directory. By
convention, camelcased methods will map to the lowercased and underscored
element name::

    // Uses src/Template/Element/Flash/success.ctp
    $this->Flash->success('This was successful');

    // Uses src/Template/Element/Flash/great_success.ctp
    $this->Flash->greatSuccess('This was greatly successful');

Alternatively, to set a plain-text message without rendering an element, you can
use the ``set()`` method::

    $this->Flash->set('This is a message');

FlashComponent's ``__call`` and ``set()`` methods optionally take a second
parameter, an array of options:

* ``key`` Defaults to 'flash'. The array key found under the 'Flash' key in
  the session.
* ``element`` Defaults to null, but will automatically be set when using the
  ``__call()`` magic method. The element name to use for rendering.
* ``params`` An optional array of keys/values to make available as variables
  within an element.

An example of using these options::

    // In your Controller
    $this->Flash->success('The user has been saved', [
        'key' => 'positive',
        'params' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);

    // In your View
    <?= $this->Flash->render('positive') ?>

    <!-- In src/Template/Element/Flash/success.ctp -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

.. note::
    By default, CakePHP does not escape the HTML in flash messages. If you
    are using any request or user data in your flash messages, you should
    escape it with :php:func:`h` when formatting your messages.

For more information about rendering your flash messages, please refer to the
:doc:`FlashHelper </core-libraries/helpers/flash>` section.
