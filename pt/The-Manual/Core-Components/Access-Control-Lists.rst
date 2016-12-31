Lista de Controle de Acesso
###########################

Lista de controle de acesso do CakePHP é uma das funcionalidades mais
discutidas, mais provável porque é a mais procurada, mas mesmo porque
ela pode ser bastante confusa. Se vocês está procurando uma boa forma de
começar com as ACLs em geral, continue lendo.

Seja corajoso e fique com ela, mesmo que o caminho seja difícil. Depois
que você pegar o jeito dela, é uma ferramenta extremamente poderosa para
ter à mão quando desenvolver sua aplicação.

Entendendo como ACL trabalha
============================

Poderosas coisas requerem controle de acesso. Lista de controle de
acesso são uma forma de gerenciar as permissões da aplicação com alta
granularidade, ainda de fácil manutenção e sustentável.

Lista de Controle de Acesso ou ACL (Access Control List), lida com dois
conceitos principais: coisas que querem coisas inúteis, e coisas que são
desejadas. No ACL, coisas (na maioria das vezes usuários) que pretendem
usar coisas são chamados acesso de requisição de objetos ou AROs. Coisas
no sistema que são desejadas (na maioria das vezes ações ou dados) são
chamados de Controle de Acesso de Objetos ou ACOs. As entidades são
chamados 'objetos' porque algumas vezes a requisição de objetos não é
uma pessoa - as vezes você pode quer limitar o acesso a certos
controladores do Cake tem que iniciar a lógica em outras partes da sua
aplicação. ACOs pode ser qualquer coisa que você queira controlar, de
uma action de uma controladora, até um web service, para uma linha em
seu blog grandma's.

Revisando:

-  ACO - Controle de acesso de objetos - Qualquer coisa que é necessária
-  ARO - Requisição de acesso a objetos - Qualquer coisa que necessita
   de algo

Essencialmente, ACL é o que é usado para decidir quando um ARO quer ter
acesso a um ACO.

A fim de ajuda-lo aentender como tudo funciona em conjunto, vamos usar
um exemplo prático. Imagine, por um momento, um sistema de computador
usado por um grupo familiar de aventureiros do *Senhor dos Anéis Rings*.
O líder do grupo, Gandalf, quer gerenciar os bens do grupo enquando
mantém uma boa quantidade de privacidade e segurança para os outros
membros do grupo. A primeira coisa ele precisa criar uma lista de AROs
envolvidos:

-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

Perceba que o ACL *não* é a mesma coisa que autenticação. ACL é o que
acontece *depois* que um usuário está autenticado. Embora os dois são
geralmente usados em conjunto, ele é importante para realizar a
diferença entre saber quem é (autenticação) e saber o que ele fez (ACL).

A próxima coisa que Gandalf precisa fazer é uma lista inicial de coisas,
ou ACOs, o sistema irá tratar. Essa lista pode ser algo como:

-  Weapons
-  The One Ring
-  Salted Pork
-  Diplomacy
-  Ale

Tradicionalmente, sistemas eram gerenciados usando uma matriz, que
mostrava basicamente os usuários e permissões relacionado a objetos. Se
essa informação estava armazenada numa tabela, que poderia parecer com a
seguinte tabela:

Weapons

The Ring

Salted Pork

Diplomacy

Ale

Gandalf

Allow

Allow

Allow

Aragorn

Allow

Allow

Allow

Allow

Bilbo

Allow

Frodo

Allow

Allow

Gollum

Allow

Legolas

Allow

Allow

Allow

Allow

Gimli

Allow

Allow

Pippin

Allow

Allow

Merry

Allow

A primeira vista, parece que esse tipo de sistema poderia funcionar bem.
Atribuições podem ser feitas para proteger a segurança (apenas Frodo
pode ter acesso ao anel) e proteger contra acidentes. Parece de
granularidade suficiente, e mesmo assim fácil de ler, certo?

Para um sistema pequeno como esse, talvez uma matriz iria trabalhar. Mas
com o crescimento do sistema, ou o sistema com uma grande quantidade de
recursos (ACOs) e usuários (AROs), uma tabela pode se tornar pesada
rapidamente. Imagine tentando controlar o acesso de centenas de
acampamentos de guerra e tentando gerenciá-los por unidade. Outro
inconveniente de matrizes é que você não pode agrupar logicamente por
grupo de usuários ou fazer permissão em cascata mudando para grupos de
usuários baseados nesses agrupamentos lógicos. Por exemplo, seria bom
permitir automaticamente aos hobbits acesso para o ale e pork uma vez
que a batalha acabou. Fazendo isso um usuário indivualmente, seria
tediosa e propensa a erros. Fazendo permissão em cascata mudando para
todos 'hobbits' seria mais fácil.

ACL é geralmente implementado numa estrutura de árvore. Existe
geralmente uma árvore de AROs e uma árvore de ACOs. Para organizar seus
objetos em árvores, permissões podem ser tratadas de forma granulada.
Como líder, Gandalf elege ACL para usar no seu novo sistema, e organiza
seus objetos como nas seguintes linhas:

-  Fellowship of the Ring™

   -  Warriors

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards

      -  Gandalf

   -  Hobbits

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors

      -  Gollum

Usando uma estrutura de árvore ARO permite Gandalf definir permissões
que são aplicadas para entrada de grupos de usuários de uma só vez.
Então, usando sua árvore ARO, Gandalf pode mudar um pouco as permissões
baseado em grupo:

-  Fellowship of the Ring
   (**Deny**: all)

   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)

      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Visitors
      (**Allow**: Salted Pork)

      -  Gollum

Se nós queremos usar o ACL para ver se o Pippin tinha permissão para
acessar a cerveja, nós primeiro temos que obter o caminho na árvore, que
é Fellowship->Hobbits->Pippin. Então nós vemos diferentes permissões que
se encontram presente em cada um desses pontos, e usa a mais específica
permissão relacionada com Pippin e Cerveja.

+--------------------------+-------------------+---------------------------+
| ARO Node                 | Permission Info   | Result                    |
+==========================+===================+===========================+
| Fellowship of the Ring   | Deny all          | Denying access to ale.    |
+--------------------------+-------------------+---------------------------+
| Hobbits                  | Allow 'ale'       | Allowing access to ale!   |
+--------------------------+-------------------+---------------------------+
| Pippin                   | --                | Still allowing ale!       |
+--------------------------+-------------------+---------------------------+

Desde que o nó 'Pippin' na árvore ACL não especifica permissão negada
para a cerveja ACO, o resultado final é que nós permitimos acesso para
aquele ACO.

A mesma árvore nos permite fazer finos ajustes para um controle mais
granular - embora ainda mantendo a habilidade de fazer grandes mudanças
para os grupos AROs:

-  Fellowship of the Ring
   (**Deny**: all)

   -  Warriors
      (**Allow**: Weapons, Ale, Elven Rations, Salted Pork)

      -  Aragorn
         (Allow: Diplomacy)
      -  Legolas
      -  Gimli

   -  Wizards
      (**Allow**: Salted Pork, Diplomacy, Ale)

      -  Gandalf

   -  Hobbits
      (**Allow**: Ale)

      -  Frodo
         (Allow: Ring)
      -  Bilbo
      -  Merry
         (Deny: Ale)
      -  Pippin
         (Allow: Diplomacy)

   -  Visitors
      (**Allow**: Salted Pork)

      -  Gollum

Esta abordagem permite-nos tanto a capacidade de fazer alterações de
grande alcance nas permissões, mas também ajustes finos. Isso
permite-nos dizer que todos os hobbits podem ter acesso a cerveja, com
uma exceção; Merry. Para ver se Merry pode acessar a cerveja, nós temos
que procurar seu caminho na árvore: Fellowship->Hobbits->Merry e
trabalhar nosso caminho, e manter o rasto de permissões relacionadas a
cerveja:

+--------------------------+-------------------+---------------------------+
| ARO Node                 | Permission Info   | Result                    |
+==========================+===================+===========================+
| Fellowship of the Ring   | Deny all          | Denying access to ale.    |
+--------------------------+-------------------+---------------------------+
| Hobbits                  | Allow 'ale'       | Allowing access to ale!   |
+--------------------------+-------------------+---------------------------+
| Merry                    | Deny 'ale'        | Denying ale.              |
+--------------------------+-------------------+---------------------------+

Definindo Permissões: ACL do Cake baseado em arquivo INI
========================================================

A primeira implementação do ACL do Cake foi baseada em arquivos INI na
instalação do Cake. Enquanto ele é útil e estável, nós recomendamos que
você use a solução de base de dados do ACL, principalmente porque ele é
fácil para criar novos ACOs e AROs. Nos significou para usarmos em
aplicações simples - e especialmente para aquelas pessoas que talvez não
estejam usando uma base de dados por alguma razão.

Por padrão, o ACL do CakePHP é controlado banco de dados. Para habilitar
ACL baseado em arquivo INI, você precisará dizer ao CakePHP qual sistema
você está usando atualizando as seguintes linhas em app/config/core.php

::

    //Mude essas linhas:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');

    //Fica assim:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

Permissões ARO/ACO são especificadas em **/app/config/acl.ini.php**. A
idéia básica é que AROs são especificados na seção INI que possui três
propriedades: grupos, permissão e restrição.

-  grupos: nome de grupos ARO, esse ARO é membro de
-  permissão: nome de ACOs, esse ARO tem acesso à
-  restrição: nome de ACOs, esse ARO deve ser acesso restrito para

ACOs são especificados em seções INI que apenas incluem as propriedades
de permissão e restrição.

Como um exemplo, vamos ver a estrutura de companherismo ARO, a
elaboraçao seria semelhante a sintaxe INI:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    groups = warriors
    allow = diplomacy

    [legolas]
    groups = warriors

    [gimli]
    groups = warriors

    [gandalf]
    groups = wizards

    [frodo]
    groups = hobbits
    allow = ring

    [bilbo]
    groups = hobbits

    [merry]
    groups = hobbits
    deny = ale

    [pippin]
    groups = hobbits

    [gollum]
    groups = visitors

    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [warriors]
    allow = weapons, ale, salted_pork

    [wizards]
    allow = salted_pork, diplomacy, ale

    [hobbits]
    allow = ale

    [visitors]
    allow = salted_pork

Agora que você tem suas permissões definidas, você pode pular para `a
seção de controle de
permissão </pt/view/471/checking-permissions-the-acl-c>`_ usando o
componente ACL.

Definindo Permissões: Base de dados ACL do Cake
===============================================

Agora que você já sabe como funciona as permissões do ACL baseado em
arquivo INI, vamos analisar como usar permissões ACL através de banco de
dados (mais comumente utilizado).

Começando
---------

O padrão da implementação de permissões ACL é em base de dados. A base
de dados ACL do Cake consiste de um conjunto de modelos, e uma aplicação
console que vem com a instalação do Cake. Os modelos são usados pelo
Cake para intergir com a base de dados para armazenar e recuperar nós em
formato de árvore. A aplicação console é usada para inicializar sua base
de dados e interagir com suas árvores ACO e ARO.

Para começar, você precisa primeiro ter certeza que o arquivo
``/app/config/database.php`` está presente e configurado corretamente.
Veja a seção 4.1 para maiores informações sobre a configuração da base
de dados.

Mesmo que você tenha finalizado, use o console CakePHP para criar suas
tabelas da base de dados ACL:

::

    $ cake schema run create DbAcl

Rodando esse comando, ele irá apagar e re-criar as tabelas necessárias
para armazenar as informações em formato de árvore de ACO e ARO. A saída
da aplicação console deveria ser como a seguir:

::

    ---------------------------------------------------------------
    Cake Schema Shell
    ---------------------------------------------------------------

    The following tables will be dropped.
    acos
    aros
    aros_acos

    Are you sure you want to drop the tables? (y/n) 
    [n] > y
    Dropping tables.
    acos updated.
    aros updated.
    aros_acos updated.

    The following tables will be created.
    acos
    aros
    aros_acos

    Are you sure you want to create the tables? (y/n) 
    [y] > y
    Creating tables.
    acos updated.
    aros updated.
    aros_acos updated.
    End create.

Isso substitui um comando depreciado, "initdb".

Você pode mesmo usar o arquivo SQL que pode ser encontrado em
``app/config/sql/db_acl.sql``, mas isso não tem muita graça.

Quando terminado, você deveria ter três novas tabelas na sua base de
dados do seu sistema: acos, aros e aros\_acos (uma junção das tabelas
para criar informações de permissões entre as duas árvores).

Se você está curioso sobre como o Cake armazena as informações em àrvore
nessas tabelas, leia sobre modificação transversal em base de dados em
formato de árvore. O componente ACL usa o `Behavior
Tree </pt/view/91/tree-behavior>`_ do Cake para gerenciar as heranças
das árvores. Os arquivos de modelo de classes para ACL estão todos
compilados em um único arquivo
`db\_acl.php <https://api.cakephp.org/1.2/cake_2libs_2model_2db__acl_8php-source.html>`_.

Agora que você está sabendo tudo, vamos começar a trabalhar criando
algumas árvores ARO e ACO.

Criado Acesso de Requisição de Objetos (AROs) e Controle de Acesso a Objetos (ACOs)
-----------------------------------------------------------------------------------

Criando nos objetos ACL (ACOs e AROs), verifique que existem duas formas
principais de nomear e chamar nodes. A *primeira* forma é linkar o
objeto diretamente ao registro na sua base de dados, especificando um
nome de molode e um valor de chave estrangeira. A *segunda* forma pode
ser usada quando um objeto não tem uma relação direta com o registro em
sua base de dados - você pode fornecer um álias para o objeto.

Comumente, quando você está criando um grupo ou objeto de nível alto,
use um álias. Se você está gerenciando acesso para um item específico ou
registro na base de dados, use a forma modelo/chave estrangeira.

Você cria novos objetos ACL usando o núclo ACL do CakePHP. Fazendo isso,
existem um número de campos que você precisará usar quando estiver
salvando dados: ``model``, ``foreign_key``, ``alias``, e ``parent_id``.

Os campos ``model`` e ``foreign_key`` para um objeto ACL permite que
você ligar o objeto para ao seu modelo correspondente ao registro (se
existir algum). Por exemplo, muitos AROs terá registros User
correpondentes na base de dados. Setando um ARO ``foreign_key`` para o
User ID irá permitir você ligar ARO e informações User com um simples
modelo User find() chamado se você tiver setado corretamente as
associações de modelo. Inversamente, se você quer gerenciar operações de
edição em um post de blog específico ou listar receitas, você pode
escolher ligar um ACO a um registro específico de modelo.

O ``álias`` para um objeto ACL é apenas um rótulo que você pode usar
para identificar um objeto ACL que não tem correlação de registro modelo
direta. Álias são geralmente úteis nomeando grupo de usuários ou
coleções de ACO.

O ``parent_id`` para um objeto ACL permite você preencher a estrutura da
árvore. Forneça o ID do node filho na árvore para criar um novo filho.

Antes nós podemos criar novos objeto ACL, nós precisamos carregar essas
respectivas classes. A forma mais fácil para fazer isso é incluir o
componente ACL no seu array controladora $components array:

::

    var $components = array('Acl');

Depois de feito isso, vamos ver o que alguns desses exemplos de criação
de objetos se parecem. O código a seguir pode ser colocado em qualquer
lugar na action:

Enquanto os exemplos aqui focam a criação de ARO, as mesmas técnicas
podem ser usadas para criar uma árvore ACO.

Mantendo com a nossa configuração de Sociedade, vamos primeiro criar
nossos grupos ARO. Porque nossos grupos não têm registros específicos
vinculados a eles, nós iremos usar álias para criar esses objetos ACL. O
que nõs temos que fazer aqui é a partir da perspectiva da action da
controladora, mas pode ser feito em outro lugar. O que nós vamos cobrir
aqui é um pedaço da abordagem artificial, mas você deve se sentir
confortável para usar estas técnicas para construir AROs e ACOs em
situções reais.

Isso não deve ser algo drasticamente novo - nós estamos apenas usando
modelos para salvar dados como nós sempre fazemos:

::

    function anyAction()
    {
        $aro =& $this->Acl->Aro;
        
        //Aqui estão todas informações sobre nosso grupo num array 
        $groups = array(
            0 => array(
                'alias' => 'warriors'
            ),
            1 => array(
                'alias' => 'wizards'
            ),
            2 => array(
                'alias' => 'hobbits'
            ),
            3 => array(
                'alias' => 'visitors'
            ),
        );
        
        //Iterar e criar grupos ARO
        foreach($groups as $data)
        {
            //Lembre-se de chamar create() quando salvar em loops...
            $aro->create();
            
            //Save data
            $aro->save($data);
        }

        //Outras lógicas da action vão aqui...
    }

Uma vez que nós temos eles lá dentro, podemos usar a aplicação de
console do ACL para verificar a estrutura da árvore.

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors

      [2]wizards

      [3]hobbits

      [4]visitors

    ---------------------------------------------------------------

Eu suponho que não é muito de uma árvore esse ponto, mas pelo menos
temos alguma verificação que nós temos para os quatros principais
níveis. Vamos adicionar alguns filhos para esse node ARO, adicionando
seus usuários AROs específicos, debaixo desses grupos. Todos bons
cidadãos de Middle Earth tem uma conta no nosso sistema, então nós
iremos amarrar esses registros ARO para um modelo específico de
registros na nossa base de dados.

Quando adicionar nodes filhos para uma árvore, tenha certeza de usar o
node ID do ACL, invés de um valor foreign\_key.

::

    function anyAction()
    {
        $aro =new Aro();
        
            // Aqui são seus registros de usuário, lidos para serem ligados para os novos
            // registros ARO.
            // Esses dados devem vir do modelo e modificado, mas nós estamos usando estáticos
            // arrays aqui apenas para demostração
        
        $users = array(
            0 => array(
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ),
            1 => array(
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ),
            2 => array(
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ),
            3 => array(
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ),
            4 => array(
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ),
            5 => array(
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ),
            6 => array(
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ),
            7 => array(
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ),
            8 => array(
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ),
        );
        
        //Itera e cria AROs (como filhos)
        foreach($users as $data)
        {
            //Remember to call create() when saving in loops...
            $aro->create();

            //Save data
            $aro->save($data);
        }
        
        //Outras lógicas da action vão aqui...
    }

Tipicamente você não pode fornecer álias e um modelo/chave estrangeira,
mas nós estamos usando ambos aqui para fazer a estrutura de árvore mais
fácil para ler, mas apenas como demonstração.

A saída da aplicação de console deve ser agora um pouco mais
interessante. Vamos ver a possibilidade:

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors

        [5]Aragorn

        [6]Legolas

        [7]Gimli

      [2]wizards

        [8]Gandalf

      [3]hobbits

        [9]Frodo

        [10]Bilbo

        [11]Merry

        [12]Pippin

      [4]visitors

        [13]Gollum

    ---------------------------------------------------------------

Agora que nós tempos nossa árvore ARO contruída corretamente, vamos
discutir uma possível abordagem para estrutura uma árvore ACO. Embora
possamos estrutura mais de uma representação abstrata de nossa ACO, é
muitas vezes mais prático modelar uma árvore ACO depois de configurar as
Controladoras/Action do Cake. Nós temos cinco objetos principais que
temos de controlar em nosso cenário de Sociedade, e a configuração
natural para que em uma aplicação Cake está um grupo de modelos, e
finalmente os controladores que os manipulam. Passado os controladores,
nós vamos querer controlar acesso a actions específicas naquelas
controladoras.

Com base nessa idéia, vamos configurar uma árvore ACo que irá imitar o
setup de uma aplicação Cake. Pois temos cinco ACOs, nós iremos criar uma
árvore ACO que deve acabar procurando algo como a seguir:

-  Weapons
-  Rings
-  PorkChops
-  DiplomaticEfforts
-  Ales

Um detalhe legal sobre a configuração do ACL do Cake é que cada ACO
contém automaticamente quatro propriedades relacionadas a actions CRUD
(criar, pesquisar, atualizar e deletar). Você pode criar nodes filhos
abaixo de cada um desses cinco principais ACOs, mas usando o construtor
de gerenciamento de actions do Cake que abrange as operações básicas do
CRUD sobre um determinado objeto.

Uma vez que você está agora adicionando AROs, use aquelas mesmas
técnicas para criar essa árvore ACO. Criar esses níveis de grupos usando
o modelo ACO.

Atribuindo Permissões
---------------------

Depois de criar seus ACOs e AROs, nós podemos finalmente atribuir
permissões entre os dois grupos. Esse é feito usando o núcleo do
componente ACL. Vamos continuar com nosso exemplo.

Aqui nós iremos trabalhar no contexto da action da controladora. Nós
faremos porque as permissões são gerenciadas pelo componente ACL.

::

    class SomethingsController extends AppController
    {
        // Você pode querer colocar isso no AppController
        // mas aqui funciona muito bem também

        var $components = array('Acl');

    }

Vamos confugurar algumas permissões básicas usando o componente
AclComponent na action dentro dessa controladora.

::

    function index()
    {
            // Permite guerreiros (warriors) a acesso completa a armas (weapons)
            // Ambos exemplos usam a sintaxe de álias
        $this->Acl->allow('warriors', 'Weapons');
        
            // Embora o rei não possa querer todos
            // tem acesso ilimitado
        $this->Acl->deny('warriors/Legolas', 'Weapons', 'delete');
        $this->Acl->deny('warriors/Gimli',   'Weapons', 'delete');
        
        die(print_r('done', 1));
    }

A primeiro conjuneto de chamadas nós fazemos para o AclComponent permir
que qualquer usuário abaixo do grupo ARO 'warriors' tenha acesso
completo a qualquer coisa abaixo do grupo ACO 'Weapons'. Aqui estamos
apenas abordando os ACOs e AROs pelo seus álias.

Observou o uso do terceiro parâmetro? Isso é onde nós usamos aqueles
controles que estão dentro de todos ACO Cake. A opção padrão para que os
parâmetros são ``create``, ``read``, ``update``, e ``delete`` mas você
pode adicionar uma coluna na tabela ``aros_acos`` (prefixado com \_ -
por exemplo ``_admin``) e usá-lo juntamente com os padrões.

O segundo conjunto de chamadas é uma tentativa de fazer decisão de
permissão de granularidade alta. Nós queremos que Aragorn mantenha seu
privilégio de acesso, mas recusar que outros guerreiros do grupo tenha
permissão para deletar registros de armas. Nós estamos usando álias para
resolver o AROs acima, mas você pode querer usar a sintaxe modelo/chave
estrangeira. O que nós temos acima é equivalente a isso:

::

    // 6342 = Legolas
    // 1564 = Gimli

    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 6342), 'Weapons', 'delete');
    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 1564), 'Weapons', 'delete');

Endereçando um node usando a sintaxe álias usa o delimitador '/'
('/users/employees/developers'). Endereçando um node usando a sintaxe
modelo/chave estrangeira usa um array com dois parâmetros:
``array('model' => 'User', 'foreign_key' => 8282)``.

A próxima seção irá nos ajudar a validar nossa configuração usando o
AclComponent para checar as permissões que acabamos de criar.

Checando Permissões: O Componente ACL
-------------------------------------

Vamos usar o AclComponent para ter certeza que dwarves e elves não podem
remover coisas do depósito de armas. Nesse ponto, deveríamos ser capazes
de utilizar o AlcComponent para fazer a verificação entre os ACOs e AROs
que criamos. O comando básico para fazer a verificação das permissões é:

::

    $this->Acl->check( $aro, $aco, $action = '*');

Vamos tentar dar-lhe uma action dentro da controladora:

::

    function index()
    {
        //Isso tudo retorna true:
        $this->Acl->check('warriors/Aragorn', 'Weapons');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'create');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'read');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'update');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'delete');
        
        //Lembre-se, nós podemos usar a sintaxe model/foreign key 
        //para nossos usuários AROs
        $this->Acl->check(array('model' => 'User', 'foreign_key' => 2356), 'Weapons');
        
        //Isso também vai retornar true:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'create');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'read');
        
        //Mas isso retorna false:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'delete');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'delete');
    }

O uso aqui é demonstração, mas espero que você pode ver como é verificar
como esta pode ser utilizada para decidir se quer ou não permitir que
aconteça alguma coisa, mostrar uma mensagem de erro, ou redirecionar o
usuário para um login
