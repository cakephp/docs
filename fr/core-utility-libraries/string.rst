String
######

.. php:class:: String

La classe String inclut des méthodes pratiques pour la création et la 
manipulation des chaînes de caractères et est normalement accessible 
statiquement. Exemple:
``String::uuid()``.

Si vous avez besoin des fonctionnalités de :php:class:`TextHelper` en-dehors 
d'une ``View``, utilisez la classe ``String``::

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('String', 'Utility');
            $message = $this->User->find('new_message');
            if (!empty($message)) {
                // notifie à l'utilisateur d'un nouveau message
                $this->Session->setFlash(__('Vous avez un message: %s', String::truncate($message['Message']['body'], 255, array('html' => true))));
            }
        }
    }

.. versionchanged:: 2.1
   Plusieurs méthodes de :php:class:`TextHelper` ont été déplacées dans la 
   classe ``String``.

.. php:staticmethod:: uuid()

    La méthode uuid est utilisée pour générer des identificateurs uniques comme 
    per :rfc:`4122`. uuid est une chaîne de caractères de 128bit au format 
    485fc381-e790-47a3-9794-1337c0a8fe68.

    ::

        String::uuid(); // 485fc381-e790-47a3-9794-1337c0a8fe68


.. php:staticmethod:: tokenize($data, $separator = ',', $leftBound = '(', $rightBound = ')')

    Tokenizes une chaîne en utilisant ``$separator``, en ignorant toute instance de 
    ``$separator`` qui apparaissent entre ``$leftBound`` et ``$rightBound``.

    Cette méthode peut être utile quand on sépare les données en formatage 
    régulier comme les listes de tag::

        $data = "cakephp 'great framework' php";
        $result = String::tokenize($data, ' ', "'", "'");
        // le résultat contient
        array('cakephp', "'great framework'", 'php');

.. php:staticmethod:: insert($string, $data, $options = array())

    La méthode insérée est utilisée pour créer des chaînes templates et pour 
    permettre les remplacements de clé/valeur::

        String::insert('Mon nom est :name et j'ai :age ans.', array('name' => 'Bob', 'age' => '65'));
        // génére: "Mon nom est Bob et j'ai 65 ans."

.. php:staticmethod:: cleanInsert($string, $options = array())

    Nettoie une chaîne formatée ``String::insert`` avec $options donnée 
    qui dépend de la clé 'clean' dans $options. La méthode par défaut utilisée 
    est le texte mais html est aussi disponible. Le but de cette fonction est 
    de remplacer tous les espaces blancs et les balises non nécessaires autour 
    des placeholders qui ne sont pas remplacés par Set::insert.

    Vous pouvez utiliser les options suivantes dans le tableau options::

        $options = array(
            'clean' => array(
                'method' => 'text', // or html
            ),

            'before' => '',
            'after' => ''
        );

.. php:staticmethod:: wrap($text, $options = array())

    Entoure un block de texte pour un ensemble de largeur, et indente aussi les 
    blocks. Peut entourer intelligemment le texte ainsi les mots ne sont pas 
    sliced across lines::

        $text = 'Ceci est la chanson qui ne stoppe jamais.';
        $result = String::wrap($text, 22);

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
       en excergue
    -  'html' - bool Si true, va ignorer tous les tags HTML, s'assurant que 
       seul le bon texte est mise en avant.

    Exemple::

        // appelé par TextHelper
        echo $this->Text->highlight($last_sentence, 'using', array('format' => '<span class="highlight">\1</span>'));

        // appelé par String
        App::uses('String', 'Utility');
        echo String::highlight($last_sentence, 'using', array('format' => '<span class="highlight">\1</span>'));

    Sortie::

        Highlights $needle in $haystack <span class="highlight">using</span>
        the $options['format'] string specified  or a default string.

.. php:method:: stripLinks($text)

    Enlève le ``$text`` fourni de tout lien HTML.

.. php:method:: truncate(string $text, int $length=100, array $options)

    :param string $text: Le texte à tronquer.
    :param int $length: La longueur de trim.
    :param array $options: Un tableau d'options à utiliser.

    Coupe une chaîne avec ``$length`` et ajoute un suffixe avec 
    ``'ending'`` si le texte est plus long que ``$length``. Si ``'exact'``
    est passé à ``false``, le truchement va se faire après le mot de fin 
    suivant. Si ``'html'`` est passé à ``true``, les tags html seront 
    respectés et ne seront pas coupés.

    ``$options`` est utilisé pour passer tous les paramètres supplémentaires, 
    et a les clés suivantes possibles par défaut, celles-si étant toutes 
    optionnelles::

        array(
            'ending' => '...',
            'exact' => true,
            'html' => false
        )

    Exemple::

        // appelé par TextHelper
        echo $this->Text->truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ending' => '...',
                'exact' => false
            )
        );

        // appelé par String
        App::uses('String', 'Utility');
        echo String::truncate(
            'The killer crept forward and tripped on the rug.',
            22,
            array(
                'ending' => '...',
                'exact' => false
            )
        );

    Sortie::

        The killer crept...

.. php:method:: excerpt(string $haystack, string $needle, integer $radius=100, string $ending="...")

    :param string $haystack: La chaîne à chercher.
    :param string $needle: La chaîne to excerpt around.
    :param int $radius: Le nombre de caractères de chaque côté de $needle que 
        vous souhaitez inclure.
    :param string $ending: Le Texte à ajouter/préfixer au début ou à la fin 
        du résultat.

    Extrait un excerpt de ``$haystack`` surrounding the ``$needle``
    with a number of characters on each side determined by ``$radius``,
    and prefix/suffix with ``$ending``. This method is especially handy for
    search results. The query string or keywords can be shown within
    the resulting document.::

        // appelé par TextHelper
        echo $this->Text->excerpt($last_paragraph, 'method', 50, '...');

        // appelé par String
        App::uses('String', 'Utility');
        echo String::excerpt($last_paragraph, 'method', 50, '...');

    Sortie::

        ... par $radius, et prefix/suffix avec $ending. Cette méthode est 
        spécialement pratique pour les résultats de recherche. La requête...

.. php:method:: toList(array $list, $and='and')

    :param array $list: Tableau d'éléments à combiner dans une list sentence.
    :param string $and: Le mot utilisé pour le dernier join.

    Crée une liste séparée avec des virgules, où les deux derniers items sont 
    joins avec ‘and’.::

        // appelé par TextHelper
        echo $this->Text->toList($colors);

        // appelé par String
        App::uses('String', 'Utility');
        echo String::toList($colors);

    Sortie::

        red, orange, yellow, green, blue, indigo et violet

.. end-string

.. meta::
    :title lang=fr: String
    :keywords lang=fr: tableau php,tableau name,string options,data options,result string,class string,string data,string class,placeholders,méthode défaut,valeur clé key,markup,rfc,remplacements,convenience,templates
