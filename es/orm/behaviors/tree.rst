Tree
####

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TreeBehavior

Muchas veces nos encontramos frente a la necesidad de tener que almacenar datos jerarquizados en una base de datos. Podría tomar la forma de categorías sin límite de subcategorías, datos relacionados con un sistema de menú multinivel o una representación literal de la jerarquía como un departamento en una empresa.

Las bases de datos relacionales no son verdaderamente apropiadas para almacenar y recobrar este tipo de datos, pero existen algunas técnicas para hacerlas eficientes y trabajar con una información multinivel.

El TreeBehavior le ayuda a mantener una estructura de datos jerárquica en la base de datos que puede ser solicitada fácilmente y ayuda a reconstruir los datos bajo una forma de árbol que permite encontrar y visualizar los procesos.

Prerrequisitos
==============
Ese behavior  requiere que las siguientes columnas estén presentes en la tabla:

- ``parent_id`` (nullable) La columna que contiene el ID del registro padre
- ``lft``  (integer, signed) Utilisado para mantener la estructura en forma de árbol
- ``rght``  (integer, signed) Utilisado para mantener la estructura en forma de árbol

Usted puede configurar el nombre de esos campos. Encontrará más información sobre la significación de los campos y sobre la manera de utilizarlos en este artículo que describe la `MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_

Advertencia

Por el momento, TreeBehavior no soporta las llaves primarias composites.

Rápido vistazo
==============

Active el Tree behavior agregándolo a la Tabla donde usted desea almacenar los datos jerarquizados en::

    class CategoriesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree');
        }
    }

Tras agregarlas, puede dejar que CakePHP construya la estructura interna si la tabla ya contiene algunos registros::

    $categories = TableRegistry::get('Categories');
    $categories->recover();

Usted puede comprobar que funciona recuperando cualquier registro de la tabla y preguntando cuantos descendientes posee::

    $node = $categories->get(1);
    echo $categories->childCount($node);

Obtener una lista plana de los descendientes de un nodo es igual de fácil::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

En cambio, si necesita una lista enlazada donde los hijos de cada nodo están anidados en una jerarquía, usted puede utilizar el finder ‘threaded’::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} has " . count($child->children) . " direct children";
    }

Recorrer los resultados encadenados requiere generalmente funciónes recursivas, pero si usted necesita solamente un conjunto de resultados que contenga un campo único a partir de cada nivel para obtener una lista, en un <select> HTML por ejemplo, le será preferible recurrir al finder ‘treeList’::

    $list = $categories->find('treeList');

    // En un fichero plantilla de Cake PHP:
    echo $this->Form->input('categories', ['options' => $list]);

    //  O puede aficharlo bajo forma de texto, por ejemplo en un script de CLI
    foreach ($list as $categoryName) {
        echo $categoryName . "\n";
    }

La salida se parecerá a esto::

    My Categories
    _Fun
    __Sport
    ___Surfing
    ___Skating
    _Trips
    __National
    __International

El finder ``treeList`` acepta una serie de opciones:

* ``keyPath``: el camino separado por puntos para recuperar el campo que se utilizará en llave de array, o una clausura que devuelve la llave del registro suministrado.
* ``valuePath``: el camino separado por puntos para recuperar el campo que se utilizará en llave de array, o una clausura que devuelve la llave del registro suministrado.
* ``spacer``: una cadena de caracteres utilizada como prefijo para designar la profundidad del árbol para cada elemento.

Un ejemplo de uso de todas las opciones sería::

    $query = $categories->find('treeList', [
        'keyPath' => 'url',
        'valuePath' => 'id',
        'spacer' => ' '
    ]);

Une tarea común consiste en encontrar el camino en el árbol a partir de un nodo específico hacia la raíz. Es útil, por ejemplo, para añadir la lista de los hilos de Ariadna para una estructura de menú::

    $nodeId = 5;
    $crumbs = $categories->find('path', ['for' => $nodeId]);

    foreach ($crumbs as $crumb) {
        echo $crumb->name . ' > ';
    }

Los árboles construidos con TreeBehavior no pueden ser clasificados con otras columnas que `lft``, porque la representación interna del árbol depende de esa clasificación. Afortunadamente se pueden reestructurar los nodos dentro del mismo nivel sin tener que cambiar el elemento padre::

    $node = $categories->get(5);

    // Desplaza el nudo para que incremente de una posición cuando listamos los hijos
    $categories->moveUp($node);

    //  Desplaza el nudo hacia lo alto de la lista en el mismo nivel
    $categories->moveUp($node, true);

    //  Desplaza el nudo hacia abajo.
    $categories->moveDown($node, true);

Configuración
=============
Si los números de columna predeterminados empleados por ese behavior no corresponden a su esquema, usted puede ponerles alias::

    public function initialize(array $config)
    {
        $this->addBehavior('Tree', [
            'parent' => 'ancestor_id', //  Utilice esto preferencialmente en vez de parent_id
            'left' => 'tree_left', //  Utilice esto en vez de Ift
            'right' => 'tree_right' //  Utilice esto en vez de rght
        ]);
    }

Nivel de Nodos (profundidad)
============================
Conocer la profundidad de una estructura en árbol puede ser útil cuando quiere recuperar los nodos solo hasta cierto nivel, por ejemplo para generar un menú. Puede utilizar la opción ``level`` para especificar los campos que guardarán el nivel de cada nodo::

    $this->addBehavior('Tree', [
        'level' => 'level', // null por defecto, i.e. no guarda el nivel
    ]);

Si usted no quiere copiar en caché el nivel utilizando un campo de la base de datos, puede utilizar el método ``TreeBehavior::getLevel()`` para conocer el nivel de un nodo.

Alcance y árboles múltiples
===========================
Si usted desea tener más de una estructura de árbol en la misma tabla, puede hacerlo utilizando la configuración ‘scope’ (alcance). Por ejemplo, si en una tabla locations desea crear un árbol por país::

    class LocationsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree', [
                'scope' => ['country_name' => 'Brazil']
            ]);
        }
    }

En el precedente ejemplo precedentela totalidad de las operaciones realizadas sobre el árbol solo se enfocarán en los registros que tienen la columna ``country_name`` que vale ‘Brazil’. Usted puede cambiar el scope al vuelo utilizando la función ‘config’::

    $this->behaviors()->Tree->config('scope', ['country_name' => 'France']);

Opcionalmente, puede ejercer un control más riguroso pasando una clausura como scope ::

    $this->behaviors()->Tree->config('scope', function ($query) {
        $country = $this->getConfigureContry(); // A made-up function
        return $query->where(['country_name' => $country]);
    });

Recobro con campo de clasificación personalizada
================================================

.. versionadded:: 3.0.14

Por defecto, recover() clasifica los elementos por llave primaria. Eso funciona muy bien si se trata de una columna numérica (con incremento automático), pero puede ocasionar resultados raros si usted utiliza los UUIDs.
Si necesita una clasificación personalizada para la recuperación de datos, puede agregar una cláusula de orden en la configuración::

    $this->addBehavior('Tree', [
        'recoverOrder' => ['country_name' => 'DESC'],
    ]);

Guardar los datos jerarquizados
===============================
Generalmente cuando utiliza el Tree behavior, no tiene que preocuparse por la representación interna de la estructura jerarquizada.  Las posiciones donde los nodos están colocados en el árbol se deducen de la columna ‘parent_id’  en cada una de sus entities::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = 5;
    $categoriesTable->save($aCategory);

Proveer ids de padres inexistentes al grabar o intentar crear un bucle en el árbol (hacer un nodo hijo del mismo) provocará una excepción.
Puede hacer un nodo a la raíz del árbol asignándolenull a la columna ‘parent_id’::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = null;
    $categoriesTable->save($aCategory);

Los hijos para el nuevo nodo serán preservados.

Suprimir Nodos
==============
Es fácil Suprimir un nodo, así como todo su sub-árbol (todos los hijos que puede tener a todo nivel del árbol)::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->delete($aCategory);

TreeBehavior se ocupará de todas las operaciones internas de supresión.
También es posible suprimir solamente un nodo y reasignar todos los hijos al nodo padre inmediatamente superior en el árbol::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->removeFromTree($aCategory);
    $categoriesTable->delete($aCategory);

Todos los nodos hijos serán conservados y un nuevo padre les será asignado.
La supresión de un nodo se basa sobre los valores lft y rght de la entity. Es importante observarlo cuando se ejecuta un bucle sobre los hijos de un nodo para supresiones condicionales::

    $descendants = $teams->find('children', ['for' => 1]);
    foreach ($descendants as $descendant) {
        $team = $teams->get($descendant->id); // busca el objeto entity al día
        if ($team->expired) {
            $teams->delete($team); // la supresión reclasifica las entradas lft y rght de la base de datos
        }
    }

TreeBehavior reclasifica los valores lft y rght de los registros de la tabla cuando se suprime un nodo. Tal como están, los valores lft y rght de las entities dentro de ``$descendants`` (guardadas antes de la operación de supresión) serán erróneas. Las entities tendrán que estar cargadas, y modificadas al vuelo para evitar incoherencias en la tabla.

