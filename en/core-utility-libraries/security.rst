Security
########

The `security library <http://api.cakephp.org/class/security>`_
handles basic security measures such as providing methods for
hashing and encrypting data.

Security API
============

.. php:class:: Security


.. php:method:: cipher( $text, $key )
		    
		    :rtype: string
		
		    Encrypts/Decrypts a text using the given key.
		

.. php:method:: generateAuthKey( )
		    
		    :rtype: string
		
		    Generate authorization hash.
		

.. php:method:: getInstance( )
		    
		    :rtype: object
		
		    Singleton implementation to get object instance.
		

.. php:method:: hash( $string, $type = NULL, $salt = false )
		    
		    :rtype: string
		
		    Create a hash from string using given method. Fallback on next available method.
		

.. php:method:: inactiveMins( )
		    
		    :rtype: integer
		
		    Get allowed minutes of inactivity based on security level.
		

.. php:method:: setHash( $hash )
		    
		    :rtype: void
		
		    Sets the default hash method for the Security object. This affects all objects using Security::hash().
		

.. php:method:: validateAuthKey( $authKey )
		    
		    :rtype: boolean
		
		    Validate authorization hash.


.. todo::

    There is no content here :(