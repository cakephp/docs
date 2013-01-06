Tiempo
######

El ayudante de tiempo (Time Helper), como su nombre lo indica, te ayuda
a ahorrar tiempo. Permite que se haga un procesamiento rápido de la
información relacionada con el tiempo. Este ayudante tiene dos tareas
principales que puede realizar

#. ¡Puede dar formato a textos de tiempo
#. Puede probar el tiempo (pero no pude doblarlo, lo sentimos).

Formatting
==========

``fromString( $date_string )``

**fromString** toma una cadena de texto y la convierte en un objeto de
tiempo. Si la cadena suministrada es un número, la convertirá a un
entero, siendo este el número de segundos que han transcurrido desde el
Epoch de Unix (1 de Enero 1970 00:00:00 GMT). Pasarle un texto
"20081231" creará un resultado indeseado ya que tratará de convertirlo a
segundos, lo que resultará en este caso "Vier, Ago 21 1970, 06:07"

``toQuarter( $date_string, $range = false )``

**toQuarter**\ devolverá 1, 2, 3 o 4 dependiendo de en qué trimestre del
año la fecha se encuantra. Si el $range es true, devolverá un arreglo
con dos elementos con las fechas de inicio y fin en el formato
"2008-03-31"

``toUnix( $date_string )``

**toUnix** es un sinónimo para fromString.

``toAtom( $date_string )``

**toAtom** devuelve una texto de tiempo en el formato Atom
"2008-01-12T00:00:00Z"

``toRSS( $date_string )``

**toRSS** devuelve un texto de tiempo en el formato RSS "Sat, 12 Jan
2008 00:00:00 -0500"

``nice( $date_string = null )``

**nice** toma una texto de tiempo y lo devuelve en el formato "Tue, Jan
1st 2008, 19:25".

``niceShort( $date_string = null )``

**niceShort** toma un texto de tiempo y lo devuelve en el formato "Jan
1st 2008, 19:25". Si la fecha es el día actual el formato será "Hoy,
19:25". Si la fecha ayer, devolverá en el formato "Ayer, 19:25".

``daysAsSql( $begin, $end, $field_name )``

**daysAsSql** devuelve una cadena de texto en el formato "($campo >=
'2008-01-21 00:00:00') AND ($campo <= '2008-01-25 23:59:59')".

``dayAsSql( $date_string,  $field_name )``

**dayAsSql** crea una cadena de texto en el mismo formato que daysAsSql,
pero solo necesita un único objeto de tiempo

``timeAgoInWords( $date_string, $options = array(), $backwards = null )``

**timeAgoInWords** toma una cadena de texto que representa uan fecha y
lo convierte a un formato amigable como "Hace 3 semanas, 3 días".
Pasarle true en $backwards hará que se declare el tiempo en el futuro,
lo que devolverá el formato "el 31/12/08".

+----------+----------------------------------------------------------------------------------------------------------------------------------+
| Opción   | Descripción                                                                                                                      |
+==========+==================================================================================================================================+
| format   | un formato de fechas; por defecto "on 31/12/08"                                                                                  |
+----------+----------------------------------------------------------------------------------------------------------------------------------+
| end      | determina el el punto de corte en el que no uará más palabras y usará el formato de fechas en su lugar, por defecto "+1 month"   |
+----------+----------------------------------------------------------------------------------------------------------------------------------+

``relativeTime( $date_string, $format = 'j/n/y' )``

**relativeTime** es un básicamente un sinónimo para timeAgoInWords.

``gmt( $date_string = null )``

**gmt** devolverá la fecha como un entero fijado al tiempo medio de
Greenwich (GMT).

``format( $format = 'd-m-Y', $date_string)``

**format** es un sinónimo para la función date de php.

+------------------+---------------------------------------------------------------------------+
| Función          | Formato                                                                   |
+==================+===========================================================================+
| nice             | Mar, Enero 1 2008, 19:25                                                  |
+------------------+---------------------------------------------------------------------------+
| niceShort        | Enero 1 2008, 19:25                                                       |
|                  |  Hoy, 19:25                                                               |
|                  |  Ayer, 19:25                                                              |
+------------------+---------------------------------------------------------------------------+
| daysAsSql        | ($campo >= '2008-01-21 00:00:00') AND ($campo <= '2008-01-25 23:59:59')   |
+------------------+---------------------------------------------------------------------------+
| dayAsSql         | ($campo >= '2008-01-21 00:00:00') AND ($campo <= '2008-01-21 23:59:59')   |
+------------------+---------------------------------------------------------------------------+
| timeAgoInWords   | el 21/01/08                                                               |
|  relativeTime    |  Hace 3 mese, 3 semanas, 2 días                                           |
|                  |  Hace 7 minutos                                                           |
|                  |  Hace 2 segundos                                                          |
+------------------+---------------------------------------------------------------------------+
| gmt              | 1200787200                                                                |
+------------------+---------------------------------------------------------------------------+

Testing Time
============

-  ``isToday`` (es Hoy)
-  ``isThisWeek`` (es esta Semana)
-  ``isThisMonth`` (es este MEs)
-  ``isThisYear`` (es este Año)
-  ``wasYesterday`` (fue Ayer)
-  ``isTomorrow`` (es Mañana)
-  ``wasWithinLast`` (sucedió dentro del rango de tiempo)

Todas las funciones anteriores devuelve true o false al pasarle una
cadena de texto que represente una fecha. ``wasWithinLast`` toma el
parámetro adicional ``$time_interval`` (intervalo de tiempo):

``$time->wasWithinLast( $time_interval, $date_string )``

``wasWithinLast`` toma un intervalo de tiempo que es un texto en el
formato "3 months" y acepta un intervalo de tiempo en segundos, minutos,
horas, días, semanas, meses, años. Si un intervalo de tiempo no es
reconocido (por ejemplo se tipeó erróneamente), se usará por defecto
días
