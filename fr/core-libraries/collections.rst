Collections
###########

Les Components, les Helpers, les Behaviors et les Tasks partagent tous
une structure similaire et des comportements. CakePHP 2.0 fournit
maintenant une API unifiée pour interagir avec les objets collections
similaires. L'objet collection dans cakePHP vous donne un moyen uniforme
d'interagir avec différentes sortes d'objets dans votre application.

Même si les exemples ci-dessous utiliseront des Components, le même
comportement peut être envisagé pour les Helpers, Behaviors, et des Tasks en
plus des components.

Charger et Décharger les objets
===============================

Le chargement d'objets sur n'importe quelle collection peut être effectué
en utilisant la méthode ``load()``::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

Au chargement du component, si il n'est pas chargé dans la collection, une
nouvelle instance sera créée. Si le component est déjà chargé, une autre
instance ne sera pas créée. Au chargement des components, vous pouvez aussi
leurs fournir des configurations additionnelles::

    $this->Cookie = $this->Components->load('Cookie', array('name' => 'sweet'));

Tout couple clé/valeur fourni sera passée au constructeur de
Component. Une exception à cette règle est ``className``. ClassName est une
clé spéciale qui est utilisée pour créer des alias d'objets dans une
collection. Ceci permet d'avoir des noms de component qui ne reflètent pas
les noms de classes, ce qui peut être utile quand on étend les components du
noyau::

    $this->Auth = $this->Components->load('Auth', array('className' => 'MyCustomAuth'));
    $this->Auth->user(); // Utilise réellement MyCustomAuth::user();

L'inverse du chargement d'un objet, est son déchargement. Les objets déchargés
sont retirés de la mémoire, et n'auront pas de callbacks supplémentaires
déclenchés sur eux::

    $this->Components->unload('Cookie');
    $this->Cookie->read(); // Fatal error.

Déclenchement de callbacks
==========================

Les callbacks sont supportés par les collections d'objets. Quand une collection
a un callback déclenché, cette méthode sera appelée sur tous les objets activés
dans la collection. Vous pouvez passer des paramètres au boucle de callback 
comme ceci ::

    $this->Behaviors->trigger('afterFind', array($this, $results, $primary));

Ci-dessus ``$this`` sera passé comme premier argument à toutes les méthodes
afterFind des helpers. Il y a plusieurs options qui peuvent être utilisées
pour contrôler comment les callbacks sont tués:

- ``breakOn`` Défini à la valeur ou aux valeurs pour lesquels vous voulez
  stopper la propagation. Peut être une valeur scalaire, ou un tableau de
  valeur à stopper. ``False`` par défaut.

- ``break`` Défini à true pour valider l'arrêt. Quand un déclencheur est
  cassé, la dernière valeur sera retournée. Si utilisé en combinaison avec
  ``collectReturn` les résultats collectés seront retournés. ``False`` par
  défaut.

- ``collectReturn`` Défini à true pour collecter le retour de chaque objet
  dans un tableau. Ce tableau de données retournées sera retourné depuis
  l'appel trigger(). ``False`` par défaut.

- ``triggerDisabled`` Déclenchera le callback sur tous les objets dans la
  collection même ceux qui sont non-activés. ``False`` par défaut.

- ``modParams`` Permet à chacun des objets auquel le callback à fait des
  demandes de modifier les paramètres de l'objet suivant. Paramétrer
  modParams en valeur entière vous permettra de modifier le paramètre avec cet
  index. N'importe quelle valeur non-nulle modifiera l'index de paramètre
  indiqué. ``False`` par défaut.

Effacer des boucles de callback
-------------------------------

En utilisant les options ``break`` et ``breakOn`` vous pouvez annuler une
boucle de callback à mi-chemin semblable à interrompre la propagation
événementielle en JavaScript ::

    $this->Behaviors->trigger(
        'beforeFind', 
        array($this, $query), 
        array('break' => true, 'breakOn' => false)
    );

Dans l'exemple ci-dessus, si n'importe quel behavior retourne ``false``
depuis sa méthode beforeFind, il n'y aura pas d'autres callback appelés. Le
retour de ``trigger()`` sera false.

Activation et désactivation des objets
======================================

Une fois qu'un objet est chargé dans une collection vous pourriez avoir
besoin de le déactiver. Désactiver un objet dans une collection empêche
aux futurs callbacks d'être tués sur l'objet à moins que l'option
``triggerDisabled`` soit utilisée::

    // Désactive le Helper HTML
    $this->Helpers->disable('Html');
    
    // Ré-active le Helper plus tard
    $this->Helpers->enable('Html');

Les objets désactivés peuvent toujours avoir leur méthodes et propriétés
normales utilisées. La différence majeure entre un objet activé et désactivé
se fait en regard des callbacks. Vous pouvez interroger une collection pour
connaître les objets activés, ou vérifier si un objet spécifique
est toujours activé en utilisant ``enabled()``::

    // Vérifie si oui ou on un Helper spécifique est activé.
    $this->Helpers->enabled('Html');

    // $enabled contiendra un tableau des helpers actuellement activés.
    $enabled = $this->Helpers->enabled();


.. meta::
    :title lang=fr: Collections
    :keywords lang=fr: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory
