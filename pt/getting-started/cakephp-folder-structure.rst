Estrutura de Diretórios no CakePHP
##################################

Após ter baixado e extraído o CakePHP, você deverá encontrar os seguintes
arquivos e pastas:

-  app
-  lib
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

Você encontrará três pastas principais:

-  No diretório *app* é onde você fará sua mágica, ou seja: é o lugar
   que você colocará os arquivos de sua aplicação.
-  No diretório *lib* é onde fazemos nossa mágica. comprometa-se em não
   editar nenhum arquivo deste diretório. Não podemos ajudá-lo se você modificar
   o núcleo do framework.
-  E finalmente, no diretório *vendors* é onde você pode colocar as bibliotecas
   de terceiros que precisar usar em suas aplicações com o CakePHP.

O Diretório App
===============

No diretório app do Cake é onde você faz a maior parte do desenvolvimento
de sua aplicação. Vamos dar uma olhada mais de perto nas pastas que estão dentro
de app.

Config
    Armazena os (poucos) arquivos de configuração que o CakePHP utiliza.
    Parâmetros de conexão com o banco de dados, inicialização do sistema
    (`Bootstrapping <https://pt.wikipedia.org/wiki/Bootstrapping>`_),
    arquivos de configuração do núcleo do framework,
    e outros, devem ficar aqui.
Controller
    Contém os controllers e componentes da sua aplicação.
Lib
    Contém suas bibliotecas pessoais e diferentes das obtidas de terceiros.
    Isto permite separar as bibliotecas internas de sua empresa das que foram
    criadas por outras pessoas ou fornecedores.
Locale
    Armazena arquivos contendo strings de internacionalização.
Model
    Contém os Models, behaviors e datasources de sua aplicação.
Plugin
    Contém pacotes de plugins.
tmp
    Este diretório é onde o CakePHP armazena dados temporários. Os dados
    armazenados dependem de como você configurou o CakePHP mas geralmente
    é usada para armazenar o cache das descrições dos models, logs e por vezes
    os dados de sessão.

    Tenha certeza de que esta pasta exista e que seja gravável, senão o
    desempenho de sua aplicação será prejudicado severamente.
Vendor
    Qualquer classe ou biblioteca de terceiros devem ficar aqui.
    Fazendo isto, torna fácil acessá-las usando o método App::import('vendor',
    'name'). Olhos aguçados notaram que isto parece redundante, já
    que temos outra pasta chamada vendors, um nível acima do diretório app.
    Nós entraremos nos detalhes, explicando a diferença dos dois diretórios
    quando estivermos discutindo sobre como gerir múltiplas aplicações e
    configurações de sistemas mais complexos.
View
    Arquivos de apresentação são colocados aqui: elementos, páginas de erros,
    helpers, layouts e arquivos de views.
webroot
    Quando você configurar sua aplicação para rodar em produção, este diretório
    deve ser a raiz do seu diretório web público. Pastas aqui dentro também
    servem para colocar seus arquivos CSS, imagens e Javascripts.
