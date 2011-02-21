# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar. 
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python

.PHONY: all clean html latexpdf epub htmlhelp

# Dependencies to perform before running other builds.
SPHINX_DEPENDENCIES = \
	es/Makefile

%/Makefile : en/Makefile
	$(PYTHON) -c "import shutil; shutil.copyfile('$<', '$@')"

html: $(SPHINX_DEPENDENCIES)
	cd en && make html
	cd es && make html

website: html
	mkdir -p build/html/{en,es}
	cp -R en/_build/html/* build/html/en
	cp -R es/_build/html/* build/html/es

clean:
	rm -rf build/*
