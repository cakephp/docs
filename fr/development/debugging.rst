Debugger
########

Le debug est une inévitable et nécessaire partie de tout cycle de développement.
Tandis que CakePHP n'offre pas d'outils qui se connectent directement avec tout
IDE ou éditeur, CakePHP fournit plusieurs outils pour l'aide au debug et ce qui
est lancé sous le capot de votre application.

Debug basique
=============

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

La fonction ``debug()`` est une fonction disponible partout qui fontionne de la
même manière que la fonction PHP ``print\_r()``. La fonction ``debug()`` vous
permet de montrer les contenus d'un variable de différentes façons.
Premièrement, si vous voulez que vos données soient montrées d'une façon
sympa en HTML, définissez le deuxième paramètre à ``true``. La fonction affiche
aussi la ligne et le fichier dont ils sont originaires par défaut.

La sortie de cette fonction est seulement montrée si la variable de ``$debug``
du cœur a été définie à ``true``.

.. php:function stackTrace()

La fonction ``stackTrace()`` est globalement disponible, et vous permet
d'afficher une stack trace quelque soit la fonction appelée.

Utiliser la Classe Debugger
===========================

.. php:namespace:: Cake\Error

.. php:class:: Debugger

Pour utiliser le debugger, assurez-vous d'abord que ``Configure::read('debug')``
est défini à ``true``.

Affichage des Valeurs
=====================

.. php:staticmethod:: dump($var, $depth = 3)

Dump prints out the contents of a variable. It will print out all
properties and methods (if any) of the supplied variable::

    $foo = array(1,2,3);

    Debugger::dump($foo);

    // Outputs
    array(
        1,
        2,
        3
    )

    // Simple object
    $car = new Car();

    Debugger::dump($car);

    // Outputs
    object(Car) {
        color => 'red'
        make => 'Toyota'
        model => 'Camry'
        mileage => (int)15000
    }

Logging With Stack Traces
=========================

.. php:staticmethod:: log($var, $level = 7, $depth = 3)

Crée un stack trace log détaillé au moment de l'invocation. La
méthode log() affiche les données identiques à celles faites par
Debugger::dump(), mais dans debug.log au lieu de les sortir
buffer. Notez que votre répertoire app/tmp directory (et son contenu) doit
être ouvert en écriture par le serveur web pour que le
log() fonctionne correctement.

Generating Stack Traces
=======================

.. php:staticmethod:: trace($options)

Retourne le stack trace courant. Chaque ligne des traces inlut la méthode
appelée, incluant chaque fichier et ligne d'où est originaire l'appel. ::

    //Dans PostsController::index()
    pr( Debugger::trace() );

    //sorties
    PostsController::index() - APP/Controller/DownloadsController.php, line 48
    Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
    Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
    [main] - APP/webroot/index.php, line 84

Ci-dessus se trouve le stack trace généré en appelant Debugger::trace()
dans une action d'un controller. Lire le stack trace de bas en haut
montre l'ordre des fonctions lancées actuellement (stack frames). Dans
l'exemple du dessus, index.php appelé Dispatcher::dispatch(), qui est
appelé in-turn Dispatcher::\_invoke(). La méthode \_invoke() appelé ensuite
par PostsController::index(). Cette information est utile quand vous
travaillez avec des opérations récursives ou des stacks profonds, puisqu'il
identifie les fonctions qui sont actuellement lancées au moment du trace().

Getting an Excerpt From a File
==============================

.. php:staticmethod:: Debugger::excerpt($file, $line, $context)

Récupérer un extrait du fichier dans $path (qui est un chemin de fichier
absolu), mettant en évidence le numéro de la ligne $line avec le nombre
de lignes $context autour. ::

    pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );

    //sortira ce qui suit.
    Array
    (
        [0] => <code><span style="color: #000000"> * @access public</span></code>
        [1] => <code><span style="color: #000000"> */</span></code>
        [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>
        [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
        [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
    )

Bien que cette méthode est utilisée en interne, elle peut être pratique
si vous créez vos propres messages d'erreurs ou les logs pour les
situations personnalisées.

.. php:staticmethod:: Debugger::getType($var)

    Récupère le type de variable. Les objets retourneront leur nom de classe.

    .. versionadded:: 2.1

Utiliser Logging pour debug
===========================

Les messages de Logging est une autre bonne façon de debugger les applications,
et vous pouvez utiliser :php:class:`CakeLog` pour faire le logging dans votre
application. Tous les objets qui étendent :php:class:`Object` ont une méthode
d'instanciation `log()` qui peut être utilisé pour les messages de log::

    $this->log('Got here', 'debug');

Ce qui est au-dessus écrit ``Got here`` dans le debug du log. Vous pouvez
utiliser les logs (log entries) pour aider les méthodes de débug qui impliquent
les redirections ou les boucles compliquées. Vous pouvez aussi utiliser
:php:meth:`CakeLog::write()` pour écrire les messages de log. Cette méthode
peut être appelée statiquement partout dans votre application où CakeLog
a été chargée::

    // dans config/bootstrap.php
    App::uses('CakeLog', 'Log');

    // N'importe où dans votre application
    CakeLog::write('debug', 'Got here');

Kit de Debug
============

DebugKit est un plugin qui fournit un nombre de bons outiles de debug. Il
fournit principalement une barre d'outils dans le HTML rendu, qui fournit
une pléthore d'informations sur votre application et la requête courante.
Vous pouvez télécharger
`DebugKit <https://github.com/cakephp/debug_kit>`_ sur GitHub.


.. meta::
    :title lang=fr: Debugger
    :description lang=fr: Debugger CakePHP avec la classe Debugger, logging, basic debugging et utiliser le plugin DebugKit.
    :keywords lang=fr: extrait de code,stack trace,default output,error link,default error,web requests,error report,debugger,tableaux,différentes façons,extrait de,cakephp,ide,options
