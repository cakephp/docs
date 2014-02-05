Instalarea
##########

CakePHP se instaleaza repede si usor. Cerintele minime sunt un webserver 
si o copie de CakePHP. Doar atat! Desi acest manual se concentreaza mai 
ales pe instalarea pe Apache (deoarece este cel mai folosit), puteti 
configura CakePHP sa functioneze pe o varietate de web servere cum ar fi 
LightHTTPD sau Microsoft IIS.

Cerinte
=======

-  Server HTTPr. De exemplu: Apache. mod\_rewrite este preferat, dar
   nu este in mod obligatoriu necesar.
-  PHP cu versiunea 5.2.8 sau mai mare.

Dpdv tehnic nu este necesar un motor de baza de date, dar ne imaginam ca
majoritatea aplicatiilor vor utiliza una. CakePHP suporta o varietate de
baze de date:

-  MySQL (4 sau mai mare)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. atentie::

    Toate driverele incluse in distributiile de servere necesita PDO. 
    Prin urmare ar trebui sa va asigurati ca aveti instalate extensiile 
    PDO corecte.

Licenta
=======

CakePHP este licentiata MIT. Aceasta inseamna ca sunteti liber/a sa modificati,
sa distribuiti si sa republicati codul sursa cu conditia ca notele de copyright
sa ramana intacte. De asemenea, sunteti liberi/libere sa incorporati CakePHP
in orice aplicatie comerciala sau cu sursa inchisa.

Download-area CakePHP
=====================

There are two main ways to get a fresh copy of CakePHP. You can
either download an archived copy (zip/tar.gz/tar.bz2) from the main
website, or check out the code from the git repository.

To download the latest major release of CakePHP. Visit the main
website `http://cakephp.org <http://cakephp.org>`_ and
follow the "Download Now" link.

All current releases of CakePHP are hosted on
`GitHub <http://github.com/cakephp/cakephp>`_. GitHub houses both CakePHP
itself as well as many other plugins for CakePHP. The CakePHP
releases are available at
`GitHub tags <https://github.com/cakephp/cakephp/tags>`_.

Alternatively you can get fresh off the press code, with all the
bug-fixes and up to the minute enhancements.
These can be accessed from GitHub by cloning the
`GitHub`_ repository::

    git clone git://github.com/cakephp/cakephp.git


Permisiuni
==========

CakePHP foloseste folderul ``app/tmp`` pentru diferite operatii. 
Cateva exemple ar fi descrierile Modelelor, cached view-uri si informatii 
despre sesiune.

Prin urmare, asigurati-va ca folderul ``app/tmp`` si toate subfolderele 
sale din instalarea dvs de CakePHP sunt *writable* de catre utilizatorul 
pe care functioneaza web server-ul.

Configurare
===========

Confgurarea mediului CakePHP poate fi la fel de simpla ca slapping it 
in your web server's document root, or as complex and flexible as you wish.
This section will cover the three main installation types for
CakePHP: development, production, and advanced.

-  Dezvoltare: easy to get going, URLs for the application include
   the CakePHP installation directory name, and less secure.
-  Productie: Requires the ability to configure the web server's
   document root, clean URLs, very secure.
-  Avansat: With some configuration, allows you to place key
   CakePHP directories in different parts of the filesystem, possibly
   sharing a single CakePHP core library folder amongst many CakePHP
   applications.

Dezvoltare
==========

A development installation is the fastest method to setup CakePHP.
This example will help you install a CakePHP application and make
it available at http://www.example.com/cake\_2\_0/. We assume for
the purposes of this example that your document root is set to
``/var/www/html``.

Despachetati continutul arhivei CakePHP in ``/var/www/html``. Acum aveti 
un folder in radacina serverului dvs numit dupa versiunea pe care ati 
descarcat-o (de.ex. cake\_2.0.0). Redenumiti acest folder in cake\_2\_0.
Configurarea dvs pentru programare va arata astfel in sistemul dvs de 
fisiere::

    /var/www/html/
        cake_2_0/
            app/
            lib/
            plugins/
            vendors/
            .htaccess
            index.php
            README

If your web server is configured correctly, you should now find
your CakePHP application accessible at
http://www.example.com/cake\_2\_0/.

Using one CakePHP Checkout for multiple Applications
----------------------------------------------------

If you are developing a number of applications, it often makes sense to have
them share the same CakePHP core checkout. There are a few ways in which you can
accomplish this. Often the easiest is to use PHP's ``include_path``. To start
off, clone CakePHP into a directory. For this example, we'll use
``/home/mark/projects``::

    git clone git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

This will clone CakePHP into your ``/home/mark/projects`` directory. If you don't want
to use git, you can download a zipball and the remaining steps will be the
same. Next you'll have to locate and modify your ``php.ini``. On \*nix systems
this is often in ``/etc/php.ini``, but using ``php -i`` and looking for 'Loaded
Configuration File'. Once you've found the correct ini file, modify the
``include_path`` configuration to include ``/home/mark/projects/cakephp/lib``. An
example would look like::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

After restarting your webserver, you should see the changes reflected in
``phpinfo()``.

.. note::

    If you are on windows, separate include paths with ; instead of :

Having finished setting up your ``include_path`` your applications should be able to
find CakePHP automatically.

Productie
=========

A production installation is a more flexible way to setup CakePHP.
Using this method allows an entire domain to act as a single
CakePHP application. This example will help you install CakePHP
anywhere on your filesystem and make it available at
http://www.example.com. Note that this installation may require the
rights to change the ``DocumentRoot`` on Apache webservers.

Unpack the contents of the CakePHP archive into a directory of your
choice. For the purposes of this example, we assume you chose to
install CakePHP into /cake\_install. Your production setup will look
like this on the filesystem::

    /cake_install/
        app/
            webroot/ (this directory is set as the ``DocumentRoot``
             directive)
        lib/
        plugins/
        vendors/
        .htaccess
        index.php
        README

Developers using Apache should set the ``DocumentRoot`` directive
for the domain to::

    DocumentRoot /cake_install/app/webroot

If your web server is configured correctly, you should now find
your CakePHP application accessible at http://www.example.com.

Instalare avansata si URL Rewriting
=======================================

.. toctree::

    installation/advanced-installation
    installation/url-rewriting

Dati-i drumul
=============

Alright, let's see CakePHP in action. Depending on which setup you
used, you should point your browser to http://example.com/ or
http://example.com/cake\_install/. At this point, you'll be
presented with CakePHP's default home, and a message that tells you
the status of your current database connection.

Felicitari! Sunteti gata sa :doc:`creati prima dvs aplicatie CakePHP
</getting-started>`.

Tot nu functioneaza? Dacă obtineți erori de fus orar legate de PHP
decomentați o linie în ``app/Config/core.php``::

   /**
    * Uncomment this line and correct your server timezone to fix
    * any date & time related errors.
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=en: Instalare
    :keywords lang=en: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
