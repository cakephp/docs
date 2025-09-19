# TextHelper

`class` **TextHelper**(View $view, array $settings = array())

TextHelper は、ビューの中でテキストを作成する際に便利で使いやすいメソッドが
含まれています。リンクの有効化、URL のフォーマット、選ばれた言葉やフレーズの
周りのテキストの抜粋の作成、テキストのブロック内のキーワードのハイライト、
テキストの余分な部分の削除を手伝います。

::: info Changed in version 2.1
`TextHelper` のいくつかのメソッドは、 `View` レイヤーの外でも使用できるように`String` クラスに移動しました。ビューの中でこれらのメソッドは クラスを経由してアクセス可能です。普通のヘルパーメソッドを呼ぶのと同様に`$this->Text->method($args);` のように利用できます。
:::

`method` TextHelper::**autoLinkEmails**(string $text, array $options=array())

`method` TextHelper::**autoLinkUrls**(string $text, array $options=array())

`method` TextHelper::**autoLink**(string $text, array $options=array())

`method` TextHelper::**autoParagraph**(string $text)

.. php:method:: highlight(string \$haystack, string \$needle, array \$options = array() )

> param string \$haystack  
> 検索対象の文字列
>
> param string \$needle  
> 探したい文字列
>
> param array \$options  
> オプションの配列、下記参照
>
> `$haystack` 中の `$needle` を `$options['format']` で指定された文字列か、
> デフォルトの文字列でハイライト表示します。
>
> オプション:
>
> - 'format' - 文字列。ハイライト表示に使う HTML を指定。
> - 'html' - 真偽値。true の場合は、HTML タグは無視して、
>   純粋なテキスト部分のみハイライト表示します。
>
> 例:
>
> ``` php
> // TextHelper として呼び出し
> echo $this->Text->highlight(
>     $lastSentence,
>     'using',
>     array('format' => '<span class="highlight">\1</span>')
> );
>
> // CakeText クラスとして呼び出し
> App::uses('CakeText', 'Utility');
> echo CakeText::highlight(
>     $lastSentence,
>     'using',
>     array('format' => '<span class="highlight">\1</span>')
> );
> ```
>
> 出力結果:
>
>     Highlights $needle in $haystack <span class="highlight">using</span>
>     the $options['format'] string specified  or a default string.

> `$text` の中の HTML リンクを取り除きます。

> param string \$text  
> 切り詰める文字列
>
> param int \$length  
> 切り詰める文字の長さ
>
> param array \$options  
> オプションの配列
>
> 文字列を `$length` の長さで切り詰めます。テキストの長さが `$length`
> よりも長かった場合は、 `'ellipsis'` で指定されたサフィックスを追加します。
> もし `'exact'` が `false` の場合、次の単語の最後まで含めて切り詰めます。
> もし、 `'html'` が `true` の場合は HTML タグは切り捨ての対象になりません。
>
> `$options` は、どんな拡張パラメータでも利用できるように使われますが、
> デフォルトでは次のオプションのみが利用できます。 :
>
>     array(
>         'ellipsis' => '...',
>         'exact' => true,
>         'html' => false
>     )
>
> 例:
>
> ``` php
> // TextHelper として利用
> echo $this->Text->truncate(
>     'The killer crept forward and tripped on the rug.',
>     22,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
>
> // CakeText クラスとして利用
> App::uses('CakeText', 'Utility');
> echo CakeText::truncate(
>     'The killer crept forward and tripped on the rug.',
>     22,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
> ```
>
> 出力結果:
>
>     The killer crept...

::: info Changed in version 2.3
`ending` は、 `ellipsis` に置き換えられました。 `ending` は、 2.2.1 まで使用されました。
:::

> param string \$text  
> 切り詰める文字列
>
> param int \$length  
> 切り詰める文字の長さ
>
> param array \$options  
> オプションの配列
>
> もし、 `$text` が `$length` より文字数が長い場合、このメソッドは、末尾から指定した
> 文字数分だけ切り詰め、 (定義されていたなら) `'ellipsis'` で指定したプレフィックスを追加します。
> もし、 `'exact'` が `false` の場合、単語の途中で切り詰めず先頭で切り詰めます。
>
> `$options` は、どんな拡張パラメータでも利用できるように使われますが、
> デフォルトでは次のオプションのみが利用できます。 :
>
>     array(
>         'ellipsis' => '...',
>         'exact' => true
>     )
>
> ::: info Added in version 2.3
> :::
>
> 例:
>
> ``` php
> $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
>     'a C# program that can divide by zero, death metal t-shirts'
>
> // TextHelper として利用
> echo $this->Text->tail(
>     $sampleText,
>     70,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
>
> // CakeText クラスとして利用
> App::uses('CakeText', 'Utility');
> echo CakeText::tail(
>     $sampleText,
>     70,
>     array(
>         'ellipsis' => '...',
>         'exact' => false
>     )
> );
> ```
>
> 出力結果:
>
>     ...a TV, a C# program that can divide by zero, death metal t-shirts

> param string \$haystack  
> 抜粋する対象の文字列
>
> param string \$needle  
> 抜粋する文字列
>
> param int \$radius  
> \$needle の前後に含めたい文字列の長さ
>
> param string \$ellipsis  
> 文字列の最初と最後に追懐したい文字列
>
> `$haystack` から `$needle` の前後 `$radius` の数の文字列を抜き出します。
> 抜き出した文字列に `$ellipsis` で指定した文字列を前後に付けて返します。
> このメソッドは検索結果の表示に特に役立ちます。
> 検索結果のドキュメント内で、検索文字列やキーワードを示すことができます。 :
>
> ``` php
> // TextHelper として利用
> echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');
>
> // CakeText クラスとして利用
> App::uses('CakeText', 'Utility');
> echo CakeText::excerpt($lastParagraph, 'method', 50, '...');
> ```
>
> 出力結果:
>
>     ... by $radius, and prefix/suffix with $ellipsis. This method is
>     especially handy for search results. The query...

> param array \$list  
> リスト文として結合したい配列
>
> param string \$and  
> 最後の結合箇所で利用する単語
>
> 最後の2つの要素を「and」で結合したカンマ区切りのリストを作成します。 :
>
> ``` php
> // TextHelper として利用
> echo $this->Text->toList($colors);
>
> // CakeText として利用
> App::uses('CakeText', 'Utility');
> echo CakeText::toList($colors);
> ```
>
> 出力結果:
>
>     red, orange, yellow, green, blue, indigo and violet
