Security
########

.. php:class:: Security

La `librairie security <http://api.cakephp.org/2.4/class-Security.html>`_
gère les mesures basiques de sécurité telles que les méthodes fournies pour
le hashage et les données chiffrées.

L'API de Security
=================

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    Chiffre/Déchiffre un texte selon la clé donnée::

        // Chiffre votre mot de passe secret avec my_key
        $secret = Security::cipher('hello world', 'my_key');

        // Plus tard, déchiffrez votre mot de passe secret
        $nosecret = Security::cipher($secret, 'my_key');

    .. warning::

        ``cipher()`` utilise un cipher XOR **faible** et **ne** doit **pas**
        être utilisé pour des données importantes ou sensibles.

.. php:staticmethod:: rijndael($text, $key, $mode)

    :param string $text: Le texte à chiffrer.
    :param string $key: La clé à utiliser pour le chiffrement. Elle doit être
        plus longue que 32 bytes.
    :param string $mode: Le mode à utiliser, soit 'encrypt' soit 'decrypt'.

    Chiffre/Déchiffre le texte en utilisant le cipher rijndael-256. Ceci
    nécessite que `l'extension mcrypt <http://php.net/mcrypt>`_ soit
    installée::

        // Chiffre quelques données.
        $encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

        // Plus tard, le déchiffre.
        $decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');

    ``rijndael()`` peut être utilisée pour stocker des données que vous
    voulez déchiffrer plus tard, comme les contenus des cookies. Il ne devra
    **jamais** être utilisé pour stocker des mots de passe. Pour cela, vous
    devrez utiliser la seule méthode de hashage fourni par
    :php:meth:`~Security::hash()`

    .. versionadded:: 2.2
        ``Security::rijndael()`` a été ajoutée pour la version 2.2.

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)

    :param string $plain: La valeur à chiffrer.
    :param string $key: La clé 256 bit/32 byte à utiliser en clé cipher.
    :param string $hmacSalt: Le sel à utiliser pour le processus HMAC. Laissez null pour utiliser Security.salt.

    Chiffre ``$text`` en utilisant AES-256. La ``$key`` devrait être une valeur
    avec beaucoup de différence dans les données un peu comme un bon mot de
    passe. Le résultat retourné sera la valeur chiffrée avec un checksum HMAC.

    Cette méthode **ne** devrait **jamais** être utilisée pour stocker des mots
    de passe. A la place, vous devriez utiliser la manière de hasher les mots
    de passe fournie par :php:meth:`~Security::hash()`.
    Un exemple d'utilisation serait::

        // En supposant que la clé est stockée quelque part, elle peut être
        // réutilisée pour le déchiffrement plus tard.
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
        $result = Security::encrypt($value, $key);

    Les valeurs chiffrés peuvent être déchiffrées en utilisant
    :php:meth:`Security::decrypt()`.

    .. versionadded:: 2.5

.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

    :param string $cipher: Le ciphertext à déchiffrer.
    :param string $key: La clé 256 bit/32 byte à utiliser pour une clé cipher.
    :param string $hmacSalt: Le sel à utiliser pour un processus HMAC. Laissez null pour utiliser Security.salt.

    Déchiffre une valeur chiffrée au préalable. Les paramètres ``$key`` et
    ``$hmacSalt`` doivent correspondre aux valeurs utilisées pour chiffrer ou
    alors le déchiffrement sera un échec. Un exemple d'utilisation serait::

        // En supposant que la clé est stockée quelque part, elle peut être
        // réutilisée pour le déchiffrement plus tard.
        $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

        $cipher = $user['User']['secrets'];
        $result = Security::decrypt($cipher, $key);

    Si la valeurne peut pas être déchiffrée à cause de changements dans la
    clé ou le sel HMAC à ``false`` sera retournée.

    .. versionadded:: 2.5

.. php:staticmethod:: generateAuthKey( )

    :rtype: string

        Génére un hash d'autorisation.

.. php:staticmethod:: getInstance( )

    :rtype: object

    L'implémentation Singleton pour obtenir l'instance de l'objet.


.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    Crée un hash à partir d'une chaîne en utilisant la méthode donnée. Le
    Fallback sur la prochaine méthode disponible. Si ``$salt`` est défini à
    true, la valeur de salt de l'application sera utilisé::

        // Utilise la valeur du salt de l'application
        $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

        // Utilise une valeur du salt personnalisée
        $md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

        // Utilise l'algorithme de hashage par défaut
        $hash = Security::hash('CakePHP Framework');

    ``hash()`` supporte aussi des algorithms plus sécurisés de hashage comme
    bcrypt. Quand vous utilisez bcrypt, vous devez vous souvenir de son usage
    légèrement différent.
    Créer un hash initial fonctionne de la même façon que les autres
    algorithmes::

        // Crée un hash en utilisant bcrypt
        Security::setHash('blowfish');
        $hash = Security::hash('CakePHP Framework');

    Au contraire des autres types de hash, la comparaison des valeurs de texte
    brut devra être faîte comme ce qui suit::
    
        // $storedPassword, est un hash bcrypt précédemment généré.
        $newHash = Security::hash($newPassword, 'blowfish', $storedPassword);

    Quand vous comparez les valeurs hashées avec bcrypt, le hash original devra
    être fourni avec le paramètre ``$salt``. Cela permet à bcrypt de réutiliser
    le même coût et les valeurs de salt, en autorisant le hash généré pour
    finir avec le même résultat de hash donnant la même valeur d'entrée.

    .. versionchanged:: 2.3
        Le support pour bcrypt a été ajouté dans la version 2.3.


.. php:staticmethod:: inactiveMins( )

    :rtype: integer

    Pour avoir les minutes d'inactivité autorisées basée sur le niveau de
    sécurité.::

        $mins = Security::inactiveMins();
        // Si votre config Security.level est défini à 'medium' alors $mins sera égal 100.

.. php:staticmethod:: setHash( $hash )

    :rtype: void

    Définit la méthode de hash par défaut pour l'objet Security.
    Cela affecte tous les objets en utilisant Security::hash().

.. php:staticmethod:: validateAuthKey( $authKey )

    :rtype: boolean

    Valide les hash d'autorisation.


.. todo::

    Ajoutez plus d'exemples :|

.. meta::
    :title lang=fr: Security
    :keywords lang=fr: Security api,secret password,cipher text,php class,class security,text key,security library,objet instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php sécurité
