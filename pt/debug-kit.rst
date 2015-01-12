Debug Kit
#########

DebugKit é um plugin suportado pelo time principal que oferece uma barra de ferramentas
para ajudar a fazer a depuração de aplicações do CakePHP mais facilmente.

Instalação
==========

Por padrão o DebugKit é instalado com com o esqueleto padrão da aplicação. Se
você o removeu e gostaria de reinstalá-lo, você pode fazê-lo ao executar o seguinte
comando a partir do diretório raiz da aplicação (onde o arquivo composer.json está
localizado)::

    php composer.phar require cakephp/debug_kit "3.0.*-dev"

Armazenamento do DebugKit
=========================

Por padrão, o DebugKit usa um pequeno banco de dados SQLite no diretório ``/tmp``
de sua aplicação para armazenar os dados do painel. Se você quizesse que o DebugKit
armazenasse seus dados em outro lugar, você deve definir uma conexão ``debug_kit``.

Configuração doe banco de dados
-------------------------------

Por padrão, o DebugKit armazenará os dados do painel em um banco de dados SQLite no
diretório ``/tmp`` de sua aplicação. Se você não puder instalar a extensão do PHP
pdo_sqlite, você pode configurar o DebugKit para usar um banco de dados diferente ao
definir uma conexão ``debug_kit`` em seu arquivo ``config/app.php``.

Uso da barra de ferramentas
===========================

A Barra de Ferramentas DebugKit é composta por vários painéis, que são mostrados ao clicar
no ícone do CakePHP no canto inferior direito da janela do seu navegador. Uma vez
que a barra de ferramentas é aberta, você deve ver uma série de botões. Cada um desses botões
expande-se em um painel de informações relacionadas.

Cada painel permite que você olhar para um aspecto diferente da sua aplicação:

* **Cache** Exibe o uso de cache durante uma solicitação e limpa caches.
* **Environment** Exibe variáveis de ambiente relacionadas com PHP + CakePHP.
* **History** Exibe uma lista de requisições anteriores, e permite que você carregue
  e veja dados da barra de ferramentas a partir de solicitações anteriores.
* **Include** Exibe os arquivos inclusos divididos por grupo.
* **Log** Exibe todas as entradas feitas nos arquivos de log este pedido.
* **Request** Exibe informações sobre a requisição atual, GET, POST, informações
  sobre a rota atual do Cake e Cookies.
* **Session** Exibe a informação atual da sessão.
* **Sql Logs** Exibe logs SQL para cada conexão com o banco de dados.
* **Timer** Exibe qualquer temporizador que fora definido durante a requisição com
  ``DebugKit\DebugTimer``, e memória utilizada coletada com
  ``DebugKit\DebugMemory``.
* **Variables** Exibe variáveis de View definidas em um Controller.

Tipicamente, um painel manipula a recolha e apresentação de um único tipo
de informações como logs ou informações de requisições. Você pode optar por visualizar
painéis padrão da barra de ferramentas ou adicionar seus próprios painéis personalizados.

Usando o painel History
=======================

O painel History é uma das mais frequentemente confundidas características do
DebugKit. Ele oferece uma forma de visualizar os dados da barra de ferramentas
de requisições anteriores, incluindo erros e redirecionamentos.

.. figure:: /_static/debug-kit/history-panel.png
    :alt: Screenshot do painel History no DebugKit.

Como você pode ver, o painel contém uma lista de requisições. Na esquerda você
pode ver um ponto marcando a requisição ativa. Clicar em quaisquer dados de requisição
vai carregar os dados do painel para aquela requisição. Quando os dados são carregados,
os títulos do painel vão sofrer uma transição para indicar que dados alternativos foram
carregados.

.. figure:: /_static/debug-kit/history-panel-use.gif
    :alt: Video do painel History em ação.

Desenvolvendo seus próprios painéis
===================================

Você pode criar seus próprios painéis customizados para o DebugKit para ajudar
na depuração de suas aplicações.

Criando uma Panel Class
-----------------------

Panel Classes precisam ser colocadas no diretório ``src/Panel``. O
nome do arquivo deve combinar com o nome da classe, então a classe ``MyCustomPanel``
deveria ter o nome de arquivo ``src/Panel/MyCustomPanel.php``::

    namespace App\Panel;

    use DebugKit\DebugPanel;

    /**
     * My Custom Panel
     */
    class MyCustomPanel extends DebugPanel
    {
        ...
    }

Perceba que painéis customizados são necessários para extender a classe ``DebugPanel``.

Callbacks
---------

By default Panel objects have two callbacks, allowing them to hook into the
current request. Panels subscribe to the ``Controller.initialize`` and
``Controller.shutdown`` events. If your panel needs to subscribe to additional
events, you can use the ``implementedEvents`` method to define all of the events
your panel is interested in.

You should refer to the built-in panels for some examples on how you can build
panels.

Panel Elements
--------------

Each Panel is expected to have a view element that renders the content from the
panel. The element name must be the underscored inflection of the class name.
For example ``SessionPanel`` has an element named ``session_panel.ctp``, and
SqllogPanel has an element named ``sqllog_panel.ctp``. These elements should be
located in the root of your ``src/Template/Element`` directory.

Custom Titles and Elements
--------------------------

Panels should pick up their title and element name by convention. However, if
you need to choose a custom element name or title, you can define methods to
customize your panel's behavior:

- ``title()`` - Configure the title that is displayed in the toolbar.
- ``elementName()`` Configure which element should be used for a given panel.

Panels in Other Plugins
-----------------------

Panels provided by :doc:`/plugins` work almost entirely the same as other
plugins, with one minor difference:  You must set ``public $plugin`` to be the
name of the plugin directory, so that the panel's Elements can be located at
render time::

    namespace MyPlugin\Panel;

    use DebugKit\DebugPanel;

    class MyCustomPanel extends DebugPanel
    {
        public $plugin = 'MyPlugin';
            ...
    }

To use a plugin or app panel, update your application's DebugKit configuration
to include the panel::

    Configure::write(
        'DebugKit.panels',
        array_merge(Configure::read('DebugKit.panels'), ['MyCustomPanel'])
    );

The above would load all the default panels as well as the custom panel from
``MyPlugin``.
