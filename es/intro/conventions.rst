Convenciones CakePHP
####################

Somos muy fans de la convención por encima de la configuración. A pesar de que
toma algo de tiempo aprender las convenciones de CakePHP, ahorrarás tiempo
a la larga. Siguiendo las convenciones obtendrás funcionalidades gratuitas y
te liberarás de la pesadilla de mantener archivos de configuración. Las
convenciones también hacen que el desarrollo sea uniforme, permitiendo que
otros desarrolladores comprendan fácilmente tu código y ayudar.

Convenciones de Controlador
===========================

Los nombres de las clases Controlador son en plurar, en formato ``CamelCase``,
y finalizan con ``Controller``. Ejemplos de nombres son: ``UsuariosController`` 
y ``CategoriasArticulosController``.

Los métodos publicos de los Controladores a menudo se exponen como 'acciones'
accesibles a través de un navegador web. Por ejemplo, ``/users/view`` mapea
al método ``view()`` de ``UsersController`` sin tener que hacer nada en el 
enrutamiento de la aplicación. Los métodos protegidos o privados no son 
accesibles con el enrutamiento.

Consideraciones URL para los nombres de Controladores
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Como acabas de ver, los controladores de una sola palabra mapean a una dirección 
URL en minúscula. Por ejemplo: a ``UsuariosController`` (que debería estar 
definido en **UsuariosController.php**) se puede acceder desde 
http://example.com/usuarios.

Aunque puedes enrutar controladores de múltiples palabaras de la forma que 
desees, la convención es que tus URLs separen las palabras con guiones utilizando 
la clase ``DashedRoute``, de este modo ``/categorias-articulos/ver-todas`` es
la forma correcta para acceder a la acción ``CategoriasArticulosController::verTodas()``.

Cuando creas enlaces utilizando ``this->Html->link()`` puedes utilizar las 
siguientes convenciones para el array url::

    $this->Html->link('titulo-enlace', [
        'prefix' => 'MiPrefijo' // CamelCase
        'plugin' => 'MiPlugin', // CamelCase
        'controller' => 'NombreControlador', // CamelCase
        'action' => 'nombreAccion' // camelBack
    ]

Para más información sobre URLs de CakePHP y el manejo de sus parámetros puedes
consultar :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Convenciones de nombre de clase y archivo
=========================================

En general los nombres de los archivos coinciden con los nombres de las clases
y siguen los estándares PSR-0 o PSR-4 para cargarse automáticamente. Los 
siguientes son ejemplos de nombres de clases y de sus archivos:

-  La clase Controlador ``LatestArticlesController`` debería estar en un archivo llamado **LatestArticlesController.php**
-  La clase Componente ``MyHandyComponent`` debería estar en un archivo llamado **MyHandyComponent.php**
-  La clase Tabla ``OptionValuesTable`` debería estar en un archivo llamado **OptionValuesTable.php**.
-  La clase Entidad ``OptionValue`` debería estar en un archivo llamado **OptionValue.php**.
-  La clase Behavior ``EspeciallyFunkableBehavior`` debería estar en un archivo llamado **EspeciallyFunkableBehavior.php**
-  La clase Vista ``SuperSimpleView`` debería estar en un archivo llamado **SuperSimpleView.php**
-  La clase Helper ``BestEverHelper`` debería estar en un archivo llamado **BestEverHelper.php**

Cada archivo deberá estar ubicado en la carpeta/namespace correcta dentro de
tu carpeta de tu aplicación.

.. _model-and-database-conventions:

Convenciones de Modelo y Base de datos
======================================

Los nombres de las clases ``table`` son en plural, ``CamelCase`` y terminan en
``Table``. Algunos ejemplos de convención de nombres son: ``UsersTable``, 
``ArticleCategoriesTable`` y ``UserFavoritePagesTable``.

Los nombres de las tablas correspondientes a los modelos de CakePHP son en plural
y con '_'. Los nombres de las tablas para los modelos arriba mencionados serían
``users``, ``article_categories`` y ``user_favorite_pages`` respectivamente.

La convención es utilizar palabras en inglés para los nombres de las tablas y de
las columnas. Si utilizas otro idioma CakePHP puede que no sea capaz de procesar
correctamente las conversiones (de singular a plural y viceversa). Si necesitas
añadir reglas para tu idioma para algunas palabras, puedes utilizar la clase 
:php:class:`Cake\\Utility\\Inflector`. Además de definir tus reglas de 
conversión personalizadas, esta clase te permite comprobar que CakePHP comprenda
tu sintaxis personalizada para palabras en plural y singular. Mira la documentación
sobre :doc:`/core-libraries/inflector` para más información.

Los nombres de campos con dos o más palabras se escriben con '_', por ejemplo: ``first_name``.

Las claves foráneas en relaciones ``1-n`` (``hasMany``) y ``1-1`` (``belongsTo/hasOne``)
son reconocidas por defecto mediante el nombre (en singular) de la tabla relacionada
seguido de ``_id``. De este modo si ``Users`` tiene varios ``Articles`` (relación 
``hasMany``), la tabla ``articles`` se relacionará con la tabla ``users`` a través 
de la clave foránea ``user_id``. Para una tabla como ``article_categories`` 
cuyo nombre está formado por varias palabras, la clave foránea sería ``article_category_id``.

Las tablas de unión, usadas en las relaciones ``n-n`` (``BelongsToMany``) entre
modelos, deberían ser nombradas después de las tablas que unirán y en orden 
alfabético (``articles_tags`` en lugar de ``tags_articles``).

Además de utilizar claves auto-incrementales como claves primarias, también 
puedes utilizar columnas UUID. CakePHP creará un único UUID de 36 caracteres 
(:php:meth:`Cake\\Utility\\Text::uuid()`) cada vez que guardes un nuevo registro
usando el método ``Table::save()`` .

Convenciones de Vistas
======================

Los archivos de las plantillas de vistas son nombrados según las 
funciones de controlador que las muestran empleando '_'. La función ``viewAll()``
de la clase ``ArticlesController`` mostrará la vista **src/Template/Articles/view_all.ctp**.

El patrón base es **src/Template/Controller/nombre_funcion.ctp**.

Nombrando los elementos de tu aplicación empleando las convenciones de CakePHP
ganarás funcionalidad sin los fastidios y ataduras de mantenimiento de la 
configuración.

Un último ejemplo que enlaza todas las convenciones:

-  Tabla de base de datos: "articles"
-  Clase Tabla: ``ArticlesTable``, ubicada en **src/Model/Table/ArticlesTable.php**
-  Clase Entidad: ``Article``, ubicada en **src/Model/Entity/Article.php**
-  Clase Controlador: ``ArticlesController``, ubicada en
   **src/Controller/ArticlesController.php**
-  Plantilla vista, ubicada en **src/Template/Articles/index.ctp**

Usando estas convenciones CakePHP redirige una petición a http://example.com/articles/
a una llamada a la función ``index()`` de la clase ArticlesController,
donde el modelo ``Article`` está disponible automáticamente (y enlazada, automáticamente 
también, a la tabla ``articles`` en la base de datos) y renderiza un 
archivo. Ninguna de estas relaciones han sido configuradas de ningún modo salvo
creando clases y archivos que has tenido que crear de todas formas.

Ahora que te has introducido en los fundamentos de CakePHP. puedes tratar de 
realizar el tutorial :doc:`/tutorials-and-examples/bookmarks/intro` para ver 
como las cosas encajan juntas.

.. meta::
    :title lang=es: Convenciones CakePHP
    :keywords lang=es: experiencia desarrollo web,pesadilla mantenimiento,método index,legado sistemas,nombres métodos,clases php,sistema uniforme,archivos configuración,tenets,artículos,convenciones,controlador convencional,mejores prácticas,visibilidad,nuevos artículos,funcionalidad,lógica,cakephp,desarrolladores
