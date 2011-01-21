5.2.4 Change Hash Function
--------------------------

The AuthComponent uses the Security class to hash a password. The
Security class uses the SHA1 scheme by default. To change another
hash function used by the Auth component, use the ``setHash``
method passing it ``md5``, ``sha1`` or ``sha256`` as its first and
only parameter.

::

    Security::setHash('md5'); // or sha1 or sha256. 

The Security class uses a salt value (set in /app/config/core.php)
to hash the password.

If you want to use different password hashing logic beyond md5/sha1
with the application salt, you will need to override the standard
hashPassword mechanism - You may need to do this if for example you
have an existing database that previously used a hashing scheme
without a salt. To do this, create the method
``<a href="/view/1259/hashPasswords">hashPasswords</a>`` in the
class you want to be responsible for hashing your passwords
(usually the User model) and set
``<a href="/view/1278/authenticate">authenticate</a>`` to the
object you're authenticating against (usually this is User) like
so:

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

With the above code, the User model hashPasswords() method will be
called each time Cake calls AuthComponent::hashPasswords(). Here's
an example hashPassword function, appropriate if you've already got
a users table full of plain md5-hashed passwords:

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

5.2.4 Change Hash Function
--------------------------

The AuthComponent uses the Security class to hash a password. The
Security class uses the SHA1 scheme by default. To change another
hash function used by the Auth component, use the ``setHash``
method passing it ``md5``, ``sha1`` or ``sha256`` as its first and
only parameter.

::

    Security::setHash('md5'); // or sha1 or sha256. 

The Security class uses a salt value (set in /app/config/core.php)
to hash the password.

If you want to use different password hashing logic beyond md5/sha1
with the application salt, you will need to override the standard
hashPassword mechanism - You may need to do this if for example you
have an existing database that previously used a hashing scheme
without a salt. To do this, create the method
``<a href="/view/1259/hashPasswords">hashPasswords</a>`` in the
class you want to be responsible for hashing your passwords
(usually the User model) and set
``<a href="/view/1278/authenticate">authenticate</a>`` to the
object you're authenticating against (usually this is User) like
so:

::

    function beforeFilter() {
       $this->Auth->authenticate = ClassRegistry::init('User');
       ...
       parent::beforeFilter();
    }

With the above code, the User model hashPasswords() method will be
called each time Cake calls AuthComponent::hashPasswords(). Here's
an example hashPassword function, appropriate if you've already got
a users table full of plain md5-hashed passwords:

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
