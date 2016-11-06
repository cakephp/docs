Debugger
########

Le debug est une inévitable et nécessaire partie de tout cycle de développement.
Tandis que CakePHP n'offre pas d'outils qui se connectent directement avec tout
IDE ou éditeur, CakePHP fournit plusieurs outils pour l'aide au debug et ce qui
est lancé sous le capot de votre application.

Debug Basique
=============

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:

La fonction ``debug()`` est une fonction disponible partout qui fonctionne de la
même manière que la fonction PHP ``print_r()``. La fonction ``debug()`` vous
permet de montrer les contenus d'un variable de différentes façons.
Premièrement, si vous voulez que vos données soient montrées d'une façon
sympa en HTML, définissez le deuxième paramètre à ``true``. La fonction affiche
aussi la ligne et le fichier dont ils sont originaires par défaut.

La sortie de cette fonction est seulement montrée si la variable de ``$debug``
du cœur a été définie à ``true``.

.. versionadded:: 3.3.0

    Utiliser cette méthode retournera la valeur de la variable ``$var`` passée
    en paramètre, vous permettant ainsi, par exemple, de l'utiliser sur un
    ``return``::

        return debug($data); // Retournera $data dans tous les cas

.. php:function:: stackTrace()

La fonction ``stackTrace()`` est globalement disponible, et vous permet
d'afficher une stack trace quelque soit la fonction appelée.

.. php:function:: breakpoint()

.. versionadded:: 3.1

Si vous avez installé `Psysh <http://psysh.org/>`_ vous pouvez utiliser cette
fonction dans les environnements CLI pour ouvrir une console interactive
avec le scope local courant::

    // Du code
    eval(breakpoint());

Ouvrira une console interactive qui peut être utilisée pour vérifier les
variables locales et exécuter d'autre code. Vous pouvez fermer le debugger
interactif et reprendre l'exécution du script original en tapant
``quit`` ou ``q`` dans la session interactive.

Utiliser la Classe Debugger
===========================

.. php:namespace:: Cake\Error

.. php:class:: Debugger

Pour utiliser le debugger, assurez-vous d'abord que ``Configure::read('debug')``
est défini à ``true``.

Affichage des Valeurs
=====================

.. php:staticmethod:: dump($var, $depth = 3)

Dump affiche le contenu d'une variable. Elle affiche toutes les propriétés
et méthodes (s'il y en a) de la variable fournie:::

    $foo = [1,2,3];

    Debugger::dump($foo);

    // Outputs
    [
        1,
        2,
        3
    ]

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
méthode ``log()`` affiche les données identiques à celles faites par
``Debugger::dump()``, mais dans debug.log au lieu de les sortir
buffer. Notez que votre répertoire **tmp** (et son contenu) doit
être ouvert en écriture par le serveur web pour que le ``log()`` fonctionne
correctement.

Generating Stack Traces
=======================

.. php:staticmethod:: trace($options)

Retourne le stack trace courant. Chaque ligne des traces inclut la méthode
appelée, incluant chaque fichier et ligne d'où est originaire l'appel::

    //Dans PostsController::index()
    pr( Debugger::trace() );

    //sorties
    PostsController::index() - APP/Controller/DownloadsController.php, line 48
    Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
    Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
    [main] - APP/webroot/index.php, line 84

Ci-dessus se trouve le stack trace généré en appelant ``Debugger::trace()``
dans une action d'un controller. Lire le stack trace de bas en haut
montre l'ordre des fonctions lancées actuellement (stack frames).

Getting an Excerpt From a File
==============================

.. php:staticmethod:: Debugger::excerpt($file, $line, $context)

Récupérer un extrait du fichier dans $path (qui est un chemin de fichier
absolu), mettant en évidence le numéro de la ligne $line avec le nombre
de lignes $context autour::

    pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );

    //sortira ce qui suit.
    Array
    (
        [0] => <code><span style="color: #000000"> * @access public</span></code>
        [1] => <code><span style="color: #000000"> */</span></code>
        [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>
        [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = [];</span></code></span>
        [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
    )

Bien que cette méthode est utilisée en interne, elle peut être pratique
si vous créez vos propres messages d'erreurs ou les logs pour les
situations personnalisées.

.. php:staticmethod:: Debugger::getType($var)

    Récupère le type de variable. Les objets retourneront leur nom de classe.


Utiliser les Logs pour Debugger
===============================

Logger des messages est une autre bonne façon de debugger les applications,
et vous pouvez utiliser :php:class:`Cake\\Log\\Log` pour faire le logging dans
votre application. Tous les objets qui utilisent  ``LogTrait`` ont une méthode
d'instanciation ``log()`` qui peut être utilisée pour logger les messages::

    $this->log('Got here', 'debug');

Ce qui est au-dessus écrit ``Got here`` dans le log de debug. Vous pouvez
utiliser les logs (log entries) pour faciliter le debug des méthodes qui
impliquent des redirections ou des boucles compliquées. Vous pouvez aussi
utiliser :php:meth:`Cake\\Log\\Log::write()`` pour écrire les messages de log.
Cette méthode peut être appelée statiquement partout dans votre application où
CakeLog a été chargée::

    // Au début du fichier dans lequel vous voulez logger.
    use Cake\Log\Log;

    // N'importe où Log a été importé
    Log::debug('Got here');

Kit de Debug
============

DebugKit est un plugin qui fournit un nombre de bons outils de debug. Il
fournit principalement une barre d'outils dans le HTML rendu, qui fournit
une pléthore d'informations sur votre application et la requête courante.
Consultez le chapitre sur :doc:`/debug-kit` pour plus d'information sur son
installation et son utilisation.

.. meta::
    :title lang=fr: Debugger
    :description lang=fr: Debugger CakePHP avec la classe Debugger, logging, basic debugging et utiliser le plugin DebugKit.
    :keywords lang=fr: extrait de code,stack trace,default output,error link,default error,web requests,error report,debugger,tableaux,différentes façons,extrait de,cakephp,ide,options
