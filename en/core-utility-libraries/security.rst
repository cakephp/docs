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

.. php:staticmethod:: generateAuthKey( )

    :rtype: string

        Generate authorization hash.

.. php:staticmethod:: getInstance( )

    :rtype: object

    Singleton implementation to get object instance.


.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    Create a hash from string using given method. Fallback on next
    available method.

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