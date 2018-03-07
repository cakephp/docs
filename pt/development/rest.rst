REST
####

Muitos programadores de aplicação mais recentes estão percebendo a necessidade de abrir
sua principal funcionalidade para um público maior. Fornecer fácil,
acesso irrestrito à sua API principal pode ajudar a obter sua plataforma
aceito, e permite manipulações e fácil integração com outros
sistemas.

Embora existam outras soluções, o REST é uma ótima maneira de facilitar
acesso à lógica que você criou no seu aplicativo. Está
simples, geralmente baseado em XML (falamos XML simples, nada como um
Envelope SOAP) e depende de cabeçalhos HTTP para direção. Exposição
Uma API via REST no CakePHP é simples.    

A Configuração Simples
======================

A maneira mais rápida de começar a funcionar com o REST é adicionar algumas linhas ao seu arquivo route.php, encontrado no app / Config. O objeto do roteador possui um método chamado ``mapResources()``, que é usado para configurar uma série de rotas padrão para o acesso REST aos seus controladores. Certifique-se de que ``mapResources()`` vem antes de ``pedir CAKE . 'Config' . DS . 'routes.php';`` e outras rotas que ultrapassariam as rotas. Se quisermos permitir o acesso REST a um banco de dados de receitas, faríamos algo assim::

    //In app/Config/routes.php...

    Router::mapResources('recipes');
    Router::parseExtensions();
    
A primeira linha configura uma série de rotas padrão para acesso REST fácil enquanto
``parseExtensions()`` especifica o formato de resultado desejado (por exemplo, xml,
json, rss). Essas rotas são sensíveis ao método de solicitação HTTP.

=========== ===================== ==============================
HTTP format URL format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

A classe do roteador do CakePHP usa uma série de indicadores diferentes para
detectar o método HTTP que está sendo usado. Aqui eles estão em ordem de
preferência:

#. The *\_method* POST variable
#. The X\_HTTP\_METHOD\_OVERRIDE
#. The REQUEST\_METHOD header

A variável *\_method* POST é útil na utilização de um navegador como um
Cliente REST (ou qualquer outra coisa que possa fazer POST facilmente). Basta configurar
o valor de \_method para o nome do método de solicitação HTTP você
deseja emular.

Uma vez que o roteador foi configurado para mapear solicitações REST para determinados
ações de controle, podemos avançar para criar a lógica em nosso
ações do controlador. Um controlador básico pode parecer algo como
esta::


    // Controller/RecipesController.php
    class RecipesController extends AppController {

        public $components = array('RequestHandler');

        public function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(array(
                'recipes' => $recipes,
                '_serialize' => array('recipes')
            ));
        }

        public function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(array(
                'recipe' => $recipe,
                '_serialize' => array('recipe')
            ));
        }
        
        public function add() {
            $this->Recipe->create();
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }
    }


Uma vez que adicionamos uma chamada para :php:meth:`Router::parseExtensions()`,
o roteador CakePHP já está preparado para exibir diferentes visualizações com base em
diferentes tipos de requests. Como estamos lidando com REST
requests, estaremos fazendo visualizações XML. Você também pode facilmente fazer exibições JSON usando
CakePHP's built-in :doc:`/views/json-and-xml-views`. Ao usar o built in
:php:class:`XmlView` podemos definir uma variável de visualização ``_serialize``. Este especial
A variável view é usada para definir quais variáveis de exibição ``XmlView`` devem
serializar em XML.

Se quisermos modificar os dados antes de ser convertidos em XML, não devemos
defina a variável de exibição ``_serialize`` e, em vez disso, use arquivos de exibição. Nós colocamos
as visualizações REST para nosso RecipesController dentro de ``app/View/recipes/xml``. Nós também podemos usar
o :php:class:`Xml` para saída XML rápida e fácil nessas vistas. Aqui é o que
nossa exibição de índice pode parecer::

    // app/View/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(array('response' => $recipes));
    echo $xml->asXML();

Ao atender um tipo de conteúdo específico usando parseExtensions(),
CakePHP procura automaticamente um auxiliar de visualização que corresponda ao tipo.
Como estamos usando o XML como o tipo de conteúdo, não há um ajudante interno,
no entanto, se você criasse um, ele seria automaticamente carregado
para o nosso uso nessas visualizações.

O XML renderizado acabará por parecer algo assim::

    <recipes>
        <recipe id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="Yummy yummmy"></comment>
        </recipe>
        <recipe id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this tasty dish."></comment>
        </recipe>
    </recipes>

Criar a lógica para a ação de edição é um pouco mais complicado, mas não
por muito. Como você está fornecendo uma API que emite XML, é um
escolha natural para receber XML como entrada. Não se preocupe, o
:php:class:`RequestHandler` e :php:class:`Router` fazem
coisas muito mais fáceis. Se uma solicitação POST ou PUT tiver um tipo de conteúdo XML,
então a entrada é executada através da classe CakePHP's :php:class:`Xml` class, e a
a representação de matriz dos dados é atribuída a `$this->request->data`.
Devido a esse recurso, manipulando dados XML e POST em paralelo
é sem costura: nenhuma alteração é necessária para o controlador ou o código do modelo.
Tudo o que você precisa deve acabar em ``$this->request->data``.


Aceitando Entrada em Outros Formatos
====================================

Normalmente, os aplicativos REST não apenas exibem conteúdo em formatos de dados alternativos,
mas também aceitam dados em diferentes formatos. No CakePHP, o
:php:class:`RequestHandlerComponent` ajuda a facilitar isso. Por padrão,
ele decodificará qualquer entrada de dados de entrada JSON/XML para pedidos POST/PUT
e forneça a versão de matriz desses dados em `$this->request->data`.
Você também pode filmar em desserializadores adicionais para formatos alternativos se você
precisa deles, usando :php:meth:`RequestHandler::addInputType()`.


Modificando as rotas REST padrão
================================

.. versionadded:: 2.1

Se as rotas REST padrão não funcionarem para seu aplicativo, você pode modificá-las
usando :php:meth:`Router::resourceMap()`. Este método permite que você defina o
rotas padrão que são configuradas com :php:meth:`Router::mapResources()`. Ao usar
esse método você precisa definir *all* os padrões que deseja usar::

    Router::resourceMap(array(
        array('action' => 'index', 'method' => 'GET', 'id' => false),
        array('action' => 'view', 'method' => 'GET', 'id' => true),
        array('action' => 'add', 'method' => 'POST', 'id' => false),
        array('action' => 'edit', 'method' => 'PUT', 'id' => true),
        array('action' => 'delete', 'method' => 'DELETE', 'id' => true),
        array('action' => 'update', 'method' => 'POST', 'id' => true)
    ));

Ao substituir o mapa de recursos padrão, as futuras chamadas para ``mapResources()``  irão
use os novos valores.

.. _custom-rest-routing:

Roteamento REST personalizado
=============================

Se as rotas padrão criadas por :php:meth:`Router::mapResources()` não funciona
para você, use o método :php:meth:`Router::connect()` para definir um conjunto personalizado de
Rotas de REST. O método ``connect()`` permite que você defina uma série de diferentes
opções para um determinado URL. Consulte a seção em :ref:`route-conditions` para obter mais informações.

.. versionadded:: 2.5

Você pode fornecer a chave ``connectOptions`` na matriz ``$options` para
:php:meth:`Router::mapResources()` para fornecer configurações personalizadas usadas por
:php:meth:`Router::connect()`::

    Router::mapResources('books', array(
        'connectOptions' => array(
            'routeClass' => 'ApiRoute',
        )
    ));


.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api








