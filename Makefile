# MakeFile for building all the docs at once.
# Inspired by the Makefile used by bazaar. 
# http://bazaar.launchpad.net/~bzr-pqm/bzr/2.3/

PYTHON = python

.PHONY: all clean html latexpdf epub htmlhelp

# Dependencies to perform before running other builds.
SPHINX_DEPENDENCIES = \
	es/Makefile \
	fr/Makefile \
	pt/Makefile

# Copy-paste the english Makefile everwhere its needed.
%/Makefile : en/Makefile
	$(PYTHON) -c "import shutil; shutil.copyfile('$<', '$@')"

# Make the HTML version of the documentation with correctly nested language folders.
html: $(SPHINX_DEPENDENCIES)
	cd en && make html LANG=en
	cd es && make html LANG=es
	cd fr && make html LANG=fr
	cd pt && make html LANG=pt

htmlhelp: $(SPHINX_DEPENDENCIES)
	cd en && make htmlhelp LANG=en
	cd es && make htmlhelp LANG=es
	cd fr && make htmlhelp LANG=fr
	cd pt && make htmlhelp LANG=pt

epub: $(SPHINX_DEPENDENCIES)
	cd en && make epub LANG=en
	cd es && make epub LANG=es
	cd fr && make epub LANG=fr
	cd pt && make epub LANG=pt

latexpdf: $(SPHINX_DEPENDENCIES)
	cd en && make latexpdf LANG=en
	cd es && make latexpdf LANG=es
	cd fr && make latexpdf LANG=fr
	cd pt && make latexpdf LANG=pt

clean:
	rm -rf build/*
