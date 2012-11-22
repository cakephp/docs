Security
########

.. php:class:: Security

La `librairie security <http://api20.cakephp.org/class/security>`_
gère des mesures basiques de sécurité comme des méthodes fournies pour 
le hashage et les données encryptées.

L'API Security
==============

.. php:staticmethod:: cipher( $text, $key )

    :rtype: string

    Crypte/Décrypte un texte selon la clé donnée::

        // Crypte votre mot de passe secret avec my_key
        $secret = Security::cipher('mon mot de passe secret', 'my_key');

        // Plus tard, décryptez votre mot de passe secret
        $nosecret = Security::cipher($secret, 'my_key');

.. php:staticmethod:: generateAuthKey( )

    :rtype: string

        Génére un hash d'autorisation.

.. php:staticmethod:: getInstance( )

    :rtype: object

    L'implémentation Singleton pour obtenir l'instance de l'objet.


.. php:staticmethod:: hash( $string, $type = NULL, $salt = false )

    :rtype: string

    Créer un hash à partir d'une chaîne en utilisant la méthode donnée. Le 
    Fallback sur la prochaine méthode disponible.

.. php:staticmethod:: inactiveMins( )

    :rtype: integer

    Pour avoir les minutes d'inactivité autorisées basée sur le niveau de 
    sécurité.::

        $mins = Security::inactiveMins();
        // Si votre config Security.level est défini à 'medium' alors $mins 
        sera égal 100

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
