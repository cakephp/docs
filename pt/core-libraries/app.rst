Classe App
##########

.. php:namespace:: Cake\Core

.. php:class:: App

A classe App é responsável pela localização de recursos e gerenciamento de caminhos.

Encontrando Classes
===================

.. php:staticmethod:: className($name, $type = '', $suffix = '')

Este método é usado para resolver nomes de classe em todo o CakePHP. Ele resolve
os nomes abreviados que o CakePHP usa e retorna o nome de classe totalmente resolvido::

    // Resolve a short class name with the namespace + suffix.
    App::className('Flash', 'Controller/Component', 'Component');
    // Returns Cake\Controller\Component\FlashComponent

    // Resolve a plugin name.
    App::className('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Returns DebugKit\Controller\Component\ToolbarComponent

    // Names with \ in them will be returned unaltered.
    App::className('App\Cache\ComboCache');
    // Returns App\Cache\ComboCache

Ao resolver classes, o namespace ``App`` será tentado primeiro e, se a
classe não existir, o namespace ``Cake`` será tentado. Se ambos
os nomes de classe não existirem, ``false`` será retornado.

Encontrando Caminhos para Recursos
===================================

.. php:staticmethod:: path(string $package, ?string $plugin = null)

O método retorna caminhos definidos usando a configuração da aplicação ``App.paths``::

    // Get the templates path set using ``App.paths.templates`` app config.
    App::path('templates');

Da mesma forma, você pode recuperar caminhos para ``locales`` e ``plugins``.

Encontrando Caminhos para Namespaces
=====================================

.. php:staticmethod:: classPath(string $package, ?string $plugin = null)

Usado para obter localizações de caminhos baseados em convenções::

    // Get the path to Controller/ in your application
    App::classPath('Controller');

Isso pode ser feito para todos os namespaces que fazem parte da sua aplicação.

``App::classPath()`` retornará apenas o caminho padrão e não será capaz de
fornecer informações sobre caminhos adicionais configurados no autoloader.

.. php:staticmethod:: core(string $package)

Usado para encontrar o caminho para um pacote dentro do CakePHP::

    // Get the path to Cache engines.
    App::core('Cache/Engine');

Localizando Themes
==================

Como os themes são plugins, você pode usar os métodos acima para obter o caminho para
um theme.

Carregando Arquivos de Vendor
==============================

Idealmente, arquivos de vendor devem ser carregados automaticamente com o ``Composer``. Se você tem arquivos
de vendor que não podem ser carregados automaticamente ou instalados com Composer, você precisará usar
``require`` para carregá-los.

Se você não puder instalar uma biblioteca com Composer, é melhor instalar cada biblioteca em
um diretório seguindo a convenção do Composer de ``vendor/$author/$package``.
Se você tivesse uma biblioteca chamada AcmeLib, você poderia instalá-la em
``vendor/Acme/AcmeLib``. Supondo que ela não use nomes de classe compatíveis com PSR-0,
você poderia carregar automaticamente as classes dentro dela usando ``classmap`` no
``composer.json`` da sua aplicação::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

Se sua biblioteca de vendor não usa classes e, em vez disso, fornece funções, você
pode configurar o Composer para carregar esses arquivos no início de cada requisição
usando a estratégia de autoloading ``files``::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

Após configurar as bibliotecas de vendor, você precisará regenerar o
autoloader da sua aplicação usando::

    $ php composer.phar dump-autoload

Se você não estiver usando Composer na sua aplicação, você precisará
carregar manualmente todas as bibliotecas de vendor.

.. meta::
    :title lang=pt: Classe App
    :keywords lang=pt: implementação compatível, comportamentos de modelo, gerenciamento de caminhos, carregamento de arquivos, carregamento de classe php, comportamento de modelo, localização de classe, modelo de componente, classe de gerenciamento, autoloader, nome da classe, local do diretório, substituição, convenções, lib, cakephp, classes php
