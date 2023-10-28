Política de Versiones
#####################

CakePHP sigue la versión semántica para todas sus versiones. Esto sigue la convención de versionado de **importante.menor.parche**.

El equipo de desarrollo intenta garantizar que cada versión siga las restricciones y garantías a continuación.

Versiones Importantes
---------------------

Las versiones importantes generalmente no son retrocompatibles. Aunque CakePHP intenta no cambiar muchas características importantes en las versiones importantes, hay cambios en la API.

Los cambios en las versiones importantes pueden incluir casi cualquier cosa, pero siempre se utilizan para eliminar características obsoletas y actualizar interfaces.

Cualquier cambio de comportamiento que no sea retrocompatible se realiza en cambios importantes.

Cada versión importante suele venir con una guía de actualización y muchas actualizaciones automáticas de código utilizando rector.

Versiones Menores
-----------------

Las versiones menores son generalmente retrocompatibles con la versión menor y el parche anterior.

Las características pueden ser obsoletas, pero nunca se eliminan en una versión menor.

Las interfaces no se cambian, pero se pueden agregar anotaciones para nuevos métodos expuestos en las implementaciones proporcionadas por CakePHP.

Las nuevas características generalmente solo se agregan en versiones menores para que los usuarios puedan seguir las notas de migración. Las nuevas características también pueden incluir nuevas excepciones lanzadas cuando se corrige un comportamiento o se informan errores.

Los cambios de comportamiento que requieren documentación se realizan en las versiones menores, pero generalmente son retrocompatibles. Se pueden hacer algunas excepciones si el problema es grave.

.. nota::
    Las versiones menores también se conocen como versiones de puntos.

Versiones de Parches
--------------------

Las versiones de parches siempre son retrocompatibles. Solo se realizan cambios que solucionan características rotas.

Por lo general, los usuarios deberían poder confiar en que las versiones de parches no cambiarán el comportamiento, excepto para solucionar un problema.

Los problemas que cambian un comportamiento de larga data generalmente no se encuentran en versiones de parches. Estos se consideran cambios de comportamiento y se incluirán en versiones menores o importantes para que los usuarios puedan migrar.

.. nota::
    Las versiones de parches también se conocen como versiones de corrección de errores.

Funciones Experimentales
------------------------

Cuando se agrega una nueva característica donde la API todavía está cambiando, puede marcarse como **experimental**.

Las características experimentales deben seguir la misma convención de versiones menores y de corrección de errores. Sin embargo, los cambios en la API pueden ir en versiones menores, lo que podría cambiar significativamente el comportamiento.

Los usuarios siempre deben esperar que la API cambie antes de que las características experimentales se lancen por completo.
