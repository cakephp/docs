import os
from sphinx.util.osutil import SEP
"""
CakePHP Git branch extension.

A simple sphinx extension for defining
the GitHub branch name of the docs' version.
Change the default value to reflect this
version of the docs' branch name on GitHub.
"""

def setup(app):
    app.connect('html-page-context', append_template_ctx)
    app.add_config_value('branch', 'master', True)
    return app

def append_template_ctx(app, pagename, templatename, ctx, event_arg):
    ctx['branch'] = app.config.branch
