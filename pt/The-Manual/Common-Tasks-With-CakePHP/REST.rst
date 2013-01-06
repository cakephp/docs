REST
####

Muitos novos programadores estão compreendendo a necessidade de abrir
suas funcionalidades de suas aplicações a um público maior. Oferecer
acesso fácil e ilimitado à API principal de sua aplicação pode ajudar na
aceitação de sua plataforma, além de permitir a criação de produtos
derivados (mashups) e facilitar a integração com outros sistemas.

Por mais que existam outras soluções, REST é uma grande maneira de
prover acesso fácil à lógica que você criou em sua aplicação. É simples,
normalmente baseado em XML (e estamos falando de XML bem simples, nada
parecido com um envelope SOAP) e depende dos cabeçalhos HTTP para
direcionamento. Expor uma API usando-se REST no CakePHP é simples.

Configuração Simples
====================

O jeito mais rápido para utilizar REST em sua aplicação é adicionar
algumas linhas em seu arquivo routes.php, que é econtrado em app/config.
O objeto Router possui um método chamado mapResources(), que é utilizado
para configurar algumas rotas padrões, estas possibilitam o acesso REST
em suas classes de controle (controllers). Se desejamos permitir acesso
REST para um banco de dados de receitas (recipe), nós faríamos algo
assim:

::

    //Em app/config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

A primeira linha cria uma série de rotas padrões para acesso REST de
forma simples. Estas rotas são sensíveis ao método HTTP solicitado. A
tabela abaixo descreve as rotas criadas.

+---------------+----------------+----------------------------------+
| Método HTTP   | URL            | Ação do Controle invocada        |
+===============+================+==================================+
| GET           | /recipes       | RecipesController::index()       |
+---------------+----------------+----------------------------------+
| GET           | /recipes/123   | RecipesController::view(123)     |
+---------------+----------------+----------------------------------+
| POST          | /recipes       | RecipesController::add()         |
+---------------+----------------+----------------------------------+
| PUT           | /recipes/123   | RecipesController::edit(123)     |
+---------------+----------------+----------------------------------+
| DELETE        | /recipes/123   | RecipesController::delete(123)   |
+---------------+----------------+----------------------------------+
| POST          | /recipes/123   | RecipesController::edit(123)     |
+---------------+----------------+----------------------------------+

A classe de rotas do CakePHP utiliza diferentes indicadores para
detectar o método HTTP utilizado. Abaixo é demonstrado a ordem de
avaliação deste indicadores:

#. A variável *\_method* enviada junto ao POST
#. O X\_HTTP\_METHOD\_OVERRIDE
#. O cabeçalho REQUEST\_METHOD

A variável do POST *\_method* é útil ao utilizar o navegador como um
cliente REST (ou qualquer outra coisa que possa enviar um POST
facilmente). Apenas atribua o valor da variável \_method para o tipo da
requisição HTTP você deseja emular.

Com as rotas prontas para mapear as requisições REST para as ações de um
certo controle, nós podemos criar a lógica em nossas ações do controle.
Uma classe de controle básica é parecida com está aqui:

::

    // controllers/recipes_controller.php

    class RecipesController extends AppController {

        var $components = array('RequestHandler');

        function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(compact('recipes'));
        }

        function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(compact('recipe'));
        }

        function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }

        function delete($id) {
            if($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Uma vez que foi adicionado a chamada ao método
Router::parseExtensions(), as rotas do CakePHP estão prontas para servir
diferentes visões baseadas em diferentes tipos de requisições. Como
estamos lidando com requisições REST, as visões são do tipo XML. Nós
gravaremos as arquivos da camada de visão para nosso RecipesController
dentro de app/views/xml. Nós podemos utilizar também o XmlHelper para
proporcinar uma saída rápida e simples de XML em nossa visão. Abaixo é
demonstrado como a nossa index ficará:

::

    // app/views/recipes/xml/index.ctp

    <recipes>
        <?php echo $xml->serialize($recipes); ?>
    </recipes>

Usuários experientes em CakePHP notam que nós não incluimos o XmlHelper
no array de helpers do RecipesController. Isto foi por propósito -
quando servimos diferentes tipos de *content type* usando
parseExtensions(), o CakePHP automaticamente procura o helper que se
adequa com o tipo. Como nós estamos usando XML como o *content type*, o
XmlHelper é automaticamente lido para nosso uso na visão.

O XML renderizado seguirá o modelo abaixo:

::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="This is a comment for this post."></comment>
        </post>   
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this post."></comment>
        </post>
    </posts>

Criar a lógica para a ação *edit* é um pouco mais complicado, mas não
tanto. Uma vez que sua API retorna XML, é uma escolha natural receber
XML como entrada. Nada a se preocupar, pois o RequestHandler e a classe
Router fazem as coisas muito mais simples. Se uma requisição POST ou PUT
contém um *content-type* XML, então a entrada é passada para uma
instancia do objeto Xml do Cake, este faz o parse do xml e o transforma
em um array, que é atribuido a propriedade $data do controle. Por causa
deste recurso, lidar com XML e dados POST em paralelo é muito simples:
nenhuma alteração é necessária no código da classe de controle ou na
classe de modelo. Tudo o que ocê precisa estará em $this->data.

Roteamento REST Personalizado
=============================

Se as rotas padrão criadas pelo mapResources() não funcionarem para
você, utilize o método Router::connect() para definir um conjunto
específico de rotas REST. O método connect() permite a você definir um
conjunto de diferentes opções para uma dada URL. O primeiro parâmetro é
a URL em si e o segundo parâmetro permite a você informar tais opções. O
terceiro parâmetro deste método permite que você especifique padrões de
expressão regular para ajudar o CakePHP a identificar certos marcadores
na URL especificada.

Vamos apresentar um exemplo simples aqui e deixar que você ajuste esta
rota para seus outros propósitos RESTful. Aqui você vê como nossa rota
REST deve se parecer, sem utilizar mapResources():

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9+]")
    )

Técnicas avançadas de roteamento também já foram abordadas noutras
oportunidades neste Cookbook, então iremos nos focar na parte mais
importante para nossos propósitos aqui: a chave [method] do array
options no segundo parâmetro. Uma vez que esta chave esteja definida, a
rota especificada irá funcionar apenas para o método de requisição HTTP
dado (que pode ser GET, POST, DELETE, etc.)
