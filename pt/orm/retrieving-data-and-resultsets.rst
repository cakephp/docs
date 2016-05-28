Retornando dados e conjuntos de resultados
##############################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Quando executar uma query, você obterá um objeto Entidade. Nesta sessão discutiremos diferentes caminhos para se obter: entidades, carregar informações relacionais, abstratas, ou complexo relacional. Você poderá ler mais sobre :doc:`/orm/entities` ( ‘Entity’ em inglês ).

Depurando Queries e Resultados
================================

Quando o ORM foi implementado, era muito difícil depurar os resultados obtidos nas versões anteriores do CakePHP. Agora existem muitas formas fáceis de inspecionar os dados retornados pelo ORM.

- ``debug($query)`` Mostra o SQL e os parâmetros incluídos, não mostra resultados.
- ``debug($query->all())`` Mostra a propriedade ResultSet retornado pelo ORM.
- ``debug($query->toArray())`` Um caminho mais fácil para mostrar todos os resultados.
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` Exemplo em JSON.
- ``debug($query->first())`` Primeiro resultado obtido na query.
- ``debug((string)$query->first())`` Mostra as propriedades de uma única entidade em JSON.

Tente isto na camada Controller: debug( $this->{EntidadeNome}->find()->all() );

Pegando uma única entidade com a chave primária
======================================

.. php:method:: get($id, $options = [])

Sempre que é necessário editar ou visualizar uma entidade ou dados relacionais você pode usar ``get()``::

    // No controller ou table tente isto.

    // Retorna um único artigo pelo id primário.
    $article = $articles->get($id);

    // Retorna um artigo com seus comentários
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

Quando não conseguir obter um resultado
``Cake\Datasource\Exception\RecordNotFoundException`` será disparado. Você poderá tratar esta exceção, ou converter num erro 404.

O metódo ``find()`` usa uma cache integrado. Você pode uma a opção ``cache`` quando chamar ``get()`` para uma performance na leitura - ``caching``::

    // No controller ou table tente isto.

    // Use uma configuração de cache ou uma instância do CacheEngine do Cake com uma ID gerada.
    $article = $articles->get($id, [
        'cache' => 'custom',
    ]);

    // mykey reserva uma id especifica para determinado cache de resultados.
    $article = $articles->get($id, [
        'cache' => 'custom', 'key' => 'mykey'
    ]);

    // Desabilitando cache explicitamente
    $article = $articles->get($id, [
        'cache' => false
    ]);




``Por padrão o CakePHP possui um sistema interno de cache que viabiliza busca e aumenta a performance - não recomendado desabilatar.``

Opcionalmente você pode usar ``get()`` nas entidades com busca customizavél :ref:`custom-find-methods`. Por
exemplo, você pode querer pegar todas as traduções de uma entidade. Poderá usar
a opção ``finder``::

    $article = $articles->get($id, [
        'finder' => 'translations',
    ]);

Usando ``'find()'`` para carregar dados
==========================

.. php:method:: find($type, $options = [])

Agora que você sabe e pode trabalhar com entidades, Precisará carrega las e gostará muito como fazer isso. O caminho mais simples
para carregar uma Entidade ou objetos relacionais metódo ``find()``. find provê um extensivél e facíl caminho para procurar e retornar dados,
talves você se interesse por in::

    // No controller ou table.

    // Procure todos os artigos
    $query = $articles->find('all');

O valor retornado por qualquer metódo ``find()`` será sempre
um :php:class:`Cake\\ORM\\Query` objeto. A class Query assim permitindo que possa
posteriormente refinar a consulta depois de cria lá. Objeto Query não será executado até que
inicie um busca por linhas, seja convertido num array, ou chamado outro metódo, exemplo: ``all()``::

    // No controller ou table.

    // Retorne todos os artigos
    // Até este ponto, nada acontece.
    $query = $articles->find('all');

    // Uma iteração executa a consulta
    foreach ($query as $row) {
    }

    // Chamando all() executa a consulta.
    // e retorna os conjuntos de resultados.
    $results = $query->all();

    // Linhas são retornadas em forma de array
    $data = $results->toArray();

    // Armazenando a consulta num array
    $results = $query->toArray();

.. note::

    Você já sabe executar uma consulta, gostará de :doc:`/orm/query-builder`
    para implementar e construir consultas otimizadas ou complexas, adicionando condições específica,
    limites, incluíndo associação ou uma interface mais fluênte, ou busca de resultados por id de usuário lógado.

::

    // No controller ou table.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

Não se limite, poderá ir muito além com  ``find()``. Isto o ajuda com metódos simulados::

    // No controller ou table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);
    //Ao buscar todos os artigos, retorne somente artigos com data de hoje - 10 dias atrás
    //Depois junto com esses artigos me retorne também seus autores e comentários inclusos.

Opções suportadas por find() são:

- ``conditions`` provê acesso direto na cláusula Where.
- ``limit`` Limite o número de resultados.
- ``offset`` Uma página que você quer. Use ``page`` para cálculo simplificado.
- ``contain`` defina uma associação para carregar.
- ``fields`` Quais campos você deseja carregar somente? Quando carregar somente alguns campos o lembre-se dos plugins, callbacks.
- ``group`` adicione um GROUP BY. muito usado para funçoes agregadas.
- ``having`` adicionar HVAING.
- ``join`` Defina um Join específico.
- ``order`` Ordenar resultados por.

Outras opções fora dessa lista, serão passadas para o beforeFind ou outras funções de tratamento, 
onde podem ser usados para tratar a consulta a sua maneira. Pode usar o metódo
``getOptions()`` no objeto para retornar as opções utilizadas. Quando uma consulta for passada para o controller, recomendamos uma leitura
sobre consultas personalizadas em :ref:`custom-find-methods`. Usando metódos de consultas personalizados, você terá um melhor reuso de seu código, e ficará fácil para testar a sua maneira.

Por padrão consultas retornam :doc:`/orm/entities` objeto. Você pode retorna array basico usando
hydration::

    $query->hydrate(false);

    // $data is ResultSet that contains array data.
    $data = $query->all();

.. _table-find-first:

Primeiro Resultado
========================

O metódo  ``first()`` permite pegar apenas o primeiro resultado da consulta. Caso não seja bem executado
a cláusula ``LIMIT 1`` será aplicada::

    // No controller ou table.
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();
    //Ex: Retorne todos os artigos, mais quero somente o primeiro.

Uma abordagem diferente ``find('first')`` da versão anterior do CakePHP. Você também pode
usar o metódo ``get()`` caso queira carregar uma entidade pelo chave primária.

.. note::

    O metódo ``first()`` retorna ``null`` caso nenhum resultado seja encontrado.

Contando os resultados
==========================

Criando uma consulta você gosta do metódo ``count()`` para retornar a quantidade de resultados encontrado::

    // No controller ou table.
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();
    //Retorne todos os artigos, me mostre quantos são.

Veja :ref:`query-count` para modos de uso diferentes com o metódo ``count()``.

.. _table-find-list:

Encontrando Chaves/Pares de Valores
=======================

Frequentemente precisamos gerar um dados associados em array de nossas aplicações.
Muito usado para criar o elemento ``<select>``. 
O Cake provê um metódo simples e fácil 'lists'::

    // No controller ou table.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Os dados organizados :D
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

Com as opções adicionais as chaves de ``$data`` podem representar uma coluna de sua tabela, 
Por exemplo, use ``'displayField()'`` no objeto tabela na função 'initialize()', isto configura um valor a ser mostrado na chave::


    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

Quando se chama ``list`` você pode configurar quais campos deseja usar para a chave e valor
passando as opções ``keyField`` e ``valueField`` respectivamente::

    // No controller ou table.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // Dados organizados :D
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];
    //slug passa a ser a chave
    // title o valor do option no select

Resultados podem ser agrupados se necessitar. Muito usado quando desejar diferencias Chave/Valores por grupo no elemento ``<optgroup>`` com FormHelper::

    // No controller ou table
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // Dados organizados :D
    $data = [
        1 => [
            'first-post' => 'First post',
            'second-article-i-wrote' => 'Second article I wrote',
        ],
        2 => [
            // More data.
        ]
    ];
    // Temos então os artigos com sua Chave/Valores diferenciados por autores.

Não é complicado, use dados associados e poderá gostar do resultado::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);
    //Retorne uma lista de todos os artigos, o id representará a idenficação do artigo, porém seu valor será o nome do seu Author.
    //Importante, sempre que pesquisar ou informar campos adicionais use o '.' como mostrado em 'valueField'.

Por ultimo, é muito bom quando podemos usar metódos criados em nossas entidades, isto também é possível no metódo 'list'.
. Neste exemplo mostra o uso metódo mutador ``_getFullName()`` criado na entidade Author. ::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => function ($e) {
            return $e->author->get('full_name');
        }
    ]);
    //O valor da chave, representará o nome completo
    //Que usa de uma função para acessar o metódo mutador criado na entidade
    //Onde ao juntar o 1 nome com o 2 formará o nome completo.

Encontrando dados enfileirados
=====================

O metódo ``find('threaded')`` retorna que estarão relacionados por chaves. 
Por padrão o Cake usa o campo chave ``parent_id``. Nesse modelo, é possível
encontrar valores no banco de dados adjacentes. Todas as entidades correspondentes recebem um ``parent_id`` e são alocadas no atributo ``children``::

    // No controller ou table.
    $query = $comments->find('threaded');

    // Expandindo os comentários de outros comentários
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();
    // transformando todos os resultados em array.

    echo count($results[0]->children);
    //Para o primeiro resultado, mostra quantos filhos possue ou registros relacionados e co-relacionados.
    echo $results[0]->children[0]->comment;
    //Mostre o comentário relacionado ao primeiro comentário

Um pouco mal explicado pela equipe do Cake, quando buscamos por dados enfileirados podemos ir bem além, até perceber que pode se encaixar perfeitamente em uma carrinho de shopping com seus itens e quantidades co-relacionados. O ``parentField`` e ``keyField`` chaves que serão usadas para encontrar ocorrências.

Será mais interessante quando aprender sobre árvore de dados ao considerar :doc:`/orm/behaviors/tree` posteriormente.

.. _custom-find-methods:

Personalizando Metódos de Consulta
=====================

Mostramos os exemplos de uso do ``all`` e ``list``.
Ficará interessado em saber as inúmeras possibilidades, e que também recomendamos seriamente, que você as implemente.
Um metódo personalizado de busca pode ser ideal para simplificar processos, consultar dados complexos, otimizar buscas, ou criar uma busca padrão em um metódo simplificado feito por você.
Eles podem ser definidos na criação do objeto tabela e devem obedecer a conveção padrão do Cake. Ao criar um metódo deverá iniciar seu nome com ``find`` e logo após adicionar o nome desejado para sua busca personalizada, exemplo: ``find`` e adicionar ``Users`` = ``findUsers``. É de grande ajuda, por exemplo, quando queremos que em uma busca, nossa consulta sempre tenha a condição de que seus resultados sejam de um determinado usuário, ou que em um carrinho tenha sua própria listra agregada, sem precisar encher o controller de códigos e facilitando muito a manutenção no reuso de código.
Neste exemplo mostramos como encontrarmos um artigo quando este estiver publicado somente.::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    //Lembre se, deverá cria-lo no objeto Artigos
    //Ou melhor /src/Model/Table/ArticlesTable.php

    class ArticlesTable extends Table
    {
    	//Nosso metódo personalizado
        public function findOwnedBy(Query $query, array $options)
        {
            $user = $options['user'];
            return $query->where(['author_id' => $user->id]);
        }

    }

    // No controller ou table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('ownedBy', ['user' => $userEntity]);
    //Retorne todos os artigos, quero que seja de meu usuário, porém somente os já publicados.

O metódo traz muita funcionalidade, em alguns casos precisamos definir uma pilha de lógica, isto será possível usando
o atributo ``$options`` para personalização de consulta com lógica irelevante.
Sem esforço você pode expressar algumas consultas complexas. Assumindo que você 
tem ambas as buscas 'published' e 'recent', poderia fazer assim::

    // No controller ou table.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');
    //Busque todos os artigos, dentre eles encontre os publicados, e retorne somente os recentes.

Nossos exemplos, foram definidos na classe da própria tabela, porém, você pode ver como um behavior o ajudará a automatizar muitos processos e como a reutilização de código é feito no CakePHP
leia mais em :doc:`/orm/behaviors`.

Em uma necessidade de mudar os resultados após uma busca, deve usar
a função :ref:`map-reduce` para isto. Isto substituí o antigo 'afterFind' na versão anterior do Cake. que por sinal trouxe clareza, mais agilidade no processo e menos consumo de memória.

.. _dynamic-finders:

Buscadores dinâmicos
===============

CakePHP's ORM provê uma dinâmica na construção de metódos de busca, onde na chamada do metódo poderá apenas adicionar o nome do campo que desejar buscar. 
Por exemplo, se você quer buscar usuários por seu nome gostará de::

    // No controller
    // Duas chamadas iguais.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // Na tabela
    $users = TableRegistry::get('Users');
    // Duas chamadas também iguais.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

Pode usar também multiplos campos na pesquisa::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);
    //Retorne usuários com Joebob e eles devem estar aprovados ou = 1

Use a condição OR expressa::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');
    //Retorne usuário com nome joebob ou que possua o email joe@example.com

Neste caso, ao usar 'OR' ou 'AND' voce não pode combinar os dois em único metódo. Também não será possível associar dados com o atributo ``contain``, 
pois não é compatível com buscas dinâmicas. Lembra-se dos nossos queridos :ref:`custom-find-methods` eles podem fazer esse trabalho para você com
consultas complexas. Por ultimos combine suas buscas personalizadas com as dinâmicas::

    $query = $users->findTrollsByUsername('bro');
    // Procure pelos trolls, esses trolls devem username = bro

Abaixo um jeito mais organizado::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

Caso tenha objeto Query retornado da busca dinâmica você necessitará de chamar ``first()`` Se quer o primeiro resultado.

.. note::

    Esses metódos de busca podem ser simples, porém eles trazem uma sobrecargar adicional, pelo fato de ser necessário enteder as expressões.


Retornando Dados Associados
==========================

Quando desejar alguns dados associados ou um filtro baseado nesses dados associados, terá dois caminhos para atingir seu objetivo:

- use CakePHP ORM query functions like ``contain()`` and ``matching()``
- use join functions like ``innerJoin()``, ``leftJoin()``, and ``rightJoin()``

Use ``contain()`` quando desejar carregar uma entidade e seus dados associados. 
``contain()`` aplicará uma condição adicional aos dados relacinados, porém você não poderá 
aplicar condições nesses dados baseado nos dados relacionais. Mais detalhes veja ``contain()`` em :ref:`eager-loading-associations`.

``matching()`` se você deseja aplicar condições na sua entidade baseado nos dados relacionais, deve usar isto. 
Por exemplo, você quer carregar todos os artigos que tem uma tag específica neles. Mais detalhes veja ``matching()``, em :ref:`filtering-by-associated-data`.

Caso prefira usar a função join, veja mais informações em :ref:`adding-joins`.
