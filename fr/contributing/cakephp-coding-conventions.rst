Normes de codes
###############

Les développeurs de CakePHP vont utiliser les normes de code suivantes.

Il est recommandé que les autres personnes qui développent des IngredientsCake
suivent les mêmes normes.

Vous pouvez utilisez le `CakePHP Code Sniffer
<https://github.com/cakephp/cakephp-codesniffer>`_ pour vérifier que votre code
suit les normes requises.

Ajout de Nouvelles Fonctionnalités
==================================

Aucune nouvelle fonctionnalité ne devrait être ajoutée, sans avoir fait ses
propres tests - qui doivent être validés avant de les committer au dépôt.

Indentation
===========

Un onglet sera utilisé pour l'indentation.

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
        echo "Valeur boléenne si true";
        if ($stringVariable === "moose") {
            echo "Nous avons rencontré un moose";
        }
    }

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
*  Les attributs Inline ne devraient pas être utilisés à l'intérieur des
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

Opérateurs ternaires
--------------------

Les opérateurs ternaires sont permis quand l'opération entière rentre sur une
ligne. Les opérateurs ternaires plus longs doivent être séparés en
expression ``if else``. Les opérateurs ternaires ne doivent pas être imbriqués.
Des parenthèses optionnelles peuvent être utilisées autour de la condition
vérifiée de l'opération pour rendre le code plus clair::

    // Bien, simple et lisible
    $variable = isset($options['variable']) ? $options['variable'] : true;

    // Imbriquations des ternaires est mauvaise
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;


Fichiers de Vue
---------------

Dans les fichiers de vue (fichiers .ctp) les développeurs devront utiliser
les structures de contrôle en mot (keyword control structures).
Les structures de contrôle en mot sont plus faciles à lire dans des fichiers
de vue complexes. Les structures de contrôle peuvent soit être contenues dans
un block PHP plus large, soit dans des tags PHP séparés::

    <?php
    if ($isAdmin):
        echo '<p>You are the admin user.</p>';
    endif;
    ?>
    <p>The following is also acceptable:</p>
    <?php if ($isAdmin): ?>
        <p>You are the admin user.</p>
    <?php endif; ?>

Comparaison
===========

Toujours essayer d'être aussi strict que possible. Si un test non strict
est délibéré, il peut être sage de le commenter afin d'éviter de le confondre
avec une erreur.

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
la parenthèse ouvrante. Il doit y avoir un espace entre chaque paramètre
d'un appel de fonction::

    $var = foo($bar, $bar2, $bar3); 

Comme vous pouvez le voir, il doit y avoir un espace des deux côtés des
signes égal (=).

Définition des Méthodes
=======================

Exemple d'un définition de méthode::

    public function someFunction($arg1, $arg2 = '') {
        if (expr) {
            statement;
        }
        return $var;
    }

Les paramètres avec une valeur par défaut, doivent être placés en dernier
dans la défintion de la fonction. Essayez de faire en sorte que vos fonctions
retournent quelque chose, au moins ``true`` ou ``false``, ainsi cela peut
déterminer si l'appel de la fonction est un succès::

    public function connection($dns, $persistent = false) {
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

Les arguments qui attendent des objets ou des tableaux peuvent être typés.
Nous ne typons que les méthodes publiques car le typage prend du temps::

    /**
     * Some method description.
     *
     * @param Model $Model Le model à utiliser.
     * @param array $array Une valeur de tableau.
     * @param bool $boolean Une valeur boléenne.
     */
    public function foo(Model $Model, array $array, $boolean) {
    }

Ici ``$Model`` doit être une instance de ``Model`` et ``$array`` doit être un
``array``.

Notez que si vous souhaitez autoriser que ``$array`` soit aussi une instance
de ``ArrayObject``, vous ne devez pas typer puisque ``array`` accepte seulement
le type primitif::

    /**
     * Description de la method.
     *
     * @param array|ArrayObject $array Some array value.
     */
    public function foo($array) {
    }

Chaînage des Méthodes
---------------------

Le chaînage des méthodes doit avoir plusieurs méthodes réparties sur des
lignes distinctes et indentées avec une tabulation::

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

*  `@author <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.author.pkg.html>`_
*  `@copyright <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.copyright.pkg.html>`_
*  `@deprecated <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.deprecated.pkg.html>`_
*  `@example <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.example.pkg.html>`_
*  `@ignore <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.ignore.pkg.html>`_
*  `@internal <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.internal.pkg.html>`_
*  `@link <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.link.pkg.html>`_
*  `@see <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.see.pkg.html>`_
*  `@since <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.since.pkg.html>`_
*  `@tutorial <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.tutorial.pkg.html>`_
*  `@version <http://manual.phpdoc.org/HTMLframesConverter/phpdoc.de/phpDocumentor/tutorial_tags.version.pkg.html>`_

Les tags de PhpDoc sont un peu du même style que les tags de JavaDoc dans
Java. Les tags sont seulement traités si ils sont la première chose dans la
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
    function bar() {
    }

    /**
     * Foo function
     *
     * @return void
     */
    function foo() {
    }

Les blocks de commentaires, avec une exception du premier block dans le
fichier, doivent toujours être précédés par un retour à la ligne.

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

Les Tags PHP
============

Toujours utiliser les tags longs (``<?php ?>``) plutôt que les tags courts
(``<? ?>``).

Convention de Nommage
=====================

Fonctions
---------

Ecrivez toutes les fonctions en camelBack::

    function nomDeFonctionLongue() {
    }

Classes
-------

Les noms de classe doivent être écrites en CamelCase, par exemple::

    class ClasseExemple {
    }

Variables
---------

Les noms de variable doivent être aussi descriptifs que possible, mais
aussi courts que possible. Les variables normales doivent démarrer
avec une lettre minuscule, et doivent être écrites en camelBack si il y a
plusieurs mots. Les variables contenant des objets doivent démarrer
avec une majuscule, et d'une certaine manière être associées à la classe d'où
elles proviennent. Exemple::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $Dispatcher = new Dispatcher();

Visibilité des Membres
----------------------

Utilisez les mots-clés private et protected de PHP5 pour les méthodes et
variables. De plus les noms des méthodes et variables protégées commencent
avec un underscore simple (``_``). Exemple::

    class A {
        protected $_jeSuisUneVariableProtegee;

        protected function _jeSuisUnemethodeProtegee() {
           /*...*/
        }
    }

Les noms de méthodes et variables privées commencent avec un underscore double
(``__``). Exemple::

    class A {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod() {
            /*...*/
        }
    }

Essayez cependant d'éviter les méthodes et variables privées et privilégiez
plutôt les variables protégées.
Ainsi elles pourront être accessible ou modifié par les sous-classes, alors que
celles privées empêchent l'extension ou leur réutilisation. La visibilité privée
rend aussi le test beaucoup plus difficile.

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
    indiquer si il est inconnu, ou les types possibles.
callable
    Function appelable.

Vous pouvez aussi combiner les types en utilisant le caractère pipe::

    int|bool

Pour plus de deux types, il est habituellement mieux d'utiliser seulement
``mixed``.

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


.. meta::
    :title lang=fr: Normes de code
    :keywords lang=fr: accolades,niveau d'indentation,erreurs logiques,structures de contrôle,structure de contôle,expr,normes de code,parenthèses,foreach,Lecture possible,moose,nouvelles fonctionnalités,dépôt,developpeurs
