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
version = '3.5'

# The full version, including alpha/beta/rc tags.
release = '3.5'

# The search index version.
search_version = '3-0'

# The marketing diplay name for the book.
version_name = 'Red Velvet'

# Other versions that display in the version picker menu.
version_list = [
    {'name': '3.x', 'number': '3.0', 'current': True, 'title': '3.x Book'},
    {'name': '2.x', 'number': '2.0', 'title': '2.x Book'},
    {'name': '1.3', 'number': '3.0', 'title': '1.3 Book'},
    {'name': '1.2', 'number': '1.2', 'title': '1.2 Book'},
    {'name': '1.1', 'number': '1.1', 'title': '1.1 Book'},
]

# Languages available.
languages = ['en', 'pt_BR', 'es', 'ja', 'fr', 'zh', 'tr', 'ru']

# The GitHub branch name for this version of the docs
# for edit links to point at.
branch = '3.0'

# Add any paths that contain custom themes here, relative to this directory.
html_theme_path = []
html_theme = 'cakephp'

# If not '', a 'Last updated on:' timestamp is inserted at every page bottom,
# using the given strftime format.
html_last_updated_fmt = '%b %d, %Y'

# Custom sidebar templates, maps document names to template names.
html_sidebars = {
    '**': ['globaltoc.html', 'localtoc.html']
}

# -- Options for LaTeX output ------------------------------------------------

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title, author,
# documentclass [howto/manual]).
latex_documents = [
    ('pdf-contents', 'CakePHPCookbook.tex', u'CakePHP Cookbook Documentation',
     u'Cake Software Foundation', 'manual'),
]

# -- Options for manual page output ------------------------------------------

# One entry per manual page. List of tuples
# (source start file, name, description, authors, manual section).
man_pages = [
    ('index', 'cakephpcookbook', u'CakePHP Cookbook Documentation',
     [u'CakePHP'], 1)
]


# -- Options for Epub output -------------------------------------------------

# Bibliographic Dublin Core info.
epub_title = u'CakePHP Cookbook'
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
epub_uid = 'cakephpcookbook1393624653'

# A list of files that should not be packed into the epub file.
epub_exclude_files = [
    'index.html',
    'pdf-contents.html',
    'search.html',
    'contents.html'
]

# The depth of the table of contents in toc.ncx.
epub_tocdepth = 2
