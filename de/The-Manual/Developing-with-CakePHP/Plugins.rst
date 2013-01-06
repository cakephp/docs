Plugins
#######

CakePHP erlaubt Dir, eine **Kombination** aus mehreren Controllern,
Models und Views zu bilden und diese als ein Plugin zu packen. Dieses
Plugin können dann andere Benutzer, auf einfache Weise in Ihre CakePHP
Anwendung integrieren.

Das Zwischenstück von einem Plugin und einer Anwendung in welcher es
installiert wurde, ist die Anwendungskonfiguration
(*Datenbankverbindung, etc.*). Im Übrigen arbeitet das Plugin in seinem
eigenen Bereich, als ob es eine eigene Anwendung wäre.

Creating a Plugin
=================

Als funktionierendes Beispiel, erstellen wir ein Plugin welches für Dich
Pizza bestellt. Zum starten, benötigen wir einen Platz für unsere
Plugin-Dateien innerhalb des /app/plugins Ordners. Der Name des
Elternordners für alle Dateien des Plugins, ist sehr wichtig und wird in
vielen Bereichen genutzt. Wähle also eine sinnvolle Bezeichnung. Für
unser Plugin nutzen wir den Namen "Pizza".

Ordner- und Dateistruktur des Plugins
-------------------------------------

::

    /app
        /plugins
            /pizza
                /controllers                <- Plugin  Controllers
                /models                     <- Plugin  Models
                /views                      <- Plugin  Views
                /pizza_app_controller.php   <- Plugins AppController
                /pizza_app_model.php        <- Plugins AppModel

Falls Du das Plugin über eine URL aufrufen möchtest, muss innerhalb des
Plugins ein AppController und ein AppModel definiert sein. Diese zwei
speziellen Klassen, werden nach dem Plugin benannt und erweitern den
AppController und das AppModel der Eltern-Anwendung.

Klassen für unser Pizza-Beispiel
--------------------------------

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

Falls Du vergessen hast, diese zwei speziellen Klassen zu definieren,
wird CakePHP die Fehlermeldung "**Missing Controller**\ " ausgeben, bis
Du sie angelegt hast.

Plugin Controllers
==================

Wie Du nun wissen solltest, werden Controller für unser Pizza Plugin
unter /app/plugins/pizza/controllers/ abgespeichert.

Nachdem die Hauptaufgabe des Plugins darin besteht, Pizza Bestellungen
entgegen zu nehmen, benötigen wir einen ``OrdersController``.

Um Namenskonflikte mit bereits vorhandenen Controllern der
Eltern-Anwendung zu vermeiden, wird empfohlen einen verhältnismäßig
einzigartigen Namen zu verwenden. Es ist gut möglich das die
Eltern-Anwendung, vielleicht bereits einen ``UsersController``,
``OrdersController``, oder ``ProductsController`` enthält. Also sollten
wir bei der Namensfindung ein bisschen kreativ sein oder wir setzen
einfach den Plugin-Namen als Präfix vor den eigentlichen
Controller-Namen. In unserem Fall wäre das ``PizzaOrdersController``.

Also speichern wir unseren neuen ``PizzaOrdersController`` im Ordner
/app/plugins/pizza/controllers/ ab und das ganze sieht dann so aus:

::

    // /app/plugins/pizza/controllers/pizza_orders_controller.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }

Achte dararuf wie der ``PizzaOrdersController`` den **AppController des
Plugins** (``PizzaAppController``) erweitert. Wir erweitern also nicht
direkt den ``AppController`` von CakePHP sondern gehen den Weg, über den
von uns erstellten ``PizzaAppController``.

Achte auch dararuf wie der Name des Models mit einem Präfix, nämlich mit
dem Namen des Plugins, versehen wird. Diese Linie mit Code wurde nur aus
Klarheitsgründen aufgezeigt und ist für unser Beispiel nicht notwendig.

Wenn Du auf das, was wir bisher umgestezt haben, zugreifen möchtest,
besuche /pizza/pizzaOrders und Du solltest eine “Missing Model”
Fehlermeldung erhalten, da wir noch kein PizzaOrder Model definiert
haben.

Plugin Models
=============

Models für das Plugin werden unter /app/plugins/pizza/models abgelegt.
Wir haben bereits einen ``PizzaOrdersController`` für das Plugin
definiert, also wollen wir nun das Model für diesen Controller
erstellen. Der Name des Models lautet ``PizzaOrder`` und **erweitert
unser PizzaAppModel**. (Der Klassen-Name ``PizzaOrder`` ist konsistent
mit der Namensgebung und einzigartig genug, so dass wir den Namen so
belassen können).

::

    // /app/plugins/pizza/models/pizza_order.php:
    <?php
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>

Nachdem Du eine Tabelle ``‘pizza_orders’`` in Deiner Datenbank erstellt
hast, kannst Du /pizza/pizzaOrders im Browser aufrufen und Du solltest
eine Fehlermeldung "Missing View" erhalten. Also lass uns im nächsten
Schritt einen View erstellen.

Falls Du eine **Referenz** zu einem Model innerhalb Deines Plugins
benötigst, musst Du den Namen des Plugins mit dem Namen des Models,
getrennt durch einen Punkt, einbinden.

**Beispiel einer Referenz**:

::

    // /app/plugins/pizza/models/pizza_order.php:
    <?php
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>

Plugin Views
============

Views verhalten sich exakt genau so, wie sie es auch in einer normalen
Anwendung machen. Sie müssen nur im richtigen Ordner abgelegt werden:
Und zwar innerhalb des /app/plugins/pizza/views/ Ordners.

Bei unserem Pizza Plugin brauchen wir einen View für unsere
``PizzaOrdersController::index()`` Action. Diese wird so erstellt:

::

    // /app/plugins/pizza/views/pizza_orders/index.ctp:
    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

Für weitere Informationen zur Benutzung von Elementes eines Plugings
siehe `Elemente eines Plugins
abfragen </de/view/97/Elements#Requesting-Elements-from-a-Plugin-562>`_

Components, Helpers and Behaviors
=================================

Ein Plugin kann, genau wie auch eine reguläre CakePHP Anwendung,
Components, Helpers und Behaviors beinhalten.

Du kannst ebenso ein Plugin entwickeln welches ausschließlich aus
Components, Helpers und Behaviors besteht. Dies ist sehr praktisch,
falls man mehrfach verwendbare Bestandteile, in verschiedenen Projekten
einsetzen möchte.

Diese Komponenten zu erstellen, ist nichts anderes als das entwickeln
einer regulären CakePHP Anwendung, ohne spezielle Namenskonventionen.

Referring to your components from within the plugin also does not
require any special reference.

::

    // Component
    class ExampleComponent extends Object {

    }

    // within your Plugin controllers:
    var $components = array('Example');

To reference the Component from outside the plugin requires the plugin
name to be referenced.

::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // references ExampleComponent in Pizza plugin.

Die selbe Technik wird auch für Helpers und Behviors angewendet.

Plugin Images, CSS and Javascript
=================================

You can include plugin specific Images, Javascript and CSS files in your
plugins. These asset files should be placed in
``your_plugin/webroot/img``, ``your_plugin/webroot/css`` and
``your_plugin/webroot/js`` respectively. They can be linked into your
views with the core helpers as well.

::

    <?php echo $html->image('/your_plugin/img/my_image.png'); ?>

    <?php echo $html->css('/your_plugin/css/my_css'); ?>

    <?php echo $javascript->link('/your_plugin/js/do_cool_stuff'); ?>

The above are examples of how to link to images, javascript and CSS
files for your plugin.

It is important to note the **/your\_plugin/** prefix before the img, js
or css path. That makes the magic happen!

The method above is valid when mod\_rewrite is used.

Plugin Tipps
============

So, nun haben wir alles fertiggestellt. Das Plugin ist bereit zur
Veröffentlichung.

Wir empfehlen Dir, ein paar Extras, wie z.B. eine README Datei für
eventuelle Installationshinweise oder Anmerkungen zur Funktionsweise und
eine SQL Datei für den Datenbank-Import zur Verfügung zu stellen.

Wenn Du das Plugin unter /app/plugins installiert hast, kannst Du es
über folgende URL aufrufen: /[pluginname]/[controller]/[action]. In
unserem Pizza Plugin Beispiel, wäre das für unseren
``PizzaOrdersController`` also /pizza/pizzaOrders.

Einige Anmerkungen zum Schluss:
-------------------------------

-  Falls Du keinen ``Plugin[AppController]`` und ``Plugin[AppModel]``
   definiert hast, wirst Du eine "Missing Controller" Fehlermeldung
   erhalten, wenn Du versuchst den Plugin-Controller aufzurufen.
-  Du kannst einen **Standard-Controller** mit dem Namen Deines Plugins
   definieren. Wenn Du das nicht machst, kannst Du es auch über
   /[pluginname]/[action] erreichen. Zum Beispiel ein Plugin mit dem
   Namen "Users" und einem Controller mit den Namen ``UsersController``
   kann über /users/add aufgerufen werden, wenn Du kein Plugin mit dem
   Namen ``AddController`` bereits in Deinem /[plugin]/controllers
   Ordner definiert hast.
-  Du kannst Deine eigenen Layouts für Plugins, innerhalb
   /app/plugin/views/layouts ablegen. Andernfalls, wird das Plugin
   standardmäßig die Layouts aus dem /app/views/layouts Ordner nutzen.
-  Du kannst innerhalb des Plugins mit
   ``$this->requestAction('/plugin/controller/action');`` mit den
   Controllern kommunizieren.
-  Wenn Du eine ``requestAction`` nutzt, achte darauf, dass der
   Controller- und Model-Name eindeutig genug sind. Andernfalls, wirst
   Du einen "redefined class ..." Fehler erhalten.

