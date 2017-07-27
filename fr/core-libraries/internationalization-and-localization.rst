Internationalisation & Localisation
###################################

L'une des meilleures façons pour qu'une application ait une audience plus large
est de gérer plusieurs langues. Cela peut souvent se révéler être une tâche
gigantesque, mais les fonctionnalités d'internationalisation et de localisation
dans CakePHP rendront cela plus facile.

D'abord il est important de comprendre quelques terminologies.
*Internationalisation* se réfère à la possibilité qu'a une application d'être
localisée. Le terme *localisation* se réfère à l'adaptation qu'a une application
de répondre aux besoins d'une langue (ou culture) spécifique (par ex: un
"locale"). L'internationalisation et la localisation sont souvent abrégées en
respectivement i18n et l10n; 18 et 10 correspondent au nombre de caractères
entre le premier et le dernier caractère respectivement pour
internationalisation et localisation.

Internationaliser Votre Application
===================================

Il n'y a que quelques étapes à franchir pour passer d'une application
mono-langue à une application multi-langue, la première est d'utiliser la
fonction :php:func:`__()` dans votre code. Ci-dessous un exemple d'un code pour
une application mono-langue::

    <h2>Popular Articles</h2>

Pour internationaliser votre code, la seule chose à faire est d'entourer
la chaîne avec :php:func:`__()` comme ceci::

    <h2><?= __('Popular Articles') ?></h2>

Si vous ne faîtes rien de plus, ces deux bouts de codes donneront un résultat
identique - ils renverront le même contenu au navigateur.
La fonction :php:func:`__()` traduira la chaîne passée si une traduction est
disponible, sinon elle la renverra non modifiée.

Fichiers de Langues
-------------------

Les traductions peuvent être mises à disposition en utilisant des fichiers de
langue stockés dans votre application. Le format par défaut pour ces fichiers
est le format `Gettext <http://en.wikipedia.org/wiki/Gettext>`_.
Ces fichiers doivent être placés dans **src/Locale/** et dans ce répertoire, il
devrait y avoir un sous-dossier par langue que l'application doit prendre en
charge::

    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

Le domaine par défaut est 'default', votre dossier ``locale`` devrait donc
contenir au minimum le fichier ``default.po`` (cf. ci-dessus). Un domaine se
réfère à un regroupement arbitraire de messages de traduction. Si aucun groupe
n'est utilisé, le groupe par défaut est sélectionné.

Les messages du coeur extraits de la libairie CakePHP peuvent être stockés
séparément dans un fichier **cake.po** dans **src/Locale/**.
La `librairie localized de CakePHP <https://github.com/cakephp/localized>`_
contient des traductions des chaînes de caractère du coeur (du domaine cake)
pour l'interface client. Pour utiliser ces fichiers, liez les ou copiez les au
bon endroit : **src/Locale/<locale>/cake.po**. Si votre locale est incomplète ou
incorrecte, vous pouvez nous envoyer une PR dans ce dépôt pour corriger les
erreurs.

Les plugins peuvent également contenir des fichiers de traduction, la convention
est d'utiliser la version ``under_scored`` du nom du plugin comme domaine de la
traduction des messages::

    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po

Les dossiers de traduction peuvent être composées d'un code à deux lettres ISO
de la langue ou du nom de la locale, par exemple ``fr_FR``, ``es_AR``,
``da_DK``, qui contient en même temps la langue et le pays où elle est parlée.

Un fichier de traduction pourrait ressembler à ceci :

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

Extraire les Fichiers Pot avec le Shell I18n
--------------------------------------------

Pour créer les fichiers pot à partir de `__()` et des autres types de messages
internationalisés qui se trouvent dans votre code, vous pouvez utiliser le shell
i18n. Vous pouvez consulter le
:doc:`chapitre suivant </console-and-shells/i18n-shell>` pour en savoir plus.

Définir la Locale par Défaut
----------------------------

La ``locale`` par défaut se détermine dans le fichier **config/app.php** en
définissant ``App.defaultLocale``::

    'App' => [
        ...
        'defaultLocale' => env('APP_DEFAULT_LOCALE', 'en_US'),
        ...
    ]

Cela permet de contrôler plusieurs aspects de votre application, incluant la
langue de traduction par défaut, le format des dates, des nombres, et devises à
chaque fois qu'un de ces éléments s'affiche, en utilisant les bibliothèques de
localisation fournies par CakePHP.

Modifier la Locale pendant l'Exécution
--------------------------------------

Pour changer la langue des chaines de caractères traduites, vous pouvez appeler
cette méthode::

    use Cake\I18n\I18n;

    // Avant 3.5, utilisez I18n::locale()
    I18n::setLocale('de_DE');

Cela changera également le formatage des nombres et des dates lorsque vous
utilisez les outils de localisation.

Utiliser les Fonctions de Traduction
====================================

CakePHP fournit plusieurs fonctions qui vous aideront à internationaliser votre
application. La plus fréquemment utilisée est :php:func:`__()`. Cette fonction
est utilisée pour récupérer un message de traduction simple ou retourner la
même chaine si aucune traduction n'est trouvée::

    echo __('Popular Articles');

Si vous avez besoin de grouper vos messages, par exemple des traduction à
l'intérieur d'un plugin, vous pouvez utiliser la fonction :php:func:`__d()`
pour récupérer les messages d'un autre domaine::

    echo __d('my_plugin', 'Trending right now');

.. note::

    Si vous souhaitez traduire vos plugins et qu'ils ont un "préfixe" de
    namespace, vous devez nommer votre chaîne de domaine ``Namespace/PluginName``.
    Cependant, notez que le chemin du fichier de langage sera, dans votre dossier de
    plugin, ``plugins/Namespace/PluginName/src/Locale/plugin_name.po``.

Parfois les chaines de traduction peuvent être ambigües pour les personnes
les traduisant. Cela se produit lorsque deux chaines sont identiques mais
se réfèrent à des choses différentes. Par exemple 'lettre' a plusieurs
significations en français. Pour résoudre ce problème, vous pouvez utiliser
la fonction :php:func:`__x()`::

    echo __x('communication écrite', 'He read the first letter');

    echo __x('apprentissage de l alphabet', 'He read the first letter');

Le premier argument est le contexte du message et le second est le message
à traduire.

.. code-block:: pot

     msgctxt "communication écrite"
     msgid "He read the first letter"
     msgstr "Il a lu le premier courrier"

Utiliser des Variables dans les Traductions de Messages
-------------------------------------------------------

Les fonctions de traduction vous permettent d'interpoler des variables dans
les messages en utilisant des marqueurs définis dans le message lui-même
ou dans la chaine traduite::

    echo __("Hello, my name is {0}, I'm {1} years old", ['Sara', 12]);


Les marqueurs sont numériques et correspondent aux clés dans le tableau passé.
Vous pouvez également passer à la fonction les variables en tant qu'arguments
indépendants::

    echo __("Small step for {0}, Big leap for {1}", 'Man', 'Humanity');

Toutes les fonctions de traduction intègrent le remplacement de placeholder::

    __d('validation', 'The field {0} cannot be left empty', 'Name');

    __x('alphabet', 'He read the letter {0}', 'Z');

le caractère ``'`` (guillemet simple ou apostrophe) agit comme un caractère
d'échappement dans les messages de traduction. Chaque variable entourée de
guillemets simples ne sera pas remplacée et sera traitée en tant que texte
littéral. Par exemple::

    __("This variable '{0}' be replaced.", 'will not');

En utilisant deux guillemets  simples côte à côte, vos variables seront
remplacées correctement::

    __("This variable ''{0}'' be replaced.", 'will');

Ces fonctions profitent des avantages du `MessageFormatter ICU
<http://php.net/manual/fr/messageformatter.format.php>`_ pour que vous puissiez
traduire des messages, des dates, des nombres et des devises en même temps::

    echo __(
        'Hi {0}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', new FrozenTime('2014-01-13 11:12:00'), 1354.37]
    );

    // Retourne
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37

Les nombres dans les placeholders peuvent également être formatés avec un
contrôle fin et précis sur la sortie::

    echo __(
        'You have traveled {0,number} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // Retourne
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 9));

    // Retourne
    There are 6,100,000,000 people on earth

Voici la liste des balises spécifiques que vous pouvez mettre après le mot
``number``:

* ``integer``: Supprime la partie décimale
* ``currency``: Ajoute le symbole de la devise locale et arrondit les décimales
* ``percent``: Formate le nombre en pourcentage

Les dates peuvent également être formatées en utilisant le mot ``date`` après le
nombre placeholder. Les options supplémentaires sont les suivantes:

* ``short``
* ``medium``
* ``long``
* ``full``

Le mot ``time`` après le nombre placeholder est également accepté et il comprend
les mêmes options que ``date``.

.. note::

    Les placeholders nommés sont supportés dans PHP 5.5+ et sont formatés comme
    ``{name}``. Quand vous utilisez les placeholders nommés, passez les
    variables dans un tableau en utilisant la paire de clé/valeur, par exemple
    ``['name' => 'Sara', 'age' => 12]``.

    Il est recommandé d'utiliser PHP 5.5 ou supérieur quand vous utilisez les
    fonctionnalités d'internationalisation de CakePHP. L'extension ``php5-intl``
    doit être installée et la version ICU doit être supérieur à 48.x.y (pour
    vérifier la version ICU ``Intl::getIcuVersion()``).

Pluriels
--------

Une partie cruciale de l'internationalisation de votre application est de
récupérer vos messages pluralisés correctement suivant les langues affichées.
CakePHP fournit plusieurs possibilités pour sélectionner correctement les
pluriels dans vos messages.

Utiliser la Sélection Plurielle ICU
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

La première tire parti du format de message ``ICU`` qui est fourni par défaut
dans les fonctions de traductions. Dans les fichiers de traduction vous
pourriez avoir les chaines suivantes

.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{# resultados}}"

     msgid "{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{placeholder,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

Et dans votre application utilisez le code suivant pour afficher l'une des
traductions pour une telle chaine::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found # records}}', [0]);

    // Retourne "Ningún resultado" puisque l'argument {0} est 0

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}', [1]);

    // Retourne "1 resultado" puisque l'argument {0} est 1

    __('{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [0, 'many', 'placeholder' => 2])
    // Retourne "many resultados" puisque l'argument {placeholder} est 2 et
    // l'argument {1} est 'many'

Regarder de plus près le format que nous avons juste utilisé, rendra évident
la méthode de construction des messages::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

Le ``[count placeholder]`` peut être le numéro de clé du tableau de n'importe
quelle variable passée à la fonction de traduction. Il sera utilisé pour
sélectionner la forme plurielle correcte.

Noter que pour faire référence à ``[count placeholder]`` dans ``{message}``
vous devez utiliser ``#``.

Vous pouvez bien entendu utiliser des id de messages plus simples si vous ne
voulez pas taper la séquence plurielle complète dans votre code.

.. code-block:: pot

     msgid "search.results"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

Ensuite utilisez la nouvelle chaine dans votre code::

    __('search.results', [2, 2]);

    // Retourne "2 resultados"

la dernière version a l'inconvénient que vous aurez besoin d'avoir un fichier
de message de traduction même pour la langue par défaut, mais comporte
l'avantage de rendre le code plus lisible et de laisser les chaines de sélection
de plurielles compliquées dans les fichiers de traduction.

Parfois utiliser directement la correspondance des nombres vers les pluriels
est impossible. Par exemple les langues telles que l'Arabe nécessitent un
pluriel différent lorsque vous faites référence à une faible quantité et
un pluriel différent pour une quantité plus importante. Dans ces cas vous
pouvez utiliser la correspondance d'alias ICU. Au lieu d'écrire::

    =0{No results} =1{...} other{...}

Vous pouvez faire::

    zero{No Results} one{One result} few{...} many{...} other{...}

Assurez-vous de lire le `Guide des Règles Plurielles des Langues
<http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html>`_
pour obtenir une vue d'ensemble complète des alias que vous pouvez utiliser pour
chaque langue.

Utiliser la Sélection Plurielle Gettext
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Le second format de sélection plurielle accepté est d'utiliser les
fonctionnalités intégrées de Gettext. Dans ce cas, les pluriels seront
enregistrés dans le fichier ``.po`` en créant une ligne de traduction séparée
pour chaque forme plurielle:

.. code-block:: pot

    # Un identificateur de message pour le singulier
    msgid "One file removed"
    # Une autre pour le pluriel
    msgid_plural "{0} files removed"
    # Traduction au singulier
    msgstr[0] "Un fichero eliminado"
    # Traduction au pluriel
    msgstr[1] "{0} ficheros eliminados"

Lorsque vous utilisez cet autre format, vous devez utiliser une autre fonction
de traduction::

    // Retourne: "10 ficheros eliminados"
    $count = 10;
    __n('One file removed', '{0} files removed', $count, $count);

    // Il est également possible de l'utiliser dans un domaine
    __dn('my_plugin', 'One file removed', '{0} files removed', $count, $count);

Le nombre à l'intérieur de ``msgstr[]`` est le nombre assigné par Gettext pour
la forme plurielle de la langue. Certaines langues ont plus de deux formes
plurielles, le Croate par exemple:

.. code-block:: pot

    msgid "One file removed"
    msgid_plural "{0} files removed"
    msgstr[0] "{0} datoteka je uklonjena"
    msgstr[1] "{0} datoteke su uklonjene"
    msgstr[2] "{0} datoteka je uklonjeno"

Merci de visiter la `page des langues Launchpad
<https://translations.launchpad.net/+languages>`_ pour une explication
détaillée sur les nombres de formes plurielles de chaque langue.

Créer Vos Propres Traducteurs
=============================

Si vous devez vous écarter des conventions de CakePHP en ce qui concerne
l'emplacement et la manière d'enregistrer les messages de traduction, vous
pouvez créer votre propre loader de messages traduits. La manière la plus
simple de créer votre propre traducteur est de définir un loader pour
un seul domaine et une seule locale::

    use Aura\Intl\Package;

    I18n::setTranslator('animals', function () {
        $package = new Package(
            'default', // The formatting strategy (ICU)
            'default' // The fallback domain
        );
        $package->setMessages([
            'Dog' => 'Chien',
            'Cat' => 'Chat',
            'Bird' => 'Oiseau'
            ...
        ]);

        return $package;
    }, 'fr_FR');

Le code ci-dessus peut être ajouté à votre **config/bootstrap.php** pour
que les traductions soient ajoutées avant qu'une fonction de traduction ne soit
utilisée. Le minimum absolu nécessaire pour créer un traducteur est que la
fonction loader doit retourner un objet ``Aura\Intl\Package``. Une fois que le
code est en place vous pouvez utiliser les fonctions de traduction comme
d'habitude::

    // Avant 3.5, utilisez I18n::locale()
    I18n::setLocale('fr_FR');
    __d('animals', 'Dog'); // Retourne "Chien"

Comme vous pouvez le voir, les objets ``Package`` prennent les messages de
traduction sous forme de tableau. Vous pouvez passer la méthode
``setMessages()`` de la manière qui vous plait: avec du code en ligne, en
incluant un autre fichier, en appelant une autre fonction, etc. CakePHP fournit
quelques fonctions de loader que vous pouvez réutiliser si vous devez juste
changer l'endroit où sont chargés les messages.
Par exemple, vous pouvez toujours utiliser les fichiers ``.po`` mais les charger
depuis un autre endroit::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Charge les messages depuis src/Locale/folder/sub_folder/filename.po

    // Avant 3.5, utilisez translator()
    I18n::setTranslator(
        'animals',
        new Loader('filename', 'folder/sub_folder', 'po'),
        'fr_FR'
    );

Créer des Parsers de Messages
-----------------------------

Il est possible de continuer à utiliser les mêmes conventions que CakePHP
utilise mais d'utiliser un autre parser de messages que ``PoFileParser``.
Par exemple, si vous vouliez charger les messages de traduction en utilisant
``YAML``, vous auriez d'abord besoin de créer la classe du parser::

    namespace App\I18n\Parser;

    class YamlFileParser
    {

        public function parse($file)
        {
            return yaml_parse_file($file);
        }
    }

Le fichier doit être créé dans le dossier **src/I18n/Parser** de votre
application. Ensuite, créez les fichiers de traduction sous
**src/Locale/fr_FR/animals.yaml**

.. code-block:: yaml

    Dog: Chien
    Cat: Chat
    Bird: Oiseau

Enfin, configurez le loader de traduction pour le domaine et la locale::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Avant 3.5, utilisez translator()
    I18n::setTranslator(
        'animals',
        new Loader('animals', 'fr_FR', 'yaml'),
        'fr_FR'
    );

.. _creating-generic-translators:

Créer des Traducteurs Génériques
--------------------------------

Configurer des traducteurs en appelant ``I18n::setTranslator()`` pour chaque
domaine et locale que vous devez supporter peut être fastidieux, spécialement
si vous devez supporter plus que quelques locales. Pour éviter ce problème,
CakePHP vous permet de définir des loaders de traduction génériques pour chaque
domaine.

Imaginez que vous vouliez charger toutes les traductions pour le domaine par
défaut et pour chaque langue depuis un service externe::

    use Aura\Intl\Package;

    I18n::config('default', function ($domain, $locale) {
        $locale = Locale::parseLocale($locale);
        $language = $locale['language'];
        $messages = file_get_contents("http://example.com/translations/$lang.json");

        return new Package(
            'default', // Formatter
            null, // Fallback (none for default domain)
            json_decode($messages, true)
        )
    });

Le code ci-dessus appelle un service externe exemple pour charger un fichier
JSON avec les traductions puis construit uniquement un objet ``Package``
pour chaque locale nécessaire dans l'application.

If you'd like to change how packages are loaded for all packages, that don't
have specific loaders set you can replace the fallback package loader by using
the ``_fallback`` package::

    I18n::config('_fallback', function ($domain, $locale) {
        // Custom code that yields a package here.
    });

.. versionadded:: 3.4.0
    Replacing the ``_fallback`` loader was added in 3.4.0

Pluriels et Contexte dans les Traducteurs Personnalisés
-------------------------------------------------------

les tableaux utilisées pour ``setMessages()`` peuvent être conçus pour ordonner
au traducteur d'enregistrer les messages sous différents domaines ou de
déclencher une sélection de pluriel de style Gettext. Ce qui suit est un exemple
d'enregistrement de traductions pour la même clé dans différents contextes::

    [
        'He reads the letter {0}' => [
            'alphabet' => 'Él lee la letra {0}',
            'written communication' => 'Él lee la carta {0}'
        ]
    ]

De même vous pouvez exprimer des pluriels de style Gettext en utilisant le
tableau de messages avec une clé de tableau imbriqué par forme plurielle::

    [
        'I have read one book' => 'He leído un libro',
        'I have read {0} books' => [
            'He leído un libro',
            'He leído {0} libros'
        ]
    ]

Utiliser des Formateurs Différents
----------------------------------

Dans les exemples précédents nous avons vu que les Packages sont construits en
utilisant ``default`` en premier argument, et il était indiqué avec un
commentaire qu'il correspondait au formateur à utiliser.
Les formateurs sont des classes responsables d'interpoler les variables dans
les messages de traduction et sélectionner la forme plurielle correcte.

Si vous avez à faire une application datée, ou que vous n'avez pas besoin de la
puissance offerte par le formateur de message ICU, CakePHP fournit également le
formateur ``sprintf``::

    return Package('sprintf', 'fallback_domain', $messages);

Les messages à traduire seront passés à la fonction ``sprintf()`` pour
interpoler les variables::

    __('Hello, my name is %s and I am %d years old', 'José', 29);

Il est possible de définir le formateur par défaut pour tous les traducteurs
créés par CakePHP avant qu'ils soient utilisés pour la première fois. Cela
n'inclut pas les traducteurs créés manuellement en utilisant les méthodes
``setTranslator()`` et ``config()``::

    I18n::defaultFormatter('sprintf');

Localiser les Dates et les Nombres
==================================

Lorsque vous affichez des dates et des nombres dans votre application, vous
voudrez souvent qu'elles soient formatées conformément au format du pays ou
de la région dans lequel vous souhaitez afficher la page.

Pour changer l'affichage des dates et des nombres, vous devez uniquement changer
la locale et utiliser les bonnes classes::

    use Cake\I18n\I18n;
    use Cake\I18n\Time;
    use Cake\I18n\Number;

    // Avant 3.5, utilisez I18n::locale()
    I18n::setLocale('fr-FR');

    $date = new Time('2015-04-05 23:00:00');

    echo $date; // Affiche 05/04/2015 23:00

    echo Number::format(524.23); // Displays 524,23

Assurez vous de lire les sections :doc:`/core-libraries/time` et
:doc:`/core-libraries/number` pour en apprendre plus sur les options de
formatage.

Par défaut, les dates renvoyées par l'ORM utilisent la classe
``Cake\I18n\Time``, donc leur affichage direct dans votre application sera
affecté par le changement de la locale.

.. _parsing-localized-dates:

Parser les Données Datetime Localisées
--------------------------------------

Quand vous acceptez les données localisées, c'est sympa d'accepter les
informations de type datetime dans un format localisé pour l'utilisateur. Dans
un controller, ou :doc:`/development/dispatch-filters`, vous pouvez configurer
les types Date, Time, et DateTime pour parser les formats localisés::

    use Cake\Database\Type;

    // Permet de parser avec le format de locale par défaut.
    Type::build('datetime')->useLocaleParser();

    // Configure un parser personnalisé du format de datetime.
    Type::build('datetime')->useLocaleParser()->setLocaleFormat('dd-M-y');

    // Vous pouvez aussi utiliser les constantes IntlDateFormatter.
    Type::build('datetime')->useLocaleParser()
        ->setLocaleFormat([IntlDateFormatter::SHORT, -1]);

Le parsing du format par défaut est le même que le format de chaîne par défaut.

Sélection Automatique de Locale Basée sur les Données de Requêtes
=================================================================

En utilisant le ``LocaleSelectorFilter`` dans votre application, CakePHP
définira automatiquement la locale en se basant sur l'utilisateur actuel::

    // dans src/Application.php
    use Cake\I18n\Middleware\LocaleSelectorMiddleware;

    // Mise à jour de la méthode "middleware" pour ajouter le nouveau middleware
    public function middleware($middleware)
    {
        // Add middleware and set the valid locales
        $middleware->add(new LocaleSelectorMiddleware(['en_US', 'fr_FR']));
    }


    // Avant 3.3.0, il faut utiliser un DispatchFilter
    // dans config/bootstrap.php
    DispatcherFactory::add('LocaleSelector');

    // Limite les locales à en_US et fr_FR uniquement
    DispatcherFactory::add('LocaleSelector', ['locales' => ['en_US', 'fr_FR']]);

Le ``LocaleSelectorFilter`` utilisera l'entête ``Accept-Language`` pour définir
automatiquement la locale préférée de l'utilisateur. Vous pouvez utiliser
l'option de liste de locale pour limiter les locales pouvant être utilisées
automatiquement.

.. meta::
    :title lang=fr: Internationalization & Localization
    :keywords lang=fr: internationalization localization,internationalization et localization,localization features,language application,gettext,l10n,daunting task,adaptation,pot,i18n,audience,traduction,languages
