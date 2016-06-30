Instalação Avançada
###################

Pode haver algumas situações onde você deseja colocar os diretórios do CakePHP
em diferentes locais no sistema de arquivos. Isto pode ser devido a uma
restrição do servidor compartilhado, ou talvez você queira apenas que algumas
aplicações compartilhem as bibliotecas do Cake. Esta seção descreve como
espalhar seus diretórios do CakePHP em um sistema de arquivos.

Em primeiro lugar, note que há três partes principais de uma aplicação CakePHP.

#. As bibliotecas do núcleo do CakePHP, em /cake.
#. O código da sua aplicação, em /app.
#. Os arquivos públicos da sua aplicação, normalmente em /app/webroot.

Cada um desses diretórios podem ser localizados em qualquer em seu sistema de
arquivos, com exceção do webroot, que precisa ser acessível pelo seu servidor
web. Você pode até mesmo mover a pasta webroot para fora da pasta app, desde
que você diga ao Cake onde você colocou.

Para configurar sua instalação do Cake, você precisa fazer algumas modificações
nos seguintes arquivos.

-  /app/webroot/index.php
-  /app/webroot/test.php (se você utilizar o recurso de :doc:`Testes </development/testing>`.)

Há três constantes que você precisa editar: ``ROOT``, ``APP_DIR``, e
``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` deve ser configurada para o diretório que contém sua pasta app.
-  ``APP_DIR`` deve ser definida como o nome de sua pasta app.
-  ``CAKE_CORE_INCLUDE_PATH`` deve ser definida como o caminho da sua pasta de
   bibliotecas do CakePHP.

Vamos fazer um exemplo para que você possa ver como funciona uma instalação
avançada na prática. Imagine que eu quero que a aplicação funcione como segue:

-  O núcleo do CakePHP será colocado em /usr/lib/cake.
-  O diretório webroot da minha aplicação será /var/www/mysite/.
-  O diretório app da minha aplicação será /home/me/myapp.

Dado este tipo de configuração, eu preciso editar meu arquivo webroot/index.php
(que vai acabar em /var/www/mysite/index.php, neste exemplo) para algo como o
seguinte::

    // /app/webroot/index.php (parcial, comentários removidos)

    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

Recomenda-se a utilização da constante ``DS`` ao invés das barras para
delimitar os caminhos de arquivos. Isso previne qualquer erros sobre falta de
arquivos que você pode obter, por ter usado o delimitador errado, e isso torna
o seu código mais portável.


Apache e mod\_rewrite (e .htaccess)
===================================

O CakePHP é desenvolvido para trabalhar com o mod\_rewrite, mas percebemos que
alguns usuários apanharam para fazer isto funcionar nos seus sistemas, então
nós lhe daremos algumas dicas que você pode tentar fazer para rodar corretamente.

Aqui estão algumas coisas que você pode tentar fazer para rodar corretamente.
Primeiro veja o seu httpd.conf (tenha certeza de estar editando o httpd.conf do
sistema e não o de um usuário ou de um site específico).

#. Tenha certeza que a sobreposição do .htaccess está sendo permitida, ou seja,
   que o AllowOverride está configurado como All para o `DocumentRoot`. Você
   deve ver algo similar a isso::

       # Cada diretório com o Apache tenha acesso pode ser configurado com
       # relação aos quais serviços e recursos são permitidos e/ou
       # desabilitados neste diretório (e seus subdiretórios).
       #
       # Primeiro, configuramos o o "padrão" para ter um conjunto muito
       # restrito de recursos.
       #
       <Directory />
           Options FollowSymLinks
           AllowOverride All
       #    Order deny,allow
       #    Deny from all
       </Directory>

#. Tenha certeza de estar carregando o mod\_rewrite corretamente. Você deve ver
   algo como::

       LoadModule rewrite_module libexec/apache2/mod_rewrite.so

   Em muitos sistemas isso vem comentado por padrão (começando com um #), então
   você apenas precisa remover esses símbolos.

   Depois de fazer as alterações, reinicie o Apache para ter certeza que as
   configurações estão aivas.

   Verifique se os seus arquivos .htaccess estão nos diretórios corretos.

   Isso pode acontecer durante a cópia, pois alguns sistemas operacionais
   tratam arquivos que começam com '.' como oculto e, portanto, você não poderá
   vê-los copiar.
#. Tenha certeza que sua cópia do CakePHP é veio da seção de downloads do nosso
   site ou do nosso repositório GIT, e foi descompactada corretamente
   verificando os seus arquivos .htaccess.

   No diretório raiz do Cake (precisa ser copiado para o seu DocumentRoot, este
   redireciona tudo para a sua aplicação)::

       <IfModule mod_rewrite.c>
          RewriteEngine on
          RewriteRule    ^$ app/webroot/    [L]
          RewriteRule    (.*) app/webroot/$1 [L]
       </IfModule>

   O diretório app do seu Cake (será copiado para o diretório principal da sua
   aplicação pelo bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine on
           RewriteRule    ^$    webroot/    [L]
           RewriteRule    (.*) webroot/$1    [L]
        </IfModule>

   Diretório webroot do Cake (será copiado para a raiz da sua aplicação web
   pelo bake)::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   Para muitos serviços de hospedagem (GoDaddy, 1and1), seu servidor web
   sendo servido a partir de um diretório de usuário que já utiliza o
   mod\_rewrite. Se você está instalando o CakePHP dentro do diretório de
   um usuário (http://example.com/~username/cakephp/), ou qualquer outra
   estrutura de URL que já utiliza o mod\_rewrite, você irá precisar
   adicionar instruções RewriteBase para os arquivos .htaccess do CakePHP
   (/.htaccess, /app/.htaccess, /app/webroot/.htaccess).

   Isto pode ser adicionado à mesma seção da diretiva RewriteEngine, por
   exemplo, o arquivo .htaccess do seu webroot seria algo como::

       <IfModule mod_rewrite.c>
           RewriteEngine On
           RewriteBase /path/to/cake/app
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteRule ^(.*)$ index.php [QSA,L]
       </IfModule>

   Os detalhes dessa mudança vai depender de sua configuração, e pode incluir
   algumas coisas adicionais que não estão relacionadas ao Cake. Por favor,
   consulte a documentação online do Apache para mais informações.

URLs amigáveis e Lighttpd
=========================

Embora o Lighttpd apresenta um módulo de reescrita, ele não é equivalente ao
mod\_rewrite do Apache. Para obter 'URLs amigáveis' ao usar Lighty você tem
duas opções. Uma é usar o mod\_rewrite a outra é usar um script LUA com o
mod\_magnet.

**Usando o mod\_rewrite**
O modo mais fácil para se obter URLs amigáveis é adicionando este script
na configuração do seu lighty. Basta editar a URL, e tudo deve funcionar.
Por favor, note que isto não funciona em instalações do Cake em subdiretórios.

::

    $HTTP["host"] =~ "^(www\.)?example.com$" {
            url.rewrite-once = (
                    # if the request is for css|files etc, do not pass on to Cake
                    "^/(css|files|img|js)/(.*)" => "/$1/$2",
                    "^([^\?]*)(\?(.+))?$" => "/index.php?url=$1&$3",
            )
            evhost.path-pattern = "/home/%2-%1/www/www/%4/app/webroot/"
    }

**Usando o mod\_magnet**
Para utiizar URLs amigáveis com o CakePHP e o Lighttpd, coloque este
script LUA em /etc/lighttpd/cake.

::

    -- little helper function
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

    -- prefix without the trailing slash
    local prefix = ''

    -- the magic ;)
    if (not file_exists(lighty.env["physical.path"])) then
        -- file still missing. pass it to the fastcgi backend
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
    -- fallthrough will put it back into the lighty request loop
    -- that means we get the 304 handling for free. ;)

.. note::

    Se você estiver rodando sua instalação do CakePHP a partir de um
    subdiretório, você precisa definir o prefix = 'subdiretorio' no
    script acima

Então, informe ao Lighttpd sobre o seu vhost::

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


URLs amigáveis no nginx
=======================

nginx é um servidor popular que, como Lighttpd, usa menos recursos do sistema.
O inconveniente é que não faz uso de arquivos .htaccess como o Apache e
o Lighttpd, por isso é necessário criar as URLs reescritas na configuração
site-available. Dependendo de sua instalação, você terá que modificar isso,
mas no mínimo, você irá precisar do PHP sendo executado como FastCGI.

::

    server {
        listen   80;
        server_name www.example.com;
        rewrite ^(.*) http://example.com$1 permanent;
    }

    server {
        listen   80;
        server_name example.com;

        # root directive should be global
        root   /var/www/example.com/public/app/webroot/;
        index  index.php;

        access_log /var/www/example.com/log/access.log;
        error_log /var/www/example.com/log/error.log;

        location / {
            try_files $uri $uri/ /index.php?$uri&$args;
        }

        location ~ \.php$ {
            include /etc/nginx/fastcgi_params;
            try_files $uri =404;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

URL Rewrites no IIS7 (Windows hosts)
====================================

O IIS7 não suporta nativamente os arquivos .htaccess. Embora haja add-ons que
podem adicionar esse suporte, você também pode importar regras htaccess no IIS
para usar as regras de reescritas nativas do CakePHP. Para fazer isso, siga
estes passos:

#. Use o `Microsift Web Plataform Installer` para instalar o URL
   Rewrite Module 2.0.
#. Crie um novo arquivo dentro de sua pasta do CakePHP, chamado web.config.
#. Usando o Notepad ou algum outro editor de XML, copie o seguinte código
   no seu novo arquivo web.config...

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

Também é possível usar a funcionalidade de importação no modulo de reescrita
de URL do IIS para importar regras diretamente dos arquivos .htaccess do
CakePHP nas pastas /app/, e /app/webroot/ - embora algumas edições no IIS
podem ser necessárias para fazê-los funcionar. Importando as regras desta
maneira, o IIS irá automaticamente criar o arquivo web.config para você.

Uma vez que o arquivo web.config é criado com o conjunto de regras de reescrita do IIS,
links do CakePHP, css, js, e o redirecionamento devem funcionar corretamente.
