Árvore
######

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TreeBehavior

É bastante comum querer armazenar dados hierárquicos em uma tabela no banco de dados. Exemplos de tais dados podem ser categorias com subcategorias, dados relacionados a um sistema de menu multinível ou uma representação literal de hierarquia, como departamentos em uma empresa.

Bancos de dados relacionais não são adequados para armazenar e recuperar esses tipos de dados, mas existem algumas técnicas conhecidas que podem torná-los eficazes para trabalhar com informações de vários níveis.

O TreeBehavior ajuda a manter uma estrutura de dados hierárquica no banco de dados, que pode ser consultado sem muita sobrecarga e ajuda a reconstruir os dados da árvore.

Requisitos
==========

Esse behavior requer as seguintes colunas na tabela do seu banco de dados:

- ``parent_id`` (nullable) A coluna que contém o ID da linha pai
- ``lft`` (integer, signed) Usado para manter a estrutura da árvore
- ``rght`` (integer, signed) Usado para manter a estrutura da árvore

Você pode configurar o nome desses campos caso precise personalizá-los. Mais informações sobre o significado dos campos e como elas são usadas podem ser encontradas neste artigo que descreve a `lógica do MPTT <https://www.sitepoint.com/hierarchical-data-database-2/>`_

.. warning::

    O TreeBehavior não suporta chaves primárias compostas.

Início rápido
=============

Você ativa o comportamento da árvore, adicionando-o a tabela que deseja armazenar dados hierárquicos::

    class CategoriesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree');
        }
    }

Uma vez adicionado, você pode deixar o CakePHP construir a estrutura interna se a tabela já estiver pronta::

    // Prior to 3.6 use TableRegistry::get('Articles')
    $categories = TableRegistry::getTableLocator()->get('Categories');
    $categories->recover();

Você pode verificar se funciona, obtendo qualquer linha da tabela e pedindo a contagem de descendentes que ela tem::

    $node = $categories->get(1);
    echo $categories->childCount($node);

Obter uma lista simples dos descendentes de um nó é igualmente fácil::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

Se você precisar informar algumas condições::

    $descendants = $categories
        ->find('children', ['for' => 1])
        ->where(['name LIKE' => '%Foo%']);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

Se você precisar de uma lista encadeada, onde os filhos de cada nó são aninhados em uma hierarquia, você pode utilizar o localizador "threaded"::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} has " . count($child->children) . " direct children";
    }

Percorrer resultados encadeados geralmente requer funções recursivas, mas se você precisa apenas um conjunto de resultados contendo um único campo de cada nível, para que você possa exibir um "select list" em seu formulário HTML, por exemplo, é melhor usar o localizador 'treeList' ::

    $list = $categories->find('treeList');

    // In a CakePHP template file:
    echo $this->Form->control('categories', ['options' => $list]);

    // Or you can output it in plain text, for example in a CLI script
    foreach ($list as $categoryName) {
        echo $categoryName . "\n";
    }

A saída será similar a essa::

    My Categories
    _Fun
    __Sport
    ___Surfing
    ___Skating
    _Trips
    __National
    __International

O localizador ``treeList`` tem várias opções:

* ``keyPath``: Um caminho separado por ponto para buscar o campo a ser usado pela chave do array, ou um closure para retornar a chave da linha fornecida.
* ``valuePath``: Um caminho separado por ponto para buscar o campo a ser usado para o valor do array, ou um closure para retornar o valor da linha fornecida.
* ``spacer``: Uma string a ser usada como prefixo para demonstrar a profundidade na árvore para cada item.

Um exemplo de todas as opções em uso é::

    $query = $categories->find('treeList', [
        'keyPath' => 'url',
        'valuePath' => 'id',
        'spacer' => ' '
    ]);

Uma tarefa muito comum é encontrar o caminho de um determinado nó para a raiz da árvore. Isso é útil, por exemplo, para adicionar a lista de breadcrumbs em uma estrutura de menu::

    $nodeId = 5;
    $crumbs = $categories->find('path', ['for' => $nodeId]);

    foreach ($crumbs as $crumb) {
        echo $crumb->name . ' > ';
    }

Árvores construídas com o TreeBehavior não podem ser ordenadas por nenhuma outra coluna que não seja a coluna `` lft``, isso ocorre porque a representação interna da árvore depende dessa classificação. Felizmente, você pode reordenar os nós dentro do mesmo nível sem ter que mudar de pai::

    $node = $categories->get(5);

    // Move o nó uma posição para cima
    $categories->moveUp($node);

    // Move o nó para o topo da lista dentro do mesmo nível.
    $categories->moveUp($node, true);

    // Move o nó para o fundo.
    $categories->moveDown($node, true);

Configuração
============

Se os nomes padrões utilizados pelo Behavior não correspondem aos nomes utilizados na sua tabela, você pode adicionar apelidos a eles::

    public function initialize(array $config)
    {
        $this->addBehavior('Tree', [
            'parent' => 'ancestor_id', // Use isso em vez de parent_id
            'left' => 'tree_left', // Use isso em vez de lft
            'right' => 'tree_right' // Use isso em vez de rght
        ]);
    }

Nível do nó (Profundidade)
==========================

Conhecer a profundida dos nós da árvore pode ser úti quando você precisa recuperar todos os nós até um certo nível para, por exemplo, gerar menus. Você pode usar a opção ``level`` para especificar o campo que irá guardar o nível de cada nó::

    $this->addBehavior('Tree', [
        'level' => 'level', // O padrão é null, ou seja, não salva o nível
    ]);

Se você não quiser armazenar o nível em cache, você pode usar o método ``TreeBehavior::getLevel()`` para saber o nível do nó.

Escopo e Multi Árvores
======================

Às vezes você precisa guardar mais de uma árvore dentro da mesma tabela, você pode conseguir isso usando a configuração 'scope'. Por exemplo, em uma tabela de localizações, você pode querer criar uma árvore por país::

    class LocationsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree', [
                'scope' => ['country_name' => 'Brazil']
            ]);
        }
    }


No exemplo anterior, todas as operações de árvore terão o escopo apenas para as linhas que tem a coluna ``country_name`` definida como 'Brazil'. Você pode mudar o escopo utilizando a função 'config'::

    $this->behaviors()->Tree->config('scope', ['country_name' => 'France']);

Opcionalmente, você pode ter um controle mais refinado do escopo passando um closure como o escopo::

    $this->behaviors()->Tree->config('scope', function ($query) {
        $country = $this->getConfigureContry(); // uma função inventada
        return $query->where(['country_name' => $country]);
    });

Recuperando com campo de classificação personalizada
====================================================

Por padrão, recover() classifica os itens utilizando a chave primária. Isso funciona muito bem se a chave primária é uma coluna numérica (incremento automático), mas pode levar a resultados estranhos se você use UUIDs.

Se você precisar de classificação personalizada, você pode definir uma cláusula de ordem personalizada na sua configuração::

        $this->addBehavior('Tree', [
            'recoverOrder' => ['country_name' => 'DESC'],
        ]);

Salvando Dados Hierárquicos
===========================

Ao usar o Tree Behavior, você geralmente não precisa se preocupar com a representação interna da estrutura hierárquica. As posições em que os nós são colocados na árvore são deduzidos a partir da coluna 'parent_id' em cada um das suas entidades::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = 5;
    $categoriesTable->save($aCategory);

Fornecer ids para um nó pai não existente ao salvar ou ao tentar criar um loop na árvore (fazendo um nó filho de si mesmo) lançará uma exceção.

Você pode transformar um nó em uma raiz na árvore definindo a coluna 'parent_id' como null::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = null;
    $categoriesTable->save($aCategory);

Os filhos do novo nó raiz serão preservados.

Apagando nós
============

Excluir um nó e toda a sua sub-árvore (qualquer nó filho que esteja em profundidade na árvore) é trivial::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->delete($aCategory);

O TreeBehavior cuidará de todas as operações internas de exclusão para você. Também é possível excluir apenas um nó e reatribuir todos os filhos ao nó pai imediatamente superior na árvore ::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->removeFromTree($aCategory);
    $categoriesTable->delete($aCategory);

Todos os nós filhos serão mantidos e um novo pai será atribuído a eles.

A exclusão de um nó é baseada nos valores lft e rght da entidade. Isto é importante quando estamos fazendo um loop através dos filhos de um nó para exclusões condicionais::

    $descendants = $teams->find('children', ['for' => 1]);

    foreach ($descendants as $descendant) {
        $team = $teams->get($descendant->id);
        if ($team->expired) {
            $teams->delete($team); // a exclusão reordena o lft e o rght no banco de dados
        }
    }

O TreeBehavior reordena os valores lft e rght dos registros na tabela quando um nó foi deletado. Como tal, os valores lft e rght das entidades dentro de `` $ descendants`` (salvo antes da operação de exclusão) será impreciso. Entidades terão que ser carregadas e modificadas em tempo real para evitar inconsistências na tabela.
