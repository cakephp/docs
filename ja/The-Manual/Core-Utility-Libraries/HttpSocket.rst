HttpSocket
##########

CakePHP には、ウェブサービスへ接続するようなリクエストを簡単に行える
HttpSocket クラスがあります。

get
===

get メソッドはシンプルな HTTP GET
のリクエストを作成し、リクエストの結果を返します。

``string function get ($uri, $query, $request)``

``$uri`` はリクエストを行うウェブアドレス、\ ``$query``
はクエリ文字列のパラメータです。クエリは、文字列で
"param1=foo&param2=bar" としても、キー付きの配列で配列で array('param1'
=> 'foo', 'param2' => 'bar')
というようにしても、どちらでもかまいません。

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('www.google.com/search', 'q=cakephp');  
    //Google で "cakephp" を検索した結果の HTML が返ります

post
====

post メソッドはシンプルな HTTP POST
のリクエストを作成し、リクエストの結果を返します。

``string function post ($uri, $data, $request)``

``post`` メソッドは get とほとんど同じです。 ``$uri``
はリクエストを行うウェブアドレス、 ``$query`` は post
するデータです。データは、文字列で "param1=foo&param2=bar"
としても、キー付きの配列で array('param1' => 'foo', 'param2' => 'bar')
というようにしても、どちらでもかまいません。

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user');  
    //$results には post の結果が格納されます

request
=======

全てのラッパ(get, post, put, delete)
から呼び出される、基本的なリクエストのメソッドです。リクエストの結果を返します。

``string function request($request)``

$request
キー付きの配列で、様々なオプションのために使用します。フォーマットとデフォルトのセッティングは、次の通りです。

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

