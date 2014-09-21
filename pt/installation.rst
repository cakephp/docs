Instalação
##########

O CakePHP é rápido e fácil de instalar. Os requisitos mínimos são um servidor
web e uma cópia do Cake, só isso! Apesar deste manual focar principalmente na
configuração do Apache (porque ele é o mais comum), você pode configurar o Cake
para executar em diversos servidores web, tais como LightHTTPD ou Microsoft IIS.

Requisitos
==========

-  Servidor HTTP. Por exemplo: Apache. É preferível ter o mod\_rewrite
   habilitado mas não é uma exigência.
-  PHP 5.2.8 ou superior.

Tecnicamente não é exigido um banco de dados mas imaginamos que a maioria
das aplicações irá utilizar um. O CakePHP suporta uma variedade deles:

-  MySQL (4 ou superior)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    Todos os drivers inclusos internamente requerem o PDO. Você deve ter certeza
    que possui a extensão correta do PDO instalada.

Licença
=======

O CakePHP é licenciado sob uma Licença MIT. Isto significa que você tem
liberdade para modificar, distribuir e republicar o código-fonte com a condição
de que os avisos de `copyright` permaneçam intactos. Você também tem liberdade
para incorporar o CakePHP em qualquer aplicação comercial ou de código fechado.

Baixando o CakePHP
==================

Há duas maneiras de se obter uma cópia atualizada do CakePHP. Você pode fazer
o download de um arquivo comprimido (zip/tar.gz/tar.bz2) no site principal ou
obter o código a partir do repositório git.

Para fazer o download da versão estável mais recente do CakePHP, visite o site
principal `http://cakephp.org <http://cakephp.org>`_. Lá haverá um link
chamado “Download Now!” para baixar.

Todas as versões liberadas do CakePHP estão hospedadas no
`Github <http://github.com/cakephp/cakephp>`_. O Github do CakePHP abriga o
próprio Cake assim como muitos outros plugins para ele. As versões disponíveis
estão na página
`Github tags <https://github.com/cakephp/cakephp/tags>`_.

Alternativamente você pode obter uma cópia contendo todas as correções de bugs e
atualizações recentes clonando o repositório do Github::

    git clone git://github.com/cakephp/cakephp.git

Permissões
==========

O CakePHP usa o diretório ``/app/tmp`` para diferentes operações. Descrições do
modelo, cache das `views`, e informações das sessões são alguns exemplos.

Assim, tenha certeza que o diretório ``/app/tmp`` na sua instalação do cake
permite a escrita pelo usuário do servidor web.

Um problema comum é que ambos os diretórios e subdiretórios de app/tmp devem
poder ser gravados pelo servidor web e pelo usuário da linha de comando.  Em um
sistema UNIX, se o seu usuário do servidor web é diferente do seu usuário da
linha de comando, você pode pode executar os seguintes comandos apenas uma vez
em seu projeto para assegurar que as permissões serão configuradas
apropriadamente::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

Configuração
============

Configurar o CakePHP pode ser tão simples como descompactá-lo em seu servidor
web, ou tão complexo e flexível se você desejar. Esta seção irá cobrir três
principais tipos de instalação do CakePHP: desenvolvimento, produção e
avançada.

-  Desenvolvimento: fácil para começar, as URLs da aplicação incluem o nome do
   diretório de instalação e é menos seguro.
-  Produção: Requer maior habilidade para configurar o diretório raiz do
   servidor web, URLs limpas, muito seguro.
-  Avançada: Com algumas configurações, permite que você coloque os diretórios
   do CakePHP em diferentes locais do sistema de arquivos, permitindo
   compartilhar o núcleo do CakePHP entre diversas aplicações.

Desenvolvimento
===============

A instalação de desenvolvimento é o método mais rápido de configuração do Cake.
Este exemplo irá te ajudar a instalar uma aplicação CakePHP e torná-la
disponível em http://www.example.com/cake\_2\_0/. Assumimos, para efeitos deste
exemplo que a sua raiz do documento é definido como /var/www/html.

Descompacte o conteúdo do arquivo do Cake em ``/var/www/html``. Você agora tem
uma pasta na raiz do seu servidor web com o nome da versão que você baixou (por
exemplo, cake\2.0.0). Renomeie essa pasta para cake\_2\_0. Sua configuração de
desenvolvimento será semelhante a esta em seu sistema de arquivos::

    /var/www/html/
        cake_2_0/
            app/
            lib/
            plugins/
            vendors/
            .htaccess
            index.php
            README

Se o seu servidor web está configurado corretamente, agora você deve encontrar
sua aplicação Cake acessível em http://www.example.com/cake\_2\_0/.

Utilizando um pacote CakePHP para múltiplas Aplicações
------------------------------------------------------

Se você está desenvolvendo uma série de aplicações, muitas vezes faz sentido que
elas compartilhem o mesmo pacote. Existem algumas maneiras em que você pode
alcançar este objetivo. Muitas vezes, o mais fácil é usar o PHP
``include_path``.  Para começar, clone o CakePHP em um diretório. Para esse
exemplo, nós vamos utilizar ``/home/mark/projects``::

    git clone git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

Isso ira clonar o CakePHP no seu diretório ``/home/mark/projects``. Se você não
quiser utilizar git, você pode baixar um compilado e os próximos passos serão os
mesmos. Em seguida você terá que localizar e modificar seu ``php.ini``. Em
sistemas \*nix está localizado na maioria das vezes em ``/etc/php.ini``, mas
utilizando ``php -i`` e procurando por 'Loaded Configuration File', você pode
achar a localização atual. Uma vez que você achou o arquivo ini correto,
modifique a configuração ``include_path`` para incluir
``/home/mark/projects/cakephp/lib``. Um exemplo semelhamte deveria ser como::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

Depois de reiniciar seu servidor web, você deve ver as mudanças refletidas em
``phpinfo()``.

.. note::

    Se você estiver no windows, separe os caminhos de inclusão com ; ao invés de :

Finalizando a definição do seu ``include_path`` suas aplicações devem estar prontas para
encontrar o CakePHP automaticamente.

Produção
========

A instalação de produção é uma forma mais flexível de configuração do Cake
Usando este método permite um total domínio para agir como uma única aplicação
CakePHP. Este exemplo irá ajudá-lo a instalar o Cake em qualquer lugar do seu
sistema de arquivos e torná-lo disponível em http://www.example.com. Note que
esta instalação pode requerer os privilégios para alteração do DocumentRoot do
servidor apache.

Descompacte o conteúdo do arquivo do Cake em um diretório de sua escolha. Para
fins deste exemplo, assumimos que você escolheu instalar o Cake em /cake\_install.
Sua configuração de produção será semelhante a esta em seu sistema de arquivos::

    /cake_install/
        app/
            webroot/ (esse diretório está definido como diretiva ``DocumentRoot``)
        lib/
        plugins/
        vendors/
        .htaccess
        index.php
        README

Desenvolvedores usando o Apache devem definir o ``DocumentRoot`` do domínio para::

    DocumentRoot /cake_install/app/webroot

Se o seu servidor web estiver configurado corretamente, você deve encontrar
agora sua aplicação Cake acessível em http://www.example.com. 

Instalação Avançada e Configuração Específica por Servidor
==========================================================

.. toctree::
    :maxdepth: 1

   installation/advanced-installation

Comece agora!
=============

Tudo bem, vamos ver o CakePHP em ação. Dependendo de qual configuração você
adotou, você deve apontar seu navegador para http://example.com/ ou
http://example.com/cake\_install/. Neste ponto, você verá a página padrão do
CakePHP e a mensagem do estado da configuração do seu banco de dados.

Parabéns! Você já está pronto para :doc:`criar sua primeira aplicação CakePHP
</getting-started>`.

Não está funcionando? Se você estiver recebendo erros do PHP relacionados ao
fuso horário, descomente uma linha no app/Config/core.php::

   /**
    * Uncomment this line and correct your server timezone to fix 
    * any date & time related errors.
    */
       date_default_timezone_set('UTC');
