# 日付と時刻

`class` Cake\\I18n\\**FrozenTime**

`TimeHelper` の機能を `View` の外で使いたい場合は、
`FrozenTime` クラスを利用してください。 :

``` php
use Cake\I18n\FrozenTime;

class UsersController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth');
    }

    public function afterLogin()
    {
        $time = new FrozenTime($this->Auth->user('date_of_birth'));
        if ($time->isToday()) {
            / 誕生日祝いのメッセージでユーザーに挨拶
            $this->Flash->success(__('Happy birthday to you...'));
        }
    }
}
```

内部的には、この `FrozenTime` ユーティリティを動かすために、CakePHP は
[Chronos](https://github.com/cakephp/chronos) を利用しています。
`Chronos` と `DateTime` でできることはなんでも、 `FrozenTime` と `FrozenDate` ですることができます。

Chronos についてより詳しく知りたい場合は [API ドキュメント](https://api.cakephp.org/chronos/1.0/) をご覧ください。

<!-- start-time -->

## Time インスタンスを作成する

`FrozenTime` インスタンスを作成するにはいくつかの方法があります。 :

``` php
use Cake\I18n\FrozenTime;

// 日時文字列から作成
$time = FrozenTime::createFromFormat(
    'Y-m-d H:i:s',
    '2021-01-31 22:11:30',
    'America/New_York'
);

// タイムスタンプから作成
$time = FrozenTime::createFromTimestamp(1612149090, 'Asia/Tokyo');

// 現在時刻を取得
$time = FrozenTime::now();

// または 'new' を使用して
$time = new FrozenTime('2021-01-31 22:11:30', 'Asia/Tokyo');

$time = new FrozenTime('2 hours ago');
```

`FrozenTime` クラスのコンストラクターは、内部の PHP クラスである `DateTimeImmutable` が受け取れる、
あらゆるパラメーターを受け取ることができます。数値や数字文字列を渡したとき、
UNIX タイムスタンプとして解釈されます。

テストケースでは、 `setTestNow()` を使うことで `now()` をモックアップできます。 :

``` php
// 時間の固定
$time = new FrozenTime('2021-01-31 22:11:30');
FrozenTime::setTestNow($time);

// 結果は '2021-01-31 22:11:30'
$now = FrozenTime::now();
echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

// 結果は '2021-01-31 22:11:30'
$now = FrozenTime::parse('now');
echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

## 操作

`FrozenTime` インスタンスは、それ自体を変更するのではなく、常にセッターから新しいインスタンスを返すことを忘れないでください。 :

``` php
$time = FrozenTime::now();

// Create and reassign a new instance
$newTime = $time->year(2013)
    ->month(10)
    ->day(31);
// Outputs '2013-10-31 22:11:30'
echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

PHP のビルトインの `DateTime` クラスで提供されているメソッドも使用できます。 :

``` php
$time = $time->setDate(2013, 10, 31);
```

日付はコンポーネントの引き算や足し算で編集できます。 :

``` php
$time->year(2013)
    ->month(10)
    ->day(31);
// Outputs '2021-01-31 22:11:30'
echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

コンポーネントの減算と加算により、日付が変更された別のインスタンスを作成できます。 :

``` php
$time = FrozenTime::create(2021, 1, 31, 22, 11, 30);
$newTime = $time->subDays(5)
    ->addHours(-2)
    ->addMonth(1);
// Outputs '2/26/21, 8:11 PM'
echo $newTime;

// Using strtotime strings.
$newTime = $time->modify('+1 month -5 days -2 hours');
// Outputs '2/26/21, 8:11 PM'
echo $newTime;
```

プロパティにアクセスすることで、日付の内部コンポーネントを取得できます。 :

``` php
$time = FrozenTime::create(2021, 1, 31, 22, 11, 30);
echo $time->year; // 2021
echo $time->month; // 1
echo $time->day; // 31
echo $time->timezoneName; // America/New_York
```

## フォーマットする

`static` Cake\\I18n\\FrozenTime::**setJsonEncodeFormat**($format)

このメソッドは、オブジェクトを json 形式に変換するときに使われる
デフォルトのフォーマットをセットします。 :

``` php
Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 可変の DataTime 用
FrozenTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 不変の DateTime 用
Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 可変の Date 用
FrozenDate::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // 不変の Date 用

$time = FrozenTime::parse('2021-01-31 22:11:30');
echo json_encode($time);   // Outputs '2021-01-31 22:11:30'

// Added in 4.1.0
FrozenDate::setJsonEncodeFormat(static function($time) {
    return $time->format(DATE_ATOM);
});
```

> [!NOTE]
> このメソッドは静的に呼び出されなくてはなりません。

::: info Changed in version 4.1.0
`callable` パラメータタイプが追加されました。
:::

`method` Cake\\I18n\\FrozenTime::**i18nFormat**($format = null, $timezone = null, $locale = null)

`Time` インスタンスで行うごく一般的なことは、フォーマットされたデータを出力することです。
CakePHP は snap を作成します。 :

``` php
$now = Time::parse('2014-10-31');

// 地域化された日時のスタンプを出力します。
echo $now;

// en-US ロケールでは '10/31/14, 12:00 AM' を出力します。
$now->i18nFormat();

// 日付と時刻のフルフォーマットを利用します。
$now->i18nFormat(\IntlDateFormatter::FULL);

// 日付のフルフォーマットと時刻のショートフォーマットを利用します。
$now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

// '2014-10-31 00:00:00' と出力します。
$now->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

文字列が表示される希望のフォーマットを特定することも可能です。
この関数に第1引数として [IntlDateFormatter 定数](https://www.php.net/manual/ja/class.intldateformatter.php) を渡したり、
あるいは以下のリソースで指定されている ICU の日付フルフォーマット文字列を渡すことができます:
<https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax>.

グレゴリオ暦以外の暦で日付をフォーマットすることも可能です。 :

``` php
// 出力結果 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
$result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');
```

以下の暦のタイプがサポートされています。

- japanese
- buddhist
- chinese
- persian
- indian
- islamic
- hebrew
- coptic
- ethiopic

> [!NOTE]
> IntlDateFormatter::FULL のような文字列定数のために Intl は ICU ライブラリーを使用します。
> そのライブラリーは、 CLDR (<https://cldr.unicode.org/>) からデータを取り入れています。
> ライブラリーのバージョンは、 PHP のインストールにとても依存し、バージョンにより異なる結果を返します。

`method` Cake\\I18n\\FrozenTime::**nice**()

あらかじめ定義されている 'nice' フォーマットで出力します。 :

``` php
$time = Time::parse('2014-10-31');

// en-USでは 'Oct 31, 2014 12:00 AM' と出力されます。
echo $time->nice();
```

`Time` オブジェクトそのものを変更することなく、出力される日付のタイムゾーンを変更することができます。
一つのタイムゾーンでデータを保存しているけれども、ユーザーのそれぞれのタイムゾーンで表示したい場合に
便利です。 :

``` php
$time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');
```

第1引数を `null` のままにしておくと、デフォルトのフォーマット文字列を使用します。 :

``` php
$time->i18nFormat(null, 'Europe/Paris');
```

最後に、日付を表示するのに異なるロケールを利用することができます。 :

``` php
echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

echo $time->nice('Europe/Paris', 'fr-FR');
```

### デフォルトのロケールとフォーマット文字列を設定する

`nice` や `i18nFormat` を利用している際に表示される日付のデフォルトのロケールは、
[intl.default_locale](https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale) の指令です。
しかしながら、このデフォルト値は実行時にも変更できます。 :

``` php
Time::setDefaultLocale('es-ES'); // 可変の DateTime 用
FrozenTime::setDefaultLocale('es-ES'); // 不変の DateTime 用
Date::setDefaultLocale('es-ES'); // 可変の Date 用
FrozenDate::setDefaultLocale('es-ES'); // 不変の Date 用
```

フォーマットメソッドの中で直接異なるローケルが指示されていない限り、今後、
日時はスペインのフォーマットで表示されます。

同様に、 `i18nFormat` を利用することでデフォルトのフォーマット文字列を変更できます。 :

``` php
Time::setToStringFormat(\IntlDateFormatter::SHORT); // 可変の DateTime 用
FrozenTime::setToStringFormat(\IntlDateFormatter::SHORT); // 不変の DateTime 用
Date::setToStringFormat(\IntlDateFormatter::SHORT); // 可変の Date 用
FrozenDate::setToStringFormat(\IntlDateFormatter::SHORT); // 不変の Date 用

// Date, FrozenDate, FrozenTime にも同じメソッドがあります。
Time::setToStringFormat([
    \IntlDateFormatter::FULL,
    \IntlDateFormatter::SHORT
]);

// Date, FrozenDate, FrozenTime にも同じメソッドがあります。
Time::setToStringFormat('yyyy-MM-dd HH:mm:ss');
```

日付のフォーマット文字列を直接渡すよりも、定数を常に利用することが推奨されています。

### 相対時間のフォーマットについて

`method` Cake\\I18n\\FrozenTime::**timeAgoInWords**(array $options = [])

現在との相対的な時間を出力することが有用なときがしばしばあります。 :

``` php
$time = new FrozenTime('Jan 31, 2021');
// On June 12, 2021, this would output '4 months, 1 week, 6 days ago'
echo $time->timeAgoInWords(
    ['format' => 'MMM d, YYY', 'end' => '+1 year']
);
```

`format` オプションを利用してフォーマットされた相対時間の位置は
`end` オプションによって定義されます。
`accuracy` オプションは、それぞれの間隔幅に対してどのレベルまで詳細を出すかをコントロールします。 :

``` php
// Outputs '4 months ago'
echo $time->timeAgoInWords([
    'accuracy' => ['month' => 'month'],
    'end' => '1 year'
]);
```

`accuracy` を文字列で設定すると、出力をどのレベルまで詳細を出すかの最大値を指定できます。 :

``` php
$time = new Time('+23 hours');
// 出力結果 'in about a day'
$result = $time->timeAgoInWords([
    'accuracy' => 'day'
]);
```

## 変換

`method` Cake\\I18n\\FrozenTime::**toQuarter**()

一旦作成しても、 `Time` インスタンスを、タイムスタンプや四半期の値に変換することができます。 :

``` php
$time = new FrozenTime('2021-01-31');
echo $time->toQuarter();  // Outputs '1'
echo $time->toUnixString();  // Outputs '1612069200'
```

## 現在と比較する

`method` Cake\\I18n\\FrozenTime::**isYesterday**()

`method` Cake\\I18n\\FrozenTime::**isThisWeek**()

`method` Cake\\I18n\\FrozenTime::**isThisMonth**()

`method` Cake\\I18n\\FrozenTime::**isThisYear**()

様々な方法で `Time` インスタンスと現在とを比較することができます。 :

``` php
$time = new FrozenTime('+3 days');

debug($time->isYesterday());
debug($time->isThisWeek());
debug($time->isThisMonth());
debug($time->isThisYear());
```

上述のメソッドのいずれも、 `Time` インスタンスが現在と一致するかどうかによって、
`true`/`false` を返します。

## 間隔を比較する

`method` Cake\\I18n\\FrozenTime::**isWithinNext**($interval)

`wasWithinLast()` および `isWithinNext()` を使用して `FrozenTime` インスタンスが特定の範囲内にあるかどうかを確認できます。 :

``` php
$time = new FrozenTime('+3 days');

// Within 2 days. Outputs 'false'
debug($time->isWithinNext('2 days'));

// Within 2 next weeks. Outputs 'true'
debug($time->isWithinNext('2 weeks'));
```

`method` Cake\\I18n\\FrozenTime::**wasWithinLast**($interval)

過去の範囲内の `FrozenTime` インスタンスと比較することもできます。 :

``` php
$time = new FrozenTime('-72 hours');

// Within past 2 days. Outputs 'false'
debug($time->wasWithinLast('2 days'));

// Within past 3 days. Outputs 'true'
debug($time->wasWithinLast('3 days'));

// Within past 2 weeks. Outputs 'true'
debug($time->wasWithinLast('2 weeks'));
```

<!-- end-time -->

## FrozenDate

CakePHP の不変の `FrozenDate` クラスは `Cake\I18n\FrozenTime` と同じAPIとメソッドを実装しています。
`FrozenTime` と `FrozenDate` の主な違いは、 `FrozenDate` が時間コンポーネントを追跡しないことです。
以下のコードをご覧ください。 :

``` php
use Cake\I18n\FrozenDate;
$date = new FrozenDate('2021-01-31');

$newDate = $date->modify('+2 hours');
// Outputs '2021-01-31 00:00:00'
echo $newDate->format('Y-m-d H:i:s');

$newDate = $date->addHours(36);
// Outputs '2021-01-31 00:00:00'
echo $newDate->format('Y-m-d H:i:s');

$newDate = $date->addDays(10);
// Outputs '2021-02-10 00:00:00'
echo $newDate->format('Y-m-d H:i:s');
```

`FrozenDate` インスタンスのタイムゾーンを変更する試みも無視されます。 :

``` php
use Cake\I18n\FrozenDate;
$date = new FrozenDate('2021-01-31', new \DateTimeZone('America/New_York'));
$newDate = $date->setTimezone(new \DateTimeZone('Europe/Berlin'));

// Outputs 'America/New_York'
echo $newDate->format('e');
```

<a id="mutable-time"></a>

## Mutable Dates and Times

`class` Cake\\I18n\\**Time**

`class` Cake\\I18n\\**Date**

CakePHP は、変更可能な仲間と同じインターフェイスを実装する、不変な日付と時刻のクラスを
提供しています。不変なオブジェクトは、偶発的にデータが変わってしまうのを防ぎたいときや、
順番に依存する問題を避けたいときに、便利です。以下のコードをご覧ください。 :

``` php
use Cake\I18n\Time;
$time = new Time('2015-06-15 08:23:45');
$time->modify('+2 hours');

// このメソッドは $time インスタンスも変更します。
$this->someOtherFunction($time);

// ここでの出力結果は不明です。
echo $time->format('Y-m-d H:i:s');
```

メソッドの呼び出しの順番が変わった場合、あるいは `someOtherFunction` によって変更された場合、
出力は予期できません。このオブジェクトの変更可能な性質によって、一時的結合が作成されます。
不変のオブジェクトを用いれば、この問題を避けることができます。 :

``` php
use Cake\I18n\FrozenTime;
$time = new FrozenTime('2015-06-15 08:23:45');
$time = $time->modify('+2 hours');

// このメソッドの変更は $time を変更しません。
$this->someOtherFunction($time);

// ここでの出力結果は明らかです。
echo $time->format('Y-m-d H:i:s');
```

不変の日付と時刻は、エンティティー内での偶然的な更新を防ぎ、変更を明示するよう強制したいときに便利です。
不変なオブジェクトを利用することで、ORM が変更を追跡したり、日付や日付と時刻のカラムを正しく保持する
ことが、より簡単になります。 :

``` php
// 記事が保存されるとき、この変更は消去されます。
$article->updated->modify('+1 hour');

// 時刻のオブジェクトを置き換えると、プロパティーが保存されます。
$article->updated = $article->updated->modify('+1 hour');
```

## 地域化されたリクエストデータの受け入れ

日付を操作するテキストの入力を作成するとき、きっと地域化された日時の文字列を受け入れて
パースしたいはずです。 [Parsing Localized Dates](../core-libraries/internationalization-and-localization#parsing-localized-dates) をご覧ください。

## サポートされるタイムゾーン

CakePHP はすべての有効な PHP タイムゾーンをサポートしています。サポートされるタイムゾーンの一覧は、
[このページをご覧ください](https://php.net/manual/ja/timezones.php) 。
