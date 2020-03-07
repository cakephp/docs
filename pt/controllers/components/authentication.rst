AuthComponent
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Identificar, autenticar e autorizar usuários é uma parte comum de 
quase todos os aplicativos da web. No CakePHP, o AuthComponent fornece 
uma maneira conectável de executar essas tarefas. AuthComponent permite 
combinar objetos de autenticação e objetos de autorização para criar maneiras 
flexíveis de identificar e verificar a autorização do usuário.

.. deprecated:: 4.0.0
    O AuthComponent está obsoleto a partir da versão 4.0.0 e será 
    substituído pelos plugins `authorization <https://book.cakephp.org/authorization/>`__ e `authentication <https://book.cakephp.org/authentication/>`__ .

.. _authentication-objects:

Sugestão de Leitura Antes de Continuar
======================================

A configuração da autenticação requer várias etapas, incluindo a definição de uma 
tabela de usuários, a criação de um modelo, controlador e visualizações, etc.

Tudo isso é abordado passo a passo em :doc:`CMS Tutorial </tutorials-and-examples/cms/authentication>`.

Se você está procurando soluções de autenticação e/ou autorização existentes para o CakePHP, 
consulte a seção `Authentication and Authorization <https://github.com/FriendsOfCake/awesome-cakephp/blob/master/README.md#authentication-and-authorization>`_ da lista Awesome CakePHP.

Autenticação
============

Autenticação é o processo de identificar usuários pelas credenciais fornecidas 
e garantir que os usuários sejam quem eles dizem que são. Geralmente, isso é 
feito através de um nome de usuário e senha, que são verificados em uma lista 
conhecida de usuários. No CakePHP, existem várias maneiras internas de autenticar 
usuários armazenados no seu aplicativo.

* ``FormAuthenticate`` permite autenticar usuários com base nos dados do formulário POST. 
  Geralmente, este é um formulário de login no qual os usuários inserem informações.
* ``BasicAuthenticate`` permite autenticar usuários usando a autenticação HTTP básica.
* ``DigestAuthenticate`` permite autenticar usuários usando o Digest
   Autenticação HTTP.

Por padrão, ``AuthComponent`` usa ``FormAuthenticate``.

Escolhendo um Tipo de Autenticação
----------------------------------

Geralmente, você deseja oferecer autenticação baseada em formulário. É o mais fácil para os 
usuários que usam um navegador da web. Se você estiver criando uma API ou serviço da web, 
convém considerar a autenticação básica ou digerir a autenticação. As principais diferenças 
entre Digest e autenticação básica estão relacionadas principalmente à maneira como as senhas 
são tratadas. Na autenticação básica, o nome de usuário e a senha são transmitidos como texto 
sem formatação para o servidor. Isso torna a autenticação básica inadequada para aplicativos 
sem SSL, pois você acabaria expondo senhas confidenciais. A autenticação Digest usa um hash de 
resumo do nome de usuário, senha e alguns outros detalhes. Isso torna a autenticação Digest mais 
apropriada para aplicativos sem criptografia SSL.

Você também pode usar sistemas de autenticação como o OpenID também; no entanto, o OpenID 
não faz parte do núcleo do CakePHP.

Configurando Manipuladores de Autenticação
------------------------------------------

Você configura manipuladores de autenticação usando a configuração ``authenticate``. 
Você pode configurar um ou muitos manipuladores para autenticação. O uso de vários manipuladores 
permite oferecer suporte a diferentes maneiras de efetuar logon nos usuários. Ao efetuar logon 
nos usuários, os manipuladores de autenticação são verificados na ordem em que são declarados. 
Quando um manipulador conseguir identificar o usuário, nenhum outro manipulador será verificado. 
Por outro lado, você pode interromper toda a autenticação lançando uma exceção. Você precisará 
capturar todas as exceções lançadas e manipulá-las conforme necessário.

Você pode configurar manipuladores de autenticação nos métodos ``beforeFilter()`` ou 
``initialize()`` do seu controlador. Você pode passar informações de configuração para 
cada objeto de autenticação usando uma matriz::

    // Configuração simples
    $this->Auth->setConfig('authenticate', ['Form']);

    // Passando as configurações
    $this->Auth->setConfig('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

No segundo exemplo, você notará que tivemos que declarar a chave 
``userModel`` duas vezes. Para ajudá-lo a manter seu código DRY, você pode usar a 
chave ``all``. Essa chave especial permite definir configurações que são passadas 
para todos os objetos anexados. A chave ``all`` também é exposta como ``AuthComponent::ALL``::

    // Passando configurações usando 'all'
    $this->Auth->setConfig('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

No exemplo acima, ``Form`` e ``Basic`` obterão as configurações
definido para a chave 'all'. Quaisquer configurações passadas para 
um objeto de autenticação específico substituirão a chave correspondente 
na chave 'all'. Os objetos de autenticação principal suportam as seguintes 
chaves de configuração.

- ``fields`` Os campos a serem usados para identificar um usuário. Você pode usar as chaves 
  ``username`` e ``password`` para especificar seus campos de nome de usuário e senha, respectivamente.
- ``userModel`` O nome do modelo da tabela users; o padrão é Users.
- ``finder``O método finder a ser usado para buscar um registro do usuário. O padrão é 'all'.
- ``passwordHasher`` Classe de hasher de senha; O padrão é ``Default``.

Para configurar campos diferentes para o usuário no seu método ``initialize()``::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email', 'password' => 'passwd']
                ]
            ]
        ]);
    }

Não coloque outras chaves de configuração ``Auth``, como ``authError``, ``loginAction``, etc., 
dentro do elemento ``authenticate`` ou ``Form``. Eles devem estar no mesmo nível da chave de 
autenticação. A configuração acima com outro exemplo de configuração para autenticação deve 
se parecer com::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authError' => 'Did you really think you are allowed to see that?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ],
            'storage' => 'Session'
        ]);
    }

Além da configuração comum, a autenticação básica suporta as seguintes chaves:

- ``realm`` O domínio a ser autenticado. O padrão é ``env('SERVER_NAME')``.

Além da configuração comum, a autenticação Digest suporta as seguintes 
chaves:

- ``realm`` Para autenticação de domínio. O padrão é o nome do servidor.
- ``nonce`` Um nonce usado para autenticação. O padrão é ``uniqid()``.
- ``qop`` O padrão é auth; nenhum outro valor é suportado no momento.
- ``opaque`` Uma sequência que deve ser retornada inalterada pelos clientes. O padrão é ``md5($config['realm']))``.

.. note::
    Para encontrar o registro do usuário, o banco de dados é consultado apenas 
    usando o nome de usuário. A verificação da senha é feita em PHP. Isso é necessário 
    porque algoritmos de hash como bcrypt (que é usado por padrão) geram um novo hash a 
    cada vez, mesmo para a mesma string e você não pode simplesmente fazer uma comparação 
    simples de strings no SQL para verificar se a senha corresponde.

Personalizando a Consulta de Localização
----------------------------------------

Você pode personalizar a consulta usada para buscar o registro do usuário usando a opção 
``finder`` na opção de autenticação da classe::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth'
                ]
            ],
        ]);
    }

Isso exigirá que seu ``UsersTable`` tenha o método localizador ``findAuth()``. 
No exemplo mostrado abaixo, a consulta é modificada para buscar apenas os campos 
obrigatórios e adicionar uma condição. Você deve garantir que você selecione os 
campos necessários para autenticar um usuário, como ``username`` e ``password``::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

Identificando Usuários e Efetuando Login
----------------------------------------

.. php:method:: identify()

Você precisa chamar manualmente ``$this->Auth->identity()`` para 
identificar o usuário usando as credenciais fornecidas na solicitação. 
Em seguida, use ``$this->Auth->setUser()`` para conectar o usuário, 
ou seja, salve as informações do usuário na sessão.

Ao autenticar usuários, os objetos de autenticação anexados são verificados 
na ordem em que estão. Depois que um dos objetos pode identificar o 
usuário, nenhum outro objeto é verificado. Uma função de login como exemplo para 
trabalhar com um formulário de login pode se parecer com::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__('Username or password is incorrect'));
            }
        }
    }

O código acima tentará primeiro identificar um usuário usando os dados do POST. 
Se for bem-sucedido, definimos as informações do usuário para a sessão, para que 
elas persistam nas solicitações e, em seguida, redirecionamos para a última página 
que eles estavam visitando ou para uma URL especificada na configuração ``loginRedirect``. 
Se o logon não for bem-sucedido, uma mensagem flash será definida.

.. warning::

    ``$this->Auth->setUser($data)`` registrará o usuário com todos os dados 
    passados para o método. Na verdade, ele não verifica as credenciais em 
    uma classe de autenticação.

Redirecionando Usuários após o Login
------------------------------------

.. php:method:: redirectUrl

Depois de fazer o login de um usuário, você geralmente desejará redirecioná-lo 
de volta para onde eles vieram. Passe um URL para definir o destino ao qual um 
usuário deve ser redirecionado após o login.

Se nenhum parâmetro for passado, a URL retornada usará as seguintes regras:

- Retorna a URL normalizada do valor da string de consulta ``redirect``, 
  se estiver presente e no mesmo domínio em que o aplicativo atual estiver sendo executado.
- Se não houver um valor de string/sessão de consulta e houver uma configuração com 
  ``loginRedirect``, o valor ``loginRedirect`` será retornado.
- Se não houver valor de redirecionamento e nenhum ``loginRedirect``, ``/`` será retornado.

Criando Sistemas de Autenticação sem Estado
-------------------------------------------

Basic e Digest são esquemas de autenticação sem estado e não requerem um POST 
ou um formulário inicial. Se você estiver usando apenas autenticadores basic/digest, 
não precisará de uma ação de login no seu controlador. A autenticação sem estado 
verificará novamente as credenciais do usuário em cada solicitação, isso cria uma 
pequena quantidade de sobrecarga adicional, mas permite que os clientes efetuem login 
sem usar cookies e torna o AuthComponent mais adequado para a criação de APIs.

Para autenticadores sem estado, a configuração `` storage`` deve ser definida como 
``Memory`` para que o AuthComponent não use uma sessão para armazenar o registro do 
usuário. Você também pode querer configurar config ``unauthorizedRedirect`` para 
``false``, para que AuthComponent gere uma ``ForbiddenException`` em vez do comportamento 
padrão de redirecionar para o referenciador.

A opção ``unauthorizedRedirect`` se aplica apenas a usuários autenticados. Quando um usuário 
ainda não está autenticado e você não deseja que ele seja redirecionado, será necessário 
carregar um ou mais autenticadores sem estado, como ``Basic`` ou ``Digest``.

Objetos de autenticação podem implementar um método ``getUser()`` que pode ser usado para 
oferecer suporte a sistemas de login de usuário que não dependem de cookies. Um método 
getUser típico examina a solicitação/ambiente e usa as informações para confirmar a 
identidade do usuário. A autenticação HTTP Basic, por exemplo, usa ``$_SERVER['PHP_AUTH_USER']`` 
e ``$_SERVER['PHP_AUTH_PW']`` para os campos de nome de usuário e senha.

.. note::

    Caso a autenticação não funcione como o esperado, verifique se as consultas são executadas 
    (consulte ``BaseAuthenticate::_query($username)``). Caso nenhuma consulta seja executada, 
    verifique se ``$_SERVER['PHP_AUTH_USER']`` e ``$_SERVER['PHP_AUTH_PW']`` são preenchidos 
    pelo servidor web. Se você estiver usando o Apache com FastCGI-PHP, poderá ser necessário 
    adicionar esta linha ao seu arquivo **.htaccess** no webroot::

        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

Em cada solicitação, esses valores, ``PHP_AUTH_USER`` e ``PHP_AUTH_PW``, são usados 
para identificar novamente o usuário e garantir que ele seja o usuário válido. Assim 
como no método ``authenticate()`` do objeto de autenticação, o método ``getUser()`` 
deve retornar uma matriz de informações do usuário sobre o sucesso ou ``false`` em 
caso de falha. ::

    public function getUser(ServerRequest $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

A seguir, é apresentado como você pode implementar o método getUser para 
autenticação HTTP básica. O método ``_findUser()`` faz parte de ``BaseAuthenticate`` 
e identifica um usuário com base em um nome de usuário e senha.

.. _basic-authentication:

Usando Autenticação Básica
--------------------------

A autenticação básica permite criar uma autenticação sem estado que pode 
ser usada em aplicativos de intranet ou em cenários simples da API. As 
credenciais de autenticação básica serão verificadas novamente em cada solicitação.

.. warning::
    A autenticação básica transmite credenciais em texto sem formatação. 
    Você deve usar HTTPS ao usar a autenticação básica.

Para usar a autenticação básica, você precisará configurar o AuthComponent::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Basic' => [
                'fields' => ['username' => 'username', 'password' => 'api_key'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Aqui, usamos o nome de usuário + chave da API como nossos campos e usamos o modelo Usuários.

Criando Chaves de API para Autenticação Básica
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como o HTTP básico envia credenciais em texto sem formatação, não é aconselhável 
que os usuários enviem sua senha de login. Em vez disso, geralmente é usada uma 
chave de API. Você pode gerar esses tokens de API aleatoriamente usando bibliotecas 
do CakePHP::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\EventInterface;
    use Cake\ORM\Table;
    use Cake\Utility\Security;

    class UsersTable extends Table
    {
        public function beforeSave(EventInterface $event)
        {
            $entity = $event->getData('entity');

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // Gera uma API 'token'
                $entity->api_key_plain = Security::hash(Security::randomBytes(32), 'sha256', false);

                // Criptografe o token para que BasicAuthenticate 
                // possa verificá-lo durante o login.
                $entity->api_key = $hasher->hash($entity->api_key_plain);
            }
            return true;
        }
    }

O exemplo acima gera um hash aleatório para cada usuário conforme eles são salvos. 
O código acima assume que você tem duas colunas ``api_key`` - para armazenar a chave 
da API hash e ``api_key_plain`` - para a versão em texto sem formatação da chave da 
API, para que possamos exibi-la ao usuário posteriormente. Usar uma chave em vez de 
uma senha significa que, mesmo em HTTP simples, seus usuários podem usar um token simples 
em vez da senha original. Também é aconselhável incluir lógica que permita que as chaves 
da API sejam regeneradas a pedido de um usuário.

Usando Autenticação Digest
--------------------------

A autenticação Digest oferece um modelo de segurança aprimorado em relação à 
autenticação básica, pois as credenciais do usuário nunca são enviadas no cabeçalho 
da solicitação. Em vez disso, um hash é enviado.

Para usar a autenticação Digest, você precisará configurar o ``AuthComponent``::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Digest' => [
                'fields' => ['username' => 'username', 'password' => 'digest_hash'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Aqui, estamos usando o nome de usuário + digest_hash como nossos campos e também
usamos o modelo Users.

Hashing de Senhas para Autenticação Digest
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como a autenticação Digest requer um hash de senha no formato definido pelo 
RFC, para hash corretamente uma senha para uso com a autenticação Digest, 
você deve usar a função de hash de senha especial em ``DigestAuthenticate``. 
Se você combinar a autenticação digest com outras estratégias de autenticação, 
também é recomendável que você armazene a senha digest em uma coluna separada, 
a partir do hash da senha normal::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\EventInterface;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(EventInterface $event)
        {
            $entity = $event->getData('entity');

            // Fazendo a senha para autenticação digest
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

As senhas para autenticação Digest precisam de um pouco mais de informações do 
que outros hashes de senha, com base no RFC para autenticação Digest.

.. note::

    O terceiro parâmetro de ``DigestAuthenticate::password()`` deve 
    corresponder ao valor de configuração 'realm' definido quando 
    DigestAuthentication foi configurado em ``AuthComponent::$authenticate``. 
    O padrão é ``env('SCRIPT_NAME')``. Você pode usar uma string estática se 
    desejar hashes consistentes em vários ambientes.

Criando Objetos de Autenticação Personalizados
----------------------------------------------

Como os objetos de autenticação são conectáveis, você pode criar objetos 
de autenticação personalizados em seu aplicativo ou plug-in. Se, por exemplo,
você desejasse criar um objeto de autenticação OpenID. Em **src/Auth/OpenidAuthenticate.php**, 
você pode colocar o seguinte::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(ServerRequest $request, Response $response)
        {
            // Faça coisas para o OpenID aqui. 
            // Retorne uma matriz do usuário se eles puderem autenticar o usuário, 
            // retorne false se não.
        }
    }

Os objetos de autenticação devem retornar ``false`` se não puderem identificar 
o usuário e uma matriz de informações do usuário, se puderem. Não é necessário 
que você estenda ``BaseAuthenticate``, apenas que seu objeto de autenticação 
implemente ``Cake\Event\EventListenerInterface``. A classe ``BaseAuthenticate`` 
fornece vários métodos úteis que são comumente usados. Você também pode implementar 
um método ``getUser()`` se o seu objeto de autenticação precisar suportar 
autenticação sem estado ou sem cookie. Consulte as seções sobre autenticação 
básica e digest abaixo para obter mais informações.

``AuthComponent`` dispara dois eventos, ``Auth.afterIdentify`` e ``Auth.logout``, 
depois que um usuário é identificado e antes que o usuário seja desconectado, 
respectivamente. Você pode definir funções de retorno de chamada para esses eventos 
retornando uma matriz de mapeamento do método ``managedEvents()`` da sua classe de 
autenticação::

    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterIdentify',
            'Auth.logout' => 'logout'
        ];
    }

Usando Objetos de Autenticação Personalizados
---------------------------------------------

Depois de criar seus objetos de autenticação personalizados, você pode usá-los 
incluindo-os na matriz de autenticação do ``AuthComponent``::

    $this->Auth->setConfig('authenticate', [
        'Openid', // app authentication object.
        'AuthBag.Openid', // plugin authentication object.
    ]);

.. note::
    Observe que, ao usar notação simples, não há palavra 'Authenticate' ao iniciar o 
    objeto de autenticação. Em vez disso, se você estiver usando namespace, precisará
    definir o namespace completo da classe, incluindo a palavra 'Authenticate'.

Manipulando Solicitações Não Autenticadas
-----------------------------------------

Quando um usuário não autenticado tenta acessar uma página protegida primeiro, 
o método ``unauthenticated()`` do último autenticador da cadeia é chamado. 
O objeto de autenticação pode lidar com o envio de resposta ou redirecionamento 
retornando um objeto de resposta para indicar que nenhuma ação adicional é necessária. 
Devido a isso, é importante a ordem na qual você especifica o provedor de autenticação
na configuração ``authenticate``.

Se o autenticador retornar nulo, ``AuthComponent`` redirecionará o usuário para a 
ação de login. Se for uma solicitação AJAX e a configuração ``ajaxLogin`` for 
especificada, esse elemento será renderizado, caso contrário, um código de status 
HTTP 403 será retornado.

Exibindo Mensagens Flash Relacionadas à Autenticação
----------------------------------------------------

Para exibir as mensagens de erro da sessão que o Auth gera, você precisa 
adicionar o seguinte código ao seu layout. Adicione as duas linhas a seguir 
ao arquivo **templates/Layout/default.php** na seção body::

    echo $this->Flash->render();

Você pode personalizar as mensagens de erro e as configurações do flash que o 
``AuthComponent`` usa. Usando a configuração ``flash``, você pode configurar 
os parâmetros que o ``AuthComponent`` usa para definir mensagens em flash. 
As chaves disponíveis são

- ``key`` - A chave a ser usada é padronizada como 'default'.
- ``element`` - O nome do elemento a ser usado para renderização, o padrão é null.
- ``params`` - A matriz de parâmetros adicionais a serem usados, o padrão é ``[] ``.

Além das configurações de mensagens flash, você pode personalizar outras 
mensagens de erro que o ``AuthComponent`` usa. Nas configurações ``beforeFilter()``
do seu controlador ou componente, você pode usar ``authError`` para personalizar 
o erro usado quando a autorização falha::

    $this->Auth->setConfig('authError', "Woopsie, you are not authorized to access this area.");

Às vezes, você deseja exibir o erro de autorização somente após o usuário já estar conectado. 
Você pode suprimir esta mensagem definindo seu valor como booleano ``false``.

Nas configurações ``beforeFilter()`` ou no componente do seu controlador::

    if (!$this->Auth->user()) {
        $this->Auth->setConfig('authError', false);
    }

.. _hashing-passwords:

Hashing de Senhas
-----------------

Você é responsável por fazer o hash das senhas antes que elas persistam no 
banco de dados, a maneira mais fácil é usar uma função setter na sua entidade 
User::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
              return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

``AuthComponent`` is configured by default to use the ``DefaultPasswordHasher``
when validating user credentials so no additional configuration is required in
order to authenticate users.

``AuthComponent`` é configurado por padrão para usar o `` DefaultPasswordHasher`` ao validar credenciais do usuário, portanto, nenhuma configuração adicional é necessária para autenticar usuários.

``DefaultPasswordHasher`` uses the bcrypt hashing algorithm internally, which
is one of the stronger password hashing solutions used in the industry. While it
is recommended that you use this password hasher class, the case may be that you
are managing a database of users whose password was hashed differently.

Creating Custom Password Hasher Classes
---------------------------------------

In order to use a different password hasher, you need to create the class in
**src/Auth/LegacyPasswordHasher.php** and implement the
``hash()`` and ``check()`` methods. This class needs to extend the
``AbstractPasswordHasher`` class::

    namespace App\Auth;

    use Cake\Auth\AbstractPasswordHasher;

    class LegacyPasswordHasher extends AbstractPasswordHasher
    {

        public function hash($password)
        {
            return sha1($password);
        }

        public function check($password, $hashedPassword)
        {
            return sha1($password) === $hashedPassword;
        }
    }

Then you are required to configure the ``AuthComponent`` to use your own password
hasher::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Legacy',
                    ]
                ]
            ]
        ]);
    }

Supporting legacy systems is a good idea, but it is even better to keep your
database with the latest security advancements. The following section will
explain how to migrate from one hashing algorithm to CakePHP's default.

Changing Hashing Algorithms
---------------------------

CakePHP provides a clean way to migrate your users' passwords from one algorithm
to another, this is achieved through the ``FallbackPasswordHasher`` class.
Assuming you are migrating your app from CakePHP 2.x which uses ``sha1`` password hashes, you
can configure the ``AuthComponent`` as follows::

    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    }

The first name appearing in the ``hashers`` key indicates which of the classes
is the preferred one, but it will fallback to the others in the list if the
check was unsuccessful.

When using the ``WeakPasswordHasher`` you will need to
set the ``Security.salt`` configure the value to ensure passwords are salted.

In order to update old users' passwords on the fly, you can change the login
function accordingly::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                if ($this->Auth->authenticationProvider()->needsPasswordRehash()) {
                    $user = $this->Users->get($this->Auth->user('id'));
                    $user->password = $this->request->getData('password');
                    $this->Users->save($user);
                }
                return $this->redirect($this->Auth->redirectUrl());
            }
            ...
        }
    }

As you can see we are just setting the plain password again so the setter
function in the entity will hash the password as shown in the previous example and
then save the entity.

Manually Logging Users In
-------------------------

.. php:method:: setUser(array $user)

Sometimes the need arises where you need to manually log a user in, such
as just after they registered for your application. You can do this by
calling ``$this->Auth->setUser()`` with the user data you want to 'login'::

    public function register()
    {
        $user = $this->Users->newEntity($this->request->getData());
        if ($this->Users->save($user)) {
            $this->Auth->setUser($user->toArray());
            return $this->redirect([
                'controller' => 'Users',
                'action' => 'home'
            ]);
        }
    }

.. warning::

    Be sure to manually add the new User id to the array passed to the ``setUser()``
    method. Otherwise, you won't have the user id available.

Accessing the Logged In User
----------------------------

.. php:method:: user($key = null)

Once a user is logged in, you will often need some particular
information about the current user. You can access the currently logged
in user using ``AuthComponent::user()``::

    // From inside a controller or other component.
    $this->Auth->user('id');

If the current user is not logged in or the key doesn't exist, null will
be returned.

Logging Users Out
-----------------

.. php:method:: logout()

Eventually, you'll want a quick way to de-authenticate someone and
redirect them to where they need to go. This method is also useful if
you want to provide a 'Log me out' link inside a members' area of your
application::

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

Logging out users that logged in with Digest or Basic auth is difficult
to accomplish for all clients. Most browsers will retain credentials
for the duration they are still open. Some clients can be forced to
logout by sending a 401 status code. Changing the authentication realm
is another solution that works for some clients.

Deciding When to run Authentication
-----------------------------------

In some cases you may want to use ``$this->Auth->user()`` in the
``beforeFilter()`` method. This is achievable by using the
``checkAuthIn`` config key. The following changes which event for which initial
authentication checks should be done::

    //Set up AuthComponent to authenticate in initialize()
    $this->Auth->setConfig('checkAuthIn', 'Controller.initialize');

Default value for ``checkAuthIn`` is ``'Controller.startup'`` - but by using
``'Controller.initialize'`` initial authentication is done before ``beforeFilter()``
method.

.. _authorization-objects:

Authorization
=============

Authorization is the process of ensuring that an
identified/authenticated user is allowed to access the resources they
are requesting. If enabled ``AuthComponent`` can automatically check
authorization handlers and ensure that logged in users are allowed to
access the resources they are requesting. There are several built-in
authorization handlers and you can create custom ones for your
application or as part of a plugin.

- ``ControllerAuthorize`` Calls ``isAuthorized()`` on the active controller,
  and uses the return of that to authorize a user. This is often the most
  simple way to authorize users.

.. note::

    The ``ActionsAuthorize`` & ``CrudAuthorize`` adapter available in CakePHP
    2.x have now been moved to a separate plugin `cakephp/acl <https://github.com/cakephp/acl>`_.

Configuring Authorization Handlers
----------------------------------

You configure authorization handlers using the ``authorize`` config key.
You can configure one or many handlers for authorization. Using
multiple handlers allows you to support different ways of checking
authorization. When authorization handlers are checked, they will be
called in the order they are declared. Handlers should return ``false``, if
they are unable to check authorization, or the check has failed.
Handlers should return ``true`` if they were able to check authorization
successfully. Handlers will be called in sequence until one passes. If
all checks fail, the user will be redirected to the page they came from.
Additionally, you can halt all authorization by throwing an exception.
You will need to catch any thrown exceptions and handle them.

You can configure authorization handlers in your controller's
``beforeFilter()`` or ``initialize()`` methods. You can pass
configuration information into each authorization object, using an
array::

    // Basic setup
    $this->Auth->setConfig('authorize', ['Controller']);

    // Pass settings in
    $this->Auth->setConfig('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Much like ``authenticate``, ``authorize``, helps you
keep your code DRY, by using the ``all`` key. This special key allows you
to set settings that are passed to every attached object. The ``all`` key
is also exposed as ``AuthComponent::ALL``::

    // Pass settings in using 'all'
    $this->Auth->setConfig('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

In the above example, both the ``Actions`` and ``Controller`` will get the
settings defined for the 'all' key. Any settings passed to a specific
authorization object will override the matching key in the 'all' key.

If an authenticated user tries to go to a URL he's not authorized to access,
he's redirected back to the referrer. If you do not want such redirection
(mostly needed when using stateless authentication adapter) you can set config
option ``unauthorizedRedirect`` to ``false``. This causes ``AuthComponent``
to throw a ``ForbiddenException`` instead of redirecting.

Creating Custom Authorize Objects
---------------------------------

Because authorize objects are pluggable, you can create custom authorize
objects in your application or plugins. If for example, you wanted to
create an LDAP authorize object. In
**src/Auth/LdapAuthorize.php** you could put the
following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Http\ServerRequest;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, ServerRequest $request)
        {
            // Do things for ldap here.
        }
    }

Authorize objects should return ``false`` if the user is denied access, or
if the object is unable to perform a check. If the object is able to
verify the user's access, ``true`` should be returned. It's not required
that you extend ``BaseAuthorize``, only that your authorize object
implements an ``authorize()`` method. The ``BaseAuthorize`` class provides
a number of helpful methods that are commonly used.

Using Custom Authorize Objects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once you've created your custom authorize object, you can use them by
including them in your ``AuthComponent``'s authorize array::

    $this->Auth->setConfig('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Using No Authorization
----------------------

If you'd like to not use any of the built-in authorization objects and
want to handle things entirely outside of ``AuthComponent``, you can set
``$this->Auth->setConfig('authorize', false);``. By default ``AuthComponent``
starts off with ``authorize`` set to ``false``. If you don't use an
authorization scheme, make sure to check authorization yourself in your
controller's ``beforeFilter()`` or with another component.

Making Actions Public
---------------------

.. php:method:: allow($actions = null)

There are often times controller actions that you wish to remain
entirely public or that don't require users to be logged in.
``AuthComponent`` is pessimistic and defaults to denying access. You can
mark actions as public actions by using ``AuthComponent::allow()``. By
marking actions as public, ``AuthComponent`` will not check for a logged in
user nor will authorize objects to be checked::

    // Allow all actions
    $this->Auth->allow();

    // Allow only the index action.
    $this->Auth->allow('index');

    // Allow only the view and index actions.
    $this->Auth->allow(['view', 'index']);

By calling it empty you allow all actions to be public.
For a single action, you can provide the action name as a string. Otherwise, use an array.

.. note::

    You should not add the "login" action of your ``UsersController`` to allow list.
    Doing so would cause problems with the normal functioning of ``AuthComponent``.

Making Actions Require Authorization
------------------------------------

.. php:method:: deny($actions = null)

By default all actions require authorization. However, after making actions
public you want to revoke the public access. You can do so using
``AuthComponent::deny()``::

    // Deny all actions.
    $this->Auth->deny();

    // Deny one action
    $this->Auth->deny('add');

    // Deny a group of actions.
    $this->Auth->deny(['add', 'edit']);

By calling it empty you deny all actions.
For a single action, you can provide the action name as a string. Otherwise, use an array.

Using ControllerAuthorize
-------------------------

ControllerAuthorize allows you to handle authorization checks in a
controller callback. This is ideal when you have very simple
authorization or you need to use a combination of models and components
to do your authorization and don't want to create a custom authorize
object.

The callback is always called ``isAuthorized()`` and it should return a
boolean as to whether or not the user is allowed to access resources in
the request. The callback is passed the active user so it can be
checked::

    class AppController extends Controller
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // Any registered user can access public functions
            if (!$this->request->getParam('prefix')) {
                return true;
            }

            // Only admins can access admin functions
            if ($this->request->getParam('prefix') === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // Default deny
            return false;
        }
    }

The above callback would provide a very simple authorization system
where only users with role = admin could access actions that were in
the admin prefix.

Configuration options
=====================

The following settings can all be defined either in your controller's
``initialize()`` method or using ``$this->Auth->setConfig()`` in your ``beforeFilter()``:

ajaxLogin
    The name of an optional view element to render when an AJAX request is made
    with an invalid or expired session.
allowedActions
    Controller actions for which user validation is not required.
authenticate
    Set to an array of Authentication objects you want to use when
    logging users in. There are several core authentication objects;
    see the section on :ref:`authentication-objects`.
authError
    Error to display when user attempts to access an object or action to which
    they do not have access.

    You can suppress authError message from being displayed by setting this
    value to boolean ``false``.
authorize
    Set to an array of Authorization objects you want to use when
    authorizing users on each request; see the section on
    :ref:`authorization-objects`.
flash
    Settings to use when Auth needs to do a flash message with
    ``FlashComponent::set()``.
    Available keys are:

    - ``element`` - The element to use; defaults to 'default'.
    - ``key`` - The key to use; defaults to 'auth'.
    - ``params`` - The array of additional parameters to use; defaults to '[]'.

loginAction
    A URL (defined as a string or array) to the controller action that handles
    logins. Defaults to ``/users/login``.
loginRedirect
    The URL (defined as a string or array) to the controller action users
    should be redirected to after logging in. This value will be ignored if the
    user has an ``Auth.redirect`` value in their session.
logoutRedirect
    The default action to redirect to after the user is logged out. While
    ``AuthComponent`` does not handle post-logout redirection, a redirect URL will
    be returned from :php:meth:`AuthComponent::logout()`. Defaults to
    ``loginAction``.
unauthorizedRedirect
    Controls handling of unauthorized access. By default unauthorized user is
    redirected to the referrer URL or ``loginAction`` or '/'.
    If set to ``false``, a ForbiddenException exception is thrown instead of
    redirecting.
storage
    Storage class to use for persisting user record. When using stateless
    authenticator you should set this to ``Memory``. Defaults to ``Session``.
    You can pass config options to storage class using array format. For e.g. to
    use a custom session key you can set ``storage`` to ``['className' => 'Session', 'key' => 'Auth.Admin']``.
checkAuthIn
    Name of the event in which initial auth checks should be done. Defaults
    to ``Controller.startup``. You can set it to ``Controller.initialize``
    if you want the check to be done before controller's ``beforeFilter()``
    method is run.

You can get current configuration values by calling ``$this->Auth->getConfig()``::
only the configuration option::

    $this->Auth->getConfig('loginAction');

    $this->redirect($this->Auth->getConfig('loginAction'));

This is useful if you want to redirect a user to the ``login`` route for example.
Without a parameter, the full configuration will be returned.

Testing Actions Protected By AuthComponent
==========================================

See the :ref:`testing-authentication` section for tips on how to test controller
actions that are protected by ``AuthComponent``.

.. meta::
    :title lang=en: Authentication
    :keywords lang=en: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
