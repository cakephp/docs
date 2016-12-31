Models
######

Models repräsentieren Daten und werden von CakePHP-Anwendungen zum
Zugriff auf diese Daten genutzt. Ein Model stellt normalerweise eine
Datenbanktabelle dar. Allerdings können Models auf alles, was Daten
enthalten kann zugreifen. Also auch Dateien, LDAP-Einträge, iCal-Events
oder Zeilen in einer CSV-Datei.

Models können mit anderen Models assoziiert werden. Zum Beispiel kann
ein Rezept mit dessen Autor sowie den benötigten Zutaten assoziiert
werden.

Dieser Abschnitt erklärt, welche Fähigkeiten des Models automatisiert
und auch überschrieben werden können und welche Methoden und
Eigenschaften es haben kann. Es werden die verschiedenen Möglichkeiten
Daten zueinander zuzuordnen erklärt und beschrieben wie Daten abgerufen,
gespeichert und gelöscht werden. Schließlich werden dann auch noch
*Datasources* behandelt.

Understanding Models
====================

A Model represents your data model and in object-oriented programming is
an object that represents a "thing", like a car, a person, or a house. A
blog, for example, may have many blog posts and each blog post may have
many comments. The Blog, Post, and Comment are all examples of models,
each associated with another.

Here is a simple example of a model definition in CakePHP:

::

    <?php

    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }

    ?>

With just this simple declaration, the Ingredient model is bestowed with
all the functionality you need to create queries along with saving and
deleting data. These magic methods come from CakePHP's model
inheritance. The Ingredient model extends the application model,
AppModel, which extends CakePHP's internal Model class. It is this
internal Model class that bestows the functionality onto your custom
model, Ingredient.

This intermediate class, AppModel, is empty and resides within the
/cake/ folder, by default. The AppModel allows you to define
functionality that should be made available to all models within your
application. To do so, you need to create your own app\_model.php file
that resides in the root of the /app/ folder. Creating a project using
`Bake </de/view/113/code-generation-with-bake>`_ will automatically
generate this file for you.

See also `Behaviors </de/view/88/behaviors>`_ for more information on
how to apply similar logic to multiple models.

Note: The ``$name`` property is necessary for PHP4 but optional for
PHP5.

With your model defined, it can be accessed from within your
`Controller </de/view/49/controllers>`_. CakePHP will automatically make
the model available for access when its name matches that of the
controller. For example, a controller named IngredientsController will
automatically initialize the Ingredient model and attach it to the
controller at ``$this->Ingredient``.

::

    <?php

    class IngredientsController extends AppController {
        function index() {
            //grab all ingredients and pass it to the view:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

    ?>

Associated models are available through the main model. In the following
example, Recipe has an association with the Ingredient model.

::

    $this->Recipe->Ingredient->find('all');

As you may have seen in Controllers, you can attach multiple models to
the controller and accessible directly from the controller. In the
following example, both Recipe and User are accessible from the current
controller.

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe', 'User');
        function index() {
           $this->Recipe->find('all');
           $this->User->find('all');
        }
    }
    ?>

If you haven't added the model via the ``$uses`` property then you'll
need to manually import the model and instantiate it from within the
action.

::

    <?php
    class RecipeController extends AppController {
        var $uses = array('Recipe');
        function index() {
           $this->Recipe->find('all');

           App::import('Model', 'User');
           $user = new User();
           $user->find('all');
        }
    }
    ?>

Datenbanktabellen erstellen
===========================

Auch wenn CakePHP nicht Datenbank-basierte Datenquellen haben kann sind
die Quellen in den meisten Fällen doch Datenbank-basiert. CakePHP wurde
so entworfen, dass es mit MySQL, MSSQL, Oracle, PostgreSQL und vielen
anderen Datenbanken zusammenarbeiten kann. Man kann die
Datenbanktabellen ganz normal erstellen, wie man es sonst auch tun
würde. Werden dann die Modelklassen erstellt, sind diese automatisch auf
die Tabellen abgebildet, die erstellt wurden.

Die Tabellennamen sind per Konvention kleingeschrieben und pluralisiert;
wobei Tabellen, die aus mehreren Wörtern bestehen mit Unterstrich
getrennt werden. Zum Beispiel bekommt das Model *Ingredient* die Tabelle
*ingredients*. Ein Model *EventRegistration* erhält die Tabelle
*event\_registrations*. CakePHP untersucht dann die Tabellen und stellt
selbständig den Datentyp jedes Feldes fest und gebraucht diese
Information dann um bestimmte Funktionen zu automatisieren; z.B. die
Ausgabe von Formularfeldern im *View*.

Feldnamen sind per Konvention kleingeschrieben und einzelne Wörter
werden mit Unterstrichen getrennt.

Die Model-Tabellen-Assoziation kann mit dem ``useTable``-Attribut des
Models, was später noch genauer erklärt wird, überschrieben werden.

Der Rest dieses Abschnitts zeigt dann wie CakePHP Datenbankfelder auf
PHP-Datentypen abbildet und bestimmte Aufgaben - abhängig von der
Definition dieser Felder - automatisiert .

Umgang mit Datentypen, je nach Datenbank
----------------------------------------

Jedes `relationales Datenbankmanagementsystem
(RDBMS) <http://de.wikipedia.org/wiki/Relationale%20Datenbak>`_
definiert Datentypen ein bischen unterschiedlich. In den
Datenquellen-Klassen nimmt CakePHP für jedes RDBMS diese Datentypen auf,
so dass es die Datentypen einheitlich wiedererkennen kann; egal welches
Datenbanksystem später zum Einsatz kommt.

Dieser Abschnitt erklärt, wie CakePHP die Datentypen der einzelnen
Datenbanksysteme versteht und interpretiert.

MySQL
~~~~~

+----------------+----------------------------+
| CakePHP Typ    | Feld Eigenschaft           |
+================+============================+
| primary\_key   | NOT NULL auto\_increment   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int(11)                    |
+----------------+----------------------------+
| float          | float                      |
+----------------+----------------------------+
| datetime       | datetime                   |
+----------------+----------------------------+
| timestamp      | datetime                   |
+----------------+----------------------------+
| time           | time                       |
+----------------+----------------------------+
| date           | date                       |
+----------------+----------------------------+
| binary         | blob                       |
+----------------+----------------------------+
| boolean        | tinyint(1)                 |
+----------------+----------------------------+

Ein *tinyint(1)*-Feld wird als *boolean* behandelt.

MySQLi
~~~~~~

+----------------+--------------------------------+
| CakePHP Typ    | Feld Eigenschaft               |
+================+================================+
| primary\_key   | DEFAULT NULL auto\_increment   |
+----------------+--------------------------------+
| string         | varchar(255)                   |
+----------------+--------------------------------+
| text           | text                           |
+----------------+--------------------------------+
| integer        | int(11)                        |
+----------------+--------------------------------+
| float          | float                          |
+----------------+--------------------------------+
| datetime       | datetime                       |
+----------------+--------------------------------+
| timestamp      | datetime                       |
+----------------+--------------------------------+
| time           | time                           |
+----------------+--------------------------------+
| date           | date                           |
+----------------+--------------------------------+
| binary         | blob                           |
+----------------+--------------------------------+
| boolean        | tinyint(1)                     |
+----------------+--------------------------------+

ADOdb
~~~~~

+----------------+--------------------+
| CakePHP Typ    | Feld Eigenschaft   |
+================+====================+
| primary\_key   | R(11)              |
+----------------+--------------------+
| string         | C(255)             |
+----------------+--------------------+
| text           | X                  |
+----------------+--------------------+
| integer        | I(11)              |
+----------------+--------------------+
| float          | N                  |
+----------------+--------------------+
| datetime       | T (Y-m-d H:i:s)    |
+----------------+--------------------+
| timestamp      | T (Y-m-d H:i:s)    |
+----------------+--------------------+
| time           | T (H:i:s)          |
+----------------+--------------------+
| date           | T (Y-m-d)          |
+----------------+--------------------+
| binary         | B                  |
+----------------+--------------------+
| boolean        | L(1)               |
+----------------+--------------------+

DB2
~~~

+----------------+----------------------------------------------------------------------------+
| CakePHP Typ    | Feld Eigenschaft                                                           |
+================+============================================================================+
| primary\_key   | not null generated by default as identity (start with 1, increment by 1)   |
+----------------+----------------------------------------------------------------------------+
| string         | varchar(255)                                                               |
+----------------+----------------------------------------------------------------------------+
| text           | clob                                                                       |
+----------------+----------------------------------------------------------------------------+
| integer        | integer(10)                                                                |
+----------------+----------------------------------------------------------------------------+
| float          | double                                                                     |
+----------------+----------------------------------------------------------------------------+
| datetime       | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| timestamp      | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| time           | time (H.i.s)                                                               |
+----------------+----------------------------------------------------------------------------+
| date           | date (Y-m-d)                                                               |
+----------------+----------------------------------------------------------------------------+
| binary         | blob                                                                       |
+----------------+----------------------------------------------------------------------------+
| boolean        | smallint(1)                                                                |
+----------------+----------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+----------------+--------------------------------------------------------+
| CakePHP Typ    | Feld Eigenschaft                                       |
+================+========================================================+
| primary\_key   | IDENTITY (1, 1) NOT NULL                               |
+----------------+--------------------------------------------------------+
| string         | varchar(255)                                           |
+----------------+--------------------------------------------------------+
| text           | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+----------------+--------------------------------------------------------+
| integer        | integer                                                |
+----------------+--------------------------------------------------------+
| float          | float                                                  |
+----------------+--------------------------------------------------------+
| datetime       | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| timestamp      | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| time           | time (H:i:s)                                           |
+----------------+--------------------------------------------------------+
| date           | date (d.m.Y)                                           |
+----------------+--------------------------------------------------------+
| binary         | blob                                                   |
+----------------+--------------------------------------------------------+
| boolean        | smallint                                               |
+----------------+--------------------------------------------------------+

MS SQL
~~~~~~

+----------------+----------------------------+
| CakePHP Typ    | Feld Eigenschaft           |
+================+============================+
| primary\_key   | IDENTITY (1, 1) NOT NULL   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int                        |
+----------------+----------------------------+
| float          | numeric                    |
+----------------+----------------------------+
| datetime       | datetime (Y-m-d H:i:s)     |
+----------------+----------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)    |
+----------------+----------------------------+
| time           | datetime (H:i:s)           |
+----------------+----------------------------+
| date           | datetime (Y-m-d)           |
+----------------+----------------------------+
| binary         | image                      |
+----------------+----------------------------+
| boolean        | bit                        |
+----------------+----------------------------+

Oracle
~~~~~~

+----------------+----------------------+
| CakePHP Typ    | Feld Eigenschaft     |
+================+======================+
| primary\_key   | number NOT NULL      |
+----------------+----------------------+
| string         | varchar2(255)        |
+----------------+----------------------+
| text           | varchar2             |
+----------------+----------------------+
| integer        | numeric              |
+----------------+----------------------+
| float          | float                |
+----------------+----------------------+
| datetime       | date (Y-m-d H:i:s)   |
+----------------+----------------------+
| timestamp      | date (Y-m-d H:i:s)   |
+----------------+----------------------+
| time           | date (H:i:s)         |
+----------------+----------------------+
| date           | date (Y-m-d)         |
+----------------+----------------------+
| binary         | bytea                |
+----------------+----------------------+
| boolean        | boolean              |
+----------------+----------------------+
| number         | numeric              |
+----------------+----------------------+
| inet           | inet                 |
+----------------+----------------------+

PostgreSQL
~~~~~~~~~~

+----------------+---------------------------+
| CakePHP Typ    | Feld Eigenschaft          |
+================+===========================+
| primary\_key   | serial NOT NULL           |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | bytea                     |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+
| number         | numeric                   |
+----------------+---------------------------+
| inet           | inet                      |
+----------------+---------------------------+

SQLite
~~~~~~

+----------------+---------------------------+
| CakePHP Typ    | Feld Eigenschaft          |
+================+===========================+
| primary\_key   | integer primary key       |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | datetime (Y-m-d H:i:s)    |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | blob                      |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+

Sybase
~~~~~~

+----------------+-------------------------------------+
| CakePHP Typ    | Feld Eigenschaft                    |
+================+=====================================+
| primary\_key   | numeric(9,0) IDENTITY PRIMARY KEY   |
+----------------+-------------------------------------+
| string         | varchar(255)                        |
+----------------+-------------------------------------+
| text           | text                                |
+----------------+-------------------------------------+
| integer        | int(11)                             |
+----------------+-------------------------------------+
| float          | float                               |
+----------------+-------------------------------------+
| datetime       | datetime (Y-m-d H:i:s)              |
+----------------+-------------------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)             |
+----------------+-------------------------------------+
| time           | datetime (H:i:s)                    |
+----------------+-------------------------------------+
| date           | datetime (Y-m-d)                    |
+----------------+-------------------------------------+
| binary         | image                               |
+----------------+-------------------------------------+
| boolean        | bit                                 |
+----------------+-------------------------------------+

Titles
------

Ein Objekt hat - im physischen Sinne - oft einen Namen oder einen Titel,
der es bezeichnet. Eine Person hat einen Namen wie Oskar, Gregor oder
Jürgen. Ein Blog-Eintrag hat einen Titel, eine Kategorie hat einen
Namen.

Wenn man ein ``title``- oder ein ``name``-Feld in einer Tabelle
definiert, benutzt CakePHP dieses Feld in verschiedenen Situationen:

-  Scaffolding — Seitentitel, Fieldset-Labels
-  Listen — benutzt für ``<select>``-Auswahlmenüs
-  TreeBehavior — Umordnung, Baumansicht

Wenn man ein ``title``- *und* ein ``name``-Feld in der Tabelle hat, wird
das ``title``-Feld benutzt.

Falls man ein anderes Feld benutzen möchte als in der Konvention
vorgesehen, kann man die
``var $displayField = 'some_field';``-Eigenschaft verändern. Hier kann
nur ein Feld bestimmt werden.

created und modified
--------------------

Definiert man ein ``created``- oder ein ``modified``-Feld in der Tabelle
als ``datetime``-Felder, erkennt CakePHP diese Felder automatisch und
füllt sie mit den entsprechenden Daten sobald ein Datensatz neu erstellt
(created) oder bearbeitet (modified) wird (ausser wenn die zu
speichernden Daten bereits Werte für diese Felder enthalten).

In den ``created``- und ``modified``-Feldern wird die aktuelle
Systemzeit gespeichert sobald ein Datensatz erstmalig eingefügt wird.
Das ``modified``-Feld wird dann mit dem aktuellen Datum aktualisiert
sobald ein vorhandener Datensatz neu gespeichert wird.

Ein Feld mit Namen ``updated`` zeigt genau das gleiche Verhalten wie
``modified``. Diese Felder müssen alle vom Typ ``datetime`` sein und als
Default-Wert NULL haben um von CakePHP erkannt zu werden.

UUIDs als Primärschlüssel verwenden
-----------------------------------

Primärschlüssel sind normalerweise INT-Felder. Die Datenbank
inkrementiert das Feld für jeden neuen Datensatz automatisch, beginnend
bei 1. Alternativ kann man den Primärschlüssel auch als ``CHAR(36)``
oder ``BINARY(36)`` definieren. CakePHP generiert in diesem Fall
automatisch `UUIDs <http://de.wikipedia.org/wiki/UUID>`_ für jeden neuen
Datensatz.

Eine UUID ist ein 32 byte String der durch 4 Bindestriche getrennt ist
und damit insgesamt auf 36 Zeichen kommt. Zum Beispiel:

::

    550e8400-e29b-41d4-a716-446655440000

UUIDs wurden erfunden um einzigartig zu sein und zwar nicht nur
innerhalb einer Tabelle sondern Tabellen- und sogar Datenbankweit. Wenn
man also Felder benötigt die selbst über Systemgrenzen hinaus
einzigartig sein sollen, sind UUIDs eine sehr gute Lösugn dafür.

Retrieving Your Data
====================

find
----

``find($type, $params)``

``Find`` ist das multifunktionale Arbeitstier aller Model-Funktionen zur
Datenabfrage. ``$type`` kann die Werte ``'all'``, ``'first'``,
``'count'``, ``'list'``, ``'neighbors'`` oder ``'threaded'`` annehmen.
Standard ist ``'first'``.

``$params`` dient zur Übergabe aller Parameter an die jeweilige
``find``-Methode und kann standardmäßig folgende Schlüssel enthalten,
wobei jeder dieser Schlüssel optional ist:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //Array mit Bedingungen
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //Array mit Feldnamen
        'order' => array('Model.created', 'Model.field3 DESC'), //String oder Array mit Feldern, die mit ORDER BY verwendet werden
        'group' => array('Model.field'), //Felder, die mit GROUP BY verwendet werden
        'limit' => n, //int
        'page' => n, //int
        'callbacks' => true //weitere mögliche Werte: false, 'before', 'after'
    )

Es ist ebenfalls möglich, zusätzliche Parameter hinzuzufügen und zu
verwenden, wie es von einigen ``find``-Typen und behaviors getan wird.
Natürlich ist dies auch mit Deinen eigenen Model-Methoden möglich.

Mehr zu model callbacks erfährst Du
`hier </de/view/76/Callback-Methods>`_.

find('first')
~~~~~~~~~~~~~

``find('first', $params)``

'first' ist der Standard-find-Typ und gibt 1 Ergebnis zurück. Du wirst
dies immer dann verwenden wenn du nur ein Ergebinis erwartest. Hier sind
einige einfache Bespiele (Contoller Code):

::

    function some_function() {
       ...
       $this->Article->order = null; // resetting if it's set
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulating the model having a default order
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

Im ersten Beispiel, wurden keine Parameter hinzugefügt und somit auch
keine besonderen Sortier-Bedinungen benutzt. Das Format, das von
``find('first')`` zurückgegeben wird, sieht so aus:

::

    Array
    (
        [ModelName] => Array
            (
                [id] => 83
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

        [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )
    )

Es werden keine weiteren Parameter verwendet bei ``find('first')``.

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)`` returns an integer value. Below are a couple
of simple (controller code) examples:

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

Don't pass ``fields`` as an array to ``find('count')``. You would only
need to specify fields for a DISTINCT count (since otherwise, the count
is always the same - dictated by the conditions).

There are no additional parameters used by ``find('count')``.

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')`` returns an array of (potentially multiple) results. It
is in fact the mechanism used by all ``find()`` variants, as well as
``paginate``. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none were
passed.

The results of a call to ``find('all')`` will be of the following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

            )
    )

There are no additional parameters used by ``find('all')``.

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)`` returns an indexed array, useful for any use
where you would want a list such as for populating input select boxes.
Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
        $allArticles = $this->Article->find('list');
        $pending = $this->Article->find('list', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('list');
        $allPublishedAuthors = $this->Article->find('list', array(
            'fields' => array('User.id', 'User.name'),
            'conditions' => array('Article.status !=' => 'pending'),
            'recursive' => 0
        ));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none were
passed.

The results of a call to ``find('list')`` will be in the following form:

::

    Array
    (
        //[id] => 'displayValue',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

When calling ``find('list')`` the ``fields`` passed are used to
determine what should be used as the array key, value and optionally
what to group the results by. By default the primary key for the model
is used for the key, and the display field (which can be configured
using the model attribute `displayField </de/view/1062/displayField>`_)
is used for the value. Some further examples to clarify:.

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

With the above code example, the resultant vars would look something
like this:

::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['User'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)`` returns a nested array, and is appropriate
if you want to use the ``parent_id`` field of your model data to build
nested results. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42))); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

It is not necessary to use `the Tree behavior </de/view/1339/Tree>`_ to
use this method - but all desired results must be possible to be found
in a single query.

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The second example
makes use of the data structure used by the `Tree
behavior </de/view/1339/Tree>`_ the return a partial, nested, result for
``$aCategory`` and everything below it. The results of a call to
``find('threaded')`` will be of the following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

The order results appear can be changed as it is influence by the order
of processing. For example, if ``'order' => 'name ASC'`` is passed in
the params to ``find('threaded')``, the results will appear in name
order. Likewise any order can be used, there is no inbuilt requirement
of this method for the top result to be returned first.

There are no additional parameters used by ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' will perform a find similar to 'first', but will return the
row before and after the one you request. Below is a simple (controller
code) example:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

You can see in this example the two required elements of the ``$params``
array: field and value. Other elements are still allowed as with any
other find (Ex: If your model acts as containable, then you can specify
'contain' in ``$params``). The format returned from a
``find('neighbors')`` call is in the form:

::

    Array
    (
        [prev] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 151
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
        [next] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 4
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 122
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
    )

Note how the result always contains only two root elements: prev and
next. This function does not honor a model's default recursive var. The
recursive setting must be passed in the parameters on each call.

Does not honor the recursive attribute on a model. You must set the
recursive param to utilize the recursive feature.

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

These magic functions can be used as a shortcut to search your tables by
a certain field. Just add the name of the field (in CamelCase format) to
the end of these functions, and supply the criteria for that field as
the first parameter.

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| PHP5 findAllBy<x> Example                                                                | Corresponding SQL Fragment                                 |
+==========================================================================================+============================================================+
| $this->Product->findAllByOrderStatus(‘3’);                                               | Product.order\_status = 3                                  |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);                                                  | Recipe.type = ‘Cookie’                                     |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->User->findAllByLastName(‘Anderson’);                                              | User.last\_name = ‘Anderson’                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->Cake->findAllById(7);                                                             | Cake.id = 7                                                |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->User->findAllByUserName(‘psychic’, array(), array('User.user\_name' => 'asc'));   | User.user\_name = ‘psychic’ ORDER BY User.user\_name ASC   |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

PHP4 users have to use this function a little differently due to some
case-insensitivity in PHP4:

+-------------------------------------------------+--------------------------------+
| PHP4 findAllBy<x> Example                       | Corresponding SQL Fragment     |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findAllById(7);                    | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByUser\_name(‘psychic’);    | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

The returned result is an array formatted just as it would be from
findAll().

findBy
------

``findBy<fieldName>(string $value);``

The findBy magic functions also accept some optional parameters:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``

These magic functions can be used as a shortcut to search your tables by
a certain field. Just add the name of the field (in CamelCase format) to
the end of these functions, and supply the criteria for that field as
the first parameter.

+--------------------------------------------+--------------------------------+
| PHP5 findBy<x> Example                     | Corresponding SQL Fragment     |
+============================================+================================+
| $this->Product->findByOrderStatus(‘3’);    | Product.order\_status = 3      |
+--------------------------------------------+--------------------------------+
| $this->Recipe->findByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+--------------------------------------------+--------------------------------+
| $this->User->findByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+--------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                  | Cake.id = 7                    |
+--------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);    | User.user\_name = ‘psychic’    |
+--------------------------------------------+--------------------------------+

PHP4 users have to use this function a little differently due to some
case-insensitivity in PHP4:

+----------------------------------------------+--------------------------------+
| PHP4 findBy<x> Example                       | Corresponding SQL Fragment     |
+==============================================+================================+
| $this->Product->findByOrder\_status(‘3’);    | Product.order\_status = 3      |
+----------------------------------------------+--------------------------------+
| $this->Recipe->findByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+----------------------------------------------+--------------------------------+
| $this->User->findByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                    | Cake.id = 7                    |
+----------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);    | User.user\_name = ‘psychic’    |
+----------------------------------------------+--------------------------------+

findBy() functions like find('first',...), while findAllBy() functions
like find('all',...).

In either case, the returned result is an array formatted just as it
would be from find() or findAll(), respectively.

query
-----

``query(string $query)``

SQL calls that you can't or don't want to make via other model methods
(this should only rarely be necessary) can be made using the model's
``query()`` method.

If you’re ever using this method in your application, be sure to check
out CakePHP’s `Sanitize library </de/view/1183/Data-Sanitization>`_,
which aids in cleaning up user-provided data from injection and
cross-site scripting attacks.

``query()`` does not honour $Model->cachequeries as its functionality is
inherently disjoint from that of the calling model. To avoid caching
calls to query, supply a second argument of false, ie:
``query($query, $cachequeries = false)``

``query()`` uses the table name in the query as the array key for the
returned data, rather than the model name. For example,

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

might return

::

    Array
    (
        [0] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

To use the model name as the array key, and get a result consistent with
that returned by the Find methods, the query can be rewritten:

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

which returns

::

    Array
    (
        [0] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

This syntax and the corresponding array structure is valid for MySQL
only. Cake does not provide any data abstraction when running queries
manually, so exact results will vary between databases.

field
-----

``field(string $name, array $conditions = null, string $order = null)``

Returns the value of a single field, specified as ``$name``, from the
first record matched by $conditions as ordered by $order. If no
conditions are passed and the model id is set, will return the field
value for the current model result. If no matching record is found
returns false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // echo the name for row id 22

    echo $this->Post->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // echo the name of the last created instance

read()
------

``read($fields, $id)``

``read()`` is a method used to set the current model data
(``Model::$data``)--such as during edits--but it can also be used in
other circumstances to retrieve a single record from the database.

``$fields`` is used to pass a single field name, as a string, or an
array of field names; if left empty, all fields will be fetched.

``$id`` specifies the ID of the record to be read. By default, the
currently selected record, as specified by ``Model::$id``, is used.
Passing a different value to ``$id`` will cause that record to be
selected.

``read()`` always returns an array (even if only a single field name is
requested). Use ``field`` to retrieve the value of a single field.

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // gets the rating of the record being deleted.
       $name = $this->read('name', 2); // gets the name of a second record.
       $rating = $this->read('rating'); // gets the rating of the second record.
       $this->id = 3; //
       $this->read(); // reads a third record
       $record = $this->data // stores the third record in $record
       ...
    }

Notice that the third call to ``read()`` fetches the rating of the same
record read before. That is because ``read()`` changes ``Model::$id`` to
any value passed as ``$id``. Lines 6-8 demonstrate how ``read()``
changes the current model data. ``read()`` will also unset all
validation errors on the model. If you would like to keep them, use
``find('first')`` instead.

The example above works if you run this code within the beforeDelete()
method of the model itself. If you want to call read() from a
controller, it would look something like this:

::

    function article($action) {
       ...
       $this->Article->id = 3; //
       $this->Article->read(); // reads a third record
       $record = $this->Article->data // stores the third record in $record
       ...
    }

Complex Find Conditions
-----------------------

Most of the model's find calls involve passing sets of conditions in one
way or another. The simplest approach to this is to use a WHERE clause
snippet of SQL. If you find yourself needing more control, you can use
arrays.

Using arrays is clearer and easier to read, and also makes it very easy
to build queries. This syntax also breaks out the elements of your query
(fields, values, operators, etc.) into discrete, manipulatable parts.
This allows CakePHP to generate the most efficient query possible,
ensure proper SQL syntax, and properly escape each individual part of
the query.

At it's most basic, an array-based query looks like this:

::

    $conditions = array("Post.title" => "This is a post");
    //Example usage with a model:
    $this->Post->find('first', array('conditions' => $conditions));

The structure here is fairly self-explanatory: it will find any post
where the title equals "This is a post". Note that we could have used
just "title" as the field name, but when building queries, it is good
practice to always specify the model name, as it improves the clarity of
the code, and helps prevent collisions in the future, should you choose
to change your schema.

What about other types of matches? These are equally simple. Let's say
we wanted to find all the posts where the title is not "This is a post":

::

    array("Post.title <>" => "This is a post")

Notice the '<>' that follows the field name. CakePHP can parse out any
valid SQL comparison operator, including match expressions using LIKE,
BETWEEN, or REGEX, as long as you leave a space between field name and
the operator. The one exception here is IN (...)-style matches. Let's
say you wanted to find posts where the title was in a given set of
values:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

To do a NOT IN(...) match to find posts where the title is not in the
given set of values:

::

    array(
        "NOT" => array("Post.title" => array("First post", "Second post", "Third post"))
    )

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

You can also create finds that compare two fields in the database

::

    array("Post.created = Post.modified")

This above example will return posts where the created date is equal to
the modified date (ie it will return posts that have never been
modified).

Remember that if you find yourself unable to form a WHERE clause in this
method (ex. boolean operations), you can always specify it as a string
like:

::

    array(
        'Model.field & 8 = 1',
        //other conditions as usual
    )

By default, CakePHP joins multiple conditions with boolean AND; which
means, the snippet above would only match posts that have been created
in the past two weeks, and have a title that matches one in the given
set. However, we could just as easily find posts that match either
condition:

::

    array( "OR" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake accepts all valid SQL boolean operations, including AND, OR, NOT,
XOR, etc., and they can be upper or lower case, whichever you prefer.
These conditions are also infinitely nest-able. Let's say you had a
belongsTo relationship between Posts and Authors. Let's say you wanted
to find all the posts that contained a certain keyword (“magic”) or were
created in the past two weeks, but you want to restrict your search to
posts written by Bob:

::

    array (
        "Author.name" => "Bob", 
        "OR" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

If you need to set multiple conditions on the same field, like when you
want to do a LIKE search with multiple terms, you can do so by using
conditions similar to:

::

     array(
        'OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
        )
    );

Cake can also check for null fields. In this example, the query will
return records where the post title is not null:

::

    array ("NOT" => array (
            "Post.title" => null
        )
    )

To handle BETWEEN queries, you can use the following:

::

    array('Post.id BETWEEN ? AND ?' => array(1,10))

Note: CakePHP will quote the numeric values depending on the field type
in your DB.

How about GROUP BY?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

The data returned for this would be in the following format:

::

    Array
    (
        [0] => Array
            (
                [Product] => Array
                    (
                        [type] => Clothing
                    )
                [0] => Array
                    (
                        [price] => 32
                    )
            )
        [1] => Array....

A quick example of doing a DISTINCT query. You can use other operators,
such as MIN(), MAX(), etc., in a similar fashion

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

You can create very complex conditions, by nesting multiple condition
arrays:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.city' => 'CA')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

Which produces the following SQL:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

**Sub-queries**

For the example, imagine we have a "users" table with "id", "name" and
"status". The status can be "A", "B" or "C". And we want to get all the
users that have status different than "B" using sub-query.

In order to achieve that we are going to get the model data source and
ask it to build the query as if we were calling a find method, but it
will just return the SQL statement. After that we make an expression and
add it to the conditions array.

::

    $conditionsSubQuery['`User2`.`status`'] = 'B';

    $dbo = $this->User->getDataSource();
    $subQuery = $dbo->buildStatement(
        array(
            'fields' => array('`User2`.`id`'),
            'table' => $dbo->fullTableName($this->User),
            'alias' => 'User2',
            'limit' => null,
            'offset' => null,
            'joins' => array(),
            'conditions' => $conditionsSubQuery,
            'order' => null,
            'group' => null
        ),
        $this->User
    );
    $subQuery = ' `User`.`id` NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $dbo->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->User->find('all', compact('conditions'));

This should generate the following SQL:

::

    SELECT 
        `User`.`id` , 
        `User`.`name` , 
        `User`.`status`  
    FROM 
        `users` AS `User` 
    WHERE 
        `User`.`id` NOT IN (
            SELECT 
                `User2`.`id` 
            FROM 
                `users` AS `User2` 
            WHERE 
                `User2`.`status` = 'B' 
        )

Also, if you need to pass just part of your query as raw SQL as the
above, datasource **expressions** with raw SQL work for any part of the
find query.

Saving Your Data
================

CakePHP makes saving model data a snap. Data ready to be saved should be
passed to the model’s ``save()`` method using the following basic
format:

::

    Array
    (
        [ModelName] => Array
            (
                [fieldname1] => 'value'
                [fieldname2] => 'value'
            )
    )

Most of the time you won’t even need to worry about this format:
CakePHP's ``HtmlHelper``, ``FormHelper``, and find methods all package
data in this format. If you're using either of the helpers, the data is
also conveniently available in ``$this->data`` for quick usage.

Here's a quick example of a controller action that uses a CakePHP model
to save data to a database table:

::

    function edit($id) {
        //Has any form data been POSTed?
        if(!empty($this->data)) {
            //If the form data can be validated and saved...
            if($this->Recipe->save($this->data)) {
                //Set a session flash message and redirect.
                $this->Session->setFlash("Recipe Saved!");
                $this->redirect('/recipes');
            }
        }
     
        //If no form data, find the recipe to be edited
        //and hand it to the view.
        $this->data = $this->Recipe->findById($id);
    }

One additional note: when save is called, the data passed to it in the
first parameter is validated using CakePHP validation mechanism (see the
Data Validation chapter for more information). If for some reason your
data isn't saving, be sure to check to see if some validation rules are
being broken.

There are a few other save-related methods in the model that you'll find
useful:

``set($one, $two = null)``

Model::set() can be used to set one or many fields of data to the data
array inside a model. This is useful when using models with the
ActiveRecord features offered by Model.

::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

Is an example of how you can use ``set()`` to update and save single
fields, in an ActiveRecord approach. You can also use ``set()`` to
assign new values to multiple fields.

::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

The above would update the title and published fields and save them to
the database.

``save(array $data = null, boolean $validate = true, array $fieldList = array())``

Featured above, this method saves array-formatted data. The second
parameter allows you to sidestep validation, and the third allows you to
supply a list of model fields to be saved. For added security, you can
limit the saved fields to those listed in ``$fieldList``.

If ``$fieldList`` is not supplied, a malicious user can add additional
fields to the form data (if you are not using Security component), and
by this change fields that were not originally intended to be changed.

The save method also has an alternate syntax:

``save(array $data = null, array $params = array())``

``$params`` array can have any of the following available options as
keys:

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

More information about model callbacks is available
`here </de/view/76/Callback-Methods>`_

If you don't want the updated field to be updated when saving some data
add ``'updated' => false`` to your ``$data`` array

Once a save has been completed, the ID for the object can be found in
the ``$id`` attribute of the model object - something especially handy
when creating new objects.

::

    $this->Ingredient->save($newData);

    $newIngredientId = $this->Ingredient->id;

Creating or updating is controlled by the model's ``id`` field. If
``$Model->id`` is set, the record with this primary key is updated.
Otherwise a new record is created.

::

    //Create: id isn't set or is null
    $this->Recipe->create();
    $this->Recipe->save($this->data);

    //Update: id is set to a numerical value 
    $this->Recipe->id = 2;
    $this->Recipe->save($this->data);

When calling save in a loop, don't forget to call ``create()``.

``create(array $data = array())``

This method resets the model state for saving new information.

If the ``$data`` parameter (using the array format outlined above) is
passed, the model instance will be ready to save with that data
(accessible at ``$this->data``).

If ``false`` is passed instead of an array, the model instance will not
initialize fields from the model schema that are not already set, it
will only reset fields that have already been set, and leave the rest
unset. Use this to avoid updating fields in the database that were
already set and are intended to be updated.

``saveField(string $fieldName, string $fieldValue, $validate = false)``

Used to save a single field value. Set the ID of the model
(``$this->ModelName->id = $id``) just before calling ``saveField()``.
When using this method, ``$fieldName`` should only contain the name of
the field, not the name of the model and field.

For example, to update the title of a blog post, the call to
``saveField`` from a controller might look something like this:

::

    $this->Post->saveField('title', 'A New Title for a New Day');

You cant stop the updated field being updated with this method, you need
to use the save() method.

``updateAll(array $fields, array $conditions)``

Updates many records in a single call. Records to be updated are
identified by the ``$conditions`` array, and fields to be updated, along
with their values, are identified by the ``$fields`` array. It returns
true on success and false on failure. If no results are updated, true is
returned.

For example, to approve all bakers who have been members for over a
year, the update call might look something like:

::

    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $this_year)
    );

The $fields array accepts SQL expressions. Literal values should be
quoted manually.

Even if the modified field exists for the model being updated, it is not
going to be updated automatically by the ORM. Just add it manually to
the array if you need it to be updated.

For example, to close all tickets that belong to a certain customer:

::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

By default, updateAll() will automatically join any belongsTo
association for databases that support joins. To prevent this,
temporarily unbind the associations.

``saveAll(array $data = null, array $options = array())``

Used to save (a) multiple individual records for a single model or (b)
this record, as well as all associated records

The following options may be used:

validate: Set to false to disable validation, true to validate each
record before saving, 'first' to validate \*all\* records before any are
saved (default), or 'only' to only validate the records, but not save
them.

atomic: If true (default), will attempt to save all records in a single
transaction. Should be set to false if database/table does not support
transactions. If false, we return an array similar to the $data array
passed, but values are set to true/false depending on whether each
record saved successfully.

fieldList: Equivalent to the $fieldList parameter in ``Model::save()``

For saving multiple records of single model, $data needs to be a
numerically indexed array of records like this:

::

    Array
    (
        [Article] => Array(
                [0] => Array
                    (
                                [title] => title 1
                            )
                [1] => Array
                    (
                                [title] => title 2
                            )
                    )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data['Article']);

Note that we are passing ``$data['Article']`` instead of usual
``$data``. When saving multiple records of same model the records arrays
should be just numerically indexed without the model key.

For saving a record along with its related record having a hasOne or
belongsTo association, the data array should be like this:

::

    Array
    (
        [User] => Array
            (
                [username] => billy
            )
        [Profile] => Array
            (
                [sex] => Male
            [occupation] => Programmer
            )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data);

For saving a record along with its related records having hasMany
association, the data array should be like this:

::

    Array
    (
        [Article] => Array
            (
                [title] => My first article
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [comment] => Comment 1
                [user_id] => 1
                    )
            [1] => Array
                    (
                        [comment] => Comment 2
                [user_id] => 2
                    )
            )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data);

Saving related data with ``saveAll()`` will only work for directly
associated models. If successful, ``last_insert_id()``'s will be stored
in the related models id field, i.e. ``$this->RelatedModel->id``.

Calling a saveAll before another saveAll has completed will cause the
first saveAll to return false. One or both of the saveAll calls must
have atomic set to false to correct this behavior.

Saving Related Model Data (hasOne, hasMany, belongsTo)
------------------------------------------------------

When working with associated models, it is important to realize that
saving model data should always be done by the corresponding CakePHP
model. If you are saving a new Post and its associated Comments, then
you would use both Post and Comment models during the save operation.

If neither of the associated model records exists in the system yet (for
example, you want to save a new User and their related Profile records
at the same time), you'll need to first save the primary, or parent
model.

To get an idea of how this works, let's imagine that we have an action
in our UsersController that handles the saving of a new User and a
related Profile associated by belongsTo association. Your form would
look something like this:

::

    echo $form->create('User', array('action'=>'add'));
    echo $form->input('first_name');
    echo $form->input('last_name');

    echo $form->input('Profile.address');
    echo $form->input('Profile.telephone');

    echo $form->end('Add');

Then using saveAll() you can save your data like this:

::

    <?php
    function add() {
        if (!empty($this->data)) {
            if ($this->User->saveAll($this->data)) {
                // User and Profile created successfully
            } else {
                // Error creating user
            }
        }
    }
    ?>

As a rule, when working with hasOne, hasMany, and belongsTo
associations, its all about keying. The basic idea is to get the key
from one model and place it in the foreign key field on the other.
Sometimes this might involve using the ``$id`` attribute of the model
class after a ``save()``, but other times it might just involve
gathering the ID from a hidden input on a form that’s just been POSTed
to a controller action.

To supplement the basic approach used above, CakePHP also offers a very
handy method ``saveAll()``, which allows you to validate and save
multiple models in one shot. In addition, ``saveAll()`` provides
transactional support to ensure data integrity in your database (i.e. if
one model fails to save, the other models will not be saved either).

For transactions to work correctly in MySQL your tables must use InnoDB
engine. Remember that MyISAM tables do not support transactions.

Let's see how we can use ``saveAll()`` to save Company and Account
models at the same time.

First, you need to build your form for both Company and Account models
(we'll assume that Company hasMany Account).

::


    echo $form->create('Company', array('action'=>'add'));
    echo $form->input('Company.name', array('label'=>'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');

    echo $form->input('Account.0.name', array('label'=>'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');

    echo $form->end('Add');

Take a look at the way we named the form fields for the Account model.
If Company is our main model, ``saveAll()`` will expect the related
model's (Account) data to arrive in a specific format. And having
``Account.0.fieldName`` is exactly what we need.

The above field naming is required for a hasMany association. If the
association between the models is hasOne, you have to use
ModelName.fieldName notation for the associated model.

Now, in our companies\_controller we can create an ``add()`` action:

::


    function add() {
       if(!empty($this->data)) {
          //Use the following to avoid   validation errors:
          unset($this->Company->Account->validate['company_id']);
          $this->Company->saveAll($this->data, array('validate'=>'first'));
       }
    }

That's all there is to it. Now our Company and Account models will be
validated and saved all at the same time. A quick thing to point out
here is the use of ``array('validate'=>'first')``; this option will
ensure that both of our models are validated. Note that
``array('validate'=>'first')`` is the default option on cakephp 1.3.

counterCache - Cache your count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model itself
tracks any addition/deleting towards the associated ``$hasMany`` model
and increases/decreases a dedicated integer field within the parent
model table.

The name of the field consists of the singular model name followed by a
underscore and the word "count".

::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model called
``Image``, you would add a new INT-field to the ``image`` table and name
it ``image_comment_count``.

Here are some more examples:

+-------------+--------------------+---------------------------------------------+
| Model       | Associated Model   | Example                                     |
+=============+====================+=============================================+
| User        | Image              | users.image\_count                          |
+-------------+--------------------+---------------------------------------------+
| Image       | ImageComment       | images.image\_comment\_count                |
+-------------+--------------------+---------------------------------------------+
| BlogEntry   | BlogEntryComment   | blog\_entries.blog\_entry\_comment\_count   |
+-------------+--------------------+---------------------------------------------+

Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key and
set the value to ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

From now on, every time you add or remove a ``Image`` associated to
``ImageAlbum``, the number within ``image_count`` is adjusted
automatically.

You can also specify ``counterScope``. It allows you to specify a simple
condition which tells the model when to update (or when not to,
depending on how you look at it) the counter value.

Using our Image model example, we can specify it like so:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // only count if "Image" is active = 1
        ));
    }

Saving Related Model Data (HABTM)
---------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany is
pretty simple: you just populate the foreign key field with the ID of
the associated model. Once that's done, you just call the save() method
on the model, and everything gets linked up correctly.

With HABTM, you need to set the ID of the associated model in your data
array. We'll build a form that creates a new tag and associates it on
the fly with some recipe.

The simplest form might look something like this (we'll assume that
$recipe\_id is already set to something):

::

    <?php echo $form->create('Tag');?>
        <?php echo $form->input(
            'Recipe.id', 
            array('type'=>'hidden', 'value' => $recipe_id)); ?>
        <?php echo $form->input('Tag.name'); ?>
        <?php echo $form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose value
is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database.

::

    function add() {
        
        //Save the association
        if ($this->Tag->save($this->data)) {
            //do something on success            
        }
    }

With the preceding code, our new Tag is created and associated with a
Recipe, whose ID was set in $this->data['Recipe']['id'].

Other ways we might want to present our associated data can include a
select drop down list. The data can be pulled from the model using the
``find('list')`` method and assigned to a view variable of the model
name. An input with the same name will automatically pull in this data
into a ``<select>``.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a Recipe can
have multiple Tags assigned to it. In this case, the data is pulled out
of the model the same way, but the form input is declared slightly
different. The tag name is defined using the ``ModelName`` convention.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the existing
Recipe being added or saved to the database.

**What to do when HABTM becomes complicated?**

By default when saving a HasAndBelongsToMany relationship, Cake will
delete all rows on the join table before saving new ones. For example if
you have a Club that has 10 Children associated. You then update the
Club with 2 children. The Club will only have 2 Children, not 12.

Also note that if you want to add more fields to the join (when it was
created or meta information) this is possible with HABTM join tables,
but it is important to understand that you have an easy option.

HasAndBelongsToMany between two models is in reality shorthand for three
models associated through both a hasMany and a belongsTo association.

Consider this example:

::

    Child hasAndBelongsToMany Club

Another way to look at this is adding a Membership model:

::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

These two examples are almost the exact same. They use the same amount
and named fields in the database and the same amount of models. The
important differences are that the "join" model is named differently and
its behavior is more predictable.

When your join table contains extra fields besides two foreign keys, in
most cases it's easier to make a model for the join table and setup
hasMany, belongsTo associations as shown in example above instead of
using HABTM association.

Deleting Data
=============

Zum Löschen von Daten können folgende Methoden verwendet werden.

delete
------

``delete(int $id = null, boolean $cascade = true);``

Löscht den durch $id identifizierten Datensatz. Standardmäßig werden
ebenfalls von diesem Datensatz abhängige Datensätze gelöscht.

Beispiel zum Löschen eines Nutzer-Datensatzes, der an viele
Rezept-Datensätze gebunden ist (Benutzer 'hasMany' oder
'hasAndBelongsToMany' Rezepte):

-  Wenn $cascade auf true gesetzt ist, werden die abhängigen
   Rezept-Einträge ebenfalls gelöscht, wenn der Abhängigkeitswert des
   Models auf true gesetzt ist.
-  Wenn $cascade auf false gesetzt ist, bleiben die Rezept-Datensätze
   auch nach dem Löschen des Nutzer-Datensatzes erhalten.

deleteAll
---------

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

Same as with ``delete()`` and ``remove()``, except that ``deleteAll()``
deletes all records that match the supplied conditions. The
``$conditions`` array should be supplied as an SQL fragment or array.

 **conditions** Conditions to match
 **cascade** Boolean, Set to true to delete records that depend on this
 record. Note that you will need to set dependent to true in the relevant
 model associations
 **callbacks** Boolean, Run callbacks


Assoziationen: Models miteinander verbinden
===========================================

Eines der mächtigsten Features von CakePHP ist es, die Relationen
(Models) durch Beziehungen (Associations) miteinander zu verknüpfen.

Das Definieren von Beziehungen zwischen den verschiedenen Models sollte
ein natürlicher Prozess sein. Ein Beispiel: In einer Rezept-Datenbank
kann ein Rezept mehrere Kritiken haben. Eine Kritik hat einen einzelnen
Autor und Autoren können mehrere Rezepte haben. Dieses Vorgehen erlaubt
einen intuitiven und leistungsfähigen Zugriff auf die Daten.

Der Zweck dieses Anschnitts ist es zu zeigen, wie man die Beziehungen
zwischen den Relationen des Models in CakePHP plant, definiert und
anwendet.

Daten können aus verschiedenen Quellen kommen. In Webanwendungen werden
aber meistens relationale Datenbanken eingesetzt. Deshalb steht ein
Großteil dieses Abschnitts im Kontext relationaler Datenbanken.

Für Informationen zu Beziehungen mit Plugin models siehe `Plugin
Models </view/117/Plugin-Models>`_.

Relationship Types
------------------

Die vier Assoziationstypen von CakePHP sind: haseOne, hasMany, belongsTo
und hasAndBelongsToMany (HABTM).

+-----------------------+-----------------------+-----------------------------------------------+
| Beziehung             | Assoziationstyp       | Beispiel                                      |
+=======================+=======================+===============================================+
| Eines zu Einem        | hasOne                | Ein Benutzer hat ein Profil.                  |
+-----------------------+-----------------------+-----------------------------------------------+
| Eines zu Mehreren     | hasMany               | Ein Benutzer kann viele Rezepte haben.        |
+-----------------------+-----------------------+-----------------------------------------------+
| Mehrere zu Einem      | belongsTo             | Viele Rezepte gehören zu einem Benutzer.      |
+-----------------------+-----------------------+-----------------------------------------------+
| Mehrere zu Mehreren   | hasAndBelongsToMany   | Rezepte haben und gehören zu mehreren Tags.   |
+-----------------------+-----------------------+-----------------------------------------------+

Assoziationen werden definiert, indem man eine Klassen-Variable mit dem
Namen der genutzten Assoziationstypen erstellt. Diese Klassen-Variable
kann manchmal einfach ein String sein, aber auch ein multidimensionales
Array, das dazu benutzt wird Assoziationsgesetze zu definieren.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $hasOne = 'Profile';
        var $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order'      => 'Recipe.created DESC'
            )
        );
    }

    ?>

In diesem Beispiel ist das erste Vorkommen des Wortes 'Recipe' das, was
man ein 'Alias' nennt. Dies identifiziert die Beziehung und kann frei
gewählt werden. Normalerweise wählt man hier den selben Namen wie die
Klasse, auf die es sich bezieht. Jedenfalls müssen diese Aliase
einzigartig sein auf beiden Seiten eines Modells und auf beiden Seiten
einer belongsTo/hasMany oder belongsTo/haseOne Beziehung. Würde man
nicht einzigartige Namen für Modell-Aliase verwenden, könnte dies zu
unerwartetem Verhalten führen.

Cake wird automatisch Verknüpfungen zwischen assoziativen Modellobjekten
herstellen. Also zum Beispiel in dem ``User`` Modell kann man Zugriff
nehmen auf das ``Recipe`` Modell mit

::

    $this->Recipe->someFunction();

Ähnlich kann man im Controller auf assoziierte Modelle zugreifen, indem
man einfach der Modell-Assoziation folgt, ohne dabei es zu dem ``$uses``
Array hinzu zu fügen:

::

    $this->User->Recipe->someFunction();

Bedenke, dass Assoziationen einseitig definiert werden. Wenn du "User
hasMany Recipe" definierst, hat dies keinen Effekt auf das Recipe
Modell. Du must dann noch "Recipe belongsTo User" definieren, sodass du
dann von deinem Recipe Modell aus auf das User Modell Zugriff nehmen
kannst.

hasOne
------

Let’s set up a User model with a hasOne relationship to a Profile model.

First, your database tables need to be keyed correctly. For a hasOne
relationship to work, one table has to contain a foreign key that points
to a record in the other. In this case the profiles table will contain a
field called user\_id. The basic pattern is:

+------------------------+----------------------+
| Relation               | Schema               |
+========================+======================+
| Apple hasOne Banana    | bananas.apple\_id    |
+------------------------+----------------------+
| User hasOne Profile    | profiles.user\_id    |
+------------------------+----------------------+
| Doctor hasOne Mentor   | mentors.doctor\_id   |
+------------------------+----------------------+

Table: **hasOne:** the *other* model contains the foreign key.

The User model file will be saved in /app/models/user.php. To define the
‘User hasOne Profile’ association, add the $hasOne property to the model
class. Remember to have a Profile model in /app/models/profile.php, or
the association won’t work.

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasOne = 'Profile';   
    }
    ?>

There are two ways to describe this relationship in your model files.
The simplest method is to set the $hasOne attribute to a string
containing the classname of the associated model, as we’ve done above.

If you need more control, you can define your associations using array
syntax. For example, you might want to limit the association to include
only certain records.

::

    <?php

    class User extends AppModel {
        var $name = 'User';          
        var $hasOne = array(
            'Profile' => array(
                'className'    => 'Profile',
                'conditions'   => array('Profile.published' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

Possible keys for hasOne association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘User hasOne Profile’
   relationship, the className key should equal ‘Profile.’
-  **foreignKey**: the name of the foreign key found in the other model.
   This is especially handy if you need to define multiple hasOne
   relationships. The default value for this key is the underscored,
   singular name of the current model, suffixed with ‘\_id’. In the
   example above it would default to 'user\_id'.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments:
   “Profile.approved = 1” is always better than just “approved = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **dependent**: When the dependent key is set to true, and the model’s
   delete() method is called with the cascade parameter set to true,
   associated model records are also deleted. In this case we set it
   true so that deleting a User will also delete her associated Profile.

Once this association has been defined, find operations on the User
model will also fetch a related Profile record if it exists:

::

    //Sample results from a $this->User->find() call.

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Now that we have Profile data access from the User model, let’s define a
belongsTo association in the Profile model in order to get access to
related User data. The belongsTo association is a natural complement to
the hasOne and hasMany associations: it allows us to see the data from
the other direction.

When keying your database tables for a belongsTo relationship, follow
this convention:

+---------------------------+----------------------+
| Relation                  | Schema               |
+===========================+======================+
| Banana belongsTo Apple    | bananas.apple\_id    |
+---------------------------+----------------------+
| Profile belongsTo User    | profiles.user\_id    |
+---------------------------+----------------------+
| Mentor belongsTo Doctor   | mentors.doctor\_id   |
+---------------------------+----------------------+

Table: **belongsTo:** the *current* model contains the foreign key.

If a model(table) contains a foreign key, it belongsTo the other
model(table).

We can define the belongsTo association in our Profile model at
/app/models/profile.php using the string syntax as follows:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = 'User';   
    }
    ?>

We can also define a more specific relationship using array syntax:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'    => 'user_id'
            )
        );  
    }
    ?>

Possible keys for belongsTo association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘Profile belongsTo User’
   relationship, the className key should equal ‘User.’
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   belongsTo relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments: “User.active
   = 1” is always better than just “active = 1.”
-  **type**: the type of the join to use in the SQL query, default is
   LEFT which may not fit your needs in all situations, INNER may be
   helpful when you want everything from your main and associated models
   or nothing at all!(effective when used with some conditions of
   course). **(NB: type value is in lower case - i.e. left, inner)**
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **counterCache**: If set to true the associated Model will
   automatically increase or decrease the
   “[singular\_model\_name]\_count” field in the foreign table whenever
   you do a save() or delete(). If its a string then its the field name
   to use. The value in the counter field represents the number of
   related rows.
-  **counterScope**: Optional conditions array to use for updating
   counter cache field.

Once this association has been defined, find operations on the Profile
model will also fetch a related User record if it exists:

::

    //Sample results from a $this->Profile->find() call.

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Next step: defining a “User hasMany Comment” association. A hasMany
association will allow us to fetch a user’s comments when we fetch a
User record.

When keying your database tables for a hasMany relationship, follow this
convention:

**hasMany:** the *other* model contains the foreign key.

Relation

Schema

User hasMany Comment

Comment.user\_id

Cake hasMany Virtue

Virtue.cake\_id

Product hasMany Option

Option.product\_id

We can define the hasMany association in our User model at
/app/models/user.php using the string syntax as follows:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = 'Comment';   
    }
    ?>

We can also define a more specific relationship using array syntax:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'    => 'Comment.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

Possible keys for hasMany association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘User hasMany Comment’
   relationship, the className key should equal ‘Comment.’
-  **foreignKey**: the name of the foreign key found in the other model.
   This is especially handy if you need to define multiple hasMany
   relationships. The default value for this key is the underscored,
   singular name of the actual model, suffixed with ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments:
   “Comment.status = 1” is always better than just “status = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **limit**: The maximum number of associated rows you want returned.
-  **offset**: The number of associated rows to skip over (given the
   current conditions and order) before fetching and associating.
-  **dependent**: When dependent is set to true, recursive model
   deletion is possible. In this example, Comment records will be
   deleted when their associated User record has been deleted.
-  **exclusive**: When exclusive is set to true, recursive model
   deletion does the delete with a deleteAll() call, instead of deleting
   each entity separately. This greatly improves performance, but may
   not be ideal for all circumstances.
-  **finderQuery**: A complete SQL query CakePHP can use to fetch
   associated model records. This should be used in situations that
   require very custom results.
   If a query you're building requires a reference to the associated
   model ID, use the special ``{$__cakeID__$}`` marker in the query. For
   example, if your Apple model hasMany Orange, the query should look
   something like this:

   ::

       SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};

Once this association has been defined, find operations on the User
model will also fetch related Comment records if they exist:

::

    //Sample results from a $this->User->find() call.

    Array
    (  
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

One thing to remember is that you’ll need a complimentary Comment
belongsTo User association in order to get the data from both
directions. What we’ve outlined in this section empowers you to get
Comment data from the User. Adding the Comment belongsTo User
association in the Comment model empowers you to get User data from the
Comment model - completing the connection and allowing the flow of
information from either model’s perspective.

hasAndBelongsToMany (HABTM)
---------------------------

Ok. Jetzt kannst du dich bereits einen CakePHP Model-Assoziationen-Profi
nennen. Du kennst dich bereits sehr gut in den drei Assoziationen, die
den Großteil der Objekt-Relationen ausmachen, aus.

Wir wollen uns nun den letzten Relations-Typ in Angriff nehmen:
hasAndBelongsToMany oder einfach HABTM. Diese Assoziation wird benutzt,
wenn man zwei Models hat die sich auf verschiedene Weise und wiederholt
verbinden lassen sollen.

Der größte Unterschied zwischen hasMany und HABTM ist, dass eine
Verbindung zwischen Models bei Verwendung der HABTM-Relation nicht
exklusiv ist. Ein Beispiel sind Tags. Wenn in meiner Rezeptsammlung die
singalesische Kokossuppe das Tag "Singalesisch" trägt heißt das nicht -
wie das bei hasMany der Fall wäre - dass die singalesische
Knoblauchsuppe dieses Tag nicht besitzen darf.

hasMany-Verbindungen hingegen sind exklusiv. Wenn zu einem Rezept
mehrere Kommentare per hasMany gehören, dann gehören diese Kommentare
keinem anderen Rezept.

Allerdings braucht es für derartigen Komfort eine neue Tabelle in
unserer Datenbank, die die Verbindungen zwischen den Datensätzen
beinhaltet. Der Name der neuen Tabelle muss die Namen beider beteiligten
Models in alphabetischer Reihenfolge beinhalten. Der Inhalt der Tabelle
muss aus mindestens zwei Feldern betehen. Der Inhalt dieser Felder
sollten die jeweiligen Schlüssel der betroffenen Datensätze sein.

+--------------------+---------------------------------------------------+
| Relation           | Schema                                            |
+====================+===================================================+
| Rezept HABTM Tag   | rezepte\_tags.rezept\_id, rezepte\_tags.tag\_id   |
+--------------------+---------------------------------------------------+
| Cake HABTM Fan     | cakes\_fans.cake\_id, cakes\_fans.fan\_id         |
+--------------------+---------------------------------------------------+
| Foo HABTM Bar      | bars\_foos.foo\_id, bars\_foos.bar\_id            |
+--------------------+---------------------------------------------------+

Table: **HABTM:** Benötigte eine neue Tabelle, die beide *Model\ *-Namen
beinhaltet.**

Tabellennamen sind konventionsgemäß in alphabetischer Reihenfolge.

Sobald die neue Tabelle erstellt wurde, können wir die HABTM-Assoziation
in unserer Model-Datei definieren. Wir werden dieses mal direkt die
Array-Syntax verwenden:

::

    <?php

    class Rezept extends AppModel {
        var $name = 'Rezept';   
        var $hasAndBelongsToMany = array(
            'Tag' =>
                array('className'            => 'Tag',
                    'joinTable'              => 'rezepte_tags',
                    'foreignKey'             => 'rezept_id',
                    'associationForeignKey'  => 'tag_id',
                    'conditions'             => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'unique'                 => true,
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
            );             
    }
    ?>

Mögliche Schlüssel für eine HABTM-Assoziation:

-  **className**: Der Name der jeweils anderen Klasse mit der das Model
   verbunden ist. Wenn du eine ‘Rezept hasAndBelongsToMany
   Kommentar’-Assoziation planst, sollte der Wert im Rezept-Model
   Kommentar und im Kommentar-Model Rezept lauten.
-  **joinTable**: Das ist der Name unserer neuen Tabelle, die für uns
   alle Verbindungen zwischen den Datensätzen der involvierten Modelle
   beinhaltet. Dieses Feld ist nötig, falls wir der Tabelle einen Namen
   gegeben haben, der nicht konventionsgemäß ist.
-  **foreignKey**: Der Name des Feldes, das den Schlüssel des jeweils
   anderen Models enthält. Das ist wichtig, wenn wir mehrere
   HABTM-Relationen definineren wollen. Der Standard-Name sollte
   *singular\_name\_des\_models*\ \_id lauten.
-  **associationForeignKey**: Das Gegenteil des *foreignKey*. Beachte,
   dass der foreignKey unter dem Schlüssel Tag im
   $hasAndBelongsToMany-Array rezept\_id und der associationForeignKey
   tag\_id lautet. Was welcher Schlüssel sein muss prägt sich nach ein
   wenig Übung schnell ein.
-  **conditions**: Normale SQL-Syntax, um die Query-Ergebnisse für alle
   find()-Aufrufe zu filtern. Beispielsweise kann hier vorrausgesetzt
   werden, dass nur Tags gesucht werden, die freigeschalten wurden, was
   man wiederrum anhand eines zusätzlichen Feldes (z.B. status)
   festlegen könnte. Es ist dabei immer anzuraten den Feldnamen
   vollständig mit Modelnamen anzugeben. Also "Tag.status = 1" anstatt
   nur "status = 1". Sobald beide Models ein status-Feld haben weiß
   MySQL dann nicht mehr welches gemeint ist.
-  **fields**: Hier kann das selbe mit den Tabellen-Feldern gemacht
   werden. Beides gilt übrigens immer für die Ergebnisse des verbundenen
   Models (im obigen Beispiel also Tag).
-  **order**: Angaben zur Sortierung der Ergebnisse. z.B. id DESC.
-  **limit**: Die Höchstanzahl der zurückgegebenen Datensätze.
-  **unique**: If true (default value) cake will first delete existing
   relationship records in the foreign keys table before inserting new
   ones, when updating a record. So existing associations need to be
   passed again when updating.
-  **offset**: Die andere Hälfte des LIMIT-statements von MySQL (siehe
   limit). Soviele Datensätze werden übersprungen bevor welche
   zurückgegeben werden..
-  **finderQuery, deleteQuery, insertQuery**: Hier können für alle
   Belange, die durch die vorherigen Optionen nicht zu erreichen sind,
   eigene SQL-Statements zum finden, löschen und einfügen von
   Datensätzen genutzt werden.

Wenn diese Assoziation einmal fertig ist, werden find()-Aufrufe im
Rezepte-Model immer auch die verbundenen Tag-Datensätze finden (sofern
vorhanden und die Rekursionstiefe beim find()-Aufruf nicht zu niedrig
ist):

::

    //Beispiel-Ergebnisse eines $this->Rezept->find()-Aufrufs.

    Array
    (  
        [Rezept] => Array
            (
                [id] => 2745
                [name] => Erbsensuppe mit Bockwurst
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Mittagessen
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Hauptgericht
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => günstig
                    )
            )
    )

Wenn du das ganze auch umgedreht im Tag-Model machen willst darfst du
nicht vergessen auch dort eine solche HABTM-Assoziation definieren.

Man kann genauso eigene find-queries nach Maßgaben der HABTM-Relation
ausführen. Lasst uns einen Blick auf die folgenden Beispiele werfen:

Gehen wir von der selben Struktur wie im obigen Beispiel aus (Rezept
HABTM Tag). Jetzt wollen wir beispielsweise alle Rezepte, die das Tag
"günstig" besitzen. Ein möglicher (aber leider falscher) Weg, um das zu
erreichen wäre diese Bedingung im Model selbst einzusetzen:

::

    $this->Rezept->bindModel(array(
        'hasAndBelongsToMany' => array(
            'Tag' => array('conditions'=>array('Tag.name'=>'günstig'))
    )));
    $this->Rezept->find('all');

::

    //Zurückgegebene Daten
    Array
    (  
        0 => Array
            {
            [Rezept] => Array
                (
                    [id] => 2745
                    [name] => Erbsensuppe mit Bockwurst
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
            [Tag] => Array
                (
                   [0] => Array
                        (
                            [id] => 125
                            [name] => günstig
                        )
                )
        )
        1 => Array
            {
            [Rezept] => Array
                (
                    [id] => 2745
                    [name] => Flußkrebse mit Trüffeln
                    [created] => 2008-05-01 10:31:01
                    [user_id] => 2349
                )
            [Tag] => Array
                (
                }
            }
    }

Wie du siehst gibt dieses Beispiel ALLE Rezepte zurück und beschränkt
sich dann bei den Tags auf die Tags (unter den mit dem Datensatz
verbundenen), die den Namen "günstig" tragen. Deswegen werden hier neben
der Erbsensuppe auch die Flußkrebse gefunden. Da die Flußkrebse aber
unter allen Tags, die mit zu ihnen gehören mögen aber keinen haben,
dessen Name "günstig" ist, ist der Array mit den HABTM-Ergebnissen leer.
Um unser Ziel tatsächlich zu erreichen gibt es eine Menge Möglichkeiten,
alle basieren darauf eine temporäre Verbindung zur Join-Tabelle und/oder
zum Tag-Model herzustellen.

::

    $this->Rezept->bindModel(array('hasOne' => array('RezepteTag')));
    $this->Rezept->find('all', array(
            'fields' => array('Rezept.*'),
            'conditions'=>array('RecipesTag.tag_id'=>125) // id von günstig
    ));

Genauso könnte man eine exotische Assoziation mit dem Zweck so viele
Verknüpfungen wie gebraucht werden um das Filtern zu ermöglichen zu
erstellen, zum Beispiel:

::

    $this->Rezept->bindModel(array(
        'hasOne' => array(
            'RezepteTag',
            'FilterTag' => array(
                'className' => 'Tag',
                'foreignKey' => false,
                'conditions' => array('FilterTag.id = RezepteTag.id')
    )));
    $this->Rezept->find('all', array(
            'fields' => array('Rezept.*'),
            'conditions'=>array('FilterTag.name'=>'günstig')
    ));

Beide Methoden geben die folgenden Daten zurück:

::

    //Zurückgegebene Daten
    Array
    (  
        0 => Array
            {
            [Rezept] => Array
                (
                    [id] => 2745
                    [name] => Erbsensupper mit Bockwurst
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => günstig
                    )
            )
    }

Für weitere Informationen zum Thema Model-Assoziationen on-the-fly hier
klicken: `Erstellen und Beenden von Assoziationen
on-the-fly </de/view/86/creating-and-destroying-associations-on-the-fly>`_

Um dein spezifisches Ziel zu erreichen solltet du die verschiedenen
Techniken miteinander kombinieren.

hasMany through (The Join Model)
--------------------------------

It is sometimes desirable to store additional data with a many to many
association. Consider the following

Student hasAndBelongsToMany Course Course hasAndBelongsToMany Student

In other words, a Student can take many Courses and a Course can be
taken my many Students. This is a simple many to many association
demanding a table such as this

::

    id | student_id | course_id

Now what if we want to store the number of days that were attended by
the student on the course and their final grade? The table we'd want
would be

::

    id | student_id | course_id | days_attended | grade

The trouble is, hasAndBelongsToMany will not support this type of
scenario because when hasAndBelongsToMany associations are saved, the
association is deleted first. You would lose the extra data in the
columns as it is not replaced in the new insert.

The way to implement our requirement is to use a **join model**,
otherwise known (in Rails) as a **hasMany through** association. That
is, the association is a model itself. So, we can create a new model
CourseMembership. Take a look at the following models.

::

            student.php
            
            class Student extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'first_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A first name is required'
                    ),
                    'last_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A last name is required'
                    )
                );
            }      
            
            course.php
            
            class Course extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A course name is required'
                    )
                );
            }
            
            course_membership.php

            class CourseMembership extends AppModel
            {
                public $belongsTo = array(
                    'Student', 'Course'
                );

                public $validate = array(
                    'days_attended' => array(
                        'rule' => 'numeric',
                        'message' => 'Enter the number of days the student attended'
                    ),
                    'grade' => array(
                        'rule' => 'notEmpty',
                        'message' => 'Select the grade the student received'
                    )
                );
            }   

The CourseMembership join model uniquely identifies a given Student's
participation on a Course in addition to extra meta-information.

Working with join model data
----------------------------

Now that the models have been defined, let's see how we can save all of
this. Let's say the Head of Cake School has asked us the developer to
write an application that allows him to log a student's attendance on a
course with days attended and grade. Take a look at the following code.

::

        controllers/course_membership_controller.php
        
        class CourseMembershipsController extends AppController
        {
            public $uses = array('CourseMembership');
            
            public function index() {
                $this->set('course_memberships_list', $this->CourseMembership->find('all'));
            }
            
            public function add() {
                
                if (! empty($this->data)) {
                    
                    if ($this->CourseMembership->saveAll(
                        $this->data, array('validate' => 'first'))) {

                        
                        $this->redirect(array('action' => 'index'));
                    }
                }
            }
        }
        
        views/course_memberships/add.ctp

        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.first_name'); ?>
            <?php echo $form->input('Student.last_name'); ?>
            <?php echo $form->input('Course.name'); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>
        

You can see that the form uses the form helper's dot notation to build
up the data array for the controller's save which looks a bit like this
when submitted.

::

        Array
        (
            [Student] => Array
                (
                    [first_name] => Joe
                    [last_name] => Bloggs
                )

            [Course] => Array
                (
                    [name] => Cake
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 5
                    [grade] => A
                )

        )

Cake will happily be able to save the lot together and assigning the
foreign keys of the Student and Course into CourseMembership with a
saveAll call with this data structure. If we run the index action of our
CourseMembershipsController the data structure received now from a
find('all') is:

::

        Array
        (
            [0] => Array
                (
                    [CourseMembership] => Array
                        (
                            [id] => 1
                            [student_id] => 1
                            [course_id] => 1
                            [days_attended] => 5
                            [grade] => A
                        )

                    [Student] => Array
                        (
                            [id] => 1
                            [first_name] => Joe
                            [last_name] => Bloggs
                        )

                    [Course] => Array
                        (
                            [id] => 1
                            [name] => Cake
                        )

                )

        )

There are of course many ways to work with a join model. The version
above assumes you want to save everything at-once. There will be cases
where you want to create the Student and Course independently and at a
later point associate the two together with a CourseMembership. So you
might have a form that allows selection of existing students and courses
from picklists or ID entry and then the two meta-fields for the
CourseMembership, e.g.

::

        
        views/course_memberships/add.ctp
        
        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>

And the resultant POST

::

     
        Array
        (
            [Student] => Array
                (
                    [id] => 1
                )

            [Course] => Array
                (
                    [id] => 1
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 10
                    [grade] => 5
                )

        )

Again Cake is good to us and pulls the Student id and Course id into the
CourseMembership with the saveAll.

Join models are pretty useful things to be able to use and Cake makes it
easy to do so with its built-in hasMany and belongsTo associations and
saveAll feature.

Creating and Destroying Associations on the Fly
-----------------------------------------------

Sometimes it becomes necessary to create and destroy model associations
on the fly. This may be for any number of reasons:

-  You want to reduce the amount of associated data fetched, but all
   your associations are on the first level of recursion.
-  You want to change the way an association is defined in order to sort
   or filter associated data.

This association creation and destruction is done using the CakePHP
model bindModel() and unbindModel() methods. (There is also a very
helpful behavior called "Containable", please refer to manual section
about Built-in behaviors for more information). Let's set up a few
models so we can see how bindModel() and unbindModel() work. We'll start
with two models:

::

    <?php

    class Leader extends AppModel {
        var $name = 'Leader';
     
        var $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }

    ?>

    <?php

    class Follower extends AppModel {
        var $name = 'Follower';
    }

    ?>

Now, in the LeadersController, we can use the find() method in the
Leader model to fetch a Leader and its associated followers. As you can
see above, the association array in the Leader model defines a "Leader
hasMany Followers" relationship. For demonstration purposes, let's use
unbindModel() to remove that association in a controller action.

::

    function someAction() {
        // This fetches Leaders, and their associated Followers
        $this->Leader->find('all');
      
        // Let's remove the hasMany...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // Now using a find function will return 
        // Leaders, with no Followers
        $this->Leader->find('all');
      
        // NOTE: unbindModel only affects the very next 
        // find function. An additional find call will use 
        // the configured association information.
      
        // We've already used find('all') after unbindModel(), 
        // so this will fetch Leaders with associated 
        // Followers once again...
        $this->Leader->find('all');
    }

Removing or adding associations using bind- and unbindModel() only works
for the *next* find operation only unless the second parameter has been
set to false. If the second parameter has been set to *false*, the bind
remains in place for the remainder of the request.

Here’s the basic usage pattern for unbindModel():

::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Now that we've successfully removed an association on the fly, let's add
one. Our as-of-yet unprincipled Leader needs some associated Principles.
The model file for our Principle model is bare, except for the var $name
statement. Let's associate some Principles to our Leader on the fly (but
remember–only for just the following find operation). This function
appears in the LeadersController:

::

    function anotherAction() {
        // There is no Leader hasMany Principles in 
        // the leader.php model file, so a find here, 
        // only fetches Leaders.
        $this->Leader->find('all');
     
        // Let's use bindModel() to add a new association 
        // to the Leader model:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // Now that we're associated correctly, 
        // we can use a single find function to fetch 
        // Leaders with their associated principles:
        $this->Leader->find('all');
    }

There you have it. The basic usage for bindModel() is the encapsulation
of a normal association array inside an array whose key is named after
the type of association you are trying to create:

::

    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // normal association keys go here...
                    )
                )
            )
        );

Even though the newly bound model doesn't need any sort of association
definition in its model file, it will still need to be correctly keyed
in order for the new association to work properly.

Multiple relations to the same model
------------------------------------

There are cases where a Model has more than one relation to another
Model. For example you might have a Message model that has two relations
to the User model. One relation to the user that sends a message, and a
second to the user that receives the message. The messages table will
have a field user\_id, but also a field recipient\_id. Now your Message
model can look something like:

::

    <?php
    class Message extends AppModel {
        var $name = 'Message';
        var $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Recipient is an alias for the User model. Now let's see what the User
model would look like.

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

It is also possible to create self associations as shown below.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        
        var $belongsTo = array(
            'Parent' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );

        var $hasMany = array(
            'Children' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    }
    ?>

**An alternate method** of associating a model with itself (without
assuming a parent/child relationship) is to have both the ``$belongsTo``
and ``$hasMany`` relationships of a model each to declare an identical
alias, className, and foreignKey [property].

::

    <?php
    class MySchema extends CakeSchema {
        public $users = array (
            'id' => array ('type' => 'integer', 'default' => null, 'key' => 'primary'),
            'username' => array ('type' => 'string', 'null' => false, 'key' => 'index'),
            // more schema properties...
            'last_user_id' => array ('type' => 'integer', 'default' => null, 'key' => 'index'),

            'indexes' => array (
                'PRIMARY' => array ('column' => 'id', 'unique' => true),
                // more keys...
                'last_user' => array ('column' => 'last_user_id', 'unique' => false)
            )
        );
    }

    class User extends AppModel {
        public $hasMany = array (
            'Tag' => array (
                'foreignKey' => 'last_user_id'
            ),
            // more hasMany relationships...
            'LastUser' => array (
                'className' => 'User',
                'foreignKey' => 'last_user_id'
            )
        );
        public $belongsTo = array (
            // in most cases this would be the only belongsTo relationship for this model
            'LastUser' => array (
                'className' => 'User',
                'foreignKey' => 'last_user_id',
                'dependent' => true
            )
        );
    }
    ?>

**Reasoning** [for this particular self-association method]: Say there
are many models which contain the property ``$modelClass.lastUserId``.
Each model has the foreign key ``last_user_id``, a reference to the last
user that updated/modified the record in question. The model ``User``
*also contains* the same property (last\_user\_id), since it may be neat
to know if someone has committed a security breach through the
modification of any User record other than their own (you could also use
strict ACL behaviors).

**Fetching a nested array of associated records:**

If your table has ``parent_id`` field you can also use
```find('threaded')`` <https://book.cakephp.org/view/1023/find-threaded>`_
to fetch nested array of records using a single query without setting up
any associations.

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement. This
allows you to perform complex searches across multiples tables (i.e:
search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) perform automatic
joins to retrieve data, so you can issue queries to retrieve models
based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You only
have to define the necessary joins to combine tables and get the desired
results for your query.

Remember you need to set the recursion to -1 for this to work. I.e:
$this->Channel->recursive = -1;

To force a join between tables you need to use the "modern" syntax for
Model::find(), adding a 'joins' key to the $options array. For example:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the channels
table. You can alias the table with the Model name, so the retrieved
data complies with the CakePHP data structure.

The keys that define the join are the following:

-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model associated
   with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on Related model fields:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $privateItems = $Item->find('all', $options);

You could perform several joins as needed in hasBelongsToMany:

Suppose a Book hasAndBelongsToMany Tag association. This relation uses a
books\_tags table as join table, so you need to join the books table to
the books\_tags table, and this with the tags table:

::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.books_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

Using joins with Containable behavior could lead to some SQL errors
(duplicate tables), so you need to use the joins method as an
alternative for Containable if your main goal is to perform searches
based on related data. Containable is best suited to restricting the
amount of related data brought by a find statement.

Callback Methods
================

If you want to sneak in some logic just before or after a CakePHP model
operation, use model callbacks. These functions can be defined in model
classes (including your AppModel) class. Be sure to note the expected
return values for each of these special functions.

beforeFind
----------

``beforeFind(mixed $queryData)``

Called before any find-related operation. The ``$queryData`` passed to
this callback contains information about the current query: conditions,
fields, etc.

If you do not wish the find operation to begin (possibly based on a
decision relating to the ``$queryData`` options), return *false*.
Otherwise, return the possibly modified ``$queryData``, or anything you
want to get passed to find and its counterparts.

You might use this callback to restrict find operations based on a
user’s role, or make caching decisions based on the current load.

afterFind
---------

``afterFind(array $results, bool $primary)``

Use this callback to modify results that have been returned from a find
operation, or to perform any other post-find logic. The $results
parameter passed to this callback contains the returned results from the
model's find operation, i.e. something like:

::

    $results = array(
      0 => array(
        'ModelName' => array(
          'field1' => 'value1',
          'field2' => 'value2',
        ),
      ),
    );

The return value for this callback should be the (possibly modified)
results for the find operation that triggered this callback.

The ``$primary`` parameter indicates whether or not the current model
was the model that the query originated on or whether or not this model
was queried as an association. If a model is queried as an association
the format of ``$results`` can differ; instead of the result you would
normally get from a find operation, you may get this:

::

    $results = array(
      'field_1' => 'value1',
      'field_2' => 'value2'
    );

Code expecting ``$primary`` to be true will probably get a "Cannot use
string offset as an array" fatal error from PHP if a recursive find is
used.

Below is an example of how afterfind can be used for date formating.

::

    function afterFind($results) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }

    function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
--------------

``beforeValidate()``

Use this callback to modify model data before it is validated, or to
modify validation rules if required. This function must also return
*true*, otherwise the current save() execution will abort.

beforeSave
----------

``beforeSave(array $options)``

Place any pre-save logic in this function. This function executes
immediately after model data has been successfully validated, but just
before the data is saved using Model::save(). This function should also
return true if you want the save operation to continue.

The ``$options`` array holds the ``$fieldList`` and ``$validate``
variables from ``Model::save()``.

This callback is especially handy for any data-massaging logic that
needs to happen before your data is stored. If your storage engine needs
dates in a specific format, access it at $this->data and modify it.

Below is an example of how beforeSave can be used for date conversion.
The code in the example is used for an application with a begindate
formatted like YYYY-MM-DD in the database and is displayed like
DD-MM-YYYY in the application. Of course this can be changed very
easily. Use the code below in the appropriate model.

::

    function beforeSave($options) {
        if (!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
                $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
                $this->data['Event']['enddate'] = $this->dateFormatBeforeSave($this->data['Event']['enddate']);
        }
        return true;
    }

    function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString)); // Direction is from 
    }

Be sure that beforeSave() returns true, or your save is going to fail.

afterSave
---------

``afterSave(boolean $created)``

Wenn Befehle direkt nach der Speichern-Funktion ausgeführt werden
sollen, dann schreibt man sie in diese *callback*-Funktion.

Der Wert von ``$created`` ist wahr, wenn ein neues Objekt erstellt wurde
(anstelle einer Aktualisierung)

beforeDelete
------------

``beforeDelete(boolean $cascade)``

Place any pre-deletion logic in this function. This function should
return true if you want the deletion to continue, and false if you want
to abort.

The value of ``$cascade`` will be ``true`` if records that depend on
this record will also be deleted.

Be sure that beforeDelete() returns true, or your delete is going to
fail.

::

    // using app/models/ProductCategory.php
    // In the following example, do not let a product category be deleted if it still contains products.
    // A call of $this->Product->delete($id) from ProductsController.php has set $this->id .
    // Assuming 'ProductCategory hasMany Product', we can access $this->Product in the model.
    function beforeDelete()
    {
        $count = $this->Product->find("count", array(
            "conditions" => array("product_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        } else {
            return false;
        }
    }

afterDelete
-----------

``afterDelete()``

Place any logic that you want to be executed after every deletion in
this callback method.

onError
-------

``onError()``

Called if any problems occur.

Model Attributes
================

Model attributes allow you to set properties that can override the
default model behavior.

For a complete list of model attributes and their descriptions visit the
CakePHP API. Check out
`https://api.cakephp.org/class/model <https://api.cakephp.org/class/model>`_.

useDbConfig
-----------

Mit der ``useDbConfig`` Eigenschaft legst du (als String) den Namen der
zu verwendenden Datenbank-Konfiguration fest, die verwendet werden soll
um deine *Model* Klasse mit die zugehörige Datenbanktabelle zu
verbinden. ``useDbConfig`` kann dabei jede beliebige Konfiguration sein,
die in deiner /app/config/database.php angegeben ist.

Standardmäßig ist ``useDbConfig`` auf die Konfiguration 'default'
gesetzt.

Anwendungsbeispiel:

::

    class Example extends AppModel {
       var $useDbConfig = 'alternate';
    }

useTable
--------

The ``useTable`` property specifies the database table name. By default,
the model uses the lowercase, plural form of the model's class name. Set
this attribute to the name of an alternate table, or set it to ``false``
if you wish the model to use no database table.

Example usage:

::

    class Example extends AppModel {
       var $useTable = false; // This model does not use a database table
    }

Alternatively:

::

    class Example extends AppModel {
       var $useTable = 'exmp'; // This model uses a database table 'exmp'
    }

tablePrefix
-----------

The name of the table prefix used for the model. The table prefix is
initially set in the database connection file at
/app/config/database.php. The default is no prefix. You can override the
default by setting the ``tablePrefix`` attribute in the model.

Example usage:

::

    class Example extends AppModel {
       var $tablePrefix = 'alternate_'; // will look for 'alternate_examples'
    }

If you want to use fixtures in your test cases, it is better not to use
the tablePrefix attribute but add the prefix in the useTable attribute,
instead.

primaryKey
----------

Each table normally has a primary key, ``id``. You may change which
field name the model uses as its primary key. This is common when
setting CakePHP to use an existing database table.

Example usage:

::

    class Example extends AppModel {
        var $primaryKey = 'example_id'; // example_id is the field name in the database
    }

displayField
------------

The ``displayField`` attribute specifies which database field should be
used as a label for the record. The label is used in scaffolding and in
``find('list')`` calls. The model will use ``name`` or ``title``, by
default.

For example, to use the ``username`` field:

::

    class User extends AppModel {
       var $displayField = 'username';
    }

Multiple field names cannot be combined into a single display field. For
example, you cannot specify, ``array('first_name', 'last_name')`` as the
display field. Instead create a virtual field with the Model attribute
virtualFields

recursive
---------

The recursive property defines how deep CakePHP should go to fetch
associated model data via ``find()``, ``findAll()`` and ``read()``
methods.

Imagine your application features Groups which belong to a domain and
have many Users which in turn have many Articles. You can set $recursive
to different values based on the amount of data you want back from a
$this->Group->find() call:

+---------+----------------------------------------------------------------------------------------------+
| Depth   | Description                                                                                  |
+=========+==============================================================================================+
| -1      | Cake fetches Group data only, no joins.                                                      |
+---------+----------------------------------------------------------------------------------------------+
| 0       | Cake fetches Group data and its domain                                                       |
+---------+----------------------------------------------------------------------------------------------+
| 1       | Cake fetches a Group, its domain and its associated Users                                    |
+---------+----------------------------------------------------------------------------------------------+
| 2       | Cake fetches a Group, its domain, its associated Users, and the Users' associated Articles   |
+---------+----------------------------------------------------------------------------------------------+

Set it no higher than you need. Having CakePHP fetch data you aren’t
going to use slows your app unnecessarily. Also note that the default
recursive level is 1.

If you want to combine $recursive with the ``fields`` functionality, you
will have to add the columns containing the required foreign keys to the
``fields`` array manually. In the example above, this could mean adding
``domain_id``.

order
-----

The default ordering of data for any find operation. Possible values
include:

::

    var $order = "field"
    var $order = "Model.field";
    var $order = "Model.field asc";
    var $order = "Model.field ASC";
    var $order = "Model.field DESC";
    var $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
----

The container for the model’s fetched data. While data returned from a
model class is normally used as returned from a find() call, you may
need to access information stored in $data inside of model callbacks.

\_schema
--------

Contains metadata describing the model’s database table fields. Each
field is described by:

-  name
-  type (integer, string, datetime, etc.)
-  null
-  default value
-  length

Example Usage:

::

    var $_schema = array(
        'first_name' => array(
            'type' => 'string', 
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string', 
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
--------

This attribute holds rules that allow the model to make data validation
decisions before saving. Keys named after fields hold regex values
allowing the model to try to make matches.

It is not necessary to call validate() before save() as save() will
automatically validate your data before actually saving.

For more information on validation, see the `Data Validation
chapter </de/view/125/data-validation>`_ later on in this manual.

virtualFields
-------------

Array of virtual fields this model has. Virtual fields are aliased SQL
expressions. Fields added to this property will be read as other fields
in a model but will not be saveable.

Example usage for MySQL:

::

    var $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

For more information on the ``virtualFields`` property, its proper
usage, as well as limitations, see `the section on virtual
fields </de/view/1608/Virtual-fields>`_.

name
----

As you saw earlier in this chapter, the name attribute is a
compatibility feature for PHP4 users and is set to the same value as the
model name.

Example usage:

::

    class Example extends AppModel {
       var $name = 'Example';
    }

cacheQueries
------------

If set to true, data fetched by the model during a single request is
cached. This caching is in-memory only, and only lasts for the duration
of the request. Any duplicate requests for the same data is handled by
the cache.

Additional Methods and Properties
=================================

While CakePHP’s model functions should get you where you need to go,
don’t forget that model classes are just that: classes that allow you to
write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as the
fat model.

::

    class Example extends AppModel {

       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day)'
          );
          return $this->find('all', compact('conditions'));
       }
    }

This ``getRecent()`` method can now be used within the controller.

::

    $recent = $this->Example->getRecent();

Using virtualFields
-------------------

Virtual fields are a new feature in the Model for CakePHP 1.3. Virtual
fields allow you to create arbitrary SQL expressions and assign them as
fields in a Model. These fields cannot be saved, but will be treated
like other model fields for read operations. They will be indexed under
the model's key alongside other model fields.

**How to create virtual fields**

Creating virtual fields is easy. In each model you can define a
$virtualFields property that contains an array of
``field => expressions``. An example of virtual field definitions would
be:

::

    var $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

**Using virtual fields**

Creating virtual fields is straightforward and easy, interacting with
virtual fields can be done through a few different methods.

**``Model::hasField()``**

``Model::hasField()`` has been updated so that it returns true if the
model has a ``virtualField`` with the correct name. By setting the
second parameter of ``hasField`` to true, ``virtualFields`` will also be
checked when checking if a model has a field. Using the example field
above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

**``Model::isVirtualField()``**

This method can be used to check if a field/column is a virtual field or
a concrete field. Will return true if the column is virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

**``Model::getVirtualField()``**

This method can be used to access the SQL expression that comprises a
virtual field. If no argument is supplied it will return all virtual
fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

**``Model::find()`` and virtual fields**

As stated earlier ``Model::find()`` will treat virtual fields much like
any other field in a model. The value of a virtual field will be placed
under the model's key in the resultset. Unlike the behavior of
calculated fields in 1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

**Pagination and virtual fields**

Since virtual fields behave much like regular fields when doing find's,
``Controller::paginate()`` has been updated to allows sorting by virtual
fields.

Virtuelle Felder
================

Virtuelle Felder sind neue Bestandteile des *Models* in CakePHP 1.3.
Damit ist es möglich beliebige SQL-Ausdrücke als Felder einem *Model*
zuzuweisen. Diese Felder können nicht von Schreiboperationen des
*Models* verändert werden, werden aber bei Leseoperationen genau wie
andere Felder behandelt und sind neben den anderen Feldern unter dem
*Model*-Namen indiziert.

Virtuelle Felder erstellen
--------------------------

Virtuelle Felder zu erstellen ist einfach. In jedem Model kann man eine
``$virtualFields``-Eigenschaft, die einen Array mit
``field =>``-Ausdrücken enthält, definieren. Ein Beispiel eines
virtuellen Feldes mit MySQL sieht so aus:

::

    var $virtualFields = array(
        'full_name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

Und mit PostgreSQL:

::

    var $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

In späteren *find*-Operationen würden die Ergebnisse des Usermodels
einen ``name``-Schlüssel mit dem Ergebnis der Konkatenation enthalten.

Es ist nicht zu empfehlen virtuelle Felder so zu nennen wie tatsächliche
Felder in der Datenbank. Dies könnte zu SQL-Fehlern führen.

Mit virtuellen Feldern arbeiten
-------------------------------

Virtuelle Felder zu erstellen ist unkompliziert und einfach. Mit ihnen
zu interagieren ist mit ein paar verschiedener Methoden möglich.

Model::hasField()

Model::hasField() wurde aktualisert damit es nun ``true`` zurückgibt,
wenn es ein virtuelles Feld mit dem entsprechenden Namen gibt. Dazu muss
der zweite Paramter von ``hasField()`` ``true`` sein.

::

    $this->User->hasField('full_name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('full_name', true); // Will return true as there is a virtual field called full_name

Model::isVirtualField()

Mit dieser Methode kann überprüft werden ob es sich bei einem Feld um
ein virtuelles oder ein normales Feld handelt. Die Methode gibt ``true``
zurück, wenn das Feld virtuell ist.

::

    $this->User->isVirtualField('full_name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()

Diese Methode kann benutzt werden um den SQL-Ausdrück zu erhalten, aus
dem das virtuelle Feld besteht. Wenn kein Argument gegeben wird, werden
alle virtuellen Felder des Models zurückgegeben.

::

    $this->User->getVirtualField('full_name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)' in MySQL

Model::find() und virtuelle Felder

Wie vorher erwähnt wird ``Model::find()`` virtuelle Felder größtenteils
wie jedes andere Feld eines Models behandeln. Der Wert eines virtuellen
Feldes wird unter dem Schlüssel des Models in der Ergebnismenge
eingefügt - anders als das Verhalten von *calculated fields* in CakePHP
1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'full_name' => 'Mark Story',
            //more fields.
        )
    );

**Paginierung und virtuelle Felder**

Da virtuelle Felder größtenteils wie normale Felder sind wurde
``Controller::paginate()`` aktualisiert um Sortierung nach virtuellen
Feldern zu ermöglichen.

Virtuelle Felder und Model-Aliase
---------------------------------

Beim benutzen von virtuellen Feldern und Models mit Aliasen die nicht
die Gleichen sind wie der Name des Models können Probleme auftreten, da
virtuelle Felder nicht diesen Alias verwenden. Falls virtuelle Felder in
Models mit verschiedenen Aliasen benutzt werden ist es das beste, die
virtuellen Felder im Konstruktor des Models zu definieren.

::

    function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields = array(
            'full_name' => sprintf('CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias)
        );
    }

Damit funktionieren die virtuellen Felder mit jedem Alias, dem man dem
Model gegeben hat.

Einschränkungen von virtuellen Feldern
--------------------------------------

Die Implementation von ``virtualFields`` in 1.3 hat einige
Einschränkungen. So können ``virtualFields`` in verknüpften Modellen
nicht für Bedingungen, Reihenfolgen oder Felder-Arrays verwendet werden.
Falls es trotzdem gemacht wird, ist das Resultat meistens ein
SQL-Fehler, da diese Felder vom ORM nicht ersetzt werden. Der Grund
dafür ist die Schwierigkeit herauszufinden, in welcher Tiefe ein
verknüpftes Modell gefunden werden kann.

Eine gebräuchliche Umgehungslösung für diese Beschränkung ist das
Kopieren von ``virtualFields`` von einem Modell zu einem anderen während
der Ausführung und wenn du darauf zugreifst.

::

    $this->virtualFields['full_name'] = $this->Author->virtualFields['full_name'];

Alternativ kannst du ``$virtualFields`` im Konstruktor deines Modells
definieren, indem du ``$this->alias`` verwendest:

::

    public function __construct($id=false,$table=null,$ds=null){
      parent::__construct($id,$table,$ds);
      $this->virtualFields = array(
        'name'=>"CONCAT(`{$this->alias}`.`first_name`,' ',`{$this->alias}`.`last_name`)"
      );
    }

Transactions
============

To perform a transaction, a model's tables must be of a type that
supports transactions.

All transaction methods must be performed on a model's DataSource
object. To get a model's DataSource from within the model, use:

::

        $dataSource = $this->getDataSource();

You can then use the data source to start, commit, or roll back
transactions.

::

        $dataSource->begin($this);
        
        //Perform some tasks

        if(/*all's well*/) {
            $dataSource->commit($this);
        } else {
            $dataSource->rollback($this);
        }

Nested transactions are currently not supported. If a nested transaction
is started, a commit will return false on the parent transaction.
