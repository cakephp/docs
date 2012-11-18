Instalação
##########

Instalando o CakePHP pode ser feito simplesmente descompactando o
conteúdo no seu servidor web ou de forma mais complexa e flexível, do
jeito que você preferir. Esta seção vais falar de três maneiras de
instalar o CakePHP: desenvolvimento, produção e avançada.

-  Desenvolvimento: fácil para começar, URL dos seus aplicativos incluem
   o diretório de instalação do CakePHP e é menos seguro;
-  Produção: Requer maior habilidade para configurar o servidor web,
   porém mais seguro e com URLs mais amigáveis;
-  Avançada: Com algumas configurações, permite você colocar os
   diretórios do CakePHP em diferentes locais do sistema, possibilitando
   compartilhar o núcleo do CakePHP entre diversas aplicações.

Desenvolvimento
===============

A instalação de desenvolvimento é o método mais rápido para instalação
do Cake. Este exemplo irá ajudá-lo a instalar uma aplicação CakePHP e
torná-la disponível em http://www.example.com/cake\_1\_3/. Assumimos,
para efeitos deste exemplo, que a raiz do seu documento é definida como
/var/www/html.

Apenas coloque seus arquivos do CakePHP no diretório público do seu
servidor web (normalmente htdocs, www, public\_html). Por exemplo,
assumindo que o diretório público do seu servidor web seja
/var/www/html, os arquivos devem ficar desta maneira: Descompacte o
conteúdo do arquivo Cake em /var/www/html. Você agora tem uma pasta na
raiz do seu documento com o nome da versão que você tenha baixado (por
exemplo, cake\_1.3.0). Renomeie esta pasta para cake\_1\_3. A
configuração do seu desenvolvimento será semelhante a esta no sistema de
arquivos:

-  /var/www/html

   -  /cake\_1\_3

      -  /app
      -  /cake
      -  /vendors
      -  /plugins
      -  /.htaccess
      -  /index.php
      -  /README

Se o seu servidor web está configurado corretamente, agora você deve
encontrar a sua aplicação Cake acessível em
http://www.example.com/cake\_1\_3/.

Produção
========

A instalação de produção é a forma mais flexível de configurar o Cake.
Usar este método permite um total domínio para agir como uma única
aplicação CakePHP. Este exemplo irá ajudá-lo a instalar o Cake em
qualquer lugar no seu sistema de arquivos e torná-lo disponível em
http://www.example.com. Note que esta instalação pode requerer os
privilégios para alteração do DocumentRoot em um servidor Apache.

Descompacte o conteúdo do arquivo do Cake em um diretório de sua
escolha. Para os fins deste exemplo, assumimos que você escolheu
instalar o Cake em /cake\_install. Sua configuração de produção será
semelhante a essa no sistema de arquivos:

/cake\_install/

/app

-  /webroot (this directory is set as the DocumentRoot directive)

/cake

/vendors

/.htaccess

/index.php

/README

Desenvolvedores usando o Apache devem definir a diretiva DocumentRoot
para o domínio:

::

    DocumentRoot/cake_install/app/webroot

Se seu servidor web está configurado corretamente, você deve encontrar
agora a sua aplicação Cake acessível em http://www.example.com.

Instalação avançada
===================

Aqui estão algumas situações que você escolhe o lugar onde os diretórios
do CakePHP vão ficar no seu sistema. Isto pode ser por causa de uma
restrição do sistema ou para compartilhar as bibliotecas entre
diferentes aplicações. Esta seção descreve como espalhar seus diretórios
dos CakePHP no sistema.

Primeiro, note que há três partes principais da sua aplicação CakePHP:

#. As bibliotecas do núcleo do CakePHP, em /cake;
#. O código da sua aplicação, em /app;
#. Os arquivos públicos da sua aplicação, normalmente em /app/webroot.

Cada um desses diretórios pode ser colocado em qualquer lugar do seu
sistema, com exceção do webroot, que precisa estar acessivel pelo
servidor web. Você pode mover a pasta webroot para fora do diretório da
sua aplicação (app), desde que informe ao Cake onde você vai colocá-la.

Para configurar sua instalação do Cake, nós vamos ter que fazer algumas
alterações no arquivo /app/webroot/index.php. Aqui existem três
constantes que precisaremos editar: ``ROOT``, ``APP_DIR`` e
``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` deve ser configurada para informar o diretório onde sua
   aplicação se encontra, ou seja, onde está a pasta app;
-  ``APP_DIR`` deve ser configurada para informar qual a pasta app;
-  ``CAKE_CORE_INCLUDE_PATH`` deve ser configurada para informar o
   diretório onde estão as bibliotecas do CakePHP (a pasta cake).

Vamos fazer um exemplo para que você veja como funciona a instalação
avançada na prática. Imagine que eu quero que a aplicação funcione como
segue:

-  As bibliotecas do CakePHP deverão ser colocadas em /usr/lib/cake;
-  O diretório público da minha aplicação (webroot) deve ser em
   /var/www/minhaapp;
-  O diretório da aplicação deve ser /home/eu/minhaapp.

Com estas configurações, eu preciso editar o meu arquivo
webroot/index.php (que no final deve estar em
/var/www/meusite/index.php, neste exemplo) e ver o seguinte:

::

    // /app/webroot/index.php (parcialmente, comentários removidos) 

    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'eu');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'minhaapp');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

É recomendado que você use a constante ``DS`` no lugar das barras para
entre os diretórios. Isso previne que não cause erro quando se use a
aplicação em sistemas operacionais diferentes, tornando seu código mais
portável.

Caminhos adicionais para classes
--------------------------------

Em algumas ocasiões é interessante você compartilhar as classes do MVC
entre as aplicações no mesmo sistema. Se você quer um mesmo controlador
para mesma aplicação, você pode usar o arquivo bootstrap.php do CakePHP
para adicionar estas classes adicionais.

No bootstrap.php, defina algumas variáveis com nomes especiais para
fazer com que o CakePHP olhe nestes diretórios a procura da sua classe:

::

    $viewPaths        = array();
    $controllerPaths  = array();
    $modelPaths       = array();
    $helperPaths      = array();
    $componentPaths   = array();
    $behaviorPaths    = array();
    $pluginPaths      = array();
    $vendorPaths      = array();
    $localePaths      = array();
    $shellPaths       = array();

Cada um dessas variáveis especiais pode ser um conjunto na array com o
diretório absoluto onde estão as classes que você desejar. Tenha certeza
que cada diretório especificado inclua as barras com ``DS``.

Apache e mod\_rewrite
=====================

O CakePHP é contruido para trabalhar com o mod\_rewrite, mas vimos que
muitos usuários apanharem para conseguir fazer isto funcionar nos seus
sistemas, então nós lhe daremos algumas dicas que você pode tentar fazer
para rodar corretamente.

Aqui estão algumas coisas que você pode tentar para rodar corretamente.
Primeiro veja o seu httpd.conf (tenha certeza que você está editando o
httpd.conf do sistema ao invés do httpd.conf de um usuário ou site).

#. Tenha certeza que o override do .htaccess está sendo permitido, ou
   seja, que AllowOverride está setado para All no DocumentRoot correto.
   Você deve ver algo similar a:

   ::

       #
       # Cada diretório que o Apache tenha acesso pode ser configurado com relação
       # a serviços e funcionalidades que são permitidos e/ou desabilitados neste
       # diretório (e seus subdiretórios).
       #
       # Primeiro nós configuramos o "default" para ter um grupo restrito de
       # recursos.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Tenha certeza que está carregando o mod\_rewrite corretamente. Você
   deve ver algo como:

   ::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Em muitos sistemas isto estará comentado (começando com uma #) por
   padrão, então você deve remover a cerquilha (simbolo #).

   Depois de fazer as suas alterações, reinicie o Apache para ter
   certeza que suas configurações estão ativas.

   Verifique que seu .htaccess estão nos diretório corretos.

   Isto pode não acontecer durante a copia, pois alguns sistemas
   operacionais tratam arquivos começados com '.' como ocultos e
   consequentemente não copiam.

#. Tenha certeza que sua cópia do CakePHP é da sessão de downloads do
   site ou nosso repositório SVN e tenha sido descompactado corretamente
   verificando pelo arquivo .htaccess.

   Na raiz (que será copiada para seu document, isso redirecionará
   qualquer coisa para sua aplicação Cake):

   ::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   O diretório app (que será copiado para o topo do diretório pelo
   bake):

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
        </IfModule>

   No diretório webroot (que será copiado para a raiz da aplicação web
   pelo bake):

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   Para muitos servidores de hospedagem (GoDaddy, 1and1), seu servidor
   web já possui o mod\_rewrite habilitado. Se você está instalando o
   CakePHP dentro do diretório do usuário
   (http://exemplo.com.br/~username/cakephp/) ou qualquer estrutura de
   URL que já utiliza o mod\_rewrite, você precisa incluir a tag
   RewriteBase nos seus .htaccess (/.htaccess, /app/.htaccess,
   /app/webroot/.htaccess).

   Isso pode ser adicionado na mesma sessão que o RewriteEngine, como
   por exemplo no .htaccess do webroot:

   ::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
       </IfModule>

   Os detalhes dessa alteraçãoa dependem da sua instalação e podem
   incluir outras informação que não estão relacionadas com o CakePHP.
   Veja a documentação do Apache para mais informações.

Lighttpd e mod\_magnet
======================

Embora Lighttpd suporte o módulo de rewrite, ele não é equivalente ao
módulo mod\_rewrite do Apache. Todas as funcionalidades do mod\_rewrite
no Lighttpd estão espalhadas entre os módulos mod\_rewrite, mod\_magnet
e mod\_proxy.

CakePHP, entretanto, precisa principalmente do mod\_magnet para
redirecionar requests para funcionar com URLs amigáveis.

Para usar URLs amigáveis com CakePHP e Lighttpd, coloque o script lua
abaixo em /etc/lighttpd/cake.

::

    -- pequena função auxiliar
    function file_exists(path)
      local attr = lighty.stat(path)
      if (attr) then
          return true
      else
          return false
      end
    end
    function removePrefix(str, prefix)
      return str:sub(1,#prefix+1) == prefix.."/" and str:sub(#prefix+2)
    end

    -- prefixo sem a barra
    local prefix = ''

    -- a mágica ;]
    if (not file_exists(lighty.env["physical.path"])) then
        -- arquivo ainda está faltando. passe para o backend fastcgi
        request_uri = removePrefix(lighty.env["uri.path"], prefix)
        if request_uri then
          lighty.env["uri.path"]          = prefix .. "/index.php"
          local uriquery = lighty.env["uri.query"] or ""
          lighty.env["uri.query"] = uriquery .. (uriquery ~= "" and "&" or "") .. "url=" .. request_uri
          lighty.env["physical.rel-path"] = lighty.env["uri.path"]
          lighty.env["request.orig-uri"]  = lighty.env["request.uri"]
          lighty.env["physical.path"]     = lighty.env["physical.doc-root"] .. lighty.env["physical.rel-path"]
        end
    end
    -- fallthrough vai colocar ele de volta no loop de request do lighty
    -- isso quer dizer que nós ganhamos o tratamento do 304 de graça. ;]

Se você roda seu CakePHP de um sub-diretório, você precisa usar prefix =
'subdirectory\_name' no script acima.

Agora informe Lighttpd sobre seu vhost:

::

    $HTTP["host"] =~ "example.com" {
            server.error-handler-404  = "/index.php"

            magnet.attract-physical-path-to = ( "/etc/lighttpd/cake.lua" )

            server.document-root = "/var/www/cake-1.2/app/webroot/"

            # Think about getting vim tmp files out of the way too
            url.access-deny = (
                    "~", ".inc", ".sh", "sql", ".sql", ".tpl.php",
                    ".xtmpl", "Entries", "Repository", "Root",
                    ".ctp", "empty"
            )
    }

URLs amigáveis em nginx
=======================

nginx é um servidor popular que, como Lighttpd, usa menos recursos do
sistema. O inconveniente é que não faz uso do arquivo .htaccess como
Apache e Lighttpd, por isso é necessário para criar essas URLs amigáveis
na configuração do site disponível. Dependendo da sua instalação, você
terá que modificar isso, mas para isso, você vai precisar do PHP rodando
o módulo FastCGI.

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            root   /var/www/example.com/public/app/webroot/;
            index  index.php index.html index.htm;
            if (-f $request_filename) {
                break;
            }
            if (-d $request_filename) {
                break;
            }
            rewrite ^(.+)$ /index.php?q=$1 last;
        }

        location ~ .*\.php[345]?$ {
            include /etc/nginx/fcgi.conf;
            fastcgi_pass    127.0.0.1:10005;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME /var/www/example.com/public/app/webroot$fastcgi_script_name;
        }
    }

URL Reescrita no IIS7 (Windows hosts)
=====================================

IIS7 não suporta nativamente arquivos .htaccess. Embora exista add-ons
que podem adicionar esse suporte, você também pode importar regras
.htaccess no IIS para usar reescrita(\ *rewrites*) nativas do CakePHP.
Para fazer isso, siga estes passos:

#. Use o *Microsoft Web Platform Installer* para instalar a *URL Rewrite
   2.0*.
#. Crie um novo arquivo na sua pasta CakePHP, chamado web.config
#. Usando o Notepad ou outro editor xml seguro, copie o seguinte código
   no seu novo arquivo web.config

::

    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <system.webServer>
            <rewrite>
                <rules>
                <rule name="Imported Rule 1" stopProcessing="true">
                <match url="^(.*)$" ignoreCase="false" />
                <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                </conditions>

                <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />

                </rule>

                <rule name="Imported Rule 2" stopProcessing="true">
                  <match url="^$" ignoreCase="false" />
                  <action type="Rewrite" url="/" />
                </rule>
                <rule name="Imported Rule 3" stopProcessing="true">
                  <match url="(.*)" ignoreCase="false" />
                  <action type="Rewrite" url="/{R:1}" />
                </rule>
                <rule name="Imported Rule 4" stopProcessing="true">
                  <match url="^(.*)$" ignoreCase="false" />
                  <conditions logicalGrouping="MatchAll">
                            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                  </conditions>
                  <action type="Rewrite" url="index.php?url={R:1}" appendQueryString="true" />
                </rule>
                </rules>
            </rewrite>
        </system.webServer>
    </configuration>

Também é possível usar a funcionalidade de importação no modulo de
reescrita de URL do IIS para importar regras diretamente dos arquivos
.htaccess do CakePHP no root, /app/, e /app/webroot/ - embora alguns
edições no IIS podem ser necessário fazê-las funcionar. Embora
importando as regras desta maneira, o IIS irá automaticamente criar o
arquivo web.config para você.

Uma vez que o arquivo web.config é criado com o correto *IIS-friendly*
de regras de reescrita, links do CakePHP, css, js, e o redirecionamento
devem funcionar corretamente.

Comece agora!
=============

Tudo bem, vamos ver o CakePHP em ação. Dependendo de qual opção de
instalação você utilizou, acesse no seu browser o link
http://exemplo.com.br ou http://exemplo.com.br/cake\_instalado/. Neste
ponto, você verá a página padrão do CakePHP e a mensagem do estado da
configuração do seu banco de dados.

Parabéns! Você já pode criar sua primeira aplicação CakePHP.
