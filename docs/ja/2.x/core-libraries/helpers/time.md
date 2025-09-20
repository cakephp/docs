# TimeHelper

`class` **TimeHelper**(View $view, array $settings = array())

Time ヘルパーはメッキをかぶせることであなたの時間を節約します。
Time ヘルパーには時間に関する情報を手早く処理するための2つの役割があります。

1.  時間を形式にそって文字列にすることができます。
2.  時間を調べることができます。ただし時間を変えることはできません。

::: info Changed in version 2.1
`TimeHelper` は `CakeTime` クラスに含まれるようにリファクタリングされました。これにより、ビューの外からでもより簡単に使えるようになりました。ビューで使う際は  クラスからこれらのメソッドを使うことができます。また、通常のヘルパーメソッドのように `$this->Time->method($args);` と呼び出すこともできます。
:::

## ヘルパーの使い方

Time ヘルパーの基本的な使い道は、ユーザーのタイムゾーンにあった日時に時刻を調整することです。
それでは掲示板を例にとりましょう。あなたの掲示板は世界各地からいろんな時間帯にたくさんのユーザーが
メッセージを投稿します。時刻を GMT+0 または UTC で保存すると、投稿時刻を簡単に管理できるでしょう。
あなたのアプリケーションで扱うタイムゾーンを確実に GMT+0 へするために、 `app/Config/core.php`
の `date_default_timezone_set('UTC');` という記述のコメントアウトを解除します。

次にタイムゾーンのフィールドをユーザーのテーブルに追加して、ユーザーがタイムゾーンを設定できるように
必要な修正を加えます。これでログインしているユーザーのタイムゾーンが分かるようになり、 Time ヘルパーを
使って投稿時刻を補正することができるようになりました。 :

``` php
echo $this->Time->format(
  'F jS, Y h:i A',
  $post['Post']['created'],
  null,
  $user['User']['time_zone']
);
// GMT+0 での時刻が August 22nd, 2011 11:53 PMの場合、
// タイムゾーンが GMT-8 の場合は August 22nd, 2011 03:53 PM、
// GMT+10 の場合は August 23rd, 2011 09:53 AM が表示されます。
```

Time ヘルパーのメソッドは多くが \$timezone パラメーターを持っています。このパラメーターは
タイムゾーンを表す文字列か、 <span class="title-ref">DateTimeZone</span> クラスのインスタンスを渡すことができます。

フォーマット
============

> rtype  
> integer
>
> (サーバのタイムゾーンで) 与えられた時間を、与えられたタイムゾーンで
> ユーザーのローカル時間に変換します。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->convert(time(), 'Asia/Jakarta');
> // 1321038036
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::convert(time(), new DateTimeZone('Asia/Jakarta'));
> ```
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::

> rtype  
> string
>
> strftime 関数の書式で文字列を変換し、Windows セーフで
> i18n を意識した書式を返します。

> rtype  
> string
>
> daysAsSql と同じ書式の文字列を作成します。ただし、日付オブジェクトを
> １つだけ必要とします。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
> // (modified >= '2011-08-22 00:00:00') AND
> // (modified <= '2011-08-22 23:59:59')
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::dayAsSql('Aug 22, 2011', 'modified');
> ```
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> string
>
> "(\$field_name \>= '2008-01-21 00:00:00') AND (\$field_name \<= '2008-01-25
> 23:59:59')" という書式の文字列を返します。これは、２つの期間を含むレコードを
> 検索する必要がある場合に役に立ちます。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
> // (created >= '2011-08-22 00:00:00') AND
> // (created <= '2011-08-25 23:59:59')
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
> ```
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> string
>
> [PHP strftime() format パラメータ](https://www.php.net/manual/ja/function.strftime.php)
> を使用して与えられた書式に文字列をフォーマットします。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
> // August 22, 2011 11:53 AM
>
> echo $this->Time->format('+2 days', '%c');
> // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 AM EET
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
> echo CakeTime::format('+2 days', '%c');
> ```
>
> 第一引数として日付や時間をセットします。この時、 `strftime` 互換の書式を使います。
> この呼び出しサインは、 `date()` 互換の書式では不可能なロケールを配慮した日付のフォーマットを
> テコ入れします。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->format('2012-01-13', '%d-%m-%Y', 'invalid');
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::format('2011-08-22', '%d-%m-%Y');
> ```
>
> ::: info Changed in version 2.2
> `$format` と `$date` パラメータは、2.1 以前とは順番が逆になりました。`$timezone` パラメータは、2.1 以前に使用されていた `$userOffset` パラメータを置き換えました。`$default` パラメータは、2.1 以前に使用されていた `$invalid` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> string
>
> 文字列を受け取り、日付の整数値に変換するために
> [strtotime](https://us.php.net/manual/en/function.date.php) を使います。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->fromString('Aug 22, 2011');
> // 1313971200
>
> echo $this->Time->fromString('+1 days');
> // 1321074066 (現在日時 +1 日)
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::fromString('Aug 22, 2011');
> echo CakeTime::fromString('+1 days');
> ```
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> integer
>
> グリニッジ標準時 (GMT) にセットした日時を整数で返します。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->gmt('Aug 22, 2011');
> // 1313971200
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::gmt('Aug 22, 2011');
> ```

> rtype  
> string
>
> UNIX タイムスタンプや strtotime() 形式の日付の文字列を与えてフォーマットされた
> 日付の文字列を返します。LC_TIME ファイルを使用している場合、現在の言語のデフォルトの
> 日付書式を加味します。 LC_TIME ファイルに関する詳細は、 [こちら](../../core-libraries/internationalization-and-localization#lc-time) を
> ご覧ください。
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::

> rtype  
> string
>
> 日付の文字列を受け取ると、"Tue, Jan 1st 2008, 19:25" の書式や、
> 追加で渡した `$format` パラメータの書式で出力します。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->nice('2011-08-22 11:53:00');
> // Mon, Aug 22nd 2011, 11:53
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::nice('2011-08-22 11:53:00');
> ```

> rtype  
> string
>
> 日付の文字列を受け取ると、 "Jan 1st 2008, 19:25" という書式で出力します。
> 日付が今日であれば、"Today, 19:25" という書式になります。日付が昨日であれば、
> "Yesterday, 19:25" という書式になります。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->niceShort('2011-08-22 11:53:00');
> // Aug 22nd, 11:53
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::niceShort('2011-08-22 11:53:00');
> ```
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> integer
>
> GMT からのサーバーのオフセットを秒で返します。

> rtype  
> string
>
> 日時の文字列 (PHP の strtotime() 関数や MySQL の datetime 型で解釈できるもの)
> を渡すと、"3 weeks, 3 days ago" という分かりやすい言葉に変換します。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->timeAgoInWords('Aug 22, 2011');
> // on 22/8/11
>
> // on August 22nd, 2011
> echo $this->Time->timeAgoInWords(
>     'Aug 22, 2011',
>     array('format' => 'F jS, Y')
> );
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::timeAgoInWords('Aug 22, 2011');
> echo CakeTime::timeAgoInWords(
>     'Aug 22, 2011',
>     array('format' => 'F jS, Y')
> );
> ```
>
> 'end' オプションを使うと、言葉での表示期間を設定できます。デフォルトでは '+1 month' です。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->timeAgoInWords(
>     'Aug 22, 2011',
>     array('format' => 'F jS, Y', 'end' => '+1 year')
> );
> // 2011 年 11 月 10 日現在の出力: 2 months, 2 weeks, 6 days ago
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::timeAgoInWords(
>     'Aug 22, 2011',
>     array('format' => 'F jS, Y', 'end' => '+1 year')
> );
> ```
>
> どのくらい精度で出力するかを指定するために 'accuracy' オプションを使用してください。
> 出力を制限するためにこれを使用できます。 :
>
> ``` text
> // $timestamp が '1 month, 1 week, 5 days and 6 hours ago' の場合
> echo CakeTime::timeAgoInWords($timestamp, array(
>     'accuracy' => array('month' => 'month'),
>     'end' => '1 year'
> ));
> // '1 month ago' と表示
> ```
>
> ::: info Changed in version 2.2
> `accuracy` オプションが追加されました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> string
>
> 日時を文字列で "2008-01-12T00:00:00Z" のように、 Atom 形式で返します。
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> mixed
>
> 与えられた日付が、どの四半期に属するかを 1、２、３ または 4 で返します。
> もし、range が true にセットされていたら、"2008-03-31" 形式で
> 四半期の開始と終了の２つの要素を配列で返します。 :
>
> ``` php
> // TimeHelper で実行
> echo $this->Time->toQuarter('Aug 22, 2011');
> // 3 を表示
>
> $arr = $this->Time->toQuarter('Aug 22, 2011', true);
> /*
> Array
> (
>     [0] => 2011-07-01
>     [1] => 2011-09-30
> )
> */
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> echo CakeTime::toQuarter('Aug 22, 2011');
> $arr = CakeTime::toQuarter('Aug 22, 2011', true);
> ```
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::
>
> ::: info Added in version 2.4
> 新しいオプションパラメータ `relativeString` (デフォルトでは `%s ago`) と`absoluteString` (デフォルトでは `on %s`) は、出力結果の文字列をカスタマイズするために追加されました。
> :::

> rtype  
> string
>
> 日時を文字列で "Sat, 12 Jan 2008 00:00:00 -0500" のように、
> RSS 形式で返します。
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> integer
>
> fromString メソッドのラッパーです。
>
> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::

> rtype  
> mixed
>
> ::: info Added in version 2.2
> サーバのタイムゾーンでフォーマットされた日付を返します。
> :::

> rtype  
> DateTimeZone
>
> ::: info Added in version 2.2
> 文字列またはユーザーのタイムゾーンオブジェクトからタイムゾーンオブジェクトを返します。もし、パラメータなしで関数が呼ばれた場合、 'Config.timezone' 設定値からタイムゾーンの取得を試みます。
> :::

> rtype  
> array
>
> ::: info Added in version 2.2
> タイムゾーンの一覧を返します。
> :::
>
> ::: info Changed in version 2.8
> `$options` は、 `group`, `abbr`, `before`, `after` キーを持つ配列を受け付けます。`abbr => true` を指定すると、 `<option>` テキストにタイムゾーンの省略形が追加されます。
> :::

## 時間のテスト

> ::: info Added in version 2.4
> :::

> ::: info Added in version 2.4
> :::

> ::: info Changed in version 2.2
> `$timezone` パラメータは、2.1 以前で使用されていた `$userOffset` パラメータを置き換えました。
> :::
>
> ::: info Added in version 2.2
> `$dateString` パラメータは、現在 DateTime オブジェクトも受け取れます。
> :::
>
> 上記の全ての関数は、日付の文字列を渡すと true か false を返します。
> `wasWithinLast` は、追加で `$timeInterval` オプションを受け取ります。 :
>
> ``` php
> // TimeHelper で実行
> $this->Time->wasWithinLast($timeInterval, $dateString);
>
> // CakeTime で実行
> App::uses('CakeTime', 'Utility');
> CakeTime::wasWithinLast($timeInterval, $dateString);
> ```
>
> `wasWithinLast` は、"3 months" という書式 (複数形もしくは単数形) で、
> 秒 (seconds)・分 (minutes)・時 (hours)・日 (days)・月 (months)・年 (years) を受け取ります。
> タイプミスなどで認識できない場合、デフォルトでは日として扱われます。
