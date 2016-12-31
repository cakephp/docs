Components
##########

 

Introdução
==========

Componentes (components) são pacotes com funções lógicas que são usadas
para serem compartilhadas entre os controladores. Se você está querendo
copiar e colar coisas entre os controladores, você pode criar
funcionalidades em componentes para isso.

O CakePHP já vem com um conjunto de componentes para os mais diversos
usos, por exemplo:

-  Segurança
-  Sessões
-  Lista de controle de acessos (ACL)
-  E-mails
-  Cookies
-  Autenticação
-  Manipulação de requisições

Cada um dos componentes será explicado em outros capítulos. Por
enquanto, mostraremos apenas como criar seus próprios componentes.
Criando componentes ajuda a manter o código do controlador limpo e
permite que você reuse o código entre os projetos ou controladores.

Configurando Components
=======================

Muitos dos componentes núcleo precisam ser configurados. Alguns exemplos
desses tipos de componentes são
`Auth <https://book.cakephp.org/pt/view/172/Authentication>`_,
`Cookie <https://book.cakephp.org/pt/view/177/Cookies>`_ e
`Email <https://book.cakephp.org/pt/view/176/Email>`_. Toda configuração
desses componentes, e de outros componentes em geral, é feita no método
``beforeFilter()`` do seu controlador.

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }

Um exemplo de como configurar as variáveis do componente no
``beforeFilter()`` do seu controller.

É possível, no entanto, um componente requerir certas opções de
configuração para ser ajustado antes do ``beforeFilter`` do controller
ser executado. Para este fim, alguns componentes permitem opções de
configuração sejam ajustados no array ``$components``.

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session'));

Consulte a documentação relevante para determinar qual opção de
configuração cada componente provê.

Os componentes podem ter os ``callbacks`` ``beforeRender`` e
``beforeRedirect`` que são chamados antes da sua página ser renderizada
e antes de ser redirecionado, respectivamente.

Você pode desabilitar as chamadas destes ``callbacks`` ajustando a
propriedade do componente desejado como ``false``

Componente callbacks
====================

Embora os componentes fornecem uma maneira de criar o código controlador
reutilizável, isso executa uma taréfa especifica. Componentes igualmente
oferecem uma maneira de enganchar no fluxo geral da aplicação. Há 5
ganchos pré definidos, e muito mais podem ser criados dinamicamente
usando ``Component::triggerCallback``.

Os core callbacks são:

-  **initialize()** é acionado antes beforeFilter do controlador, mas
   depois que os modelos forem construídos.
-  **startup()** é acionado após beforeFilter dos controladores, mas
   antes da ação do controlador.
-  **beforeRender()** é acionado antes da view ser renderizada.
-  **beforeRedirect()**\ é acionado antes de um redirecionamento é feito
   a partir de um controlador. Você pode usar o retorno da chamada para
   substituir a url a ser utilizada para o redirecionamento.
-  **shutdown()** é acionado após rendereziar a view e é processado
   antes que a resposta é retornada.

Você pode adicionar métodos adicionais para os seus componentes, e
chamar esses métodos, a qualquer momento, usando
``Component::triggerCallback()``. Se você tivesse acrescentado um
``onAccess`` callback para os seus componentes. Você pode disparar
aquele callback a partir do controlador chamando
``$this->Component->triggerCallback('onAccess', $this);``

Você pode desativar o o retorno do callback, definindo para ``false``.

Criando Componentes
===================

Suponha que sua aplicação online precisa utilizar funções complexas de
matemática em diversas partes da aplicação. Poderíamos, então, criar um
componente para que esta lógica seja compartilhada entre diversos
controladores.

O primeiro passo é criar um arquivo para o componente e uma classe. Crie
o arquivo em /app/controllers/components/math.php. A estrutura básica do
arquivo do componente é similar a apresentada abaixo.

::

    <?php

    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }
    }

    ?>

Quando seu componente estiver criado, nós podemos utilizá-lo nos
controladores da aplicação colocando o nome do componente no vetor da
variável $components:

::

    // Isso faz com que o novo componente possa ser acessado usando $this->Math

    var $components = array('Math', 'Session');

Incluindo Componentes em seus Controladores
-------------------------------------------

Uma vez que o componente está finalizado, nós podemos usar ele nos
controladores de nossa aplicação colocando o nome do componente (sem a
parte "*Component*\ ") na variável $components do controlador,
permitindo que possamos acessar uma instância do mesmo.

::

    /* Fazendo com que o componente esteja disponível através 
    de $this->Math, bem como o padrão $this->Session */
    var $components = array('Math', 'Session');

Componente declarados em ``AppController`` serão mesclados com os outros
de seus controladores. Então não é necessário redeclarar o mesmo
componente duas vezes.

Quando estiver incluindo Componentes em um Controlador você também pode
declarar parâmetros que serão passadas para o método ``initialize()`` do
Componente. Estes parâmetros podem ser tratados pelo Componente.

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'randomGenerator' => 'srand'
        ),
        'Session', 'Auth'
    );

Acima será passado um vetor contendo os parâmetros *precision* e
*randomGenerator* para o método initialize() do componente
MathComponent's.

Esta sintaxe não esta implementada em nenhum Componente padrão do
CakePHP até o momento

Acessando classes do MVC de dentro dos componentes
--------------------------------------------------

Os componentes possuem um número de callbacks usados pela classe
controller pai. O uso sensato destes callbacks podem fazer criar e usar
compomentes muito fácil

initialize($controller, $settings=array())

O método initialize é chamado antes do método beforeFilter do controller

startup($controller)

O método startup é chamado depois do método beforeFilter do controle,
mas antes do controller executar a action corrente.

beforeRender($controller)

O método beforeRender é chamado depois do método beforeRender do
controller, mas antes do controller renderizar a view e o layout.

shutdown($controller)

O método shutdown é chamado antes da saída ser enviada ao browser.

beforeRedirect($controller, $url, $status=null, $exit=true)

O método beforeRedirect é invocado quando o método redirect do
controller é chamado, mas antes de qualquer outra action. Se este método
retornar false o controller não continuará na requisição de
redirecionamento. As variáveis $url, $status e $exit tem os mesmos
significados como o método do controller.

Aqui está um component esqueleto que você pode usar como um template
para seus próprios components personalizados.

::

    <?php
    class SkeletonComponent extends Object {
        //chamado antes do Controller::beforeFilter()
        function initialize($controller, $settings = array()) {
            // salvando a referência do controller para uso posterior
            $this->controller = $controller;
        }

        //chamado depois do Controller::beforeFilter()
        function startup($controller) {
        }

        //chamado depois do Controller::beforeRender()
        function beforeRender($controller) {
        }

        //chamado depois do Controller::render()
        function shutdown($controller) {
        }

        //chamado antes do Controller::redirect()
        function beforeRedirect($controller, $url, $status=null, $exit=true) {
        }

        function redirectSomewhere($value) {
            // utilizando um método de controller
            $this->controller->redirect($value);
        }
    }
    ?>

Você deve também querer utilizar outro componente dentro de um
componente personalizado. Para fazer isso, apenas crie uma variável de
classe $components (exatamente como você faria em um controller) como um
array que contém os nomes dos components que você deseja utilizar.

::

    <?php
    class MyComponent extends Object {

        // Este componente usa outros componentes
        var $components = array('Session', 'Math');

        function doStuff() {
            $result = $this->Math->doComplexOperation(1, 2);
            $this->Session->write('stuff', $result);
        }

    }
    ?>

Acessar ou usar um model em um component não é muito recomendado; Se
você acabar precisando usar um, você precisa instanciar sua model class
e usá-la manualmente. Aqui vai um exemplo:

::

    <?php
    class MathComponent extends Object {
        function doComplexOperation($amount1, $amount2) {
            return $amount1 + $amount2;
        }

        function doReallyComplexOperation ($amount1, $amount2) {
            $userInstance = ClassRegistry::init('User');
            $totalUsers = $userInstance->find('count');
            return ($amount1 + $amount2) / $totalUsers;
        }
    }
    ?>

Usando outros Componentes em seu Componente
-------------------------------------------

Em alguns momentos um de seus componentes precisa usar outro componente.

Você pode incluir outro componente em seu componente da mesma maneira
que você inclui eles nos controladores: Use a variável ``$components``.

::

    <?php
    class CustomComponent extends Object {
        var $name = "Custom"; // o nome do componente
        var $components = array( "Existing" ); // o outro componente que você deseja usar

        function initialize(&$controller) {
            $this->Existing->foo();
        }

        function bar() {
            // ...
        }
    }
    ?>

::

    <?php
    class ExistingComponent extends Object {
        var $name = "Existing";

        function initialize(&$controller) {
            $this->Parent->bar();
        }

        function foo() {
            // ...
        }
    }
    ?>

