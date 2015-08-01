3.1 Guide de Migration
######################

CakePHP 3.1 est une mise à jour de CakePHP 3.0 dont la compatibilité
API est complète. Cette page souligne les changements et améliorations
faits dans 3.1.

Routing
=======

- La classe de route par défaut a été changée en ``DashedRoute`` dans le dépôt
  ``cakephp/app``. Votre base de code actuelle n'est pas affectée par ceci mais
  il est recommandé d'utiliser cette classe de route à partir de maintenant.
- Les options de nom de préfixe ont été ajoutées aux différentes méthodes de
  construction de route. Regardez la section :ref:`named-routes` pour plus
  d'informations.

Console
=======

- ``Shell::dispatchShell()`` n'affiche plus le message d'accueil à partir du
  shell dispatché.
- La fonction ``breakpoint()`` a été ajoutée. Cette fonction fournit un snippet
  de code qui peut être utilisé dans un ``eval()`` pour lancer une console
  interactive. C'est très utile pour debugger les tests ou tout script CLI.

Ajout des Shell Helpers
-----------------------

- Les applications de console peuvent maintenant créer des classes Helper qui
  encapsulent des blocs réutilisables de logique de sortie. Consultez la section
  sur :doc:`/console-and-shells/helpers` pour plus d'informations.

RoutesShell
-----------

- RoutesShell a été ajouté et vous fournit maintenant un moyen simple pour
  utiliser l'interface CLI pour tester et débugger les routes. Consultez la
  section :doc:`/console-and-shells/routes-shell` pour plus d'informations.

Controller
==========

AuthComponent
-------------

- Une nouvelle option de configuration ``storage`` a été ajoutée. Elle contient
  le nom de la classe de stockage que ``AuthComponent`` utilise pour stocker
  l'enregistrement de l'utilisateur. Par défaut ``SessionStorage`` est utilisée.
  Si vous utilisez un authentificateur stateless, vous devez configurer
  ``AuthComponent`` avec ``MemoryStorage`` à la place.
- Une nouvelle option de config ``checkAuthIn`` a été ajoutée. Elle contient
  le nom de l'event pour lequel les vérifications d'auth doivent être faites.
  Par défaut ``Controller.startup`` est utilisé, mais vous pouvez la définir
  dans ``Controller.initialize`` si vous souhaitez que l'authentification
  soit vérifiée avant que la méthode ``beforeFilter()`` de votre controller ne
  soit executée.

FlashComponent
--------------

- ``FlashComponent`` empile maintenant les messages enregistrés avec les
  méthodes ``set()`` et ``__call()``. Cela signifie que la structure des
  données stockées dans la Session pour les messages Flash a changé.

CsrfComponent
-------------

- Le temps d'expiration du cookie CSRF peut maintenant être défini en une
  valeur compatible avec ``strtotime()``.
- Les tokens CSRF invalides vont maintenant lancer une
  ``Cake\Network\Exception\InvalidCsrfTokenException`` plutôt qu'une
  ``Cake\Network\Exception\ForbiddenException``.

RequestHandlerComponent
-----------------------

- ``RequestHandlerComponent`` échange maintenant le layout et le template selon
  l'extension parsée ou l'en-tête ``Accept-Type`` dans le callback
  ``beforeRender()`` plutôt que dans ``startup()``.

Network
=======

Http\Client
-----------

- Le type mime utilisé pour envoyer les requêtes par défaut a changé.
  Précédemment, ``multipart/form-data`` était toujours utilisé. Dans 3.1,
  ``multipart/form-data`` n'est utilisé qu'en cas de transfert de fichiers.
  Lorsqu'il n'y en pas, ``application/x-www-form-urlencoded`` est utilisé à la
  place.

ORM
===

Vous pouvez maintenant :ref:`Charger en Eager des Associations
<loading-additional-associations>`. Cette fonctionnalité vous permet de charger
des associations conditionnellement dans un ensemble de résultats, une entity
ou une collection d'entites.

Query
-----

- ``Query::notMatching()`` a été ajoutée.
- ``Query::leftJoinWith()`` a été ajoutée.
- ``Query::innerJoinWith()`` a été ajoutée.
- ``Query::select()`` supporte maintenant  des objets ``Table`` et ``Association``
  en paramètres. Ces types de paramètres sélectionneront toutes les colonnes de
  l'instance de la table ou la table ciblée par l'association.
- ``Table::loadInto()`` a été ajoutée.
- Les fonctions SQL brutes ``EXTRACT``, ``DATE_ADD`` et ``DAYOFWEEK`` raw ont
  été ajoutées avec ``extract()``, ``dateAdd()`` et ``dayOfWeek()``.

View
====

- Vous pouvez maintenant définir ``_serialized`` à ``true`` pour ``JsonView``
  et ``XmlView`` pour sérialiser toutes les variables de vue au lieu de les
  spécifier explicitement.

Helper
======

SessionHelper
-------------

- ``SessionHelper`` a été dépréciée. Vous pouvez directement utiliser
  ``$this->request->session()``.

FlashHelper
-----------

- ``FlashHelper`` peut maintenant rendre plusieurs messages si plusieurs
  messages ont été enregistrés avec le ``FlashComponent``. Chaque message
  sera rendu dans son propre élément. Les messages seront rendus dans l'ordre
  dans lequel ils ont été enregistrés.

FormHelper
----------

- Une nouvelle option ``templateVars`` a été ajoutée. ``templateVars`` vous
  permet de passer des variables supplémentaires à vos templates de formulaire
  personnalisés.

Email
=====

- Les classes ``Email`` et ``Transport`` ont été déplacées sous le namespace
  ``Cake\Mailer``. Leur ancien namespace est toujours utilisable car des alias
  ont été créés.

Mailer
------

- La classe ``Mailer`` a été ajoutée. Cette classe aide à créer des emails
  réutilisables dans une application.

I18n
====

Time
----

- ``Time::fromNow()`` a été ajoutée. Cette méthode facilite le calcul de
différence depuis l'instant présent.
- ``Time::i18nFormat()`` supporte les calendriers non-grégorien lors du
  formatage des dates.
