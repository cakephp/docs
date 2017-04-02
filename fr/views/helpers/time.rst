Time
####

.. php:namespace:: Cake\View\Helper

.. php:class:: TimeHelper(View $view, array $config = [])

Le TimeHelper vous permet, comme il l'indique de gagner du temps. Il permet
le traitement rapide des informations se rapportant au temps. Le Helper
Time a deux tâches principales qu'il peut accomplir:

#. Il peut formater les chaînes de temps.
#. Il peut tester le temps.

Utiliser le Helper
==================

Une utilisation courante de Time Helper est de compenser la date et le time
pour correspondre au time zone de l'utilisateur. Utilisons un exemple de forum.
Votre forum a plusieurs utilisateurs qui peuvent poster des messages depuis
n'importe quelle partie du monde. Une façon facile de gérer le temps est de
sauvegarder toutes les dates et les times à GMT+0 or UTC. Décommenter la
ligne ``date_default_timezone_set('UTC');`` dans **config/bootstrap.php** pour
s'assurer que le time zone de votre application est défini à GMT+0.

Ensuite, ajoutez un time zone à votre table users et faîtes les modifications
nécessaires pour permettre à vos utilisateurs de définir leur time zone.
Maintenant que nous connaissons le time zone de l'utilisateur connecté, nous
pouvons corriger la date et le temps de nos posts en utilisant le TimeHelper::

    echo $this->Time->format(
      $post->created,
      \IntlDateFormatter::FULL,
      null,
      $user->time_zone
    );
    // Affichera 'Saturday, August 22, 2011 at 11:53:00 PM GMT'
    // pour un utilisateur dans GMT+0. Cela affichera,
    // 'Saturday, August 22, 2011 at 03:53 PM GMT-8:00'
    // pour un utilisateur dans GMT-8

La plupart des fonctionnalités de TimeHelper sont des interfaces
rétro-compatibles pour les applications qui sont mises à jour à partir des
versions anciennes de CakePHP. Comme l'ORM retourne des instances
:php:class:`Cake\\I18n\\Time` pour chaque colonne ``timestamp`` et ``datetime``,
vous pouvez utiliser les méthodes ici pour faire la plupart des tâches.
Par exemple, pour en apprendre plus sur les chaines de formatage, jetez un oeil
à la méthode `Cake\\I18n\\Time::i18nFormat() 
<https://api.cakephp.org/3.x/class-Cake.I18n.Time.html#_i18nFormat>`_.

.. meta::
    :title lang=fr: TimeHelper
    :description lang=fr: TimeHelper vous aide à formater le temps et à tester le temps.
    :keywords lang=fr: time helper,temps,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
