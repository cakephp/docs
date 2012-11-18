Composants
##########

 

Introduction
============

Les composants (*Components*) sont des regroupements de logique
applicative qui sont partagés entre les contrôleurs. Si vous vous
surprenez à vouloir copier et coller des choses entre vos contrôleurs,
alors vous devriez envisager de regrouper plusieurs fonctionnalités dans
un Composant.

CakePHP est également livré avec un fantastique ensemble de composants,
que vous pouvez utiliser pour vous aider :

-  Sécurité
-  Sessions
-  Listes de contrôle d'accès (*ACL*)
-  Emails
-  Cookies
-  Authentification
-  Traitement de requêtes

Chacun de ces composants d’origine est détaillé dans des chapitres
spécifiques. Pour l’heure, nous allons vous montrer comment créer vos
propres composants. La création de composants vous permet de garder le
code de vos contrôleurs propre et vous permet de réutiliser du code
entre vos projets.

Configuration des Composants
============================

De nombreux composants du cœur nécessitent une configuration. Quelques
exemples : `Auth </fr/view/172/Authentification>`_,
`Cookie </fr/view/177/Cookies>`_ et `Email </fr/view/176/Email>`_. Toute
configuration pour ces composants, et pour les composants en général, se
fait dans la méthode ``beforeFilter()`` de vos contrôleurs.

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'utilisateurs', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonstre';
    }

Serait un exemple de configuration des variables de composants dans la
méthode ``beforeFilter()`` de votre contrôleur.

Il est néanmoins possible qu'un composant ait besoin que certaines
options de configuration soient définies dans la méthode
``beforeFilter`` du contrôleur qui l'exécute. A cette fin, certains
composants autorisent la définition de certaines de leurs options dans
le tableau ``$components``

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session'));

Consultez la documentation appropriée pour déterminer quelles options de
configuration fournit chaque composant.

Les composants peuvent avoir les *callbacks* ``beforeRender`` et
``beforeRedirect``, qui seront déclenchés respectivement avant que votre
page ne soit rendue et avant une redirection.

Vous pouvez désactiver le déclenchement des *callbacks* en paramétrant
la propriété ``enabled`` d'un composant à ``false``.

Créer des Composants personnalisés
==================================

Supposons que notre application en ligne ait besoin de réaliser une
opération mathématique complexe dans plusieurs sections différentes de
l'application. Nous pourrions créer un composant pour héberger cette
logique partagée afin de l'utiliser dans plusieurs contrôleurs
différents.

La première étape consiste à créer un nouveau fichier et une classe pour
le composant. Créez le fichier dans
/app/controllers/components/math.php. La structure de base pour le
composant ressemblerait à quelque chose comme ça :

::

    <?php

    class MathComponent extends Object {
        function faitUneOperationComplexe($montant1, $montant2) {
            return $montant1 + $montant2;
        }
    }

    ?>

Prenez note que le composant Math étend Object et non Component. Etendre
Component peut générer des problèmes de redirection infinie, lorsqu'il
est combiné avec d'autres composants.

Inclure des Composants dans vos Contrôleurs
-------------------------------------------

Une fois notre composant terminé, nous pouvons l’utiliser au sein des
contrôleurs de l’application en plaçant son nom (sans la partie
"Component") dans le tableau $components du contrôleur. Le contrôleur
sera automatiquement pourvu d'un nouvel attribut nommé d'après le
composant, à travers lequel nous pouvons à une instance de celui-ci :

::

    /* Rend le nouveau composant disponible par $this->Math
    ainsi que le composant standard $this->Session */
    var $components = array('Math', 'Session');

Les Composants déclarés dans ``AppController`` seront fusionnés avec
ceux déclarés dans vos autres contrôleurs. Donc il n'y a pas besoin de
re-déclarer le même composant deux fois.

Quand vous incluez des Composants dans un Contrôleur, vous pouvez aussi
déclarer un ensemble de paramètres qui seront passés à la méthode
``initialize()`` du Composant. Ces paramètres peuvent alors être pris en
charge par le Composant.

::

    var $components = array(
        'Math' => array(
            'precision' => 2,
            'generateurAleatoire' => 'srand'
        ),
        'Session', 'Auth'
    );

L'exemple ci-dessus passerait le tableau contenant "precision" et
"generateurAleatoire" comme second paramètre, à la méthode
``initialize()`` du MathComponent.

Actuellement, cette syntaxe n'est implémentée par aucun des Composants
du Cœur.

Classe d'accès MVC dans les Composants
--------------------------------------

Pour avoir accès à l’instance du contrôleur depuis votre composant
nouvellement créé, vous devrez implémenter la méthode startup() ou
initialize(). Cets méthodes spéciales reçoivent une référence vers le
contrôleur comme premier paramètre et sont automatiquement appelées. La
méthode initialize() est appelée avant la méthode beforeFilter() du
contrôleur, et la méthode startup() après beforeFilter(). Si pour une
raison quelconque vous *ne* voulez *pas* que la méthode startup() soit
appelée lorsque le contrôleur met tout en place, fixez la variable de
classe $disableStartup à *true*.

Si vous voulez insérer un peu de logique avant qu’une méthode
"beforeFilter()" du contrôleur n’ait été appelée, utilisez la méthode
initialize() du composant.

::

    <?php
    class VerifieComponent extends Object {
        //appelée avant Controller::beforeFilter()
        function initialize(&$controller) {
            // sauvegarde la référence du contrôleur pour une utilisation ultérieure
            $this->controller =& $controller;
        }

        //appelée après Controller::beforeFilter()
        function startup(&$controller) {
        }

        function redirigeAilleurs($valeur) {
            // utilise une méthode du contrôleur
            $this->controller->redirect($valeur);
        }
    }
    ?>

Vous pourriez également vouloir utiliser d'autres composants dans un
composant personnalisé. Pour ce faire, créez simplement une variable de
classe $components (comme vous l'auriez fait dans un contrôleur) qui est
un tableau contenant les noms des composants que vous souhaitez
utiliser.

Seule la méthode ``initialize`` des sous-composants est appelée
automatiquement.

::

    <?php
    class MonComponent extends Object {

        // Ce composant utilise d'autres composants
        var $components = array('Session', 'Math');

        function faitQuelquechose() {
            $resultat = $this->Math->faitUneOperationComplexe(1, 2);
            $this->Session->write('quelquechose', $resultat);
        }

    }
    ?>

Accéder/utiliser un modèle dans un composant n'est généralement pas
recommandé; cependant si après avoir évalué les différentes possibilités
c'est ce que vous voulez faire, vous devrez instancier la classe de
votre modèle et l'utiliser manuellement. Voici un exemple :

::

    <?php
    class MathComponent extends Object {
        function faitUneOperationComplexe($montant1, $montant2) {
            return $montant1 + $montant2;
        }

        function faitUneOperationSuperComplexe($montant1, $montant2) {
            $instanceUtilisateur = ClassRegistry::init('Utilisateur');
            $utilisateursTotaux = $instanceUtilisateur->find('count');
            return ($montant1 + $montant2) / $utilisateursTotaux;
        }
    }
    ?>

Utilisez d'autres Composants dans votre Composant
-------------------------------------------------

Parfois, l'un de vos composants peut nécessiter l'usage d'un autre.

Vous pouvez inclure d'autres composants dans votre composant, exactement
de la même manière que vous les incluez dans les contrôleurs : utilisez
la propriété ``$components``.

::

    <?php
    class CustomComponent extends Object {
        var $name = "Custom"; // le nom de votre composant
        var $components = array( "Existant" ); // l'autre composant que votre composant utilise

        function initialize(&$controller) {
            $this->Existant->foo();
        }

        function bar() {
            // ...
        }
    }

::

    <?php
    class ExistantComponent extends Object {
        var $name = "Existant";

        function initialize(&$controller) {
            $this->Custom->bar();
        }

        function foo() {
            // ...
        }
    }

