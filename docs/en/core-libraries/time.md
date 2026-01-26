# Date & Time

`class` Cake\\I18n\\**FrozenTime**

If you need `TimeHelper` functionalities outside of a `View`,
use the `FrozenTime` class:

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
            // Greet user with a happy birthday message
            $this->Flash->success(__('Happy birthday to you...'));
        }
    }
}
```

Under the hood, CakePHP uses [Chronos](https://github.com/cakephp/chronos)
to power its `FrozenTime` utility. Anything you can do with `Chronos` and
`DateTime`, you can do with `FrozenTime` and `FrozenDate`.

For more details on Chronos please see [the API documentation](https://api.cakephp.org/chronos/1.0/).

<!-- start-time -->

## Creating FrozenTime Instances

`FrozenTime` are immutable objects that are useful when you want to prevent
accidental changes to data, or when you want to avoid order based dependency
issues. Refer to `Time` instances for mutable objects.

There are a few ways to create `FrozenTime` instances:

``` php
use Cake\I18n\FrozenTime;

// Create from a string datetime.
$time = FrozenTime::createFromFormat(
    'Y-m-d H:i:s',
    '2021-01-31 22:11:30',
    'America/New_York'
);

// Create from a timestamp and set timezone
$time = FrozenTime::createFromTimestamp(1612149090, 'America/New_York');

// Get the current time.
$time = FrozenTime::now();

// Or just use 'new'
$time = new FrozenTime('2021-01-31 22:11:30', 'America/New_York');

$time = new FrozenTime('2 hours ago');
```

The `FrozenTime` class constructor can take any parameter that the internal `DateTimeImmutable`
PHP class can. When passing a number or numeric string, it will be interpreted
as a UNIX timestamp.

In test cases, you can mock out `now()` using `setTestNow()`:

``` php
// Fixate time.
$time = new FrozenTime('2021-01-31 22:11:30');
FrozenTime::setTestNow($time);

// Outputs '2021-01-31 22:11:30'
$now = FrozenTime::now();
echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

// Outputs '2021-01-31 22:11:30'
$now = FrozenTime::parse('now');
echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

## Manipulation

Remember, `FrozenTime` instance always return a new instance from setters
instead of modifying itself:

``` php
$time = FrozenTime::now();

// Create and reassign a new instance
$newTime = $time->year(2013)
    ->month(10)
    ->day(31);
// Outputs '2013-10-31 22:11:30'
echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

You can also use the methods provided by PHP's built-in `DateTime` class:

``` php
$time = $time->setDate(2013, 10, 31);
```

Failing to reassign the new `FrozenTime` instances will result in the
original, unmodified instance being used:

``` php
$time->year(2013)
    ->month(10)
    ->day(31);
// Outputs '2021-01-31 22:11:30'
echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

You can create another instance with modified dates, through subtraction and
addition of their components:

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

You can get the internal components of a date by accessing its properties:

``` php
$time = FrozenTime::create(2021, 1, 31, 22, 11, 30);
echo $time->year; // 2021
echo $time->month; // 1
echo $time->day; // 31
echo $time->timezoneName; // America/New_York
```

## Formatting

`static` Cake\\I18n\\FrozenTime::**setJsonEncodeFormat**($format)

This method sets the default format used when converting an object to json:

``` php
Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any mutable DateTime
FrozenTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any immutable DateTime
Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any mutable Date
FrozenDate::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any immutable Date

$time = FrozenTime::parse('2021-01-31 22:11:30');
echo json_encode($time);   // Outputs '2021-01-31 22:11:30'

// Added in 4.1.0
FrozenDate::setJsonEncodeFormat(static function($time) {
    return $time->format(DATE_ATOM);
});
```

> [!NOTE]
> This method must be called statically.

> [!NOTE]
> Be aware that this is not a PHP Datetime string format! You need to use a
> ICU date formatting string as specified in the following resource:
> <https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax>.

::: info Changed in version 4.1.0
The `callable` parameter type was added.
:::

`method` Cake\\I18n\\FrozenTime::**i18nFormat**($format = null, $timezone = null, $locale = null)

A very common thing to do with `Time` instances is to print out formatted
dates. CakePHP makes this a snap:

``` php
$time = FrozenTime::parse('2021-01-31 22:11:30');

// Prints a localized datetime stamp. Outputs '1/31/21, 10:11 PM'
echo $time;

// Outputs '1/31/21, 10:11 PM' for the en-US locale
echo $time->i18nFormat();

// Use the full date and time format. Outputs 'Sunday, January 31, 2021 at 10:11:30 PM Eastern Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL);

// Use full date but short time format. Outputs 'Sunday, January 31, 2021 at 10:11 PM'
echo $time->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

// Outputs '2021-Jan-31 22:11:30'
echo $time->i18nFormat('yyyy-MMM-dd HH:mm:ss');
```

It is possible to specify the desired format for the string to be displayed.
You can either pass [IntlDateFormatter constants](https://www.php.net/manual/en/class.intldateformatter.php) as the first
argument of this function, or pass a full ICU date formatting string as
specified in the following resource:
<https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax>.

You can also format dates with non-gregorian calendars:

``` php
// On ICU version 66.1
$time = FrozenTime::create(2021, 1, 31, 22, 11, 30);

// Outputs 'Sunday, Bahman 12, 1399 AP at 10:11:30 PM Eastern Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

// Outputs 'Sunday, January 31, 3 Reiwa at 10:11:30 PM Eastern Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-JP@calendar=japanese');

// Outputs 'Sunday, Twelfth Month 19, 2020(geng-zi) at 10:11:30 PM Eastern Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-CN@calendar=chinese');

// Outputs 'Sunday, Jumada II 18, 1442 AH at 10:11:30 PM Eastern Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-SA@calendar=islamic');
```

The following calendar types are supported:

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
> For constant strings i.e. IntlDateFormatter::FULL Intl uses ICU library
> that feeds its data from CLDR (<https://cldr.unicode.org/>) which version
> may vary depending on PHP installation and give different results.

`method` Cake\\I18n\\FrozenTime::**nice**()

Print out a predefined 'nice' format:

``` php
$time = FrozenTime::parse('2021-01-31 22:11:30', new \DateTimeZone('America/New_York'));

// Outputs 'Jan 31, 2021, 10:11 PM' in en-US
echo $time->nice();
```

You can alter the timezone in which the date is displayed without altering the
`FrozenTime` or `Time` object itself. This is useful when you store dates in one timezone, but
want to display them in a user's own timezone:

``` php
// Outputs 'Monday, February 1, 2021 at 4:11:30 AM Central European Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

// Outputs 'Monday, February 1, 2021 at 12:11:30 PM Japan Standard Time'
echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Asia/Tokyo');

// Timezone is unchanged. Outputs 'America/New_York'
echo $time->timezoneName;
```

Leaving the first parameter as `null` will use the default formatting string:

``` php
// Outputs '2/1/21, 4:11 AM'
echo $time->i18nFormat(null, 'Europe/Paris');
```

Finally, it is possible to use a different locale for displaying a date:

``` php
// Outputs 'lundi 1 février 2021 à 04:11:30 heure normale d’Europe centrale'
echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

// Outputs '1 févr. 2021 à 04:11'
echo $time->nice('Europe/Paris', 'fr-FR');
```

### Setting the Default Locale and Format String

The default locale in which dates are displayed when using `nice`
`i18nFormat` is taken from the directive
[intl.default_locale](https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale).
You can, however, modify this default at runtime:

``` php
Time::setDefaultLocale('es-ES'); // For any mutable DateTime
FrozenTime::setDefaultLocale('es-ES'); // For any immutable DateTime
Date::setDefaultLocale('es-ES'); // For any mutable Date
FrozenDate::setDefaultLocale('es-ES'); // For any immutable Date

// Outputs '31 ene. 2021 22:11'
echo $time->nice();
```

From now on, datetimes will be displayed in the Spanish preferred format unless
a different locale is specified directly in the formatting method.

Likewise, it is possible to alter the default formatting string to be used for
`i18nFormat`:

``` php
Time::setToStringFormat(\IntlDateFormatter::SHORT); // For any mutable DateTime
FrozenTime::setToStringFormat(\IntlDateFormatter::SHORT); // For any immutable DateTime
Date::setToStringFormat(\IntlDateFormatter::SHORT); // For any mutable Date
FrozenDate::setToStringFormat(\IntlDateFormatter::SHORT); // For any immutable Date

// The same method exists on Date, FrozenDate, and Time
FrozenTime::setToStringFormat([
    \IntlDateFormatter::FULL,
    \IntlDateFormatter::SHORT
]);
// Outputs 'Sunday, January 31, 2021 at 10:11 PM'
echo $time;

// The same method exists on Date, FrozenDate, and Time
FrozenTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
// Outputs 'Sunday, January 31, 2021 at 10:11:30 PM'
echo $time;
```

It is recommended to always use the constants instead of directly passing a date
format string.

> [!NOTE]
> Be aware that this is not a PHP Datetime string format! You need to use a
> ICU date formatting string as specified in the following resource:
> <https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax>.

### Formatting Relative Times

`method` Cake\\I18n\\FrozenTime::**timeAgoInWords**(array $options = [])

Often it is useful to print times relative to the present:

``` php
$time = new FrozenTime('Jan 31, 2021');
// On June 12, 2021, this would output '4 months, 1 week, 6 days ago'
echo $time->timeAgoInWords(
    ['format' => 'MMM d, YYY', 'end' => '+1 year']
);
```

The `end` option lets you define at which point after which relative times
should be formatted using the `format` option. The `accuracy` option lets
us control what level of detail should be used for each interval range:

``` php
// Outputs '4 months ago'
echo $time->timeAgoInWords([
    'accuracy' => ['month' => 'month'],
    'end' => '1 year'
]);
```

By setting `accuracy` to a string, you can specify what is the maximum level
of detail you want output:

``` php
$time = new FrozenTime('+23 hours');
// Outputs 'in about a day'
echo $time->timeAgoInWords([
    'accuracy' => 'day'
]);
```

## Conversion

`method` Cake\\I18n\\FrozenTime::**toQuarter**()

Once created, you can convert `FrozenTime` instances into timestamps or quarter
values:

``` php
$time = new FrozenTime('2021-01-31');
echo $time->toQuarter();  // Outputs '1'
echo $time->toUnixString();  // Outputs '1612069200'
```

## Comparing With the Present

`method` Cake\\I18n\\FrozenTime::**isYesterday**()

`method` Cake\\I18n\\FrozenTime::**isThisWeek**()

`method` Cake\\I18n\\FrozenTime::**isThisMonth**()

`method` Cake\\I18n\\FrozenTime::**isThisYear**()

You can compare a `FrozenTime` instance with the present in a variety of ways:

``` php
$time = new FrozenTime('+3 days');

debug($time->isYesterday());
debug($time->isThisWeek());
debug($time->isThisMonth());
debug($time->isThisYear());
```

Each of the above methods will return `true`/`false` based on whether or
not the `FrozenTime` instance matches the present.

## Comparing With Intervals

`method` Cake\\I18n\\FrozenTime::**isWithinNext**($interval)

You can see if a `FrozenTime` instance falls within a given range using
`wasWithinLast()` and `isWithinNext()`:

``` php
$time = new FrozenTime('+3 days');

// Within 2 days. Outputs 'false'
debug($time->isWithinNext('2 days'));

// Within 2 next weeks. Outputs 'true'
debug($time->isWithinNext('2 weeks'));
```

`method` Cake\\I18n\\FrozenTime::**wasWithinLast**($interval)

You can also compare a `FrozenTime` instance within a range in the past:

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

The immutable `FrozenDate` class in CakePHP implements the same API and methods as
`Cake\I18n\FrozenTime` does. The main difference between `FrozenTime` and
`FrozenDate` is that `FrozenDate` does not track time components.
As an example:

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

Attempts to modify the timezone on a `FrozenDate` instance are also ignored:

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

CakePHP uses mutable date and time classes that implement the same interface
as their immutable siblings. Immutable objects are useful when you want to prevent
accidental changes to data, or when you want to avoid order based dependency
issues. Take the following code:

``` php
use Cake\I18n\Time;
$time = new Time('2015-06-15 08:23:45');
$time->modify('+2 hours');

// This method also modifies the $time instance
$this->someOtherFunction($time);

// Output here is unknown.
echo $time->format('Y-m-d H:i:s');
```

If the method call was re-ordered, or if `someOtherFunction` changed the
output could be unexpected. The mutability of our object creates temporal
coupling. If we were to use immutable objects, we could avoid this issue:

``` php
use Cake\I18n\FrozenTime;
$time = new FrozenTime('2015-06-15 08:23:45');
$time = $time->modify('+2 hours');

// This method's modifications don't change $time
$this->someOtherFunction($time);

// Output here is known.
echo $time->format('Y-m-d H:i:s');
```

Immutable dates and times are useful in entities as they prevent
accidental modifications, and force changes to be explicit. Using
immutable objects helps the ORM to more easily track changes, and ensure that
date and datetime columns are persisted correctly:

``` php
// This change will be lost when the article is saved.
$article->updated->modify('+1 hour');

// By replacing the time object the property will be saved.
$article->updated = $article->updated->modify('+1 hour');
```

## Accepting Localized Request Data

When creating text inputs that manipulate dates, you'll probably want to accept
and parse localized datetime strings. See the [Parsing Localized Dates](../core-libraries/internationalization-and-localization#parsing-localized-dates).

## Supported Timezones

CakePHP supports all valid PHP timezones. For a list of supported timezones, [see this page](http://php.net/manual/en/timezones.php).
