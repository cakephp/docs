Mises à jour
############

Toutes les versions de CakePHP suivent la convention de numérotation
**major.minor.patch**.

L'équipe de développement s'assure autant que possible que chaque version suive
les restrictions et garanties suivantes.

Mises à jour principales
------------------------

Les mises à jour principales ne sont généralement pas rétro-compatibles. Bien
que CakePHP essaye de ne pas changer trop de grandes fonctionnalités dans les
mises à jour principales, il y a des changements dans l'API.

Les changements dans une mise à jour principale peuvent porter sur pratiquement
n'importe quel élément mais sont toujours utilisées pour supprimer des
fonctionnalités dépréciées et mettre à jour des interfaces.

Les changements non rétro-compatibles se font toujours dans une mise à jour
principale.

Habituellement, chaque mise à jour principale est accompagnée d'un guide de
migration et de plusieurs mises à niveau du code avec l'outil rector.

Mise à jour mineures
--------------------

Les versions mineures sont généralement rétro-compatibles avec la précédente
version mineure et ses patchs.

Certaines fonctionnalités peuvent être dépréciées, mais elles ne sont jamais
supprimées dans une version mineure.

Les interfaces ne sont pas modifiées, mais des annotations peuvent être ajoutées
pour de nouvelles méthodes présentes dans les implémentations fournies par
CakePHP.

Les nouvelles fonctionnalités sont habituellement ajoutées uniquement dans les
versions mineures, de façon à ce que les utilisateurs puissent suivre les notes
de migration. Les nouvelles fonctionnalités peuvent aussi inclure la levée de
nouvelles exceptions lorsque le comportement est modifié ou que des bugs sont
signalés.

Les modifications de comportement qui nécessitent une documentation sont faites
dans des versions mineures, mais elles restent en principe rétro-compatibles. Il
peut être dérogé à cette règle en cas de problème grave.

.. note:
    Les versions mineures sont aussi appelées "versions point".
    
Patchs de mise à jour
---------------------

Les patchs de mise à jour sont toujours rétro-compatibles. Les modifications
ne portent que sur la correction de dysfonctionnements.

Habituellement, les utilisateurs peuvent compter sur le fait que les patchs de
mise à jour ne modifient pas le comportement, si ce n'est pour corriger un bug.

Les corrections qui modifient le comportement à long terme de l'application ne
sont en principe pas diffusées dans des patchs. Elles sont considérées comme des
modifications du comportement et entreront soit dans une mise à jour mineure,
soit dans une mise à jour majeure, de façon à ce que les utilisateurs puissent
mettre en œuvre la migration.

.. note:
    Les patchs de mise à jour sont aussi appelés "versions correctives".

Fonctionnalités expérimentales
------------------------------

Lorsqu'une nouvelle fonctionnalité est ajoutée et que son API n'est pas
définitive, elle peut être étiquetée **expérimental**.

Les fonctionnalités expérimentales suivent en principe les conventions ci-dessus
dans les versions mineures et les patchs. Cependant, des changements d'API
peuvent être introduits dans des versions mineures et modifier significativement
le comportement.

Les utilisateurs devraient toujours s'attendre à ce que l'API puisse changer
tant que les fonctionnalités expérimentales ne sont pas totalement validées.
