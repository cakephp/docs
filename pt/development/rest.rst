REST
####

Muitos programadores de aplicações mais recentes estão percebendo a necessidade de abrir seu núcleo
de funcionalidade para uma maior audiência. Fornecer acesso fácil e irrestrito ao seu
a API principal pode ajudar a aceitar sua plataforma, e permite o mashups e fácil
integração com outros sistemas.

Embora existam outras soluções, o REST é uma ótima maneira de facilitar o acesso
a lógica que você criou em sua aplicação. É simples, geralmente baseado em XML (nós estamos
falando XML simples, nada como um envelope SOAP) e depende de cabeçalhos HTTP
para direção. Expor uma API via REST no CakePHP é simples.


A Configuração é simples
========================

A maneira mais rápida de começar com o REST é adicionar algumas linhas para configurar
:ref:`resource routes <resource-routes>` em seu config/routes.php.

Uma vez que o roteador foi configurado para mapear solicitações REST para determinado controller
as actions, podemos avançar para criar a lógica em nossas actions no controller. Um controller básico pode parecer algo assim ::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set([
                'recipes' => $recipes,
                '_serialize' => ['recipes']
            ]);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set([
                'recipe' => $recipe,
                '_serialize' => ['recipe']
            ]);
        }

        public function add()
        {
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
                '_serialize' => ['message', 'recipe']
            ]);
        }

        public function edit($id)
        {
            $recipe = $this->Recipes->get($id);
            if ($this->request->is(['post', 'put'])) {
                $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
                if ($this->Recipes->save($recipe)) {
                    $message = 'Saved';
                } else {
                    $message = 'Error';
                }
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }

        public function delete($id)
        {
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

Os controllers RESTful geralmente usam extensões analisadas para exibir diferentes visualizações
com base em diferentes tipos de requisições. Como estamos lidando com pedidos REST, estaremos fazendo visualizações XML. 
Você pode fazer visualizações JSON usando o CakePHP's para criar :doc:`/views/json-and-xml-views`. Ao usar o buld-in
:php:class:`XmlView` podemos definir uma variável na view ``_serialize``. A variável de exibição é usada para definir 
quais variáveis de exibição ``XmlView`` devem Serializar em XML ou JSON.


Se quisermos modificar os dados antes de serem convertidos em XML ou JSON, não devemos
definir a variável de exibição `` _serialize`` e, em vez disso, use arquivos de template. Colocamos
as saidas REST para nosso RecipesController dentro de **src/Template/Recipes/xml**. Nós também podemos usar
The :php:class:`Xml` para saída XML rápida e fácil.

    // src/Template/Recipes/xml/index.ctp
    // Faça alguma formatação e manipulação em
    // the $recipes array.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();

Ao servir um tipo de conteúdo específico usando :php:meth:`Cake\\Routing\\Router::extensions()`,
CakePHP procura automaticamente um auxiliar de visualização.
Uma vez que estamos usando o XML como o tipo de conteúdo, não há um helper interno,
no entanto, se você criasse um, ele seria automaticamente carregado
Para o nosso uso nessas views.

O XML renderizado acabará por parecer algo assim ::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

Criar uma lógica para editar uma action é um pouco mais complicado, mas não muito. Desde a
que você está fornecendo uma API que emite XML, é uma escolha natural para receber XML
Como entrada. Não se preocupe, o
:php:class:`Cake\\Controller\\Component\\RequestHandler` e
:php:class:`Cake\\Routing\\Router` tornam as coisas muito mais fáceis. Se um POST ou
A solicitação PUT tem um tipo de conteúdo XML, então a entrada é executada através do CakePHP's
:php:class:`Xml`, e a representação da array dos dados é atribuída a
``$this->request->getData()``. Devido a essa característica, lidar com dados XML e POST em
O paralelo é transparente: não são necessárias alterações ao código do controlador ou do modelo.
Tudo o que você precisa deve terminar em ``$this->request->getData()``.


Aceitando entrada em outros formatos
====================================

Normalmente, os aplicativos REST não apenas exibem conteúdo em formatos de dados alternativos,
Mas também aceitam dados em diferentes formatos. No CakePHP, o
:php:class:`RequestHandlerComponent` ajuda a facilitar isso. Por padrão,
Ele decodificará qualquer entrada de dados de entrada JSON/XML para solicitações POST/PUT
E forneça a versão da array desses dados em ``$this->request->getData()``.
Você também pode usar desserializadores adicionais para formatos alternativos se você
Precisa deles, usando :php:meth:`RequestHandler::addInputType()`.


Roteamento RESTful
==================

O roteador CakePHP facilita a conexão das rotas de recursos RESTful. Veja a seção :ref:`resource-routes`  para mais informações.

.. meta::
    :title lang=en: REST
    :keywords lang=en: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
