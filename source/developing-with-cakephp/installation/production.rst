3.3.2 Production
----------------

A production installation is a more flexible way to setup Cake.
Using this method allows an entire domain to act as a single
CakePHP application. This example will help you install Cake
anywhere on your filesystem and make it available at
http://www.example.com. Note that this installation may require the
rights to change the ``DocumentRoot`` on Apache webservers.

Unpack the contents of the Cake archive into a directory of your
choosing. For the purposes of this example, we assume you choose to
install Cake into /cake\_install. Your production setup will look
like this on the filesystem:


-  /cake\_install/
   
   -  /app
      
      -  /webroot (this directory is set as the ``DocumentRoot``
         directive)

   -  /cake
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README


Developers using Apache should set the ``DocumentRoot`` directive
for the domain to:

::

    DocumentRoot /cake_install/app/webroot

If your web server is configured correctly, you should now find
your Cake application accessible at http://www.example.com.

3.3.2 Production
----------------

A production installation is a more flexible way to setup Cake.
Using this method allows an entire domain to act as a single
CakePHP application. This example will help you install Cake
anywhere on your filesystem and make it available at
http://www.example.com. Note that this installation may require the
rights to change the ``DocumentRoot`` on Apache webservers.

Unpack the contents of the Cake archive into a directory of your
choosing. For the purposes of this example, we assume you choose to
install Cake into /cake\_install. Your production setup will look
like this on the filesystem:


-  /cake\_install/
   
   -  /app
      
      -  /webroot (this directory is set as the ``DocumentRoot``
         directive)

   -  /cake
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README


Developers using Apache should set the ``DocumentRoot`` directive
for the domain to:

::

    DocumentRoot /cake_install/app/webroot

If your web server is configured correctly, you should now find
your Cake application accessible at http://www.example.com.
