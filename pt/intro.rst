CakePHP num piscar de olhos
###########################

O CakePHP foi projetado para simplificar e facilitar tarefas comuns de desenvolvimento web. 
Ao fornecer um conjunto de ferramentas completo para você começar, as diversas partes do 
CakePHP funcionam bem juntas ou separadamente.

O objetivo desta apresentação é introduzir os conceitos gerais presentes no CakePHP
e lhe dar uma rápida visão geral de como esses conceitos são implementados. Se
você está ansioso para começar um projeto, você pode 
:doc:`começar com o tutorial </tutorials-and-examples/cms/installation>`, ou
:doc:`mergulhar na documentação</topics>`.

Convenções Sobre Configuração
=============================

O CakePHP provê uma estrutura organizacional básica que cobre nomenclaturas de
classes, arquivos, banco de dados e outras convenções. Apesar das convenções 
levarem algum tempo para serem assimiladas, ao seguí-las você evita configurações 
desnecessárias e cria uma estrutura de aplicação uniforme, que faz trabalhar com 
vários projetos uma tarefa suave. O :doc:`capítulo de convenções</intro/conventions>` 
explica as várias convenções que o CakePHP utiliza.

A Camada Model
==============

A camada Model representa a parte da sua aplicação que implementa a lógica de
negócios. Ela é responsável por recuperar dados e convertê-los nos conceitos
significativos primários na sua aplicação. Isto inclui processar, validar,
associar ou qualquer outra tarefa relacionada à manipulação de dados.

No caso de uma rede social, a camada Model deveria cuidar de tarefas como
salvar os dados do usuário, salvar as associações entre amigos, salvar e
recuperar fotos de usuários, localizar sugestões para novos amigos, etc. Os
objetos de modelo podem ser pensados como "Friend", "User", "Comment", ou
"Photo". Se nós quiséssemos carregar alguns dados da nossa tabela ``users``
poderíamos fazer::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $users = $this->fetchTable('Users');
    $resultset = $users->find()->all();
    foreach ($resultset as $row) {
        echo $row->username;
    }

Você pode notar que não precisamos escrever nenhum código antes de podermos
começar a trabalhar com nossos dados. Por usar convenções, o CakePHP irá
utilizar classes padrão para tabelas e entidades que ainda não foram definidas.

Se nós quiséssemos criar um usuário e salvá-lo (com validação) faríamos algo
assim::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $users = $this->fetchTable('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

A Camada View
=============

A View renderiza uma apresentação de dados modelados. Estando separada dos
objetos da Model, é responsável por utilizar a informação que tem disponível
para produzir qualquer interface de apresentação que a sua aplicação possa
precisar.

Por exemplo, a view pode usar dados da model para renderizar uma página HTML que
os contenha, ou um resultado formatado como XML::

    // No arquivo view, nós renderizaremos um 'element' para cada usuário.
    <?php foreach ($resultset as $user): ?>
        <li class="user">
            <?= $this->element('user_info', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

A camada View fornece vários pontos de extensão, como :ref:`view-templates`, :ref:`view-elements`
e :doc:`/views/cells` para permitir que você reutilize sua lógica de
apresentação.

A camada View não está limitada somente a HTML ou apresentação textual dos
dados. Ela pode ser usada para entregar formatos de dado comuns como JSON, XML,
e, através de uma arquitetura encaixável, qualquer outro formato que você venha
a precisar.

A Camada Controller
===================

A camada Controller manipula requisições dos usuários. É responsável por
renderizar uma resposta com o auxílio de ambas as camadas, Model e View.

Um controller pode ser visto como um gerente que certifica-se de que todos os
recursos necessários para completar uma tarefa sejam delegados aos trabalhadores
corretos. Ele aguarda por petições dos clientes, checa suas validades de acordo
com autenticação ou regras de autorização, delega requisições ou processamento
de dados da camada Model, seleciona o tipo de dados de apresentação que os
clientes estão aceitando, e finalmente delega o processo de renderização para a
camada View. Um exemplo de controller para registro de usuário seria::

    public function add()
    {
        $user = $this->Users->newEmptyEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('Você está registrado.'));
            } else {
                $this->Flash->error(__('Houve algum problema.'));
            }
        }
        $this->set('user', $user);
    }

Você pode perceber que nós nunca renderizamos uma view explicitamente. As
convenções do CakePHP tomarão o cuidado de selecionar a view correta e
renderizá-la com os dados definidos com ``set()``.

.. _request-cycle:

Ciclo de Requisições do CakePHP
===============================

Agora que você está familiarizado com as diferentes camadas no CakePHP, veja na imagem abaixo como o ciclo de requisição funciona:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Diagrama de fluxo exibindo uma típica requisição CakePHP

O ciclo de requisição do CakePHP começa com a solicitação de uma página ou
recurso da sua aplicação, seguindo a sequência abaixo:

#. As regras de reescrita do servidor encaminham a requisição para
   **webroot/index.php**.
#. Sua aplicação é carregada e vinculada a um ``HttpServer``.
#. O *middleware* da sua aplicação é inicializado.
#. A requisição e a resposta são processados através do *PSR-7 Middleware* que
   sua aplicação utiliza. Normalmente isso inclui captura de erros e
   roteamento.
#. Se nenhuma resposta for retornada do *middleware* e a requisição contiver
   informações de rota, um *controller* e uma *action* são acionados.
#. A *action* do *controller* é chamada e o mesmo interage com os *Models* e
   *Components* solicitados.
#. O *controller* delega a responsabilidade de criar respostas à *view* para
   gerar a saída de dados resultante do *Model*.
#. A *View* utiliza *Helpers* e *Cells* para gerar o corpo e o cabeçalho da
   resposta.
#. A resposta é enviada de volta através do :doc:`/controllers/middleware`.
#. O ``HttpServer`` envia a resposta para o servidor web.

Apenas o Começo
===============

Esperamos que essa rápida visão geral tenha despertado seu interesse.
Alguns outros grandes recursos do CakePHP são:

* :doc:`Framework de cache </core-libraries/caching>` que integra com
  Memcached, Redis e outros backends.
* Poderosas :doc:`ferramentas de geração de código </bake/usage>` para você começar imediatamente.
* :doc:`Framework de teste integrado </development/testing>` para você
  assegurar-se que seu código funciona perfeitamente.

Os próximos passos óbvios são :doc:`baixar o CakePHP </installation>` e ler o
:doc:`tutorial e construir algo fantástico </tutorials-and-examples/cms/installation>`.

Leitura Adicional
=================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=pt: CakePHP num piscar de olhos
    :keywords lang=pt: estrutura de diretórios,nomes de tablea,requisição inicial,tabela de banco de dados,estrutura organizacional,rst,nomenclatura de arquivos,convenções,mvc
