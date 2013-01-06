Inflector
#########

La classe Inflector prend une chaîne et peut la manipuler pour gérer les
variations de mots, telles que les pluralisations ou le *camelizing* et
elle est normalement accédée statiquement. Exemple :
``Inflector::pluralize('exemple')`` retourne "exemples".

Méthodes de la classe
=====================

 

Entrée

Sortie

pluralize

Pomme, Orange, Cheval, Homme

Pommes, Oranges, Chevaux, Hommes

singularize

Pommes, Oranges, Chevaux, Hommes

pomme, Orange, Cheval, Homme

camelize

Tarte\_aux\_pommes, quelque\_chose, chevaux\_cheval

tarteAuxPommes, quelqueChose, chevauxCheval

underscore

Il est à noter que la méthode underscore convertira uniquement les mots
formatés en camelCase. Les mots qui contiennent des espaces seront mis
en minuscules, mais ils n'auront pas d'underscore.

tarteAuxPommes, quelqueChose

tarte\_aux\_pommes, quelque\_chose

humanize

tarte\_aux\_pommes, quelque\_chose, chevaux\_cheval

Tarte aux pommes, Quelque chose, chevaux cheval

tableize

Pomme, UtilisateurProfilOption, Cheval

pommes, utilisateur\_profil\_options, chevaux

classify

pommes, utilisateur\_profil\_options, chevaux

Pomme, UtilisateurProfilOption, Cheval

variable

pommes, utilisateur\_resultat, chevaux\_chevaux

pommes, utilisateurResultat, chevauxChevaux

slug

Slug convertit les caractères spéciaux dans leur version latine et les
caractères inconnus, ainsi que les espaces en underscores. La méthode
slug attend un encodage UTF-8.

purée de pomme

puree\_de\_pomme
