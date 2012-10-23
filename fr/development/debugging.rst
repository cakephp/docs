Debugger
########

Le debug est une inévitable et nécessaire partie de tout cycle de 
développement. Tandis que CakePHP n'offre pas d'outils qui se 
connectent directement avec tout IDE ou éditeur, CakePHP fournit plusieurs 
outils pour l'aide au debug et ce qui est lancé sous le capot de votre 
application.

Basic Debugging
===============

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)

    :param mixed $var: Les contenus à afficher. Les tableaux et objets 
        fonctionnent bien.
    :param boolean $showHTML: Défini à true, pour activer l'échappement. 
        L'échappement est activé par défaut dans 2.0 quand on sert les 
        requêtes web
    :param boolean $showFrom: Montre la ligne et le fichier pour lesquels le 
        debug() apparaît.

La fonction debug() est une fonction disponible partout qui fontionne de la 
même manière que la fonction PHP print\_r(). La fonction debug() vous permet 
de montrer les contenus d'un variable dans un nombre de façons différentes. 
Premièrement, si vous voulez que vos données soient montrées d'une façon 
sympa en HTML, définissez le deuxième paramètre à true. La fonction affiche 
aussi la ligne et le fichier dont ils sont originaires par défaut. 

La sortie de cette fonction est seulement montrée si la variable de debug du 
coeur a été définie à une valeur supérieure à 0.

.. versionchanged:: 2.1 
    La sortie de ``debug()`` ressemble plus ``var_dump()``, et utilise 
    :php:class:`Debugger` en interne.

Classe Debugger
===============

La classe debugger a été introduite avec CakePHP 1.2 et offre même plus 
d'options pour obtenir les informations de debug. Elle a plusieurs fonctions 
qui sont appelées statiquement, et fournissent le dumping, logging et les 
fonctions de gestion des erreurs.

La Classe Debugger écrase la gestion des erreurs PHP par défaut, le remplaçant 
avec bien plus de rapports d'erreurs utiles. La gestion des erreurs de Debugger 
est utilisée par défaut dans CakePHP. Comme pour toutes les fonctions de debug, 
``Configure::debug`` doit être défini à une valeur supérieure à 0.

Quand une erreur est levée, Debugger affiche à la fois l'information de la page 
et fait une entrée dans le fichier error.log. Le rapport d'erreurs qui est 
généré a les deux stack trace et un extrait de où l'erreur a été levée. Cliquez 
sur le type de lien "Error" pour revéler le stack trace, et sur le lien "Code" 
pour revéler les lignes d'erreurs en cause.

Utiliser la Classe Debugger
===========================

.. php:class:: Debugger

Pour utiliser le debugger, assurez-vous d'abord que Configure::read('debug') 
est défini à une valeur supérieure à 0.

.. php:staticmethod:: Debugger::dump($var)

    Dump prints out the contents of a variable. Elle affiche toutes les 
    propriétés et méthodes (si il y en a) de la variable fournie::

        <?php
        $foo = array(1,2,3);

        Debugger::dump($foo);

        // sortie
        array(
            1,
            2,
            3
        )

        // objet simple
        $car = new Car();

        Debugger::dump($car);

        // sortie
        Car
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::acclerate()
        Car::decelerate()
        Car::stop()

    .. versionchanged:: 2.1
        Dans 2.1 forward, la sortie a été modifiée pour la lisibilité. Regardez 
        :php:func:`Debugger::exportVar()`

.. php:staticmethod:: Debugger::log($var, $level = 7)

    Crée un stack trace log détaillé au moment de l'invocation. La 
    méthode log() affiche les données identiques à celles faites par 
    Debugger::dump(), mais dans debug.log au lieu de les sortir 
    buffer. Notez que votre répertoire app/tmp directory (et son contenu) doit 
    être ouvert en écriture par le serveur web pour que le 
    log() fonctionne correctement.

.. php:staticmethod:: Debugger::trace($options)

    Returns the current stack trace. Each line of the trace includes
    the calling method, including which file and line the call
    originated from.::

        <?php
        //In PostsController::index()
        pr( Debugger::trace() );
        
        //outputs
        PostsController::index() - APP/Controller/DownloadsController.php, line 48
        Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

    Ci-dessus est le stack trace généré en appelant Debugger::trace() dans 
    une action d'un controller. Lire le stack trace bottom to top shows
    the order of currently running functions (stack frames). Dans l'exemple 
    du dessus, index.php appelé Dispatcher::dispatch(), qui est appelé 
    in-turn Dispatcher::\_invoke(). La méthode \_invoke() appelé ensuite 
    par PostsController::index(). Cette information est utile quand vous 
    travaillez avec des opérations récursives ou des stacks profonds, puisqu'il 
    identifie les fonctions qui sont actuellement lancées au moment du trace().

.. php:staticmethod:: Debugger::excerpt($file, $line, $context)

    Récupérer un extrait du fichier dans $path (qui est un chemin de fichier 
    absolu), mettant en évidence le numéro de la ligne $line avec le nombre 
    de lignes $context autour.::

        <?php
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

.. php:staticmethod:: Debugger::exportVar($var, $recursion = 0)

    Convertir une variable de tout type en une chaîne de caractères pour 
    l'utilisation dans la sortie de debug. Cette méthode est aussi utilisée 
    par la plupart de Debugger pour les conversions de variable en interne, 
    et peut aussi être utilisée dans vos propres Debuggers.

    .. versionchanged:: 2.1
        Cette fonction génére une sortie différente dans 2.1 forward.

.. php:staticmethod:: Debugger::invoke($debugger)

    Remplace le Debugger de CakePHP avec une nouvelle instance.

.. php:staticmethod:: Debugger::getType($var)

    Récupère le type de variable. Les objets retourneront leur nom de classe

    .. versionadded:: 2.1

Utiliser Logging pour debug
===========================

Les messages de Logging est une autre bonne façon de debugger les applications, 
et vous pouvez utiliser :php:class:`CakeLog` pour faire le logging dans votre 
application. Tous les objets qui étendent :php:class:`Object` ont une méthode 
d'instanciation `log()` qui peut être utilisé pour les messages de log::

    <?php
    $this->log('Got here', 'debug');

Ce qui est au-dessus écrit ``Got here`` dans le debug du log. Vous pouvez 
utiliser les logs (log entries) pour aider les méthodes de débug qui impliquent 
les redirections ou les boucles compliquées. Vous pouvez aussi utiliser 
:php:meth:`CakeLog::write()` pour écrire les messages de log. Cette méthode 
peut être appelée statiquement partout dans votre application où CakeLog 
a été chargée::

    <?php
    // dans app/Config/bootstrap.php
    App::uses('CakeLog', 'Log');

    // N'importe où dans votre application
    CakeLog::write('debug', 'Got here');

Kit de Debug
============

DebugKit est un plugin qui fournit un nombre de bons outiles de debug. Il 
fournit principalement une barre d'outils dans le HTML rendu, qui fournit 
une pléthore d'informations sur votre application et la requête courante. 
Vous pouvez télécharger 
`DebugKit <https://github.com/cakephp/debug_kit/tree/2.0>`_ sur github.


.. meta::
    :title lang=fr: Debugger
    :description lang=fr: Debugger CakePHP avec la classe Debugger, logging, basic debugging et utiliser le plugin DebugKit.
    :keywords lang=fr: extrait de code,stack trace,default output,error link,default error,web requests,error report,debugger,tableaux,différentes façons,extrait de,cakephp,ide,options
