Email
#####

El componente Email es una manera simple de agregarle a tu aplicación
CakePHP la funcionalidad de envío de mails, usando los mismos conceptos
de layouts, vistas, archivos .ctp, etc, formateados como texto, html, o
ambos. Puede enviar mails por medio de las funciones propias de PHP, vía
servidor SMTP o en modo DEBUG en el que escribe el mensaje en un mensaje
flash de sesión. También soporta archivos adjuntados y
inclusión/filtrado simple de encabezados. Hay un montón de cosas que no
hace por tí, pero te pondrá en movimiento.

Atributos y Variables de la clase
=================================

Estos son los valores que puedes configurar antes de hacer la llamada
``EmailComponent::send()``

to

dirección a la que se dirige el mensaje (string)

cc

arreglo de direcciones a enviar copias del mensaje (CC)

bcc

arreglo de direcciones a enviar las copias ocultas del mensaje (CCO)

replyTo

dirección de respuesta(string)

from

dirección remitente (string)

subject

asunto del mensaje (string)

template

Elemento email a usar para el mensaje(ubicado en
``app/views/elements/email/html/`` y en
``app/views/elements/email/text/``)

layout

Layout usado por el mail (ubicado en ``app/views/layouts/email/html/`` y
en ``app/views/layouts/email/text/``)

lineLength

Longitud (en caracteres) en la que corta las líneas largas. Por defecto
es 70. (integer)

sendAs

Como quieres mandar el mensaje: ``text``\ (texto), ``html``\ (código
HTML) o ``both``\ (ambos).

attachments

Arreglo de archivos a enviar (rutas absolutas y relativas)

delivery

Como enviar el mensaje (``mail``, ``smtp`` [requerirá el campo
smtpOptions explicado abajo] y ``debug``)

smtpOptions

Arreglo asociativo de opciones para el envío por SMTP.
(``port``\ (puerto), ``host``\ (servidor), ``timeout``\ (tiempo de
espera), ``username``\ (nombre de usuario), ``password``\ (contraseña))

Hay algunas opciones más para configurar, para mayor información
consulta la documentación de CakePHP.

Envío múltiple de emails en bucle
---------------------------------

Si lo que quieres es enviar varios emails usando un bucle, deberás
resetear los campos de mails usando el método ``reset()`` del componente
Email. Necesitarás resetearlo antes de setear nuevamente las propiedades
del email.

::

    $this->Email->reset()

Envío de un mensaje simple
==========================

Para enviar un mensaje sin usar ningún template, sólo pasa el cuerpo del
mensaje como una cadena (string) o un arreglo de líneas al método
``send()``. Por ejemplo:

::

    $this->Email->from    = 'Alguien <alguien@ejemplo.com>';
    $this->Email->to      = 'Alguien más <alguien.mas@ejemplo.com>';
    $this->Email->subject = 'Prueba';
    $this->Email->send('Hola cuerpo de mensaje!!!');

Configurando el Layout
----------------------

Para usar tanto texto como html en el email necesitarás crear los
archivos de layout para ellos. Tal como lo hayas hecho para tu layout
*default* para las vistas en un navegador, precisas establecer los
layouts *default* para tus emails. En la carpeta ``app/views/layouts/``
precisas tener (como mínimo) esta estructura

::

        email/
            html/
                default.ctp
            text/
                default.ctp

Estos son los archivos que conservan los valores por defecto para los
templates de layout para tus mensajes. Un simple ejemplo de contenido:

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

Configurar un elemento Email para el cuerpo del mensaje
-------------------------------------------------------

En el directorio ``app/views/elements/email/`` debes configurar carpetas
para ``text``\ (mails modo texto) y ``html``\ (mails modo HTML) a menos
que quieras usar sólo uno de ellos. En cada una de estas carpetas debes
crear templates para poder utilizar con el contenido que le envíes a la
vista ya sea usando $this->set() o usando el parámetro $contents del
método send(). Algunos ejemplos simples a continuación, usando el
template simple\_message.ctp

``text``

::

     Estimado <?php echo $User['first']. ' ' . $User['last'] ?>,
       Gracias por su interés.

``html``

::

     <p>Estimado <?php echo $User['first']. ' ' . $User['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Gracias por su interés.</p>

Controlador
-----------

En tu controlador necesitas agregar el componente a tu array
``$components`` o agregar un array $components a tu controlador de la
forma:

::

    <?php
    var $components = array('Email');
    ?>

En este ejemplo configuraremos un método privado para manejar el envío
de mensajes de email a un usuario identificado por un ``$id``. En
nuestro controlador (usemos el controlador User en este ejemplo):

::

     
    <?php
    function _sendNewUserMail($id) {
        $User = $this->User->read(null,$id);
        $this->Email->to = $User['User']['email'];
        $this->Email->bcc = array('secreto@ejemplo.com');  
        $this->Email->subject = 'Bienvenido a nuestra cosa genial';
        $this->Email->replyTo = 'support@ejemplo.com';
        $this->Email->from = 'Cool Web App <app@ejemplo.com>';
        $this->Email->template = 'simple_message'; // NOTAR QUE NO HAY '.ctp'
        //Enviar como 'html', 'text' or 'both' (ambos) - (por defecto es 'text')
        $this->Email->sendAs = 'both'; // queremos enviar un lindo email
        //Variables de la vista
        $this->set('User', $User);
        //NO PASAMOS ARGUMENTOS A SEND()
        $this->Email->send();
     }
    ?>

Has enviado un mensaje, podrías llamarlo desde otro método de esta
forma:

::

     
    $this->_sendNewUserMail( $this->User->id );

Enviar un mail por SMTP
=======================

Para enviar un mail usando servidor SMTP, los pasos a seguir son
similares a los del mensaje básico. Configurar el método de entrega
(*delivery*) a ``smtp`` y asignar las opciones a las propiedades del
objeto de Email ``smtpOptions``. También puedes obtener los errores SMTP
generados durante la sesión leyendo la propiedad ``smtpError`` del
componente.

::

       /* Opciones SMTP*/
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'tu.servidor.smtp',
            'username'=>'tu_nombre_usuario_smtp',
            'password'=>'tu_contraseña_smtp');

        /* Configurar método de entrega */
        $this->Email->delivery = 'smtp';

        /* No le pases ningún argumento a send() */
        $this->Email->send();

        /* Chequeo de errores SMTP. */
        $this->set('smtp-errors', $this->Email->smtpError);

Si tu servidor SMTP requiere autenticación, asegúrate de especificar los
parámetros de nombre de usuario y contraseña en ``smtpOptions`` como se
ve en el ejemplo.
