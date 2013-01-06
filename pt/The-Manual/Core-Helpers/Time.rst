Time
####

O helper Time faz o que o próprio nome se refere: poupa tempo. Ele
permite o rápido processamento de informações relacionadas ao tempo. O
helper Time pode desempenhar duas tarefas, principalmente:

#. Pode formatar strings de tempo;
#. Pode testar o tempo (mas não pode voltar no tempo, desculpe).

Formatando
==========

fromString( $date\_string )

**fromString**\ recebe uma string e usa strtotime para converter em um
objeto data. Se a string passada for um número, irá converter em um
inteiro que representam os segundos desde a Época Unix (01/01/1970
00:00:00 GMT). Passando a string "20081231" criará um resultado não
desejado, pois ele irá converter isso como segundos passados da Época
Unix, neste caso como "Fri, Aug 21st 1970, 06:07" (o formato pode variar
dependendo das configurações de idioma do PHP).

toQuarter( $date\_string, $range = false )

**toQuarter**\ irá retornar 1, 2, 3 ou 4, dependendo de qual trimestre
do ano a data se refere. Se range for verdadeiro (true), um array com
dois elementos será retornado, informando a data de início e término (no
formato "2008-03-31") do trimestre.

toUnix( $date\_string )

**toUnix** é a saída para fromString.

toAtom( $date\_string )

**toAtom** retorna a data no formato Atom ("2008-01-12T00:00:00Z").

toRSS( $date\_string )

**toRSS** retorna a data no formato RSS ("Sat, 12 Jan 2008 00:00:00
-05:00").

nice( $date\_string = null )

**nice** recebe uma string e exibe no formato "Tue, Jan 1st 2008,
19:25".

niceShort( $date\_string = null )

**niceShort** recebe uma string e exibe no formato "Jan 1st 2008,
19:25". Se o objeto data for hoje, o formato será "Today, 19:25". Se o
objeto data for ontem, o formato será "Yesterday, 19:25".

daysAsSql( $begin, $end, $field\_name )

**daysAsSql** retorna a string no format "($field\_name >= '2008-01-21
00:00:00') AND ($field\_name <= '2008-01-25 23:59:59')". Isto é útil se
você precisa procurar registros entre duas datas (inclusive).

dayAsSql( $date\_string, $field\_name )

**dayAsSql** cria uma string num formato como daysAsSql, mas necessita
de apenas um objeto de data.

timeAgoInWords( $date\_string, $options = array(), $backwards = null )

**timeAgoInWords** irá receber uma string e converter numa forma
amigavel, como "3 weeks, 3 days ago" (o texto virá sempre em inglês).
Passando true em backwards você está declarando que o tempo está
definido no futuro, usando o formato "on 31/12/08".

+----------+----------------------------------------------------------------------------------------------------------+
| Opção    | Descrição                                                                                                |
+==========+==========================================================================================================+
| format   | O formato da data. O padrão é "on 31/12/08".                                                             |
+----------+----------------------------------------------------------------------------------------------------------+
| end      | Determina o ponto de corte para utilizar palavras ao invés do formato de datas. O padrão é "+1 month".   |
+----------+----------------------------------------------------------------------------------------------------------+

relativeTime( $date\_string, $format = 'j/n/y' )

**relativeTime** é sinônimo de timeAgoInWords.

gmt( $date\_string = null )

**gmt** retornará uma data em inteiro setada para Greenwich Mean Time
(GMT).

format( $format = 'd-m-Y', $date\_string)

**format** é a saída para a função date do PHP.

+------------------+---------------------------------------------------------------------------------------+
| Função           | Formato                                                                               |
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

Testando o Time
===============

-  ``isToday``
-  ``isThisWeek``
-  ``isThisMonth``
-  ``isThisYear``
-  ``wasYesterday``
-  ``isTomorrow``
-  ``wasWithinLast``

Todas estas funções retornam true ou false quando recebem uma string de
data. ``wasWithinLast`` recebe ``$time_interval`` como opção adicional:

``$this->wasWithinLast( $time_interval, $date_string )``

``wasWithinLast`` recebe um intervalo de tempo numa string no formato
como "3 months" e aceita o intervalo de tempo em segundos, minutos,
horas, dias, semanas, meses e anos (no plural ou não, mas em inglês). Se
o intervalo de tempo não for reconhecido (por exemplo, esteja mal
formatado) ele usará o padrão que é dias.
