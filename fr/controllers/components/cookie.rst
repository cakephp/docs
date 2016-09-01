CookieComponent
###############

.. php:namespace:: Cake\Controller\Component

.. php:class:: CookieComponent(ComponentRegistry $collection, array $config = [])

Le component Cookie est un conteneur de la méthode native de PHP
``setcookie()``. Il simplifie la manipulation des cookies et chiffre
automatiquement les données du cookie.

Paramétrage des Cookies
=======================

Les cookies peuvent être configurés soit globalement, soit au niveau supérieur.
Les données de configuration globale seront fusionnées avec la configuration de
niveau supérieur. Donc vous devez simplement surcharger les parties qui sont
différentes. Pour configurer les paramètres globaux, utilisez la méthode
``config()``::

    $this->Cookie->config('path', '/');
    $this->Cookie->config([
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

pour configurer une clé spécifique, utilisez la méthode ``configKey()``::

    $this->Cookie->config('User', 'path', '/');
    $this->Cookie->configKey('User', [
        'expires' => '+10 days',
        'httpOnly' => true
    ]);

Il y a plusieurs valeurs de configuration pour les cookies:

expires
    Combien de temps les cookies doivent durer. Par défaut 1 mois.
path
    Le chemin sur le serveur web dans lequel le cookie sera disponible. Si le
    chemin est défini à '/foo/', le cookie sera seulement disponible dans le
    répertoire /foo/ et tous ses sous-répertoires comme /foo/bar/ du domaine.
    La valeur par défaut est le chemin de base de votre application.
domain
    Le domaine pour lequel le cookie est disponible. Pour rendre le cookie
    disponible sur tous les sous-domaines de example.com, définissez le domaine
    à '.example.com'.
secure
    Indique que le cookie soit être transmis avec une connection sécurisée
    HTTPS. Quand il est défini à ``true``, le cookie ne sera défini que si une
    connection sécurisée existe.
key
    La clé de chiffrement utilisé quand les cookies chiffrés sont activés. Par
    défaut à Security.salt.
httpOnly
    Défini à ``true`` pour ne faire que des cookies HTTP. Les Cookies qui sont
    HTTPOnly ne sont pas accessible en JavaScript. Par défaut à ``false``.
encryption
    Le type de chiffrement à utiliser. Par défaut à 'aes'. Peut aussi être
    'rijndael' pour une compatibilité rétroactive.

Utiliser le Component
=====================

Le Component Cookie offre plusieurs méthodes pour travailler avec les Cookies.

.. php:method:: write(mixed $key, mixed $value = null)

    La méthode write() est le cœur du composant Cookie. $key est le
    nom de la variable désirée, et $value est l'information à stocker::

        $this->Cookie->write('name', 'Larry');

    Vous pouvez également grouper vos variables en utilisant la notation point
    '.' dans les paramètres de clé::

        $this->Cookie->write('User.name', 'Larry');
        $this->Cookie->write('User.role', 'Lead');

    Si vous voulez écrire plus d'une valeur dans le cookie en une fois, vous
    pouvez passer un tableau::

        $this->Cookie->write('User',
            ['name' => 'Larry', 'role' => 'Lead']
        );

    Toutes les valeurs dans le cookie sont chiffrées avec AES par défaut. Si
    vous voulez stocker les valeurs en texte, assurez-vous de configurer
    l'espace de la clé::

        $this->Cookie->configKey('User', 'encryption', false);

.. php:method:: read(mixed $key = null)

    Cette méthode est utilisée pour lire la valeur d'une variable de cookie
    avec le nom spécifié dans $key::

        // Sortie "Larry"
        echo $this->Cookie->read('name');

        // Vous pouvez aussi utiliser la notation par point pour lire
        echo $this->Cookie->read('User.name');

        // Pour récupérer les variables que vous aviez groupées en utilisant
        // la notation par point comme tableau, faites quelque chose comme
        $this->Cookie->read('User');

        // ceci retourne quelque chose comme ['name' => 'Larry', 'role' => 'Lead']

    .. warning::
        CookieComponent ne peut pas intéragir avec les valeurs de chaînes vides
        qui contiennent ``,``. Le component va tenter d'interpreter ces valeurs
        en tableaux, ce qui conduit à des résultats incorrects. A la place, vous
        devez utiliser ``$request->cookie()``.

.. php:method:: check($key)

    :param string $key: La clé à vérifier.

    Utilisé pour vérifier si une clé/chemin existe et a une valeur non null.

.. php:method:: delete(mixed $key)

    Efface une variable de cookie dont le nom est défini dans $key. Fonctionne
    avec la notation par point::

        // Efface une variable
        $this->Cookie->delete('bar');

        // Efface la variable bar du cookie, mais rien d'autre sous foo.
        $this->Cookie->delete('foo.bar');

.. meta::
    :title lang=fr: Cookie
    :keywords lang=fr: array controller,php setcookie,cookie string,controller setup,string domain,default description,string name,session cookie,integers,variables,domain name,null
