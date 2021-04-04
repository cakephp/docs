Tutorial - Gerenciador de Conteúdo
###########################

Neste tutorial
Este tutorial irá orientá-lo através da criação de uma simples aplicação do
tipo :abbr:`CMS (Sistema Gerenciador de Conteúdo)`. Para começar, nós iremos
instalar o CakePHP, criar nosso banco de dados e construir um gerenciador de
artigos.

Você vai precisar:

#. Um servidor de banco de dados. Nós utilizaremos um servidor MySQL neste tutorial.
   Você precisará saber o suficiente de SQL para criar o banco de dados e executar
   trechos de SQL deste tutorial. O CakePHP cuidará de criar todas as queries que sua
   aplicação precisará. Considerando que estamos usando MySQL, confirme que você possui
   a extensão ``pdo_mysql`` habilitada no PHP.

#. Conhecimento básico de PHP.

Antes de começar, verifique se você está usando uma versão atualizada do PHP:

.. code-block:: bash

    php -v

Sua versão do PHP precisa ser no mínimo |minphpversion| (CLI) ou superior.
A versão PHP do seu servidor web ta'bme precisa ser no mínimo |minphpversion|
ou superior, e deve ser a mesma versão encontrada na linha de comando (CLI).

Instalando CakePHP
===============

The easiest way to install CakePHP is to use Composer. Composer is a simple way
of installing CakePHP from your terminal or command line prompt. First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following:

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

Then simply type the following line in your terminal from your
installation directory to install the CakePHP application skeleton
in the **cms** directory of the current working directory:

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app:4.* cms

If you downloaded and ran the `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_, then type the following line in
your terminal from your installation directory (ie.
C:\\wamp\\www\\dev):

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app:4.* cms

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your **config/app.php** file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /cms
      /bin
      /config
      /logs
      /plugins
      /resources
      /src
      /templates
      /tests
      /tmp
      /vendor
      /webroot
      .editorconfig
      .gitignore
      .htaccess
      .travis.yml
      composer.json
      index.php
      phpunit.xml.dist
      README.md

Now might be a good time to learn a bit about how CakePHP's directory structure
works: check out the :doc:`/intro/cakephp-folder-structure` section.

If you get lost during this tutorial, you can see the finished result `on GitHub
<https://github.com/cakephp/cms-tutorial>`_.

Verificando sua Instalação
=========================

We can quickly check that our installation is correct, by checking the default
home page. Before you can do that, you'll need to start the development server:

.. code-block:: bash

    cd /path/to/our/app

    bin/cake server

.. note::

    For Windows, the command needs to be ``bin\cake server`` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be green chef hats other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Next, we will build our :doc:`Database and create our first model </tutorials-and-examples/cms/database>`.
