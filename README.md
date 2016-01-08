CakePHP Documentation
=====================

[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.txt)
[![Build Status](https://img.shields.io/travis/cakephp/docs/master.svg?style=flat-square)](https://travis-ci.org/cakephp/docs)

This is the official documentation for the CakePHP project. It is available
online in HTML, PDF and EPUB formats at http://book.cakephp.org.

This `master` branch is the documentation for **CakePHP 2.x**.
For **CakePHP 3.x** please see the `3.0` branch.

Contributing to the documentation is pretty simple. Please read the
documentation on contributing to the documentation over on [the
cookbook](http://book.cakephp.org/2.0/en/contributing/documentation.html) for
help. You can read all of the documentation within as its just in plain text
files, marked up with ReST text formatting.

There are two ways for building the documentation: with Docker, or by installing
the packages directly on your OS.

Build the Documentation with Docker
-----------------------------------

Docker will let you create a container with all packages needed to build the
docs. You need to have docker installed, see the [official docs of
docker](http://docs.docker.com/mac/started/) for more information.

There is a Dockerfile included at the root of this repository. You can build
an image using:

    docker build -t cakephp/docs .

This can take a little while, because all packages needs to be downloaded, but
you'll only need to do this once.

You can run `docker images` to check that the image has been correctly built,
you should see this output:

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
cakephp/docs        latest              9783ad2c375b        3 hours ago         125.2 MB
debian              jessie              3d88cbf54477        12 days ago         125.2 MB
```

If you can't see an image called `cakephp/docs`, it can mean that the image has
been wrongly built. If you notice an image called <none> like the following:

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
<none>              <none>              9783ad2c375b        3 hours ago         125.2 MB
debian              jessie              3d88cbf54477        12 days ago         125.2 MB
```

Run the following command (with your image id of course):

    // to remove the image
    docker rmi 9783ad2c375b
    // re-run the build command
    docker build -t cakephp/docs .

Now that the image is built, you can run all the commands to build the docs:

    # To build the html
    cd /path/to/your/local/docs
    docker run -it --rm -v $(pwd):/data cakephp/docs make html

    # To build the epub
    cd /path/to/your/local/docs
    docker run -it --rm -v $(pwd):/data cakephp/docs make epub

    # To build the latex
    cd /path/to/your/local/docs
    docker run -it --rm -v $(pwd):/data cakephp/docs make latex

    # To build the pdf
    cd /path/to/your/local/docs
    docker run -it --rm -v $(pwd):/data cakephp/docs make pdf

All the commands below will create and start containers and build the docs in
the `build` folder. The `--rm` flag will delete the container after run.

Build the Documentation Manually
--------------------------------

### Installing the needed Packages ###

To build the documentation you'll need the following for linux/OS X:

* Make
* Python
* Sphinx 1.2.* (currently the make commands will not work with 1.3.* versions
  and up)
* PhpDomain for sphinx

You can install sphinx using:

    pip install sphinx==1.2.3

You can install the phpdomain using:

    pip install sphinxcontrib-phpdomain

*To run the pip command, python-pip package must be previously installed.*

### Building the Documentation ###

After installing the required packages, you can build the documentation using
`make`.

    # Create all the HTML docs. Including all the languages.
    make html

    # Create just the English HTML docs.
    make html-en

    # Create all the EPUB (e-book) docs.
    make epub

    # Create just the English EPUB docs.
    make epub-en

    # Populate the search index
    make populate-index

This will generate all the documentation in an HTML form. Other output such as
'htmlhelp' are not fully complete at this time.

After making changes to the documentation, you can build the HTML version of the
docs by using `make html` again. This will build only the HTML files that have
had changes made to them.

### Building the PDF ###

Building the PDF is a non-trivial task.

1. Install LaTeX - This varies by distribution/OS so refer to your package
   manager. You should install the full LaTeX package. The basic one requires
   many additional packages to be installed with `tlmgr`
2. Run `make latex-en`.
3. Run `make pdf-en`.

At this point the completed PDF should be in build/latex/en/CakePHPCookbook.pdf.

Contributing
------------

There are currently a number of outstanding issues that need to be addressed.
We've tried to flag these with `.. todo::` where possible. To see all the
outstanding todo's add the following to your `config/all.py`

    todo_include_todos = True

After rebuilding the HTML content, you should see a list of existing todo items
at the bottom of the table of contents.

You are also welcome to make and suggestions for new content as commits in a
GitHub fork.  Please make any totally new sections in a separate branch. This
makes changes far easier to integrate later on.

Translations
------------

Contributing translations requires that you make a new directory using the two
letter name for your language. As content is translated, directories mirroring
the English content should be created with localized content.

Making Search Work Locally
--------------------------

* Install elasticsearch. This varies based on your platform, but most
  package managers have a package for it.
* Clone the [docs_search](https://github.com/cakephp/docs_search) into a
  web accessible directory.
* Modify `searchUrl` in `themes/cakephp/static/app.js` to point at the
  baseurl for your docs_search clone.
* Start elasticsearch with the default configuration.
* Populate the search index using `make populate-index`.
* You should now be able to search the docs using elasticsearch.
