# JsHelper

`class` **JsHelper**(View $view, array $settings = array())

> [!WARNING]
> 現在、JsHelper は非推奨です。 3.x で完全に削除されます。
> 可能なら、通常の JavaScript の使用と、JavaScript ライブラリとの直接的な
> やりとりをお勧めします。

プロジェクト開始当初より、 CakePHP の JavaScript に関するサポートは、
Prototype/Scriptaculous によるものでした。 我々は未だこれらの JavaScript
ライブラリが素晴らしいものであると考えてはいますが、コミュニティからは他の
ライブラリのサポートを要望されてきました。Prototype を捨てて他の JavaScript
ライブラリに取り換えるという方法ではなく、アダプタベースのヘルパーを新たに作り、
そして最もリクエストの多い３種類のライブラリを採用しました。
Prototype/Scriptaculous、 Mootools/Mootools-more、そして jQuery/jQuery
UI です。 これらの API は以前の AjaxHelper ほどには多機能ではありませんが、
このアダプタベースのソリューションのほうが開発者に必要なパワーと柔軟性を与え、
各アプリケーションごとのニーズに適応した実装が可能になると感じています。

JavaScript エンジンは、新しい JsHelper のバックボーンです。
各 JavaScript エンジンは、抽象化 JavaScript 要素を、使用されている
JavaScript ライブラリの種類に応じて、実際の JavaScript に変換します。
加えて、他から利用可能な機能拡張システムを形成します。

## 指定した JavaScript エンジンの利用

はじめに、あなたが使用する JavaScript ライブラリを全てダウンロードして、
`app/webroot/js` 以下に置いてください。

その時、あなたのページにそのライブラリが含まれていなければなりません。
それを全てのページに含めるためには、 `app/View/Layouts/default.ctp`
の \<head\> セクションに以下の行を追加してください。 :

``` php
echo $this->Html->script('jquery'); // Include jQuery library
```

`jquery` を、あなたのライブラリファイルの名前で置き換えてください。
(.js が名前に追加されます。)

デフォルトでは、スクリプトはキャッシュされ、あなたは、明示的にキャッシュを
出力しなければなりません。各ページの最後でこれを行うためには、 `</body>`
タグで閉じる直前に以下の行を含めて下さい。 :

``` php
echo $this->Js->writeBuffer(); // Write cached scripts
```

> [!WARNING]
> あなたのページにライブラリを含めなければなりません。そして、ヘルパーを機能させる
> ためにキャッシュを出力しなければなりません。

JavaScript エンジンの選択は、あなたのコントローラのヘルパーを含める際に宣言します。 :

``` php
public $helpers = array('Js' => array('Jquery'));
```

上記は、あなたのビューの中の JsHelper のインスタンスで Jquery エンジンを使います。
もし、エンジンを指定しなかった場合、デフォルトで jQuery エンジンが使用されます。
上で述べているように、コアで３つのエンジンが実装されています。しかし、
ライブラリ互換性を拡張することをコミュニティに推奨しています。

### 他のライブラリと jQuery の利用

jQuery ライブラリ、そして事実上、それらのプラグインの全ては、
jQuery 名前空間に束縛されます。一般規則として、 "グローバル" オブジェクトは、
jQuery 名前空間の中に上手に格納されます。あなたは、jQuery と他のライブラリ
(Prototype, MooTools, YUI など) との間で衝突してはなりません。

それには、一つの注意点があります。
**デフォルトで、jQuery は "\$" を "jQuery" のショートカットとして利用する事** です。

"\$" ショートカットを上書きするために、 jQueryObject 変数を使用します。 :

``` php
$this->Js->JqueryEngine->jQueryObject = '$j';
echo $this->Html->scriptBlock(
    'var $j = jQuery.noConflict();',
    array('inline' => false)
);
// noconflict モードで実行する事を jQuery に伝えます。
```

### 独自ヘルパーの中で JsHelper の利用

あなたの独自ヘルパーの中の `$helpers` 配列の中で
JsHelper を宣言してください。 :

``` php
public $helpers = array('Js');
```

> [!NOTE]
> 独自ヘルパーの中で JavaScript エンジンの宣言はできません。
> それをしても反映されません。

もし、他の JavaScript エンジンを使いたい場合、以下のように
コントローラの中でヘルパーを設定してください。 :

``` php
public $helpers = array(
    'Js' => array('Prototype'),
    'CustomHelper'
);
```

> [!WARNING]
> あなたのコントローラの中の `$helpers` 配列の **先頭** に JsHelper と
> そのエンジンを宣言する事に注意してください。

選ばれた JavaScript エンジンがもし見つからない場合、あなたのヘルパーの中で
JsHelper オブジェクトから消えてしまう (デフォルトに置き換えられる）かもしれません。
そして、あなたの JavaScript ライブラリとは合わないコードを取得してしまいます。

## JavaScript エンジンの作成

JavaScript エンジンヘルパーは、いくつかの制約はありますが普通のヘルパーの習慣に
従います。 それらは `Engine` サフィックスが必要です。
`DojoHelper` は好ましくなく、 正しくは `DojoEngineHelper` です。
さらに、新しい API の多くに影響を与えるため `JsBaseEngneHelper`
を継承すべきです。

## JavaScript エンジンの使い方

`JsHelper` は、いくつかのメソッドを用意し、エンジンヘルパーの表の面で
動作します。ごく稀な場合を除いて、エンジンヘルパーに直接アクセスすべきでは
ありません。 `JsHelper` の表の機能は、バッファリングやメソッドチェーン
を便利にします。 (メソッドチェーンは PHP5 上でのみ動作します。)

`JsHelper` は、デフォルトでは、生成されたすべてのスクリプトコードは、
バッファに蓄積し、ビュー・エレメント・レイアウトを通してスクリプトを収集し、
一か所に出力します。バッファに蓄積したスクリプトの出力は、
`$this->Js->writeBuffer();` によって行われます。これは、スクリプトタグ内の
バッファの内容を返します。 `$bufferScripts` プロパティもしくは、
メソッド内の `$options` 引数に `buffer => false` を設定することで、
大規模に無効化することができます。

JavaScript 内の多くのメソッドが DOM のエレメントのセレクタで始める時、
`$this->Js->get()` は \$this を返し、セレクタを使用するために
メソッドチェーンが利用できます。メソッドチェーンは、短く記述でき、
コードの表現力が上がります。 :

``` php
$this->Js->get('#foo')->event('click', $eventCode);
```

上記がメソッドチェーンの例です。メソッドチェーンは、 PHP4 では不可能なので、
下記のサンプルのように記述します。 :

``` php
$this->Js->get('#foo');
$this->Js->event('click', $eventCode);
```

### 共通のオプション

JavaScript ライブラリが変更可能な開発を簡素化する試みにおいて、 `JsHelper`
は共通のオプションに対応します。これらの共通オプションは、内部的には
ライブラリが用意したオプションに対応します。JavaScript を切り替える予定がない場合、
これらのライブラリは、すべてのネイティブなコールバックやオプションに対応します。

### コールバックのラッッピング

デフォルトで、すべてのコールバックオプションは、正しい引数を持つ無名関数に
ラップされます。オプション配列に `wrapCallbacks = false` を指定することで、
この振る舞いを無効化できます。

### バッファ化スクリプトの動作

'Ajax' タイプの機能の前の実装の一つの欠点は、ドキュメントの中で
スクリプトタグが分散することでした。そして、レイアウト中でエレメントを
追加するスクリプトのバッファに無力でした。新しい JsHelper を使用した場合、
両方の課題を回避することができます。 `$this->Js->writeBuffer()` を
レイアウトファイルの `</body>` タグの直前におくことをお勧めします。
これは、レイアウト要素の中で生成されたすべてのスクリプトを
一か所に出力することになります。バッファに蓄積されたスクリプトは、
インクルードされたスクリプトファイルから独立して処理されることに
注意してください。

`method` JsHelper::**writeBuffer**($options = array())

コードブロックにそれまで生成されたすべての JavaScript を出力します。
もしくは、ファイルにキャッシュし、スクリプトのリンクを返します。

**オプション**

- `inline` - true にセットすると、スクリクトブロックのインラインとして
  出力されます。もし `cache` も true の場合、スクリプトリンクタグが
  生成されます。 (デフォルトは true)
- `cache` - true にセットすると、スクリプトはファイルにキャッシュされ、
  リンクされます。 (デフォルトは false)
- `clear` - false にセットすると、スクリプトのキャッシュが
  クリアされることを防ぎます。 (デフォルトは true)
- `onDomReady` - domready イベント内にキャッシュされたスクリプトを
  ラップします。 (デフォルトは true)
- `safe` - インラインブロックが生成された場合、 \<\![CDATA\[ ... \]\]\>
  でラップしなければなりません。 (デフォルトは true)

`writeBuffer()` でキャッシュファイルを作成するためには、
`webroot/js` が書き込み可能で、ブラウザーがどのページで生成された
スクリプトリソースもキャッシュできることが必要です。

`method` JsHelper::**buffer**($content)

`$content` を内部のスクリプトバッファに追加します。

`method` JsHelper::**getBuffer**($clear = true)

現在のバッファの内容を取得します。同時にバッファをクリアしないために false
を渡してください。

**通常はバッファしないバッファリングメソッド**

ヘルパーのいくつかのメソッドは、デフォルトでバッファします。エンジンは、
デフォルトで以下のメソッドがバッファリます。

- event
- sortable
- drag
- drop
- slider

追加で、 JsHelper の他のメソッドでバッファリングの利用を強制できます。
最後の引数にブーリアン型を追加することによって、他のメソッドでバッファ内に
蓄積することを強制できます。例えば、 `each()` メソッドは、通常では
バッファしません。 :

``` php
$this->Js->each('alert("whoa!");', true);
```

上記は、 `each()` メソッドにバッファを使用することを強制します。
逆に、バッファするメソッドでバッファしたくない場合、最後の引数に `false`
を渡すことでできます。 :

``` php
$this->Js->event('click', 'alert("whoa!");', false);
```

これは、通常はバッファする event 関数に結果を返すことを強制します。

## 他のメソッド

コア JavaScript エンジンは、すべてのライブラリにわたって同じ機能を提供します。
ライブラリ固有のオプションに変換される共通のオプションのサブセットがあります。
これは、開発者に API の統合を可能にします。以下のメソッドのリストは、
CakePHP コアに含まれるすべてのエンジンに対応します。　あなたには、
`オプション` と `イベントオプション` は別のリストに見えるかもしれませんが、
両方のパラメータは、メソッドの `$options` 配列で指定します。

`method` JsHelper::**object**($data, $options = array())

`method` JsHelper::**sortable**($options = array())

`method` JsHelper::**request**($url, $options = array())

`method` JsHelper::**get**($selector)

`method` JsHelper::**set**(mixed $one, mixed $two = null)

`method` JsHelper::**drag**($options = array())

`method` JsHelper::**drop**($options = array())

`method` JsHelper::**slider**($options = array())

`method` JsHelper::**effect**($name, $options = array())

`method` JsHelper::**event**($type, $content, $options = array())

`method` JsHelper::**domReady**($callback)

`method` JsHelper::**each**($callback)

`method` JsHelper::**alert**($message)

`method` JsHelper::**confirm**($message)

`method` JsHelper::**prompt**($message, $default)

`method` JsHelper::**submit**($caption = null, $options = array())

`method` JsHelper::**link**($title, $url = null, $options = array())

`method` JsHelper::**serializeForm**($options = array())

`method` JsHelper::**redirect**($url)

`method` JsHelper::**value**($value)

## AJAX ページ制御

1.2 の AJAX ページ制御のように、AJAX ページ制御のリンクの作成をプレーンな
HTML リンクの代わりに制御するために JsHelper が利用できます。

### AJAX リンクの作成

AJAX リンクを作成する前に、 `JsHelper` で使用しているアダプタにマッチする
JavaScript ライブラリを含める必要があります。デフォルトで `JsHelper` は、
jQuery を使用します。あなたのレイアウト内に jQuery
(またはあなたが使用しているライブラリ) を含めて下さい。また、
`RequestHandlerComponent` をあなたのコンポーネントに含めて下さい。
あなたのコントローラに以下を追加してください。 :

``` php
public $components = array('RequestHandler');
public $helpers = array('Js');
```

以下は、あなたが使用したい JavaScript ライブラリ内にリンクします。
この例では、 jQuery を使用しています。 :

``` php
echo $this->Html->script('jquery');
```

1.2 と同様に、 プレーンな HTML のリンクの代わりに Javascript のリンク
したいことを `PaginatorHelper` に伝える必要があります。
そうするには、あなたのビューの先頭で `options()` を呼びます。 :

``` php
$this->Paginator->options(array(
    'update' => '#content',
    'evalScripts' => true
));
```

これで `PaginatorHelper` は、 JavaScript でリンクを
拡張することができ、 これらのリンクは `#content` 要素を更新します。
もちろん、この要素が存在しなければなりません。 しばしば、
`update` オプションで指定した id にマッチする div で
`$content_for_layout` をラップしたいことがあります。もし、
Mootools や Prototype アダプターを使用しているなら `evalScripts` を
true にセットすべきです。 `evalScripts` なしだと、これらのライブラリは
リクエスト同士をつなげることはできません。 `indicator` オプションは、
`JsHelper` では対応せず、無視されます。

この時、ページ制御機能に必要な全てのリンクを作成します。
`JsHelper` が自動的に全ての生成されたスクリプトの内容を、ソースコード中の
`<script>` タグの数を減らすためにバッファする時、バッファを
書き出さなければなりません。ビューファイルの底に、以下を記述してください。 :

``` php
echo $this->Js->writeBuffer();
```

もし、これを除外した場合、AJAX ページ制御リンクの連携はできません。
バッファを書き出した時、それらはクリアされ、同じ JavaScript が２重に
出力される心配はありません。

### エフェクトと遷移の追加

`indicator` をもはや対応していないとき、indicator エフェクトを
あなた自身が追加しなければなりません。

``` php
<!DOCTYPE html>
<html>
    <head>
        <?php echo $this->Html->script('jquery'); ?>
        //more stuff here.
    </head>
    <body>
    <div id="content">
        <?php echo $this->fetch('content'); ?>
    </div>
    <?php
        echo $this->Html->image(
            'indicator.gif',
            array('id' => 'busy-indicator')
        );
    ?>
    </body>
</html>
```

indicator.gif ファイルを app/webroot/img フォルダ内におくことを忘れないでください。
indicator.gif がページロード中に直ちに表示される場面が考えられます。
メインの CSS ファイル内に `#busy-indicator { display:none; }`
を設定しておく必要があります。

上記のレイアウトで、indicator ビジーを示すアニメーションを表示する indicator
画像ファイルが含まれています。それは、 `JsHelper` で表示、非表示します。
そうするためには `options()` 関数を更新する必要があります。 :

``` php
$this->Paginator->options(array(
    'update' => '#content',
    'evalScripts' => true,
    'before' => $this->Js->get('#busy-indicator')->effect(
        'fadeIn',
        array('buffer' => false)
    ),
    'complete' => $this->Js->get('#busy-indicator')->effect(
        'fadeOut',
        array('buffer' => false)
    ),
));
```

これは、 `#content` の div が更新される前後に busy-indicator
要素を表示・非表示します。 `indicator` も削除され、 `JsHelper` によって
提供される新しい機能は、作成するためのより制御し複雑なエフェクトが可能です。
