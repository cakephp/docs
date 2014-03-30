2.5 Guide de Migration
######################

CakePHP 2.5 est une mise à jour complète à partir de l'API de 2.4. Cette page
souligne les changements et améliorations faits dans 2.5.

Cache
=====

- Un nouvel adaptateur a été ajouté pour ``Memcached``. Ce nouvel adaptateur
  utilise ext/memcached au lieu de ext/memcache. Il permet d'améliorer la
  performance et les connections persistentes partagées.
- L'adaptateur ``Memcache`` est maintenant déprécié en faveur de ``Memcached``.
- :php:meth:`Cache::remember()` a été ajoutée.
- :php:meth:`Cache::config()` accepte maintenant la clé ``database`` lors de
  l'utilisation avec :php:class:`RedisEngine` afin d'utiliser un certain nombre
  de base de données pas par défaut.

Console
=======

SchemaShell
-----------

- Les sous-commandes ``create`` et ``update`` ont maintenant une option ``yes``.
  L'option ``yes`` vous permet de passer les différentes questions interactives
  forçant ainsi une réponse à yes.

CompletionShell
---------------

- :doc:`CompletionShell </console-and-shells/completion-shell>` a été ajoutée.
  Il a pour objectif d'aider à la création de librairies autocompletion pour
  les variables d'environnement de shell comme bash, ou zsh. Aucun script shell
  n'est inclu dans CakePHP, mais les outils sous-jacents sont maintenant
  disponibles.

Controller
==========

AuthComponent
-------------

- ``loggedIn()`` est maintenant dépréciée et sera retirée dans 3.0.
- Lors de l'utilisation de ``ajaxLogin``, AuthComponent va retourner un code de
  statut ``403`` au lieu de ``200`` quand l'utilisateur n'est pas authentifié.

CookieComponent
---------------

- :php:class:`CookieComponent` peut utiliser le nouveau chiffrement AES-256
  offert par :php:class:`Security`. Vous pouvez activer ceci en appelant
  :php:meth:`CookieComponent::type()` avec 'aes'.

RequestHandlerComponent
-----------------------

- :php:meth:`RequestHandlerComponent::renderAs()` ne définit plus
  ``Controller::$ext``. Cela posait des problèmes lors de l'utilisation d'une
  extension autre que celle par défaut pour les vues.

AclComponent
------------

- Les échecs de vérification de noeud ACL sont maintenant directement mis dans
  les logs. L'appel de ``trigger_error()`` a été retiré.

Scaffold
--------
- Le scaffold dynamique est maintenant déprécié et sera retiré dans 3.0.

Event
=====

EventManager
------------

Les Events liés au gestionnaire global sont maintenant déclenchés dans l'ordre
de priorité des events liés au gestionnaire local. Ceci peut entraîner le
déclenchement des listeners dans un ordre différent par rapport aux versions
précédentes. Au lieu d'avoir des listeners globaux attrapés, et ensuite
instancier les listeners étant déclenchés plus tard, les deux ensembles de
listeners sont combinés en une liste de listeners basé sur leurs priorités
et ensuite déclenchés en un ensemble. Les listeners globaux d'une prioriété
donnée sont toujours déclenchés avant l'instanciation des listeners.

I18n
====

- La classe :php:class:`I18n` a de nombreuses nouvelles constantes. Ces
  constantes vous permettent de remplacer les hardcoded integers avec des
  valeurs lisibles par exemple : ``I18n::LC_MESSAGES``.


Model
=====

- Les nombres unsigned sont maintenant supportés par les sources de données
  qui les fournissent (MySQL). Vous pouvez définir l'option ``unsigned`` à true
  dans vos fichiers schema/fixture pour commencer à utiliser cette
  fonctionnalité.
- Les Jointures inclues dans les requêtes sont maintenant ajoutées **après** que
  les jointures des associations sont ajoutées. Cela facilite la jointure des
  tables qui dépendent d'associations générées.

Network
=======

CakeEmail
---------

- Les adresses Email dans CakeEmail ne sont pas validées avec ``filter_var``
  par défaut. Cela assouplit les règles d'addresse email en autorisant les
  addresses d'email interne comme ``root@localhost`` par exemple.

CakeRequest
-----------

- :php:meth:`CakeRequest::addDetector()` supporte maintenant ``options`` qui
  accepte un tableau des options valides lors de la création de paramètre
  basé sur les detecteurs.

- ``CakeRequest::onlyAllow()`` a été dépréciée. En remplacement, une nouvelle
  méthode nommée :php:meth:`CakeRequest::allowMethod()` a été ajoutée avec
  une fonctionnalité identique. Le nouveau nom de la méthode est plus intuitif
  et transmet mieux ce que la méthode fait.

CakeSession
-----------

- Sessions ne seront pas démarrées si elles sont connues pour être vides. Si
  le cookie de session ne peut être trouvé, une session ne sera pas démarrée
  à moins qu'une opération d'écriture ne soit faite.


Routing
=======

Router
------

- :php:meth:`Router::mapResources()` accepte la clé ``connectOptions`` dans
  l'argument ``$options``. Regardez :ref:`custom-rest-routing` pour plus de
  détails.

Utility
=======

Debugger
--------

- ``Debugger::dump()`` et ``Debugger::log()`` supportent un paramètre
  ``$depth``. Ce nouveau paramètre facilite la sortie de structures d'objet
  imbriquée plus profonde.

Hash
----

- :php:meth:`Hash::insert()` et :php:meth:`Hash::remove()` supportent maintenant
  les expressions de matcher dans les selecteurs de chemin.

File
----

- :php:meth:`File::replaceText()` a été ajoutée. Cette méthode vous permet
  de facilement remplacer le texte en un fichier en utilisant ``str_replace``.


Folder
------

- :php:meth:`Folder::addPathElement()` accepte maintenant un tableau pour le
  paramètre ``$element``.

Security
--------

- :php:meth:`Security::encrypt()` et :php:meth:`Security::decrypt()` ont été
  ajoutées. Ces méthodes montrent une API très simple pour accéder au
  chiffrement symétrique AES-256.
  Ils doivent être utilisés en faveur des méthodes ``cipher()`` et
  ``rijndael()``.

Validation
----------

- Le troisième paramètre pour :php:meth:`Validation::inList()` et
  :php:meth:`Validation::multiple()` a été modifié de `$strict` en
  `$caseInsensitive`. `$strict` a été retiré puisqu'il ne fonctionnait pas
  correctement et pouvait être facilement contourné. Vous pouvez maintenant
  définir ce paramètre à true pour des comparaisons non sensibles à la casse.
  Par défaut, c'est à false et cela ca comparer la valeur et lister la casse
  sensible comme avant.

- Le paramètre ``$mimeTypes`` de :php:meth:`Validation::mimeType()` peut aussi
  être une chaîne regex. Aussi maintenant quand ``$mimeTypes`` est un tableau
  ses valeurs sont en minuscule.


Logging
=======

FileLog
-------

- CakeLog ne s'auto-configure plus tout seul. Au final, tous les fichiers de
  log ne seront plus auto-créés si aucun flux n'est écouté. Assurez-vous que
  vous avez au moins un moteur par défaut configuré si vous voulez écouter tous
  les types et les niveaux.

Error
=====

ExceptionRenderer
-----------------

ExceptionRenderer remplit maintenant les tempplates d'erreur avec les variables
"code", "message" et "url". "name" a été déprécié mais est toujours disponible.
Cela uniformise les variables à travers tous les templates d'erreur.

Testing
=======

- Les fichiers de fixture peuvent maintenant être placés dans des
  sous-répertoires. Vous pouvez utiliser les fixtures dans les sous-répertoires
  en incluant le nom du répertoire après le ``.``. Par exemple,
  `app.my_dir/article` va charger ``App/Test/Fixture/my_dir/ArticleFixture``.
  On notera que le répertoire de fixture ne sera pas inflecté ou modifié dans
  tous les cas.
- Les Fixtures peuvent maintenant définir ``$canUseMemory`` à false pour
  désactiver le moteur de stockage de la mémoire utilisée dans MySQL.

View
====

View
----

- ``$title_for_layout`` est déprécié. Utilisez ``$this->fetch('title');`` à la
  place.
- :php:meth:`View::get()` accepte maintenant un deuxième argument pour fournir
  une valeur par défaut.

FormHelper
----------

- FormHelper va maintenant générer les inputs de fichier pour les types de champ
  ``binary``.
- :php:meth:`FormHelper::end()` a eu un deuxième paramètre ajouté. Ce paramètre
  vous laisse passer les propriétés supplémentaires aux champs utilisés pour
  sécuriser les formulaires avec SecurityComponent.
- :php:meth:`FormHelper::end()` et :php:meth:`FormHelper::secure()` vous
  permettent de passer des options supplémentaires qui sont changées en
  attributs sur les inputs cachés générés. C'est utile quand vous voulez
  utiliser l'attribut HTML5 ``form``.

PaginationHelper
----------------

- :php:meth:`PaginatorHelper::sort()` a maintenant une option ``lock`` pour
  créer le tri des liens de pagination avec seulement la direction par défaut.

ScaffoldView
------------

- Le Scaffold Dynamique est mainteanant déprécié et sera retiré dans 3.0.
