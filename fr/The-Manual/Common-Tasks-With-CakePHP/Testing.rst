Tester
######

A partir de la version 1.2, CakePHP inclus le support d'un framework de
test global. Ce framework est une extension du framework SimpleTest pour
PHP. Cette section exposera comment préparer, construire et exécuter vos
tests.

Préparation aux tests
=====================

Prêt à commencer les tests ? Bien ! Alors allons-y !

Installer SimpleTest
--------------------

Le framework de tests fourni avec CakePHP 1.2 est basé sur le framework
de tests SimpleTest. SimpleTest n'est pas livré avec l'installation par
défaut de CakePHP, donc nous avons d'abord besoin de le télécharger.
Vous pouvez le trouver ici :
`https://simpletest.sourceforge.net/ <https://simpletest.sourceforge.net/>`_.

Récupérez la dernière version et décompressez le code dans votre dossier
cake/vendors ou votre dossier app/vendors, comme vous préférez. Vous
devriez maintenant avoir un répertoire vendors/simpletest avec tous les
fichiers et dossiers de SimpleTest à l'intérieur. Pensez à mettre le
niveau de DEBUG à 1 au moins dans votre fichier app/config/core.php
avant de lancer vos tests !

Si vous n'avez pas défini de connexion à une base de données de test
dans votre fichier app/config/database.php, les tables de test seront
créées avec le préfixe ``test_suite_``. Vous pouvez créer une connexion
à la base de données ``$test`` comme celle présentée ci-dessous, pour
contenir toutes les tables de test :

::

        var $test = array(
            'driver' => 'mysql',
            'persistent' => false,
            'host' => 'serveur',
            'login' => 'identifiant',
            'password' => 'mot_passe',
            'database' => 'nomBase'
        );

Si la base de données test est disponible et que CakePHP peut s'y
connecter, toutes les tables y seront créées.

Lancer les cas de tests du cœur
-------------------------------

Les différents packages de CakePHP 1.2 ne sont pas livrés avec les cas
de test du cœur. Pour obtenir ces tests, vous devez les télécharger
depuis le dépôt. Toutes les versions de CakePHP sont actuellement
situées sur le site
`https://code.cakephp.org/ <https://code.cakephp.org/>`_. Vous aurez
besoin de vous créer un compte utilisateur avec une clé personnalisée et
utiliser Git pour accéder au dépôt.

Pour ajouter les tests du cœur à votre application existante,
décompressez le package *nightly* téléchargé dans un répertoire
temporaire. Localisez le répertoire ``/cake/tests`` sur le dépôt et
copiez-le (récursivement) dans votre dossier ``/cake/tests``.

Ces tests peuvent alors être atteints en naviguant à l'adresse
https://votre.domaine.cake/test.php - qui dépend de vos paramétrages
spécifiques. Essayez d'exécuter l'un des groupes de test du cœur en
cliquant sur le lien correspondant. L'exécution d'un groupe de tests
peut prendre un certain temps, mais vous devriez finir par voir quelque
chose comme : "2/2 test cases complete: 49 passes, 0 fails and 0
exceptions".

Félicitations, vous êtes maintenant prêt à commencer l'écriture de tests
!

Si vous lancez tous les tests du cœur ensemble ou les groupes de tests,
la plupart échoueront. Ceci est connu des développeurs CakePHP et
normal, donc pas de panique. Essayez plutôt de lancer chacun des cas de
test du cœur individuellement.

Vue d'ensemble du Test - Test unitaire vs Test Web
==================================================

Le framework de test CakePHP propose 2 façons de tester. L'une est le
Test Unitaire, où vous testez de petites parties de votre code, comme
une méthode dans un composant ou une action dans un contrôleur. L'autre
type de test supporté est le Test Web, où vous automatisez le travail de
test de votre application, à travers la navigation entre pages, le
remplissage de formulaires, le clic sur des liens, etc.

Préparation des données de test
===============================

A propos des fixtures
---------------------

Quand on test du code qui dépend des modèles et des données, on peut
utiliser les **fixtures** (garnitures) comme moyen de générer
temporairement des tables, remplies avec des échantillons de données qui
peuvent être utilisés par le test. Le bénéfice apporté par l'utilisation
des fixtures, c'est que votre test n'a aucune chance de corrompre les
données de l'application en production. En plus, vous pouvez commencer à
tester votre code, avant de développer le contenu réel d'une
application.

CakePHP tente d'utiliser la connexion nommée ``$test`` dans votre
fichier de configuration app/config/database.php. Si cette connexion
n'est pas utilisable, il utilisera la configuration de base de données
``$default`` et créera les tables de test dans la base de données
définie par cette configuration. Dans les deux cas, il ajoutera
"test\_suite\_" à vos propres préfixes de table (s'il y en a) pour
éviter des conflits avec vos tables existantes.

CakePHP réalise ce qui suit durant l'utilisation d'un cas de test basé
sur une fixture :

#. Créer les tables nécessaires à chaque fixture
#. Remplir les tables avec des données, si les données sont fournies
   dans la fixture
#. Lancer les méthodes de test
#. Vider les tables de fixtures
#. Supprimer les tables de fixture de la base de données

Créer des fixtures
------------------

En créant une *fixture*, vous définirez principalement deux choses :
comment la table est composée (quels champs font partie de la table) et
quels enregistrements seront initialement remplis dans la table de test.
Créons notre première *fixture*, qui sera utilisée pour tester notre
propre modèle Article. Créez un fichier nommé **article\_fixture.php**
dans votre répertoire **app/tests/fixtures**, avec le contenu suivant :

::

    <?php  
     class ArticleFixture extends CakeTestFixture { 
          var $name = 'Article'; 
           
          var $fields = array( 
              'id' => array('type' => 'integer', 'key' => 'primary'), 
              'titre' => array('type' => 'string', 'length' => 255, 'null' => false), 
              'contenu' => 'text', 
              'publiable' => array('type' => 'integer', 'default' => '0', 'null' => false), 
              'created' => 'datetime', 
              'updated' => 'datetime' 
          ); 
          var $records = array( 
              array ('id' => 1, 'titre' => 'Premier Article', 'contenu' => 'Corps du premier Article', 'publiable' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
              array ('id' => 2, 'titre' => 'Second Article', 'contenu' => 'Corps du second Article', 'publiable' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
              array ('id' => 3, 'titre' => 'Troisième Article', 'contenu' => 'Corps du troisième Article', 'publiable' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31'), 
          ); 
     } 
     ?> 

La variable ``$name`` est extrêmement importante. Si vous l'omettez,
cake utilisera un mauvais nom de table lorsqu'il génèrera votre base de
donnée de test, et vous aurez alors d'étranges erreurs qui seront
difficiles à débugger. Si vous utilisez PHP 5.2, vous pouvez utiliser
des classes de modèle sans ``$name``, mais vous devez penser à l'inclure
dans vos fichiers *fixture*.

Nous utilisons $fields pour spécifier quels champs feront partie de
cette table et comment seront-ils définis. Le format utilisé pour
définir ces champs est le même que celui utilisé dans la fonction
**generateColumnSchema()** définie dans les classes de moteur de base de
données de Cake (par exemple, dans le fichier dbo\_mysql.php.) Voyons
les attributs disponibles qu'un champ peut prendre et leur signification
:

type
    Type interne de donnée CakePHP. Supportés actuellement : string
    (correspond à VARCHAR), text (correspond à TEXT), integer
    (correspond à INT), float (correspond à FLOAT), datetime (correspond
    à DATETIME), timestamp (correspond à TIMESTAMP), time (correspond à
    TIME), date (correspond à DATE) et binary (correspond à BLOB)
key
    définir à *primary*\ pour rendre le champ AUTO\_INCREMENT et PRIMARY
    KEY de la table.
length
    définir à la longueur spécifique que le champ devrait prendre.
null
    définir soit à *true*\ (pour autoriser les champs NULLs) ou à
    *false* (pour les interdire)
default
    valeur par défaut que le champ doit prendre.

Nous pouvons enfin définir un ensemble d'enregistrements qui seront
remplis après que la table de test soit créée. Le format est moyennement
explicite et nécessite un peu plus d'explication. Gardez juste à
l'esprit que chaque enregistrement dans le tableau $records doit avoir
une clé pour **chaque** champ spécifié dans le tableau $fields. Si un
champ pour un enregistrement particulier nécessite d'avoir une valeur
NULL, spécifiez simplement la valeur de cette clé à NULL.

Importer les informations de la table et des enregistrements
------------------------------------------------------------

Votre application peut avoir déjà fait travailler les modèles avec de
vraies données associées et vous pourriez décider de tester votre modèle
avec ces données. Il pourrait être alors redondant, d'avoir à définir la
structure de la table et/ou les enregistrements dans vos fixtures.
Heureusement, il y a une manière pour vous de définir cette structure de
table et/ou les enregistrements pour une fixture particulière provenant
d'un modèle existant ou d'une table existante.
Commençons par un exemple. Considérant que vous avez un modèle nommé
Article disponible dans votre application (qui correspond à la table
nommée articles), changez la fixture donnée en exemple dans la section
précédente (**app/tests/fixtures/article\_fixture.php**) de cette façon
:

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
       } 
       ?> 
     

Cette déclaration indique à la suite de tests d'importer la définition
de votre table liée au modèle nommé Article. Vous pouvez utiliser tout
modèle disponible dans votre application. La déclaration ci-dessus
n'importe pas d'enregistrements, vous pouvez donc le faire en la
modifiant ainsi :

::

    class ArticleFixture extends CakeTestFixture {
        var $name = 'Article';
        var $import = array('model' => 'Article', 'records' => true);  
    }
    ?> 

Si, au contraire, vous avez une table créée mais pas de modèle
disponible pour elle, vous pouvez préciser que votre import s'effectuera
en lisant cette information de table à la place. Par exemple :

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles'); 
       } 
     ?> 

Importera la définition de table appelée 'articles' en utilisant votre
connexion CakePHP à la base de données nommée 'default'. Si vous voulez
changer la connexion à utiliser, faites simplement :

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
       var $name = 'Article'; 
       var $import = array('table' => 'articles', 'connection' => 'autre'); 
       } 
       ?> 

Puisqu'elle utilise votre connexion CakePHP à la base de données, s'il y
a un quelconque préfixe de table déclaré, il sera automatiquement utlisé
quand vous récupérerez les informations de la table. Les deux fragments
ci-dessus n'importent pas les enregistrements de la table. Pour forcer
la fixture à importer aussi ses enregistrements, changez-la en :

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = array('table' => 'articles', 'records' => true); 
       } 
     ?> 

Vous pouvez naturellement importer votre structure de table depuis une
table/un modèle existant, mais avoir défini vos enregistrements
directement dans la fixture, comme ce fut montré dans la section
précédente. Par exemple :

::

     <?php  
       class ArticleFixture extends CakeTestFixture { 
              var $name = 'Article'; 
              var $import = 'Article'; 
               
              var $records = array( 
                  array ('id' => 1, 'titre' => 'Premier Article', 'contenu' => 'Corps du premier Article', 'publiable' => '1', 'created' => '2007-03-18 10:39:23', 'updated' => '2007-03-18 10:41:31'), 
                  array ('id' => 2, 'titre' => 'Second Article', 'contenu' => 'Corps du second Article', 'publiable' => '1', 'created' => '2007-03-18 10:41:23', 'updated' => '2007-03-18 10:43:31'), 
                  array ('id' => 3, 'titre' => 'Troisième Article', 'contenu' => 'Corps du troisième Article', 'publiable' => '1', 'created' => '2007-03-18 10:43:23', 'updated' => '2007-03-18 10:45:31'), 
              ); 
       } 
     ?> 

Créer des tests
===============

D'abord, revoyons un certain nombre de règles ou directives concernant
les tests :

#. Les fichiers PHP contenant des tests devraient être dans votre
   dossier : **app/tests/cases/[un\_dossier]**.
#. Les noms de ces fichiers devraient se terminer en **.test.php**
   plutôt que simplement .php.
#. Les classes contenant les tests devraient étendre **CakeTestCase** ou
   **CakeWebTestCase**.
#. Le nom de toute méthode contenant un test (par ex. contenant une
   assertion) devrait commencer par **test**, comme dans
   **testPublished()**.

Quand vous avez créé un cas de test, vous pouvez l'exécuter en naviguant
à l'adresse **https://votre.domaine.cake/dossier\_cake/test.php** (ceci
dépend de vos réglages spécifiques) et cliquer les cas de test de l'App,
puis cliquer le lien vers votre fichier spéficique.

CakeTestCase Méthodes Callback
------------------------------

Si vous voulez effectuer quelques opérations juste avant ou après un
CakeTestCase individuel, et/ou avant ou après le CakeTestCase entiern
les méthodes "callbacks" suivants sont disponibles :

**start()**
 Première méthode appelée dans un *test case*.

**end()**
 Dernière méthode appelée dans un *test case*.

**startCase()**
 Appelée avant le démarrage d'un *test case*.

**endCase()**
 Appelée après la fin d'un *test case*.

**before($methode)**
 Annonce le démarrage de la méthode "$methode" du *test case* en cours.

**after($methode)**
 Annonce la fin de la méthode "$methode" du *test case* en cours.

**startTest($methode)**
 Appelée juste avant le démarrage de la méthode "$methode" du *test
 case* en cours.

**endTest($methode)**
 Appelée juste après la fin de la méthode "$methode" du *test case* en
 cours.

Tester les modèles
==================

Créer un cas de test
--------------------

Disons que nous avons déjà notre modèle Article défini dans
app/models/article.php, lequel ressemble à ceci :

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function publiable($champs = null) { 
                  $conditions = array( 
                      $this->name . '.publiable' => 1 
                  ); 
                   
                  return $this->find('all',array(
                      'conditions'=>$conditions,
                      'fields'=>$champs 
                    )); 
              } 
       
       } 
     ?> 

Nous voulons maintenant définir un test qui utilisera cette définition
de modèle, mais à travers des *fixtures*, pour tester quelques
fonctionnalités du modèle. La suite de test CakePHP charge un tout petit
ensemble de fichiers (pour garder les tests isolés), ainsi nous
commençons par charger notre modèle parent (dans ce cas le modèle
Article que nous avons déjà défini), puis par informer la suite de test
que nous voulons tester ce modèle, en précisant quelle configuration de
bases de données elle devrait utiliser. La suite de test CakePHP fournit
une configuration de BDD nommée **test\_suite** qui est utilisée pour
tous les modèles reliés aux *fixtures*. Définir $useDbConfig pour cette
configuration indiquera à CakePHP que ce modèle utilise la connexion à
la base de données de la suite de test.

Les modèles CakePHP utiliseront seulement la configuration de BDD
test\_suite s'ils sont reliés à des *fixtures* dans votre cas de test!

Puisque nous voulons également réutiliser tout le code existant de notre
modèle, nous allons créer un test de modèle qui étendra Article et
définir $useDbConfig et $name judicieusement. Créons maintenant un
fichier nommé **article.test.php** dans votre répertoire
**app/tests/cases/models**, avec le contenu suivant :

::

     <?php  
       App::import('Model','Article'); 

       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

Nous avons créé le cas de test ArticleTestCase. Dans la variable
**$fixtures** nous définissons un ensemble de *fixtures* que nous
utiliserons.

Si votre modèle est associé avec d'autres modèles, vous devrez inclure
TOUTES les *fixtures* pour chaque modèle associé, même si vous ne les
utilisez pas. Par exemple : A hasMany B hasMany C hasMany D. Dans
ATestCase vous devrez inclure les *fixtures* pour a, b, c et d.

Créer une méthode de test
-------------------------

Ajoutons maintenant une méthode pour tester la fonction publiable() du
modèle Article. Editer le fichier
**app/tests/cases/models/article.test.php** afin qu'il ressemble
désormais à ceci :

::

      <?php
        App::import('Model','Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPubliable() {
                $this->Article =& ClassRegistry::init('Article');
        
                $resultat = $this->Article->publiable(array('id', 'titre'));
                $attendus = array(
                    array('Article' => array( 'id' => 1, 'titre' => 'Premier Article' )),
                    array('Article' => array( 'id' => 2, 'titre' => 'Second Article' )),
                    array('Article' => array( 'id' => 3, 'titre' => 'Troisième Article' )),
                );
        
                $this->assertEqual($resultat, $attendus);
            }
        }
        ?>    

Vous pouvez voir que nous avons ajouté une méthode appelée
**testPubliable()**. Nous commençons par créer une instance de notre
*fixture* basée sur le modèle **Article**, puis nous lançons notre
méthode **publiable()**. Dans **$attendus**, nous définissons ce que
nous estimons comme devant être le résultat correct (ce que nous savons,
puisque nous avons défini quels enregistrements sont initialement
remplis dans la table article). Nous vérifions que le résultat est égal
à notre prévision, en utilisant la méthode **assertEqual**. Voyez la
section Créer des Tests pour plus d'information sur la manière de lancer
le test.

Tester les contrôleurs
======================

Créer un cas de test
--------------------

Imaginons que vous ayez un contrôleur typique articles, avec son modèle
correspondant et qui ressemble à ceci :

::

    <?php 
    class ArticlesController extends AppController { 
       var $name = 'Articles'; 
       var $helpers = array('Ajax', 'Form', 'Html'); 
       
       function index($short = null) { 
         if (!empty($this->data)) { 
           $this->Article->save($this->data); 
         } 
         if (!empty($short)) { 
           $resultat = $this->Article->findAll(null, array('id', 'titre'));
         } else { 
           $resultat = $this->Article->findAll(); 
         } 
     
         if (isset($this->params['requested'])) { 
           return $resultat; 
         } 
     
         $this->set('titre', 'Articles'); 
         $this->set('articles', $resultat); 
       } 
    } 
    ?>

Créez un fichier nommé articles\_controller.test.php dans votre
répertoire app/tests/cases/controllers et mettez-y ce qui suit :

::

    <?php 
    class ArticlesControllerTest extends CakeTestCase { 
       function startCase() { 
         echo '<h1>Démarrage du Cas de Test</h1>'; 
       } 
       function endCase() { 
         echo '<h1>Fin du Cas de Test</h1>'; 
       } 
       function startTest($methode) { 
         echo '<h3>Début de la méthode ' . $methode . '</h3>'; 
       } 
       function endTest($methode) { 
         echo '<hr />'; 
       } 
       function testIndex() { 
         $resultat = $this->testAction('/articles/index'); 
         debug($resultat); 
       } 
       function testIndexShort() { 
         $resultat = $this->testAction('/articles/index/short'); 
         debug($resultat); 
       } 
       function testIndexShortGetRenderedHtml() { 
         $resultat = $this->testAction('/articles/index/short', array('return' => 'render')); 
         debug(htmlentities($resultat)); 
       } 
       function testIndexShortGetViewVars() { 
         $resultat = $this->testAction('/articles/index/short', array('return' => 'vars')); 
         debug($resultat); 
       } 
       function testIndexFixturized() { 
         $resultat = $this->testAction('/articles/index/short', array('fixturize' => true)); 
         debug($resultat); 
       } 
       function testIndexPostFixturized() { 
         $data = array('Article' => array('user_id' => 1, 'publiable' => 1, 'slug'=>'nouvel-article', 'titre' => 'Nouvel Article', 'contenu' => 'Nouveau Contenu')); 
         $resultat = $this->testAction('/articles/index', array('fixturize' => true, 'data' => $data, 'method' => 'post')); 
         debug($resultat); 
       } 
    } 
    ?> 

La méthode testAction
---------------------

La chose nouvelle ici, c'est la méthode **testAction**. Le premier
argument de cette méthode est l'url Cake de l'action du contrôleur à
tester, comme dans '/articles/index/short'.

Le second argument est un tableau de paramètres, composé de :

return
    Définir à la valeur que vous voulez retourner.
     Les valeurs possibles sont :

    -  'vars' - Vous obtenez les variables de la vue disponible après
       l'éxécution de l'action
    -  'view' - Vous obtenez la vue générée, sans le layout
    -  'contents' - Vous obtenez la vue HTML complète, incluant le
       layout
    -  'result' - Vous obtenez la valeur retournée quand l'action
       utilise $this->params['requested'].

    Par défault c'est 'result'.
fixturize
    Définir à vrai si vous voulez que vos modèles soient auto-fixturisés
    (ainsi les tables de votre application seront copiées, avec leurs
    enregistrements, pour les tester sans affecter votre application
    réelle en cas de modification des données). Si vous définissez
    'fixturize' comme un tableau de modèles, alors seuls ces modèles
    seront auto-fixturisés, tandis que les autres conserveront leurs
    vraies tables. Si vous souhaitez utiliser vos fichiers de fixture
    avec testAction(), n'utilisez pas fixturize, mais plutôt les
    fixtures comme vous l'auriez fait normalement.
method
    définir à 'post' ou 'get' si vous voulez passez des données au
    contrôleur
data
    les données à passer. A définir comme un tableau associatif composé
    de champs => valeur. Jetez un oeil à
    ``function testIndexPostFixturized()`` dans le cas de test plus
    haut, pour voir comment nous émulons le postage des données d'un
    formulaire, lors de la soumission d'un nouvel article.

Pièges
------

Si vous utilisez testAction pour tester une méthode de l'un de vos
contrôleurs qui fait une redirection, votre test se terminera
immédiatement, sans retourner aucun résultat.
Voyez
`https://trac.cakephp.org/ticket/4154 <https://trac.cakephp.org/ticket/4154>`_
pour une possible correction.

Tester les Assistants
=====================

Puisqu'un pourcentage respectable de la logique réside dans les classes
Assistant (*Helper*), il est important de s'assurer que ces classes sont
couvertes par les cas de test.

Le test d'Assistant est un brin similaire à l'approche utilisée pour les
Composants. Supposez que nous ayons un assistant appelé
InterpreteurDeMonnaieHelper situé dans
``app/views/helpers/interpreteur_de_monnaie_helper.php`` accompagné de
son fichier de cas de test situé dans
``app/tests/cases/helpers/interpreteur_de_monnaie_helper.test.php``

Créer un test d'Assistant, 1ère partie
--------------------------------------

Pour commencer, nous définirons les responsabilités de notre assistant
DevisesFormateurHelper. En gros, il aura deux méthodes, juste pour les
besoins de la démonstration :

function dollar($montant)

Cette fonction recevra le montant à formater. Celui-ci prendra 2
décimales, avec les espaces manquants remplis par des zéros et le
préfixe 'USD' ajouté.

function euro($montant)

Cette fonction fera la même chose que dollar() mais préfixera le montant
retourné avec 'EUR'. Juste pour rendre le tout un peu plus complexe,
nous allons aussi entourer le résultat par des balises span :

::

    <span class="euro"></span> 

Créons d'abord les tests :

::

    <?php

    //Importe l'assistant à tester.
    //Si l'assistant testé doit utiliser d'autres assistants, comme Html, 
    //ils devront être importés dans cette ligne et instanciés dans startTest().
    App::import('Helper', 'DevisesFormateur');

    class DevisesFormateurTest extends CakeTestCase {
        private $devisesFormateur = null;

        //Ici nous instancions notre assistant et tous les autres dont nous avons besoin.
        public function startTest() {
            $this->devisesFormateur = new DevisesFormateurHelper();
        }

        //test de la fonction dollar().
        public function testDollar() {
            $this->assertEqual('USD 5,30', $this->devisesFormateur->dollar(5,30));
            //On devrait toujours avoir deux chiffres après la virgule.
            $this->assertEqual('USD 1,00', $this->devisesFormateur->dollar(1));
            $this->assertEqual('USD 2,05', $this->devisesFormateur->dollar(2,05));
            //Test du séparateur de milliers
            $this->assertEqual('USD 12 000,70', $this->devisesFormateur->dollar(12 000,70));
        }
    }

Ici, nous appelons ``dollar()`` avec différents paramètres et nous
demandons à la suite de test de vérifier si les valeurs retournées sont
égales à ce qui est attendu.

Exécuter le test maintenant provoquera des erreurs (parce que
DevisesFormateurHelper n'existe même pas) montrant que nous avons 3
échecs.

Une fois que nous savons ce que notre méthode devrait faire, nous
pouvons écrire la méthode elle-même :

::

    <?php
    class DevisesFormateurHelper extends AppHelper {
        public function dollar($montant) {
            return 'USD ' . number_format($montant, 2, ',', ' ');
        }
    }

Ici nous définissons le nombre de décimales à 2, le séparateur de
décimale à la virgule, le séparateur des milliers à l'espace et le
préfixe du nombre formaté à la chaîne 'USD'.

Enregistrez çà dans app/views/helpers/devises\_formateur.php et exécutez
le test. Vous devriez voir une barre verte et un message indiquant 4
passes.

Tester les composants
=====================

Considérons que nous voulions tester un composant appelé
TransporteurComponent, qui utilise un modèle appelé Transporteur pour
fournir des fonctionnalités aux autres contrôleurs. Nous utiliserons
quatre fichiers :

-  Un composant appelé Transporteur situé dans
   **app/controllers/components/transporteur.php**
-  Un modèle appelé Transporteur situé dans
   **app/models/transporteur.php**
-  Une fixture appelée TransporteurTestFixture située dans
   **app/tests/fixtures/transporteur\_fixture.php**
-  Le code du test situé dans **app/tests/cases/transporteur.test.php**

Initialiser le composant
------------------------

Puisque `CakePHP déconseille d'importer les modèles directement dans les
composants </fr/view/62/composants>`_, nous avons besoin d'un contrôleur
pour accéder aux données dans le modèle.

Si la fonction startup() du composant ressemble à ceci :

::

    public function startup(&$controller){ 
              $this->Transporteur = $controller->Transporteur;  
     }

alors nous pouvons simplement définir une fausse classe vraiment toute
simple :

::

    class FauxTransporteurController {} 

et lui assigner des valeurs comme çà :

::

    $this->TransporteurComponentTest = new TransporteurComponent(); 
    $controller = new FauxTransporteurController(); 
    $controller->Transporteur = new TransporteurTest(); 
    $this->TransporteurComponentTest->startup(&$controller); 

Créer une méthode de test
-------------------------

Créez simplement une classe qui étende CakeTestCase et commencez à
écrire des tests !

::

    class TransporteurTestCase extends CakeTestCase {
        var $fixtures = array('transporteur');  
        function testGetTransporteur() { 
              $this->TransporteurComponentTest = new TransporteurComponent(); 
              $controller = new FauxTransporteurController(); 
              $controller->Transporteur = new TransporteurTest(); 
              $this->TransporteurComponentTest->startup(&$controller); 
       
              $resultat = $this->TransporteurComponentTest->getTransporteur("12345", "Suéde", "54321", "Suède"); 
              $this->assertEqual($resultat, 1, "SP est meilleur pour 1xxxx-5xxxx"); 
               
              $resultat = $this->TransporteurComponentTest->getTransporteur("41234", "Suéde", "44321", "Suède"); 
              $this->assertEqual($resultat, 2, "WSTS est meilleur pour 41xxx-44xxx"); 
       
              $resultat = $this->TransporteurComponentTest->getTransporteur("41001", "Suéde", "41870", "Suède"); 
              $this->assertEqual($resultat, 3, "GL est meilleur pour 410xx-419xx"); 
       
              $resultat = $this->TransporteurComponentTest->getTransporteur("12345", "Suéde", "54321", "Norvège"); 
              $this->assertEqual($resultat, 0, "Aucun ne peut desservir la Norvège");         
       }
    }
     

Test Web - Tester les vues
==========================

La plupart du temps, si ce n'est toujours, les projets CakePHP sont des
applications web. Tandis que les tests unitaires sont un excellent moyen
de tester de petites parties d'une fonctionnalité, vous pourriez aussi
vouloir tester la fonctionnalité à plus large échelle. La classe
**CakeWebTest**\ Case offre une bonne méthode pour réaliser ce test du
point de vue de l'utilisateur.

A propos de CakeWebTestCase
---------------------------

**CakeWebTestCase** est une extension directe du SimpleTest WebTestCase,
sans aucune autre fonctionnalité. Toutes les fonctionnalités trouvées
dans `SimpleTest, documentation pour le test
Web <https://simpletest.sourceforge.net/fr/web_tester_documentation.html>`_
est également disponible ici. Cela veut dire aussi, qu'aucune autre
fonctionnalité que celles de SimpleTest n'est disponible. Cela veut dire
que vous ne pouvez pas utiliser les fixtures et que **tous les cas de
test web réclamant des mises à jour/sauvegardes dans la base de données,
changeront de manière permanente les valeurs de votre base de données**.
Les résultats de test sont souvent basés sur les valeurs que contient la
base de données, donc s'assurer que la base contient des valeurs que
vous attendez fait partie de la procédure de test.

Créer un test
-------------

Pour être en conformité avec les autres conventions de test, vous
devriez créer vos tests de vue dans tests/cases/views. Vous pouvez, bien
sûr, mettre ces tests n'importe où, mais suivre les conventions chaque
fois que c'est possible est toujours une bonne idée. Créons le fichier
tests/cases/views/web\_complet.test.php

D'abord, lorsque vous voulez écrire des tests web, vous devez penser à
étendre **CakeWebTestCase** plutôt que CakeTestCase :

::

    class WebCompletTestCase extends CakeWebTestCase

Si vous avez besoin de faire quelques préparatifs avant que vous ne
commenciez le test, créez un constructeur :

::

    function WebCompletTestCase(){
      //Faire des trucs ici
    }

En écrivant les vrais cas de test, la première chose que vous devez
faire est d'obtenir quelque chose à regarder. Cela peut se faire en
réalisant une requête **get** ou **post**, en utilisant respectivement
**get()**\ ou **post()**. Ces deux méthodes prennent une url absolue
comme premier paramètre. Ceci peut être récupéré dynamiquement, si nous
supposons que le script de test est situé sous
https://votre.domaine/cake/folder/webroot/test.php, en tapant :

::

    $this->baseurl = current(split("webroot", $_SERVER['PHP_SELF']));

Vous pouvez alors faire des gets et des posts en utilisant les urls
Cake, comme ceci :

::

    $this->get($this->baseurl."/produits/index/");
    $this->post($this->baseurl."/client/login", $data);

Le second paramètre de la méthode post , **$data**, est un tableau
associatif contenant les données postées au format Cake :

::

    $data = array(
      "data[Client][mail]" => "utilisateur@utilisateur.com",
      "data[Client][mot_passe]" => "passeutilisateur");

Quand vous avez requêté la page, vous pouvez faire toutes sortes
d'actions dessus, en utilisant les méthodes standard de test web de
SimpleTest.

Parcourir une page
------------------

CakeWebTest vous donne aussi une option pour naviguer à travers votre
page, en cliquant les liens ou les images, en remplissant des
formulaires et en cliquant les boutons. Merci de vous référer à la
documentation SimpleTest pour plus d'information sur ce sujet.

Tester les plugins
==================

Les tests pour plugins sont créés dans leur propre répertoire, à
l'intérieur du dossier plugins.

::

    /app
         /plugins
             /pizza
                 /tests
                      /cases
                      /fixtures
                      /groups

Ils fonctionnent tout simplement comme des tests normaux, mais vous
devez penser à utiliser les conventions de nommage pour les plugins lors
de l'import des classes. Ceci est un exemple de cas de test pour le
modèle CommandePizza vu au chapitre plugins de ce manuel. Une différence
par rapport aux autres tests se trouve à la première ligne où
'Pizza.CommandePizza' est importée. Vous avez aussi besoin de préfixer
les fixtures de votre plugin avec '``plugin.nom_plugin``\ '.

::

    <?php 
    App::import('Model', 'Pizza.CommandePizza');

    class CommandePizzaCase extends CakeTestCase {

        // Fixtures du plugin situées dans /app/plugins/pizza/tests/fixtures/
        var $fixtures = array('plugin.pizza.commande_pizza');
        var $CommandePizzaTest;
        
        function testerQuelqueChose() {
            // ClassRegistry indique au modèle d'utiliser la connexion à la base de données de test
            $this->CommandePizzaTest =& ClassRegistry::init('CommandePizza');

            // effectuer quelque test utile ici
            $this->assertTrue(is_object($this->CommandePizzaTest));
        }
    }
    ?>

Si vous voulez utiliser les fixtures de plugin dans les tests de votre
application, vous pouvez les référencer en utilisant la syntaxe
'plugin.nomPlugin.nomFixture' dans le tableau $fixtures.

C'est tout ce qu'il y a à dire.

Divers
======

Customiser le reporter de test
------------------------------

Le reporter de test standard est **très** minimaliste. Si vous voulez
une sortie plus reluisante pour épater quelqu'un, ne vous inquiétez pas,
il est très simple à étendre en fait.
Le seul danger c'est que vous devez bidouiller le code du cœur de Cake,
plus particulièrement **/cake/tests/libs/cake\_reporter.php**.

Pour changer la sortie test, vous pouvez surcharger les méthodes
suivantes :

paintHeader()
    S'affiche avant le début du test.
paintPass()
    S'affiche chaque fois qu'un cas de test est réussi. Utilisez
    $this->getTestList() pour obtenir un tableau d'informations
    afférentes au test et $message pour obtenir le résultat du test.
    Pensez à appeler parent::paintPass($message).
paintFail()
    S'affiche chaque fois qu'un cas de test a échoué. Pensez à appeler
    parent::paintFail($message).
paintFooter()
    S'affiche quand le test est fini, i.e. quand tous les cas de tests
    ont été exécutées.

Si, quand paintPass et paintFail s'exécutent, vous voulez masquer la
sortie parente, entourez l'appel par des balises de commentaires HTML,
comme çà :

::

    echo "\n<!-- ";
    parent::paintFail($message);
    echo " -->\n";

Voici un exemple de configuration de **cake\_reporter.php** qui crée une
table pour présenter les résultats du test :

::

    <?php
     /**
     * CakePHP(tm) Tests <https://trac.cakephp.org/wiki/Developement/TestSuite>
     * Copyright 2005-2008, Cake Software Foundation, Inc.
     *                              1785 E. Sahara Avenue, Suite 490-204
     *                              Las Vegas, Nevada 89104
     *
     *  Licensed under The Open Group Test Suite License
     *  Redistributions of files must retain the above copyright notice.
     */
     class CakeHtmlReporter extends HtmlReporter {
     function CakeHtmlReporter($characterSet = 'UTF-8') {
     parent::HtmlReporter($characterSet);
     }
     
    function paintHeader($testName) {
      $this->sendNoCacheHeaders();
      $baseUrl = BASE;
      print "<h2>$testName</h2>\n";
      print "<table style=\"\"><th>Rés.</th><th>Cas de Test</th><th>Message</th>\n";
      flush();
     }

     function paintFooter($testName) {
       $colour = ($this->getFailCount() + $this->getExceptionCount() > 0 ? "red" : "green");
       print "</table>\n";
       print "<div style=\"";
       print "padding: 8px; margin-top: 1em; background-color: $colour; color: white;";
       print "\">";
       print $this->getTestCaseProgress() . "/" . $this->getTestCaseCount();
       print " cas de test terminés :\n";
       print "<strong>" . $this->getPassCount() . "</strong> réussites, ";
       print "<strong>" . $this->getFailCount() . "</strong> échecs et ";
       print "<strong>" . $this->getExceptionCount() . "</strong> exceptions.";
       print "</div>\n";
     }

     function paintPass($message) {
       parent::paintPass($message);
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden;                  border-right: hidden\">\n";
       print "\t\t<span style=\"color: green;\">Réussi</span>: \n";
       echo "\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       array_shift($breadcrumb);
       array_shift($breadcrumb);
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $message = split('at \[', $message);
       print "-&gt;$message[0]<br />\n\n";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function paintFail($message) {
       echo "\n<!-- ";
       parent::paintFail($message);
       echo " -->\n";
       echo "<tr>\n\t<td width=\"20\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "\t\t<span style=\"color: red;\">Raté</span>: \n";
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       $breadcrumb = $this->getTestList();
       print implode("-&gt;", $breadcrumb);
       echo "\n\t</td>\n\t<td width=\"40%\" style=\"border: dotted 1px; border-top: hidden; border-left: hidden; border-right: hidden\">\n";
       print "$message";
       echo "\n\t</td>\n</tr>\n\n";
     }
     
     function _getCss() {
       return parent::_getCss() . ' .pass { color: green; }';
     }
     
     }
     ?>

Grouper les tests
-----------------

Si vous voulez faire fonctionner plusieurs de vos tests en même temps,
vous pouvez essayer de créer un groupe de test. Créez un fichier dans
**/app/tests/groups/** et nommez-le de cette façon
**nom\_votre\_groupe\_test.group.php**. Dans ce fichier, créez une
classe qui étend **GroupTest** et importez les tests comme suit :

::

    <?php 
    class EssaiGroupTest extends GroupTest { 
      var $label = 'Essai'; 
      function essaiGroupTest() { 
        TestManager::addTestCasesFromDirectory($this, APP_TEST_CASES . DS . 'models'); 
      } 
    } 
    ?> 

Le code ci-dessus groupera tout les cas de tests trouvés dans le dossier
**/app/tests/cases/models/**. Pour ajouter un fichier individuel,
utilisez **TestManager::addTestFile**\ ($this, nom\_fichier).

Lancer les tests depuis la ligne de commande
============================================

Si vous avez installé simpletest, vous pouvez lancer vos tests depuis la
ligne de commande de votre application.

Depuis **app/**, exécutez :

::

    cake testsuite help

::

    Usage: 
        cake testsuite category test_type file
            - category - "app", "core" or name of a plugin
            - test_type - "case", "group" or "all"
            - test_file - file name with folder prefix and without the (test|group).php suffix

    Examples: 
            cake testsuite app all
            cake testsuite core all

            cake testsuite app case behaviors/debuggable
            cake testsuite app case models/my_model
            cake testsuite app case controllers/my_controller

            cake testsuite core case file
            cake testsuite core case router
            cake testsuite core case set

            cake testsuite app group mygroup
            cake testsuite core group acl
            cake testsuite core group socket

            cake testsuite bugs case models/bug
              // for the plugin 'bugs' and its test case 'models/bug'
            cake testsuite bugs group bug
              // for the plugin bugs and its test group 'bug'

    Code Coverage Analysis: 


    Append 'cov' to any of the above in order to enable code coverage analysis

Comme le suggère le menu help, vous serez en mesure de lancer tous vos
tests, une partie ou un seul cas de test depuis votre app, votre plugin
ou le cœur, simplement depuis la ligne de commande.

Si vous avez un modèle de test dans
**test/models/mon\_modele.test.php**, vous lancerez simplement ce cas de
test en exécutant :

::

    cake testsuite app models/mon_modele

