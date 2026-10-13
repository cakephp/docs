# CakeNumber

`class` **CakeNumber**

`NumberHelper` の機能を `View` の外で必要な場合、
`CakeNumber` クラスを使用してください。 :

``` php
class UsersController extends AppController
{

    public $components = ['Auth'];

    public function afterLogin()
    {
        $storageUsed = $this->Auth->user('storage_used');
        if ($storageUsed > 5000000) {
            // ユーザーの使用量の通知
            $this->Session->setFlash(__('You are using %s storage', CakeNumber::toReadableSize($storageUsed)));
        }
    }
}
```

::: info Added in version 2.1
`CakeNumber` は、 `NumberHelper` を元に作られました。
:::

<!-- start-cakenumber -->

以下の全ての関数は、整形された数値を返します。
これらは自動的にビューに出力を表示しません。

`method` CakeNumber::**currency**(float $number, string $currency = 'USD', array $options = [])

`method` CakeNumber::**defaultCurrency**(string $currency)

`method` CakeNumber::**addFormat**(string $formatName, array $options)

`method` CakeNumber::**precision**(mixed $number, int $precision = 3)

`method` CakeNumber::**toPercentage**(mixed $number, int $precision = 2, array $options = [])

`method` CakeNumber::**fromReadableSize**(string $size, $default)

`method` CakeNumber::**toReadableSize**(string $dataSize)

`method` CakeNumber::**format**(mixed $number, mixed $options=false)

`method` CakeNumber::**formatDelta**(mixed $number, mixed $options=[])

<!-- end-cakenumber -->
