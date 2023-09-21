Email
#####

.. php:namespace:: Cake\Mailer

.. php:class:: Mailer(string|array|null $profile = null)

``Mailer`` é uma classe conveniente para enviar e-mail. Com esta aula você 
pode enviar e-mail de qualquer lugar do seu aplicativo.

Uso Básico
==========

Em primeiro lugar, você deve garantir que a classe seja carregada::

    use Cake\Mailer\Mailer;

Depois de carregar o ``Mailer``, você pode enviar um e-mail com o seguinte código::

    $mailer = new Mailer('default');
    $mailer->setFrom(['me@example.com' => 'My Site'])
        ->setTo('you@example.com')
        ->setSubject('About')
        ->deliver('My message');

Como os métodos setter do ``Mailer`` retornam a instância da classe, você pode 
definir suas propriedades com encadeamento de métodos.

``Mailer`` tem vários métodos para definir destinatários - ``setTo()``, 
``setCc()``, ``setBcc()``, ``addTo()``, ``addCc()`` e ``addBcc()``. A principal 
diferença é que os três primeiros sobrescreverão o que já foi definido e o último 
apenas adicionará mais destinatários aos seus respectivos campos::

    $mailer = new Mailer();
    $mailer->setTo('to@example.com', 'To Example');
    $mailer->addTo('to2@example.com', 'To2 Example');
    // Os destinatários do e-mail são: to@example.com e to2@example.com
    $mailer->setTo('test@example.com', 'ToTest Example');
    // O destinatário do e-mail é: test@example.com

Escolha do Remetente
--------------------

Ao enviar e-mail em nome de outras pessoas, geralmente é uma boa ideia definir o 
remetente original usando o cabeçalho Sender. Você pode fazer isso usando ``setSender()``::

    $mailer = new Mailer();
    $mailer->setSender('app@example.com', 'MyApp emailer');

.. note::

    Também é uma boa ideia definir o remetente ao enviar o e-mail em nome de outra pessoa. 
    Isso os impede de receber qualquer mensagem sobre a situação da entrega.

.. _email-configuration:

Configuração
============

Perfis de Email e configurações de transporte de e-mail são definidos nos arquivos 
de configuração do seu aplicativo. As chaves ``Email`` e ``EmailTransport`` definem 
perfis de mailer e configurações de transporte de e-mail, respectivamente. Durante a 
inicialização do aplicativo, os ajustes de configuração são passados de ``Configure`` 
para as classes ``Mailer`` e ``TransportFactory`` usando ``setConfig()``. Ao definir 
perfis e transportes, você pode manter o código do aplicativo livre de dados de configuração 
e evitar a duplicação o que torna a manutenção e a implantação mais difíceis.

Para carregar uma configuração predefinida, você pode usar o método ``setProfile()`` 
ou passá-lo para o construtor do ``Mailer``::

    $mailer = new Mailer();
    $mailer->setProfile('default');

    // Ou no construtor
    $mailer = new Mailer('default');

Em vez de passar uma string que corresponda a um nome de configuração predefinido, 
você pode simplesmente carregar um conjunto de opções::

    $mailer = new Mailer();
    $mailer->setProfile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // Ou no construtor
    $mailer = new Mailer(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. _email-configurations:

Perfis de Configuração
----------------------

Definir perfis de entrega permite que você consolide configurações de e-mail 
comuns em perfis reutilizáveis. Seu aplicativo pode ter quantos perfis forem 
necessários. As seguintes chaves de configuração são usadas:

- ``'from'``: Mailer ou matriz de remetente. Veja ``Mailer::setFrom()``.
- ``'sender'``: Mailer ou matriz do remetente real. Veja ``Mailer::setSender()``.
- ``'to'``: Mailer ou matriz de destinos. Veja ``Mailer::setTo()``.
- ``'cc'``: Mailer ou matriz de cópias. Veja ``Mailer::setCc()``.
- ``'bcc'``: Mailer ou matriz de cópias ocultas. Veja ``Mailer::setBcc()``.
- ``'replyTo'``: Mailer ou matriz para resposta de e-mail. Veja ``Mailer::setReplyTo()``.
- ``'readReceipt'``: Endereço de correspondência ou uma série de endereços para receber a 
  confirmação de leitura. Veja ``Mailer::setReadReceipt()``.
- ``'returnPath'``: Endereço do mailer ou uma série de endereços a serem retornados se houver 
  algum erro. Veja ``Mailer::setReturnPath()``.
- ``'messageId'``: ID da mensagem de e-mail. Veja ``Mailer::setMessageId()``.
- ``'subject'``: Assunto da mensagem. Veja ``Mailer::setSubject()``.
- ``'message'``: Conteúdo da mensagem. Não defina este campo se estiver usando conteúdo renderizado.
- ``'priority'``: Prioridade do e-mail como valor numérico (geralmente de 1 a 5, sendo 1 o mais alto).
- ``'headers'``: Cabeçalhos a serem incluídos. Veja ``Mailer::setHeaders()``.
- ``'viewRender'``: Se você estiver usando conteúdo renderizado, defina o nome da classe da visualização.
  Veja ``Mailer::viewRender()``.
- ``'template'``: Se você estiver usando conteúdo renderizado, defina o nome do template. Veja
  ``ViewBuilder::setTemplate()``.
- ``'theme'``: Tema usado ao renderizar o template. Veja ``ViewBuilder::setTheme()``.
- ``'layout'``: Se você estiver usando conteúdo renderizado, defina o layout para renderizar. Se 
  você deseja renderizar um template sem layout, defina este campo como nulo. Veja ``ViewBuilder::setTemplate()``.
- ``'viewVars'``: Se você estiver usando conteúdo renderizado, defina a matriz com 
  variáveis a serem usadas na visualização. Veja ``Mailer::setViewVars()``.
- ``'attachments'``: Lista de arquivos para anexar. Veja ``Mailer::setAttachments()``.
- ``'emailFormat'``: Formato de email (html, text ou ambos). Veja ``Mailer::setEmailFormat()``.
- ``'transport'``: Nome da configuração de Transporte. Veja :ref:`email-transport`.
- ``'log'``: Nível de logs para registrar os cabeçalhos e a mensagem do e-mail. ``true`` usará LOG_DEBUG. 
  Veja `logging-levels`. Observe que os logs serão emitidos sob o escopo chamado ``email``.
  Veja também `logging-scopes`.
- ``'helpers'``: Conjunto de auxiliares usados no template de e-mail. ``ViewBuilder::setHelpers()``.

.. note::

    Os valores das chaves acima usando Mailer ou matriz, como from, to, cc, etc, serão passados 
    como o primeiro parâmetro dos métodos correspondentes. O equivalente para: 
    ``$mailer->setFrom('my@example.com', 'My Site')`` 
    seria definido como ``'from' => ['my@example.com' => 'My Site']`` em sua configuração

Configurando Cabeçalhos
=======================

No ``Mailer`` você é livre para definir os cabeçalhos que quiser. 
Não se esqueça de colocar o prefixo ``X-`` para seus cabeçalhos 
personalizados.

Veja ``Mailer::setHeaders()`` e ``Mailer::addHeaders()``

Envio de Emails com Templates
=============================

Muitas vezes, os emails são muito mais do que uma simples mensagem de texto. Para 
facilitar isso, o CakePHP fornece uma maneira de enviar emails usando :doc:`view layer </views>`
do CakePHP.

Os modelos para emails residem em uma pasta especial ``templates/email`` de seu 
aplicativo. As visualizações do mailer também podem usar layouts e elementos como 
templates normais::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('html')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('welcome')
                    ->setLayout('fancy');

    $mailer->deliver();

O exemplo acima usaria **templates/email/html/welcome.php** para a 
visualização e **templates/layout/email/html/fancy.php** para o layout. 
Você também pode enviar mensagens de e-mail com modelo de várias partes::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('both')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('welcome')
                    ->setLayout('fancy');

    $mailer->deliver();

Isso usaria os seguintes arquivos de modelo:

* **templates/email/text/welcome.php**
* **templates/layout/email/text/fancy.php**
* **templates/email/html/welcome.php**
* **templates/layout/email/html/fancy.php**

Ao enviar e-mails com modelo, você tem a opção de enviar
``text``, ``html`` ou ``both``.

Você pode definir todas as configurações relacionadas ao template usando a 
instância do construtor de views obtida por ``Mailer::viewBuilder()`` 
semelhante como você faz o no controlador.

Você pode definir variáveis de visualização com ``Mailer::setViewVars()``::

    $mailer = new Mailer('templated');
    $mailer->setViewVars(['value' => 12345]);

Ou você pode usar os métodos construtores de visualização ``ViewBuilder::setVar()`` e
``ViewBuilder::setVars()``.

Em seus modelos de e-mail, você pode usá-los com::

    <p>Aqui está o seu valor: <b><?= $value ?></b></p>

Você também pode usar ajudantes em e-mails, da mesma forma que em arquivos de modelo normais. 
Por padrão, apenas o ``HtmlHelper`` é carregado. Você pode carregar auxiliares adicionais 
usando o método ``ViewBuilder::setHelpers()``::

    $mailer->viewBuilder()->setHelpers(['Html', 'Custom', 'Text']);

Ao configurar ajudantes, certifique-se de incluir 'Html' ou ele será removido dos 
ajudantes carregados em seu modelo de email.

Se você deseja enviar e-mail usando templates em um plugin, você pode usar a familiar 
:term:`sintaxe plugin` para fazer isso::

    $mailer = new Mailer();
    $mailer->viewBuilder()->setTemplate('Blog.new_comment');

O exemplo acima usaria o template e o layout do plugin do Blog.

Em alguns casos, pode ser necessário substituir o modelo padrão fornecido pelos 
plug-ins. Você pode fazer isso usando temas::

    $mailer->viewBuilder()
        ->setTemplate('Blog.new_comment')
        ->setLayout('Blog.auto_message')
        ->setTheme('TestTheme');

Isso permite que você sobrescreva o template ``new_comment`` em seu tema sem 
modificar o plugin do Blog. O arquivo de modelo deve ser criado no seguinte caminho:
**templates/plugin/TestTheme/plugin/Blog/email/text/new_comment.php**.

Enviando Anexos
===============

.. php:method:: setAttachments($attachments)

Você também pode anexar arquivos a mensagens de e-mail. Existem alguns 
formatos diferentes, dependendo do tipo de arquivo que você possui e de 
como deseja que os nomes dos arquivos apareçam no cliente de e-mail do 
destinatário:

1. Matriz: ``$mailer->setAttachments(['/full/file/path/file.png'])`` terá o 
   mesmo comportamento de usar uma string.
2. Matriz com chave:
   ``$mailer->setAttachments(['photo.png' => '/full/some_hash.png'])`` irá anexar 
   some_hash.png com o nome photo.png. O destinatário verá photo.png, não some_hash.png.
3. Matrizes aninhadas::

    $mailer->setAttachments([
        'photo.png' => [
            'file' => '/full/some_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'my-unique-id'
        ]
    ]);

   O código acima anexará o arquivo com um tipo MIME diferente e com Content ID
   personalizado (ao definir o ID de conteúdo, o anexo é transformado em inline). 
   O mimetype e contentId são opcionais neste formulário.

   3.1. Quando você está usando o ``contentId``, você pode usar o arquivo no corpo 
   do HTML como ``<img src="cid:my-content-id">``.

   3.2. Você pode usar a opção ``contentDisposition`` para desabilitar o cabeçalho
   ``Content-Disposition`` para um anexo. Isso é útil ao enviar convites ical a 
   clientes usando o Outlook.

   3.3  Em vez da opção ``file``, você pode fornecer o conteúdo do arquivo como 
   uma string usando a opção ``data``. Isso permite que você anexe arquivos 
   sem a necessidade de caminhos de arquivo para eles.

Regras para Validação de Endereço mais Flexíveis
------------------------------------------------

.. php:method:: setEmailPattern($pattern)

Se estiver tendo problemas de validação ao enviar para endereços não compatíveis, 
você pode relaxar o padrão usado para validar endereços de e-mail. Isso às vezes é 
necessário ao lidar com alguns ISP's::

    $mailer = new Mailer('default');

    // Relaxe o padrão de e-mail, 
    // para que você possa enviar para endereços não conformes.
    $mailer->setEmailPattern($newPattern);

Enviando Mensagens Rapidamente
==============================

Às vezes, você precisa de uma maneira rápida para enviar um e-mail e não 
quer necessariamente definir várias configurações com antecedência.
:php:meth:`Cake\\Mailer\\Email::deliver()` é destinado a esse propósito.

Você pode criar sua configuração usando :php:meth:`Cake\\Mailer\\Email::config()`, 
ou usar uma matriz com todas as opções que você precisa e usar o método estático ``Email::deliver()``. 
Exemplo::

    Email::deliver('you@example.com', 'Subject', 'Message', ['from' => 'me@example.com']);

Este método enviará um e-mail para "you@example.com", de "me@example.com" com 
assunto "Subject" e conteúdo "Message".

O retorno de ``deliver()`` é uma instância :php:class:`Cake\\Mailer\\Email` 
com todas as configurações definidas. Se você não deseja enviar o e-mail imediatamente 
e deseja configurar algumas coisas antes de enviar, pode passar o quinto parâmetro como ``false``.

O terceiro parâmetro é o conteúdo da mensagem ou uma matriz com variáveis (ao usar conteúdo renderizado).

O 4º parâmetro pode ser um array com as configurações ou uma string com o nome da configuração em ``Configure``.

Se você quiser, pode passar o destinatário, o assunto e a mensagem como nulos e fazer todas as 
configurações no 4º parâmetro (como array ou usando ``Configure``). Verifique a lista 
de :ref:`configurations <email-configurations>` para ver todas as configurações aceitas.

Enviando E-mails de CLI
=======================

Ao enviar emails em um script CLI (Shells, Tasks, ...), você deve definir manualmente 
o nome de domínio a ser usado pelo Mailer. Ele servirá como o nome do host para o id 
da mensagem (uma vez que não há nome de host em um ambiente CLI)::

    $mailer->setDomain('www.example.org');
    // Resultados em ids de mensagens como ``<UUID@www.example.org>`` (válido)
    // Ao invés de `<UUID@>`` (inválido)

Um id de mensagem válido pode ajudar a evitar que emails acabem em pastas de spam.

Criação de Emails Reutilizáveis
===============================

Até agora vimos como usar diretamente a classe ``Mailer`` para criar e enviar 
emails. Mas a principal característica do mailer é permitir a criação de emails 
reutilizáveis em todo o seu aplicativo. Eles também podem ser usados para conter 
várias configurações de e-mail em um local. Isso ajuda a manter seu código DRYer 
e mantém os ruídos de configuração de e-mail longe de outras áreas do seu aplicativo.

Neste exemplo, estaremos criando um ``Mailer`` que contém emails relacionados ao 
usuário. Para criar nosso ``UserMailer``, crie o arquivo **src/Mailer/UserMailer.php**. 
O conteúdo do arquivo deve ser semelhante ao seguinte::

    namespace App\Mailer;

    use Cake\Mailer\Mailer;

    class UserMailer extends Mailer
    {
        public function welcome($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject(sprintf('Welcome %s', $user->name))
                ->viewBuilder()
                    ->setTemplate('welcome_mail'); // Por padrão, é usado um modelo com o mesmo nome do método.
        }

        public function resetPassword($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject('Reset password')
                ->setViewVars(['token' => $user->token]);
        }
    }

Em nosso exemplo, criamos dois métodos, um para enviar um e-mail de boas-vindas e 
outro para enviar um e-mail de redefinição de senha. Cada um desses métodos espera 
um usuário ``Entity`` e utiliza suas propriedades para configurar cada e-mail.

Agora podemos usar nosso ``UserMailer`` para enviar nossos e-mails relacionados ao 
usuário de qualquer lugar em nosso aplicativo. Por exemplo, se quisermos enviar nosso 
e-mail de boas-vindas, poderíamos fazer o seguinte::

    namespace App\Controller;

    use Cake\Mailer\MailerAwareTrait;

    class UsersController extends AppController
    {
        use MailerAwareTrait;

        public function register()
        {
            $user = $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData())
                if ($this->Users->save($user)) {
                    $this->getMailer('User')->send('welcome', [$user]);
                }
            }
            $this->set('user', $user);
        }
    }

Se quisermos separar completamente o envio de um e-mail de boas-vindas ao usuário 
do código de nosso aplicativo, podemos fazer com que nosso ``UserMailer`` se inscreva 
no evento ``Model.afterSave``. Ao inscrever-se em um evento, podemos manter as classes 
relacionadas ao usuário de nosso aplicativo completamente livres de lógica e instruções 
relacionadas a email. Por exemplo, poderíamos adicionar o seguinte ao nosso ``UserMailer``::

    public function implementedEvents()
    {
        return [
            'Model.afterSave' => 'onRegistration'
        ];
    }

    public function onRegistration(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }

Agora você pode registrar o mailer como um ouvinte de evento e o método 
``onRegistration()`` será invocado toda vez que o evento ``Model.afterSave`` 
for disparado::

    // anexar ao gerenciador de eventos de usuários
    $this->Users->getEventManager()->on($this->getMailer('User'));

.. note::

    Para informações sobre como registrar objetos ouvintes de eventos, 
    por favor consulte a documentação :ref:`registering-event-listeners`.

.. _email-transport:

Configurando os Transportes
===========================

As mensagens de e-mail são entregues por transportes. Transportes diferentes permitem 
que você envie mensagens via função ``mail()`` do PHP, servidores SMTP ou o 
que for mais útil para depuração. A configuração de transportes permite que você mantenha 
os dados de configuração fora do código do aplicativo e torna a implantação mais simples, 
pois você pode simplesmente alterar os dados de configuração. Um exemplo de configuração 
de transporte se parece com isso::

    // In config/app.php
    'EmailTransport' => [
        // Configuração de amostra de Email
        'default' => [
            'className' => 'Mail',
        ],
        // Amostra de configuração SMTP
        'gmail' => [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username' => 'my@gmail.com',
            'password' => 'secret',
            'className' => 'Smtp',
            'tls' => true
        ]
    ],

Os transportes também podem ser configurados em tempo de execução usando
``TransportFactory::setConfig()``::

    use Cake\Mailer\TransportFactory;

    // Define um transporte STMP
    TransportFactory::setConfig('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp'
    ]);

Você pode configurar servidores SSL SMTP, como Gmail. Para fazer isso, coloque o prefixo ``ssl://`` 
no host e configure o valor da porta de acordo. Você também pode 
habilitar TLS SMTP usando a opção ``tls``::

    use Cake\Mailer\TransportFactory;

    TransportFactory::setConfig('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'my@gmail.com',
        'password' => 'secret',
        'className' => 'Smtp',
        'tls' => true
    ]);

A configuração acima permitiria a comunicação TLS para mensagens de e-mail.

Para configurar seu mailer para usar um transporte específico, você pode usar 
o método :php:meth:`Cake\\Mailer\\Mailer::setTransport()` ou ter o 
transporte em sua configuração::

    // Use um transporte nomeado já configurado usando TransportFactory::setConfig()
    $mailer->setTransport('gmail');

    // Use um objeto construído.
    $mailer->setTransport(new \Cake\Mailer\Transport\DebugTransport());

.. warning::
    You will need to have access for less secure apps enabled in your Google
    account for this to work:
    
    Você precisará ter acesso a aplicativos menos seguros ativados em sua conta do Google 
    para que isso funcione: `Permitir que aplicativos menos seguros acessem sua conta <https://support.google.com/accounts/answer/6010255>`__.
    

.. note::
    `Configurções STMP do Gmail <https://support.google.com/a/answer/176600?hl=en>`__.

.. note::
    Para usar SSL + SMTP, você precisará ter o SSL configurado na 
    instalação do PHP.

As opções de configuração também podem ser fornecidas como uma string :term:`DSN`. 
Isso é útil ao trabalhar com variáveis de ambiente ou provedores :term:`PaaS`::

    TransportFactory::setConfig('default', [
        'url' => 'smtp://my@gmail.com:secret@smtp.gmail.com:587?tls=true',
    ]);

Ao usar uma string DSN, você pode definir quaisquer parâmetros/opções adicionais 
como argumentos de string de consulta.

.. php:staticmethod:: drop($key)

Depois de configurados, os transportes não podem ser modificados. Para modificar 
um transporte, você deve primeiro descartá-lo e reconfigurá-lo.

Criação de Transportes Personalizados
-------------------------------------

Você pode criar seus transportes personalizados para, por exemplo, enviar e-mail 
usando serviços como SendGrid, MailGun, Postmark etc. Para criar seu transporte, 
primeiro crie o arquivo **src/Mailer/Transport/ExampleTransport.php** (onde Exemple 
é o nome do seu transporte). Para começar, seu arquivo deve ser semelhante a::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Message;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Message $message): array
        {
            // Faça alguma coisa.
        }
    }

Você deve implementar o método ``send(Mailer $mailer)`` com sua lógica personalizada.

Enviar Emails sem Usar o Mailer
===============================

O ``Mailer`` é uma classe de abstração de nível superior que atua como uma ponte entre as 
classes ``Cake\Mailer\Message``, ``Cake\Mailer\Renderer`` e ``Cake\Mailer\AbstractTransport``
para facilitar a configuração e entrega do e-mail.

Se você quiser, pode usar essas classes diretamente com o ``Mailer`` também.

Por exemplo::

    $render = new \Cake\Mailer\Renderer();
    $render->viewBuilder()
        ->setTemplate('custom')
        ->setLayout('sparkly');

    $message = new \Cake\Mailer\Message();
    $message
        ->setFrom('admin@cakephp.org')
        ->setTo('user@foo.com')
        ->setBody($render->render());

    $transport = new \Cake\Mailer\Transport\MailTransport();
    $result = $transport->send($message);

Você pode até pular usando o ``Renderer`` e definir o corpo da mensagem diretamente 
usando os métodos ``Message::setBodyText()`` e ``Message::setBodyHtml()``.

.. _email-testing:

Testando Emails
===============

Para testar os mailers, adicione ``Cake\TestSuite\EmailTrait`` ao seu caso de 
teste. O ``MailerTrait`` usa ganchos PHPUnit para substituir os transportes de e-mail 
de sua aplicação por um proxy que intercepta mensagens de e-mail e permite que você 
faça afirmações sobre o e-mail que será entregue.

Adicione a trait ao seu caso de teste para começar a testar e-mails e carregar rotas 
se seus e-mails precisarem gerar URLs::

    namespace App\Test\TestCase\Mailer;

    use App\Mailer\WelcomeMailer;
    use App\Model\Entity\User;

    use Cake\TestSuite\EmailTrait;
    use Cake\TestSuite\TestCase;

    class WelcomeMailerTestCase extends TestCase
    {
        use EmailTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->loadRoutes();
        }
    }

Vamos supor que temos um mailer que entrega e-mails de boas-vindas quando um novo 
usuário se registra. Queremos verificar se o assunto e o corpo contêm o nome do usuário::

    // em sua classe WelcomeMailerTestCase.
    public function testName()
    {
        $user = new User([
            'name' => 'Alice Alittea',
            'email' => 'alice@example.org',
        ]);
        $mailer = new WelcomeMailer();
        $mailer->send('welcome', [$user]);

        $this->assertMailSentTo($user->email);
        $this->assertMailContainsText('Hi ' . $user->name);
        $this->assertMailContainsText('Welcome to CakePHP!');
    }

Métodos de Asserções
--------------------

A trait ``Cake\TestSuite\EmailTrait`` fornece as seguintes asserções::

    // Afirma que um número esperado de e-mails foi enviado
    $this->assertMailCount($count);

    // Afirma que nenhum e-mail foi enviado
    $this->assertNoMailSent();

    // Afirma que um e-mail foi enviado para um endereço
    $this->assertMailSentTo($address);

    // Afirma que um e-mail foi enviado de um endereço
    $this->assertMailSentFrom($address);

    // Afirma que um e-mail contém o conteúdo esperado
    $this->assertMailContains($contents);

    // Afirma que um e-mail contém conteúdo html esperado
    $this->assertMailContainsHtml($contents);

    // Afirma que um e-mail contém o conteúdo de texto esperado
    $this->assertMailContainsText($contents);

    // Afirma que um e-mail contém o valor esperado em um getter de mensagem (por exemplo, "assunto")
    $this->assertMailSentWith($expected, $parameter);

    // Afirma que um e-mail em um índice específico foi enviado para um endereço
    $this->assertMailSentToAt($at, $address);

    // Afirma que um e-mail em um índice específico foi enviado de um endereço
    $this->assertMailSentFromAt($at, $address);

    // Afirma que um e-mail em um índice específico contém o conteúdo esperado
    $this->assertMailContainsAt($at, $contents);

    // Afirma que um e-mail em um índice específico contém o conteúdo html esperado
    $this->assertMailContainsHtmlAt($at, $contents);

    // Afirma um e-mail em um índice específico contém o conteúdo de texto esperado
    $this->assertMailContainsTextAt($at, $contents);

    // Afirma que um e-mail contém um anexo
    $this->assertMailContainsAttachment('test.png');

    // Afirma que um e-mail em um índice específico contém o valor esperado em um getter de mensagem (por exemplo, "assunto")
    $this->assertMailSentWithAt($at, $expected, $parameter);

.. meta::
    :title lang=pt: Email
    :keywords lang=pt: enviando e-mail,disparador de email,disparador de mensagens,classe php,configuracao de banco de dados,enviando emails,shells,smtp,transportes,atributos,matriz,config,flexibilidade,email php,novo email,enviando modelo de emails
