Cookie
######

.. php:class:: CookieComponent(ComponentCollection $collection, array $settings = array())

Le component Cookie est un conteneur de la méthode native de PHP
``setcookie``. Il inclut également toutes sortes de fonctionnalités pour
rendre l'écriture de code pour les cookies très pratique.
Avant de tenter d'utiliser le component Cookie, vous devez vous assurer
que 'Cookie' est listé dans la partie $components de votre controller.

Paramétrage du controller
=========================

Voici un certain nombre de variables du controller qui vous permettent de
configurer la manière dont les cookies sont créés et gérés. Définir ces
variables spéciales dans la méthode beforeFilter() de votre controller vous
permet de modifier le fonctionnement du component Cookie.

+-----------------+--------------+------------------------------------------------------+
| variable Cookie | par défaut   | description                                          |
+=================+==============+======================================================+
| string $name    |'CakeCookie'  | Le nom du cookie                                     |
+-----------------+--------------+------------------------------------------------------+
| string $key     | null         | Cette chaîne de caractères est utilisée pour chiffrer|
|                 |              | la valeur écrite dans le cookie. Cette chaîne devrait|
|                 |              | être aléatoire et difficile à deviner.               |
|                 |              | Quand on utilise le chiffrement Rijndael ou le       |
|                 |              | chiffrement AES, cette valeur doit être plus grande  |
|                 |              | que 32 bytes.                                        |
+-----------------+--------------+------------------------------------------------------+
| string $domain  | ''           | Le nom de domaine autorisé à accéder au cookie.      |
|                 |              | Utilisez par exemple '.votredomaine.com' pour        |
|                 |              | autoriser les accès depuis tous vos sous-domaines.   |
+-----------------+--------------+------------------------------------------------------+
| int or string   | '5 Days'     | Le moment où votre cookie expirera. Les entiers sont |
| $time           |              | interprétés comme des secondes et une valeur de 0 est|
|                 |              | indique qu'il s'agit d'un cookie de session : il     |
|                 |              | expirera lors de la fermeture du navigateur. Si      |
|                 |              | une chaîne est définie, elle sera interprétée avec   | 
|                 |              | la fonction PHP strtotime(). Vous pouvez définir cela|
|                 |              | à l'intérieur de la méthode write().                 |
+-----------------+--------------+------------------------------------------------------+
| string $path    | '/'          | Le chemin d'accès au server sur lequel le cookie sera|
|                 |              | appliqué. Si $path est paramétré à '/foo/', il       |
|                 |              | ne sera disponible que dans le répertoire /foo/      |
|                 |              | et tous les sous-répertoires comme /foo/bar/ de votre|
|                 |              | domaine. La valeur par défaut est le domaine entier. |
|                 |              | Vous pouvez définir cela directement à l'intérieur   |
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
|                 |              | disponibles en JavaScript                            |
+-----------------+--------------+------------------------------------------------------+

Les extraits de code de controller suivants montrent comment inclure le
component Cookie et paramétrer les variables du controller nécessaires pour
écrire un cookie nommé 'baker\_id' pour le domaine 'example.com' qui a besoin
d'une connexion sécurisée, qui est disponible au chemin
'/bakers/preferences/', qui expire dans une heure, et est uniquement en HTTP.

::

    public $components = array('Cookie');

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Cookie->name = 'baker_id';
        $this->Cookie->time = 3600;  // ou '1 hour'
        $this->Cookie->path = '/bakers/preferences/';
        $this->Cookie->domain = 'example.com';   
        $this->Cookie->secure = true;  // ex. seulement envoyé si on utilise un HTTPS sécurisé
        $this->Cookie->key = 'qSI232qs*&sXOw!adre@34SAv!@*(XSL#$%)asGb$@11~_+!@#HKis~#^';
        $this->Cookie->httpOnly = true;
        $this->Cookie->type('aes');
    }

Ensuite, regardons comment utiliser les différentes méthodes du Component
Cookie.

Utiliser le Component
=====================

Le Component Cookie offre plusieurs méthodes pour travailler avec les Cookies.

.. php:method:: write(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

    La méthode write() est le cœur du composant Cookie, $key est le
    nom de la variable désirée, et $value est l'information à stocker::

        $this->Cookie->write('nom', 'Rémy');

    Vous pouvez également grouper vos variables en utilisant la notation point
    '.' dans les paramètres de clé::

        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    Si vous voulez écrire plus d'une valeur dans le cookie en une fois, vous
    pouvez passer un tableau::

        $this->Cookie->write('User',
            array('name' => 'Larry', 'role' => 'Lead')
        );

    Toutes les valeurs dans le cookie sont chiffrées par défaut. Si vous voulez
    stocker vos valeurs en texte clair, définissez le troisième paramètre de la
    méthode write() à false. Vous devriez vous rappeler de définir le mode de
    chiffrement à 'aes' pour vous assurer que les valeurs sont chiffrées de façon
    sécurisée::

        $this->Cookie->write('name', 'Larry', false);

    Le dernier paramètre à écrire est $expires - le nombre de secondes
    avant que le cookie n'expire. Par convention, ce paramètre peut aussi
    être passé comme une chaîne de caractères que la fonction strtotime() de
    PHP comprend::

        // Les deux cookies expirent dans une heure.
        $this->Cookie->write('first_name', 'Larry', false, 3600);
        $this->Cookie->write('last_name', 'Masters', false, '1 hour');

.. php:method:: read(mixed $key = null)

    Cette méthode est utilisée pour lire la valeur d'une variable de cookie
    avec le nom spécifié dans $key. ::    

        // Sortie "Larry"
        echo $this->Cookie->read('name');

        // Vous pouvez aussi utiliser la notation par point pour lire
        echo $this->Cookie->read('User.name');

        // Pour prendre les variables que vous aviez groupées en utilisant
        // la notation par point comme tableau, faites quelque chose comme
        $this->Cookie->read('User');

        // ceci retourne quelque chose comme array('name' => 'Larry', 'role' => 'Lead')

.. php:method:: check($key)

    :param string $key: La clé à vérifier.

    Utilisé pour vérifier si une clé/chemin existe et a une valeur non null.

    .. versionadded:: 2.3
        ``CookieComponent::check()`` a été ajoutée dans la version 2.3

.. php:method:: delete(mixed $key)

    Efface une variable de cookie dont le nom est défini dans $key. Fonctionne avec la
    notation par point::

        // Efface une variable
        $this->Cookie->delete('bar');

        // Efface la variable bar du cookie, mais seulement dans foo.
        $this->Cookie->delete('foo.bar');

.. php:method:: destroy()

    Détruit le cookie actuel.

.. php:method:: type($type)

    Vous permet de changer le schéma de chiffrement. Par défaut, le schéma
    'cipher' est utilisé pour une compatibilité rétroactive. Cependant, vous
    devriez toujours utiliser les schémas 'rijndael' ou 'aes'.

    .. versionchanged:: 2.2
        Le type 'rijndael' a été ajouté.

    .. versionadded:: 2.5
        Le type 'aes' a été ajouté.


.. meta::
    :title lang=fr: Cookie
    :keywords lang=fr: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
