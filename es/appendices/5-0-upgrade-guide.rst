5.0 Guía de actualización
#########################

En primer lugar, compruebe que su aplicación se está ejecutando en la última versión de CakePHP 4.x.

Arreglar avisos de obsolescencia
================================

Una vez que su aplicación se ejecuta en la última version de CakePHP 4.x, activar advertencias de obsoletos en **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL,
    ]

Ahora que puede ver todas las advertencias, asegúrese de que están corregidas antes de proceder con la actualización.

Algunas obsolescencia potencialmente impactantes que debes asegurarte de haber abordado
son:

- ``Table::query()`` was deprecated in 4.5.0. Use ``selectQuery()``,
  ``updateQuery()``, ``insertQuery()`` and ``deleteQuery()`` instead.

Actualiza a PHP 8.1
===================

Si no estas ejecutando en **PHP 8.1 o superior**, tendrás que actualizar PHP antes de actualizar CakePHP.

.. note::
    CakePHP 5.0 requiere **un mínimo de PHP 8.1**.

.. _upgrade-tool-use:

Usar la herramienta de actualización
====================================

.. note::
    La herramienta de actualización sólo funciona en aplicaciones que se ejecutan en cakePHP 4.x. No puedes ejecutar la herramienta de actualización después de actualizar a CakePHP 5.0.

Debido a que CakePHP 5 aprovecha los tipos de unión y ``mixed``, existen muchos
cambios incompatibles con versiones anteriores relativas a las definiciones de los métodos y cambios de nombre archivos.
Para ayudar a acelerar los arreglos de estos cambios tediosos, existe una herramienta CLI de actualización:

.. code-block:: console

    # Instalar la herramienta de actualización
    git clone https://github.com/cakephp/upgrade
    cd upgrade
    git checkout 5.x
    composer install --no-dev

Con la herramienta de actualización instalada, ahora puedes ejecutarla en su aplicación o
plugin::

    bin/cake upgrade rector --rules cakephp50 <path/to/app/src>
    bin/cake upgrade rector --rules chronos3 <path/to/app/src>

Actualizar dependencias de CakePHP
==================================

Después de aplicar las refactorizaciones de Rector necesitas actualizar CakePHP, sus plugins, PHPUnit
y tal vez otras dependencias en el ``composer.json``.
Este proceso depende de gran medida de tu aplicación por lo que te recomendamos que compares el
``composer.json`` con el que está presente en `cakephp/app
<https://github.com/cakephp/app/blob/5.x/composer.json>`__.

After the version strings are adjusted in your ``composer.json`` execute
``composer update -W`` and check its output.

Actualiza los archivos de la aplicación basándose en las últimas plantillas
===========================================================================

A continuación, asegúrate de que el resto de tu aplicación esté actualizado basándose en la última version de `cakephp/app
<https://github.com/cakephp/app/blob/5.x/>`__.

.. meta::
    :title lang=es: 5.0 Guía de actualización
    :keywords lang=es: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
