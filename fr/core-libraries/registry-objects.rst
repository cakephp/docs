Objets Registry
###############

Les classes registry sont une façon simple de créer et récupérer les
instances chargées d'un type d'objet donné. Il y a des classes registry pour les
Components, les Helpers, les Tasks, et les Behaviors.

Dans les exemples ci-dessous, on va utiliser les Components, mais le même
comportement peut être attendu pour les Helpers, les Behaviors, et les Tasks en
plus des Components.

Charger les Objets
==================

Les objets peuvent être chargés à la volée en utilisant add<registry-object>()
Exemple::

    $this->addComponent('DebugKit.Toolbar');
    $this->addHelper('Flash')

Va permettre de définir `Toolbar property` et `Flash helper`.
La configuration peut aussi être définie à la volée. Exemple::

    $this->addComponent('Cookie', ['name' => 'sweet']);

Toutes clés & valeurs fournies vont être passées au constructeur du Component
La seule exception à cette règle est ``className``. Classname est une clé
spéciale qui est utilisée pour faire des alias des objets dans un registry. Cela
vous permet d'avoir des noms de component qui ne correspondent pas aux noms de
classes, ce qui peut être utile quand vous étendez les components du coeur::

    $this->Auth = $this->addComponent('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // utilise en fait MyCustomAuth::user();

Attraper les Callbacks
======================

Les Callbacks ne sont pas fournis par les objets registry. Vous devez utiliser
les :doc:`events system </core-libraries/events>` pour dispatcher tout
events/callbacks dans votre application.

Désactiver les Callbacks
========================

Dans les versions précédentes, les objets collection fournissaient une méthode
``disable`` pour désactiver les objets à partir des callbacks reçus. Pour le
faire maintenant, vous devez utiliser les fonctionnalités dans le système
d'evènements. Par exemple, vous pouvez désactiver les callbacks du component
de la façon suivante::

    // Retire Auth des callbacks.
    $this->eventManager()->detach($this->Auth);

    // Re-active Auth pour les callbacks.
    $this->eventManager()->attach($this->Auth);


.. meta::
    :title lang=fr: Objet Registry
    :keywords lang=fr: nom tableau,chargement components,plusieurs types différents,api uni,charger objects,noms component,clé speciale,components coeur,callbacks,prg,callback,alias,fatal error,collections,memoire,priorité,priorités
