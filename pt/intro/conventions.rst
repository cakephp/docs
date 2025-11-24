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
``Controller``. ``UsersController`` e
``MenuLinksController`` são exemplos de nomes convencionais para
controllers.

Métodos públicos em Controllers são frequentemente referenciados como "actions"
acessíveis através de um navegador web. Eles são baseados em camelBacked. Por exemplo,
o ``/users/view-me`` mapeia para o ``viewMe()`` do ``UsersController`` sem nenhum esforço
(se usarmos a inflexão tracejada padrão no roteamento). Métodos protegidos ou privados
não podem ser acessados com roteamento.

Considerações de URL para nomes de Controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como você acabou de ver, controllers singulares mapeiam facilmente um
caminho simples, todo em minúsculo. Por exemplo, ``UsersController`` (o qual
deveria ser definido no arquivo de nome 'UsersController.php') é acessado
por http://example.com/users.

Embora você possa rotear vários controllers da maneira que desejar,
a convenção é que suas URLs sejam minúsculas e tracejadas usando a
classe ``DashedRoute``, portanto, ``/menu-links/view-all`` é a forma
correta de acessar a ação ``MenuLinksController::viewAll()``.

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

No geral, nomes de arquivos correspondem aos nomes das classes, e seguem o
padrão PSR-4 para auto-carregamento. A seguir seguem exemplos de
nomes de classes e de seus arquivos:

-  A classe de Controller ``LatestArticlesController`` deveria ser encontrada
   em um arquivo nomeado **LatestArticlesController.php**
-  A classe de Component ``MyHandyComponent`` deveria ser encontrada
   em um arquivo nomeado **MyHandyComponent.php**
-  A classe de Table ``OptionValuesTable`` deveria ser encontrada
   em um arquivo nomeado **OptionValuesTable.php**.
-  A classe de Entity ``OptionValue`` deveria ser encontrada
   em um arquivo nomeado **OptionValue.php**.
-  A classe de Behavior ``EspeciallyFunkableBehavior`` deveria ser encontrada
   em um arquivo nomeado **EspeciallyFunkableBehavior.php**
-  A classe de View ``SuperSimpleView`` deveria ser encontrada
   em um arquivo nomeado **SuperSimpleView.php**
-  A classe de Helper ``BestEverHelper`` deveria ser encontrada
   em um arquivo nomeado **BestEverHelper.php**

Cada arquivo deveria estar localizado no diretório/namespace apropriado de sua
aplicação.

Convenções para Banco de Dados
==============================

Nomes de tabelas correspondentes aos modelos do CakePHP são plurais e sublinhados. Por
exemplo, ``users``, ``menu_links`` e ``user_favorite_pages``
respectivamente. Nomes de tabelas que contenham múltiplas palavras devem
pluralizar apenas a última palavra, por exemplo, ``menu_links``.

Nomes de colunas com duas ou mais palavras são sublinhados, por exemplo, ``first_name``.

Chaves estrangeiras em relacionamentos hasMany e belongsTo/hasOne são reconhecidas por
padrão como o nome (singular) da tabela relacionada seguido por ``_id``. Portanto, se
Users hasMany Articles, a tabela ``articles`` se referirá à tabela ``users``
por meio de uma chave estrangeira ``user_id``. Para uma tabela como ``menu_links``
cujo nome contém várias palavras, a chave estrangeira seria ``menu_link_id``.

Tabelas Join (ou "junção") são usadas em relacionamentos BelongsToMany entre
modelos. Elas devem receber os nomes das tabelas que conectam. Os nomes devem ser
pluralizados e classificados em ordem alfabética: ``articles_tags``, não ``tags_articles``
ou ``article_tags``. *O comando bake não funcionará se esta convenção não for
seguida.* Se a tabela de junção contiver quaisquer dados além das chaves estrangeiras
de ligação, você deverá criar uma classe de entidade/tabela concreta para a tabela.

Além de usar um inteiro autoincrementável como chaves primárias, você também pode
usar colunas UUID. O CakePHP criará valores UUID automaticamente usando
(:php:meth:`Cake\\Utility\\Text::uuid()`) sempre que você salvar novos registros usando
o método ``Table::save()``.

Convenções para Models
======================

Os nomes de classes de tabela são plurais, CamelCased e terminam em ``Table``. ``UsersTable``,
``MenuLinksTable`` e ``UserFavoritePagesTable`` são todos exemplos de
nomes de classes de tabela que correspondem às tabelas ``users``, ``menu_links`` e
``user_favorite_pages``, respectivamente.

Os nomes das classes de entidade são escritos no singular com CamelCased e não possuem sufixo. ``User``,
``MenuLink`` e ``UserFavoritePage`` são exemplos de nomes de entidade
que correspondem às tabelas ``users``, ``menu_links`` e ``user_favorite_pages``,
respectivamente.

Os nomes de classes Enum devem usar a convenção ``{Entity}{Column}``, e os casos de enum
devem usar nomes CamelCased.


Convenções para Views
=====================

Os arquivos template de Views são nomeados de acordo com as funções do controller que exibem,
em formato sublinhado. A função ``viewAll()`` da classe ``ArticlesController``
procurará um modelo de visualização em **templates/Articles/view_all.php**.

O padrão básico é
**templates/Controller/underscored_function_name.php**.

.. note::

    Por padrão, o CakePHP usa flexões em inglês. Se você tiver tabelas/colunas de banco de dados
    que usam outro idioma, precisará adicionar regras de flexão
    (do singular para o plural e vice-versa). Você pode usar
    :php:class:`Cake\\Utility\\Inflector` para definir suas regras de flexão
    personalizadas. Consulte a documentação sobre :doc:`/core-libraries/inflector` para mais
    informações.

Convenções para Plugins
=======================

É útil prefixar um plugin do CakePHP com "cakephp-" no nome do pacote.
Isso torna o nome semanticamente relacionado ao framework do qual depende.

**Não** use o namespace CakePHP (cakephp) como nome do vendor, pois este é
reservado para plugins de propriedade do CakePHP. A convenção é usar letras minúsculas
e hífens como separadores::

    // Ruim
    cakephp/foo-bar

    // Bom
    your-name/cakephp-foo-bar

Veja a `incrível lista de recomendações
<https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins>`__
para mais detalhes.

Resumo
======

Ao nomear as partes da sua aplicação usando as convenções do CakePHP, você ganha
funcionalidade sem os problemas e as dificuldades de manutenção da configuração.
Aqui está um exemplo final que une as convenções:

-  Database table: "articles", "menu_links"
-  Table class: ``ArticlesTable``, encontrado em **src/Model/Table/ArticlesTable.php**
-  Entity class: ``Article``, encontrado em **src/Model/Entity/Article.php**
-  Controller class: ``ArticlesController``, encontrado em
   **src/Controller/ArticlesController.php**
-  View template, encontrado em **templates/Articles/index.php**

Usando essas convenções, o CakePHP sabe que uma requisição para
``http://example.com/articles`` mapeia para uma chamada ao método ``index()`` do
``ArticlesController``, onde o modelo ``Articles`` está automaticamente disponível.
Nenhum desses relacionamentos foi configurado por qualquer outro meio além
da criação de classes e arquivos que você precisaria criar de qualquer maneira.

+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Exemplo    | articles                    | menu_links              |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Database   | articles                    | menu_links              | Os nomes das tabelas correspondentes aos             |
| Table      |                             |                         | modelos CakePHP são plurais e sublinhados.           |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| File       | ArticlesController.php      | MenuLinksController.php |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Table      | ArticlesTable.php           | MenuLinksTable.php      | Os nomes das classes de tabela são plurais,          |
|            |                             |                         | CamelCased e terminam em Table                       |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Entity     | Article.php                 | MenuLink.php            | Os nomes das classes de entidade são singulares,     |
|            |                             |                         | CamelCased: Article e MenuLink                       |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Class      | ArticlesController          | MenuLinksController     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Controller | ArticlesController          | MenuLinksController     | Plural, CamelCased, termina em Controller            |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Templates  | Articles/index.php          | MenuLinks/index.php     | Os arquivos de modelo de view são nomeados de        |
|            | Articles/add.php            | MenuLinks/add.php       | acordo com as funções do controller que eles         |
|            | Articles/get_list.php       | MenuLinks/get_list.php  | exibem, em formato sublinhado                        |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Behavior   | ArticlesBehavior.php        | MenuLinksBehavior.php   |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| View       | ArticlesView.php            | MenuLinksView.php       |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Helper     | ArticlesHelper.php          | MenuLinksHelper.php     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Component  | ArticlesComponent.php       | MenuLinksComponent.php  |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plugin     | Ruim: cakephp/articles      | cakephp/menu-links      | É útil prefixar um plugin do CakePHP com "cakephp-"  |
|            | Bom: you/cakephp-articles   | you/cakephp-menu-links  | no nome do pacote. Não use o namespace CakePHP       |
|            |                             |                         | (cakephp) como nome do fornecedor, pois este é       |
|            |                             |                         | reservado para plugins de propriedade do CakePHP.    |
|            |                             |                         | A convenção é usar letras minúsculas e hífens como   |
|            |                             |                         | separadores.                                         |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Cada arquivo estará localizado no diretório/namespace apropriado na pasta do seu aplicativo.                              |
+------------+-----------------------------+-------------------------+------------------------------------------------------+

Resumo da Convenção de Banco de Dados
=====================================
+-----------------+--------------------------------------------------------------+
| Foreign keys    | Os relacionamentos são reconhecidos por padrão com o         |
|                 | nome (singular) da tabela relacionada seguido por ``_id``.   |
| hasMany         | Usuários com muitos artigos, a tabela ``articles``           |
| belongsTo/      | se referirá à tabela ``users``                               |
| hasOne          | por meio de uma foreign key ``user_id``.                     |
| BelongsToMany   |                                                              |
|                 |                                                              |
+-----------------+--------------------------------------------------------------+
| Multiple Words  | ``menu_links`` cujo nome contém várias palavras,             |
|                 | a foreign key seria ``menu_link_id``.                        |
+-----------------+--------------------------------------------------------------+
| Auto Increment  | Além de usar um inteiro autoincrementável como               |
|                 | chaves primárias, você também pode usar colunas UUID.        |
|                 | O CakePHP criará valores UUID automaticamente                |
|                 | usando (:php:meth:`Cake\\Utility\\Text::uuid()`)             |
|                 | sempre que você salvar novos registros usando o método       |
|                 | ``Table::save()``.                                           |
+-----------------+--------------------------------------------------------------+
| Join tables     | Devem ser nomeados de acordo com as tabelas do modelo que    |
|                 | serão unidas ou o comando bake não funcionará, organizados   |
|                 | em ordem alfabética                                          |
|                 | (``articles_tags`` em vez de ``tags_articles``).             |
|                 | Para colunas adicionais na tabela de junção, você deve criar |
|                 | uma classe de entidade/tabela separada para essa tabela.     |
+-----------------+--------------------------------------------------------------+

Agora que você foi introduzido aos fundamentos do CakePHP, você pode tentar
seguir através do  :doc:`/tutorials-and-examples/cms/installation` para ver como
as coisas se encaixam juntas.

.. meta::
    :title lang=pt: Convenções do CakePHP
    :keywords lang=pt: desenvolvimento,experiencia,manutenção,chato,pesadelo,método index,sistemas legados,nomes,métodos,php class,sistema uniforme,config,convenções,controller,boas práticas,regras,cakephp,lógica,padrão
