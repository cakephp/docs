Controller
##########

 

Einführung
==========

Ein Controller ist dazu da, um die Logik eurer Web-Applikation zu
regeln. Meistens erledigt ein Controller seine Arbeit nur für ein
einziges Model. Beispielsweise würde ein RezepteController sämtliche
Aktionen, des Rezept-Models und ein ZutatenController sämtliche Aktionen
des Zutaten-Models ausführen. Im Controller werden die Daten, die der
jeweilige View zur Darstellung benötigt (für eine Auflistung aller
Rezepte also beispielsweise ganz einfach alle Datenbankeinträge des
Rezept-Models) aufbereitet und dem View zur Verfügung gestellt.
Datenbankqueries werden so zwar *im Controller* (weil die Queries selbst
Programmlogik sind) initiiert, allerdings *mit dem Model* ausgeführt
(weil das Model die Schnittstelle zwischen Controller und Datenbank
darstellt). Der Name des Controllers ergibt sich aus der Pluralform des
Namen des Models gefolgt vom Wort Controller.

Das Rezept-Model wird vom RezepteController, das Produkt-Model vom
ProdukteController und das Zutat-Model vom ZutatenController bedient und
so weiter.\ [STRIKEOUT:]

Beachte, dass für die obigen Beispiele eventuell Veränderungen in der
inflections.php im config-Ordner vonnöten sind, da CakePHP eigentlich
nur englische Wörter selbstständig pluralisieren kann.

Die Controller eurer Web-Applikation sind Klassen, die vom CakePHP
AppController erben, der wiederrum von der Controller-Klasse erbt. Das
hat den Grund, dass ihr den AppController in eurem
controllers-Verzeichnis ueberschreiben und mit Standardwerten und
Funktionen versehen könnt. Die entsprechende PHP-Datei dafür muss sich
bei /app/app\_controller.php befinden.

Controller können eine beliebige Anzahl an Methoden besitzen, die
üblicherweise als *Aktionen* oder englisch *actions* bezeichnet werden.
Allerdings muss nicht jede Methode eine Aktion sein. Eine Aktion ist
eine Methode, die einen View darstellt, das heißt in den meisten Fällen
auch direkt über
www.webseite.de/controllerpluralname/aktion/variable1/variable2
aufgerufen werden kann (es ist deswegen aber nicht verboten, dem
Controller Methoden zu implementieren, die nur von anderen Aktionen
genutzt werden, selbst aber keine Aktion sind). Ein Rezepte-Controller
könnte zum Beispiel eine parameterfreie index()-Aktion haben (das ist
auch die Standardaktion die aufgerufen wird, falls die Adresse ohne
Aktionsname eingegeben wird). In dieser könnte man dann alle Rezepte
auflisten. Zusätzlich könnte er eine detailansicht($name)-Aktion haben,
die als einen Parameter den Namen des Rezeptes bekommt. Der Aufruf
www.webseite.de/rezepte/kaesekuchen bringt dann den Controller dazu die
Methode detailansicht("kaesekuchen") zu starten.

::

        <?php
        
        # /app/controllers/rezepte_controller.php

        class ReczepteController extends AppController {
            function detailansicht($name)     {
                $rezept = $this->Rezept->findByName($name);

                $this->set("rezept",$rezept);
            }
            function index() {
                $rezepte = $this->Rezept->find('all');

                $this->set("rezepte",$rezepte);
            }
        }

        ?>

Im obigen Beispiel geschieht in beiden Aktionen fast das gleiche. In der
Methode detailansicht($name) wird der entsprechende Datensatz mit der
Model-Methode (deswegen heißt es auch $this->Rezept->find... und nicht
$this->find...) findBy() gefunden. Das ist eine unglaublich coole
Funktion, auf die aber im Model-Kapitel eingegangen wird. Danach wird
dieser Datensatz mit der Controller-Methode set() als Variable $rezept
zur Verfuegung gestellt. In der Methode index() passiert fast das selbe.
Nur das hier eben alle Datensätze dem View zur Verfügung gestellt
werden. (find('all') ist dabei kein Schreibfehler, die findBy und find()
methoden sind verschieden - siehe Model-Kapitel).

Die beiden Views können dann ganz einfach auf die Daten zugreifen, da
ihnen nun die Variable $rezept respektive $rezepte, die alle Daten der
Tabelle beinhalten, zur Verfügung stehen.

CakePHP bringt bereits eine Menge an sinnvollen Controller-Methoden mit.
Darauf wird nun in diesem Kapitel näher eingegangen.

Der App Controller
==================

Wie bereits in der Einführung angegeben, ist die *AppController*-Klasse
die Elternklasse aller *application controller*. *AppController* selbst
erweitert die *Controller*-Klasse, welche in der CakePHP core Bibliothek
eingebunden ist. Deshalb wird *AppController* in
/app/app\_controller.php folgendermaßen definiert:

::

    <?php
    class AppController extends Controller {
    }
    ?>

Kontroller, Attribute und Methoden, welche im *AppController* erstellt
wurden, werden in allen deinen *application controller* verfügbar sein.
Dies ist die ideale Stelle, um Code zu erstellen, der für alle deine
Kontroller gleich ist. *Components* (welche du später genauer kennen
lernen wirst) werden am besten für Code genützt, der in einigen (aber
nicht unbedingt allen) Kontrollern verwendet wird.

Während normale objektorientierte Vererbungsregeln gelten, leistet
CakePHP bei speziellen Kontroller Attributen zusätzliche Arbeit, wie
z.B. bei den Listen der *Components* oder *Helpers*, die von einem
Kontroller genutzt werden. In diesem Fall werden *AppController*
Werte-Arrays mit den Kinderkontroller Klassenarrays gemischt.

CakePHP mischt folgende Variablen des *AppController* zu denen deines
*application controller*:

-  $components
-  $helpers
-  $uses

Bitte denke auch daran, *AppController Callbacks* innerhalb der
Kinderkontroller *Callbacks* aufzurufen, um beste Ergebnisse zu
erzielen:

::

    function beforeFilter(){
        parent::beforeFilter();
    }

Der Seitenkontroller (pages controller)
=======================================

Der CakePHP Kern bringt einen Standardkontroller mit. Dieser wird
Seitenkontroller (*Pages Controller*) genannt
(cake/libs/controller/pages\_controller.php). Die Startseite die nach
einer neuen Installation von CakePHP angezeigt wird, wird von diesem
Kontroller erzeugt. Der Kontroller kann dazu benutzt werden, statische
Seiten zu erzeugen. Legt man eine Viewvorlage wie zum Beispiel
app/views/pages/impressum.ctp an, dann kann man über die URL
http://example.com/pages/impressum darauf zugreifen.

Wenn eine Anwendung mit Hilfe des CakePHP Konsolenprogramm gebacken
wird, dann wird der Seitenkontroller (pages controller) in den
app/controllers/ Ordner kopiert und kann, wenn nötig, verändert werden.
Man kann den Kontroller page\_controller.php natürlich auch von Hand vom
Kern in die eigene Anwendung kopieren.

Niemals irgendeine Datei unterhalb des ``cake`` Ordners ändern!
Ansonsten kann es zu Problemen bei Updates von CakePHP kommen.

Controller-Attribute
====================

Eine komplette Liste der Controller-Attribute, inklusive deren Beschreibung, findest Du in der CakePHP API, unter `https://api.cakephp.org/1.2/class\_controller.html <https://api.cakephp.org/1.2/class_controller.html>`_.
==========================================================================================================================================================================================================================

$name
-----

Menschen, die auf PHP4 angewiesen sind, sollten damit beginnen das
Attribut $name zu setzen. Der Wert sollte dabei ganz einfach der Name
des Controllers sein. Dieser ist meistens die Pluralform des primären
Models, das der Controller nutzt. Damit kann man einigen Seltsamkeiten
von PHP4 die Klassennamen betreffend aus dem Weg gehen und CakePHP dabei
helfen, die Namen aufzulösen.

::

    <?php

    #   $name Controller-Attribut Beispiel

    class RezepteController extends AppController {
       var $name = 'Rezepte';
    }

    ?>   

$components, $helpers und $uses
-------------------------------

Die nächsten sehr häufig benutzten Attribute legen fest, welche *Helper*
(Helfer), *Components* (Komponenten) und *Models* (Modelle) CakePHP in
Verbindung mit dem jeweiligen Controller nutzen soll. Wenn diese
Attribute genutzt werden stehen die entsprechenden MVC-Klassen als
Klassenvariable zur Verfügung (als $this->ModellName).

Jedem Controller stehen standardmäßig bereits ein paar von diesen
Klassen zur Verfügung, so dass es möglicherweise nicht notwendig ist,
den Controller extra zu konfigurieren.

Controller haben beispielsweise standardmäßig zu ihrem primären Modell
Zugriff. Unser RezepteController kann auf das Rezept-Modell über
$this->Rezept und unser ProdukteController kann ähnlicherweise auf das
Produkt-Modell über $this->Produkt zugreifen.

Die Html-, Form-, und Session-Helfer, sowie die Session-Komponente sind
ebenso standardmäßig in jedem Controller aktiviert. Um mehr über die
Helfer und Komponenten zu erfahren, solltest du einen Blick in die
entsprechenden Kapitel, die später in diesem Handbuch noch kommen
werden, werfen.

Lasst uns nun mal sehen, wie wir einem CakePHP-Controller nun mitteilen
können, dass er zusätzliche MVC-Klassen verwenden soll.

::

    <?php
    class RezepteController extends AppController {
        var $name = 'Rezepte';

        var $uses = array('Rezept', 'Benutzer');
        var $helpers = array('Ajax');
        var $components = array('Email');
    }
    ?>   

Jede dieser Variablen wird mit ihrem geerbtem Wert gemischt. Zum
Beispiel ist es nicht notwendig den Form-Helfer nochmals zu deklarieren.
Das gleiche gilt für alle Dinge, die ihr in eurem eigenen AppController
deklariert habt.

Page-related Attributes: $layout and $pageTitle
-----------------------------------------------

Es gibt in CakePHP ein paar Attribute mit denen es möglich ist den View
zu steuern.

Das ``$layout``-Attribut kann als Wert den Namen eines Layouts haben,
das in ``/app/views/layouts`` liegt. Dabei sollte der Name ohne die .ctp
Dateiendung gegeben werden. Wenn dieses Attribut leer bleibt wird die
default.ctp als Layoutdatei genommen. Wenn du keine eigene in
``/app/views/layouts/default.ctp`` angelegt hast wird CakePHP die
Standard-Layout-Datei nutzen.

::

    <?php

    //   Mit $layout ein alternatives Layout definieren

    class RezepteController extends AppController {
        function quickSave() {
            $this->layout = 'ajax'; // Die Aktion quickSave() wird nun mit der ajax.ctp als layout gerendert.
        }
    }

    ?>

Weiterhin ist es möglich einen Seitentitel zu vergeben (steht dann oben
in der Titelzeile des Browsers), indem man ``$pageTitle`` verwendet.
Damit dieser dann auch angezeigt wird, muss in deinem Layout an einer
Stelle die ``$title_for_layout``-Variable ausgegeben werden (am besten
natürlich, in den dafür vorgesehenen ``<title>``-Tag im head-Bereich des
HTML-Dokuments.

::

    <?php

    //   Mit $pageTitle den Seitentitel festlegen

    class RezepteController extends AppController {
        function quickSave() {
            $this->pageTitle = 'Meine neuer Suchmaschinenoptimierter Titel';
        }
    }

    ?>

Es ist auch möglich den Seitentiel aus dem View heraus festzulegen mit
``$this->pageTitle``. Das ist sogar empfohlen, weil es der MVC-Idee
gerechter wird, da ein Seitentitel eher zum View als zum Controller
gehört. Für eine statische Seite *muss* der Seitentitel im View
festgelegt werden.

Wenn ``$this->pageTitel`` nicht gesetzt ist, wird CakePHP versuchen
einen Titel automatisch auf Basis des Controller-Namens oder der
View-Datei, im Falle einer statischen Seite, zu generieren.

Das Parameter-Attribut ($params)
--------------------------------

Controller-Parameter sind über $this->params in Deinem CakePHP
Controller verfügbar. Diese Variable dient der Bereitstellung von
Informationen über den aktuellen Request. Am häufigsten wird
$this->params genutzt, um auf Daten zuzugreifen, die per POST- oder
GET-Operationen an den Controller übergeben wurden.

form
~~~~

::

    $this->params['form']

Die POST Daten jeder Form werden hierin gespeichert, inklusive der
Informationen aus $\_FILES.

admin
~~~~~

``$this->params['admin']``

Dient dazu festzustellen, ob die aufgerufene Aktion durch das
Admin-Routing aufgerufen wurde.

bare
~~~~

``$this->params['bare']``

Ist true wenn das aktuelle Layout leer ist und false andererseits.

isAjax
~~~~~~

``$this->params['isAjax']``

Ist true, wenn die aktuelle Anfrage ein Ajax-Aufruf ist und false
andererseits. Diese Variable ist nur dann gesetzt, wenn die
RequestHandler Komponente im Kontroller genutzt wird.

controller
~~~~~~~~~~

``$this->params['controller']``

Enthält den Namen des Controllers, der die Anfrage gemacht hat. Ruft man
zum Beispiel die Adresse /posts/view/1 auf, dann ist der Inhalt von
``$this->params['controller']`` "posts".

action
~~~~~~

``$this->params['action']``

Enthält den Namen der Aktion, die die Anfrage gemacht hat. Ruft man zum
Beispiel /posts/view/1 auf, dann ist der Inhalt von
``$this->params['action']`` "view".

pass
~~~~

``$this->params['pass']``

Enthält ein numerisch indexiertes Array der URL-Parameter nach der
*Action*.

::

    // URL: /posts/view/12/print/narrow

    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
~~~

``$this->params['url']``

Enthält einen assoziativen Array der als erstes die aufgerufene URL
enthält (ohne Domain und GET-String) und danach Schlüssel-Wert-Paare von
GET-Variablen. Ruft man zum Beispiel /posts/view/?var1=3&var2=4 auf, so
ist der Inhalt von ``$this->params['url']``:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
~~~~

``$this->data``

Wird benutzt um POST Daten zu verarbeiten, die vom FormHelper "forms" an
den Controller gesendet werden.

::

    // Der FormHelper wird benutzt, um ein "form"-Element zu erstellen:
    $form->text('User.first_name');

In der Ausgabe sieht das ungefähr so aus:

::

     
    <input name="data[User][first_name]" value="" type="text" />

Wenn das Formular über POST an den Controller übergeben wird, tauchen
die Daten in ``this->data`` auf.

::

     
    //Der im Formular übergebene "first_name" lässt sich wie folgt auslesen:
    $this->data['User']['first_name'];

prefix
~~~~~~

``$this->params['prefix']``

Enthält das routing prefix. Zum Beispiel würde dieses Attribut den
String "admin" enthalten, wenn der URL /admin/posts/someaction
aufgerufen wurde.

named
~~~~~

``$this->params['named']``

``$this->params['named']`` speichert benannte Parameter aus dem URL
query String der Form /key:value/. Zum Beispiel, wenn die URL
/posts/view/var1:3/var2:4 aufgerufen wird, wird
``$this->params['named']`` folgendes Array enthalten:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )

Andere Attribute
----------------

Auch wenn Du Details zu allen Controller-Attributen im API findest, gibt
es Controller-Attribute, die einen eingenen Abschnitt im Handbuch
verdient haben.

Das $cacheAction Attribut hilft Dir beim "caching" (vorgeparsten
Zwischenspeichern), und das $paginate Attribut wird benutzt um
Umblätter-Standards für den Controller zu setzen. Für genauere
Informationen zu diesen Attributen kannst Du einfach im betreffenden
Abschnitt dieses Handbuchs nachschlagen.

persistModel
------------

Stub. Update Me!

Used to create cached instances of models a controller uses. When set to
true, all models related to the controller will be cached. This can
increase performance in many cases.

Controller Methoden
===================

Eine vollständige Liste aller Controller-Methoden und deren Beschreibung
gibts in der CakePHP-Api. Gehe zu
`https://api.cakephp.org/1.2/class\_controller.html <https://api.cakephp.org/1.2/class_controller.html>`_.

Interagieren mit Views
----------------------

set()
~~~~~

``set(string $var, mixed $value)``

Die ``set()``-Methode ist die hauptsächliche Möglichkeit um Daten vom
Controller an den View zu senden. Nachdem ``set()`` verwendet wurde,
kann die Variable im View verwendet werden.

::

    <?php
        
    //Als erstes schickst du die Variable im Controller los:

    $this->set('farbe', 'rosa');

    //Dann kann die Variable im View benutzt werden:
    ?>

    Du hast <?php echo $farbe; ?> Zuckerstreusel für den Kuchen gewählt.

Die ``set()``-Methode ist auch in der Lage mit nur einem Parameter, der
ein assoziativer Array sein muss, aufgerufen zu werden um mit einem
Aufruf von set() eine ganze Menge an Variablen an den View zu schicken.

Die Schlüssel aus einem Array werden dabei flektiert. (z.B.
'schluessel\_mit\_unterstrich' wird zu 'schluesselMitUnterstrich').

::

    <?php
        
    $data = array(
        'farbe' => 'rosa',
        'typ' => 'zucker',
        'preis_brutto' => 23.95
    );

    //stellt dem View$farbe, $typ
    //und $preisBrutto zur 
    $this->set($data);  

    ?>

render
~~~~~~

``render(string $action, string $layout, string $file)``

Die ``render()``-Methode wird normalerweise sowieso automatisch nach
jeder aufgerufenen Aktion gestartet. Mit dieser Methode kann man den
View in Gang setzen, der die Variablen, die man per ``set()`` zur
Verfügung gestellt hat, für den Benutzer aufbereitet. Danach wird der
View an die entsprechende Stelle im Layout gesetzt (dort wo man
``$content_for_layout`` ausgeben lässt) und schließlich an den Browser
geschickt.

Den Namen der Standard-View-Datei, die ``render()`` nutzt wird per
Namenskonvention ermittelt. In der ``suche()``-Aktion des
*RezepteControllers* wird die datei /app/views/rezepte/suche.ctp
benutzt.

Zwar ruft CakePHP die Funktion sowieso nach Ausführung einer Aktion auf
(solange ``$this->autoRender`` true ist), allerdings kann man mit dieser
Methode auch einen alternativen View rendern lassen (zum Beispiel könnte
eine Bildergalerie in einer einzigen Aktion sowohl die Vorschaubilder
als auch (wenn ein Bildname gegeben ist) das Bild selbst darstellen und
dafür unterschiedliche Views benutzen). Das geht am einfachsten indem
man als ersten Parameter einfach den Namen der Aktion gibt, für die der
View gerendert werden soll (womit dann wieder die Standard-View-Datei
der gegebenen Aktion gerendert wird). Die Aktion muss dabei im
Controller selbst nicht existieren. Man kann im dritten Parameter auch
direkt eine Datei angeben. In dem Fall ist darauf hinzuweisen, dass es
nützliche Globale Konstanten gibt (z.B. ``VIEWS``) die beim
spezifizieren der Datei hilfreich sind.

Mit dem zweiten Parameter kann man ein alternatives Layout bestimmen, in
dem der View gerendert werden soll (nicht vergessen: das Layout muss
dann irgendwo ``$content_for_layout`` ausgeben lassen, sonst wird der
View nicht angezeigt).

Flow Control
------------

redirect
~~~~~~~~

``redirect(string $url, integer $status, boolean $exit)``

Die flow control-Methode, die am häufigsten benutzt wird, ist
``redirect()``. Ihren ersten Parameter erhält die Methode in Form einer
URL relativ zu CakePHP. Wenn ein Nutzer eine Bestellung erfolgreich
aufgegeben hat, soll meistens an eine Bestätigungsseite umgeleitet
werden.

::

    function placeOrder() {

        //Logic for finalizing order goes here

        if($success) {
            $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
        } else {
            $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
        }
    }

Man kann auch relative oder absolute URL als $url-Argument angeben:

::

    $this->redirect('/orders/thanks'));
    $this->redirect('http://www.example.com');

Man kann ebenfalls Daten an die action übermitteln:

::

    $this->redirect(array('action' => 'edit', $id));

Der zweite Parameter der ``redirect()``-Methode erlaubt die Definition
eines HTTP-Status Code, der mit dem redirect übermittelt wird. Je nach
Grund des redirect könnte man zum Beispiel 301 (permanent verschoben)
oder 303 (siehe weitere) angeben.

Die Methode gibt nach der Weiterleitung einen ``exit()``-Code aus, falls
der dritte Paramater nicht auf ``false`` gesetzt wurde.

Zur Weiterleitung auf die Referer-Seite kann man folgendes benutzen:

::

    $this->redirect($this->referer());

flash
~~~~~

``flash(string $message, string $url, integer $pause)``

Genauso wie die ``redirect()``-Methode, wird die ``flash()``-Methode
verwendet, um Nutzer nach einer Operation auf eine neue Seite zu
umzuleiten. Die ``flash()``-Methode unterscheidet sich in der Hinsicht,
dass bereits vor der Weiterleitung auf die andere URL eine Meldung
angezeigt wird.

Der erste Parameter sollte die Meldung sein, die ausgegeben wird und der
zweite Parameter die URL relativ zu CakePHP. CakePHP zeigt ``$message``
für die Dauer von ``$pause`` Sekunden, bevor der Nutzer weitergeleitet
wird.

Für *in-page flash*-Meldungen, schaue Dir auch die SessionComponent’s
setFlash()-Methode an.

Callbacks
---------

CakePHP controllers come fitted with callbacks you can use to insert
logic just before or after controller actions are rendered.

``beforeFilter()``

This function is executed before every action in the controller. It's a
handy place to check for an active session or inspect user permissions.

``beforeRender()``

Called after controller action logic, but before the view is rendered.
This callback is not used often, but may be needed if you are calling
render() manually before the end of a given action.

``afterFilter()``

Called after every controller action, and after rendering is complete.
This is the last controller method to run.

CakePHP also supports callbacks related to scaffolding.

``_beforeScaffold($method)``

$method name of method called example index, edit, etc.

``_afterScaffoldSave($method)``

$method name of method called either edit or update.

``_afterScaffoldSaveError($method)``

$method name of method called either edit or update.

``_scaffoldError($method)``

$method name of method called example index, edit, etc.

Other Useful Methods
--------------------

constructClasses
~~~~~~~~~~~~~~~~

This method loads the models required by the controller. This loading
process is done by CakePHP normally, but this method is handy to have
when accessing controllers from a different perspective. If you need
CakePHP in a command-line script or some other outside use,
constructClasses() may come in handy.

referer
~~~~~~~

Liefert die Verweis-URL für die aktuelle Anfrage.

disableCache
~~~~~~~~~~~~

Wird verwendet, um dem **Browser** des Nutzers mitzuteilen, dass des
Ergebnis des aktuellen *Requests* nicht gecached werden soll. Dies ist
ein Unterschied zum *view caching*, das in einem späteren Kapitel
behandelt wird.

Folgende Header werden zu diesem Zweck gesendet:

``Expires: Mon, 26 Jul 1997 05:00:00 GMT``

``Last-Modified: [current datetime] GMT``

``Cache-Control: no-store, no-cache, must-revalidate``

``Cache-Control: post-check=0, pre-check=0``

``Pragma: no-cache``

postConditions
~~~~~~~~~~~~~~

``postConditions(array $data, mixed $op, string $bool, boolean $exclusive)``

Use this method to turn a set of POSTed model data (from
HtmlHelper-compatible inputs) into a set of find conditions for a model.
This function offers a quick shortcut on building search logic. For
example, an administrative user may want to be able to search orders in
order to know which items need to be shipped. You can use CakePHP’s
Form- and HtmlHelpers to create a quick form based on the Order model.
Then a controller action can use the data posted from that form to craft
find conditions:

::

    function index() {
        $conditions=$this->postConditions($this->data);
        $orders = $this->Order->find("all",compact('conditions'));
        $this->set('orders', $orders);
    }

If $this->data[‘Order’][‘destination’] equals “Old Towne Bakery”,
postConditions converts that condition to an array compatible for use in
a Model->find() method. In this case, array(“Order.destination” => “Old
Towne Bakery”).

If you want use a different SQL operator between terms, supply them
using the second parameter.

::

    /*
    Contents of $this->data
    array(
        'Order' => array(
            'num_items' => '4',
            'referrer' => 'Ye Olde'
        )
    )
    */

    //Let’s get orders that have at least 4 items and contain ‘Ye Olde’
    $condtions=$this->postConditions(
        $this->data,
        array(
            'num_items' => '>=', 
            'referrer' => 'LIKE'
        )
    );
    $orders = $this->Order->find("all",compact('conditions'));

The third parameter allows you to tell CakePHP what SQL boolean operator
to use between the find conditions. String like ‘AND’, ‘OR’ and ‘XOR’
are all valid values.

Finally, if the last parameter is set to true, and the $op parameter is
an array, fields not included in $op will not be included in the
returned conditions.

paginate
~~~~~~~~

This method is used for paginating results fetched by your models. You
can specify page sizes, model find conditions and more. See the
`pagination </de/view/164/pagination>`_ section for more details on how
to use paginate.

requestAction
~~~~~~~~~~~~~

``requestAction(string $url, array $options)``

This function calls a controller's action from any location and returns
data from the action. The ``$url`` passed is a CakePHP-relative URL
(/controllername/actionname/params). To pass extra data to the receiving
controller action add to the $options array.

You can use ``requestAction()`` to retrieve a fully rendered view by
passing 'return' in the options:
``requestAction($url, array('return'));``

If used without caching ``requestAction`` can lead to poor performance.
It is rarely appropriate to use in a controller or model.

``requestAction`` is best used in conjunction with (cached) elements –
as a way to fetch data for an element before rendering. Let's use the
example of putting a "latest comments" element in the layout. First we
need to create a controller function that will return the data.

::

    // controllers/comments_controller.php
    class CommentsController extends AppController {
        function latest() {
            return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
        }
    }

If we now create a simple element to call that function:

::

    // views/elements/latest_comments.ctp

    $comments = $this->requestAction('/comments/latest');
    foreach($comments as $comment) {
        echo $comment['Comment']['title'];
    }

We can then place that element anywhere at all to get the output using:

::

    echo $this->element('latest_comments');

Written in this way, whenever the element is rendered, a request will be
made to the controller to get the data, the data will be processed, and
returned. However in accordance with the warning above it's best to make
use of element caching to prevent needless processing. By modifying the
call to element to look like this:

::

    echo $this->element('latest_comments', array('cache'=>'+1 hour'));

The ``requestAction`` call will not be made while the cached element
view file exists and is valid.

In addition, requestAction now takes array based cake style urls:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('return'));

This allows the requestAction call to bypass the usage of Router::url
which can increase performance. The url based arrays are the same as the
ones that HtmlHelper::link uses with one difference - if you are using
named or passed parameters, you must put them in a second array and wrap
them with the correct key. This is because requestAction only merges the
named args array into the Controller::params member array and does not
place the named args in the key 'named'.

::

    echo $this->requestAction('/articles/featured/limit:3');
    echo $this->requestAction('/articles/view/5');

As an array in the requestAction would then be:

::

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'featured'), array('named' => array('limit' => 3)));

    echo $this->requestAction(array('controller' => 'articles', 'action' => 'view'), array('pass' => array(5)));

Unlike other places where array urls are analogous to string urls,
requestAction treats them differently.

When using an array url in conjunction with requestAction() you must
specify **all** parameters that you will need in the requested action.
This includes parameters like ``$this->data`` and
``$this->params['form']``. In addition to passing all required
parameters, named and pass parameters must be done in the second array
as seen above.

loadModel
~~~~~~~~~

``loadModel(string $modelClass, mixed $id)``

Die ``loadModel``-Funktion ist dann sehr praktisch, wenn man ein Model
benötigt, welches nicht Standard-Model des Controllers oder ein
assoziiertes Model ist.

::

    $this->loadModel('Article');
    $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

::

    $this->loadModel('User', 2);
    $user = $this->User->read();

