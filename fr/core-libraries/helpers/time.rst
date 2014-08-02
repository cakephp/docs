TimeHelper
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: TimeHelper(View $view, array $config = [])

Le Helper Time vous permet, comme il l'indique de gagner du temps. Il permet
le traitement rapide des informations se rapportant au temps. Le Helper
Time a deux tâches principales qu'il peut accomplir:

#. Il peut formater les chaînes de temps.
#. Il peut tester le temps (mais ne peut pas le courber, désolé).

Utiliser le Helper
==================

Une utilisation courante de Time Helper est de compenser la date et le time
pour correspondre au time zone de l'utilisateur. Utilisons un exemple de forum.
Votre forum a plusieurs utilisateurs qui peuvent poster des messages depuis
n'importe quelle partie du monde. Une façon facile de gérer le temps est de
sauvegarder toutes les dates et les times à GMT+0 or UTC. Décommenter la
ligne ``date_default_timezone_set('UTC');`` dans ``config/core.php`` pour
s'assurer que le time zone de votre aplication est défini à GMT+0.

Ensuite, ajoutez un time zone à votre table users et faîtes les modifications
nécessaires pour permettre à vos utilisateurs de définir leur time zone.
Maintenant que nous connaissons le time zone de l'utilisateur connecté, nous
pouvons corriger la date et le temps de nos posts en utilisant le Helper Time::

    echo $this->Time->format(
      'F jS, Y h:i A',
      $post['Post']['created'],
      null,
      $user['User']['time_zone']
    );
    // Affichera August 22nd, 2011 11:53 PM pour un utilisateur dans GMT+0
    // August 22nd, 2011 03:53 PM pour un utilisateur dans GMT-8
    // et August 23rd, 2011 09:53 AM GMT+10

La plupart des méthodes du Helper Time contiennent un paramètre $timezone.
Le paramètre $timezone accepte une chaîne identifiante de timezone valide ou
une instance de la classe `DateTimeZone`.

.. meta::
    :title lang=fr: TimeHelper
    :description lang=fr: Time Helper vous aide à formater le temps et à tester le temps.
    :keywords lang=fr: time helper,temps,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
