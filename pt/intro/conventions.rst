Convenções do CakePHP
#####################

Somos grandes fãs de convenção sobre configuração. Embora leve um pouco de tempo
para aprender as convenções do CakePHP, você economiza tempo a longo prazo. Ao seguir
convenções, você ganha funcionalidade gratuita e se liberta do
pesadelo de manutenção de rastrear arquivos de configuração. As convenções também proporcionam uma
experiência de desenvolvimento muito uniforme, permitindo que outros desenvolvedores entrem e ajudem.

Convenções de Controller
=========================

Os nomes das classes Controller são plurais, CamelCased e terminam em ``Controller``.
``UsersController`` e ``MenuLinksController`` são exemplos de
nomes de controller convencionais.

Métodos públicos em Controllers são frequentemente expostos como 'actions' acessíveis através
de um navegador web. Eles são camelBacked. Por exemplo, o ``/users/view-me`` mapeia para o método ``viewMe()``
do ``UsersController`` prontos para uso (se usar inflexão tracejada padrão no roteamento).
Métodos protegidos ou privados não podem ser acessados com roteamento.

Considerações de URL para Nomes de Controller
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como você acabou de ver, controllers de palavra única mapeiam para um caminho de URL
minúsculo simples. Por exemplo, ``UsersController`` (que seria definido no arquivo
**UsersController.php**) é acessado de ``http://example.com/users``.

Embora você possa rotear controllers de múltiplas palavras da maneira que desejar, a
convenção é que suas URLs sejam minúsculas e tracejadas usando a classe ``DashedRoute``,
portanto ``/menu-links/view-all`` é a forma correta de acessar
a action ``MenuLinksController::viewAll()``.

Quando você cria links usando ``this->Html->link()``, pode usar as seguintes
convenções para o array de url::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // CamelCased
        'plugin' => 'MyPlugin', // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

Para mais informações sobre URLs e manipulação de parâmetros do CakePHP, veja
:ref:`routes-configuration`.

.. _file-and-classname-conventions:

Convenções de Nome de Arquivo e Classe
=======================================

Em geral, os nomes de arquivo correspondem aos nomes de classe e seguem o padrão PSR-4 para
autoloading. A seguir estão alguns exemplos de nomes de classe e seus nomes de arquivo:

-  A classe Controller ``LatestArticlesController`` seria encontrada em um arquivo
   chamado **LatestArticlesController.php**
-  A classe Component ``MyHandyComponent`` seria encontrada em um arquivo chamado
   **MyHandyComponent.php**
-  A classe Table ``OptionValuesTable`` seria encontrada em um arquivo chamado
   **OptionValuesTable.php**.
-  A classe Entity ``OptionValue`` seria encontrada em um arquivo chamado
   **OptionValue.php**.
-  A classe Behavior ``EspeciallyFunkableBehavior`` seria encontrada em um arquivo
   chamado **EspeciallyFunkableBehavior.php**
-  A classe View ``SuperSimpleView`` seria encontrada em um arquivo chamado
   **SuperSimpleView.php**
-  A classe Helper ``BestEverHelper`` seria encontrada em um arquivo chamado
   **BestEverHelper.php**

Cada arquivo seria localizado na pasta/namespace apropriado em sua pasta
app.

.. _model-and-database-conventions:

Convenções de Banco de Dados
=============================

Os nomes de tabelas correspondentes aos modelos CakePHP são plurais e sublinhados. Por
exemplo ``users``, ``menu_links`` e ``user_favorite_pages``
respectivamente. Nomes de tabela cujo nome contém múltiplas palavras devem apenas
pluralizar a última palavra, por exemplo, ``menu_links``.

Nomes de coluna com duas ou mais palavras são sublinhados, por exemplo, ``first_name``.

Chaves estrangeiras em relacionamentos hasMany, belongsTo/hasOne são reconhecidas por
padrão como o nome (singular) da tabela relacionada seguido por ``_id``. Então, se
Users hasMany Articles, a tabela ``articles`` se referirá à tabela ``users``
através de uma chave estrangeira ``user_id``. Para uma tabela como ``menu_links``
cujo nome contém múltiplas palavras, a chave estrangeira seria
``menu_link_id``.

Tabelas de junção (ou "junction") são usadas em relacionamentos BelongsToMany entre
modelos. Elas devem ser nomeadas pelas tabelas que conectam. Os nomes devem ser
pluralizados e ordenados alfabeticamente: ``articles_tags``, não ``tags_articles``
ou ``article_tags``. *O comando bake não funcionará se esta convenção não for
seguida.* Se a tabela de junção contiver quaisquer dados além das chaves
estrangeiras de vinculação, você deve criar uma classe de entidade/tabela concreta para a tabela.

Além de usar um inteiro auto-incrementado como chaves primárias, você também pode
usar colunas UUID. O CakePHP criará valores UUID automaticamente usando
(:php:meth:`Cake\\Utility\\Text::uuid()`) sempre que você salvar novos registros usando
o método ``Table::save()``.

Convenções de Model
===================

Os nomes de classes Table são plurais, CamelCased e terminam em ``Table``. ``UsersTable``,
``MenuLinksTable`` e ``UserFavoritePagesTable`` são todos exemplos de
nomes de classe de tabela correspondendo às tabelas ``users``, ``menu_links`` e
``user_favorite_pages`` respectivamente.

Os nomes de classes Entity são CamelCased singulares e não têm sufixo. ``User``,
``MenuLink`` e ``UserFavoritePage`` são todos exemplos de nomes de entidade
correspondendo às tabelas ``users``, ``menu_links`` e ``user_favorite_pages``
respectivamente.

Os nomes de classes Enum devem usar uma convenção ``{Entity}{Column}``, e os casos de enum
devem usar nomes CamelCased.


Convenções de View
===================

Os arquivos de template de view são nomeados após as funções do controller que exibem, em forma
sublinhada. A função ``viewAll()`` da classe ``ArticlesController``
procurará um template de view em **templates/Articles/view_all.php**.

O padrão básico é
**templates/Controller/underscored_function_name.php**.

.. note::

    Por padrão, o CakePHP usa inflexões em inglês. Se você tiver tabelas/colunas de banco de dados
    que usam outro idioma, precisará adicionar regras de inflexão
    (do singular para o plural e vice-versa). Você pode usar
    :php:class:`Cake\\Utility\\Inflector` para definir suas regras de inflexão
    personalizadas. Veja a documentação sobre :doc:`/core-libraries/inflector` para mais
    informações.

Convenções de Plugins
======================

É útil prefixar um plugin CakePHP com "cakephp-" no nome do pacote.
Isso torna o nome semanticamente relacionado ao framework do qual ele depende.

**Não** use o namespace CakePHP (cakephp) como nome de fornecedor, pois isso é
reservado para plugins pertencentes ao CakePHP. A convenção é usar letras minúsculas
e travessões como separador::

    // Ruim
    cakephp/foo-bar

    // Bom
    your-name/cakephp-foo-bar

Veja `recomendações da lista incrível
<https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins>`__
para detalhes.

Resumo
======

Ao nomear as peças de sua aplicação usando as convenções do CakePHP, você ganha
funcionalidade sem o incômodo e as amarras de manutenção da configuração.
Aqui está um exemplo final que une as convenções:

-  Tabela de banco de dados: "articles", "menu_links"
-  Classe Table: ``ArticlesTable``, encontrada em **src/Model/Table/ArticlesTable.php**
-  Classe Entity: ``Article``, encontrada em **src/Model/Entity/Article.php**
-  Classe Controller: ``ArticlesController``, encontrada em
   **src/Controller/ArticlesController.php**
-  Template View, encontrado em **templates/Articles/index.php**

Usando essas convenções, o CakePHP sabe que uma requisição para
``http://example.com/articles`` mapeia para uma chamada ao método ``index()`` do
``ArticlesController``, onde o modelo ``Articles`` está automaticamente disponível.
Nenhum desses relacionamentos foi configurado por qualquer meio além de
criar classes e arquivos que você precisaria criar de qualquer maneira.

+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Exemplo    | articles                    | menu_links              |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Database   | articles                    | menu_links              | Nomes de tabela correspondentes aos modelos          |
| Table      |                             |                         | CakePHP são plurais e sublinhados.                   |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| File       | ArticlesController.php      | MenuLinksController.php |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Table      | ArticlesTable.php           | MenuLinksTable.php      | Nomes de classe Table são plurais,                   |
|            |                             |                         | CamelCased e terminam em Table                       |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Entity     | Article.php                 | MenuLink.php            | Nomes de classe Entity são singulares,               |
|            |                             |                         | CamelCased: Article e MenuLink                       |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Class      | ArticlesController          | MenuLinksController     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Controller | ArticlesController          | MenuLinksController     | Plural, CamelCased, termina em Controller            |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Templates  | Articles/index.php          | MenuLinks/index.php     | Arquivos de template de view são nomeados            |
|            | Articles/add.php            | MenuLinks/add.php       | após as funções do controller que eles               |
|            | Articles/get_list.php       | MenuLinks/get_list.php  | exibem, em forma sublinhada                          |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Behavior   | ArticlesBehavior.php        | MenuLinksBehavior.php   |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| View       | ArticlesView.php            | MenuLinksView.php       |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Helper     | ArticlesHelper.php          | MenuLinksHelper.php     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Component  | ArticlesComponent.php       | MenuLinksComponent.php  |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plugin     | Ruim: cakephp/articles      | cakephp/menu-links      | Útil prefixar um plugin CakePHP com "cakephp-"       |
|            | Bom: you/cakephp-articles   | you/cakephp-menu-links  | no nome do pacote. Não use o namespace CakePHP       |
|            |                             |                         | (cakephp) como nome de fornecedor, pois isso é       |
|            |                             |                         | reservado para plugins pertencentes ao CakePHP. A    |
|            |                             |                         | convenção é usar letras minúsculas e travessões      |
|            |                             |                         | como separador.                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Cada arquivo seria localizado na pasta/namespace apropriado em sua pasta app.                                             |
+------------+-----------------------------+-------------------------+------------------------------------------------------+


Resumo da Convenção de Banco de Dados
======================================
+-----------------+--------------------------------------------------------------+
| Foreign keys    | Relacionamentos são reconhecidos por padrão como o           |
|                 | nome (singular) da tabela relacionada seguido por ``_id``.   |
| hasMany         | Users hasMany Articles, a tabela ``articles`` se referirá    |
| belongsTo/      | à tabela ``users`` através de uma chave estrangeira          |
| hasOne          | ``user_id``.                                                 |
| BelongsToMany   |                                                              |
|                 |                                                              |
+-----------------+--------------------------------------------------------------+
| Multiple Words  | ``menu_links`` cujo nome contém múltiplas palavras,          |
|                 | a chave estrangeira seria ``menu_link_id``.                  |
+-----------------+--------------------------------------------------------------+
| Auto Increment  | Além de usar um inteiro auto-incrementado como               |
|                 | chaves primárias, você também pode usar colunas UUID.        |
|                 | O CakePHP criará valores UUID automaticamente                |
|                 | usando (:php:meth:`Cake\\Utility\\Text::uuid()`)             |
|                 | sempre que você salvar novos registros usando o              |
|                 | método ``Table::save()``.                                    |
+-----------------+--------------------------------------------------------------+
| Join tables     | Devem ser nomeadas pelas tabelas de modelo que irão unir     |
|                 | ou o comando bake não funcionará, organizadas em ordem       |
|                 | alfabética (``articles_tags`` ao invés de ``tags_articles``).|
|                 | Colunas adicionais na tabela de junção você deve criar       |
|                 | uma classe de entidade/tabela separada para aquela tabela.   |
+-----------------+--------------------------------------------------------------+

Agora que você foi apresentado aos fundamentos do CakePHP, você pode tentar uma execução
através do :doc:`/tutorials-and-examples/cms/installation` para ver como as coisas se encaixam.


.. meta::
    :title lang=pt: Convenções do CakePHP
    :keywords lang=pt: experiência de desenvolvimento web,pesadelo de manutenção,método index,sistemas legados,nomes de método,php class,sistema uniforme,arquivos de configuração,tenets,articles,convenções,controller convencional,melhores práticas,mapas,visibilidade,artigos de notícias,funcionalidade,lógica,cakephp,desenvolvedores
