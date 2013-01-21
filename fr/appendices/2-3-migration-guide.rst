2.3 Guide de Migration
######################

CakePHP 2.3 est une mise à jour de l'API complètement compatible à partir de 
2.2. Cette page souligne les changements et les améliorations faits dans 2.3.

Constantes
----------

Une application peut maintenant facileemnt définir :php:const:`CACHE` et 
:php:const:`LOGS`, puisqu'ils sont maintenant définis de façon conditionnelle 
par CakePHP.

Mise en Cache
=============

- FileEngine est toujours le moteur de cache par défaut. Dans le passé, un 
  certain nombre de personnes a des difficultés configurant et déployant 
  APC correctement des deux façons en cli et web. L'utilisation des 
  fichiers devrait rendre la configuration de CakePHP plus simple pour 
  les nouveaux développeurs.

Component
=========

AuthComponent
-------------

- Un nouvel adaptateur d'authenticate a été ajouté pour le support de hash 
  blowfish/bcrypt hashed des mots de passe. Vous pouvez maintenant utiliser
  ``Blowfish`` dans votre tableau ``$authenticate`` pour permettre aux mots 
  de passe bcrypt d'être utilisés.

PaginatorComponent
------------------

- PaginatorComponent support maintenant l'option ``findType``. Ceci peut être 
  utilisé pour spécifier quelle méthode find vous voulez utiliser pour la 
  pagination. C'est un peu plus facile de manager et de définir que l'index 
  0ième.
  
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

Configure
---------

- :php:meth:`Configure::check()` a été ajouté. Cette méthode fonctionne de la 
  manière que :php:meth:`CakeSession::check()`.

Error
=====

Exceptions
----------

- CakeBaseException a été ajouté, auquel toutes les Exceptions du coeur 
  étendent. La classe d'Exception de base introduit aussi la méthode 
  ``responseHeader()`` qui peut être appelée sur les instances d'Exception 
  créees pour ajouter les headers à la réponse, puisque les Exceptions 
  ne réutilisent pas toute instance de réponse.

Model
=====

- Le support pour le type biginteger a été ajouté pour toutes les sources de 
  données du coeur, et les fixtures.
- Support pour les indices ``FULLTEXT`` a été ajouté pour le driver MySQL.


Model
-----

- ``Model::find('list')`` définit maintenant ``recursive`` basé sur le 
  containment depth max ou la valeur récursive. Quand la liste est utilisée avec 
  ContainableBehavior.

Validation
----------

- Les méthodes de manque pour les validations vont **toujours** maintenant
  attraper les erreurs au lieu de le faire seulement en mode développement.

Network
=======

SmtpTransport
-------------

- Le support TLS/SSL a été ajouté pour les connections SMTP.

CakeRequest
-----------

- :php:meth:`CakeRequest::onlyAllow()` a été ajouté.
- :php:meth:`CakeRequest::query()` a été ajouté.

CakeResponse
------------

- :php:meth:`CakeResponse::file()` a été ajouté.

CakeEmail
---------

- L'option ``contentDisposition`` a été ajoutée à
  :php:meth:`CakeEmail::attachments()`. Cela vous permet de désactiver 
  le header Content-Disposition ajouté aux fichiers joints.

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
  ``_serialize()``
- Les callbacks beforeRender et afterRender sont maintenant appelés dans 
  les vues Json et Xml quand on utilise les templates de vue.
- :php:meth:`View::fetch()` a maintenant un agument ``$default``. Cet 
  argument peut être utilisé pour fournir une valeur par défaut si 
  un block doit être vide.
- :php:meth:`View::prepend()` a été ajouté pour permettre de mettre du contenu 
  avant le block existant.

Helpers
=======

FormHelper
----------

- :php:meth:`FormHelper::select()` accèpte maintenant une liste de valeurs 
  dans l'attribut disabled. Combiné avec ``'multiple' => 'checkbox'``, cela 
  vous permet de fournir une liste de valeurs que vous voulez désactiver.
- :php:meth:`FormHelper::postLink()` accèpte maintenant une clé ``method``. 
  Cela vous permet de créer des formulaires en lien en utilisant d'autres 
  méthodes HTTP que POST.

TextHelper
----------

- :php:meth:`TextHelper::tail()` a été ajouté pour tronquer le texte en 
  commençant par la fin.
- `ending` dans :php:meth:`TextHelper::truncate()` est déprécié en faveur 
  de `ellipsis`

Testing
=======

- Une fixture du coeur par défaut pour la table ``cake_sessions`` a été 
  ajoutée. Vous pouvez l'utiliser en ajoutant ``core.cake_sessions`` à 
  votre liste de fixture.

Utility
=======

CakeNumber
----------

- :php:meth:`CakeNumber::fromReadableSize()` a été ajouté.
- :php:meth:`CakeNumber::formatDelta()` a été ajouté.

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
  de `ellipsis`

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

- :php:meth:`Validation::fileSize()` a été ajoutée
