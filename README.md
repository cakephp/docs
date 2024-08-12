CakePHP Documentation
=====================

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgreen.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Build Status](https://github.com/cakephp/docs/actions/workflows/ci.yml/badge.svg?branch=4.x)](https://github.com/cakephp/docs/actions/workflows/ci.yml)

This is the official documentation for the CakePHP project. It is available
online in HTML, PDF and EPUB formats at https://book.cakephp.org.

Contributing to the documentation is pretty simple. Please read the
documentation on contributing to the documentation over on [the
cookbook](https://book.cakephp.org/4/en/contributing/documentation.html) for
help. You can read all of the documentation within as its just in plain text
files, marked up with ReST text formatting.

There are two ways for building the documentation: with Docker, or by installing
the packages directly on your OS.

Build the Documentation with Docker
-----------------------------------

Docker will let you create a container with all packages needed to build the
docs. You need to have docker installed, see the [official docs of
docker](https://docs.docker.com/desktop/) for more information.

### Build the image locally ###

Starting in the top-level directory, you can build the provided `Dockerfile`
and tag it with the name `cakephp/docs` by running:

```bash
docker build -t cakephp/docs .
```

This can take a little while, because all packages needs to be downloaded, but
you'll only need to do this once.

Now that the image is built, you can run all the commands to build the docs:

##### To build the html: #####
```bash
docker run -it --rm -v $(pwd):/data cakephp/docs make html
```
##### To build the epub: #####
```bash
docker run -it --rm -v $(pwd):/data cakephp/docs make epub
```
##### To build the latex: #####
```bash
docker run -it --rm -v $(pwd):/data cakephp/docs make latex
```
##### To build the pdf: #####
```bash
docker run -it --rm -v $(pwd):/data cakephp/docs make pdf
```

All the documentation will output to the `build` directory.

Build the Documentation Manually
--------------------------------

### Installing the needed Packages ###

To build the documentation you'll need to install dependencies using:

```bash
pip install -r requirements.txt
```

*To run the pip command, python-pip package must be previously installed.*

### Building the Documentation ###

After installing the required packages, you can build the documentation using
`make`.

##### Create all the HTML docs. Including all the languages: #####
```bash
make html
```
 ##### Create just the English HTML docs: #####
```bash
make html-en
```

##### Create all the EPUB (e-book) docs: #####
```bash
make epub
```
##### Create just the English EPUB docs: #####
```bash
make epub-en
```

After making changes to the documentation, you can build the HTML version of the
docs by using `make html` again.  This will build only the HTML files that have
had changes made to them.

### Building the PDF ###

Building the PDF is a non-trivial task.

1. Install LaTeX - This varies by distribution/OS so refer to your package
   manager. You should install the full LaTeX package. The basic one requires
   any additional packages to be installed with `tlmgr`
2. Run `make latex-en`.
3. Run `make pdf-en`.

At this point the completed PDF should be in `build/latex/en/CakePHPBook.pdf`.

Contributing
------------

There are currently a number of outstanding issues that need to be addressed.
We've tried to flag these with `.. todo::` where possible. To see all the
outstanding todo's add the following to your `config/all.py`

```python
todo_include_todos = True
```
After rebuilding the HTML content, you should see a list of existing todo items
at the bottom of the table of contents.

You are also welcome to make and suggestions for new content as commits in a
GitHub fork. Please make any totally new sections in a separate branch. This
makes changes far easier to integrate later on.

Translations
------------

Contributing translations requires that you make a new directory using the two
letter name for your language. As content is translated, directories mirroring
the English content should be created with localized content. For more info,
please,
[click here](https://book.cakephp.org/3/en/contributing/documentation.html#new-translation-language).

Making Search Work Locally
--------------------------

* Install elasticsearch. This varies based on your platform, but most
  package managers have a package for it.
* Clone the [docs_search](https://github.com/cakephp/docs_search) into a
  web accessible directory.
* Modify `searchUrl` in `themes/cakephp/static/app.js` to point at the
  baseurl for your docs_search clone.
* Start elasticsearch with the default configuration.
* Populate the search using tooling found in the [cakephp docs builder](https://github.com/cakephp/docs-builder) project.
* You should now be able to search the docs using elasticsearch.

