Request Handling (Gestion des requêtes)
#######################################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $config = [])

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
le layout et les fichiers de template par ceux qui correspondent au type demandé.
En outre, s'il existe un helper avec le même nom que l'extension demandée,
il sera ajouté au tableau des helpers des Controllers. Enfin, si une donnée
XML/JSON est POST'ée vers vos Controllers, elle sera décomposée dans un
tableau qui est assigné à ``$this->request->data``, et pourra alors être
sauvegardée comme une donnée de model. Afin d'utiliser le Request Handler, il
doit être inclus dans votre tableau méthode ``initialize()``::

    class WidgetController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        // suite du controller
    }

Obtenir des informations sur une requête
========================================

Request Handler contient plusieurs méthodes qui fournissent des
informations à propos du client et de ses requêtes.

.. php:method:: accepts($type = null)

$type peut être une chaîne, un tableau, ou 'null'. Si c'est une chaîne,
la méthode accepts() renverra ``true`` si le client accepte ce type de contenu.
Si c'est un tableau, accepts() renverra ``true`` si un des types du contenu est
accepté par le client. Si c'est 'null', elle renverra un tableau des types de
contenu que le client accepte. Par exemple::

        class ArticlesController extends AppController
        {

            public function initialize()
            {
                parent::initialize();
                $this->loadComponent('RequestHandler');
            }

            public function beforeFilter(Event $event)
            {
                if ($this->RequestHandler->accepts('html')) {
                    // Execute le code seulement si le client accepte une
                    // response HTML  (text/html).
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // Execute uniquement le code XML
                }
                if ($this->RequestHandler->accepts(['xml', 'rss', 'atom'])) {
                    // Execute si le client accepte l'une des réponses
                    // ci-dessus: XML, RSS ou Atom.
                }
            }
        }

D'autres méthodes de détections du contenu des requêtes:

.. php:method:: isXml()

    Renvoie ``true`` si la requête actuelle accepte les réponses XML.

.. php:method:: isRss()

    Renvoie ``true`` si la requête actuelle accepte les réponses RSS.

.. php:method:: isAtom()

    Renvoie ``true`` si l'appel actuel accepte les réponse Atom, ``false`` dans
    le cas contraire.

.. php:method:: isMobile()

    Renvoie ``true`` si le navigateur du client correspond à un téléphone
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

Retourne ``true`` si le client accepte le contenu WAP.

Toutes les méthodes de détection des requêtes précédentes peuvent être
utilisées dans un contexte similaire pour filtrer les fonctionnalités destinées
à du contenu spécifique. Par exemple, au moment de répondre aux requêtes AJAX,
si vous voulez désactiver le cache du navigateur, et changer le niveau de
débogage. Cependant, si vous voulez utiliser le cache pour les requêtes
non-AJAX., le code suivant vous permettra de le faire::

        if ($this->request->is('ajax')) {
            $this->response->disableCache();
        }
        // Continue l'action du controller

Décoder Automatiquement les Données de la Requête
=================================================

Ajoute une requête de décodage de données. Le gestionnaire devrait contenir un
callback, et tour autre argument supplémentaire pour le callback. Le callback
devrait retourner un tableau de données contenues dans la requête. Par exemple,
ajouter un gestionnaire de CSV pourrait ressembler à ceci::

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $parser = function ($data) {
                $rows = str_getcsv($data, "\n");
                foreach ($rows as &$row) {
                    $row = str_getcsv($row, ',');
                }
                return $rows;
            };
            $this->loadComponent('RequestHandler', [
                'inputTypeMap' => [
                    'csv' => [$parser]
                ]
            ]);
        }
    }

Vous pouvez utiliser n'importe quel `callback <http://php.net/callback>`_ pour
la fonction de gestion. Vous pouvez aussi passer des arguments supplémentaires
au callback, c'est très utile pour les callbacks comme ``json_decode``::

    $this->RequestHandler->addInputType('json', ['json_decode', true]);

    // Depuis 3.1.0, vous devez utiliser
    $this->RequestHandler->config('inputTypeMap.json', ['json_decode', true]);

Le contenu ci-dessus créera ``$this->request->data`` un tableau des données
d'entrées JSON, sans le ``true`` supplémentaire vous obtiendrez un jeu
d'objets ``StdClass``.

.. deprecated:: 3.1.0
    Depuis 3.1.0 la méthode ``addInputType()`` est dépréciée. Vous devez
    utiliser ``config()`` pour ajouter des types d'input à la volée.

Vérifier les Préférences de Content-Type
========================================

.. php:method:: prefers($type = null)

Détermine les content-types que le client préfère. Si aucun paramètre n'est
donné, le type de contenu le plus approchant est retourné. Si $type est un
tableau, le premier type que le client accepte sera retourné. La préférence
est déterminée, premièrement par l'extension de fichier analysée par
Router, s'il y en avait une de fournie et secondairement, par la liste des
content-types définis dans ``HTTP\_ACCEPT``::

    $this->RequestHandler->prefers('json');

Répondre aux Requêtes
=====================

.. php:method:: renderAs($controller, $type)

Change le mode de rendu d'un controller pour le type spécifié.
Ajoutera aussi le helper approprié au tableau des helpers du controller,
s'il est disponible et qu'il n'est pas déjà dans le tableau::

    // Force le controller à rendre une response xml.
    $this->RequestHandler->renderAs($this, 'xml');

Cette méthode va aussi tenter d'ajouter un helper qui correspond au type de
contenu courant. Par exemple si vous rendez un ``rss``, ``RssHelper`` sera
ajouté.

.. php:method:: respondAs($type, $options)

Définit l'en-tête de réponse basé sur la correspondance content-type/noms. Cette
méthode vous laisse définir un certain nombre de propriétés de response en
une seule fois::

    $this->RequestHandler->respondAs('xml', [
        // Force le téléchargement
        'attachment' => true,
        'charset' => 'UTF-8'
    ]);

.. php:method:: responseType()

Retourne l'en-tête Content-type du type de réponse actuel ou null s'il
y en a déjà un de défini.

Profiter du cache de validation HTTP
====================================

Le model de validation de cache HTTP est l'un des processus utilisé pour les
passerelles de cache, aussi connu comme reverse proxies, pour déterminer si
elles peuvent servir une copie de réponse stockée au client. D'après ce model,
vous bénéficiez surtout d'une meilleur bande passante, mais utilisé
correctement vous pouvez aussi gagner en temps de processeur, et ainsi gagner
en temps de réponse.

En activant le Component RequestHandler dans votre controller vous validerez le
contrôle automatique effectué avant de rendre une vue. Ce contrôle compare
l'objet réponse à la requête originale pour déterminer si la réponse n'a pas
été modifiée depuis la dernière fois que le client a fait sa demande.

Si la réponse est évaluée comme non modifiée, alors le processus de rendu de
vues est arrêter, réduisant le temps processeur. Un ``no content`` est retourné
au client, augmentant la bande passante. Le code de réponse est défini
à `304 Not Modified`.

Vous pouvez mettre en retrait ce contrôle automatique en paramétrant
``checkHttpCache`` à ``false``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'checkHttpCache' => false
        ]);
    }

Utiliser les ViewClasses personnalisées
=======================================

Quand vous utilisez JsonView/XmlView, vous aurez envie peut-être de surcharger
la serialization par défaut avec une classe View par défaut, ou ajouter des
classes View pour d'autres types.

Vous pouvez mapper les types existants et les nouveaux types à vos classes
personnalisées. Vous pouvez aussi définir ceci automatiquement en utilisant
la configuration ``viewClassMap``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => [
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            ]
        ]);
    }

.. deprecated:: 3.1.0
    Depuis 3.1.0, la méthode ``viewClassMap()`` est dépréciée. Vous devez
    utiliser ``config()`` pour changer viewClassMap à la volée.

.. meta::
    :title lang=fr: Request Handling (Gestion des requêtes)
    :keywords lang=fr: handler component,javascript libraries,public components,null returns,model data,request data,content types,file extensions,ajax,meth,content type,array,conjunction,cakephp,insight,php
