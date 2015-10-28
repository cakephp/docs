Etendre Bake
############

Bake dispose d'une architecture extensible qui permet à votre application ou
à vos plugins de facilement modifier ou ajouter la fonctionnalité de base. Bake
utilise une classe de vue dédiée qui n'utilise pas la syntaxe PHP standard.

Events de Bake
==============

Comme une classe de vue, ``BakeView`` envoie les mêmes events que toute autre
classe de vue, ainsi qu'un event initialize supplémentaire. Cependant,
alors que les classes de vue standard utilisent le préfixe d'event
"View.", ``BakeView`` utilise le préfixe d'event "Bake.".

L'event initialize peut être utilisé pour faire des changements qui
s'appliquent à toutes les sorties fabriquées avec bake, par exemple pour ajouter
un autre helper à la classe de vue bake, cet event peut être utilisé::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.initialize', function (Event $event) {
        $view = $event->subject;

        // Dans mes templates de bake, permet l'utilisation du helper MySpecial
        $view->loadHelper('MySpecial', ['some' => 'config']);

        // Et ajoute une variable $author pour qu'elle soit toujours disponible
        $view->set('author', 'Andy');

    });

Les events de Bake peuvent aussi être utiles pour faire des petits
changements aux templates existants. Par exemple, pour changer les noms de
variable utilisés lors de la création avec bake de fichiers de
controller/template, on pourra utiliser une fonction qui écoute
``Bake.beforeRender`` pour modifier les variables utilisées dans les templates
de bake::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.beforeRender', function (Event $event) {
        $view = $event->subject;

        // Utilise $rows pour les principales variables de données dans les indexes
        if ($view->get('pluralName')) {
            $view->set('pluralName', 'rows');
        }
        if ($view->get('pluralVar')) {
            $view->set('pluralVar', 'rows');
        }

        // Utilise $theOne pour les principales variable de données dans les view/edit
        if ($view->get('singularName')) {
            $view->set('singularName', 'theOne');
        }
        if ($view->get('singularVar')) {
            $view->set('singularVar', 'theOne');
        }

    });


Syntaxe de Template de Bake
===========================

Les fichiers de template de Bake utilisent les balises erb-style (``<% %>``)
pour indiquer la logique des templates, et traitent le reste, y compris les
balises php, comme du texte.

.. note::

    Les fichiers de template de Bake n'utilisent pas, et sont insensibles aux
    ``asp_tags`` de la configuration de php ini.

``BakeView`` intègre les balises suivantes:

  * ``<%`` Une balise php ouverte de template de Bake
  * ``%>`` Une balise php fermante de template de Bake
  * ``<%=`` Une balise php de short-echo de template de Bake
  * ``<%-`` Une balise php ouverte de template de Bake, enlevant tout espace
    en tête avant la balise
  * ``-%>`` Une balise php fermante de template de Bake, enlevant les espaces
    à a fin après la balise

Une façon de voir/comprendre la façon dont les templates de Bake fonctionne,
spécialement quand on essaie de modifier les fichiers de template de bake, est
de créer avec bake une classe et de comparer le template utilisé avec le
template déjà présent dans le dossier tmp de votre application.

Ainsi, par exemple, pour créer avec bake un shell comme ceci::

    bin/cake bake shell Foo

Le template utilisé
(**vendor/cakephp/cakephp/src/Template/Bake/Shell/shell.ctp**)
ressemble à ceci::

    <?php
    namespace <%= $namespace %>\Shell;

    use Cake\Console\Shell;

    /**
     * <%= $name %> shell command.
     */
    class <%= $name %>Shell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

Le fichier template déjà présent (pre-processed)
(**tmp/Bake-Shell-shell-ctp.php**), qui est le fichier réellement
rendu, ressemble à ceci::

    <CakePHPBakeOpenTagphp
    namespace <?= $namespace ?>\Shell;

    use Cake\Console\Shell;

    /**
     * <?= $name ?> shell command.
     */
    class <?= $name ?>Shell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

Et la classe résultante construite avec bake (**src/Shell/FooShell.php**)
ressemble à ceci::

    <?php
    namespace App\Shell;

    use Cake\Console\Shell;

    /**
     * Foo shell command.
     */
    class FooShell extends Shell
    {

    /**
     * main() method.
     *
     * @return bool|int Success or error code.
     */
        public function main()
        {
        }

    }

.. _creating-a-bake-theme:

Créer un theme de bake
======================

Si vous souhaitez modifier la sortie par défaut du HTML produit par la commande
"bake", vous pouvez créer votre propre 'template' de bake qui vous permet de
remplacer certaine ou toute partie des templates que bake utilise. Pour créer
un nouveau template de bake, faîtes ce qui suit:

#. Créez un nouveau plugin avec Bake. Le nom du plugin est le nom du 'theme' de
   Bake
#. Créez un nouveau répertoire **plugins/[name]/src/Template/Bake/Template/**.
#. Copiez tout template que vous souhaitez changer à partir de
   **vendor/cakephp/bake/src/Template/Bake/Template** vers les
   fichiers correspondants dans votre plugin.
#. Quand vous lancez bake, utilisez l'option ``--theme`` pour spécifier le
   theme de bake que vous souhaitez utiliser.

Créer de nouvelles options de commande pour bake
================================================

Il est possible d'ajouter de nouvelles options de commandes de bake, ou de
surcharger celles fournies par CakePHP en créant des tâches dans votre
application ou dans vos plugins. En étendant ``Cake\Shell\Task\BakeTask``, bake
va trouver votre nouvelle tâche et l'inclure comme faisant partie de bake.

En exemple, nous allons faire une tâche qui créé une classe arbitraire foo.
D'abord créez le fichier de tâche **src/Shell/Task/FooTask.php**. Nous
étendrons le ``SimpleBakeTask`` pour l'instant puisque notre tâche shell sera
simple. ``SimpleBakeTask`` est abstraite et nous impose de définir 4 méthodes
qui disent à bake comment la tâche est appelée, l'endroit où devront se trouver
les fichiers qu'il va générer, et le template à utiliser. Notre fichier
FooTask.php devra ressembler à ceci::

    <?php
    namespace App\Shell\Task;

    use Cake\Shell\Task\SimpleBakeTask;

    class FooTask extends SimpleBakeTask
    {
        public $pathFragment = 'Foo/';

        public function name()
        {
            return 'foo';
        }

        public function fileName($name)
        {
            return $name . 'Foo.php';
        }

        public function template()
        {
            return 'foo';
        }

    }

Une fois que le fichier a été créé, nous devons créer un template que bake peut
utiliser pour la génération de code. Créez
**src/Template/Bake/foo.ctp**. Dans ce fichier, nous
ajouterons le contenu suivant::

    <?php
    namespace <%= $namespace %>\Foo;

    /**
     * <%= $name %> foo
     */
    class <%= $name %>Foo
    {
        // Add code.
    }

Vous devriez maintenant voir votre nouvelle tâche dans l'affichage de
``bin/cake bake``. Vous pouvez lancer votre nouvelle tâche en exécutant
``bin/cake bake foo Example``.
Cela va générer une nouvelle classe ``ExampleFoo`` dans
**src/Foo/ExampleFoo.php** que votre application va
pouvoir utiliser.

Si vous souhaitez que votre appel à ``bake`` crée également un fichier de test
pour la classe ``ExampleFoo``, vous devrez surcharger la méthode ``bakeTest()``
dans la classe ``FooTask`` pour y définir le suffixe et le namespace de la
classe de votre nom de commande personnalisée::

    public function bakeTest($className)
    {
        if (!isset($this->Test->classSuffixes[$this->name()])) {
          $this->Test->classSuffixes[$this->name()] = 'Foo';
        }

        $name = ucfirst($this->name());
        if (!isset($this->Test->classTypes[$name])) {
          $this->Test->classTypes[$name] = 'Foo';
        }

        return parent::bakeTest($className);
    }

* Le **suffixe de classe** sera ajouté après le nom passé à ``bake``. Dans le
  cadre de l'exemple ci-dessus, cela créerait un fichier ``ExampleFooTest.php``.
* Le **type de classe** sera le sous-namespace utilisé pour atteindre votre
  fichier (relatif à l'application ou au plugin dans lequel vous faites le
  ``bake``). Dans le cadre de l'exemple ci-dessus, cela créerait le test avec le
  namespace ``App\Test\TestCase\Foo``.

.. meta::
    :title lang=fr: Etendre Bake
    :keywords lang=fr: interface ligne de commande,development,bake view, bake template syntax,erb tags,asp tags,percent tags
