HttpSocket
##########

CakePHP inclus une classe HttpSocket qui peut être facilement utilisée
pour effectuer des requêtes, comme celles faites à des services web.

get
===

La méthode get effectue une simple requête HTTP GET qui retourne les
résultats.

``string get($uri, $query, $request)``

``$uri`` est l'adresse web où la requête est effectuée, ``$query`` est
n'importe quel paramètre de requête, soit sous la forme d'une chaîne :
"param1=foo&param2=bar", soit sous la forme d'un tableau avec des clefs
: array('param1' => 'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $resultats = $HttpSocket->get('https://www.google.com/search', 'q=cakephp');
    //Retourne la version HTML des résultats de recherche Google pour la requête "cakephp"

post
====

La méthode post effectue une simple requête HTTP POST et retourne les
résultats.

``string function post ($uri, $data, $request)``

Les paramètres pour la méthode ``post`` sont pratiquement les mêmes que
pour la méthode ``get``, ``$uri`` est l'adresse web où la requête est
faite, ``$data`` sont les données à POSTer, soit sous la forme d'une
chaine : "param1=foo&param2=bar", soit sous la forme d'un tableau avec
des clefs : array('param1' => 'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $resultats = $HttpSocket->post('www.unsite.com/ajouter', array('nom' => 'test', 'type' => 'utilisateur'));  
    //$resultats contient ce qui est retourné par le POST.

request
=======

La méthode de base request est appelée depuis tous les conteneurs (get,
post, put, delete). Il retourne le résultat de la requête.

``string function request($request)``

$request est un tableau associatif d'options diverses. Voici son format
et ses paramètres par défaut :

::

    var $request = array(
        'method' => 'GET',
        'uri' => array(
            'scheme' => 'http',
            'host' => null,
            'port' => 80,
            'user' => null,
            'pass' => null,
            'path' => null,
            'query' => null,
            'fragment' => null
        ),
        'auth' => array(
            'method' => 'Basic',
            'user' => null,
            'pass' => null
        ),
        'version' => '1.1',
        'body' => '',
        'line' => null,
        'header' => array(
            'Connection' => 'close',
            'User-Agent' => 'CakePHP'
        ),
        'raw' => null,
        'cookies' => array()
    );

