Testing
#######

O CakePHP vem com suporte interno para testes e integração para o `PHPUnit
<http://phpunit.de>`_. Em adição aos recursos oferecidos pelo PHPUnit, o CakePHP
oferece alguns recursos adicionais para fazer testes mais facilmente. Esta seção
abordará a instalação do PHPUnit, começando com testes unitários e como você
pode usar as extensões que o CakePHP oferece.

Instalando o PHPUnit
====================

O CakePHP usa o PHPUnit como framework de teste básico. O PHPUnit é um padrão
para testes unitários em PHP. Ele oferece um profundo e poderoso conjunto de
recursos para você ter certeza que o seu código faz o que você acha que ele faz.
O PHPUnit pode ser instalado usando o `PHAR package
<http://phpunit.de/#download>`__ ou `Composer <http://getcomposer.org>`_.

Instalando o PHPUnit com Composer
---------------------------------

Para instalar o PHPUnit com Composer::

    $ php composer.phar require --dev phpunit/phpunit

Isto adicionará a dependência para a seção ``require-dev`` do seu
``composer.json``, e depois instalará o PHPUnit com qualquer outra dependência.

Agora você executa o PHPUnit usando::

    $ vendor/bin/phpunit

Usando o arquivo PHAR
---------------------

Depois de ter baixado o arquivo **phpunit.phar** , você pode usar ele para
executar seus testes::

    php phpunit.phar

.. tip::

    Como conveniência você pode deixar phpunit.phar disponivel globalmente em sistemas
    Unix ou Linux com os comandos::

        chmod +x phpunit.phar
        sudo mv phpunit.phar /usr/local/bin/phpunit
        phpunit --version

    Por favor, consulte a documentação do PHPUnit para instruções sobre `como
    instalar globalmente o PHPUnit PHAR em sistemas Windows
    <http://phpunit.de/manual/current/en/installation.html#installation.phar.windows>`__.

Configuração do banco de dados test
=======================================

Lembre-se de ter o debug abilitado em seu arquivo **config/app.php** antes de
executar qualquer teste.  Antes de executar quaisquer testes você deve adicionar
um datasourse ``test`` para o arquivo **config/app.php**. Esta configuração é
usada pelo CakePHP para fixar tabelas e dados::

    'Datasources' => [
        'test' => [
            'datasource' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'dbhost',
            'username' => 'dblogin',
            'password' => 'dbpassword',
            'database' => 'test_database'
        ],
    ],

.. _running-tests:

Running Tests
=============

.. _test-fixtures:

Fixtures
========

.. _integration-testing:

Controller Integration Testing
===============================

.. _testing-authentication:

Testing Actions That Require Authentication
-------------------------------------------

.. _testing-events:

Testing Events
==============

.. note::

    É uma boa ideia usar bancos de dados diferentes para o banco de testes
    e para o banco de desenvolvimento. Isto evitara erros mais tarde.
