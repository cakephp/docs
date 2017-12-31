Acceso a la base de datos & ORM
###############################

En CakePHP el acceso a la base de datos se hace por medio de dos objetos primarios.
El primero son **repositories** -repositorios- o **table objects** -objetos de tabla-.
Estos objetos proveen acceso a colecciones de datos. Nos permiten guardar nuevos
registros, modificar y borrar existentes, definir relaciones y realizar operaciones en masa.
El segundo tipo de objeto son **entities** -entidades-. Las Entidades representan registros
individuales y permiten definir funcionalidad y comportamiento a nivel de registro/fila.

Estas dos clases son responsables de manejar todo lo que sucede con datos, validez, interacción y
evolución en tu área de trabajo.

El ORM incluído en CakePHP se especializa en base de datos relacionales, pero puede ser extendido
para soportar alternativas.

El ORM de CakePHP toma ideas y conceptos de los modelos ActiveRecord y Datamapper. Aspira a
crear una implementación híbrida que combine aspectos de los dos modelos para crear un ORM rápido
y fácil de usar.

Antes de comentar explorando el ORM, asegurate de configurar tu conexion :ref:`configure your
database connections <database-configuration>`.

.. note::

    Si estás familiarizado con las versiones anteriores de CakePHP, deberías leer :doc:`/appendices/orm-migration`
    para entender las diferencias entre CakePHP 3.0 y las versiones anteriores.

Ejemplo rápido
==============

Para comenzar no es necesario escribir código. Si has seguido las convenciones de nombres para las tablas puedes
comenzar a utilizar el ORM. Por ejemplo si quisieramos leer datos de nuestra tabla ``articles``::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    foreach ($query as $row) {
        echo $row->title;
    }

Como se ve, no es necesario agregar código extra ni ninguna otra configuración, gracias al uso de las convenciones
de CakePHP. Si quisieramos modificar nuestra clase ArticlesTable para agregar asociaciones o definir métodos
adicionales deberiamos agregar las siguientes lineas en **src/Model/Table/ArticlesTable.php** ::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

Las clases Table usan una version en CamelCase del nombre de la tabla, con el sufijo ``Table``.
Una vez que tú clase fue creada, puedes obtener una referencia a esta usando :php:class:`~Cake\\ORM\\TableRegistry` como antes::

    use Cake\ORM\TableRegistry;
    // Now $articles is an instance of our ArticlesTable class.
    $articles = TableRegistry::get('Articles');

Ahora que tenemos una clase Table concreta, probablemente querramos usar una clase Entity concreta.
Las clases Entity permiten definir métodos de acceso y mutación, lógica para registros individuales y mucho mas.
Comenzaremos agregando las siguientes lineas en **src/Model/Entity/Article.php**::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

    }

Las Entity usan la version CamelCase en singular del nombre de la tabla como su nombre. Ahora que hemos creado una clase Entity, cuando
carguemos entidades de nuestra base de datos, vamos a obtener instancias de nuestra clase Article::

    use Cake\ORM\TableRegistry;

    // Now an instance of ArticlesTable.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
        // Each row is now an instance of our Article class.
        echo $row->title;
    }

CakePHP usa convenciones de nombres para asociar las clases Table y Entity. Si necesitas modificar qué entidad utilizada una tabla,
puedes usar el método ``entityClass()`` para especificar el nombre de una clase.

Vea :doc:`/orm/table-objects` y :doc:`/orm/entities` para mas información sobre como utilizar objetos Table y Entity en su aplicación.

Más información
===============

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/associations
    orm/behaviors
    orm/schema-system
    console-and-shells/orm-cache
