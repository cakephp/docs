Guide de migration vers la version 4.2
######################################

CakePHP 4.2 est une mise à jour de l'API compatible à partir de la version 4.0.
Cette page présente les dépréciations et fonctionnalités ajoutées dans la
version 4.2.

Mettre à jour vers la version 4.2.0
===================================

Vous pouvez utiliser composer pour mettre à jour vers CakePHP 4.2.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.2.x"

Dépréciations
=============

4.2 introduit quelques dépréciations. Toutes ces fonctionnalités continueront
d'exister dans les versions 4.x mais seront supprimées dans la version 5.0. Vous
pouvez utiliser l':ref:`outil de mise à niveau <upgrade-tool-use>` pour
automatiser la mise à jour des fonctionnalités obsolètes::

    bin/cake upgrade rector --rules cakephp42 <path/to/app/src>

.. note::
    Cela ne met à jour que les changements de CakePHP 4.2. Assurez-vous
    d'appliquer d'abord les modifications de CakePHP 4.1.

Une nouvelle option de configuration a été ajoutée pour désactiver les
dépéréciations chemin par chemin. Cf. :ref:`deprecation-warnings` pour plus
d'informations.

Core
----

- L'``Exception::responseHeader()`` est maintenant dépréciée. Les utilisateurs
  doivent utiliser ``HttpException::setHeaders()`` pour définir les en-têtes de
  la réponse HTTP. Les exceptions d'applications et de plugins qui définissent
  des en-têtes de réponse devraient être mises à jour pour hériter de
  ``HttpException``.
- ``Cake\Core\Exception\Exception`` a été renommée en
  ``Cake\Core\Exception\CakeException``.


Database
--------

- ``Cake\Database\Exception`` a été renommée en
  ``Cake\Database\Exception\DatabaseException``.

ORM
---

- ``TableLocator::allowFallbackClass()`` a été ajoutée. Cette méthode vous
  permet de désactiver les classes de table fallback générées automatiquement.
  La désactivation est actuellement une option, mais deviendra à l'avenir le
  comportement par défaut.
- ``ORM\Behavior::getTable()`` a été dépréciée. Utilisez ``table()`` à la place.
  Ce changement marque une différence des noms de méthodes par rapport à
  ``ORM\Table``, car les valeurs de retour de ces méthodes sont différentes.


Changement pour les Behavior
============================

Bien que les changements qui suivent ne modifient pas la signature des méthodes,
ils changent la signification ou le comportement des méthodes.

Collection
----------

- ``Collection::groupBy()`` et ``Collection::indexBy()`` lèvent maintenant une
  exception quand le chemin n'existe pas ou quand le chemin contient une valeur
  null. Les utilisateurs qui ont besoin de null devraient utiliser un callback
  pour renvoyer plutôt une valeur par défaut.

Controller
----------

- ``Controller::$components`` a été marquée protected. Elle était auparavant
  documentée comme protected. Cela ne devrait pas impacter la plupart des codes
  d'application puisque les implémentations peuvent augmenter la visibilité à
  public.

Component
---------

- ``FlashComponent::set()`` définit maintenant l'option ``element`` à ``error``
  par défaut quand elle est utilisée avec une instance ``Exception``.

Database
--------

- Le ``TimeType`` sérialisera désormais correctement les valeurs dans le format
  ``H:i``. Auparavant ces valeurs étaient castées en ``null`` après validation.
- Le pilote ``Sqlserver`` réessayera de se connecter après une erreur
  "Azure Sql Database paused".

Error
-----

- ``ExceptionRenderer`` utilise maintenant le code de l'exception comme statut
  HTTP uniquement pour ``HttpException``.  Les autres exceptions qui sont
  censées renvoyer un code HTTP différent de 500 sont contrôlées par
  ``ExceptionRenderer::$exceptionHttpCodes``.

  .. note::
      Si vous avez besoin de restaurer le comportement précédent jusqu'à ce que
      vos exceptions soient mises à jour, vous pouvez créer un ExceptionRenderer
      personnalisé et réécrire la function ``getHttpCode()``.
      Cf. :ref:`custom-exceptionrenderer` pour plus d'informations.

- ``ConsoleErrorHandler`` utilise désormais le code de l'exception comme code de
  sortie uniquement pour ``ConsoleException``.

Validation
----------

- ``Validation::time()`` rejettera désormais une chaîne de texte s'il manque les
  minutes. Auparavant, elle acceptait des chiffres correspondant uniquement aux
  heures alors que la documentation de l'API disait que les minutes étaient
  exigées.


Changements entraînant une rupture
==================================

Derrière l'API, certains changements sont nécessaires pour avancer. Ils
n'affectent généralement pas les tests.

I18n
----
- La dépendance envers le paquet
  `Aura.Intl<https://github.com/auraphp/Aura.Intl>`_ a été supprimée car il n'est
  plus maintenu. Si votre application/plugin a des traducteurs génériques
  (:ref:`custom translation loaders <creating-generic-translators>`) alors elle
  doit retourner désormais une instance ``Cake\I18n\Package`` à la place de
  ``Aura\Intl\Package``. Les deux classes ont des API compatibles donc vous
  n'avez rien besoin de changer d'autre.

Testing
-------

- Les noms de fixtures autour des UUIDs ont été consolidés
  (``UuidItemsFixture``, ``BinaryUuidItemsFixture``). Si vous utilisez l'une
  d'entre elles, assurez-vous d'avoir mis à jour ces noms.
  La ``UuidportfoliosFixture`` n'était pas utilisée dans le cœur et a maintenant
  été retirée.

Nouvelles fonctionnalités
=========================

Nous sommes en train de mettre en place un nouveau process pour nous permettre
de lancer de nouvelles fonctionnalités, de recevoir des feedbacks de la
communauté et de faire évoluer ces fonctionnalités. Nous appelons ce process
`experimental-features`.

Core
----

- Un support expérimental pour un :doc:`/development/dependency-injection` a été
  ajouté.

Console
-------

- ``ConsoleIo::comment()`` a été ajouté. Cette méthode formate le texte en bleu
  comme des commentaires dans le texte d'aide généré.
- ``TableHelper`` supporte maintenant un tag de formatage ``<text-right>``, qui
  aligne le contenu de la cellule par rapport au côté droit plutôt que le
  gauche.

Database
--------

- ``SqlServer`` crée maintenant par défaut des curseurs en tampon côté client
  pour les requêtes préparées. Cela a été modifié pour résoudre des problèmes de
  performance significatifs avec les curseurs SCROLL côté serveur. Les
  utilisateurs devraient constater des performances boostées pour la plupart des
  results sets.

  .. warning::
      Pour les utilisateurs qui ont des requêtes avec de grands résultats, cela
      peut causer une erreur d'allocation du tampon côté client, si
      ``Query::disableBufferedResults()`` n'est pas invoquée.
      La taille maximum du tampon peut être configurée dans ``php.ini`` avec
      ``pdo_sqlsrv.client_buffer_max_kb_size``.
      Cf. https://docs.microsoft.com/en-us/sql/connect/php/cursor-types-pdo-sqlsrv-driver?view=sql-server-ver15#pdo_sqlsrv-and-client-side-cursors
      pour plus d'informations.
- ``Query::isResultsCastingEnabled()`` a été ajoutée pour obtenir le mode actuel
  de cast du résultat en cours.
- ``StringExpression`` a été ajoutée pour utiliser des string literals avec
  collation.
- ``IdentifierExpression`` support maintenant la collation.

Http
----

- ``Cake\Http\Middleware\SessionCsrfProtectionMiddleware`` a été ajouté. Plutôt
  que de stocker les jetons CSRF dans un cookie, ce middleware stocke les jetons
  en session. Cela limite la portée des jetons CSRF à l'utilisateur et les
  relie à l'heure de la session, offrant une sécurité accrue par rapport aux
  jetons basés sur des cookies. Ce middleware est un substitut à
  ``CsrfProtectionMiddleware``.
- Les types ``hal+json``, ``hal+xml``, et ``jsonld`` ont été ajoutés à
  ``Response``, les rendant utilisables avec ``withType()``.
- ``Client::createFromUrl()`` a été ajoutée. Cette méthode peut être utilisée
  pour créer des clients HTTP limités à des domaines incluant une base d'adresse
  spécifique.
- Une nouvelle classe utilitaire ``Cake\Http\FlashMessage`` a été ajoutée, dont
  l'instance est disponible par ``ServerRequest::getFlash()``. La classe
  similaire à ``FlashComponent`` vous permet de définir des messages flash. Elle
  peut être particulièrement utile pour définir des messages flash depuis les
  middlewares.

ORM
---

- ``Table::subquery()`` et  ``Query::subquery()`` ont été ajoutées. Ces méthodes
  vous permettent de créer des objets qui n'ont pas d'aliasing automatique. Cela
  aide à réduire l'empilement et la complexité de la construction de
  sous-requêtes et d'expressions de tables communes.
- La règle ``IsUnique`` accepte maintenant l'option ``allowMultipleNulls`` qui
  était disponible dans la version 3.x. Elle est désactivée par défaut,
  contrairement à ce qui se faisait dans la version 3.x.

TestSuite
---------

- ``EmailTrait::assertMailSubjectContains()`` et
  ``assertMailSubjectContainsAt()`` ont été ajoutées.
- ``mockService()`` a été ajoutée à ``ConsoleIntegrationTestTrait`` et
  ``IntegrationTestCaseTrait``. Cette méthode permet de remplacerr les services
  injectés avec le conteneur d':doc:`/development/dependency-injection` par des
  Mocks ou des stubs.

View
----

- Les classes de contexte incluent maintenant les options de métadonnées
  ``comment``, ``null``, and ``default`` dans les résultats de ``attributes()``.
- ``ViewBuilder::addHelper()`` accepte maintenant un paramètre ``$options`` pour
  passer des options dans le constructeur de l'Helper.
- L'option ``assetUrlClassName`` a été ajoutée à ``UrlHelper``. Cette option
  vous permet de remplacer l'asset URL resolver par défaut par un autre qui soit
  spécifique à l'application.
  Cela peut être utile si vous avez besoin de personnaliser les paramètres de
  l'asset cache busting.
