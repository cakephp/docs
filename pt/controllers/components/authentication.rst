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
* ``DigestAuthenticate`` permite autenticar usuários usando o Diges Autenticação HTTP.

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
- ``finder`` O método finder a ser usado para buscar um registro do usuário. O padrão é 'all'.
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
ao arquivo **templates/layout/default.php** na seção body::

    echo $this->Flash->render();

Você pode personalizar as mensagens de erro e as configurações do flash que o
``AuthComponent`` usa. Usando a configuração ``flash``, você pode configurar
os parâmetros que o ``AuthComponent`` usa para definir mensagens em flash.
As chaves disponíveis são

- ``key`` - A chave a ser usada é padronizada como 'default'.
- ``element`` - O nome do elemento a ser usado para renderização, o padrão é null.
- ``params`` - A matriz de parâmetros adicionais a serem usados, o padrão é ``[]``.

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

``AuthComponent`` é configurado por padrão para usar o ``DefaultPasswordHasher``
ao validar credenciais do usuário, portanto, nenhuma configuração adicional é
necessária para autenticar usuários.

``AuthComponent`` é configurado como padrão para usar o ``DefaultPasswordHasher``
para validar credenciais do usuário, portanto, nenhuma configuração adicional é
necessária para autenticação de usuários.

O ``DefaultPasswordHasher`` usa o algoritmo de hash bcrypt internamente, que é
uma das soluções mais fortes de hash de senha usadas no setor. Embora seja
recomendável usar essa classe de hasher de senha, pode ser que você esteja
gerenciando um banco de dados de usuários cuja senha foi usada um tipo de hash diferente.

Criando Classes Personalizadas de Hasher de Senha
-------------------------------------------------

Para usar um hasher de senha diferente, você precisa criar a classe em
**src/Auth/LegacyPasswordHasher.php** e implementar os métodos ``hash()``
e ``check()``. Esta classe precisa estender a classe ``AbstractPasswordHasher``::

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

Em seguida, você deve configurar o ``AuthComponent`` para usar o seu hasher de senha
customizado::

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

Oferecer suporte a sistemas legados é uma boa idéia, mas é ainda melhor manter seu
banco de dados com os mais recentes avanços de segurança. A seção a seguir explica
como migrar de um algoritmo de hash para o padrão do CakePHP.

Alterando Algoritmos de Hash
----------------------------

O CakePHP fornece uma maneira limpa de migrar as senhas de seus usuários de um
algoritmo para outro, isso é alcançado através da classe ``FallbackPasswordHasher``.
Supondo que você esteja migrando seu aplicativo do CakePHP 2.x que usa hashes de
senha ``sha1``, você pode configurar o ``AuthComponent`` da seguinte forma::

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

O primeiro nome que aparece na chave ``hashers`` indica qual das classes é a
preferida, mas retornará para as outras na lista se a verificação não tiver êxito.

Ao usar o ``WeakPasswordHasher``, você precisará definir o ``Security.salt``
para configurar o valor para garantir que as senhas sejam transformadas.

Para atualizar as senhas de usuários antigos rapidamente, você pode alterar
a função de login de acordo::

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

Como você pode ver, estamos apenas definindo a senha simples novamente,
para que a função setter na entidade faça hash na senha, como mostrado no
exemplo anterior, e salve a entidade.

Logon Manual de Usuários
------------------------

.. php:method:: setUser(array $user)

Às vezes, surge a necessidade de fazer o login manual de um usuário, como
logo após ele se registrar no seu aplicativo. Você pode fazer isso chamando
``$this->Auth->setUser()`` com os dados do usuário que deseja 'logar'::

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

    Certifique-se de adicionar manualmente o novo ID do usuário à matriz
    passada para o método ``setUser()``. Caso contrário, você não terá o ID
    do usuário disponível.

Acessando o Usuário Conectado
-----------------------------

.. php:method:: user($key = null)

Depois que um usuário está logado, muitas vezes você precisará de algumas
informações específicas sobre o usuário atual. Você pode acessar o usuário
conectado no momento usando ``AuthComponent::user()``::

    // De dentro de um controlador ou outro componente.
    $this->Auth->user('id');

Se o usuário atual não estiver conectado ou a chave não existir, o valor nulo
será retornado.

Logout de Usuários
------------------

.. php:method:: logout()

Eventualmente, você desejará uma maneira rápida de autenticar alguém e redirecioná-lo
para onde ele precisa ir. Esse método também é útil se você deseja fornecer um link
'Desconectar-se' dentro da área de um membro do seu aplicativo::

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

É difícil realizar logoff de usuários que efetuaram logon com autenticação
Digest ou Basic para todos os clientes. A maioria dos navegadores retém
credenciais pelo período em que ainda estão abertos. Alguns clientes podem
ser forçados a sair, enviando um código de status 401. Alterar o domínio de
autenticação é outra solução que funciona para alguns clientes.

Decidindo Quando Executar a Autenticação
----------------------------------------

Em alguns casos, você pode querer usar ``$this->Auth->user()`` no método
``beforeFilter()``. Isso é possível usando a chave de configuração ``checkAuthIn``.
As alterações a seguir, para o qual as verificações de autenticação
inicial devem ser feitas::

    // Configure AuthComponent para autenticar em initialize ()
    $this->Auth->setConfig('checkAuthIn', 'Controller.initialize');

O valor padrão para ``checkAuthIn`` é ``'Controller.startup'``, mas usando a
autenticação inicial ``'Controller.initialize'`` é feita antes do método ``beforeFilter()``.

.. _authorization-objects:

Autorização
===========

Autorização é o processo de garantir que um usuário identificado/autenticado
tenha permissão para acessar os recursos que está solicitando. Se ativado, o
``AuthComponent`` pode verificar automaticamente os manipuladores de autorização
e garantir que os usuários conectados tenham permissão para acessar os recursos
que estão solicitando. Existem vários manipuladores de autorização internos e você
pode criar personalizações para o seu aplicativo ou como parte de um plug-in.

- ``ControllerAuthorize`` Chama ``isAuthorized()`` no controlador ativo e
  usa o retorno para autorizar um usuário. Geralmente, é a maneira mais
  simples de autorizar usuários.

.. note::

    O adaptador ``ActionsAuthorize`` e ``CrudAuthorize`` disponível no CakePHP 2.x
    foram agora movidos para um plugin separado `cakephp/acl <https://github.com/cakephp/acl>`_.

Configurando Manipuladores de Autorização
-----------------------------------------

Você configura manipuladores de autorização usando a chave de configuração
``authorize``. Você pode configurar um ou muitos manipuladores para autorização.
O uso de vários manipuladores permite oferecer suporte a diferentes maneiras de
verificar a autorização. Quando os manipuladores de autorização são verificados,
eles serão chamados na ordem em que são declarados. Os manipuladores devem retornar
``false``, se não conseguirem verificar a autorização ou se a verificação falhar.
Os manipuladores devem retornar ``true`` se puderem verificar a autorização com
êxito. Os manipuladores serão chamados em sequência até que um passe. Se todas as
verificações falharem, o usuário será redirecionado para a página de onde veio. Além
disso, você pode interromper toda a autorização lançando uma exceção. Você precisará
capturar todas as exceções lançadas e lidar com elas.

Você pode configurar manipuladores de autorização nos métodos ``beforeFilter()`` ou
``initialize()`` do seu controlador. Você pode passar informações de configuração
para cada objeto de autorização, usando uma matriz::

    // Configuração básica
    $this->Auth->setConfig('authorize', ['Controller']);

    // Passando configurações
    $this->Auth->setConfig('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Assim como ``authenticate``, ``authorize``, ajuda a manter seu código DRY,
usando a chave ``all``. Essa chave especial permite definir configurações
que são passadas para todos os objetos anexados. A chave ``all`` também é
exposta como ``AuthComponent::ALL``::

    // Passando as configurações usando 'all'
    $this->Auth->setConfig('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

No exemplo acima, as ações ``Actions`` e `` Controller`` receberão as
configurações definidas para a chave 'all'. Quaisquer configurações
passadas para um objeto de autorização específico substituirão a chave
correspondente na chave 'all'.

Se um usuário autenticado tentar acessar uma URL que ele não está autorizado
a acessar, ele será redirecionado de volta ao referenciador. Se você não desejar
esse redirecionamento (principalmente necessário ao usar o adaptador de autenticação
sem estado), defina a opção de configuração ``unauthorizedRedirect`` para ``false``.
Isso faz com que o ``AuthComponent`` gere uma ``ForbiddenException`` em vez de redirecionar.

Criando Objetos de Autorização Personalizados
---------------------------------------------

Como os objetos de autorização são conectáveis, você pode criar objetos
de autorização personalizados em seu aplicativo ou plug-in. Se, por exemplo,
você desejasse criar um objeto de autorização LDAP. Em **src/Auth/LdapAuthorize.php**,
você pode colocar o seguinte::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Http\ServerRequest;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, ServerRequest $request)
        {
            // Faça coisas para o LDAP aqui.
        }
    }

Os objetos de autorização devem retornar ``false`` se o acesso do usuário
for negado ou se o objeto não puder executar uma verificação. Se o objeto
puder verificar o acesso do usuário, ``true`` deve ser retornado. Não é
necessário que você estenda ``BaseAuthorize``, apenas que seu objeto de
autorização implemente um método ``authorize()``. A classe ``BaseAuthorize``
fornece vários métodos úteis que são comumente usados.

Usando Objetos de Autorização Personalizados
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Depois de criar seu objeto de autorização personalizado, você pode usá-lo
incluindo-o na matriz de autorização do ``AuthComponent``::

    $this->Auth->setConfig('authorize', [
        'Ldap', // objeto de autorização do aplicativo.
        'AuthBag.Combo', // plugin autoriza objeto.
    ]);

Usando Sem Autorização
----------------------

Se você não quiser usar nenhum dos objetos de autorização internos e quiser
lidar com coisas totalmente fora de ``AuthComponent``, poderá definir
``$this->Auth->setConfig('authorize', false);``. Por padrão, ``AuthComponent``
começa com ``authorize`` definido como ``false``. Se você não usar um esquema
de autorização, verifique você mesmo a autorização no ``beforeFilter()`` do
seu controlador ou com outro componente.

Tornando Métodos Públicos
-------------------------

.. php:method:: allow($actions = null)

Muitas vezes, há ações do controlador que você deseja manter totalmente
públicas ou que não exigem que os usuários façam login. ``AuthComponent``
é pessimista no padrão para negar acesso. Você pode marcar métodos como métodos
públicos usando ``AuthComponent::allow()``. Ao marcar ações como públicas, o
``AuthComponent`` não procurará um usuário conectado nem autorizará a verificação
de objetos::

    // Permitir todas as ações
    $this->Auth->allow();

    // Permitir apenas a ação index.
    $this->Auth->allow('index');

    // Permitir apenas as ações de view e index.
    $this->Auth->allow(['view', 'index']);

Ao chamá-lo de vazio, você permite que todas as ações sejam públicas. Para uma única
ação, você pode fornecer o nome da ação como uma sequência. Caso contrário, use uma matriz.

.. note::

    Você não deve adicionar a ação "login" do seu ``UsersController`` na lista de permissões.
    Fazer isso causaria problemas com o funcionamento normal de ``AuthComponent``.

Fazendo Métodos Exigir Autorização
----------------------------------

.. php:method:: deny($actions = null)

Por padrão, todas as ações requerem autorização. No entanto, depois de tornar
os métodos públicos, você deseje revogar o acesso público.
Você pode fazer isso usando ``AuthComponent::deny()``::

    // Negar todas as ações.
    $this->Auth->deny();

    // Negar uma ação
    $this->Auth->deny('add');

    // Nega um grupo de ações.
    $this->Auth->deny(['add', 'edit']);

Ao chamá-lo de vazio, você nega todas as ações. Para um único método,
você pode fornecer o nome da ação como uma sequência. Caso contrário, use uma matriz.

Usando ControllerAuthorize
--------------------------

ControllerAuthorize permite manipular verificações de autorização em um
retorno de chamada do controlador. Isso é ideal quando você possui uma
autorização muito simples ou precisa usar uma combinação de modelos e
componentes para fazer sua autorização e não deseja criar um objeto de
autorização personalizado.

O retorno de chamada é sempre chamado de ``isAuthorized()`` e deve
retornar um valor booleano para permitir ou não ao usuário acessar
recursos na solicitação. O retorno de chamada é passado ao usuário
ativo para que possa ser verificado::

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
            // Qualquer usuário registrado pode acessar funções públicas
            if (!$this->request->getParam('prefix')) {
                return true;
            }

            // Somente administradores podem acessar funções administrativas
            if ($this->request->getParam('prefix') === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // Negação padrão
            return false;
        }
    }

O retorno de chamada acima forneceria um sistema de autorização muito simples,
no qual apenas usuários com role = admin poderiam acessar ações que estavam no
prefixo do administrador.

Opções de configuração
======================

Todas as configurações a seguir podem ser definidas no método ``initialize()`` do seu
controlador ou usando ``$this->Auth->setConfig()`` no seu ``beforeFilter()``:

ajaxLogin
    O nome de um elemento de exibição opcional a ser renderizado quando uma
    solicitação AJAX é feita com uma sessão inválida ou expirada.
allowedActions
    Ações do controlador para as quais a validação do usuário não é necessária.
authenticate
    Defina como uma matriz de objetos de autenticação que você deseja
    usar ao fazer logon de usuários. Existem vários objetos de autenticação
    principais; veja a seção :ref:`authentication-objects`.
authError
    Erro para exibir quando o usuário tenta acessar um objeto ou ação ao qual não tem acesso.

    Você pode impedir que a mensagem authError seja exibida definindo esse valor como
    booleano ``false``.
authorize
    Defina como uma matriz de objetos de Autorização que você deseja
    usar ao autorizar usuários em cada solicitação; veja a seção :ref:`authorization-objects`.
flash
    Configurações a serem usadas quando o Auth precisar enviar
    uma mensagem flash com ``FlashComponent::set()``.

    As chaves disponíveis são:
    - ``element`` - O elemento a ser usado; o padrão é 'default'.
    - ``key`` - A chave para usar; o padrão é 'auth'.
    - ``params`` - A matriz de parâmetros adicionais a serem usados; o padrão é '[]'.
loginAction
    Uma URL (definida como uma sequência ou matriz) para a ação do controlador
    que lida com logins. O padrão é ``/users/login``.
loginRedirect
    A URL (definida como uma sequência ou matriz) para os usuários da
    ação do controlador deve ser redirecionada após o login. Esse valor
    será ignorado se o usuário tiver um valor ``Auth.redirect`` em sua sessão.
logoutRedirect
    A ação padrão a ser redirecionada após o logout do usuário. Enquanto
    ``AuthComponent`` não lida com o redirecionamento pós-logout, uma URL
    de redirecionamento será retornada de :php:meth:`AuthComponent::logout()`.
    O padrão é ``loginAction``.
unauthorizedRedirect
    Controla a manipulação do acesso não autorizado. Por padrão, o usuário não
    autorizado é redirecionado para o URL do referenciador ``loginAction``
    ou '/'. Se definido como ``false``, uma exceção ForbiddenException é
    lançada em vez de redirecionar.
storage
    Classe de armazenamento a ser usada para o registro persistente do usuário.
    Ao usar o autenticador sem estado, defina-o como ``Memory``. O padrão é ``Session``.
    Você pode passar as opções de configuração para a classe de armazenamento usando o
    formato de matriz. Por ex. Para usar uma chave de sessão personalizada,
    você pode definir ``storage`` como ``['className' => 'Session', 'key' => 'Auth.Admin']``.
checkAuthIn
    Nome do evento no qual as verificações de autenticação iniciais devem ser
    feitas. O padrão é ``Controller.startup``. Você pode configurá-lo para
    ``Controller.initialize`` se você quiser que a verificação seja feita antes
    que o método ``beforeFilter()`` do controlador seja executado.

Você pode obter os valores atuais da configuração chamando ``$this->Auth->getConfig()``::
apenas a opção de configuração::

    $this->Auth->getConfig('loginAction');

    $this->redirect($this->Auth->getConfig('loginAction'));

Isso é útil se você deseja redirecionar um usuário para a rota ``login``, por exemplo.
Sem um parâmetro, a configuração completa será retornada.

Testando Ações Protegidas por AuthComponent
===========================================

Veja a seção :ref:`testing-authentication` para obter dicas sobre como testar
ações do controlador protegidas por ``AuthComponent``.

.. meta::
    :title lang=pt: Autenticação
    :keywords lang=pt: manipuladores de autenticação, array php, autenticação básica, aplicativo da web, maneiras diferentes, credenciais, exceções, cakephp, logging
