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

All current releases of CakePHP are hosted on
`Github <https://github.com/cakephp>`_. Github houses both CakePHP itself
as well as many other plugins for CakePHP. The CakePHP releases are
available at `Github
downloads <https://github.com/cakephp/cakephp1x/downloads>`_.

Alternatively you can get fresh off the press code, with all the
bug-fixes and up to the minute(well, to the day) enhancements. These can
be accessed from github by cloning the repository.
`CakePHP repository <https://github.com/cakephp/cakephp>`_.

Permissions
===========

CakePHP uses the /app/tmp directory for a number of different
operations. Model descriptions, cached views, and session information
are just a few examples.

As such, make sure the /app/tmp directory in your cake installation is
writable by the web server user.
