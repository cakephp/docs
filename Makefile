# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar.
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python
ES_HOST =

.PHONY: all clean html latexpdf epub htmlhelp website website-dirs

# Languages that can be built.
LANGS = en es fr ja pt zh

# pdflatex does not like ja for some reason.
PDF_LANGS = en es fr pt

DEST = website

# Dependencies to perform before running other builds.
# Clone the en/Makefile everywhere.
SPHINX_DEPENDENCIES = $(foreach lang, $(LANGS), $(lang)/Makefile)

# Copy-paste the English Makefile everywhere it's needed (if non existing).
%/Makefile: en/Makefile
	cp -n $< $@

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
	make build/html/$*/_static/css/app.css
	make build/html/$*/_static/app.js

htmlhelp-%: $(SPHINX_DEPENDENCIES)
	cd $* && make htmlhelp LANG=$*

epub-%: $(SPHINX_DEPENDENCIES)
	cd $* && make epub LANG=$*

latex-%: $(SPHINX_DEPENDENCIES)
	cd $* && make latex LANG=$*

pdf-%: $(SPHINX_DEPENDENCIES)
	cd $* && make latexpdf LANG=$*

populate-index-%: $(SPHINX_DEPENDENCIES)
	php scripts/populate_search_index.php $* $(ES_HOST)

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

CSS_FILES = themes/cakephp/static/css/fonts.css \
  themes/cakephp/static/css/bootstrap.min.css \
  themes/cakephp/static/css/font-awesome.min.css \
  themes/cakephp/static/css/style.css \
  themes/cakephp/static/css/default.css \
  themes/cakephp/static/css/default.css \
  themes/cakephp/static/css/pygments.css \
  themes/cakephp/static/css/responsive.css

build/html/%/_static/css/app.css: build/html/%/_static $(CSS_FILES)
	# echo all dependencies ($$^) into the output ($$@)
	cat $(CSS_FILES) > $@

JS_FILES = themes/cakephp/static/jquery.js \
  themes/cakephp/static/vendor.js \
  themes/cakephp/static/app.js \
  themes/cakephp/static/search.js \
  themes/cakephp/static/typeahead.js

build/html/%/_static/app.js: build/html/%/_static $(JS_FILES)
	# echo all dependencies ($JS_FILES) into the output ($$@)
	cat $(JS_FILES) > $@
