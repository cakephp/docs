# CakeTime

`class` **CakeTime**

`TimeHelper` の機能が `View` の外部で必要な場合、
`CakeTime` クラスを使用してください。 :

``` php
class UsersController extends AppController
{

    public $components = ['Auth'];

    public function afterLogin()
    {
        if (CakeTime::isToday($this->Auth->user('date_of_birth'))) {
            // 誕生日のお祝いメッセージでユーザーに挨拶
            $this->Session->setFlash(__('Happy birthday you...'));
        }
    }
}
```

::: info Added in version 2.1
`CakeTime` は、 `TimeHelper` を元に作られました。
:::

<!-- start-caketime -->

## フォーマット

`i18nFormat()` や `nice()` など `strftime()` 形式のフォーマットを受け取るメソッドは、
`php81_bc/strftime` ライブラリを通じて `IntlDateFormatter` で日付をフォーマットします。
PHP 本体の `strftime()` が PHP 8.1 で非推奨になったためです。
月や曜日の名前をローカライズするには `intl` エクステンションをインストールしてください。
`intl` がない場合は Symfony のポリフィルが使われますが、ポリフィルは英語にしか対応していません。

::: pieceofcake2
`strftime()` は `IntlDateFormatter` を使う実装に置き換えられました。
ほとんどのフォーマットは同じ結果になりますが、細かいケースで出力が異なることがあるので、
日付のフォーマットをテストしてください。
:::

`method` CakeTime::**convert**($serverTime, $timezone = NULL)

`method` CakeTime::**convertSpecifiers**($format, $time = NULL)

`method` CakeTime::**dayAsSql**($dateString, $field_name, $timezone = NULL)

`method` CakeTime::**daysAsSql**($begin, $end, $fieldName, $timezone = NULL)

`method` CakeTime::**format**($date, $format = NULL, $default = false, $timezone = NULL)

`method` CakeTime::**fromString**($dateString, $timezone = NULL)

`method` CakeTime::**gmt**($dateString = NULL)

`method` CakeTime::**i18nFormat**($date, $format = NULL, $invalid = false, $timezone = NULL)

`method` CakeTime::**nice**($dateString = NULL, $timezone = NULL, $format = null)

`method` CakeTime::**niceShort**($dateString = NULL, $timezone = NULL)

`method` CakeTime::**serverOffset**()

`method` CakeTime::**timeAgoInWords**($dateString, $options = [])

`method` CakeTime::**toAtom**($dateString, $timezone = NULL)

`method` CakeTime::**toQuarter**($dateString, $range = false)

`method` CakeTime::**toRSS**($dateString, $timezone = NULL)

`method` CakeTime::**toUnix**($dateString, $timezone = NULL)

`method` CakeTime::**toServer**($dateString, $timezone = NULL, $format = 'Y-m-d H:i:s')

`method` CakeTime::**timezone**($timezone = NULL)

`method` CakeTime::**listTimezones**($filter = null, $country = null, $options = [])

## 時間のテスト

`method` CakeTime::**isToday**($dateString, $timezone = NULL)

`method` CakeTime::**isThisWeek**($dateString, $timezone = NULL)

`method` CakeTime::**isThisMonth**($dateString, $timezone = NULL)

`method` CakeTime::**isThisYear**($dateString, $timezone = NULL)

`method` CakeTime::**wasYesterday**($dateString, $timezone = NULL)

`method` CakeTime::**isTomorrow**($dateString, $timezone = NULL)

`method` CakeTime::**isFuture**($dateString, $timezone = NULL)

`method` CakeTime::**isPast**($dateString, $timezone = NULL)

`method` CakeTime::**wasWithinLast**($timeInterval, $dateString, $timezone = NULL)

<!-- end-caketime -->
