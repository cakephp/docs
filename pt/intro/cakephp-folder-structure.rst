Estrutura de Pastas do CakePHP
##############################

Depois de baixar o esqueleto da aplicação CakePHP, há algumas pastas de
nível superior que você deve ver:

- A pasta *bin* contém os executáveis de console Cake.
- A pasta *config* contém os arquivos de :doc:`/development/configuration`
  que o CakePHP usa. Detalhes de conexão de banco de dados, bootstrapping, arquivos de configuração do núcleo
  e mais devem ser armazenados aqui.
- A pasta *plugins* é onde os :doc:`/plugins` que sua aplicação usa são armazenados.
- A pasta *logs* normalmente contém seus arquivos de log, dependendo da sua
  configuração de log.
- A pasta *src* será onde os arquivos de código-fonte da sua aplicação serão colocados.
- A pasta *templates* tem arquivos de apresentação colocados aqui:
  elements, páginas de erro, layouts e arquivos de template de view.
- A pasta *resources* tem subpasta para vários tipos de arquivos de recursos.
  A subpasta *locales* armazena arquivos de idioma para internacionalização.
- A pasta *tests* será onde você colocará os casos de teste para sua aplicação.
- A pasta *tmp* é onde o CakePHP armazena dados temporários. Os dados reais que
  armazena dependem de como você configurou o CakePHP, mas esta pasta é
  geralmente usada para armazenar mensagens de tradução, descrições de modelo e às vezes
  informações de sessão.
- A pasta *vendor* é onde o CakePHP e outras dependências da aplicação serão
  instalados pelo `Composer <https://getcomposer.org>`_. Editar esses arquivos não é
  aconselhável, pois o Composer substituirá suas alterações na próxima atualização.
- O diretório *webroot* é a raiz de documento pública da sua aplicação. Ele
  contém todos os arquivos que você deseja que sejam publicamente acessíveis.

  Certifique-se de que as pastas *tmp* e *logs* existam e sejam graváveis,
  caso contrário o desempenho da sua aplicação será severamente
  impactado. No modo debug, o CakePHP irá avisá-lo se essas pastas não forem
  graváveis.

A Pasta src
===========

A pasta *src* do CakePHP é onde você fará a maior parte do desenvolvimento de sua aplicação
. Vamos dar uma olhada mais de perto nas pastas dentro de
*src*.

Command
    Contém os comandos de console da sua aplicação. Veja
    :doc:`/console-commands/commands` para saber mais.
Console
    Contém o script de instalação executado pelo Composer.
Controller
    Contém os :doc:`/controllers` da sua aplicação e seus componentes.
Middleware
    Armazena qualquer :doc:`/controllers/middleware` para sua aplicação.
Model
    Contém as tables, entities e behaviors da sua aplicação.
View
    Classes de apresentação são colocadas aqui: views, cells, helpers.

.. note::

    A pasta ``Command`` não está presente por padrão.
    Você pode adicioná-la quando precisar dela.

.. meta::
    :title lang=pt: Estrutura de Pastas do CakePHP
    :keywords lang=pt: bibliotecas internas,configuração do núcleo,descrições de modelo,fornecedores externos,detalhes de conexão,estrutura de pastas,bibliotecas de terceiros,compromisso pessoal,conexão de banco de dados,internacionalização,arquivos de configuração,pastas,desenvolvimento de aplicação,readme,lib,configurado,logs,config,terceiros,cakephp
