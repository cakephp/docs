import os
from sphinx.util.osutil import SEP
"""
CakePHP i18n extension.

A simple sphinx extension for adding
i18n links to other sub doc projects.
"""

def setup(app):
    app.connect('html-page-context', append_template_ctx)
    app.add_config_value('languages', [], '')

def append_template_ctx(app, pagename, templatename, ctx, event_arg):
    def lang_dir(lang):
        tokens = lang.split('_')
        if len(tokens) > 1:
            folder = tokens[0]
        else:
            folder = lang
        return folder

    def lang_link(lang, path):
        """
        Generates links to other language docs.
        """
        dots = []
        for p in path.split(SEP):
            dots.append('..')
        folder = lang_dir(lang)
        return SEP.join(dots) + SEP + folder + SEP + path + app.builder.link_suffix

    def has_lang(lang, path):
        """
        Check to see if a language file exists for a given path/RST doc.:
        """
        folder = lang_dir(lang)
        possible = '..' + SEP + folder +  SEP + path + app.config.source_suffix
        full_path = os.path.realpath(os.path.join(os.getcwd(), possible))

        return os.path.isfile(full_path)

    ctx['lang_dir'] = lang_dir
    ctx['lang_link'] = lang_link
    ctx['has_lang'] = has_lang

    ctx['languages'] = app.config.languages
    ctx['language'] = app.config.language
