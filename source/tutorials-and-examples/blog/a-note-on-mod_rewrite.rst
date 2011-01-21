11.1.5 A Note on mod\_rewrite
-----------------------------

Occasionally a new user will run in to mod\_rewrite issues, so I'll
mention them marginally here. If the CakePHP welcome page looks a
little funny (no images or css styles), it probably means
mod\_rewrite isn't functioning on your system. Here are some tips
to help get you up and running:


#. Make sure that an .htaccess override is allowed: in your
   httpd.conf, you should have a section that defines a section for
   each Directory on your server. Make sure the ``AllowOverride`` is
   set to ``All`` for the correct Directory. For security and
   performance reasons, do *not* set ``AllowOverride`` to ``All`` in
   ``<Directory />``. Instead, look for the ``<Directory>`` block that
   refers to your actual website directory.

#. Make sure you are editing the correct httpd.conf rather than a
   user- or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of
   CakePHP without the needed .htaccess files. This sometimes happens
   because some operating systems treat files that start with '.' as
   hidden, and don't copy them. Make sure your copy of CakePHP is from
   the downloads section of the site or our git repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You
   should see something like
   ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``
   or (for Apache 1.3) ``AddModule             mod_rewrite.c`` in your
   httpd.conf.


If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use Cake's built in pretty URLs. In ``/app/config/core.php``,
uncomment the line that looks like:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Also remove these .htaccess files:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the
`Installation <http://book.cakephp.org/view/912/Installation>`_
section.

11.1.5 A Note on mod\_rewrite
-----------------------------

Occasionally a new user will run in to mod\_rewrite issues, so I'll
mention them marginally here. If the CakePHP welcome page looks a
little funny (no images or css styles), it probably means
mod\_rewrite isn't functioning on your system. Here are some tips
to help get you up and running:


#. Make sure that an .htaccess override is allowed: in your
   httpd.conf, you should have a section that defines a section for
   each Directory on your server. Make sure the ``AllowOverride`` is
   set to ``All`` for the correct Directory. For security and
   performance reasons, do *not* set ``AllowOverride`` to ``All`` in
   ``<Directory />``. Instead, look for the ``<Directory>`` block that
   refers to your actual website directory.

#. Make sure you are editing the correct httpd.conf rather than a
   user- or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of
   CakePHP without the needed .htaccess files. This sometimes happens
   because some operating systems treat files that start with '.' as
   hidden, and don't copy them. Make sure your copy of CakePHP is from
   the downloads section of the site or our git repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You
   should see something like
   ``LoadModule rewrite_module             libexec/httpd/mod_rewrite.so``
   or (for Apache 1.3) ``AddModule             mod_rewrite.c`` in your
   httpd.conf.


If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use Cake's built in pretty URLs. In ``/app/config/core.php``,
uncomment the line that looks like:

::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

Also remove these .htaccess files:

::

            /.htaccess
            /app/.htaccess
            /app/webroot/.htaccess
            

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the
`Installation <http://book.cakephp.org/view/912/Installation>`_
section.
