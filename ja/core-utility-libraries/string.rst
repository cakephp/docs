CakeText
########

.. php:class:: CakeText

CakeText クラスは文字列の作成や走査に関する便利なクラスです。
また、スタティックにアクセスすることが可能です。例： ``CakeText::uuid()`` 。

.. deprecated:: 2.7
    ``String`` クラスは、2.7 で非推奨になりました。 :php:class:`CakeText` クラスを
    推奨します。 ``String`` クラスは、後方互換のために提供し、 PHP7 や HHVM との
    互換性に備えて ``CakeText`` の使用をお勧めします。

もし、 ``View`` 以外で :php:class:`TextHelper` が必要な場合、
``CakeText`` クラスを使ってください。 ::

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

.. versionchanged:: 2.1
  :php:class:`TextHelper` のいくつかのメソッドは ``CakeText`` クラスへ移動しています。

.. php:staticmethod:: uuid()

    uuid メソッドは、:rfc:`4122` で規定されているようなユニーク ID を生成するために利用します。
    UUID とは、485fc381-e790-47a3-9794-1337c0a8fe68 のようなフォーマットの
    128 ビットの文字列のことです。 ::

        CakeText::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

    ``$separator`` を利用して文字列をトークン化します。この際に ``$leftBound`` と
    ``$rightBound`` の間に現れる  ``$separator`` は無視します。

    このメソッドは、タグリストのような定形フォーマットのデータを分割するのに便利です。 ::

        $data = "cakephp 'great framework' php";
        $result = CakeText::tokenize($data, ' ', "'", "'");
        // 結果
        array('cakephp', "'great framework'", 'php');

.. php:staticmethod:: insert($string, $data, $options = array())

    insert メソッドは、テンプレートとキー・バリューの組み合わせから文字列を作成できます。 ::

        CakeText::insert('My name is :name and I am :age years old.', array('name' => 'Bob', 'age' => '65'));
        // 生成される文字列: "My name is Bob and I am 65 years old."

.. php:staticmethod:: cleanInsert($string, $options = array())

    与えられた $options に 'clean' キーが存在した場合、その指定に従って
    ``CakeText::insert`` をクリーンアップします。
    デフォルトでは text を利用しますが、html も用意されています。
    この機能の目的は、 Set::insert では取り除けなかったホワイトスペース、
    および、プレースホルダー周辺で必要がないマークアップを取り除くことにあります。

    オプションは次のように指定します。 ::

        $options = array(
            'clean' => array(
                'method' => 'text', // or html
            ),
            'before' => '',
            'after' => ''
        );

.. php:staticmethod:: wrap($text, $options = array())

    テキストのブロックを決められた幅や折り返し、インデントにも対応します。
    単語の途中で改行されたりしないように、賢く折り返しの処理を行います。 ::

       $text = 'This is the song that never ends.';
       $result = CakeText::wrap($text, 22);

       // 出力
       This is the song
       that never ends.

    どのように折り返し処理を行うか、オプションの配列で指定することができます。
    サポートされているオプションは次のとおりです。

    * ``width`` 折り返す幅。デフォルトは 72。
    * ``wordWrap`` 単語の途中で折り返すか否かのフラグ。デフォルトは true 。
    * ``indent`` インデントの文字数。デフォルトは '' 。
    * ``indentAt`` インデントを開始する数。デフォルトは 0 。


.. start-string

.. php:method:: highlight(string $haystack, string $needle, array $options = array() )

    :param string $haystack: 検索対象の文字列
    :param string $needle: 探したい文字列
    :param array $options: オプションの配列、下記参照

    ``$haystack`` 中の ``$needle`` を ``$options['format']`` で指定された文字列か、
    デフォルトの文字列でハイライト表示します。

    オプション:

    -  'format' - 文字列。ハイライト表示に使う HTML を指定。
    -  'html' - 真偽値。true の場合は、HTML タグは無視して、
       純粋なテキスト部分のみハイライト表示します。

    例::

        // TextHelper として呼び出し
        echo $this->Text->highlight(
            $lastSentence,
            'using',
            array('format' => '<span class="highlight">\1</span>')
        );

        // CakeText クラスとして呼び出し
        App::uses('CakeText', 'Utility');
        echo CakeText::highlight(
            $lastSentence,
            'using',
            array('format' => '<span class="highlight">\1</span>')
        );

    出力結果::

        Highlights $needle in $haystack <span class="highlight">using</span>
        the $options['format'] string specified  or a default string.

.. php:method:: stripLinks($text)

    ``$text`` の中の HTML リンクを取り除きます。

.. php:method:: truncate(string $text, int $length=100, array $options)

    :param string $text: 切り詰める文字列
    :param int $length:  切り詰める文字の長さ
    :param array $options: オプションの配列

    文字列を ``$length`` の長さで切り詰めます。テキストの長さが ``$length``
    よりも長かった場合は、 ``'ellipsis'`` で指定されたサフィックスを追加します。
    もし ``'exact'`` が ``false`` の場合、次の単語の最後まで含めて切り詰めます。
    もし、 ``'html'`` が ``true`` の場合は HTML タグは切り捨ての対象になりません。

    ``$options`` は、どんな拡張パラメータでも利用できるように使われますが、
    デフォルトでは次のオプションのみが利用できます。 ::

        array(
            'ellipsis' => '...',
            'exact' => true,
            'html' => false
        )

    例::

        // TextHelper として利用
        echo $this->Text->truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // CakeText クラスとして利用
        App::uses('CakeText', 'Utility');
        echo CakeText::truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

    出力結果::

        The killer crept...

.. versionchanged:: 2.3
   ``ending`` は、 ``ellipsis`` に置き換えられました。 ``ending`` は、 2.2.1 まで使用されました。

.. php:method:: tail(string $text, int $length=100, array $options)

    :param string $text: 切り詰める文字列
    :param int $length:  切り詰める文字の長さ
    :param array $options: オプションの配列

    もし、 ``$text`` が ``$length`` より文字数が長い場合、このメソッドは、末尾から指定した
    文字数分だけ切り詰め、 (定義されていたなら) ``'ellipsis'`` で指定したプレフィックスを追加します。
    もし、 ``'exact'`` が ``false`` の場合、単語の途中で切り詰めず先頭で切り詰めます。

    ``$options`` は、どんな拡張パラメータでも利用できるように使われますが、
    デフォルトでは次のオプションのみが利用できます。 ::

        array(
            'ellipsis' => '...',
            'exact' => true
        )

    .. versionadded:: 2.3

    例::

        $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
            'a C# program that can divide by zero, death metal t-shirts'

        // TextHelper として利用
        echo $this->Text->tail(
            $sampleText,
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // CakeText クラスとして利用
        App::uses('CakeText', 'Utility');
        echo CakeText::tail(
            $sampleText,
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

    出力結果::

        ...a TV, a C# program that can divide by zero, death metal t-shirts

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

    :param string $haystack: 抜粋する対象の文字列
    :param string $needle: 抜粋する文字列
    :param int $radius:  $needle の前後に含めたい文字列の長さ
    :param string $ellipsis: 文字列の最初と最後に追懐したい文字列

    ``$haystack`` から ``$needle`` の前後 ``$radius`` の数の文字列を抜き出します。
    抜き出した文字列に ``$ellipsis`` で指定した文字列を前後に付けて返します。
    このメソッドは検索結果の表示に特に役立ちます。
    検索結果のドキュメント内で、検索文字列やキーワードを示すことができます。 ::

        // TextHelper として利用
        echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

        // CakeText クラスとして利用
        App::uses('CakeText', 'Utility');
        echo CakeText::excerpt($lastParagraph, 'method', 50, '...');

    出力結果::

        ... by $radius, and prefix/suffix with $ellipsis. This method is
        especially handy for search results. The query...

.. php:method:: toList(array $list, $and='and')

    :param array $list: リスト文として結合したい配列
    :param string $and: 最後の結合箇所で利用する単語

    最後の2つの要素を「and」で結合したカンマ区切りのリストを作成します。 ::

        // TextHelper として利用
        echo $this->Text->toList($colors);

        // CakeText として利用
        App::uses('CakeText', 'Utility');
        echo CakeText::toList($colors);

    出力結果::

        red, orange, yellow, green, blue, indigo and violet

.. end-string


.. meta::
    :title lang=ja: CakeText
    :keywords lang=ja: array php,array name,string options,data options,result string,class string,string data,string class,placeholders,default method,key value,markup,rfc,replacements,convenience,templates
