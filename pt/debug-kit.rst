Debug Kit
#########

DebugKit é um plugin suportado pelo time principal que oferece uma barra de
ferramentas para ajudar a fazer a depuração de aplicações do CakePHP mais
facilmente.

Instalação
==========

Por padrão o DebugKit é instalado com com o esqueleto padrão da aplicação. Se
você o removeu e gostaria de reinstalá-lo, você pode fazê-lo ao executar o
seguinte comando a partir do diretório raiz da aplicação (onde o arquivo
composer.json está localizado)::

    php composer.phar require --dev cakephp/debug_kit "~3.0"

Armazenamento do DebugKit
=========================

Por padrão, o DebugKit usa um pequeno banco de dados SQLite no diretório
``/tmp`` de sua aplicação para armazenar os dados do painel. Se você quizesse
que o DebugKit armazenasse seus dados em outro lugar, você deve definir uma
conexão ``debug_kit``.

Configuração doe banco de dados
-------------------------------

Por padrão, o DebugKit armazenará os dados do painel em um banco de dados SQLite
no diretório ``/tmp`` de sua aplicação. Se você não puder instalar a extensão
do PHP pdo_sqlite, você pode configurar o DebugKit para usar um banco de dados
diferente ao definir uma conexão ``debug_kit`` em seu arquivo
``config/app.php``.

Uso da barra de ferramentas
===========================

A Barra de Ferramentas DebugKit é composta por vários painéis, que são mostrados
ao clicar no ícone do CakePHP no canto inferior direito da janela do seu
navegador. Uma vez que a barra de ferramentas é aberta, você deve ver uma série
de botões. Cada um desses botões expande-se em um painel de informações
relacionadas.

Cada painel permite que você olhar para um aspecto diferente da sua aplicação:

* **Cache** Exibe o uso de cache durante uma solicitação e limpa caches.
* **Environment** Exibe variáveis de ambiente relacionadas com PHP + CakePHP.
* **History** Exibe uma lista de requisições anteriores, e permite que você
  carregue e veja dados da barra de ferramentas a partir de solicitações
  anteriores.
* **Include** Exibe os arquivos inclusos divididos por grupo.
* **Log** Exibe todas as entradas feitas nos arquivos de log este pedido.
* **Request** Exibe informações sobre a requisição atual, GET, POST, informações
  sobre a rota atual do Cake e Cookies.
* **Session** Exibe a informação atual da sessão.
* **Sql Logs** Exibe logs SQL para cada conexão com o banco de dados.
* **Timer** Exibe qualquer temporizador que fora definido durante a requisição
  com ``DebugKit\DebugTimer``, e memória utilizada coletada com
  ``DebugKit\DebugMemory``.
* **Variables** Exibe variáveis de View definidas em um Controller.

Tipicamente, um painel manipula a recolha e apresentação de um único tipo
de informações como logs ou informações de requisições. Você pode optar por
visualizar painéis padrão da barra de ferramentas ou adicionar seus próprios
painéis personalizados.

Usando o painel History
=======================

O painel History é uma das mais frequentemente confundidas características do
DebugKit. Ele oferece uma forma de visualizar os dados da barra de ferramentas
de requisições anteriores, incluindo erros e redirecionamentos.

.. figure:: /_static/img/debug-kit/history-panel.png
    :alt: Screenshot do painel History no DebugKit.

Como você pode ver, o painel contém uma lista de requisições. Na esquerda você
pode ver um ponto marcando a requisição ativa. Clicar em quaisquer dados de
requisição vai carregar os dados do painel para aquela requisição. Quando os
dados são carregados, os títulos do painel vão sofrer uma transição para indicar
que dados alternativos foram carregados.

.. only:: html or epub

    .. figure:: /_static/img/debug-kit/history-panel-use.gif
        :alt: Video do painel History em ação.

Desenvolvendo seus próprios painéis
===================================

Você pode criar seus próprios painéis customizados para o DebugKit para ajudar
na depuração de suas aplicações.

Criando uma Panel Class
-----------------------

Panel Classes precisam ser colocadas no diretório **src/Panel**. O
nome do arquivo deve combinar com o nome da classe, então a classe
``MyCustomPanel`` deveria ter o nome de arquivo
**src/Panel/MyCustomPanel.php**::

    namespace App\Panel;

    use DebugKit\DebugPanel;

    /**
     * My Custom Panel
     */
    class MyCustomPanel extends DebugPanel
    {
        ...
    }

Perceba que painéis customizados são necessários para extender a classe
``DebugPanel``.

Callbacks
---------

Por padrão objetos do painel possuem dois callbacks, permitindo-lhes acoplar-se
na requisição atual. Painéis inscrevem-se aos eventos ``Controller.initialize``
e ``Controller.shutdown``. Se o seu painel precisa inscrever-se a eventos
adicionais, você pode usar o método ``implementedEvents`` para definir todos os
eventos que o seu painel possa estar interessado.

Você deveria estudar os painéis nativos para absorver alguns exemplos de como
construir painéis.

Elementos do painel
-------------------

Cada painel deve ter um elemento view que renderiza o conteúdo do mesmo.
O nome do elemento deve ser sublinhado e flexionado a partir do nome da classe.
Por exemplo ``SessionPanel`` possui um elemento nomeado ``session_panel.ctp``, e
SqllogPanel possui um elemento nomeado ``sqllog_panel.ctp``. Estes elementos
devem estar localizados na raiz do seu diretório **src/Template/Element**.

Títulos personalizados e Elementos
----------------------------------

Os painéis devem pegar o seu título e nome do elemento por convenção. No
entanto, se você precisa escolher um nome de elemento personalizado ou título,
você pode definir métodos para customizar o comportamento do seu painel:

- ``title()`` - Configure o título que é exibido na barra de ferramentas.
- ``elementName()`` - Configure qual elemento deve ser utilizada para um
  determinado painel.

Painéis em outros plugins
-------------------------

Painéis disponibilizados por :doc:`/plugins` funcionam quase que totalmente
como outros plugins, com uma pequena diferença: Você deve definir
``public $plugin`` para ser o nome do diretório do plugin, com isso os elementos
do painel poderão ser encontrados no momento de renderização::

    namespace MyPlugin\Panel;

    use DebugKit\DebugPanel;

    class MyCustomPanel extends DebugPanel
    {
        public $plugin = 'MyPlugin';
            ...
    }

Para usar um plugin ou painel da aplicação, atualize a configuração do DebugKit
de sua aplicação para incluir o painel::

    Configure::write(
        'DebugKit.panels',
        array_merge(Configure::read('DebugKit.panels'), ['MyCustomPanel'])
    );

O código acima deve carregar todos os painéis padrão tanto como os outros
painéis customizados do ``MyPlugin``.
