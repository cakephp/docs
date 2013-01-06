Email
#####

O emailComponent é a forma para você adicionar uma simples
funcionalidade de envio de email para sua aplicação CakePHP. Usando
alguns conceitos de layout e arquivos view (ctp) para enviar mensagens
formatadas como texto, html ou ambos. Ela suporta envios através de
funções mail do PHP, via servidores smtp ou um modo debug onde escreve
mensagens para uma sessão de mensagem flash. Suporta anexo de arquivos e
alguns cabeçalhos básicos de injeção checar/filtrar para você. Existem
muitos que ele não faz para você, mas já ajuda a começar.

Variávies e Atributos da Classe
===============================

Existem os valores que você pode setar antes de chamar
``EmailComponent::send()``

to

endereço que será enviada a mensagem (string)

cc

coleção de endereços com cópia que será enviada a mensagem

bcc

coleção de endereços ocultos que receberão a mensagem

replyTo

responder para o endereço (string)

from

endereço do remetente (string)

subject

título da mensagem (string)

template

Elemento de email usado para as mensagens (localizado em
``app/views/elements/email/html/`` e ``app/views/elements/email/text/``)

layout

O layout usado para o email (localizado em
``app/views/layouts/email/html/`` e ``app/views/layouts/email/text/``)

lineLength

Tamanho que as linhas devem ser quebradas. Padrão é 70. (inteiro)

sendAs

como você quer que seja enviada a mensagem ``text``, ``html`` ou
``ambas (both)``

attachments

coleção de arquivos para enviar (caminhos absolutos ou relativos)

delivery

como enviar a mensagem (``mail``, ``smtp`` [exigiria smtpOptions como
abaixo] e ``debug``)

smtpOptions

array associativo de opções para mailer smtp (``port``, ``host``,
``timeout``, ``username``, ``password``, ``client``)

Existem algumas outras coisas que podem ser setadas, mas você deveria
verificar a referência da documentação da API para mais informações.

Enviando múltiplos emails em um loop
------------------------------------

Se você deseja enviar vários email usando um loop, você vai precisar
resetar os campos de email usando o método reset() do componente Email.
Você vai precisar resetar antes setando a propriedade email.

::

    $this->Email->reset()

Enviando uma mensagem básica
============================

Para enviar uma mensagem sem usar um template, apenas passe o corpo da
mensagem como uma string (ou um array de linhas) para o método send().
Por exemplo:

::

    $this->Email->from    = 'Fulano <fulano@exemplo.com>';
    $this->Email->to      = 'Ciclano <ciclano@exemplo.com>';
    $this->Email->subject = 'Teste';
    $this->Email->send('Corpo da mensagem!');

Configurar os layouts
---------------------

Para usar envio de mensagem em texto e html você precisa criar arquivos
de layout para eles, assim como na configuração de seus layouts padrão
para visualização de suas visualizações no navegador, você precisa
configurar layouts padrão para suas mensagens de email. No diretório
``app/views/layouts/`` você precisa configurar (no mínimo) a seguinte
estrutura

::

        email/
            html/
                default.ctp
            text/
                default.ctp

Esses são os arquivos que possuem os modelos de apresentação das
mensagens. Alguns exemplos de conteúdo estão a seguir

``email/text/default.ctp``

::

        <?php echo $content_for_layout; ?>

``email/html/default.ctp``

::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>

Configuração do elemento de email para o corpo da mensagem
----------------------------------------------------------

No diretório ``app/views/elements/email/`` você precisa configurar
pastas para ``text`` e ``html`` a menos que você planeja apenas enviar
um ou outro. Em cada uma dessas pastas você precisa criar modelos para
os dois tipos de mensagens referente ao conteúdo que você enviar para a
view qualquer uma das duas usando $this->set() ou usando o parâmetro
$contents do método send(). Alguns simples exemplos são mostrados
abaixo. Para esse exemplo nós iremos chamar o modelo simple\_message.ctp

``text``

::

      <?php echo $User['first']. ' ' . $User['last'] ?>,
      Obrigado pelo seu interesse.

``html``

::

     <p><?php echo $User['first']. ' ' . $User['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Obrigado pelo seu interesse.</p>

Controladora
------------

Na sua controladora você precisa adicionar o componente para seu array
``$components`` ou adicionar um array $components pra sua controladora
como:

::

    <?php
    var $components = array('Email');
    ?>

Nesse exemplo nós iremos configurar um método private para manipular o
envio de mensagens de email para um usuário identificado por um $id. Em
nossa controladora (vamos usar a controladora User nesse exemplo)

::

     
    <?php
    function _sendNewUserMail($id) {
        $User = $this->User->read(null,$id);
        $this->Email->to = $User['User']['email'];
        $this->Email->bcc = array('secret@example.com');  
        $this->Email->subject = 'Welcome to our really cool thing';
        $this->Email->replyTo = 'support@example.com';
        $this->Email->from = 'Cool Web App <app@example.com>';
        $this->Email->template = 'simple_message'; // note que sem o '.ctp'
        //Send as 'html', 'text' or 'both' (default is 'text')
        $this->Email->sendAs = 'both'; // porque nós queremos enviar emails bacanas
        //Configura as variáveis da view como normal
        $this->set('User', $User);
        //Não passa qualquer argumento para o método send()
        $this->Email->send();
     }
    ?>

Você tem uma nova mensagem, você poderia chamar isso a partir de outro
método como

::

     
    $this->_sendNewUserMail( $this->User->id );

Enviando uma mensagem usando SMTP
=================================

Enviar email usando um servidor SMTP, os passos são similares para o
envio de uma mensagem básica. Defina o método de entrega para ``smtp`` e
especificar qualquer opção para a propriedade ``smtpOptions`` do objeto
Email. Você também pode obter erros gerados durante a sessão lendo a
propriedade ``smtpError`` do componente.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port' => '25', 
            'timeout' => '30',
            'host' => 'your.smtp.server',
            'username' => 'your_smtp_username',
            'password' => 'your_smtp_password',
            'client' => 'smtp_helo_hostname');

        /* Define a forma de entrega */
        $this->Email->delivery = 'smtp';

        /* Não passa qualquer argumento para o método send() */
        $this->Email->send();

        /* Checa por erros SMTP. */
        $this->set('smtp-errors', $this->Email->smtpError);

Se seu servidor smtp requer autenticação, tenha certeza de especificar
os parâmetros usuário e senha para ``smtpOptions`` como mostrado no
exemplo.
