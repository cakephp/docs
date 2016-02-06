## Docker-compose : Build and serve the Documentation

Docker-Compose will create and link multi-containers with all packages needed (including elasticsearch). You need to have [Docker](http://docs.docker.com/mac/started/) and [Docker-compose](https://docs.docker.com/compose/install/) installed.

### A shell to build and serve the docs

A `start.sh` script will install all the tools you need to build and serve the docs:

    git clone git@github.com:cakephp/docs.git
    cd docs
    git checkout --track origin/3.0
    // Just run the `start.sh` script
    ./start.sh

This can take a little while the first time you run a command because all
packages need to be downloaded via images created on
[DockerHub](https://hub.docker.com/r/cakephpfr/docs/).

You can now access to the docs server on http://MACHINE_HOST (`$(docker-machine ip $(docker-machine active))` to get it)

The script will do the following:
- The docs_search repo will be cloned at the root and be installed (composer)
- The host url for search `http://192.168.99.100:8080/search` will be replaced in `themes/cakephp/static/app.js` with the host given by the command `$(docker-machine ip $(docker-machine active))`
- The docs will be built in `/build` folder
- `docker-compose up -d` will be run, creating the 5 following containers:
    - 2 containers with nginx webserver and a php server : it's a Cakephp 3 app which get the docs search results dynamically from the elasticsearch server
    - 1 container with an nginx server : it is a http server with the static version of the docs
    - 1 container with all tools useful to build the docs : python and sphinx
    - 1 elasticsearch server : contains index for the docs search

To see which containers are up and their host and port names, run:

    docker-compose ps

### Rebuild the docs with Docker-compose

If you need to rebuild the docs after changes you've done, run the following:

    # To build the html
    cd /path/to/your/local/docs
    docker-compose run --rm docs make html

    # To build the epub
    cd /path/to/your/local/docs
    docker-compose run --rm docs make epub

    # To build the latex
    cd /path/to/your/local/docs
    docker-compose run --rm docs make latex

    # To build the pdf
    cd /path/to/your/local/docs
    docker-compose run --rm docs make pdf

### Repopulate the elasticsearch search index

If you need to repopulate the search index, you can use:

    docker-compose run --rm php /bin/sh -c 'cd /data;make rebuild-index ES_HOST=http://'$(docker-machine ip $(docker-machine active))':9200'
