Time
####

Le Helper Time vous permet, comme il l'indique: gagnez du temps. Il
permet le traitement rapide des informations se rapportant au temps. Le
Helper Time a deux principales tâches qu'il peut accomplir:

#. Il peut formater les chaines de temps.
#. Il peut tester le temps (mais ne peut pas le courber, désolé).

Formatage
=========

``fromString( $date_string )``

**fromString** prend une chaîne de caractères et utilise strtotime pour
la convertir en date. Si la chaîne de caractères passée est un nombre
alors il la convertira en un entier étant le nombre de secondes depuis
l'époque d'UNIX (1:sup:`er` Janvier 1970 à 00:00:00 GMT). Le passage
dans une chaîne de caractères de "31122010" créera un résultat non
désiré étant donné qu'il le convertira en nombre de secondes depuis
l'époque d'UNIX ce qui dans ce cas donnera "Dimanche 27 Décembre 1970 à
06:00:10"

``toQuarter( $date_string, $range = false )``

**toQuarter**\ retournera 1, 2, 3 ou 4 en fonction du trimestre dans
lequel tombe la date passée en paramètre. Si range est mis à 'true', un
tableau de deux éléments sera retourné avec la date de début et de fin
du trimestre au format "AAAA-MM-JJ".

``toUnix( $date_string )``

**toUnix** est un conteneur, un emballage, pour fromString.

``toAtom( $date_string )``

**toAtom** retourne une chaîne de caractères date au format Atom
"2008-01-12T00:00:00Z"

``toRSS( $date_string )``

**toRSS** retourne une chaîne de caractères au format RSS "Sat, 12 Jan
2008 00:00:00 -0500"

``nice( $date_string = null )``

**nice** prend une chaîne de caractères date et la retourne au format
"Tue, Jan 1st 2008, 19:25".

``niceShort( $date_string = null )``

**niceShort** prend une chaîne de caractères date et la retourne au
format "Jan 1st 2008, 19:25". Si l'objet date est aujourd'hui, le format
sera "Today, 19:25". Si l'objet date est hier, le format sera
"Yesterday, 19:25".

``daysAsSql( $begin, $end, $fieldName, $userOffset = NULL )``

**daysAsSql** retourne une chaîne de caractères au format "($field\_name
>= '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25 23:59:59')".
C'est utile si vous avez besoin de chercher les enregistrements entre
deux dates inclusivement.

``dayAsSql( $date_string,  $field_name )``

**dayAsSql** crée une chaîne de caractères au même format que daysAsSql
mais ne nécessite qu'un seul objet date.

``timeAgoInWords( $datetime_string, $options = array(), $backwards = null )``

**timeAgoInWords** prendra une chaîne de caractères datetime (tout ce
qui est interprétable par la fonction PHP strtotime() ou par le format
datetime de MySQL) et la convertira en phrase conviviale tel que "3
weeks, 3 days ago". Mettre $backwards à "true" va spécialement déclarer
que le temps est mis au futur ce qui utilisera le format "on 31/12/08".

+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Option   | Description                                                                                                                                                    |
+==========+================================================================================================================================================================+
| format   | un format de date; par défaut "on 31/12/08"                                                                                                                    |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+
| end      | détermine le point de coupure à partir duquel il n'est plus utile d'employer des mots et où il utilisera le format de date à la place; par défaut "+1 month"   |
+----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------+

``relativeTime( $date_string, $format = 'j/n/y' )``

**relativeTime** est essentiellement un alias pour timeAgoInWords.

``gmt( $date_string = null )``

**gmt** retournera la date comme un entier mis au Greenwich Mean Time
(GMT).

``format( $format = 'd-m-Y', $date_string)``

**format** est un conteneur, un emballage, pour la fonction PHP date.

+------------------+---------------------------------------------------------------------------------------+
| Format           | Sample Output                                                                         |
+==================+=======================================================================================+
| nice             | Tue, Jan 1st 2008, 19:25                                                              |
+------------------+---------------------------------------------------------------------------------------+
| niceShort        | Jan 1st 2008, 19:25                                                                   |
|                  |  Today, 19:25                                                                         |
|                  |  Yesterday, 19:25                                                                     |
+------------------+---------------------------------------------------------------------------------------+
| daysAsSql        | ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25 23:59:59')   |
+------------------+---------------------------------------------------------------------------------------+
| dayAsSql         | ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-21 23:59:59')   |
+------------------+---------------------------------------------------------------------------------------+
| timeAgoInWords   | on 21/01/08                                                                           |
|  relativeTime    |  3 months, 3 weeks, 2 days ago                                                        |
|                  |  7 minutes ago                                                                        |
|                  |  2 seconds ago                                                                        |
+------------------+---------------------------------------------------------------------------------------+
| gmt              | 1200787200                                                                            |
+------------------+---------------------------------------------------------------------------------------+

Testing Time
============

-  ``isToday``
-  ``isThisWeek``
-  ``isThisMonth``
-  ``isThisYear``
-  ``wasYesterday``
-  ``isTomorrow``
-  ``wasWithinLast``

All of the above functions return true or false when passed a date
string. ``wasWithinLast`` takes an additional ``$time_interval`` option:

``$this->Time->wasWithinLast( $time_interval, $date_string )``

``wasWithinLast`` takes a time interval which is a string in the format
"3 months" and accepts a time interval of seconds, minutes, hours, days,
weeks, months and years (plural and not). If a time interval is not
recognized (for example, if it is mistyped) then it will default to
days.
