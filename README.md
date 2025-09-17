CakePHP Documentation
=====================

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgreen.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Build Status](https://github.com/cakephp/docs/actions/workflows/ci.yml/badge.svg?branch=4.x)](https://github.com/cakephp/docs/actions/workflows/ci.yml)

This is the official documentation for the CakePHP project. It is available
online at https://book.cakephp.org.

Contributing to the documentation is pretty simple. Please read the
documentation on contributing to the documentation over on [the
cookbook](https://book.cakephp.org/5/en/contributing/documentation.html) for
help. You can read all the documentation within as it is just in plain text
files, marked up with Markdown formatting.

There are two ways for building the documentation: with Docker, or by installing
the packages directly on your OS.

Build the Documentation with Docker
-----------------------------------

Docker will let you create a container with all packages needed to build the
docs. You need to have docker installed, see the [official docs of
docker](https://docs.docker.com/desktop/) for more information.

### Build the image locally ###

Starting in the top-level directory, you can build the provided `Dockerfile_Vitepress`
and tag it with the name `cakephp/docs` by running:

```bash
docker build -f Dockerfile_Vitepress -t cakephp/docs .
```

This can take a little while, because all packages needs to be downloaded, but
you'll only need to do this once.

Now that the image is built, you can run the commands to build the docs:

##### To build the static site: #####
```bash
docker build --progress=plain --no-cache -f Dockerfile_Vitepress -t cake-vitepress .
```

##### To run the development server: #####
```bash
docker run -d -p 8080:80 --name new-cakedocs cake-vitepress
```

The built documentation will output to the `.vitepress/dist` directory.

Build the Documentation Manually
--------------------------------

### Installing the needed Packages ###

To build the documentation you'll need to install Node.js and the project dependencies:

```bash
npm install
```

### Building the Documentation ###

After installing the required packages, you can build the documentation using npm scripts.

##### To run the development server: #####
```bash
npm run docs:dev
```

This will start a local development server at `http://localhost:5173` with hot reloading.

##### To build the static site: #####
```bash
npm run docs:build
```

This will generate the static HTML files in the `.vitepress/dist` directory.

##### To preview the built site: #####
```bash
npm run docs:preview
```

This will serve the built files locally for testing before deployment.

After making changes to the documentation, the development server will automatically
rebuild and refresh the pages. For production builds, run `npm run docs:build` again.

Contributing
------------

You are welcome to make suggestions for new content as commits in a
GitHub fork. Please make any totally new sections in a separate branch. This
makes changes far easier to integrate later on.

The documentation is written in Markdown and uses VitePress for static site generation.
All documentation files are located in the `docs/` directory, organized by version.

Translations
------------

Contributing translations requires that you make a new directory using the two
letter name for your language. As content is translated, directories mirroring
the English content should be created with localized content. For more info,
please,
[click here](https://book.cakephp.org/3/en/contributing/documentation.html#new-translation-language).

Search Functionality
------------------

The documentation includes built-in search functionality powered by VitePress's local search feature.
Search works automatically in both development and production builds without requiring any additional setup.

Test
