## Build the Documentation Manually

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

```bash
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
```

This will generate all the documentation in an HTML form. Other output such as
'htmlhelp' are not fully complete at this time.

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

At this point the completed PDF should be in build/latex/en/CakePHPCookbook.pdf.

### Making Search Work Locally

* Install elasticsearch. This varies based on your platform, but most
  package managers have a package for it.
* Clone the [docs_search](https://github.com/cakephp/docs_search) into a
  web accessible directory.
* Modify `searchUrl` in `themes/cakephp/static/app.js` to point at the
  baseurl for your docs_search clone.
* Start elasticsearch with the default configuration.
* Populate the search index using `make populate-index`.
* You should now be able to search the docs using elasticsearch.
