HttpSocket
##########

O CakePHP inclui uma classe HttpSocket que pode ser usada facilmente
para fazer requisições HTTP, como aquelas para web services.

get
===

O método get faz uma requisição HTTP GET simples, retornando os
resultados.

``string function get ($uri, $query, $request)``

``$uri`` é o endereço web para onde a requisição será feita; ``$query``
é qualquer string de parâmetros, seja num formato de string:
"param1=foo&param2=bar" ou como um array indexado: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('www.google.com/search', 'q=cakephp');  
    // retorna o código html para os resultados de uma busca por "cakephp" no Google

post
====

O método post faz uma simples requisição HTTP POST retornando os
resultados.

``string function post ($uri, $data, $request)``

Os parâmetros para o método ``post`` são praticamente os mesmos daqueles
para o método get, ``$uri`` é o endereço web para onde a requisição está
sendo feita; ``$query`` são os dados a serem postados, seja no formato
de string: "param1=foo&param2=bar" ou como array indexado:
array('param1' => 'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.exemplo.com/add', array('name' => 'test', 'type' => 'user'));  
    // $results contém o resultado da requisição post.

request
=======

O método request básico, que é chamado pelos demais métodos
encapsuladores (get, post, put, delete). Retorna os resultados da
requisição.

``string function request($request)``

$request é um array de várias opções. Aqui está o formato e a
configuração padrão:

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

