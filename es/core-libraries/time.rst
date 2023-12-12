Date & Time
###########

.. php:namespace:: Cake\I18n

.. php:class:: DateTime

Si necesitas funcionalidades de :php:class:`TimeHelper` fuera de ``View``,
utiliza ``DateTime`` class::

    use Cake\I18n\DateTime;

    class UsersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Authentication.Authentication');
        }

        public function afterLogin()
        {
            $identity = $this->Authentication->getIdentity();
            $time = new DateTime($identity->date_of_birth);
            if ($time->isToday()) {
                // Saluda al usuario con un mensaje de Feliz Cumpleanos
                $this->Flash->success(__('Happy birthday to you...'));
            }
        }
    }

Internamente, CakePHP usa `Chronos <https://github.com/cakephp/chronos>`_
para potenciar su utilidad``DateTime``. Todo lo que puedes hacer con ``Chronos`` y
PHP ``DateTime``, lo puedes hacer con ``DateTime`` y ``Date``.

Para obtener más detalles sobre Chronos, consulta `la documentación de la API
<https://api.cakephp.org/chronos/1.0/>`_.

.. start-time

Creación de instancias de DateTime
=====================================

``DateTime`` son objetos inmutables que resultan útiles cuando deseas evitar cambios
accidentales en los datos o cuando quieres evitar problemas de dependencia basados en
el orden.


Hay varias formas de crear instancias de ``DateTime``::

    use Cake\I18n\DateTime;

    // Crea a partir de una cadena de fecha y hora.
    $time = DateTime::createFromFormat(
        'Y-m-d H:i:s',
        '2021-01-31 22:11:30',
        'America/New_York'
    );

    // Crea a partir de una marca de tiempo y establece la zona horaria.
    $time = DateTime::createFromTimestamp(1612149090, 'America/New_York');

    // Obtiene la hora actual.
    $time = DateTime::now();

    // O simplemente usa 'new'
    $time = new DateTime('2021-01-31 22:11:30', 'America/New_York');

    $time = new DateTime('2 hours ago');

El constructor de la clase ``DateTime`` puede tomar cualquier parámetro que pueda tomar la
clase interna ``DateTimeImmutable`` de PHP. Cuando se pasa un número o una cadena numérica,
se interpretará como una marca de tiempo UNIX.

En casos de prueba, puedes simular ``now()`` utilizando ``setTestNow()``::

    // Tiempo fijo
    $time = new DateTime('2021-01-31 22:11:30');
    DateTime::setTestNow($time);

    // Salida '2021-01-31 22:11:30'
    $now = DateTime::now();
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

    // Salida '2021-01-31 22:11:30'
    $now = DateTime::parse('now');
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

Manipulación
=============

Recuerda que una instancia de  ``DateTime`` siempre devuelve una nueva instancia desde los setters
en lugar de modificarse a si misma::

    $time = DateTime::now();

    // Create and reassign a new instance
    $newTime = $time->year(2013)
        ->month(10)
        ->day(31);
    // Outputs '2013-10-31 22:11:30'
    echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');

También puedes utilizar los métodos proporcionados por la clase integrada de PHP ``DateTime``::

    $time = $time->setDate(2013, 10, 31);

Al no reasignar la nueva instancie de ``DateTime`` resultará en el uso de la instancia
original sin modificar::

    $time->year(2013)
        ->month(10)
        ->day(31);
    // Outputs '2021-01-31 22:11:30'
    echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');

Puedes crear otra instancia con fechas modificadas, mediante la resta y la suma de sus componentes::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    $newTime = $time->subDays(5)
        ->addHours(-2)
        ->addMonth(1);
    // Salida '2/26/21, 8:11 PM'
    echo $newTime;

    // Usando cadenas strtotime.
    $newTime = $time->modify('+1 month -5 days -2 hours');
    // Outputs '2/26/21, 8:11 PM'
    echo $newTime;

Puedes obtener los componentes internos de una fecha accediendo a sus propiedades::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    echo $time->year; // 2021
    echo $time->month; // 1
    echo $time->day; // 31
    echo $time->timezoneName; // America/New_York

Formato
==========

.. php:staticmethod:: setJsonEncodeFormat($format)

Este método establece el formato predeterminado utilizado al convertir un objeto a JSON::

    DateTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Para cualquier DateTime inmutable
    Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Para cualquier fecha mutable

    $time = DateTime::parse('2021-01-31 22:11:30');
    echo json_encode($time);   // Salida '2021-01-31 22:11:30'

    Date::setJsonEncodeFormat(static function($time) {
        return $time->format(DATE_ATOM);
    });

.. note::
    Este método debe ser llamado estáticamente.

.. note::
    Ten en cuenta que este no es un formato de cadena de fecha y hora de PHP.
    Necesitas utilizar una cadena de formato de fecha ICU, como se especifica en el
    siguiente recurso:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

.. versionchanged:: 4.1.0
    Se agregó el tipo de parámetro ``callable``.


.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

Una tarea muy común con las instancias de ``Time`` es imprimir fechas formateadas.
CakePHP hace esto muy fácil::

    $time = DateTime::parse('2021-01-31 22:11:30');

    // Imprime una marca de tiempo de fecha y hora localizada. Salida  '1/31/21, 10:11 PM'
    echo $time;

    // Salida '1/31/21, 10:11 PM' para la configuración regional en-US
    echo $time->i18nFormat();

    // Utiliza el formato completo de fecha y hora. Salida 'Sunday, January 31, 2021 at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL);

    // Utiliza el formato completo de fecha pero con formato de hora corta. Salida 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // Salida '2021-Jan-31 22:11:30'
    echo $time->i18nFormat('yyyy-MMM-dd HH:mm:ss');

Es posible especificar el formato deseado para que se muestre la cadena.
Podrías pasar `IntlDateFormatter constants
<https://www.php.net/manual/en/class.intldateformatter.php>`_ compo el primer
argumento de esta función, o pasar una cadena completa de formato de fecha ICU,
como se especifica en el siguiente recurso:
https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

También puedes formatear fechas con calendarios no gregorianos::

    //En la versión 66.1 de ICU"
    $time = DateTime::create(2021, 1, 31, 22, 11, 30);

    // Salida 'Sunday, Bahman 12, 1399 AP at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

    // Salida 'Sunday, January 31, 3 Reiwa at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-JP@calendar=japanese');

    // Salida 'Sunday, Twelfth Month 19, 2020(geng-zi) at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-CN@calendar=chinese');

    // Salida 'Sunday, Jumada II 18, 1442 AH at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-SA@calendar=islamic');

Se admiten los siguientes tipos de calendarios:

* japonés
* budista
* chino
* persa
* indio
* islámico
* hebreo
* copto
* etíope

.. note::
    Para cadenas constantes, es decir, IntlDateFormatter::FULL, Intl utiliza la biblioteca
    ICU que obtiene sus datos de CLDR (https://cldr.unicode.org/), cuya versión puede
    variar según la instalación de PHP y dar resultados diferentes.

.. php:method:: nice()

Imprimir un formato 'bonito' predefinido::

    $time = DateTime::parse('2021-01-31 22:11:30', new \DateTimeZone('America/New_York'));

    // Salida 'Jan 31, 2021, 10:11 PM' in en-US
    echo $time->nice();

Puedes cambiar la zona horaria en la que se muestra la fecha sin alterar el objeto
``DateTime`` en sí. Esto es útil cuando almacenas fechas en una zona horaria pero deseas
mostrarlas en la zona horaria del usuario::

    // Salida 'Monday, February 1, 2021 at 4:11:30 AM Central European Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

    // Salida 'Monday, February 1, 2021 at 12:11:30 PM Japan Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Asia/Tokyo');

    // La zona horaria no se cambia. Salida 'America/New_York'
    echo $time->timezoneName;

Al dejar el primer parámetro como ``null`` utilizará la cadena de formato predeterminada::

    // Salida '2/1/21, 4:11 AM'
    echo $time->i18nFormat(null, 'Europe/Paris');

Finalmente, es posible utilizar una configuración regional diferente para mostrar una fecha::

    // Salida 'lundi 1 février 2021 à 04:11:30 heure normale d’Europe centrale'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    // Salida '1 févr. 2021 à 04:11'
    echo $time->nice('Europe/Paris', 'fr-FR');

Estableciendo la Configuración Regional y la Cadena de Formato Predeterminada
--------------------------------------------------------------------------------

The default locale in which dates are displayed when using ``nice``
``i18nFormat`` is taken from the directive
`intl.default_locale <https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
You can, however, modify this default at runtime::

    DateTime::setDefaultLocale('es-ES');
    Date::setDefaultLocale('es-ES');

    // Outputs '31 ene. 2021 22:11'
    echo $time->nice();

From now on, datetimes will be displayed in the Spanish preferred format unless
a different locale is specified directly in the formatting method.

Likewise, it is possible to alter the default formatting string to be used for
``i18nFormat``::

    DateTime::setToStringFormat(\IntlDateFormatter::SHORT); // For any DateTime
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // For any Date

    // The same method exists on Date, and DateTime
    DateTime::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);
    // Outputs 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time;

    // The same method exists on Date and DateTime
    DateTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
    // Outputs 'Sunday, January 31, 2021 at 10:11:30 PM'
    echo $time;

It is recommended to always use the constants instead of directly passing a date
format string.

.. note::
    Be aware that this is not a PHP Datetime string format! You need to use a
    ICU date formatting string as specified in the following resource:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Formatting Relative Times
-------------------------

.. php:method:: timeAgoInWords(array $options = [])

Often it is useful to print times relative to the present::

    $time = new DateTime('Jan 31, 2021');
    // On June 12, 2021, this would output '4 months, 1 week, 6 days ago'
    echo $time->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );

The ``end`` option lets you define at which point after which relative times
should be formatted using the ``format`` option. The ``accuracy`` option lets
us control what level of detail should be used for each interval range::

    // Outputs '4 months ago'
    echo $time->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);

By setting ``accuracy`` to a string, you can specify what is the maximum level
of detail you want output::

    $time = new DateTime('+23 hours');
    // Outputs 'in about a day'
    echo $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()

Once created, you can convert ``DateTime`` instances into timestamps or quarter
values::

    $time = new DateTime('2021-01-31');
    echo $time->toQuarter();  // Outputs '1'
    echo $time->toUnixString();  // Outputs '1612069200'

Comparing With the Present
==========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

You can compare a ``DateTime`` instance with the present in a variety of ways::

    $time = new DateTime('+3 days');

    debug($time->isYesterday());
    debug($time->isThisWeek());
    debug($time->isThisMonth());
    debug($time->isThisYear());

Each of the above methods will return ``true``/``false`` based on whether or
not the ``DateTime`` instance matches the present.

Comparing With Intervals
========================

.. php:method:: isWithinNext($interval)

You can see if a ``DateTime`` instance falls within a given range using
``wasWithinLast()`` and ``isWithinNext()``::

    $time = new DateTime('+3 days');

    // Within 2 days. Outputs 'false'
    debug($time->isWithinNext('2 days'));

    // Within 2 next weeks. Outputs 'true'
    debug($time->isWithinNext('2 weeks'));

.. php:method:: wasWithinLast($interval)

You can also compare a ``DateTime`` instance within a range in the past::

    $time = new DateTime('-72 hours');

    // Within past 2 days. Outputs 'false'
    debug($time->wasWithinLast('2 days'));

    // Within past 3 days. Outputs 'true'
    debug($time->wasWithinLast('3 days'));

    // Within past 2 weeks. Outputs 'true'
    debug($time->wasWithinLast('2 weeks'));

.. end-time

Date
====

.. php:class: Date

The immutable ``Date`` class in CakePHP implements a similar API and methods as
:php:class:`Cake\\I18n\\DateTime` does. The main difference between ``DateTime``
and ``Date`` is that ``Date`` does not track time components. As an example::

    use Cake\I18n\Date;

    $date = new Date('2021-01-31');

    $newDate = $date->modify('+2 hours');
    // Outputs '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addHours(36);
    // Outputs '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addDays(10);
    // Outputs '2021-02-10 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');


Attempts to modify the timezone on a ``Date`` instance are also ignored::

    use Cake\I18n\Date;
    $date = new Date('2021-01-31', new \DateTimeZone('America/New_York'));
    $newDate = $date->setTimezone(new \DateTimeZone('Europe/Berlin'));

    // Outputs 'America/New_York'
    echo $newDate->format('e');

.. _mutable-time:

Mutable Dates and Times
=======================

.. php:class:: Time
.. php:class:: Date

CakePHP uses mutable date and time classes that implement the same interface
as their immutable siblings. Immutable objects are useful when you want to prevent
accidental changes to data, or when you want to avoid order based dependency
issues. Take the following code::

    use Cake\I18n\Time;
    $time = new Time('2015-06-15 08:23:45');
    $time->modify('+2 hours');

    // This method also modifies the $time instance
    $this->someOtherFunction($time);

    // Output here is unknown.
    echo $time->format('Y-m-d H:i:s');

If the method call was re-ordered, or if ``someOtherFunction`` changed the
output could be unexpected. The mutability of our object creates temporal
coupling. If we were to use immutable objects, we could avoid this issue::

    use Cake\I18n\DateTime;
    $time = new DateTime('2015-06-15 08:23:45');
    $time = $time->modify('+2 hours');

    // This method's modifications don't change $time
    $this->someOtherFunction($time);

    // Output here is known.
    echo $time->format('Y-m-d H:i:s');

Immutable dates and times are useful in entities as they prevent
accidental modifications, and force changes to be explicit. Using
immutable objects helps the ORM to more easily track changes, and ensure that
date and datetime columns are persisted correctly::

    // This change will be lost when the article is saved.
    $article->updated->modify('+1 hour');

    // By replacing the time object the property will be saved.
    $article->updated = $article->updated->modify('+1 hour');

Accepting Localized Request Data
================================

When creating text inputs that manipulate dates, you'll probably want to accept
and parse localized datetime strings. See the :ref:`parsing-localized-dates`.

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt

Supported Timezones
===================

CakePHP supports all valid PHP timezones. For a list of supported timezones, `see this page <https://php.net/manual/en/timezones.php>`_.
