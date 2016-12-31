Authentifizierung
#################

Systeme zur Authentifikation für Benutzer sind ein üblicher Bestandteil
vieler Web Applikationen. In CakePHP gibt es verschiedene Systeme, um
Benutzer zu authentifizieren. Dabei bietet jedes unterschiedliche
Optionen an. Im Kern prüft die Authentifikations-Komponente, ob ein
Benutzer ein Benutzerkonto für diese Seite hat. Wenn ja, bekommt dieser
Nutzer uneingeschränkten Zugang zur kompletten Seite.

Diese Komponente kann mit der ACL Komponente (Zugangskontrolllisten)
kombiniert werden, um komplexere Zugangskontrollen innerhalb der Seite
zu schaffen. Die ACL Komponente kann beispielsweise einem Nutzer nur
Zugang zu öffentlichen Bereichen einer Seite gewähren, während ein
andere Nutzer auf geschützte Administrationsbereiche dieser Seite
Zugriff erlangt.

CakePHPs Auth Komponente kann dazu benutzt werden ein solches System
schnell und einfach erstellen. Werfen wir doch mal einen Blick darauf,
wie ein sehr einfaches System zur Authentifizierung gebaut werden kann:

Wie alle anderen Komponenten benutzt man es, indem man 'Auth' zur Liste
der benutzten Komponenten im Controller hinzufügt.:

::

    class FooController extends AppController {
        var $components = array('Auth');

Oder, man fügt es zum AppController hinzu, damit alle Controller sie
benutzen:

::

    class AppController extends Controller {
        var $components = array('Auth');

So weit so gut. Es gibt ein paar Konventionen, die man berücksichtigen
sollte, wenn man die Auth Komponente benutzt. Standardmäßig erwartet die
Auth Komponente die Verwendung einer Datenbanktabelle namens 'users' mit
den Feldern 'username' und 'password'. *In einigen Fällen läßt die
Datenbank die Benennung 'password' als Spaltenname nicht zu. Weiter
unten zeigen wir dir, wie du die standardmäßig verwendeten Feldernamen
änderst, damit es trotzdem auf deinem System funktioniert.*

Erstellen wir zunächst unser Benutzertablle mit folgender
SQL-Anweisung::

    CREATE TABLE users (
        id integer auto_increment,
        username char(50),
        password char(40),
        PRIMARY KEY (id)
    );

Was man bedenken sollte, wenn man die Datenbanktabelle erstellt, um die
Benutzerdaten für die Authentifizierung zu speichern: Die Auth
Komponente erwartet, dass das Passwort gehashed in der Datenbank
gespeichert wird, anstatt als Klartext hinterlegt zu werden. Stelle
sicher, dass das Feld, indem du das Benutzerpasswort speichern willst,
groß genug für den Hash ist (z.B. 40 Stellen für SHA1).

Willst Du einen Benutzer manuell anlegen, ist der einfachste Weg, die
richtig gehashten Daten zu bekommen, zu versuchen, sich mit diesen
einzuloggen und dann den SQL Log auszuwerten.

Für den einfachsten Aufbau musst du nur zwei Aktionen in deinem
Controller erstellen:

::

    class UsersController extends AppController {

        var $name = 'Users';    
        var $components = array('Auth'); // Nicht notwendig, wenn bereits in deinem app controller deklariert
     
        /**
         *  Die Auth Komponente bietet die benötigte Funktionalität
         *  für Login, du kannst die Funktion also leer lassen.
         */
        function login() {
        }

        function logout() {
            $this->redirect($this->Auth->logout());
        }
    }

Während du die login() Funktion leer lassen kannst, musst aber das
Template des login View anlegen (unter app/views/users/login.ctp). Dies
ist das einzige View Template des UsersController, das du erstellen
musst. Das nachfolgende Beispiel geht davon aus, dass du bereits den
Form Helper benutzt:

::

    <?php
        echo $session->flash('auth');
        echo $form->create('User', array('action' => 'login'));
        echo $form->input('username');
        echo $form->input('password');
        echo $form->end('Login');
    ?>

Dieser View erstellt ein einfaches Login-Formular, in das Benutzername
und Passwort eingegeben werden können. Nach dem Abschicken des Formulars
übernimmt die Auth Komponente den Rest. Die Session Flash Mitteilung
zeigt jeden Hinweis an, der von der Auth Komponente generiert wird.

Unglaublich aber wahr: Wir sind fertig! So wird unglaublich einfach ein
datenbankgestütztes Authentifikationssystem mit Hilfe der Auth
Komponente implementiert. Wie auch immer, wir können natürlich noch viel
mehr machen. Sehen wir uns mal eine erweiterte Nutzung der Komponte an.

Auth Component Variablen setzen
===============================

Wann immer du die Standardoptionen der AuthComponent ändern möchtest,
kannst du das über die Methode beforeFilter() in deinem Controller
machen. Dort können dann die zahlreichen eingebauten Methoden aufgerufen
oder die Variablen der Komponente direkt gesetzt werden.

Ein Beispiel: um den Namen des Feldes, das benutzt wird, um das Passwort
zu speichern, von 'password' zu 'secretword' zu ändern, muss du das
Folgende tun:

::

    class UsersController extends AppController {
        var $components = array('Auth');

        function beforeFilter() {
            $this->Auth->fields = array(
                'username' => 'username', 
                'password' => 'secretword'
                );
        }
    }

In diesem speziellen Fall musst du ebenfalls die Feldnamen im View
Template ändern!

Ein anderer üblicher Gebrauch der Variablen der Auth Komponente ist es,
einem Benutzer Zugriff zu bestimmten Methoden zu erlauben, ohne das
dieser angemeldet sein muss (standardmäßig beschränkt Auth den Zugriff
zu jeder Aktion außer Login und Logout Methoden).

Wenn wir beispielsweise allen Nutzern Zugang zu den index und view
Methoden gewähren wollen (aber keiner anderen), würden wir das Folgende
machen:

::

    function beforeFilter() {
            $this->Auth->allow('index','view');
    }

Anzeigen der Fehlermeldungen von Auth
=====================================

Um Fehlermeldungen anzuzeigen, die Auth ausgespuckt hat, muss folgender
Code zu deinem View hinzugefügt werden. In diesem Fall wird die
Nachricht unter den regulären Flash Nachrichten angezeigt:

Um alle regulären Flash-Mitteilungen und auch die Benachrichtigungen von
Auth in allen Views anzuzeigen, füge die folgenden zwei Zeilen zur Datei
views/layouts/default.ctp file in die Sektion body hinzu - am besten vor
der Zeile mit "content\_for\_layout line".

::

    <?php
        $session->flash();
        $session->flash('auth');
    ?>

Fehlersuche bei Auth Problemen
==============================

Manchmal kann es schwierig sein, Probleme zu diagnostizieren, wenn das
Verhalten nicht dem erwarteten Verhalten entspricht. Im folgenden finden
sich daher einige wichtige Punkte, die es zu beachten gilt.

*Passwort-Hashing*

Wenn Informationen über ein Formular an eine Action gepostet werden,
hasht die Auth-Komponente automatisch den Inhalt des Passwort-Feldes,
wenn Daten im Username-Feld eingetragen sind. Wenn man also eine
Registrierungsseite erzeugt, sollte man sicherstellen, dass der Nutzer
auch ein "Passwort bestätigen"-Feld ausfüllt, so dass man den Wert
dieser beiden Fehler vergleichen kann. Hier ist ein Beispiel:

::

    <?php 
    function register() {
        if ($this->data) {
            if ($this->data['User']['password'] == $this->Auth->password($this->data['User']['password_confirm'])) {
                $this->User->create();
                $this->User->save($this->data);
            }
        }
    }
    ?>

Ändern der Hash-Funktion
========================

Die Auth-Komponenten verwendet die Sicherheitsklasse um ein Passwort zu
hashen. Standardmäßig verwendet die Sicherheitsklasse das SHA1-Schema.
Um die Hash-Funktion zu wechseln, die von der Auth-Komponente verwendet
wird, wird die ``setHash`` -Methode verwendet, der ``md5``, ``sha1`` or
``sha256`` als erster und einziger Parameter übergeben wird.

::

    Security::setHash('md5'); // oder sha1 oder sha256. 

Die Sicherheitsklasse verwendet einen Salt-Wert (in /app/config/core.php
gesetzt), um das Passwort zu hashen.

Wenn ein anderer Algorithmus zum Passwort-Hashen der Salt-Anwendung
verwendet werden soll als md5/sha1, muss der Standard-Mechanismus
hashPassword überschrieben werden. Dies ist zum Beispiel dann notwendig,
wenn bereits eine Datenbank existiert, die bisher ein Hashing-Schema
ohne Salt verwendet hat. Zu diesem Zweck erzeugt man die Methode
``hashPasswords`` in der Klasse, die für das Hashen der Passwörter
zuständig sein soll (gewöhnlicherweise das User-Model) und setzt
``authenticate`` auf das Objekt, gegen das authentifiert wird
(normalerweise ist dies User), wie hier gezeigt:

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

Mit dem oben gezeigten Code, wird die Methode hashPasswords() des
User-Model jedesmal dann aufgerufen, wenn Cake die
AuthComponent::hashPasswords() aufruft. Hier ist ein Beispiel für eine
hashPassword-Funktion, wenn man bereits eine user-Tabelle mit Plaintext
md5-hash-Passwörtern hat:

::

    class User extends AppModel {
        function hashPasswords($data) {
            if (isset($data['User']['password'])) {
                $data['User']['password'] = md5($data['User']['password']);
                return $data;
            }
            return $data;
        }
    }

AuthComponent-Methoden
======================

action
------

``action (string $action = ':controller/:action')``

Wenn man als Teil seiner ACL-Struktur ACOs verwendet, kann man
folgendermaßen den Pfad zum ACO-Knoten erhalten, der an ein bestimmtes
Controller/Action-Paar geknüpft ist:

::

        $acoNode = $this->Auth->action('users/delete');

Wenn keine Werte übergeben werden, wird das aktuelle
Controller/Action-Paar verwendet.

allow
-----

If you have some actions in your controller that you don't have to
authenticate against (such as a user registration action), you can add
methods that the AuthComponent should ignore. The following example
shows how to allow an action named 'register'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('register');
        }

If you wish to allow multiple actions to skip authentication, you supply
them as parameters to the allow() method:

::

        function beforeFilter() {
            ...
            $this->Auth->allow('foo', 'bar', 'baz');
        }

Shortcut: you may also allow all the actions in a controller by using
'\*'.

::

        function beforeFilter() {
            ...
            $this->Auth->allow('*');
        }

If you are using requestAction in your layout or elements you should
allow those actions in order to be able to open login page properly.

The auth component assumes that your actions names `follow
conventions </de/view/559/URL-Considerations-for-Controller-Names>`_ and
are underscored.

deny
----

Es kann sein, dass du Actions aus der Liste der erlaubten Actions
(festgelegt mittels $this->Auth->allow()) entfernen möchtest. Hier ist
ein Beispiel:

::

        function beforeFilter() {
            $this->Auth->authorize = 'controller';
            $this->Auth->allow('delete');
        }

        function isAuthorized() {
            if ($this->Auth->user('role') != 'admin') {
                $this->Auth->deny('delete');
            }

            ...
        }

hashPasswords
-------------

``hashPasswords ($data)``

This method checks if the ``$data`` contains the username and password
fields as specified by the variable ``$fields`` indexed by the model
name as specified by ``$userModel``. If the ``$data`` array contains
both the username and password, it hashes the password field in the
array and returns the ``data`` array in the same format. This function
should be used prior to insert or update calls of the user when the
password field is affected.

::

        $data['User']['username'] = 'me@me.com';
        $data['User']['password'] = 'changeme';
        $hashedPasswords = $this->Auth->hashPasswords($data);
        pr($hashedPasswords);
        /* returns:
        Array
        (
            [User] => Array
            (
                [username] => me@me.com
                [password] => 8ed3b7e8ced419a679a7df93eff22fae
            )
        )

        */

The *$hashedPasswords['User']['password']* field would now be hashed
using the ``password`` function of the component.

If your controller uses the Auth component and posted data contains the
fields as explained above, it will automatically hash the password field
using this function.

mapActions
----------

If you are using Acl in CRUD mode, you may want to assign certain
non-default actions to each part of CRUD.

::

    $this->Auth->mapActions(
        array(
            'create' => array('someAction'),
            'read' => array('someAction', 'someAction2'),
            'update' => array('someAction'),
            'delete' => array('someAction')
        )
    );

login
-----

``login($data = null)``

If you are doing some sort of Ajax-based login, you can use this method
to manually log someone into the system. If you don't pass any value for
``$data``, it will automatically use POST data passed into the
controller.

for example, in an application you may wish to assign a user a password
and auto log them in after registration. In an over simplified example:

View:

::

    echo $form->create('User',array('action'=>'register'));
    echo $form->input('username');
    echo $form->end('Register');

Controller:

::

    function register() {
        if(!empty($this->data)) {
            $this->User->create();
            $assigned_password = "password";
            $this->data['User']['password'] = $this->Auth->password($assigned_password);
            if($this->User->save($this->data)) {
                // send signup email containing password to the user
                $this->Auth->login($this->data);
                $this->redirect("home");
        }
    }

One thing to note is that you must manually redirect the user after
login as loginRedirect is not called.

``$this->Auth->login($data)`` returns 1 on successful login, 0 on a
failure

logout
------

Mittels dieser Methode kann ein Nutzer schnell de-authentisiert und auf
eine beliebige Seite weitergeleitet werden. Die Methode ist ferner
nützlich, falls man einen "Ausloggen"-Link innerhalb eines geschützten
Bereichs einer Anwendung bereitstellen möchte.

Beispiel:

::

    $this->redirect($this->Auth->logout());

password
--------

``password (string $password)``

Pass in a string, and you can get what the hashed password would look
like. This is an essential functionality if you are creating a user
registration screen where you have users enter their password a second
time to confirm it.

::

    if ($this->data['User']['password'] ==
        $this->Auth->password($this->data['User']['password2'])) {

        // Passwords match, continue processing
        ...
    } else {
        $this->flash('Typed passwords did not match', 'users/register');
    }

The auth component will automatically hash the password field if the
username field is also present in the submitted data

Cake appends your password string to a salt value and then hashes it.
The hashing function used depends on the one set by the core utility
class ``Security`` (sha1 by default). You can use the
``Security::setHash`` function to change the hashing method. The salt
value is used from your application's configuration defined in your
``core.php``

user
----

``user(string $key = null)``

This method provides information about the currently authenticated user.
The information is taken from the session. For example:

::

    if ($this->Auth->user('role') == 'admin') {
        $this->flash('You have admin access');
    }

It can also be used to return the whole user session data like so:

::

    $data['User'] = $this->Auth->user();

If this method returns null, the user is not logged in.

In the view you can use the Session helper to retrieve the currently
authenticated user's information:

::

    $session->read('Auth.User'); // returns complete user record
    $session->read('Auth.User.first_name') //returns particular field value

The session key can be different depending on which model Auth is
configured to use. Eg. If you use model ``Account`` instead of ``User``,
then the session key would be ``Auth.Account``

AuthComponent-Variablen
=======================

Es sind zahlreiche Variablen im Zusammenhang mit Auth vorhanden, die
verwendet werden können. Normalerweise fügt man diese Einstellungen in
die beforeFilter()-Methode des Controllers ein. Man kann diese
Einstellungen aber auch zur beforeFilter()-Methode des App-Controllers
hinzufügen, wenn die Einstellungen für die gesamten Seiten gelten
sollen.

userModel
---------

Es ist auch kein Problem, wenn nicht gegen ein user-Model
authentifiziert werden soll. Mann kann dies einfach dadurch ändern,
indem man diesen Wert auf den Namen des Models setzt, das verwendet
werden soll.

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>

fields
------

Überschreibt die Standard-Felder für Username und Passwort, die für die
Authentifizierung verwendet werden.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>

userScope
---------

Wird benutzt, um zusätzliche Bedingungen für eine erfolgreiche
Authentifizierung zu erstellen.

::

    <?php
        $this->Auth->userScope = array('User.active' => true);
    ?>

loginAction
-----------

Man kann den Standard-Login von */users/login* zu einer Action seiner
Wahl ändern.

::

    <?php
        $this->Auth->loginAction = array('admin' => false, 'controller' => 'members', 'action' => 'login');
    ?>

loginRedirect
-------------

The AuthComponent remembers what controller/action pair you were trying
to get to before you were asked to authenticate yourself by storing this
value in the Session, under the ``Auth.redirect`` key. However, if this
session value is not set (if you're coming to the login page from an
external link, for example), then the user will be redirected to the URL
specified in loginRedirect.

Example:

::

    <?php
        $this->Auth->loginRedirect = array('controller' => 'members', 'action' => 'home');
    ?>

logoutRedirect
--------------

You can also specify where you want the user to go after they are logged
out, with the default being the login action.

::

    <?php
        $this->Auth->logoutRedirect = array(Configure::read('Routing.admin') => false, 'controller' => 'members', 'action' => 'logout');
    ?>

loginError
----------

Change the default error message displayed when someone does not
successfully log in.

::

    <?php
        $this->Auth->loginError = "No, you fool!  That's not the right password!";
    ?>

authError
---------

Change the default error message displayed when someone attempts to
access an object or action to which they do not have access.

::

    <?php
        $this->Auth->authError = "Sorry, you are lacking access.";
    ?>

autoRedirect
------------

Normally, the AuthComponent will automatically redirect you as soon as
it authenticates. Sometimes you want to do some more checking before you
redirect users:

::

    <?php
        function beforeFilter() {
            ...
            $this->Auth->autoRedirect = false;
        }

        ...

        function login() {
        //-- code inside this function will execute only when autoRedirect was set to false (i.e. in a beforeFilter).
            if ($this->Auth->user()) {
                if (!empty($this->data['User']['remember_me'])) {
                    $cookie = array();
                    $cookie['username'] = $this->data['User']['username'];
                    $cookie['password'] = $this->data['User']['password'];
                    $this->Cookie->write('Auth.User', $cookie, true, '+2 weeks');
                    unset($this->data['User']['remember_me']);
                }
                $this->redirect($this->Auth->redirect());
            }
            if (empty($this->data)) {
                $cookie = $this->Cookie->read('Auth.User');
                if (!is_null($cookie)) {
                    if ($this->Auth->login($cookie)) {
                        //  Clear auth message, just in case we use it.
                        $this->Session->del('Message.auth');
                        $this->redirect($this->Auth->redirect());
                    }
                }
            }
        }
    ?>

The code in the login function will not execute *unless* you set
$autoRedirect to false in a beforeFilter. The code present in the login
function will only execute *after* authentication was attempted. This is
the best place to determine whether or not a successful login occurred
by the AuthComponent (should you desire to log the last successful login
timestamp, etc.).

With autoRedirect set to false, you can also inject additional code such
as keeping track of the last successful login timestamp

::

    <?php
        function login() { 
            if( !(empty($this->data)) && $this->Auth->user() ){
                $this->User->id = $this->Auth->user('id');
                $this->User->saveField('last_login', date('Y-m-d H:i:s') );
                $this->redirect($this->Auth->redirect());
            }
        }
    ?>

authorize
---------

Normally, the AuthComponent will attempt to verify that the login
credentials you've entered are accurate by comparing them to what's been
stored in your user model. However, there are times where you might want
to do some additional work in determining proper credentials. By setting
this variable to one of several different values, you can do different
things. Here are some of the more common ones you might want to use.

::

    <?php
        $this->Auth->authorize = 'controller';
    ?>

When authorize is set to 'controller', you'll need to add a method
called isAuthorized() to your controller. This method allows you to do
some more authentication checks and then return either true or false.

::

    <?php
        function isAuthorized() {
            if ($this->action == 'delete') {
                if ($this->Auth->user('role') == 'admin') {
                    return true;
                } 
            }
        if ($this->action == 'view') {           
                    return true;         
            }
        ...
            return false;
        }
    ?>

Remember that this method will be checked after you have already passed
the basic authentication check against the user model.

::

    <?php
        $this->Auth->authorize = 'model';
    ?>

Don't want to add anything to your controller and might be using ACO's?
You can get the AuthComponent to call a method in your user model called
isAuthorized() to do the same sort of thing:

::

    <?php
        class User extends AppModel {
            ...

            function isAuthorized($user, $controller, $action) {

                switch ($action) {
                    case 'default':
                        return false;
                        break;
                    case 'delete':
                        if ($user['User']['role'] == 'admin') {
                            return true;
                        }
                        break;
                }
            }
        }
    ?>

Lastly, you can use authorize with actions such as below

::

    <?php
        $this->Auth->authorize = 'actions';
    ?>

By using actions, Auth will make use of ACL and check with
AclComponent::check(). An isAuthorized function is not needed.

::

    <?php
        $this->Auth->authorize = 'crud';
    ?>

By using crud, Auth will make use of ACL and check with
AclComponent::check(). Actions should be mapped to CRUD (see
`mapActions <https://book.cakephp.org/view/813/mapActions>`_).

sessionKey
----------

Name of the session array key where the record of the current authed
user is stored.

Defaults to "Auth", so if unspecified, the record is stored in
"Auth.{$userModel name}".

::

    <?php
        $this->Auth->sessionKey = 'Authorized';
    ?>

ajaxLogin
---------

If you are doing Ajax or Javascript based requests that require
authenticated sessions, set this variable to the name of a view element
you would like to be rendered and returned when you have an invalid or
expired session.

As with any part of CakePHP, be sure to take a look at `AuthComponent
class <https://api.cakephp.org/class/auth-component>`_ for a more
in-depth look at the AuthComponent.

authenticate
------------

This variable holds a reference to the object responsible for hashing
passwords if it is necessary to change/override the default password
hashing mechanism. See `Changing the Encryption
Type </de/view/566/Changing-Encryption-Type>`_ for more info.

actionPath
----------

If using action-based access control, this defines how the paths to
action ACO nodes is computed. If, for example, all controller nodes are
nested under an ACO node named 'Controllers', $actionPath should be set
to 'Controllers/'.
