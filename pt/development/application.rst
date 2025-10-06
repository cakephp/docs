Application
###########

A ``Application`` é o coração da sua aplicação. Ela controla
como sua aplicação é configurada, e quais plugins, middleware, comandos
de console e rotas são incluídos.

Você pode encontrar sua classe ``Application`` em **src/Application.php**. Por padrão
ela será bem simples e apenas definirá alguns :doc:`/controllers/middleware` padrão.
As aplicações podem definir os seguintes métodos de gancho:

* ``bootstrap`` Usado para carregar :doc:`arquivos de configuração
  </development/configuration>`, definir constantes e outras funções globais.
  Por padrão isso incluirá **config/bootstrap.php**. Este é o lugar ideal
  para carregar :doc:`/plugins` e :doc:`ouvintes de eventos </core-libraries/events>` globais.
* ``routes`` Usado para carregar :doc:`routes </development/routing>`. Por padrão isso
  incluirá **config/routes.php**.
* ``middleware`` Usado para adicionar :doc:`middleware </controllers/middleware>` à sua aplicação.
* ``console`` Usado para adicionar :doc:`comandos de console </console-commands>` à sua
  aplicação. Por padrão isso descobrirá automaticamente comandos de console em
  sua aplicação e todos os plugins.

Inicializando sua Aplicação
===========================

Se você tiver necessidades de configuração adicionais, você deve adicioná-las ao
arquivo **config/bootstrap.php** da sua aplicação. Este arquivo é incluído antes de cada
requisição e comando CLI.

Este arquivo é ideal para várias tarefas comuns de inicialização:

- Definir funções de conveniência.
- Declarar constantes.
- Definir configuração de cache.
- Definir configuração de logging.
- Carregar inflexões personalizadas.
- Carregar arquivos de configuração.

Pode ser tentador colocar funções de formatação lá para usá-las em
seus controllers. Como você verá nas seções :doc:`/controllers` e :doc:`/views`
existem maneiras melhores de adicionar lógica personalizada à sua aplicação.

.. _application-bootstrap:

Application::bootstrap()
------------------------

Além do arquivo **config/bootstrap.php** que deve ser usado para
configurar preocupações de baixo nível da sua aplicação, você também pode usar o
método de gancho ``Application::bootstrap()`` para carregar/inicializar plugins e anexar
ouvintes de eventos globais::

    // in src/Application.php
    namespace App;

    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // Call the parent to `require_once` config/bootstrap.php
            parent::bootstrap();

            // CakePHP has the ability to fallback to using the `Cake\ORM\Table`
            // class to represent your database tables when a related class is
            // not created for that table. But using this "auto-tables" feature
            // can make debugging more difficult in some scenarios. So we disable
            // this feature except for the CLI environment (since the classes
            // would not be present when using the `bake` code generation tool).
            if (PHP_SAPI !== 'cli') {
                FactoryLocator::add(
                    'Table',
                    (new TableLocator())->allowFallbackClass(false)
                );
            }

            // Load MyPlugin
            $this->addPlugin('MyPlugin');
        }
    }

Carregar plugins e eventos em ``Application::bootstrap()`` torna
:ref:`integration-testing` mais fácil, pois eventos e rotas serão reprocessados em
cada método de teste.

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication,auto tables,auto-tables,generic table,class
