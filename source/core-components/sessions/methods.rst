5.7.1 Methods
-------------

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


#. ``array('User' =>``
#. ``array('username' => 'clarkKent@dailyplanet.com')``
#. ``);``

Dots are used to indicate nested arrays. This notation is used for
all Session component methods wherever a $name is used.

write
~~~~~

``write($name, $value)``

Write to the Session puts $value into $name. $name can be a dot
separated array. For example:

::

    $this->Session->write('Person.eyeColor', 'Green');


#. ``$this->Session->write('Person.eyeColor', 'Green');``

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


#. ``<div id="flashMessage" class="message"> [message] </div>``

$params allows you to pass additional view variables to the
rendered layout. $key sets the $messages index in the Message
array. Default is 'flash'.
Parameters can be passed affecting the rendered div, for example
adding "class" in the $params array will apply a class to the
``div`` output using ``$session->flash()`` in your layout or view.

::

    $this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))


#. ``$this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))``

The output from using ``$session->flash()`` with the above example
would be:

::

    <div id="flashMessage" class="example_class">Example message text</div>


#. ``<div id="flashMessage" class="example_class">Example message text</div>``

read
~~~~

``read($name)``

Returns the value at $name in the Session. If $name is null the
entire session will be returned. E.g.

::

    $green = $this->Session->read('Person.eyeColor');


#. ``$green = $this->Session->read('Person.eyeColor');``

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


#. ``$this->Session->delete('Person.eyeColor');``

Our session data no longer has the value 'Green', or the index
eyeColor set. However, Person is still in the Session. To delete
the entire Person information from the session use.

::

    $this->Session->delete('Person');


#. ``$this->Session->delete('Person');``

destroy
~~~~~~~

The ``destroy`` method will delete the session cookie and all
session data stored in the temporary file system. It will then
destroy the PHP session and then create a fresh session.

::

    $this->Session->destroy()


#. ``$this->Session->destroy()``

error
~~~~~

``error()``

Used to determine the last error in a session.

5.7.1 Methods
-------------

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


#. ``array('User' =>``
#. ``array('username' => 'clarkKent@dailyplanet.com')``
#. ``);``

Dots are used to indicate nested arrays. This notation is used for
all Session component methods wherever a $name is used.

write
~~~~~

``write($name, $value)``

Write to the Session puts $value into $name. $name can be a dot
separated array. For example:

::

    $this->Session->write('Person.eyeColor', 'Green');


#. ``$this->Session->write('Person.eyeColor', 'Green');``

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


#. ``<div id="flashMessage" class="message"> [message] </div>``

$params allows you to pass additional view variables to the
rendered layout. $key sets the $messages index in the Message
array. Default is 'flash'.
Parameters can be passed affecting the rendered div, for example
adding "class" in the $params array will apply a class to the
``div`` output using ``$session->flash()`` in your layout or view.

::

    $this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))


#. ``$this->Session->setFlash('Example message text', 'default', array('class' => 'example_class'))``

The output from using ``$session->flash()`` with the above example
would be:

::

    <div id="flashMessage" class="example_class">Example message text</div>


#. ``<div id="flashMessage" class="example_class">Example message text</div>``

read
~~~~

``read($name)``

Returns the value at $name in the Session. If $name is null the
entire session will be returned. E.g.

::

    $green = $this->Session->read('Person.eyeColor');


#. ``$green = $this->Session->read('Person.eyeColor');``

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


#. ``$this->Session->delete('Person.eyeColor');``

Our session data no longer has the value 'Green', or the index
eyeColor set. However, Person is still in the Session. To delete
the entire Person information from the session use.

::

    $this->Session->delete('Person');


#. ``$this->Session->delete('Person');``

destroy
~~~~~~~

The ``destroy`` method will delete the session cookie and all
session data stored in the temporary file system. It will then
destroy the PHP session and then create a fresh session.

::

    $this->Session->destroy()


#. ``$this->Session->destroy()``

error
~~~~~

``error()``

Used to determine the last error in a session.
