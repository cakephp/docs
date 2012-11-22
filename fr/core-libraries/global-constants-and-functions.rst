Constantes globales et fonctions
################################

Alors que la plupart de vos activités quotidiennes avec CakePHP
sera d'initialiser des classes du noyau, CakePHP dispose d'un
certain nombre de fonctions globales de confort qui peuvent
arriver à point nommé. La plupart de ses fonctions sont à
utiliser avec les classes cakePHP (classes de chargement ou de
component), mais beaucoup d'autres rendent le travail avec les
tableaux ou les chaînes de caractères un peu plus simple.

Nous allons aussi couvrir une partie des constantes disponibles 
dans les applications CakePHP. L'utilisation des constantes 
disponibles vous aidera à faire des mises à jour plus lisses,
mais sont aussi des moyens pratiques pour pointer certains
fichiers ou répertoires dans vos applications CakePHP.

Fonctions Globales
==================

Voici les fonctions disponibles dans le monde CakePHP. La plupart
sont juste des emballages pratiques pour d'autres fonctionnalités
CakePHP, comme le débogage et la traduction de contenu.

.. php:function:: \_\_(string $string_id, [$formatArgs])

    Cette fonction gère la localisation dans les applications 
    CakePHP. ``$string_id`` identifie l'ID de la traduction.
    Les chaînes utilisées pour la traduction sont traitées 
    comme chaîne formatées pour ``sprintf()``. Vous pouvez fournir
    des arguments supplémentaires pour remplacer les espaces
    réservés dans votre chaîne::

        __('You have %s unread messages', $number);

    .. note::

        Regardez la section
        :doc:`/core-libraries/internationalization-and-localization`
        pour plus d'information.

.. php:function:: __c(string $msg, integer $category, mixed $args = null)

    Notez que la catégorie doit être spécifiée avec une valeur numérique,
    au lieu d'un nom de constante. Les valeurs sont:

    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __d(string $domain, string $msg, mixed $args = null)

    Vous permet de remplacer le domaine courant lors de la recherche d'un 
    message.

    Utile pour internationaliser un plugin:
     ``echo __d('PluginName', 'This is my plugin');``

.. php:function:: __dc(string $domain, string $msg, integer $category, mixed $args = null)

    Vous permet de remplacer le domaine courant pour la recherche d'un message. 
    Permet également de spécifier une catégorie. 
    
    Notez que la catégorie doit être spécifiée avec une valeur numérique,
    au lieu du nom de la constante. Les valeurs sont:
   
    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __dcn(string $domain, string $singular, string $plural, integer $count, integer $category, mixed $args = null)

    Vous permet de remplacer le domaine courant pour la recherche simple au 
    pluriel d'un message. Cela permet également de spécifier une catégorie.
    Retourne la forme correcte d'un message identifié par $singular et $plural
    pour le compteur $count depuis le domaine $domain. Certaines langues ont 
    plus d'une forme de pluriel dépendant du compteur

    Notez que la catégorie doit être spécifiée avec des valeurs numériques,
    au lieu des noms de constantes. Les valeurs sont:
   
    - 0 - LC_ALL
    - 1 - LC_COLLATE
    - 2 - LC_CTYPE
    - 3 - LC_MONETARY
    - 4 - LC_NUMERIC
    - 5 - LC_TIME
    - 6 - LC_MESSAGES

.. php:function:: __dn(string $domain, string $singular, string $plural, integer $count, mixed $args = null)

    Vous permet de redéfinir le domaine courant pour une recherche simple
    au pluriel d'un message. Retourne la forme pluriel correcte d'un
    message identifié par $singular et $plural pour le compteur $count
    depuis le domaine $domain.
  
.. php:function:: __n(string $singular, string $plural, integer $count, mixed $args = null)

    Retourne la forme correcte d'un message identifié par $singular et $plural
    pour le compteur $count. Certaines langues ont plus d'une forme de pluriel 
    dépendant du compteur
 
.. php:function:: am(array $one, $two, $three...)

    Fusionne tous les tableaux passés en paramètre et retourne le tableau
    fusionné.
   
.. php:function:: config()

    Peut être utilisé pour charger des fichiers depuis le dossier config 
    de votre application via include\_once. La fonction vérifie l'existence 
    du fichier avant de l'inclure et retourne un booléen. 
    Prends un nombre optionnel d'arguments.
   
    Exemple: ``config('un_fichier', 'maconfig');``

.. php:function:: convertSlash(string $string)

    Convertit les slashes en underscores et supprime le premier et 
    le dernier underscores dans une chaîne. Retourne la chaîne convertie.

    
.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    Si le niveau de DEBUG de l'application est différent de zéro, $var est 
    affiché. Si ``$showHTML`` est true (vrai) ou laissé null, la donnée est
    formatée pour être visualisée facilement dans un navigateur.

    Si ``$showFrom`` n'est pas défini à false, debug retournera en sortie
    la ligne depuis laquelle il a été appelé
    Voir aussi  :doc:`/development/debugging`


.. php:function:: env(string $key)

    Récupère une variable d'environnement depuis les sources disponibles. 
    Utilisé en secours si $_SERVER ou $_ENV sont désactivés.

    Cette fonction émule également PHP_SELF et DOCUMENT_ROOT sur 
    les serveurs ne les supportant pas. En fait, c'est une bonne idée 
    de toujours utiliser env() plutôt que $_SERVER ou getenv() 
    (notamment si vous prévoyez de distribuer le code), puisque 
    c'est un wrapper d'émulation totale.

.. php:function:: fileExistsInPath(string $file)

    Vérifie que le fichier donné est dans le include\_path PHP actuel. 
    Renvoie une valeur booléenne.
    
.. php:function:: h(string $text, boolean $double = true, string $charset = null)

    Raccourci pratique pour ``htmlspecialchars()``.

.. php:function:: LogError(string $message)

    Raccourci pour: :php:meth:`Log::write()`.
 
.. php:function:: pluginSplit(string $name, boolean $dotAppend = false, string $plugin = null)

    Divise le nom d'un plugin en notation par point en plugin et 
    classname (nom de classe). Si $name de contient pas de point,
    alors l'index 0 sera null.

    Communément utiliser comme ceci ``list($plugin, $name) = pluginSplit('Users.User');``
    
.. php:function:: pr(mixed $var)

    Raccourci pratique pour print_r(), avec un ajout de balises <pre> 
    autour du résultat (sortie).
   
.. php:function:: sortByKey(array &$array, string $sortby, string $order = 'asc', integer $type = SORT_NUMERIC)

    Tris de $array par la clef $sortby. 
   
.. php:function:: stripslashes_deep(array $value)

    Enlève récursivement les slashes de la $valeur passée. 
    Renvoie le tableau modifié.

Définitions des constantes du noyau
===================================

La plupart des constantes suivantes font référence aux chemins
dans votre application.

.. php:const:: APP

   Chemin du répertoire de l'application.

.. php:const:: APP_DIR

    La même chose que ``app`` ou le nom du répertoire de votre application.

.. php:const:: APPLIBS

    Le chemin du répertoire Lib de votre application.

.. php:const:: CACHE

    Chemin vers le répertoire de cache. il peut être partagé entre les
    hôtes dans une configuration multi-serveurs.
    
.. php:const:: CAKE

    Chemin vers le répertoire de CAKE.

.. php:const:: CAKE_CORE_INCLUDE_PATH

    Chemin vers la racine du répertoire lib. 

.. php:const:: CORE_PATH

   Chemin vers le répertoire racine avec un slash à la fin.

.. php:const:: CSS

    Chemin vers le répertoire CSS publique.

.. php:const:: CSS_URL

    Chemin web vers le répertoire CSS.
   
.. php:const:: DS

    Raccourci pour la constante PHP DIRECTORY\_SEPARATOR, qui est égale à / 
    pour Linux et \\ pour Windows.

.. php:const:: FULL_BASE_URL

    Préfix url complet. Comme ``https://example.com``
   
.. php:const:: IMAGES

    Chemin vers le répertoire images publique.

.. php:const:: IMAGES_URL

    Chemin web vers le répertoire image publique.

.. php:const:: JS

    Chemin vers le répertoire Javascript publique.

.. php:const:: JS_URL

    Chemin web vers le répertoire Javascript publique.

.. php:const:: LOGS

    Chemin du répertoire des logs.

.. php:const:: ROOT

    Chemin vers le répertoire racine.

.. php:const:: TESTS

    Chemin vers le répertoire de test.

.. php:const:: TMP

    Chemin vers le répertoire des fichiers temporaires.

.. php:const:: VENDORS

    Chemin vers le répertoire vendors.

.. php:const:: WEBROOT_DIR

    La même chose que ``webroot`` ou le nom du répertoire webroot.
    
.. php:const:: WWW\_ROOT

    Chemin d'accès complet vers la racine web (webroot).


Timing Definition Constants
===========================

.. php:const:: TIME_START

    timestamp Unix en microseconde au format float du démarrage de 
    l'application.
  
.. php:const:: SECOND

    Égale 1

.. php:const:: MINUTE

    Égale 60

.. php:const:: HOUR

    Égale 3600

.. php:const:: DAY

    Égale 86400

.. php:const:: WEEK

    Égale 604800

.. php:const:: MONTH

    Égale 2592000

.. php:const:: YEAR

    Égale 31536000


.. meta::
    :title lang=fr: Constantes Globales et Fonctions
    :keywords lang=fr: internationalization et localization,constantes globales,exemple config,tableau php,convenience functions,core libraries,classes component,optional number,fonctions globales,string string,core classes,format strings,messages non lus,placeholders,fonctions utiles,sprintf,tableaux,paramètres,existence,traductions
