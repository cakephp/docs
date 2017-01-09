Internationalisation & Localisation
###################################

L'une des meilleurs façons pour que votre application ait une audience plus
large est de gérer plusieurs langues. Cela peut souvent se révéler être une
tâche gigantesque, mais les fonctionnalités d'internationalisation et de
localisation dans CakePHP rendront cela plus facile.

D'abord il est important de comprendre quelques terminologies.
*Internationalisation* se réfère a la possibilité qu'a une application d'être
localisée. Le terme *localisation* se réfère à l'adaptation qu'a une
application de répondre aux besoins d'une langue (ou culture) spécifique
(par ex: un "locale"). L'internationalisation et la localisation sont souvent
abrégées en respectivement i18n et l10n; 18 et 10 sont le nombre de caractères
entre le premier et le dernier caractère.

Internationaliser Votre Application
===================================

Il n'y a que quelques étapes à franchir pour passer d'une application
mono-langue à une application multi-langue, la première est
d'utiliser la fonction :php:func:`__()` dans votre code.
Ci-dessous un exemple d'un code pour une application mono-langue::

    <h2>Posts</h2>

Pour internationaliser votre code, la seule chose à faire est d'entourer
la chaîne avec :php:func:`__()` comme ceci::

    <h2><?php echo __('Posts') ?></h2>

Si vous ne faîtes rien de plus, ces deux bouts de codes donneront un résultat
identique - ils renverront le même contenu au navigateur.
La fonction :php:func:`__()` traduira la chaîne passée si une
traduction est disponible, sinon elle la renverra non modifiée.
Cela fonctionne exactement comme les autres implémentations Gettext
`Gettext <https://en.wikipedia.org/wiki/Gettext>`_
(comme les autres fonctions de traductions, comme
:php:func:`__d()` , :php:func:`__n()` etc).

Après avoir préparé votre code pour le multi-langue, l'étape suivante
est de créer votre fichier pot
`pot file <https://en.wikipedia.org/wiki/Gettext>`_,
qui est le template pour toutes les chaînes traduisibles de votre application.
Pour générer votre (vos) fichier(s) pot, tout ce que vous avez à faire est de
lancer la tâche i18n :doc:`i18n console task </console-and-shells/i18n-shell>`
de la console Cake, qui va chercher partout dans votre code où vous avez utilisé
une fonction de traduction, et générer le(s) fichier(s) pot pour vous.
Vous pouvez (et devez) relancer cette tâche console à chaque fois
que vous changez les chaînes traduisibles dans votre code.

Le(s) fichier(s) pot eux mêmes ne sont pas utilisés par CakePHP, ils sont les
templates utilisés pour créer ou mettre à jour vos fichiers po,
`po files <https://en.wikipedia.org/wiki/Gettext>`_ qui contiennent les
traductions. CakePHP cherchera vos fichiers po dans les dossiers suivants::

    /app/Locale/<locale>/LC_MESSAGES/<domain>.po

Le domaine par défaut est 'default', donc votre dossier "locale"
devrait ressembler à cela::

    /app/Locale/eng/LC_MESSAGES/default.po (Anglais)
    /app/Locale/fra/LC_MESSAGES/default.po (Français)
    /app/Locale/por/LC_MESSAGES/default.po (Portugais)

Pour créer ou éditer vos fichiers po, il est recommandé de ne pas utiliser
votre éditeur de texte préféré. Pour créer un fichier po pour la première fois,
il est possible de copier le fichier pot à l'endroit correct et de changer
l'extension. *Cependant*, à moins que vous ne soyez familiarisé avec leur
format, il est très facile de créer un fichier po invalide, ou de le sauver
dans un mauvais encodage de caractères (si vous éditez ces fichiers
manuellement, utilisez l'UTF-8 pour éviter les problèmes). Il y a des outils
gratuits tel que PoEdit `PoEdit <http://www.poedit.net>`_ qui rendent les
tâches d'édition et de mise à jour de vos fichiers po vraiment simples,
spécialement pour la mise à jour d'un fichier po existant avec un fichier pot
nouvellement mis à jour.

Les codes des locales en trois caractères suivent la norme
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
mais si vous créez des locales régionales (`en\_US`, `en\_GB`, etc.)
CakePHP les utilisera dans les cas appropriés.

.. warning::

    Dans 2.3 et 2.4, certains codes de langues ont été corrigés pour
    correspondre au standard ISO.
    Merci de regarder les guides de migrations correspondants pour plus de
    détails.

Souvenez-vous que les fichiers po sont utiles pour des messages courts.
Si vous pensez que vous aurez à traduire de longs paragraphes,
ou des pages entières, vous devriez penser à l'implémentation
d'une solution différente. Par ex::

    // Code du fichier App Controller.
    public function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(APP . 'View' . DS . $locale . DS . $this->viewPath . DS . $this->view . $this->ext)) {
            // utilise /app/views/fra/pages/tos.ctp au lieu de /app/views/pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

ou::

    // code de la Vue
    echo $this->element(Configure::read('Config.language') . '/tos')

.. _lc-time:

Pour la traduction de chaînes de catégorie LC_TIME, CakePHP utilise des fichiers
POSIX compliant LC_TIME. Les fonctions i18n de la classe d'utilitaire
:php:class:`CakeTime` et le helper :php:class:`TimeHelper` utilise ces fichiers
LC_TIME.

Placez juste le fichier LC_TIME dans son répertoire local respectif::

    /app/Locale/fra/LC_TIME (French)
    /app/Locale/por/LC_TIME (Portuguese)

Vous pouvez trouver ces fichiers pour quelques langues populaires à partir du
dépôt officiel `Localized <https://github.com/cakephp/localized>`_.

Internationaliser les plugins CakePHP
=====================================

Si vous souhaitez inclure des fichiers traduits dans votre application, vous
aurez besoin de suivre quelques conventions.

Au lieu de `__()` et `__n()` vous devrez utiliser `__d()` et `__dn()`. Le D
signifie domain. Donc si vous avez un plugin appelé 'DebugKit' vous devrez faire
ceci::

    __d('debug_kit', 'My example text');

Utiliser la syntaxe en underscore est important, si vous ne l'utilisez pas,
CakePHP ne trouvera pas votre fichier de traduction.

Votre fichier de traduction pour cet exemple devra être dans::

    /app/Plugin/DebugKit/Locale/<locale>/LC_MESSAGES/<domain>.po

Et pour les autres langues par rapport à celle par défaut::

    /app/Plugin/DebugKit/Locale/eng/LC_MESSAGES/debug_kit.po (English)
    /app/Plugin/DebugKit/Locale/fra/LC_MESSAGES/debug_kit.po (French)
    /app/Plugin/DebugKit/Locale/por/LC_MESSAGES/debug_kit.po (Portuguese)

La raison pour cela est que CakePHP va utiliser le nom du plugin en minuscule
et avec des underscores, pour le comparer avec le domaine de traduction et va
regarder dans le plugin si il y a une correspondance pour le fichier de
traduction donné.

Controller l'Ordre de Traduction
================================

La valeur de configuration ``I18n.preferApp`` peut maintenant être utilisée
pour controller l'ordre des traductions. Si défini à true, les traductions
de l'application seront préférées à celles des plugins::

    Configure::write('I18n.preferApp', true);

Défini à ``false`` par défaut.

.. versionadded:: 2.6

Localisation dans CakePHP
=========================

Pour changer ou définir le langage de votre application, tout ce que
vous avez à faire est dans la partie suivante::

    Configure::write('Config.language', 'fra');

Ceci signale à CakePHP quelle locale utiliser (si vous utilisez une locale
régionale, comme `fr\_FR`, la locale
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_) sera
utilisée au cas où cela n'existerait pas), vous pouvez changer la langue
à n'importe quel moment pendant une requête. Ex: dans votre bootstrap
si vous avez défini les paramètres de langue par défaut, dans la partie
beforefilter de votre (app) controller si c'est spécifique à la requête ou
à l'utilisateur, ou en fait en tout lieu à tout moment avant de passer le
message dans une autre langue. Pour définir la langue pour l'utilisateur
courant, vous pouvez stocker le paramétrage dans l'objet Session, comme cela::

    $this->Session->write('Config.language', 'fra');

Au début de chacune des requêtes dans la partie ``beforeFilter`` de votre
controller vous devez configurer ``Configure`` ainsi::

    class AppController extends Controller{
        public function beforeFilter() {
            if ($this->Session->check('Config.language')) {
                Configure::write('Config.language', $this->Session->read('Config.language'));
            }
        }
    }

En faisant cela vous assurerez que :php:class:`I18n` et
:php:class:`TranslateBehavior` accèdent aux même valeurs de langue.

C'est une bonne idée de rendre du contenu public disponible dans
plusieurs langues à partir d'une URL unique - il deviendra plus
facile pour les utilisateurs (et les moteurs de recherches) de trouver
ce qu'ils sont venus chercher dans la langue souhaitée.
Il y a plusieurs moyens de faire cela, en utilisant un sous
domaine de langue spécifique (en.exemple.com,fra.exemple.com, etc.),
ou en utilisant un préfixe à l'URL comme c'est le cas avec cette
application. Vous pourriez également souhaitez glaner l'information
depuis l'agent de navigation (browser agent) de l'utilisateur, entre
autres choses.

Comme mentionné dans la section précédente, l'affichage des contenus
localisés est effectué en utilisant la fonction pratique
:php:func:`__()`, ou une des autres fonctions de traduction qui sont
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
`setlocale <https://secure.php.net/setlocale>`_.

Si vous passez une locale qui n'existe pas sur votre ordinateur
`setlocale <https://secure.php.net/setlocale>`_ cela n'aura aucun effet.
Vous pouvez trouver la liste des locales disponibles en exécutant
la commande ``locale -a`` dans un terminal.

Traduire les erreurs de validation de model
===========================================
CakePHP va automatiquement extraire l'erreur de validation quand vous utilisez
:doc:`i18n console task </console-and-shells>`. Par défaut, le domaine default
est utilisé. Ceci peut être surchargé en configurant la propriété
``$validationDomain`` dans votre model::

    class User extends AppModel {

        public $validationDomain = 'validation_errors';
    }

Les paramètres supplémentaires définis dans la règle de validation sont passés
à la fonction de traduction. Cela vous permet de créer des messages de
validation dynamiques::

    class User extends AppModel {

        public $validationDomain = 'validation';

        public $validate = array(
            'username' => array(
                    'length' => array(
                    'rule' => array('between', 2, 10),
                    'message' => 'Username devrait être entre %d et %d caractères'
                )
            )
        )
    }

Ce qui va faire l'appel interne suivant::

    __d('validation', 'Username devrait être entre %d et %d caractères', array(2, 10));


.. meta::
    :title lang=fr: Internationalization & Localization
    :keywords lang=fr: internationalization localization,internationalization et localization,localization features,language application,gettext,l10n,daunting task,adaptation,pot,i18n,audience,traduction,languages
