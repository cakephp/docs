Flash
#####

.. php:namespace:: Cake\View\Helper

.. php:class:: FlashHelper(View $view, array $config = [])

FlashHelper provides a way to render flash messages that were set in
``$_SESSION`` by :doc:`FlashComponent </controllers/components/flash>`.
:doc:`FlashComponent </controllers/components/flash>` and FlashHelper
primarily use elements to render flash messages.  Flash elements are found under
the ``src/Template/Element/Flash`` directory.  You'll notice that CakePHP's App
template comes with two flash elements: ``success.ctp`` and ``error.ctp``.

Rendering Flash Messages
========================

To render a flash message, you can simply use FlashHelper's ``render()``
method::

    <?= $this->Flash->render() ?>

By default, CakePHP uses a "flash" key for flash messages in a session.  But, if
you've specified a key when setting the flash message in
:doc:`FlashComponent </controllers/components/flash>`, you can specify which
flash key to render::

    <?= $this->Flash->render('other') ?>

You can also override any of the options that were set in FlashComponent::

    // In your Controller
    $this->Flash->set('The user has been saved.', [
        'element' => 'success'
    ]);

    // In your View: Will use great_success.ctp instead of succcess.ctp
    <?= $this->Flash->render('flash', [
        'element' => 'great_success'
    ]);

.. note::
    By default, CakePHP does not escape the HTML in flash messages. If you are using
    any request or user data in your flash messages, you should escape it
    with :php:func:`h` when formatting your messages.

For more information about the available array options, please refer to the
:doc:`FlashComponent </controllers/components/flash>` section.
