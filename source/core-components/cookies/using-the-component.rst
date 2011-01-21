5.3.2 Using the Component
-------------------------

The CookieComponent offers a number of methods for working with
Cookies.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**
The write() method is the heart of cookie component, $key is the
cookie variable name you want, and the $value is the information to
be stored.

::

    $this->Cookie->write('name','Larry');


#. ``$this->Cookie->write('name','Larry');``

You can also group your variables by supplying dot notation in the
key parameter.

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  


#. ``$this->Cookie->write('User.name', 'Larry');``
#. ``$this->Cookie->write('User.role','Lead');``

If you want to write more than one value to the cookie at a time,
you can pass an array:

::

    $this->Cookie->write('User',
        array('name'=>'Larry','role'=>'Lead')
    );


#. ``$this->Cookie->write('User',``
#. ``array('name'=>'Larry','role'=>'Lead')``
#. ``);``

All values in the cookie are encrypted by default. If you want to
store the values as plain-text, set the third parameter of the
write() method to false. The encryption performed on cookie values
is fairly uncomplicated encryption system. It uses
``Security.salt`` and a predefined Configure class var
``Security.cipherSeed`` to encrypt values. To make your cookies
more secure you should change ``Security.cipherSeed`` in
app/config/core.php to ensure a better encryption.

::

    $this->Cookie->write('name','Larry',false);


#. ``$this->Cookie->write('name','Larry',false);``

The last parameter to write is $expires – the number of seconds
before your cookie will expire. For convenience, this parameter can
also be passed as a string that the php strtotime() function
understands:

::

    //Both cookies expire in one hour.
      $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');


#. ``//Both cookies expire in one hour.``
#. ``$this->Cookie->write('first_name','Larry',false, 3600);``
#. ``$this->Cookie->write('last_name','Masters',false, '1 hour');``

**read(mixed $key)**

This method is used to read the value of a cookie variable with the
name specified by $key.

::

    // Outputs “Larry”
      echo $this->Cookie->read('name');
      
      //You can also use the dot notation for read
      echo $this->Cookie->read('User.name');
      
      //To get the variables which you had grouped
      //using the dot notation as an array use something like  
      $this->Cookie->read('User');
      
      // this outputs something like array('name' => 'Larry', 'role'=>'Lead')


#. ``// Outputs “Larry”``
#. ``echo $this->Cookie->read('name');``
#. ````
#. ``//You can also use the dot notation for read``
#. ``echo $this->Cookie->read('User.name');``
#. ````
#. ``//To get the variables which you had grouped``
#. ``//using the dot notation as an array use something like``
#. ``$this->Cookie->read('User');``
#. ````
#. ``// this outputs something like array('name' => 'Larry', 'role'=>'Lead')``

**delete(mixed $key)**
Deletes a cookie variable of the name in $key. Works with dot
notation.

::

      //Delete a variable
      $this->Cookie->delete('bar')
      
      //Delete the cookie variable bar, but not all under foo
      $this->Cookie->delete('foo.bar')
     


#. ``//Delete a variable``
#. ``$this->Cookie->delete('bar')``
#. ````
#. ``//Delete the cookie variable bar, but not all under foo``
#. ``$this->Cookie->delete('foo.bar')``
#. ````

**destroy()**
Destroys the current cookie.

5.3.2 Using the Component
-------------------------

The CookieComponent offers a number of methods for working with
Cookies.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**
The write() method is the heart of cookie component, $key is the
cookie variable name you want, and the $value is the information to
be stored.

::

    $this->Cookie->write('name','Larry');


#. ``$this->Cookie->write('name','Larry');``

You can also group your variables by supplying dot notation in the
key parameter.

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  


#. ``$this->Cookie->write('User.name', 'Larry');``
#. ``$this->Cookie->write('User.role','Lead');``

If you want to write more than one value to the cookie at a time,
you can pass an array:

::

    $this->Cookie->write('User',
        array('name'=>'Larry','role'=>'Lead')
    );


#. ``$this->Cookie->write('User',``
#. ``array('name'=>'Larry','role'=>'Lead')``
#. ``);``

All values in the cookie are encrypted by default. If you want to
store the values as plain-text, set the third parameter of the
write() method to false. The encryption performed on cookie values
is fairly uncomplicated encryption system. It uses
``Security.salt`` and a predefined Configure class var
``Security.cipherSeed`` to encrypt values. To make your cookies
more secure you should change ``Security.cipherSeed`` in
app/config/core.php to ensure a better encryption.

::

    $this->Cookie->write('name','Larry',false);


#. ``$this->Cookie->write('name','Larry',false);``

The last parameter to write is $expires – the number of seconds
before your cookie will expire. For convenience, this parameter can
also be passed as a string that the php strtotime() function
understands:

::

    //Both cookies expire in one hour.
      $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');


#. ``//Both cookies expire in one hour.``
#. ``$this->Cookie->write('first_name','Larry',false, 3600);``
#. ``$this->Cookie->write('last_name','Masters',false, '1 hour');``

**read(mixed $key)**

This method is used to read the value of a cookie variable with the
name specified by $key.

::

    // Outputs “Larry”
      echo $this->Cookie->read('name');
      
      //You can also use the dot notation for read
      echo $this->Cookie->read('User.name');
      
      //To get the variables which you had grouped
      //using the dot notation as an array use something like  
      $this->Cookie->read('User');
      
      // this outputs something like array('name' => 'Larry', 'role'=>'Lead')


#. ``// Outputs “Larry”``
#. ``echo $this->Cookie->read('name');``
#. ````
#. ``//You can also use the dot notation for read``
#. ``echo $this->Cookie->read('User.name');``
#. ````
#. ``//To get the variables which you had grouped``
#. ``//using the dot notation as an array use something like``
#. ``$this->Cookie->read('User');``
#. ````
#. ``// this outputs something like array('name' => 'Larry', 'role'=>'Lead')``

**delete(mixed $key)**
Deletes a cookie variable of the name in $key. Works with dot
notation.

::

      //Delete a variable
      $this->Cookie->delete('bar')
      
      //Delete the cookie variable bar, but not all under foo
      $this->Cookie->delete('foo.bar')
     


#. ``//Delete a variable``
#. ``$this->Cookie->delete('bar')``
#. ````
#. ``//Delete the cookie variable bar, but not all under foo``
#. ``$this->Cookie->delete('foo.bar')``
#. ````

**destroy()**
Destroys the current cookie.
