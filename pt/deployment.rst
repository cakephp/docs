Implementação
#############

Uma vez que sua aplicação está completa, ou mesmo antes quando você quiser
colocá-la no ar. Existem algumas poucas coisas que você deve fazer quando
colocar em produção uma aplicação CakePHP.

Definindo a Raiz
================

Definir a raiz do documento da sua aplicação corretamente é um passo importante
para manter seu código protegido e sua aplicação mais segura. As aplicações
desenvolvidas com o CakePHP devem ter a raiz apontando para o diretório
``app/webroot``. Isto torna a aplicação e os arquivos de configurações
inacessíveis via URL. Configurar a raiz do documento depende de cada webserver.
Veja a :doc:`/installation/advanced-installation` para informações sobre
webservers específicos.

Atualizar o core.php
====================

Atualizar o arquivo ``core.php``, especificamente o valor do ``debug`` é de extrema
importância. Tornar o debug igual a ``0`` desabilita muitos recursos do processo
de desenvolvimento que nunca devem ser expostos ao mundo. Desabilitando o debug,
as coisas a seguir mudarão:

* Mensagens de depuração criadas com :php:func:`pr()` e :php:func:`debug()`
  serão desabilitadas.
* O cache interno do CakePHP será descartado após 99 anos em vez de 10 segundos.
* `Views` de erros serão menos informativas, retornando mensagens de erros
  genéricas.
* Erros não serão mostrados.
* O rastro da pilha de exceções será desabilitado.

Além dos itens citados acima, muitos plugins e extensões usam o valor do
``debug`` para modificarem seus comportamentos.

Multiplas aplicações usando o mesmo core do CakePHP
===================================================

Existem algumas maneiras de você configurar múltiplas aplicações para usarem
o mesmo `core` (núcleo) do CakePHP. Você pode usar o ``include_path`` do PHP ou
definir a constante ``CAKE_CORE_INCLUDE_PATH`` no ``webroot/index.php`` da sua
aplicação. Geralmente, usar o ``include_path`` do PHP é a meneira mais fácil e
robusta pois o CakePHP já vem pré-configurado para olhar o ``include_path``.

No seu arquivo ``php.ini`` localize a diretiva ``include_path`` existente e
anexe no final o caminho para o diretório ``lib`` do CakePHP::

    include_path = '.:/usr/share/php:/usr/share/cakephp-2.0/lib'

Assumimos que você está rodando um servidor \*nix e instalou o CakePHP em
``/usr/share/cakephp-2.0``.
