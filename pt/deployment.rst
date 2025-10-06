Implantação
###########

Quando sua aplicação estiver pronta para ser implantada, há algumas coisas que você deve fazer.

Movendo arquivos
================

Você pode clonar seu repositório em seu servidor de produção e então fazer checkout do
commit/tag que deseja executar. Em seguida, execute ``composer install``. Embora isso exija
algum conhecimento sobre git e uma instalação existente de ``git`` e ``composer``,
este processo cuidará das dependências de bibliotecas e permissões de arquivos e pastas.

Esteja ciente de que ao implantar via FTP você terá que corrigir as permissões de arquivos e
pastas.

Você também pode usar esta técnica de implantação para configurar um servidor de staging ou demonstração
(pré-produção) e mantê-lo sincronizado com seu ambiente local.

Ajustando a Configuração
=========================

Você vai querer fazer alguns ajustes na configuração de sua aplicação para
um ambiente de produção. O valor de ``debug`` é extremamente importante.
Definir debug = ``false`` desabilita uma série de recursos de desenvolvimento que nunca
devem ser expostos à Internet em geral. Desabilitar debug altera os seguintes
recursos:

* Mensagens de debug, criadas com :php:func:`pr()`, :php:func:`debug()` e :php:func:`dd()` são
  desabilitadas.
* A duração dos caches do núcleo do CakePHP é padronizada para 365 dias, em vez de 10 segundos
  como no desenvolvimento.
* As visualizações de erro são menos informativas, e páginas de erro genéricas são exibidas
  em vez de mensagens de erro detalhadas com rastreamento de pilha.
* Avisos e Erros do PHP não são exibidos.

Além do exposto acima, muitos plugins e extensões de aplicação usam ``debug``
para modificar seu comportamento.

Você pode verificar uma variável de ambiente para definir o nível de debug dinamicamente
entre ambientes. Isso evitará implantar uma aplicação com debug
``true`` e também evitará ter que alterar o nível de debug toda vez
antes de implantar em um ambiente de produção.

Por exemplo, você pode definir uma variável de ambiente em sua configuração do Apache::

    SetEnv CAKEPHP_DEBUG 1

E então você pode definir o nível de debug dinamicamente em **app_local.php**::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

É recomendado que você coloque a configuração que é compartilhada entre todos
os ambientes de sua aplicação em **config/app.php**. Para configuração que
varia entre ambientes, use **config/app_local.php** ou variáveis de
ambiente.

Verifique sua Segurança
=======================

Se você está lançando sua aplicação para o mundo, é uma boa ideia certificar-se
de que ela não tem vazamentos óbvios:

* Certifique-se de que está usando o componente ou middleware :ref:`csrf-middleware`.
* Você pode querer habilitar o componente :doc:`/controllers/components/form-protection`.
  Ele pode ajudar a prevenir vários tipos de adulteração de formulários e reduzir a possibilidade
  de problemas de atribuição em massa.
* Certifique-se de que seus models tenham as regras corretas de :doc:`/core-libraries/validation`
  habilitadas.
* Verifique se apenas seu diretório ``webroot`` está publicamente visível, e que seus
  segredos (como o salt da aplicação e quaisquer chaves de segurança) são privados e únicos
  também.

Definir a Raiz do Documento
============================

Definir a raiz do documento corretamente em sua aplicação é um passo importante para
manter seu código seguro e sua aplicação mais protegida. As aplicações CakePHP
devem ter a raiz do documento definida para o ``webroot`` da aplicação. Isso
torna os arquivos de aplicação e configuração inacessíveis através de uma URL.
Definir a raiz do documento é diferente para diferentes servidores web. Veja a
documentação :ref:`url-rewriting` para informações específicas do servidor web.

Em todos os casos, você vai querer definir o documento do host virtual/domínio para ser
``webroot/``. Isso remove a possibilidade de arquivos fora do diretório webroot
serem executados.

.. _symlink-assets:

Melhore o Desempenho de sua Aplicação
======================================

O carregamento de classes pode ocupar uma grande parte do tempo de processamento de sua aplicação.
Para evitar este problema, é recomendado que você execute este comando em
seu servidor de produção uma vez que a aplicação for implantada::

    php composer.phar dumpautoload -o

Como lidar com ativos estáticos, como imagens, arquivos JavaScript e CSS de
plugins, através do ``Dispatcher`` é incrivelmente ineficiente, é fortemente
recomendado criar links simbólicos para eles em produção. Isso pode ser feito usando
o comando ``plugin``::

    bin/cake plugin assets symlink

O comando acima criará links simbólicos do diretório ``webroot`` de todos os plugins carregados
para o caminho apropriado no diretório ``webroot`` da aplicação.

Se seu sistema de arquivos não permitir criar links simbólicos, os diretórios serão
copiados em vez de ter links simbólicos criados. Você também pode copiar explicitamente os diretórios
usando::

    bin/cake plugin assets copy

O CakePHP usa ``assert()`` internamente para fornecer verificação de tipo em tempo de execução e
fornecer melhores mensagens de erro durante o desenvolvimento. Você pode fazer com que o PHP ignore essas
asserções atualizando seu ``php.ini`` para incluir:

.. code-block:: ini

   ; Desligar a geração de código assert().
   zend.assertions = -1

Pular a geração de código para ``assert()`` resultará em melhor desempenho em tempo de execução,
e é recomendado para aplicações que têm boa cobertura de testes ou que estão
usando um analisador estático.

Implantando uma atualização
============================

Em cada implantação, você provavelmente terá algumas tarefas para coordenar em seu servidor web. Algumas típicas
são:

1. Instalar dependências com ``composer install``. Evite usar ``composer
   update`` ao fazer implantações, pois você pode obter versões inesperadas de pacotes.
2. Execute `migrations </migrations/>`__ de banco de dados com o plugin Migrations
   ou outra ferramenta.
3. Limpe o cache de schema do model com ``bin/cake schema_cache clear``. O :doc:`/console-commands/schema-cache`
   tem mais informações sobre este comando.

.. meta::
    :title lang=pt: Implantação
    :keywords lang=pt: rastreamento de pilha,extensões de aplicação,definir documento,documentação de instalação,recursos de desenvolvimento,erro genérico,raiz do documento,func,debug,caches,mensagens de erro,arquivos de configuração,webroot,implantação,cakephp,aplicações
