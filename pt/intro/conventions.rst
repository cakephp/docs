Convenções do CakePHP
#####################

Nós somos grandes fãs de convenção sobre configuração. Apesar de levar um
pouco de tempo para aprender as convenções do CakePHP, você economiza tempo a
longo prazo. Ao seguir as convenções, você ganha funcionalidades
instantaneamente e liberta-se do pesadelo de manutenção e rastreamento de
arquivos de configuração. Convenções também prezam por uma experiência de
desenvolvimento uniforme, permitindo que outros desenvolvedores ajudem mais
facilmente.

Convenções para Controllers
===========================

Os nomes das classes de Controllers são pluralizados, CamelCased, e terminam em
``Controller``. ``PeopleController`` e
``LatestArticlesController`` são exemplos de nomes convencionais para
controllers.

Métodos públicos nos Controllers são frequentemente referenciados como 'actions'
acessíveis através de um navegador web. Por exemplo, o ``/articles/view`` mapeia
para o método ``view()`` do ``ArticlesController`` sem nenhum esforço. Métodos
privados ou protegidos não podem ser acessados pelo roteamento.

Considerações de URL para nomes de Controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como você acabou de ver, controllers singulares mapeiam facilmente um
caminho simples, todo em minúsculo. Por exemplo, ``ApplesController`` (o qual
deveria ser definido no arquivo de nome 'ApplesController.php') é acessado
por http://example.com/apples.

Controllers com múltiplas palavras *podem* estar em qualquer forma 'flexionada'
igual ao nome do controller, então:

*  /redApples
*  /RedApples
*  /Red\_apples
*  /red\_apples

Todos resolverão para o index do controller RedApples. Porém,
a forma correta é que suas URLs sejam minúsculas e separadas por sublinhado,
portanto /red\_apples/go\_pick é a forma correta de acessar a action
``RedApplesController::go_pick``.

Quando você cria links usando ``this->Html->link()``, você pode usar as seguintes
convenções para a array de url::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // CamelCased
        'plugin' => 'MyPlugin', // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

Para mais informações sobre o manuseio de URLs e parâmetros do CakePHP,
veja :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Convenções para nomes de Classes e seus nomes de arquivos
=========================================================

No geral, nomes de arquivos correspondem aos nomes das classes, e seguem os
padrões PSR-0 ou PSR-4 para auto-carregamento. A seguir seguem exemplos de
nomes de classes e de seus arquivos:

-  A classe de Controller **KissesAndHugsController** deveria ser encontrada
   em um arquivo nomeado **KissesAndHugsController.php**
-  A classe de Component **MyHandyComponent** deveria ser encontrada
   em um arquivo nomeado **MyHandyComponent.php**
-  A classe de Table **OptionValuesTable** deveria ser encontrada
   em um arquivo nomeado **OptionValuesTable.php**.
-  A classe de Entity **OptionValue** deveria ser encontrada
   em um arquivo nomeado **OptionValue.php**.
-  A classe de Behavior **EspeciallyFunkableBehavior** deveria ser encontrada
   em um arquivo nomeado **EspeciallyFunkableBehavior.php**
-  A classe de View **SuperSimpleView** deveria ser encontrada
   em um arquivo nomeado **SuperSimpleView.php**
-  A classe de Helper **BestEverHelper** deveria ser encontrada
   em um arquivo nomeado **BestEverHelper.php**

Cada arquivo deveria estar localizado no diretório/namespace apropriado de sua
aplicação.

Convenções para Models e Databases
==================================

Os nomes de classe de Tables são pluralizadas e CamelCased. People, BigPeople,
and ReallyBigPeople são todos exemplos convencionais de models.

Os nomes de Tables correspondentes aos models do CakePHP são pluralizadas e
separadas por sublinhado. As tables sublinhadas para os models mencionados acima
seriam ``people``,  ``big_people``, e ``really_big_people``,
respectively.

Você pode utilizar a biblioteca utility :php:class:`Cake\\Utility\\Inflector`
para checar o singular/plural de palavras. Veja o
:doc:`/core-libraries/inflector` para mais informações. Recomenda-se que
as tables sejam criadas e mantidas na língua inglesa.

Campos com duas ou mais palavras são separados por sublinhado: first\_name.

Chaves estrangeiras nos relacionamentos hasMany, belongsTo ou hasOne são
reconhecidas por padrão como o nome (singular) da table relacionada seguida por
\_id. Então se Bakers hasMany Cakes, a table cakes irá referenciar-se para a
table bakers através da chave estrangeira baker\_id. Para uma tabela como
category\_types a qual o nome contém mais palavras, a chave estrangeira seria a
category\_type\_id.

tables de união, usadas no relacionamento BelongsToMany entre models, devem ser
nomeadas depois das tables que ela está unindo, ordenadas em ordem alfabética
(apples\_zebras ao invés de zebras\_apples).

Convenções para Views
=====================

Arquivos de template views são nomeadas seguindo as funções
que a exibem do controller, separadas por sublinhado. A função
getReady() da classe PeopleController buscará por um template view em
**src/Template/People/get\_ready.ctp**. O padrão é
**src/Template/Controller/underscored\_function\_name.ctp**.

Por nomear as partes de sua aplicação utilizando as convenções do CakePHP,
você ganha funcionalidades sem luta e sem amarras de configuração.
Aqui está um exemplo final que enlaça as convenções juntas:

-  Table: "people"
-  Classe Table: "PeopleTable", encontrada em
   **src/Model/Table/PeopleTable.php**
-  Classe Entity: "Person", encontrada em **src/Model/Entity/Person.php**
-  Classe Controller: "PeopleController", encontrada em
   **src/Controller/PeopleController.php**
-  View template, encontrado em **src/Template/People/index.ctp**

Utilizando estas convenções, o CakePHP sabe que uma requisição para
http://example.com/people/ mapeia para uma chamada da função ``index()``
do PeopleController, onde o model Person é automaticamente disponbilizado
(e automaticamente amarrado à table 'people' no banco de dados), e então
renderiza-se um arquivo view template. Nenhuma destes relacionamentos
foi configurado de qualquer forma se não por criar classes e arquivos
que você precisaria criar de qualquer forma.

Agora que você foi introduzido aos fundamentos do CakePHP, você pode tentar
seguir através do  :doc:`/tutorials-and-examples/blog/blog` para ver como
as coisas se encaixam juntas.

.. meta::
    :title lang=pt: Convenções do CakePHP
    :keywords lang=pt: desenvolvimento,experiencia,manutenção,chato,pesadelo,método index,sistemas legados,nomes,métodos,php class,sistema uniforme,config,convenções,controller,boas práticas,regras,cakephp,lógica,padrão
