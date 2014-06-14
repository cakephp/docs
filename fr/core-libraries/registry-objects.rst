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

Le chargement des objets sur chaque type de registry peut être fait en utilisant
la méthode ``load()``::

    $this->Prg = $this->Components->load('Prg');
    $this->Prg->process();

Lors du chargement d'un component, si le component n'est pas actuellement
chargé dans le registry, une nouvelle instance va être créée. Si le component
est déjà chargé, une autre instance ne va pas être créée. Lors du chargement
des components, vous pouvez aussi leur fournir une configuration
supplémentaire::

    $this->Cookie = $this->Components->load('Cookie', ['name' => 'sweet']);

Toutes clés & valeurs fournies vont être passées au constructeur du Component
La seule exception à cette règle est ``className``. Classname est une clé
spéciale qui est utilisée pour faire des alias des objets dans un registry. Cela
vous permet d'avoir des noms de component qui ne correspondent pas aux noms de
classes, ce qui peut être utile quand vous étendez les components du coeur::

    $this->Auth = $this->Components->load('Auth', ['className' => 'MyCustomAuth']);
    $this->Auth->user(); // En fait utilise MyCustomAuth::user();

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
