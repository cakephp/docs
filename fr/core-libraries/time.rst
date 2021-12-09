Date & Time
###########

.. php:namespace:: Cake\I18n

.. php:class:: FrozenTime

Si vous avez besoin de fonctionnalités :php:class:`TimeHelper` en-dehors
d'une ``View``, utilisez la classe ``FrozenTime``::

    use Cake\I18n\FrozenTime;

    class UsersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $time = new FrozenTime($this->Auth->user('date_de_naissance'));
            if ($time->isToday()) {
                // accueillir l'utilisateur avec un message de bon anniversaire
                $this->Flash->success(__('Bon anniversaire à toi...'));
            }
        }
    }

En interne, CakePHP utilise `Chronos <https://github.com/cakephp/chronos>`_
pour faire fonctionner l'utilitaire ``FrozenTime``. Tout ce que vous pouvez
faire avec ``Chronos`` et ``DateTime``, vous pouvez le faire avec ``FrozenTime``
et ``FrozenDate``.

Pour plus d'informations sur Chronos, rendez-vous sur
`la documentation de l'API <https://api.cakephp.org/chronos/1.0/>`_.

.. start-time

Créer des Instances FrozenTime
==============================

Les objets ``FrozenTime`` ne sont pas modifiables. Ils sont utiles quand vous
voulez éviter des changements accidentels de données, ou lorsque le bon
fonctionnement dépend de l'ordre des traitements. Reportez-vous aux instances
``Time`` pour les objets modifiables.

Il y a plusieurs façons de créer des instances ``Time``::

    use Cake\I18n\FrozenTime;

    // Crée à partir d'une chaîne datetime.
    $time = FrozenTime::createFromFormat(
        'Y-m-d H:i:s',
        '2021-01-31 22:11:30',
        'America/New_York'
    );

    // Crée à partir d'un timestamp
    $time = FrozenTime::createFromTimestamp(1612149090, 'America/New_York');

    // Récupère le temps actuel.
    $time = FrozenTime::now();

    // Ou utilise juste 'new'
    $time = new FrozenTime('2014-01-10 11:11', 'America/New_York');

    $time = new FrozenTime('2 hours ago');

Le constructeur de la classe ``FrozenTime`` peut prendre les mêmes paramètres que
la classe PHP interne ``DateTimeImmutable``. Quand vous passez un nombre ou une valeur
numérique, elle sera interprétée comme un timestamp UNIX.

Dans les cas de test, vous pouvez mock out ``now()`` en utilisant
``setTestNow()``::

    // Fixe le temps.
    $time = new FrozenTime('2021-01-31 22:11:30');
    FrozenTime::setTestNow($time);

    // Affiche '2021-01-31 22:11:30'
    $now = FrozenTime::now();
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

    // Affiche '2021-01-31 22:11:30'
    $now = FrozenTime::parse('now');
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

Manipulation
============

Souvenez-vous que quand ses setters sont appelés, une instance ``FrozenTime``
renvoie toujours une autre instance plutôt que de se modifier elle-même::

    $time = FrozenTime::now();

    // Créer et réassigner une nouvelle instance
    $newTime = $time->year(2013)
        ->month(10)
        ->day(31);

    // Affiche '2013-10-31 22:11:30'
    echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');

Vous pouvez aussi utiliser les méthodes fournies nativement par la classe PHP
``DateTime``::

    $time = $time->setDate(2013, 10, 31);

Si vous ne réassignez pas la nouvelle instance ``FrozenTime``, la variable
contiendra toujours l'instance originale non modifiée::

    $time->year(2013)
        ->month(10)
        ->day(31);
    // Affiche '2021-01-31 22:11:30'
    echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');

Vous pouvez créer une autre instance avec des dates modifiées par soustraction
et addition de ses composantes::

    $time = FrozenTime::create(2021, 1, 31, 22, 11, 30);
    $newTime = $time->subDays(5)
        ->addHours(-2)
        ->addMonth(1);
    // Affiche '2/26/21, 8:11 PM'
    echo $newTime;

    // Utilisation des chaînes strtotime.
    $newTime = $time->modify('+1 month -5 days -2 hours');
    // Affiche '2/26/21, 8:11 PM'
    echo $newTime;

Vous pouvez obtenir des composantes internes d'une date en accédant à ses
propriétés::

    $time = FrozenTime::create(2021, 1, 31, 22, 11, 30);
    echo $time->year; // 2021
    echo $time->month; // 1
    echo $time->day; // 31
    echo $time->timezoneName; // America/New_York

Formatage
=========

.. php:staticmethod:: setJsonEncodeFormat($format)

Cette méthode définit le format par défaut utilisé lors de la conversion d'un
objet en json::

    Time::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Pour tout DateTime modifiable
    FrozenTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Pour tout DateTime non modifiable
    Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Pour toute Date modifiable
    FrozenDate::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // Pour toute Date non modifiable

    $time = FrozenTime::parse('2021-01-31 22:11:30');
    echo json_encode($time);   // Affiche '2021-01-31 22:11:30'

    // Ajouté dans 4.1.0
    FrozenDate::setJsonEncodeFormat(static function($time) {
        return $time->format(DATE_ATOM);
    });

.. note::
    Cette méthode doit être appelée statiquement.

.. versionchanged:: 4.1.0
    Le paramètre ``callable`` a été ajouté.

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

Une chose habituelle à faire avec les instances ``Time`` est d'afficher les
dates formatées. CakePHP facilite cela::

    $time = FrozenTime::parse('2021-01-31 22:11:30');

    // Affiche un stamp datetime localisé. Affiche '1/31/21, 10:11 PM'
    echo $time;

    // Affiche '1/31/21, 10:11 PM' pour la locale en-US
    echo $time->i18nFormat();

    // Utilise la date complète et le format time. Affiche 'Sunday, January 31, 2021 at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL);

    // Utilise la date complète mais un format court de temps. Affiche 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // Affiche '2021-Jan-31 22:11:30'
    echo $time->i18nFormat('yyyy-MMM-dd HH:mm:ss');

Il est possible de spécifier le format d'affichage désiré. Vous pouvez soit
passer une `constante IntlDateFormatter
<https://www.php.net/manual/en/class.intldateformatter.php>`_ en premier argument
de cette fonction, soit une chaîne
complète de formatage tel que spécifié dans cette ressource:
https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Vous pouvez aussi formater les dates avec des calendriers non-grégoriens::

    // Sur ICU version 66.1
    $time = FrozenTime::create(2021, 1, 31, 22, 11, 30);

    // Affiche 'Friday, Aban 9, 1393 AP at 12:00:00 AM GMT'
    $result = $now->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

    // Affiche 'Sunday, January 31, 3 Reiwa at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-JP@calendar=japanese');

    // Affiche 'Sunday, Twelfth Month 19, 2020(geng-zi) at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-CN@calendar=chinese');

    // Affiche 'Sunday, Jumada II 18, 1442 AH at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-SA@calendar=islamic');


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

.. note::
    Pour les chaînes constantes, par exemple pour IntlDateFormatter::FULL, Intl
    utilise la librairie ICU qui alimente ses données à partir de CLDR
    (https://cldr.unicode.org/) dont la version peut varier selon l'installation
    PHP et donner des résultats différents.

.. php:method:: nice()

Affiche un format prédéfini 'nice'::

    $time = FrozenTime::parse('2021-01-31 22:11:30', new \DateTimeZone('America/New_York'));

    // Affiche 'Jan 31, 2021, 10:11 PM' in en-US
    echo $time->nice();

Vous pouvez modifier le timezone avec lequel la date est affichée sans
modifier l'objet ``FrozenTime`` ou ``Time`` lui-même. C'est utile quand vous stockez des dates
dans un timezone, mais que vous voulez les afficher dans un timezone propre
à un utilisateur::

    // Affiche 'Monday, February 1, 2021 at 4:11:30 AM Central European Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

    // Affiche 'Monday, February 1, 2021 at 12:11:30 PM Japan Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Asia/Tokyo');

    // Le timezone est inchangé. Affiche 'America/New_York'
    echo $time->timezoneName;
    $now = Time::parse('2014-10-31');

Laisser le premier paramètre à ``null`` va utiliser la chaine de formatage par
défaut::

    // Affiche '2/1/21, 4:11 AM'
    echo $time->i18nFormat(null, 'Europe/Paris');

Enfin, il est possible d'utiliser une locale différente pour l'affichage d'une
date::

    // Outputs 'lundi 1 février 2021 à 04:11:30 heure normale d’Europe centrale'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    // Outputs '1 févr. 2021 à 04:11'
    echo $time->nice('Europe/Paris', 'fr-FR');

Définir la Locale par défaut et la Chaîne Format
------------------------------------------------

La locale par défaut avec laquelle les dates sont affichées quand vous utilisez
``nice`` ``i18nFormat`` est prise à partir de la directive
`intl.default_locale <https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
Vous pouvez cependant modifier ceci par défaut à la volée::

    Time::setDefaultLocale('es-ES'); // Pour tout DateTime modifiable
    FrozenTime::setDefaultLocale('es-ES'); // Pour tout DateTime non modifiable
    Date::setDefaultLocale('es-ES'); // Pour toute Date modifiable
    FrozenDate::setDefaultLocale('es-ES'); // Pour toute Date non modifiable

    // Affiche '31 ene. 2021 22:11'
    echo $time->nice();

À partir de maintenant, les datetimes vont s'afficher avec un format préféré en
Espagnol, à moins qu'une locale différente ne soit spécifiée
directement dans la méthode de formatage.

De même, il est possible de modifier la chaîne de formatage par défaut à
utiliser pour le format ``i18nFormat``::

    Time::setToStringFormat(\IntlDateFormatter::SHORT); // Pour tout DateTime modifiable
    FrozenTime::setToStringFormat(\IntlDateFormatter::SHORT); // Pour tout DateTime non modifiable
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // Pour toute Date modifiable
    FrozenDate::setToStringFormat(\IntlDateFormatter::SHORT); // Pour toute Date non modifiable

    // La même méthode existe pour les Date, FrozenDate, et Time
    FrozenTime::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);
    // Affiche 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time;

    // La même méthode existe pour les Date, FrozenDate, et Time
    FrozenTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
    // Affiche 'Sunday, January 31, 2021 at 10:11:30 PM'
    echo $time;

Il est recommandé de toujours utiliser les constantes plutôt que de directement
passer une date en format chaîne de caractère.

Formater les Temps Relatifs
---------------------------

.. php:method:: timeAgoInWords(array $options = [])

Souvent, il est utile d'afficher les temps par rapport au présent::

    $time = new FrozenTime('Jan 31, 2021');
    // Le 12 juin 2021, ceci afficherait '4 months, 1 week, 6 days ago'
    echo $time->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );
    // Le 10 novembre 2011, cela afficherait: 2 months, 2 weeks, 6 days ago

L'option ``end`` définit à partir de quel point les temps relatifs
doivent être formatés en utilisant l'option ``format``. L'option ``accuracy``
nous permet de contrôler le niveau de détail qui devra être utilisé pour chaque
intervalle::

    // Affiche '4 months ago'
    echo $time->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);

En définissant ``accuracy`` par une chaîne de texte, vous pouvez spécifier le niveau
maximum de détail que vous souhaitez afficher::

    $time = new FrozenTime('+23 hours');
    // Affiche 'in about a day'
    echo $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()

Une fois créées, les instances ``Time`` peuvent être converties en timestamps ou
en trimestre (*quarter* est un quart d'année, c'est-à-dire un trimestre)::

    $time = new FrozenTime('2021-01-31');
    echo $time->toQuarter();  // Affiche '1'
    echo $time->toUnixString();  // Affiche '1612069200'

Comparer Avec le Present
========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

Vous pouvez comparer une instance ``Time`` avec le temps présent de plusieurs
façons::

    $time = new FrozenTime('+3 days');

    debug($time->isYesterday());
    debug($time->isThisWeek());
    debug($time->isThisMonth());
    debug($time->isThisYear());

Chacune des méthodes ci-dessus va retourner ``true``/``false`` selon que
l'instance ``Time`` est ou non dans la même unité de temps que le temps présent.

Comparer Avec Des Intervalles
=============================

.. php:method:: isWithinNext($interval)

Vous pouvez regarder si une instance ``Time`` tombe dans un intervalle de temps
en utilisant ``wasWithinLast()`` et ``isWithinNext()``::

    $time = new FrozenTime('+3 days');

    // Dans moins de 2 jours. Affiche 'false'
    debug($time->isWithinNext('2 days'));

    // Dans les 2 prochaines semaines. Affiche 'true'
    debug($time->isWithinNext('2 weeks'));

.. php:method:: wasWithinLast($interval)

Vous pouvez aussi comparer une instance ``FrozenTime`` avec un intervalle dans le
passé::

    $time = new FrozenTime('-72 hours');

    // Dans les 2 derniers jours. Affiche 'false'
    debug($time->wasWithinLast('2 days'));

    // Dans les 3 derniers jours. Affiche 'true'
    debug($time->wasWithinLast('3 days'));

    // Dans les 2 dernières semaines. Affiche 'true'
    debug($time->wasWithinLast('2 weeks'));

.. end-time

FrozenDate
==========

.. php:class: Date

La classe immuable ``FrozenDate`` dans CakePHP implémente la même API et les
mêmes méthodes que :php:class:`Cake\\I18n\\FrozenTime`. La différence principale
entre ``FrozenTime`` et ``FrozenDate`` est que ``FrozenDate`` ne tient pas
compte des composantes d'heure.
Voici un exemple::

    use Cake\I18n\FrozenDate;
    $date = new FrozenDate('2021-01-31');

    $newDate = $date->modify('+2 hours');
    // Affiche '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addHours(36);
    // Affiche '2021-01-31 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

    $newDate = $date->addDays(10);
    // Affiche '2021-02-10 00:00:00'
    echo $newDate->format('Y-m-d H:i:s');

Les tentatives de modification de timezone sur une instance ``FrozenDate`` seront
toujours ignorées::

    use Cake\I18n\FrozenDate;
    $date = new FrozenDate('2021-01-31', new \DateTimeZone('America/New_York'));
    $newDate = $date->setTimezone(new \DateTimeZone('Europe/Berlin'));

    // Affiche 'America/New_York'
    echo $newDate->format('e');

.. _mutable-time:

Dates et Heures Modifiables
===========================

.. php:class:: Time
.. php:class:: Date

CakePHP offre des classes de date et d'heure modifiables qui implémentent la
même interface que leurs équivalents immuables. Les objets immuables sont utiles
quand vous voulez éviter des changements accidentels de données, ou lorsque le
bon fonctionnement dépend de l'ordre des traitements. Prenez le code suivant::

    use Cake\I18n\Time;
    $time = new Time('2015-06-15 08:23:45');
    $time->modify('+2 hours');

    // Cette méthode modifie également l'instance $time
    $this->someOtherFunction($time);

    // Ici, la sortie est inconnue.
    echo $time->format('Y-m-d H:i:s');

Si on change l'ordre d'appel aux méthodes, ou si ``someOtherFunction`` est
modifiée, le résultat peut être inattendu. La mutabilité de vos objets crée un
couplage temporel. En utilisant des objets immuables, nous pourrions
éviter ce type de problème::

    use Cake\I18n\FrozenTime;
    $time = new FrozenTime('2015-06-15 08:23:45');
    $time = $time->modify('+2 hours');

    // La modification de cette méthode ne change pas $time
    $this->someOtherFunction($time);

    // La sortie est connue.
    echo $time->format('Y-m-d H:i:s');

Les date et heures immuables sont utiles dans les entities car elles
évitent les modifications accidentelles, et forcent les modifications à être
exprimées de façon explicite. Utiliser des objets immuables aide l'ORM à mieux
suivre les modifications et assurer que les colones date/datetime sont
persistées correctement::

    // Cette modification sera perdue lrsque l'article sera enregistré.
    $article->updated->modify('+1 hour');

    // En remplaçant l'objet time, la propriété sera auvegardée
    $article->updated = $article->updated->modify('+1 hour');

Accepter des Données de Requête Localisées
==========================================

Quand vous créez des inputs de texte qui manipulent des dates, vous voudrez
probablement accepter et parser des chaînes datetime localisées. Consultez
:ref:`parsing-localized-dates`.

Timezones Supportés
===================

CakePHP supporte tous les timezones valides de PHP. Pour la liste des timezones,
`consultez cette page <https://php.net/manual/fr/timezones.php>`_.

.. meta::
    :title lang=fr: Time
    :description lang=fr: Classe Time vous aide à formater le temps et à tester le temps.
    :keywords lang=fr: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt, temps
