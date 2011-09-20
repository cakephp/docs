# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar. 
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python

.PHONY: all clean html latexpdf epub htmlhelp

# Languages that can be built.
LANGS = en es fr pt

# Dependencies to perform before running other builds.
# Clone the en/Makefile everywhere.
SPHINX_DEPENDENCIES = $(foreach lang, $(LANGS), $(lang)/Makefile)

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
htmlhelp: $(foreach lang, $(LANGS), htmlhelp-$(lang))

# Make the HTML version of the documentation with correctly nested language folders.
html-%: $(SPHINX_DEPENDENCIES)
	cd $* && make html LANG=$*

htmlhelp-%: $(SPHINX_DEPENDENCIES)
	cd $* && make htmlhelp LANG=$*

epub-%: $(SPHINX_DEPENDENCIES)
	cd $* && make epub LANG=$*

latexpdf-%: $(SPHINX_DEPENDENCIES)
	cd $* && make latexpdf LANG=$*

clean:
	rm -rf build/*
