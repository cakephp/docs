Tutorial - Criando um Blog - Parte 2
####################################

Criando um Article Model
========================

Ao criar um model (modelo) no CakePHP, nós teremos a fundação necessária para
interagirmos com o banco de dados e executar operações posteriormente.

Os arquivos de classes, correspondentes aos models, no CakePHP estão divididos
entre os objetos ``Table`` e ``Entity``. Objetos ``Table`` provêm acesso à
coleção de entities (entidades) armazenada em uma tabela específica e são
alocados em **src/Model/Table**.

O arquivo que criaremos ficará salvo em **src/Model/Table/ArticlesTable.php** e
deve se parecer com isto::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Convenções de nomenclatura são muito importantes no CakePHP. Ao nomear nosso
objeto como ``ArticlesTable``, o CakePHP automaticamente infere que o mesmo
utilize o ``ArticlesController`` e seja atado à tabela ``articles``.

.. note::

    O CakePHP criará automaticamente um objeto model se não puder encontrar um
    arquivo correspondente em **src/Model/Table**. Se você nomear incorretamente
    seu arquivo (i.e. artciclestable.php ou ArticleTable.php), o CakePHP não
    reconhecerá suas definições e usará o model gerado como alternativa.

Para mais informações sobre models, como callbacks e validação, visite o
capítulo :doc:`/orm` do manual.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake console do CakePHP para criar o model
    ``ArticlesTable``::

        bin/cake bake model Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.

Criando o Articles Controller
=============================

A seguir, criaremos um controller (controlador) para nossos articles. O
controller é responsável pela lógica de interação com dados. É o lugar onde você
utilizará as regras contidas nos models e executará tarefas relacionadas aos
articles. Criaremos um arquivo chamado ``ArticlesController.php`` no diretório
**src/Controller**::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }

Agora, vamos adicionar uma action (ação) ao nosso controller. Actions
frequentemente, representam uma função ou interface em uma aplicação.
Por exemplo, quando os usuários requisitarem www.example.com/articles/index
(sendo o mesmo que www.example.com/articles/), eles esperam ver uma lista de
articles::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }

Ao definir a função ``index()`` em nosso ``ArticlesController``, os usuários
podem acessá-la requisitando www.example.com/articles/index. Similarmente, se
definíssemos uma função chamada ``foobar()``, os usuários poderiam acessá-la em
www.example.com/articles/foobar.

.. warning::

    Vocês podem ser tentados a nomear seus controllers e actions de certa forma
    para obter uma certa URL. Resista a essa tentação. Siga as
    :doc:`/intro/conventions` e crie nomes de action legíveis e compreensíveis.
    Você pode mapear URLs para o seu código utilizando
    :doc:`/development/routing`.

A instrução na action usa ``set()`` para passar dados do controller para a view.
A variável é definida como 'articles', sendo igual ao valor retornado do método
``find('all')`` do objeto ``ArticlesTable``.

.. note::

    Se você completou a
    :doc:`primeira parte </tutorials-and-examples/blog/blog>` do tutorial e
    criou a tabela ``articles``, você pode tomar proveito da capacidade de
    geração de código do bake console do CakePHP para criar o controller
    ``ArticlesController``::

        bin/cake bake controller Articles

Para mais informações sobre o bake e suas características sobre geração de
código, visite o capítulo :doc:`/bake/usage` do manual.

Criando as Articles Views
=========================

Agora que nós temos nossos dados fluindo pelo nosso model, e nossa lógica da
aplicação está definida pelo nosso controller, vamos criar uma view
(visualização) para a action index criada acima.

As views do CakePHP são camadas de apresentação que se encaixam nos layouts
da aplicação. Para a maioria das aplicações, elas são uma mescla entre HTML e
PHP, mas também podem ser distribuídas como XML, CSV, ou ainda dados binários.

Um layout é um conjunto de códigos encontrado ao redor das views. Múltiplos
layouts podem ser definidos, e você pode alterar entre eles, mas agora, vamos
usar o default.

Lembra que na última sessão atribuímos a variável 'articles' a view usando o
método ``set()``? Isso levará a coleção de objetos gerada pela query a ser
invocada uma iteração ``foreach``.