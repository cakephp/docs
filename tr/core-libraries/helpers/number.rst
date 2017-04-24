NumberHelper
############

.. php:class:: NumberHelper(View $view, array $settings = array())

The NumberHelper contains convenient methods that enable display
numbers in common formats in your views. These methods include ways
to format currency, percentages, data sizes, format numbers to
specific precisions and also to give you more flexibility with
formatting numbers.

.. versionchanged:: 2.1
   ``NumberHelper`` have been refactored into :php:class:`CakeNumber` class to
   allow easier use outside of the ``View`` layer.
   Within a view, these methods are accessible via the ``NumberHelper``
   class and you can call it as you would call a normal helper method:
   ``$this->Number->method($args);``.

.. include:: ../../core-utility-libraries/number.rst
    :start-after: start-cakenumber
    :end-before: end-cakenumber

.. warning::

    Since 2.4 the symbols are now UTF-8. Please see the migration guide for details if you run a
    non-UTF-8 app.

.. meta::
    :title lang=en: NumberHelper
    :description lang=en: The Number Helper contains convenience methods that enable display numbers in common formats in your views.
    :keywords lang=en: number helper,currency,number format,number precision,format file size,format numbers
