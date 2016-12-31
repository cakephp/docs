AJAX
####

O AjaxHelper utiliza as populares bibliotecas Javascript Prototype e
script.aculo.us para operações Ajax e efeitos no lado do cliente. Para
usar o AjaxHelper, você precisa que a versão atual destas bibliotecas
Javascript (obtidas a partir de
`www.prototypejs.org <http://www.prototypejs.org>`_ e
`http://script.aculo.us <http://script.aculo.us/>`_) estejam presentes
na pasta /app/webroot/js/. Além disso, você deve incluir as bibliotecas
Javascript Prototype e script.aculo.us em todos os layouts ou views que
utilizarem funcionalidade do AjaxHelper.

Você vai precisar incluir os helpers Ajax e Javascript em seus
controllers:

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Uma vez que você tenha o JavascriptHelper incluído em seu controller,
você pode usar o método link() do helper javascript para incluir as
bibliotecas Prototype e Scriptaculous:

::

    echo $javascript->link('prototype');
    echo $javascript->link('scriptaculous'); 

Agora você já pode usar o AjaxHelper em sua view:

::

    $ajax->whatever();

Se o componente `RequestHandler </pt/view/174/request-handling>`_ for
incluído no controller, então o CakePHP poderá aplicar automaticamente o
layout Ajax quando uma ação for requisitada via AJAX

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

Opções do AjaxHelper
====================

A maioria dos métodos do AjaxHelper precisam que você informe um array
$options. Você pode usar este array para configurar como o AjaxHelper se
comporta. Antes de abordarmos os métodos específicos do helper, vamos
dar uma olhada nas diferentes opções disponíveis através deste array
especial. Você vai querer consultar esta seção quando começar a usar os
métodos do AjaxHelper.

Opções Gerais
-------------

chaves do array ``$option``

Descrição

``$options['evalScripts']``

Determina se as tags do script no conteúdo retornado são avaliadas.
Definido para *true* por padrão.

``$options['frequency']``

O intervalo de tempo em segundos entre verificações baseadas em algum
intervalo.

``$options['indicator']``

O id do elemento DOM a ser mostrado enquanto uma requisição estiver
sendo carregada e a ser escondido quando a requisição estiver concluída.

``$options['position']``

Para inserir, ao invés de substituir, utilize esta opção para
especificar a posição de inserção como *top*, *bottom*, *after*, ou
*before*.

``$options['update']``

O id do elemento DOM a ser atualizado com o conteúdo retornado pela
requisição.

``$options['url']``

A URL do controller/action que você quer chamar.

``$options['type']``

Indica se uma requisição deve ser 'syncrhonous' (síncrona) ou
'asynchronous' (assíncrona). 'asynchronous' é o valor default.

``$options['with']``

Uma string, no formato de URL, a qual será adicionada à URL para métodos
get, ou no corpo da requisição post para qualquer outro método. Exemplo:
``x=1&foo=bar&y=2``. Os parâmetros estarão disponíveis através de
``$this->params['form']`` ou de ``$this->data`` dependendo do formato.
Para mais informações, leia sobre o método `serialize do
Prototype <http://www.prototypejs.org/api/form/serialize>`_.

Opções de Callback
------------------

As opções de callback permitem que você chame funções Javascript a
partir de pontos específicos de seu processo de requisição. Se você
estiver procurando por uma maneira de inserir um pouco de lógica antes,
depois ou durante suas operações com o AjaxHelper, você pode utilizar
estes callbacks para isso.

opções do array $options

Descrição

$options['condition']

Trecho de código Javascript que precisa resultar em verdadeiro (*true*)
antes da requisição ser iniciada.

$options['before']

Executado antes da requisição ser realizada. Um uso comum para este
callback é permitir a visibilidade de um indicador de progresso.

$options['confirm']

Texto a ser exibido num diálogo de confirmação Javascript antes de
proceder com a requisição.

$options['loading']

Código de callback a ser executado enquanto os dados estiverem sendo
obtidos do servidor.

$options['after']

Javascript chamado imediatamente depois da requisição; é disparado antes
que o callback $options['loading'] execute.

$options['loaded']

Código de callback a ser executado quando o documento remoto tiver sido
recebido pelo cliente.

$options['interactive']

Chamado quando o usuário puder interagir com o documento remoto, mesmo
que ainda não tenha terminado de carregar o documento.

$options['complete']

Callback de Javascript a ser executado quando o XMLHttpRequest estiver
concluído.

Métodos
=======

link
----

``link(string $title, string $href, array $options, string $confirm, boolean $escapeTitle)``

Retorna um link para uma action remota definida por ``$options['url']``
ou ``$href`` e que será chamada em segundo plano usando-se o
XMLHttpRequest quando o link for clicado. O resultado da requisição pode
ser posto dentro de um objeto DOM cujo id pode ser dado por
``$options['update']``.

Se a chave ``$options['url']`` estiver em branco, href será considerada
em seu lugar

Exemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Visualizar Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1 ), 
        array( 'update' => 'post' )
    ); 
    ?>

Por padrão, essas requisições remotas são processadas de maneira
assíncrona, durante a qual vários callbacks podem ser disparados

Exemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Visualizar Post', 
        array( 'controller' => 'posts', 'action' => 'post', 1 ), 
        array( 'update' => 'post', 'complete' => 'alert( "Olá Mundo!" )'  )
    ); 
    ?>

Para processar as requisições de maneira síncrona, especifique a chave
``$options['type'] = 'synchronous'``.

Para definir automaticamente o layout ajax, inclua o componente
*RequestHandler* em seu controller

Por padrão, o conteúdo do elemento alvo é substituído. Para modificar
isto, defina a chave ``$options['position']``

Exemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Visualizar Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1), 
        array( 'update' => 'post', 'position' => 'top'  )
    ); 
    ?>

A chave ``$confirm`` pode ser usada para disparar uma mensagem com
Javascript confirm() antes de a requisição ser executada, permitindo ao
usuário evitar a execução

Exemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Excluir Post', 
        array( 'controller' => 'posts', 'action' => 'delete', 1 ), 
        array( 'update' => 'post' ),
        'Você quer mesmo excluir este post?'
    ); 
    ?>

remoteFunction
--------------

``remoteFunction(array $options);``

Este método cria o código Javascript necessário para fazer uma chamada
remota. É usada principalmente como um auxiliar para link(). Assim,
acaba não sendo muito utilizado, a menos que você precise gerar scripts
personalizados.

O array ``$options`` para este método são os mesmos disponíveis para o
método ``link``

Exemplo:

::

    <div id="post">
    </div>
    <script type="text/javascript">
    <?php echo $ajax->remoteFunction( 
        array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ), 
            'update' => 'post' 
        ) 
    ); ?>
    </script>

Também pode-se associar este método a atrivutos de evento HTML:

::

    <?php 
        $remoteFunction = $ajax->remoteFunction( 
            array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
            'update' => 'post' ) 
        ); 
    ?>
    <div id="post" onmouseover="<?php echo $remoteFunction; ?>" >
    Passe o Mouse Aqui
    </div>

Se a chave ``$options['update']`` não for definida, o navegador irá
ignorar a resposta do servidor.

remoteTimer
-----------

``remoteTimer(array $options)``

Chama periodicamente a ação definida em ``$options['url']``, a cada
``$options['frequency']`` segundos. Este método normalmente é usado para
atualizar um div específico (definido por ``$options['update']``) com o
resultado da chamada remota. Callbacks podem ser usados.

O método ``remoteTimer`` é o mesmo que o ``remoteMethod``, exceto pelo
parâmetro extra ``$options['frequency']``

Exemplo:

::

    <div id="post">
    </div>
    <?php
    echo $ajax->remoteTimer(
        array(
        'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
        'update' => 'post', 'complete' => 'alert( "requisição concluída" )',
        'position' => 'bottom', 'frequency' => 5
        )
    );
    ?>

Por padrão ``$options['frequency']`` tem o valor de 10 segundos.

form
----

``form(string $action, string $type, array $options)``

Retorna uma tag form que submete para a $action usando XMLHttpRequest ao
invés de uma requisição HTTP normal via $type ('post' ou 'get'). Fora
isso, as submissões do formulário funcionam exatamente da mesma maneira:
os dados submetidos ficam disponível como $this->data dentro de seus
controllers. Se $options['update'] for especificada, o elemento referido
será atualizado com o documento resultante. Callbacks podem ser usados.

O array de opções deve incluir o nome do model, p.ex.

::

    $ajax->form('edit','post',array('model'=>'User','update'=>'UserInfoDiv'));

Alternativamente, se você precisar fazer um post cruzado para outro
controller a partir de seu form:

::

    $ajax->form(array('type' => 'post',
        'options' => array(
            'model'=>'User',
            'update'=>'UserInfoDiv',
            'url' => array(
                'controller' => 'comments',
                'action' => 'edit'
            )
        )
    ));

submit
------

``submit(string $title, array $options)``

Retorna um botão submit que submete o formulário especificado pelo id
DOM por $options['with'] via XMLHttpRequest.

observeField
------------

``observeField(string $fieldId, array $options)``

Observa o campo cujo id DOM for especificado por $fieldId (a cada
$options['frequency'] segundos), criando um XMLHttpRequest quando seu
conteúdo for modificado.

Quando nenhum intervalo de frequência ou um intervalo de frequência
pequeno (entre 0 e 1) é especificado, um ``Form.Element.EventObserver``
será usado ao invés de um ``Form.Element.Observer``. O
``Form.Element.EventObserver`` não é temporizado e vai executar assim
que o valor do elemento observado mudar.

::

    <?php echo $form->create( 'Post' ); ?>
    <?php $titles = array( 1 => 'Tom', 2 => 'Dick', 3 => 'Harry' ); ?>   
    <?php echo $form->input( 'title', array( 'options' => $titles ) ) ?>
    </form>

    <?php 
    echo $ajax->observeField( 'PostTitle', 
        array(
            'url' => array( 'action' => 'edit' ),
            'frequency' => 0.2,
        ) 
    ); 
    ?>

O método ``observeField`` utiliza as mesmas opções que o método ``link``

O campo o qual será enviado pode ser definido com ``$options['with']``.
O valor padrão neste caso é ``Form.Element.serialize('$fieldId')``. Os
dados submetidos ficam disponível em ``$this->data`` dentro de seus
controllers. Callbacks podem ser usados com este método.

Para enviar o formulário inteiro quando o campo for modificado, utilize
``$options['with'] = Form.serialize( $('Form ID') )``

observeForm
-----------

``observeForm(string $fieldId, array $options)``

Semelhante ao observeField(), mas opera em cima de um formulário inteiro
cujo id DOM seja identificado por $form\_id. O array de $options neste
caso é o mesmo que para observeField(), exceto que o valor padrão para a
chave $options['with'] avalia para o conteúdo serializado (string de
requisição) do formulário.

autoComplete
------------

``autoComplete(string $fieldId, string $url,  array $options)``

Renderiza um campo text cujo id é dado por $fieldId com recurso de
autocompletar. A ação remota dada por $url deve retornar uma lista de
termos adequados em questão. Quase sempre, uma lista não ordenada é
usada para isto. Em primeiro lugar, você precisa definir uma action de
um controller que obtenha e organize os dados que você vai precisar para
sua lista, baseado na entrada do usuário:

::

    function autoComplete() {
        // Strings parciais virão com o campo autocomplete como
        // $this->data['Post']['subject'] 
        $this->set('posts', $this->Post->find('all', array(
                    'conditions' => array(
                        'Post.subject LIKE' => $this->data['Post']['subject'].'%'
                    ),
                    'fields' => array('subject')
        )));
        $this->layout = 'ajax';
    }

A seguir, crie um ``app/views/posts/auto_complete.ctp`` que utilize
estes dados e crie uma lista não-ordenada em (X)HTML:

::

    <ul>
     <?php foreach($posts as $post): ?>
         <li><?php echo $post['Post']['subject']; ?></li>
     <?php endforeach; ?>
    </ul> 

Finalmente, utilize o método autoComplete() em uma view para criar seu
campo de formulário autocompletável:

::

    <?php echo $form->create('User', array('url' => '/users/index')); ?>
        <?php echo $ajax->autoComplete('Post.subject', '/posts/autoComplete')?>
    <?php echo $form->end('Visualizar Post')?>

Uma vez que você tenha uma chamada autoComplete() funcionando
corretamente, utilize CSS para estilizar a caixa de sugestão do
autocompletar. Você vai acabar usando algo como:

::

    div.auto_complete    {
         position         :absolute;
         width            :250px;
         background-color :white;
         border           :1px solid #888;
         margin           :0px;
         padding          :0px;
    } 
    li.selected    { background-color: #ffb; }

isAjax
------

``isAjax()``

Permite a você conferir se a requisição atual é uma requisição de Ajax
do Prototype dentro de uma view. Retorna um booleano. Por ser usado para
lógica de apresentação para ocultar/exibir blocos de conteúdos.

drag & drop
-----------

``drag(string $id, array $options)``

Torna arrastável (do inglês, *drag*) o elemento cujo id DOM é
especificado por $id. Para mais informações sobre os parâmetros aceitos
por $options, veja
`https://github.com/madrobby/scriptaculous/wikis/draggable <https://github.com/madrobby/scriptaculous/wikis/draggable>`_.

Opções comuns podem incluir:

+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| chaves do array $options   | Descrição                                                                                                                                                                                                                                                                                                                               |
+============================+=========================================================================================================================================================================================================================================================================================================================================+
| $options['handle']         | Define se o elemento deve ser arrastável apenas por um manipulador embutido. Seu valor deve ser uma referência a um elemento, um id ou uma string referenciando uma classe CSS. O primeiro elemento filho/neto/etc. que for encontrado dentro do elemento e que tenha o valor da classe CSS especificada será usado como manipulador.   |
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['revert']         | Se definida para true, o elemento retorna à sua posição original quando o arraste terminar. Esta opção revert também pode ser uma referência a uma função arbitrária, que será chamada quando o arraste terminar.                                                                                                                       |
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['constraint']     | Restringe o arraste apenas ao eixo 'horizontal' ou 'vertical'. Deixe branco para não impor qualquer restrição.                                                                                                                                                                                                                          |
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``drop(string $id, array $options)``

Faz com que o elemento, cujo id DOM é especificado por $id, aceite
elementos soltos (do inglês, *drop*) depois de se arrastar. Parâmetros
adicionais podem ser especificados em $options. Para mais informações,
veja
`https://github.com/madrobby/scriptaculous/wikis/droppables <https://github.com/madrobby/scriptaculous/wikis/droppables>`_.

Opções comuns incluem:

+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| chaves do array $options   | Descrição                                                                                                                                                                                                                                      |
+============================+================================================================================================================================================================================================================================================+
| $options['accept']         | Defina para uma string ou um array de strings em Javascript descrevendo as classes CSS que os elementos soltáveis irão aceitar. O elemento em questão irá aceitar apenas os elementos em questão que contenham as classes CSS especificadas.   |
+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['containment']    | O elemento zona de soltura irá aceitar apenas elementos arrastáveis se estiverem contidos nos elementos dados (ids de elementos). Pode ser uma string ou um array de strings em Javascript de ids de referências.                              |
+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['overlap']        | Se definido com os valores 'horizontal' ou 'vertical', o elemento zona de soltura só irá reagir aos elementos arrastáveis se estes já estiverem cobrindo mais de 50% por cima do eixo referido.                                                |
+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['onDrop']         | Um callback de Javascript que é chamado quando o elemento arrastável for solto dentro do elemento zona de soltura.                                                                                                                             |
+----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``dropRemote(string $id, array $options)``

Faz um alvo de soltura que cria um XMLHttpRequest quando um elemento
arrastável for solto dentro dele. O array $options para este método é o
mesmo que pode ser usado pelos métodos drop() e link().

slider
------

``slider(string $id, string $track_id, array  $options)``

Cria um controle deslizante direcional. Para mais informações, veja
`http://wiki.github.com/madrobby/scriptaculous/slider <http://wiki.github.com/madrobby/scriptaculous/slider>`_.

Opções comuns incluem:

chaves do array $options

Descrição

$options['axis']

Define o eixo no qual o controle deslizante se apresenta, se
'horizontal' ou 'vertical'. O padrão é horizontal.

$options['handleImage']

O id da imagem que representa o manipulador. É usado para trocar entre o
src da imagem desabilitada pelo da imagem normal quando o controle
deslizante for habilitado. É usado em conjunto com handleDisabled.

$options['increment']

Define a relação de pixels entre os valores. Definir o valor 1 fará com
que cada pixel que o controle for movido, ajustará o valor do elemento
em uma unidade.

$options['handleDisabled']

O id da imagem que vai representar o manipulador quando estiver
desabilitado. É usado para trocar entre o src da imagem desabilitada
pelo da imagem normal quando o controle deslizante for habilitado. É
usado em conjunto com handleDisabled. É usado em conjunto com
handleImage.

$options['change']
 $options['onChange']

Callbacks de Javascript disparados quando o elemento deslizante tiver
terminado de ser movido ou tiver seu valor modificado. A função de
callback recebe o valor atual do slides com um parâmetro.

$options['slide']
 $options['onSlide']

Callbacks de Javascript que são chamados toda vez que o elemento
deslizando for movido por arraste. A função de callback recebe o valor
atual do slides com um parâmetro.

editor
------

``editor(string $id, string $url, array $options)``

Cria um editor de texto no elemento com id DOM especificado. O parâmetro
``$url`` deve ser uma action que seja responsável por salvar os dados do
elemento. Para mais informações e demonstrações, veja
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor>`_.

Opções comuns incluem:

chaves do array $options

Descrição

``$options['collection']``

Ativa o modo 'collection' de edição. $options['collection'] leva um
array que é convertido em opções para o select. Para aprender mais sobre
collection veja
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor>`_.

``$options['callback']``

Uma função a ser executada antes da requisição ser enviada ao servidor.
Isto pode ser usado para formatar a informação enviada ao servidor. A
assinatura da função de callback é ``function(form, value)``.

``$options['okText']``

O texto do botão submit no modo edit.

``$options['cancelText']``

O texto do link que cancela a edição.

``$options['savingText']``

O texto exibido enquanto o conteúdo do texto editado for enviado ao
servidor.

``$options['formId']``

``$options['externalControl']``

``$options['rows']``

A altura do campo, em linhas de texto.

``$options['cols']``

A quantidade de colunas que o campo textarea deve ocupar.

``$options['size']``

Sinônimo de ‘cols’, quando utilizando uma única linha.

``$options['highlightcolor']``

A cor de destaque de texto.

``$options['highlightendcolor']``

A cor que é interpolada para a cor de destaque (efeito fade).

``$options['savingClassName']``

``$options['formClassName']``

``$options['loadingText']``

``$options['loadTextURL']``

Exemplo

::

    <div id="in_place_editor_id">Texto a ser editado</div>
    <?php
    echo $ajax->editor( 
        "in_place_editor_id", 
        array( 
            'controller' => 'Posts', 
            'action' => 'update_title',
            $id
        ), 
        array()
    );
    ?>

sortable
--------

``sortable(string $id, array $options)``

Torna ordenáveis uma lista ou grupo de objetos flutuantes que estejam
contidos no elemento dado por $id. O array $options suporta diversos
parâmetros. Para saber mais sobre sortable, veja
`http://wiki.github.com/madrobby/scriptaculous/sortable <http://wiki.github.com/madrobby/scriptaculous/sortable>`_.

Opções comuns incluem:

chaves do array $options

Descrição

$options['tag']

Indica que tipo de elementos filhos do container serão tornados
ordenáveis. O padrão é 'li'.

$options['only']

Permite filtragem a posteriori dos elementos filhos. Aceita uma classe
CSS.

$options['overlap']

Assume os valores 'vertical' ou 'horizontal'. O padrão é vertical.

$options['constraint']

Restringe o movimento dos elementos arrastáveis. Aceita os valores
'horizontal' ou 'vertical'. O padrão é vertical.

$options['handle']

Faz com que os elementos arrastáveis (Draggables) utilizem
manipuladores. Consulte sobre a opção handle em Draggables.

$options['onUpdate']

Chamado quando o arraste terminar e a ordem do elemento ordenável tiver
sido modificada de alguma maneira. Ao arrastar algum elemento ordenável
para outro, o callback é chamado uma vez para cada um dos elementos.

$options['hoverclass']

Inclui ao elemento zona de soltura uma classe hover.

$options['ghosting']

Se definido para true, os elementos ordenáveis arrastados sejam clonados
e apareçam como fantasmas, ao invés de manipular-se diretamente o
elemento original.
