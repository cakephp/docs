CakePHP Documentation
=====================

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgreen.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Build Status](https://github.com/cakephp/docs/actions/workflows/ci.yml/badge.svg?branch=5.x)](https://github.com/cakephp/docs/actions/workflows/ci.yml)

This is the official documentation for the CakePHP project. It is available
online at https://book.cakephp.org.

Contributing to the documentation is pretty simple. Please read the
documentation on contributing to the documentation over on [the
cookbook](https://book.cakephp.org/5/en/contributing/documentation.html) for
help. You can read all the documentation within as it is just in plain text
files, marked up with Markdown formatting.

## Local Development

For working with the documentation markdown files locally, use the provided development server script:

```bash
./bin/dev-server.sh
```

This script will:
- Set up a clean `.temp` working directory
- Clone the VitePress skeleton repository
- Sync your documentation files
- Install dependencies
- Start a local development server with hot-reload

The documentation will be available at `http://localhost:5173`

### Development Server Options

```bash
# Start on a custom port
./bin/dev-server.sh --port 3000

# Adjust docs sync interval (default: 1 second)
./bin/dev-server.sh --sync-interval 2
```

### Prerequisites

The development server requires:
- `git` - Version control
- `node` - JavaScript runtime
- `npm` - Package manager
- `rsync` - File synchronization

Press `Ctrl+C` to stop the development server.

## Build the Documentation with Docker

Docker will let you create a container with all packages needed to build the
docs. You need to have docker installed, see the [official docs of
docker](https://docs.docker.com/desktop/) for more information.

### Build the image locally

Starting in the top-level directory, you can build the provided `Dockerfile`
and tag it with the name `cakephp/docs` by running:

```bash
docker build -f Dockerfile -t cakephp/docs .
```

This can take a little while, because all packages needs to be downloaded, but
you'll only need to do this once.

Now that the image is built, you can run the commands to build the docs:

##### To build the static site:
```bash
docker build --progress=plain --no-cache -f Dockerfile -t cake-docs .
```

##### To run the development server:
```bash
docker run -d -p 8080:80 --name cakedocs cake-vitepress
```

The built documentation will output to the `.vitepress/dist` directory.

## Contributing

You are welcome to make suggestions for new content as commits in a
GitHub fork. Please make any totally new sections in a separate branch. This
makes changes far easier to integrate later on.

The documentation is written in Markdown and uses VitePress for static site generation.
All documentation files are located in the `docs/` directory, organized by version.

## Search Functionality

The documentation includes built-in search functionality powered by VitePress's local search feature.
Search works automatically in both development and production builds without requiring any additional setup.
