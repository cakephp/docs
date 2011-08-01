Instalação
##########

O CakePHP é rápido e fácil de instalar. Os requisitos mínimos são um servidor
web e uma cópia do Cake, só isso! Apesar deste manual focar principalmente na
configuração do Apache (porque ele é o mais comum), você pode configurar o Cake
para executar em diversos servidores web, tais como LightHTTPD ou Microsoft IIS.

A preparação para a instalação consiste nos seguintes passos:

-  Baixando uma cópia do CakePHP
-  Configurando o servidor web para manipular o PHP, se necessário
-  Verificando as permissões de arquivos

Baixando o CakePHP
==================

Há duas principais maneiras de obter uma nova cópia do CakePHP. Você pode
baixar uma cópia do arquivo (zip/tar.gz/tar.bz2) a partir do site principal, ou
fazer uma cópia do repositório git.

Para baixar a última versão do CakePHP. Visite o site `http://www.cakephp.org <http://www.cakephp.org>`_
e siga o link "Download Now".  

Todas as versões atuais do CakePHP estão hospedadas no `Github <http://github.com/cakephp>`_.
O Github é a casa tanto do CakePHP em si, como de muitos outros plugins. As
versões estão disponíveis em `Github downloads <http://github.com/cakephp/cakephp/downloads>`_.

Alternativamente você pode pegar os códigos que acabaram de sair, com todoas as
correções de bugs e melhorias do último minuto (bem, do útlimo dia). Estes
podem ser acessados a partir da clonagem do repositório. `Github`_. 

Permissões
==========

O CakePHP usa o diretório /app/tmp para diferentes operações. Descrições do
modelo, cache das `views`, e informações das sessões são alguns exemplos.

Assim, tenha certeza que o diretório /app/tmp na sua instalação do cake
permite a escrita pelo usuário do servidor web.

Configuração
============

Configurar o CakePHP pode ser tão simples como descompactá-lo em seu servidor
web, ou tão complexo e flexível se vocẽ desejar. Esta seção irá cobrir três
principais tipos de instalação do CakePHP: desenvolvimento, produção e
avançada.

-  Desenvolvimento: fácil para começar, as URLs da aplicação incluem o nome do
   diretório de instalação e é menos seguro.
-  Produção: Requer maior habilidaded para configurar o diretório raiz do
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

Descompacte o conteúdo do arquivo do Cake em /var/www/html. Você agora tem
uma pasta na raiz do seu servidor web com o nome da versão que você baixou (por
exemplo, cake\2.0.0). Renomeie essa pasta para cake\_2\_0. Sua configuração de
desenvolvimento será semelhante a esta em seu sistema de arquivos:

-  /var/www/html

  -  /cake\_2\_0

     -  /app
     -  /lib
     -  /vendors
     -  /plugins
     -  /.htaccess
     -  /index.php
     -  /README

Se o seu servidor web está configurado corretamente, agora você deve encontrar
sua aplicação Cake acessível em http://www.example.com/cake\_2\_0/.

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
Sua configuração de produção será semelhante a esta em seu sistema de arquivos:

-  /cake\_install/
   
   -  /app
      
      -  /webroot (this directory is set as the ``DocumentRoot`` directive)

   -  /lib
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README


Desenvolvedores usando o Apache devem definir o ``DocumentRoot`` do domínio para::

    DocumentRoot /cake_install/app/webroot

Se o seu servidor web estiver configurado corretamente, você deve encontrar
agora sua aplicação Cake acessível em http://www.example.com. 

Instalação Avançada e Configuração Específica por Servidor
==========================================================

.. toctree::

   installation/advanced-installation

Começe agora!
=============

Tudo bem, vamos ver o CakePHP em ação. Dependendo de qual configuração você
adotou, você deve apontar seu navegador para http://example.com/ ou
http://example.com/cake\_install/. Neste ponto, você verá a página padrão do
CakePHP e a mensagem do estado da configuração do seu banco de dados.

Parabéns! Você já pode criar sua primeira aplicação CakePHP.

Não está funcionando? Se você estiver recebendo erros do PHP relacionados ao
fuso horário, descomente uma linha no app/Config/core.

::

   <?php
   /**
    * If you are on PHP 5.3 uncomment this line and correct your server timezone
    * to fix the date & time related errors.
    */
       date_default_timezone_set('UTC');
