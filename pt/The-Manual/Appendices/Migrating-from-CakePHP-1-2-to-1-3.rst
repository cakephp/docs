Migrando do CakePHP 1.2 para 1.3
################################

Esse guia concentra muitas das mudanças necessárias quando migrando da
versão 1.2 para a 1.3. Cada seção contem informações relevantes sobre as
mudanças feitas nos métodos existentes assim como os métodos que foram
removidos/renomeados.

**Mudanças no Arquivos de Aplicação (importante)**

-  webroot/index.php: Deve ser substituido em razão de alterações no
   processo de bootstrap (carregamento)
-  config/core.php: Configurações adicionais foram adicionadas, tais que
   são requeridas para PHP 5.3.

Constantes Removidas
====================

AS constantes a seguir foram removidas do CakePHP. Se sua aplicação
depende de uma destas você deve defini-las em
``app/config/bootstrap.php``

-  ``CIPHER_SEED`` - Foi substituída por uma variável na classe
   Configure: "``Security.cipherSeed``\ ", que deve ser alterada em
   ``app/config/core.php``
-  ``PEAR``
-  ``INFLECTIONS``
-  ``VALID_NOT_EMPTY``
-  ``VALID_EMAIL``
-  ``VALID_NUMBER``
-  ``VALID_YEAR``

Configuração e Inicialização da Aplicação(bootstrapping)
========================================================

**Inicializando(Bootstrapping) caminhos/paths adicionais.**

Se no seu app/config/bootstrap.php você precisa ter variáveis como
``$pluginPaths`` ou ``$controllerPaths``. Na versão 1.3 RC1 as variáveis
``$pluginPaths`` não irão mais funcionar.
 No novo modo de adicionar caminhos/paths você deve usar
``App::build()`` para modificar paths.

::

    App::build(array(
        'plugins' => array('/caminho/completo/para/plugins/', '/proximo/caminho/completo/para/plugins/'),
        'models' =>  array('/caminho/completo/para/models/', '/proximo/caminho/completo/para/models/'),
        'views' => array('/caminho/completo/para/views/', '/proximo/caminho/completo/para/views/'),
        'controllers' => array('/caminho/completo/para/controllers/', '/proximo/caminho/completo/para/controllers/'),
        'datasources' => array('/caminho/completo/para/datasources/', '/proximo/caminho/completo/para/datasources/'),
        'behaviors' => array('/caminho/completo/para/behaviors/', '/proximo/caminho/completo/para/behaviors/'),
        'components' => array('/caminho/completo/para/components/', '/proximo/caminho/completo/para/components/'),
        'helpers' => array('/caminho/completo/para/helpers/', '/proximo/caminho/completo/para/helpers/'),
        'vendors' => array('/caminho/completo/para/vendors/', '/proximo/caminho/completo/para/vendors/'),
        'shells' => array('/caminho/completo/para/shells/', '/proximo/caminho/completo/para/shells/'),
        'locales' => array('/caminho/completo/para/locale/', '/proximo/caminho/completo/para/locale/')
    ));

També foi modificada a ordem que o bootstrapping ocorre. No passado
``app/config/core.php`` era carregado **depois** de
``app/config/bootstrap.php``. Isso fazia com que qualquer
``App::import()`` na inicialização não tivesse cache tornando-os
consideravelmente mais lentos que os em cache. Na versão 1.3 o core.php
é carregado e as configurações de cache são criadas **antes** de
bootstrap.php ser carregado.

**Carregando inflexões customizada**

``inflections.php`` foi removido, este era um arquivo desnecessários, e
as funcionalidades foram refatoradas em um metodo para aumentar a
flexibilidade. Agora use ``Inflector::rules()`` para carregar inflexões
customizadas.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

Irá mesclar as regras fornecidas dentro do grupo de inflexões, As regras
adicionadas terão precedência sobre as regras do core.

Renomeação de arquivos e mudanças internas
==========================================

**Renomeação de Bibliotecas**

Bibliotecas Core de libs/session.php, libs/socket.php,
libs/model/schema.php e libs/model/behavior.php foram renomeadas para
haver um melhor mapeamento entre nomes de arquivos e classes contidas
nesses (também para lidar com alguns problemas de nomenclatura
espaçada):

-  session.php -> cake\_session.php

   -  App::import('Core', 'Session') -> App::import('Core',
      'CakeSession')

-  socket.php -> cake\_socket.php

   -  App::import('Core', 'Socket') -> App::import('Core', 'CakeSocket')

-  schema.php -> cake\_schema.php

   -  App::import('Model', 'Schema') -> App::import('Model',
      'CakeSchema')

-  behavior.php -> model\_behavior.php

   -  App::import('Core', 'Behavior') -> App::import('Core',
      'ModelBehavior')

Na maioria dos casos, a renomeação acima não irá afetar codificação de
usuário.

**Heranças de Object**

As classes a seguir não mais estendem Object:

-  Router
-  Set
-  Inflector
-  Cache
-  CacheEngine

Se você usava métodos de Object dessas classes, você terá que deixar de
usá-los.

Controller & Componentes
========================

**Controller**

-  ``Controller::set()`` não mais altera variáveis de ``$nome_variavel``
   para ``$nomeVariavel``. Variáveis sempre serão representadas na view
   da forma que você as registrou.

-  ``Controller::set('title', $var)`` não mais altera automaticamente
   ``$title_for_layout`` ao renderizar o layout. ``$title_for_layout``
   ainda é populada por padrão. Porém se você quer customiza-la, use
   ``$this->set('title_for_layout', $var)``.

-  ``Controller::$pageTitle`` foi removido. Use
   ``$this->set('title_for_layout', $var);`` em substituição.

-  Controller possui 2 novos metodos ``startupProcess`` e
   ``shutdownProcess``. Esses metodos são responsáveis por manusear os
   processos de inicialização e finalização do controller.

**Componente**

-  ``Component::triggerCallback`` foi adicionado. É um "gancho" genérico
   no processo do componente de callbacks. Este substitui
   ``Component::startup()``, ``Component::shutdown()`` e
   ``Component::beforeRender()`` como o preferido modo para engatilhar
   callbacks.

**CookieComponent**

-  ``del`` tornou-se obsoleto use ``delete``

**RequestHandlerComponent**

-  ``getReferrer`` tornou-se obsoleto use ``getReferer``

**SessionComponent**

-  ``del`` tornou-se obsoleto use ``delete``

**SessionHelper & SessionComponent**

``SessionComponent::setFlash()`` segundo parâmetro costuma ser usado
para setar o layout e renderizava um ARQUIVO DE LAYOUT. Este foi
modificado para usar um ELEMENT. Se você especificou na sua aplicação um
layout de session flash customizado você terá que fazer as seguintes
mudanças.

#. Mova os arquivos de layout em questão para a pasta app/views/elements
#. Renomeie a variável $content\_for\_layout variable para $message
#. Certifique-se que ``echo $session->flash();`` se encontra inserido no
   seu layout

Ambos ``SessionHelper`` e ``SessionComponent`` não são mais
automaticamente inclusos sem que você os requisite. SessionHelper e
SessionComponent agora funcionam como qualquer outro componente/helper e
devem ser declarados assim como os demais. Você deve atualizar
``AppController::$components`` e ``AppController::$helpers`` para
incluir essas classes para manter o funcionamento atual.

::

    <code>var $components = array('Session', 'Auth', ...);
    var $helpers = array('Session', 'Html', 'Form' ...);</code>

Essa mudança foi feita para tornar o CakePHP mais explicito em quais
classes você desenvolvedor deseja utilizar. Antigamente não existia uma
forma de impedir que as classes de Session fossem carregadas a não ser
alterando os arquivos do core. Que é algo que queremos evitar. Session
era o único component/helper "mágico". Essa mudança ajuda a consolidar o
padrão de comportamento de todas as classes.

Classes de Biblioteca
=====================

**CakeSession**

-  ``del`` está obsoleto, utilize ``delete``

**Folder**

-  ``mkdir`` está obsoleto, utilize ``create``
-  ``mv`` está obsoleto, utilize ``move``
-  ``ls`` está obsoleto, utilize ``read``
-  ``cp`` está obsoleto, utilize ``copy``
-  ``rm`` está obsoleto, utilize ``delete``

**Set**

-  ``isEqual`` está obsoleto. Utilize == ou ===.

**String**

-  ``getInstance`` está obsoleto. Chame os métodos de String
   estaticamente.

**Router**

``Routing.admin`` está obsoleto. Ele proporcionava um comportmento
inconsistemte com outros estilos de prefixos de rotas os quais eram
tratados diferentemente. Em seu lugar, você deve usar
``Routing.prefixes``. Prefixos de rotas no 1.3 não necessitam mais que
as rotas adicionais sejam declaradas manualmente. Todos os prefixos de
rotas serão gerados automaticamente. Para atualizar, simplesmente
modifique seu core.php.

::

    // altere disto:
    Configure::write('Routing.admin', 'admin');

    // para isto:
    Configure::write('Routing.prefixes', array('admin'));

Veja o guia de novos recursos para mais informações sobre prefixos de
rotas. Uma pequena modificação também foi feita com relação aos
parâmetros de roteamento. Parâmetros de roteamento agora só devem ser
compostos de caracteres alfanuméricos, - e \_ ou ``/[A-Z0-9-_+]+/``.

::

    Router::connect('/:$%@#param/:action/*', array(...)); // RUIM
    Router::connect('/:can/:anybody/:see/:m-3/*', array(...)); // Aceitável

A parte interna do Router no 1.3 teve uma grande refatoração visando
aumentar seu desempenho e diminuir a quantidade de código a ser escrito.
Um efeito colateral disto foi que dois recursos que eram raramente
usados foram removidos de vez, uma vez que eram problemáticos e
propensos a bugs mesmo com o código base existente. Primeiro, segmentos
de paths usando expressões regulares completas foi removido. Não é mais
possível se criar rotas como

::

    Router::connect('/([0-9]+)-p-(.*)/', array('controller' => 'products', 'action' => 'show'));

Uma rota como esta complicava bastante a interpretação da rota final e
tornava impossível fazer o roteamento reverso. Se você ainda precisar de
rotas como esta, é recomendável que você utilize parâmetros de rota para
capturar padrões. Outro recurso removido foi o suporte à "estrela
pega-tudo" em trechos de rota. Antes, era possível utilizar uma estrela
no meio de uma rota, assim

::

    Router::connect(
        '/pages/*/:event',
        array('controller' => 'pages', 'action' => 'display'), 
        array('event' => '[a-z0-9_-]+')
    );

Isto não é mais suportado uma vez que esse uso de estrelas no meio de
uma rota gerava um comportamento errático e complicava bastante a
interpretação de rotas. À exceção desses dois recursos acima, o roteador
continua funcionando exatamente do mesmo jeito que na versão 1.2.

**Dispatcher**

O ``Dispatcher`` não é mais capaz de atribuir um layout/view por meio
dos parâmetros da requisição. O controle dessas propriedades deve ser
manipulado dentro do Controller e não no Dispatcher. Este também era um
recurso não documentado e não testado.

**Debugger**

-  ``Debugger::checkSessionKey()`` foi renomeado para
   ``Debugger::checkSecurityKeys()``
-  Chamar ``Debugger::output("text")`` não funciona mais. Utilize
   ``Debugger::output("txt")``.

**Object**

-  ``Object::$_log`` foi removido. ``CakeLog::write`` agora é chamado
   estaticamente. Consulte os :doc:`/The-Manual/Common-Tasks-With-CakePHP/Logging` para mais informações sobre as
   mudanças relativas a logging.

**Sanitize**

-  ``Sanitize::html()`` agora sempre retorna strings escapadas.
   Antigamente, ao se usar o parâmetro ``$remove`` era possível não usar
   codificação de entidades HTML, retornando conteúdo potencialmente
   perigoso.
-  ``Sanitize::clean()`` agora tem uma opção ``remove_html``. Isto irá
   disparar o recurso de ``strip_tags`` de ``Sanitize::html()`` e deve
   ser utilizado juntamente com o parâmetro ``encode``.

**Configure e App**

-  Configure::listObjects() foi substituído por App::objects()
-  Configure::corePaths() foi substituído por App::core()
-  Configure::buildPaths() foi substituído por App::build()
-  Configure não mais gerencia caminhos (paths) da aplicação.
-  Configure::write('modelPaths', array...) foi substituído por
   App::build(array('models' => array...))
-  Configure::read('modelPaths') foi substituído por App::path('models')
-  Não há mas um debug = 3. Despejar o conteúdo do controller (gerado
   por esta opção) frequentemente causava problemas com consumo de
   memória, o que o tornava uma configuração pouco prática e quase
   inútil. A variávl ``$cakeDebug`` também foi removida de
   ``View::renderLayout``. Você deve remover as referências a esta
   variável para evitar erros.
-  ``Configure::load()`` agora pode carregar arquivos de configuração em
   plugins. Utilize ``Configure::load('plugin.file');`` para carregar
   arquivos de configuração que estejam em plugins. Quaisquer arquivos
   de configuração em sua aplicação que tenham ``.`` no nome devem ser
   alteradas par usar ``_``

**Cache**

Além de ser capaz de carregar mecanismos de cache a partir de app/libs
ou plugins, o Cache teve de passar por algumas refatoração para o
CakePHP1.3. Tais refatoração tiveram objetivo de reduzir a quantidade e
a frequência de chamadas de métodos. O resultado final foi uma
significativa melhoria de performance com apenas algumas poucas
alterações na API que estão detalhadas abaixo.

As mudanças no Cache removeram os singletons usados para cada tipo de
mecanismo de cache. Ao invés disso, uma instância de um mecanismo de
cache é feita para cada chave única criada com ``Cache::config()``. Como
os mecanismos de cache não são mais singletons, ``Cache::engine()``
deixou de ser necessário e foi removido. Além disso,
``Cache::isInitialized()`` agora verifica os *nomes das configurações* e
cache e não mais os *nomes dos mecanismos* de cache. Você ainda pode
utilizar ``Cache::set()`` ou ``Cache::engine()`` para modificar
configurações de cache. Consulte também o `Guia de novos
recursos </pt/view/1572/New-features-in-CakePHP-1-3>`_ do CakePHP1.3
para mais informações sobre os métodos adicionar incluídos em ``Cache``.

Você também deve notar que usar um mecanismo de cache em app/libs ou
plugin como configuração de cache padrão pode causar alguns problemas de
desempenho uma vez que a operação que faz a carga dessas classes nunca
será cacheada. É recomendável que você ou utilize um dos mecanismos de
cache já presentes do núcleo como sua configuração ``padrão``, ou que
inclua manualmente a classe do mecanismo de cache antes de configurá-la.
Além disso, quaisquer configurações de mecanismos de cache fora do
núcleo devem ser feitas no ``app/config/bootstrap.php`` pelas mesmas
razões já mostradas acima.

Model Databases e Datasources
=============================

**Modelo**

-  ``Model::del()`` e ``Model::remove()`` foi modificado para
   ``Model::delete()``, tornando-se agora o método padrão.
-  ``Model::findAll``, findCount, findNeighbours, removidos.
-  Chamadas dinâmicas de setTablePrefix() foram removidas. Prefixos de
   tabela devem estar com a propriedade ``$tablePrefix``, e qualquer
   outro behavior de customização de ser sobrcarregado com um
   ``Model::__construct()``.
-  ``DboSource::query()`` agora lança avisos para métodos de modelos não
   tratados ao invés de executá-los como queryes. Isto significa que,
   pessoas que executam transações com a sintaxe
   ``$this->Model->begin()`` precisará atualizar seu código afim de
   acessar o objeto diretamente da Fonte de Dados do Modelo.
-  Ausência de métodos de validação agora disparam avisos no mode de
   desenvolvimento.
-  Ausência de behaviors agora diparam CakeError.
-  ``Model::find(first)`` deixará de usar o atributo "id" para condições
   default senão houverem condições e o "id" não for vazio. Ou seja, não
   será usada condições(where).
-  For Model::saveAll() o valor padrão para a opção 'validate' é agora
   'first' ao invés de retornar "true"

**Datasources**

-  DataSource::exists() has been refactored to be more consistent with
   non-database backed datasources. Previously, if you set
   ``var $useTable = false; var $useDbConfig = 'custom';``, it was
   impossible for ``Model::exists()`` to return anything but false. This
   prevented custom datasources from using ``create()`` or ``update()``
   correctly without some ugly hacks. If you have custom datasources
   that implement ``create()``, ``update()``, and ``read()`` (since
   ``Model::exists()`` will make a call to ``Model::find('count')``,
   which is passed to ``DataSource::read()``), make sure to re-run your
   unit tests on 1.3.

**Databases**

Most database configurations no longer support the 'connect' key (which
has been deprecated since pre-1.2). Instead, set
``'persistent' => true`` or false to determine whether or not a
persistent database connection should be used

**SQL log dumping**

A commonly asked question is how can one disable or remove the SQL log
dump at the bottom of the page?. In previous versions the HTML SQL log
generation was buried inside DboSource. For 1.3 there is a new core
element called ``sql_dump``. ``DboSource`` no longer automatically
outputs SQL logs. If you want to output SQL logs in 1.3, do the
following:

::

    <?php echo $this->element('sql_dump'); ?>

You can place this element anywhere in your layout or view. The
``sql_dump`` element will only generate output when
``Configure::read('debug')`` is equal to 2. You can of course customize
or override this element in your app by creating
``app/views/elements/sql_dump.ctp``.

View and Helpers
================

**View**

-  ``View::renderElement`` removed. Use ``View::element()`` instead.
-  Automagic support for ``.thtml`` view file extension has been removed
   either declare ``$this->ext = 'thtml';`` in your controllers, or
   rename your views to use ``.ctp``
-  ``View::set('title', $var)`` no longer sets ``$title_for_layout``
   when rendering the layout. ``$title_for_layout`` is still populated
   by default. But if you want to customize it, use
   ``$this->set('title_for_layout', $var)``.
-  ``View::$pageTitle`` has been removed. Use
   ``$this->set('title_for_layout', $var);`` instead.
-  The ``$cakeDebug`` layout variable associated with debug = 3 has been
   removed. Remove it from your layouts as it will cause errors. Also
   see the notes related to SQL log dumping and Configure for more
   information.

All core helpers no longer use ``Helper::output()``. The method was
inconsistently used and caused output issues with many of FormHelper's
methods. If you previously overrode ``AppHelper::output()`` to force
helpers to auto-echo you will need to update your view files to manually
echo helper output.

**TextHelper**

-  ``TextHelper::trim()`` is deprecated, used ``truncate()`` instead.
-  ``TextHelper::highlight()`` no longer has:
-  an ``$highlighter`` parameter. Use ``$options['format']`` instead.
-  an ``$considerHtml``\ parameter. Use ``$options['html']`` instead.
-  ``TextHelper::truncate()`` no longer has:
-  an ``$ending`` parameter. Use ``$options['ending']`` instead.
-  an ``$exact`` parameter. Use ``$options['exact']`` instead.
-  an ``$considerHtml``\ parameter. Use ``$options['html']`` instead.

**PaginatorHelper**

PaginatorHelper has had a number of enhancements applied to make styling
easier.
 ``prev()``, ``next()``, ``first()`` and ``last()``

The disabled state of these methods now defaults to ``<span>`` tags
instead of ``<div>`` tags.

passedArgs are now auto merged with url options in paginator.

``sort()``, ``prev()``, ``next()`` now add additional class names to the
generated html. ``prev()`` adds a class of prev. ``next()`` adds a class
of next. ``sort()`` will add the direction currently being sorted,
either asc or desc.

**FormHelper**

-  ``FormHelper::dateTime()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::year()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::month()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::day()`` no longer has a ``$showEmpty`` parameter. Use
   ``$attributes['empty']`` instead.
-  ``FormHelper::minute()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::meridian()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  ``FormHelper::select()`` no longer has a ``$showEmpty`` parameter.
   Use ``$attributes['empty']`` instead.
-  Default urls generated by form helper no longer contain 'id'
   parameter. This makes default urls more consistent with documented
   userland routes. Also enables reverse routing to work in a more
   intuitive fashion with default FormHelper urls.
-  ``FormHelper::submit()`` Can now create other types of inputs other
   than type=submit. Use the type option to control the type of input
   generated.
-  ``FormHelper::button()`` Now creates ``<button>`` elements instead of
   reset or clear inputs. If you want to generate those types of inputs
   use ``FormHelper::submit()`` with a ``'type' => 'reset'`` option for
   example.
-  ``FormHelper::secure()`` and ``FormHelper::create()`` no longer
   create hidden fieldset elements. Instead they create hidden div
   elements. This improves validation with HTML4.

Also be sure to check the :doc:`/The-Manual/Core-Helpers/Form` for additional changes and
new features in the FormHelper.

**HtmlHelper**

-  ``HtmlHelper::meta()`` no longer has an ``$inline`` parameter. It has
   been merged with the ``$options`` array.
-  ``HtmlHelper::link()`` no longer has an ``$escapeTitle`` parameter.
   Use ``$options['escape']`` instead.
-  ``HtmlHelper::para()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::div()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::tag()`` no longer has an ``$escape`` parameter. Use
   ``$options['escape']`` instead.
-  ``HtmlHelper::css()`` no longer has an ``$inline`` parameter. Use
   ``$options['inline']`` instead.

**SessionHelper**

-  ``flash()`` no longer auto echos. You must add an
   ``echo $session->flash();`` to your session->flash() calls. flash()
   was the only helper method that auto outputted, and was changed to
   create consistency in helper methods.

**CacheHelper**

CacheHelper's interactions with ``Controller::$cacheAction`` has changed
slightly. In the past if you used an array for ``$cacheAction`` you were
required to use the routed url as the keys, this caused caching to break
whenever routes were changed. You also could set different cache
durations for different passed argument values, but not different named
parameters or query string parameters. Both of these
limitations/inconsistencies have been removed. You now use the
controller's action names as the keys for ``$cacheAction``. This makes
configuring ``$cacheAction`` easier as its no longer coupled to the
routing, and allows cacheAction to work with all custom routing. If you
need to have custom cache durations for specific argument sets you will
need to detect and update cacheAction in your controller.

**TimeHelper**

TimeHelper has been refactored to make it more i18n friendly. Internally
almost all calls to date() have been replaced by strftime(). The new
method TimeHelper::i18nFormat() has been added and will take
localization data from a LC\_TIME locale definition file in app/locale
following the POSIX standard. These are the changes made in the
TimeHelper API:

-  TimeHelper::format() can now take a time string as first parameter
   and a format string as the second one, the format must be using the
   strftime() style. When called with this parameter order it will try
   to automatically convert the date format into the preferred one for
   the current locale. It will also take parameters as in 1.2.x version
   to be backwards compatible, but in this case format string must be
   compatible with date().
-  TimeHelper::i18nFormat() has been added

**Deprecated Helpers**

Both the JavascriptHelper and the AjaxHelper are deprecated, and the
JsHelper + HtmlHelper should be used in their place.

You should replace

-  ``$javascript->link()`` with ``$html->script()``
-  ``$javascript->codeBlock()`` with ``$html->scriptBlock()`` or
   ``$html->scriptStart()`` and ``$html->scriptEnd()`` depending on your
   usage.

Console e shells
================

**Shell**

``Shell::getAdmin()`` foi movido para ``ProjectTask::getAdmin()``

**Schema shell**

-  ``cake schema run create`` foi renomeado para ``cake schema create``
-  ``cake schema run update`` foi renomeado para ``cake schema update``

**Controler de Erros do Console(Console Error Handling)**

O shell dispatcher foi modificado para retornar o código de status ``1``
caso o metodo chamado no console explicitamente retorne ``false``.
Retornando qualquer outra coisa retorna o código ``0``. Antes o valor
retornado do metodo era usado diretamente como status de saida na shell.

Metodos da Shell que estão retornando ``1`` para indicar um erro deverão
ser atualizado para retornar ``false``.

``Shell::error()`` foi modificado para finalizar com status 1 depois de
imprimir a mensagem de erro que agora usa um formato levemente
diferente.

::

    $this->error('Foo inválido', 'Por favor informe bar.');
    // imprime:
    Error: Foo inválido
    Por favor informe bar.
    // finaliza com status 1

``ShellDispatcher::stderr()`` foi modificado para não mais adicionar o
prefixo "Error:". Sua assinatura é agora similar a de
``Shell::stdout()``.

**ShellDispatcher::shiftArgs()**

O metodo foi alterado para retornar o proximo argumento(shifted
argument). Antes se não houvessem mais argumentos disponíveis ele
retornava false, agora retorna null. Antes se tivessem argumentos
disponíveis ele retornaria true, agora retorna o próximo argumento.

Vendors, Test Suite & schema
============================

**vendors/css, vendors/js, and vendors/img**

Support for these three directories, both in ``app/vendors`` as well as
``plugin/vendors`` has been removed. They have been replaced with plugin
and theme webroot directories.

**Test Suite and Unit Tests**

Group tests should now extend TestSuite instead of the deprecated
GroupTest class. If your Group tests do not run, you will need to update
the base class.

**Vendor, plugin and theme assets**

Vendor asset serving has been removed in 1.3 in favour of plugin and
theme webroot directories.

Schema files used with the SchemaShell have been moved to
``app/config/schema`` instead of ``app/config/sql`` Although
``config/sql`` will continue to work in 1.3, it will not in future
versions, it is recommend that the new path is used.
