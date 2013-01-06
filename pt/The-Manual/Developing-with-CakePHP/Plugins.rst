Plugins
#######

O CakePHP permite que você defina uma combinação de controllers, models
e views e os distribua como um plugin empacotado de aplicação que os
outros poderão usar em suas aplicações CakePHP. Você tem um módulo de
gerência de usuários legal, ou um blog simples, ou quem sabe um módulo
de webservices em uma de suas aplicações? Empacote-o como um plugin do
CakePHP para poder incorporá-lo em outras aplicações.

A principal fronteira entre um plugin e a aplicação na qual está
instalado é a configuração da aplicação (conexão da base de dados,
etc.). Por outro lado, ele funciona dentro de seu próprio espaço, se
comportando como se fosse a própria aplicação.

Criando um Plugin
=================

Como um exemplo funcional, vamos criar um novo plugin que peça uma pizza
para você. Para começar, vamos ter de colocar os arquivos de nosso
plugin dentro da pasta /app/plugins. O nome da subpasta em que os
arquivos do plugin ficarão é importante e será usado em diversos locais,
então escolha-o sabiamente. Para este plugin, vamos usar o nome
'**pizza**\ '. Aqui está como a configuração de nosso plugin deve se
parecer:

::

    /app
         /plugins
             /pizza
                 /controllers                <- os controllers do plugin vão aqui
                 /models                     <- os models do plugin vão aqui
                 /views                      <- as views do plugin views vão aqui
                 /pizza_app_controller.php   <- o AppController do plugin
                 /pizza_app_model.php        <- o AppModel do plugin

Se você quiser ser capaz de acessar seu plugin a partir de uma dada URL,
torna-se obrigatório definir um AppController e um AppModel para o seu
plugin. Estas duas classes especiais são nomeadas depois do plugin e
estendem os respectivos AppController e AppModel da aplicação. Não há
nenhuma novidade nos seus conteúdos, que para nosso plugin de pizza de
exemplo, devem ser algos parecidos com:

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

Se você se esquecer de definir estas classes especiais, o CakePHP irá
dar um alerta sobre erros de "Missing Controller" enquanto você não os
criar.

Controllers de Plugin
=====================

Os controllers de nosso plugin pizza serão armazenados em
/app/plugins/pizza/controllers/. Como o propósito principal aqui é o
pedido de pizzas, vamos precisar de um OrdersController para este
plugin.

Ainda que não seja obrigatório, é recomendado que você dê nomes
relativamente únicos para os controllers de seu plugin para evitar
conflitos de namespaces com as aplicações residentes. Não é difícil de
imaginar que a aplicação-pai possa ter um UsersController,
OrdersController ou ProductsController; então você pode querer ser
criativo com os nomes de controllers ou prefixar o nome do plugin ao
nome da classe (PizzaOrdersController, neste caso).

Então, colocamos nosso PizzaOrdersController na pasta
/app/plugins/pizza/controllers com um conteúdo semelhante a:

::

    // /app/plugins/pizza/controllers/pizza_orders_controller.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }

Este controller estende o AppController do plugin (chamado de
PizzaAppController) ao invés do AppController da aplicação.

Perceba também como o nome do model é prefixado com o nome do plugin.
Essa linha de código é adicionada apenas para deixar as coisas mais
claras, mas não é necessária neste exemplo.

Se você quiser visualizar o que estamos fazendo, acesse
/pizza/pizza\_orders. Se tudo estiver certo, neste ponto você deve
receber uma mensagem de erro sobre “Missing Model”, uma vez que nosso
model PizzaOrder ainda não está definido.

Models de Plugin
================

Os models para o plugin são armazenados em /app/plugins/pizza/models.
Nós já definimos um PizzaOrdersController para este plugin, então vamos
criar um model para esse controller, chamado PizzaOrder. PizzaOrder é
compatível com nosso esquema de nomeamento definido anteriormente de
prefixar todas as classes de nosso plugin com Pizza.

::

    // /app/plugins/pizza/models/pizza_order.php:
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>

Visitando /pizza/pizzaOrders agora (dando que vocêm tem uma tabela em
seu bando de dados chamada 'pizza\_orders') deve aparecer um erro
"Missing View". Vamos criá-la a seguir.

Se você precisa referenciar um model dentro dentro de seu plugin, você
precisa incluir o nome do plugin com o nome do model, separado com um
ponto.

Por exemplo:

::

    // /app/plugins/pizza/models/pizza_order.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>

Se você preferir que as chaves do array para a associação não tenham o
prefixo do plugin nelas, use a sintaxe alternativa:

::

    // /app/plugins/pizza/models/pizza_order.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array(
                    'PizzaOrder' => array(
                            'className' => 'Pizza.PizzaOrder'
                    )
            );
    }
    ?>

Views de Plugin
===============

Views se comportam exatamente como elas fazem em aplicações normais.
Apenas as coloque na pasta certa dentro da pasta
/app/plugins/[plugin]/views/. Para seu plugin de pedidos de pizza,
precisamos de uma view para nossa ação PizzaOrdersController::index(),
então vamos incluí-la bem como:

::

    // /app/plugins/pizza/views/pizza_orders/index.ctp:
    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

Components, Helpers e Behaviors
===============================

Um plugin pode ter Components, Helpers e Behaviors como uma aplicação
CakePHP regular. Você pode até criar plugins que consitem apenas de
Components, Helpers ou Behaviors e pode ser um ótimo modo de construir
componentes reutilizáveis que podem facilmente ser colocados dentro de
um projeto.

Contruir estes componentes é exatamente o mesmo que contruí-los dentro
de uma aplicação regular, sem nenhuma convenção especial de nomeamento.
Referir a seus componentes de dentro do plugin também não requer nenhum
referência especial.

::

    // Component
    class ExampleComponent extends Object {

    }

    // dentro de seus controolers de Plugin:
    var $components = array('Example'); 

Para referenciar o componente de fora do plugin requer o nome do plugin
para ser referenciado.

::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // referencia ExampleComponent em Pizza plugin.

A mesma técnica se aplica a Helpers e Behaviors.

Imagens de Plugin, CSS e Javascript
===================================

Você pode incluir arquivos de Imagens, Javascripts e CSS específicos em
seu plugin. Estes arquivos ativos devem ser colocados em
seu\_plugin/vendors/img, seu\_plugin/vendors/css e
seu\_plugin/vendors/js respectivamente. Eles podem ser lincados em suas
views com os core helpers assim como:

::

    <?php echo $html->image('/seu_plugin/img/my_image.png'); ?>

    <?php echo $html->css('/seu_plugin/css/my_css'); ?>

    <?php echo $javascript->link('/seu_plugin/js/do_cool_stuff'); ?>

Acima são exemplo de como lincar arquivos imagens, javascript e CSS para
seu plugin.

É importante notar que **/seu\_plugin/** prefixe antes o caminho img, js
ou css. Isso faz a mágica acontecer!

Plugin Tips
===========

Então, agora que você construiu tudo, ele deve estar pronto para ser
distribuído (embora nós sugerimos alguns extras como um readme ou
arquivo SQL).

Uma vez que um plugin tenha sido instalado em /app/plugins, você pode
acessá-lo pelo URL /pluginname/controllername/action. Em seu plugin
exemplo de pedidos de pizza, nós acessamos nosso PizzaOrdersController
em /pizza/pizzaOrders.

Algumas dicas finais ao trabalhar com plugins em suas aplicações
CakePHP:

-  Quando você não tem um [Plugin]AppController e [Plugin]AppModel, você
   terá erros de Missing Controller ao tentar acessar um controller de
   plugin.
-  Você pode ter um controller padrão com o nome de seu plugin. Se você
   fizer isso, você pode acessá-lo via /[Plugin]/action. Por exemplo, um
   plugin chamado 'users' com um controller chamado UsersController pode
   ser acessado em /users/add se não há nenhum controller chamado
   AddController em sua pasta [plugin]/controllers.
-  Você pode definir seus próprios layouts para plugins, dentro de
   app/plugin/views/layouts. Ou então o plugin usará o layout da pasta
   /app/vies/layouts por padrão.
-  Você pode fazer comunicação inter-plugin usando
   ``$this->requestAction('/plugin/controller/action');`` em seus
   controllers.
-  Se você usar requestActions, tenha certeza que os nomes de controller
   e model sejam tão únicos o quanto possível. De outra forma você deve
   ter erros de PHP "redefined class ...".

