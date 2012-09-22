Security
########

.. php:class:: Security

The `security library <http://api20.cakephp.org/class/security>`_
handles basic security measures such as providing methods for
hashing and encrypting data.

Security API
============

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    Encrypts/Decrypts a text using the given key.::

        <?php
        // Encrypt your secret password with my_key
        $secret = Security::cipher('my secret password', 'my_key');

        // Later decrypt your secret password
        $nosecret = Security::cipher($secret, 'my_key');

    ``cipher()`` uses a **weak** XOR cipher and should **not** be used for
    important or sensitive data.

.. php:staticmethod:: rijndael($text, $key, $mode)

    :param string $text: The text to encrypt
    :param string $key: The key to use for encryption.  This must be longer than
        32 bytes.
    :param string $mode: The mode to use, either 'encrypt' or 'decrypt'

    Encrypts/Decrypts text using the rijndael-256 cipher. This requires the
    `mcrypt extension <http://php.net/mcrypt>`_ to be installed::

        <?php
        // Encrypt some data.
        $encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

        // Later decrypt it.
        $decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');

    ``rijndael()`` can be used to store data you need to decrypt later, like the
    contents of cookies.  It should **never** be used to store passwords.
    Instead you should use the one way hashing methods provided by
    :php:meth:`~Security::hash()`

    .. versionadded:: 2.2
        ``Security::rijndael()`` was added in 2.2.

.. php:staticmethod:: generateAuthKey( )

    :rtype: string

        Generate authorization hash.

.. php:staticmethod:: getInstance( )

    :rtype: object

    Singleton implementation to get object instance.


.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    Create a hash from string using given method. Fallback on next
    available method. If ``$salt`` is set to true, the applications salt
    value will be used::

        <?php
        // Using the application's salt value
        $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

        // Using a custom salt value
        $md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

        // Using the default hash algorithm
        $hash = Security::hash('CakePHP Framework');

    ``hash()`` also supports more secure hashing algorithms like bcrypt.  When
    using bcrypt, you should be mindful of the slightly different usage.
    Creating an initial hash works the same as other algorithms::

        <?php
        // Create a hash using bcrypt
        Security::setHash('blowfish');
        $hash = Security::hash('CakePHP Framework');

    Unlike other hash types comparing plain text values to hashed values should
    be done as follows::

        <?php
        // $storedPassword, is a previously generated bcrypt hash.
        $newHash = Security::hash($newPassword, 'blowfish', $storedPassword);

    When comparing values hashed with bcrypt, the original hash should be
    provided as the ``$salt`` parameter.  This allows bcrypt to reuse the same
    cost and salt values, allowing the generated hash to end up with the same
    resulting hash given the same input value.

    .. versionchanged:: 2.3
        Support for bcrypt was added in 2.3


.. php:staticmethod:: inactiveMins( )

    :rtype: integer

    Get allowed minutes of inactivity based on security level.::

        <?php
        $mins = Security::inactiveMins();
        // If your config Security.level is set to 'medium' then $mins will equal 100

.. php:staticmethod:: setHash( $hash )

    :rtype: void

    Sets the default hash method for the Security object. This 
    affects all objects using Security::hash().

.. php:staticmethod:: validateAuthKey( $authKey )

    :rtype: boolean

    Validate authorization hash.


.. todo::

    Add more examples :|

.. meta::
    :title lang=en: Security
    :keywords lang=en: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
