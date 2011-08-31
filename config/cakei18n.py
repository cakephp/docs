from sphinx.util.osutil import SEP, os_path, relative_uri
import pprint
"""
CakePHP i18n extension.

A simple sphinx extension for adding
i18n links to other sub doc projects.
"""

def setup(app):
    app.connect('html-page-context', append_template_ctx)
    app.add_config_value('languages', [], '')
    return app

def append_template_ctx(app, pagename, templatename, ctx, event_arg):
    def langlink(lang, path):
        """
        Generates links to other language docs.
        """
        dots = []
        for p in path.split(SEP):
            dots.append('..')
        return SEP.join(dots) + SEP + lang + SEP + path + app.builder.link_suffix

    ctx['langlink'] = langlink
    # pprint.pprint(app.config.__dict__)
    ctx['languages'] = app.config.languages
    ctx['language'] = app.config.language
