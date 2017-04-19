Email
#####
 
.. php:namespace:: Cake\Mailer

.. warning::
    Antes da versão 3.1, as classes ``Email`` e ``Transport`` estavam com o namespace ``Cake\Network\Email`` em vez do namespace ``Cake\Mailer``.

.. php:class:: Email(mixed $profile = null)

``Email`` é uma nova classe para enviar E-mail. Com essa classe você pode enviar e-mail de qualquer lugar em sua aplicação.

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
Com os métodos construtores da classe ``Email``, você é capaz de definir suas propriedades com o encadeamento de método.

``Email`` tem vários métodos para definir os destinatários - ``to()``, ``cc()``,
``bcc()``, ``addTo()``, ``addCc()`` e ``addBcc()``. A diferença é que os três primeiros irão substituir o que já foi definido antes e mais tarde será apenas como adicionar mais destinatários ao seu respectivo campo::

    $email = new Email();
    $email->to('to@example.com', 'To Example');
    $email->addTo('to2@example.com', 'To2 Example');
    // Os destinatários são: to@example.com and to2@example.com
    $email->to('test@example.com', 'ToTest Example');
    // O destinatário é: test@example.com

Escolhendo Rementente
---------------------

Quando enviamos um e-mail em nome de outra pessoa, é uma boa ideia definirmos quem é o remetente original usando o cabeçalho Sender. Você pode fazer isso usando ``sender()``::

    $email = new Email();
    $email->sender('app@example.com', 'MyApp emailer');

.. note::

    É também uma boa ideia para definir o envelope remetente quando enviar um correio em nome de outra pessoa. Isso as impede de obter quaisquer mensagens sobre a capacidade de entrega.

.. _email-configuration:

Configuração
=============

A configuração de ``Email`` padrão é criada usando ``config()`` e ``configTransport()``. Você deve colocar as predefinições de e-mail no arquivo **config/app.php**. O arquivo **config/app.default.php** é um exemplo deste arquivo. Não é necessário definir a configuração de e-mail em **config/app.php**. ``Email`` pode ser usado sem ele e usar os respectivos métodos para definir todas as configurações separadamente ou carregar uma variedade de configurações.

Ao definir perfis e transportes, você pode manter o código do aplicativo livre dos
dados de configuração, e evitar a duplicação que faz manutenção e implantação
mais difícil.


Para carregar uma configuração pré-definida, você pode usar o método ``profile() `` ou passá-lo
para o construtor de ``Email``::

    $email = new Email();
    $email->profile('default');

    // Ou no Construtor
    $email = new Email('default');

Em vez de passar uma string que corresponde a um nome de configuração predefinida, você também pode apenas carregar uma variedade de opções ::

    $email = new Email();
    $email->profile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // Ou no Construtor
    $email = new Email(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. versionchanged:: 3.1
    O perfil ``default`` do e-mail é automaticamente setado quando uma instância `Email`` é criada.
    
Configurando Transportes
------------------------

.. php:staticmethod:: configTransport($key, $config = null)

As mensagens de email são entregues por transportes. Diferentes transportes permitem o envio de mensagens via funções PHP 
``mail`` do PHP servidores SMTP (ou não em todos, que é útil para depuração. Configurar transportes permite-lhe manter os dados
de configuração fora de seu código do aplicativo e torna a implantação mais simples, como você pode simplesmente mudar os dados
de configuração. Um exemplo de configuração de transporte é parecido com::

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

Você pode configurar servidores SSL SMTP, como o Gmail. Para fazer isso, colocar o prefixo ``ssl://`` no hospedeiro e configurar o valor de porta em conformidade. Você também pode ativar TLS SMTP usando o ``tls`` opção::

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
    Você vai precisar ter ativado o acesso para aplicações menos seguras em sua conta do Google para que isso funcione:
    `Permitindo aplicações menos seguras para acessar sua conta <https://support.google.com/accounts/answer/6010255>`__.

.. note::
    Para usar SSL + SMTP, você precisará ter o SSL configurado no seu PHP.
   
As opções de configuração também pode ser fornecido como uma string :term:`DSN`. Isso é útil quando se trabalha com variáveis de ambiente ou prestadores :term:`PaaS`::

    Email::configTransport('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:465?tls=true',
    ]);

Ao usar uma string DSN você pode definir quaisquer parâmetros/opções adicionais como argumentos de string de consulta.

.. php:staticmethod:: dropTransport($key)

Uma vez configurado, os transportes não pode ser modificado. A fim de modificar um transporte, você deve primeiro soltá-lo e, 
em seguida, configurá-lo.

.. _email-configurations:

Perfis de Configuração
----------------------

Definição de perfis de entrega permitem consolidar as configurações de e-mail comuns em perfis reutilizáveis. Seu aplicativo 
pode ter tantos perfis como necessário. As seguintes chaves de configuração são usados:

- ``'from'``: E-mail ou array do remetente. Visto ``Email::from()``.
- ``'sender'``: E-mail ou array do Remetente original. Visto ``Email::sender()``.
- ``'to'``: E-mail ou array do Destinatário. Visto ``Email::to()``.
- ``'cc'``: E-mail ou array da Copia de Carbono. Visto ``Email::cc()``.
- ``'bcc'``: E-mail ou array da cópia oculta. Visto ``Email::bcc()``.
- ``'replyTo'``: Email ou array do E-mail de respostas. Visto ``Email::replyTo()``.
- ``'readReceipt'``: Endereço de E-mail ou array de endereços para receber a recepção de leitura. Visto ``Email::readReceipt()``.
- ``'returnPath'``: Endereço de E-mail ou um array de endereços para retornar se teve alguns erros. Visto ``Email::returnPath()``.
- ``'messageId'``: ID da mensagem do e-mail. Visto ``Email::messageId()``.
- ``'subject'``: Assunto da mensagem. Visto ``Email::subject()``.
- ``'message'``: Conteúdo de mensagem. Não defina este campo se você estiver usando o conteúdo processado.
- ``'headers'``: Cabeçalhos sejam incluídas. Visto ``Email::setHeaders()``.
- ``'viewRender'``: Se você estiver usando conteúdo renderizado, definir o nome da classe da view.
  Visto ``Email::viewRender()``.
- ``'template'``: Se você estiver usando conteúdo renderizado, definir o nome do template. Visto
  ``Email::template()``.
- ``'theme'``: Tema usado quando o template é renderizado. Visto ``Email::theme()``.
- ``'layout'``: Se você estiver usando conteúdo renderizado, definir o layout para renderizar. Se você quer renderizar um template sem layout, definir este campo como null. Visto ``Email::template()``.
- ``'viewVars'``: Se você estiver usando conteúdo renderizado, definir o array com as variáveis para serem usadas na view. Visto ``Email::viewVars()``.
- ``'attachments'``: Lista de arquivos para anexar. Visto ``Email::attachments()``.
- ``'emailFormat'``: Formato do e-mail (html, text ou both). Visto ``Email::emailFormat()``.
- ``'transport'``: Nome da configuração de transporte. Visto
  :php:meth:`~Cake\\Mailer\\Email::configTransport()`.
- ``'log'``: Nível de log para registrar os cabeçalhos de e-mail e mensagem. ``true`` usará
  LOG_DEBUG. Visto tabmém como ``CakeLog::write()``
- ``'helpers'``: Array de helpers usado no template do e-mail.

Todas essas configurações são opcionais, exceto ``'from'``.

 .. note::
 Os valores das chaves acima usando e-mail ou array, como from, to, cc, etc será passado como primeiro parâmetro de métodos 
 correspondentes. O equivalente de:
 ``Email::from('my@example.com', 'My Site')`` pode ser difinido como  ``'from' => ['my@example.com' => 'My Site']`` na sua configuração
