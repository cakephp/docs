Security
########

.. php:namespace:: Cake\Utility

.. php:class:: Security

La `librairie security
<https://api.cakephp.org/3.x/class-Cake.Utility.Security.html>`_
gère les mesures basiques de sécurité telles que les méthodes fournies pour
le hashage et les données chiffrées.

Chiffrer et Déchiffrer les Données
==================================

.. php:staticmethod:: encrypt($text, $key, $hmacSalt = null)
.. php:staticmethod:: decrypt($cipher, $key, $hmacSalt = null)

Chiffre ``$text`` en utilisant AES-256. La ``$key`` devrait être une valeur
avec beaucoup de différence dans les données un peu comme un bon mot de
passe. Le résultat retourné sera la valeur chiffrée avec un checksum HMAC.

Cette méthode va soit utiliser `openssl <http://php.net/openssl>`_ soit `mcrypt
<http://php.net/mcrypt>`_ selon ce qui est disponible sur votre système. Les
données cryptées dans une implémentation sont portables vers les autres
implémentations.

.. warning::
    L'extension `mcrypt <http://php.net/mcrypt>`_ a été dépréciée dans PHP7.1

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

Choisir une Implémentation de Crypto Spécifique
-----------------------------------------------

Si vous mettez à jour une application à partir de CakePHP 2.x, les données
cryptées dans 2.x ne sont pas compatibles avec openssl. Cela est dû au fait
que les données cryptées ne sont pas complètement compatibles avec AES. Si vous
ne voulez pas gérer les problèmes de rechiffrage de vos données, vous pouvez
forcer CakePHP à utiliser ``mcrypt`` en utilisant la méthode ``engine()``::

    // Dans config/bootstrap.php
    use Cake\Utility\Crypto\Mcrypt;

    Security::engine(new Mcrypt());

L'exemple ci-dessus vous permet de lire les données de façon transparente des
versions précédentes de CakePHP, et de chiffrer les nouvelles données pour
être compatible avec OpenSSL.

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

    Vous ne devriez pas utiliser ``hash()`` pour les mots de passe dans les
    nouvelles applications. A la place, vous devez utiliser la classe
    ``DefaultPasswordHasher`` qui utilise bcrypt par défaut.

Getting Secure Random Data
==========================

.. php:staticmethod:: randomBytes($length)

Get ``$length`` number of bytes from a secure random source. This function draws
data from one of the following sources:

* PHP's ``random_bytes`` function.
* ``openssl_random_pseudo_bytes`` from the SSL extension.

If neither source is available a warning will be emitted and an unsafe value
will be used for backwards compatibility reasons.

.. versionadded:: 3.2.3
    The randomBytes method was added in 3.2.3.

.. meta::
    :title lang=fr: Security
    :keywords lang=fr: Security api,secret password,cipher text,php class,class security,text key,security library,objet instance,security measures,basic security,security level,string type,fallback,hash,data security,singleton,inactivity,php encrypt,implementation,php sécurité
