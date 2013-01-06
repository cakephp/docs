Scaffolding
###########

O recurso de scaffold de aplicações é uma técnica que permite ao
desenvolvedor definir e criar uma aplicação básica que possa inserir,
selecionar, atualizar e excluir objetos (operações CRUD). Scaffold no
CakePHP também possibilita que os desenvolvedores definam como os
objetos estão relacionados entre si além de como criar e destruir estas
relações.

Tudo o que é necessário para criar um scaffold é um model e seu
controller. Uma vez que você tiver definido a variável $scaffold em seu
controller, já estará preparado e funcionando.

O scaffold do CakePHP é muito legal. Ele permite que você tenha uma
aplicação CRUD com tudo funcionando em coisa de minutos. É tão legal que
você pode querer até usá-lo em aplicações em produção. Então pensamos
que é tudo muito legal, mas por favor tenha em mente que scaffold é...
ahn... apenas scaffold. O uso de scaffold poupa o trabalho da criação da
estrutura real para acelerar o início de um projeto em etapas iniciais.
Scaffold não tem intenção de ser completamente flexível, mas sim um
jeito temporário de fazer as coisas funcionar com brevidade. Se você
você se vir numa situação de querer personalizar sua lógica de suas
view, é hora de deixar de usar o recurso de scaffold e escrever código
de fato. O Bake console do CakePHP, abordado na próxima seção, é um
grande próximo passo: ele gera todo o código que você deve precisar para
produzir o mesmo resultado que teria atualmente com o scaffold.

Scaffold é uma excelente maneira de iniciar do desenvolvimento de partes
prematuras de sua aplicação web. Primeiras versões de esquemas de bases
de dados tendem a sofrer mudanças, o que é algo perfeitamente normal nas
etapas iniciais do projeto da aplicação. Isto tem um lado negativo: um
desenvolvedor web detesta criar formulários que nunca virão a ser
efetivamente usados. Para minimizar o esforço do desenvolvedor, o
recurso de scaffold foi incluído no CakePHP. O scaffold analiza as
tabelas de sua base de dados e cria uma listas padronizadas com botões
de inserção, edição e exclusão, formulários padronizados para edição e
visões padronizadas para visualização de um único registro da base de
dados.

Para adicionar o recurso de scaffold à sua aplicação, no controller,
adicione a variável $scaffold:

::

    <?php

    class CategoriesController extends AppController {
        var $scaffold;
    }

    ?>

Assumindo que você tenha criado um arquivo com a classe mais básica para
o model Category (em /app/models/category.php), as coisas já estarão
prontas. Acesse http://example.com/categories para ver sua nova
aplicação com scaffold.

Criar métodos em controllers que possuam definições de scaffold pode
causar resultados indesejados. Por exemplo, se você criar um método
index() em um controller com scaffold, seu método index será renderizado
no lugar da funcionalidade do scaffold.

O scaffold tem conhecimento sobre as associações de models, então se seu
model Category possuir uma referência a (belongsTo) User, você verá os
IDs dos usuários relacionados na listagem de Category. Se ao invés disso
você preferir ver algo além de um ID (como o primeiro nome do usuário),
você pode definir a variável $displayField no model.

Caso exista a variável $displayField em nossa classe User, nossos
usuários relacionados às categorias serão mostrados pelo primeiro nome
ao invpes de apenas pelo ID no scaffold. Este recurso torna o scaffold
mais legível em muitos casos.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $displayField = 'first_name';
    }

    ?>

Criando uma interface de adminsitrativa simples com scaffolding
===============================================================

Se você tiver habilitado o admin routing em sua app/config/core.php, com
``Configure::write('Routing.admin', 'admin');`` você pode usar
scaffolding para gerar uma interface administrativa.

Uma vez que você tenha ativado o admin routing atribua seu prefixo admin
à variável scaffolding.

::

    var $scaffold = 'admin';

Agora você poderá acessar suas ações admin scaffolded:

::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

Isto é uma forma fácil para criar uma interface de retaguarda simples
rapidamente. Tenha em mente que você não pode ter ambos metodos de
scaffold admin e não-admin ao mesmo tempo. Assim como um scaffolding
normal você pode substituir métodos individuais e substituí-los você
mesmo.

::

    function admin_view($id = null) {
      //custom code here
    }

Uma vez que você tenha substituído uma ação de scaffold você também
precisará criar um arquivo de view para a ação.

Personalizando as Visões em Scaffold
====================================

Se você estiver procurando por algo um pouco diferente em suas visões
geradas por scaffold, você pode criar modelos (templates). Ainda não
recomendados o uso desta técnica para aplicações em produção, mas tal
personalização pode ser útil durante interações de prototipação.

Personalização de views é feita criando-se templates de views

::

    Views de scaffold personalizadas para um controller específico (PostsController, neste caso) devem ser algumas coisas parecidas com isto:

    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp

    Já as views de scaffold personalizadas para todos os controllers devem residir em:

    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

