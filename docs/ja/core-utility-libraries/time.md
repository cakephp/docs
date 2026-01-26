# CakeTime

`class` **CakeTime**

`TimeHelper` の機能が `View` の外部で必要な場合、
`CakeTime` クラスを使用してください。 :

``` php
class UsersController extends AppController {

    public $components = array('Auth');

    public function afterLogin() {
        App::uses('CakeTime', 'Utility');
        if (CakeTime::isToday($this->Auth->user('date_of_birth']))) {
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

`method` CakeTime::**timeAgoInWords**($dateString, $options = array())

`method` CakeTime::**toAtom**($dateString, $timezone = NULL)

`method` CakeTime::**toQuarter**($dateString, $range = false)

`method` CakeTime::**toRSS**($dateString, $timezone = NULL)

`method` CakeTime::**toUnix**($dateString, $timezone = NULL)

`method` CakeTime::**toServer**($dateString, $timezone = NULL, $format = 'Y-m-d H:i:s')

`method` CakeTime::**timezone**($timezone = NULL)

`method` CakeTime::**listTimezones**($filter = null, $country = null, $options = array())

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
