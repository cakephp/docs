Comportamientos
###############

Los comportamientos del modelo (*Model behaviors*) son una manera de
organizar parte de la funcionalidad definida en los modelos de CakePHP.
Nos permiten separar la lógica que puede no estar relacionada
directamente con un modelo, pero que necesita estar ahí. Proveyendo una
manera simple pero potente manera de extender modelos, los
comportamientos nos permiten atar funcionalidad a los modelos definiendo
una simple variable de clase. Así es como los comportamientos permiten a
los modelos deshacerse de todo el peso extra que no debería ser parte de
contrato de negocio que están modelando, o al menos es necesario en
diferentes modelos y puede, entonces, ser extrapolado.

Como ejemplo, considera un modelo que nos da acceso a una tabla de una
base de datos la cual almacena información estructural de un árbol.
Eliminando, añadiendo y migrando nodos en el árbol no es tan simple como
borrar, insertar y editar filas en una tabla. Muchos registros deberán
ser actualizados según las cosas se mueven. En vez de crear esos métodos
de manipulación del árbol en cada base de modelo (para todo modelo que
necesita dicha funcionalidad), podríamos simplemente decirle a nuestro
modelo que utilize el *TreeBehavior* (ArbolComportamiento), o en
términos más formales, decirle a nuestro modelo que se comporte como un
Árbol. Esto es conocido como atar un comportamiento a un modelo. Con
sólo una línea de código, nuestro modelo de CakePHP toma todo un nuevo
conjunto de métodos que le permiten interactuar con la estructura
subyacente.

CakePHP ya incluye comportamientos para estructuras de árbol, contenido
traducido, interacción con listas de control de acceso, sin comentar los
comportamientos aportados por la comunidad disponibles en `CakePHP
Bakery <https://bakery.cakephp.org>`_. En esta sección cubriremos el
patrón básico de uso para añadir comportamientos a modelos, cómo
utilizar los comportamientos de CakePHP incorporados y cómo crear uno
nosotros mismos.

Utilizando Comportamientos
==========================

Los comportamientos son atados a modelos mediante la variable de clase
del modelo $actsAs:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree');
    }

    ?>

Este ejemplo muestra cómo un modelo de *Category* puede ser manejado en
una estructura de árbol utilizando el comportamiento de árbol
(*TreeBehavior*). Una vez que un comportamiento ha sido especificado,
utiliza los métodos añadidos por el comportamiento como si siempre
existiesen como parte del modelo original:

::

    // Set ID
    $this->Category->id = 42;

    // Utilizar un método de comportamiento, children():
    $kids = $this->Category->children();

Algunos comportamientos pueden requerir o permitir opciones a ser
definidas cuando el comportamiento es atado al modelo. Aquí, decimos a
nuestro *TreeBehavior* (comportamiento de árbol) los nombres de los
campos *left* (izquierdo) y *right* (derecho) en la tabla de base de
datos subyacente:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array(
            'Tree' => array(
                'left'  => 'left_node',
                'right' => 'right_node'
            )
        );
    }

    ?>

Podemos también atar varios comportamientos a un modelo. No hay razón
por la que, por ejemplo, nuestro modelo *Category* deba sólo comportarse
como un árbol, también puede necesitar soporte de internacionalización:

::

    <?php

    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

    ?>

Hasta el momento hemos estado añadiendo comportamientos a modelos
utilizando una variable de la clase. Eso significa que nuestros
comportamientos serán atados a muestros modelos durante todo el tiempo
de vida del modelo. Sin embargo, puede ser que necesitemos "desatar"
comportamientos de nuestros modelos en tiempo de ejecución. Digamos que
en nuestro modelo *Category* anterior, el cual está actuando como un
modelo *Tree* y *Translate*, necesitamos por alguna razón forzar a que
deje de actuar como un modelo *Translate*:

::

    // Desata un comportamiento de nuestro modelo:
    $this->Category->Behaviors->detach('Translate');

Eso hará que nuestro modelo *Category* deje de comportarse como un
modelo *Translate* desde ese momento. Tal vez necesitemos, en cambio,
simplemente desactivar el comportamiento *Translate* de actuar sobre
operaciones normales del modelo: nuestras búsquedas, grabados, etc. De
hecho, estamos buscando desactivar el comportamiento de actuar sobre
nuestros *callbacks* del modelo de CakePHP. En vez de desatar el
comportamiento, le decimos a nuestro modelo que pare de informar sobre
dichos *callbacks* al comportamiento *Translate*:

::

    // Parar de dejar al comportamiento manejar los callbacks de nuestro modelo
    $this->Category->Behaviors->disable('Translate');

También necesitaremos saber si nuestro comportamiento está manejando los
*callbacks* del modelo, y si no, restauramos su habilidad para
reaccionar a ellos:

::

    // Si nuestro comportamiento no está manejando los callbacks del modelo
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Decirle que comience a hacerlo
        $this->Category->Behaviors->enable('Translate');
    }

Tal como podemos desatar completamente un comportamiento de un modelo en
tiempo de ejecución, también podemos atar nuevos comportamientos.
Digamos que nuestro modelo *Category* necesita empezar a comportarse
como un modelo *Christmas* (Navidad), pero sólo en el día de Navidad:

::

    // Si hoy es 25 de diciembre
    if (date('m/d') == '12/25') {
        // Nuestro modelo necesita comportarse como un modelo Christmas
        $this->Category->Behaviors->attach('Christmas');
    }

Podemos también utilizar el método *attach()* para sobreescribir las
opciones de comportamiento:

::

    // Cambiaremos una opción de nuestro ya atado comportamiento
    $this->Category->Behaviors->attach('Tree', array('left' => 'new_left_node'));

También hay un método para obtener la lista de comportamientos atados a
un modelo: *attached()*. Si pasamos el nombre de un comportamiento al
método, nos dirá si dicho comportamiento está atado al modelo; de
cualquier otra manera nos dará una lista de los comportamientos atados.

::

    // Si el comportamiento "Translate" no está atado al modelo
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Obtener la lista de todos los comportamientos atados al modelo
        $behaviors = $this->Category->Behaviors->attached();
    }

Creando Comportamientos Personalizados
======================================

Este es el contenedor del contenido.

Creating behavior methods
=========================

Behavior methods are automatically available on any model acting as the
behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }

You would be able to call FlyingBehavior methods as if they were methods
on your Duck model. When creating behavior methods you automatically get
passed a reference of the calling model as the first parameter. All
other supplied parameters are shifted one place to the right. For
example

::

    $this->Category->fly('toronto', 'montreal');

Although this method takes two parameters, the method signature should
look like:

::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }

Keep in mind that methods called in a ``$this->doIt()`` fashion from
inside a behavior method will not get the $model parameter automatically
appended.
