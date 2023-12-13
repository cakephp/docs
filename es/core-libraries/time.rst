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

La configuración regional predeterminada en la que se muestran las fechas al utilizar ``nice``
``i18nFormat`` se toma de la directiva
`intl.default_locale <https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
Sin embargo, puedes modificar este valor predeterminado en tiempo de ejecución::

    DateTime::setDefaultLocale('es-ES');
    Date::setDefaultLocale('es-ES');

    // Salida '31 ene. 2021 22:11'
    echo $time->nice();

A partir de ahora, las fechas y horas se mostrarán en el formato preferido en español,
a menos que se especifique una configuración regional diferente directamente en el
método de formato.

De manera similar, es posible modificar la cadena de formato predeterminada que se
utilizará para ``i18nFormat``::

    DateTime::setToStringFormat(\IntlDateFormatter::SHORT); // Para cualquier DateTime
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // Para cualquier Date

    // El mismo método existe en Date y DateTim
    DateTime::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);
    // Salida 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time;

    // El mismo método existe en Date y DateTime
    DateTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
    // Outputs 'Sunday, January 31, 2021 at 10:11:30 PM'
    echo $time;

Se recomienda siempre utilizar las constantes en lugar de pasar
directamente una cadena de formato de fecha.

.. note::
    Ten en cuenta que este no es un formato de cadena de fecha y hora de PHP. Necesitas
    utilizar una cadena de formato de fecha ICU, como se especifica en el siguiente recurso:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Formato de tiempos relativo
------------------------------

.. php:method:: timeAgoInWords(array $options = [])

A menudo es útil imprimir tiempos en relación con el presente::

    $time = new DateTime('Jan 31, 2021');
    // En June 12, 2021, Esto imprimiría '4 months, 1 week, 6 days ago'
    echo $time->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );

La opción ``end`` te permite definir después de cuánto tiempo deben formatearse los
tiempos relativos utilizando la opción ``format``. La opción ``accuracy`` nos permite
controlar qué nivel de detalle se debe utilizar para cada intervalo::

    // Salida '4 months ago'
    echo $time->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);

Al establecer ``accuracy`` en una cadena, puedes especificar cuál es el nivel máximo de
detalle que deseas en la salida::

    $time = new DateTime('+23 hours');
    // Salida 'en aproximadamente un día77'
    echo $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()

Una vez creadas, puedes convertir las instancias de ``DateTime`` en marcas de tiempo o
valores de trimestre::

    $time = new DateTime('2021-01-31');
    echo $time->toQuarter();  // Salida '1'
    echo $time->toUnixString();  // Salida '1612069200'

Comparando con el presente
============================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

Puedes comparar una instancia de ``DateTime`` con el presente de diversas maneras::

    $time = new DateTime('+3 days');

    debug($time->isYesterday());
    debug($time->isThisWeek());
    debug($time->isThisMonth());
    debug($time->isThisYear());

Cada uno de los métodos anteriores devolverá true/false según si la instancia de
``DateTime`` coincide o no con el presente.

Comparando con intervalos
==========================

.. php:method:: isWithinNext($interval)

Puedes ver si una instancia de ``DateTime`` cae dentro de un rango dado utilizando
``wasWithinLast()`` e ``isWithinNext()``::

    $time = new DateTime('+3 days');

    // Dentro de 2 días. Salida 'false'
    debug($time->isWithinNext('2 days'));

    // Dentro de las próximas 2 semanas. Salida 'true'
    debug($time->isWithinNext('2 weeks'));

.. php:method:: wasWithinLast($interval)

También puedes comparar una instancia de ``DateTime`` dentro de un rango en el pasado::

    $time = new DateTime('-72 hours');

    // Dentro de los últimos 2 días. Salida 'false'
    debug($time->wasWithinLast('2 days'));

    // Dentro de los últimos 3 días. Salida 'true'
    debug($time->wasWithinLast('3 days'));

    // Dentro de las últimas 2 semanas. Salida 'true'
    debug($time->wasWithinLast('2 weeks'));

.. end-time

Date
====

.. php:class: Date

La clase inmutable ``Date`` en CakePHP implementa una API y métodos similares a los
que tiene :php:class:`Cake\\I18n\\DateTime`. La principal diferencia entre ``DateTime``
y ``Date`` es que ``Date`` no realiza un seguimiento de los componentes de tiempo.
Como ejemplo::

    use Cake\I18n\Date;

    $date = new Date('2021-01-31');

    $newDate = $date->modify('+2 hours');
    // Salida '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addHours(36);
    // Salida '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addDays(10);
    // Salida '2021-02-10 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');



Los intentos de modificar la zona horaria en una instancia de ``Date`` también son ignorados::

    use Cake\I18n\Date;
    $date = new Date('2021-01-31', new \DateTimeZone('America/New_York'));
    $newDate = $date->setTimezone(new \DateTimeZone('Europe/Berlin'));

    // Salida 'America/New_York'
    echo $newDate->format('e');

.. _mutable-time:

Fechas y horas mutables"
==========================

.. php:class:: Time
.. php:class:: Date

CakePHP utiliza clases mutables de fecha y hora que implementan la misma interfaz que sus
contrapartes inmutables. Los objetos inmutables son útiles cuando deseas evitar cambios
accidentales en los datos o cuando quieres evitar problemas de dependencia basados en el
orden. Observa el siguiente código::

    use Cake\I18n\Time;
    $time = new Time('2015-06-15 08:23:45');
    $time->modify('+2 hours');

    //  Este método también modifica la instancia $time
    $this->someOtherFunction($time);

    // La salida aquí es desconocida.
    echo $time->format('Y-m-d H:i:s');

Si la llamada al método fuera reordenada o si someOtherFunction cambiara, la salida
podría ser inesperada. La mutabilidad de nuestro objeto crea un acoplamiento temporal.
Si usáramos objetos inmutables, podríamos evitar este problema::

    use Cake\I18n\DateTime;
    $time = new DateTime('2015-06-15 08:23:45');
    $time = $time->modify('+2 hours');

    // Las modificaciones de este método no cambian $time
    $this->someOtherFunction($time);

    // La salida aquí es conocida.
    echo $time->format('Y-m-d H:i:s');

Las fechas y horas inmutables son útiles en entidades, ya que evitan modificaciones
accidentales y obligan a que los cambios sean explícitos. Utilizar objetos inmutables
ayuda al ORM a realizar un seguimiento de los cambios de manera más sencilla y garantiza
que las columnas de fecha y hora se persistan correctamente::

    // Este cambio se perderá cuando el artículo se guarde.
    $article->updated->modify('+1 hour');

    // Al reemplazar el objeto de tiempo, la propiedad se guardará.
    $article->updated = $article->updated->modify('+1 hour');

Aceptando datos de solicitud localizados
==========================================

Al crear entradas de texto que manipulan fechas, probablemente querrás aceptar y analizar
cadenas de fecha y hora localizadas. Consulta la :ref:`parsing-localized-dates`.

.. meta::
    :title lang=en: Time
    :description lang=es: La clase Time te ayuda a dar formato a la hora y a probar la hora.
    :keywords lang=es: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt, zona horaria, tiempo

Zonas horarias admitidas
===========================

CakePHP admite todas las zonas horarias válidas de PHP. Para obtener una lista de zonas horarias admitidas, `consulta esta página <https://php.net/manual/en/timezones.php>`_.
