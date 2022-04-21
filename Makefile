# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar.
# https://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python3
ES_HOST =
ES_HOST_V2 =

.PHONY: all clean html latexpdf epub htmlhelp website website-dirs rebuild-index duplicate-content

# Languages that can be built.
LANGS = en es fr ja pt

# pdflatex does not like ja, zh & tr for some reason.
PDF_LANGS = en es fr pt

DEST = website

EPUB_ARGS =
SPHINXOPTS =

# Get path to theme directory to build static assets.
THEME_DIR = $(shell python3 -c 'import os, cakephpsphinx; print(os.path.abspath(os.path.dirname(cakephpsphinx.__file__)))')

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
rebuild-index: $(foreach lang, $(LANGS), rebuild-index-$(lang))

# Overlay the english docs over each translation.
# Cloning files that don't exist.
duplicate-content:
	# copy missing files from english to the translation
	$(foreach lang, $(LANGS), [ $(lang) != "en" ] && cp -r --no-clobber --update ./en/* ./$(lang)/ || true)


# Output generation targets.
#
# We deploy three forms of the docs. HTML, ePub and PDF. All three of these
# formats are bundled together by the `website` target. The `website` result is
# what we deploy and serve at book.cakephp.org
#
# Make the HTML version of the documentation with correctly nested language folders.
html-%: duplicate-content
	cd $* && make html SPHINXOPTS="$(SPHINXOPTS)"
	make build/html/$*/_static/css/dist.css
	make build/html/$*/_static/js/dist.js

htmlhelp-%:
	cd $* && make htmlhelp

epub-%: duplicate-content
	cd $* && make epub

latex-%: duplicate-content
	cd $* && make latex

pdf-%: duplicate-content
	cd $* && make latexpdf

server-%: duplicate-content
	cd build/html/$* && python3 -m SimpleHTTPServer

epub-check-%: build/epub/$*
	java -jar /epubcheck/epubcheck.jar build/epub/$*/CakePHP.epub $(EPUB_ARGS)

website-dirs:
	# Make the directory if its not there already.
	[ ! -d $(DEST) ] && mkdir $(DEST) || true

	# Make the downloads directory
	[ ! -d $(DEST)/_downloads ] && mkdir $(DEST)/_downloads || true

	# Make downloads for each language
	$(foreach lang, $(LANGS), [ ! -d $(DEST)/_downloads/$(lang) ] && mkdir $(DEST)/_downloads/$(lang) || true;)

website: website-dirs html epub pdf
	# Move HTML
	$(foreach lang, $(LANGS), cp -r build/html/$(lang) $(DEST)/$(lang);)

	# Move EPUB files
	$(foreach lang, $(LANGS), cp -r build/epub/$(lang)/*.epub $(DEST)/_downloads/$(lang) || true;)

	# Move PDF files
	$(foreach lang, $(PDF_LANGS), [ -f build/latex/$(lang)/*.pdf ] && cp -r build/latex/$(lang)/*.pdf $(DEST)/_downloads/$(lang) || true;)

#
# Cleanup Targets.
#
clean:
	rm -rf build/*

clean-website:
	rm -rf $(DEST)/*

#
# Static asset generation.
#
# To keep our dependency footprint small. We don't use CSS or JS
# preprocessors. Instead we use simple file concatenation
# to join all our sources together. This does result in
# a slightly less optimized output than a pre-processor
# would, but keeps the stack for the book very low maintenance.
build/html/%/_static:
	mkdir -p build/html/$*/_static

build/html/%/_static/css: build/html/%/_static
	mkdir -p build/html/$*/_static/css

build/html/%/_static/js: build/html/%/_static
	mkdir -p build/html/$*/_static/js

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
  $(THEME_DIR)/themes/cakephp/static/js/search.messages.*.js \
  $(THEME_DIR)/themes/cakephp/static/js/inline-search.js \
  $(THEME_DIR)/themes/cakephp/static/js/standalone-search.js

build/html/%/_static/js/dist.js: build/html/%/_static/js $(JS_FILES)
	# build js dependencies for distribution into '$@'
	cat $(JS_FILES) > $@
