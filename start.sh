#!/bin/sh

# clone and initialize docs_search
git clone --depth=50 --branch=master https://github.com/cakephp/docs_search.git docs_search
cd docs_search
composer install --prefer-dist --no-interaction
cd ..

# define machine host and replace it in app.js
MACHINE_HOST=$(docker-machine ip $(docker-machine active))
if [ "$(uname)" == "Darwin" ]
then
    sed -i '' -- 's/search.cakephp.org/'$MACHINE_HOST':8080/' themes/cakephp/static/app.js
    sed -i '' -- 's/*.cakephp.org/http:\/\/'$MACHINE_HOST'/' docs_search/config/app.php
    sed -i '' -- 's/127.0.0.1/'$MACHINE_HOST'/' docs_search/config/app.php
    sed -i '' -- "s#var base = location.href.replace(location.protocol + '//' + location.host, '').split('/').slice(0, 2).join('/') + '/';#var base = 'http://"$MACHINE_HOST"/'#" themes/cakephp/static/app.js
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]
then
    sed -i 's/search.cakephp.org/'$MACHINE_HOST':8080/' themes/cakephp/static/app.js
    sed -i 's/*.cakephp.org/http:\/\/'$MACHINE_HOST'/' docs_search/config/app.php
    docs_search/config/app.php
    sed -i 's/127.0.0.1/'$MACHINE_HOST'/' docs_search/config/app.php
    sed -i "s#var base = location.href.replace(location.protocol + '//' + location.host, '').split('/').slice(0, 2).join('/') + '/';#var base = 'http://"$MACHINE_HOST"/'#" themes/cakephp/static/app.js
fi

# Build the docs once before running the containers
docker run -it --rm -v $(pwd):/data cakephpfr/docs:light make html

# Run all containers
docker-compose up -d
sleep 10

# Populate search index in elasticsearch
docker-compose run --rm php /bin/sh -c 'cd /data;make rebuild-index ES_HOST=http://'$MACHINE_HOST':9200'
