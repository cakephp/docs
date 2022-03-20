# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar. 
# https://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python
ES_HOST =
ES_HOST_V2 =

.PHONY: all clean html latexpdf epub htmlhelp website website-dirs

# Languages that can be built.
LANGS = en es fr ja pt de

# pdflatex does not like ja or ru for some reason.
PDF_LANGS = en es fr pt de

DEST = website

# Dependencies to perform before running other builds.
# Clone the en/Makefile everywhere.
SPHINX_DEPENDENCIES = $(foreach lang, $(LANGS), $(lang)/Makefile)

# Get path to theme to build static assets
THEME_DIR = $(shell python3 -c 'import os, cakephpsphinx; print(os.path.abspath(os.path.dirname(cakephpsphinx.__file__)))')

# Copy-paste the english Makefile everwhere its needed.
%/Makefile: en/Makefile
	cp $< $@

#
# The various formats the documentation can be created in.
# 
# Loop over the possible languages and call other build targets.
#
html: $(foreach lang, $(LANGS), html-$(lang))
htmlhelp: $(foreach lang, $(LANGS), htmlhelp-$(lang))
epub: $(foreach lang, $(LANGS), epub-$(lang))
latex: $(foreach lang, $(PDF_LANGS), latex-$(lang))
pdf: $(foreach lang, $(PDF_LANGS), pdf-$(lang))
htmlhelp: $(foreach lang, $(LANGS), htmlhelp-$(lang))
populate-index: $(foreach lang, $(LANGS), populate-index-$(lang))


# Make the HTML version of the documentation with correctly nested language folders.
html-%: $(SPHINX_DEPENDENCIES)
	cd $* && make html LANG=$*
	make build/html/$*/_static/css/dist.css
	make build/html/$*/_static/js/dist.js

htmlhelp-%: $(SPHINX_DEPENDENCIES)
	cd $* && make htmlhelp LANG=$*

epub-%: $(SPHINX_DEPENDENCIES)
	cd $* && make epub LANG=$*

latex-%: $(SPHINX_DEPENDENCIES)
	cd $* && make latex LANG=$*

pdf-%: $(SPHINX_DEPENDENCIES)
	cd $* && make latexpdf LANG=$*

populate-index-%:
	php scripts/populate_search_index.php --lang="$*" --host="$(ES_HOST_V2)"

populate-index-%: $(SPHINX_DEPENDENCIES)
	php scripts/populate_search_index.php $* $(ES_HOST)

website-dirs:
	# Make the directory if its not there already.
	[ ! -d $(DEST) ] && mkdir $(DEST) || true

	# Make the downloads directory
	[ ! -d $(DEST)/_downloads ] && mkdir $(DEST)/_downloads || true

	# Make downloads for each language
	$(foreach lang, $(LANGS), [ ! -d $(DEST)/_downloads/$(lang) ] && mkdir $(DEST)/_downloads/$(lang) || true;)

website: website-dirs html
	# Move HTML
	$(foreach lang, $(LANGS), cp -r build/html/$(lang) $(DEST)/$(lang);)
	
	# Move EPUB files
	$(foreach lang, $(LANGS), cp -r build/epub/$(lang)/*.epub $(DEST)/_downloads/$(lang) || true;)

	# Move PDF files
	$(foreach lang, $(PDF_LANGS), [ -f build/latex/$(lang)/*.pdf ] && cp -r build/latex/$(lang)/*.pdf $(DEST)/_downloads/$(lang) || true;)

	# Move redirects file
	cp scripts/redirects.php $(DEST)/redirects.php

clean:
	rm -rf build/*

clean-website:
	rm -rf $(DEST)/*

build/html/%/_static:
	mkdir -p build/html/$*/_static

CSS_FILES = $(THEME_DIR)/themes/cakephp/static/css/fonts.css \
  $(THEME_DIR)/themes/cakephp/static/css/bootstrap.min.css \
  $(THEME_DIR)/themes/cakephp/static/css/font-awesome.min.css \
  $(THEME_DIR)/themes/cakephp/static/css/style.css \
  $(THEME_DIR)/themes/cakephp/static/css/default.css \
  $(THEME_DIR)/themes/cakephp/static/css/pygments.css \
  $(THEME_DIR)/themes/cakephp/static/css/responsive.css

build/html/%/_static/css/dist.css: build/html/%/_static/css $(CSS_FILES)
	# build css dependencies for distribution into '$@'
	cat $(CSS_FILES) > $@

JS_FILES = $(THEME_DIR)/themes/cakephp/static/js/vendor.js \
  $(THEME_DIR)/themes/cakephp/static/js/app.js \
  $(THEME_DIR)/themes/cakephp/static/js/messages.js \
  $(THEME_DIR)/themes/cakephp/static/js/common.js \
  $(THEME_DIR)/themes/cakephp/static/js/responsive-menus.js \
  $(THEME_DIR)/themes/cakephp/static/js/mega-menu.js \
  $(THEME_DIR)/themes/cakephp/static/js/header.js \
  $(THEME_DIR)/themes/cakephp/static/js/search.js \
  $(THEME_DIR)/themes/cakephp/static/js/search.messages.$*.js \
  $(THEME_DIR)/themes/cakephp/static/js/inline-search.js \
  $(THEME_DIR)/themes/cakephp/static/js/standalone-search.js

build/html/%/_static/js/dist.js: build/html/%/_static $(JS_FILES)
	# build js dependencies for distribution into '$@'
	cat $(JS_FILES) > $@
