Internationalisation et Localisation
####################################

L'une des meilleures façons pour que vos applications touchent une
audience plus large est de s'adresser à des langues multiples. Cela peut
souvent s'avérer décourageant, mais les outils d'internationalisation et
de localisation de CakePHP rendent cela plus facile.

Tout d'abord, il est important de comprendre la terminologie.
*Internationalisation* désigne la capacité d'une application d'être
localisée. Le terme *localisation* désigne l'adaptation d'une
application pour qu'elle corresponde aux besoins d'une langue (ou d'une
culture) spécifique (i.e., une "locale"). Internationalisation et
localisation sont souvent abréviées respectivement en i18n et l10n ; 18
et 10 sont le nombre de caractères entre le premier et le dernier
caractère.

Localiser votre Application
===========================

Localiser votre Application

Il n'y a que quelques étapes à franchir pour passer d'une application
uni-langue à une application multi-langue, dont la première est
d'utiliser la fonction
```__()`` <https://api.cakephp.org/file/basics.php#function-__>`_ dans
votre code. Ci-dessous, un exemple de code pour une application
uni-langue :

::

    <h2>Posts</h2>

Pour localiser votre code, tout ce que vous devez faire est d'inclure
vos chaînes de caractères dans `la fonction de
traduction <https://api.cakephp.org/file/basics.php#function-__>`_ comme
suit :

::

    <h2><?php __('Posts') ?></h2>

Si vous ne faites rien de plus, ces deux bouts de codes donneront un
résultat identique - ils renverront le même contenu au navigateur. La
fonction
```__()`` <https://api.cakephp.org/file/basics.php#function-__>`_
traduira la chaîne passée si une traduction est disponible, sinon elle
la renverra non modifiée. Cela fonctionne exactement comme les autres
implémentations `Gettext <https://en.wikipedia.org/wiki/Gettext>`_ (comme
les autres fonctions de traductions, comme
```__d()`` <https://api.cakephp.org/file/basics.php#function-__d>`_,\ ```__n()`` <https://api.cakephp.org/file/basics.php#function__n>`_
etc)

Après avoir préparé votre code pour le multi-langue, l'étape suivante
est de créer votre `fichier
pot <http://fr.wikipedia.org/wiki/Gettext>`_, qui est le template pour
toutes les chaînes traduisibles de votre application. Pour générer votre
(vos) fichier(s) pot, tout ce que vous avez à faire est de lancer `la
tâche i18n de la console
Cake <https://book.cakephp.org/fr/view/620/Core-Console-Applications>`_,
qui va chercher partout dans votre code où vous avez utilisé une
fonction de traduction, et générer le(s) fichier(s) pot pour vous. Vous
pouvez (et devez) relancer cette tâche console à chaque fois que vous
changez les chaînes traduisibles dans votre code.

Le(s) fichier(s) pot ne sont pas utilisés par CakePHP, ils sont les
templates utilisés pour créer ou mettre à jour vos `fichiers
po <http://fr.wikipedia.org/wiki/Gettext>`_, qui contiennent les
traductions. Cake cherchera après vos fichiers po dans les dossiers
suivants :

::

    /app/locale/<locale>/LC_MESSAGES/<domaine>.po

Le domaine par défaut est 'default', donc votre dossier "locale" devrait
ressembler à cela :

::

    /app/locale/eng/LC_MESSAGES/default.po (Anglais)
    /app/locale/fre/LC_MESSAGES/default.po (Français)
    /app/locale/por/LC_MESSAGES/default.po (Portugais)

Pour créer ou éditer vos fichiers po, il est recommandé de *ne pas*
utiliser votre éditeur de texte préféré. Pour créer un fichier po pour
la première fois, il est possible de copier le fichier pot à l'endroit
correcte et de changer l'extension. *Cependant*, à moins que vous ne
soyez familiarisé avec leur format, il est très facile de créer un
fichier po invalide, ou de le sauver dans un mauvais encodage de
caractères (si vous éditez ces fichiers manuellement, utilisez l'UTF-8
pour éviter les problèmes). Il y a des outils gratuits tel que
`PoEdit <http://www.poedit.net>`_ qui rendent les tâches d'édition et de
mise à jour de vos fichiers po vraiment simples, spécialement pour la
mise à jour d'un fichier po existant avec un fichier pot nouvellement
mis à jour.

Les codes des locales en trois caractères suivent la norme `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ mais
si vous créez des locales régionales (en\_US, en\_GB, etc.) Cake les
utilisera dans les cas appropriés.

Il y a une limite de 1014 caractères pour chaque valeur *msgstr*.

Souvenez-vous que les fichiers po sont utiles pour des messages courts.
Si vous pensez que vous aurez à traduire de longs paragraphes, ou des
pages entières, vous devriez penser à l'implémentation d'une solution
différente. Par ex :

::

    // Code du fichier App Controller.
    function beforeFilter() {
      $locale = Configure::read('Config.language');
      if ($locale && file_exists(VIEWS . $locale . DS . $this->viewPath)) {
        // utilise /app/views/fre/pages/tos.ctp au lieu de /app/views/pages/tos.ctp
        $this->viewPath = $locale . DS . $this->viewPath;
      }
    }

ou

::

    // Code de vue
    echo $this->element(Configure::read('Config.language') . '/tos')

L'internationalisation dans CakePHP
===================================

Utiliser des données locales dans votre application est simple. La
première étape consiste à préciser à CakePHP quelle langue l'application
doit utiliser pour délivrer le contenu. Cela peut-être fait,
entre-autres, en détectant les sous-domaines (en.exemple.com ou
fra.exemple.com) ou en récupérant l'agent utilisateur du navigateur.

C'est mieux de faire le changement de langue dans le contrôleur :

::

    $this->L10n = new L10n();
    $this->L10n->get("fra");

Vous pourriez avoir envie de placer ce code dans le beforeFilter pour
que chaque action du contrôleur soit affichée dans la langue correcte ou
bien vous pourriez vouloir le placer dans une action qui manipule
l'authentification ou le changement de langue par défaut.

L'affichage localisé d'un contenu se fait en utilisant la fonction
pratique \_\_(). Cette fonction est disponible globalement, mais elle
sera probablement mieux utilisée dans vos vues. Le premier paramètre de
la fonction est le msgid défini dans les fichiers .po. Le contenu
localisé est par défaut affiché (par un echo), mais un second paramètre
optionnel entraîne à la place, le retour de la valeur (utile pour le
surlignement ou les liens utilisant le TextHelper par exemple). Le court
exemple ci-dessous montre comment afficher du contenu local en utilisant
la fonction \_\_(). Le rendu exact dépend de la locale qui a été
sélectionnée en utilisant la classe L10n et de la définition active de
la configuration.

::

    <?php __("achat"); ?>

Souvenez-vous d'utiliser le paramètre d'échappement des différentes
méthodes du helper si vous envisagez d'utiliser les données localisées
comme une partie d'un appel de méthode du helper. Remarquez l'usage du
second paramètre de \_\_() pour retourner la donnée au lieu de la rendre
par un echo () :

::

    <?php
    echo $form->error(
        'Carte.numeroCarte',
        __("erreurNumeroCarte", true),
        array('escape' => false)
    );
    ?>

Si vous aimeriez avoir tous vos messages d'erreurs traduits par défaut,
une solution simple serait d'ajouter le code suivant dans votre
app\_model.php :

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }

