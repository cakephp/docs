Time
####

.. php:namespace:: Cake\I18n

.. php:class:: Time

Si vous avez besoin de fonctionnalités :php:class:`TimeHelper` en-dehors
d'une ``View``, utilisez la classe ``Time``::

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
                // accueillir l'utilisateur avec un message de bon anniversaire
                $this->Flash->success(__('Bon anniversaire à toi...'));
            }
        }
    }

En-dessous, CakePHP utilise `Carbon <https://github.com/briannesbitt/Carbon>`_
pour construire l'utilitaire ``Time``. Tout ce que vous pouvez faire avec
``Carbon`` et ``DateTime``, vous pouvez le faire avec ``Time``.

Pour plus d'information sur Carbon, rendez-vous sur
`leur documentation <http://carbon.nesbot.com/docs/>`_.

.. start-time

Créer des Instances Time
========================

Il y a plusieurs façons de créer des instances ``Time``::

    use Cake\I18n\Time;

    // Crée à partir d'une chaîne datetime.
    $time = Time::createFromFormat(
        'Y-m-d H:i:s',
        $datetime,
        'America/New_York'
    );

    // Crée à partir d'un timestamp
    $time = Time::createFromTimestamp($ts);

    // Récupère le temps actuel.
    $time = Time::now();

    // Ou utilise juste 'new'
    $time = new Time('2014-01-10 11:11', 'America/New_York');

    $time = new Time('2 hours ago');

Le constructeur de la classe ``Time`` peut prendre les mêmes paramètres que
la classe PHP interne ``DateTime``. Quand vous passez un nombre ou une valeur
numérique, elle sera interprétée comme un timestamp UNIX.

Dans les cas de test, vous pouvez facilement mock out ``now()`` en utilisant
``setTestNow()``::

    // Fixe le temps.
    $now = new Time('2014-04-12 12:22:30');
    Time::setTestNow($now);

    // Retourne '2014-04-12 12:22:30'
    $now = Time::now();

    // Retourne '2014-04-12 12:22:30'
    $now = Time::parse('now');

Manipulation
============

Une fois créées, vous pouvez manipuler les instances ``Time`` en utilisant les
méthodes setter::

    $now = Time::now();
    $now->year(2013)
        ->month(10)
        ->day(31);

Vous pouvez aussi utiliser les méthodes fournies nativement par la classe PHP
``DateTime``::

    $now->setDate(2013, 10, 31);

Les dates peuvent être modifiées à travers la soustraction et l'addition de
leurs composantes::

    $now = Time::now();
    $now->subDays(5);
    $now->addMonth(1);

    // Utilisation des chaînes strtotime.
    $now->modify('+5 days');

Vous pouvez obtenir des composantes internes d'une date en accédant à ses
propriétés::

    $now = Time::now();
    echo $now->year; // 2014
    echo $now->month; // 5
    echo $now->day; // 10
    echo $now->timezone; // America/New_York

Il est aussi permis d'assigner directement ces propriétés pour modifier la
date::

    $time->year = 2015;
    $time->timezone = 'Europe/Paris';

Formatage
=========

.. php:staticmethod:: setToJSONFormat($format)

Cette méthode définit le format par défaut utilisé lors de la conversion d'un
objet en json::

    Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');

.. note::
    Cette méthode doit être appelée statiquement.

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

Une chose habituelle à faire avec les instances ``Time`` est d'afficher les
dates formatées. CakePHP facilite cela::

    $now = Time::parse('2014-10-31');

    // Affiche un stamp datetime localisé.
    echo $now;

    // Affiche '10/31/14, 12:00 AM' pour la locale en-US
    $now->i18nFormat();

    // Utilise la date complète et le format time
    $now->i18nFormat(\IntlDateFormatter::FULL);

    // Utilise la date complète mais un format court de temps
    $now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // affiche '2014-10-31 00:00:00'
    $now->i18nFormat('YYYY-MM-dd HH:mm:ss');

Il est possible de spécifier le format d'affichage désiré. Vous pouvez soit
passer une `constante IntlDateFormatter
<http://www.php.net/manual/en/class.intldateformatter.php>`_ ou une chaine
complète de formatage tel que spécifié dans cette ressource:
http://www.icu-project.org/apiref/icu4c/classSimpleDateFormat.html#details.

Vous pouvez aussi formater les dates avec des calendriers non-grégoriens::

    // Affiche 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
    $result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

Les types de calendrier suivants sont supportés:

* japanese
* buddhist
* chinese
* persian
* indian
* islamic
* hebrew
* coptic
* ethiopic

.. versionadded:: 3.1
    Le support des calendriers non-grégoriens a été ajouté dans 3.1

.. php:method:: nice()

Affiche un format prédéfini 'nice'::

    $now = Time::parse('2014-10-31');

    // Affiche 'Oct 31, 2014 12:32pm' en en-US
    echo $now->nice();

Vous pouvez modifier le timezone avec lequel la date est affichée sans
modifier l'objet ``Time`` lui-même. C'est utile quand vous stockez des dates
dans un timezone, mais que vous voulez les afficher dans un timezone propre
à un utilisateur::

    $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

Laisser le premier paramètre à ``null`` va utiliser la chaine de formatage par
défaut::

    $now->i18nFormat(null, 'Europe/Paris');

Enfin, il est possible d'utiliser une locale différente pour l'affichage d'une
date::

    echo $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    echo $now->nice('Europe/Paris', 'fr-FR');

Définir la Locale par défaut et la Chaîne Format
------------------------------------------------

La locale par défaut avec laquelle les dates sont affichées quand vous utilisez
``nice`` ``i18nFormat`` est prise à partir de la directive
`intl.default_locale <http://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
Vous pouvez cependant modifier ceci par défaut à la volée::

    Time::$defaultLocale = 'es-ES';

A partir de maintenant, les dates vont s'afficher avec un format de préférence
Espagnol, à moins qu'une locale différente ne soit spécifiée directement dans
la méthode de formatage.

De même, il est possible de modifier la chaîne de formatage par défaut à
utiliser pour le format ``i18nFormat``::

    Time::setToStringFormat(\IntlDateFormatter::SHORT);

    Time::setToStringFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    Time::setToStringFormat('YYYY-MM-dd HH:mm:ss');

Il est recommandé de toujours utiliser les constantes plutôt que de directement
passer une date en format chaîne de caractère.

Formater les Temps Relatifs
---------------------------

.. php:method:: timeAgoInWords(array $options = [])

Souvent, il est utile d'afficher les temps liés au présent::

    $now = new Time('Aug 22, 2011');
    echo $now->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );
    // On Nov 10th, 2011 this would display: 2 months, 2 weeks, 6 days ago

L'option ``end`` vous laisse définir à partir de quel point les temps relatifs
doivent être formatés en utilisant l'option ``format``. L'option ``accuracy``
nous laisse contrôler le niveau de détail qui devra être utilisé pour chaque
intervalle::

    // Si $timestamp est 1 month, 1 week, 5 days et 6 hours ago
    echo $timestamp->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);
    // Affiche '1 month ago'

En configurant ``accuracy`` en une chaîne, vous pouvez spécifier le niveau
maximum de détail que vous souhaitez afficher::

    $time = new Time('+23 hours');
    // Affiche 'in about a day'
    $result = $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()

Une fois créées, vous pouvez convertir les instances ``Time`` en timestamps ou
valeurs quarter::

    $time = new Time('2014-06-15');
    $time->toQuarter();
    $time->toUnixString();

Comparer Avec le Present
========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

Vous pouvez comparer une instance ``Time`` avec le temps présent de plusieurs
façons::

    $time = new Time('2014-06-15');

    echo $time->isYesterday();
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

Chacune des méthodes ci-dessus va retourner ``true``/``false`` selon si oui ou
non l'instance ``Time`` correspond au temps présent.

Comparer Avec les Intervals
===========================

.. php:method:: isWithinNext($interval)

Vous pouvez regarder si une instance ``Time`` tombe dans un intervalle en
utilisant ``wasWithinLast()`` et ``isWithinNext()``::

    $time = new Time('2014-06-15');

    // A moins de 2 jours.
    echo $time->isWithinNext(2);

    // A moins de 2 semaines.
    echo $time->isWithinNext('2 weeks');

.. php:method:: wasWithinPast($interval)

Vous pouvez aussi comparer une instance ``Time`` dans un intervalle dans le
passé::

    // Dans les 2 derniers jours.
    echo $time->wasWithinPast(2);

    // Dans les 2 dernières semaines.
    echo $time->wasWithinPast('2 weeks');

.. end-time

Accepter des Données Requêtées Localisées
=========================================

Quand vous créez des inputs de texte qui manipulent des dates, vous voudrez
probablement accepter et parser des chaînes datetime localisées. Consultez
:ref:`parsing-localized-dates`.

.. meta::
    :title lang=fr: Time
    :description lang=fr: Classe Time vous aide à formater le temps et à tester le temps.
    :keywords lang=fr: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt, temps
