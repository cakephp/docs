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
|                 |              | domaine La valeur par défaut est le domaine entier.  |
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
=====================

Le composant Cookie offre plusieur méthode pour travailler avec les cookies.

.. php:method:: write(mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null)

    La méthode write() est le cœur du comosant cookie, $key est le 
    nom de la variable désiré, et $value est l'information à stocker::
    

        $this->Cookie->write('nom', 'Rémy');

    Vous pouvez également grouper vos variables en utilsant la notation point '.' 
    dans les paramêtres de clef::

        $this->Cookie->write('Utilisateur.nom', 'Rémy');
        $this->Cookie->write('Utilisateur.role', 'Chef');

    Si vous vouler écrire plus d'une valeur dans le cookie en une fois, vous 
    pouvez passer un tableau::

        $this->Cookie->write('Utilisateur',
            array('nom' => 'Rémy', 'role' => 'Chef')
        );

    Toutes les valeurs dans le cookie sont encryptée par défaut. Si vous voulez
    stocker vos valeurs en texte clair, definissez le troisème paramêtre de la
    méthode write() à false. L'encryption utilisée sur les valeurs de cookie est
    un système d'encryption très simple. Il utilise ``Security.salt`` et une
    variable de classe de configuration prédéfinie ``Security.cipherSeed`` pour
    encripter les valeurs. Vous deviez changer ``Security.cipherSeed`` dans
    app/Config/core.php pour assurer un meilleur cryptage.::

        $this->Cookie->write('nom', 'Rémy', false);

    Le dernier paramètre à écrire est $expires - le nombre de secondes
    avant que le cookie n'expire. Par convention, ce paramètre peut aussi
    être passé comme une chaîne de texte que la fonction strtotime() de
    php comprends::

        // Both cookies expire in one hour.
        $this->Cookie->write('prénom', 'Rémy', false, 3600);
        $this->Cookie->write('nom', 'Masters', false, '1 hour');

.. php:method:: read(mixed $key = null)

    Cette méthode est utilisée pour lire la valeur d'une variable de cookie
    avec le nom spécifié dans $key.::    

        // Sortie "Rémy"
        echo $this->Cookie->read('nom');

        // Vous pouvez aussi utiliser la notation par point pour lire
        echo $this->Cookie->read('Utilisateur.nom');

        // Pour prendre les variables que vous aviez groupés 
        // en utilisant la notation par point comme un tableau faites quelque chose comme
        $this->Cookie->read('Utilisateur');

        // ceci retourne quelque chose comme array('nom' => 'Rémy', 'role' => 'Chef')
    

.. php:method:: delete(mixed $key)

    Efface une variable de cookie du nom défini dans $key. Fonctionne avec la 
    notation par point::

        // Efface une variable
        $this->Cookie->delete('bar')

        // Efface la variable de cookie bar , mais seulement dans foo
        $this->Cookie->delete('foo.bar')

.. php:method:: destroy()

    Detruit le cookie actuel.


.. meta::
    :title lang=fr: Cookie
    :keywords lang=fr: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
