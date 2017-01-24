JSON と XML ビュー
##################

``JsonView`` と ``XmlView`` を使用すると、
JSON と XML レスポンスを作成することが出来て、かつ
:php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` と統合することが出来ます。

あなたのアプリケーションで ``RequestHandlerComponent`` と、
``json`` と ``xml`` またはいずれかの拡張子のサポートを有効にすることで、
自動的に新しいビュークラスを使用することが出来るようになります。
このページでは ``JsonView`` と ``XmlView`` は、以降、データビューと呼びます。

データビューを生成するには2つの方法があります。
一つ目は ``_serialize`` キーを使用する方法、二つ目は通常のテンプレートファイルを使用する方法です。

あなたのアプリケーションでデータビューを有効化する方法
======================================================

データビュークラスを使用する前に、
まず :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
をコントローラでロードする必要があります::

    public function initialize()
    {
        ...
        $this->loadComponent('RequestHandler');
    }

あなたの `AppController` のなかで上記の通りにすることで、コンテントタイプによる自動切り替えが有効化されます。また、コンポーネットを ``viewClassMap`` に設定することで、あなたのカスタムクラスをマップしたり、他のデータ型をマップするも出来ます。

あなたは、別のやり方として :ref:`file-extensions` で json か xml 拡張子を有効化することが出来ます。
``http://example.com/articles.json`` の様に、URLの末尾でファイルの拡張子としてレスポンスタイプの名前指定することで、 ``JSON`` 、 ``XML`` もしくはそれ以外の特定のフォーマットビューにアクセスすることが出来ます。

デフォルトでは :ref:`file-extensions` が無効の場合、リクエストの ``Accept`` ヘッダーにより、ユーザにどのフォーマットをレンダリングするべきかが判断されます。
例として、レスポンスで ``JSON``  が表示されるには ``Accept`` に ``application/json`` が指定されている時です。

シリアライズキーをデータビューで使用する
=======================================

``_serialize`` キーは、データビューが使用される時に、どのビュー変数がシリアライズされるべきかを示す特別なビュー変数です。
json/xml に変換する前に独自のフォーマット処理が不要な場合、これはコントローラのアクションのためにテンプレートファイルを定義する手間を省いてくれます。

レスポンスを生成する間に独自のフォーマット処理や操作が必要な場合は、テンプレートファイルを使用する必要があります。
``_serialize`` の値は、文字列かシリアライズするためのビュー変数の配列のどちらかになります::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // シリアライズされるためのビュー変数をセット
            $this->set('articles', $this->paginate());
            // JsonView が、どのビュー変数をシリアライズするべきかを指定する
            $this->set('_serialize', ['articles']);
        }
    }

``_serialize`` を、ビュー変数の配列として定義し、それを結合させることもできます::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // $articles と $comments を生成する何某かのコード

            // シリアライズされるためのビュー変数をセット
            $this->set(compact('articles', 'comments'));

            // JsonView が、どのビュー変数をシリアライズするべきかを指定する
            $this->set('_serialize', ['articles', 'comments']);
        }
    }

Defining ``_serialize`` as an array has the added benefit of automatically
appending a top-level ``<response>`` element when using :php:class:`XmlView`.
If you use a string value for ``_serialize`` and XmlView, make sure that your
view variable has a single top-level element. Without a single top-level
element the Xml will fail to generate.

.. versionadded:: 3.1.0

    You can also set ``_serialize`` to ``true`` to serialize all view variables
    instead of explicitly specifying them.

Using a Data View with Template Files
=====================================

You should use template files if you need to do some manipulation of your view
content before creating the final output. For example if we had articles, that had
a field containing generated HTML, we would probably want to omit that from a
JSON response. This is a situation where a view file would be useful::

    // Controller code
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // View code - src/Template/Articles/json/index.ctp
    foreach ($articles as &$$article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

You can do more complex manipulations, or use helpers to do formatting as well.
The data view classes don't support layouts. They assume that the view file will
output the serialized content.

.. note::
    As of 3.1.0 AppController, in the application skeleton automatically adds
    ``'_serialize' => true`` to all XML/JSON requests. You will need to remove
    this code from the beforeRender callback if you want to use view files.


Creating XML Views
==================

.. php:class:: XmlView

By default when using ``_serialize`` the XmlView will wrap your serialized
view variables with a ``<response>`` node. You can set a custom name for
this node using the ``_rootNode`` view variable.

The XmlView class supports the ``_xmlOptions`` variable that allows you to
customize the options used to generate XML, e.g. ``tags`` vs ``attributes``.

Creating JSON Views
===================

.. php:class:: JsonView

The JsonView class supports the ``_jsonOptions`` variable that allows you to
customize the bit-mask used to generate JSON. See the
`json_encode <http://php.net/json_encode>`_ documentation for the valid
values of this option.

JSONP Responses
---------------

When using ``JsonView`` you can use the special view variable ``_jsonp`` to
enable returning a JSONP response. Setting it to ``true`` makes the view class
check if query string parameter named "callback" is set and if so wrap the json
response in the function name provided. If you want to use a custom query string
parameter name instead of "callback" set ``_jsonp`` to required name instead of
``true``.

Example Usage
=============

While the :doc:`RequestHandlerComponent
</controllers/components/request-handling>` can automatically set the view based
on the request content-type or extension, you could also handle view
mappings in your controller::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Network\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Format to view mapping
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Error on unknown type
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Set Out Format View
            $this->viewBuilder()->className($formats[$format]);

            // Set Force Download
            $this->response->download('report-' . date('YmdHis') . '.' . $format);

            // Get data
            $videos = $this->Videos->find('latest');

            // Set Data View
            $this->set(compact('videos'));
            $this->set('_serialize', ['videos']);
        }
    }
