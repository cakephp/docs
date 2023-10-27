Tutorial CMS - Creando la Base de Datos
#######################################

Ahora que tenemos CakePHP instalado, configuremos la base de datos para nuestro :abbr:`CMS
(Sistema de Gestión de Contenidos)`. Si aún no lo ha hecho, cree una base de datos vacía
para usar en este tutorial, con un nombre de su elección, p. ej. ``cake_cms``.
Si está utilizando MySQL/MariaDB, puede ejecutar el siguiente SQL para crear las
tablas necesarias:

.. code-block:: SQL

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, NOW(), NOW());

Si está utilizando PostgreSQL, conéctese a la base de datos ``cake_cms`` y ejecute el
siguiente SQL en su lugar:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created TIMESTAMP,
        modified TIMESTAMP
    );

    CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (slug),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        title VARCHAR(191),
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (title)
    );

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id),
        FOREIGN KEY (article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', TRUE, NOW(), NOW());


Es posible que haya notado que la tabla ``articles_tags`` utiliza una clave primaria
compuesta. CakePHP admite claves primarias compuestas en casi todas partes, lo que le permite
tener esquemas más simples que no requieren columnas ``id`` adicionales.

Los nombres de tabla y columna que usamos no fueron arbitrarios. Al usar las
:doc:`convenciones de nomenclatura </intro/conventions>` de CakePHP, podemos aprovechar CakePHP más
eficazmente y evitar la necesidad de configurar el framework. Si bien CakePHP es lo
suficientemente flexible para adaptarse a casi cualquier esquema de base de datos,
adherirse a las convenciones le ahorrará tiempo, ya que puede aprovechar los valores
predeterminados basados en convenciones que ofrece CakePHP.

Configuración de la base de datos
=================================

A continuación, digamos a CakePHP dónde está nuestra base de datos y cómo conectarse a ella. Reemplace
los valores en el arreglo ``Datasources.default`` en su archivo **config/app_local.php** con los que aplican
a su configuración. Una arreglo de configuración completo de muestra podría tener el siguiente aspecto::

    <?php
    // config/app_local.php
    return [
        // Más configuración arriba.
        'Datasources' => [
            'default' => [
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'url' => env('DATABASE_URL', null),
            ],
        ],
        // Más configuración abajo.
    ];

Una vez que haya guardado su archivo **config/app_local.php**, debería ver que la sección
'CakePHP is able to connect to the database' tiene un gorro de cocinero verde.

.. note::

    El fichero **config/app_local.php** se utiliza para sobreescribir los valores por defecto de la
    configuración en **config/app.php**. Esto facilita la configuración en los entornos de desarrollo.

Creando nuestro primer modelo
=============================

Los modelos son el corazón de las aplicaciones CakePHP. Nos permiten leer y modificar
nuestros datos. Nos permiten construir relaciones entre nuestros datos, validarlos y
aplicar reglas de aplicación. Los modelos construyen las bases necesarias para construir
nuestras acciones y plantillas del controlador.

Los modelos de CakePHP se componen de objetos ``Table`` y ``Entity``. Los objetos ``Table``
brindan acceso a la colección de entidades almacenadas en una tabla específica. Se almacenan
en **src/Model/Table**. El archivo que crearemos se guardará en **src/Model/Table/ArticlesTable.php**.
El archivo completo debería verse así::

    <?php
    // src/Model/Table/ArticlesTable.php
    declare(strict_types=1);

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            parent::initialize($config);
            $this->addBehavior('Timestamp');
        }
    }

Hemos agregado el comportamiento :doc:`/orm/behaviors/timestamp` que automáticamente
llenará las columnas ``created`` y ``modified`` de nuestra tabla. Al nombrar nuestro
objeto ``Table`` ``ArticlesTable``, CakePHP puede usar convenciones de nomenclatura
para saber que nuestro modelo usa la tabla `articles`` de la base de datos. CakePHP
también usa convenciones para saber que la columna ``id`` es la clave primaria de nuestra tabla.

.. note::

    CakePHP creará dinámicamente un objeto modelo para usted si no puede encontrar
    un archivo correspondiente en **src/Model/Table**. Esto también significa que
    si accidentalmente asigna un nombre incorrecto a su archivo (es decir, articlestable.php o
    ArticleTable.php), CakePHP no reconocerá ninguna de sus configuraciones y
    utilizará el modelo generado en su lugar.

También crearemos una clase ``Entity`` para nuestros artículos. Las ``Entity`` representan
un solo registro en la base de datos y proporcionan un comportamiento a nivel de fila para
nuestros datos. Nuestra ``Entity`` se guardará en **src/Model/Entity/Article.php**. El
archivo completo debería verse así::

    <?php
    // src/Model/Entity/Article.php
    declare(strict_types=1);

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected array $_accessible = [
            'title' => true,
            'body' => true,
            'published' => true,
            'created' => true,
            'modified' => true,
            'users' => true,
        ];
    }

Nuestra entidad es bastante delgada en este momento, y solo hemos configurado
la propiedad ``_accessible`` que controla cómo las propiedades pueden ser
modificadas por `entities-mass-assignment`.

No podemos hacer mucho con nuestros modelos en este momento, así que a continuación
crearemos nuestro primer `Controller y Template </tutorials-and-examples/cms/articles-controller>`
para permitirnos interactuar con nuestro modelo.
