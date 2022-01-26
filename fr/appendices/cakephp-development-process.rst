Le Processus de Développement CakePHP
#####################################

Les projets CakePHP suivent grosso modo `SemVer <https://semver.org/>`.
Cela signifie que:

- Les versions sont numérotées sous la forme **A.B.C**
- Les versions **A** sont les *versions majeures*. Elles contiennent des
  ruptures de comportement et nécessiteront une certaine quantité de travail
  pour une mise à niveau depuis une version **A** inférieure.
- Les versions **A.B** sont des *versions de fonctionnalités*. Chaque version
  est rétrocompatible mais peut introduire de nouvelles dépréciations. Si un
  changement de comportement est absolument nécessaire, il sera indiqué dans le
  guide de migration pour cette version.
- Les versions **A.B.C** sont des versions de *patch*. Elles sont en principe
  rétrocompatibles avec la précédente version patch. La seule exception à cette
  règle peut concerner la découverte d'une faille de sécurité, si la seule
  solution est de modifier l'API existante.

Consultez :doc:`/contributing/backwards-compatibility` pour en savoir plus sur
ce que nous considérons comme une rétrocompatibilité ou une rupture de
comportement.

Versions majeures
=================

Les versions majeures introduisent de nouvelles fonctionnalités et peuvent
supprimer des fonctionnalités dépréciées dans une précédente version. Ces
versions sont maintenues dans les branches ``next`` correspondant à leur numéro
de version, telles que ``5.next``. Une fois publiées, elles sont promues en
branche ``master`` et la branche ``5.next`` est utilisée pour de futures
versions de fonctionnalités.

Versions de fonctionnalités
===========================

Les versions de fonctionnalités sont l'endroit où sont introduites de nouvelles
fonctionnalités, ou des extensions de fonctionnalités existantes. Chaque série
de versions recevant des mises à jour a une branche ``next``, par exemple
``4.next``. Si vous souhaitez contribuer à une nouvelle fonctionnalité, veuillez
cibler ces branches.

Versions de patch
=================

Les versions de patch résolvent des bugs dans le code ou la documentation, et
sont censées être toujours compatibles avec les versions de patch antérieures de
la même version de fonctionnalités. Ces versions sont créées à partir des
branches stables. Les branches stables sont souvent nommées après d'après la
série de versions, telle que ``3.x``.

Cadence de livraison
====================

- Les *Versions Majeures* sont livrées approximativement tous les deux ou trois
  ans. Cette durée nous oblige à rester mesurés et attentifs sur les ruptures de
  compatibilité, et donne du temps à la communauté pour se maintenir à niveau
  sans avoir l'impression d'être à la traîne.
- Les *Versions de Fonctionnalités* sont livrées tous les cinq à huit mois.
- Les *Versions de Patch* sont livrées au départ toutes les deux semaines.
  Lorsqu'une version de fonctionnalité mûrit, cette cadence ralentit et devient
  mensuelle.

Politique de Dépréciations
==========================

Avant qu'une fonctionnalité ne soit supprimée dans une version majeure, elle
doit être dépréciée. Quand un comportement est déprécié dans une version
**A.x**, il continue à fonctionner dans toutes les versions restantes **A.x**.
Les dépréciations sont généralement indiquées par des avertissements PHP. Vous
pouvez activer les avertissements de dépréciation en ajoutant
``E_USER_DEPRECATED`` à la valeur de ``Error.level`` dans votre application.

Une fois déprécié, le comportement ne sera pas supprimé avant la prochaine
version majeurs. Par exemple, un comportement déprécié dans ``4.1`` sera
supprimé dans ``5.0``.

.. meta::
    :title lang=fr: CakePHP Development Process
    :keywords lang=fr: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
