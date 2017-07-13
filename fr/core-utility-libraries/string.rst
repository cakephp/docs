CakeText
########

.. php:class:: CakeText

La classe CakeText inclut des méthodes pratiques pour la création et la
manipulation des chaînes de caractères et est normalement accessible
statiquement. Exemple:
``CakeText::uuid()``.

.. deprecated:: 2.7
    La classe ``String`` a été dépréciée dans 2.7 en faveur de la classe
    :php:class:`CakeText`. Bien que la classe ``String`` soit toujours
    disponible pour garder une rétro-compatibilité, utiliser ``CakeText``
    est recommandée puisqu'elle offre une compatibilité avec PHP7 et HHVM.

Si vous avez besoin des fonctionnalités de :php:class:`TextHelper` en-dehors
d'une ``View``, utilisez la classe ``CakeText``::

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('CakeText', 'Utility');
            $message = $this->User->find('new_message');
            if (!empty($message)) {
                // notification à l'utilisateur d'un nouveau message
                $this->Session->setFlash(__('Vous avez un message: %s', CakeText::truncate($message['Message']['body'], 255, array('html' => true))));
            }
        }
    }

.. versionchanged:: 2.1
   Plusieurs méthodes de :php:class:`TextHelper` ont été déplacées dans la
   classe ``CakeText``.

.. php:staticmethod:: uuid()

    La méthode UUID est utilisée pour générer des identificateurs uniques comme
    per :rfc:`4122`. UUID est une chaîne de caractères de 128bit au format
    485fc381-e790-47a3-9794-1337c0a8fe68.

    ::

        CakeText::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68


.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

    Tokenizes une chaîne en utilisant ``$separator``, en ignorant toute
    instance de ``$separator`` qui apparait entre ``$leftBound`` et
    ``$rightBound``.

    Cette méthode peut être utile quand on sépare les données en formatage
    régulier comme les listes de tag::

        $data = "cakephp 'great framework' php";
        $result = CakeText::tokenize($data, ' ', "'", "'");
        // le résultat contient
        array('cakephp', "'great framework'", 'php');

.. php:staticmethod:: insert($string, $data, $options = array())

    La méthode insérée est utilisée pour créer des chaînes templates et pour
    permettre les remplacements de clé/valeur::

        CakeText::insert('Mon nom est :name et j'ai :age ans.', array('name' => 'Bob', 'age' => '65'));
        // génère: "Mon nom est Bob et j'ai 65 ans."

.. php:staticmethod:: cleanInsert($string, $options = array())

    Nettoie une chaîne formatée ``CakeText::insert`` avec $options donnée
    qui dépend de la clé 'clean' dans $options. La méthode par défaut utilisée
    est le texte mais html est aussi disponible. Le but de cette fonction est
    de remplacer tous les espaces blancs et les balises non nécessaires autour
    des placeholders qui ne sont pas remplacés par Set::insert.

    Vous pouvez utiliser les options suivantes dans le tableau options::

        $options = array(
            'clean' => array(
                'method' => 'text', // ou html
            ),

            'before' => '',
            'after' => ''
        );

.. php:staticmethod:: wrap($text, $options = array())

    Entoure un block de texte pour un ensemble de largeur, et indente aussi les
    blocks. Peut entourer intelligemment le texte ainsi les mots ne sont pas
    sliced across lines::

        $text = 'Ceci est la chanson qui ne stoppe jamais.';
        $result = CakeText::wrap($text, 22);

        // retourne
        Ceci est la chanson
        qui ne stoppe jamais.

    Vous pouvez fournir un tableau d'options qui contrôlent la façon dont
    on entoure. Les options possibles sont:

    * ``width`` La largeur de l'enroulement. Par défaut à 72.
    * ``wordWrap`` Entoure ou non les mots entiers. Par défaut à true.
    * ``indent`` Le caractère avec lequel on indente les lignes. Par défaut
      à ''.
    * ``indentAt`` Le nombre de ligne pour commencer l'indentation du texte.
      Par défaut à 0.

.. start-string

.. php:method:: highlight(string $haystack, string $needle, array $options = array() )

    :param string $haystack: La chaîne de caractères à rechercher.
    :param string $needle: La chaîne à trouver.
    :param array $options: Un tableau d'options, voir ci-dessous.

    Mettre en avant ``$needle`` dans ``$haystack`` en utilisant la chaîne
    spécifique ``$options['format']`` ou une chaîne par défaut.

    Options:

    -  'format' - chaîne la partie de html avec laquelle la phrase sera mise
       en exergue.
    -  'html' - bool Si true, va ignorer tous les tags HTML, s'assurant que
       seul le bon texte est mise en avant.

    Exemple::

        // appelé avec TextHelper
        echo $this->Text->highlight(
            $lastSentence,
            'using',
            array('format' => '<span class="highlight">\1</span>')
        );

        // appelé avec CakeText
        App::uses('CakeText', 'Utility');
        echo CakeText::highlight(
            $lastSentence,
            'using',
            array('format' => '<span class="highlight">\1</span>')
        );

    Sortie::

        Highlights $needle in $haystack <span class="highlight">using</span>
        the $options['format'] string specified  or a default string.

.. php:method:: stripLinks($text)

    Enlève le ``$text`` fourni de tout lien HTML.

.. php:method:: truncate(string $text, int $length=100, array $options)

    :param string $text: Le texte à tronquer.
    :param int $length: La longueur en caractères pour laquelle le texte doit être tronqué.
    :param array $options: Un tableau d'options à utiliser.

    Si ``$text`` est plus long que ``$length``, cette méthode le tronque à la
    longueur ``$length`` et ajoute un suffixe ``'ellipsis'``, si défini. Si
    ``'exact'`` est passé à ``false``, le truchement va se faire au premier
    espace après le point où ``$length`` a dépassé. Si ``'html'``
    est passé à ``true``, les balises html seront respectées et ne seront pas
    coupées.

    ``$options`` est utilisé pour passer tous les paramètres supplémentaires,
    et a les clés suivantes possibles par défaut, celles-ci étant toutes
    optionnelles::

        array(
            'ellipsis' => '...',
            'exact' => true,
            'html' => false
        )

    Exemple::

        // appelé avec TextHelper
        echo $this->Text->truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // appelé avec CakeText
        App::uses('CakeText', 'Utility');
        echo CakeText::truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

    Sortie::

        The killer crept...

.. versionchanged:: 2.3
   ``ending`` a été remplacé par ``ellipsis``. ``ending`` est toujours utilisé
   dans 2.2.1.

.. php:method:: tail(string $text, int $length=100, array $options)

    :param string $text: The text à tronquer.
    :param int $length: La longueur en caractères pour laquelle le texte doit être tronqué.
    :param array $options: Un tableau d'options à utiliser.

    Si ``$text`` est plus long que ``$length``, cette méthode retire une
    sous-chaîne initiale avec la longueur de la différence et ajoute un
    préfixe ``'ellipsis'``, si il est défini. Si ``'exact'`` est passé à
    ``false``, le truchement va se faire au premier espace avant le moment où
    le truchement aurait été fait.

    ``$options`` est utilisé pour passer tous les paramètres supplémentaires,
    et a les clés possibles suivantes par défaut, toutes sont optionnelles::

        array(
            'ellipsis' => '...',
            'exact' => true
        )

    .. versionadded:: 2.3

    Exemple::

        $sampleText = 'I packed my bag and in it I put a PSP, a PS3, a TV, ' .
            'a C# program that can divide by zero, death metal t-shirts'

        // appelé avec TextHelper
        echo $this->Text->tail(
            $sampleText,
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

        // appelé avec CakeText
        App::uses('CakeText', 'Utility');
        echo CakeText::tail(
            $sampleText,
            70,
            array(
                'ellipsis' => '...',
                'exact' => false
            )
        );

    Sortie::

        ...a TV, a C# program that can divide by zero, death metal t-shirts

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ending="...")

    :param string $haystack: La chaîne à chercher.
    :param string $needle: La chaîne to excerpt around.
    :param int $radius: Le nombre de caractères de chaque côté de $needle que
        vous souhaitez inclure.
    :param string $ending: Le Texte à ajouter/préfixer au début ou à la fin
        du résultat.

    Extrait un excerpt de ``$haystack`` surrounding the ``$needle``
    avec un nombre de caractères de chaque côté déterminé par ``$radius``,
    et prefix/suffix with ``$ending``. Cette méthode est spécialement pratique
    pour les résultats recherchés. La chaîne requêtée ou les mots clés peuvent
    être montrés dans le document résultant. ::

        // appelé avec TextHelper
        echo $this->Text->excerpt($lastParagraph, 'method', 50, '...');

        // appelé avec CakeText
        App::uses('CakeText', 'Utility');
        echo CakeText::excerpt($lastParagraph, 'method', 50, '...');

    Sortie::

        ... par $radius, et prefix/suffix avec $ending. Cette méthode est
        spécialement pratique pour les résultats de recherche. La requête...

.. php:method:: toList(array $list, $and='and')

    :param array $list: Tableau d'éléments à combiner dans une list sentence.
    :param string $and: Le mot utilisé pour le dernier join.

    Crée une liste séparée avec des virgules, où les deux derniers items sont
    joins avec 'and'. ::

        // appelé avec TextHelper
        echo $this->Text->toList($colors);

        // appelé avec CakeText
        App::uses('CakeText', 'Utility');
        echo CakeText::toList($colors);

    Sortie::

        red, orange, yellow, green, blue, indigo et violet

.. end-string

.. meta::
    :title lang=fr: CakeText
    :keywords lang=fr: tableau php,tableau name,string options,data options,result string,class string,string data,string class,placeholders,méthode défaut,valeur clé key,markup,rfc,remplacements,convenience,templates
