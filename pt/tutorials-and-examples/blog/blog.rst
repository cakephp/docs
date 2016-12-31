####
Blog
####

Bem vindo ao CakePHP. Você provavelmente está lendo este tutorial porque quer
aprender mais sobre como o CakePHP funciona. Nosso objetivo é aumentar a
produtividade e fazer a programação uma tarefa mais divertida: Esperamos que
você veja isto na prática enquanto mergulha nos códigos.

Este tutorial irá cobrir a criação de uma aplicação de blog simples. Nós iremos
baixar e instalar o Cake, criar e configurar o banco de dados e criar a lógica
da aplicação suficiente para listar, adicionar, editar e deletar posts do blog.

Aqui vai uma lista do que você vai precisar:

#. Um servidor web rodando. Nós iremos assumir que você esteja usando o Apache,
   embora as instruções para usar outros servidores sejam bem semelhantes.
   Talvez tenhamos que brincar um pouco com as configurações do servidor mas a
   maioria das pessoas serão capazes de ter o Cake rodando sem precisar
   configurar nada.
#. Um servidor de banco de dados. Nós iremos usar o MySQL Server neste tutorial.
   Você precisa saber o mínimo sobre SQL para criar um banco de dados. O Cake
   pegará as rédeas a partir deste ponto.
#. Conhecimento básico da linguagem PHP. Quanto mais orientado a objetos você
   já programou, melhor: mas não tenha medo se é fã de programação procedural.
#. E por último, você vai precisar de um conhecimento básico do padrão de
   projetos MVC. Uma rápida visão geral pode ser encontrada em
   :doc:`/cakephp-overview/understanding-model-view-controller`. 
   Não se preocupe, deve ter meia página ou menos.

Então, vamos começar!

Baixando o Cake
===============

Primeiro, vamos baixar uma cópia recente do CakePHP.

Para fazer o download de uma cópia recente, visite o projeto do CakePHP no
github: `https://github.com/cakephp/cakephp/downloads
<https://github.com/cakephp/cakephp/downloads>`_
e faça o download da última versão 2.0.

Você também pode clonar o repositório usando o `git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``.

Idependente da maneira de como você baixou o Cake, coloque o código obtido
dentro do seu diretório web público. A estrutura dos diretórios deve ficar
parecido com o seguinte::

    /caminho_para_diretorio_web_publico
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Agora pode ser um bom momento para aprender um pouco sobre como funciona a
estrutura de diretórios do CakePHP: Veja a seção
:doc:`/getting-started/cakephp-folder-structure`.

Criando o Banco de Dados do Blog
================================

Em seguida, vamos configurar o banco de dados correspondente ao nosso blog.
Se você já não tiver feito isto, crie um banco de dados vazio para usar neste
tutorial com o nome que desejar. Neste momento, vamos criar apenas uma tabela
para armazenar nossos posts. Também vamos inserir alguns posts para usar como
teste. Execute as instruções a seguir no seu banco de dados::

    -- Primeiro, criamos nossa tabela de posts
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );
    
    -- Agora inserimos alguns posts para testar
    INSERT INTO posts (title, body, created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title, body, created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title, body, created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

A escolha do nome de tabelas e colunas não são arbitrárias. Se você seguir as
convenções de nomenclatura para estruturas do banco de dados e as convenções para
nomes de classes (ambas descritas em
:doc:`/getting-started/cakephp-conventions`), você será capaz de tirar proveito
de muitas funcionalidades do CakePHP e evitar arquivos de configurações.
O Cake é flexivel o bastante para acomodar até mesmo os piores esquemas de
banco de dados legados, mas aderindo as convenções você poupa seu tempo.

Veja :doc:`/getting-started/cakephp-conventions` para mais informações.
Aqui, basta dizer que ao nomear nossa tabela de 'posts', automaticamente
ela será ligada ao nosso model Post e as colunas 'modified' e
'created' serão "automagicamente" atualizadas pelo CakePHP.

Configurações do Banco de Dados
===============================

Para o Alto e Avante: Vamos agora avisar ao Cake onde está nosso banco de dados
e como conectar a ele. Para muitos, esta é a primeira e última configuração a
ser feita.

Uma exemplo de arquivo de configuração do banco de dados pode ser encontrado em
``/app/Config/database.php.default``. Copie este arquivo no mesmo diretório
renomeando-o para ``database.php``.

O arquivo é bem simples: basta alterar os valores da variável $default com os
dados da nossa configuração. Um exemplo completo desta configuração irá se
parecer com esta::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => ''
    );

Após salvar seu novo arquivo database.php, você estará apto para abrir seu
navegador e ver a página de boas vindas do Cake. A página de boas vindas deverá
lhe mostrar uma mensagem dizendo que seu arquivo de conexão com o banco de dados
foi encontrado, e que o Cake conseguiu se conectar com o banco de dados.

Configuração Opcional
=====================

Existem outros três itens que podem ser configurados. Muitos desenvolvedores
sempre configuram estes itens, mas eles não são obrigatórios para este tutorial.
Uma das configurações é customizar uma string (ou "salt") para ser utilizada nos
hashes de segurança. O segundo é definir um número (ou "seed") para uso em
criptografia. E o terceiro é dar permissão de escrita para o CakePHP na pasta
``tmp``.

O "security salt" é utilizado para gerar hashes. Altere o valor padrão do salt
editando o arquivo ``/app/Config/core.php`` na linha 187. Não importa muito o
que o novo valor seja, basta que não seja fácil de adivinhar.

::

    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
    ?>

O "cipher seed" é usado para criptografar/descriptografar strings.
Altere o valor padrão editando o arquivo ``/app/Config/core.php`` na linha 192.
Como no "security salt", não importa muito o que o novo valor seja, basta que
não seja fácil de adivinhar.

::

    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');
    ?>

A última tarefa é garantir acesso de escrita para a pasta ``app/tmp``. A melhor
maneira para fazer isto é localizar o usuário com que o seu servidor web é
executado (``<?php echo `whoami`; ?>``) e alterar o dono da pasta ``app/tmp``
para este usuário. Você pode executar (em \*nix) o comando a seguir para alterar
o usuário dono da pasta.

::

    $ chown -R www-data app/tmp

Se por alguma razão o CakePHP não conseguir escrever nesta pasta, você será
avisado por uma mensagem enquanto estiver em modo de desenvolvimento.

Uma Palavra Sobre o mod\_rewrite
================================

Ocasionalmente, um novo usuário irá esbarrar em problemas com o mod\_rewrite,
então vou abordá-los superficialmente aqui. Se a página de boas-vindas do
CakePHP parecer um pouco sem graça (sem imagens, sem cores e sem os estilos
css), isso é um indício de que o mod\_rewrite provavelmente não esteja
funcionando em seu sistema. Aqui estão algumas dicas para lhe ajudar a deixar
tudo funcionando corretamente:

#. Certifique-se de que a sobrescrita de opções do .htaccess está habilitada:
   em seu arquivo httpd.conf, você deve ter uma parte que define uma seção para
   cada <Directory> do seu servidor. Certifique-se de que a opção
   ``AllowOverride`` esteja com o valor ``All`` para o <Directory> correto. Por
   questões de segurança e performance, *não* defina ``AllowOverride`` para
   ``All`` em ``<Directory />``. Ao invés disso, procure o bloco ``<Directory>``
   que se refere ao seu diretório raíz de seu website.

#. Certifique-se de estar editando o arquivo httpd.conf ao invés de algum
   específico, que seja válido apenas para um dado usuário ou para um dado site.

#. Por alguma razão, você pode ter obtido uma cópia do CakePHP sem os arquivos
   .htaccess. Isto algumas vezes acontece porque alguns sistemas operacionais
   tratam arquivos que começam com '.' como arquivos ocultos e normalmente não
   fazem cópias deles. Certifique-se de obter sua cópia do CakePHP diretamente
   da seção de downloads do site ou de nosso repositório git.

#. Certifique-se de que o Apache esteja carregando o mod_rewrite corretamente!
   Você deve ver algo como::

       LoadModule rewrite_module       libexec/httpd/mod_rewrite.so

   ou (para o Apache 1.3)::

       AddModule                       mod_rewrite.c
   
   em seu httpd.conf.

Se você não quiser ou não puder carregar o mod\_rewrite (ou algum outro módulo
compatível) em seu servidor, você vai precisar usar o recurso de URLs amigáveis
do CakePHP. No arquivo ``/app/Config/core.php``, descomente uma linha parecida
com::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

E remova também os arquivos .htaccess em::

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess

Com isto, suas URLs ficarão parecidas com
www.exemplo.com/index.php/nomecontroller/nomeaction/param ao invés de
www.exemplo.com/nomecontroller/nomeaction/param.

Se você está instalando o CakePHP em outro webserver diferente do Apache,
você pode encontrar instruções para ter a reescrita de URLs funcionando na
seção :doc:`/installation/advanced-installation`.

Continue lendo este tutorial em :doc:`/tutorials-and-examples/blog/part-two`
para começar a construir sua primeira aplicação CakePHP.
