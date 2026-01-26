# Date & Time

`class` Cake\\I18n\\**Time**

If you need `TimeHelper` functionalities outside of a `View`,
use the `Time` class:

``` php
use Cake\I18n\Time;

class UsersController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth');
    }

    public function afterLogin()
    {
        $time = new Time($this->Auth->user('date_of_birth'));
        if ($time->isToday()) {
            // Greet user with a happy birthday message
            $this->Flash->success(__('Happy birthday to you...'));
        }
    }
}
```

Under the hood, CakePHP uses [Chronos](https://github.com/cakephp/chronos)
to power its `Time` utility. Anything you can do with `Chronos` and
`DateTime`, you can do with `Time` and `Date`.

> [!NOTE]
> Prior to 3.2.0 CakePHP used [Carbon](https://github.com/briannesbitt/Carbon).

For more details on Chronos please see [the API documentation](https://api.cakephp.org/chronos/1.0/).

<!-- start-time -->

## Creating Time Instances

There are a few ways to create `Time` instances:

``` php
use Cake\I18n\Time;

// Create from a string datetime.
$time = Time::createFromFormat(
    'Y-m-d H:i:s',
    $datetime,
    'America/New_York'
);

// Create from a timestamp
$time = Time::createFromTimestamp($ts);

// Get the current time.
$time = Time::now();

// Or just use 'new'
$time = new Time('2014-01-10 11:11', 'America/New_York');

$time = new Time('2 hours ago');
```

The `Time` class constructor can take any parameter that the internal `DateTime`
PHP class can. When passing a number or numeric string, it will be interpreted
as a UNIX timestamp.

In test cases you can mock out `now()` using `setTestNow()`:

``` php
// Fixate time.
$now = new Time('2014-04-12 12:22:30');
Time::setTestNow($now);

// Returns '2014-04-12 12:22:30'
$now = Time::now();

// Returns '2014-04-12 12:22:30'
$now = Time::parse('now');
```

## Manipulation

Once created, you can manipulate `Time` instances using setter methods:

``` php
$now = Time::now();
$now->year(2013)
    ->month(10)
    ->day(31);
```

You can also use the methods provided by PHP's built-in `DateTime` class:

``` php
$now->setDate(2013, 10, 31);
```

Dates can be modified through subtraction and addition of their components:

``` php
$now = Time::now();
$now->subDays(5);
$now->addMonth(1);

// Using strtotime strings.
$now->modify('+5 days');
```

You can get the internal components of a date by accessing its properties:

``` php
$now = Time::now();
echo $now->year; // 2014
echo $now->month; // 5
echo $now->day; // 10
echo $now->timezone; // America/New_York
```

It is also allowed to directly assign those properties to modify the date:

``` text
$time->year = 2015;
$time->timezone = 'Europe/Paris';
```

## Formatting

`static` Cake\\I18n\\Time::**setJsonEncodeFormat**($format)

This method sets the default format used when converting an object to json:

``` php
Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any mutable DateTime
FrozenTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any immutable DateTime
Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any mutable Date
FrozenDate::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any immutable Date

// Added in 3.9.0
FrozenDate::setJsonEncodeFormat(static function($time) {
    return $time->format(DATE_ATOM);
});
```

> [!NOTE]
> This method must be called statically.

::: info Changed in version 3.9.0
The `callable` parameter type was added.
:::

`method` Cake\\I18n\\Time::**i18nFormat**($format = null, $timezone = null, $locale = null)

A very common thing to do with `Time` instances is to print out formatted
dates. CakePHP makes this a snap:

``` php
$now = Time::parse('2014-10-31');

// Prints a localized datetime stamp.
echo $now;

// Outputs '10/31/14, 12:00 AM' for the en-US locale
$now->i18nFormat();

// Use the full date and time format
$now->i18nFormat(\IntlDateFormatter::FULL);

// Use full date but short time format
$now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

// Outputs '2014-10-31 00:00:00'
$now->i18nFormat('yyyy-MM-dd HH:mm:ss');
```

It is possible to specify the desired format for the string to be displayed.
You can either pass [IntlDateFormatter constants](https://www.php.net/manual/en/class.intldateformatter.php) as the first
argument of this function, or pass a full ICU date formatting string as
specified in the following resource:
<https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax>.

You can also format dates with non-gregorian calendars:

``` php
// Outputs 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
$result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');
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

::: info Added in version 3.1
Non-gregorian calendar support was added in 3.1
:::

> [!NOTE]
> For constant strings i.e. IntlDateFormatter::FULL Intl uses ICU library
> that feeds its data from CLDR (<https://cldr.unicode.org/>) which version
> may vary depending on PHP installation and give different results.

`method` Cake\\I18n\\Time::**nice**()

Print out a predefined 'nice' format:

``` php
$now = Time::parse('2014-10-31');

// Outputs 'Oct 31, 2014 12:00 AM' in en-US
echo $now->nice();
```

You can alter the timezone in which the date is displayed without altering the
`Time` object itself. This is useful when you store dates in one timezone, but
want to display them in a user's own timezone:

``` php
$now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');
```

Leaving the first parameter as `null` will use the default formatting string:

``` php
$now->i18nFormat(null, 'Europe/Paris');
```

Finally, it is possible to use a different locale for displaying a date:

``` php
echo $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

echo $now->nice('Europe/Paris', 'fr-FR');
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

// The same method exists on Date, FrozenDate and FrozenTime
Time::setToStringFormat([
    \IntlDateFormatter::FULL,
    \IntlDateFormatter::SHORT
]);

// The same method exists on Date, FrozenDate and FrozenTime
Time::setToStringFormat('yyyy-MM-dd HH:mm:ss');
```

It is recommended to always use the constants instead of directly passing a date
format string.

### Formatting Relative Times

`method` Cake\\I18n\\Time::**timeAgoInWords**(array $options = [])

Often it is useful to print times relative to the present:

``` php
$now = new Time('Aug 22, 2011');
echo $now->timeAgoInWords(
    ['format' => 'MMM d, YYY', 'end' => '+1 year']
);
// On Nov 10th, 2011 this would display: 2 months, 2 weeks, 6 days ago
```

The `end` option lets you define at which point after which relative times
should be formatted using the `format` option. The `accuracy` option lets
us control what level of detail should be used for each interval range:

``` php
// If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
echo $timestamp->timeAgoInWords([
    'accuracy' => ['month' => 'month'],
    'end' => '1 year'
]);
// Outputs '1 month ago'
```

By setting `accuracy` to a string, you can specify what is the maximum level
of detail you want output:

``` php
$time = new Time('+23 hours');
// Outputs 'in about a day'
$result = $time->timeAgoInWords([
    'accuracy' => 'day'
]);
```

## Conversion

`method` Cake\\I18n\\Time::**toQuarter**()

Once created, you can convert `Time` instances into timestamps or quarter
values:

``` php
$time = new Time('2014-06-15');
$time->toQuarter();
$time->toUnixString();
```

## Comparing With the Present

`method` Cake\\I18n\\Time::**isYesterday**()

`method` Cake\\I18n\\Time::**isThisWeek**()

`method` Cake\\I18n\\Time::**isThisMonth**()

`method` Cake\\I18n\\Time::**isThisYear**()

You can compare a `Time` instance with the present in a variety of ways:

``` php
$time = new Time('2014-06-15');

echo $time->isYesterday();
echo $time->isThisWeek();
echo $time->isThisMonth();
echo $time->isThisYear();
```

Each of the above methods will return `true`/`false` based on whether or
not the `Time` instance matches the present.

## Comparing With Intervals

`method` Cake\\I18n\\Time::**isWithinNext**($interval)

You can see if a `Time` instance falls within a given range using
`wasWithinLast()` and `isWithinNext()`:

``` php
$time = new Time('2014-06-15');

// Within 2 days.
echo $time->isWithinNext(2);

// Within 2 next weeks.
echo $time->isWithinNext('2 weeks');
```

`method` Cake\\I18n\\Time::**wasWithinLast**($interval)

You can also compare a `Time` instance within a range in the past:

``` php
// Within past 2 days.
echo $time->wasWithinLast(2);

// Within past 2 weeks.
echo $time->wasWithinLast('2 weeks');
```

<!-- end-time -->

## Dates

::: info Added in version 3.2
:::

The `Date` class in CakePHP implements the same API and methods as
`Cake\I18n\Time` does. The main difference between `Time` and
`Date` is that `Date` does not track time components, and is always in UTC.
As an example:

``` php
use Cake\I18n\Date;
$date = new Date('2015-06-15');

$date->modify('+2 hours');
// Outputs 2015-06-15 00:00:00
echo $date->format('Y-m-d H:i:s');

$date->modify('+36 hours');
// Outputs 2015-06-15 00:00:00
echo $date->format('Y-m-d H:i:s');
```

Attempts to modify the timezone on a `Date` instance are also ignored:

``` php
use Cake\I18n\Date;
$date = new Date('2015-06-15');
$date->setTimezone(new \DateTimeZone('America/New_York'));

// Outputs UTC
echo $date->format('e');
```

<a id="immutable-time"></a>

## Immutable Dates and Times

`class` Cake\\I18n\\**FrozenTime**

`class` Cake\\I18n\\**FrozenDate**

CakePHP offers immutable date and time classes that implement the same interface
as their mutable siblings. Immutable objects are useful when you want to prevent
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
