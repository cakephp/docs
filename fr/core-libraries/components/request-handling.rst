Request Handling (Gestion des requêtes)
#######################################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $settings = array())

Le component Request Handler est utilisé dans CakePHP pour obtenir des
informations supplémentaires au sujet des requêtes HTTP qui sont faites à votre
application. Vous pouvez l'utiliser pour informer vos controllers des processus
AJAX, autant que pour obtenir des informations complémentaires sur les types de
contenu que le client accepte et modifie automatiquement dans le layout
approprié, quand les extensions de fichier sont disponibles.

Par défaut, le RequestHandler détectera automatiquement les requêtes AJAX
basées sur le header HTTP-X-Requested-With, qui est utilisé par de nombreuses
librairies JavaScript. Quand il est utilisé conjointement avec
:php:meth:`Router::parseExtensions()`, RequestHandler changera automatiquement
le layout et les fichiers de vue par ceux qui correspondent au type demandé.
En outre, s'il existe un helper avec le même nom que l'extension demandée,
il sera ajouté au tableau des helpers des Controllers. Enfin, si une donnée
XML/JSON est POST'ée vers vos Controllers, elle sera décomposée dans un
tableau qui est assigné à ``$this->request->data``, et pourra alors être
sauvegardée comme une donnée de model. Afin d'utiliser le Request Handler, il
doit être inclu dans votre tableau $components::

    class WidgetController extends AppController {

        public $components = array('RequestHandler');

        // suite du controller
    }

Obtenir des informations sur une requête
========================================

Request Handler contient plusieurs méthodes qui fournissent des
informations à propos du client et de ses requêtes.

.. php:method:: accepts($type = null)

$type peut être une chaîne, un tableau, ou 'null'. Si c'est une chaîne,
la méthode accepts() renverra true si le client accepte ce type de contenu.
Si c'est un tableau, accepts() renverra true si un des types du contenu est
accepté par le client. Si c'est 'null', elle renverra un tableau des types de
contenu que le client accepte. Par exemple::

    class PostsController extends AppController {

        public $components = array('RequestHandler');

        public function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // Ce code est exécuté uniquement si le client accepte
                // les réponses HTML (text/html) 
            } elseif ($this->RequestHandler->accepts('xml')) {
                // executé seulement si le client accepte seulement
                // les réponses XML
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                // Executé si le client accepte l'un des suivants: XML, RSS ou Atom
            }
        }
    }

D'autres méthodes de détections du contenu des requêtes:

.. php:method:: isXml()

    Renvoie true si la requête actuelle accepte les réponses XML.

.. php:method:: isRss()

    Renvoie true si la requête actuelle accepte les réponses RSS.

.. php:method:: isAtom()

    Renvoie true si l'appel actuel accepte les réponses Atom, false dans le cas
    contraire.

.. php:method:: isMobile()

    Renvoie true si le navigateur du client correspond à un téléphone
    portable, ou si le client accepte le contenu WAP. Les navigateurs
    mobiles supportés sont les suivants:

    -  Android
    -  AvantGo
    -  BlackBerry
    -  DoCoMo
    -  Fennec
    -  iPad
    -  iPhone
    -  iPod
    -  J2ME
    -  MIDP
    -  NetFront
    -  Nokia
    -  Opera Mini
    -  Opera Mobi
    -  PalmOS
    -  PalmSource
    -  portalmmm
    -  Plucker
    -  ReqwirelessWeb
    -  SonyEricsson
    -  Symbian
    -  UP.Browser
    -  webOS
    -  Windows CE
    -  Windows Phone OS
    -  Xiino

.. php:method:: isWap()

Retourne true si le client accepte le contenu WAP.

Toutes les méthodes de détection des requêtes précédentes peuvent être
utilisées dans un contexte similaire pour filtrer les fonctionnalités destinées
à du contenu spécifique. Par exemple, au moment de répondre aux requêtes AJAX,
si vous voulez désactiver le cache du navigateur, et changer le niveau de
débogage. Cependant, si vous voulez utiliser le cache pour les requêtes
non-AJAX., le code suivant vous permettra de le faire::

    if ($this->request->is('ajax')) {
        $this->disableCache();
    }
    // Continue l'action du controller


Obtenir des informations supplémentaires sur le client
======================================================

.. php:method:: getAjaxVersion()

    Récupère la version de la librairie 'Prototype' si la requête est de
    type AJAX ou une chaîne de caractères vide dans le cas contraire.
    La librairie 'Prototype' envoie une entête HTTP spéciale
    "Prototype version".

Décoder automatiquement les données de la requête
=================================================

.. php:method:: addInputType($type, $handler)

    :param string $type: L'alias du type de contenu auquel
      ce décodeur est attaché. ex. 'json' ou 'xml'
    :param array $handler: L'information de gestionnaire pour le type.

    Ajoute une requête de décodage de données. Le gestionnaire devrait
    contenir un callback, et tour autre argument supplémentaire pour le
    callback. Le callback devrait retourner un tableau de données contenues
    dans la requête. Par exemple, ajouter un gestionnaire de CSV dans le
    callback 'beforeFilter' de votre controller pourrait ressembler à ceci ::

        $parser = function ($data) {
            $rows = str_getcsv($data, "\n");
            foreach ($rows as &$row) {
                $row = str_getcsv($row, ',');
            }
            return $rows;
        };
        $this->RequestHandler->addInputType('csv', array($parser));

    L'exemple ci-dessus nécessite PHP 5.3, cependant vous pouvez utiliser
    n'importe quel `callback <http://php.net/callback>`_ pour la fonction
    de gestion. Vous pouvez aussi passer des arguments supplémentaires
    au callback, c'est très utile pour les callbacks comme ``json_decode``::

        $this->RequestHandler->addInputType('json', array('json_decode', true));

    Le contenu ci-dessus créera ``$this->request->data`` un tableau des données
    d'entrées JSON, sans le ``true`` supplémentaire vous obtiendrez un jeu
    d'objets ``stdClass``.

Répondre Aux Requêtes
=====================

En plus de la détection de requêtes, RequestHandler fournit également une
solution simple pour modifier la sortie de façon à ce que le type de contenu
corresponde à votre application.

.. php:method:: setContent($name, $type = null)

    :param string $name: Le nom ou l'extension du fichier (Content-type), par
        ex : html, css, json, xml.
    :param mixed $type: - Le(s) type(s) mime(s) auquel se réfère Content-type.

    setContent ajoute/définit les Content-types pour le nom précisé.
    Permet aux content-types d'être associés à des alias simplifiés
    et/ou à des extensions. Ceci permet à RequestHandler de répondre
    automatiquement aux requêtes de chaque type dans sa méthode startup.
    Si vous utilisez Router::parseExtension, vous devriez utiliser
    l'extension de fichier comme le nom du Content-type.
    De plus, ces types de contenu sont utilisés par prefers() et accepts().

    setContent est bien mieux utilisé dans le beforeFilter() de vos
    controllers, parce qu'il tirera un meilleur profit de l'automagie
    des alias de content-type.

    Les correspondances par défaut sont :

    -  **javascript** text/javascript
    -  **js** text/javascript
    -  **json** application/json
    -  **css** text/css
    -  **html** text/html, \*/\*
    -  **text** text/plain
    -  **txt** text/plain
    -  **csv** application/vnd.ms-excel, text/plain
    -  **form** application/x-www-form-urlencoded
    -  **file** multipart/form-data
    -  **xhtml** application/xhtml+xml, application/xhtml, text/xhtml
    -  **xhtml-mobile** application/vnd.wap.xhtml+xml
    -  **xml** application/xml, text/xml
    -  **rss** application/rss+xml
    -  **atom** application/atom+xml
    -  **amf** application/x-amf
    -  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript,
       image/vnd.wap.wbmp
    -  **wml** text/vnd.wap.wml
    -  **wmlscript** text/vnd.wap.wmlscript
    -  **wbmp** image/vnd.wap.wbmp
    -  **pdf** application/pdf
    -  **zip** application/x-zip
    -  **tar** application/x-tar

.. php:method:: prefers($type = null)

    Détermine quels content-types le client préfère. Si aucun paramètre n'est
    donné, le type de contenu le plus approchant est retourné. Si $type est un
    tableau, le premier type que le client accepte sera retourné. La préférence
    est déterminée, premièrement par l'extension de fichier analysée par
    Router, si il y en avait une de fournie et secondairement, par la liste des
    content-types définis dans HTTP_ACCEPT.

.. php:method:: renderAs($controller, $type)

    :param Controller $controller: Référence du controller
    :param string $type: nom simplifié du type de contenu à rendre, par
      exemple : xml, rss.

    Change le mode de rendu d'un controller pour le type spécifié.
    Ajoutera aussi le helper approprié au tableau des helpers du controller,
    s'il est disponible et qu'il n'est pas déjà dans le tableau.
    
.. php:method:: respondAs($type, $options)

    :param string $type: nom simplifié du type de contenu à rendre, par
      exemple : xml, rss ou un content-type complet, tel que
      application/x-shockwave
    :param array $options: Si $type est un nom simplifié de type, qui
      a plus d'une association avec des contenus, $index est utilisé pour
      sélectionner le type de contenu.

    Définit l'en-tête de réponse basé sur la correspondance content-type/noms.

.. php:method:: responseType()

    Retourne l'en-tête Content-type du type de réponse actuel ou null s'il
    y en a déjà un de défini.

Profiter du cache de validation HTTP
====================================

.. versionadded:: 2.1

Le model de validation de cache HTTP est l'un des processus utilisé pour les
passerelles de cache, aussi connu comme reverse proxies, pour déterminer si
elles peuvent servir une copie de réponse stockée au client. D'après ce model,
vous bénéficiez surtout d'une meilleur bande passante, mais utilisé
correctement vous pouvez aussi gagner en temps de processeur, et ainsi gagner
en temps de réponse.

En activant le Component RequestHandler ``RequestHandlerComponent`` dans
votre controller vous validerez le contrôle automatique effectué avant
de rendre une vue. Ce contrôle compare l'objet réponse à la requête originale
pour déterminer si la réponse n'a pas été modifiée depuis la dernière fois
que le client a fait sa demande.

Si la réponse est évaluée comme non modifiée, alors le processus de rendu de
vues est arrêté, réduisant le temps processeur. Un ``no content`` est retourné
au client, augmentant la bande passante. Le code de réponse est défini
à `304 Not Modified`.

Vous pouvez mettre en retrait ce contrôle automatique en paramétrant
``checkHttpCache`` à false::

    public $components = array(
        'RequestHandler' => array(
            'checkHttpCache' => false
    ));
    
Utiliser les ViewClasses personnalisées
=======================================

.. versionadded:: 2.3

Quand vous utilisez JsonView/XmlView, vous aurez envie peut-être de surcharger
la serialization par défaut avec une classe View par défaut, ou ajouter des
classes View pour d'autres types.

Vous pouvez mapper les types existants et les nouveaux types à vos classes
personnalisées.

.. php:method:: viewClassMap($type, $viewClass)

    :param string|array $type: Le type string ou un tableau map avec le 
      format ``array('json' => 'MyJson')``.
    :param string $viewClass: La viewClass à utiliser pour le type sans `View`
      en suffixe.

Vous pouvez aussi définir ceci automatiquement en utilisant la configuration
``viewClassMap``::

    public $components = array(
        'RequestHandler' => array(
            'viewClassMap' => array(
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            )
    ));

.. meta::
    :title lang=fr: Request Handling (Gestion des requêtes)
    :keywords lang=fr: handler component,javascript libraries,public components,null returns,model data,request data,content types,file extensions,ajax,meth,content type,array,conjunction,cakephp,insight,php
