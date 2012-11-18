Constantes et fonctions globales
################################

Tandis que la plupart de votre travail avec CakePHP se basera sur les
classes et les méthodes du *Core*, CakePHP dispose d'un certain nombre
de fonctions utiles qui seront à votre portée de main pour faciliter
votre travail. La plupart de ces fonctions sont utilisées avec les
classes CakePHP (en chargeant un modèle ou une classe de composants), et
les autres vous faciliteront le travail avec les tableaux et les chaînes
de caractères.

Nous allons aussi couvrir la plupart des constantes contenues dans les
applications CakePHP. Utiliser ces constantes vous permettra de rendre
vos mises-à-jour plus rapides, mais sont également un moyen pratique de
pointer vers certains fichiers ou répertoires de votre application
CakePHP.

Fonctions globales
==================

Voici des fonctions de CakePHP qui sont disponibles globalement. La
plupart d'entre elles sont des raccourcis pratiques pour des fonctions
PHP dont le nom est long, mais quelques-unes (comme ``uses()``) peuvent
être utilisées pour inclure du code ou exécuter d'autres fonctions
utiles. Si vous êtes constamment en attente d'une fonction pour
accomplir une tâche fréquemment utilisée, c'est ici que ça se passe.

\_\_
----

``__(string $string_id, boolean $return =  false)``

Cette fonction s'occupe de la localisation dans les applications
CakePHP. Le paramètre ``$string_id`` identifie l'ID pour une traduction
et le second paramètre vous permet de déterminer si la fonction affiche
automatiquement la chaîne (c'est le comportement par défaut) ou si elle
la retourne pour effectuer d'autres traitements (passer un booléen true
pour activer ce comportement).

Lisez la section `Localisation &
Internationalisation </fr/view/161/localisation-internationalisation>`_
pour plus d'information.

a
-

``a(mixed $one, $two, $three...)``

Retourne un tableau des paramètres utilisés pour appeler la fonction.

::

    print_r(a('un', 'deux')); 

    // affiche :
    array(
       [0] => 'un',
       [1] => 'deux'
    )

aa
--

``aa(array $un, $deux, $trois...)``

Utilisez pour créer des tableaux associatifs formés par les paramètres
utilisés pour appeler la fonction.

Utilisé pour créer des tableaux associatifs formés de paramètres
utilisés pour appeler la fonction enveloppante.

::

    echo aa('a','b'); 

    // affiche :
    array(
        'a' => 'b'
    )

am
--

``am(array $one, $two, $three...)``

Fusionne tous les tableaux passés comme paramètres et retourne le
tableau résultant.

config
------

Peut être utilisé pour charger des fichiers depuis le dossier ``config``
de votre application via include\_once. La fonction vérifie l'existence
du fichier avant de l'inclure et retourne un booléen. Prends un nombre
optionnel d'arguments.

Exemple : ``config('un_fichier', 'maconfig');``

convertSlash
------------

``convertSlash(string $string)``

Convertit les *slashes* en *underscores* et supprime le premier et le
dernier *underscores* dans une chaîne. Retourne la chaîne convertie.

debug
-----

``debug(mixed $var, boolean $showHtml = false)``

Si le niveau de DEBUG de l'application est différent de zéro, ``$var``
est affiché. Si ``$showHTML`` est vrai, la donnée est formatée pour être
visualisée facilement dans un navigateur.

e
-

``e(mixed $data)``

Raccourci pratique pour ``echo()``.

env
---

``env(string $key)``

Récupère une variable d'environnement depuis les sources disponibles.
Utilisé en secours si ``$_SERVER`` ou ``$_ENV`` sont désactivés.

Cette fonction émule également PHP\_SELF et DOCUMENT\_ROOT sur les
serveurs ne les supportant pas. En fait, c'est une bonne idée de
toujours utiliser ``env()`` plutôt que ``$_SERVER`` ou ``getenv()``
(notamment si vous prévoyez de distribuer le code), puisque c'est un
*wrapper* d'émulation totale.

fileExistsInPath
----------------

``fileExistsInPath(string $fichier)``

Vérifie que le fichier donné est dans le include\_path PHP actuel.
Renvoie une valeur booléenne.

h
-

``h(string $texte, string $charset = null)``

Raccourci pratique pour ``htmlspecialchars()``.

ife
---

``ife($condition, $siNonVide, $siVide)``

Utilisé pour des opérations de styles ternaires. Si ``$condition`` n'est
pas vide, ``$siNonVide`` est retourné, sinon ``$siVide`` est retourné.

low
---

``low(string $chaine)``

Raccourci pratique pour ``strtolower()``.

pr
--

``pr(mixed $var)``

Raccourci pratique pour ``print_r()``, avec un ajout de balises <pre>
autour du résultat (sortie).

r
-

``r(string $recherche, string $remplace, string  $sujet)``

Raccourci pratique pour ``str_replace()``.

stripslashes\_deep
------------------

``stripslashes_deep(array $valeur)``

Enlève récursivement les slashes de la ``$valeur`` passée. Renvoie le
tableau modifié.

up
--

``up(string $chaine)``

Raccourci pratique pour ``strtoupper()``.

uses
----

``uses(string $lib1, $lib2, $lib3...)``

Utilisé pour charger les librairies du cœur de CakePHP (trouvables dans
cake/libs/). Passer le nom du fichier de librairie sans l'extension
'.php'.

Définition des Constantes du Cœur
=================================

Constante

Chemin absolu vers les éléments suivants :

APP

répertoire racine.

APP\_PATH

répertoire de l'application.

CACHE

répertoire des fichiers de cache.

CAKE

répertoire cake.

COMPONENTS

répertoire des composants (*components*).

CONFIGS

répertoire des fichiers de configuration.

CONTROLLER\_TESTS

répertoire des tests de contrôleurs.

CONTROLLERS

répertoires des contrôleurs.

CSS

répertoire des fichiers CSS.

DS

Raccourci pour la constante PHP DIRECTORY\_SEPARATOR, qui est égale à
"/" pour Linux et "\\" pour Windows.

ELEMENTS

répertoire des éléments.

HELPER\_TESTS

répertoire des tests d'assistant (*helper*).

HELPERS

répertoire des assistants (*helpers*).

IMAGES

répertoire des images.

INFLECTIONS

répertoire des inflexions (habituellement à l'intérieur du répertoire de
configuration).

JS

répertoire des fichiers JavaScript (dans le *webroot*).

LAYOUTS

répertoire des mises en pages (*layouts*).

LIB\_TESTS

répertoire des tests de la Librairie CakePHP.

LIBS

répertoire des librairies de CakePHP.

LOGS

répertoire des logs (dans app).

MODEL\_TESTS

répertoire des tests de modèle.

MODELS

répertoire des modèles.

SCRIPTS

répertoire des scripts Cake.

TESTS

répertoire des tests (répertoire parent des répertoires test des
modèles, contrôleurs, etc.)

TMP

répertoire tmp.

VENDORS

répertoire *vendors*.

VIEWS

répertoire des vues.

WWW\_ROOT

chemin absolu vers le *webroot*.
