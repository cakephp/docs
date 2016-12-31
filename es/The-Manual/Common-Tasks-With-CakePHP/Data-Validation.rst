Validación de Datos
###################

La validación de los datos es una parte importante de cualquier
aplicación, ya que asegura que los datos en un modelo están conformes a
las reglas de negocio de la aplicación. Por ejemplo, tu podrias querer
que los passwords tengan a lo menos un largo de ocho caracteres, o
asegurar que los username sean únicos. Definir reglas de validación hace
que el manejo de los formularios sea muchísimo más fácil.

Hay muchos diferentes aspectos del proceso de validación. En esta
sección cubriremos el lado del modelo, es decir, lo que ocurre cuando tu
llamas al método save() de tu modelo. Para más información acerca de
cómo manejar el despliegue de errores de validación, revisa la sección
que cubre el FormHelper.

El primer paso en la validación de datos es la creación de las reglas de
validación en el Modelo. Para hacer eso, usa el arreglo Model::validate
en la definición del Modelo, por ejemplo:

::

    <?php
    class User extends AppModel {  
        var $name = 'User';
        var $validate = array();
    }
    ?>

En el ejemplo de arriba, el arreglo $validate se agrega al modelo User,
pero el arreglo no contiene reglas de validación. Asumiendo que la tabla
*users* tiene los campos *login*, *password*, *email* y *born*, el
ejemplo de abajo muestra algunas simples reglas de validación que se
aplican a esos campos:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }
    ?>

El ejemplo muestra cómo se pueden agregar reglas de validación a los
campos de un modelo. Para el campo *login* serán aceptadas sólo letras y
números, el *email* debe ser válido, y *born* debe ser una fecha válida.
La definición de reglas de validación habilitan en CakePHP el despliegue
automático de mensajes de error en formularos si los datos enviados no
cumplen las reglas de validación.

CakePHP incluye muchas reglas de validación y usarlas puede ser bastante
simple. Algunas de las reglas incluidas permiten verificar el formato de
los emails, URLs, y números de tarjeta de crédito - las cubriremos en
detalle más adelante.

Acá tenemos un ejemplo de validación más complejo que aprovecha algunas
de las reglas incluidas:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Sólo letras y números'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                    'message' => 'Entre 5 y 15 caracteres'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Largo mínimo de 8 caracteres'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Ingrese una fecha válida',
                'allowEmpty' => true
            )
        );
    }
    ?>

Dos reglas de validación son definidas para *login*: debería contener
sólo letras y números, y su largo debe ser de 5 a 15. El campo
*password* debe tener un largo mínimo de 8 caracteres. El *email* debe
contener una dirección de correo válida, y *born* debe ser una fecha
válida. Además, notar que puedes agregar mensajes de error propios que
CakePHP mostrará cuando estas reglas de validación no se cumplan.

Como lo muestra el ejemplo de arriba, un único campo puede tener
múltiples reglas de validación. Y si las reglas incluidas no coinciden
con lo que necesitas, puedes agregar tus propias reglas de validación
según tus requerimientos.

Ahora que viste a grandes rasgos cómo funciona la validación, veamos
cómo estas reglas son definidas en el modelo. Hay tres diferentes
maneras para definir reglas de validación: arreglos simples, una única
regla por campo, y múltiples reglas por campo.

Reglas Simples
==============

Tal como el nombre lo sugiere, esta es la manera más simple de definir
una regla de validación. La sintaxis para la definición de reglas usando
esta manera es:

::

    var $validate = array('fieldName' => 'ruleName');

Donde, 'fieldName' es el nombre del campo para el cual se está
definiendo una regla, y 'ruleName' es el nombre de una regla
pre-definida (cubriremos esto en la siguiente sección).

Una regla por campo
===================

Ésta técnica de definición permite un mejor control del funcionamiento
de las reglas de validación. Pero antes de su discusión, veamos el
patrón de uso general para agregar una regla a un solo campo:

::

    var $validate = array(
        'fieldName1' => array(
            'rule' => 'ruleName', // ó: array('ruleName', 'param1', 'param2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // ó: 'update'
            'message' => 'Su mensaje de error'
        )
    );

El índice 'rule' es requerido. Si sólo se setea 'required' => true la
validación del formulario no funcionará correctamente. Esto debido a que
'required' no es en realidad una regla.

Como puedes ver, cada campo (arriba se está mostrando sólo un campo) es
asociado con un arreglo que contiene cinco índice: ‘rule’, ‘required’,
‘allowEmpty’, ‘on’ y ‘message’. Veamos con más detalle cada uno de estos
índices.

rule
----

El índice ‘rule’ define el método de validación y acepta un sólo valor o
un arreglo. El valor para ‘rule’ especificado puede ser el nombre de un
método en tu modelo, un método de la clase core Validation, o una
expresión regular. Para un completo listado de todas las reglas
incorporadas ver la sección llamada "Reglas de Validación Incorporadas".

Si la regla no requiere parámetros, ‘rule’ puede ser un sólo valor, por
ejemplo:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

Si la regla requiere algunos parámetros (como max, min o range),
entonces ‘rule’ debería ser un arreglo:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

Recuerda, el índice ‘rule’ es requerido para la definición de reglas
basadas en arreglos.

required
--------

Este índice debería tener asignado un valor booleano. Si ‘required’ es
true, el campo debe estar presente en el arreglo de datos. Por ejemplo,
si la regla de validación ha sido definida de la siguiente manera:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

Los datos enviados al método save() del modelo deben contener un valor
para el campo *login*. Si no es así, la validación falla (la regla no se
cumple). El valor por defecto para este índice es un false booleano.

Si el índice login están presente pero no tiene un valor asignado, la
validación será exitosa. Setear ‘required’ a true sólo verifica que el
índice del campo este presente.

allowEmpty
----------

Al índice ``allowEmpty`` se le debería asignar un valor booleano. Si
``allowEmpty`` es false, los datos pasados al método ``save()`` del
modelo deben incluir el campo a un valor no-vacío para ese campo. Cuando
se deja en true, un campo vacío pasará exitosamente la validación de ese
campo.

El valor por defecto de ``allowEmpty`` es null. Esto significa que el
campo siempre procesará las reglas de validación incluyendo la ejecución
de funciones de validación propias.

on
--

El índice ‘on’ puede ser seteado con uno de los siguientes valores:
‘update’ o ‘create’. Esto provee un mecanismo que permite que cierta
regla sea aplicada ya sea durante la creación de un nuevo registro, o
durante la actualización de un registro.

Si la regla fue definida como ‘on’ => ‘create’, entonces la regla sólo
será verificada durante la creación de un nuevo registro. De igual
manera, si es definida como ‘on’ => ‘update’, la regla sólo será
verificada durante la actualización de un registro.

El valor por defecto de ‘on’ es null. Cuando ‘on’ es null, la regla será
verificada durante la creación y actualización de un registro.

message
-------

El índice ‘message’ permite definir un mensaje de error de validación
para la regla:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'Password debe tener a lo menos 8 caracteres'
        )
    );

last
----

Asignar ``'last'`` a ``true`` provocará que el validador se detenga en
la regla si llegara a fallar en vez de continuar con la siguiente regla.
Ésto es útil si quieres que la validación se detenga si el campos es
notEmpty en un `campo
multi-regla </es/view/133/Multiple-Rules-per-Field>`_.

::

    var $validate = array(
        'username' => array(
            'usernameRule-1' => array(
                'rule' => 'notEmpty',  
                'message' => 'Por favor, introduce el nombre de usuario.',
                'last' => true
             ),
            'usernameRule-2' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Longitud mímima de 8 caracteres.'
            )  
        )
    );

El valor predeterminado de ``'last'`` es ``false``.

Múltiples Reglas por Campo
==========================

La técnica descrita anteriormente nos entrega mayor flexibilidad que la
asignación de reglas simples, pero hay un paso adicional que podemos
tomar para lograr un control más fino de la validación de datos. La
siguiente técnica que revisaremos nos permite asignar múltiples reglas
de validación por cada campo de un modelo.

Si quieres asignar múltiples reglas de validación a un sólo campo,
básicamente así es cómo se verá:

::

     
    var $validate = array(
        'nombreCampo' => array(
            'nombreRegla' => array(
                'rule' => 'nombreRegla',
                // acá van índices extra como on, required, etc.
            ),
            'nombreRegla2' => array(
                'rule' => 'nombreRegla2',
                // acá van índices extra como on, required, etc.
            )
        )
    );

Como puedes ver, esto es bastante similar a lo que hicimos en la sección
previa. Anteriormente, por cada campo teníamos un sólo arreglo con
parámetros de validación. En este caso, cada ‘nombreCampo’ consiste en
un arreglo de índices de reglas. Cada ‘nombreRegla’ contiene un arreglo
distinto con parámetros de validación.

Esto se entiende mejor con un ejemplo práctico:

::

    var $validate = array(
        'login' => array(
            'alphanumeric' => array(
                'rule' => 'alphaNumeric',  
                'message' => 'Se permiten sólo letras y números',
                'last' => true
             ),
            'minlength' => array(
                'rule' => array('minLength', '8'),  
               'message' => 'Largo mínimo de 8 caracteres'
            ),  
        )
    );

El ejemplo de arriba define dos reglas para el campo login: alphanumeric
y minLength. Como puedes ver, cada regla se identifica con un nombre de
índice. En este caso particular, los nombres de índice son similares a
las reglas que usan, pero el nombre de índice puede ser cualquier
nombre.

Por defecto CakePHP trata de validar un campo usando todas las reglas de
validación declaradas para él y retorna un mensaje de error para la
última regla no satisfecha. Pero si el índice ``last`` es dejado como
``true`` y la regla no es satisfecha, entonces se mostrará el mensaje de
error para esa regla y no se validará ninguna regla adicional. Asi que
si prefieres mostrar un mensaje de error para la primera regla no
satisfecha entonces debes dejar ``'last' => true`` por cada regla.

Si vas a usar mensajes de error internacionalizados podrias quierer
especificar los mensajes de error en las vistas:

::

    echo $form->input('login', array(
        'label' => __('Login', true), 
        'error' => array(
                'alphanumeric' => __('Se permiten sólo letras y números', true),
                'minlength' => __('Largo mínimo de 8 caracteres', true)
            )
        )
    );

El campo ahora está totalmente internacionalizado, y puedes eliminar los
mensajes del modelo. Para más información acerca de la función \_\_()
ver "Localization & Internationalization"

Reglas de Validación Incorporadas
=================================

La clase Validation de CakePHP contiene muchas reglas de validación
incorporadas que pueden hacer mucho más fácil la validación de datos.
Esta clase contiene muchas técnicas de validación frecuentemente usadas
que no necesitarás escribir por tu cuenta. Abajo encontrarás una lista
completa de todas las reglas, junto ejemplos de uso.

alphaNumeric
------------

Los datos para el campo deben contener sólo letras y números.

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'message' => 'Los nombres de usuario deben contener sólo letras y números.'
        )
    );

between
-------

El largo de los datos para el campo debe estar dentro de un rango
numérico específico. Se debe indicar un valor mínimo y máximo.

::

    var $validate = array(
        'password' => array(
            'rule' => array('between', 5, 15),
            'message' => 'Las contraseñas deben tener un largo entre 5 y 15 caracteres.'
        )
    );

blank
-----

Esta regla es usada para asegurar que el campo es dejado en blanco o con
sólo espacios en blanco como su valor. Los espacios en blanco incluyen
los caracteres de la barra espaciadora, tabulador, retorno de carro y
nueva línea.

::

    var $validate = array(
        'id' => array(
            'rule' => 'blank',
            'on' => 'create'
        )
    );

boolean
-------

El campo debe contener un valor booleano. Los valores aceptados son
“true” o “false”, los enteros 0 o 1 y las cadenas "0" o "1".

::

    var $validate = array(
        'myCheckbox' => array(
            'rule' => array('boolean'),
            'message' => 'Valor incorrecto en myCheckbox'
        )
    );

cc
--

Esta regla es usada para verificar si los datos corresponden a un número
de tarjeta de credito válido. Acepta tres parámetros: ‘type’, ‘deep’ y
‘regex’.

El ‘type’ puede ser ‘fast’, ‘all’ o cualquiera de los siguientes:

-  bankcard
-  diners
-  disc
-  electron
-  enroute
-  jcb
-  maestro
-  mc
-  solo
-  switch
-  visa
-  voyager

Si ‘type’ es dejado en ‘fast’, se validan los datos contra el formato
numérico de las principales tarjetas de crédito. También se puede dejar
‘type’ como un arreglo con todos los tipos de validaciones que se quiere
satisfacer.

El índice ‘deep’ debería dejarse con un valor booleano. Si es verdadero,
la validación usará el algoritmo de Luhn para tarjetas de crédito
(`https://en.wikipedia.org/wiki/Luhn\_algorithm <https://en.wikipedia.org/wiki/Luhn_algorithm>`_).
Por defecto el valor se asume como falso.

El índice ‘regex’ permite indicar una expersión regular propia que será
usada para validar el número de tarjeta de credito.

::

    var $validate = array(
        'ccnumber' => array(
            'rule' => array('cc', array('visa', 'maestro'), false, null),
            'message' => 'El número de tarjeta de crédito que ha suministrado no es válido.'
        )
    );

comparison
----------

Esta regla es usada para comparar valores numéricos. Soporta “is
greater”, “is less”, “greater or equal”, “less or equal”, “is less”,
“equal to”, y “not equal”. A continuación algunos ejemplos:

::

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', '>=', 18),
            'message' => 'Debe tener al menos 18 años para calificar.'
        )
    );

    var $validate = array(
        'age' => array(
            'rule' => array('comparison', 'greater or equal', 18),
            'message' => 'Debe tener al menos 18 años para calificar.'
        )
    );

date
----

Esta regla asegura que los datos enviados esten en un formato de fecha
válido. Un único parámetro (que puede ser un arreglo) puede ser pasado y
que será usado para verificar el formato de la fecha indicada. El valor
del parámetro puede ser uno de los siguientes formatos:

-  ‘dmy’ por ejemplo 27-12-2006 o 27-12-06 (los separadores pueden ser
   espacio, punto, guion, slash)
-  ‘mdy’ por ejemplo 12-27-2006 or 12-27-06 (los separadores pueden ser
   espacio, punto, guion, slash)
-  ‘ymd’ por ejemplo 2006-12-27 or 06-12-27 (los separadores pueden ser
   espacio, punto, guion, slash)
-  ‘dMy’ por ejemplo 27 December 2006 o 27 Dec 2006
-  ‘Mdy’ por ejemplo December 27, 2006 o Dec 27, 2006 (la coma es
   opcional)
-  ‘My’ por ejemplo (December 2006 o Dec 2006)
-  ‘my’ por ejemplo 12/2006 o 12/06 (los separadores pueden ser espacio,
   punto, guion, slash)

Si no especifica ningún índice, se usará el índice por defecto ‘ymd’.

::

    var $validate = array(
        'born' => array(
            'rule' => 'date',
            'message' => 'Ingrese una fecha válida usando el formato AA-MM-DD.',
            'allowEmpty' => true
        )
    );

Mientras que muchos almacenes de datos (motores de bases de datos)
requieren cierto formato de datos, podrias considerar aceptar una amplia
variedad de formatos de fechas y luego convertirlos, en vez de forzar a
los usuarios a ingresar cierto formato. Entre más trabajo puedas hacer
por tus usuarios, mejor.

decimal
-------

Esta regla asegura que el dato es un número decimal válido. Se puede
pasar un parámetro para especificar la cantidad de dígitos requeridos
después del punto decimal. Si no se pasa ningún parámetro, el dato será
validado como un número de punto flotante científico, que causará que la
validación no sea satisfecha si es que no se encuentra ningún dígito
después del punto decimal.

::

    var $validate = array(
        'price' => array(
            'rule' => array('decimal', 2)
        )
    );

email
-----

Esta regla verifica que el dato sea una dirección de correo electrónico
válida. Al pasar un valor booleano verdadero como segundo parámetro se
tratará también de verificar que el host de la dirección sea válido.

::

    var $validate = array('email' => array('rule' => 'email'));
     
    var $validate = array(
        'email' => array(
            'rule' => array('email', true),
            'message' => 'Por favor indique una dirección de correo electrónico válida.'
        )
    );

equalTo
-------

Esta regla asegura que el valor sea equivalente a, y del mismo tipo que
el valor indicado.

::

    var $validate = array(
        'food' => array(
            'rule' => array('equalTo', 'cake'),  
            'message' => 'El valor debe ser el string cake'
        )
    );

extension
---------

Esta regla verifica que la extensión de archivo sea como .jpg o .png.
Para permitir múltiples extensiones estas se deben pasar dentro de un
arreglo.

::

    var $validate = array(
        'image' => array(
            'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg'),
            'message' => 'Por favor indique una imágen válida.'
        )
    );

file
----

Esta sección aún tiene que ser escrita, si tienes una idea de qué poner
aqui, por favor usa los links y déjanos saber tu sugerencia!

ip
--

Esta regla asegura que haya sido ingresada una dirección IPv4 válida.

::

    var $validate = array(
        'clientip' => array(
            'rule' => 'ip',
            'message' => 'Por favor ingrese una dirección IP válida.'
        )
    );

isUnique
--------

El dato para este campo debe ser único, no puede ser usado por ningún
otro registro.

::

    var $validate = array(
        'login' => array(
            'rule' => 'isUnique',
            'message' => 'Este nombre de usuario ya ha sido asignado.'
        )
    );

minLength
---------

Esta regla asegura que el dato cumple con un requisito de largo mínimo.

::

    var $validate = array(
        'login' => array(
            'rule' => array('minLength', '8'),  
            'message' => 'Los nombres de usuario deben tener un largo de al menos 8 caracteres.'
        )
    );

maxLength
---------

Esta regla asegura que el dato siempre esté dentro del requisito de
largo máximo.

::

    var $validate = array(
        'login' => array(
            'rule' => array('maxLength', '15'),  
            'message' => 'Los nombres de usuario no pueden tener un largo mayor a 15 caracteres.'
        )
    );

money
-----

Esta regla asegura que el valor sea una cantidad en formato monetario
válido.

El segundo parámetro define dónde se ubica el símbolo: left/right
(izquierda/derecha).

::

    var $validate = array(
        'salary' => array(
            'rule' => array('money', 'left'),
            'message' => 'Por favor ingrere una cantidad monetaria válida.'
        )
    );

multiple
--------

Empleado para validar campos input select multiple. Soporta los
paramentros "in", "max" y "min".

::

    var $validate = array(
        'multiple' => array(
            'rule' => array('multiple', array('in' => array('foo', 'bar'), 'min' => 1, 'max' => 3)),
            'message' => 'Por favor seleccione una, dos o tres opciones'
        )
    );

inList
------

Esta regla asegura que el valor está dentro de un conjunto dado.
Necesita de un arreglo de valores. El valor es válido si coincide con
uno de los valores del arreglo indicado.

Example:

::

        var $validate = array(
          'function' => array(
            'allowedChoice' => array(
                'rule' => array('inList', array('Foo', 'Bar')),
                'message' => 'Ingreso Foo o ingrese Bar.'
            )
          )
        );

numeric
-------

Verifica si el dato ingresado es un número válido.

::

    var $validate = array(
        'cars' => array(
            'rule' => 'numeric',  
            'message' => 'Por favor indique la cantidad de vehículos.'
        )
    );

notEmpty
--------

Regla básica para asegurar que un campo no este vacío.

::

    var $validate = array(
        'title' => array( 
            'rule' => 'notEmpty',
            'message' => 'Este campo no puede quedar vacío.'
        )
    );

phone
-----

Phone valida números telefónicos de EE.UU. Si quieres validar números
telefónicos que no sean de EE.UU. puedes proveer una expresión regular
como segundo parámetro para cubrir formatos adicionales.

::

    var $validate = array(
        'phone' => array(
            'rule' => array('phone', null, 'us')
        )
    );

postal
------

Postal es usado para validar códigos ZIP de EE.UU. (us), Canada (ca),
Reino Unido (uk), Italia (it), Alemania (de) y Bélgica (be). Para otros
formatos ZIP puedes proveer una expersión regular como segundo
parámetro.

::

    var $validate = array(
        'zipcode' => array(
            'rule' => array('postal', null, 'us')
        )
    );

range
-----

Esta regla asegura que el valor esté dentro de un rango dado. Si no se
indica un rango, la regla va a verificar si el valor es un número finito
válido en la actual plataforma.

::

    var $validate = array(
        'number' => array(
            'rule' => array('range', 0, 10),
            'message' => 'Por favor ingrese un número entre 0 y 10'
        )
    );

El ejemplo de arriba aceptará cualquier valor mayor a 0 (por ejemplo
0.01) y menor a 10 (por ejemplo 9.99).

ssn
---

Ssn valida los números de seguridad social de EE.UU. (us), Dinamarca
(dk), y los Paises Bajos (nl). Para otros formatos de números de
seguridad social puedes proveer una expersión regular.

::

    var $validate = array(
        'ssn' => array(
            'rule' => array('ssn', null, 'us')
        )
    );

url
---

Esta regla verifica formatos de URL válidos. Soporta los protocolos
http(s), ftp(s), file, news, y gopher.

::

    var $validate = array(
        'website' => array(
            'rule' => 'url'
        )
    );

Reglas de Validación Personalizadas
===================================

Si hasta el momento no has encontrado lo que buscabas, siempre podrás
crear tus propias reglas de validación personalizadas. Hay dos maneras
de hacer esto: definiendo expresiones regulares personalizadas, o
creando métodos de validación personalizados.

Validación Personalizada Mediante Expresiones Relugares
-------------------------------------------------------

Si la técnica de validación que necesitas usar puede ser completada
usando expresiones regulares, puedes definir una expresión personalizada
como una regla de validación de un campo.

::

    var $validate = array(
        'login' => array(
            'rule' => array('custom', '/^[a-z0-9]{3,}$/i'),  
            'message' => 'Sólo letras y enteros, mínimo 3 caracteres'
        )
    );

El ejemplo de arriba verifica si login contiene sólo letras y enteros,
con un largo mínimo de tres caracteres.

Validación Mediante Métodos Personalizados
------------------------------------------

Algunas veces revisar los datos usando expresiones regulares no es
suficiente. Por ejemplo, si quieres asegurar que un código promocional
sólo pueda ser usado 25 veces, necesitas agregar una función de
validación personalizada, como se muestra más abajo:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
      
        var $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'Este código ha sido usado demasiadas veces.'
            )
        );
     
        function limitDuplicates($data, $limit){
            $existing_promo_count = $this->find( 'count', array('conditions' => $data, 'recursive' => -1) );
            return $existing_promo_count < $limit;
        }
    }
    ?>

Si quieres pasar parámetros a tu función de validación personalizada,
agrega elementos extra al arreglo ‘rule’ y trátalos como parámetros
extra (despúes del parámetro principal ``$data``) en tu función
personalizada.

Tu función de validación personalizada puede estar en el modelo (como en
el ejemplo de arriba), o en un behavior implementado por el modelo. Esto
incluye los modelos mapeados.

Notar que los métodos del model/behavior son verificados primero, antes
de buscar un método en la clase ``Validation``. Esto significa que
puedes sobreescribir métodos de validación existentes (como por ejemplo
``alphaNumeric()``) en el nivel de aplicación (agregando el método a
``AppModel``), o en el nivel de modelo.

Validando datos desde el Controlador
====================================

Mientras que normalmente sólo usarás el método save del modelo, habrán
veces que te gustaría validar los datos sin guardarlos. Por ejemplo,
podrías querer mostrar algo de información adicional al usuario antes de
guardar los datos a la base de datos. Validar datos requiere de un
proceso ligeramente distinto al de sólo guardar los datos.

Primero, debes setear los datos al modelo:

::

    $this->ModelName->set( $this->data );

Luego, para verificar si los datos se validan correctamente, usa el
método validates del modelo, que retornará true si es que se valida y
false si es que no:

::

    if ($this->ModelName->validates()) {
        // paso la lógica de validación
    } else {
        // no paso la lógica de validadición
    }

El método validates invoca el método invalidFields que le asignará un
valor a la propiedad validationErrors del modelo. El método
invalidFields también retorna los datos como su resultado.

::

    $errors = $this->ModelName->invalidFields(); // contiene el arrego validationErrors 

Es importante notar que los datos se deben primero setear al modelo
antes de poder validarlos. Esto es diferente al método save que permite
pasar los datos como un parámetro. También, ten en cuenta que no es
necesario llamar a validates antes de llamar a save ya que save validará
automáticamente los datos antes realmente de guardarlos.
