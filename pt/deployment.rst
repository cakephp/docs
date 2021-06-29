Implantação
###########

Uma vez que sua aplicação está completa, ou mesmo antes quando você quiser
colocá-la no ar. Existem algumas poucas coisas que você deve fazer quando
colocar em produção uma aplicação CakePHP.

Atualizar config/app.php
========================

Atualizar o arquivo **core.php**, especificamente o valor do ``debug`` é de
extrema importância. Tornar o debug igual a ``false`` desabilita muitos recursos
do processo de desenvolvimento que nunca devem ser expostos ao mundo.
Desabilitar o debug, altera as seguintes coisas:

* Mensagens de depuração criadas com :php:func:`pr()` e :php:func:`debug()`
  serão desabilitadas.
* O cache interno do CakePHP será descartado após 999 dias ao invés de ser a
  cada 10 segundos como em desenvolvimento.
* Views de erros serão menos informativas, retornando mensagens de erros
  genéricas.
* Erros do PHP não serão mostrados.
* O rastreamento de stack traces (conjunto de exceções) será desabilitado.

Além dos itens citados acima, muitos plugins e extensões usam o valor do
``debug`` para modificarem seus comportamentos.

Por exemplo, você pode setar uma variável de ambiente em sua configuração do
Apache::

    SetEnv CAKEPHP_DEBUG 1

E então você pode definir o level de debug dinamicamente no **config/app.php**::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

Checar a segurança
==================

Se você está jogando sua aplicação na selva, é uma boa idéia certificar-se
que ela não possui vulnerabilidades óbvias:

* Certifique-se de utilizar o :ref:`csrf-middleware`.
* Você pode querer habilitar o :doc:`/controllers/components/security`.
  Isso pode prevenir diversos tipos de adulteração de formulários e reduzir
  a possibilidade de overdose de requisições.
* Certifique-se que seus models possuem as regras
  :doc:`/core-libraries/validation` de validação habilitadas.
* Verifique se apenas o seu diretório ``webroot`` é visível publicamente, e que
  seus segredos (como seu app salt, e qualquer chave de segurança) são privados
  e únicos também.

Definir a raiz do documento
===========================

Definir a raiz do documento da sua aplicação corretamente é um passo importante
para manter seu código protegido e sua aplicação mais segura. As aplicações
desenvolvidas com o CakePHP devem ter a raiz apontando para o diretório
``webroot``. Isto torna a aplicação e os arquivos de configurações
inacessíveis via URL. Configurar a raiz do documento depende de cada servidor
web. Veja a :ref:`url-rewriting` para informações sobre servidores web
específicos.

De qualquer forma você vai querer definir o host/domínio virtual para o
``webroot/``. Isso remove a possibilidade de arquivos fora do diretório raiz
serem executados.

.. _symlink-assets:

Aprimorar a performance de sua aplicação
========================================

O carregamento de classes pode alocar facilmente o tempo de processamento de
sua aplicação. A fim de evitar esse problema, é recomendado que você execute
este comando em seu servidor de produção uma vez que a aplicação esteja
implantada::

    php composer.phar dumpautoload -o

Sabendo que manipulação de referências estáticas, como imagens, JavaScript e
arquivos CSS, plugins, através do ``Dispatcher`` é incrivelmente ineficiente, é
fortemente recomendado referenciá-los simbolicamente para produção. Por
exemplo::

    ln -s Plugin/YourPlugin/webroot/css/yourplugin.css webroot/css/yourplugin.css

.. meta::
    :title lang=pt: Implementação
    :keywords lang=pt: config,extensões,definir documento,instalação,documentação,recursos,erros genéricos,raiz do documento,func,debug,caches,mensagens de erro,arquivos de configuração,webroot,implementação,cakephp,aplicação,raiz,segurança
