3.14.6 Plugin assets
--------------------

New for 1.3 is an improved and simplified plugin webroot directory.
In the past plugins could have a vendors directory containing
``img``, ``js``, and ``css``. Each of these directories could only
contain the type of file they shared a name with. In 1.3 both
plugins and themes can have a ``webroot`` directory. This directory
should contain any and all public accessible files for your plugin

::

    app/plugins/debug_kit/webroot/
                                    css/
                                    js/
                                    img/
                                    flash/
                                    pdf/


#. ``app/plugins/debug_kit/webroot/``
#. ``css/``
#. ``js/``
#. ``img/``
#. ``flash/``
#. ``pdf/``

And so on. You are no longer restricted to the three directories in
the past, and you may put any type of file in any directory, just
like a regular webroot. The only restriction is that ``MediaView``
needs to know the mime-type of that asset.

**Linking to assets in plugins**

The urls to plugin assets remains the same. In the past you used
``/debug_kit/js/my_file.js`` to link to
``app/plugins/debug_kit/vendors/js/my_file.js``. It now links to
``app/plugins/debug_kit/webroot/js/my_file.js``

It is important to note the **/your\_plugin/** prefix before the
img, js or css path. That makes the magic happen!

3.14.6 Plugin assets
--------------------

New for 1.3 is an improved and simplified plugin webroot directory.
In the past plugins could have a vendors directory containing
``img``, ``js``, and ``css``. Each of these directories could only
contain the type of file they shared a name with. In 1.3 both
plugins and themes can have a ``webroot`` directory. This directory
should contain any and all public accessible files for your plugin

::

    app/plugins/debug_kit/webroot/
                                    css/
                                    js/
                                    img/
                                    flash/
                                    pdf/


#. ``app/plugins/debug_kit/webroot/``
#. ``css/``
#. ``js/``
#. ``img/``
#. ``flash/``
#. ``pdf/``

And so on. You are no longer restricted to the three directories in
the past, and you may put any type of file in any directory, just
like a regular webroot. The only restriction is that ``MediaView``
needs to know the mime-type of that asset.

**Linking to assets in plugins**

The urls to plugin assets remains the same. In the past you used
``/debug_kit/js/my_file.js`` to link to
``app/plugins/debug_kit/vendors/js/my_file.js``. It now links to
``app/plugins/debug_kit/webroot/js/my_file.js``

It is important to note the **/your\_plugin/** prefix before the
img, js or css path. That makes the magic happen!
