Email
#####

.. php:namespace:: Cake\Mailer

.. note::
    Atualmente, a documentação desta página não é suportada em português.

    Por favor, sinta-se a vontade para nos enviar um *pull request* no
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **IMPROVE THIS DOC** para propor suas mudanças diretamente.

    Você pode consultar a versão em inglês desta página através do seletor de
    idioma localizado ao lado direito do campo de buscas da documentação.

.. warning::
    Antes da versão 3.1, as classes ``Email`` e ``Transport`` estavam com o
    namespace ``Cake\Network\Email`` em vez do namespace ``Cake\Mailer``.

.. php:class:: Email(mixed $profile = null)

``Email`` é uma nova classe para enviar E-mail. Com essa classe você pode enviar
e-mail de qualquer lugar em sua aplicação.

Uso Básico
==========

Primeiro de tudo, você deve garantir que a classe está carregada::

    use Cake\Mailer\Email;

Depois que você carregou ``Email``, you pode enviar um e-mail com o seguinte::

    $email = new Email('default');
    $email->from(['remetente@example.com' => 'Meu Site'])
        ->to('destinatario@exemplo.com')
        ->subject('Assunto')
        ->send('Minha mensagem');

Com os métodos construtores da classe ``Email``, você é capaz de definir suas
propriedades com o encadeamento de método.

``Email`` tem vários métodos para definir os destinatários - ``to()``, ``cc()``,
``bcc()``, ``addTo()``, ``addCc()`` e ``addBcc()``. A diferença é que os três
primeiros irão substituir o que já foi definido antes e mais tarde será apenas
como adicionar mais destinatários ao seu respectivo campo::

    $email = new Email();
    $email->to('to@example.com', 'To Example');
    $email->addTo('to2@example.com', 'To2 Example');
    // Os destinatários são: to@example.com and to2@example.com
    $email->to('test@example.com', 'ToTest Example');
    // O destinatário é: test@example.com

Escolhendo Rementente
---------------------

Quando enviamos um e-mail em nome de outra pessoa, é uma boa ideia definirmos
quem é o remetente original usando o cabeçalho Sender. Você pode fazer isso
usando ``sender()``::

    $email = new Email();
    $email->sender('app@example.com', 'MyApp emailer');

.. note::

    É também uma boa ideia para definir o envelope remetente quando enviar um
    correio em nome de outra pessoa. Isso as impede de obter quaisquer mensagens
    sobre a capacidade de entrega.

.. _email-configuration:

Configuração
============

A configuração de ``Email`` padrão é criada usando ``config()`` e
``configTransport()``. Você deve colocar as predefinições de e-mail no arquivo
**config/app.php**. O arquivo **config/app.default.php** é um exemplo deste
arquivo. Não é necessário definir a configuração de e-mail em
**config/app.php**. ``Email`` pode ser usado sem ele e usar os respectivos
métodos para definir todas as configurações separadamente ou carregar uma
variedade de configurações.

Ao definir perfis e transportes, você pode manter o código do aplicativo livre
dos dados de configuração, e evitar a duplicação que faz manutenção e
implantação mais difícil.

Para carregar uma configuração pré-definida, você pode usar o método ``profile()`` 
ou passá-lo para o construtor de ``Email``::

    $email = new Email();
    $email->profile('default');

    // Ou no Construtor
    $email = new Email('default');

Em vez de passar uma string que corresponde a um nome de configuração
predefinida, você também pode apenas carregar uma variedade de opções::

    $email = new Email();
    $email->profile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // Ou no Construtor
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. versionchanged:: 3.1
    O perfil ``default`` do e-mail é automaticamente setado quando uma instância
    `Email`` é criada.

Configurando Transportes
------------------------

.. php:staticmethod:: configTransport($key, $config = null)

As mensagens de email são entregues por transportes. Diferentes transportes
permitem o envio de mensagens via funções PHP ``mail`` do PHP servidores SMTP
(ou não em todos, que é útil para depuração. Configurar transportes permite-lhe
manter os dados de configuração fora de seu código do aplicativo e torna a
implantação mais simples, como você pode simplesmente mudar os dados de
configuração. Um exemplo de configuração de transporte é parecido com::

    use Cake\Mailer\Email;

    // Configuração Simples de Email
    Email::configTransport('default', [
        'className' => 'Mail'
    ]);

    // Configuração smtp Simples
    Email::configTransport('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

Você pode configurar servidores SSL SMTP, como o Gmail. Para fazer isso, colocar
o prefixo ``ssl://`` no hospedeiro e configurar o valor de porta em
conformidade. Você também pode ativar TLS SMTP usando o ``tls`` opção::

    use Cake\Mailer\Email;

    Email::configTransport('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

A configuração acima possibilita uma comunicação TLS para mensagens de e-mail.

.. warning::
    Você vai precisar ter ativado o acesso para aplicações menos seguras em sua
    conta do Google para que isso funcione:
    `Permitindo aplicações menos seguras para acessar sua conta <https://support.google.com/accounts/answer/6010255>`__.

.. note::
    Para usar SSL + SMTP, você precisará ter o SSL configurado no seu PHP.

As opções de configuração também pode ser fornecido como uma string :term:`DSN`.
Isso é útil quando se trabalha com variáveis de ambiente ou prestadores
:term:`PaaS`::

    Email::configTransport('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:465?tls=true',
    ]);

Ao usar uma string DSN você pode definir quaisquer parâmetros/opções adicionais
como argumentos de string de consulta.

.. php:staticmethod:: dropTransport($key)

Uma vez configurado, os transportes não pode ser modificado. A fim de modificar
um transporte, você deve primeiro soltá-lo e, em seguida, configurá-lo.

.. _email-configurations:

Perfis de Configuração
----------------------

Definição de perfis de entrega permitem consolidar as configurações de e-mail
comuns em perfis reutilizáveis. Seu aplicativo pode ter tantos perfis como
necessário. As seguintes chaves de configuração são usados:

- ``'from'``: E-mail ou array do remetente. Visto ``Email::from()``.
- ``'sender'``: E-mail ou array do Remetente original. Visto
  ``Email::sender()``.
- ``'to'``: E-mail ou array do Destinatário. Visto ``Email::to()``.
- ``'cc'``: E-mail ou array da Copia de Carbono. Visto ``Email::cc()``.
- ``'bcc'``: E-mail ou array da cópia oculta. Visto ``Email::bcc()``.
- ``'replyTo'``: Email ou array do E-mail de respostas. Visto
  ``Email::replyTo()``.
- ``'readReceipt'``: Endereço de E-mail ou array de endereços para receber a
  recepção de leitura. Visto ``Email::readReceipt()``.
- ``'returnPath'``: Endereço de E-mail ou um array de endereços para retornar se
  teve alguns erros. Visto ``Email::returnPath()``.
- ``'messageId'``: ID da mensagem do e-mail. Visto ``Email::messageId()``.
- ``'subject'``: Assunto da mensagem. Visto ``Email::subject()``.
- ``'message'``: Conteúdo de mensagem. Não defina este campo se você estiver
  usando o conteúdo processado.
- ``'headers'``: Cabeçalhos sejam incluídas. Visto ``Email::setHeaders()``.
- ``'viewRender'``: Se você estiver usando conteúdo renderizado, definir o nome
  da classe da view. Visto ``Email::viewRender()``.
- ``'template'``: Se você estiver usando conteúdo renderizado, definir o nome do
  template. Visto ``Email::template()``.
- ``'theme'``: Tema usado quando o template é renderizado. Visto
  ``Email::theme()``.
- ``'layout'``: Se você estiver usando conteúdo renderizado, definir o layout
  para renderizar. Se você quer renderizar um template sem layout, definir este
  campo como null. Visto ``Email::template()``.
- ``'viewVars'``: Se você estiver usando conteúdo renderizado, definir o array
  com as variáveis para serem usadas na view. Visto ``Email::viewVars()``.
- ``'attachments'``: Lista de arquivos para anexar. Visto
  ``Email::attachments()``.
- ``'emailFormat'``: Formato do e-mail (html, text ou both). Visto
  ``Email::emailFormat()``.
- ``'transport'``: Nome da configuração de transporte. Visto
  :php:meth:`~Cake\\Mailer\\Email::configTransport()`.
- ``'log'``: Nível de log para registrar os cabeçalhos de e-mail e mensagem.
  ``true`` usará LOG_DEBUG. Visto tabmém como ``CakeLog::write()``
- ``'helpers'``: Array de helpers usado no template do e-mail.

Todas essas configurações são opcionais, exceto ``'from'``.

.. note::
    Os valores das chaves acima usando e-mail ou array, como from, to, cc, etc
    será passado como primeiro parâmetro de métodos correspondentes. O
    equivalente de: ``Email::from('my@example.com', 'My Site')`` pode ser
    difinido como  ``'from' => ['my@example.com' => 'My Site']`` na sua
    configuração.

Definindo Cabeçalho
===================

Em ``Email`` você está livre para definir os cabeçalhos que você deseja. Quando
migrar usando e-mail, não se esqueça de colocar o prefixo ``X-`` em seus
cabeçalhos.

Visto como ``Email::setHeaders()`` e ``Email::addHeaders()``.

Enviando E-mail com Templates
=============================

E-mails são frequentemente muito mais do que apenas uma simples mensagem de texto. A fim de
facilitar, o CakePHP fornece uma maneira de enviar e-mails usando o CakePHP. Veja em :doc:`view layer </views>`.

Os templates para e-mails residir em uma pasta especial em sua aplicação no
diretório ``Template`` chamado ``Email``. Visualizações de e-mail também pode
usar layouts e os elementos assim como vistas normais::

    $email = new Email();
    $email->template('welcome', 'fancy')
        ->emailFormat('html')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

O acima usaria **src/Template/Email/html/welcome.ctp** para a vista e
**src/Template/Layout/E-mail/html/fancy.ctp** para o layout. Você pode enviar
mensagens de e-mail com templates de várias partes, veja::

    $email = new Email();
    $email->template('welcome', 'fancy')
        ->emailFormat('both')
        ->to('bob@example.com')
        ->from('app@domain.com')
        ->send();

Este usaria os seguintes arquivos de template:

* **src/Template/Email/text/welcome.ctp**
* **src/Template/Layout/Email/text/fancy.ctp**
* **src/Template/Email/html/welcome.ctp**
* **src/Template/Layout/Email/html/fancy.ctp**

Ao enviar e-mails com templates, você tem a opção de enviar qualquer ``text``,
``html`` ou ``both``.

Você pode definir as váriaveis da view com ``Email::viewVars()``::

    $email = new Email('templated');
    $email->viewVars(['value' => 12345]);

Em seus templates de e-mail, você pode usar isso com::

    <p>Aqui está o seu valor: <b><?= $value ?></b></p>

Você pode usar helpers em e-mails, bem como você pode em arquivos de modelo
normais. Por padrão, somente o ``HtmlHelper`` é carregado. Você pode carregar
helpers adicionais usando os métodos ``helpers()``::

    $email->helpers(['Html', 'Custom', 'Text']);

Ao definir ajudantes se esqueça de incluir 'Html' ou ele será removido do
helpers carregado no seu template de e-mail.

Se você quiser enviar e-mail usando templates em um plugin, você pode usar o
familiar :term:`Sintaxe Plugin` para faze-lô::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');

O acima usaria templates a partir do plug-in Blog como um exemplo.

Em alguns casos, pode ser necessário substituir o template padrão fornecido pelo
plugins. Você pode fazer isso usando temas, dizendo par ao E-mail usar o tema
apropriado usando o método ``Email::theme()``::

    $email = new Email();
    $email->template('Blog.new_comment', 'Blog.auto_message');
    $email->theme('TestTheme');

Isso permite que você substituir o ``new_comment`` em seu tema, sem modificar o
plug-in Blog. O arquivo de template precisa ser criado no seguinte caminho:
**src/Template/Plugin/TestTheme/Blog/Email/text/new_comment.ctp**.

Envio de Anexos
===============

.. php:method:: attachments($attachments = null)

Você pode anexar arquivos a mensagens de email também. Há alguns diferentes
formatos, dependendo do tipo de arquivos que você tem, e como você quer os nomes
dos arquivos para aparecer no email do destinatário:

1. String: ``$email->attachments('/full/file/path/file.png')`` irá anexar este
   arquivo com o nome file.png.
2. Array: ``$email->attachments(['/full/file/path/file.png'])`` tem o mesmo
   comportamento como o uso de uma String.
3. Array com chave:
   ``$email->attachments(['photo.png' => '/full/some_hash.png'])`` irá anexar
   alguns hash.png com o nome photo.png. O destinatário verá photo.png, não
   hash.png.
4. Arrays aninhados::

    $email->attachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

   O acima irá anexar o arquivo com diferentes mimetypes e com identificação de
   conteúdo personalizado (quando definir o ID de conteúdo do anexo é
   transformado para linha).
   O mimetype e contentId são opcionais nessa forma.

   4.1. Quando você estiver usando o ``contentId``, você pode usar o arquivo no
   corpo HTML como ``<img src="cid:my-content-id">``.

   4.2. Você pode usar a opção ``contentDisposition`` conteúdo para desativar
   cabeçalho ``Content-Disposition`` para um anexo. Isso é útil quando é feito o
   envio de convites para o iCal para clientes usando o Outlook.

   4.3 Em vez de a opção ``file`` você pode fornecer o conteúdo do arquivo como
   uma string usando a opção ``data``. Que lhe permite anexar arquivos sem a
   necessidade de caminhos de arquivo para eles.

Usando Transportes
==================

Transportes são classes atribuídas a enviar o e-mail sobre algum protocolo ou
método. CakePHP suporta o o transporte de Mail (padrão), Debug e SMTP.

Para configurar o método, você deve usar o método
:php:meth:`Cake\\Mailer\\Email::transport()` ou ter o transporte em sua
configuração::

    $email = new Email();

    // Usar um transporte chamado já configurado usando Email::configTransport()
    $email->transport('gmail');

     // Usando um método Construtor
    $transport = new DebugTransport();
    $email->transport($transport);
