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
        $session->flash('auth');
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

Probleme mit Auth beheben
=========================

Manchmal kann es ziemlich schwierig sein, unerwartete Probleme mit Auth
zu diagnostizieren, also hier ein paar Ratschläge zum Einprägen.

Password Hashing
----------------

Das automatische Erzeugen eines Hashes des Passwortes geschieht **nur**,
wenn die übertragenen Daten sowohl den Benutzernamen als auch das
Passwort enthalten.

Wenn Informationen über ein Formular an eine Aktion gesendet werden,
wendet die Auth-Komponente automatisch die Hash-Funktion auf das
Passwort an, wenn zusätzlich ein Benutzername übertragen wird. Wenn Sie
versuchen eine Art Registrierungsseite zu erstellen, achten Sie darauf,
dass der Benutzer ein 'Passwort bestätigen'-Feld ausfüllt, so dass Sie
die beiden Felder vergleichen können. Hier ist ein Beispielcode:

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

Change Hash Function
====================

The AuthComponent uses the Security class to hash a password. The
Security class uses the SHA1 scheme by default. To change another hash
function used by the Auth component, use the ``setHash`` method passing
it ``md5``, ``sha1`` or ``sha256`` as its first and only parameter.

::

    Security::setHash('md5'); // or sha1 or sha256. 

The Security class uses a salt value (set in /app/config/core.php) to
hash the password.

If you want to use different password hashing logic beyond md5/sha1 with
the application salt, you will need to override the standard
hashPassword mechanism - You may need to do this if for example you have
an existing database that previously used a hashing scheme without a
salt. To do this, create the method ``hashPasswords`` in the class you
want to be responsible for hashing your passwords (usually the User
model) and set ``authenticate`` to the object you're authenticating
against (usually this is User) like so:

::

    class AppController extends Controller {
        var $components = array('Session', 'Auth');
        
        function beforeFilter() {
            $this->Auth->authenticate = ClassRegistry::init('User');
        }
    }

With the above code, the User model hashPasswords() method will be
called each time Cake calls AuthComponent::hashPasswords(). Here's an
example hashPassword function, appropriate if you've already got a users
table full of plain md5-hashed passwords:

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

AuthComponent Methods
=====================

action
------

``action (string $action = ':controller/:action')``

If you are using ACO's as part of your ACL structure, you can get the
path to the ACO node bound to a particular controller/action pair:

::

        $acoNode = $this->Auth->action('users/delete');

If you don't pass in any values, it uses the current controller / action
pair

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
conventions </de/view/905/URL-Considerations-for-Controller-Names>`_ and
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

    echo $this->Form->create('User',array('action'=>'register'));
    echo $this->Form->input('username');
    echo $this->Form->end('Register');

Controller:

::

    function register() {
        if(!empty($this->data)) {
            $this->User->create();
            $assigned_password = 'password';
            $this->data['User']['password'] = $assigned_password;
            if($this->User->save($this->data)) {
                // send signup email containing password to the user
                $this->Auth->login($this->data);
                $this->redirect('home');
        }
    }

One thing to note is that you must manually redirect the user after
login as loginRedirect is not called.

``$this->Auth->login($data)`` returns 1 on successful login, 0 on a
failure

logout
------

Provides a quick way to de-authenticate someone, and redirect them to
where they need to go. This method is also useful if you want to provide
a 'Log me out' link inside a members' area of your application.

Example:

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
        // Do something
    }

It can also be used to return the whole user session data like so:

::

    $data['User'] = $this->Auth->user();

If this method returns null, the user is not logged in.

In the view you can use the Session helper to retrieve the currently
authenticated user's information:

::

    $this->Session->read('Auth.User'); // returns complete user record
    $this->Session->read('Auth.User.first_name') //returns particular field value

The session key can be different depending on which model Auth is
configured to use. Eg. If you use model ``Account`` instead of ``User``,
then the session key would be ``Auth.Account``

AuthComponent Variables
=======================

Now, there are several Auth-related variables that you can use as well.
Usually you add these settings in your Controller's beforeFilter()
method. Or, if you need to apply such settings site-wide, you would add
them to App Controller's beforeFilter()

userModel
---------

Don't want to use a User model to authenticate against? No problem, just
change it by setting this value to the name of the model you want to
use.

::

    <?php
        $this->Auth->userModel = 'Member';
    ?>

fields
------

Overrides the default username and password fields used for
authentication.

::

    <?php
        $this->Auth->fields = array('username' => 'email', 'password' => 'passwd');
    ?>

userScope
---------

Nutze den userScope der Auth-Komponente, um zusätzliche Voraussetzungen
für eine erfolgreiche Authentifizierung festzulegen.

::

    <?php
        $this->Auth->userScope = array('User.active' => true);
    ?>

loginAction
-----------

You can change the default login from */users/login* to be any action of
your choice.

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

Legt die Standard Error-Nachricht fest, die angezeigt wird, wenn jemand
unberechtigt eine geschützte Seite aufruft.

::

    <?php
        $this->Auth->authError = "Zugriff verweigert. Fehlende Berechtigungen.";
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
                        $this->Session->delete('Message.auth');
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
                } else {
                    return false;
                }
            }

            return true;
        }
    ?>

Remember that this method will be checked after you have already passed
the basic authentication check against the user model.

::

    <?php
        $this->Auth->authorize = array('model'=>'User');
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
`mapActions <https://book.cakephp.org/view/1260/mapActions>`_).

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

flashElement
------------

In case you want to have another layout for your Authentication error
message you can define with the flashElement variable that another
element will be used for display.

::

    <?php
        $this->Auth->flashElement    = "message_error";
    ?>

In this newly defined element to ensure your ``authError`` and
``loginError`` messages are displayed ensure you echo ``$message``.
Here's an example:

::

    //    Code in /app/views/elements/message_error.ctp

    <div class="ui-state-error">
        <?php echo $message; ?>
    </div>

Now ``authError`` & ``loginError`` messages will be displayed using
jQuery UI's custom theme. Obviously, you can change the HTML element to
fit whatever need you have. The important thing here being that the
``$message`` variable was echo'd and the user will see the appropriate
information...instead of a blank ``div``.

allowedActions
==============

Set the default allowed actions to allow if setting the component to
'authorize' => 'controller'

::

    var $components = array(
      'Auth' => array(
        'authorize' => 'controller',
        'allowedActions' => array('index','view','display');
      )
    );

index, view, and display actions are now allowed by default.
