# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar. 
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python

.PHONY: all clean html latexpdf epub htmlhelp

# Dependencies to perform before running other builds.
SPHINX_DEPENDENCIES = \
	es/Makefile

# Copy-paste the english Makefile everwhere its needed.
%/Makefile : en/Makefile
	$(PYTHON) -c "import shutil; shutil.copyfile('$<', '$@')"

# Make the HTML version of the documentation with correctly nested language folders.
html: $(SPHINX_DEPENDENCIES)
	cd en && make html LANG=en
	cd es && make html LANG=es

clean:
	rm -rf build/*
