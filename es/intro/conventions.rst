Convenciones CakePHP
####################

Somos muy fans de la convención por encima de la configuración. A pesar de que
toma algo de tiempo aprender las convenciones de CakePHP, ahorrarás tiempo
a la larga. Siguiendo las convenciones obtendrás funcionalidades gratuitas y
te liberarás de la pesadilla de mantener archivos de configuración. Las
convenciones también hacen que el desarrollo sea uniforme, permitiendo a
otros desarrolladores intervenir y ayudar fácilmente.

Convenciones de Controlador
===========================

Los nombres de las clases Controlador son en plurar, en formato ``CamelCase``,
y finalizan con ``Controller``. Ejemplos de nombres son: ``UsuariosController``
y ``CategoriasArticulosController``.

Los métodos públicos de los Controladores a menudo se exponen como 'acciones'
accesibles a través de un navegador web. Tienen formato ``camelBacked``. Por ejemplo, ``/users/view-me`` mapea
al método ``viewMe()`` de ``UsersController`` sin tener que hacer nada en el
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

En general, los nombres de los archivos coinciden con los nombres de las clases
y sigue el estándar PSR-4 para cargarse automáticamente. Los
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

Convenciones de base de datos
=============================

Los nombres de las tablas correspondientes a los modelos de CakePHP son en plural
y con con '_'. Por ejemplo ``users``, ``menu_links`` y ``user_favorite_pages`` respectivamente.
Los nombres de tablas formadas por múltiples palabras sólo deben usar el plural en la última
palabra, por ejemplo, ``menu_links``.

Los nombres de campos con dos o más palabras se escriben con '_', por ejemplo: ``first_name``.

Las claves foráneas en relaciones ``1-n`` (``hasMany``) y ``1-1`` (``belongsTo/hasOne``)
son reconocidas por defecto mediante el nombre (en singular) de la tabla relacionada
seguido de ``_id``. De este modo si ``Users`` tiene varios ``Articles`` (relación
``hasMany``), la tabla ``articles`` se relacionará con la tabla ``users`` a través
de la clave foránea ``user_id``. Para una tabla como ``menu_links``
cuyo nombre está formado por varias palabras, la clave foránea sería ``menu_link_id``.

Las tablas de unión, usadas en las relaciones ``n-n`` (``BelongsToMany``) entre
modelos, deberían ser nombradas después de las tablas que unirán. Los nombres deberán
estar en plural y en orden alfabético: ``articles_tags`` en lugar de ``tags_articles``
o ``article_tags``. *El comando ``bake`` no funcionará correctamente si ésta convención
no se sigue.* Si la tabla de unión guarda alguna información que no sean las claves
foráneas, debes crear la clase de la entidad y modelo para esa tabla.

Además de utilizar claves auto-incrementales como claves primarias, también
puedes utilizar columnas UUID. CakePHP creará un único UUID de 36 caracteres
(:php:meth:`Cake\\Utility\\Text::uuid()`) cada vez que guardes un nuevo registro
usando el método ``Table::save()`` .

Convenciones de modelo
======================

Los nombres de las clases para las tablas son en plural, formato ``CamelCase``
y terminan en ``Table``. ``UsersTable``, ``MenuLinksTable`` y ``UserFavoritePagesTable``
son ejemplos de nombres de clases que corresponden a las tablas ``users``, ``menu_links``
y ``user_favorite_pages`` respectivamente.

Los nombres de las clases para las entidades son en singular, formato ``CamelCase`` y no
tienen sufijo. ``User``, ``MenuLink`` y ``UserFavoritePage`` son ejemplos de nombres de clases
que corresponden a las entidades ``users``, ``menu_links`` y ``user_favorite_pages`` respectivamente.

Convenciones de vistas
======================

Los archivos de las plantillas de vistas son nombrados según las
funciones de controlador que las muestran empleando '_'. La función ``viewAll()``
de la clase ``ArticlesController`` mostrará la vista **templates/Articles/view_all.php**.

El patrón base es **templates/Controller/nombre_funcion.php**.

.. note::

    Por defecto CakePHP usa palabras en inglés para las convenciones de nombres.
    Si utilizas otro idioma CakePHP puede que no sea capaz de procesar
    correctamente las conversiones (de singular a plural y viceversa). Si necesitas
    añadir reglas para tu idioma para algunas palabras, puedes utilizar la clase
    :php:class:`Cake\\Utility\\Inflector`. Además de definir tus reglas de
    conversión personalizadas, esta clase te permite comprobar que CakePHP comprenda
    tu sintaxis personalizada para palabras en plural y singular. Mira la documentación
    sobre :doc:`/core-libraries/inflector` para más información.

Convenciones de plugins
=======================

Es útil añadir el prefijo "cakephp-" en el nombre del paquete para los plugins de CakePHP.
Esto hace que el nombre esté relacionado semánticamente al "framework" del que depende.

**No** uses el espacio de nombre de CakePHP (cakephp) como nombre de "vendor", ya que es
un espacio reservado para los plugins que son propiedad de CakePHP. La convención es usar
letras en minúscula y guiones como separadores::

    // Bad
    cakephp/foo-bar

    // Good
    your-name/cakephp-foo-bar

Ver `lista asombrosa de recomendaciones
<https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins>`__
par mas detalles.

Resumen
=======

Nombrando los elementos de tu aplicación empleando las convenciones de CakePHP
ganarás funcionalidad sin los fastidios y ataduras de mantenimiento de la
configuración.

Un último ejemplo que enlaza todas las convenciones:

-  Tabla de base de datos: "articles", "menu_links"
-  Clase Tabla: ``ArticlesTable``, ubicada en **src/Model/Table/ArticlesTable.php**
-  Clase Entidad: ``Article``, ubicada en **src/Model/Entity/Article.php**
-  Clase Controlador: ``ArticlesController``, ubicada en
   **src/Controller/ArticlesController.php**
-  Plantilla vista, ubicada en **templates/Articles/index.php**

Usando estas convenciones, CakePHP sabe que una petición a http://example.com/articles/
hace una llamada a la función ``index()`` de la clase ``ArticlesController``,
donde el modelo ``Articles`` está disponible automáticamente y enlazada automáticamente
a la tabla ``articles`` en la base de datos . Ninguna de estas relaciones han sido
configuradas de ningún modo salvo creando clases y archivos que has tenido que crear de
todas formas.

+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Ejemplo        | articles                    | menu_links              |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Tabla base     | articles                    | menu_links              | Nombres de tablas que se corresponden a modelos      |
| de datos       |                             |                         | son en plural y con guión bajo '_'.                  |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Archivo        | ArticlesController.php      | MenuLinksController.php |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Tabla          | ArticlesTable.php           | MenuLinksTable.php      | Los nombres de clase de las tablas son en plural,    |
|                |                             |                         | formato 'CamelCased' y acaban con el sufijo 'Table'  |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Entidad        | Article.php                 | MenuLink.php            | Los nombres de clase de las entidades son en         |
|                |                             |                         | singular y 'CamelCased': Article and MenuLink        |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Clase          | ArticlesController          | MenuLinksController     |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Controlador    | ArticlesController          | MenuLinksController     | Plural, CamelCased, acaba en 'Controller'            |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plantillas     | Articles/index.php          | MenuLinks/index.php     | Los archivos de plantillas de vistas son nombrados   |
| de             | Articles/add.php            | MenuLinks/add.php       | según las funciones que el controlador muestra,      |
| vistas         | Articles/edit.php           | MenuLinks/add.php       | en minúscula y guión bajo                            |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Comportamiento | ArticlesBehavior.php        | MenuLinksBehavior.php   |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Vista          | ArticlesView.php            | MenuLinksView.php       |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Ayudante       | ArticlesHelper.php          | MenuLinksHelper.php     |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Componente     | ArticlesComponent.php       | MenuLinksComponent.php  |                                                      |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plugin         | Mal: cakephp/articles       | cakephp/menu-links      | Útil añadir el prefijo "cakephp-" a los plugins      |
|                | Bien: you/cakephp-articles  | you/cakephp-menu-links  | en el nombre del paquete. No uses el espacio de      |
|                |                             |                         | nombre (cakephp) como nombre de vendor ya que está   |
|                |                             |                         | para los plugins propiedad de CakePHP. La            |
|                |                             |                         | convención es usar letras minúsculas y guiones       |
|                |                             |                         | como separadores.                                    |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+
| Cada fichero estará localizado en la 'carpeta/espacio de nombre' apropiado dentro de la carpeta de tu aplicación.             |
+----------------+-----------------------------+-------------------------+------------------------------------------------------+

Database Convention Summary
===========================
+-----------------+--------------------------------------------------------------+
| Claves foráneas | Las relaciones son reconocidas por defecto como el           |
|                 | nombre (singular) de la tabla relacionada,                   |
| hasMany         | seguida de ``_id``.                                          |
| belongsTo/      | Para Users 'hasMany' Articles, la tabla ``articles``         |
| hasOne          | hará referencia a ``users`` a través de la                   |
| BelongsToMany   | clave foránea ``user_id``.                                   |
|                 |                                                              |
+-----------------+--------------------------------------------------------------+
| Múltiples       | ``menu_links`` cuyo nombre contiene múltiples palabras,      |
| palabras        | su clave foránea será ``menu_link_id``.                      |
+-----------------+--------------------------------------------------------------+
| Auto Increment  | Además de utilizar claves auto-incrementales como claves     |
|                 | primarias, también puedes utilizar columnas UUID.            |
|                 | CakePHP creará un único UUID de 36 caracteres                |
|                 | usando (:php:meth:`Cake\\Utility\\Text::uuid()`)             |
|                 | cada vez que guardes un nuevo registro                       |
|                 | usando el método ``Table::save()`` .                         |
+-----------------+--------------------------------------------------------------+
| Join tables     | Deberán ser nombradas según las tablas que unirán o el       |
|                 | comando de 'bake' no funcionará y ordenarse alfabéticamente  |
|                 | (``articles_tags`` en vez de ``tags_articles``).             |
|                 | Si tiene campos adicionales que guardan información, debes   |
|                 | crear un archivo de entidad y modelo para esa tabla.         |
+-----------------+--------------------------------------------------------------+

Ahora que te has introducido en los fundamentos de CakePHP. puedes tratar de
realizar el tutorial :doc:`/tutorials-and-examples/cms/installation` para ver
como las cosas encajan juntas.

.. meta::
    :title lang=es: Convenciones CakePHP
    :keywords lang=es: experiencia desarrollo web,pesadilla mantenimiento,método index,legado sistemas,nombres métodos,clases php,sistema uniforme,archivos configuración,tenets,artículos,convenciones,controlador convencional,mejores prácticas,visibilidad,nuevos artículos,funcionalidad,lógica,cakephp,desarrolladores
