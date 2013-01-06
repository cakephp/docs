Estrutura de arquivos do CakePHP
################################

Depois de ter baixado e extraído o CakePHP, estes são os arquivos e
pastas que você deve ver:

-  app
-  cake
-  vendors
-  .htaccess
-  index.php
-  README

 

Você verá três pastas principais:

-  A pasta *app* será onde você fará a mágica: e onde os arquivos da sua
   aplicação ficará.
-  A pasta *cake* é onde fazemos a nossa mágica. Tenha um compromisso
   pessoal de **não** editar os arquivos nesta pasta. Nós não poderemos
   ajudá-lo caso você tenha alterado o núcleo do CakePHP.
-  Finalmente, a pasta *vendors* é onde você irá colocar bibliotecas PHP
   desenvolvidas por terceiros que você venha precisar usar junto com a
   sua aplicação desenvolvida com o CakePHP.

Estrutura do diretório App
==========================

A pasta app do CakePHP é onde normalmente você colocará sua aplicação em
desenvolvimento. Vamos dar uma olhada mais de perto dentro desta pasta.

config
    Contém os arquivos de configuração. Detalhes das conexões ao banco
    de dados, bootstrapping, arquivos de configuração do núcleo e outros
    devem ser armazenados aqui.
controllers
    Contém os controladores da sua aplicação e seus componentes.
locale
    Guarda os arquivos com as strings para internacionalização.
models
    Contém os modelos, behaviors e datasources da sua aplicação.
plugins
    Contém os pacotes de plugins.
tmp
    Aqui é onde o CakePHP armazena os arquivos temporários. Os dados
    atuais são armazenados onde você tenha configurado o CakePHP, mas
    esta pasta normalmente é usada para guardar a descrição dos modelos,
    logs e outras informações, como as das sessões.
vendors
    Qualquer classe ou biblioteca de terceiro deve ser armazenada aqui.
    Para fazer um acesso rápido e fácil, use a função vendors(). Você
    pode achar que esta pasta é redundante, já que existe uma pasta com
    mesmo nome no nível superior da estrutura. Nós vamos ver diferenças
    entre estas duas pastas quando discutirmos sobre manipulação de
    múltiplas aplicações e sistemas mais complexos.
views
    Arquivos de apresentação devem vir aqui: elementos, páginas de erro,
    ajudantes, layouts e arquivos de visões.
webroot
    No modo de produção, esta pasta deve servir como a pasta raiz da sua
    aplicação. Dentro desta pasta são guardados os arquivos públicos,
    como estilos CSS, imagens e arquivos de JavaScript.

