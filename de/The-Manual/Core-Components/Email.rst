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

Das E-Mail-Template welches für die Nachricth benutzt werden soll (zu
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

Debugging Emails
----------------

Wenn Du explizit **KEINE** E-Mail versenden willst, sondern stattdessen
nur die Funktion testen willst, kannst Du die folgende Versandoption
wählen:

::

    $this->Email->delivery = 'debug';

Um die Debug Informationen ansehen zu können, musst Du folgende
Codezeile in der View oder Layout Datei einfügen (z.B. direkt unter der
normalen Flash Nachricht in /layouts/default.ctp):

::

    <?php echo $this->Session->flash(); ?>
    <?php echo $this->Session->flash('email'); ?>

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

Um sowohl Text- als auch HTML-Mails zu nutzen mußt du Layout-Dateien
erstellen. Das geht genau so wie das Erstellen der Standard-Layouts für
die Darstellung der Views im Browser. Im
``app/views/layouts/``-Verzeichnis mußt du (mindestens) folgende
Struktur anlegen

::

        email/
            html/
                default.ctp
            text/
                default.ctp

Das sind die Dateien, die die Layout-Vorlagen für deine
Standard-Nachrichten enthalten. Hier folgt ein wenig Beispiel-Inhalt

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
the send() method. Some simple examples are shown below. For this
example we will call the templates simple\_message.ctp

``text``

::

     Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,
       Thank you for your interest.

``html``

::

     <p>Dear <?php echo $User['User']['first']. ' ' . $User['User']['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Thank you for your interest.</p>

The ``$content`` parameter for the send() method is sent to any
templates as ``$content``.

Controller code for using Email component
-----------------------------------------

In your controller you need to add the component to your ``$components``
array or add a $components array to your controller like:

::

    <?php
    var $components = array('Email');
    ?>

In this example we will set up a private method to handle sending the
email messages to a user identified by an ``$id``. In our controller
(let's use the User controller in this example)

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

Attachments
-----------

Here's how you can send file attachments along with your message. You
set an array containing the paths to the files to attach to the
``attachments`` property of the component.

::

    $this->Email->attachments = array(
        TMP . 'foo.doc',
        'bar.doc' => TMP . 'some-temp-name'
    );

The first file ``foo.doc`` will be attached with the same filename. For
the second file we specify an alias ``bar.doc`` will be be used for
attaching instead of its actual filename ``some-temp-name``

Versand einer Nachricht über SMTP
=================================

Um eine E-Mail über einen SMTP-Server zu verschicken kann man ähnlich
wie bei einer normalen Nachricht vorgehen. Man setzt die Versandmethode
auf ``smtp`` und weist dem E-Mail-Objekt über seine Eigenschaft
``smtpOptions`` die nötigen Optionen zu. Eventuelle schon während dem
Abschickvorgang auftretende Fehler kann man über die Eigenschaft
``smtpError`` der Komponente abfangen.

::

       /* SMTP Optionen */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'der SMTP-Server',
            'username'=>'der SMTP-Nutzername',
            'password'=>'das SMTP-Passwort',
            'client' => 'smtp_helo_hostname' // nur für Kompatibilität nötig
       );

        /* Versandart einstellen */
        $this->Email->delivery = 'smtp';

        /* send sollten keine Argumente übergeben werden */
        $this->Email->send();

        /* Auf SMTP-Fehler prüfen */
        $this->set('smtp_errors', $this->Email->smtpError);

Wenn der SMTP-Server Authentifizierung voraussetzt, muss darauf geachtet
werden, die Parameter für Nutzername und Passwort in ``smtpOptions`` wie
oben beispielhaft zu sehen, zu setzen.

Sollte der Begriff des "SMTP-Helo" unbekannt sein, so muß der ``client``
Parameter für die ``smtpOptions`` vermutlich nicht gesetzt werden - das
ist nur nötig, um die Kompatibilität mit SMTP-Servern, die sich nicht
strikt an den RFC 821 (SMTP HELO) halten, zu wahren.

Nachfolgend einige Beispieloptionen für den Gmail-SMTP-Server:

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'465', 
            'timeout'=>'30',
            'host' => 'ssl://smtp.gmail.com',
            'username'=>'your_username@gmail.com',
            'password'=>'your_gmail_password',
       );

