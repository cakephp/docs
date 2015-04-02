Security
########

.. php:namespace:: Cake\Utility

.. php:class:: Security

La `librairie security <http://api.cakephp.org/class/security>`_
gère les mesures basiques de sécurité telles que les méthodes fournies pour
le hashage et les données chiffrées.

Encrypting and Decrypting Data
==============================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Chiffre ``$text`` en utilisant AES-256. La ``$key`` devrait être une valeur
avec beaucoup de différence dans les données un peu comme un bon mot de
passe. Le résultat retourné sera la valeur chiffrée avec un checksum HMAC.

This method will use either `openssl <http://php.net/openssl>`_ or `mcrypt
<http://php.net/mcrypt>`_ based on what is available on your system. Data
encrypted in one implementation is portable to the other.

Cette méthode **ne** devrait **jamais** être utilisée pour stocker des mots
de passe. A la place, vous devriez utiliser la manière de hasher les mots
de passe fournie par :php:meth:`~Cake\\Utility\\Security::hash()`.
Un exemple d'utilisation serait::

    // En supposant que la clé est stockée quelque part, elle peut être
    // réutilisée pour le déchiffrement plus tard.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
    $result = Security::encrypt($value, $key);

Si vous ne fournissez pas de sel HMAC, la valeur ``Security.salt`` sera
utilisée. Les valeurs chiffrées peuvent être déchiffrées avec
:php:meth:`Cake\\Utility\\Security::decrypt()`.

Déchiffre une valeur chiffrée au préalable. Les paramètres ``$key`` et
``$hmacSalt`` doivent correspondre aux valeurs utilisées pour chiffrer ou
alors le déchiffrement sera un échec. Un exemple d'utilisation serait::

    // En supposant que la clé est stockée quelque part, elle peut être
    // réutilisée pour le déchiffrement plus tard.
    $key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

    $cipher = $user->secrets;
    $result = Security::decrypt($cipher, $key);

Si la valeur ne peut pas être déchiffrée à cause de changements dans la clé ou
le sel HMAC à ``false`` sera retournée.

.. _force-mcrypt:

Choosing a Specific Crypto Implementation
-----------------------------------------

If you are upgrading an application from CakePHP 2.x, data encrypted in 2.x is
not compatible with openssl. This is because the encrypted data is not fully AES
compliant. If you don't want to go through the trouble of re-encrypting your
data, you can force CakePHP to use ``mcrypt`` using the ``engine()`` method::

    // In config/bootstrap.php
    use Cake\Utility\Crypto\Mcrypt;

    Security::engine(new Mcrypt());

The above will allow you to seamlessly read data from older versions of CakePHP,
and encrypt new data to be compatible with OpenSSL.

Hashage des Données
===================

.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

Crée un hash à partir d'une chaîne en utilisant la méthode donnée. Le
Fallback sur la prochaine méthode disponible. Si ``$salt`` est défini à
``true``, la valeur de salt de l'application sera utilisée::

    // Utilise la valeur du salt de l'application
    $sha1 = Security::hash('CakePHP Framework', 'sha1', true);

    // Utilise une valeur du salt personnalisée
    $sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

    // Utilise l'algorithme de hashage par défaut
    $hash = Security::hash('CakePHP Framework');

La méthode ``hash()`` a aussi les stratégies de hashage suivantes:

- md5
- sha1
- sha256

Et tout autre algorithme de hashage que la fonction
``hash()`` de PHP permet.

.. warning::

    Vous ne devriez pas utiliser ``hash()`` pour les mots de passe dans les nouvelles applications.
    A la place, vous devez utiliser la classe ``DefaultPasswordHasher`` qui
    utilise bcrpyt par défaut.

.. meta::
    :title lang=fr: Security
    :keywords lang=fr: Security api,secret password,cipher text,php class,class security,text key,security library,objet instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php sécurité
