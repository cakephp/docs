# CakeNumber

`class` **CakeNumber**

If you need `NumberHelper` functionalities outside of a `View`,
use the `CakeNumber` class:

``` php
class UsersController extends AppController {

    public $components = array('Auth');

    public function afterLogin() {
        App::uses('CakeNumber', 'Utility');
        $storageUsed = $this->Auth->user('storage_used');
        if ($storageUsed > 5000000) {
            // notify users of quota
            $this->Session->setFlash(__('You are using %s storage', CakeNumber::toReadableSize($storageUsed)));
        }
    }
}
```

::: info Added in version 2.1
`CakeNumber` has been factored out from `NumberHelper`.
:::

<!-- start-cakenumber -->

All of these functions return the formatted number; They do not
automatically echo the output into the view.

`method` CakeNumber::**currency**(float $number, string $currency = 'USD', array $options = array())

`method` CakeNumber::**defaultCurrency**(string $currency)

`method` CakeNumber::**addFormat**(string $formatName, array $options)

`method` CakeNumber::**precision**(mixed $number, int $precision = 3)

`method` CakeNumber::**toPercentage**(mixed $number, int $precision = 2, array $options = array())

`method` CakeNumber::**fromReadableSize**(string $size, $default)

`method` CakeNumber::**toReadableSize**(string $dataSize)

`method` CakeNumber::**format**(mixed $number, mixed $options=false)

`method` CakeNumber::**formatDelta**(mixed $number, mixed $options=array())

<!-- end-cakenumber -->
