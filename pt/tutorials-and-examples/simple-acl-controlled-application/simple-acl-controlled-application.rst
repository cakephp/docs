Aplicação simples controlada por Acl
####################################

.. note::

    Este não é um tutorial para iniciantes. Se você está dando os 
    primeiros passos com o CakePHP nós sugerimos que você explore mais as 
    funcionalidades do framework antes de seguir com esse tutorial.


Neste tutorial você irá criar uma aplicação simples com
:doc:`/core-libraries/components/authentication` e
:doc:`/core-libraries/components/access-control-lists`. Este
tutorial assume que você leu :doc:`/tutorials-and-examples/blog/blog`
e você é familiarizado com
:doc:`/console-and-shells/code-generation-with-bake`. Você deve ter
alguma experiência com CakePHP, e ser familiarizado com conceitos de MVC.
Este tutorial é uma breve introdução à
:php:class:`AuthComponent` e :php:class:`AclComponent`\.

O que você irá precisar


#. Um servidor web funcionando. Nós assumiremos que você está usando o Apache,
   apesar que as instruções para o uso de outros servidores devem ser
   bem semelhantes. Existe a possibilidade de alterarmos um pouco 
   a configuração do servidor mas na maioria dos casos o CakePHP 
   irá funcionar sem nenhuma configuração extra.
#. Um servidor de banco de dados. Nós iremos usar o MySQL neste 
   tutorial. O máximo que você precisa saber de SQL é criar uma 
   base de dados: o CakePHP irá assumir as rédeas apartir daí.
#. Conhecimento básico de PHP. Quanto mais programação orientada a objeto
   você tiver desenvolvido ao longo da vida, melhor: mas não tema se você
   é um fã de programação procedural.


Iniciando nossa Aplicação
=========================

Primeiro, vamos baixar uma nova cópia do CakePHP.

Para baixar uma nova cópia, visite o projeto do CakePHP no GitHub:
https://github.com/cakephp/cakephp/tags e baixe a versão estável.
Para este tutorial você precisa do último lançamento da versão 2.0.

Você também pode clonar o repositório usando
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Uma vez que você baixou uma cópia do CakePHP, configure seu arquivo
database.php e altere o valor do Security.salt em 
app/Config/core.php. Depois disso iremos criar um banco de  
dados bem simples para construir nossa aplicação. Execute os seguintes  
comandos SQL em seu banco de dados::

   CREATE TABLE users (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       password CHAR(40) NOT NULL,
       group_id INT(11) NOT NULL,
       created DATETIME,
       modified DATETIME
   );


   CREATE TABLE groups (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       created DATETIME,
       modified DATETIME
   );


   CREATE TABLE posts (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       user_id INT(11) NOT NULL,
       title VARCHAR(255) NOT NULL,
       body TEXT,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE widgets (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       part_no VARCHAR(12),
       quantity INT(11)
   );

Estas são as tabelas que nós iremos usar para construir o resto
de nossa aplicação. Uma vez que nós temos a estrutura de tabelas
em nossa base de dados nós podemos começar a "assar" nossa aplicação. 
Use
:doc:`/console-and-shells/code-generation-with-bake` para criar
rapidamente seus modelos, controladores e views.

Para usar o bake do CakePHP, execute "cake bake all", isto irá listar
as 4 tabelas que você inseriu no MySQL. Selecione "1. Group", e siga
os prompts. Repita o proceso para as outras 3 tabelas, e isto irá 
ter gerado os 4 controladores, modelos e views para você.

Evite o uso de Scaffold neste caso. A criação dos ACOs irá ser 
seriamente afetada se você gerar os controladores com o uso do
Scaffold. 

Enquanto estiver gerando os Modelos com o bake, o CakePHP irá 
automagicamente detectar as associações entre seus Modelos
(os relacionamentos entre suas tabelas). Deixe o CakePHP criar 
corretamente as associações hasMany e belongsTo. Se no prompt 
você for questionado a escolher hasOne ou hasMany, geralmente 
você irá precisar de relacionamentos hasMany para este tutorial.

Esqueça as rotas de admin por enquanto, este é um assunto complicado
o bastante sem elas. Também esteja certo de **não** adicionar 
tanto o Acl quanto o Auth Components em nenhum dos seus controladores
já que você está gerando eles com o bake. Nós iremos fazer isso em breve.
Você agora deve ter modelos, conroladores e views geradas para seus users, 
groups, posts and widgets.

Adicionando o Auth Component
============================

No momento temos um CRUD funcionando. O bake deveria ter configurado
todos os relacionamentos que nós precisamos, se não adicione-os agora.
Existem algumas outras etapas que precisam ser concluídas antes de nós
adicionarmos o Auth e o Acl Components. Primeiro adicione uma
ação login e logout em
``UsersController``::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Session->setFlash(__('Your username or password was incorrect.'));
        }
    }

    public function logout() {
        //Leave empty for now.
    }

Depois crie a seguinte view
``app/View/Users/login.ctp``::

    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');

Agora nós iremos atualizar nosso modelo de User para ele fazer um hash nas senhas
antes que elas sejam gravadas no banco de dados. Gravar senhas sem encriptação é
extremamente inseguro e o AuthComponent espera que suas senhas estejam encriptadas.
Em ``app/Model/User.php`` adicione o seguinte::

    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // other code.

        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password(
              $this->data['User']['password']
            );
            return true;
        }
    }

Agora nós precisamos fazer algumas modificações em ``AppController``.
Se você não possui ``/app/Controller/AppController.php``, crie o arquivo. Como queremos que
toda a nossa aplicação seja controlada por Auth e Acl, nós iremos configurá-los em 
``AppController``::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );
        public $helpers = array('Html', 'Form', 'Session');

        public function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->loginAction = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->logoutRedirect = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->loginRedirect = array(
              'controller' => 'posts',
              'action' => 'add'
            );
        }
    }


Antes de configurar o ACL completamente nós precisamos de alguns users e groups
adicionados. Com o :php:class:`AuthComponent` em uso nós não vamos conseguir
acessar nenhuma de nossas ações já que não estamos logados. Para resolver isso
vamos adicionar algumas excessões em :php:class:`AuthComponent` para ele permitir 
que criemos alguns groups e users. Em **ambos** arquivos ``GroupsController`` e 
``UsersController`` adicione o seguinte::

    public function beforeFilter() {
        parent::beforeFilter();

        // For CakePHP 2.0
        $this->Auth->allow('*');

        // For CakePHP 2.1 and up
        $this->Auth->allow();
    }

As linhas acima dizem para o AuthComponent permitir acesso público
para todas as ações. Isto é temporário e irá ser removido uma vez
que nós cadastramos alguns users e groups em nossa base de dados.
Mas não adicione nenhum user ou group ainda.

Criando as tabelas Db Acl
=========================

Antes de criarmos qualquer users ou groups seria interessante
conecta-los ao Acl. Mas nós ainda não temos nenhuma
tabela do Acl e se você tentar acessar qualquer página, você
irá obter um erro de tabela inexistente ("Error: Database table acos
for model Aco was not found."). Para remover estes erros nós precisamos
rodar um schema. Em um terminal rode o seguinte::

    ./Console/cake schema create DbAcl

Este schema irá perguntar se você quer apagar e criar as tabelas. Diga
sim para deletar e criar as tabelas.

Se você não tiver acesso ao terminal, ou se estiver tendo problema
ao usar o console, você pode rodar o arquivo sql situado em
/path/to/app/Config/Schema/db\_acl.sql.

Com os controladores prontos para gravar dados e as tabelas
Acl inicializadas nós estamos prontos para seguir adiante, correto?
Não necessariamente, ainda temos um pouco de trabalho para
fazer nos modelos de User e Group. Mais precisamente, fazer com que eles 
auto-magicamente se conectem ao Acl.

Funcionando como um Requester
=============================

Para o Auth e o Acl funcionarem corretamente nós precisamos
relacionar os users e groups com registros nas tabelas do ACL. Para
conseguirmos isso, iremos usar o ``AclBehavior``. O ``AclBehavior``
permite que automagicamente conectemos nossos modelos com as tabelas
do Acl. O seu uso requer a implementação do ``parentNode()`` em seu modelo.
Em nosso modelo de ``User`` iremos adicionar o seguinte::

    class User extends AppModel {
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            if (!$this->id && empty($this->data)) {
                return null;
            }
            if (isset($this->data['User']['group_id'])) {
                $groupId = $this->data['User']['group_id'];
            } else {
                $groupId = $this->field('group_id');
            }
            if (!$groupId) {
                return null;
            }
            return array('Group' => array('id' => $groupId));
        }
    }

Depois em nosso modelo de ``Group`` adicionamos o seguinte::

    class Group extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            return null;
        }
    }

O que isto faz é conectar os modelos de ``Group`` e ``User`` ao
Acl, e dizer ao CakePHP que toda vez que você criar um User ou
um Group você também quer um registro na tabela ``aros``. Isto
faz o gerenciamento do Acl extremamente simples já que seu AROs
se torna visivelmente conectado as suas tabelas ``users`` and ``groups``.
Cada vez que você ou deleta um usuário/grupo a tabela Aro é atualizada.

Nossos controladores e modelos estão agora preparados para adicionar
algum dado, e nossos modelos de ``Group`` and ``User`` estão atrelados
à tabela do ACL. Adicione alguns groups e users usando os formulários 
gerados pelo bake acessando http://example.com/groups/add e 
http://example.com/users/add. Eu criei os seguintes groups:

-  administrators
-  managers
-  users

Eu também criei um user em cada group para então ter um usuário
de cada grupo de acesso para testar futuramente. Anote tudo
em algum lugar ou use senhas fáceis para não esquecer. Se você 
executar ``SELECT * FROM aros;`` em um prompt mysql ele deve
retornar algo parecido com o seguinte::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)


Isto nos mostra que temos 3 groups e 3 users. Os users são
aninhados dentro de groups, isto quer dizer que podemos definir
permissões por grupo ou por usuário.

Permissões por Grupo
====================

Se você deseja criar permissões por grupo, nós precisamos
implementar ``bindNode()`` no modelo de ``User``::

    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

Depois modifique o ``actsAs`` do modelo de ``User`` e desabilite a opção enabled::

    public $actsAs = array('Acl' => array('type' => 'requester', 'enabled' => false));

Estas duas mudanças irão dizer ao ACL para evitar a checagem no ARO de ``User`` para checar
somente o ARO de ``Group``. Isto também evita o afterSave de ser chamado.

Observação: Todo user precisa ter um ``group_id`` relacionado para isso funcionar.

Agora a tabela ``aros`` irá parecer com isto::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

Creating ACOs (Access Control Objects)
======================================

Agora que temos nossos users and groups(aros), nós podemos
começar a inserir nossos controladores dentro do Acl e a setar
permissões para nossos groups e users, como também habilitar login /
logout.

Nossos AROs estão sendo criados automaticamente quando novos users
e groups são criados. Que tal uma forma de auto-gerar os ACOs 
dos nossos controladores e suas ações? É... infelizmente não há
uma forma mágica no core do CakePHP para realizar isto. Mas as 
classes do core oferecem alguns meios para criar manualmente os ACOs.
Você pode criar os objetos do ACO apartir do terminal do Acl ou você
pode usar o ``AclComponent``. 
Criar Acos usando o terminal pode ser algo como::

    ./Console/cake acl create aco root controllers

Enquanto usar o AclComponent irá ser algo como::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();


Ambos os exemplos iriam criar a "raíz"(root) ou o nível mais alto do ACO
que irá se chamar 'controllers'. A razão desse nódulo raiz é facilitar o
allow/deny num escopo global da aplicação e permitir o uso do Acl para
questões não relacionadas à controladores/ações por exemplo a checagem de
permissão de gravação de modelos. Como estamos usando um ACO raíz 
nós precisamos fazer uma pequena modificação na configuração
do nosso  ``AuthComponent``. O ``AuthComponent`` precisa ser 
informado sobre a existência deste nódulo raíz para que então 
quando ele for realizar a checagem do ACL ele use o caminho correto
quando for procurar por controladores/ações. Dentro de ``AppController``
certifique-se de que o array ``$components`` contem a chave  ``actionPath`` definida::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );

Para continuar o tutorial acesse :doc:`part-two`.


.. meta::
    :title lang=pt: Simple Acl controlled Application
    :keywords lang=pt: core libraries,auto increment,object oriented programming,database schema,sql statements,php class,stable release,code generation,database server,server configuration,reins,access control,shells,mvc,authentication,web server,cakephp,servers,checkout,apache
