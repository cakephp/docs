Email
#####

Die *emailComponent* ist eine Möglichkeit um einfaches E-Mail-versenden
in einer CakePHP-Applikation zu realisieren. Dabei wird auf das selbe
Konzept wie bei den Layout- und View-ctp-Dateien zurückgegriffen um
formatierte E-Mails als HTML, Text oder beides zu versenden. Die
Komponente unterstützt das Versenden mit den PHP-eigenen
Mail-Funktionen, einem SMTP-Server oder einem Debug-Modus, indem sie die
Mails in eine Session-Flash-Nachricht schreibt. Dateianhänge werden
dabei genauso unterstützt wie die Komponente auch ein paar
grundsätzliche Header-Injection Überprüfungen durchführt. Es gibt noch
eine Menge Dinge, die die Komponente nicht übernimmt, aber für den
Anfang reicht sie sicherlich.

Klassenattribute und Variablen
==============================

Diese Werte können gesetzt werden, bevor ``EmailComponent::send()``
aufgerufen wird:

to

Adresse an die die Nachricht gesendet wird. (string)

cc

Array von Adressen die Kopien erhalten sollen.

bcc

Array von Adressen die Blindkopien erhalten sollen.

replyTo

Antwortadresse (string)

from

Absenderadresse (string)

subject

Betreff der Nachricht (string)

template

Das E-Mail-Template welches für die Nachricht verwendet werden soll (zu
finden in ``app/views/elements/email/html/`` und
``app/views/elements/email/text/``).

layout

Das Layout welches für die Nachricht verwendet werden soll (zu finden in
``app/views/layouts/email/html/`` und
``app/views/layouts/email/text/``).

lineLength

Anzahl Zeichen, nach der ein automatischer Zeilenumbruch erfolgen soll.
Standardwert ist 70 Zeichen. (integer)

sendAs

Gibt an ob die Nachricht im Textformat (``text``), als HTML-Nachricht
(``html``) oder in beiden Formaten (``both``) gesendet werden soll.

attachments

Array von Dateien zum anhängen. Absolute und relative Pfade sind
möglich.

delivery

Wie soll die Nachricht versendet werden. (``mail``, ``smtp`` [erfordert
smtpOptions s.u.] und ``debug``)

smtpOptions

Assoziatives Array mit Optionen welcher Smtp-Mailer benutzt werden soll
(``port``, ``host``, ``timeout``, ``username``, ``password``,
``client``).

Es gibt noch ein paar weitere Optionen die genutzt werden können. In der
Dokumentation zur API finden sich weitere Informationen.

Mehrfache E-Mails in einer Schleife versenden
---------------------------------------------

Wenn du mehrere E-Mails in einer Schleife versenden möchtest, ist es
wichtig die E-Mail-Felder vor dem erneuten setzen der Eigenschaften
wieder mit der reset() Methode der E-Mail Komponente rückzusetzen.

::

    $this->Email->reset()

Einfaches E-Mails versenden
===========================

Um eine Nachricht ohne Vorlage (template) zu versenden reicht es,
einfach den Nachrichtentext als Zeichenkette (string) oder Zeilenarray
der send() Methode zu übergeben:

::

    $this->Email->from    = 'Irgendjemand <irgendjemand@example.com>';
    $this->Email->to      = 'Irgendjemand Anderes <irgendjemand.anderes@example.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Dies ist der Nachrichtenrumpf!');

Setting up the Layouts
----------------------

To use both text and html mailing message you need to create layout
files for them, just like in setting up your default layouts for the
display of your views in a browser, you need to set up default layouts
for your email messages. In the ``app/views/layouts/`` directory you
need to set up (at a minimum) the following structure

::

        email/
            html/
                default.ctp
            text/
                default.ctp

These are the files that hold the layout templates for your default
messages. Some example content is below

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

Setup an email element for the message body
-------------------------------------------

In the ``app/views/elements/email/`` directory you need to set up
folders for ``text`` and ``html`` unless you plan to just send one or
the other. In each of these folders you need to create templates for
both types of messages referring to the content that you send to the
view either by using $this->set() or using the $contents parameter of
the send() method. Some simple examples are shown below. It is
worthwhile to note that $this->set() should be done before invoking
Email's send(), a little break in mindset of the usual CakePHP view
conventions. For this example we will call the templates
simple\_message.ctp

``text``

::

     Dear <?php echo $User['first']. ' ' . $User['last'] ?>,
       Thank you for your interest.

``html``

::

     <p>Dear <?php echo $User['first']. ' ' . $User['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>

Controller
----------

In your controller you need to add the component to your ``$components``
array or add a $components array to your controller like:

::

    <?php
    var $components = array('Email');
    ?>

In this example we will set up a private method to handle sending the
email messages to a user identified by an $id. In our controller (let's
use the User controller in this example)

::

     
    <?php
    function _sendNewUserMail($id) {
        $User = $this->User->read(null,$id);
        $this->Email->to = $User['User']['email'];
        $this->Email->bcc = array('secret@example.com');  
        $this->Email->subject = 'Welcome to our really cool thing';
        $this->Email->replyTo = 'support@example.com';
        $this->Email->from = 'Cool Web App <app@example.com>';
        $this->Email->template = 'simple_message'; // note no '.ctp'
        //Send as 'html', 'text' or 'both' (default is 'text')
        $this->Email->sendAs = 'both'; // because we like to send pretty mail
        //Set view variables as normal
        $this->set('User', $User);
        //Do not pass any args to send()
        $this->Email->send();
     }
    ?>

You have sent a message, you could call this from another method like

::

     
    $this->_sendNewUserMail( $this->User->id );

Sending A Message Using SMTP
============================

To send an email using an SMTP server, the steps are similar to sending
a basic message. Set the delivery method to ``smtp`` and assign any
options to the Email object's ``smtpOptions`` property. You may also
retrieve SMTP errors generated during the session by reading the
``smtpError`` property of the component.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'your.smtp.server',
            'username'=>'your_smtp_username',
            'password'=>'your_smtp_password',
            'client' => 'smtp_helo_hostname'
       );

        /* Set delivery method */
        $this->Email->delivery = 'smtp';

        /* Do not pass any args to send() */
        $this->Email->send();

        /* Check for SMTP errors. */
        $this->set('smtp-errors', $this->Email->smtpError);

If your SMTP server requires authentication, be sure to specify the
username and password parameters for ``smtpOptions`` as shown in the
example.

If you don't know what an SMTP HELO is, then you most likely will not
need to set the ``client`` parameter for the ``smtpOptions``. This is
only needed for compatibility with SMTP servers which do not fully
respect RFC 821 (SMTP HELO).
