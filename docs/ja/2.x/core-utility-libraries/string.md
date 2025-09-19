# CakeText

`class` **CakeText**

CakeText クラスは文字列の作成や走査に関する便利なクラスです。
また、スタティックにアクセスすることが可能です。例： `CakeText::uuid()` 。

<div class="deprecated">

2.7
`String` クラスは、2.7 で非推奨になりました。 `CakeText` クラスを
推奨します。 `String` クラスは、後方互換のために提供し、 PHP7 や HHVM との
互換性に備えて `CakeText` の使用をお勧めします。

</div>

もし、 `View` 以外で `TextHelper` が必要な場合、
`CakeText` クラスを使ってください。 :

``` php
class UsersController extends AppController {

    public $components = array('Auth');

    public function afterLogin() {
        App::uses('CakeText', 'Utility');
        $message = $this->User->find('new_message');
        if (!empty($message)) {
            // 新しいメッセージをユーザへ通知
            $this->Session->setFlash(__('You have a new message: %s', CakeText::truncate($message['Message']['body'], 255, array('html' => true))));
        }
    }
}
```

::: info Changed in version 2.1
`TextHelper` のいくつかのメソッドは `CakeText` クラスへ移動しています。uuid メソッドは、`4122` で規定されているようなユニーク ID を生成するために利用します。UUID とは、485fc381-e790-47a3-9794-1337c0a8fe68 のようなフォーマットの128 ビットの文字列のことです。 :`$separator` を利用して文字列をトークン化します。この際に `$leftBound` と`$rightBound` の間に現れる `$separator` は無視します。このメソッドは、タグリストのような定形フォーマットのデータを分割するのに便利です。 :insert メソッドは、テンプレートとキー・バリューの組み合わせから文字列を作成できます。 :与えられた $options に 'clean' キーが存在した場合、その指定に従って`CakeText::insert` をクリーンアップします。デフォルトでは text を利用しますが、html も用意されています。この機能の目的は、 Set::insert では取り除けなかったホワイトスペース、および、プレースホルダー周辺で必要がないマークアップを取り除くことにあります。オプションは次のように指定します。 :テキストのブロックを決められた幅や折り返し、インデントにも対応します。単語の途中で改行されたりしないように、賢く折り返しの処理を行います。 :どのように折り返し処理を行うか、オプションの配列で指定することができます。サポートされているオプションは次のとおりです。
:::

`method` CakeText::**highlight**(string $haystack, string $needle, array $options = array() )

`method` CakeText::**stripLinks**($text)

`method` CakeText::**truncate**(string $text, int $length=100, array $options)

::: info Changed in version 2.3
`ending` は、 `ellipsis` に置き換えられました。 `ending` は、 2.2.1 まで使用されました。
:::

`method` CakeText::**tail**(string $text, int $length=100, array $options)

`method` CakeText::**excerpt**(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

`method` CakeText::**toList**(array $list, $and='and')
