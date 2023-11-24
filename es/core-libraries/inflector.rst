Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

La clase `Inflector` toma una cadena y puede manipularla para manejar variaciones de palabras como
pluralización o conversión a formato camello (camelCase). Por lo general, se accede a esta clase de
manera estática. Por ejemplo:

``Inflector::pluralize('example')`` devuelve "examples".

Puedes probar las inflecciones en línea en `inflector.cakephp.org
<https://inflector.cakephp.org/>`_ or `sandbox.dereuromark.de
<https://sandbox.dereuromark.de/sandbox/inflector>`_.

.. _inflector-methods-summary:

Métodos integrados en Inflector y su resultado
==============================================

Los métodos integrados en el Inflector y los resultados que generan al proporcionarles un argumento compuesto por varias palabras:

+-------------------+---------------+---------------+
| Método            | Argumento     | Resultado     |
+===================+===============+===============+
| ``pluralize()``   | BigApple      | BigApples     |
+                   +---------------+---------------+
|                   | big_apple     | big_apples    |
+-------------------+---------------+---------------+
| ``singularize()`` | BigApples     | BigApple      |
+                   +---------------+---------------+
|                   | big_apples    | big_apple     |
+-------------------+---------------+---------------+
| ``camelize()``    | big_apples    | BigApples     |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``underscore()``  | BigApples     | big_apples    |
+                   +---------------+---------------+
|                   | Big Apples    | big apples    |
+-------------------+---------------+---------------+
| ``humanize()``    | big_apples    | Big Apples    |
+                   +---------------+---------------+
|                   | bigApple      | BigApple      |
+-------------------+---------------+---------------+
| ``classify()``    | big_apples    | BigApple      |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``dasherize()``   | BigApples     | big-apples    |
+                   +---------------+---------------+
|                   | big apple     | big apple     |
+-------------------+---------------+---------------+
| ``tableize()``    | BigApple      | big_apples    |
+                   +---------------+---------------+
|                   | Big Apple     | big apples    |
+-------------------+---------------+---------------+
| ``variable()``    | big_apple     | bigApple      |
+                   +---------------+---------------+
|                   | big apples    | bigApples     |
+-------------------+---------------+---------------+

Generando formas Plural y Singular
==================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Both ``pluralize`` and ``singularize()`` work on most English nouns. If you need
to support other languages, you can use :ref:`inflection-configuration` to
customize the rules used::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` no debería ser usado en un nombre que ya está en su forma plural.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::

    ``singularize()``  no debería ser usado en un nombre que ya está en su forma singular.

Generando formas CamelCase y under_scored
=========================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

Estos métodos son útiles cuando creas nombres de clases o de propiedades::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

Nótese que el método *underscore* sólo convertirá palabras en formato *CamelCase*.
Palabras que contengan espacios serán transformadas a minúscula pero no contendrán un guión bajo.

Generando formas legibles por humanos
=====================================

.. php:staticmethod:: humanize($underscored)

Este método es útil cuando se quiere convertir una palabra de la forma *under_scored* al formato "Título" para que sea legible por un ser humano::

    // Apple Pie
    Inflector::humanize('apple_pie');

Generando formas de tabla y nombre de clase
===========================================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

Cuando se genera código, o usando las convenciones de CakePHP, puedes necesitar generar inflecciones para los nombres de tabla o de clase::

    // UserProfileSetting
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

Generando Nombres de Variables
==============================

.. php:staticmethod:: variable($underscored)

Los nombres de variable son a menudo útiles cuando se hacen tareas de meta-programación que involucran generar código o hacer trabajo basado en convenciones::

    // applePie
    Inflector::variable('apple_pie');


.. _inflection-configuration:

Configurando las Inflecciones
=============================

Las convenciones de nomenclatura de CakePHP pueden ser muy útiles: puedes nombrar tu
tabla de base de datos como ``big_boxes``, tu modelo como ``BigBoxes``, tu controlador
como ``BigBoxesController``, y todo funcionará automáticamente juntos. La forma en que
CakePHP sabe cómo vincular las cosas es *inflectando* las palabras entre sus formas
singular y plural.

Existen ocasiones (especialmente para nuestros amigos que no hablan inglés) en las que
podrías encontrarte con situaciones donde el inflector de CakePHP (la clase que pluraliza,
singulariza, utiliza notación camello y subrayados) puede no funcionar como deseas. Si
CakePHP no reconoce tus "Foci" o "Fish", puedes indicarle a CakePHP acerca de tus casos especiales.

Cargando Inflecciones Personalizadas
------------------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Define nuevas reglas de inflexión y transliteración para que Inflector las utilice. A menudo, este método se utiliza
en tu archivo **config/bootstrap.php**::

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // The key is singular form, value is plural form

Las reglas suministradas se fusionarán en los conjuntos de inflexión respectivos definidos en ``Cake/Utility/Inflector``,
y las reglas añadidas tendrán prioridad sobre las reglas principales del núcleo. Puedes usar ``Inflector::reset()``
para eliminar las reglas y restaurar el estado original del Inflector.

.. meta::
    :title lang=es: Objeto Inflector
    :keywords lang=en: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
