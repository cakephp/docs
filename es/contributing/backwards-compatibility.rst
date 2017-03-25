Guía de compatibilidad hacia atrás
##################################

Asegurar que puedas actualizar tus aplicaciones fácilmente es importante para
nosotros. Por ello sólo rompemos la compatibilidad en las liberaciones de 
versiones ``major``. Puedes familiarizarte con el `versionado semántico 
<http://semver.org/lang/es/>`_, el cual utilizamos en todos los proyectos
de CakePHP. Pero resumiendo, el versionado semántico significa que sólo las 
liberaciones de versiones ``major`` (tales como 2.0, 3.0, 4.0) pueden romper la
compatibilidad hacia atrás. Las liberaciones ``minor`` (tales como 2.1, 3.1, 3.2) 
pueden introducir nuevas funcionalidades pero no pueden romper la compatibilidad.
Los lanzamientos de correcciones de errores (tales como 3.0.1) no añaden nuevas
funcionaliades, sólo correcciones de errores o mejoras de rendimiento.

.. note::

    CakePHP empezó a seguir el versionado semántico a partir de la 2.0.0. Estas
    reglas no se aplican en las versiones 1.x.

Para aclarar que cambios puedes esperar de cada nivel de lanzamiento tenemos
más información detallada para desarrolladores que utilizan CakePHP y que
trabajan en él que ayudan a aclarar que puede hacerse en liberaciones ``minor``.
Las liberaciones ``major`` pueden tener tantas rupturas de compatibilidad como 
sean necesarias.

Guías de migración
==================

Para cada liberación ``major`` y ``minor`` el equipo de CakePHP facilitará una
guía de migración. Estas guías explican las nuevas funcionaliades y cualquier
ruptura de compatibilidad que haya en cada lanzamiento. Pueden encontrarse en
la sección :doc:`/appendices` del ``cookbook``.

Usar CakePHP
============

Si estás desarrollando tu aplicación con CakePHP las siguientes pautas
explican la estabilidad que puedes esperar.

Interfaces
----------

Con excepción de las liberaciones ``major``, las interfaces que provee CakePHP 
**no** tendrán ningún cambio en los métodos existentes. Podrán añadirse nuevos
métodos pero no habrá cambios en los ya existentes.

Clases
------

Las clases que proporciona CakePHP pueden estar construidas y tener sus métodos y 
propiedades públicos usados por el código de la aplicación y, a excepción
de las liberaciones ``major``, la compatibilidad hacia atrás está garantizada.

.. note::

	Algunas clases en CakePHP están marcadas con la etiqueta API doc ``@internal``.
	Estas clases **no** son estables y no garantizan la compatibilidad hacia atrás.	

En liberaciones ``minor`` pueden añadirse nuevos métodos a las clases y a los ya
existentes nuevos argumentos. Cualquier argumento nuevo tendrá un valor por 
defecto, pero si sobreescribes métodos con una firma diferente puedes encontrar
``fatal errors``. Los métodos con nuevos argumentos estarán documentados en las
guías de migración..

La siguiente tabla esboza varios casos de uso y que compatibilidad puedes esperar
de CakePHP:

+---------------------------------------+--------------------------+
| Si tu...                              | ¿Compatible hacia atrás? |
+=======================================+==========================+
| Tipificas contra la clase             | Si                       |
+---------------------------------------+--------------------------+
| Creas una nueva instancia             | Si                       |
+---------------------------------------+--------------------------+
| Extiendes la clase                    | Si                       |
+---------------------------------------+--------------------------+
| Accedes a una propiedad pública       | Si                       |
+---------------------------------------+--------------------------+
| Llamas un método público              | Si                       |
+---------------------------------------+--------------------------+
| **Extiendes una clase y...**                                     |
+---------------------------------------+--------------------------+
| Sobrescribes una propiedad pública    | Si                       |
+---------------------------------------+--------------------------+
| Accedes a una propiedad protegida     | No [1]_                  |
+---------------------------------------+--------------------------+
| Sobreescribes una propiedad protegida | No [1]_                  |
+---------------------------------------+--------------------------+
| Sobreescribes un método protegido     | No [1]_                  |
+---------------------------------------+--------------------------+
| Llamas a un método protegido          | No [1]_                  |
+---------------------------------------+--------------------------+
| Añades una propiedad pública          | No                       |
+---------------------------------------+--------------------------+
| Añades un método público              | No                       |
+---------------------------------------+--------------------------+
| Añades un argumento                   | No [1]_                  |
| a un método sobreescrito              |                          |
+---------------------------------------+--------------------------+
| Añades un valor por defecto           | Si                       |
| a un argumento de método              |                          |
| existente                             |                          |
+---------------------------------------+--------------------------+

Trabajando en CakePHP
=====================

Si estás ayudando a que CakePHP sea aún mejor, por favor, ten en mente las
siguientes pautas cuando añadas/cambies funcionalidades:

En una liberación ``minor`` puedes:

+---------------------------------------+--------------------------+
| En una liberación ``minor`` puedes...                            |
+=======================================+==========================+
| **Clases**                                                       |
+---------------------------------------+--------------------------+
| Eliminar una clase                    | No                       |
+---------------------------------------+--------------------------+
| Eliminar una interfaz                 | No                       |
+---------------------------------------+--------------------------+
| Eliminar un ``trait``                 | No                       |
+---------------------------------------+--------------------------+
| Hacer final                           | No                       |
+---------------------------------------+--------------------------+
| Hacer abstract                        | No                       |
+---------------------------------------+--------------------------+
| Cambiar el nombre                     | Si [2]_                  |
+---------------------------------------+--------------------------+
| **Propiedades**                                                  |
+---------------------------------------+--------------------------+
| Añadir una propiedad pública          | Si                       |
+---------------------------------------+--------------------------+
| Eliminar una propiedad pública        | No                       |
+---------------------------------------+--------------------------+
| Añadir una propiedad protegida        | Si                       |
+---------------------------------------+--------------------------+
| Eliminar una propiedad protegida      | Si [3]_                  |
+---------------------------------------+--------------------------+
| **Métodos**                                                      |
+---------------------------------------+--------------------------+
| Añadir un método público              | Si                       |
+---------------------------------------+--------------------------+
| Eliminar un método público            | No                       |
+---------------------------------------+--------------------------+
| Añadir un método protegido            | Si                       |
+---------------------------------------+--------------------------+
| Mover a la clase padre                | Si                       |
+---------------------------------------+--------------------------+
| Eliminar un método protegido          | Si [3]_                  |
+---------------------------------------+--------------------------+
| Reducir visibilidad                   | No                       |
+---------------------------------------+--------------------------+
| Cambiar nombre del método             | Si [2]_                  |
+---------------------------------------+--------------------------+
| Añadir un argumento nuevo con         | Si                       |
| valor por defecto                     |                          |
+---------------------------------------+--------------------------+
| Añadir un nuevo argumento obligatorio | No                       |
| a un método existente                 |                          |
+---------------------------------------+--------------------------+
| Eliminar un valor por defecto de      | No                       |
| un argumento existente                |                          |
+---------------------------------------+--------------------------+


.. [1] Tu código *puede* romperse en lanzamientos ``minor``. 
       Comprueba la guía de migración para más detalles.
.. [2] Puedes cambiar el nombre de una clase/método siempre y cuando el 
       antiguo nombre se mantenga disponible. Esto es evitado generalmente a
       menos que el cambio de nombre sea significativamente beneficioso.
.. [3] Evitarlo cuando sea posible. Cualquier borrado tendrá que ser documentado
       en la guía de migración.

.. meta::
    :title lang=es: Guía de compatibilidad hacia atrás
    :keywords lang=es:
