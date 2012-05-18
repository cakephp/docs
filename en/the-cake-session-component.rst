17 The Cake Session Component
-----------------------------

Cake comes preset to save session data in three ways: as temporary files
inside of your Cake installation, using the default PHP mechanism, or
serialized in a database. By default, Cake uses PHP's default settings.
To override this in order to use temp files or a database, edit your
core configuration file at **/app/config/core.php**. Change the
CAKE\_SESSION\_SAVE constant to 'cake', 'php', or 'database', depending
on your application's needs.

core.php Session Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    define('CAKE_SESSION_SAVE', 'php');

In order to use the database session storage, you'll need to create a
table in your database. The schema for that table can be found in
**/app/config/sql/sessions.sql**.

Using the Cake Session Component
--------------------------------

The Cake session component is used to interact with session information.
It includes basic session reading and writing, but also contains
features for using sessions for error and reciept messages (i.e. "Your
data has been saved"). The Session Component is available in all Cake
controllers by default.

Here are some of the functions you'll use most:

-  **check**
-  string *$name*

Checks to see if the current key specified by $name has been set in the
session.

-  **del**
-  string *$name*

-  **delete**
-  string *$name*

Deletes the session variable specified by $name.

-  **error**

Returns the last error created by the CakeSession component. Mostly used
for debugging.

-  **flash**
-  string *$key = 'flash'*

Returns the last message set in the session using setFlash(). If $key
has been set, the message returned is the most recent stored under that
key.

-  **read**
-  string *$name*

Returns the session variable specified by $name.

-  **renew**

Renews the currently active session by creating a new session ID,
deleting the old one, and passing the old session data to the new one.

-  **setFlash**
-  string *$flashMessage*
-  string *$layout = 'default'*
-  array *$params*
-  string *$key = 'flash'*

Writes the message specified by $flashMessage into the session (to be
later retrieved by flash()).

If $layout is set to 'default', the message is stored as
``'<div        class="message">'.$flashMessage.'</div>'``. If $default
is set to an empty string ('') then the message is stored just as it has
been passed. If any other value is passed then the message is stored
inside the Cake view specified by $layout.

Params has been placed in this function for future usage. Check back for
more info.

The $key variable allows you to store flash messages under keys. See
flash() for retreiving a flash message based off of a key.

-  **valid**

Returns true if the session is valid. Best used before read() operations
to make sure that the session data you are trying to access is in fact
valid.

-  **write**
-  string *$name*
-  mixed *$value*

Writes the variable specified by $name and $value into the active
session.
