HttpSocket
##########

CakePHP enthält mit ``HttpSocket`` eine Klasse um auf einfache Weise
HTTP-Anfragen, zum Beispiel an Webservices, zu senden.

get
===

Die get-Methode führt einen einfachen HTTP GET-Request aus und gibt das
Resultat zurück

``string function get ($uri, $query, $request)``

``$uri`` ist die Adresse, an welche die Anfrage geschickt wird;
``$query`` enthält Querystring-Parameter, entweder als String:
"param1=foo&param2=bar" oder als assoziativer Array: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('www.google.com/search', 'q=cakephp');  
    // gibt den HTML-Code der Google-Suche nach "cakephp" zurück

post
====

Die ``post``-Methode sendet einen einfachen HTTP POST-Request und gibt
das Resultat zurück

``string function post ($uri, $data, $request)``

Die Parameter der ``post``-Methode entsprechen mehr oder weniger denen
der ``get``-Methode, ``$uri`` ist die Adresse, an welche die Anfrage
gesendet wird; ``$query`` enthält die Daten, die übertragen werden
sollen, entweder als String: "param1=foo&param2=bar" oder als
assoziativer Array: array('param1' => 'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));  
    //$results enthält die Rückgabe der POST-Anfrage

request
=======

Die Basis-Methode für alle Anfrage-Methoden (get, post, put, delete).
Gibt das Resultat der Anfrage zurück

``string function request($request)``

$request ist ein assoziativer Array mit verschiedenen Optionen. Hier das
Format und die Standardeinstelungen:

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

