Normes de codes
###############

Les développeurs de CakePHP vont utiliser le `guide pour l'écriture de code
PSR-2 <http://www.php-fig.org/psr/psr-2/fr/>`_ en plus des règles de code
suivantes.

Il est recommandé que les autres personnes qui développent des Ingrédients de
Cake suivent les mêmes normes.

Vous pouvez utiliser le `Code Sniffer de CakePHP
<https://github.com/cakephp/cakephp-codesniffer>`_ pour vérifier que votre code
suit les normes requises.

Ajout de Nouvelles Fonctionnalités
==================================

Aucune nouvelle fonctionnalité ne devrait être ajoutée, sans avoir fait ses
propres tests - qui doivent être validés avant de les committer au dépôt.

Configuration de l'IDE
======================

Merci de vous assurer que votre IDE est configuré avec "trim right" pour les
espaces vides. Il ne doit pas y a voir d'espaces à la fin des lignes.

La plupart des IDE modernes supporte aussi un fichier ``.editorconfig``. Le
squelette d'application CakePHP est fourni avec par défaut. Il contient déjà
les meilleurs pratiques par défaut.

Indentation
===========

Quatre espaces seront utilisés pour l'indentation.

Ainsi, l'indentation devrait ressembler à ceci::

    // niveau de base
        // niveau 1
            // niveau 2
        // niveau 1
    // niveau de base

Ou::

    $booleanVariable = true;
    $stringVariable = "moose";
    if ($booleanVariable) {
        echo "Valeur booléenne si true";
        if ($stringVariable === "élan") {
            echo "Nous avons rencontré un élan";
        }
    }

Dans les cas où vous utilisez un appel de fonction multi-lignes, utilisez les
instructions suivantes:

*  Les parenthèses ouvrantes d'un appel de fonction multi-lignes doivent être
   le dernier contenu de la ligne.
*  Seul un argument est permis par ligne dans un appel de fonction multi-lignes.
*  Les parenthèses fermantes d'un appel de fonction multi-lignes doivent être
   elles-même sur une ligne.

Par exemple, plutôt qu'utiliser le format suivant::

    $matches = array_intersect_key($this->_listeners,
                    array_flip(preg_grep($matchPattern,
                        array_keys($this->_listeners), 0)));

Utilisez ceci à la place::

    $matches = array_intersect_key(
        $this->_listeners,
        array_flip(
            preg_grep($matchPattern, array_keys($this->_listeners), 0)
        )
    );

Longueur des lignes
===================

Il est recommandé de garder les lignes à une longueur d'environ 100 caractères
pour une meilleure lisibilité du code.
Les lignes ne doivent pas être plus longues que 120 caractères.

En résumé:

* 100 caractères est la limite soft.
* 120 caractères est la limite hard.

Structures de Contrôle
======================

Les structures de contrôle sont par exemple "``if``", "``for``", "``foreach``",
"``while``", "``switch``" etc. Ci-dessous, un exemple avec "``if``"::

    if ((expr_1) || (expr_2)) {
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2;
    } else {
        // default_action;
    }

*  Dans les structures de contrôle, il devrait y avoir 1 (un) espace avant la
   première parenthèse et 1 (un) espace entre les dernières parenthèses et
   l'accolade ouvrante.
*  Toujours utiliser des accolades dans les structures de contrôle,
   même si elles ne sont pas nécessaires. Elles augmentent la lisibilité
   du code, et elles vous donnent moins d'erreurs logiques.
*  L'ouverture des accolades doit être placée sur la même ligne que la
   structure de contrôle. La fermeture des accolades doit être placée sur de
   nouvelles lignes, et ils doivent avoir le même niveau d'indentation que
   la structure de contrôle. La déclaration incluse dans les accolades doit
   commencer sur une nouvelle ligne, et le code qu'il contient doit gagner un
   nouveau niveau d'indentation.
*  Les attributs inline ne devraient pas être utilisés à l'intérieur des
   structures de contrôle.

::

    // mauvais = pas d'accolades, déclaration mal placée
    if (expr) statement;

    // mauvais = pas d'accolades
    if (expr)
        statement;

    // bon
    if (expr) {
        statement;
    }

    // mauvais = inline assignment
    if ($variable = Class::function()) {
        statement;
    }

    // bon
    $variable = Class::function();
    if ($variable) {
        statement;
    }

Opérateurs Ternaires
--------------------

Les opérateurs ternaires sont permis quand l'opération entière rentre sur une
ligne. Les opérateurs ternaires plus longs doivent être séparés en
expression ``if else``. Les opérateurs ternaires ne doivent pas être imbriqués.
Des parenthèses optionnelles peuvent être utilisées autour de la condition
vérifiée de l'opération pour rendre le code plus clair::

    // Bien, simple et lisible
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Imbrications des ternaires est mauvaise
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

Fichiers de Template
--------------------

Dans les fichiers de template (fichiers .ctp) les développeurs devront utiliser
les structures de contrôle en mot (keyword control structures).
Les structures de contrôle en mot sont plus faciles à lire dans des fichiers
de template complexes. Les structures de contrôle peuvent soit être contenues
dans un block PHP plus large, soit dans des balises PHP séparées::

    <?php
    if ($isAdmin):
        echo '<p>Vous êtes l utilisateur admin.</p>';
    endif;
    ?>
    <p>Ce qui suit suit est aussi acceptable:</p>
    <?php if ($isAdmin): ?>
        <p>Vous êtes l utilisateur admin.</p>
    <?php endif; ?>

Comparaison
===========

Toujours essayer d'être aussi strict que possible. Si un test non strict est
délibéré, il peut être sage de le commenter afin d'éviter de le confondre avec
une erreur.

Pour tester si une variable est null, il est recommandé d'utiliser une
vérification stricte::

    if ($value === null) {
          // ...
    }

La valeur avec laquelle on vérifie devra être placée sur le côté droit::

    // non recommandé
    if (null === $this->foo()) {
        // ...
    }

    // recommandé
    if ($this->foo() === null) {
        // ...
    }

Appels des Fonctions
====================

Les fonctions doivent être appelées sans espace entre le nom de la fonction et
la parenthèse ouvrante. Il doit y avoir un espace entre chaque paramètre d'un
appel de fonction::

    $var = foo($bar, $bar2, $bar3);

Comme vous pouvez le voir, il doit y avoir un espace des deux côtés des signes
égal (=).

Définition des Méthodes
=======================

Exemple d'une définition de méthode::

    public function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }

        return $var;
    }

Les paramètres avec une valeur par défaut, doivent être placés en dernier dans
la définition de la fonction. Essayez de faire en sorte que vos fonctions
retournent quelque chose, au moins ``true`` ou ``false``, ainsi cela peut
déterminer si l'appel de la fonction est un succès::

    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this->addError();
        }

        return true;
    }

Il y a des espaces des deux côtés du signe égal.

Typehinting
-----------

Les arguments qui attendent des objets, des tableaux ou des callbacks
(fonctions de rappel) peuvent être typés. Nous ne typons que les méthodes
publiques car le typage prend du temps::

    /**
     * Some method description.
     *
     * @param \Cake\ORM\Table $table The table class to use.
     * @param array $array Some array value.
     * @param callable $callback Some callback.
     * @param boolean $boolean Some boolean value.
     */
    public function foo(Table $table, array $array, callable $callback, $boolean)
    {
    }

Ici ``$table`` doit être une instance de ``\Cake\ORM\Table``, ``$array`` doit
être un ``array`` et ``$callback`` doit être de type ``callable`` (un callback
valide).

Notez que si vous souhaitez autoriser que ``$array`` soit aussi une instance de
``\ArrayObject``, vous ne devez pas typer puisque ``array`` accepte seulement le
type primitif::

    /**
     * Description de la method.
     *
     * @param array|\ArrayObject $array Some array value.
     */
    public function foo($array)
    {
    }

Fonctions Anonymes (Closures)
-----------------------------

La définition des fonctions anonymes suit le guide sur le style de codage
`PSR-2 <http://www.php-fig.org/psr/psr-2/>`_, où elles sont déclarées
avec un espace après le mot clé `function`, et un espace avant et après
le mot clé `use`::

    $closure = function ($arg1, $arg2) use ($var1, $var2) {
        // code
    };

Chaînage des Méthodes
=====================

Le chaînage des méthodes doit avoir plusieurs méthodes réparties sur des
lignes distinctes et indentées avec quatre espaces::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('Un super message')
        ->send();

Commenter le Code
=================

Tous les commentaires doivent être écrits en anglais, et doivent clairement
décrire le block de code commenté.

Les commentaires doivent inclure les tags de
`phpDocumentor <http://phpdoc.org>`_ suivants:

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   Using the ``@version <vector> <description>`` format, where ``version`` and ``description`` are mandatory.
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

Les tags de PhpDoc sont un peu du même style que les tags de JavaDoc dans
Java. Les tags sont seulement traités s'il sont la première chose dans la
ligne DocBlock, par exemple::

    /**
     * Exemple de Tag.
     *
     * @author ce tag est analysé, mais @version est ignoré
     * @version 1.0 ce tag est aussi analysé
     */

::

    /**
     * Exemple de tag inline phpDoc.
     *
     * Cette fonction travaille dur avec foo() pour gouverner le monde.
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Foo function
     *
     * @return void
     */
    function foo()
    {
    }

Les blocks de commentaires, avec une exception du premier block dans le fichier,
doivent toujours être précédés par un retour à la ligne.

Types de Variables
------------------

Les types de variables pour l'utilisation dans DocBlocks:

Type
    Description
mixed
    Une variable avec un type indéfini (ou multiple).
int
    Variable de type Integer (Tout nombre).
float
    Type Float (nombres à virgule).
bool
    Type Logique (true ou false).
string
    Type String (toutes les valeurs en " " ou ' ').
null
    Type null. Habituellement utilisé avec un autre type.
array
    Type Tableau.
object
    Type Objet.
resource
    Type Ressource (retourné par exemple par mysql\_connect()).
    Rappelez vous que quand vous spécifiez un type en mixed, vous devez
    indiquer s'il est inconnu, ou les types possibles.
callable
    Fonction de rappel.

Vous pouvez aussi combiner les types en utilisant le caractère pipe::

    int|bool

Pour plus de deux types, il est habituellement mieux d'utiliser seulement
``mixed``.

Quand vous retournez l'objet lui-même, par ex pour chaîner, vous devriez
utiliser ``$this`` à la place::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;
    }

Inclure les Fichiers
====================

``include``, ``require``, ``include_once`` et ``require_once`` n'ont pas de
parenthèses::

    // mauvais = parenthèses
    require_once('ClassFileName.php');
    require_once ($class);

    // bon = pas de parenthèses
    require_once 'ClassFileName.php';
    require_once $class;

Quand vous incluez les fichiers avec des classes ou librairies, utilisez
seulement et toujours la fonction
`require\_once <http://php.net/require_once>`_.

Les Balises PHP
===============

Toujours utiliser les balises longues (``<?php ?>``) plutôt que les balises
courtes (``<? ?>``). L'echo court doit être utilisé dans les fichiers de
template (**.ctp**) lorsque cela est nécessaire.

Echo court
----------

L'echo court doit être utilisé dans les fichiers de vue à la place de
``<?php echo``. Il doit être immédiatement suivi par un espace unique, la
variable ou la valeur de la fonction pour faire un ``echo``, un espace unique,
et la balise de fermeture de php::

    // wrong = semicolon, aucun espace
    <td><?=$name;?></td>

    // good = espaces, aucun semicolon
    <td><?= $name ?></td>

Depuis PHP 5.4, le tag echo court (``<?=``) ne doit plus être considéré.
un 'tag court' est toujours disponible quelque soit la directive ini de
``short_open_tag``.

Convention de Nommage
=====================

Fonctions
---------

Ecrivez toutes les fonctions en camelBack::

    function nomDeFonctionLongue()
    {
    }

Classes
-------

Les noms de classe doivent être écrits en CamelCase, par exemple::

    class ClasseExemple
    {
    }

Variables
---------

Les noms de variable doivent être aussi descriptifs que possible, mais aussi
courts que possible. Tous les noms de variables doivent démarrer avec une lettre
minuscule, et doivent être écrites en camelBack s'il y a plusieurs mots. Les
variables contenant des objets doivent d'une certaine manière être associées à
la classe d'où elles proviennent. Exemple::

    $user = 'John';
    $users = ['John', 'Hans', 'Arne'];

    $dispatcher = new Dispatcher();

Visibilité des Membres
----------------------

Utilisez les mots-clés private et protected de PHP5 pour les méthodes et
variables. De plus les noms des méthodes et variables qui ne sont pas publics
commencent par un underscore simple (``_``). Exemple::

    class A
    {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod()
        {
           /* ... */
        }

        private $_iAmAPrivateVariable;

        private function _iAmAPrivateMethod()
        {
            /* ... */
        }
    }

Exemple d'Adresses
------------------

Pour tous les exemples d'URL et d'adresse email, utilisez "example.com",
"example.org" et "example.net", par exemple:

*  Email: someone@example.com
*  WWW: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

Le nom de domaine "example.com" est réservé à cela (voir :rfc:`2606`) et est
recommandé pour l'utilisation dans la documentation ou comme exemples.

Fichiers
--------

Les noms de fichier qui ne contiennent pas de classes, doivent être écrits en
minuscules et soulignés, par exemple::

    nom_de_fichier_long.php

Casting
-------

Pour le casting, nous utilisons:

Type
    Description
(bool)
        Cast pour boolean.
(int)
        Cast pour integer.
(float)
        Cast pour float.
(string)
        Cast pour string.
(array)
        Cast pour array.
(object)
        Cast pour object.

Constantes
----------

Les constantes doivent être définies en majuscules::

    define('CONSTANTE', 1);

Si un nom de constante a plusieurs mots, ils doivent être séparés par un
caractère underscore, par exemple::

    define('NOM_LONG_DE_CONSTANTE', 2);

Attention quand vous utilisez empty()/isset()
=============================================

While ``empty()`` is an easy to use function, it can mask errors and cause
unintended effects when ``'0'`` and ``0`` are given. When variables or properties
are already defined, the usage of ``empty()`` is not recommended. When working
with variables, it is better to rely on type-coercion to boolean instead of
``empty()``::

    function manipulate($var)
    {
        // Not recommended, $var is already defined in the scope
        if (empty($var)) {
            // ...
        }

        // Use boolean type coercion
        if (!$var) {
            // ...
        }
        if ($var) {
            // ...
        }
    }

When dealing with defined properties you should favour ``null`` checks over
``empty()``/``isset()`` checks::

    class Thing
    {
        private $property; // Defined

        public function readProperty()
        {
            // Not recommended as the property is defined in the class
            if (!isset($this->property)) {
                // ...
            }
            // Recommended
            if ($this->property === null) {

            }
        }
    }

When working with arrays, it is better to merge in defaults over using
``empty()`` checks. By merging in defaults, you can ensure that required keys
are defined::

    function doWork(array $array)
    {
        // Merge defaults to remove need for empty checks.
        $array += [
            'key' => null,
        ];

        // Not recommended, the key is already set
        if (isset($array['key'])) {
            // ...
        }

        // Recommended
        if ($array['key'] !== null) {
            // ...
        }
    }

.. meta::
    :title lang=fr: Normes de code
    :keywords lang=fr: accolades,niveau d'indentation,erreurs logiques,structures de contrôle,structure de contrôle,expr,normes de code,parenthèses,foreach,Lecture possible,moose,nouvelles fonctionnalités,dépôt,developpeurs
