2.4 Migration Guide
###################

CakePHP 2.4 is a fully API compatible upgrade from 2.3.  This page outlines
the changes and improvements made in 2.4.

I18n
====

L10n
----

- ``ell`` is now the default locale for Greek as specified by ISO 639-3 and ``gre`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/gre/` to `/Locale/ell/`).
- ``fas`` is now the default locale for Farsi as specified by ISO 639-3 and ``per`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/per/` to `/Locale/fas/`).
- ``sme`` is now the default locale for Farsi as specified by ISO 639-3 and ``smi`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/smi/` to `/Locale/sme/`).
- ``mkd`` replaces ```mk`` as default locale for Macedonian.
  The corresponding locale folders have to be adjusted, as well.
- Catalog code ``in`` has been dropped in favor of ``id`` (Indonesian),
  ``e`` has been dropped in favor of ``el`` (Greek),
  ``n`` has been dropped in favor of ``nl`` (Dutch),
  ``p`` has been dropped in favor of ``pl`` (Polish),
  ``sz`` has been dropped in favor of ``se`` (Sami).
- Kazakh has been added with ``kaz`` as locale and ``kk`` as catalog code.

