Clase Number
############

.. php:namespace:: Cake\I18n

.. php:class:: Number

Si necesitas las funcionalidades de :php:class:`NumberHelper` fuera de una vista, utiliza la clase ``Number``::

    namespace App\Controller;

    use Cake\I18n\Number;

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
            $storageUsed = $identity->storage_used;
            if ($storageUsed > 5000000) {
                // Notificar a los usuarios de su cuota
                $this->Flash->success(__('Estás usando {0} de almacenamiento', Number::toReadableSize($storageUsed)));
            }
        }
    }

.. start-cakenumber

Todas estas funciones devuelven el número formateado; no imprimen automáticamente la salida en la vista.

Formato de Valores Monetarios
=============================

.. php:method:: currency(mixed $value, string $currency = null, array $options = [])

Este método se utiliza para mostrar un número en formatos de moneda comunes (EUR, GBP, USD), basándose en el código de moneda de tres letras ISO 4217. Su uso en una vista se ve así::

    // Llamado como NumberHelper
    echo $this->Number->currency($value, $currency);

    // Llamado como Number
    echo Number::currency($value, $currency);

El primer parámetro, ``$value``, debería ser un número de punto flotante que representa la cantidad de dinero que estás expresando. El segundo parámetro es una cadena utilizada para elegir un esquema de formato de moneda predefinido:

+---------------------+----------------------------------------------------+
| $currency           | 1234,56, formateado por tipo de moneda             |
+=====================+====================================================+
| EUR                 | €1.234,56                                          |
+---------------------+----------------------------------------------------+
| GBP                 | £1.234,56                                          |
+---------------------+----------------------------------------------------+
| USD                 | $1.234,56                                          |
+---------------------+----------------------------------------------------+

El tercer parámetro es un arreglo de opciones para definir aún más la salida. Las siguientes opciones están disponibles:

+---------------------+----------------------------------------------------+
| Opción              | Descripción                                        |
+=====================+====================================================+
| before              | Texto para mostrar antes del número formateado.    |
+---------------------+----------------------------------------------------+
| after               | Texto para mostrar después del número formateado.  |
+---------------------+----------------------------------------------------+
| zero                | El texto a usar para los valores cero; puede ser   |
|                     | una cadena o un número, por ejemplo, 0, '¡Gratis!'.|
+---------------------+----------------------------------------------------+
| places              | Número de lugares decimales a usar, por ejemplo, 2 |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de lugares decimales a usar,         |
|                     | por ejemplo, 2.                                    |
+---------------------+----------------------------------------------------+
| locale              | El nombre de la localidad a usar para formatear    |
|                     | el número, por ejemplo, "es_ES".                   |
+---------------------+----------------------------------------------------+
| fractionSymbol      | Cadena a usar para números fraccionarios, por      |
|                     | ejemplo, 'centavos'.                               |
+---------------------+----------------------------------------------------+
| fractionPosition    | Ya sea 'antes' o 'después' para colocar el símbolo |
|                     | fraccionario.                                      |
+---------------------+----------------------------------------------------+
| pattern             | Un patrón de número ICU para usar para formatear el|
|                     | número, por ejemplo, #,###.00.                     |
+---------------------+----------------------------------------------------+
| useIntlCode         | Establecer en ``true`` para reemplazar el símbolo  |
|                     | de moneda con el código de moneda internacional.   |
+---------------------+----------------------------------------------------+

Si el valor de ``$currency`` es ``null``, la moneda predeterminada se recuperará de
:php:meth:`Cake\\I18n\\Number::defaultCurrency()`. Para formatear monedas en un
formato de contabilidad, debes establecer el formato de la moneda::

    Number::setDefaultCurrencyFormat(Number::FORMAT_CURRENCY_ACCOUNTING);

Configurar la Moneda Predeterminada
===================================

.. php:method:: setDefaultCurrency($currency)

Configura la moneda predeterminada. Esto evita la necesidad de pasar siempre la
moneda a :php:meth:`Cake\\I18n\\Number::currency()` y cambiar todas las
salidas de moneda configurando otro valor predeterminado. Si ``$currency`` se establece en ``null``,
se eliminará el valor almacenado actualmente.

Obtener la Moneda Predeterminada
================================

.. php:method:: getDefaultCurrency()

Obtén la moneda predeterminada. Si la moneda predeterminada se configuró anteriormente utilizando
``setDefaultCurrency()``, se devolverá ese valor. De forma predeterminada, recuperará el valor de la ini de ``intl.default_locale`` si está configurado y ``'en_US'`` si no lo está.

Formato de Números de Punto Flotante
====================================

.. php:method:: precision(float $value, int $precision = 3, array $options = [])

Este método muestra un número con la cantidad especificada de precisión (lugares decimales). Se redondeará para mantener el
nivel de precisión definido. ::

    // Llamado como NumberHelper
    echo $this->Number->precision(456.91873645, 2);

    // Salida
    456.92

    // Llamado como Number
    echo Number::precision(456.91873645, 2);

Formato de Porcentajes
======================

.. php:method:: toPercentage(mixed $value, int $precision = 2, array $options = [])

+---------------------+----------------------------------------------------+
| Opción              | Descripción                                        |
+=====================+====================================================+
| multiply            | Booleano para indicar si el valor debe ser         |
|                     | multiplicado por 100. Útil para porcentajes        |
|                     | decimales.                                         |
+---------------------+----------------------------------------------------+

Al igual que :php:meth:`Cake\\I18n\\Number::precision()`, este método formatea un número
según la precisión proporcionada (donde los números se redondean para cumplir con la
precisión dada). Adicionalmente, también expresa el número como un porcentaje
y agrega un signo de porcentaje a la salida. ::

    // Llamado como NumberHelper. Salida: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // Llamado como Number. Salida: 45.69%
    echo Number::toPercentage(45.691873645);

    // Llamado con multiplicar. Salida: 45.7%
    echo Number::toPercentage(0.45691, 1, [
        'multiply' => true
    ]);

Interactuar con Valores Legibles para Humanos
=============================================

.. php:method:: toReadableSize(string $size)

Este método formatea tamaños de datos en formas legibles para humanos. Proporciona
una forma abreviada de convertir bytes a KB, MB, GB y TB. El tamaño se
muestra con un nivel de precisión de dos dígitos, de acuerdo con el tamaño
de los datos suministrados (es decir, los tamaños más altos se expresan en términos más grandes)::

    // Llamado como NumberHelper
    echo $this->Number->toReadableSize(0); // 0 Byte
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5 GB

    // Llamado como Number
    echo Number::toReadableSize(0); // 0 Byte
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5 GB

Formato de Números
==================

.. php:method:: format(mixed $value, array $options = [])

Este método te brinda mucho más control sobre el formato de
números para usar en tus vistas (y se utiliza como el método principal por
la mayoría de los otros métodos de NumberHelper). Usar este método puede
verse así::

    // Llamado como NumberHelper
    $this->Number->format($value, $options);

    // Llamado como Number
    Number::format($value, $options);

El parámetro ``$value`` es el número que estás planeando
formatear para la salida. Sin opciones proporcionadas, el número
1236.334 se mostraría como 1,236. Ten en cuenta que la precisión predeterminada es
cero decimales.

El parámetro ``$options`` es donde reside la verdadera magia para este método.

-  Si pasas un entero, este se convierte en la cantidad de precisión
   o lugares para la función.
-  Si pasas un arreglo asociado, puedes usar las siguientes claves:

+---------------------+----------------------------------------------------+
| Opción              | Descripción                                        |
+=====================+====================================================+
| places              | Número de lugares decimales a usar, por ejemplo, 2 |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de lugares decimales a usar, por     |
|                     | ejemplo, 2.                                        |
+---------------------+----------------------------------------------------+
| pattern             | Un patrón de número ICU para usar para formatear el|
|                     | número, por ejemplo, #,###.00.                     |
+---------------------+----------------------------------------------------+
| locale              | El nombre de la localidad a usar para formatear el |
|                     | número, por ejemplo, "es_ES".                      |
+---------------------+----------------------------------------------------+
| before              | Texto para mostrar antes del número formateado.    |
+---------------------+----------------------------------------------------+
| after               | Texto para mostrar después del número formateado.  |
+---------------------+----------------------------------------------------+

Ejemplo::

    // Llamado como NumberHelper
    echo $this->Number->format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Salida '¥ 123,456.79 !'

    echo $this->Number->format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Salida '123 456,79 !'

    // Llamado como Number
    echo Number::format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Salida '¥ 123,456.79 !'

    echo Number::format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Salida '123 456,79 !'

.. php:method:: ordinal(mixed $value, array $options = [])

Este método mostrará un número ordinal.

Ejemplos::

    echo Number::ordinal(1);
    // Salida '1st'

    echo Number::ordinal(2);
    // Salida '2nd'

    echo Number::ordinal(2, [
        'locale' => 'fr_FR'
    ]);
    // Salida '2e'

    echo Number::ordinal(410);
    // Salida '410th'

Diferencias en el Formato
=========================

.. php:method:: formatDelta(mixed $value, array $options = [])

Este método muestra diferencias en el valor como un número con signo::

    // Llamado como NumberHelper
    $this->Number->formatDelta($value, $options);

    // Llamado como Number
    Number::formatDelta($value, $options);

El parámetro ``$value`` es el número que estás planeando
formatear para la salida. Sin opciones proporcionadas, el número
1236.334 se mostraría como 1,236. Ten en cuenta que la precisión predeterminada es
cero decimales.

El parámetro ``$options`` toma las mismas claves que :php:meth:`Number::format()` en sí:

+---------------------+----------------------------------------------------+
| Opción              | Descripción                                        |
+=====================+====================================================+
| places              | Número de lugares decimales a usar, por ejemplo, 2 |
+---------------------+----------------------------------------------------+
| precision           | Número máximo de lugares decimales a usar, por     |
|                     | ejemplo, 2.                                        |
+---------------------+----------------------------------------------------+
| locale              | El nombre de la localidad a usar para formatear el |
|                     | número, por ejemplo, "es_ES".                      |
+---------------------+----------------------------------------------------+
| before              | Texto para mostrar antes del número formateado.    |
+---------------------+----------------------------------------------------+
| after               | Texto para mostrar después del número formateado.  |
+---------------------+----------------------------------------------------+

Ejemplo::

    // Llamado como NumberHelper
    echo $this->Number->formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Salida '[+123,456.79]'

    // Llamado como Number
    echo Number::formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // Salida '[+123,456.79]'

.. end-cakenumber

Configurar Formateadores
========================

.. php:method:: config(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

Este método te permite configurar valores predeterminados del formateador que persisten en llamadas
a varios métodos.

Ejemplo::

    Number::config('es_ES', \NumberFormatter::CURRENCY, [
        'pattern' => '#,##,##0'
    ]);


.. meta::
    :title lang=es: Clase Number
    :keywords lang=es: number,currency,number format,number precision,format file size,format numbers
