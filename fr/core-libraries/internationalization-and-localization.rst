Internationalisation & Localisation
###################################

L'un des meilleurs moyen pour vos applications d'obtenir
un audience plus large est de gérer plusieurs langues.
Cela peut souvent se révéler être une tâche gigantesque,
mais les fonctionnalités d'internationalisation et de
localisation dans CalePHP rendront cela plus facile.

D'abord il est important de comprendre quelques terminologies.
*Internationalisation* ce réfère a la possibilité qu'a une
application pour répondre au besoin d'une langue (ou culture) 
spécifique.
Le terme *localisation* se réfère  a la possibilité qu'a une
application à être localisée. L'internationalisation et la 
localisation sont abrégées comme i18n et l10n respectivement;
18 et 10 sont le nombre de caractères entre le premier et le
dernier caractère.

Internationaliser Votre Application
===================================

Il n'y a que quelques étapes à franchir pour passer d'une application
mono-langue à une application multi-langue, la première est 
d'utiliser la fonction :php:func:`__()` dans votre code.
Ci dessous un exemple d'un code pour une application mono-langue::

    <h2>Posts</h2>

Pour internationaliser votre code, la seule chose à faire est d'entourer
la chaine dans :php:func:`__()` comme ceci::

    <h2><?php echo __('Posts') ?></h2>

Si vous ne faites rien de plus, ces deux bouts de codes donneront 
un résultat identique - ils renverront le même contenu au navigateur. 
La fonction :php:func:`__()` traduira la chaîne passée si une 
traduction est disponible, sinon elle la renverra non modifiée. 
Cela fonctionne exactement comme les autres implémentations Gettext 
`Gettext <http://en.wikipedia.org/wiki/Gettext>`_
(comme les autres fonctions de traductions, comme 
:php:func:`__d()` , :php:func:`__n()` etc)

Après avoir préparé votre code pour le multi-langue, l'étape suivante 
est de créer votre fichier pot 
`pot file <http://en.wikipedia.org/wiki/Gettext>`_, 
qui est le template pour toutes les chaînes traduisibles de votre 
application. Pour générer votre (vos) fichier(s) pot, tout ce que 
vous avez à faire est de lancer la tâche i18n 
:doc:`i18n console task </console-and-shells>`de la console Cake,
qui va chercher partout dans votre code où vous avez utilisé une 
fonction de traduction, et générer le(s) fichier(s) pot pour vous. 
Vous pouvez (et devez) relancer cette tâche console à chaque fois 
que vous changez les chaînes traduisibles dans votre code.

Le(s) fichier(s) pot eux mêmes ne sont pas utilisés par CakePHP, 
ils sont les templates utilisés pour créer ou mettre à jour vos 
fichiers po, `po files <http://en.wikipedia.org/wiki/Gettext>`_
qui contiennent les traductions. 
Cake cherchera vos fichiers po dans les dossiers suivants ::

    /app/Locale/<locale>/LC_MESSAGES/<domain>.po

Le domaine par défaut est 'default', donc votre dossier "locale" 
devrait ressembler à cela ::

    /app/Locale/eng/LC_MESSAGES/default.po (Anglais)   
    /app/Locale/fre/LC_MESSAGES/default.po (Français)   
    /app/Locale/por/LC_MESSAGES/default.po (Portugais) 

Pour créer ou éditer vos fichiers po, il est recommandé de ne pas 
utiliser votre éditeur de texte préféré. Pour créer un fichier po 
pour la première fois, il est possible de copier le fichier pot à 
l'endroit correct et de changer l'extension. *Cependant*, à moins 
que vous ne soyez familiarisé avec leur format, il est très facile 
de créer un fichier po invalide, ou de le sauver dans un mauvais 
encodage de caractères (si vous éditez ces fichiers manuellement, 
utilisez l'UTF-8 pour éviter les problèmes). Il y a des outils 
gratuits tel que PoEdit `PoEdit <http://www.poedit.net>`_ qui 
rendent les tâches d'édition et de mise à jour de vos fichiers po 
vraiment simples, spécialement pour la mise à jour d'un fichier po 
existant avec un fichier pot nouvellement mis à jour.

Les codes des locales en trois caractères suivent la norme 
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
mais si vous créez des locales régionales (en\_US, en\_GB, etc.) 
Cake les utilisera dans les cas appropriés.

Souvenez-vous que les fichiers po sont utiles pour des messages courts. 
Si vous pensez que vous aurez à traduire de longs paragraphes, 
ou des pages entières, vous devriez penser à l'implémentation 
d'une solution différente. Par ex ::


    <?php
    // // Code du fichier App Controller.
    public function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(VIEWS . $locale . DS . $this->viewPath)) {
            // utilise /app/views/fre/pages/tos.ctp au lieu de /app/views/pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

ou::

    <?php
    // code de la Vue
    echo $this->element(Configure::read('Config.language') . '/tos')


Localisation dans CakePHP
=========================

Pour changer ou définir le langage de votre application, tout ce que
vous avez à faire est dans la partie suivante::


    <?php
    Configure::write('Config.language', 'eng'); 

Ceci signale à Cake quelle locale utiliser(si vous utilisez une locale 
régionale, comme fr\_FR, la locale 
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_) sera 
utilisée au cas ou cela n'existerait pas), vous pouvez changer la langue
a n'importe quel moment pendant une requête.ex. dans votre bootstrap
si vous avez définis les paramètres de langue par défaut, dans la partie 
beforefilter de votre (app) controller si c'est spécifique à la requête ou
à l'utilisateur, ou en fait en tout lieu à tout moment avant de passer le
message dans une autre langue. Pour définir la langue pour l'utilisateur
courant, vous pouvez stocker le paramétrage dans l'objet Session, comme cela::


    <?php
    $this->Session->write('Config.language', 'fre');

Au début de chacune des requêtes dans la partie ``beforeFilter`` de votre
controller vous devez configurer ``Configure`` ainsi::


    <?php
    class AppController extends Controller{
        public function beforeFilter() {
            Configure::write('Config.language', $this->Session->read('Config.language'));
        }
    }

En faisant cela vous assurerez que :php:class:`I18n` et
:php:class:`TranslateBehavior` accèdent aux même valeurs
de langue.

C'est une bonne idée de rendre du contenu public disponible dans 
plusieurs langues à partir d'une url unique - il deviendra plus
facile pour les utilisateurs (et les moteurs de recherches) de trouver
ce qu'ils sont venus chercher dans la langue souhaitée.
Il y a plusieurs moyen de faire cela, en utilisant un sous
domaine de langue spécifique (en.exemple.com,fra.exemple.com, etc.),
ou en utilisant un préfixe à l'url comme c'est le cas avec cette 
application. Vous pourriez également souhaitez glaner l'information
depuis l'agent de navigation (browser agent) de l'utilisateur, entre
autres choses. 

Comme mentionné dans la section précédente, l'affichage des contenus
localisés est effectué en utilisant la fonction pratique
:php:func:`__()`, ou une des autres fonctions  de traduction qui sont
globalement disponibles, mais probablement la plus utilisée dans vos
vues. Le premier paramètre de la fonction est utilisé comme le
msgid défini dans les fichiers .po.

CakePHP suppose automatiquement que tous les messages d'erreur de 
validation de votre model dans votre tableau ``$validate`` sont 
destinés à être localisées.
En exécutant la console i18n ces chaînes seront elles aussi
extraites.

Il y a d'autres aspects de localisation de votre application qui
ne sont pas couverts par l'utilisation des fonctions de traduction,
ce sont les formats date/monnaie. N'oubliez pas que CakePHP est PHP :),
donc pour définir les formats de ses éléments vous devez utiliser
`setlocale <http://www.php.net/setlocale>`_.

Si vous passez une locale qui n'existe pas sur votre ordinateur
`setlocale <http://www.php.net/setlocale>`_ cela n'aura aucun effet.
Vous pouvez trouver la liste des locales disponibles en exécutant 
la commande ``locale -a`` dans un terminal.


.. meta::
    :title lang=fr: Internationalization & Localization
    :keywords lang=fr: internationalization localization,internationalization and localization,localization features,language application,gettext,l10n,daunting task,adaptation,pot,i18n,audience,traduction,languages
