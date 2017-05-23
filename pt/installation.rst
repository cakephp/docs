Instalação
##########

O CakePHP é rápido e fácil de instalar. Os requisitos mínimos são um servidor
web e uma cópia do CakePHP, só isso! Apesar deste manual focar principalmente na
configuração do Apache (porquê ele é o mais simples de instalar
e configurar), o CakePHP vai ser executado em uma série de servidores web como
nginx, LightHTTPD, ou Microsoft IIS.

Requisitos
==========

- HTTP Server. Por exemplo: Apache. De preferência com mod\_rewrite ativo, mas
  não é obrigatório.
- PHP |minphpversion| ou superior.
- extensão mbstring
- extensão intl

.. note::

    Tanto no XAMPP quanto no WAMP, as extensões mcrypt e mbstring são setadas
    por padrão.

    Se você estiver usando o XAMPP, já tem a extensão intl inclusa, mas
    é preciso descomentar a linha ``extension=php_intl.dll`` no arquivo
    ``php.ini`` e então, reiniciar o servidor através do painel de controle do
    XAMPP.

    Caso você esteja usando o WAMP, a extensão intl está "ativa" por padrão, mas
    não está funcional.  Para fazê-la funcionar, você deve ir à pasta do php
    (que por padrão é) ``C:\wamp\bin\php\php{version}``, copiar todos os
    arquivos que se pareçam com ``icu***.dll`` e colá-los no diretório "bin" do
    apache ``C:\wamp\bin\apache\apache{version}\bin``. Reiniciando todos os
    serviços a extensão já deve ficar ok.

Apesar de um mecanismo de banco de dados não ser exigido, nós imaginamos que
a maioria das aplicações irá utilizar um. O CakePHP suporta uma variedade de
mecanismos de armazenamento de banco de dados:

-  MySQL (5.1.10 ou superior)
-  PostgreSQL
-  Microsoft SQL Server (2008 ou superior)
-  SQLite 3

.. note::

    Todos os drivers inclusos internamente requerem PDO. Você deve assegurar-se
    que possui a extensão PDO correta instalada.

Instalando o CakePHP
====================

O CakePHP utiliza `Composer <http://getcomposer.org>`_, uma ferramenta de
gerenciamento de dependências para PHP 5.3+, como o método suportado oficial
para instalação.

Primeiramente, você precisará baixar e instalar o Composer se não
o fez anteriormente. Se você tem cURL instalada, é tão fácil quanto executar o
seguinte::

    curl -s https://getcomposer.org/installer | php

Ou, você pode baixar ``composer.phar`` do
`Site oficial do Composer <https://getcomposer.org/download/>`_.

Para sistemas Windows, você pode baixar o instalador
`aqui <https://github.com/composer/windows-setup/releases/>`__. Mais
instruções para o instalador Windows do Composer podem ser encontradas dentro
do LEIA-ME `aqui <https://github.com/composer/windows-setup>`_.

Agora que você baixou e instalou o Composer, você pode receber uma nova
aplicação CakePHP executando::

    php composer.phar create-project --prefer-dist cakephp/app [app_name]

Ou se o Composer estiver instalado globalmente::

    composer create-project --prefer-dist cakephp/app [app_name]

Uma vez que o Composer terminar de baixar o esqueleto da aplicação e o núcleo
da biblioteca CakePHP, você deve ter uma aplicação funcional
instalada via Composer. Esteja certo de manter os arquivos composer.json e
composer.lock com o restante do seu código fonte.

You can now visit the path to where you installed your CakePHP application and
see the setup traffic lights.

Mantendo sincronização com as últimas alterações no CakePHP
-----------------------------------------------------------

Se você quer se manter atualizado com as últimas mudanças no CakePHP, você pode
adicionar o seguinte ao ``composer.json`` de sua aplicação::

    "require": {
        "cakephp/cakephp": "dev-master"
    }

Onde ``<branch>`` é o nome do branch que você segue. Toda vez que você executar
``php composer.phar update`` você receberá as últimas atualizações do branch
escolhido.

Permissões
==========

O CakePHP utiliza o diretório ``tmp`` para diversas operações.
Descrição de models, views armazenadas em cache e informações de sessão são
apenas alguns exemplos.
O diretório ``logs`` é utilizado para escrever arquivos de log pelo mecanismo
padrão ``FileLog``.

Como tal, certifique-se que os diretórios ``logs``, ``tmp`` e todos os seus
sub-diretórios em sua instalação CakePHP são graváveis pelo usuário relacionado
ao servidor web. O processo de instalação do Composer faz ``tmp`` e seus
sub-diretórios globalmente graváveis para obter as coisas funcionando
rapidamente, mas você pode atualizar as permissões para melhor segurança e
mantê-los graváveis apenas para o usuário relacionado ao servidor web.

Um problema comum é que os diretórios e sub-diretórios de ``logs`` e ``tmp``
devem ser graváveis tanto pelo servidor quanto pelo usuário da linha de comando.
Em um sistema UNIX, se seu usuário relacionado ao servidor web é diferente do
seu usuário da linha de comando, você pode executar somente uma vez os seguintes
comandos a partir do diretório da sua aplicação para assegurar que as permissões
serão configuradas corretamente::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx tmp
   setfacl -R -m u:${HTTPDUSER}:rwx logs
   setfacl -R -d -m u:${HTTPDUSER}:rwx logs

Servidor de Desenvolvimento
===========================

Uma instalação de desenvolvimento é o método mais rápido de configurar o
CakePHP. Neste exemplo, nós vamos utilizar o console CakePHP para executar o
servidor integrado do PHP que vai tornar sua aplicação disponível em
``http://host:port``. A partir do diretório da aplicação, execute::

    bin/cake server

Por padrão, sem nenhum argumento fornecido, isso vai disponibilizar a sua
aplicação em ``http://localhost:8765/``.

Se você tem algo conflitante com ``localhost`` ou porta ``8765``, você pode
dizer ao console CakePHP para executar o servidor web em um host e/ou porta
específica utilizando os seguintes argumentos::

    bin/cake server -H 192.168.13.37 -p 5673

Isto irá disponibilizar sua aplicação em ``http://192.168.13.37:5673/``.

É isso aí! Sua aplicação CakePHP está instalada e funcionando sem ter que
configurar um servidor web.

.. warning::

    O servidor de desenvolvimento *nunca* deve ser usado em um ambiente de
    produção. Destina-se apenas como um servidor de desenvolvimento básico.

Se você preferir usar um servidor web real, você deve ser capaz de mover a
instalação do CakePHP (incluindo os arquivos ocultos) para dentro do diretório
raiz do seu servidor web. Você deve, então, ser capaz de apontar seu navegador
para o diretório que você moveu os arquivos para dentro e ver a aplicação em
ação.

Produção
========

Uma instalação de produção é uma forma mais flexível de configurar o CakePHP.
Usar este método permite total domínio para agir como uma aplicação CakePHP
singular. Este exemplo o ajudará a instalar o CakePHP em qualquer lugar em seu
sistema de arquivos e torná-lo disponível em http://www.example.com. Note que
esta instalação pode exigir os direitos de alterar o ``DocumentRoot`` em
servidores web Apache.

Depois de instalar a aplicação usando um dos métodos acima no
diretório de sua escolha - vamos supor que você escolheu /cake_install - sua
configuração de produção será parecida com esta no sistema de arquivos::

    /cake_install/
        bin/
        config/
        logs/
        plugins/
        src/
        tests/
        tmp/
        vendor/
        webroot/ (esse diretório é definido como DocumentRoot)
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Desenvolvedores utilizando Apache devem definir a diretiva ``DocumentRoot``
pelo domínio para::

    DocumentRoot /cake_install/webroot

Se o seu servidor web está configurado corretamente, agora você deve encontrar
sua aplicação CakePHP acessível em http://www.example.com.

Aquecendo
=========

Tudo bem, vamos ver o CakePHP em ação. Dependendo de qual configuração você
usou, você deve apontar seu navegador para http://example.com/ ou
http://localhost:8765/. Nesse ponto, você será apresentado à página home
padrão do CakePHP e uma mensagem que diz a você o estado da sua conexão
atual com o banco de dados.

Parabéns! Você está pronto para :doc:`create your first CakePHP
application </quickstart>`.

.. _url-rewriting:

Reescrita de URL
================

Apache
------

Apesar do CakePHP ser construído para trabalhar com mod\_rewrite fora da caixa,
e normalmente o faz, nos atentamos que alguns usuários lutam para conseguir
fazer tudo funcionar bem em seus sistemas.

Aqui estão algumas coisas que você poderia tentar para conseguir tudo rodando
corretamente. Primeiramente observe seu httpd.conf. (Tenha certeza que você está
editando o httpd.conf do sistema ao invés de um usuário, ou site específico.)

Esses arquivos podem variar entre diferentes distribuições e versões do Apache.
Você também pode pesquisar em http://wiki.apache.org/httpd/DistrosDefaultLayout
para maiores informações.

#. Tenha certeza que a sobreescrita do .htaccess está permitida e que
   AllowOverride está definido para All no correto DocumentRoot. Você
   deve ver algo similar a::

       # Cada diretório ao qual o Apache tenha acesso pode ser configurado com respeito
       # a quais serviços e recursos estão permitidos e/ou desabilitados neste
       # diretório (e seus sub-diretórios).
       #
       # Primeiro, nós configuramos o "default" para ser um conjunto bem restrito de
       # recursos.
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Certifique-se que o mod\_rewrite está sendo carregado corretamente. Você deve
   ver algo como::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Em muitos sistemas estará comentado por padrão, então você pode
   apenas remover os símbolos #.

   Depois de fazer as mudanças, reinicie o Apache para certificar-se que as
   configurações estão ativas.

   Verifique se os seus arquivos .htaccess estão realmente nos diretórios
   corretos. Alguns sistemas operacionais tratam arquivos iniciados
   com '.' como ocultos e portanto, não os copia.

#. Certifique-se de sua cópia do CakePHP vir da seção de downloads
   do site ou do nosso repositório Git, e que foi descompactado corretamente,
   verificando os arquivos .htaccess.

   O diretório app do CakePHP (será copiado para o diretório mais alto de sua
   aplicação através do bake)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$    webroot/    [L]
          RewriteRule    (.*) webroot/$1    [L]
       </IfModule>

   O diretório webroot do CakePHP (será copiado para a raíz de sua aplicação
   através do bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Se o seu site CakePHP ainda possuir problemas com mod\_rewrite, você pode
   tentar modificar as configurações para Virtual Hosts. No Ubuntu,
   edita o arquivo /etc/apache2/sites-available/default (a localização depende
   da distribuição). Nesse arquivo, certifique-se que  ``AllowOverride None``
   seja modificado para  ``AllowOverride All``, então você terá::

       <Directory />
           Options FollowSymLinks
           AllowOverride All
       </Directory>
       <Directory /var/www>
           Options Indexes FollowSymLinks MultiViews
           AllowOverride All
           Order Allow,Deny
           Allow from all
       </Directory>

   No macOS, outra solução é usar a ferramenta
   `virtualhostx <http://clickontyler.com/virtualhostx/>`_
   para fazer um Virtual Host apontar para o seu diretório.

   Para muitos serviços de hospedagem (GoDaddy, land1), seu servidor web é
   na verdade oferecido a partir de um diretório de usuário que já utiliza
   mod\_rewrite. Se você está instalando o CakePHP em um diretório de usuário
   (http://example.com/~username/cakephp/), ou qualquer outra estrutura URL
   que já utilize mod\_rewrite, você precisará adicionar declarações
   RewriteBase para os arquivos .htaccess que o CakePHP utiliza.
   (.htaccess, webroot/.htaccess).

   Isso pode ser adicionado na mesma seção com a diretiva RewriteEngine,
   por exemplo, seu arquivo webroot/.htaccess ficaria como::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^ index.php [L]
       </IfModule>

   Os detalhes dessas mudanças vão depender da sua configuração, e podem
   incluir coisas adicionais que não estão relacionadas ao CakePHP.
   Por favor, busque pela documentação online do Apache para mais informações.

#. (Opcional) Para melhorar a configuração de produção, você deve prevenir
   conteúdos inváidos de serem analisados pelo CakePHP. Modifique seu
   webroot/.htaccess para algo como::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/app/
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_URI} !^/(webroot/)?(img|css|js)/(.*)$
           RewriteRule ^ index.php [L]
       </IfModule>

   Isto irá simplesmente prevenir conteúdo incorreto de ser enviado para o
   index.php e então exibir sua página de erro 404 do servidor web.

   Adicionalmente você pode criar uma página HTML de erro 404 correspondente,
   ou utilizar a padrão do CakePHP ao adicionar uma diretiva ``ErrorDocument``::

       ErrorDocument 404 /404-not-found

nginx
-----

nginx não utiliza arquivos .htaccess como o Apache, então é necessário
criar as reescritas de URL na configuração de sites disponíveis. Dependendo
da sua configuração, você precisará modificar isso, mas pelo menos,
você vai precisar do PHP rodando como uma instância FastCGI::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include /etc/nginx/fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

IIS7 (Windows hosts)
--------------------

IIS7 não suporta nativamente arquivos .htaccess. Mesmo existindo
add-ons que adicionam esse suporte, você também pode importar as regras
.htaccess no IIS para utilizar as reescritas nativas do CakePHP. Para isso, siga
os seguintes passos:


#. Utilize o
   `Microsoft's Web Platform Installer <http://www.microsoft.com/web/downloads/platform.aspx>`_
   para instalar o `Rewrite Module 2.0 <http://www.iis.net/downloads/microsoft/url-rewrite>`_
   ou baixe-o diretamente (`32-bit <http://www.microsoft.com/en-us/download/details.aspx?id=5747>`_ /
   `64-bit <http://www.microsoft.com/en-us/download/details.aspx?id=7435>`_).
#. Crie um novo arquivo chamado web.config em seu diretório raiz do CakePHP.
#. Utilize o Notepad ou qualquer editor seguro XML para copiar o seguinte código
   em seu novo arquivo web.config::

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
                        <match url="^(img|css|files|js|favicon.ico)(.*)$" />
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

Uma vez que o arquivo web.config é criado com as regras amigáveis de reescrita
do IIS, os links, CSS, JavaScript, e roteamento do CakePHP agora devem funcionar
corretamente.

Não posso utilizar Reescrita de URL
-----------------------------------

Se você não quer ou não pode ter mod\_rewrite (ou algum outro módulo compatível)
funcionando no seu servidor, você precisará utilizar as URLs amigáveis natívas
do CakePHP. No **config/app.php**, descomente a linha que se parece como::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Também remova esses arquivos .htaccess::

    /.htaccess
    webroot/.htaccess

Isso fará suas URLs parecem como
www.example.com/index.php/controllername/actionname/param ao
invés de www.example.com/controllername/actionname/param.

.. _GitHub: http://github.com/cakephp/cakephp
.. _Composer: http://getcomposer.org

.. meta::
    :title lang=pt: Instalação
    :keywords lang=pt: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighthttpd,repository,enhancements,source code,cakephp,incorporate
