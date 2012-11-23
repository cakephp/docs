Scaffolding (arcabouços)
########################

O recurso de `scaffold` de aplicações é uma técnica que permite ao desenvolvedor
definir e criar uma aplicação básica que possa inserir, selecionar, atualizar e
excluir objetos. `scaffold` no CakePHP também possibilita que os desenvolvedores
definam como os objetos estão relacionados entre si além de como criar e
destruir estas relações.

Tudo o que é necessário para criar um `scaffold` é um model e seu controller
correspondente.
Uma vez que você tiver definido o atributo ``$scaffold`` em seu controller,
este estará pronto para funcionar. O `scaffold` do CakePHP é muito legal. Ele
permite que você tenha uma aplicação CRUD com tudo funcionando em minutos. É tão
legal que você pode querer até usá-lo em produção. Podemos até
achar isto legal também, mas por favor tenha em mente que `scaffold` é... ahn...
apenas um arcabouço. O uso de `scaffold` poupa o trabalho da criação da estrutura
real para acelerar o início de um projeto em etapas iniciais. `Scaffold` não tem
intenção de ser completamente flexível, mas sim um jeito temporário de fazer as
coisas funcionarem com brevidade. Se você se vir numa situação de querer
personalizar a lógica e suas views, é hora de deixar de usar o recurso de
`scaffold` e escrever o código de fato. A ferramenta de linha de comando Bake do
CakePHP, abordado na próxima seção é um grande passo à frente: Ele gera todo o
código que você deve precisar para produzir o mesmo resultado que teria
atualmente com o scaffold.

`Scaffold` é uma excelente maneira de iniciar o desenvolvimento de partes
prematuras da sua aplicação web. Primeiras versões de esquemas de bases de dados
tendem a sofrer mudanças, o que é algo perfeitamente normal nas etapas iniciais
do projeto da aplicação. Isto tem um lado negativo: Um desenvolvedor web detesta
criar formulários que nunca virão a ser efetivamente usados. Para minimizar o
esforço do desenvolvedor, o recurso de `scaffold` foi incluído no CakePHP. O
`scaffold` analisa as tabelas de sua base de dados e cria uma listagem padronizada
com botões de inserção, edição e exclusão, formulários padronizados para edição
e views padronizadas para visualização de um único registro da base de dados.

Para adicionar o recurso de `scaffold` à sua aplicação, no controller, adicione
o atributo ``$scaffold``::

    
    class CategoriesController extends AppController {
        public $scaffold;
    }

Assumindo que você tenha criado um arquivo com a classe model mais básica para o
``Category`` (em ``/app/Model/Category.php``), as coisas já estarão prontas.
Acesse http://example.com/categories para ver sua nova aplicação com scaffold.

.. note::

    Criar métodos em controllers que possuam definições de `scaffold` pode causar
    resultados indesejados. Por exemplo, se você criar um método ``index()`` em
    um controller com scaffold, seu método index será renderizado no lugar da
    funcionalidade do scaffold.

O `scaffold` tem conhecimento sobre as associações de models, então se seu model
``Category`` possuir uma referência a (`belongsTo`) ``User``, você verá os IDs
dos usuários relacionados na listagem de ``Category``. Enquanto o `scaffold`
"sabe" como tratar os relacionamentos entre models, você não verá nenhum
registro relacionado nas views do `scaffold` até que você tenha adicionado
manualmente as relações entre os models. Por exemplo, se ``Group`` `hasMany`
(possui muitos) ``User`` e ``User`` `belongsTo` (pertence à) ``Group``, você
precisa adicionar manualmente o código necessário a seguir nos seus models
``User`` e ``Group``. Antes de você adicionar o código a seguir, a view mostrará
uma tag select vazia para ``Group`` no formulário de adição do model ``User``.
Após você adicionar o código, a view irá mostrar uma tag select populada com os
IDs ou nomes vindos da tabela groups no formulário de adição de ``User``.

::

    // Em Group.php
    public $hasMany = 'User';
    
    // Em User.php
    public $belongsTo = 'Group';

Se você preferir ver algo além do ID (como o primeiro nome dos usuários), você
pode alterar o valor do atributo ``$displayField`` no model. Vamos ver o
``$displayField`` na nossa classe ``User`` de forma que os usuários relacionados
com categorias sejam mostrados pelo primeiro nome ao invés de apenas o ID.
Em muitos casos, este recurso torna o `scaffold` mais legível.

::


    class User extends AppModel {
        public $name = 'User';
        public $displayField = 'first_name';
    }


Criando uma interface administrativa simples com scaffolding
============================================================

Se você tiver habilitado as rotas de `admin` em seu arquivo de configuração
``app/Config/core.php`` com a alteração a seguir
``Configure::write('Routing.prefixes', array('admin'));``, você
poderá usar o `scaffold` para gerar interfaces administrativas.

Uma vez que você tenha ativado a rota de `admin` atribua seu prefixo `admin` à
variável scaffolding::

    public $scaffold = 'admin';

Agora você poderá acessar o arcabouço de suas ações administrativas::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

Esta é uma forma fácil de criar uma interface de administração simples
rapidamente. Tenha em mente que você não pode ter ambos os métodos de scaffold,
um para admin e outro para não-admin ao mesmo tempo. Assim como em um `scaffold` 
normal você pode sobrescrever um método individual com seu próprio código::
    
    function admin_view($id = null) {
      // código customizado aqui
    }

Uma vez que você tenha substituído uma ação de `scaffold` você também precisará
criar um arquivo de view para a ação.

Customizando as Views de Scaffold
=================================

Se você quiser uma view de `scaffold` um pouco diferente, você
pode criar templates. Continuamos a não recomendar o uso desta técnica para
aplicações em produção, mas tal customização pode ser útil durante o período de
prototipação.

A customização é feita criando templates de view::

Views de `scaffold` customizadas para um controller específico (PostsController
neste example) devem ser colocadas no diretório das views desta maneira::

    /app/View/Posts/scaffold.index.ctp
    /app/View/Posts/scaffold.show.ctp
    /app/View/Posts/scaffold.edit.ctp
    /app/View/Posts/scaffold.new.ctp


Views de `scaffold` customizadas para todos os controllers devem ser criadas
desta maneira::

    /app/View/Scaffolds/index.ctp
    /app/View/Scaffolds/form.ctp
    /app/View/Scaffolds/view.ctp
