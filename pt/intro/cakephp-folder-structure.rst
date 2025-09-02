Estrutura de pastas do CakePHP
##############################

Depois de você ter baixado e extraído o CakePHP, aí estão os arquivos e pastas
que você deve ver:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

Você notará alguns diretórios principais:

- O diretório *bin* contem os executáveis por console do Cake.
- O diretório *config* contem os (poucos) :doc:`/development/configuration`
  arquivos de configuração que o CakePHP utiliza. Detalhes de conexão com banco
  de dados, inicialização, arquivos de configuração do núcleo da aplicação, e
  relacionados devem ser postos aqui.
- O diretório *logs* será normalmente onde seus arquivos de log ficarão,
  dependendo das suas configurações.
- O diretório *plugins* será onde :doc:`/plugins` que sua aplicação utiliza
  serão armazenados.
- O diretório *src* será onde você fará sua mágica: é onde os arquivos
  da sua aplicação serão colocados.
- O diretório *tests* será onde você colocará os casos de teste para sua
  aplicação.
- O diretório *tmp* será onde o CakePHP armazenará dados temporários. O modo
  como os dados serão armazenados depende da configuração do CakePHP, mas esse
  diretório é comumente usado para armazenar descrições de modelos e algumas
  vezes informação de sessão.
- O diretório *vendor* é onde o CakePHP e outras dependências do aplicativo serão
  instaladas pelo `Composer <https://getcomposer.org>`_. Editar esses arquivos não é
  aconselhável, pois o Composer substituirá suas alterações na próxima atualização.
- O diretório *webroot* será a raíz pública de documentos da sua aplicação. Ele
  contem todos os arquivos que você gostaria que fossem públicos.

  Certifique-se que os diretórios *tmp* e *logs* existem e são passíveis de
  escrita, senão a performance de sua aplicação será severamente impactada. Em
  modo de debug, o CakePHP irá alertá-lo se este for o caso.

O diretório src
===============

O diretório *src* do CakePHP é onde você fará a maior parte do desenvolvimento
de sua aplicação. Vamos ver mais de perto a estrutura de pastas dentro de *src*.

Command
    Contém os comandos de console para sua aplicação. Consulte
    :doc:`/console-commands/commands` para saber mais.
Console
    Contém o script de instalação executado pelo Composer.
Controller
    Contém os :doc:`/controllers` de sua aplicação e seus componentes.
Middleware
    Armazena qualquer :doc:`/controllers/middleware` para seu aplicativo.
Model
    Contém as tables, entities e behaviors de sua aplicação.
View
    Classes de apresentação são alocadas aqui: cells, helpers, e arquivos view.

.. note::

    A pasta ``Command`` não está presente por padrão.
    Você pode adicioná-la quando precisar.

.. meta::
    :title lang=pt: Estrutura de pastas do CakePHP
    :keywords lang=pt: bibliotecas internas,configuração do cakephp,descrições dos modelos,vendors,detalhes de conexão,estrutura de pastas,bibliotecas de parceiros,banco de dados,internacionalização,arquivos de configuração,diretórios,pastas,desenvolvimento da aplicação,leia-me,lib,configurado,logs,config,externo,cakephp
