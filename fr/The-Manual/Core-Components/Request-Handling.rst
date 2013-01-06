Gestion de requêtes
###################

Le composant Request Handler est utilisé dans CakePHP pour obtenir des
informations additionnelles au sujet des requêtes HTTP qui sont faites à
votre application. Vous pouvez l'utiliser pour informer vos contrôleurs
des process Ajax, tout autant que pour obtenir des informations
complémentaires sur les types de contenus que le client accepte et
modifier automatiquement le layout approprié, quand les extensions de
fichier sont disponibles.

Par défaut, RequestHandler détectera automatiquement les requêtes Ajax
basée sur le header HTTP-X-Requested-With, qui est utilisé par de
nombreuses librairies javascript. Quand il est utilisé conjointement
avec Router::parseExtensions(), RequestHandler changera automatiquement
le layout et les fichiers de vue par ceux qui correspondent au type
demandé. En outre, s'il existe un assistant avec le même nom que
l'extension demandée, il sera ajouté au tableau d'assistant des
Contrôleurs. Enfin, si une donnée XML est POST'ée vers vos Contrôleurs,
elle sera décomposée en un objet XML, lequel sera assigné à
Controller::data et pourra alors être sauvegardé comme une donnée de
modèle. Afin d'utiliser le Request Handler il doit être inclus dans
votre tableau $components.

::

    <?php
    class WidgetController extends AppController {
        
        var $components = array('RequestHandler');
        
        // suite du contrôleur
    }
    ?>

Obtenir des informations sur une requête
========================================

Request Handler contient plusieurs méthodes qui nous donne des
informations à propos du client et de ses requêtes.

accepts ( $type = null)

$type peut être un string, un tableau , ou 'null'. Si c'est un string,
la méthode accepts() renverra true si le client accepte ce type de
contenu.Si c'est un tableau, accepts() renverra true si un des types du
contenu est accepté par le client. Si c'est 'null', elle renverra un
tableau des types de contenu que le client accepte. Par exemple:

::

    class PostsController extends AppController {
        
        var $components = array('RequestHandler');

        function beforeFilter () {
            if ($this->RequestHandler->accepts('html')) {
                // Execute le code seulement si le client accepte les réponse HTML (text/html)
            } elseif ($this->RequestHandler->accepts('xml')) {
                // Execute seulement le code XML
            }
            if ($this->RequestHandler->accepts(array('xml', 'rss', 'atom'))) {
                // Execute seulement si le client accepte un des suivants: XML, RSS ou Atom
            }
        }
    }

D'autres méthodes de détections du contenu des requêtes:

isAjax()

Renvoie true si la requête contient une réponse XMLHttpRequest.

isSSL()

Renvoie true si la requête a été faite à travers une connection SSL.

isXml()

Renvoie true si la requête actuelle accepte les réponses XML.

isRss()

Renvoie true si la requête actuelle accepte les réponses RSS.

isAtom()

Renvoie true si l'appel accepte les réponse Atom, false dans le cas
contraire.

isMobile()

Renvoie true si le navigateur du client correspond à un téléphone
portable, ou si sle client accepte le contenu WAP. Les navigateurs
mobiles supportés sont les suivants:

-  iPhone
-  MIDP
-  AvantGo
-  BlackBerry
-  J2ME
-  Opera Mini
-  DoCoMo
-  NetFront
-  Nokia
-  PalmOS
-  PalmSource
-  portalmmm
-  Plucker
-  ReqwirelessWeb
-  SonyEricsson
-  Symbian
-  UP.Browser
-  Windows CE
-  Xiino

isWap()

Returns true if the client accepts WAP content. Renvoie true si le
client accepte le contenu WAP.

Toutes les méthodes de détection des requêtes précédentes peuvent être
utilisée dans un contexte similaire pour filtrer les fonctionnalités
destiné à du contenu spécifique.Par exemple, au moment de répondre aux
requêtes AJAX, si vous voulez vider le cache du navigateur, et changer
le niveau de débogage. Cependant, si vous voulez ne pas vider le cache
pour les requêtes non-AJAX. , le code suivant vous permettra de le
faire:

::

        if ($this->RequestHandler->isAjax()) {
            Configure::write('debug', 0);
            $this->header('Pragma: no-cache');
            $this->header('Cache-control: no-cache');
            $this->header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        }
        //Continue Controller action

Vous pouvez aussi vider le cache grâce à cette fonction analogue
``Controller::disableCache()``.

::

        if ($this->RequestHandler->isAjax()) {
            $this->disableCache();
        }
        //Action du contrôleur

Détection du type de requête
============================

RequestHandler fournit aussi des informations quant au type des requêtes
HTTP qui ont été faites et vous autorise à répondre à chaque type de
requêtes.

isPost()

Renvoie true si la requête est de type POST.

isPut()

Renvoie true si la requête est de type PUT.

isGet()

Renvoie true si la requête est de type GET.

isDelete()

Renvoie true si la requête est de type DELETE.

Obtenir des informations supplémentaires sur le client
======================================================

getClientIP()

Renvoie l'adresse IP du client.

getReferrer()

Renvoie le nom de domaine à partir duquel la requête a été faite.

getAjaxVersion()

Renvoie la version de la librairie 'Prototype' si la requête est de type
AJAX ou une chaîne de caractères vide dans le cas contraire. La
librairie 'Prototype' contient un header HTTP spécifique qui permet de
déterminer sa version.

Répondre aux Requêtes
=====================

En plus de la détection de requêtes, RequestHandler fournit également
une solution simple pour modifier la sortie de façon à ce que le type de
contenu corresponde à votre application.

setContent($name, $type = null)

-  $name string - Le nom du type de contenu (*Content-type*), par ex :
   html, css, json, xml.
-  $type mixed - Le(s) type(s) mime(s) auquel se réfère Content-type.

setContent ajoute/définit les Content-types pour le nom précisé. Permet
aux content-types d'être associés à des alias simplifiés et/ou à des
extensions. Ceci permet à RequestHandler de répondre automatiquement aux
requêtes de chaque type dans sa méthode startup. De plus, ces types de
contenu sont utilisées par prefers() et accepts().

setContent est bien mieux utilisé dans le beforeFilter() de vos
contrôleurs, parce qu'il tirera un meilleur profit de *l'automagie* des
alias de content-type.

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
-  **wap** text/vnd.wap.wml, text/vnd.wap.wmlscript, image/vnd.wap.wbmp
-  **wml** text/vnd.wap.wml
-  **wmlscript** text/vnd.wap.wmlscript
-  **wbmp** image/vnd.wap.wbmp
-  **pdf** application/pdf
-  **zip** application/x-zip
-  **tar** application/x-tar

prefers($type = null)

Détermine quels content-types préfère le client. Si aucun paramètre
n'est donné, le type de contenu le plus approchant est retourné. Si
$type est un tableau, le premier type que le client accepte sera
retourné. La préférence est déterminée, premièrement par l'extension de
fichier analysée par Router, si il y en avait une de fournie et
secondairement, par la liste des content-types définis dans
HTTP\_ACCEPT.

renderAs($controller, $type)

-  $controller - Référence du contrôleur
-  $type - nom simplifié du type de contenu à rendre, par exemple : xml,
   rss.

Change le mode de rendu d'un contrôleur pour le type spécifié. Ajoutera
aussi l'assistant (*helper*) approprié au tableau des assistants du
contrôleur, s'il est disponible et qu'il n'est pas déjà dans le tableau.

respondAs($type, $options)

-  $type - nom simplifié du type de contenu à rendre, par exemple : xml,
   rss ou un content-type complet, tel application/x-shockwave
-  $options - Si $type est un nom simplifié de type, qui a plus d'une
   association avec des contenus, $index est utilisé pour sélectionner
   le type de contenu.

Définit l'en-tête de réponse basé sur la correspondance
content-type/noms. Si DEBUG est plus grand que 2, l'en-tête n'est pas
défini.

responseType()

Retourne l'en-tête Content-type du type de réponse courant ou null s'il
y en a déjà un de défini.

mapType($ctype)

Rétro-associe un content-type à un alias
