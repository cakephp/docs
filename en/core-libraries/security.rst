Security Utility
################

.. php:namespace:: Cake\Utility

.. php:class:: Security

The `security library
<https://api.cakephp.org/5.x/class-Cake.Utility.Security.html>`_
handles basic security measures such as providing methods for
hashing and encrypting data.

Encrypting and Decrypting Data
==============================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Encrypt ``$text`` using AES-256. The ``$key`` should be a value with a
lots of variance in the data much like a good password. The returned result
will be the encrypted value with an HMAC checksum.

The `openssl <https://php.net/openssl>`_ extension is required for encrypting/decrypting.

An example use would be::

    // Assuming key is stored somewhere it can be re-used for
    // decryption later.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

If you do not supply an HMAC salt, the value of ``Security::getSalt()`` will be used.
Encrypted values can be decrypted using
:php:meth:`Cake\\Utility\\Security::decrypt()`.

This method should **never** be used to store passwords.

Decrypt a previously encrypted value. The ``$key`` and ``$hmacSalt``
parameters must match the values used to encrypt or decryption will fail. An
example use would be::

    // Assuming the key is stored somewhere it can be re-used for
    // Decryption later.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

If the value cannot be decrypted due to changes in the key or HMAC salt
``false`` will be returned.

Hashing Data
============

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

Create a hash from string using given method. Fallback on next
available method. If ``$salt`` is set to ``true``, the application's salt
value will be used::

    // Using the application's salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Using a custom salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Using the default hash algorithm
    $hash = Security::hash('CakePHP Framework');

The ``hash()`` method supports the following hashing strategies:

- md5
- sha1
- sha256

And any other hash algorithm that PHP's ``hash()`` function supports.

.. warning::

    You should not be using ``hash()`` for passwords in new applications.
    Instead you should use the ``DefaultPasswordHasher`` class which uses bcrypt
    by default.

Getting Secure Random Data
==========================

.. php:staticmethod:: randomBytes($length)

Get ``$length`` number of bytes from a secure random source. This function draws
data from one of the following sources:

* PHP's ``random_bytes`` function.
* ``openssl_random_pseudo_bytes`` from the SSL extension.

If neither source is available a warning will be emitted and an unsafe value
will be used for backwards compatibility reasons.

.. php:staticmethod:: randomString($length)

Get a random string ``$length`` long from a secure random source. This method
draws from the same random source as ``randomBytes()`` and will encode the data
as a hexadecimal string.

.. meta::
    :title lang=en: Security
    :keywords lang=en: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
