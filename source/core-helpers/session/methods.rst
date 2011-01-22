7.10.1 Methods
--------------

read($key)
Read from the Session. Returns a string or array depending on the
contents of the session.
id()
Returns the current session ID.
check($key)
Check to see if a key is in the Session. Returns a boolean on the
key's existence.
flash($key)
This will return the contents of the $\_SESSION.Message. It is used
in conjunction with the Session Component's setFlash() method.
error()
Returns the last error in the session if one exists.
