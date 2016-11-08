Text
####

.. php:namespace:: Cake\Utility

.. php:class:: Text

La classe Text inclut des méthodes pratiques pour créer et manipuler des chaînes
de caractères et est normalement accessible statiquement. Exemple:
``Text::uuid()``.

Si vous avez besoin des fonctionnalités de :php:class:`TextHelper` en-dehors
d'une ``View``, utilisez la classe ``Text``::

    namespace App\Controller;

    use Cake\Utility\Text;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $message = $this->Users->find('new_message');
            if (!empty($message)) {
                // notifie un nouveau message à l'utilisateur
                $this->FLash->success(__(
                    'Vous avez un message: {0}',
                    Text::truncate($message['Message']['body'], 255, ['html' => true])
                ));
            }
        }
    }

Convertion des Chaînes de Caractères en ASCII
=============================================

.. php:staticmethod:: transliterate($string, $transliteratorId = null)

La méthode ``translisterate`` convertit par défaut tous les caractères dans la
chaîne soumise dans son équivalent en caractères ASCII. La méthode s'attend à
avoir une chaîne encodée en UTF-8 en entrée. La conversion des caractères peut
être controllée en utilisant des identifiants de translitération que vous
passez via l'argument ``$transliteratorId`` de la méthode ou en changeant
l'identifiant par défaut à l'aide de ``Text::setTransliteratorId()``.
Les identifiants de translitération d'ICU sont généralement sous la forme
``<source script>:<target script>`` et vous pouvez spécifier plusieurs couples
de conversion en les séparant par des ``;``. Vous trouverez plus
d'informations sur les identifiants de transliterateurs
`ici <http://userguide.icu-project.org/transforms/general#TOC-Transliterator-Identifiers>`_::

    // apple purée
    Text::transliterate('apple purée');

    // Ubermensch (seuls les caractères latin seront translitérés)
    Text::transliterate('Übérmensch', 'Latin-ASCII;');

Créer des chaînes saines pour les URL
=====================================

.. php:staticmethod:: slug($string, $options = [])

La méthode ``slug`` va translitérer tous les caractères en leurs équivalents
ASCII et convertir tous les caractères non reconnus ainsi que les espaces en
trait d'union (``-``). Elle s'attend à recevoir une chaîne encodée en UTF-8 en
entrée.

Vous pouvez lui passer un tableau d'options pour avoir plus de contrôle sur le
slug retourné. Le paramètre ``$options`` peut aussi être une chaîne de
caractères, auquel cas il sera utilisé comme caractère de remplacement. Les
options supporté sont :

* ``replacement`` La chaîne de remplacement, le défaut étant '-'.
* ``transliteratorId`` Un identifiant translitérateur valide.
   S'il vaut ``null`` (valeur par défaut), ``Text::$_defaultTransliteratorId``
   sera utilisé.
   S'il vaut ``false``, aucune translitération ne sera faite. Seul les
   sous-chaînes qui ne sont pas des lettres/chiffres seront supprimées.
* ``preserve`` Les caractères qui ne sont pas des lettres ou des chiffres à
   préserver. Vaut ``null`` par défaut.
   Par exemple, cette option peut être définie à '.' pour générer des noms de
   fichiers propres::

    // apple-puree
    Text::slug('apple purée');

    // apple_puree
    Text::slug('apple purée', '_');

    // foo-bar.tar.gz
    Text::slug('foo bar.tar.gz', ['preserve' => '.']);

Générer des UUIDs
=================

.. php:staticmethod:: uuid()

    La méthode UUID est utilisée pour générer des identificateurs uniques comme
    per :rfc:`4122`. UUID est une chaîne de caractères de 128-bit au format
    ``485fc381-e790-47a3-9794-1337c0a8fe68``::

        Text::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68

Parseur de chaînes simples
==========================

.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

Tokenizes une chaîne en utilisant ``$separator``, en ignorant toute instance de
``$separator`` qui apparait entre ``$leftBound`` et ``$rightBound``.

Cette méthode peut être utile quand on sépare les données en formatage régulier
comme les listes de tag::

    $data = "cakephp 'great framework' php";
    $result = Text::tokenize($data, ' ', "'", "'");
    // le résultat contient
    ['cakephp', "'great framework'", 'php'];

.. php:method:: parseFileSize(string $size, $default)

Cette méthode enlève le format d'un nombre à partir d'une taille de byte lisible
par un humain en un nombre entier de bytes::

    $int = Text::parseFileSize('2GB');

Formater une chaîne
===================

.. php:staticmethod:: insert($string, $data, $options = [])

La méthode insérée est utilisée pour créer des chaînes templates et pour
permettre les remplacements de clé/valeur::

    Text::insert('Mon nom est :name et j'ai :age ans.', ['name' => 'Bob', 'age' => '65']);
    // génère: "Mon nom est Bob et j'ai 65 ans."

.. php:staticmethod:: cleanInsert($string, $options = [])

Nettoie une chaîne formatée ``Text::insert`` avec ``$options`` donnée qui dépend
de la clé 'clean' dans ``$options``. La méthode par défaut utilisée est le texte
mais html est aussi disponible. Le but de cette fonction est de remplacer tous
les espaces blancs et les balises non nécessaires autour des placeholders qui ne
sont pas remplacés par Set::insert.

Vous pouvez utiliser les options suivantes dans le tableau options::

    $options = [
        'clean' => [
            'method' => 'text', // ou html
        ],

        'before' => '',
        'after' => ''
    ];

Fixer la largeur d'un texte
===========================

.. php:staticmethod:: wrap($text, $options = [])

Entoure un block de texte pour un ensemble de largeur, et indente aussi les
blocks. Peut entourer intelligemment le texte ainsi les mots ne sont pas coupés
d'une ligne à l'autre::

    $text = 'Ceci est la chanson qui ne stoppe jamais.';
    $result = Text::wrap($text, 22);

    // retourne
    Ceci est la chanson
    qui ne stoppe jamais.

Vous pouvez fournir un tableau d'options qui contrôlent la façon dont on
entoure. Les options possibles sont:

* ``width`` La largeur de l'enroulement. Par défaut à 72.
* ``wordWrap`` Entoure ou non les mots entiers. Par défaut à ``true``.
* ``indent`` Le caractère avec lequel on indente les lignes. Par défaut
  à ''.
* ``indentAt`` Le nombre de ligne pour commencer l'indentation du texte.
  Par défaut à 0.

.. php:staticmethod:: wrapBlock($text, $options = [])

Si vous devez vous assurer que la largeur totale du bloc généré ne dépassera pas
une certaine largeur y compris si elle contient des indentations, vous devez
utiliser ``wrapBlock()`` au lieu de ``wrap()``. C'est particulièrement utile
pour générer du texte dans la console par exemple. Elle accepte les mêmes
options que ``wrap()``::

    $text = 'Ceci est la chanson qui ne stoppe jamais. Ceci est la chanson qui ne stoppe jamais.';
    $result = Text::wrapBlock($text, [
        'width' => 22,
        'indent' => ' → ',
        'indentAt' => 1
    ]);

    // Génère
    Ceci est la chanson
     → qui ne stoppe
     → jamais. Ceci est
     → la chanson qui ne
     → stoppe jamais.

.. start-text

Subrillance de Sous-Chaîne
==========================

.. php:method:: highlight(string $haystack, string $needle, array $options = [] )

Mettre en avant ``$needle`` dans ``$haystack`` en utilisant la chaîne spécifique
``$options['format']`` ou une chaîne par défaut.

Options:

-  ``format`` - chaîne la partie de html avec laquelle la phrase sera mise en
   exergue.
-  ``html`` - booléen Si ``true``, va ignorer tous les tags HTML, s'assurant que
   seul le bon texte est mise en avant.

Exemple::

    // appelé avec TextHelper
    echo $this->Text->highlight(
        $lastSentence,
        'using',
        ['format' => '<span class="highlight">\1</span>']
    );

    // appelé avec Text
    use Cake\Utility\Text;

    echo Text::highlight(
        $lastSentence,
        'using',
        ['format' => '<span class="highlight">\1</span>']
    );

Sortie::

    Highlights $needle in $haystack <span class="highlight">using</span> the
    $options['format'] string specified or a default string.

Retirer les Liens
=================

.. php:method:: stripLinks($text)

Enlève le ``$text`` fourni de tout lien HTML.

Tronquer le Texte
=================

.. php:method:: truncate(string $text, int $length = 100, array $options)

Si ``$text`` est plus long que ``$length``, cette méthode le tronque à la
longueur ``$length`` et ajoute un prefix ``'ellipsis'``, si défini. Si
``'exact'`` est passé à ``false``, le truchement va se faire au premier espace
après le point où ``$length`` a dépassé. Si ``'html'`` est passé à ``true``, les
balises html seront respectés et ne seront pas coupés.

``$options`` est utilisé pour passer tous les paramètres supplémentaires, et a
les clés suivantes possibles par défaut, celles-ci étant toutes optionnelles::

    [
        'ellipsis' => '...',
        'exact' => true,
        'html' => false
    ]

Exemple::

    // appelé avec TextHelper
    echo $this->Text->truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

    // appelé avec Text
    App::uses('Text', 'Utility');
    echo Text::truncate(
        'The killer crept forward and tripped on the rug.',
        22,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

Sortie::

    The killer crept...

Tronquer une chaîne par la fin
==============================

.. php:method:: tail(string $text, int $length = 100, array $options)

Si ``$text`` est plus long que ``$length``, cette méthode retire une sous-chaîne
initiale avec la longueur de la différence et ajoute un suffixe ``'ellipsis'``,
s'il est défini. Si ``'exact'`` est passé à ``false``, le truchement va se faire
au premier espace avant le moment où le truchement aurait été fait.

``$options`` est utilisé pour passer tous les paramètres supplémentaires, et a
les clés possibles suivantes par défaut, toutes sont optionnelles::

    [
        'ellipsis' => '...',
        'exact' => true
    ]

Exemple::

    $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
        'a C# program that can divide by zero, death metal t-shirts'

    // appelé avec TextHelper
    echo $this->Text->tail(
        $sampleText,
        70,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

    // appelé avec Text
    App::uses('Text', 'Utility');
    echo Text::tail(
        $sampleText,
        70,
        [
            'ellipsis' => '...',
            'exact' => false
        ]
    );

Sortie::

    ...a TV, a C# program that can divide by zero, death metal t-shirts

Générer un Extrait
==================

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ellipsis="...")

Génère un extrait de ``$haystack`` entourant le ``$needle`` avec un nombre de
caractères de chaque côté déterminé par ``$radius``, et préfixé/suffixé avec
``$ellipsis``. Cette méthode est spécialement pratique pour les résultats de
recherches. La chaîne requêtée ou les mots clés peuvent être montrés dans le
document résultant::

    // appelé avec TextHelper
    echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

    // appelé avec Text
    use Cake\Utility\Text;

    echo Text::excerpt($lastParagraph, 'méthode', 50, '...');

Génère::
    ...$radius,et préfixé/suffixé avec $ellipsis. Cette méthode est spécialement
    pratique pour les résultats de r...

Convertir un tableau sous la forme d'une phrase
===============================================

.. php:method:: toList(array $list, $and='and', $separator=', ')

Crée une liste séparée avec des virgules, où les deux derniers items sont joins
avec 'and'::

    $colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    // appelé avec TextHelper
    echo $this->Text->toList($colors);

    // appelé avec Text
    use Cake\Utility\Text;

    echo Text::toList($colors);

Sortie::

    red, orange, yellow, green, blue, indigo et violet

.. end-text

.. meta::
    :title lang=fr: Text
    :keywords lang=fr: slug,transliterate,ascii,tableau php,tableau name,string options,data options,result string,class string,string data,string class,placeholders,méthode défaut,valeur clé key,markup,rfc,remplacements,convenience,templates
