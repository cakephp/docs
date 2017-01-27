Breadcrumbs (パンくず)
######################

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

.. versionadded:: 3.3.6

BreadcrumbsHelper は簡単にアプリのパンくずリストの作成と描画に対処する方法を提供します。

パンくずリストを作成
====================

``add()`` メソッドを使用して、リストにパンくずを追加することができます。
これは 3 つの引数を持ちます。

- **title** パンくずのタイトルとして表示する文字列。
- **url** :doc:`/views/helpers/url` に与えられるパラメータの配列や文字列。
- **options** ``item`` と ``itemWithoutLink`` テンプレートの属性の配列。
  詳細は :ref:`アイテムの属性を定義 <defining_attributes_item>` のセクションをご覧ください。

リストの最後に追加するのに加えて、さまざまな操作を行うことができます。 ::

    // リストの最後に追加
    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // 複数のパンくずを最後に追加
    $this->Breadcrumbs->add([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // パンくずをリストの一番先頭に追加
    $this->Breadcrumbs->prepend(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // 複数のパンくずをリストの先頭に順番に追加
    $this->Breadcrumbs->prepend([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]]
    ]);

    // 指定したスロットに挿入
    // スロットが範囲外の場合は、例外が発生
    $this->Breadcrumbs->insertAt(
        2,
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // タイトルを元に別のパンくずの前に挿入
    // もし、パンくずのタイトルが見つからない場合、
    // 例外が発生します。
    $this->Breadcrumbs->insertBefore(
        'A product name', // 手前に挿入するパンくずのタイトル
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // タイトルを元に別のパンくずの後に挿入
    // もし、パンくずのタイトルが見つからない場合、
    // 例外が発生します。
    $this->Breadcrumbs->insertAfter(
        'A product name', // 後ろに挿入するパンくずのタイトル
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

これらのメソッドを使用すると、CakePHP の2段階の描画プロセスで動作することが可能になります。
テンプレートやレイアウトは内側から描画される (つまり、インクルードされたエレメントが最初に描画される)
ので、パンくずを追加したい場所を正確に定義することができます。

パンくずリストを描画
====================

リストにパンくずを追加した後、 ``render()`` メソッドを使用して、簡単に描画することができます。
このメソッドは、2つの配列引数を受け付けます。

- ``$attributes``: ``wrapper`` テンプレートに適用される属性の配列。
  これは、HTML タグに属性を追加することができます。
  テンプレート内に独自のテンプレート変数の挿入を可能にする特別な ``templateVars`` キーを受け入れます。
- ``$separator``: ``separator`` テンプレートの属性の配列。
  可能なプロパティは次の通りです。

  - **separator** セパレーターとして表示する文字列。
  - **innerAttrs** セパレーターが２つの要素に分割された場合に属性を提供します。
  - **templateVars** テンプレートに独自のテンプレート変数の挿入を可能にします。

  他のすべてのプロパティは、HTML 属性として変換されます。
  そして、テンプレート内の **attrs** キーを置換します。
  もし、デフォルト設定 (このオプションが空) を使用する場合、セパレータを描画しません。

以下は、パンくずリストを描画する例です。 ::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

出力のカスタマイズ
------------------

BreadcrumbsHelper は内部で ``StringTemplateTrait`` を使用しています。
これは、簡単に様々な HTML 文字列の出力をカスタマイズすることができます。
次のデフォルトの定義では、4つのテンプレートが含まれます。 ::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{custom}}{{separator}}</span></li>'
    ]

``StringTemplateTrait`` の ``template()`` メソッドを使用すると簡単にカスタマイズすることができます。 ::

    $this->Breadcrumbs->templates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

テンプレートを描画するとき、 ``templateVars`` オプションを使用すると、
様々なテンプレートで、独自のテンプレート変数を追加することができます。 ::

    $this->Breadcrumbs->templates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

また、 ``{{icon}}`` パラメータを定義するには、リストにパンくずを追加する際にそれを指定するだけです。 ::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'templateVars' => [
                'icon' => '<i class="fa fa-money"></i>'
            ]
        ]
    );

.. _defining_attributes_item:

アイテムの属性を定義
--------------------

アイテムとそのサブアイテムの両方に特定の HTML 属性を適用したい場合は、
``$options`` 引数が提供する ``innerAttrs`` キーを活用することができます。
``innerAttrs`` と ``templateVars`` 以外の全ては、HTML 属性として描画されます。 ::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'class' => 'products-crumb',
            'data-foo' => 'bar',
            'innerAttrs' => [
                'class' => 'inner-products-crumb',
                'id' => 'the-products-crumb'
            ]
        ]
    );

    // デフォルトのテンプレートに基づいて、次の HTML を描画:
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Products</a>
    </li>

.. meta::
    :title lang=ja: BreadcrumbsHelper
    :description lang=ja: CakePHP の BreadcrumbsHelper の役割は、簡単にパンくずリストを管理する方法を提供することです。
    :keywords lang=ja: breadcrumbs helper,cakephp crumbs
