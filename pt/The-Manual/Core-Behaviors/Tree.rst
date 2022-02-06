Tree (Árvore)
#############

É comum necessitar exibir dados hierárquiamente de alguma tabela do
banco de dados. Exemplos de tais dados podem ser categorias com
subcategorias, com diversos níveis, dados relativos a um sistema de menu
com multiníveis ou assim como uma representação de hirearquia, como é
utilizado para armazenar os objetos do ACL.

Para pequenas árvores de dados, ou quando os dados possuem apenas alguns
níveis, é simples adicionar campos como parent\_id, e utilizar esse
campo para determinar o parente do dados, assim conseguindo exibir em
uma estrutura hierárquica. Bundled com o cake no entanto, provem um
poderoso behavior que permite usar os benefícios do `MPTT
logic <https://dev.mysql.com/tech-resources/articles/hierarchical-data.html>`_,
sem se preocupar com com nada de técnica, ao menos que você quiser ;)

Requisitos
==========

Para usar o Tree behaviour, sua tabela da base de dados precisa dos três
campos que estão listados a seguir (todos são inteiros):

-  pai - nome do campo padrão é parent\_id, usado para armazenar o id do
   objeto pai
-  esquerda - nome do campo padrão é lft, usado para armazenar o valor
   da esquerda da atual linha.
-  direita - nome do campo padrão é rght, usado para armazenar o valor
   da direita da atual linha.

Se você está acostumado com a lógica MPTT, irá se perguntar o porquê de
haver um campo pai - simplesmente porque é mais fácil fazer determinadas
tarefas se existir um link para o pai armazenado na base de dados -
como, por exemplo, quais filhos estão ligados diretamente a um item pai.

Uso Básico
==========

O behavior tree tem bastante funcionalidade dentro dele, porém vamos
começar com um simples exemplo - criamos a tabela no banco de dados e
vamos por alguns dados:

::

    CREATE TABLE categorias (
        id INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        parent_id INTEGER(10) DEFAULT NULL,
        lft INTEGER(10) DEFAULT NULL,
        rght INTEGER(10) DEFAULT NULL,
        nome VARCHAR(255) DEFAULT '',
        PRIMARY KEY  (id)
    );

    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(1, 'Minhas categorias', NULL, 1, 30);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(2, 'Divertidos', 1, 2, 15);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(3, 'Esportes', 2, 3, 8);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(4, 'Surf', 3, 4, 5);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(5, 'Padel', 3, 6, 7);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(6, 'Amigos', 2, 9, 14);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(7, 'Thiago', 6, 10, 11);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(8, 'Geraldo', 6, 12, 13);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(9, 'Trabalho', 1, 16, 29);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(10, 'Relatórios', 9, 17, 22);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(11, 'Anuais', 10, 18, 19);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(12, 'Status', 10, 20, 21);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(13, 'Viagens', 9, 23, 28);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(14, 'Nacionais', 13, 24, 25);
    INSERT INTO `categorias` (`id`, `nome`, `parent_id`, `lft`, `rght`) VALUES(15, 'Internacionais', 13, 26, 27);

Com o intuito de verificar se tudo está correto, nós podemos criar um
método de teste e mostrar os conteúdos da nossa árvore de categoria para
ver o que aparece. Com um simples controller:

::

    <?php
    class CategoriasController extends AppController {

            var $name = 'categorias';
            
            function index() {
                    $this->data = $this->Categoria->generatetreelist(null, null, null, '&nbsp;&nbsp;&nbsp;');
                    debug ($this->data); die;       
            }
    }
    ?>

an an even simpler model definition:

::

    <?php
    // app/models/categoria.php
    class Categoria extends AppModel {
        var $name = 'Categoria';
        var $actsAs = array('Tree');
    }
    ?>

Nós podemos verificar que a nossa árvore de categoria mostra, acessando
/categorias Você ira ver algo do tipo:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

Adicionar dados
---------------

Na sessão anterior, nos usamos uma data existente e verificamos como
ficou a hirearquia usando o méotodo ``generatetreelist``. No entando,
geralmente é necessário você adicionar os dados da mesma maneira que
qualquer outro modelo. Por exemplo:

::

    // pseudo controller code
    $data['Categoria']['parent_id'] =  3;
    $data['Categoria']['name'] =  'Skating';
    $this->Categoria->save($data);

Quando usamos o tree behavior isto não é necessário fazer nada a mais,
apenas setar o parent\_id e o tree behavior vai cudar do resto. Se você
não setar o parent\_id, o tree behavior vai adicionar na árvore uma nova
entrada no nível do topo:

::

    // pseudo controller code
    $data = array();
    $data['Category']['name'] =  'Other People\'s Categories';
    $this->Category->save($data);

Rodando os dois códigos acima, você ira receber os seguintes resultados:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel
         -  Skating **New**

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Relátorios

         -  Anual
         -  Status

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Nova Categoria **New**

Modificando dados
-----------------

Modificar dados é tão transparente quanto adicionar novos dados. Se você
modificar alguma coisa, mas não quiser alterar o campo parent\_id - a
estrutura dos dados vai permanecer inalterada. Por exemplo:

::

    // pseudo código de controller
    $this->Category->id = 5; // id de Extreme knitting
    $this->Category->save(array('name' =>'Extreme fishing'));

O código acima não afeta o campo parent\_id - mesmo que o o parent\_id
seja incluído nos dados passados para o método save se o valor não
mudar, a estrutura dos dados também não mudará. Portanto a árvore de
dados deve esta assim:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme fishing **Atualizado**
         -  Skating

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Reports

         -  Annual
         -  Status

      -  Trips

         -  National
         -  International

-  Other People's Categories

Mover dados na árvore também é uma tarefa simples. Vamos dizer que
Extreme fishing não pertence mais a Sport, mas ao invés, deve ser
alocada dentro de Other People's Categories. Com o seguinte código:

::

    // pseudo código de controller
    $this->Category->id = 5; // id de Extreme fishing
    $newParentId = $this->Category->field('id', array('name' => 'Other People\'s Categories'));
    $this->Category->save(array('parent_id' => $newParentId)); 

Como o esperado a estrutura foi modificada para:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Skating

      -  Friends

         -  Gerald
         -  Gwendolyn

   -  Work

      -  Reports

         -  Annual
         -  Status

      -  Trips

         -  National
         -  International

-  Other People's Categories

   -  Extreme fishing **Movida**

Deletando dados
---------------

O tree behaviour provem maneiras de deletar dados. Para começar podemos
fazer um simples exemplo para testar; vamos dizer que a categoria
"relatórios", não é tão usada. Para remover isso *e todas os filhos que
este tem* apenas chame o delete igual usamos para qualquer modelo. Para
exemplificar segue o código:

::

    // pseudo controller code
    $this->Categoria->id = 10;
    $this->Categoria->delete();

A árvore de categoria deve ficar como em baixo:

-  Minhas Categorias

   -  Divertidos

      -  Esportes

         -  Surf
         -  Padel
         -  Skating

      -  Amigos

         -  Thiago
         -  Geraldo

   -  Trabalho

      -  Viagens

         -  Nacionais
         -  Internacionais

-  Nova Categoria

Requisitando e usando seus dados
--------------------------------

Usar e manipular dados hierárquicos pode ser um negócio de artimanhas.
Em adição aos métodos core find, com o tree behavior existe um pouco
mais de permutações orientadas a árvore a sua disposição.

A maioria dos métodos do tree behavior retornam e dependem dos dados
armazenados no campo ``lft``. Se você chamar o método ``find()`` e não
ordenar pelo campo ``lft``, ou chamar um método do tree behavior e
especificar um sort order, você poderá receber resultados indesejados.

Filhos
~~~~~~

o Método ``children`` usa o valor da chave primária(id) de uma tupla e
retorna seus filhos, na ordem que eles aparecem na árvore por padrão. O
segundo parametro, que é opicional define se deve ou não ser retornados
somente filhos diretos. Usando os dados de exemplo da sessão anterior:

::

    $allChildren = $this->Category->children(1); // um array plano com 11 itens
    // -- ou --
    $this->Category->id = 1;
    $allChildren = $this->Category->children(); // um array plano com 11 itens

    // Somente retorna filhos diretos
    $directChildren = $this->Category->children(1, true); // um array plano com 2 itens

Se você quiser um array recursivo use ``find('threaded')``

Contando filhos
~~~~~~~~~~~~~~~

Tal como acontece com o método ``children``, ``childCount`` assume o
valor de chave primária (o id) de uma linha e retorna quantos filhos ele
tem. O segundo parâmetro opcional define ou não se os filhos direto
serão contados. Usando os dados de exemplo da seção anterior:

::

    $totalChildren = $this->Category->childCount(1); // resultara 11
    // -- ou --
    $this->Category->id = 1;
    $directChildren = $this->Category->childCount(); // resultara 11

    // Só conta os descendentes diretos desta categoria
    $numChildren = $this->Category->childCount(1, true); // resultara 2

generatetreelist
~~~~~~~~~~~~~~~~

``generatetreelist ($conditions=null, $keyPath=null, $valuePath=null, $spacer= '_', $recursive=null)``

This method will return data similar to find('list'), with an indented
prefix to show the structure of your data. Below is an example of what
you can expect this method to return see the api for the other find-like
parameters.

::

    array(
        [1] =>  "My Categories",
        [2] =>  "_Fun",
        [3] =>  "__Sport",
        [4] =>  "___Surfing",
        [16] => "___Skating",
        [6] =>  "__Friends",
        [7] =>  "___Gerald",
        [8] =>  "___Gwendolyn",
        [9] =>  "_Work",
        [13] => "__Trips",
        [14] => "___National",
        [15] => "___International",
        [17] => "Other People's Categories",
        [5] =>  "_Extreme fishing"
    )

getparentnode
~~~~~~~~~~~~~

This convenience function will, as the name suggests, return the parent
node for any node, or *false* if the node has no parent (its the root
node). For example:

::

    $parent = $this->Category->getparentnode(2); //<- id for fun
    // $parent contains All categories

getpath
~~~~~~~

The 'path' when refering to hierachial data is how you get from where
you are to the top. So for example the path from the category
"International" is:

-  My Categories

   -  ...
   -  Work

      -  Trips

         -  ...
         -  International

Using the id of "International" getpath will return each of the parents
in turn (starting from the top).

::

    $parents = $this->Category->getpath(15);

::

    // contents of $parents
    array(
        [0] =>  array('Category' => array('id' => 1, 'name' => 'My Categories', ..)),
        [1] =>  array('Category' => array('id' => 9, 'name' => 'Work', ..)),
        [2] =>  array('Category' => array('id' => 13, 'name' => 'Trips', ..)),
        [3] =>  array('Category' => array('id' => 15, 'name' => 'International', ..)),
    )

Utilização Avançada
===================

O comportamento da árvore não é só trabalho no fundo, há uma série de
métodos específicos definidos no comportamento para satisfazer todas as
suas necessidades de dados hierárquicos, bem como quaisquer problemas
inesperados que possam surgir no processo.

moveDown
--------

Utilizado para mover um único nó para baixo da árvore. Você precisará
fornecer a identificação do elemento a ser movido e um número positivo
de quantas posições o nó deve ser movido para baixo. Todos nós filho
para o nó especificado também será movido.

Aqui está um exemplo de uma ação do controlador (em um controlador
chamado Categorias) que move um nó especificado pela árvore:

::

    function movedown($name = null, $delta = null) {
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('Não existe uma categoria chamada ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveDown($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Por favor, forneça o número de posições do campo para ser  movido para baixo.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        }

Por exemplo, se você deseja mover a categoria "Sport" uma posição
abaixo, você terá que pedir: /categories/movedown/Sport/1.

moveUp
------

Utilizado para mover um único nó na árvore. Você precisará fornecer a
identificação do elemento a ser movido e um número positivo de quantas
posições o nó deve ser movida para cima. Todos nós filho também serão
movidos.

Aqui está um exemplo de uma ação do controlador (em um controlador
chamado Categorias) que move um nó na árvore:

::

    function moveup($name = null, $delta = null){
            $cat = $this->Category->findByName($name);
            if (empty($cat)) {
                $this->Session->setFlash('Não existe uma categoria chamada ' . $name);
                $this->redirect(array('action' => 'index'), null, true);
            }
            
            $this->Category->id = $cat['Category']['id'];
            
            if ($delta > 0) {  
                $this->Category->moveup($this->Category->id, abs($delta));
            } else {
                $this->Session->setFlash('Por favor, forneça um número de posições que a  categoria deve ser deslocado para cima.'); 
            }
        
            $this->redirect(array('action' => 'index'), null, true);
        
        }

Por exemplo, se você gostaria de mover a categoria "Gwendolyn" até uma
posição que você gostaria de pedir /categories/moveup/Gwendolyn/1.
Agora, a ordem de Amigos sera Gwendolyn, Gerald.

removeFromTree
--------------

::

    removeFromTree($id=null, $delete=false)

Use este método se quiser apagar ou mover um nó, mas manter a sua
sub-árvore, que será reparentado um nível superior. Ele oferece mais
controle do que ```delete()`` </pt/view/690/delete>`_, que para um
modelo com o comportamento árvore irá remover o nó especificado e todos
os seus filhos.

Tendo a seguinte árvore como ponto de partida:

-  My Categories

   -  Fun

      -  Sport

         -  Surfing
         -  Extreme knitting
         -  Skating

Executando o código a seguir com o id 'Sport'

::

    $this->Node->removeFromTree($id); 

O nó do Sport irá tornar-se um nó de nível superior:

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

-  Sport **Movido**

Isso demonstra o comportamento padrão do ``removeFromTree`` de mover o
nó para não ter nenhum pai, e reparentear todos os filhos.

Se, contudo, o seguinte trecho de código foi utilizado com o id 'Sport'

::

    $this->Node->removeFromTree($id,true); 

A árvore se tornaria

-  My Categories

   -  Fun

      -  Surfing
      -  Extreme knitting
      -  Skating

Isso demonstra o uso alternativo para ``removeFromTree``, os filhos
foram reparentados e 'Sport' foi excluido.

reorder
-------

This method can be used to sort hierarchical data.

Integridade de dados
====================

Devido à natureza complexa da auto-estruturas de dados referenciais,
como árvores e listas ligadas, podem, ocasionalmente, tornar-se quebrado
por uma chamada descuidada. Coragem, nem tudo está perdido! O
comportamento de cada árvore contém vários recursos não documentados
anteriormente projetado para se recuperar de tais situações.

Estas funções que você pode economizar um bom tempo são:

recover(&$model, $mode = 'parent', $missingParentAction = null)

O parâmetro mode é usado para especificar a fonte de informação que é
válido / correto. A fonte de dados oposto será preenchida com base em
que fonte de informação. Por exemplo, se os campos MPTT são corruptos ou
vazio, com o $mode 'parent' os valores do campo parent\_id será usado
para preencher os campos esquerdo e direito. O parâmetro
missingParentAction só se aplica ao "parent" de modo que determina o que
fazer se o campo pai contém um id que não está presente.

reorder(&$model, $options = array())

Reordena os nós (e nós filhos) da árvore de acordo com o campo e direção
especificada nos parâmetros. Este método não altera o pai de qualquer
nó.

O array de opções contém os valores 'id' => null, 'field' =>
$model->displayField, 'order' => 'ASC', e 'verify' => true, por padrão.

verify(&$model)

Retorna true se a árvore é válida caso contrário um array de (type,
incorrect left/right index, message).
