Cookies
#######

El componente Cookie es una abstracción para acceder al método nativo de
PHP setcookie(). También incluye una serie de funcionalidades muy útiles
para agilizar la escritura de cookies. Antes de tratar de utilizar el
componente Cookie, debe asegurarse que se encuentra habilitado en el
arreglo $components: si está habilitado uno de los elementos del arreglo
debe ser 'Cookie'

Configuración del Controlador
=============================

Hay una serie de variables que se configuran en el controlador, y te
permiten modificar la forma en que las cookies son creadas y
gestionadas. Estas variables especiales generalmente se setean en el
método beforeFilter() de tu controlador.

Variable Cookie

por defecto

descripción

string $name

'CakeCookie'

El nombre de la cookie.

string $key

null

Esta cadena es utilizada para encriptar el valor escrito en la cookie.
La cadena debería ser aleatoria y difícil de adivinar.

string $domain

''

El nombre de dominio habilitado para acceder a la cookie, ej. Use
'.tudominio.com' para permitir acceso desde todos los subdominios.

int o string $time

'5 Days'

El tiempo en que expirará la cookie. Los enteros son interpretados como
segundos, y un valor 0 es equivalente a 'cookie de sesión', es decir, la
cookie expira cuando se cierra el navegador. Si el valor es una cadena,
será interpretada con la función de PHP strtotime(). Puedes configurar
esto directamente dentro del método de escritura write().

string $path

'/'

La ruta del servidor donde la cookie será aplicada. Si $cookiePath está
seteada a '/foo/', la cookie estará disponible sólo dentro del
directorio /foo/ y todos los subdirectorios (como por ejemplo /foo/bar/)
de tu dominio. La opción por defecto es en todo el dominio. Puedes
configurar esto directamente dentro del método de escritura write().

boolean $secure

false

Indica que la cookie deberá ser transmitida únicamente por una conexión
segura HTTPS. Cuando este valor sea true, la cookie será creada sólo si
existe una conexión segura. Puedes configurar esto directamente dentro
del método de escritura write()

El siguiente recorte del código de un controlador muestra cómo incluir
el componente Cookie y cómo configurar las variables necesarias para
enviar una cookie llamada 'baker\_id' para el dominio 'example.com' que
a su vez necesita una conexión segura, debe estar disponible para la
ruta ‘/bakers/preferencias/’, y expira en una hora.

::

    var $components    = array('Cookie');
    function beforeFilter() {
      $this->Cookie->name = 'baker_id';
      $this->Cookie->time =  3600;  // o '1 hour'
      $this->Cookie->path = '/bakers/preferencias/'; 
      $this->Cookie->domain = 'example.com';   
      $this->Cookie->secure = true;  //enviar sólo por una conexión segura HTTPS
      $this->Cookie->key = 'qSI232qs*&sXOw!';
    }

A continuación, veremos cómo utilizar los diferentes métodos del
componente Cookie.

Utilizando el Componente
========================

Esta sección resume los métodos del componente Cookie.

**write(mixed $key, mixed $value, boolean $encrypt, mixed $expires)**

El método write() es el corazón del componente, $key es la variable que
se quiere guardar en la cookie y $value es el dato para almacenar.

::

    $this->Cookie->write('nombre','Pepito');

También puedes agrupar variables utilizando la notación de 'punto' en el
parámetro $key.

::

    $this->Cookie->write('Usuario.nombre', 'Pepito');
    $this->Cookie->write('Usuario.rol','Lider');

Si deseas escribir más de un valor a la vez en la cookie, puedes pasar
un arreglo:

::

    $this->Cookie->write(
        array('nombre'=>'Pepito','rol'=>'Lider')
    );
        

Todos los valores de las cookis son encriptados por defecto. Si desea
almacenar valores en texto puro, cambie el tecer parámetro del método
write() a false.

::

    $this->Cookie->write('nombre','Pepito',false);

El último parámetro del método es $expires: el número de segundos antes
de que la cookie expire. Por convenienia, este parámetro puede ser
pasado como una cadena que entienda la función strtotime() de PHP:

::

    //Ambas cookies expiran en una hora.
    $this->Cookie->write('nombre','Pepito',false, 3600);
    $this->Cookie->write('Apellido','Gonzales',false, '1 hour');

**read(mixed $key)**

Este método es utilizado para leer el valor de una variable almaenada en
una cookie. La variable a leer debe ser especificada en el parámetro
$key.

::

    //Muestra “Pepito”
    echo $this->Cookie->read('name');

    //También se puede utilizar la notación de 'punto' para leer
    echo $this->Cookie->read('Usuario.nombre');

    //Para obtener las variables que has agrupado utilizando
    //la notación de 'punto' como un arreglo debes usar
    $this->Cookie->read('Usuario');

    //esto devuelve un arreglo similar a array('nombre' => 'Pepito', 'rol'=>'Lider')

**del(mixed $key)**

Borra el contenido de la variable $key almacenada en una cookie. También
funciona con la notación de 'punto'.

::

    //Borrar una variable
    $this->Cookie->del('bar')
      
    //Borrar la variable bar, pero no todas las contenidas en foo
    $this->Cookie->del('foo.bar')

**destroy()**

Destruye la cookie actual.
