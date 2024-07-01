Tutorial - Gerenciador de Conteúdo
##################################

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

.. code-block:: console

    php -v

Sua versão do PHP precisa ser no mínimo |minphpversion| (CLI) ou superior.
A versão PHP do seu servidor web ta'bme precisa ser no mínimo |minphpversion|
ou superior, e deve ser a mesma versão encontrada no terminal de comando (CLI).

Instalando CakePHP
==================

A maneira mais fácil de instalar o CakePHP é usando Composer, um gerenciador
de dependências para o PHP. Se trata de uma forma simples de instalar o
CakePHP a partir de seu terminal ou prompt de comando. Primeiro, você
precisa baixar e instalar o Composer, caso você já não o tenha. Se possuir
instalado o programa *cURL*, basta executar o seguinte comando::

.. code-block:: console

    curl -s https://getcomposer.org/installer | php

Você também pode baixar o arquivo ``composer.phar`` do
`site <https://getcomposer.org/download/>`_ oficial do Composer.

Em seguida, basta digitar a seguinte linha de comando no seu terminal a partir
do diretório onde se localiza o arquivo ``composer.phar`` para instalar o
esqueleto da aplicação do CakePHP no diretório **cms**. ::

.. code-block:: console

    php composer.phar create-project --prefer-dist cakephp/app:5.* cms

Caso você tenha feito o download e executado o `Instalador para Windows do
Composer <https://getcomposer.org/Composer-Setup.exe>`_, então digite a linha
abaixo no seu terminal de dentro do diretório de instalação (ex.
C:\\wamp\\www\\dev):

.. code-block:: console

    composer self-update && composer create-project --prefer-dist cakephp/app:4.* cms

A vantagem de usar o Composer é que ele irá completar automaticamente um conjunto
importante de tarefas, como configurar corretamente as permissões de pastas
e criar o **config/app.php** para você.

Há outras maneiras de instalar o CakePHP. Se você não puder ou não quiser usar o
Composer, confira a seção :doc:`/installation`.

Independentemente de como você baixou o CakePHP, uma vez que sua instalação
for concluída, a estrutura dos diretórios deve ficar parecida com o seguinte::

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

Agora pode ser um bom momento para aprender sobre como a estrutura de diretórios
do CakePHP funciona: Confira a seção :doc:`/intro/cakephp-folder-structure`.

Caso tenha dificuldades durante este tutorial, você pode ver o resultado final no
`GitHub <https://github.com/cakephp/cms-tutorial>`_.

Verificando sua Instalação
==========================

Podemos verificar rapidamente se nossa instalação está correta acessando a página
inicial padrão. Mas antes de poder acessar, você precisa iniciar um servidor de
desenvolvimento:

.. code-block:: console

    cd /path/to/our/app

    bin/cake server

.. note::

    No Windows, o comando precisa ser ``bin\cake server`` (repare as barras invertidas).

Isso iniciará o servidor web embutido do PHP na porta 8765. Abra
**http://localhost:8765** no seu navegador web para ver a página de boas vindas. Todos os
tópicos devem ter chapéus de chef verdes, exceto diz sobre o CakePHP estar apto a acessar
seu banco de dados. Caso contrário, voc%e pode precisar instalar alguma extensão PHP ou
definir permissão de diretórios.

A seguir, nós iremos construir o :doc:`Banco de Dados e criar nosso primeiro modelo </tutorials-and-examples/cms/database>`.
