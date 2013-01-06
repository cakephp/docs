REST
####

Viele Programmierer erkennen heute den Nutzen, die Kernfunktionalitäten
ihrer Applikation einer breiteren Zielgruppe zu öffen. Ein einfacher,
uneingeschränkter Zugang zu deiner API trägt zur Akzeptanz deiner
Platform bei, ermöglicht Mashups und eine einfache Integration in andere
System.

Obwohl es auch andere Lösungen gibt, ist REST ein sehr gute Methode, den
Zugriff auf die Programmlogik deiner Applikation zu ermöglichen. Es ist
einfach, basiert überlicherweise auf XML (wir reden hier von schlichtem
XML, nicht von einem SOAP envelope) und wird durch die HTTP headers
gesteuert. Eine API mit REST in CakePHP nach außen zu öffnen, ist
einfach.

Einfaches Setup
===============

Der schnellste Weg REST einzusetzen sind ein paar Zeilen in deiner
routes.php Datei in app/config. Das Router Objekt hat eine Methode
namens mapResources(), mit der einige Standard-Routen für den
REST-Zugriff auf den Controller konfiguriert werden können. Wenn wir
etwa den Zugriff per REST auf eine Rezept-Datenbank erlauben wollen,
machen wir das etwa wie folgt:

::

    //In app/config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

Die erste Zeile konfiguriert einige Standard-Routen für einfachen
REST-Zugriff. Diese Routen hängen von der HTTP-Request-Methode ab.

+----------------+----------------+----------------------------------+
| HTTP Methode   | URL            | Controller action                |
+================+================+==================================+
| GET            | /recipes       | RecipesController::index()       |
+----------------+----------------+----------------------------------+
| GET            | /recipes/123   | RecipesController::view(123)     |
+----------------+----------------+----------------------------------+
| POST           | /recipes       | RecipesController::add()         |
+----------------+----------------+----------------------------------+
| POST           | /recipes/123   | RecipesController::edit(123)     |
+----------------+----------------+----------------------------------+
| PUT            | /recipes/123   | RecipesController::edit(123)     |
+----------------+----------------+----------------------------------+
| DELETE         | /recipes/123   | RecipesController::delete(123)   |
+----------------+----------------+----------------------------------+

Die CakePHP Router Klasse benutzt mehrere verschiedenen Indizien, um die
HTTP-Methode zu erkennen. Hier folgen sie in der eingesetzten
Reihenfolge:

#. Die *\_method* POST-Variable
#. Die X\_HTTP\_METHOD\_OVERRIDE
#. Der REQUEST\_METHOD Header

Die *\_method* POST-Variable ist hilfreich, um einen Browser als
REST-Client zu benutzen (oder irgendeine andere Software, mit der man
einfach POST-Anfragen durchführen kann). Setze dafür einfach den Wert
von \_method mit dem Namen der HTTP-Request-Methode, die du emulieren
willst.

Wurde der Router einmal so konfiguriert, dass er REST-Anfragen
bestimmten Controller-Actions zuordnet, können wir zur Logik in unserem
Controller übergehen. Ein Basis-Controller könnte etwa so aussehen:

::

    // controllers/recipes_controller.php

    class RecipesController extends AppController {

        var $components = array('RequestHandler');

        function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(compact('recipes'));
        }

        function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(compact('recipe'));
        }

        function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }

        function delete($id) {
            if($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Indem wir den Aufruf Router::parseExtensions() hinzugefügt haben, ist
der CakePHP-Router fertig gerüstet, um verschiedene Views abhängig von
der Art der Anfrage auszuliefern. Wenn wir mit REST-Anfragen arbeiten,
ist der View type XML. Die REST-Views für unseren RecipesController
legen wir in app/views/xml an. Wir können außerdem den XmlHelper für
einfache und schnelle XML-Ausgaben in diesen Views benutzen. So könnte
unser index view aussehen:

::

    // app/views/recipes/xml/index.ctp

    <recipes>
        <?php echo $xml->serialize($recipes); ?>
    </recipes>

Erfahrene Benutzer von CakePHP werden bemerkt haben, dass wir den
XmlHelper nicht in unserem $helpers Array im RecipesController eingefügt
haben. Das ist so beabsichtigt - wenn über parseExtensions() bestimmte
Inhalte angefragt werden, sucht CakePHP automatisch einen passenden
Helper aus. Weil wir XML-Content benutzen, wird der XmlHelper
automatisch für diese Views geladen.

Das fertige XML würde dann ungefähr so aussehen:

::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="This is a comment for this post."></comment>
        </post>   
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this post."></comment>
        </post>
    </posts>

Die Logik für die edit-Action zu erstellen ist schon etwas kniffliger,
aber nicht sehr viel. Weil wir eine API benutzen, die XML ausgibt,
müssen wir logischerweise auch XML für die Eingaben benutzen. Aber kein
Grund zur Sorge: Der RequestHandler und die Router-Klasse machen das
ganz einfach. Wenn eine POST oder PUT-Anfrage bei einem XML-Typ erkannt
wird, werden die Eingabewerte automatisch an ein Cake-XML-Objekt
übergeben, das über das $data-Attribut des Controllers erreichbar ist.
Dadurch gehen XML- und POST-Anfragen nahtlos ineinander über: Weder am
Controller, noch am Model müssen irgendwelche Änderungen vorgenommen
werden. Alles, was man braucht, findet man in $this->data.

Custom REST Routing
===================

If the default routes created by mapResources() don't work for you, use
the Router::connect() method to define a custom set of REST routes. The
connect() method allows you to define a number of different options for
a given URL. The first parameter is the URL itself, and the second
parameter allows you to supply those options. The third parameter allows
you to specify regex patterns to help CakePHP identify certain markers
in the specified URL.

We'll provide a simple example here, and allow you to tailor this route
for your other RESTful purposes. Here's what our edit REST route would
look like, without using mapResources():

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    )

Advanced routing techniques are covered elsewhere, so we'll focus on the
most important point for our purposes here: the [method] key of the
options array in the second parameter. Once that key has been set, the
specified route works only for that HTTP request method (which could
also be GET, DELETE, etc.)
