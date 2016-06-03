2.3 Guide de Migration
######################

CakePHP 2.3 est une mise à jour de l'API complètement compatible à partir de
2.2. Cette page souligne les changements et les améliorations faits dans 2.3.

Constantes
----------

Une application peut maintenant facilement définir :php:const:`CACHE` et
:php:const:`LOGS`, puisqu'ils sont maintenant définis de façon conditionnelle
par CakePHP.

Mise en Cache
=============

- FileEngine est toujours le moteur de cache par défaut. Dans le passé, un
  certain nombre de personnes a des difficultés configurant et déployant
  APC correctement des deux façons en CLI et web. L'utilisation des
  fichiers devrait rendre la configuration de CakePHP plus simple pour
  les nouveaux développeurs.
- `Configure::write('Cache.viewPrefix', 'YOURPREFIX');` a été ajoutée à
  `core.php` pour autoriser les domaines/languages multiples par configuration.

Component
=========

AuthComponent
-------------
- Une nouvelle propriété ``AuthComponent::$unauthorizedRedirect`` a été ajoutée.

  - Par défaut la valeur est à ``true`` et l'user est redirigé à l'URL de
    référence lors des échecs d'authorisation.
  - Si défini à une chaîne ou un tableau, l'user est redirigé à l'URL.
  - Si défini à false, une exception ForbiddenException est lancée à la place
    de la redirection.

- Un nouvel adaptateur d'authenticate a été ajouté pour le support de hash
  blowfish/bcrypt hashed des mots de passe. Vous pouvez maintenant utiliser
  ``Blowfish`` dans votre tableau ``$authenticate`` pour permettre aux mots
  de passe bcrypt d'être utilisés.

- :php:meth:`AuthComponent::redirect()` a été dépréciée.
  Utilisez :php:meth:`AuthComponent::redirectUrl()` à la place.

PaginatorComponent
------------------

- PaginatorComponent supporte maintenant l'option ``findType``. Ceci peut être
  utilisé pour spécifier quelle méthode find vous voulez utiliser pour la
  pagination. C'est un peu plus facile de manager et de définir que l'index
  0ième.

- PaginatorComponent lance maintenant `NotFoundException` quand vous essayez
  d'accéder à une page qui n'est pas correct (par ex la page requêtée est
  supérieure au total du compte de page).

SecurityComponent
------------------

- SecurityComponent supporte maintenant l'option ``unlockedActions``. Ceci peut
  être utilisé pour désactiver toutes les vérifications de sécurité pour toute
  action listée dans cette option.

RequestHandlerComponent
-----------------------

- :php:meth:`RequestHandlerComponent::viewClassMap()` a été ajouté, qui est
  utilisé pour mapper un type vers le nom de classe de la vue. Vous pouvez
  ajouter ``$settings['viewClassMap']`` pour configurer automatiquement la
  viewClass correcte basée sur le type extension/content.

CookieComponent
---------------

- :php:meth:`CookieComponent::check()` a été ajoutée. Cette méthode
  fonctionne de la même façon que :php:meth:`CakeSession::check()`.

Console
=======

- Le shell ``server`` a été ajouté. Vous pouvez utiliser cela pour commencer
  le serveur web PHP5.4 pour votre application CakePHP.
- Construire un nouveau projet avec bake définit maintenant le préfixe de
  cache de l'application avec le nom de l'application.

I18n
====

L10n
---------

- ``nld`` est maintenant la locale par défaut pour Dutch comme spécifié par
  ISO 639-3 et ``dut`` pour ses alias. Les dossiers locale ont été ajustés
  pour cela (from `/Locale/dut/` to `/Locale/nld/`).
- Albanian est maintenant ``sqi``, le Basque est maintenant ``eus``, le
  Chinese est maintentant ``zho``, Tibetan est maintenant ``bod``, Czech est
  maintenant ``ces``, Farsi est maitenant ``fas``, French est maitenant
  ``fra``, Icelandic est maitenant ``isl``, Macedonian est maitenant ``mkd``,
  Malaysian est maitenant ``msa``, Romanian est maitenant ``ron``, Serbian est
  maitenant ``srp`` et le Slovak est maitenant ``slk``. Les dossiers locale
  correspondant ont été aussi ajustés.

Core
====

CakePlugin
----------

- :php:meth:`CakePlugin::load()` peut maintenant prendre une nouvelle option
  ``ignoreMissing``. Le configurer à true va empêcher les erreurs d'inclusion
  du fichier quand vous essayez de charger les routes ou le bootstrap, mais
  qu'ils n'existent pas pour un plugin.
  Alors essentiellement, vous pouvez maintenant utiliser la déclaration
  suivante qui va charger tous les plugins et leurs routes et bootstrap
  quelque soit le plugin trouvé::
  ``CakePlugin::loadAll(array(array('routes' => true, 'bootstrap' => true, 'ignoreMissing' => true)))``

Configure
---------

- :php:meth:`Configure::check()` a été ajoutée. Cette méthode fonctionne de la
  manière que :php:meth:`CakeSession::check()`.

- :php:meth:`ConfigReaderInterface::dump()` a été ajoutée. Merci de vous
  assurer que tout lecteur personnalisé que vous avez a maintenant une méthode
  ``dump()`` inplementée.

- Le paramètre ``$key`` de :php:meth:`IniReader::dump()` supporte maintenant
  les clés comme `PluginName.keyname` similaire à ``PhpReader::dump()``.

Error
=====

Exceptions
----------

- CakeBaseException a été ajouté, auquel toutes les Exceptions du coeur
  étendent. La classe d'Exception de base introduit aussi la méthode
  ``responseHeader()`` qui peut être appelée sur les instances d'Exception
  créées pour ajouter les headers à la réponse, puisque les Exceptions
  ne réutilisent pas toute instance de réponse.

Model
=====

- Le support pour le type biginteger a été ajouté pour toutes les sources de
  données du coeur, et les fixtures.
- Support pour les indices ``FULLTEXT`` a été ajouté pour le driver MySQL.


Models
------

- ``Model::find('list')`` définit maintenant ``recursive`` basé sur le
  containment depth max ou la valeur récursive. Quand la liste est utilisée
  avec ContainableBehavior.
- ``Model::find('first')`` va maintenant retourner un tableau vide quand aucun
  enregistrement n'est trouvé.

Validation
----------

- Les méthodes de manque pour les validations vont **toujours** maintenant
  attraper les erreurs au lieu de le faire seulement en mode développement.

Network
=======

SmtpTransport
-------------

- Le support TLS/SSL a été ajouté pour les connexions SMTP.

CakeRequest
-----------

- :php:meth:`CakeRequest::onlyAllow()` a été ajoutée.
- :php:meth:`CakeRequest::query()` a été ajoutée.

CakeResponse
------------

- :php:meth:`CakeResponse::file()` a été ajoutée.
- Les types de contenu `application/javascript`, `application/xml`,
  `application/rss+xml` envoient maitntenant aussi le charset de l'application.

CakeEmail
---------

- L'option ``contentDisposition`` a été ajoutée à
  :php:meth:`CakeEmail::attachments()`. Cela vous permet de désactiver
  le header Content-Disposition ajouté aux fichiers joints.

HttpSocket
----------

- :php:class:`HttpSocket` vérifie maintenant les certificats SSL par défaut. Si
  vous utilisez les certificats signés-soi-même ou si vous vous connectez à
  travers des proxies, vous avez besoin d'utiliser quelques unes des options
  pour augmenter ce comportement. Regardez :ref:`http-socket-ssl-options`
  pour plus d'informations.
- ``HttpResponse`` a été renommée en ``HttpSocketResponse``. Ceci évite
  un problème commun avec l'extension HTTP PECL. Il y a une classe
  ``HttpResponse`` fournie ainsi que pour des raisons de compatibilité.

Routing
=======

Router
------

- Support pour ``tel:``, ``sms:`` ont été ajoutés à :php:meth:`Router::url()`.

View
====

- MediaView est déprécié, et vous pouvez maintenant utiliser les nouvelles
  fonctionnalités dans :php:class:`CakeResponse` pour atteindre les mêmes
  résultats.
- La Serialization dans les vues Json et Xml ont été déplacés vers
  ``_serialize()``.
- Les callbacks beforeRender et afterRender sont maintenant appelés dans
  les vues Json et Xml quand on utilise les templates de vue.
- :php:meth:`View::fetch()` a maintenant un agument ``$default``. Cet
  argument peut être utilisé pour fournir une valeur par défaut si
  un block doit être vide.
- :php:meth:`View::prepend()` a été ajouté pour permettre de mettre du contenu
  avant le block existant.
- :php:class:`XmlView` utilise maintenant la variable de vue ``_rootNode`` pour
  personnaliser le noeid XML de haut niveau.
- :php:meth:`View::elementExists()` a été ajoutée. Vous pouvez utiliser cette
  méthode pour vérifier si les elements existe avant de les utiliser.
- :php:meth:`View::element()` a une nouvelle option ``ignoreMissing``. Vous
  pouvez utiliser ceci pour supprimer les erreurs attrapées quand il manque
  des elements de vue.
- :php:meth:`View::startIfEmpty()` a été ajoutée.

Layout
------

- Le doctype pour les fichiers de layout dans le dossier app et les templates
  de bake dans le package cake a été changé de XHTML en HTML5.

Helpers
=======

- La nouvelle propriété ``Helper::$settings`` a été ajoutée pour votre
  configuration du helper. Le paramètre ``$settings`` de
  ``Helper::__construct()`` est fusionné avec ``Helper::$settings``.

FormHelper
----------

- :php:meth:`FormHelper::select()` accèpte maintenant une liste de valeurs
  dans l'attribut disabled. Combiné avec ``'multiple' => 'checkbox'``, cela
  vous permet de fournir une liste de valeurs que vous voulez désactiver.
- :php:meth:`FormHelper::postLink()` accèpte maintenant une clé ``method``.
  Cela vous permet de créer des formulaires en lien en utilisant d'autres
  méthodes HTTP que POST.
- Lors de la création d'inputs avec :php:meth:`FormHelper::input()`, vous
  pouvez maintenant définir l'option ``errorMessage`` à false. Ceci va
  désactiver l'affichage de message erreur, mais laisse les noms de classe
  d'erreur intact.
- Le FormHelper ajoute aussi l'attribut HTML5 ``required`` à vos elements
  d'input basé sur les règles de validation pour un champ. Si vous avez un
  bouton "Cancel" dans votre formulaire va soumettre le formulaire puis vous
  devriez ajouter ``'formnovalidate' => true`` à vos options de bouton pour
  empêcher le déclenchement de la validation dans le HTML. Vous pouvez aussi
  empêcher le déclenchement de la validation pour l'ensemble du formulaire
  en ajoutant ``'novalidate' => true`` dans les options de FormHelper::create().
- :php:meth:`FormHelper::input()` génère maintenant les elements d'input de
  type ``tel`` et ``email`` basé sur les noms de champ si l'option ``type``
  n'est pas spécifiée.

HtmlHelper
----------

- :php:meth:`HtmlHelper::getCrumbList()` a maintenant les options ``separator``,
  ``firstClass`` et ``lastClass``. Celles-ci vous permettent de mieux contrôler
  le HTML que cette méthode génère.

TextHelper
----------

- :php:meth:`TextHelper::tail()` a été ajoutée pour tronquer le texte en
  commençant par la fin.
- `ending` dans :php:meth:`TextHelper::truncate()` est déprécié en faveur
  de `ellipsis`.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` a maintenant une nouvelle option
  ``currentTag`` pour permettre de specifier une balise supplémentaire pour
  entourer le nombre de page courant.
- Pour les méthodes: :php:meth:`PaginatorHelper::prev()` et
  :php:meth:`PaginatorHelper::next()`, il est aussi maintenant possible de
  définir l'option ``tag`` à ``false`` pour désactiver le wrapper.
  Aussi une nouvelle option `disabledTag` a été ajoutée pour ces deux nouvelles
  méthodes.

Testing
=======

- Une fixture du coeur par défaut pour la table ``cake_sessions`` a été
  ajoutée. Vous pouvez l'utiliser en ajoutant ``core.cake_sessions`` à
  votre liste de fixture.
- :php:meth:`CakeTestCase::getMockForModel()` a été ajoutée. Ceci simplifie
  l'obtention des objets mock pour les models.

Utility
=======

CakeNumber
----------

- :php:meth:`CakeNumber::fromReadableSize()` a été ajoutée.
- :php:meth:`CakeNumber::formatDelta()` a été ajoutée.
- :php:meth:`CakeNumber::defaultCurrency()` a été ajoutée.

Folder
------

- :php:meth:`Folder::copy()` et :php:meth:`Folder::move()` supportent
  maintenant la possiblité de fusionner les répertoires de cible et de
  source en plus de sauter le suivant/écrire par dessus.

String
------

- :php:meth:`String::tail()` a été ajouté pour tronquer le texte en commençant
  par la fin.
- `ending` dans :php:meth:`String::truncate()` est déprécié en faveur
  de `ellipsis`.

Debugger
--------

- :php:meth:`Debugger::exportVar()` sort maintenant des propriétés private et
  protected dans PHP >= 5.3.0.

Security
--------

- Le support pour
  `bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_
  a été ajouté. Regardez la documentation de :php:class:`Security::hash()`
  pour plus d'informations sur la façon d'utiliser bcrypt.

Validation
----------

- :php:meth:`Validation::fileSize()` a été ajoutée.

ObjectCollection
----------------

- :php:meth:`ObjectCollection::attached()` a été dépréciée en faveur d'une
  nouvelle méthode :php:meth:`ObjectCollection::loaded()`. Ceci uniformise
  l'accès à ObjectCollection puisque load()/unload() remplace déjà
  attach()/detach().
