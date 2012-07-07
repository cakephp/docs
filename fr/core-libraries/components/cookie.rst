Cookie
######

.. php:class:: CookieComponent(ComponentCollection $collection, array $settings = array())
Le composant Cookie est un conteneur de la méthode native de PHP
``setcookie``.Il inclut également toutes sortes de fonctionnalités pour 
rendre le codage de code pour les cookies très pratique.
Avant de tenter d'utiliser le composant Cookie, vous devez vous assurer
que 'Cookie'est listé dnas la partie $components de votre controlleur.

Paramétrage du contrôleur
=========================

Voici un certain nombre de variables de contrôleur qui vous permettent
la manière dont les cookies sont créés et gérés.
Définir ces variables spéciales dans la méthode beforeFilter () 
de votre contrôleur vous permet de définir la façon dont le 
Composant cookie fonctionne.


+-----------------+--------------+------------------------------------------------------+
| variable cookie | par defaut   | description                                          |
+=================+==============+======================================================+
| string $name    |'CakeCookie'  | Le nom du cookie                                     |
+-----------------+--------------+------------------------------------------------------+
| string $key     | null         | Cette chaîne de caractère est utilisée pour encrypter|
|                 |              | la valeur écrite vers le cookie.Cette chaîne devrait |
|                 |              | être aléatoire et difficile à deviner                |
+-----------------+--------------+------------------------------------------------------+
| string $domain  | ''           | Le nom de domaine autoriser à accéder au cookie ex:  |
|                 |              | Utiliser '.votredomaine.com' pour autoriser les      |
|                 |              | accès depuis tout vos sous-domaines                  |
+-----------------+--------------+------------------------------------------------------+
| int or string   | '5 Days'     | Le moment ou votre cookie expirera. Les entiers sont |
| $time           |              | Interpretés comme des secondes et une valeur de 0 est|
|                 |              | équivalente à une 'session cookie':ex. le cookie     |
|                 |              | expire quand le navigateur est fermé. Si une chaîne  |
|                 |              | est définie ce sera interprété avec la fonction PHP  |
|                 |              | strtotime(). Vous pouvez définir cela a l'interieur  |
|                 |              | de la méthode write().                               |
+-----------------+--------------+------------------------------------------------------+
| string $path    | '/'          | Le chemin d'accès au server sur lequel le cookie sera|
|                 |              | appliqué. Si $cookiePath est paramétré à '/foo/', il |
|                 |              | ne sera disponible que dans le repertoires /foo/     |
|                 |              | et tous les sous repertoires comme /foo/bar/ de votre|
|                 |              | domaine La valeur par défaut est le domaine entier. |
|                 |              | Vous pouvez définir cela directement  à l'intérieur  |
|                 |              | de la méthode write().                               |
+-----------------+--------------+------------------------------------------------------+
| boolean $secure | false        | Indique que le cookie ne devrait être transmis qu'au |
|                 |              | travers une connexion HTTPS sécurisée. Quand cela est|
|                 |              | défini à true, le cookie ne sera défini que si une   |
|                 |              | connexion sécurisé existe.Vous pouvez définir cela   |
|                 |              | directement à l'intérieur de la méthode write()      |
+-----------------+--------------+------------------------------------------------------+
| boolean         | false        | Défini à true pour fabriquer uniquement des cookies  |
| $httpOnly       |              | HTTP. Les cookies seulement HTTP ne sont pas         |
|                 |              | disponible par javascript                            |
+-----------------+--------------+------------------------------------------------------+

Les extraits de code de contrôleur suivant montre comment inclure le composant Cookie et
paramétrer les variables de contrôleur nécessaires pour écrire un cookie nommé 'baker\_id'
pour le domaine 'example.com' qui a besoin d'une connexion sécurisée, qui est disponible
sur le chemin '/bakers/preferences/' ,qui expire dans une heure, et est uniquement en
HTTP.

::

    <?php
    public $components = array('Cookie');
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Cookie->name = 'baker_id';
        $this->Cookie->time =  3600;  // ou '1 heure'
        $this->Cookie->path = '/bakers/preferences/';
        $this->Cookie->domain = 'example.com';   
        $this->Cookie->secure = true;  // ex. envoyé uniquement si la connexion est HTTPS
        $this->Cookie->key = 'qSI232qs*&sXOw!';
        $this->Cookie->httpOnly = true;
    }

Ensuite,regardons comment utiliser les différentes méthode du Composant Cookie.

Utiliser le composant
===================

The CookieComponent offers a number of methods for working with Cookies.

.. php:method:: write(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

    The write() method is the heart of cookie component, $key is the
    cookie variable name you want, and the $value is the information to
    be stored::

        <?php
        $this->Cookie->write('name', 'Larry');

    You can also group your variables by supplying dot notation in the
    key parameter::

        <?php
        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    If you want to write more than one value to the cookie at a time,
    you can pass an array::

        <?php
        $this->Cookie->write('User',
            array('name' => 'Larry', 'role' => 'Lead')
        );

    All values in the cookie are encrypted by default. If you want to
    store the values as plain-text, set the third parameter of the
    write() method to false. The encryption performed on cookie values
    is fairly uncomplicated encryption system. It uses
    ``Security.salt`` and a predefined Configure class var
    ``Security.cipherSeed`` to encrypt values. To make your cookies
    more secure you should change ``Security.cipherSeed`` in
    app/Config/core.php to ensure a better encryption.::

        <?php
        $this->Cookie->write('name', 'Larry', false);

    The last parameter to write is $expires – the number of seconds
    before your cookie will expire. For convenience, this parameter can
    also be passed as a string that the php strtotime() function
    understands::

        <?php
        // Both cookies expire in one hour.
        $this->Cookie->write('first_name', 'Larry', false, 3600);
        $this->Cookie->write('last_name', 'Masters', false, '1 hour');

.. php:method:: read(mixed $key = null)

    This method is used to read the value of a cookie variable with the
    name specified by $key.::

        <?php
        // Outputs “Larry”
        echo $this->Cookie->read('name');

        // You can also use the dot notation for read
        echo $this->Cookie->read('User.name');

        // To get the variables which you had grouped
        // using the dot notation as an array use something like
        $this->Cookie->read('User');

        // this outputs something like array('name' => 'Larry', 'role' => 'Lead')

.. php:method:: delete(mixed $key)

    Deletes a cookie variable of the name in $key. Works with dot
    notation::

        <?php
        // Delete a variable
        $this->Cookie->delete('bar')

        // Delete the cookie variable bar, but not all under foo
        $this->Cookie->delete('foo.bar')

.. php:method:: destroy()

    Destroys the current cookie.


.. meta::
    :title lang=en: Cookie
    :keywords lang=en: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null