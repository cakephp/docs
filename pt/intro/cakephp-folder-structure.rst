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
- O diretório *vendor* será onde o CakePHP e outras dependências da aplicação
  serão instalados. Faça uma nota pessoal para **não** editar arquivos deste
  diretório. Nós não podemos ajudar se você tivé-lo feito.
- O diretório *webroot* será a raíz pública de documentos da sua aplicação. Ele
  contem todos os arquivos que você gostaria que fossem públicos.

  Certifique-se que os diretórios *tmp* e *logs* existem e são passíveis de
  escrita, senão a performance de sua aplicação será severamente impactada. Em
  modo de debug, o CakePHP irá alertá-lo se este for o caso.

O diretório src
===============

O diretório *src* do CakePHP é onde você fará a maior parte do desenvolvimento
de sua aplicação. Vamos ver mais de perto a estrutura de pastas dentro de *src*.

Console
    Contém os comandos e tarefas de console para sua aplicação.
    Para mais informações veja :doc:`/console-and-shells`.
Controller
    Contém os controllers de sua aplicação e seus componentes.
Locale
    Armazena arquivos textuais para internacionalização.
Model
    Contém as tables, entities e behaviors de sua aplicação.
View
    Classes de apresentação são alocadas aqui: cells, helpers, e arquivos view.
Template
    Arquivos de apresentação são alocados aqui: elements, páginas de erro,
    layouts, e templates view.


.. meta::
    :title lang=pt: Estrutura de pastas do CakePHP
    :keywords lang=pt: bibliotecas internas,configuração do cakephp,descrições dos modelos,vendors,detalhes de conexão,estrutura de pastas,bibliotecas de parceiros,banco de dados,internacionalização,arquivos de configuração,diretórios,pastas,desenvolvimento da aplicação,leia-me,lib,configurado,logs,config,externo,cakephp
