import os
from sphinx.util.osutil import SEP
"""
CakePHP Git branch extension.

A simple sphinx extension for adding
the GitHub branch name of the docs' version.
"""

def setup(app):
    app.connect('html-page-context', append_template_ctx)
    app.add_config_value('branch', '', True)

def append_template_ctx(app, pagename, templatename, ctx, event_arg):
    ctx['branch'] = app.config.branch
