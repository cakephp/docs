Instalação
##########

O CakePHP possui alguns requisitos de sistema:

- Servidor HTTP. Por exemplo: Apache. É preferível ter mod\_rewrite, mas de forma alguma é obrigatório. Você também pode usar nginx ou Microsoft IIS se preferir.
- PHP mínimo |minphpversion| (|phpversion| suportado).
- extensão PHP mbstring
- extensão PHP intl
- extensão PHP SimpleXML
- extensão PHP PDO

.. note::

    No XAMPP, a extensão intl está incluída, mas você precisa descomentar
    ``extension=php_intl.dll`` (ou ``extension=intl``) no **php.ini** e reiniciar o servidor através
    do Painel de Controle do XAMPP.

    No WAMP, a extensão intl está "ativada" por padrão, mas não funciona.
    Para fazê-la funcionar você precisa ir à pasta php (por padrão)
    **C:\\wamp\\bin\\php\\php{version}**, copiar todos os arquivos que se parecem com
    **icu*.dll** e colá-los no diretório bin do apache
    **C:\\wamp\\bin\\apache\\apache{version}\\bin**. Em seguida, reinicie todos os serviços
    e deve estar tudo certo.

Embora um mecanismo de banco de dados não seja obrigatório, imaginamos que a maioria das aplicações
irá utilizar um. O CakePHP suporta uma variedade de mecanismos de armazenamento de banco de dados:

-  MySQL (5.7 ou superior)
-  MariaDB (10.1 ou superior)
-  PostgreSQL (9.6 ou superior)
-  Microsoft SQL Server (2012 ou superior)
-  SQLite 3

O banco de dados Oracle é suportado através do
`Driver for Oracle Database <https://github.com/CakeDC/cakephp-oracle-driver>`_
plugin da comunidade.

.. note::

    Todos os drivers integrados requerem PDO. Você deve certificar-se de ter as extensões
    PDO corretas instaladas.

Instalando o CakePHP
====================

Antes de começar, certifique-se de que sua versão do PHP está atualizada:

.. code-block:: console

    php -v

Você deve ter PHP |minphpversion| (CLI) ou superior.
A versão do PHP do seu servidor web também deve ser |minphpversion| ou superior, e deve ser
a mesma versão que sua interface de linha de comando (CLI) usa.

Instalando o Composer
----------------------

O CakePHP usa o `Composer <https://getcomposer.org>`_, uma ferramenta de gerenciamento de dependências,
como o método oficialmente suportado para instalação.

- Instalando o Composer no Linux e macOS

  #. Execute o script do instalador conforme descrito na
     `documentação oficial do Composer <https://getcomposer.org/download/>`_
     e siga as instruções para instalar o Composer.
  #. Execute o seguinte comando para mover o composer.phar para um diretório
     que está no seu path::

         mv composer.phar /usr/local/bin/composer

- Instalando o Composer no Windows

  Para sistemas Windows, você pode baixar o instalador do Composer para Windows
  `aqui <https://github.com/composer/windows-setup/releases/>`__. Mais
  instruções para o instalador do Composer para Windows podem ser encontradas no
  README `aqui <https://github.com/composer/windows-setup>`__.

Criar um Projeto CakePHP
-------------------------

Você pode criar uma nova aplicação CakePHP usando o comando ``create-project``
do composer:

.. code-block:: console

    composer create-project --prefer-dist cakephp/app:~5.0 my_app_name

Uma vez que o Composer termine de baixar o esqueleto da aplicação e a biblioteca
principal do CakePHP, você deverá ter uma aplicação CakePHP funcional instalada via
Composer. Certifique-se de manter os arquivos composer.json e composer.lock com o
resto do seu código-fonte.

Agora você pode visitar o caminho onde instalou sua aplicação CakePHP e
ver a página inicial padrão. Para alterar o conteúdo desta página, edite
**templates/Pages/home.php**.

Embora o composer seja o método de instalação recomendado, existem
downloads pré-instalados disponíveis no
`Github <https://github.com/cakephp/cakephp/tags>`__.
Esses downloads contêm o esqueleto da aplicação com todos os pacotes de fornecedores instalados.
Também inclui o ``composer.phar`` para que você tenha tudo o que precisa para
uso posterior.

Mantendo-se Atualizado com as Últimas Mudanças do CakePHP
----------------------------------------------------------

Por padrão, este é o aspecto do **composer.json** da sua aplicação::

    "require": {
        "cakephp/cakephp": "5.0.*"
    }

Cada vez que você executar ``php composer.phar update`` você receberá versões de correção
para esta versão menor. Você pode, em vez disso, alterar isso para ``^5.0`` para
também receber as últimas versões menores estáveis do branch ``5.x``.

Instalação usando DDEV
-----------------------

Outra maneira rápida de instalar o CakePHP é via `DDEV <https://ddev.com/>`_.
É uma ferramenta de código aberto para iniciar ambientes de desenvolvimento web locais.

Se você quiser configurar um novo projeto, você só precisa::

    mkdir my-cakephp-app
    cd my-cakephp-app
    ddev config --project-type=cakephp --docroot=webroot
    ddev composer create --prefer-dist cakephp/app:~5.0
    ddev launch

Se você tiver um projeto existente::

    git clone <your-cakephp-repo>
    cd <your-cakephp-project>
    ddev config --project-type=cakephp --docroot=webroot
    ddev composer install
    ddev launch

Por favor, consulte a `Documentação do DDEV <https://ddev.readthedocs.io/>`_ para detalhes sobre como instalar / atualizar o DDEV.

.. note::

    IMPORTANTE: Este não é um script de implantação. Destina-se a ajudar desenvolvedores
    a configurar um ambiente de desenvolvimento rapidamente. Não se destina a
    ambientes de produção.

Permissões
==========

O CakePHP usa o diretório **tmp** para várias operações diferentes.
Descrições de modelos, visualizações em cache e informações de sessão são alguns
exemplos. O diretório **logs** é usado para gravar arquivos de log pelo mecanismo
padrão ``FileLog``.

Sendo assim, certifique-se de que os diretórios **logs**, **tmp** e todos os seus subdiretórios
em sua instalação do CakePHP sejam graváveis pelo usuário do servidor web. O processo de
instalação do Composer torna **tmp** e suas subpastas graváveis globalmente para colocar as
coisas em funcionamento rapidamente, mas você pode atualizar as permissões para melhor
segurança e mantê-las graváveis apenas para o usuário do servidor web.

Um problema comum é que os diretórios **logs** e **tmp** e subdiretórios
devem ser graváveis tanto pelo servidor web quanto pelo usuário de linha de comando. Em um sistema
UNIX, se o usuário do servidor web for diferente do usuário de linha de comando, você
pode executar os seguintes comandos do diretório da aplicação apenas uma vez no seu
projeto para garantir que as permissões sejam configuradas corretamente:

.. code-block:: console

    HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
    setfacl -R -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
    setfacl -R -m u:${HTTPDUSER}:rwx logs
    setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Para usar as ferramentas de console do CakePHP, você precisa garantir que o
arquivo ``bin/cake`` seja executável. No \*nix ou macOS, você pode
executar:

.. code-block:: console

    chmod +x bin/cake

No Windows, o arquivo **.bat** já deve ser executável. Se você estiver usando
um Vagrant ou qualquer outro ambiente virtualizado, quaisquer diretórios compartilhados precisam ser
compartilhados com permissões de execução (consulte a documentação do seu ambiente
virtualizado sobre como fazer isso).

Se, por qualquer motivo, você não puder alterar as permissões do arquivo ``bin/cake``,
você pode executar o console do CakePHP com:

.. code-block:: console

    php bin/cake.php

Servidor de Desenvolvimento
============================

Uma instalação de desenvolvimento é a maneira mais rápida de configurar o CakePHP. Neste
exemplo, usamos o console do CakePHP para executar o servidor web integrado do PHP, que
tornará sua aplicação disponível em **http://host:port**. Do diretório app,
execute:

.. code-block:: console

    bin/cake server

Por padrão, sem argumentos fornecidos, isso servirá sua aplicação em
**http://localhost:8765/**.

Se houver conflito com **localhost** ou porta 8765, você pode dizer ao
console do CakePHP para executar o servidor web em um host e/ou porta específicos
utilizando os seguintes argumentos:

.. code-block:: console

    bin/cake server -H 192.168.13.37 -p 5673

Isso servirá sua aplicação em **http://192.168.13.37:5673/**.

É isso! Sua aplicação CakePHP está funcionando sem ter que
configurar um servidor web.

.. note::

    Tente ``bin/cake server -H 0.0.0.0`` se o servidor estiver inacessível de outros hosts.

.. warning::

    O servidor de desenvolvimento *nunca* deve ser usado em um ambiente de produção.
    Destina-se apenas como um servidor de desenvolvimento básico.

Se você preferir usar um servidor web real, deverá ser capaz de mover sua instalação do CakePHP
(incluindo os arquivos ocultos) para dentro do diretório raiz de documentos do seu servidor web. Você
deverá então poder apontar seu navegador web para o diretório para o qual moveu os
arquivos e ver sua aplicação em ação.

Produção
========

Uma instalação de produção é uma maneira mais flexível de configurar o CakePHP. Usando este
método, um domínio inteiro pode atuar como uma única aplicação CakePHP. Este
exemplo ajudará você a instalar o CakePHP em qualquer lugar do seu sistema de arquivos e torná-lo
disponível em http://www.example.com. Observe que esta instalação pode exigir os
direitos para alterar o ``DocumentRoot`` em servidores web Apache.

Depois de instalar sua aplicação usando um dos métodos acima no
diretório de sua escolha - assumiremos que você escolheu /cake_install - sua
configuração de produção ficará assim no sistema de arquivos::

    cake_install/
        bin/
        config/
        logs/
        plugins/
        resources/
        src/
        templates/
        tests/
        tmp/
        vendor/
        webroot/ (este diretório é definido como DocumentRoot)
        .gitignore
        .htaccess
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Desenvolvedores usando Apache devem definir a diretiva ``DocumentRoot`` para o domínio
como:

.. code-block:: apacheconf

    DocumentRoot /cake_install/webroot

Se o seu servidor web estiver configurado corretamente, agora você deverá encontrar sua aplicação
CakePHP acessível em http://www.example.com.

Iniciar
=======

Certo, vamos ver o CakePHP em ação. Dependendo de qual configuração você usou, você
deve apontar seu navegador para http://example.com/ ou http://localhost:8765/. Neste
ponto, você verá a página inicial padrão do CakePHP e uma mensagem que
informa o status da sua conexão de banco de dados atual.

Parabéns! Você está pronto para :doc:`criar sua primeira aplicação CakePHP
</quickstart>`.

.. _url-rewriting:

Reescrita de URL
================

Apache
------

Embora o CakePHP seja construído para funcionar com mod\_rewrite pronto para uso – e geralmente
funciona – notamos que alguns usuários têm dificuldades em fazer tudo funcionar
corretamente em seus sistemas.

Aqui estão algumas coisas que você pode tentar para fazer funcionar corretamente. Primeiro, veja seu
httpd.conf. (Certifique-se de estar editando o httpd.conf do sistema em vez de um
httpd.conf específico de usuário ou site.)

Esses arquivos podem variar entre diferentes distribuições e versões do Apache. Você
também pode dar uma olhada em https://cwiki.apache.org/confluence/display/httpd/DistrosDefaultLayout para
mais informações.

#. Certifique-se de que uma substituição .htaccess seja permitida e que AllowOverride esteja definido
   como All para o DocumentRoot correto. Você deve ver algo semelhante a:

   .. code-block:: apacheconf

       # Each directory to which Apache has access can be configured with respect
       # to which services and features are allowed and/or disabled in that
       # directory (and its subdirectories).
       #
       # First, we configure the "default" to be a very restrictive set of
       # features.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Certifique-se de estar carregando mod\_rewrite corretamente. Você deve ver algo
   como:

   .. code-block:: apacheconf

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Em muitos sistemas, estes estarão comentados por padrão, então você pode precisar apenas
   remover os símbolos # iniciais.

   Depois de fazer alterações, reinicie o Apache para garantir que as configurações estejam ativas.

   Verifique se seus arquivos .htaccess estão realmente nos diretórios corretos. Alguns
   sistemas operacionais tratam arquivos que começam com '.' como ocultos e, portanto,
   não os copiam.

#. Certifique-se de que sua cópia do CakePHP venha da seção de downloads do site
   ou do nosso repositório Git, e foi descompactado corretamente, verificando os
   arquivos .htaccess.

   Diretório app do CakePHP (será copiado para o diretório superior da sua
   aplicação pelo bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   Diretório webroot do CakePHP (será copiado para a raiz web da sua aplicação pelo
   bake):

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Se o seu site CakePHP ainda tiver problemas com mod\_rewrite, você pode querer
   tentar modificar as configurações para Virtual Hosts. No Ubuntu, edite o arquivo
   **/etc/apache2/sites-available/default** (a localização depende
   da distribuição). Neste arquivo, certifique-se de que ``AllowOverride None`` esteja
   alterado para ``AllowOverride All``, então você terá:

   .. code-block:: apacheconf

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options FollowSymLinks
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   No macOS, outra solução é usar a ferramenta
   `virtualhostx <https://clickontyler.com/virtualhostx/>`_ para criar um Virtual
   Host para apontar para sua pasta.

   Para muitos serviços de hospedagem (GoDaddy, 1and1), seu servidor web está sendo
   servido a partir de um diretório de usuário que já usa mod\_rewrite. Se você estiver
   instalando o CakePHP em um diretório de usuário
   (http://example.com/~username/cakephp/), ou qualquer outra estrutura de URL que
   já utilize mod\_rewrite, você precisará adicionar instruções RewriteBase aos
   arquivos .htaccess que o CakePHP usa (.htaccess, webroot/.htaccess).

   Isso pode ser adicionado à mesma seção com a diretiva RewriteEngine, então
   por exemplo, seu arquivo .htaccess do webroot ficaria assim:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Os detalhes dessas mudanças dependerão da sua configuração e podem incluir
   coisas adicionais que não estão relacionadas ao CakePHP. Por favor, consulte a
   documentação online do Apache para mais informações.

#. (Opcional) Para melhorar a configuração de produção, você deve evitar que recursos inválidos
   sejam analisados pelo CakePHP. Modifique seu .htaccess do webroot para algo
   como:

   .. code-block:: apacheconf

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   O código acima impedirá que recursos incorretos sejam enviados para index.php
   e, em vez disso, exibirá a página 404 do seu servidor web.

   Além disso, você pode criar uma página HTML 404 correspondente ou usar a
   404 integrada padrão do CakePHP adicionando uma diretiva ``ErrorDocument``:

   .. code-block:: apacheconf

       ErrorDocument 404 /404-not-found

nginx
-----

O nginx não faz uso de arquivos .htaccess como o Apache, portanto, é necessário
criar essas URLs reescritas na configuração de sites disponíveis. Isso geralmente é
encontrado em ``/etc/nginx/sites-available/your_virtual_host_conf_file``. Dependendo
da sua configuração, você terá que modificar isso, mas no mínimo, você precisará
do PHP rodando como uma instância FastCGI.
A seguinte configuração redireciona a solicitação para ``webroot/index.php``:

.. code-block:: nginx

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

Um exemplo da diretiva do servidor é o seguinte:

.. code-block:: nginx

    server {
        listen   80;
        listen   [::]:80;
        server_name www.example.com;
        return 301 http://example.com$request_uri;
    }

    server {
        listen   80;
        listen   [::]:80;
        server_name example.com;

        root   /var/www/example.com/public/webroot;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include fastcgi_params;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_intercept_errors on;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

.. note::
    Configurações recentes do PHP-FPM são configuradas para ouvir o socket unix php-fpm
    em vez da porta TCP 9000 no endereço 127.0.0.1. Se você receber erros 502 bad
    gateway da configuração acima, tente atualizar ``fastcgi_pass`` para
    usar o caminho do socket unix (por exemplo: fastcgi_pass
    unix:/var/run/php/php7.1-fpm.sock;) em vez da porta TCP.

NGINX Unit
----------

O `NGINX Unit <https://unit.nginx.org>`_ é configurável dinamicamente em tempo de execução;
a seguinte configuração depende de ``webroot/index.php``, também servindo outros
scripts ``.php`` se presentes via ``cakephp_direct``:

.. code-block:: json

   {
       "listeners": {
           "*:80": {
               "pass": "routes/cakephp"
           }
       },

       "routes": {
           "cakephp": [
               {
                   "match": {
                       "uri": [
                           "*.php",
                           "*.php/*"
                       ]
                   },

                   "action": {
                       "pass": "applications/cakephp_direct"
                   }
               },
               {
                   "action": {
                       "share": "/path/to/cakephp/webroot/",
                       "fallback": {
                           "pass": "applications/cakephp_index"
                       }
                   }
               }
           ]
       },

       "applications": {
           "cakephp_direct": {
               "type": "php",
               "root": "/path/to/cakephp/webroot/",
               "user": "www-data"
           },

           "cakephp_index": {
               "type": "php",
               "root": "/path/to/cakephp/webroot/",
               "user": "www-data",
               "script": "index.php"
           }
       }
   }

Para habilitar esta configuração (assumindo que esteja salva como ``cakephp.json``):

.. code-block:: console

   # curl -X PUT --data-binary @cakephp.json --unix-socket \
          /path/to/control.unit.sock http://localhost/config

IIS7 (hosts Windows)
--------------------

O IIS7 não suporta nativamente arquivos .htaccess. Embora existam
complementos que podem adicionar esse suporte, você também pode importar regras htaccess
para o IIS para usar as reescritas nativas do CakePHP. Para fazer isso, siga
estes passos:

#. Use o `Microsoft's Web Platform Installer <https://www.microsoft.com/web/downloads/platform.aspx>`_
   para instalar o `Rewrite Module 2.0 <https://www.iis.net/downloads/microsoft/url-rewrite>`_ da URL
   ou baixe-o diretamente (`32-bit <https://download.microsoft.com/download/D/8/1/D81E5DD6-1ABB-46B0-9B4B-21894E18B77F/rewrite_x86_en-US.msi>`_ /
   `64-bit <https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi>`_).
#. Crie um novo arquivo chamado web.config na sua pasta raiz do CakePHP.
#. Usando o Bloco de Notas ou qualquer editor seguro para XML, copie o seguinte
   código para o seu novo arquivo web.config:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                    <rule name="Exclude direct access to webroot/*"
                      stopProcessing="true">
                        <match url="^webroot/(.*)$" ignoreCase="false" />
                        <action type="None" />
                    </rule>
                    <rule name="Rewrite routed access to assets(img, css, files, js, favicon)"
                      stopProcessing="true">
                        <match url="^(font|img|css|files|js|favicon.ico)(.*)$" />
                        <action type="Rewrite" url="webroot/{R:1}{R:2}"
                          appendQueryString="false" />
                    </rule>
                    <rule name="Rewrite requested file/folder to index.php"
                      stopProcessing="true">
                        <match url="^(.*)$" ignoreCase="false" />
                        <action type="Rewrite" url="index.php"
                          appendQueryString="true" />
                    </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

Uma vez que o arquivo web.config seja criado com as regras de reescrita corretas e amigáveis ao IIS,
os links, CSS, JavaScript e roteamento do CakePHP devem funcionar corretamente.

Lighttpd
--------
O Lighttpd não faz uso de arquivos **.htaccess** como o Apache, portanto, é
necessário adicionar uma configuração ``url.rewrite-once`` em **conf/lighttpd.conf**.
Certifique-se de que o seguinte esteja presente na sua configuração do lighthttpd:

.. code-block:: php

    server.modules += (
        "mod_alias",
        "mod_cgi",
        "mod_rewrite"
    )

    # Directory Alias
    alias.url       = ( "/TestCake" => "C:/Users/Nicola/Documents/TestCake" )

    # CGI Php
    cgi.assign      = ( ".php" => "c:/php/php-cgi.exe" )

    # Rewrite Cake Php (on /TestCake path)
    url.rewrite-once = (
        "^/TestCake/(css|files|img|js|stats)/(.*)$" => "/TestCake/webroot/$1/$2",
        "^/TestCake/(.*)$" => "/TestCake/webroot/index.php/$1"
    )

As linhas acima incluem a configuração CGI do PHP e exemplo de configuração de aplicação
para uma aplicação no caminho ``/TestCake``.

Não Posso Usar Reescrita de URL
--------------------------------

Se você não quiser ou não puder ter mod\_rewrite (ou algum outro módulo compatível)
rodando no seu servidor, você precisará usar as URLs bonitas integradas do CakePHP.
Em **config/app.php**, descomente a linha que se parece com::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Também remova estes arquivos .htaccess::

    /.htaccess
    webroot/.htaccess

Isso fará com que suas URLs se pareçam com
www.example.com/index.php/controllername/actionname/param em vez de
www.example.com/controllername/actionname/param.

.. _GitHub: https://github.com/cakephp/cakephp
.. _Composer: https://getcomposer.org

.. meta::
    :title lang=pt: Instalação
    :keywords lang=pt: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
