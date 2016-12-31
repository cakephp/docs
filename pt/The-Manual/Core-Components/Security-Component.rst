O Componente Security
#####################

O componente Security (SecurityComponent) do CakePHP cria uma maneira
fácil de integrar uma segurança mais reforçada à sua aplicação. Uma
interface para gerência de requisições HTTP autenticadas pode ser criada
com o SecurityComponent. Ele é configurado dentro do beforeFilter() de
seus controllers. Este componente possui diversos parâmetros
configuráveis. Todas estas propriedades podem atribuídades diretamente
ou por meio de métodos modificadores com mesmo nome.

Se uma ação for restringida utilizando-se o SecurityComponent, a
requisição é marcada numa lista negra que irá resultar num erro 404 por
padrão. Você pode configurar este comportamento definindo a propriedade
$this->Security->blackHoleCallback para uma função de callback no
controller. Tenha em mente de que a lista negra de todos os métodos do
SecurityComponent serão executadas por este método de callback.

Ao usar o SecurityComponente, você **deve** usar o FormHelper para criar
seus formulários. O SecurityComponente procura por certos indicadores
que são criados e gerenciados pelo FormHelper (especialmente àqueles
criados entre as chamadas create() e end()).

Configuração
============

$blackHoleCallback
    Um callback de controller que irá manipular as requisições que forem
    para a lista negra.
$requirePost
    Uma lista de ações de controller que necessitam de uma requisição
    POST para ocorrer. Um array de acitons de controller ou '\*' para
    forçar todas as requisições a demandarem POST.
$requireSecure
    Lista de ações que necessitam de uma conexão SSL para ocorrer. Um
    array de ações do controller ou '\*' para forçar todas as
    requisições a demandarem uma conexão SSL.
$requireAuth
    Lista de ações que necessitam de uma chave de autenticação válida. A
    chave de validação é definida pelo SecurityComponent.
$requireLogin
    Lista das ações que necessitam de logins de uma sessão
    HTTP-Autenticada (basic ou digest). Também aceita '\*' indicando que
    todas as requisições deste controller demandam autenticação HTTP.
$loginOptions
    Opções para requisições de autenticação HTTP. Permite que você
    defina a autenticação e o callback de controller para o processo de
    autenticação.
$loginUsers
    Um array associativo de usernames => passwords que são usados para
    logins em autenticação HTTP. Se você estiver usando autenticação
    digest, suas senhas devem estar em formato MD5.
$allowedControllers
    Uma lista de controllers cujas ações têm permissão para receber
    requisições. Isto pode ser usado para controlar requisições entre
    controllers cruzados.
$allowedActions
    Ações a partir das quais as ações do controller atual têm permissão
    de receber requisições. Isto pode ser usado para controlar
    requisições entre controllers cruzados.
$disabledFields
    Lista dos campos de formulário que devem ser ignoradas na validação
    POST - o valor, presença ou ausência destes campos de formulário não
    serão levados em conta na avaliação de que a submissão do formulário
    é válida. Especifique os campos como você faria com o
    FormHelper(\ ``Model.fieldname``).

Métodos
=======

requirePost()
-------------

Define as ações que uma requisição POST exige. Pega qualquer número de
argumentos. Pode ser chamada sem argumentos para forçar todas ações
requisitar um POST.

requireSecure()
---------------

Define as ações que exigem uma requisição SSL segunra. Pega qualquer
número de argumentos. Pode ser chamada sem argumentos para forçar todas
ações para requisitar um SSL seguro.

requireAuth()
-------------

Define as ações que exigem um token válido gerado por um componente de
segurança. Pode ser chamado sem argumentos para forçar todas ações para
requisitar uma autenticação válida.

requireLogin()
--------------

Define as ações que exige uma requisição HTTP-Autenticada válida. Pega
qualquer número de argumentos. Pode ser chamada sem argumentos para
forçar todas as ações para requerir uma HTTP-autenticação válida.

loginCredentials(string $type)
------------------------------

Attempt to validate login credentials for a HTTP-authenticated request.
$type is the type of HTTP-Authentication you want to check. Either
'basic', or 'digest'. If left null/empty both will be tried. Returns an
array with login name and password if successful.

loginRequest(array $options)
----------------------------

Generates the text for an HTTP-Authenticate request header from an array
of $options.

$options generally contains a 'type', 'realm' . Type indicate which
HTTP-Authenticate method to use. Realm defaults to the current HTTP
server environment.

parseDigestAuthData(string $digest)
-----------------------------------

Parse an HTTP digest authentication request. Returns and array of digest
data as an associative array if succesful, and null on failure.

generateDigestResponseHash(array $data)
---------------------------------------

Creates a hash that to be compared with an HTTP digest-authenticated
response. $data should be an array created by
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
--------------------------------------------

Black-hole an invalid request with a 404 error or a custom callback.
With no callback, the request will be exited. If a controller callback
is set to SecurityComponent::blackHoleCallback, it will be called and
passed any error information.

Modo de usar
============

A maneira mais comum de se utilizar o componente security é através do
método beforeFilter() do respectivo controller. Você especifica as
restrições de segurança que deseja e o componente Security as aplicará
em sua inicialização.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

Nesse exemplo, a action delete pode ser disparada com sucesso apenas se
receber um POST.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

Esse exemplo força todas as actions que possuem admin routing a requerer
requests seguros através de SSL.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->blackHoleCallback = '_forceSSL';
                $this->Security->requireSecure();
            }
        }

        function _forceSSL() {
            $this->redirect('https://' . env('SERVER_NAME') . $this->here);
        }
    }
    ?>

Esse exemplo força todas as actions que possuem admin routing a requerer
requests seguros via SSL. Quando o request estiver "black holed", o
componente chamará o método callback \_forceSSL() que redirecionará
requests inseguros para requests seguros automaticamente.

Basic HTTP Authentication
=========================

O SecurityComponent tem algumas características de autenticação muito
poderoso. Às vezes pode ser necessário para proteger algumas
funcionalidades dentro de sua aplicação usando\ `HTTP Basic
Authentication <https://en.wikipedia.org/wiki/Basic_access_authentication>`_.
Uma utilização comum para HTTP Auth é proteger um REST ou SOAP API.

Este tipo de autenticação é chamado de base para uma razão. A menos que
você está transferindo informações sobre SSL, credenciais serão
transferidas em texto puro.

Usando o SecurityComponent para autenticação HTTP é fácil. O exemplo de
código a seguir inclui as SecurityComponent e acrescenta algumas linhas
de código dentro do método do controlador beforeFilter.p>

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');

        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MyRealm'
            );
            $this->Security->loginUsers = array(
                'john'=>'johnspassword',
                'jane'=>'janespassword'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            //protected application logic goes here...
        }
    }

The loginOptions property of the SecurityComponent is an associative
array specifying how logins should be handled. You only need to specify
the **type** as **basic** to get going. Specify the **realm** if you
want display a nice message to anyone trying to login or if you have
several authenticated sections (= realms) of your application you want
to keep separate.

The loginUsers property of the SecurityComponent is an associative array
containing users and passwords that should have access to this realm.
The examples here use hard-coded user information, but you'll probably
want to use a model to make your authentication credentials more
manageable.

Finally, requireLogin() tells SecurityComponent that this Controller
requires login. As with requirePost(), above, providing method names
will protect those methods while keeping others open.
