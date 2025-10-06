CakePHP Num Piscar de Olhos
###########################

O CakePHP foi projetado para tornar tarefas comuns de desenvolvimento web simples e fáceis. Ao
fornecer uma caixa de ferramentas completa para você começar, as várias partes do CakePHP
funcionam bem juntas ou separadamente.

O objetivo desta visão geral é introduzir os conceitos gerais no CakePHP e
dar a você uma visão geral rápida de como esses conceitos são implementados no CakePHP. Se
você está ansioso para começar um projeto, pode :doc:`começar com o
tutorial </tutorials-and-examples/cms/installation>`, ou :doc:`mergulhar na documentação
</topics>`.

Convenções Sobre Configuração
==============================

O CakePHP fornece uma estrutura organizacional básica que cobre nomes de classes,
nomes de arquivos, nomes de tabelas de banco de dados e outras convenções. Embora as convenções
levem algum tempo para aprender, ao seguir as convenções o CakePHP fornece você pode
evitar configurações desnecessárias e criar uma estrutura de aplicação uniforme que torna
trabalhar com vários projetos simples. O :doc:`capítulo de convenções
</intro/conventions>` cobre as várias convenções que o CakePHP usa.

A Camada Model
==============

A camada Model representa a parte da sua aplicação que implementa a
lógica de negócios. Ela é responsável por recuperar dados e convertê-los nos
conceitos significativos primários em sua aplicação. Isso inclui processar,
validar, associar ou outras tarefas relacionadas ao manuseio de dados.

No caso de uma rede social, a camada Model cuidaria de
tarefas como salvar os dados do usuário, salvar associações de amigos, armazenar
e recuperar fotos de usuários, encontrar sugestões para novos amigos, etc.
Os objetos de modelo podem ser pensados como "Friend", "User", "Comment" ou
"Photo". Se quiséssemos carregar alguns dados da nossa tabela ``users`` poderíamos fazer::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $users = $this->fetchTable('Users');
    $resultset = $users->find()->all();
    foreach ($resultset as $row) {
        echo $row->username;
    }

Você pode notar que não precisamos escrever nenhum código antes de podermos começar
a trabalhar com nossos dados. Ao usar convenções, o CakePHP usará classes padrão
para classes de tabela e entidade que ainda não foram definidas.

Se quiséssemos criar um novo usuário e salvá-lo (com validação), faríamos
algo assim::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $users = $this->fetchTable('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

A Camada View
=============

A camada View renderiza uma apresentação de dados modelados. Estando separada dos
objetos Model, ela é responsável por usar as informações que tem disponíveis
para produzir qualquer interface de apresentação que sua aplicação possa precisar.

Por exemplo, a view poderia usar dados do modelo para renderizar um template de view HTML contendo-os,
ou um resultado formatado em XML para outros consumirem::

    // Em um arquivo de template de view, renderizaremos um 'element' para cada usuário.
    <?php foreach ($resultset as $user): ?>
        <li class="user">
            <?= $this->element('user_info', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

A camada View fornece vários pontos de extensão como :ref:`view-templates`, :ref:`view-elements`
e :doc:`/views/cells` para permitir que você reutilize sua lógica de apresentação.

A camada View não está limitada apenas a HTML ou representação de texto dos dados.
Ela pode ser usada para fornecer formatos de dados comuns como JSON, XML, e através de
uma arquitetura plugável qualquer outro formato que você possa precisar, como CSV.

A Camada Controller
===================

A camada Controller lida com requisições dos usuários. Ela é responsável por
renderizar uma resposta com a ajuda das camadas Model e View.

Um controller pode ser visto como um gerente que garante que todos os recursos necessários para
completar uma tarefa sejam delegados aos trabalhadores corretos. Ele espera por petições
de clientes, verifica sua validade de acordo com regras de autenticação ou autorização,
delega a busca ou processamento de dados ao modelo, seleciona o tipo de
dados de apresentação que os clientes estão aceitando e, finalmente, delega o
processo de renderização à camada View. Um exemplo de controller de registro
de usuário seria::

    public function add()
    {
        $user = $this->Users->newEmptyEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('Você está agora registrado.'));
            } else {
                $this->Flash->error(__('Houve alguns problemas.'));
            }
        }
        $this->set('user', $user);
    }

Você pode notar que nunca renderizamos explicitamente uma view. As convenções do CakePHP
cuidarão de selecionar a view correta e renderizá-la com os dados da view que
preparamos com ``set()``.

.. _request-cycle:

Ciclo de Requisição do CakePHP
===============================

Agora que você está familiarizado com as diferentes camadas no CakePHP, vamos revisar como
um ciclo de requisição funciona no CakePHP:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Diagrama de fluxo mostrando uma requisição típica do CakePHP

O ciclo de requisição típico do CakePHP começa com um usuário solicitando uma página ou
recurso em sua aplicação. Em alto nível, cada requisição passa pelas
seguintes etapas:

#. As regras de reescrita do servidor web direcionam a requisição para **webroot/index.php**.
#. Sua aplicação é carregada e vinculada a um ``HttpServer``.
#. O middleware da sua aplicação é inicializado.
#. Uma requisição e resposta são despachadas através do Middleware PSR-7 que sua
   aplicação usa. Tipicamente, isso inclui captura de erros e roteamento.
#. Se nenhuma resposta for retornada do middleware e a requisição contiver
   informações de roteamento, um controller e action são selecionados.
#. A action do controller é chamada e o controller interage com os
   Models e Components necessários.
#. O controller delega a criação de resposta à View para gerar a saída
   resultante dos dados do modelo.
#. A view usa Helpers e Cells para gerar o corpo e cabeçalhos da resposta.
#. A resposta é enviada de volta através do :doc:`/controllers/middleware`.
#. O ``HttpServer`` emite a resposta para o servidor web.

Apenas o Começo
===============

Esperamos que esta visão geral rápida tenha despertado seu interesse. Alguns outros grandes
recursos no CakePHP são:

* Um :doc:`framework de caching </core-libraries/caching>` que se integra com
  Memcached, Redis e outros backends.
* Poderosas :doc:`ferramentas de geração de código
  </bake/usage>` para que você possa começar imediatamente.
* :doc:`Framework de testes integrado </development/testing>` para que você possa garantir
  que seu código funciona perfeitamente.

Os próximos passos óbvios são :doc:`baixar o CakePHP </installation>`, ler o
:doc:`tutorial e construir algo incrível
</tutorials-and-examples/cms/installation>`.

Leitura Adicional
=================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=pt: Primeiros Passos
    :keywords lang=pt: estrutura de pastas,nomes de tabela,solicitação inicial,tabela de banco de dados,estrutura organizacional,rst,nomes de arquivo,convenções,mvc,página web,sit
