CakeTime
########

.. php:class:: CakeTime()

Si vous avez besoin de fonctionnalités :php:class:`TimeHelper` en-dehors
d'une ``View``, utilisez la classe ``CakeTime``::

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('CakeTime', 'Utility');
            if (CakeTime::isToday($this->Auth->user('date_of_birth']))) {
                // greet user with a happy birthday message
                $this->Session->setFlash(__('Happy birthday you...'));
            }
        }
    }

.. versionadded:: 2.1
   ``CakeTime`` a été créé à partir de :php:class:`TimeHelper`.

.. start-caketime

Formatage
=========

.. php:method:: convert($serverTime, $timezone = NULL)

    :rtype: integer

    Convertit étant donné le time (dans le time zone du serveur) vers le time
    de l'utilisateur, étant donné son/sa sortie de GMT. ::

        // appel via TimeHelper
        echo $this->Time->convert(time(), 'Asia/Jakarta');
        // 1321038036

        // appel avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::convert(time(), new DateTimeZone('Asia/Jakarta'));

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

.. php:method:: convertSpecifiers($format, $time = NULL)

    :rtype: string

    Convertit une chaîne de caractères représentant le format pour la fonction
    strftime et retourne un format Windows safe et i18n aware.

.. php:method:: dayAsSql($dateString, $field_name, $timezone = NULL)

    :rtype: string

    Crée une chaîne de caractères dans le même format que dayAsSql mais
    nécessite seulement un unique objet date::

        // Appelé avec TimeHelper
        echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
        // (modified >= '2011-08-22 00:00:00') AND
        // (modified <= '2011-08-22 23:59:59')

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::dayAsSql('Aug 22, 2011', 'modified');

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: daysAsSql($begin, $end, $fieldName, $userOffset = NULL)

    :rtype: string

    Retourne une chaîne de caractères dans le format "($field\_name >=
    '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
    23:59:59')". C'est pratique si vous avez besoin de chercher des
    enregistrements entre deux dates incluses::

        // Appelé avec TimeHelper
        echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
        // (created >= '2011-08-22 00:00:00') AND
        // (created <= '2011-08-25 23:59:59')

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace ``$userOffset`` utilisé dans 2.1
       et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: format($date, $format = NULL, $default = false, $timezone = NULL)

    :rtype: string

    Va retourner une chaîne formatée avec le format donné en utilisant les
    `options de formatage de la fonction PHP strftime() <https://secure.php.net/manual/en/function.strftime.php>`_::

        // appel via TimeHelper
        echo $this->Time->format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
        // August 22nd, 2011 11:53 AM

        echo $this->Time->format('%r', '+2 days');
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 AM EET

        // appel avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
        echo CakeTime::format('+2 days', '%c');

    Vous pouvez aussi fournir la date/time en premier argument. En faisant cela
    vous devrez utiliser le format ``strftime`` compatible. Cette signature
    d'appel vous permet de tirer parti du format de date de la locale ce qui
    n'est pas possible en utilisant le format de ``date()`` compatible::

        // appel avec TimeHelper
        echo $this->Time->format('2012-01-13', '%d-%m-%Y', 'invalid');

        // appel avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('2011-08-22', '%d-%m-%Y');

    .. versionchanged:: 2.2
       Les paramètres ``$format`` et ``$date`` sont en ordre opposé par rapport
       à ce qui se faisait dans 2.1 et suivants.
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.
       Le paramètre ``$default`` remplace le paramètre ``$invalid`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$date`` accepte aussi maintenant un objet DateTime.

.. php:method:: fromString($dateString, $timezone = NULL)

    :rtype: string

    Prend une chaîne et utilise `strtotime <http://us.php.net/manual/en/function.date.php>`_
    pour la convertir en une date integer::

        // Appelé avec TimeHelper
        echo $this->Time->fromString('Aug 22, 2011');
        // 1313971200

        echo $this->Time->fromString('+1 days');
        // 1321074066 (+1 day from current date)

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::fromString('Aug 22, 2011');
        echo CakeTime::fromString('+1 days');

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: gmt($dateString = NULL)

    :rtype: integer

    Va retourner la date en un nombre défini sur Greenwich Mean Time (GMT). ::

        // Appelé avec TimeHelper
        echo $this->Time->gmt('Aug 22, 2011');
        // 1313971200

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::gmt('Aug 22, 2011');

.. php:method:: i18nFormat($date, $format = NULL, $invalid = false, $timezone = NULL)

    :rtype: string

    Retourne une chaîne de date formatée, étant donné soit un timestamp UNIX
    soit une chaîne de date valide strtotime(). Il prend en compte le format
    de la date par défaut pour le langage courant si un fichier LC_TIME est
    utilisé. Pour plus d'infos sur le fichier LC_TIME, allez voir
    :ref:`ici <lc-time>`

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

.. php:method:: nice($dateString = NULL, $timezone = NULL, $format = null)

    :rtype: string

    Prend une chaîne de date et la sort au format "Tue, Jan
    1st 2008, 19:25" ou avec le param optionnel ``$format``::

        // Appelé avec TimeHelper
        echo $this->Time->nice('2011-08-22 11:53:00');
        // Mon, Aug 22nd 2011, 11:53

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::nice('2011-08-22 11:53:00');

.. php:method:: niceShort($dateString = NULL, $timezone = NULL)

    :rtype: string

    Prend une chaîne de date et la sort au format "Jan
    1st 2008, 19:25". Si l'objet date est today, le format sera
    "Today, 19:25". Si l'objet date est yesterday, le format sera
    "Yesterday, 19:25"::

        // Appelé avec TimeHelper
        echo $this->Time->niceShort('2011-08-22 11:53:00');
        // Aug 22nd, 11:53

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::niceShort('2011-08-22 11:53:00');

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: serverOffset()

    :rtype: integer

    Retourne la valeur du serveur à partir du GMT dans les secondes.

.. php:method:: timeAgoInWords($dateString, $options = array())

    :rtype: string

    Prendra une chaîne datetime (tout ce qui est parsable par la fonction
    strtotime() de PHP ou le format de datetime de MySQL)
    et la convertit en un format de texte comme, "3 weeks, 3 days
    ago"::

        // Appelé avec TimeHelper
        echo $this->Time->timeAgoInWords('Aug 22, 2011');
        // on 22/8/11

        // on August 22nd, 2011
        echo $this->Time->timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y')
        );

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011');
        echo CakeTime::timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y')
        );

    Utilisez l'option 'end' pour déterminer le point de cutoff pour ne plus
    utiliser de mots; par défaut à '+1 month'::

        // Appelé avec TimeHelper
        echo $this->Time->timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y', 'end' => '+1 year')
        );
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y', 'end' => '+1 year')
        );

    Utilisez l'option 'accuracy' pour déterminer la précision de la sortie.
    Vous pouvez utiliser ceci pour limiter la sortie::

        // Si $timestamp est il y a 1 month, 1 week, 5 days et 6 hours
        echo CakeTime::timeAgoInWords($timestamp, array(
            'accuracy' => array('month' => 'month'),
            'end' => '1 year'
        ));
        // Sort '1 month ago'

    .. versionchanged:: 2.2
        L'option ``accuracy`` a été ajoutée.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: toAtom($dateString, $timezone = NULL)

    :rtype: string

    Va retourner une chaîne de date au format Atom "2008-01-12T00:00:00Z"

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: toQuarter($dateString, $range = false)

    :rtype: mixed

    Va retourner 1, 2, 3 ou 4 dépendant du quart de l'année sur lequel
    la date tombe. Si range est défini à true, un tableau à deux éléments
    va être retourné avec les dates de début et de fin au format
    "2008-03-31"::

        // Appelé avec TimeHelper
        echo $this->Time->toQuarter('Aug 22, 2011');
        // Afficherait 3

        $arr = $this->Time->toQuarter('Aug 22, 2011', true);
        /*
        Array
        (
            [0] => 2011-07-01
            [1] => 2011-09-30
        )
        */

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::toQuarter('Aug 22, 2011');
        $arr = CakeTime::toQuarter('Aug 22, 2011', true);

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

    .. versionadded:: 2.4
       Les nouveaux paramètres d'option ``relativeString`` (par défaut à
       ``%s ago``) et ``absoluteString`` (par défaut à ``on %s``) pour
       permettre la personnalisation de la chaîne de sortie résultante sont
       maintenant disponibles.

.. php:method:: toRSS($dateString, $timezone = NULL)

    :rtype: string

    Va retourner une chaîne de date au format RSS "Sat, 12 Jan 2008
    00:00:00 -0500"

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: toUnix($dateString, $timezone = NULL)

    :rtype: integer

    Un enrouleur pour fromString.

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

.. php:method:: toServer($dateString, $timezone = NULL, $format = 'Y-m-d H:i:s')

    :rtype: mixed

    .. versionadded:: 2.2
       Retourne une date formatée dans le timezone du serveur.

.. php:method:: timezone($timezone = NULL)

    :rtype: DateTimeZone

    .. versionadded:: 2.2
       Retourne un objet timezone à partir d'une chaîne de caractères ou de
       l'objet timezone de l'utilisateur. Si la fonction est appelée sans
       paramètres, elle essaie d'obtenir le timezone de la variable de
       configuration 'Config.timezone'.

.. php:method:: listTimezones($filter = null, $country = null, $options = array())

    :rtype: array

    .. versionadded:: 2.2
       Retourne une liste des identificateurs de timezone.

    .. versionchanged:: 2.8
       ``$options`` accepte maintenant un tableau avec les clés ``group``,
       ``abbr``, ``before``, et ``after``.
       Spécifier ``abbr => true`` va ajouter l'abréviation de la timezone
       dans le texte ``<option>``.

Tester Time
===========

.. php:method:: isToday($dateString, $timezone = NULL)
.. php:method:: isThisWeek($dateString, $timezone = NULL)
.. php:method:: isThisMonth($dateString, $timezone = NULL)
.. php:method:: isThisYear($dateString, $timezone = NULL)
.. php:method:: wasYesterday($dateString, $timezone = NULL)
.. php:method:: isTomorrow($dateString, $timezone = NULL)
.. php:method:: isFuture($dateString, $timezone = NULL)

    .. versionadded:: 2.4

.. php:method:: isPast($dateString, $timezone = NULL)

    .. versionadded:: 2.4

.. php:method:: wasWithinLast($timeInterval, $dateString, $timezone = NULL)

    .. versionchanged:: 2.2
       Le paramètre ``$timezone`` remplace le paramètre ``$userOffset`` utilisé
       dans 2.1 et suivants.

    .. versionadded:: 2.2
       Le paramètre ``$dateString`` accepte aussi maintenant un objet DateTime.

    Toutes les fonctions ci-dessus retourneront true ou false quand une chaîne
    de date est passé. ``wasWithinLast`` prend une option supplémentaire
    ``$time_interval``::

        // Appelé avec TimeHelper
        $this->Time->wasWithinLast($time_interval, $dateString);

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        CakeTime::wasWithinLast($time_interval, $dateString);

    ``wasWithinLast`` prend un intervalle de time qui est une chaîne au format
    "3 months" et accepte un intervalle de time en secondes, minutes, heures,
    jours, semaines, mois et années (pluriels ou non). Si un intervalle de time
    n'est pas reconnu (par exemple, si il y a une faute de frappe) ensuite
    ce sera par défaut à days.


.. end-caketime

.. meta::
    :title lang=fr: CakeTime
    :description lang=fr: La classe CakeTime vous aide à formater le time et à tester le time.
    :keywords lang=fr: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
