Sessions
########

The CakePHP session component provides a way to persist client data
between page requests. It acts as a wrapper for the $\_SESSION as
well as providing convenience methods for several $\_SESSION
related functions.

Sessions can be persisted in a few different ways. The default is
to use the settings provided by PHP; however, other options exist.

cake
    Saves the session files in your app's tmp/sessions directory.
database
    Uses CakePHP's database sessions.
cache
    Use the caching engine configured by Cache::config(). Very useful
    in conjunction with Memcache (in setups with multiple application
    servers) to store both cached data and sessions.
php
    The default setting. Saves session files as indicated by php.ini

To change the default Session handling method alter the
Session.save Configuration to reflect the option you desire. If you
choose 'database' you should also uncomment the Session.database
settings and run the database session SQL file located in
app/config

To provide a custom configuration, set Session.save Configuration
to a filename. CakePHP will use your file in the CONFIGS directory
for the settings.

::

    // app/config/core.php
    Configure::write('Session.save','my_session');

This will allow you to customize the session handling.

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

Methods
=======

The Session component is used to interact with session information.
It includes basic CRUD functions as well as features for creating
feedback messages to users.

It should be noted that Array structures can be created in the
Session by using dot notation. So User.username would reference the
following:

::

        array('User' => 
                array('username' => 'clarkKent@dailyplanet.com')
        );

Dots are used to indicate nested arrays. This notation is used for
all Session component methods wherever a $name is used.

write
~~~~~

``write($name, $value)``

Write to the Session puts $value into $name. $name can be a dot
separated array. For example:

::

    $this->Session->write('Person.eyeColor', 'Green');

This writes the value 'Green' to the session under Person =>
eyeColor.

setFlash
~~~~~~~~

``setFlash($message, $element = 'default', $params = array(), $key = 'flash')``

Used to set a session variable that can be used for output in the
View. $element allows you to control which element (located in
``/app/views/elements``) should be used to render the message in.
In the element the message is available as ``$message``. If you
leave the ``$element`` set to 'default', the message will be
wrapped with the following:
::

    <div id="flashMessage" class="message"> [message] </div>

$params allows you to pass additional view variables to the
rendered layout. $key sets the $messages index in the Message
array. Default is 'flash'.
Parameters can be passed affecting the rendered div, for example
adding "class" in the $params array will apply a class to the
``div`` output using ``$session->flash()`` in your layout or view.

::

    $this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))

The output from using ``$session->flash()`` with the above example
would be:

::

    <div id="flashMessage" class="example_class">Example message text</div>

read
~~~~

``read($name)``

Returns the value at $name in the Session. If $name is null the
entire session will be returned. E.g.

::

    $green = $this->Session->read('Person.eyeColor');

Retrieve the value Green from the session.

check
~~~~~

``check($name)``

Used to check if a Session variable has been set. Returns true on
existence and false on non-existence.

delete
~~~~~~

``delete($name)``

Clear the session data at $name. E.g.

::

    $this->Session->delete('Person.eyeColor');

Our session data no longer has the value 'Green', or the index
eyeColor set. However, Person is still in the Session. To delete
the entire Person information from the session use.

::

    $this->Session->delete('Person');

destroy
~~~~~~~

The ``destroy`` method will delete the session cookie and all
session data stored in the temporary file system. It will then
destroy the PHP session and then create a fresh session.

::

    $this->Session->destroy()

error
~~~~~

``error()``

Used to determine the last error in a session.
