CakePHP Development Process
###########################

Los proyectos de CakePHP en general siguen `semver <https://semver.org/>`__. Ésto significa que:

- Las versiones se numeran en el formato **A.B.C**
- Las versiones **A** son *lanzamientos principales*. Contienen cambios importantes y
  requerirán una cantidad significativa de trabajo para actualizar desde una version **A** inferior.
- Las versiones **A.B** son *lanzamientos de mejoras*. Cada versión será compatible con
  las anteriores, pero puede marcar algunas características como **obsoletas**. Si es absolutamente
  necesario realizar un cambio que rompa la compatibilidad, se indicará en la guía de migración para ese lanzamiento.
- Las versiones **A.B.C** son *lanzamientos de parches*. Deben ser compatibles con el lanzamiento de parche anterior. La excepción
  a esta regla es si se descubre un problema de seguridad y la única solución es romper una API existente.

Consulta el :doc:/contributing/backwards-compatibility para ver lo que consideramos como compatible con versiones previas y cambios que rompen la compatibilidad.

Lanzamientos Principales
=========================

Los lanzamientos principales introducen nuevas características y pueden eliminar funcionalidades que se hayan
marcado como obsoletas en un lanzamiento anterior. Estos lanzamientos se encuentran en las ramas ``next``
que coinciden con su número de versión, como ``5.next``. Una vez que se lanzan, se promocionan a la rama
``master`` y luego la rama ``5.next`` se utiliza para futuros lanzamientos de características.

Lanzamientos de Mejoras
========================

Los lanzamientos de mejoras son donde se envían nuevas funcionalidades o extensiones a las funcionalidades
existentes. Cada serie de lanzamientos que recibe actualizaciones tendrá una rama ``next``, por ejemplo, ``4.next``.
Si deseas contribuir con una nueva característica, por favor dirígete a estas ramas.

Lanzamientos de Parches
========================

Los lanzamientos de parches corrigen errores en el código/documentación existente y siempre deben ser compatibles
con los lanzamientos de parches anteriores de la misma serie. Estos lanzamientos
se crean a partir de las ramas estables. Las ramas estables a menudo se nombran según la serie de lanzamientos, como ``3.x``.

Frecuencia de Lanzamiento
==========================

- Los *Lanzamientos Principales* se entregan aproximadamente cada dos o tres años. Este período de tiempo nos obliga a
  ser deliberados y considerados con los cambios que rompen la compatibilidad, y brinda tiempo a la comunidad para
  ponerse al día sin sentir que se están quedando atrás.
- Los *Lanzamientos de Mejoras* se entregan cada cinco a ocho meses.
- Los *Lanzamientos de Parches* se entregan inicialmente cada dos semanas. A medida que un lanzamiento de características madura, esta frecuencia se relaja a una entrega mensual.

Política de Obsolescencia
==========================

Antes de que una característica pueda ser eliminada en un lanzamiento principal, necesita ser marcada como obsoleta. Cuando
una funcionalidad se marca como obsoleta en el lanzamiento **A.x**, seguirá funcionando durante el resto de todos los lanzamientos
**A.x**. Las obsolescencias generalmente se indican mediante advertencias en PHP. Puedes habilitar las advertencias de obsolescencia
agregando ``E_USER_DEPRECATED`` al valor de ``Error.level`` de tu aplicación.

El comportamiento marcado como obsoleto no se elimina hasta el próximo lanzamiento principal. Por ejemplo, un comportamiento marcado como obsoleto en ``4.1`` se eliminará en ``5.0``.

.. meta::
    :title lang=es: Proceso de Desarrollo CakePHP
    :keywords lang=en: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
