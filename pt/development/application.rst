Aplicação
#########

O ``Application`` é o coração do seu aplicativo. Ele controla como seu aplicativo está configurado e quais plugins, 
middleware, rotas e comandos de console estão incluídos.

Você pode encontrar sua classe ``Application`` em **src/Application.php**. Por padrão, ele será bem simples e definirá apenas 
alguns padrões. :doc:`/controllers/middleware`. Os aplicativos podem definir os seguintes métodos de gancho:

* ``bootstrap`` usado para carregar :doc:`arquivos de configuração</development/configuration>`, 
  define constantes e outras funções globais. Por padrão, isso inclui **config/bootstrap.php**. Este é o lugar ideal para
  carregar :doc:`/plugins` e :doc:`ouvintes de eventos </core-libraries/events>`.
* ``routes`` usado para carregar :doc:`routes </development/routing>`. Por padrão isso inclui **config/routes.php**.
* ``middleware`` usado para adicionar :doc:`middleware </controllers/middleware>` em sua aplicação.
* ``console`` usado para adicionar :doc:`console commands </console-and-shells>` em sua aplicação. 
  Por padrão, isso vai automaticamente descobrir shells e comandos em sua aplicação e também todos os plugins.

.. _adding-http-stack:

Adicionando a nova pilha HTTP a um aplicativo existente
=======================================================

O uso da classe ``Application`` e do HTTP Middleware em um aplicativo existente requer algumas alterações no seu código.

#. Primeiro atualize seu arquivo **webroot/index.php**. Copie e cole o conteúdo do arquivo de `app
   skeleton <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Crie uma classe ``Application``. Veja a seção :ref:`using-middleware`
    acima para saber como fazer isso. Ou copie o exemplo no `app skeleton 
    <https://github.com/cakephp/app/tree/master/src/Application.php>`__.
#. Crie **config/requirements.php** se não existir e adicione o conteúdo de `app skeleton <https://github.com/cakephp/app/blob/master/config/requirements.php>`__.
#. Adicione a ``cake_routes`` uma definição de cache em **config/app.php**, se ainda não estiver lá.
#. Atualize o arquivo **config/bootstrap.php** e **config/bootstrap_cli.php** de acordo com `app_skeleton <https://github.com/cakephp/app/tree/master/config/bootstrap.php>`__,
   tomando cuidado para preservar quaisquer adições e alterações específicas de seu aplicativo. 
   As atualizações do bootstrap.php incluem:
   
   * Desabilitar o cache ``_cake_routes_`` em modo de desenvolvimento
   * Remover a seção de requerimentos (agora em **config/requirements.php**)
   * Remover o carregamento do plugin DebugKit (agora em **src/Application.php**)
   * Remover a importação de **autoload.php** (agora em **webroot/index.php**)
   * Remover a referência ``DispatcherFactory``
#. Atualize o conteúdo dos arquivos em **bin** . Substitua os arquivos pelas versões do `app skeleton
   <https://github.com/cakephp/app/tree/master/bin>`__.
#. Se você estiver usando o ``CsrfProtectionMiddleware`` certifique-se de remover
   ``CsrfComponent`` de seus controladores.

Após a conclusão dessas etapas, você estará pronto para começar a reimplementar qualquer filtro de 
aplicativo/plug-in como middleware HTTP.

Se você estiver executando testes, também precisará atualizar seu arquivo 
**tests/bootstrap.php** copiando o conteúdo do arquivo de `app skeleton
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_.

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication
