CakeTime
########

.. php:class:: CakeTime()

Si vous avez besoin de fonctionnalités :php:class:`TimeHelper` en-dehors d'une ``View``,
utilisez la classe ``CakeTime``::

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
   ``CakeTime`` a été ajouté à partir de :php:class:`TimeHelper`.

.. start-caketime

Formatage
=========

.. php:method:: convert($serverTime, $userOffset = NULL)

    :rtype: integer

    Convertit étant donné le time (dans le time zone du serveur) vers le time de 
    l'utilisateur, étant donné son/sa sortie de GMT.::

        // Appelé à travers TimeHelper
        echo $this->Time->convert(time(), -8);
        // 1321038036

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::convert(time(), -8);

.. php:method:: convertSpecifiers($format, $time = NULL)

    :rtype: string

    Convertit une chaîne de caractères représentant le format pour la fonction 
    strftime et retourne un format windows safe et i18n aware.

.. php:method:: dayAsSql($dateString, $field_name, $userOffset = NULL)

    :rtype: string

    Crée une chaîne de caractères dans le même format que dayAsSql mais nécessite 
    seulement un unique objet date::

        // Appelé à travers TimeHelper
        echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
        // (modified >= '2011-08-22 00:00:00') AND (modified <= '2011-08-22 23:59:59')

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::dayAsSql('Aug 22, 2011', 'modified');

.. php:method:: daysAsSql($begin, $end, $fieldName, $userOffset = NULL)

    :rtype: string

    Retourne une chaîne de caractères dans le format "($field\_name >=
    '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
    23:59:59')". C'est pratique si vous avez besoin de chercher des 
    enregistrements entre deux dates incluses::

        // Appelé avec TimeHelper
        echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
        // (created >= '2011-08-22 00:00:00') AND (created <= '2011-08-25 23:59:59')

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');

.. php:method:: format($format, $dateString = NULL, $invalid = false, $userOffset = NULL)

    :rtype: string

    Va retourner une chaîne formatée avec le format donné en utilisant les 
    `options de formatage de la fonction PHP date() <http://www.php.net/manual/en/function.date.php>`_::

        // Appelé avec TimeHelper
        echo $this->Time->format('Y-m-d H:i:s');
        // L'Epoch Unix tel que 1970-01-01 00:00:00
        
        echo $this->Time->format('F jS, Y h:i A', '2011-08-22 11:53:00');
        // August 22nd, 2011 11:53 AM
        
        echo $this->Time->format('r', '+2 days', true);
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 +0800

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('Y-m-d H:i:s');
        echo CakeTime::format('F jS, Y h:i A', '2011-08-22 11:53:00');
        echo CakeTime::format('r', '+2 days', true);

.. php:method:: fromString($dateString, $userOffset = NULL)

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

.. php:method:: gmt($dateString = NULL)

    :rtype: integer

    Va retourner la date en un nombre défini sur Greenwich Mean Time (GMT).::

        // Appelé avec TimeHelper
        echo $this->Time->gmt('Aug 22, 2011');
        // 1313971200

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::gmt('Aug 22, 2011');

.. php:method:: i18nFormat($date, $format = NULL, $invalid = false, $userOffset = NULL)

    :rtype: string

    Retourne une chaîne de date formatée, étant donné soit un timestamp UNIX 
    soit une chaîne de date valide strtotime(). Il prend en compte le format 
    de la date par défaut pour le langage courant si un fichier LC_TIME est 
    utilisé.

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

.. php:method:: niceShort($dateString = NULL, $userOffset = NULL)

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
        
        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));
        // on August 22nd, 2011

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011');
        echo CakeTime::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));

    Utilisez l'option 'end' pour déterminer le point de cutoff pour ne plus 
    utiliser de mots; default '+1 month'::

        // Appelé avec TimeHelper
        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

        // Appelé avec CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));

.. php:method:: toAtom($dateString, $userOffset = NULL)

    :rtype: string

    Va retourner une chaîne de date au format Atom "2008-01-12T00:00:00Z"

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

.. php:method:: toRSS($dateString, $userOffset = NULL)

    :rtype: string

    Va retourner une chaîne de date au format RSS "Sat, 12 Jan 2008 
    00:00:00 -0500"

.. php:method:: toUnix($dateString, $userOffset = NULL)

    :rtype: integer

    Un enrouleur pour fromString.

Tester Time
===========

.. php:method:: isToday($dateString, $userOffset = NULL)
.. php:method:: isThisWeek($dateString, $userOffset = NULL)
.. php:method:: isThisMonth($dateString, $userOffset = NULL)
.. php:method:: isThisYear($dateString, $userOffset = NULL)
.. php:method:: wasYesterday($dateString, $userOffset = NULL)
.. php:method:: isTomorrow($dateString, $userOffset = NULL)
.. php:method:: wasWithinLast($timeInterval, $dateString, $userOffset = NULL)

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
    ce sera par défaut days.
    

.. end-caketime

.. meta::
    :title lang=fr: CakeTime
    :description lang=fr: La classe CakeTime vous aide à formater le time et à tester le time.
    :keywords lang=fr: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
