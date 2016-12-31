Sistema Simples com controle ACL (Lista de controle de acesso)
##############################################################

Neste tutorial você vai criar uma aplicação simples com
`autenticação </pt/view/172/Authentication>`_ e `lista de controle de
acesso </pt/view/171/Access-Control-Lists>`_. Este tutorial assume que
você tenha lido o tutoral `Blog </pt/view/219/Blog>`_, e esteja
familiarizado com o `Bake </pt/view/113/Code-Generation-with-Bake>`_.
Você deve ter alguma exeriência com o CakePHP, e conhecer os conceitos
de MVC. Este tutorial é uma breve introdução para os componentes
```AuthComponent`` <https://api.cakephp.org/class/auth-component>`_ e
```AclComponent`` <https://api.cakephp.org/class/acl-component>`_.

O que você vai precisar

#. Um servidor web. Nós vamos assumir que você está usando o Apache,
   embora as instruções para utilização de outros servidores sejam bem
   similares. Poderiamos brincar um pouco com a configuração do
   servidor, mas a maioria das pessoas pode ter o Cake completamente
   instalado e funcionando sem qualquer configuração extra.
#. Um servidor de banco. Nós vamos usar o MySQL neste tutorial. Você vai
   precisar saber o suficiente sobre SQL para criar um banco de dados:
   Cake vai tomar as rédeas a partir dai.
#. Conhecimento básico de PHP. Se você tem feito programação orientada à
   objetos, melhor: mas não tenha medo se você é um fan do procedural.

Preparando sua Aplicação
========================

Primeiro, vamos pegar uma cópia recente do Cake.

Para obter um download recente, visite o projeto CakePHP no Cakeforge:
http://cakeforge.org/projects/cakephp/ e faça o download da versão
estável. Para este tutorial você precisa da verão 1.2.x.x

Você também pode verificar/exportar uma cópia recente do nosso código
tronco em : https://svn.cakephp.org/repo/trunk/cake/1.2.x.x/

Uma vez que você tem pego uma cópia recente do Cake, configure seu
arquivo database.php e altere o valor do Security.salt no seu
app/config/core.php. A partir dai nós vamos construir um esquema de
banco de dados simples para desenvolver nossa aplicação. Execute os
seguinte comandos SQL em seu banco.

::

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

Estas são as tabelas que você vai estar usando para fazer o resto de sua
aplicação. Uma vez definida a estrutura das tabelas do banco nós podemos
começar a cozinhar. Use o `cake
bake </pt/view/113/Code-Generation-with-Bake>`_ para criar rapidamente
seus modelos, controladores e visões.

Para usar o cake bake, chame "cake bake all" e isto vai listar as 4
tabelas que você inseriu no MySQL. Selecione "1 (Group).", e siga as
instruções. Repita o mesmo para as outras 3 tabelas, então você tera
gerado os 4 controladores, modelos e suas visões.

Evite usar Scaffold aqui. A geração de ACOs (Controle de acesso de
objetos) vai ser seriamente afetada se você construir os controladores
com o recurso de Scaffold.

Enquanto estão sendo gerados os Modelos, cake vai automagicamente
detectar as associações entre seus Modelos (ou relacionamento entre as
tabelas). Deixe o cake produzir os corretos hasMany (Tem muitos) e
belongsTo (Pertence a) associações. Se você for solicitado para escolher
hasOne (Tem um) ou hasMany (Tem muitos), de um modo geral, você vai
precisar somente de relacionamentos hasMany para este tutorial.

Deixe sem admin routing por enquanto, sem eles o assunto já é complicado
o suficiente. Esteja certo de **não** adicionar o Componente Acl nem o
Componente Auth em nenhum dos controladores que você está criando. Nós
vamos fazer iso em breve. Agora você deve ter modelos, controladores e
visões para as tabelas users, groups, posts e widgets.

Preparando para incluir o Auth
==============================

Agora já temos uma aplicação CRUD funcionando. O Bake deve ter
configurado todas as associações de que precisamos (se não tiver, inclua
as associações de seus models agora). Há algumas outras pequenas coisas
que precisam ser adicionadas antes de podermos adicionar os componentes
Auth e Acl. Primeiro adicione uma ação de login e logout ao seu
``UsersController``.

::

    function login() {
        // mágica do Auth
    }
     
    function logout() {
        // deixe vazio por enquanto
    }

Crie então o seguinte arquivo de view para o login em
app/views/users/login.ctp:

::

    $session->flash('auth');
    echo $form->create('User', array('action' => 'login'));
    echo $form->inputs(array(
        'legend' => __('Login', true),
        'username',
        'password'
    ));
    echo $form->end('Login');

Não precisamos nos preocupar em adicionar nada para fazer hash das
senhas, uma vez que o AuthComponente faz isto automaticamente para nós
ao criar/editar usuários e quando eles efetuarem login, uma vez que
esteja tudo configurado corretamente. Além disso, se você fizer hash de
suas senhas manualmente, o ``AuthComponent`` simplesmente não será capaz
de processar o login de seu usuário, uma vez que ele irá fazer hash de
novo e assim as senhas não irão corresponder.

A seguir, precisamos fazer algumas modificações ao ``AppController``. Se
você não tiver um arquivo ``/app/app_controller.php``, crie-o. Perceba
que este controller fica em /app/ e não em /app/controllers/. Como
queremos que todo o nosso site tenha o controle definido pelo Auth e
Acl, vamos referenciá-los no nosso ``AppController``.

::

    <?php
    class AppController extends Controller {
        var $components = array('Acl', 'Auth');

        function beforeFilter() {
            //Configure AuthComponent
            $this->Auth->authorize = 'actions';
            $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
            $this->Auth->logoutRedirect = array('controller' => 'users', 'action' => 'login');
            $this->Auth->loginRedirect = array('controller' => 'posts', 'action' => 'add');
        }
    }
    ?>

Antes de configurarmos as regras de ACL, vamos precisar adicionar alguns
usuários e grupos. Com o ``AuthComponent`` sendo usado, nós não vamos
conseguir acessar quaisquer de nossas actions, uma vez que não estamos
logados. Assim, vamos adicionar algumas exceções ao ``AuthComponent``
que vão nos permitir criar alguns usuários e grupos. Adicione o seguinte
**em ambas** as classes ``GroupsController`` e ``UsersController``:

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('*');
    }

Estas declarações dizem para o AuthComponent permitir acesso público a
todas as actions. Isto é apenas temporário e será removido quando
tivemos alguns usuários e grupos cadastrados em nossa base de dados. Mas
só não adicione seus usuários e grupos ainda.

Inicializar as tabelas Acl no banco
===================================

Antes de criar quaisquer usuários ou grupos, nós queremos conectá-los ao
Acl. Entretanto, no momento ainda não temos nenhumas tabelas de Acl de
forma que se você tentar visualizar quaisquer páginas neste exato
momento você vai receber uma mensagem de erro de tabela faltando
(("Error: Database table acos for model Aco was not found."). Para
remover estes erros, precisamos executar um arquivo de esquema. Usando
console Schema, execute o seguinte:

::

        cake schema create DbAcl

.

Este esquema irá lhe perguntar sobre a criação e remoção de tabelas.
Diga sim para remover e criar as tabelas.

Se você não tiver acesso ao shell de linha de comando, ou se estiver
tendo problemas ao utilizar o console, você pode executar o arquivo de
sql encontrado em /caminho/do/app/config/sql/db\_acl.sql.

Com os controllers configurados para entrada de dados e com as tabelas
Acl inicializadas, agora já estamos prontos, certo? Não totalmente.
Ainda há algo a fazer nos models de usuários e grupos. Exatamente, falta
anexá-lo automagicamente ao Acl.

Agir como um Requester (AclBehavior)
====================================

Para que o Auth e Acl funcionem corretamente, nós precisamos associar
nossos usuários e grupos às linhas nas tabelas do Acl. Para fazer isso,
nós podemos usar o ``AclBehavior``. O ``AclBehavior`` possibilita a
conexão automática dos models com suas tabelas Acl. Seu uso necessita de
uma implementação do método ``parentNode()`` em seu model. Em nosso
model ``User`` vamos adicionar o seguinte.

::

    var $name = 'User';
    var $belongsTo = array('Group');
    var $actsAs = array('Acl' => 'requester');
     
    function parentNode() {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        $data = $this->data;
        if (empty($this->data)) {
            $data = $this->read();
        }
        if (!$data['User']['group_id']) {
            return null;
        } else {
            return array('Group' => array('id' => $data['User']['group_id']));
        }
    }

Então, adicionamos o seguinte em nosso model ``Group``:

::

    var $actsAs = array('Acl' => array('requester'));
     
    function parentNode() {
        return null;
    }

O que este código faz é mapear os models ``Group`` e ``User`` para o Acl
e indicar ao CakePHP que a toda vez que você tiver um User ou um Group,
você também vai querer uma entrada na tabela ``aros``. Isso torna o
gerenciamento do Acl uma moleza, uma vez que seus AROs passam a ser
transparentemente mapeados para suas tabelas de usuários e grupos
(``users`` e ``groups``, respectivamente). Assim, a qualquer momento que
você criar um novo ou excluir um usuário/grupo, a tabela Aro será
atualizada.

Nossos controllers e models agora estão preparados para se adicionar
alguns dados iniciais, e nossos models ``Group`` e ``User`` estão
ligados à tabela Acl. Então, vamos adicionar alguns grupos e usuários
usando formulários gerados pelo bake seguindo o exemplo :
http://example.com/groups/add e http://example.com/users/add. Como
exemplo, criamos os seguintes grupos:

-  administrators
-  managers
-  users

Também precisamos criar um usuário para cada grupo, então inserimos um
usuário em cada um dos grupos de acesso para testar depois. Utilize
senhas fáceis ou anote tudo para não esquecer. Se você fizer um
``SELECT * FROM aros;`` a partir do prompt do Mysql, p.ex., você deveria
obter um resultado parecido com:

::

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

Isto nos mostra que temos 3 grupos e 3 usuários. Os usuários (users)
estão embutidos dentro dos grupos (groups), o que significa que podemos
definir permissões tanto por grupo quanto diretamente por usuário.

Ao modificar um usuário, você deve atualizar manualmente o ARO
correspondente. Este código deve ser executado sempre que você for
atualizar alguma informação do usuário:

::

    // Verifica se a permissão do grupo foi modificada
    $oldgroupid = $this->User->field('group_id');
    if ($oldgroupid !== $this->data['User']['group_id']) {
        $aro =& $this->Acl->Aro;
        $user = $aro->findByForeignKeyAndModel($this->data['User']['id'], 'User');
        $group = $aro->findByForeignKeyAndModel($this->data['User']['group_id'], 'Group');
                    
        // Salva na tabela ARO
        $aro->id = $user['Aro']['id'];
        $aro->save(array('parent_id' => $group['Aro']['id']));
    }

Uma alternativa à essa atualização do ARO após uma mudança no group\_id
é adicionar o seguinte código à seu model User. Assim você não precisa
se preocupar em duplicar código.

::

    /**    
     * Callback afterSave
     *
     * Atualiza o aro para o usuário.
     *
     * @access public
     * @return void
     */
    function afterSave($created) {
            if (!$created) {
                $parent = $this->parentNode();
                $parent = $this->node($parent);
                $node = $this->node();
                $aro = $node[0];
                $aro['Aro']['parent_id'] = $parent[0]['Aro']['id'];
                $this->Aro->save($aro);
            }
    }

Criando ACOs
============

Agora que temos nossos usuários e grupos (aros), podemos começar a
incluir nossos controllers e configurações de permissão para usuários e
grupos no Acl, bem como habilitar o login / logout.

Nossos AROs estarão automaticamente criando a si mesmos quando novos
usuários forem criados. Que tal poder gerar automagicamente os ACOs a
partir de nossos controller e respectivas actions? Bem, infelizmente o
CakePHP não vem de fábrica com uma maneira fácil de fazer isso. No
entanto, as classes padrão dispõem de algumas maneiras para facilitar a
criação de ACO's manualmente. Você pode criar objetos ACO a partir do
shell Acl ou então você pode usar o ``AclComponent``. Para criar Acos a
partir do shell, pode-se fazer o seguinte:

::

    cake acl create aco root controllers

Já para utilizar o AclComponent pode-se fazer:

::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

As duas maneiras devem criar nosso ACO 'root' de primeiro nível chamado
'controllers'. A finalidade deste nó raiz é possibilitar a
permissão/proibição de acesso num escopo global além de permitir o uso
do Acl para outros propósitos não relacionados aos controllers/actions,
tais como verificação de permissões em nível de registro de model, por
exemplo. Como vamos usar um nó raiz como entrada global para ACO,
precisamos fazer uma pequena modificação na configuração de nosso
``AuthComponent``. O ``AuthComponent`` precisa saber da existência deste
nó raiz, de forma que ao fazer as verificações de ACL ele possa utilizar
o caminho correto do nó ao procurar por controllers/actions. No
``AppController``, adicione o seguinte ao método ``beforeFilter``:

::

    $this->Auth->actionPath = 'controllers/';

Uma ferramenta automatizada para criação de ACOs
================================================

Como já mencionamos antes, não há uma maneira já pronta de cadastrar
todos os nossos controllers e actions no Acl. Por outro lado, todos nós
detestamos fazer ações repetitivas como digitar uma lista extensa de
centenas de actions em uma grande aplicação. Isto nos motivou a busca de
um conjunto de funções para construção de tabelas ACO. Estas funções
irão vasculhar cada controller em sua aplicação. Quaisquer métodos
não-privados e que não sejam próprios de ``Controller`` serão
adicionados à tabela Acl, definidos adequadamente sob a entrada de seu
respectivo controller pai. Você pode incluir e executar isto em seu
``AppController`` ou em qualquer controller em que faça sentido, apenas
certifique-se de removê-lo antes de colocar sua aplicação em produção.

::

        function build_acl() {
            if (!Configure::read('debug')) {
                return $this->_stop();
            }
            $log = array();

            $aco =& $this->Acl->Aco;
            $root = $aco->node('controllers');
            if (!$root) {
                $aco->create(array('parent_id' => null, 'model' => null, 'alias' => 'controllers'));
                $root = $aco->save();
                $root['Aco']['id'] = $aco->id; 
                $log[] = 'Created Aco node for controllers';
            } else {
                $root = $root[0];
            }   

            App::import('Core', 'File');
            $Controllers = Configure::listObjects('controller');
            $appIndex = array_search('App', $Controllers);
            if ($appIndex !== false ) {
                unset($Controllers[$appIndex]);
            }
            $baseMethods = get_class_methods('Controller');
            $baseMethods[] = 'buildAcl';

            $Plugins = $this->_getPluginControllerNames();
            $Controllers = array_merge($Controllers, $Plugins);

            // Vasculha cada controller em app/controllers
            foreach ($Controllers as $ctrlName) {
                $methods = $this->_getClassMethods($this->_getPluginControllerPath($ctrlName));

                // Considera todos os plugins primeiro
                if ($this->_isPlugin($ctrlName)){
                    $pluginNode = $aco->node('controllers/'.$this->_getPluginName($ctrlName));
                    if (!$pluginNode) {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginName($ctrlName)));
                        $pluginNode = $aco->save();
                        $pluginNode['Aco']['id'] = $aco->id;
                        $log[] = 'Criado nó ACO para ' . $this->_getPluginName($ctrlName) . ' Plugin';
                    }
                }
                // Procura/cria um nó para o controller
                $controllerNode = $aco->node('controllers/'.$ctrlName);
                if (!$controllerNode) {
                    if ($this->_isPlugin($ctrlName)){
                        $pluginNode = $aco->node('controllers/' . $this->_getPluginName($ctrlName));
                        $aco->create(array('parent_id' => $pluginNode['0']['Aco']['id'], 'model' => null, 'alias' => $this->_getPluginControllerName($ctrlName)));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Criado nó ACO para ' . $this->_getPluginControllerName($ctrlName) . ' ' . $this->_getPluginName($ctrlName) . ' Plugin Controller';
                    } else {
                        $aco->create(array('parent_id' => $root['Aco']['id'], 'model' => null, 'alias' => $ctrlName));
                        $controllerNode = $aco->save();
                        $controllerNode['Aco']['id'] = $aco->id;
                        $log[] = 'Criado nó ACO para ' . $ctrlName;
                    }
                } else {
                    $controllerNode = $controllerNode[0];
                }

                // Limpa os métodos para remover aqueles da classe Controller bem como as actions privadas.
                foreach ($methods as $k => $method) {
                    if (strpos($method, '_', 0) === 0) {
                        unset($methods[$k]);
                        continue;
                    }
                    if (in_array($method, $baseMethods)) {
                        unset($methods[$k]);
                        continue;
                    }
                    $methodNode = $aco->node('controllers/'.$ctrlName.'/'.$method);
                    if (!$methodNode) {
                        $aco->create(array('parent_id' => $controllerNode['Aco']['id'], 'model' => null, 'alias' => $method));
                        $methodNode = $aco->save();
                        $log[] = 'Criado nó ACO para '. $method;
                    }
                }
            }
            if(count($log)>0) {
                debug($log);
            }
        }

        function _getClassMethods($ctrlName = null) {
            App::import('Controller', $ctrlName);
            if (strlen(strstr($ctrlName, '.')) > 0) {
                // Controller de plugin
                $num = strpos($ctrlName, '.');
                $ctrlName = substr($ctrlName, $num+1);
            }
            $ctrlclass = $ctrlName . 'Controller';
            return get_class_methods($ctrlclass);
        }

        function _isPlugin($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) > 1) {
                return true;
            } else {
                return false;
            }
        }

        function _getPluginControllerPath($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0] . '.' . $arr[1];
            } else {
                return $arr[0];
            }
        }

        function _getPluginName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[0];
            } else {
                return false;
            }
        }

        function _getPluginControllerName($ctrlName = null) {
            $arr = String::tokenize($ctrlName, '/');
            if (count($arr) == 2) {
                return $arr[1];
            } else {
                return false;
            }
        }

    /**
     * Obtém os nomes dos controllers de plugin...
     * 
     * Este método irá retornar um array com os nomes dos controllers de plugin e também
     * assegurar que os controllers estejam disponíveis para que possamos obter os nomes
     * dos métodos fazendo um App::import para cada controller de plugin.
     *
     * @return array com nomes de controllers de plugin.
     *
     */
        function _getPluginControllerNames() {
            App::import('Core', 'File', 'Folder');
            $paths = Configure::getInstance();
            $folder =& new Folder();
            $folder->cd(APP . 'plugins');

            // Obtém a lista de plugins
            $Plugins = $folder->read();
            $Plugins = $Plugins[0];
            $arr = array();

            // Varre todos os plugins
            foreach($Plugins as $pluginName) {
                // Entra no diretório do plugin
                $didCD = $folder->cd(APP . 'plugins'. DS . $pluginName . DS . 'controllers');
                // Obtém uma lista de arquivos cujo nome termine com
                // controller.php
                $files = $folder->findRecursive('.*_controller\.php');

                // Varre os controllers encontrados no diretório de plugins
                foreach($files as $fileName) {
                    // Pega o nome do arquivo em si
                    $file = basename($fileName);

                    // Pega o nome do controller
                    $file = Inflector::camelize(substr($file, 0, strlen($file)-strlen('_controller.php')));
                    if (!preg_match('/^'. Inflector::humanize($pluginName). 'App/', $file)) {
                        if (!App::import('Controller', $pluginName.'.'.$file)) {
                            debug('Erro ao importar o arquivo '.$file.' do plugin '.$pluginName);
                        } else {
                            // Agora prefixa o nome do plugin...
                            // É necessário para podermos obter os nomes dos métodos.
                            $arr[] = Inflector::humanize($pluginName) . "/" . $file;
                        }
                    }
                }
            }
            return $arr;
        }

Agora execute a action em seu navegador, p.ex.,
http://localhost/groups/build\_acl. Isto irá construir a sua tabela ACO.

Você pode até querer manter este método uma vez que ele vai adicionar
novos ACO's para todos os controllers e actions que estiverem em sua
aplicação no momento em que você executá-lo. Saiba porém que este método
não remove os nós para actions que não existam mais na aplicação. Agora
que o trabalho pesado foi feito, nós precisamos configurar algumas
permissões e remover o código anterior que desabilitou o
``AuthComponent``.

O código original nesta página não levava em consideração que você
poderia usar plugins em suas aplicações e que você poderia querer fazer
controle de acesso para os controllers e actions definidos em seus
plugins. Agora o código acima já está atualizado para incluir
automaticamente os plugins de maneira correta, Note que executar esta
action irá gerar algumas linhas de log para depuração na parte de cima
da página no browser indicando as entradas de Plugin/Controller/Action
que puderam (e as que não puderam) ser adicionadas à árvore da tabela
ACO.

Definindo as permissões
=======================

Tal como criar ACOs, para se criar permissões também não há uma solução
mágica, tampouco pretende-se apresentar uma. Para atribuir as permissões
de acesso dos AROs para os ACOs, utilize o AclShell. Para mais
informação sobre como utilizá-lo, a uma comece consultando a ajuda do
AclShell, que pode ser visualizada desta maneira:

::

    cake acl help

Para definir as permissões com o ``AclComponent``, faça o seguinte:

::

    $this->Acl->allow($aroAlias, $acoAlias);

Iremos adicionar algumas declarações de permissão/proibição agora.
Adicione o código a seguir a um método temporário em seu
``UsersController`` e acesse-o via navegador para executá-lo. Se você
fizer um ``SELECT * FROM aros_acos``, você deve ver uma porção de 0's e
1's. Uma vez que você tenha verificado que suas permissões estão
definidas, remova o método.

::

    function initDB() {
        $group =& $this->User->Group;
        // Permite aos admins fazer tudo
        $group->id = 1;     
        $this->Acl->allow($group, 'controllers');
     
        // Permite aos gerentes acessar posts e widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');
     
        // Permite aos usuários apenas adicionar ou editar os posts e widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');        
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');        
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
    }

Agora já temos definidas algumas regras básicas de acesso. Permitimos
aos administradores fazer tudo. Os gerentes podem acessar tudo sobre
posts e widgets. por fim, os usuários podem acessar adicionar e editar
os posts e widgets.

Nós pegamos uma referência de um model ``Group`` a modificamos para que
seja capaz de especificar o ARO que queremos, isto é devido à forma como
o ``AclBehavior`` trabalha. O ``AclBehavior`` não define o campo alias
na tabela ``aros``, de forma que devemos usar uma referência a um objeto
ou a um array para referenciar o ARO específico que queremos.

Você deve ter notado que deliberadamente deixamos as actions index e
view de fora das permissões de Acl. Queremos tornar públicas as actions
view e index de ``PostsController`` e de ``WidgetsController``. Isto vai
permitir que usuários não autenticados visualizar estas páginas. Além
isso, a qualquer momento você pode remover actions do
``AuthComponent::allowedActions``, nesse caso as permissões para view e
edit serão revertidas para aquelas definidas no Acl.

Agora queremos eliminar as referências à ``Auth->allowedActions`` de
nossos controllers de users e groups. Então, vamos adicionar o seguinte
a nossos controllers de posts e widgets:

::

    function beforeFilter() {
        parent::beforeFilter(); 
        $this->Auth->allowedActions = array('index', 'view');
    }

Isto retira os 'interruptores' que colocamos anteriormente nos
controllers users e groups, e lhes dá acesso público às actions index e
view nos controllers posts e widgets. No
``AppController::beforeFilter()``, adicione o seguinte:

::

     $this->Auth->allowedActions = array('display');

Isto faz com que 'display' se torne uma action pública. Isto vai manter
pública nossa action PagesController::display(). Isto é importante já
que a rota default normalmente define esta action como página inicial de
nossa aplicação.

Autenticando-se
===============

Nossa aplicação agora possui controle de acesso e qualquer tentativa de
acessar páginas não-públicas irá redirecionar você para a página de
login. Entretanto, ainda precisamos criar uma view de login antes para
que qualquer pessoa possa se autenticar. Se ainda não tiver feito, crie
o arquivo ``app/views/users/login.ctp`` e adicione o código a seguir:

::

    <h2>Login</h2>
    <?php
    echo $form->create('User', array('url' => array('controller' => 'users', 'action' =>'login')));
    echo $form->input('User.username');
    echo $form->input('User.password');
    echo $form->end('Login');
    ?>

Se um usuário já estiver autenticado, redirecione-o:

::

    function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('Você está autenticado!');
            $this->redirect('/', null, false);
        }
    }       

Você também pode querer adicionar um flash() para mensagens Auth ao seu
layout. Faça uma cópia do layout padrão - encontrado em
``cake/libs/view/layouts/default.ctp`` - para a pasta layouts dentro de
aoo. Neste arquivo ``app/views/layouts/default.ctp`` inclua:

::

    $session->flash('auth');

Você agora deve ser capaz de se autenticar e tudo o mais deve funcionar
automagicamente. Quando tiver um acesso for negado, as mensagens de Auth
serão mostradas devido ao ``$session->flash('auth')``.

Logout
======

Agora falando sobre logout. No começo fizemos questão de deixar este
método em branco, mas agora é hora de preenchê-lo. No método
``UsersController::logout()``, adicione o seguinte:

::

    $this->Session->setFlash('Tchauzinho!');
    $this->redirect($this->Auth->logout());

Isto define uma mensagem de flash na sessão e retira a autenticação do
usuário, usando o método logout do AuthComponent. O método logout do
Auth basicamente exclui a chave de sessão de autenticação e retorna uma
url que possa ser usada em um redirect. Se houver outros dados na sessão
do usuário e que precisem ser excluídos, não esqueça de também
excluí-los aqui.

Tudo pronto
===========

Neste ponto você deve ter uma aplicação com autenticação (Auth) e
controle de acesso (Acl). As permissões dos usuários estão definidas em
nível de grupos, mas você pode também pode definí-las também diretamente
por usuário. Você pode ainda definir permissões num escopo global, para
cada controller ou para cada action. Além do mais, agora você também tem
um bloco de código reutilizável para expandir facilmente sua tabela de
ACO conforme sua aplicação for crescendo.
