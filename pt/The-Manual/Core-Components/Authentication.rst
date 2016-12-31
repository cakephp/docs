Autenticação
############

O Sistema de autenticação de usuário é uma parte comum de muitas
aplicações web. No CakePHP, existem vários sistemas de autenticação de
usuários, sendo que cada uma oferece diferentes opções. Na sua essência
o componente de autenticação irá verificar se um usuário tem uma conta
com um site. Se o tiver, o componente lhes dará acesso a esse usuário
para o site.

Este componente pode ser combinado com o ACL (Access Control List) para
criar componentes mais complexos em níveis de acesso dentro de um site.
O Componente ACL, por exemplo, poderia permitir-lhe conceder o acesso do
usuário as áreas públicas de um site, enquanto que outro usuário o
acesso à concessão as partes protegidas e administrativas do site.

O AuthComponent pode ser usado para criar o tal sistema de forma fácil e
rápida. Vamos dar uma olhada em como você iria construir um simples
sistema de autenticação.

Como todos os componentes, você usá-lo por 'Auth' para a lista de
componentes no seu controller:

::

    class FooController extends AppController {
        var $components = array('Auth');

Ou adicioná-lo ao seu AppController para que todos os controladores
possa utilizá-lo:

::

    class AppController extends Controller {
        var $components = array('Auth');

Agora, há alguns padrões sobre quando utilizar AuthComponent. Por
padrão, o AuthComponent espera que você tenha uma tabela chamada 'users'
com campos denominados' username' e 'senha' para ser utilizada. *Em
algumas situações, as bases de dados não permitem que você use
'password' como nome de uma coluna, mais tarde, você vai ver como mudar
o padrão campo nomes para trabalhar com o seu próprio ambiente.*

Vamos criar a tabela com os nossos usuários utilizando o seguinte SQL:

::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(40),
        PRIMARY KEY (id)
    );

Algo para segurar na mente ao criar uma tabela para armazenar todos os
seus dados de autenticação do usuário. O AuthComponent espera que a
senha armazenada no banco de dados seja ciptografada ao invés de ser
armazenada como texto puro. Tenha certeza que o campo que você estará
usando para armazenar senhas é grnade o suficiente para armazenar hash
(40 caracteres for SHA1, por exemplo).

Se você quer adicionar um usuário manualmente para o banco de dados - o
método simples de obter os dados corretos é a tentativa de login e olhar
o log sql.log

Para a configuração mais básica, você precisa apenas criar duas actions
na sua controladora:

::

    class UsersController extends AppController {

        var $name = 'Users';    
        var $components = array('Auth'); // Não é necessário se declarado na sua AppController
     
        /**
         *  O AuthComponent disponibiliza as funções necessárias para login,
         *  então você pode deixar essa função em branco.
         */
        function login() {
        }

        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }

Enquanto você deixar a função login() em branco, você precisa criar a
template de visão da action login (salvo em app/views/users/login.ctp).
Isso é a única template de visão da classe UsersController que é
necessária criar. O exemplo abaixo assume que você já esteja usando o
Helper Form:

::

    <?php
        $session->flash('auth');
        echo $form->create('User', array('action' => 'login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>

Essa visão criar um simples formulário de login, onde você informa o
usuário e senha. Mesmo você submetendo esse formulário, o AuthComponent
cuida do resto para você. A mensagem da sessão será mostrada quando
qualquer notificação for gerada pelo AutoComponent.

Acredite ou não, está feito! Essa é a forma de implementar incrivelmente
simples, sistema de autenticação usando o componente Auth. Entretanto,
existe muito mais que podemos fazer. Dê uma olhada em algumas
utilizações avançadas do componente

Setando Variáveis do Auth Component
===================================

Toda vez que você alterar uma opção padrão para o AuthComponent, você
tem quefazer isso através da criação do método beforeFilter no seu
controlador, então chamando vários métodos embarcados ou setar as
variáveis do componente.

Por exemplo, para mudar o nome do campo usado para senhas de 'password'
para 'secretword', você deve fazer o seguinte:

::

    class UsersController extends AppController {
        var $components = array('Auth');

        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

Nesse caso em particular, você deve além disso é necessário lembrar para
mudar o nome do campo na view!

Outro uso comum das variáveis do Auth Component é permitir acesso a
certos métdods sem que o usuário esteja logado.

Por exemplo, se nós queremos permitir que todos os usuários acessem os
métodos index e view (mas não qualquer outro), nós devemos fazer o
seguinte:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }

Mostrando mensagens do Auth Error
=================================

Para exibir as mensagens de erros do Auth, você precisa adicionar o
seguinte código no seu view. Neste caso, a mensagem aparecerá abaixo das
mensagens regulares "flash":

Em ordem para mostrar todas menssagens "flash" normais e as menssagens
"flash auth" para todos os views, adicione as seguintes linhas no seu
seu arquivo /views/layouts/default.ctp na secão body de preferência
antes da linha content\_for\_layout.

::

    <?php
        $session->flash();
        $session->flash('auth');
    ?>

Solucionando problemas do Auth
==============================

Em alguns casos pode ser bastante difícil diagnosticar problemas quando
o mesmo não se comporta como esperado, então aqui existem alguns pontos
para lembrar

*Senha hashing*

Quando enviar informação para uma action através de um form, o Auth
component automaticamente criptografa o conteúdo de seu campo de entrada
senha se você informado algum dado no campo usuário. Então, se você está
tentando criar alguma página de registro, tenha certeza de ter feito o
usuário preencher um campo chamado 'confirmar senha' para que possa
comparar os dois valores. Aqui está um exemplo de código:

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Password Hashing
----------------

The automatic hashing of your password input field happens **only** if
posted data also contains username and password fields

When posting information to an action via a form, the Auth component
automatically hashes the contents of your password input field if posted
data also contains username field. So, if you are trying to create some
sort of registration page, make sure to have the user fill out a
'confirm password' field so that you can compare the two. Here's some
sample code:

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Mudando a função Hash
=====================

O AuthComponent usa a classe Security para criptografar a senha. A
classe Security usa o esquema SHA1 por padrão. Para mudar outra função
hash para ser utilizado pelo componente Auth use o método ``setHash``
passando ``md5``, ``sha1`` ou ``sha256`` como único parâmetro.

::

    Security::setHash('md5'); // ou sha1 ou sha256. 

A classe Security usa um valor forte (setar em /app/config/core.php)
para criptografar a senha.

Se você quer usar uma lógica de hashing diferente para senha além de
md5/sha1, você irá precisar sobrescrever o mecanismo padrão hashPassword
- Você talvez precise fazer isso se por exemplo você tem uma base de
dados existente que anteriormente utilizava um esquema de diferente.
Para fazer isso, criar o método ``hashPasswords`` na classe que você
quer se responsável por criptografar suas senhas (geralmente no modelo
User) e setar ``authenticate`` para o objeto que você está autenticando
(geralmente esse é User) como:

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

Como o código acima, o método hashPasswords() do modelo User será
chamado toda vez que o Cake chamar AuthComponent::hashPasswords().

Métodos do AuthComponent
========================

action
------

``action (string $action = ':controller/:action')``

Se você está utilizando ACO's como parte da estrutura do seu ACL, você
pode recuperar o caminho para o nó ACO para um par controlador
particular controller/action:

::

        $acoNode = $this->Auth->action('users/delete');

Se você não passar qualquer valor, ele usa o valor atual do par
controller / action

allow
-----

Se você tem algumas actions em sua controladora que não precisam ser
autenticada, você pode adicionar métodos ao AuthComponent para que ele
ignore. O exemplo a seguir mostra como permitir uma action chamada
'register'.

::

        $this->Auth->allow('register');

Se você deseja permitir que múltiplas actions ignorem autenticação, você
tem que fornecê-los como parâmetros para o método allow():

::

        $this->Auth->allow('foo', 'bar', 'baz');

Atalho: você talvez precise permitir que todas as actions da sua
controladora, nesse caso utilize '\*'.

::

        $this->Auth->allow('*');

Se você está usando requestAction no seu layout ou elementos, você
precisa permitir que essas actions, a fim de ser capaz de abrir a página
de login corretamente.

O AuthComponent assume que o nome das suas actions `está seguindo as
convenções </pt/view/559/URL-Considerations-for-Controller-Names>`_ e
estão em caixa baixa.

deny
----

Existem algumas vezes onde você quer remover actions da sua lista de
actions permitidas (setar usando $this->Auth->allow()). Aqui está um
exemplo:

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }

        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }

            ...
        }

hashPasswords
-------------

``hashPasswords ($data)``

Esse método checa se a ``$data`` contém os campos username e password
como especificado pela variável ``$fields`` indexada pelo nome de modelo
como especificado por ``$userModel``. Se o array ``$data`` contém o
username e password, ele criptografa o campo password no array e retorna
o array ``data`` no mesmo formato. Essa função deve ser usada antes das
chamadas do usuário para inserir ou alterar.

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        print_r($hashedPasswords);
        /* returns:
        Array
        (
            [User] => Array
            (
                [username] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )

        */

O campo *$hashedPasswords['User']['password']* agora deveria ser
criptografada usando o ``password``, na função do componente.

Se seu controlador usa o AuthComponent e enviou os dados contidos nos
campos como explicado acima, ele irá automaticamente criptografar o
campo password usando essa função.

mapActions
----------

Se você está utilizando o ACL em modo CRUD, você talvez precise atribuir
actions não-padrão para cada parte do CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('algumaAction'),
            'read' => array('algumaAction', 'algumaAction2'),
            'update' => array('algumaAction'),
            'delete' => array('algumaAction')
        )
    );

login
-----

``login($data = null)``

Se você está fazendo algum login baseado em Ajax, você pode usar esse
método para registrar alguém manualmente no sistema. Se você não passar
qualquer valor para ``$data``, ele irá automaticamente usar POST para os
dados passados dentro do controller.

logout
------

Provê uma forma rápida para retirar a autenticação de alguém e
redirecionar para onde ele precisa ir. Esse método também é útil se você
quer prover um link 'Me tire daqui' para membros, dentro de uma área da
sua aplicação

Exemplo:

::

    $this->redirect($this->Auth->logout());

password
--------

``password (string $password)``

Passe uma string, e você recebe a senha criptografada. Isso é uma
funcionalidade essencial se você está criando um usuário numa página
onde você tem usuários que entram com suas senhas uma segunda vez para
confirmá-las.

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {

        // Passwords match, continue processing
        ...
    } else {
        $this->flash('Typed passwords did not match', 'users/register');
    }

O componente Auth irá automaticamente criptografar o campo senha se o
campo username também estiver presente nos dados submetidos.

O Cake junta sua senha a um valor e então criptografa-os. A função de
criptografia usada depende de como está configurardo a classe utilitária
do núcles ``Security`` (sha1 por padrão). Você pode usar o método
``Security::setHash`` para mudar o método de criptografia. O valor usado
para sua aplicação é definido em ``core.php``

user
----

``user(string $key = null)``

Esse método provê informação sobre o usuário autenticado no momento. A
informação é recuperada a partir da sessão. Por exemplo:

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('Você tem acesso de administrador');
    }

Pode ser usado também para retornar a sessão completa do usuário como:

::

    $data['User'] = $this->Auth->user();

Se esse método retornar null, o usuário não está logado na aplicação.

Na view você pode usar o helper Session para obter informações sobre o
usuário autenticado no momento:

::

        
    $session->read('Auth.User'); // retorna o registro completo do usuário
    $session->read('Auth.User.first_name') // retorna o valor de um campo em específico

A chave da sessão pode ser diferente dependendo de qual model o Auth
está configurado para usar. P.ex., se você usasse o model ``Account`` ao
invés de ``User``, então a chave da sessão seria ``Auth.Account``.

Variáveis AuthComponent
=======================

Agora, existem algumas variáveis relacionadas que você pode usar como
bem entender. Geralmente você pode adicionar essas definições na sua
controladora no método beforeFilter(). Ou, se você precisar aplicar como
definições site-wide, você deveria adicionar elas no classe
AppController, no método beforeFilter()

userModel
---------

Não quer utilizar o modelo User para fazer autenticação? Sem problemas,
apenas mude-o setando esse valor para o nome do modelo que você quer
usar.

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>

fields
------

Sobrescreva os campos padrões 'username' e 'password' usados para
autenticação.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>

userScope
---------

Use isso para prover requisitos para autenticação ter sucesso.

::

    <?php
        $this->Auth->userScope = array('User.active' => true);
    ?>

loginAction
-----------

Você pode mudar o login padrão de */users/login* para ser qualquer
action que você escolher.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');
    ?>

loginRedirect
-------------

O AuthComponent lembra qual par controlador/action você estava tentando
obter, para antes fazer sua própria autenticação e armazenar esse valor
na sessão, abaixo a chave ``Auth.redirect``. Entretanto, se esse valor
de sessão não está setado (se você está vindo para a página de login a
partir de um link externo, por exemplo), então o usuário será
redirecionado para a URL especificada no loginRedirect.

Exemplo:

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');
    ?>

logoutRedirect
--------------

Você mesmo pode especificar onde você quer que o usuário vá depois que
ele for desconectado, com o padrão sendo a action login.

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>

loginError
----------

Mude a mensagem padrão de erro mostrada quando algupem não consegue
logar.

::

    <?php
        $this->Auth->loginError = "Não, você errou! A senha não está correta!";
    ?>

authError
---------

Mude a mensagem de erro padrão quando alguém tenta acessar um objeto ou
action que ele não tenha acesso.

::

    <?php
        $this->Auth->authError = "Desculpe, você está sem acesso!";
    ?>

autoRedirect
------------

Normalmente, o AuthComponent automaticamente redireciona você logo que
você é autenticado. Algumas vezes você quer fazer alguma validação a
mais antes de redirecionar o usuário:

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }

        ...

        function login() {
        //-- código dentro  dessa função irá executar apenas quando autoRedirect estiver setado como false.
            if ($this->Auth->user()) {
                if (!empty($this->data)) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Limpa a mensagem auth, apenas nesse caso usamos ela.
                        $this->Session->del('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>

O código na função de login não irá executar *a menos que* você marque
$autoRedirect para falso em beforeFilter. O código presente na função de
login apenas executa *depois* que a autenticação foi tentada. Esse é o
melhor lugar para determinar se o login ocorreu com sucesso ou não pelo
AuthComponent (você pode querer logar o último acesso com sucesso do
login, etc).

authorize
---------

Normalmente, o AuthComponent tentará verificar se as credenciais de
login que você digitou são precisas, comparando-os com as quais estão
armazenadas no seu modelo User. Entretanto, existem vezes em que você
quer fazer um trabalho adicional na determinação correta das
credenciais. Para setar essa variável para um dos vários valores
diferentes, você pode fazer diferentes coisas. Aqui são algumas das mais
comuns que você pode querer utilizar.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>

Quando authorize é setado para 'controller', você vai precisar adicionar
um método chamado isAuthorized() para seu controlador. Esse método
permite você fazer mais algumas verificações de autenticação e então
retornar true ou false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } else {
                    return false;
                }
            }

            return true;
        }
    ?>

Lembre que esse método será checado depois que você tenha passado pela
autenticação básica do modelo user.

::

    <?php
        $this->Auth->authorize = 'model';
    ?>

Não quero adicionar nada ao seu controlador e pode estar usando ACO's?
Você pode obter o AuthComponent chamar um método no seu modelo user,
chamando isAuthorized() para fazer o mesmo tipo de coisa:

::

    <?php
        class User extends AppModel {
            ...

            function isAuthorized($user, $controller, $action) {

                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>

Finalmente, você pode usar autorização como nas actions a seguir:

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>

Ao utilizar actions, Auth fará uso da ACL e checar com
AclComponent::check(). A função isAuthorized não é necessária.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>

Ao utilizar crud, Auth fará o uso de ACL e checar com
AclComponent::check(). Actions devem ser mapeadas para CRUS (veja
`mapActions </pt/view/813/mapActions>`_).

sessionKey
----------

Nome da chave do array de sessão onde o registro do atual usuário
autorizado está armazenado

Padrão para "Auth", se não especificado, o registro é armazenado em
"Auth.{$userModel name}".

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>

ajaxLogin
---------

Se você está fazendo uso de Ajax ou Javascript baseado em requisições
que requerem sessões autenticadas, marque essa variável para o nome da
view que você gostaria que fosse renderizada e retornada quando você tem
uma inválida ou sessão expirada.

Como qualquer parte do CakePHP, As with any part of CakePHP,
certifique-se de dar uma olhada na `classe do
AuthComponent <https://api.cakephp.org/class/auth-component>`_ para mais
informações sobre este componente.

authenticate
------------

Essa variável possui uma referência para o objeto responsável por
criptografar senhas se ela é necessária para mudar/sobrescrever o
mecanismo de criptografia de senha padrão. Veja `Mudando o Tipo de
Criptografia </pt/view/566/Changing-Encryption-Type>`_ para mais
informações.

actionPath
----------

Se for utilizar um controle de acesso baseado em actions, esta variável
define como os caminhos para a ação são determinados a partir dos nós
ACO. Se, por exemplo, todos os nós dos controllers estiverem aninhados
dentro de um nó ACO chamado 'Controllers', então $actionPath deverá ser
definida para 'Controllers/'.

5.2.6.15 flashElement
---------------------

No caso de você querer ter outro layout para a sua mensagem de erro de
Autenticação você pode definir a variável flashElement que outro
elemento será usados para mostrar.

::

    <?php
        $this->Auth->flashElement = "message_error";
    ?>

allowedActions
==============

Set the default allowed actions to allow if setting the component to
'authorize' => 'controller'

::

    var $components = array(
      'Auth' => array(
        'authorize' => 'controller',
        'allowedActions' => array('index','view','display');
      )
    );

index, view, and display actions are now allowed by default.
