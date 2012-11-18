Gestión del Esquema de la BBDD y Migraciones
############################################

El SchemaShell proporciona la funcionalidad para crear un esquema de
objetos, volcados del esquema sql, así como crear y restaurar
instantáneas de base de datos.

Generando y Usando Archivos de Esquemas
=======================================

Un archivo de esquema permite transportar fácilmente el esquema de la
base de datos, sin importar en qué motor se vaya a implementar. Puedes
generar un archivo de esquema de la base de datos usando:

::

    $ cake schema generate

Esto generará un archivo llamado schema.php en tu directorio
``app/config/sql``.

La aplicación SchemaShell procesará sólo las tablas para las cuales
existe un modelo definido. Para forzar a que cree un esquema de todas
las tablas, debes añadir la opción ``-f`` en la línea de comandos.

Para reconstruir el esquema de la base de datos a partir de un archivo
schema.php generado anteriormente, debes ejecutar:

::

    $ cake schema run create

Esto borrará y volverá a crear todas las tablas basándose en el
contenido del archivo schema.php.

Los archivos de esquema pueden ser usado para genera volcados de SQL.
Para generar un archivo SQL que contenga las sencencias ``CREATE TABLE``
ejecuta:

::

    $ cake schema dump volcado.sql

Donde volcado.sql es el nombre que deseas ponerle al volcado. Si omites
este nombre, el volcado será mostrado por pantalla sin ser escrito en
ningún archivo.

Migrations with CakePHP schema shell
====================================

Migrations allow for versioning of your database schema, so that as you
develop features you have an easy and database agnostic way to
distribute database changes. Migrations are achieved through either SCM
controlled schema files or schema snapshots. Versioning a schema file
with the schema shell is quite easy. If you already have a schema file
created running

::

    $ cake schema generate

Will bring up the following choices:

::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

Choosing [s] (snapshot) will create an incremented schema.php. So if you
have schema.php, it will create schema\_2.php and so on. You can then
restore to any of these schema files at any time by running:

::

    $ cake schema update -s 2

Where 2 is the snapshot number you wish to run. The schema shell will
prompt you to confirm you wish to perform the ``ALTER`` statements that
represent the difference between the existing database the currently
executing schema file.

You can perform a dry run by adding a ``-dry`` to your command.
