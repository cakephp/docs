Security
########

.. php:class:: Security

The `security library <https://api.cakephp.org/2.x/class-Security.html>`_
handles basic security measures such as providing methods for
hashing and encrypting data.

.. warning::
    The encryption features offered by Security rely on the deprecated
    ``mcrypt`` extension. If you are using PHP>=7.1 you will need to install
    ``mcrypt`` via PECL.

Security API
============

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    Encrypts/Decrypts text using the given key::

        // Encrypt your text with my_key
        $secret = Security::cipher('hello world', 'my_key');

        // Later decrypt your text
        $nosecret = Security::cipher($secret, 'my_key');

    .. warning::

        ``cipher()`` uses a **weak** XOR cipher and should **not** be used.
        It is only included for backwards compatibility.

.. php:staticmethod:: rijndael($text, $key, $mode)

    :param string $text: The text to encrypt
    :param string $key: The key to use for encryption. This must be longer than
        32 bytes.
    :param string $mode: The mode to use, either 'encrypt' or 'decrypt'

    Encrypts/Decrypts text using the rijndael-256 cipher. This requires the
    `mcrypt extension <https://secure.php.net/mcrypt>`_ to be installed::

        // Encrypt some data.
        $encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

        // Later decrypt it.
        $decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');

    ``rijndael()`` can be used to store data you need to decrypt later, like the
    contents of cookies. It should **never** be used to store passwords.
    Instead you should use the one way hashing methods provided by
    :php:meth:`~Security::hash()`

    .. versionadded:: 2.2
        ``Security::rijndael()`` was added in 2.2.

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)

    :param string $plain: The value to encrypt.
    :param string $key: The 256 bit/32 byte key to use as a cipher key.
    :param string $hmacSalt: The salt to use for the HMAC process. Leave null to use Security.salt.

    Encrypt ``$text`` using AES-256. The ``$key`` should be a value with a
    lots of variance in the data, much like a good password. The returned result
    will be the encrypted value with an HMAC checksum.

    This method should **never** be used to store passwords.  Instead you should
    use the one way hashing methods provided by :php:meth:`~Security::hash()`.
    An example use would be::

        // Assuming key is stored somewhere it can be re-used for
        // decryption later.
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
        $result = Security::encrypt($value, $key);

    Encrypted values can be decrypted using :php:meth:`Security::decrypt()`.

    .. versionadded:: 2.5

.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

    :param string $cipher: The ciphertext to decrypt.
    :param string $key: The 256 bit/32 byte key to use as a cipher key.
    :param string $hmacSalt: The salt to use for the HMAC process. Leave null to use Security.salt.

    Decrypt a previously encrypted value. The ``$key`` and ``$hmacSalt``
    parameters must match the values used to encrypt or decryption will fail. An
    example use would be::

        // Assuming key is stored somewhere it can be re-used for
        // decryption later.
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

        $cipher = $user['User']['secrets'];
        $result = Security::decrypt($cipher, $key);

    If the value cannot be decrypted due to changes in the key or HMAC salt
    ``false`` will be returned.

    .. versionadded:: 2.5

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    Create a hash from a string using given method or fallback to next
    available method. If ``$salt`` is set to true, the applications salt
    value will be used::

        // Using the application's salt value
        $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

        // Using a custom salt value
        $md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

        // Using the default hash algorithm
        $hash = Security::hash('CakePHP Framework');

    ``hash()`` also supports other secure hashing algorithms like bcrypt. When
    using bcrypt, you should be mindful of the slightly different usage.
    Creating an initial hash works the same as other algorithms::

        // Create a hash using bcrypt
        Security::setHash('blowfish');
        $hash = Security::hash('CakePHP Framework');

    Unlike other hash types comparing plain text values to hashed values should
    be done as follows::

        // $storedPassword, is a previously generated bcrypt hash.
        $newHash = Security::hash($newPassword, 'blowfish', $storedPassword);

    When comparing values hashed with bcrypt, the original hash should be
    provided as the ``$salt`` parameter. This allows bcrypt to reuse the same
    cost and salt values, allowing the generated hash to return the same
    resulting hash, given the same input value.

    .. versionchanged:: 2.3
        Support for bcrypt was added in 2.3

.. php:staticmethod:: setHash( $hash )

    :rtype: void

    Sets the default hash method for the Security object. This
    affects all objects using Security::hash().

.. meta::
    :title lang=en: Security
    :keywords lang=en: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
