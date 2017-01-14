CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.

.. note::

    The CounterCache behavior works for ``belongsTo`` associations only. For
    example for "Comments belongsTo Articles", you need to add the CounterCache
    behavior to the ``CommentsTable`` in order to generate ``comment_count`` for
    Articles table.

    It is possible though to make this work for ``belongsToMany`` associations.
    You need to enable the CounterCache behavior in a custom ``through`` table
    configured in association options. See how to configure a custom join table
    :ref:`using-the-through-option`.
