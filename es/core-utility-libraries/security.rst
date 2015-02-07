Security
########

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:namespace:: Cake\Utility

.. php:class:: Security

The `security library <http://api.cakephp.org/class/security>`_
handles basic security measures such as providing methods for
hashing and encrypting data.

Encrypting and Decrypting Data
==============================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Encrypt ``$text`` using AES-256. The ``$key`` should be a value with a
lots of variance in the data much like a good password. The returned result
will be the encrypted value with an HMAC checksum.

This method should **never** be used to store passwords.  Instead you should use
the one way hashing methods provided by
:php:meth:`~Cake\Utility\Security::hash()`. An example use would be::

    // Assuming key is stored somewhere it can be re-used for
    // decryption later.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

If you do not supply an HMAC salt, the ``Security.salt`` value will be used.
Encrypted values can be decrypted using
:php:meth:`Cake\\Utility\\Security::decrypt()`.

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
available method. If ``$salt`` is set to true, the applications salt
value will be used::

    // Using the application's salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Using a custom salt value
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Using the default hash algorithm
    $hash = Security::hash('CakePHP Framework');

The ``hash`` method supports the following hashing strategies:

- md5
- sha1
- sha256

And any other hash algorithmn that PHP's ``hash()`` function supports.

.. warning::

    You should not be using ``hash()`` for passwords in new applications.
    Instead you should use the ``DefaultPasswordHasher`` class which uses bcrpyt
    by default.

.. meta::
    :title lang=es: Security
    :keywords lang=es: security api,secret password,cipher text,php class,class security,text key,security library,object instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php security
