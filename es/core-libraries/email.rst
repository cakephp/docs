Mailer
######

.. php:namespace:: Cake\Mailer

.. php:class:: Mailer(string|array|null $profile = null)

``Mailer`` es una clase de conveniencia para enviar correos electrónicos. Con esta clase, puedes enviar correos electrónicos desde cualquier lugar dentro de tu aplicación.

Uso Básico
==========

Primero, asegúrate de que la clase esté cargada::

    use Cake\Mailer\Mailer;

Después de cargar ``Mailer``, puedes enviar un correo electrónico de la siguiente manera::

    $mailer = new Mailer('default');
    $mailer->setFrom(['me@example.com' => 'Mi Sitio'])
        ->setTo('you@example.com')
        ->setSubject('Acerca de')
        ->deliver('Mi mensaje');

Dado que los métodos setter de ``Mailer`` devuelven una instancia de la clase, puedes configurar sus propiedades encadenando los métodos.

``Mailer`` tiene varios métodos para definir destinatarios: ``setTo()``, ``setCc()``, ``setBcc()``, ``addTo()``, ``addCc()`` y ``addBcc()``.
La principal diferencia es que los primeros tres sobrescribirán lo que ya se haya establecido, mientras que los últimos simplemente
agregarán más destinatarios a su campo respectivo::

    $mailer = new Mailer();
    $mailer->setTo('to@example.com', 'Destinatario Ejemplo');
    $mailer->addTo('to2@example.com', 'Destinatario2 Ejemplo');
    // Los destinatarios del correo electrónico son: to@example.com y to2@example.com
    $mailer->setTo('test@example.com', 'DestinatarioPrueba Ejemplo');
    // El destinatario del correo electrónico es: test@example.com

Elección del Remitente
----------------------

Cuando envíes correos electrónicos en nombre de otras personas, suele ser una buena idea definir el remitente original usando el encabezado del remitente (Sender header). Puedes hacerlo usando ``setSender()``::

    $mailer = new Mailer();
    $mailer->setSender('app@example.com', 'Mi aplicación de correo');

.. note::

    También es una buena idea establecer el remitente del sobre (envelope sender) al enviar correos electrónicos en nombre de otra persona. Esto evita que reciban mensajes sobre la entregabilidad.

.. _email-configuration:

Configuración
=============

Los perfiles de Mailer y las configuraciones de transporte de correo electrónico se definen en los archivos de configuración de tu aplicación. Las claves ``'Email'`` y ``'EmailTransport'`` definen perfiles de Mailer y configuraciones de transporte de correo electrónico respectivamente. Durante el inicio de la aplicación, los valores de configuración se pasan desde ``Configure`` a las clases ``Mailer`` y ``TransportFactory`` utilizando ``setConfig()``. Al definir perfiles y transportes, puedes mantener el código de tu aplicación libre de datos de configuración y evitar la duplicación que complica el mantenimiento y el despliegue.

Para cargar una configuración predefinida, puedes usar el método ``setProfile()`` o pasarlo al constructor de ``Mailer``::

    $mailer = new Mailer();
    $mailer->setProfile('default');

    // O en el constructor
    $mailer = new Mailer('default');

En lugar de pasar una cadena que coincida con un nombre de configuración preestablecido, también puedes cargar simplemente un array de opciones::

    $mailer = new Mailer();
    $mailer->setProfile(['from' => 'me@example.org', 'transport' => 'my_custom']);

    // O en el constructor
    $mailer = new Mailer(['from' => 'me@example.org', 'transport' => 'my_custom']);

.. _email-configurations:

Perfiles de Configuración
-------------------------

Definir perfiles de entrega te permite consolidar la configuración común del correo electrónico en perfiles reutilizables. Tu aplicación puede tener tantos perfiles como sea necesario. Se utilizan las siguientes claves de configuración:

- ``'from'``: Mailer o array del remitente. Ver ``Mailer::setFrom()``.
- ``'sender'``: Mailer o array del remitente real. Ver ``Mailer::setSender()``.
- ``'to'``: Mailer o array del destino. Ver ``Mailer::setTo()``.
- ``'cc'``: Mailer o array de copia carbono. Ver ``Mailer::setCc()``.
- ``'bcc'``: Mailer o array de copia carbono oculta. Ver ``Mailer::setBcc()``.
- ``'replyTo'``: Mailer o array para responder al correo electrónico. Ver ``Mailer::setReplyTo()``.
- ``'readReceipt'``: Dirección del Mailer o un array de direcciones para recibir
  el recibo de lectura. Ver ``Mailer::setReadReceipt()``.
- ``'returnPath'``: Dirección del Mailer o un array de direcciones para devolver si hay
  algún error. Ver ``Mailer::setReturnPath()``.
- ``'messageId'``: ID del mensaje del correo electrónico. Ver ``Mailer::setMessageId()``.
- ``'subject'``: Asunto del mensaje. Ver ``Mailer::setSubject()``.
- ``'message'``: Contenido del mensaje. No establezcas este campo si estás usando contenido renderizado.
- ``'priority'``: Prioridad del correo electrónico como valor numérico (generalmente de 1 a 5, siendo 1 el más alto).
- ``'headers'``: Cabeceras a incluir. Ver ``Mailer::setHeaders()``.
- ``'viewRenderer'``: Si estás usando contenido renderizado, establece el nombre de la clase de vista.
  Ver ``ViewBuilder::setClassName()``.
- ``'template'``: Si estás usando contenido renderizado, establece el nombre de la plantilla. Ver
  ``ViewBuilder::setTemplate()``.
- ``'theme'``: Tema utilizado al renderizar la plantilla. Ver ``ViewBuilder::setTheme()``.
- ``'layout'``: Si estás usando contenido renderizado, establece el diseño a renderizar. Ver
  ``ViewBuilder::setTemplate()``.
- ``'autoLayout'``: Si quieres renderizar una plantilla sin diseño, establece este campo en
  ``false``. Ver ``ViewBuilder::disableAutoLayout()``.
- ``'viewVars'``: Si estás usando contenido renderizado, establece el array con
  variables que se utilizarán en la vista. Ver ``Mailer::setViewVars()``.
- ``'attachments'``: Lista de archivos para adjuntar. Ver ``Mailer::setAttachments()``.
- ``'emailFormat'``: Formato del correo electrónico (html, texto o ambos). Ver ``Mailer::setEmailFormat()``.
- ``'transport'``: Nombre de la configuración del transporte. Ver :ref:`email-transport`.
- ``'log'``: Nivel de registro para registrar las cabeceras y el mensaje del correo electrónico. ``true`` utilizará
  LOG_DEBUG. Ver :ref:`logging-levels`. Ten en cuenta que los registros se emitirán bajo el ámbito denominado ``email``.
  Ver también :ref:`logging-scopes`.
- ``'helpers'``: Array de helpers utilizados en la plantilla del correo electrónico.
  ``ViewBuilder::setHelpers()``/``ViewBuilder::addHelpers()``.

.. note::

    Los valores de las claves mencionadas anteriormente que usan Mailer o array, como from, to, cc, etc., se pasarán
    como el primer parámetro de los métodos correspondientes. El equivalente a:
    ``$mailer->setFrom('mi@example.com', 'Mi Sitio')``
    se definiría como ``'from' => ['mi@example.com' => 'Mi Sitio']`` en tu configuración.

Configurando Cabeceras
======================

En ``Mailer``, eres libre de establecer las cabeceras que desees. No olvides agregar el prefijo ``X-`` a tus cabeceras personalizadas.

Consulta ``Mailer::setHeaders()`` y ``Mailer::addHeaders()``

Envío de Correos Electrónicos con Plantillas
=============================================

Los correos electrónicos a menudo son mucho más que un simple mensaje de texto. Para facilitar eso, CakePHP proporciona una forma de enviar correos electrónicos utilizando la :doc:`capa de vista </views>` de CakePHP.

Las plantillas para correos electrónicos residen en una carpeta especial ``templates/email`` de tu aplicación. Las vistas del Mailer también pueden utilizar diseños y elementos al igual que las vistas normales::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('html')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('bienvenida')
                    ->setLayout('elegante');

    $mailer->deliver();

Lo anterior utilizará **templates/email/html/bienvenida.php** para la vista
y **templates/layout/email/html/elegante.php** para el diseño. También puedes
enviar mensajes de correo electrónico con varias partes de plantilla::

    $mailer = new Mailer();
    $mailer
                ->setEmailFormat('both')
                ->setTo('bob@example.com')
                ->setFrom('app@domain.com')
                ->viewBuilder()
                    ->setTemplate('bienvenida')
                    ->setLayout('elegante');

    $mailer->deliver();

Esto utilizará los siguientes archivos de plantilla:

* **templates/email/text/bienvenida.php**
* **templates/layout/email/text/elegante.php**
* **templates/email/html/bienvenida.php**
* **templates/layout/email/html/elegante.php**

Cuando envíes correos electrónicos con plantillas, tienes la opción de enviar ``texto``, ``html`` o ``ambos``.

Puedes configurar toda la configuración relacionada con la vista usando la instancia de creador de vistas ``Mailer::viewBuilder()`` de manera similar a como lo haces en el controlador.

Puedes establecer variables de vista con ``Mailer::setViewVars()``::

    $mailer = new Mailer('plantilla');
    $mailer->setViewVars(['valor' => 12345]);

O puedes usar los métodos del creador de vistas ``ViewBuilder::setVar()`` y ``ViewBuilder::setVars()``.

En tus plantillas de correo electrónico, puedes usarlos de la siguiente manera::

    <p>Aquí está tu valor: <b><?= $valor ?></b></p>

También puedes usar ayudantes en los correos electrónicos, al igual que en los archivos de plantilla normales. De forma predeterminada, solo se carga el ``HtmlHelper``. Puedes cargar ayudantes adicionales utilizando el método ``ViewBuilder::addHelpers()``::

    $mailer->viewBuilder()->addHelpers(['Html', 'Custom', 'Text']);

Cuando agregues ayudantes, asegúrate de incluir 'Html' o se eliminará de los ayudantes cargados en tu plantilla de correo electrónico.

.. note::
    En versiones anteriores a 4.3.0, deberás usar ``setHelpers()`` en su lugar.

Si deseas enviar correos electrónicos utilizando plantillas en un plugin, puedes usar la familiar :term:`Sintaxis de plugin` para hacerlo::

    $mailer = new Mailer();
    $mailer->viewBuilder()->setTemplate('Blog.new_comment');

Lo anterior utilizará la plantilla y el diseño del plugin Blog como ejemplo.

En algunos casos, es posible que necesites anular la plantilla predeterminada proporcionada por los complementos.
Puedes hacer esto usando temas::

    $mailer->viewBuilder()
        ->setTemplate('Blog.new_comment')
        ->setLayout('Blog.auto_message')
        ->setTheme('MiTema');

Esto te permite anular la plantilla "new_comment" en tu tema sin modificar el complemento Blog. El archivo de plantilla debe crearse en la siguiente ruta:
**templates/plugin/MiTema/plugin/Blog/email/text/new_comment.php**.

Envío de Archivos Adjuntos
===========================

.. php:method:: setAttachments($adjuntos)

También puedes adjuntar archivos a los mensajes de correo electrónico. Hay algunos formatos diferentes dependiendo del tipo de archivos que tengas y de cómo quieras que aparezcan los nombres de archivo en el cliente de correo del destinatario:

1. Array: ``$mailer->setAttachments(['/ruta/completa/archivo.png'])`` adjuntará este archivo con el nombre archivo.png..
2. Array con clave:
   ``$mailer->setAttachments(['foto.png' => '/ruta/completa/algun_hash.png'])`` adjuntará some_hash.png con el nombre foto.png. El destinatario verá
   foto.png, no some_hash.png.
3. Arrays anidados::

    $mailer->setAttachments([
        'foto.png' => [
            'archivo' => '/ruta/completa/algun_hash.png',
            'mimetype' => 'image/png',
            'contentId' => 'mi-id-unico',
        ],
    ]);

   Lo anterior adjuntará el archivo con un tipo MIME diferente y con un ID de contenido personalizado (cuando se establece el ID de contenido, el archivo adjunto se convierte en incrustado).
   El tipo MIME y contentId son opcionales en esta forma.

   3.1. Cuando estás usando el ``contentId``, puedes usar el archivo en el cuerpo HTML
   como ``<img src="cid:mi-id-contenido">``.

   3.2. Puedes usar la opción ``contentDisposition`` para desactivar el encabezado ``Content-Disposition`` para un archivo adjunto. Esto es útil cuando
   envías invitaciones ical a clientes que usan Outlook.

   3.3 En lugar de la opción ``archivo``, puedes proporcionar el contenido del archivo como
   una cadena utilizando la opción ``datos``. Esto te permite adjuntar archivos sin
   necesidad de tener rutas de archivo para ellos.

Relajando las Reglas de Validación de Direcciones
--------------------------------------------------

.. php:method:: setEmailPattern($patrón)

Si tienes problemas de validación al enviar a direcciones no conformes, puedes relajar el patrón utilizado para validar direcciones de correo electrónico. Esto es a veces
necesario al tratar con algunos proveedores de servicios de Internet::

    $mailer = new Mailer('predeterminado');

    // Relaja el patrón de correo electrónico, para que puedas enviar
    // a direcciones no conformes.
    $mailer->setEmailPattern($nuevoPatrón);

Envío de Correos Electrónicos desde la CLI
===========================================

Cuando envíes correos electrónicos dentro de un script de CLI (Shells, Tasks, ...), debes establecer manualmente
el nombre de dominio que Mailer utilizará. Servirá como el nombre de host para el
ID del mensaje (ya que no hay un nombre de host en un entorno CLI)::

    $mailer->setDomain('www.ejemplo.org');
    // Da como resultado IDs de mensajes como ``<UUID@www.ejemplo.org>`` (válidos)
    // En lugar de ``<UUID@>`` (inválidos)

Un ID de mensaje válido puede ayudar a evitar que los correos electrónicos terminen en carpetas de spam.

Creación de Correos Electrónicos Reutilizables
===============================================

Hasta ahora hemos visto cómo usar directamente la clase ``Mailer`` para crear y
enviar un correo electrónico. Pero la característica principal del mailer es permitir la creación de correos electrónicos reutilizables
en toda tu aplicación. También se pueden usar para contener múltiples
configuraciones de correo electrónico en un solo lugar. Esto ayuda a mantener tu código DRY y a evitar la configuración de correo electrónico
en otras áreas de tu aplicación.

En este ejemplo, crearemos un ``Mailer`` que contiene correos electrónicos relacionados con el usuario.
Para crear nuestro ``UserMailer``, crea el archivo
**src/Mailer/UserMailer.php**. El contenido del archivo debería verse así::

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
                    ->setTemplate('welcome_mail'); // Por defecto, se utiliza la plantilla con el mismo nombre que el nombre del método.
        }

        public function resetPassword($user)
        {
            $this
                ->setTo($user->email)
                ->setSubject('Reset password')
                ->setViewVars(['token' => $user->token]);
        }
    }


En nuestro ejemplo, hemos creado dos métodos, uno para enviar un correo electrónico de bienvenida y
otro para enviar un correo electrónico de restablecimiento de contraseña. Cada uno de estos métodos espera una entidad de usuario
y utiliza sus propiedades para configurar cada correo electrónico.

Ahora podemos usar nuestro ``UserMailer`` para enviar nuestros correos electrónicos relacionados con el usuario
desde cualquier parte de nuestra aplicación. Por ejemplo, si queremos enviar nuestro correo de bienvenida
podríamos hacer lo siguiente::

    namespace App\Controller;

    use Cake\Mailer\MailerAwareTrait;

    class UsersController extends AppController
    {
        use MailerAwareTrait;

        public function register()
        {
            $user =

     $this->Users->newEmptyEntity();
            if ($this->request->is('post')) {
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    // Enviar correo electrónico de bienvenida.
                    $this->getMailer('User')->send('welcome', [$user]);
                    // Redirigir a la página de inicio de sesión u otra página de destino.
                    return $this->redirect(['controller' => 'Users', 'action' => 'login']);
                }
                $this->Flash->error(__('Unable to register user. Please try again.'));
            }
            $this->set(compact('user'));
        }
    }

Si quisiéramos separar por completo el envío del correo de bienvenida del usuario de nuestro código de aplicación, podemos hacer que nuestro
`UserMailer` se suscriba al evento `Model.afterSave`. Al suscribirse a un evento, podemos mantener nuestras clases relacionadas con el
usuario completamente libres de lógica e instrucciones relacionadas con el correo electrónico de nuestra aplicación. Por ejemplo,
podríamos agregar lo siguiente a nuestro `UserMailer`::

    public function implementedEvents()
    {
        return [
            'Model.afterSave' => 'onRegistration',
        ];
    }

    public function onRegistration(EventInterface $event, EntityInterface $entity, ArrayObject $options)
    {
        if ($entity->isNew()) {
            $this->send('welcome', [$entity]);
        }
    }

Ahora puedes registrar el mailer como un oyente de eventos y el método `onRegistration()` se invocará cada vez que se dispare el evento `Model.afterSave`::

    // Adjuntar al gestor de eventos de Usuarios
    $this->Users->getEventManager()->on($this->getMailer('User'));

.. _email-transport:

Configuración de Transportes
============================

Los mensajes de correo electrónico se entregan mediante transportes. Diferentes transportes te permiten enviar mensajes a través de la función `mail()`
de PHP, servidores SMTP o no enviarlos en absoluto, lo cual es útil para depurar. Configurar transportes te permite mantener los datos de configuración
fuera del código de tu aplicación y simplifica la implementación, ya que simplemente puedes cambiar los datos de configuración. Una configuración de
transporte de ejemplo se ve así::

    // En config/app.php
    'EmailTransport' => [
        // Configuración de ejemplo para correo
        'default' => [
            'className' => 'Mail',
        ],
        // Configuración de ejemplo para SMTP
        'gmail' => [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'username' => 'mi@gmail.com',
            'password' => 'secreto',
            'className' => 'Smtp',
            'tls' => true,
        ],
    ],

Los transportes también se pueden configurar en tiempo de ejecución utilizando `TransportFactory::setConfig()`::

    use Cake\Mailer\TransportFactory;

    // Definir un transporte SMTP
    TransportFactory::setConfig('gmail', [
        'host' => 'ssl://smtp.gmail.com',
        'port' => 465,
        'username' => 'mi@gmail.com',
        'password' => 'secreto',
        'className' => 'Smtp'
    ]);

Puedes configurar servidores SMTP SSL, como Gmail. Para hacerlo, coloca el prefijo `ssl://` en el host y configura el valor del puerto en consecuencia. También puedes habilitar SMTP TLS usando la opción `tls`::

    use Cake\Mailer\TransportFactory;

    TransportFactory::setConfig('gmail', [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'mi@gmail.com',
        'password' => 'secreto',
        'className' => 'Smtp',
        'tls' => true
    ]);

La configuración anterior habilitaría la comunicación TLS para los mensajes de correo electrónico.

Para configurar tu mailer para usar un transporte específico, puedes usar el método :php:meth:`Cake\\Mailer\\Mailer::setTransport()` o tener el transporte en tu configuración::


    // Usa un transporte con nombre ya configurado usando TransportFactory::setConfig()
    $mailer->setTransport('gmail');

    // Usa un objeto construido.
    $mailer->setTransport(new \Cake\Mailer\Transport\DebugTransport());

.. warning ::

    Deberás tener habilitado el acceso para aplicaciones menos seguras en tu cuenta de Google para que funcione:
    `Permitir que aplicaciones menos seguras accedan a tu cuenta <https://support.google.com/accounts/answer/6010255>`__.

.. note ::
    `Configuración SMTP de Gmail <https://support.google.com/a/answer/176600?hl=es>`__.

.. note ::
    Para usar SSL + SMTP, necesitarás tener SSL configurado en tu instalación de PHP.

También se pueden proporcionar opciones de configuración como una cadena :term:`DSN`. Esto es útil cuando trabajas con variables de entorno o proveedores de :term:`PaaS`::

    TransportFactory::setConfig('default', [
        'url' => 'smtp://mi@gmail.com:secreto@smtp.gmail.com:587?tls=true',
    ]);

Cuando usas una cadena DSN, puedes definir cualquier parámetro / opción adicional como argumentos de cadena de consulta.

.. php:staticmethod:: drop($key)

Una vez configurados, los transportes no se pueden modificar. Para modificar un transporte, primero debes eliminarlo y luego reconfigurarlo.

Creación de Transportes Personalizados
--------------------------------------

Puedes crear tus propios transportes para situaciones como enviar correos electrónicos utilizando servicios como SendGrid, MailGun
o Postmark. Para crear tu transporte, primero crea el archivo **src/Mailer/Transport/ExampleTransport.php** (donde Example es el
nombre de tu transporte). Para empezar, tu archivo debería verse así::

    namespace App\Mailer\Transport;

    use Cake\Mailer\AbstractTransport;
    use Cake\Mailer\Message;

    class ExampleTransport extends AbstractTransport
    {
        public function send(Message $message): array
        {
            // Haz algo.
        }
    }

Debes implementar el método ``send(Message $message)`` con tu lógica personalizada.

Envío de correos electrónicos sin usar Mailer
=============================================

El ``Mailer`` es una clase de abstracción de nivel superior que actúa como un puente entre las clases ``Cake\Mailer\Message``, ``Cake\Mailer\Renderer`` y ``Cake\Mailer\AbstractTransport`` para configurar correos electrónicos con una interfaz fluida.

Si lo deseas, también puedes usar estas clases directamente con el ``Mailer``.

Por ejemplo::

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

Incluso puedes omitir el uso del ``Renderer`` y establecer el cuerpo del mensaje directamente
usando los métodos ``Message::setBodyText()`` y ``Message::setBodyHtml()``.

.. _email-testing:

Pruebas de Mailers
==================

Para probar mailers, agrega ``Cake\TestSuite\EmailTrait`` a tu caso de prueba.El ``MailerTrait``
utiliza ganchos de PHPUnit para reemplazar los transportes de correo electrónico de tu aplicación
con un proxy que intercepta los mensajes de correo electrónico y te permite hacer afirmaciones
sobre el correo que se enviaría.

Agrega el trait a tu caso de prueba para comenzar a probar correos electrónicos, y carga rutas si tus
correos electrónicos necesitan generar URL::

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

Supongamos que tenemos un mailer que envía correos electrónicos de bienvenida cuando un nuevo usuario
se registra. Queremos comprobar que el asunto y el cuerpo contienen el nombre del usuario::

    // en nuestra clase WelcomeMailerTestCase.
    public function testName()
    {
        $user = new User([
            'name' => 'Alice Alittea',
            'email' => 'alice@example.org',
        ]);
        $mailer = new WelcomeMailer();
        $mailer->send('welcome', [$user]);

        $this->assertMailSentTo($user->email);
        $this->assertMailContainsText('Hola ' . $user->name);
        $this->assertMailContainsText('¡Bienvenido a CakePHP!');
    }

Métodos de afirmación
----------------------

El trait ``Cake\TestSuite\EmailTrait`` proporciona las siguientes afirmaciones::

    // Asegura que se enviaron un número esperado de correos electrónicos
    $this->assertMailCount($count);

    // Asegura que no se enviaron correos electrónicos
    $this->assertNoMailSent();

    // Asegura que se envió un correo electrónico a una dirección
    $this->assertMailSentTo($address);

    // Asegura que se envió un correo electrónico desde una dirección
    $this->assertMailSentFrom($emailAddress);
    $this->assertMailSentFrom([$emailAddress => $displayName]);

    // Asegura que un correo electrónico contiene los contenidos esperados
    $this->assertMailContains($contents);

    // Asegura que un correo electrónico contiene los contenidos HTML esperados
    $this->assertMailContainsHtml($contents);

    // Asegura que un correo electrónico contiene los contenidos de texto esperados
    $this->assertMailContainsText($contents);

    // Asegura que un correo electrónico contiene el valor esperado dentro de un getter de Message (por ejemplo, "subject")
    $this->assertMailSentWith($expected, $parameter);

    // Asegura que un correo electrónico en un índice específico se envió a una dirección
    $this->assertMailSentToAt($at, $address);

    // Asegura que un correo electrónico en un índice específico se envió desde una dirección
    $this->assertMailSentFromAt($at, $address);

    // Asegura que un correo electrónico en un índice específico contiene los contenidos esperados
    $this->assertMailContainsAt($at, $contents);

    // Asegura que un correo electrónico en un índice específico contiene los contenidos HTML esperados
    $this->assertMailContainsHtmlAt($at, $contents);

    // Asegura que un correo electrónico en un índice específico contiene los contenidos de texto esperados
    $this->assertMailContainsTextAt($at, $contents);

    // Asegura que un correo electrónico contiene un archivo adjunto
    $this->assertMailContainsAttachment('test.png');

    // Asegura que un correo electrónico en un índice específico contiene el valor esperado dentro de un getter de Message (por ejemplo, "cc")
    $this->assertMailSentWithAt($at, $expected, $parameter);

    // Asegura que un correo electrónico contiene una subcadena en el asunto.
    $this->assertMailSubjectContains('Oferta Gratuita');

    // Asegura que un correo electrónico en un índice específico contiene una subcadena en el asunto.
    $this->assertMailSubjectContainsAt(1, 'Oferta Gratuita');

.. meta::
    :title lang=es: Correo Electrónico
    :keywords lang=en: sending mail,email sender,envelope sender,php class,database configuration,sending emails,commands,smtp,transports,attributes,array,config,flexibility,php email,new email,sending email,models
