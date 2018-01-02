Routes Shell
############

.. versionadded:: 3.1
    The RoutesShell was added in 3.1

The RoutesShell provides a simple to use CLI interface for testing and debugging
routes. You can use it to test how routes are parsed, and what URLs routing
parameters will generate.

Getting a List of all Routes
----------------------------

::

    bin/cake routes

Testing URL parsing
-------------------

You can quickly see how a URL will be parsed using the ``check`` method::

    bin/cake routes check /bookmarks/edit/1

If your route contains any query string parameters remember to surround the URL
in quotes::

    bin/cake routes check "/bookmarks/?page=1&sort=title&direction=desc"

Testing URL Generation
----------------------

You can see how which URL a :term:`routing array` will generate using the
``generate`` method::

    bin/cake routes generate controller:Bookmarks action:edit 1

