Javascript
##########

Javascript ヘルパーは 整形済み javascript
タグやコードブロックを生成します。いくつかのメソッドは
`Prototype <https://www.prototypejs.org>`_ javascript
ライブラリで動作するように設計されています。

JavascriptHelper は CakePHP 1.3
から非推奨になりました。今後のバージョンで、廃止が予定されています。JavascriptHelper
の各メソッドが移された JsHelper/HtmlHelper
と、1.2から1.3への移行ガイドを参照してください。

メソッド
========

``codeBlock($string, $options, $safe)``

-  string $script - SCRIPT タグで囲まれる javascript
-  boolean $options - オプション: allowCache, safe, inline
-  boolean $safe - 非推奨。代わりに $options['safe']
   を使用してください。

codeBlock は $script を含むフォーマットされた script
要素を返します。Javascript
ヘルパーがイベントをキャッシュするように設定されている場合、null
を返すこともできます。インラインで出力するか、あるいは
$options['inline'] に false をセットすると、\ ``$scripts_for_layout``
に出力することができます。

``blockEnd()``

キャッシュされた javascript のブロックを終了します。script
終了タグあるいは cachedEvents
配列にコンテンツを追加し空のバッファを返すことができます。返されれる値はキャッシュ設定に依存します。JavascriptHelper::cacheEvents()
をみてください。

``link($url, $inline)``

-  mixed $url - JavaScript ファイルの URL 文字列、あるいは URL の配列
-  boolean $inline - true の場合、<script>
   タグがインラインに出力されます。そうでない場合は、\ ``$scripts_for_layout``
   に出力されます。

単一の、あるいは多くの javascript
ファイルのリンクを生成します。インラインあるいは ``$scripts_for_layout``
に出力することができます。

``escapeString($string)``

-  string $script - エスケープする必要がある文字列

javascript に合うように文字列をエスケープします。javascript
ブロックに対して安全に使用できます。

エスケープされる文字:

-  "\\r\\n" => '\\n'
-  "\\r" => '\\n'
-  "\\n" => '\\n'
-  '"' => '\\"'
-  "'" => "\\\\'"

``event($object, $event, $observer, $useCapture)``

-  string $object - オブザーブされる DOM オブジェクト
-  string $event - ie の 'click', 'over' をオブザーブするイベントの種類
-  string $observer - イベントが発生したときに呼び出す Javascript 関数
-  boolean $useCapture - イベントハンドリングの bubble
   フェーズでイベントを実行するかどうか。デフォルトは false です。

$event で指定した javascript イベントハンドラを $object で指定した DOM
エレメントを割り当てます。オブジェクトは ID
参照できる必要はありません。有効な javascript オブジェクトか、あるいは
CSS セレクタで参照できればいいです。CSS
セレクタを使用する場合、イベントハンドラはキャッシュされ、JavascriptHelper::getCache()
で取り出すべきです。このメソッドは Prototype ライブラリが必要です。

``cacheEvents($file, $all)``

-  boolean $file - true の場合、コードはファイルに書き出されます。
-  boolean $all - true の場合、JavascriptHelper
   で記述されたコードはファイルに送られます。

JavaScript ヘルパーが event()
で生成されたイベントコードをどのようにキャッシュするかを制御できます。$all
が true
にセットされると、ヘルパーによって生成されたすべてのコードはキャッシュされ、getCache()
で取り出したり、ファイルに書き出したり、writeCache()
でページ出力したりできます。

``getCache($clear)``

-  boolean $clear - true をセットすると、キャッシュされた javascritp
   はクリアされます。デフォルトは true です。

現在の JavaScript イベントキャッシュを取得（し、クリア）します。

``writeEvents($inline)``

-  boolean $inline - true の場合、javascript
   イベントコードを返します。そうでない場合は、レイアウト内の
   $scripts\_for\_layout の出力内容に追加されます。

キャッシュされた javascript コードを返します。$file が cacheEvents() で
true
にセットされると、コードはファイルにキャッシュされ、キャッシュされたイベントファイルへのスクリプトのリンクが返されます。$inline
が true
の場合、イベントコードはインラインに返されます。そうでない場合、ページの
$scripts\_for\_layout に追加されます。

``includeScript($script)``

-  string $script - 読み込むスクリプトのファイル名

$script を読み込みます。$script が空の場合、ヘルパーは app/webroot/js
ディレクトリ内のすべてのスクリプトを読み込みます。インラインに各ファイルの内容を読み込みます。src
属性をもつ script タグを生成するには link() を使用します。

``object($data, $block, $prefix, $postfix, $stringKeys, $quoteKeys, $q)``

-  array $data - 変換されるデータ
-  boolean $block - true の場合、返値を <script/>
   ブロックで囲みます。デフォルトは false です。
-  string $prefix - 返されたデータの前につける文字列
-  string $postfix - 返されたデータの後ろにつける文字列
-  array $stringKeys - 文字列として扱う配列キーのリスト
-  boolean $quoteKeys - false の場合、$stringKey をクォートされて
   \*いない\* キーのリストとして扱います。
-  string $q - 使用するクォートの種類。デフォルトは " です。

$data 配列から JavaScript Object Notation (JSON) 形式で JavaScript
オブジェクトを生成します。
