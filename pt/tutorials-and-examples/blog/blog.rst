Tutorial - Criando um Blog - Parte 1
####################################

Este tutorial irá orientá-lo através da criação de um simples blog.
Faremos a instalação do CakePHP, criaremos um banco de dados e implementaremos a
lógica capaz de listar, adicionar, editar e apagar postagens do blog.

Aqui está o que você vai precisar:

#. Um servidor web em funcionamento. Nós iremos assumir que você esteja usando
   o Apache, embora as instruções para outros servidores sejam bem similares.
   Talvez seja preciso alterar um pouco a configuração do servidor, mas a
   maioria das pessoas pode ter o CakePHP instalado e funcionando sem qualquer
   trabalho extra. Certifique-se de que você tem o PHP |minphpversion| ou superior,
   e que as extensões *mbstring* e *intl* estejam habilitadas no PHP.
   Caso não saiba a versão do PHP que está instalada, utilize a função
   ``phpinfo()`` ou digite ``php -v`` no seu terminal de comando.

#. Um servidor de banco de dados. Nós vamos usar o servidor *MySQL* neste
   tutorial. Você precisa saber o mínimo sobre SQL para então criar um banco de
   dados, depois disso o CakePHP vai assumir as rédeas. Já que usaremos
   o *MySQL*, também certifique-se que a extensão ``pdo_mysql`` está
   habilitada no PHP.

#. Conhecimento básico sobre PHP.

Vamos começar!

Instalação do CakePHP
=====================

A maneira mais fácil de instalar o CakePHP é usando Composer, um gerenciador
de dependências para o PHP. Se trata de uma forma simples de instalar o
CakePHP a partir de seu terminal ou prompt de comando. Primeiro, você
precisa baixar e instalar o Composer. Se possuir instalada a extensão *cURL*
do PHP, execute o seguinte comando::

    curl -s https://getcomposer.org/installer | php

Você também pode baixar o arquivo ``composer.phar`` do
`site <https://getcomposer.org/download/>`_ oficial do Composer.

Em seguida, basta digitar a seguinte linha de comando no seu terminal a partir
do diretório onde se localiza o arquivo ``composer.phar`` para instalar o
esqueleto da aplicação do CakePHP no diretório [nome_do_app]. ::

    php composer.phar create-project --prefer-dist cakephp/app [nome_do_app]

A vantagem de usar o Composer é que ele irá completar automaticamente um conjunto
importante de tarefas, como configurar corretamente as permissões de pastas
e criar o **config/app.php** para você.

Há outras maneiras de instalar o CakePHP. Se você não puder ou não quiser usar
o Composer, confira a seção :doc:`/installation`.

Independentemente de como você baixou o CakePHP, uma vez que sua instalação
for concluída, a estrutura dos diretórios deve ficar parecida com o seguinte::

    /nome_do_app
        /bin
        /config
        /logs
        /plugins
        /src
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

Permissões dos diretórios tmp e logs
====================================

Os diretórios **tmp** e **logs** precisam ter permissões adequadas para que
possam ser alterados pelo seu servidor web. Se você usou o Composer na
instalação, ele deve ter feito isso por você e confirmado com uma mensagem
"Permissions set on <folder>". Se você ao invés disso, recebeu uma mensagem de
erro ou se quiser fazê-lo manualmente, a melhor forma seria descobrir por qual
usuário o seu servidor web é executado (``<?= 'whoami'; ?>``) e alterar o
proprietário desses dois diretórios para este usuário.
Os comandos finais a serem executados (em \*nix) podem ser algo como::

    chown -R www-data tmp
    chown -R www-data logs

Se por alguma razão o CakePHP não puder escrever nesses diretórios, você será
informado por uma advertência enquanto não estiver em modo de produção.

Embora não seja recomendado, se você é incapaz de redefinir as permissões
do seu servidor web, você pode simplesmente alterar as permissões de gravação
diretamente nos diretórios, executando os seguintes comandos::

    chmod 777 -R tmp
    chmod 777 -R logs

Criando o banco de dados do Blog
================================

Em seguida, vamos configurar o banco de dados para o nosso blog. Se você
ainda não tiver feito isto, crie um banco de dados vazio para usar
neste tutorial, com um nome de sua escolha, por exemplo, ``cake_blog``.
Agora, vamos criar uma tabela para armazenar nossos artigos::

    /* Primeiro, criamos a tabela articles: */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Nós vamos também inserir alguns artigos para usarmos em nossos testes.
Execute os seguintes comandos SQL em seu banco de dados::

    /* Então inserimos articles para testes: */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

Os nomes de tabelas e colunas que usamos não foram arbitrárias. Usando
:doc:`convenções de nomenclatura </intro/conventions>` do CakePHP, podemos
alavancar o desenvolvimento e acelerar a configuração do framework. O CakePHP
é flexível o suficiente para acomodar até mesmo esquemas de banco de dados
legados inconsistentes, mas aderir às convenções vai lhe poupar tempo.

Configurando o banco de dados do Blog
=====================================

Em seguida, vamos dizer ao CakePHP onde nosso banco de dados está e como se
conectar a ele. Para muitos, esta será a primeira e última vez que será
necessário configurar algo.

A configuração é bem simples e objetiva: basta alterar os valores no array
``Datasources.default`` localizado no arquivo **config/app.php**, pelos valores
que se aplicam à sua configuração. Um exemplo completo de configurações deve
se parecer como o seguinte::

    return [
        // Mais configurações acima.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // Mais configurações abaixo.
    ];

Depois de salvar o arquivo **config/app.php**, você deve notar a
mensagem *CakePHP is able to connect to the database* ao acessar o Blog pelo
seu navegador.

.. note::
    Uma cópia do arquivo de configuração padrão do CakePHP pode ser encontrada
    em **config/app.default.php**.

Configurações opcionais
=======================

Há alguns outros itens que podem ser configurados. Muitos desenvolvedores
completam esta lista de itens, mas os mesmos não são obrigatórios para este
tutorial. Um deles é definir uma sequência personalizada (ou "salt") para uso em
hashes de segurança.

A sequência personalizada (ou salt) é utilizada para gerar hashes de segurança.
Se você utilizou o Composer, ele cuidou disso para você durante a instalação.
Apesar disso, você precisa alterar a sequência personalizada padrão editando
o arquivo **config/app.php**. Não importa qual será o novo valor, somente deverá ser
algo difícil de descobrir::

    'Security' => [
        'salt' => 'algum valor longo contendo uma mistura aleatória de valores.',
    ],

Observação sobre o mod_rewrite
==============================

Ocasionalmente, novos usuários irão se atrapalhar com problemas de mod_rewrite.
Por exemplo, se a página de boas vindas do CakePHP parecer estranha (sem
imagens ou estilos CSS). Isto provavelmente significa que o mod_rewrite não está
funcionando em seu servidor. Por favor, verifique a seção
:ref:`url-rewriting` para obter ajuda e resolver qualquer problema relacionado.

Agora continue o tutorial em :doc:`/tutorials-and-examples/blog/part-two` e
inicie a construção do seu Blog com o CakePHP.

.. meta::
    :title lang=pt: Tutorial - Criando um Blog
    :keywords lang=pt: tutorial, guide, blog
