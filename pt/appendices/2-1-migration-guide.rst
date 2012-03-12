Guia de Migração para a Versão 2.1
##################################

O CakePHP 2.1 é um atualização totalmente compatível com API do 2.0. Esta página
apresenta as mudanças e melhorias feitas no 2.1.

AppController, AppHelper, AppModel and AppShell
===============================================

Como essas classes foram removidas do núcleo do CakePHP, agora elas são obrigatórias em
sua aplicação. Se você não tiver essas classes, você pode usar o seguinte durante a atualização::

    // app/View/Helper/AppHelper.php
    <?php
    App::uses('Helper', 'View');
    class AppHelper extends Helper {
    }

    // app/Model/AppModel.php
    <?php
    App::uses('Model', 'Model');
    class AppModel extends Model {
    }

    // app/Controller/AppController.php
    <?php
    App::uses('Controller', 'Controller');
    class AppController extends Controller {
    }

    // app/Console/Command/AppShell.php
    <?php
    App::uses('Shell', 'Console');
    class AppShell extends Shell {
    }

Se sua aplicação já tiver esses arquivos/classes você não precisa fazer
nada.
Além disso, se você estiver utilizando o PagesController do núcleo do CakePHP, você
precisa copiá-lo para a pasta app/Controller também.

Arquivos .htaccess
==================

Os arquivos ``.htaccess`` foram alterados, você deve lembrar de atulizá-los ou a atualizar o
esquema de reescrita de ``URL re-writing`` para combinar com as atualizações feitas.

Models
======

- O callback``beforeDelete`` será disparado antes dos callbacks beforeDelete dos behaviors.
  Isto o torna consistente com o resto dos eventos disparados na camada de modelo.
- O método ``Model::find('threaded')`` agora aceita o parâmetro ``$options['parent']`` se
  estiver usando outro campo como ``parent_id``. Além disso, se o model tem o TreeBehavior e
  configurado com outro campo definido para o pai, o ``threaded`` irá encontrá-lo e o utilizar
  por padrão.
- Parâmetros para consultas usando instruções preparadas (``prepared statements``) agora será
  parte do dump SQL.
- Arrays de validação agora podem ser mais específicos quando um campo é obrigatório. A chave
  ``required`` agora aceita ``create`` e ``update``. Esses valores farão o campo obrigatório
  quando criar ou atualizar.

Behaviors
=========

TranslateBehavior
-----------------

- :php:class:`I18nModel` foi movida para um arquivo separado.

Exceções
========

A renderização padrão de exceções agora inclui os *stack traces* mais detalhados,
incluindo trechos de arquivos e os argumentos para todas as funções.

Utilidade
=========

Debugger
--------

- :php:func:`Debugger::getType()` foi adicionada. Pode ser utilizada para obter
  o tipo das variáveis.
- :php:func:`Debugger::exportVar()` foi modificada para criar uma saída mais
  legível e útil.

debug()
-------

`debug()` agora utiliza :php:class:`Debugger` internamente. Isto o torna mais consistente
com o Debugger, e tira proveito das melhorias feitas lá.

Set
---

- :php:func:`Set::nest()` foi adicionada. Recebe uma matriz simples e retorna uma matriz aninhada.

File
----

- :php:meth:`File::info()` inclui o tamanho do arquivo e o seu mimetype.
- :php:meth:`File::mime()` foi adicionada.

Cache
-----

- :php:class:`CacheEngine` foi movida para um arquivo separado.

Configure
---------

- :php:class:`ConfigReaderInterface` foi movida para um arquivo separado.

App
---

- :php:meth:`App::build()` agora tem a capacidade de registrar novos pacotes usando
  ``App::REGISTER``. Veja :ref:`app-build-register` para mais informações.
- As classes que não podem ser encontradas nos caminhos configurados serão pesquisados
  ​dentro de ``APP``, como um caminho alternativo. Isso torna o carregamento automático
  dos diretórios aninhados em ``app/Vendedor`` mais fácil.

Console
=======

Test Shell
----------

Um novo TestShell foi adicionado. Ele reduz a digitação necessária para executar
os testes unitários, e oferece uma interface baseada nos caminhos dos arquivos::

    # Run the post model tests
    Console/cake test app/Model/Post.php
    Console/cake test app/Controller/PostsController.php

O antigo shell testsuite e sua sintaxe ainda estão disponíveis.

General
-------

- Arquivos gerados não contém timestamps com o dia/hora da geração.

Rotas
=====

Router
------

- As rotas agora podem usar uma sintaxe especial ``/**`` para incluir todos os argumentos
  finais como um único argumento passado. Veja a seção sobre :ref:`connecting-routes`
  para mais informações.
- :php:meth:`Router::resourceMap()` foi adicionada.

- :php:meth:`Router::defaultRouteClass()` foi adicionada. Este método permite que você defina
  a classe padrão usada para todas as rotas definidas.

Network
=======

CakeRequest
-----------

- Adicionado ``is('requested')`` e ``isRequested()`` para a detecção de ``requestAction``.

CakeResponse
------------

- Adicionado :php:meth:`CakeResponse::cookie()` para a configuração de *cookies*.
- Foi adicionada uma série de métodos para :ref:`cake-response-caching`

Controller
==========

Controller
----------

- O :php:attr:`Controller::$uses` foi modificado, seu valor padrão agora é ``true``
  em vez de ``false``. Além disso, valores diferentes são tratados de maneira ligeiramente
  diferente, mas irá comportar o mesmo na maioria dos casos.

    - ``true`` Irá carregar o modelo padrão e mesclar com AppController.
    - Um array irá carregar os modelos e mesclar com AppController.
    - An empty array will not load any models other than those declared in the
      base class.
    - Um array vazio não vai carregar outros modelos que não os declarados na
      classe base.
    - ``false`` não irá carregar qualquer modelo, e não vai se fundir com a classe
      base também.


Componentes
===========

AuthComponent
-------------

- :php:meth:`AuthComponent::allow()` não aceita mais ``allow('*')``
  como um curinga para todas as ações. Basta usar ``allow()``. Isso
  unifica a API entre allow() e deny().
- A opção ``recursive`` foi adicionada a todos os adaptadores de autenticação.
  Permite controlar mais facilmente as associações armazenados na sessão.


AclComponent
------------

- :php:class:`AclComponent` não mais inflexiona o nome da classe usada para
  ``Acl.classname``. Em vez disso utiliza o valor como é fornecido.
- Implementações do Acl agora devem ser colocadas em ``Controller/Component/Acl``.
- Implementações do Acl agora devem ser movidas da pasta ``Component`` para a pasta
  ``Component/Acl``. Por exemplo: se sua classe Acl se chama ``CustomAclComponent``,
  e está em ``Controller/Component/CustomAclComponent.php``. Ela deve ser movida para
  ``Controller/Component/Acl/CustomAcl.php`` e renomeada para ``CustomAcl``.
- :php:class:`DbAcl` foi movida para um arquivo separado.
- :php:class:`IniAcl` foi movida para um arquivo separado.
- :php:class:`AclInterface` foi movida para um arquivo separado.

Helpers
=======

TextHelper
----------

- :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
  :php:meth:`TextHelper::autoLinkEmails()` escapa o HTML por padrão. Você pode
  controlar este comportamento com a opção ``escape``.

HtmlHelper
----------

- :php:meth:`HtmlHelper::script()` teve a opção ``block`` adicionada.
- :php:meth:`HtmlHelper::scriptBlock()` teve a opção ``block`` adicionada.
- :php:meth:`HtmlHelper::css()` teve a opção ``block`` adicionada.
- :php:meth:`HtmlHelper::meta()` teve a opção ``block`` adicionada.
- O parâmetro ``$startText`` do :php:meth:`HtmlHelper::getCrumbs()` pode ser
  um array. Isto dá mais controle e flexibilidade.
- :php:meth:`HtmlHelper::docType()` o padrão agora é o html5
- :php:meth:`HtmlHelper::image()` agora tem a opção ``fullBase``.
- :php:meth:`HtmlHelper::media()` foi adicionado. Você pode usar este método para
  criar elementos de vídeo/audio do HTML5.
- O suporte a :term:`plugin syntax` foi adicionado nos métodos
  :php:meth:`HtmlHelper::script()`, :php:meth:`HtmlHelper::css()`, :php:meth:`HtmlHelper::image()`.
  Agora você pode facilmente vincular recursos de plugins usando ``Plugin.asset``.
- :php:meth:`HtmlHelper::getCrumbList()` teve o parâmetro ``$startText`` adicionado.


View
====

- :php:attr:`View::$output` está obsoleto.
- ``$content_for_layout`` está obsoleto.  Use ``$this->fetch('content');``
  instead.
- ``$scripts_for_layout`` está obsoleto.  Use o seguinte::

        <?php
        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');

  ``$scripts_for_layout`` ainda está disponível, mas a API :ref:`view blocks <view-blocks>` API
  é mais flexível e extensível.
- A sintaxe ``Plugin.view`` está agora disponível em todos os lugares. Você pode usar esta
  sintaxe em qualquer lugar que você fizer referência ao nome de uma *view*, *layout* ou *element*.
- A opção ``$options['plugin']`` para :php:meth:`~View::element()` está
  obsoleta. Em vez disso você deve utilizar ``Plugin.element_name``.

Content type views
------------------

Duas classes de exibição foram adicionadas ao CakePHP. A :php:class:`JsonView` e a
:php:class:`XmlView` permite gerar facilmente views XML e JSON. Você pode aprender
mais sobre essas classes na seção :doc:`/views/json-and-xml-views`.

Estendendo as views
-------------------

:php:class:`View` has a new method allowing you to wrap or 'extend' a
view/element/layout with another file.  See the section on
:ref:`extending-views` for more information on this feature.

Temas
-----

A classe ``ThemeView`` está obsoleta em favor da classe ``View``. Simplesmente
defina o ``$this->theme = 'MyTheme`` que o suporte a temas será habilitado, e todas as
classes de View personalizadas que estendem da ``ThemeView`` deve estender de ``View``.

Blocos de View
--------------

Blocos de View são uma maneira flexível de criar slots ou blocos em suas views.
Os blocos substituem ``$scripts_for_layout`` com uma API mais robusta e flexível.
Consulte a seção sobre :ref:`view-blocks` para mais informações.


Helpers
=======

Novos callbacks
---------------

Dois novos callbacks foram adicionados aos Helpers.
:php:meth:`Helper::beforeRenderFile()` e :php:meth:`Helper::afterRenderFile()`
esses novos callbacks são disparados antes/depois que cada fragmento da view
é renderizado.
Isto inclui elements, layouts e views.

CacheHelper
-----------

- As tags ``<!--nocache-->`` agora funcionam corretamente dentro dos elementos.

FormHelper
----------

- O FormHelper agora omite campos desabilitados a partir do hash dos campos protegidos.
  Isso torna o trabalho com :php:class:`SecurityComponent` e os inputs desabilitados mais fácil.
- A opção ``between`` quando utilizado em conjunto com os radio inputs, agora se comporta de forma
  diferente. O valor do ``between`` agora é colocado entre a legenda e o primeiro input.
- A opção ``hiddenField`` dos campos checkbox pode agora ser definida para um valor específico,
  como 'N' ao invés de apenas 0.
- O atributo ``for`` para campos datetime agora reflete o primeiro campo gerado. Isso pode
  resultar na mudança do atributo ``for`` de acordo com os campo geradas.
- O atributo ``type`` para :php:meth:`FormHelper::button()` pode ​​ser removido agora. O padrão
  ainda é 'submit'.
- :php:meth:`FormHelper::radio()` agora permite que você desabilite todas as opções. Você pode fazer
  isso definindo ``'disabled' => true`` ou ``'disabled' => 'disabled'`` no array ``$attributes``.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` agora possui a opção ``currentClass``.


Testando
========

- Web test runner agora exibe a versão do PHPUnit.
- Web test runner agora mostra os testes da aplicação por padrão.
- Fixtures podem ser criados em datasources que não seja $test.
- Modelos carregados usando o ``ClassRegistry`` e usando outro datasource vai
  ter o nome de seu datasource prefixado com ``test_`` (por exemplo, o datasource
  `master` irá tentar usar ``test_master`` no testsuite)
- Os casos de teste são gerados com os métodos de configuração específicos.

Eventos
=======

- Um novo sistema de eventos genérico foi construído e que substituiu a forma
  como callbacks são disparados. Isso não deve representar qualquer alteração em seu código.
- Você pode enviar seus próprios eventos e callbacks para serem anexados, útil para a
  comunicação entre plugins e fácil desacoplamento de suas classes.
