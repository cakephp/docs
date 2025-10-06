REST
####

REST é um conceito fundamental para a web aberta. O CakePHP fornece funcionalidade
para construir aplicações que expõem APIs REST com abstrações e interfaces de
baixa complexidade.

O CakePHP fornece métodos para expor suas ações de controller através de métodos HTTP,
e serializar variáveis de view baseadas em negociação de content-type. A negociação
de Content-Type permite que clientes da sua aplicação enviem requisições com dados
serializados e recebam respostas com dados serializados através dos cabeçalhos
``Accept`` e ``Content-Type``, ou extensões de URL.

Primeiros Passos
================

Para começar a adicionar uma API REST à sua aplicação, primeiro precisaremos
de um controller contendo ações que queremos expor como uma API. Um controller
básico pode se parecer com algo assim::

    // src/Controller/RecipesController.php
    use Cake\View\JsonView;

    class RecipesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all')->all();
            $this->set('recipes', $recipes);
            $this->viewBuilder()->setOption('serialize', ['recipes']);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set('recipe', $recipe);
            $this->viewBuilder()->setOption('serialize', ['recipe']);
        }

        public function add()
        {
            $this->request->allowMethod(['post', 'put']);
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function edit($id)
        {
            $this->request->allowMethod(['patch', 'post', 'put']);
            $recipe = $this->Recipes->get($id);
            $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
            ]);
            $this->viewBuilder()->setOption('serialize', ['recipe', 'message']);
        }

        public function delete($id)
        {
            $this->request->allowMethod(['delete']);
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set('message', $message);
            $this->viewBuilder()->setOption('serialize', ['message']);
        }
    }

No nosso ``RecipesController``, temos várias ações que definem a lógica
para criar, editar, visualizar e excluir receitas. Em cada uma das nossas ações
estamos usando a opção ``serialize`` para dizer ao CakePHP quais variáveis de
view devem ser serializadas ao fazer respostas de API. Vamos conectar nosso
controller às URLs da aplicação com :ref:`resource-routes`::

    // in config/routes.php
    $routes->scope('/', function (RouteBuilder $routes): void {
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

Essas rotas habilitarão URLs como ``/recipes.json`` para retornar uma resposta
codificada em JSON. Clientes também podem fazer uma requisição para ``/recipes``
com o cabeçalho ``Content-Type: application/json`` também.

Codificando Dados de Resposta
==============================

No controller acima, estamos definindo um método ``viewClasses()``. Este método
define quais views seu controller tem disponíveis para negociação de conteúdo.
Estamos incluindo a ``JsonView`` do CakePHP que habilita respostas baseadas em JSON.
Para aprender mais sobre isso e views baseadas em Xml veja :doc:`/views/json-and-xml-views`.
é usado pelo CakePHP para selecionar uma classe de view para renderizar uma resposta REST.

Em seguida, temos vários métodos que expõem a lógica básica para criar, editar,
visualizar e excluir receitas. Em cada uma das nossas ações estamos usando a opção
``serialize`` para dizer ao CakePHP quais variáveis de view devem ser serializadas
ao fazer respostas de API.

Se quiséssemos modificar os dados antes de serem convertidos em JSON, não deveríamos
definir a opção ``serialize``, e ao invés disso usar arquivos de template. Colocaríamos
os templates REST para nosso RecipesController dentro de **templates/Recipes/json**.

Veja :ref:`controller-viewclasses` para mais informações sobre como funciona a
funcionalidade de negociação de resposta do CakePHP.

Analisando Corpos de Requisição
================================

Criar a lógica para a ação edit requer outro passo. Como nossos recursos são
serializados como JSON, seria ergonômico se nossas requisições também contivessem
a representação JSON.

Na sua classe ``Application`` certifique-se de que o seguinte está presente::

    $middlewareQueue->add(new BodyParserMiddleware());

Este middleware usará o cabeçalho ``content-type`` para detectar o formato dos
dados da requisição e analisar os formatos habilitados. Por padrão, apenas a
análise de ``JSON`` está habilitada. Você pode habilitar o suporte a XML
habilitando a opção de construtor ``xml``. Quando uma requisição é feita com um
``Content-Type`` de ``application/json``, o CakePHP decodificará os dados da
requisição e atualizará a requisição para que ``$request->getData()`` contenha
o corpo analisado.

Você também pode conectar desserializadores adicionais para formatos alternativos
se precisar deles, usando :php:meth:`BodyParserMiddleware::addParser()`.

.. meta::
    :title lang=pt: REST
    :keywords lang=pt: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,access,config,soap,recipes,logic,audience,cakephp,running,api
