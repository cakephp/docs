Sessions
########

Die CakePHP Session-Komponente ermöglicht es Benutzerdaten zwischen
verschiedenen Seitenanbesuchen zwischen zu speichern. Sie handelt als
Wrapper für die $\_SESSION von PHP und bietet verschiedene Methoden für
Funktionen in Bezug auf $\_SESSION.

Sitzungen können auf einigen Wegen dauerhaft gespeichert werden. Der
Standard ist es, dass die Einstellungen von PHP verwendet werden; wie
auch immer, es gibt auch andere Möglichkeiten.

cake
    Speichert die Sitzungsdateien im Ordner app/tmp/sessions.
cake
    Die Session-Dateien werden im Ordner app/tmp/sessions gespeichert.
database
    Die Sitzungen werden in CakePHP's Datenbank gespeichert.
cache
    Nutzt die mit Cache::config() konfigurierte Caching-Engine. Sehr
    hilfreich im Zusammenhang mit Memcache (bei Setups mit mehreren
    Applikations-Servern), um sowohl gecachte, als auch Sitzungsdaten zu
    speichern.
php
    Die Standardeinstellung. Speichert Sitzungsdaten, wie in der php.ini
    angegeben.

Um die Standardeinstellung zu ändern, muss die
Session.save-Konfiguration in die gewünschte Option geändert werden.
Wenn Sie 'database' wählen, dann sollten Sie ebenfalls die
Session.database-Einstellung auskommentieren und die
SQL-Session-Datenbank-Datei, welche sich im Ordner app/config befindet
in Ihrer Datenbank ausführen.

Um eine selbst definierte Konfiguration zu verwenden, können Sie die
Session.save-Einstellung auf einen Dateinamen setzen. CakePHP wird dann
diese Datei aus Ihrem CONFIGS-Verzeichnis für diese Einstellung
benutzen.

::

    // app/config/core.php
    Configure::write('Session.save','my_session');

Dies erlaubt Ihnen das Session-Handling zu verändern.

::

    // app/config/my_session.php
    //
    // Revert value and get rid of the referrer check even when,
    // Security.level is medium
    ini_restore('session.referer_check');

    ini_set('session.use_trans_sid', 0);
    ini_set('session.name', Configure::read('Session.cookie'));

    // Cookie is now destroyed when browser is closed, doesn't 
    // persist for days as it does by default for security
    // low and medium
    ini_set('session.cookie_lifetime', 0);

    // Cookie path is now '/' even if you app is within a sub 
    // directory on the domain
    $this->path = '/';
    ini_set('session.cookie_path', $this->path);

    // Session cookie now persists across all subdomains
    ini_set('session.cookie_domain', env('HTTP_BASE'));

Methoden
========

Die Session Komponente dient dem Zugriff auf die Session Daten. Sie
beinhaltet sowohl Standardfunktionen zum Schreiben, Lesen, Aktualisieren
und Löschen der Session, also auch die Möglichkeit Nachrichten für die
User zu erstellen

Es gilt zu beachten, dass Arrays innerhalb der Session über die
Punktnotation zu erstellen und abzurufen sind. User.username
referenziert dabei auf folgende Array Struktur:

::

        array('User' => 
                array('username' => 'clarkKent@dailyplanet.com')
        );

Dies Punktnotation wird bei allen Methoden der Session Komponente
verwendet, bei der $name verwendet wird.

write
-----

``write($name, $value)``

Schreibt in die Session den Wert $value in $name. $name kann dabei in
der Punktnotation geschrieben werden, um ein assoziatives Array zu
verwenden. Zum Beispiel:

::

    $this->Session->write('Person.eyeColor', 'Green');

Dies schreibt den Wert 'Green' in die Session unter Person => eyeColor.

setFlash
--------

``setFlash($message, $layout = 'default', $params = array(), $key = 'flash')``

Setzt eine Sessionvariable, die für die Ausgabe im View verwendet werden
kann. $layout definiert das zu verwendende Layout (zu finden in
``/app/views/layouts``) für das Rendern der Message. Wenn Sie für
``$layout`` den Wert 'default' gesetzt lassen, wird die Message im
folgenden Code eingebettet:

::

    <div id="flashMessage" class="message"> [message] </div>

$params ermöglicht es Ihnen, zusätzliche Viewvariablen an das gerenderte
Layout zu übergeben. $key setzt den $messages Index im Message Array.
Standardmäßig ist 'flash' gesetzt.

Es können Parameter gesetzt werden, die das Verhalten des gerenderten
div beeinflussen, zum Beispiel durch das Hinzufügen von "class" im
$params Array wird eine Klasse zu dem ``div`` hinzugefügt, welches durch
``$session->flash()`` in Ihrem Layout oder View ausgegeben wird.

::

    $this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))

Die Ausgabe von ``$session->flash()`` des Beispiels von oben wäre:

::

    <div id="flashMessage" class="example_class">Example message text</div>

read
----

``read($name)``

Returns the value at $name in the Session. If $name is null the entire
session will be returned. E.g.

::

    $green = $this->Session->read('Person.eyeColor');

Retrieve the value Green from the session.

check
-----

``check($name)``

Used to check if a Session variable has been set. Returns true on
existence and false on non-existence.

delete
------

``delete($name)del($name)``

Clear the session data at $name. del($name) is deprecated from 1.3.

::

    $this->Session->delete('Person.eyeColor');

Our session data no longer has the value 'Green', or the index eyeColor
set. However, Person is still in the Session. To delete the entire
Person information from the session use.

::

    $this->Session->delete('Person');

destroy
-------

The ``destroy`` method will delete the session cookie and all session
data stored in the temporary file system. It will then destroy the PHP
session and then create a fresh session.

::

    $this->Session->destroy()

error
-----

``error()``

Used to determine the last error in a session.
