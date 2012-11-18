Session
#######

Como uma contraparte natural do componente Session, o helper Session
replica a maioria das funcionalidades do componente e as disponibiliza
em sua view. O helper Session é adicionado automaticamente às suas view
— não é necessário adicioná-lo ao array ``$helpers`` do controller.

A principal diferença entre o helper Session e o componente Session é
que o helper *não* tem a capacidade de escrever na sessão.

Bem como o componente Session, os dados são escritos e lidos usando-se
estruturas de dados separadas por pontos.

::

        array('User' => 
                array('username' => 'super@exemplo.com')
        );

Dada a estrutura de array anterior, o nó deveria ser acessado por
User.username, com o ponto indicando o array interno. Esta notação é
usada por todos os métodos do helper Session em que um índice $key seja
usado.

Métodos
=======

read($key)

Lê um valor da sessão. Retorna uma string ou array dependendo do
conteúdo da sessão.

id()

Retorna o ID da sessão atual.

check($key)

Verifica se o índice $key existe na sessão. Retorna um valor booleano
dependendo se o índice existe ou não.

flash($key)

Irá exibir o conteúdo de $\_SESSION.Message. É usado em conjunto com o
método setFlash() do componente Session.

error()

Retorna o último erro na sessão, se algum existir.

flash
=====

O método flash usa o índice padrão definido por ``setFlash()``. Você
também pode recuperar índices específicos na sessão. Por exemplo, o
componente Auth define todas as suas mensagens na sessão numa variável
sob o índice 'auth'

::

    // código no controller
    $this->Session->setFlash('Minha Mensagem');

    // na view
    $session->flash();
    // exibe "<div id='flashMessage' class='message'>Minha Mensagem</div>"

    // exibe a mensagem do AuthComponente, se definida
    $session->flash('auth');

Using Flash for Success and Failure
-----------------------------------

In some web sites, particularly administration backoffice web
applications it is often expected that the result of an operation
requested by the user has associated feedback as to whether the
operation succeeded or not. This is a classic usage for the flash
mechanism since we only want to show the user the result once and not
keep the message.

One way to achieve this is to use Session->flash() with the layout
parameter. With the layout parameter we can be in control of the
resultant html for the message.

In the controller you might typically have code:

::

    if ($user_was_deleted) {
        $this->Session->setFlash('The user was deleted successfully.', 'flash_success');
    } else {
        $this->Session->setFlash('The user could not be deleted.', 'flash_failure');
    }

The flash\_success and flash\_failure parameter represents an element
file to place in the root app/views/elements folder, e.g.
app/views/elements/flash\_success.ctp,
app/views/elements/flash\_failure.ctp

Inside the flash\_success element file would be something like this:

::

    <div class="flash flash_success">
        <?php echo $message ?>
    </div>

The final step is in your main view file where the result is to be
displayed to add simply

::

    <?php echo $this->Session->flash(); ?>

And of course you can then add to your CSS a selector for div.flash,
div.flash\_success and div.flash\_failure
