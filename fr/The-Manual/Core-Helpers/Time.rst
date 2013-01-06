Temps
#####

Le Helper Time vous permet, comme il l'indique: gagnez du temps. Il
permet le traitement rapide des informations se rapportant au temps. Le
Helper Time a deux principales tâches qu'il peut accomplir:

#. Il peut formater les chaines de temps.
#. Il peut tester le temps (mais ne peut pas le courber, désolé).

Formatage
=========

``fromString( $date_string )``

**fromString** prend une chaîne et utilise strtotime pour la convertir
en un objet date. Si la chaîne passée est un nombre, alors il sera
converti en un entier, correspondant au nombre de secondes depuis
l'époque Unix (1 janvier 1970 00:00:00 GMT). Passer une chaîne comme
"20081231" créera des résultats non-souhaités puisqu'elle sera convertie
comme un nombre de secondes depuis l'époque Unix, dans ce cas "Fri, Aug
21st 1970, 06:07" (vendredi 21 août 1970, 06:07)

``toQuarter( $date_string, $range = false )``

**toQuarter** retournera 1, 2, 3 ou 4 en fonction du trimestre auquel
tombe la date. Si range est défini à true, un tableau à 2 éléments sera
retourné, avec les dates de début et de fin au format "2008-03-31".

``toUnix( $date_string )``

**toUnix** est un wrapper pour fromString.

``toAtom( $date_string )``

**toAtom** retourne une chaîne date au format Atom
"2008-01-12T00:00:00Z"

``toRSS( $date_string )``

**toRSS** retourne une chaîne date au format RSS "Sat, 12 Jan 2008
00:00:00 -0500"

``nice( $date_string = null )``

**nice** prend une chaîne date et l'affiche au format "Tue, Jan 1st
2008, 19:25" (mardi 1er janvier 2008, 19:25).

``niceShort( $date_string = null )``

**nice** prend une chaîne date et l'affiche au format "Jan 1st 2008,
19:25" (1er janvier 2008, 19:25). Si l'objet date est aujourd'hui, le
format sera "Today, 19:25" (aujourd'hui, 19:25). Si l'objet date est
hier, le format sera "Yesterday, 19:25" (hier, 19:25).

``daysAsSql( $begin, $end, $fieldName, $userOffset = NULL )``

**daysAsSql** retourne une chaîne au format "($field\_name >=
'2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25 23:59:59')".
Ceci est pratique si vous avez besoin de chercher des enregistrements
entre deux dates incluses

``dayAsSql( $date_string,  $field_name )``

**dayAsSql** crée une chaîne au même format que daysAsSql mais ne
nécessite qu'un seul objet date.

``timeAgoInWords( $datetime_string, $options = array(), $backwards = null )``

**timeAgoInWords** prendra une chaîne datetime (quelque chose qui est
analysable par la fonction PHP strtotime() ou le format datetime de
MySQL) et la convertira en un format de mot sympathique comme, "3 weeks,
3 days ago" (il y a 3 semaines, 3 jours). Passer true pour $backwards
déclarera spécifiquement que le temps est défini dans le futur, lequel
utilise le format "on 31/12/08" (au 31/12/08).

+----------+-------------------------------------------------------------------------------------------------------------------------------+
| Option   | Description                                                                                                                   |
+==========+===============================================================================================================================+
| format   | un format de date, par défaut "on 31/12/08"                                                                                   |
+----------+-------------------------------------------------------------------------------------------------------------------------------+
| end      | détermine la limite pour laquelle on n'utilise plus des mots et le format de date utilisé à la place, par défaut "+1 month"   |
+----------+-------------------------------------------------------------------------------------------------------------------------------+

``relativeTime( $date_string, $format = 'j/n/y' )``

**relativeTime** est essentiellement un alias pour timeAgoInWords.

``gmt( $date_string = null )``

**gmt** retournera la date comme un entier défini par rapport au
Greenwich Mean Time (GMT).

``format( $format = 'd-m-Y', $date_string)``

**format** est un wrapper pour la fonction date de PHP.

+------------------+---------------------------------------------------------------------------------------+
| Fonction         | Format                                                                                |
+==================+=======================================================================================+
| nice             | Tue, Jan 1st 2008, 19:25 (mardi 1er janvier 2008, 19:25)                              |
+------------------+---------------------------------------------------------------------------------------+
| niceShort        | Jan 1st 2008, 19:25 (1er janvier 2008, 19:25)                                         |
|                  |  Today, 19:25 (Aujourd'hui, 19:25)                                                    |
|                  |  Yesterday, 19:25 (Hier, 19:25)                                                       |
+------------------+---------------------------------------------------------------------------------------+
| daysAsSql        | ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25 23:59:59')   |
+------------------+---------------------------------------------------------------------------------------+
| dayAsSql         | ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-21 23:59:59')   |
+------------------+---------------------------------------------------------------------------------------+
| timeAgoInWords   | on 21/01/08 (au 21/01/08)                                                             |
|  relativeTime    |  3 months, 3 weeks, 2 days ago (il y a 3 mois, 3 semaines, 2 jours)                   |
|                  |  7 minutes ago (il y a 7 minutes)                                                     |
|                  |  2 seconds ago (il y a 2 secondes)                                                    |
+------------------+---------------------------------------------------------------------------------------+
| gmt              | 1200787200                                                                            |
+------------------+---------------------------------------------------------------------------------------+

Tester le temps
===============

-  ``isToday``
-  ``isThisWeek``
-  ``isThisMonth``
-  ``isThisYear``
-  ``wasYesterday``
-  ``isTomorrow``
-  ``wasWithinLast``

Toutes les fonctions ci-dessus retourne true ou false quand on leur
passe une chaîne de date. ``wasWithinLast`` prend une option
additionnelle ``$time_interval`` :

``$time->wasWithinLast( $time_interval, $date_string )``

``wasWithinLast`` prend un intervalle de temps, lequel est une chaîne au
format "3 months" et accepte un intervalle de temps en secondes,
minutes, heures, jours, semaines, mois et années (pluriel ou non). Si un
intervalle de temps n'est pas reconnu (par exemple, s'il est mal écrit)
alors il sera mis par défaut à jours.
