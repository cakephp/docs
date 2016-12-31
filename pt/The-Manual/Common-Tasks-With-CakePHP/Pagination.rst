Paginação
#########

Uma das principais dificuldades de criar aplicações Web flexíveis e
amigáveis é a de criar uma interface de usuário intuitiva. Muitas
aplicações tendem a crescer rapidamente em tamanho e complexidade e
tanto designers como programadores acabam tendo que lidar com o problema
de mostrar centenas ou milhares de registros. Refatoração leva tempo e o
desempenho e a satisfação do usuário podem ser afetados.

Mostrar um número razoável de registros por página tem sido uma parte
crítica das aplicações e geralmente causam muitas dores de cabeça para
os desenvolvedores. CakePHP facilita o trabalho do desenvolvedor
provendo uma forma rápida e fácil para paginar os dados.

O PaginatorHelper oferece uma ótima solução porque é muito fácil de
usar. Além da paginação ele também traz consigo algumas funcionalidades
de ordenação. Por último, mas não menos importante, ordenação e
paginação Ajax também são suportadas.

Configuração no Controller
==========================

No controller, começamos definindo os padrões de paginação na variável
*$paginate* do controller. É importante notar aqui que a entrada "order"
deve estar presente na estrutura dada do array.

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

Você também pode incluir outras opções do find(), como, p.ex., *fields*:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'fields' => array('Post.id', 'Post.created'),
            'limit' => 25,        
            'order' => array(
                'Post.title' => 'asc'
            )
        );
    }

Outras chaves que podem ser incluídas no array *$paginate* são
semelhantes aos parâmetros do método *Model->find('all')*, quais sejam:
*conditions*, *fields*, *order*, *limit*, *page*, *contain*, e
*recursive*. De fato, você pode definir mais do que um conjunto de
padrões de paginação no controller, você apenas denomina as peças do
array depois do model que você deseja configurar:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'Recipe' => array (...),
            'Author' => array (...)
        );
    }

Exemplo de sintaxe usando o ContainableBehavior:

::

    class RecipesController extends AppController {

        var $paginate = array(
            'limit' => 25,
            'contain' => array('Article')
        );
    }

Uma vez a variável *$paginate* tenha sido definida, podemos chamar o
método *paginate()* nas actions do controller. Este método retorna
resultados de um *find()* paginados a partir do model e obtém
estatísticas adicionais de paginação que são passadas para a View por
debaixo dos panos. Este método também adiciona o PaginatorHelper à lista
de helpers em seu controller, se ainda não tiver sido adicionado.

::

    function list_recipes() {
        // semelhante a find('all'), mas com resultados paginados
        $data = $this->paginate('Recipe');
        $this->set('data', $data);
    }

Você pode filtrar os registros passando condições como segundo parâmetro
para o método ``paginate()``.

::

    $data = $this->paginate('Recipe', array('Recipe.title LIKE' => 'a%'));

Ou você também pode definir a chave *conditions* no array ``$paginate``.

Paginação nas Views
===================

Fica a seu critério decidir como exibir os registros para o usuário, mas
na maioria das vezes isso normalmente é feito com tabelas HTML. Os
exemplos abaixo assumem um layout tabular, mas o PaginatorHelper
disponível nas views não se restringe em absoluto a nenhum formato de
exibição.

Veja os detalhes sobre o
`PaginatorHelper <https://api.cakephp.org/class/paginator-helper>`_ na
API.

Como mencionado, o PaginatorHelper também fornece recursos de ordenação
que podem ser facilmente integrados às colunas de suas tabelas de dados:

::

    // app/views/recipes/list_recipes.ctp
    <table>
        <tr> 
            <th><?php echo $paginator->sort('ID', 'id'); ?></th> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['id']; ?> </td> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

Os links exibidos a partir do método sort() do PaginatorHelper permite
que os usuários cliquem nos cabeçalhos da tabela para trocar a ordenação
de dados para o campo dado.

Também é possível ordenar uma coluna baseada em associações:

::

    <table>
        <tr> 
            <th><?php echo $paginator->sort('Title', 'title'); ?></th> 
            <th><?php echo $paginator->sort('Author', 'Author.name'); ?></th> 
        </tr> 
           <?php foreach($data as $recipe): ?> 
        <tr> 
            <td><?php echo $recipe['Recipe']['title']; ?> </td> 
            <td><?php echo $recipe['Author']['name']; ?> </td> 
        </tr> 
        <?php endforeach; ?> 
    </table> 

O ingrediente final para a exibição da paginação nas views é a adição do
navegador de páginas, também disponível no PaginationHelper.

::

    <!-- Mostra os números das páginas -->
    <?php echo $paginator->numbers(); ?>
    <!-- Mostra os links próximo e anterior -->
    <?php
        echo $paginator->prev('« Anterior ', null, null, array('class' => 'disabled'));
        echo $paginator->next(' Próximo »', null, null, array('class' => 'disabled'));
    ?> 
    <!-- exibe X de Y, sendo X a página atual e Y o total de páginas -->
    <?php echo $paginator->counter(); ?>

Os dizeres exibidos pelo método counter() também podem ser
personalizados com o uso de marcadores especiais:

::

    <?php
    echo $paginator->counter(array(
        'format' => 'Página %page% de %pages%, exibindo %current% registros de um total de %count%, exibindo do registro %start% até o %end%'
    )); 
    ?>

Para passar todos os argumentos URL para funções do paginador, adicione
o seguinte à sua view:

::

        $paginator->options(array('url' => $this->passedArgs));

Elementos de rota que não forem argumentos parametrizados (named
arguments) devem ser mesclados manualmente com ``$this->passedArgs``:

::

    // para urls como http://www.example.com/en/controller/action
    // que são roteadas como Router::connect('/:lang/:controller/:action/*', array(),array('lang'=>'ta|en'));
    $paginator->options(array('url'=>array_merge(array('lang'=>$lang),$this->passedArgs)));

Ou você pode especificar quais parâmetros serão passados manualmente:

::

        $paginator->options(array('url' =>  array("0", "1")));

AJAX Pagination
===============

É muito simples incorporar funcionalidades Ajax na paginação. O único
código extra requerido é a inclusão da biblioteca Javascript Prototype,
e a especificação de uma DIV para ser atualizada com o conteúdo de
paginação (ao invés de reler a página). Pode-se também definir o
parâmetro indicator contendo o id de uma DIV que será mostrada quando o
conteúdo da paginação estiver sendo lido e ocultado ao término de sua
leitura.

Não se esqueça de adicionar o componente RequestHandler para detectar as
chamadas Ajax em seu controller.

::

    var $components = array('RequestHandler'); 

Configuring the PaginatorHelper to use a custom helper
------------------------------------------------------

By default in 1.3 the ``PaginatorHelper`` uses JsHelper to do ajax
features. However, if you don't want that and want to use the
``AjaxHelper`` or a custom helper for ajax links, you can do so by
changing the ``$helpers`` array in your controller. After running
``paginate()`` do the following.

::

    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'Ajax');

Will change the ``PaginatorHelper`` to use the ``AjaxHelper`` for ajax
operations. You could also set the 'ajax' key to be any helper, as long
as that class implements a ``link()`` method that behaves like
``HtmlHelper::link()``

Paginação com Consultas Personalizadas
======================================

FIXME: Por favor, incluir um exemplo que demonstre a necessidade de se
personalizar as consultas de paginação.

Se você precisar criar consultas personalizadas para gerar os dados que
quer paginar, você pode sobrescrever os métodos ``paginate()`` e
``paginateCount()`` do model, usados pela lógica de paginação do
controller.

Antes de prosseguir, verifique se você realmente não consegue fazer o
que você deseja com os métodos padrão do core model.

O método ``paginate()`` utiliza os mesmos parâmetros que o
``Model::find()``. Para usar sua própria versão/sua própria lógica,
sobrescreva este método no model a partir do qual você quer obter os
dados.

::

    /**
     * Método paginate sobrescrito - agrupa pelos campos "week", "away_team_id" e "home_team_id"
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

Você também precisa sobrescrever o método ``paginateCount()``, que é um
método que utiliza os mesmos argumentos que o ``Model::find('count')``.
O exemplo abaixo utiliza alguns recursos específicos para banco
Postgres, então atente para fazer ajustes para o banco de dados que você
estiver utilizando.

::

    /**
     * Método paginateCount sobrescrito.
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

O leitor mais atento vai perceber que o método paginate que definimos
não era realmente necessário - tudo que você precisaria fazer seria
adicionar a palavra-chave na variável de classe ``$paginate`` do
controller.

::

    /**
    * Inclui a cláusula GROUP BY.
    */
    var $paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );
    /**
    * Ou, fazendo "on-the-fly" dentro da própria action.
    */
    function index() {
        $this->paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );

No entanto, ainda seria necessário sobrescrever o método
``paginateCount()`` para obter um valor correto.
