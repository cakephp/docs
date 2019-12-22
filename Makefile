# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar.
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python3
ES_HOST =

.PHONY: all clean html latexpdf epub htmlhelp website website-dirs rebuild-index

# Languages that can be built.
LANGS = en es fr ja pt zh tr ru

# pdflatex does not like ja, zh & tr for some reason.
PDF_LANGS = en es fr pt

DEST = website

EPUB_ARGS =

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
populate-index: $(foreach lang, $(LANGS), populate-index-$(lang))
server: $(foreach lang, $(LANGS), server-$(lang))
rebuild-index: $(foreach lang, $(LANGS), rebuild-index-$(lang))


# Make the HTML version of the documentation with correctly nested language folders.
html-%:
	cd $* && make html
	make build/html/$*/_static/css/app.css
	make build/html/$*/_static/app.js

htmlhelp-%:
	cd $* && make htmlhelp

epub-%:
	cd $* && make epub

latex-%:
	cd $* && make latex

pdf-%:
	cd $* && make latexpdf

server-%:
	cd build/html/$* && python3 -m SimpleHTTPServer

populate-index-%:
	php scripts/populate_search_index.php $* $(ES_HOST)

rebuild-index-%:
	curl -XDELETE $(ES_HOST)/documentation/4-0-$*
	php scripts/populate_search_index.php $* $(ES_HOST)

epub-check-%: build/epub/$*
	java -jar /epubcheck/epubcheck.jar build/epub/$*/CakePHP.epub $(EPUB_ARGS)

website-dirs:
	# Make the directory if its not there already.
	[ ! -d $(DEST) ] && mkdir $(DEST) || true

	# Make the downloads directory
	[ ! -d $(DEST)/_downloads ] && mkdir $(DEST)/_downloads || true

	# Make downloads for each language
	$(foreach lang, $(LANGS), [ ! -d $(DEST)/_downloads/$(lang) ] && mkdir $(DEST)/_downloads/$(lang) || true;)

website: website-dirs html populate-index epub pdf
	# Move HTML
	$(foreach lang, $(LANGS), cp -r build/html/$(lang) $(DEST)/$(lang);)

	# Move EPUB files
	$(foreach lang, $(LANGS), cp -r build/epub/$(lang)/*.epub $(DEST)/_downloads/$(lang) || true;)

	# Move PDF files
	$(foreach lang, $(PDF_LANGS), [ -f build/latex/$(lang)/*.pdf ] && cp -r build/latex/$(lang)/*.pdf $(DEST)/_downloads/$(lang) || true;)

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

build/html/%/_static/css/app.css: build/html/%/_static $(CSS_FILES)
	# echo all dependencies ($$^) into the output ($$@)
	cat $(CSS_FILES) > $@

JS_FILES = $(THEME_DIR)/themes/cakephp/static/jquery.js \
  $(THEME_DIR)/themes/cakephp/static/vendor.js \
  $(THEME_DIR)/themes/cakephp/static/app.js \
  $(THEME_DIR)/themes/cakephp/static/search.js \
  $(THEME_DIR)/themes/cakephp/static/typeahead.js

build/html/%/_static/app.js: build/html/%/_static $(JS_FILES)
	# echo all dependencies ($JS_FILES) into the output ($$@)
	cat $(JS_FILES) > $@
