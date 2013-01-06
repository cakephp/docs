Sesiones
########

El componente Session de CakePHP provee una forma de persistir datos
entre las peticiones de las páginas. Actúa como una abstracción para
acceder a las variables $\_SESSION, y a su vez, agrega distintos métodos
útiles relacionados con este arreglo.

Las sesiones pueden persistirse de diferentes maneras. Por defecto se
utilizan los métodos provistos por PHP; sin embargo, existen otras
opciones:

cake
    Guarda los archivos de la sesión en el directorio temporal de tu
    aplicación tmp/sessions.
database
    Guarda la información dentro de la base de datos.
php
    La opción por defecto. Guarda la información como se indica en
    php.ini

Para cambiar el método por defecto de gestión de sesiones, debes
modificar el parámetro de configuración Session.save para reflejar la
opción deseada. Si eliges 'database', también deberías descomentar el
parámetro Session.database y ejecutar el archivo SQL perteneciente a la
sesión localizado en app/config

*En views/elements la sesión puede ser accedida por medio del helper
Session*

Métodos
=======

El componente Session es usado para interactuar con la información de la
sesión. Incluye operaciones básicas de ABM (Alta, Baja y Modificación)
como también opciones para comunicarse con los usuarios.

Debe notarse que se pueden crear estructuras de arreglos en las sesiones
utilizando la notación de 'punto'. De esta forma, Usuario.email
equivaldrá a:

::

        array('Usuario' => 
                array('email' => 'clarkKent@dailyplanet.com')
        );

Los puntos son usados para indicar arreglos anidados.

write
-----

``write($name, $value)``

Guarda en la sesión una variable llamada $name con el valor $value.
$name puede utilizar la notación de 'punto'. Por ejemplo:

::

    $this->Session->write('Persona.colorOjos', 'Verde');

Escribe el valor 'Verde' en la sesión, dentro de Persona => colorOjos.

setFlash
--------

``setFlash($message, $layout = 'default', $params = array(), $key = 'flash')``

Se utiliza para guardar una variable de sesión que puede ser mostrada en
la vista. $layout permite controlar qué layout (ubicado en
``/app/views/layouts``) se utilizará para mostrar el mensaje. Si la
variable ``$layout`` queda configurada con su valor por defecto,
'default', el mensaje se mostrará como se ve a continuación:

::

    <div id="flashMessage" class="message"> [message] </div>

**$params** permite pasar variables adicionales para mostrar en el
layout. **$key** es utilizado para modificar el índice del arreglo
$message en el arreglo de mensajes (por defecto es 'flash').
**$message** es el texto que se quiere cargar en la sesión.

Los parámetros puede afectar el div que se muestre, por ejemplo pasando
un parámetro 'class' en el arreglo $params, se modificará el ``div``
resultante de utilizar el método ``$session->flash()`` en la vista.

::

    setFlash('Mensaje de ejemplo', 'default', array('class' => 'clase_ejemplo'))

La salida de ``$session->flash()`` del ejemplo anterior será:

::

    <div id="flashMessage" class="clase_ejemplo">Mensaje de ejemplo</div>

read
----

``read($name)``

Devuelve el contenido de la variable $name dentro de la sesión. Si $name
es null, se devolverá todo el contenido de la sesión. Ej.

::

    $verde = $this->Session->read('Persona.colorOjos');

Recupera el valor 'Verde' de la sesión.

check
-----

``check($name)``

Se utiliza para verificar si una variable ha sido seteada en la sesión.
Devuelve true en caso afirmativo, y false si la variable nunca fue
seteada.

delete
------

``delete($name) /*o*/ del($name)``

Borra los datos de la variable $name dentro de la sesión. Ej.

::

    $this->Session->del('Persona.colorOjos');

Nuestra información de sesión ya no tiene el valor 'Verde', ni siquiera
la clave 'colorOjos'. Sin embardo, Persona todavía existe en la sesión.
Para eliminar la variable completa de la sesión se debe usar:

::

    $this->Session->del('Persona');

destroy
-------

El método ``destroy`` eliminará la cookie de sesión y todos los datos
almacenados en los archivos temporales del sistema. Destruirá la sesión
de PHP y creará una sesión nueva.

::

    $this->Session->destroy()

error
-----

``error()``

Se utiliza para determinar el último error en una sesión.
