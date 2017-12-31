3.2 Guide de Migration
######################

CakePHP 3.2 est une mise à jour de CakePHP 3.1 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.2.

PHP 5.5 Requis au Minimum
=========================

CakePHP 3.2 requiert au moins PHP 5.5.9. En adoptant PHP 5.5, nous pouvons
fournir des librairies de Date et de Time et retirer les dépendances qui
concernent les librairies de compatibilité pour les mots de passe.

Dépréciations
=============

Pendant que nous continuons à améliorer CakePHP, certaines fonctionnalités sont
dépréciées puisqu'elles seront remplacées par de meilleures solutions. Les
fonctionnalités dépréciées ne seront pas retirées jusqu'à 4.0:

* ``Shell::error()`` est dépréciée car son nom n'indique pas clairement qu'il
  affiche un message et stoppe l'exécution. Utilisez ``Shell::abort()`` à la
  place.
* ``Cake\Database\Expression\QueryExpression::type()`` est dépréciée. Utilisez
  ``tieWith()`` à la place.
* ``Cake\Database\Type\DateTimeType::$dateTimeClass`` est dépréciée. Utilisez
  DateTimeType::useMutable() ou DateTimeType::useImmutable() à la place.
* ``Cake\Database\Type\DateType::$dateTimeClass`` est dépréciée. Utilisez
  ``DateTimeType::useMutable()`` ou ``DateType::useImmutable()`` à la place.
* ``Cake\ORM\ResultSet::_calculateTypeMap()`` n'est maintenant plus utilisée et
  est dépréciée.
* ``Cake\ORM\ResultSet::_castValues()`` n'est maintenant plus utilisée et est
  dépréciée.
* La clé ``action`` pour ``FormHelper::create()`` a été dépréciée. Vous devez
  utiliser la clé ``url`` directement.

Désactiver les Avertissements Liés à l'Obsolescence
---------------------------------------------------

Après la mise à niveau vous pouvez rencontrer plusieurs avertissements liés
à l'obsolescence. Ces avertissements sont émis par des méthodes, options et
fonctionnalités qui seront supprimées dans CakePHP 4.x, mais vont continuer à
exister tout au long du cycle de vie de 3.x. Bien que nous vous recommandons de
régler les problèmes liés à l'obsolescence au fur et à mesure que vous les
rencontrez, ce n'est pas toujours possible. Si vous voulez reporter la
correction de ces avertissements, vous pouvez les désactiver dans votre
**config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED,
    ]

Le niveau d'erreur ci-dessus va supprimer les avertissements liés à
l'obsolescence de CakePHP.

Nouvelles Améliorations
=======================

Carbon Remplacé par Chronos
---------------------------

La librairie Carbon a été remplacée par :doc:`cakephp/chronos </chronos>`. Cette
nouvelle librairie est un fork de Carbon sans aucune dépendance supplémentaire.
Elle offre également un objet date calendaire, et une version immutable des
objets date et datetime.

Nouvel Objet Date
-----------------

La classe ``Date`` vous permet de mapper proprement les colonnes ``DATE`` vers
des objets PHP. Les instances de Date définiront toujours leur heure à
``00:00:00 UTC``. par défaut, l'ORM crée maintenant des instances de ``Date``
lorsqu'il mappe des colonnes ``DATE``.

Nouveaux Objets Immutables Date et Time
---------------------------------------

Les classes ``FrozenTime`` et ``FrozenDate`` ont été ajoutées. Ces classes
offrent la même API que l'objet ``Time``. Les classes "frozen" (gelées)
fournissent des variantes immutables de ``Time`` et ``Date``. En utilisant les
objets immutables, vous pouvez éviter les mutations accidentelles. Au lieu de
modifications directes, les méthodes de modification renvoient de *nouvelles*
instances::

    use Cake\I18n\FrozenTime;

    $time = new FrozenTime('2016-01-01 12:23:32');
    $newTime = $time->modify('+1 day');

Dans le code ci-dessus, ``$time`` et ``$newTime`` sont des objets différents.
L'objet ``$time`` garde sa valeur originale alors que ``$newTime`` contient la
valeur modifiée. Pour plus d'informations, référez-vous à la section sur les
:ref:`Temps Immutables <immutable-time>`. A partir de 3.2, l'ORM peut mapper les
colonnes date/datetime vers des objets immutables. Regardez la section
:ref:`immutable-datetime-mapping` pour plus d'informations.

CorsBuilder Ajouté
------------------

Afin de faciliter la définition des en-têtes liés aux Requêtes de type
Cross-site (Cross Origin Requests = CORS), un nouveau ``CorsBuilder`` a été
ajouté. Cette classe vous laisse définir les en-têtes liés au CORS avec une
interface simple. Consultez :ref:`cors-headers` pour plus d'informations.

RedirectRoute lance une Exception en cas de Redirect
----------------------------------------------------

``Router::redirect()`` lance maintenant une
``Cake\Network\Routing\RedirectException`` quand une condition de redirect
est atteinte. Cette exception est récupérée par le filtre de routing et
convertie en une réponse. Ceci remplace les appels à ``response->send()`` et
permet aux filtres du dispatcher d'intéragir avec les réponses du redirect.

Améliorations de l'ORM
----------------------

* Faire un contain avec la même association plusieurs fois fonctionne maintenant
  de la façon espérée, et les fonctions du constructeur de requête sont
  maintenant empilées.
* Les expression de fonctions transforment maintenant correctement leurs
  résultats dans le type attendu. Ceci signifie que les expressions comme
  ``$query->func()->current_date()`` vont retourner des instances de datetime.
* La donnée du champ qui échoue pendant la validation peut maintenant être
  accessible dans les entities avec la méthode ``invalid()``.
* Les recherches avec la méthode d'accesseur de l'entity sont maintenant mises
  en cache et ont une meilleur performance.

API du Validator Amélioré
-------------------------

L'objet Validator a quelques nouvelles méthodes qui rendent la construction
des validateurs moins verbeux. Par exemple, ajouter les règles de validation
pour un champ de nom d'utilisateur peut maintenant ressembler à ceci::

    $validator->email('username')
        ->ascii('username')
        ->lengthBetween('username', [4, 8]);

Améliorations de la Console
---------------------------

* ``Shell::info()``, ``Shell::warn()`` et ``Shell::success()`` ont été ajoutées.
  Ces méthodes de helper facilitent l'utilisation des styles communément
  utilisés.
* ``Cake\Console\Exception\StopException`` ont été ajoutées.
* ``Shell::abort()`` a été ajoutée pour remplacer ``error()``.

StopException Ajoutée
---------------------

``Shell::_stop()`` et ``Shell::error()`` n'appellent plus ``exit()``. A la
place, elles lancent une ``Cake\Console\Exception\StopException``. Si vos
shells/tasks attrapent les ``\Exception`` là où sont lancées ces méthodes, vous
devrez mettre à jour ces blocs de code pour qu'ils n'attrapent pas les
``StopException``. En évitant d'utiliser  ``exit()``, tester vos shells sera
plus facile et nécessitera moins de mocks.

Helper initialize() ajouté
--------------------------

Les helpers peuvent maintenant avoir une méthode hook
``initialize(array $config)`` comme tous les autres types de classe.

Manipulation de la Limite de la Mémoire en cas d'Erreur Fatale
--------------------------------------------------------------

Une nouvelle option de configuration ``Error.extraFatalErrorMemory`` peut être
définie en nombre de megaoctets, pour augmenter la limite de mémoire en cas
d'erreur fatale. Cela permet d'allouer un petit espace mémoire supplémentaire
pour la journalisation (logging) ainsi que la gestion d'erreur.

Étapes de Migration
===================

Mettre à jour setToStringFormat()
---------------------------------

Avant CakePHP 3.2, Time::setToStringFormat() fonctionnait aussi avec des Objets
Date. Après la mise à jour, vous devrez ajouter Date::setToStringFormat() en
plus pour voir de nouveau la Date formatée.
