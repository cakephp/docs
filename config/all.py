# Global configuration information used across all the
# translations of documentation.
#
# Import the base theme configuration
from cakephpsphinx.config.all import *

# -- General configuration ----------------------------------------------------

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = '2.x'

# The full version, including alpha/beta/rc tags.
release = '2.x'

search_version = '2-10'

# Branch name in cakephp/docs
branch = 'master'

# 2.x has no marketing name
version_name = ''

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
exclude_patterns = [
    'core-libraries/components/email.rst'
]

# Other versions that display in the version picker menu.
version_list = [
    {'name': '3.x', 'number': '3.0', 'title': '3.x Book'},
    {'name': '2.x', 'number': '2.0', 'current': True, 'title': '2.x Book'},
    {'name': '1.3', 'number': '1.3', 'title': '1.3 Book'},
    {'name': '1.2', 'number': '1.2', 'title': '1.2 Book'},
    {'name': '1.1', 'number': '1.1', 'title': '1.1 Book'},
]

languages =  ['en', 'pt', 'es', 'ja', 'fr', 'zh']


# The name of the Pygments (syntax highlighting) style to use.
pygments_style = 'sphinx'

# A list of ignored prefixes for module index sorting.
#modindex_common_prefix = []

highlight_language = 'phpinline'


# -- Options for HTML output ---------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = 'cakephp'



# Custom sidebar templates, maps document names to template names.
html_sidebars = {
 '**' : ['globaltoc.html', 'localtoc.html']
}


# Output file base name for HTML help builder.
htmlhelp_basename = 'CakePHPCookbookdoc'


# -- Options for LaTeX output --------------------------------------------------

# The paper size ('letter' or 'a4').
#latex_paper_size = 'letter'

# The font size ('10pt', '11pt' or '12pt').
latex_font_size = '11pt'

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title, author, documentclass [howto/manual]).
latex_documents = [
  ('pdf-contents', 'CakePHPCookbook.tex', u'CakePHP Cookbook Documentation',
   u'Cake Software Foundation', 'manual'),
]


# -- Options for manual page output --------------------------------------------

# One entry per manual page. List of tuples
# (source start file, name, description, authors, manual section).
man_pages = [
    ('index', 'cakephpcookbook', u'CakePHP Cookbook Documentation',
     [u'CakePHP'], 1)
]


# -- Options for Epub output ---------------------------------------------------

# Bibliographic Dublin Core info.
epub_title = u'CakePHP Cookbook'
epub_author = u'Cake Software Foundation, Inc.'
epub_publisher = u'Cake Software Foundation, Inc.'
epub_copyright = u'2016, Cake Software Foundation, Inc.'

epub_theme = 'cakephp-epub'

# The cover page information.
epub_cover = ('_static/epub-logo.png', 'epub-cover.html')

# The language of the text. It defaults to the language option
# or en if the language is not set.
#epub_language = ''

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

rst_epilog = """
.. |minphpversion| replace:: 5.3.0
"""
