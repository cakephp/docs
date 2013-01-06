Cookies
#######

The CookieComponent is a wrapper around the native PHP setcookie method.
It also includes a host of delicious icing to make coding cookies in
your controllers very convenient. Before attempting to use the
CookieComponent, you must make sure that 'Cookie' is listed in your
controllers' $components array.

Controller-Setup
================

Es existieren zahlreiche Controller-Variablen, mit denen die Erzeugung
und die Verwaltung von Cookies konfiguriert werden kann. Die Definition
dieser speziellen Variablen in der beforeFilter()-Methode des
Controllers ermöglicht die Konfiguration des Verhaltens der
CookieComponent.

Cookie-Variable

Standardwert

Beschreibung

String $name

'CakeCookie'

Der Name des Cookies.

String $key

null

Dieser String wird benutzt um den Wert zu verschlüsseln, der in das
Cookie geschrieben wird. Dieser String sollte zufällig erzeugt und
schwierig zu erraten sein.

String $domain

''

Der Domainname, dem der Zugriff auf das Cookie erlaubt ist. Man schreibt
'.yourdomain.com' um von allen Subdomains dieser Domain zugreifen zu
können.

Int or String $time

'5 Days'

Der Zeitpunkt, wenn das Cookie abläuft. Integer-Werte werden als
Sekunden interpretiert und ein Wert von 0 bezeichnet ein 'session
cookie', d.h. das Cookie wird ungültig, wenn der Browser geschlossen
wird. Wenn ein String gesetzt ist, wird dieser als PHP-Funktion
strtotime() interpretiert. Dieser kann direkt innerhalb der
write()-Methode gesetzt werden.

String $path

'/'

Der Server-Pfad, auf den das Cookie angewendet wird. Wenn $cookiePath
auf '/foo/' gesetzt ist, ist das Cookie nur innerhalb des
/foo/-Verzeichnisses der Domain und seiner Unterverzeichnisse verfügbar.
Der Standardwert ist die gesamte Domain. Auch dieser Wert kann direkt in
der write()-Methode gesetzt werden.

Boolean $secure

false

Gibt an, dass das Cookie nur über eine sichere HTTPS-Verbindung
übertragen werden soll. Wenn dieser Wert auf true gesetzt ist, wird das
Cookie nur gesetzt, wenn eine sichere Verbindung existiert. Auch dieser
Wert kann direkt in der write()-Methode gesetzt werden.

Der folgende Code-Ausschnitt zeigt, wie CookieComponent eingefügt werden
kann und wie die Controller-Variablen gesetzt werden können, um ein
Cookie namens 'baker\_id' für die Domain 'example.com', das eine sichere
Verbindung benötigt gesetzt werden kann. Das Cookie ist im Pfad
'/bakers/preferences/' verfügbar und verliert in einer Stunde seine
Gültigkeit.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // or '1 hour'
      $this->Cookie->path = '/bakers/preferences/'; 
      $this->Cookie->domain = 'example.com';   
      $this->Cookie->secure = true;  //i.e. only sent if using secure HTTPS
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

Als nächstes schauen wir uns an, wie die verschiedenen Methoden von
CookieComponent bentutzt werden können.

Using the Component
===================

The CookieComponent offers a number of methods for working with Cookies.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

The write() method is the heart of cookie component, $key is the cookie
variable name you want, and the $value is the information to be stored.

::

    $this->Cookie->write('name','Larry');

You can also group your variables by supplying dot notation in the key
parameter.

::

    $this->Cookie->write('User.name', 'Larry');
      $this->Cookie->write('User.role','Lead');  

If you want to write more than one value to the cookie at a time, you
can pass an array:

::

    $this->Cookie->write(
      array('name'=>'Larry','role'=>'Lead')
      );

All values in the cookie are encrypted by default. If you want to store
the values as plain-text, set the third parameter of the write() method
to false. The encryption performed on cookie values is fairly
uncomplicated encryption system. It uses Security.salt and a predefined
``CIPHER_SEED`` constant to encrypt values. To make your cookies more
secure you should define ``CIPHER_SEED`` in your bootstrap to ensure a
better encryption. The default value of ``CIPHER_SEED`` is
``76859309657453542496749683645``

::

    $this->Cookie->write('name','Larry',false);

The last parameter to write is $expires – the number of seconds before
your cookie will expire. For convenience, this parameter can also be
passed as a string that the php strtotime() function understands:

::

    //Both cookies expire in one hour.
      $this->Cookie->write('first_name','Larry',false, 3600);
      $this->Cookie->write('last_name','Masters',false, '1 hour');

**read(mixed $key)**

This method is used to read the value of a cookie variable with the name
specified by $key.

::

    // Outputs “Larry”
      echo $this->Cookie->read('name');
      
      //You can also use the dot notation for read
      echo $this->Cookie->read('User.name');
      
      //To get the variables which you had grouped
      //using the dot notation as an array use something like  
      $this->Cookie->read('User');
      
      // this outputs something like array('name' => 'Larry', 'role'=>'Lead')

**del(mixed $key)**

Deletes a cookie variable of the name in $key. Works with dot notation.

::

      //Delete a variable
      $this->Cookie->del('bar')
      
      //Delete the cookie variable bar, but not all under foo
      $this->Cookie->del('foo.bar')
     

**destroy()**

Destroys the current cookie.
