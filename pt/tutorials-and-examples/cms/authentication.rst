CMS Tutorial - Authentication
#############################

Agora que nosso CMS possui usuários, podemos habilitá-los a fazer login usando o plugin
`cakephp/authentication <https://book.cakephp.org/authentication/>`__
. Começaremos garantindo que as senhas estejam armazenadas com segurança em
nosso banco de dados. Em seguida, forneceremos um login e logout funcionais e
permitiremos que novos usuários se registrem.

Instalando o Plugin Authentication
==================================

Use o composer para instalar o Plugin Authentication:

.. code-block:: console

    composer require "cakephp/authentication:~3.0"


Adicionando Password Hashing
----------------------------

Você precisa ter criado ``Controller``, ``Table``, ``Entity`` e
os templates para a tabela ``users`` no seu banco de dados. Você pode fazer isso manualmente,
como fez antes para o ArticlesController, ou pode usar o shell bake
para gerar as classes para você usando:

.. code-block:: console

    bin/cake bake all users

Se você criar ou atualizar um usuário com essa configuração, poderá notar que
as senhas são armazenadas em texto simples. Isso é muito ruim do ponto de vista da segurança,
então vamos corrigir isso.

Este também é um bom momento para falar sobre a camada de modelo no CakePHP. No CakePHP,
usamos classes diferentes para operar em coleções de registros e registros individuais.
Métodos que operam na coleção de entidades são colocados na classe ``Table``,
enquanto recursos pertencentes a um único registro são colocados na classe ``Entity``.

Por exemplo, o hash de senha é feito no registro individual, então
implementaremos esse comportamento no objeto entidade. Como queremos fazer o hash da
senha sempre que ela for definida, usaremos um método mutador/setter. O CakePHP
chamará um método setter baseado em convenção sempre que uma propriedade for definida em uma de suas
entidades. Vamos adicionar um setter para a senha. Em **src/Model/Entity/User.php**
adicione o seguinte::

    <?php
    namespace App\Model\Entity;

    use Authentication\PasswordHasher\DefaultPasswordHasher; // Add this line
    use Cake\ORM\Entity;

    class User extends Entity
    {
        // Code from bake.

        // Adicione este método
        protected function _setPassword(string $password) : ?string
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher())->hash($password);
            }
            return null;
        }
    }

Agora, acesse **http://localhost:8765/users** no seu navegador para ver uma lista de usuários.
Lembre-se de que você precisa ter seu servidor local em execução. Inicie um servidor PHP autônomo
usando ``bin/cake server``.

Você pode editar o usuário padrão criado durante a
:doc:`Instalação <installation>`. Se você alterar a senha desse usuário,
você deverá ver uma senha com hash em vez do valor original na lista ou
nas páginas de visualização. O CakePHP usa o hash de senhas com `bcrypt
<https://codahale.com/how-to-safely-store-a-password/>`_ por padrão. Recomendamos
bcrypt para todos os novos aplicativos para manter seus padrões de segurança elevados. Este
é o `algoritmo de hash de senha recomendado para PHP <https://www.php.net/manual/en/function.password-hash.php>`_.

.. note::

    Crie uma senha com hash para pelo menos uma das contas de usuário agora!
    Ela será necessária nas próximas etapas.
    Após atualizar a senha, você verá uma longa string armazenada na coluna de senhas.
    Observe que o bcrypt gerará um hash diferente mesmo para a mesma senha salva duas vezes.


Adicionando Login
=================

Agora é hora de configurar o plugin de autenticação.
O plugin lidará com o processo de autenticação usando 3 classes diferentes:

* ``Application`` usará o Middleware de Autenticação e fornecerá um
    AuthenticationService, contendo toda a configuração que queremos definir como
    vamos verificar as credenciais e onde encontrá-las.
* ``AuthenticationService`` será uma classe utilitária que permitirá a configuração do
    processo de autenticação.
* ``AuthenticationMiddleware`` será executado como parte da fila de middleware,
    isso antes que seus controladores sejam processados ​​pelo framework, e selecionará as
    credenciais e as processará para verificar se o usuário está autenticado.

Se você se lembra, usamos `AuthComponent`
antes para lidar com todas essas etapas. Agora, a lógica é dividida em classes específicas e
o processo de autenticação acontece antes da camada do controller. Primeiro, ele verifica se o usuário
está autenticado (com base na configuração fornecida) e insere o usuário e
os resultados da autenticação na solicitação para referência futura.

Em **src/Application.php**, adicione as seguintes importações::

    // In src/Application.php add the following imports
    use Authentication\AuthenticationService;
    use Authentication\AuthenticationServiceInterface;
    use Authentication\AuthenticationServiceProviderInterface;
    use Authentication\Middleware\AuthenticationMiddleware;
    use Cake\Routing\Router;
    use Psr\Http\Message\ServerRequestInterface;

Em seguida, implemente a interface de autenticação na sua classe ``Application``::

    // in src/Application.php
    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface
    {

Em seguida adicione o seguinte::

    // src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // ... other middleware added before
            ->add(new RoutingMiddleware($this))
            ->add(new BodyParserMiddleware())
            // Add the AuthenticationMiddleware. It should be after routing and body parser.
            ->add(new AuthenticationMiddleware($this));

        return $middlewareQueue;
    }

    public function getAuthenticationService(ServerRequestInterface $request): AuthenticationServiceInterface
    {
        $authenticationService = new AuthenticationService([
            'unauthenticatedRedirect' => Router::url('/users/login'),
            'queryParam' => 'redirect',
        ]);

        // Carregue os autenticadores, você quer a sessão primeiro
        $authenticationService->loadAuthenticator('Authentication.Session');
        // Configurar verificação de dados do formulário para escolher e-mail e senha
        $authenticationService->loadAuthenticator('Authentication.Form', [
            'fields' => [
                'username' => 'email',
                'password' => 'password',
            ],
            'loginUrl' => Router::url('/users/login'),
            'identifier' => [
                'Authentication.Password' => [
                    'fields' => [
                        'username' => 'email',
                        'password' => 'password',
                    ],
                ],
            ],
        ]);

        return $authenticationService;
    }

Na sua classe ``AppController`` adicione o seguinte código::

    // src/Controller/AppController.php
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Flash');

        // Adicione esta linha para verificar o resultado da autenticação e bloquear seu site
        $this->loadComponent('Authentication.Authentication');

Agora, em cada requisição, o ``AuthenticationMiddleware`` inspecionará
a sessão de requisição para procurar um usuário autenticado. Se estivermos carregando a página ``/users/login``,
ele também inspecionará os dados do formulário publicado (se houver) para extrair as credenciais.
Por padrão, as credenciais serão extraídas dos campos ``username`` e ``password``
nos dados da requisição.
O resultado da autenticação será injetado em um atributo de requisição chamado ``authentication``. 
Você pode inspecionar o resultado a qualquer momento usando
``$this->request->getAttribute('authentication')`` nas ações do seu concontrollertrolador.
Todas as suas páginas serão restritas, pois o ``AuthenticationComponent`` verifica o
resultado em cada requisição. Quando não encontrar nenhum usuário autenticado, ele redirecionará
o usuário para a página ``/users/login``.
Observe que, neste ponto, o site não funcionará, pois ainda não temos uma página de login.
Se você visitar seu site, verá um "loop de redirecionamento infinito", então vamos consertar isso.

.. note::

    Se sua aplicação serve tanto em protocolos SSL quanto não SSL, você poderá ter problemas
    com perda de sessões, caso sua aplicação esteja em protocolo não SSL. Você precisa habilitar
    o acesso definindo session.cookie_secure como false em sua configuração config/app.php ou config/app_local.php.
    (Veja :doc:`Padrões do CakePHP para session.cookie_secure </development/sessions>`)

No seu ``UsersController``, adicione o seguinte código::

    public function beforeFilter(\Cake\Event\EventInterface $event): void
    {
        parent::beforeFilter($event);
        // Configure a ação de login para não exigir autenticação, evitando
        // o problema do loop de redirecionamento infinito
        $this->Authentication->addUnauthenticatedActions(['login']);
    }

    public function login()
    {
        $this->request->allowMethod(['get', 'post']);
        $result = $this->Authentication->getResult();
        // independentemente de POST ou GET, redirecionar se o usuário estiver logado
        if ($result && $result->isValid()) {
            // redirecionar para /articles após login bem-sucedido
            $redirect = $this->request->getQuery('redirect', [
                'controller' => 'Articles',
                'action' => 'index',
            ]);

            return $this->redirect($redirect);
        }
        // exibir erro se o usuário enviou e a autenticação falhou
        if ($this->request->is('post') && !$result->isValid()) {
            $this->Flash->error(__('Nome de usuário ou senha inválidos'));
        }
    }

Adicione a lógica do modelo para sua ação de login::

    <!-- in /templates/Users/login.php -->
    <div class="users form">
        <?= $this->Flash->render() ?>
        <h3>Login</h3>
        <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('email', ['required' => true]) ?>
            <?= $this->Form->control('password', ['required' => true]) ?>
        </fieldset>
        <?= $this->Form->submit(__('Login')); ?>
        <?= $this->Form->end() ?>

        <?= $this->Html->link("Add User", ['action' => 'add']) ?>
    </div>

Agora, a página de login nos permitirá efetuar login corretamente no aplicativo.
Teste solicitando qualquer página do seu site. Após ser redirecionado
para a página ``/users/login``, insira o e-mail e a senha que você
escolheu anteriormente ao criar seu usuário. Você deverá ser redirecionado
com sucesso após o login.

Precisamos adicionar mais alguns detalhes para configurar nosso aplicativo.
Queremos que todas as páginas ``view`` e ``index`` sejam acessíveis sem login, então adicionaremos esta
configuração específica no AppController::

    // in src/Controller/AppController.php
    public function beforeFilter(\Cake\Event\EventInterface $event): void
    {
        parent::beforeFilter($event);
        // para todos os controladores em nossa aplicação, tornar o índice e a visualização
        // ações públicas, ignorando a verificação de autenticação
        $this->Authentication->addUnauthenticatedActions(['index', 'view']);
    }

.. note::

    Se você ainda não possui um usuário com senha hash, comente a linha
    ``$this->loadComponent('Authentication.Authentication')`` no seu
    AppController e todas as outras linhas onde a autenticação é usada. Em seguida, acesse
    ``/users/add`` para criar um novo usuário, escolhendo e-mail e senha. Depois,
    certifique-se de descomenter as linhas que acabamos de comentar temporariamente!

Experimente visitar ``/articles/add`` antes de fazer login! Como esta ação não é
permitida, você será redirecionado para a página de login. Após o login
com sucesso, o CakePHP o redirecionará automaticamente para ``/articles/add``.

Logout
======

Adicione a ação de logout à classe ``UsersController``::

    // in src/Controller/UsersController.php
    public function logout()
    {
        $result = $this->Authentication->getResult();
        // independentemente de POST ou GET, redirecionar se o usuário estiver logado
        if ($result && $result->isValid()) {
            $this->Authentication->logout();

            return $this->redirect(['controller' => 'Users', 'action' => 'login']);
        }
    }

Agora você pode acessar ``/users/logout`` para sair. Você será direcionado para a página de login.

Habilitando Registrations
=========================

Se você tentar visitar **/users/add** sem estar logado, será
redirecionado para a página de login. Devemos corrigir isso, pois queremos permitir que as pessoas
se inscrevam em nosso aplicativo. No ``UsersController``, corrija a seguinte linha::

    // Adicionar ao método beforeFilter do UsersController
    $this->Authentication->addUnauthenticatedActions(['login', 'add']);

O texto acima informa ao ``AuthenticationComponent`` que a ação ``add()`` do
``UsersController`` *não* requer autenticação ou autorização. Você pode
dedicar um tempo para limpar o arquivo **Users/add.php** e remover os
links enganosos ou prosseguir para a próxima seção. Não desenvolveremos
a edição, visualização ou listagem de usuários neste tutorial, mas este é um exercício que você
pode realizar sozinho.

Agora que os usuários podem efetuar login, queremos limitar os usuários a editar apenas os artigos
que eles criaram :doc:`aplicando políticas de autorização <./authorization>`.
