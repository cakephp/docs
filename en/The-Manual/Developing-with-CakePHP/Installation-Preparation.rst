Installation Preparation
########################

CakePHP is fast and easy to install. The minimum requirements are a
webserver and a copy of Cake, that's it! While this manual focuses
primarily on setting up with Apache (because it's the most common), you
can configure Cake to run on a variety of web servers such as LightHTTPD
or Microsoft IIS.

Installation preparation consists of the following steps:

-  Downloading a copy of CakePHP
-  Configuring your web server to handle php if necessary
-  Checking file permissions

Getting CakePHP
===============

There are two main ways to get a fresh copy of CakePHP. You can either
download an archive copy (zip/tar.gz/tar.bz2) from the main website, or
check out the code from the git repository.

To download the latest major release of CakePHP. Visit the main website
`https://cakephp.org <https://cakephp.org>`_ and follow the
"Download Now" link.

All current releases of CakePHP are hosted at CakeForge, the home of
CakePHP. This site also contains links to many other CakePHP projects,
including plugins and applications for CakePHP. The CakePHP releases are
available at
`https://github.com/cakephp/cakephp/downloads <https://github.com/cakephp/cakephp/downloads>`_.

Alternatively nightly builds are produced which include bug-fixes and up
to the minute(well, to the day) enhancements. These can be accessed from
the download index here:
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
For true up to the minute updates, you can check out directly from the
development branch of the git repository here:
`https://github.com/cakephp/cakephp <https://github.com/cakephp/cakephp>`_.

Permissions
===========

CakePHP uses the /app/tmp directory for a number of different
operations. Model descriptions, cached views, and session information
are just a few examples.

As such, make sure the /app/tmp directory in your cake installation is
writable by the web server user.
