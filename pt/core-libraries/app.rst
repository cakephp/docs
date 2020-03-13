Classe App
##########

.. php:namespace:: Cake\Core

.. php:class:: App

A classe App é responsável pela localização dos recursos e pelo gerenciamento de caminhos.

Encontrando Classes
===================

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

Este método é usado para resolver nomes de classes no CakePHP. Resolve os 
nomes abreviados do CakePHP e retorna o nome da classe totalmente resolvido::

    // Resolva um nome de classe curto com o namespace + sufixo.
    App::classname('Auth', 'Controller/Component', 'Component');
    // Retorna Cake\Controller\Component\AuthComponent

    // Resolve o nome do plugin
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Retorna DebugKit\Controller\Component\ToolbarComponent

    // Os nomes com \ serão retornados inalterados.
    App::classname('App\Cache\ComboCache');
    // Retorna App\Cache\ComboCache

Ao resolver as classes, o namespace ``App`` será tentado e, se 
a classe não existir, o espaço para nome ``Cake`` será tentado. Se ambos 
os nomes de classe não existirem, ``false`` será retornado.

Localizando Caminhos para Namespaces
====================================

.. php:staticmethod:: path(string $package, string $plugin = null)

Usado para obter locais para caminhos com base em convenções::

    // Obtenha o caminho para o Controller / no seu aplicativo
    App::path('Controller');

Isso pode ser feito para todos os namespaces que fazem parte do seu aplicativo. 
Você também pode buscar caminhos para um plug-in::

    // Retorna os caminhos do componente no DebugKit
    App::path('Component', 'DebugKit');

``App::path()`` retornará apenas o caminho padrão e não poderá fornecer 
informações sobre caminhos adicionais para os quais o carregador automático 
está configurado.

.. php:staticmethod:: core(string $package)

Usado para encontrar o caminho para um pacote dentro do CakePHP::

    // Obtenha o caminho para os mecanismos de cache.
    App::core('Cache/Engine');

Localizando Plugins
===================

.. php:staticmethod:: Plugin::path(string $plugin)

Os plug-ins podem ser localizados com o Plugin. Usar ``Plugin::path('DebugKit');`` 
por exemplo, fornecerá o caminho completo para o plug-in DebugKit::

    $path = Plugin::path('DebugKit');

Localizando Temas
=================

Como os temas são plugins, você pode usar os métodos acima para obter o caminho para um tema.

Carregando Arquivos do Fornecedor
=================================

O ideal é que os arquivos do fornecedor sejam carregados automaticamente com 
o ``Composer``, se você tiver arquivos que não possam ser carregados ou instalados 
automaticamente com o Composer, será necessário usar o ``require`` para carregá-los.

Se você não conseguir instalar uma biblioteca com o Composer, é melhor instalar cada 
biblioteca em um diretório, seguindo a convenção do Composer de ``vendor/$author/$ package``. 
Se você tiver uma biblioteca chamada AcmeLib, poderá instalá-la em ``vendor/Acme/AcmeLib``. 
Supondo que ele não usasse nomes de classe compatíveis com PSR-0, você poderia carregar 
automaticamente as classes dentro dele usando ``classmap`` no ``composer.json`` do seu aplicativo::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

Se a sua biblioteca de fornecedores não usa classes e, em vez disso, fornece funções, 
você pode configurar o Composer para carregar esses arquivos no início de cada solicitação 
usando a estratégia de carregamento automático ``files``::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

Depois de configurar as bibliotecas do fornecedor, você precisará regenerar 
o carregador automático do seu aplicativo usando::

    $ php composer.phar dump-autoload

Se você não estiver usando o Composer em seu aplicativo, precisará carregar 
manualmente todas as bibliotecas de fornecedores.

.. meta::
    :title lang=pt: Classe App
    :keywords lang=pt: implementação compatível, comportamentos de modelo, gerenciamento de caminhos, carregamento de arquivos, carregamento de classe php, comportamento de modelo, localização de classe, modelo de componente, classe de gerenciamento, autoloader, nome da classe, local do diretório, substituição, convenções, lib, cakephp, classes php
