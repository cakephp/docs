Globales & Fonctions
####################

Alors que la plupart de vos activités quotidiennes avec CakePHP sera
d'initialiser des classes du noyau, CakePHP dispose d'un certain nombre de
fonctions globales de confort qui peuvent arriver à point nommé. La plupart de
ses fonctions sont à utiliser avec les classes cakePHP (classes de chargement
ou de component), mais beaucoup d'autres rendent le travail avec les tableaux
ou les chaînes de caractères un peu plus simple.

Nous allons aussi couvrir une partie des constantes disponibles dans les
applications CakePHP. L'utilisation des constantes disponibles vous aidera à
faire des mises à jour plus lisses, mais sont aussi des moyens pratiques pour
pointer certains fichiers ou répertoires dans vos applications CakePHP.

Fonctions Globales
==================

Voici les fonctions disponibles dans le monde CakePHP. La plupart sont juste des
emballages pratiques pour d'autres fonctionnalités CakePHP, comme le débogage et
la traduction de contenu.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    Cette fonction gère la localisation dans les applications CakePHP.
    ``$string_id`` identifie l'ID de la traduction. Vous pouvez fournir des
    arguments supplémentaires pour remplacer les espaces réservés dans votre
    chaîne::

        __('Vous avez {0} messages non-lus', $number);

    Vous pouvez également fournir un tableau associatif de remplacements::

        __('Vous avez {unread} messages non-lus', ['unread' => $number]);

    .. note::

        Regardez la section
        :doc:`/core-libraries/internationalization-and-localization` pour plus
        d'information.

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Vous permet de remplacer le domaine courant lors de la recherche d'un
    message.

    Utile pour internationaliser un plugin:
     ``echo __d('PluginName', 'Ceci est mon plugin');``

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Vous permet de redéfinir le domaine courant pour une recherche simple au
    pluriel d'un message. Retourne la forme pluriel correcte d'un message
    identifié par ``$singular`` et ``$plural`` pour le compteur ``$count``
    depuis le domaine ``$domain``.

.. php:function:: __dx(string $domain, string $context, string $msg, mixed $args = null)

    Vous permet de remplacer le domaine courant pour la recherche d'un message.
    Permet également de spécifier une contexte.

    Le contexte est un identifiant unique pour la chaîne de traductions qui le
    rend unique dans le même domaine.

.. php:function:: __dxn(string $domain, string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Vous permet de remplacer le domaine courant pour la recherche simple au
    pluriel d'un message. Cela permet également de spécifier une contexte.
    Retourne la forme correcte d'un message identifié par ``$singular`` et
    ``$plural`` pour le compteur ``$count`` depuis le domaine ``$domain``.
    Certaines langues ont plus d'une forme de pluriel dépendant du compteur.

    Le contexte est un identifiant unique pour la chaîne de traductions qui le
    rend unique dans le même domaine.

.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Retourne la forme correcte d'un message identifié par ``$singular`` et
    ``$plural`` pour le compteur ``$count``. Certaines langues ont plus d'une forme de pluriel dépendant du compteur.

.. php:function:: __x(string $context, string $msg, mixed $args = null)

    Le contexte est un identifiant unique pour la chaîne de traductions qui le
    rend unique dans le même domaine.

.. php:function:: __xn(string $context, string $singular, string $plural, integer $count, mixed $args = null)

    Retourne la forme correcte d'un message identifié par ``$singular`` et
    ``$plural`` pour le compteur ``$count``. Cela permet également de spécifier
    une contexte. Certaines langues ont plus d'une forme de pluriel dépendant du
    compteur.

    Le contexte est un identifiant unique pour la chaîne de traductions qui le
    rend unique dans le même domaine.

.. php:function:: collection(mixed $items)

    Vous permet d'instancier un objet :php:class:`Cake\\Collection\\Collection`
    et wrap l'argument passé. le paramètre ``$items`` accepte soit un objet
    ``Traversable`` soit un tableau.

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    Si la variable ``$debug`` du cœur est à ``true``, $var est affiché. Si
    ``$showHTML`` est ``true`` ou laissé null, la donnée est formatée pour être
    visualisée facilement dans un navigateur.

    Si ``$showFrom`` n'est pas défini à ``false``, debug retournera en sortie la
    ligne depuis laquelle il a été appelé. Voir aussi
    :doc:`/development/debugging`

.. php:function:: env(string $key, string $default = null)

    .. versionadded:: 3.1.1
        Le paramètre ``$default`` a été ajouté.

    Récupère une variable d'environnement depuis les sources disponibles.
    Utilisé en secours si ``$_SERVER`` ou ``$_ENV`` sont désactivés.

    Cette fonction émule également ``PHP_SELF`` et ``DOCUMENT_ROOT`` sur les
    serveurs ne les supportant pas. En fait, c'est une bonne idée de toujours
    utiliser ``env()`` plutôt que ``$_SERVER`` ou ``getenv()`` (notamment si
    vous prévoyez de distribuer le code), puisque c'est un wrapper d'émulation
    totale.

.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Raccourci pratique pour ``htmlspecialchars()``.

.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Divise le nom d'un plugin en notation par point en plugin et classname
    (nom de classe). Si ``$name`` de contient pas de point, alors l'index 0 sera
    ``null``.

    Communément utilisé comme ceci
    ``list($plugin, $name) = pluginSplit('Users.User');``

.. php:function:: namespaceSplit(string $class)

    Divise le namespace du nom de la classe.

    Communément utilisé comme ceci
    ``list($namespace, $className) = namespaceSplit('Cake\Core\App');``

.. php:function:: dd(mixed $var, boolean $showHtml = null)

    Cette méthode fonctionne comme ``debug()`` sauf qu'elle arrêtera
    l'exécution du script.
    Si la variable "core" ``$debug`` vaut ``true``, ``$var`` sera affichée.
    Si ``$showHTML`` vaut ``true`` ou laisser à ``null``, les données seront
    rendus dans un affichage *user-friendly*. Plus de détails : :doc:`/development/debugging`

.. php:function:: pr(mixed $var)

    Raccourci pratique pour ``print_r()``, avec un ajout de balises ``<pre>``
    autour de la sortie.

.. php:function:: pj(mixed $var)

    JSON pretty print convenience function, with the addition of wrapping
    ``<pre>`` tags around the output.

    Il a pour objectif de debugger la représentation JSON des objets et
    tableaux.

Définitions des constantes du noyau
===================================

La plupart des constantes suivantes font référence aux chemins dans votre
application.

.. php:const:: APP

   Chemin absolu du répertoire de l'application avec un slash.

.. php:const:: APP_DIR

    La même chose que ``app`` ou le nom du répertoire de votre application.

.. php:const:: CACHE

    Chemin vers le répertoire de cache. il peut être partagé entre les hôtes
    dans une configuration multi-serveurs.

.. php:const:: CAKE

    Chemin vers le répertoire de CAKE.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Chemin vers la racine du répertoire lib.

.. php:const:: CONFIG

   Chemin vers le répertoire config.

.. php:const:: CORE_PATH

   Chemin vers le répertoire racine avec un slash à la fin.

.. php:const:: DS

    Raccourci pour la constante PHP ``DIRECTORY_SEPARATOR``, qui est égale à
    ``/`` pour Linux et ``\\`` pour Windows.

.. php:const:: LOGS

    Chemin du répertoire des logs.

.. php:const:: ROOT

    Chemin vers le répertoire racine.

.. php:const:: TESTS

    Chemin vers le répertoire de test.

.. php:const:: TMP

    Chemin vers le répertoire des fichiers temporaires.

.. php:const:: WWW\_ROOT

    Chemin d'accès complet vers la racine web (webroot).

Définition de Constantes de Temps
=================================

.. php:const:: TIME_START

    timestamp Unix en microseconde au format float du démarrage de
    l'application.

.. php:const:: SECOND

    Égale à 1

.. php:const:: MINUTE

    Égale à 60

.. php:const:: HOUR

    Égale à 3600

.. php:const:: DAY

    Égale à 86400

.. php:const:: WEEK

    Égale à 604800

.. php:const:: MONTH

    Égale à 2592000

.. php:const:: YEAR

    Égale à 31536000

.. meta::
    :title lang=fr: Constantes Globales et Fonctions
    :keywords lang=fr: internationalization et localization,constantes globales,exemple config,tableau php,convenience functions,core libraries,classes component,optional number,fonctions globales,string string,core classes,format strings,messages non lus,placeholders,fonctions utiles,tableaux,paramètres,existence,traductions
