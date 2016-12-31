El Componente Security
######################

El componente Security provee una forma fácil de aumentar la seguridad
en tu aplicación. Con el componente Security se puede crear una intefaz
para manejar autenticaciones HTTP. Se configura en el método
beforeFilter() de tus controladores, y tiene distintos parámetros para
ajustar. Todas esas propiedades pueden configurarse directamente con los
métodos creados para tal fin, y que se llaman de la misma manera.

Configuración
=============

$blackHoleCallback
    Un callback del controlador que se encargará de manejar las
    peticiones que hayan sido enviadas al "agujero negro".
$requirePost
    Una lista de acciones del controlador que requieren una petición
    POST para ejecutarse. Un arreglo de acciones del controlador o '\*'
    para forzar que todas las acciones requieran POST.
$requireSecure
    Lista de acciones que requieren una conexión SSL para ejecutarse. Un
    arreglo de acciones del controlador o '\*' para forzar que todas las
    acciones requieran una conexión SSL.
$requireAuth
    Una lista de acciones que requieren una clave de autenticación
    válida. Esta clave es configurada por el componente Security.
$requireLogin
    Una lista de acciones que requieren autenticación HTTP (basic o
    diges). También acepta '\*' indicando que todas las acciones del
    controlador requieren autenticación HTTP.
$loginOptions
    Opciones para la autenticación HTTP. Permite definir que tipo de
    autenticación utilizar, y los callbacks del controlador para el
    proceso de autenticación.
$loginUsers
    Un arreglo asociativo de usuarios => passords que sonusados para
    autenticaciones HTTP. Si estás utilizando autenticacion digest, los
    passwords deben ser encryptados con el algoritmo MD5.
$allowedControllers
    Una lista de controladores desde los cuales la acción del
    controlador actual puede recibir peticiones. También puede
    utilizarse para peticiones entre controladores.
$allowedActions
    Una lista de acciones desde las cuales las acciones del controlador
    actual pueden para recibir peticiones. También puede utilizarse para
    peticiones entre controladores.
$disabledFields
    Campos del formulario que se necesitan deshabilitar para una
    petición dada.

Métodos
=======

requirePost()
-------------

Define las acciones que requieren una petición POST. Acepta cualquier
número de argumentos. Puede ser llamado sin argumentos para forzar a que
todas las acciones requieran una petición POST.

requireSecure()
---------------

Define las acciones que requieren una conexión SSL presente. Acepta
cualquier cantidad de argumentos. Puede ser llamado sin argumentos para
forzar que todas las acciones requieran una conexión SSL.

requireAuth()
-------------

Define las acciones que requieren un token válido generado por el
componente Security. Acepta cualquier número de argumentos. Puede ser
llamado sin argumentos para forzar que todas las acciones requieran una
autenticación válida.

requireLogin()
--------------

Define las acciones que requieren una autenticación HTTP válida. Acepta
cualquier número de argumentos. Puede ser llamada sin argumentos para
forzar que todas las acciones requieran una autenticación HTTP válida.

loginCredentials(string $type)
------------------------------

Trata de validar las credenciales para una petición de autenticación
HTTP. $type es el tipo de autenticación que se desea verificar. Puede
ser 'basic', o 'digest'. Si se deja como null o vació, tratará de
verificar las dos. Devuelve un arreglo con el nombre de usuario y el
password si tuvo éxtito.

loginRequest(array $options)
----------------------------

Generates the text for an HTTP-Authenticate request header from an array
of $options.

$options generally contains a 'type', 'realm' . Type indicate which
HTTP-Authenticate method to use. Realm defaults to the current HTTP
server environment.

parseDigestAuthData(string $digest)
-----------------------------------

Parse an HTTP digest authentication request. Returns and array of digest
data as an associative array if succesful, and null on failure.

generateDigestResponseHash(array $data)
---------------------------------------

Creates a hash that to be compared with an HTTP digest-authenticated
response. $data should be an array created by
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
--------------------------------------------

Black-hole an invalid request with a 404 error or a custom callback.
With no callback, the request will be exited. If a controller callback
is set to SecurityComponent::blackHoleCallback, it will be called and
passed any error information.

Uso
===

EL uso del componente security generalmente se hace en el método
beforeFilter() del controlador. Usted especifica las restricciones de
seguridad que desee y el componente Security las hara cumplir en el
arranque.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

En este ejemplo la accion delete solo puede ser lanzada
satisfactoriamente si se recive una solicitud POST.

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

Este ejemplo forzaría todas las acciones que tengan enrrutamiento admin
a requerir peticiones seguras del SSL.

Basic HTTP Authentication
=========================

The SecurityComponent has some very powerful authentication features.
Sometimes you may need to protect some functionality inside your
application using `HTTP Basic
Authentication <https://en.wikipedia.org/wiki/Basic_access_authentication>`_.
One common usage for HTTP Auth is protecting a REST or SOAP API.

This type of authentication is called basic for a reason. Unless you're
transferring information over SSL, credentials will be transferred in
plain text.

Using the SecurityComponent for HTTP authentication is easy. The code
example below includes the SecurityComponent and adds a few lines of
code inside the controller's beforeFilter method.

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');

        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MyRealm'
            );
            $this->Security->loginUsers = array(
                'john'=>'johnspassword',
                'jane'=>'janespassword'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            //protected application logic goes here...
        }
    }

The loginOptions property of the SecurityComponent is an associative
array specifying how logins should be handled. You only need to specify
the **type** as **basic** to get going. Specify the **realm** if you
want display a nice message to anyone trying to login or if you have
several authenticated sections (= realms) of your application you want
to keep separate.

The loginUsers property of the SecurityComponent is an associative array
containing users and passwords that should have access to this realm.
The examples here use hard-coded user information, but you'll probably
want to use a model to make your authentication credentials more
manageable.

Finally, requireLogin() tells SecurityComponent that this Controller
requires login. As with requirePost(), above, providing method names
will protect those methods while keeping others open.
