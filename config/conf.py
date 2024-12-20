import os
# Global configuration information used across all the
# translations of documentation.
#
# Import the base theme configuration
from cakephpsphinx.config.all import *

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = '5.x'

# The full version, including alpha/beta/rc tags.
release = '5.x'

# The search index version.
search_version = '5'

# The marketing diplay name for the book.
version_name = 'Chiffon'

# Other versions that display in the version picker menu.
version_list = [
    {'name': '5.x', 'number': '5', 'current': True, 'title': '5.x Book'},
    {'name': '4.x', 'number': '4', 'title': '4.x Book'},
    {'name': '3.x', 'number': '3', 'title': '3.x Book'},
    {'name': '2.x', 'number': '2', 'title': '2.x Book'},
    {'name': '1.3', 'number': '1.3', 'title': '1.3 Book'},
    {'name': '1.2', 'number': '1.2', 'title': '1.2 Book'},
    {'name': '1.1', 'number': '1.1', 'title': '1.1 Book'},
]
# Enables the 'development version banner'
is_prerelease = False

# Languages available.
languages = ['en', 'pt_BR', 'es', 'ja', 'fr']

# The GitHub branch name for this version of the docs
# for edit links to point at.
branch = '5.x'

# Add any paths that contain custom themes here, relative to this directory.
html_theme_path = []
html_theme = 'cakephp'

# If not '', a 'Last updated on:' timestamp is inserted at every page bottom,
# using the given strftime format.
html_last_updated_fmt = '%b %d, %Y'

# Custom sidebar templates, maps document names to template names.
html_sidebars = {
    '**': ['globaltoc.html']
}

language = os.getenv('LANG') or 'en'
html_use_opensearch = 'https://book.cakephp.org/' + version + '/' + language

# -- Options for LaTeX output ------------------------------------------------

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title, author,
# documentclass [howto/manual]).
latex_documents = [
    ('pdf-contents', 'CakePHPBook.tex', u'CakePHP Book',
     u'Cake Software Foundation', 'manual'),
]

# -- Options for manual page output ------------------------------------------

# One entry per manual page. List of tuples
# (source start file, name, description, authors, manual section).
man_pages = [
    ('index', 'cakephpbook', u'CakePHP Book',
     [u'CakePHP'], 1)
]


# -- Options for Epub output -------------------------------------------------

# Bibliographic Dublin Core info.
epub_title = u'CakePHP Book'
epub_author = u'Cake Software Foundation, Inc.'
epub_publisher = u'Cake Software Foundation, Inc.'
epub_copyright = u'%d, Cake Software Foundation, Inc.' % datetime.datetime.now().year

epub_theme = 'cakephp-epub'

# The cover page information.
epub_cover = ('_static/epub-logo.png', 'epub-cover.html')

# The scheme of the identifier. Typical schemes are ISBN or URL.
epub_scheme = 'URL'

# The unique identifier of the text. This can be a ISBN number
# or the project homepage.
epub_identifier = 'https://cakephp.org'

# A unique identification for the text.
epub_uid = 'cakephpbook1393624653'

# A list of files that should not be packed into the epub file.
epub_exclude_files = [
    'index.html',
    'pdf-contents.html',
    'search.html',
    'contents.html'
]

# The depth of the table of contents in toc.ncx.
epub_tocdepth = 2

rst_epilog = """
.. |phpversion| replace:: **8.4**
.. |minphpversion| replace:: 8.1
"""

# todo_include_todos = True

# turn off contents entries for classes/functions
# generally we add titles for methods and classes instead.
toc_object_entries = False
