Access Control Lists (Zugangskontrolldokumente)
###############################################

CakePHPs Access(Zugriffs-/Zugangs-) control(-Kontroll-)
list(-Listen-)-Funktion ist wohl nicht nur eine der am meisten
diskutierten Funktionen von CakePHP, sondern auch die am häufigsten
gesuchte und wohl auch die verwirrendste Anwendung. Falls Du jetzt grade
nach einem guten Weg suchst um CakePHP-ACL\`s generell zum Laufen zu
bringen, dann lies auf jeden Fall weiter!

Bleib' tapfer und halte durch, auch wenn's sicherlich noch hart für Dich
wird. Sobald Du es einmal verstanden hast, sind ACL's extrem hilfreiche
Werkzeuge um die Kontrolle über Deine Anwendungen und deren Entwicklung
zu behalten.

Die Funktionsweise von ACL
==========================

Mächtige Werkzeuge benötigen eine Zugangkontrolle. Zugangskontrolllisten
(Access Control Lists / ACL) stellen eine Möglichkeit dar,
Berechtigungen für Applikationen sehr detailliert zu verwalten und
gleichzeitig leicht wartbar zu halten.

Zugangskontrolllisten, oder ACL, kontrollieren zwei wesentliche Dinge:
Objekte, die etwas anfragen und Objekte, die angefragt werden. Im
ACL-Jargon werden Objekte, die etwas anfragen (zumeist Benutzer), Access
Request Objects, kurz AROs, genannt. Objekte im System, die angefragt
werden (zumeist Actions oder Daten), werden Access Control Objects, kurz
ACOs, genannt. Die Entitäten werden "Objekte" genannt, da die
anfragenden Objekte nicht immer Personen sind - in einigen Fällen
möchtest Du vielleicht den Zugriff gewisser Cake Controller beschränken,
um das Initiieren der Programmlogik in anderen Applikationsteilen zu
unterbinden. ACOs kann alles sein, was Du kontrollieren möchtest. Von
einer Controller Action über einen Webservice bis hin zu einer Zeile aus
dem Onlinetagebuch Deiner Großmutter.

Zur Wiederholung:

-  ACO - Access Control Object - Etwas, das angefragt wird
-  ARO - Access Request Object - Etwas das etwas anderes anfragt

Im Wesentlichen werden ACLs genutzt, um zu entscheiden, wann ein ARO
Zugriff auf ein ACO haben darf.

Um Dir dabei zu helfen zu verstehen, wie alles zusammenarbeitet, lass
uns ein halb-praktisches Beispiel verwenden. Stell Dir für einen Moment
vor, dass ein Computersytsem von einer bekannten Gruppe von
Fantasiegestalten aus *Herr der Ringe* genutzt wird. Der Anführer der
Gruppe, Gandalf, möchte den Besitz der Gemeinschaft verwalten, dabei
aber einen gesunden Grad an Privatsphäre und Sicherheit für die anderen
Gemeinschaftsmitglieder erhalten. Als erstes muss er nun eine Liste der
beteiligten AROs erstellen:

-  Gandalf
-  Aragorn
-  Bilbo
-  Frodo
-  Gollum
-  Legolas
-  Gimli
-  Pippin
-  Merry

Beachte, dass ACL *nicht* das gleiche ist wie eine Authorisierung. Die
Nutzung der ACL passiert, *nachdem* sich ein Benutzer authorisiert hat.
Zwar werden diese beiden normalerweise gemeinsam genutzt, jedoch ist es
wichtig den Unterschied zwischen dem zu erkennen, wer jemand ist
(Authorisierung) und dem, was jemand darf (ACL).

Als nächstes braucht Gandalf eine Liste von Dingen, bzw. ACOs, die das
System verwalten soll. Diese Liste könnte so aussehen:

-  Waffen
-  Der eine Ring
-  Gesalzenes Schweinefleisch
-  Diplomatie
-  Bier

Üblicherweise werden Systeme unter Verwendung einer Art Matrix
verwaltet, dessen Grundgerüst aus Benutzern und berechtigungsrelevanten
Objekten besteht. Wenn diese Daten in einer Tabelle abgelegt würden,
sähe diese Tabelle etwa wie folgt aus:

Waffen

Der eine Ring

Gesalzenes Schweinefleisch

Diplomatie

Bier

Gandalf

erlaubt

erlaubt

erlaubt

Aragorn

erlaubt

erlaubt

erlaubt

erlaubt

Bilbo

erlaubt

Frodo

erlaubt

erlaubt

Gollum

erlaubt

Legolas

erlaubt

erlaubt

erlaubt

erlaubt

Gimli

erlaubt

erlaubt

Pippin

erlaubt

erlaubt

Merry

erlaubt

Auf den ersten Blick sieht dieses System so aus, als könnte es ziemlich
gut funktionieren. Es können Zuordnungen gemacht werden, um die
Sicherheit zu gewährleisten (nur Frodo hat Zugriff auf den Ring) und
"Unfälle" zu vermeiden (die Hobbits sollten von gesalzenem
Schweinefleisch und Waffen fern gehalten werden). Das scheint nun
feinkörnig genug und leicht zu lesen zu sein, oder?

Für kleine Systeme wie dieses kann ein Matrixaufbau durchaus
funktionieren. Jedoch kann bei wachsenden Systemen oder bei Systemen mit
einer großen Anzahl an Ressourcen (ACOs) und Benutzern (AROs) eine
solche Tabelle schnell unhandlich werden. Stelle Dir eine
Zugriffskontrolle für hunderte von Kriegsfeldlagern vor und versuche,
jede einzelne Einheit zu verwalten. Ein weiterer Nachteil von Matizen
ist, dass es nicht wirklich möglich ist, Benutzer in logische Bereiche
zu gruppieren oder Änderungen an kaskadierenden Berechtigungen, die auf
diesen Bereichen basieren, durchzuführen. Zum Beispiel wäre es schön,
den Hobbits automatisch den Zugriff auf das Bier und das Schweinefleisch
zu gewähren, sobald eine Schlacht geschlagen ist: Das für jeden
einzelnen Benutzer zu tun, wäre lästig und fehleranfällig. Jedoch eine
kaskadierende Berechtigung für alle Hobbits zu erstellen, wäre einfach.

ACL wird normalerweise über eine Baumstruktur implementiert. In der
Regel existiert dann ein Baum aus AROs und ein Baum aus ACOs. Durch die
Organisation der Objekte in Bäumen, können Berechtigungen noch immer
granular gehandhabt werden, während man das "große Ganze" noch gut im
Blick behält. Als weiser Anführer, der Gandalf ist, wählt er die Nutzung
von ACL in diesem neuen System und organisiert seine Objekte anhand
folgender Liste:

-  Die Gemeinschaft des Rings™

   -  Krieger

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Zauberer

      -  Gandalf

   -  Hobbits

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Besucher

      -  Gollum

Die Nutzung der ARO-Baumstruktur erlaubt es Gandalf, Berechtigungen für
ganze Gruppen von Benutzern auf einmal zu vergeben. Mit dem ARO-Baum
kann Gandalf nun einige gruppenbasierten Berechtigungen erstellen:

-  Gemeinschaft des Rings
   (**verboten**: alle)

   -  Krieger
      (**erlaubt**: Waffen, Bier, Lembasbrot, gesalzenes
      Schweinefleisch)

      -  Aragorn
      -  Legolas
      -  Gimli

   -  Zauberer
      (**erlaubt**: gesalzenes Schweinefleisch, Diplomatie, Bier)

      -  Gandalf

   -  Hobbits
      (**erlaubt**: Bier)

      -  Frodo
      -  Bilbo
      -  Merry
      -  Pippin

   -  Besucher
      (**erlaubt**: gesalzenes Schweinefleisch)

      -  Gollum

Wenn wir ACL nun nutzen würden, um zu sehen, ob Pippin berechtigt war,
das Bier zu erhalten, würden wir zunächst seinen Pfad im Baum suchen,
der im Beispiel wie folgt aussieht: Gemeinschaft->Hobbits->Pippin Dann
können wir nun die verschiedenen Berechtigungen erkennen, die bei jedem
dieser Punkte vergeben worden sind und können die spezifischen
Berechtigungen benutzen, die sich auf Pippin und das Bier beziehen.

+--------------------------+----------------------------+----------------------------------------------------+
| ARO Knoten               | Berechtigungsinformation   | Ergebnis                                           |
+==========================+============================+====================================================+
| Gemeinschaft des Rings   | alle verboten              | Verbietet den Zugriff auf das Bier                 |
+--------------------------+----------------------------+----------------------------------------------------+
| Hobbits                  | erlaube 'Bier'             | Erlaubt den Zugriff auf das Bier!                  |
+--------------------------+----------------------------+----------------------------------------------------+
| Pippin                   | --                         | Noch immer ist der Zugriff auf das Bier erlaubt!   |
+--------------------------+----------------------------+----------------------------------------------------+

Da der Knoten 'Pippin' im ACL-Baum nicht explizit den Zugriff auf das
Bier-ACO verweigert, bleibt im Endeffekt der Zugriff auf dieses ACO
erlaubt.

Der Baum bietet uns ebenfalls die Möglichkeit, weitere Anpassungen für
eine feinere Zugriffkontrolle zu definieren - wobei gleichzeitig die
Möglichkeit erhalten bleibt, pauschal Änderungen an ARO-Gruppen
durchzuführen::

-  Gemeinschaft des Rings (**verboten**: alle)

   -  Krieger
      (**erlaubt**: Waffen, Bier, Lambasbrot, gesalzenes
      Schweinefleisch)

      -  Aragorn
         (erlaubt: Diplomacy)
      -  Legolas
      -  Gimli

   -  Zauberer
      (**erlaubt**: gesalzenes Schweinefleisch, Diplomatie, Bier)

      -  Gandalf

   -  Hobbits
      (**erlaubt**: Bier)

      -  Frodo
         (erlaubt: Ring)
      -  Bilbo
      -  Merry
         (verboten: Bier)
      -  Pippin
         (erlaubt: Diplomatie)

   -  Besucher
      (**erlaubt**: gesalzenes Schweinefleisch)

      -  Gollum

Dieser Ansatz erlaubt uns sowohl weitreichende Berechtigungsänderungen,
als auch granulare Anpassungen. Er ermöglicht uns festzulegen, dass alle
Hobbits Zugriff auf das Bier haben, mit einer Ausnahme—Merry. Um
herauszufinden, ob Merry auf das Bier zugreifen darf, suchen wir seinen
Pfad innerhalb des Baums: Gemeinschaft->Hobbits->Merry und arbeiten uns
anhand der "Bierberechtigung" weiter vor:

+--------------------------+----------------------------+---------------------------------------+
| ARO Knoten               | Berechtigungsinformation   | Ergebnis                              |
+==========================+============================+=======================================+
| Gemeinschaft des Rings   | alle verboten              | Verbietet den Zugriff auf das Bier.   |
+--------------------------+----------------------------+---------------------------------------+
| Hobbits                  | erlaubt 'Bier'             | Erlaubt den Zugriff auf das Bier!     |
+--------------------------+----------------------------+---------------------------------------+
| Merry                    | verbiete 'Bier'            | Verbietet das Bier                    |
+--------------------------+----------------------------+---------------------------------------+

Zugriffsberechtigungen festlegen: Cakes INI-basierte ACL
========================================================

Die erste von Cake implementierte ACL basiert auf INI-Dateien, welche im
Cake-Pfad gespeichert werden. Obwohl es einfach ist und gut
funktioniert, empfehlen wir, die datenbankbasierte ACL zu benutzen weil
es möglich ist, neue ACOs und AROs aus der Anwendung heraus zu erzeugen.
Die INI-basierte Variante war für einfache Anwendungen gedacht - und
speziell für die Leute, die aus irgendwelchen Gründen keine Datenbank
benutzen möchten.

In der Voreinstellung benutzt CakePHP eine datenbankbasierte ACL. Um die
INI-basierte ACL zu aktivieren, muss man CakePHP beibringen, welches
System es benutzen soll. Dies kann man durch ändern folgender Zeilen in
app/config/core.php tun

::

    //Diese Zeilen ändern:
    Configure::write('Acl.classname', 'DbAcl');
    Configure::write('Acl.database', 'default');

    //in diese:
    Configure::write('Acl.classname', 'IniAcl');
    //Configure::write('Acl.database', 'default');

ARO/ACO Berechtigungen werden in **/app/config/acl.ini.php** definiert.
Der Grundgedanke ist, dass die AROs in INI Abschnitten mit drei
Eigenschaften gespeichert werden: groups, allow, und deny.

-  groups: Namen der ARO Gruppen, in dem dieses ARO Mitglied ist.
-  allow: Namen der ACOs auf die diese Gruppe Zugriff haben soll
-  deny: Namen der ACOs auf die diese Gruppe keinen Zugriff haben soll.

ACOs werden in Abschnitten der INI-Datei definiert, welche nur die
Eigenschaften allow und deny haben.

Um ein Beispiel zu geben, schauen wir uns an, wie die AROs, welche für
Die Gemeinschaft des Rings™ erzeugt wurden, in INI-Syntax aussehen
würden:

::

    ;-------------------------------------
    ; AROs
    ;-------------------------------------
    [aragorn]
    groups = Krieger
    allow = Diplomatie

    [legolas]
    groups = Krieger

    [gimli]
    groups = Krieger

    [gandalf]
    groups = Zauberer

    [frodo]
    groups = Hobbits
    allow = Ring

    [bilbo]
    groups = Hobbits

    [merry]
    groups = Hobbits
    deny = Bier

    [pippin]
    groups = Hobbits

    [gollum]
    groups = Besucher

    ;-------------------------------------
    ; ARO Groups
    ;-------------------------------------
    [Krieger]
    allow = Waffen, Bier, Gesalzenes_Schweinefleisch

    [Zauberer]
    allow = Gesalzenes_Schweinefleisch, Diplomatie, Bier

    [Hobbits]
    allow = Bier

    [Besucher]
    allow = Gesalzenes_Schweinefleisch

Nachdem die Zugriffsberechtigungen gesetzt sind, kannst Du mit dem
`Abschnitt zur
Zugriffsberechtigungsprüfung </de/view/471/checking-permissions-the-acl-c>`_
mithilfe der ACL Komponente weitermachen.

Zugriffsberechtigungen festlegen: Cakes Datenbank ACL
=====================================================

Nun da wir die INI basierten ACL Permissions abgedeckt haben, lass uns
weitergehen (häufiger gen utzten) zu den datenbank basierten ACLs.

Getting Started
---------------

The default ACL permissions implementation is database powered. Cake's
database ACL consists of a set of core models, and a console application
that comes with your Cake installation. The models are used by Cake to
interact with your database in order to store and retrieve nodes in tree
format. The console application is used to initialize your database and
interact with your ACO and ARO trees.

To get started, first you'll need to make sure your
``/app/config/database.php`` is present and correctly configured. See
section 4.1 for more information on database configuration.

Once you've done that, use the CakePHP console to create your ACL
database tables:

::

    $ cake schema create DbAcl

Running this command will drop and re-create the tables necessary to
store ACO and ARO information in tree format. The output of the console
application should look something like the following:

::

    ---------------------------------------------------------------
    Cake Schema Shell
    ---------------------------------------------------------------

    The following tables will be dropped.
    acos
    aros
    aros_acos

    Are you sure you want to drop the tables? (y/n) 
    [n] > y
    Dropping tables.
    acos updated.
    aros updated.
    aros_acos updated.

    The following tables will be created.
    acos
    aros
    aros_acos

    Are you sure you want to create the tables? (y/n) 
    [y] > y
    Creating tables.
    acos updated.
    aros updated.
    aros_acos updated.
    End create.

This replaces an older deprecated command, "initdb".

You can also use the SQL file found in ``app/config/schema/db_acl.sql``,
but that's nowhere near as fun.

When finished, you should have three new database tables in your system:
acos, aros, and aros\_acos (the join table to create permissions
information between the two trees).

If you're curious about how Cake stores tree information in these
tables, read up on modified database tree traversal. The ACL component
uses CakePHP's `Tree Behavior </de/view/91/tree-behavior>`_ to manage
the trees' inheritances. The model class files for ACL are all compiled
in a single file
`db\_acl.php <https://api.cakephp.org/file/cake/libs/model/db_acl.php>`_.

Now that we're all set up, let's work on creating some ARO and ACO
trees.

Creating Access Request Objects (AROs) and Access Control Objects (ACOs)
------------------------------------------------------------------------

In creating new ACL objects (ACOs and AROs), realize that there are two
main ways to name and access nodes. The *first* method is to link an ACL
object directly to a record in your database by specifying a model name
and foreign key value. The *second* method can be used when an object
has no direct relation to a record in your database - you can provide a
textual alias for the object.

In general, when you're creating a group or higher level object, use an
alias. If you're managing access to a specific item or record in the
database, use the model/foreign key method.

You create new ACL objects using the core CakePHP ACL models. In doing
so, there are a number of fields you'll want to use when saving data:
``model``, ``foreign_key``, ``alias``, and ``parent_id``.

The ``model`` and ``foreign_key`` fields for an ACL object allows you to
link up the object to its corresponding model record (if there is one).
For example, many AROs will have corresponding User records in the
database. Setting an ARO's ``foreign_key`` to the User's ID will allow
you to link up ARO and User information with a single User model find()
call if you've set up the correct model associations. Conversely, if you
want to manage edit operation on a specific blog post or recipe listing,
you may choose to link an ACO to that specific model record.

The ``alias`` for an ACL object is just a human-readable label you can
use to identify an ACL object that has no direct model record
correlation. Aliases are usually useful in naming user groups or ACO
collections.

The ``parent_id`` for an ACL object allows you to fill out the tree
structure. Supply the ID of the parent node in the tree to create a new
child.

Before we can create new ACL objects, we'll need to load up their
respective classes. The easiest way to do this is to include Cake's ACL
Component in your controller's $components array:

::

    var $components = array('Acl');

Once we've got that done, let's see what some examples of creating these
objects might look like. The following code could be placed in a
controller action somewhere:

While the examples here focus on ARO creation, the same techniques can
be used to create an ACO tree.

Keeping with our Fellowship setup, let's first create our ARO groups.
Because our groups won't really have specific records tied to them,
we'll use aliases to create these ACL objects. What we're doing here is
from the perspective of a controller action, but could be done
elsewhere. What we'll cover here is a bit of an artificial approach, but
you should feel comfortable using these techniques to build AROs and
ACOs on the fly.

This shouldn't be anything drastically new - we're just using models to
save data like we always do:

::

    function anyAction()
    {
        $aro =& $this->Acl->Aro;
        
        //Here's all of our group info in an array we can iterate through
        $groups = array(
            0 => array(
                'alias' => 'warriors'
            ),
            1 => array(
                'alias' => 'wizards'
            ),
            2 => array(
                'alias' => 'hobbits'
            ),
            3 => array(
                'alias' => 'visitors'
            ),
        );
        
        //Iterate and create ARO groups
        foreach($groups as $data)
        {
            //Remember to call create() when saving in loops...
            $aro->create();
            
            //Save data
            $aro->save($data);
        }

        //Other action logic goes here...
    }

Once we've got them in there, we can use the ACL console application to
verify the tree structure.

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors

      [2]wizards

      [3]hobbits

      [4]visitors

    ---------------------------------------------------------------

I suppose it's not much of a tree at this point, but at least we've got
some verification that we've got four top-level nodes. Let's add some
children to those ARO nodes by adding our specific user AROs under these
groups. Every good citizen of Middle Earth has an account in our new
system, so we'll tie these ARO records to specific model records in our
database.

When adding child nodes to a tree, make sure to use the ACL node ID,
rather than a foreign\_key value.

::

    function anyAction()
    {
        $aro = new Aro();
        
        //Here are our user records, ready to be linked up to new ARO records
        //This data could come from a model and modified, but we're using static
        //arrays here for demonstration purposes.
        
        $users = array(
            0 => array(
                'alias' => 'Aragorn',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 2356,
            ),
            1 => array(
                'alias' => 'Legolas',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 6342,
            ),
            2 => array(
                'alias' => 'Gimli',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 1564,
            ),
            3 => array(
                'alias' => 'Gandalf',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 7419,
            ),
            4 => array(
                'alias' => 'Frodo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 7451,
            ),
            5 => array(
                'alias' => 'Bilbo',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5126,
            ),
            6 => array(
                'alias' => 'Merry',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 5144,
            ),
            7 => array(
                'alias' => 'Pippin',
                'parent_id' => 3,
                'model' => 'User',
                'foreign_key' => 1211,
            ),
            8 => array(
                'alias' => 'Gollum',
                'parent_id' => 4,
                'model' => 'User',
                'foreign_key' => 1337,
            ),
        );
        
        //Iterate and create AROs (as children)
        foreach($users as $data)
        {
            //Remember to call create() when saving in loops...
            $aro->create();

            //Save data
            $aro->save($data);
        }
        
        //Other action logic goes here...
    }

Typically you won't supply both an alias and a model/foreign\_key, but
we're using both here to make the structure of the tree easier to read
for demonstration purposes.

The output of that console application command should now be a little
more interesting. Let's give it a try:

::

    $ cake acl view aro

    Aro tree:
    ---------------------------------------------------------------
      [1]warriors

        [5]Aragorn

        [6]Legolas

        [7]Gimli

      [2]wizards

        [8]Gandalf

      [3]hobbits

        [9]Frodo

        [10]Bilbo

        [11]Merry

        [12]Pippin

      [4]visitors

        [13]Gollum

    ---------------------------------------------------------------

Now that we've got our ARO tree setup properly, let's discuss a possible
approach for structuring an ACO tree. While we can structure more of an
abstract representation of our ACO's, it's often more practical to model
an ACO tree after Cake's Controller/Action setup. We've got five main
objects we're handling in this Fellowship scenario, and the natural
setup for that in a Cake application is a group of models, and
ultimately the controllers that manipulate them. Past the controllers
themselves, we'll want to control access to specific actions in those
controllers.

Based on that idea, let's set up an ACO tree that will mimic a Cake app
setup. Since we have five ACOs, we'll create an ACO tree that should end
up looking something like the following:

-  Weapons
-  Rings
-  PorkChops
-  DiplomaticEfforts
-  Ales

One nice thing about a Cake ACL setup is that each ACO automatically
contains four properties related to CRUD (create, read, update, and
delete) actions. You can create children nodes under each of these five
main ACOs, but using Cake's built in action management covers basic CRUD
operations on a given object. Keeping this in mind will make your ACO
trees smaller and easier to maintain. We'll see how these are used later
on when we discuss how to assign permissions.

Since you're now a pro at adding AROs, use those same techniques to
create this ACO tree. Create these upper level groups using the core Aco
model.

Assigning Permissions
---------------------

After creating our ACOs and AROs, we can finally assign permissions
between the two groups. This is done using Cake's core Acl component.
Let's continue on with our example.

Here we'll work in the context of a controller action. We do that
because permissions are managed by the Acl Component.

::

    class SomethingsController extends AppController
    {
        // You might want to place this in the AppController
        // instead, but here works great too.

        var $components = array('Acl');

    }

Let's set up some basic permissions using the AclComponent in an action
inside this controller.

::

    function index()
    {
        //Allow warriors complete access to weapons
        //Both these examples use the alias syntax
        $this->Acl->allow('warriors', 'Weapons');
        
        //Though the King may not want to let everyone
        //have unfettered access
        $this->Acl->deny('warriors/Legolas', 'Weapons', 'delete');
        $this->Acl->deny('warriors/Gimli',   'Weapons', 'delete');
        
        die(print_r('done', 1));
    }

The first call we make to the AclComponent allows any user under the
'warriors' ARO group full access to anything under the 'Weapons' ACO
group. Here we're just addressing ACOs and AROs by their aliases.

Notice the usage of the third parameter? That's where we use those handy
actions that are in-built for all Cake ACOs. The default options for
that parameter are ``create``, ``read``, ``update``, and ``delete`` but
you can add a column in the ``aros_acos`` database table (prefixed with
\_ - for example ``_admin``) and use it alongside the defaults.

The second set of calls is an attempt to make a more fine-grained
permission decision. We want Aragorn to keep his full-access privileges,
but deny other warriors in the group the ability to delete Weapons
records. We're using the alias syntax to address the AROs above, but you
might want to use the model/foriegn key syntax yourself. What we have
above is equivalent to this:

::

    // 6342 = Legolas
    // 1564 = Gimli

    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 6342), 'Weapons', 'delete');
    $this->Acl->deny(array('model' => 'User', 'foreign_key' => 1564), 'Weapons', 'delete');

Addressing a node using the alias syntax uses a slash-delimited string
('/users/employees/developers'). Addressing a node using model/foreign
key syntax uses an array with two parameters:
``array('model' => 'User', 'foreign_key' => 8282)``.

The next section will help us validate our setup by using the
AclComponent to check the permissions we've just set up.

Checking Permissions: The ACL Component
---------------------------------------

Let's use the AclComponent to make sure dwarves and elves can't remove
things from the armory. At this point, we should be able to use the
AclComponent to make a check between the ACOs and AROs we've created.
The basic syntax for making a permissions check is:

::

    $this->Acl->check( $aro, $aco, $action = '*');

Let's give it a try inside a controller action:

::

    function index()
    {
        //These all return true:
        $this->Acl->check('warriors/Aragorn', 'Weapons');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'create');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'read');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'update');
        $this->Acl->check('warriors/Aragorn', 'Weapons', 'delete');
        
        //Remember, we can use the model/foreign key syntax 
        //for our user AROs
        $this->Acl->check(array('model' => 'User', 'foreign_key' => 2356), 'Weapons');
        
        //These also return true:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'create');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'read');
        
        //But these return false:
        $result = $this->Acl->check('warriors/Legolas', 'Weapons', 'delete');
        $result = $this->Acl->check('warriors/Gimli', 'Weapons', 'delete');
    }

The usage here is demonstrational, but hopefully you can see how
checking like this can be used to decide whether or not to allow
something to happen, show an error message, or redirect the user to a
login.
