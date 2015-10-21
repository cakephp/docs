PHPUnit Migration Hints
#######################

Migrer vos cas de test vers
`PHPUnit 3.7 <http://www.phpunit.de/manual/current/en/>`_ va, espérons-le être
une transition sans douleur. Cepeandant, il y a quelques différences entre les
cas de test sous PHPUnit et `SimpleTest <http://www.simpletest.org/>`_.

Différences avec SimpleTest
===========================

Il y a un certain nombre de différences entre SimpleTest and PHPUnit. Ce qui
suit est une tentative de lister les différences les plus fréquemment
rencontrées.

startCase() et endCase()
------------------------

Ces méthodes ne sont plus supportées. Utilisez les méthodes static que PHPUnit
fournit:
``setupBeforeClass`` et ``tearDownAfterClass``.

start(), end(), before() et after()
-----------------------------------

Ces méthodes faisaient parti de l'initialisation des cas de test de SimpleTest.
``start()`` et ``end()`` ne sont pas remplacés. Vous pouvez utiliser ``setUp()``
et ``tearDown()`` pour remplacer ``before()`` et ``after()``.

setUp() et tearDown()
---------------------

Dans le passé, les méthodes ``setUp``, ``tearDown``, ``startTest`` et
``endTest`` étaient supportées, et entrainaient une confusion puisqu'elles
étaient quasi identiques mais dans certains cas, vous deviez utiliser l'une ou
l'autre.

Dans le nouveau test suite de CakePHP, il est recommandé d'utiliser uniquement
``setUp`` et ``tearDown``. Ces méthodes startTest et endTest sont toujours
supportées mais sont dépréciées.

getTests
--------

La méthode ``getTests`` n'est plus supportée. Vous pouvez utiliser les filtres
à la place. le runner web de test prend maintenant un paramètre de query
string supplémentaire qui vous permet de spécifier une expression régulière
basique. Cette expression régulière est utilisée pour restreindre les méthodes
qui sont lancées::

    e.g. filter=myMethod

Seuls les tests contenant la chaîne ``myMethod`` seront lancés au prochain
rafraichissement. Le shell testsuite de cake supporte aussi une option
-filter pour filtrer les méthodes.

Méthodes d'assertion
--------------------

Plusieurs des méthodes d'assertion ont des noms légèrement différents entre
PHPUnit et SimpleTest. La où le possible :php:class:`CakeTestCase` fournit
un wrapper pour les noms de méthode de SimpleTest. Ces wrappers de
compatibilité seront retirés dans 2.1.0.
Les méthodes suivantes seront affectées.

* ``assertEqual`` -> ``assertEquals``
* ``assertNotEqual`` -> ``assertNotEquals``
* ``assertPattern`` -> ``assertRegExp``
* ``assertIdentical`` -> ``assertSame``
* ``assertNotIdentical`` -> ``assertNotSame``
* ``assertNoPattern`` -> ``assertNotRegExp``
* ``assertNoErrors`` -> no replacement
* ``expectError`` -> ``setExpectedException``
* ``expectException`` -> ``setExpectedException``
* ``assertReference`` -> ``assertSame``
* ``assertIsA`` -> ``assertType``

Certaines méthodes prennent leurs arguments dans différents ordres, assurez-vous
de vérifier les méthodes que vous utilisez lors de la mise à jour.

Mock expectations
-----------------

Mock objects sont très différents entre PHPUnit et SimpleTest. Il n'y a pas
de compatibilité de wrapper entre eux. Mettre à jour l'utilisation de mock
object peut être un processus douloureux mais nous espérons que les astuces
suivantes vous aideront dans votre migration. Il est hautement recommandé de
vous familiariser vous-même avec la documentation de
`PHPUnit Mock object <http://www.phpunit.de/manual/current/en/test-doubles.html#test-doubles.mock-objects>`_.

Remplacez les appels de méthode
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Les expressions régulières devraient vous aider à mettre à jour certaines
de vos expectations mock object plus simplement.

Remplacez expectOnce() sans params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    expectOnce\(([^\)]+)\);
    expects(\$this->once())->method($1);

Remplacez expectOnce() avec params
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    expectOnce\(([^,]+), array\((.+)\)\);
    expects(\$this->once())->method($1)->with($2);

Remplacez expectAt()
^^^^^^^^^^^^^^^^^^^^

::

    expectAt\((\d+), (.+), array\((.+)\)\);
    expects(\$this->at($1))->method($2)->with($3);

Remplacez expectNever
^^^^^^^^^^^^^^^^^^^^^

::

    expectNever\(([^\)]+)\);
    expects(\$this->never())->method($1);

Remplacez setReturnValue
^^^^^^^^^^^^^^^^^^^^^^^^

::

    setReturnValue\(([^,]+), (.+)\);
    expects(\$this->once())->method($1)->will($this->returnValue($2));

Remplacez setReturnValueAt
^^^^^^^^^^^^^^^^^^^^^^^^^^

::

    setReturnValueAt((\d+), ([^,]+), (.+));
    expects(\$this->at($1))->method($2)->will($this->returnValue($3));

Group tests
------------

Group tests ont été retirés puisque PHPUnit traite les cas de test individuels
et les suites test comme des entités composables dans le runner. Vous pouvez
placer les group tests à l'intérieur du répertoire des cas et utiliser
``PHPUnit_Framework_TestSuite`` en classe de base. Un exemple Testsuite
ressemblerait à ceci::

    class AllJavascriptHelpersTest extends PHPUnit_Framework_TestSuite {

    /**
     * Suite define the tests for this suite
     *
     * @return void
     */
        public static function suite() {
            $suite = new PHPUnit_Framework_TestSuite('JsHelper and all Engine Helpers');

            $helperTestPath = CORE_TEST_CASES . DS . 'View' . DS . 'Helper' . DS;
            $suite->addTestFile($helperTestPath . 'JsHelperTest.php');
            $suite->addTestFile($helperTestPath . 'JqueryEngineHelperTest.php');
            $suite->addTestFile($helperTestPath . 'MootoolsEngineHelperTest.php');
            $suite->addTestFile($helperTestPath . 'PrototypeEngineHelperTest.php');
            return $suite;
        }
    }

``TestManger`` n'a plus les méthodes pour ajouter les tests ni pour les group
tests. Il est recommandé que vous utilisiez les méthodes offertes par PHPUnit.


.. meta::
    :title lang=fr: PHPUnit Migration Hints
    :keywords lang=fr: free transition,vendor directory,static methods,teardown,test cases,pear,dependencies,test case,replacements,phpunit,migration,simpletest,cakephp,discover channel
