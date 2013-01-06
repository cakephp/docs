Débogage
########

Le débogage est une partie inévitable et nécessaire de tout cycle de
développement. Si CakePHP n'offre aucun outil se connectant avec les IDE
ou les éditeurs, il fournit cependant plusieurs outils d'assistance au
débogage et révélant ce qui se passe sous la capuche de votre
application.

Débogage basique
================

debug($var, $showHTML = false, $showFrom = true)

La fonction debug() est une fonction disponible globalement qui
fonctionne de façon similaire à la fonction php print\_r(). La fonction
debug() vous permet de visualiser le contenu d'une variable de
différentes façons. Tout d'abord, si vous souhaitez que les données
soient affichées de façon "HTML-friendly", définissez le second
paramètre à vrai (true). La fonction retourne également par défaut la
ligne et le fichier d'où elle provient.

Le résultat de cette fonction ne sera affiché que si la variable debug
(du core) a été définie à une valeur supérieure à 0.

Utiliser la classe de débogage
==============================

Pour utiliser le débogueur, il faut tout d'abord que la variable
*Configure::read('debug')* aie une valeur différente de 0.

dump($var)

*Dump* affiche le contenu d'une variable. La fonction affichera toutes
les propriétés et méthodes (s'il en existe) de la variable en question.

::

        $toto = array(1,2,3);
        
        Debugger::dump($toto);
        
        //Affichera
        array(
            1,
            2,
            3
        )
        
        //Objet simple  
        $voiture = new Voiture();
        
        Debugger::dump($voiture);
        
        //sortie
        Voiture::
        Voiture::couleur= 'rouge'
        Voiture::marque = 'Toyota'
        Voiture::modele = 'Camry'
        Voiture::kilometrage = '15000'
        Voiture::accelerer()
        Voiture::decelerer()
        Voiture::arreter()

log($var, $level = 7)

Crée une description détaillée de la pile au moment de l'exécution. La
méthode *log()* affichera les données de façon similaire à
*Debugger::dump()*, mais dans le fichier *debug.log* plutôt que dans le
*buffer* de sortie. Notez que votre dossier *app/tmp* (et son contenu)
doivent avoir les permissions en écriture pour que *log()* fonctionne
correctement.

trace($options)

Retourne l'état courant de la pile. Chaque ligne du retour inclue la
méthode appelée, y compris quel est le fichier et la ligne dont provient
l'appel.

//Dans MessagesController::index() pr( Debugger::trace() ); //sortie
MessagesController::index() - APP/controllers/downloads\_controller.php,
line 48 Dispatcher::\_invoke() - CORE/cake/dispatcher.php, line 265
Dispatcher::dispatch() - CORE/cake/dispatcher.php, line 237 [main] -
APP/webroot/index.php, line 84

Ci-dessus, vous avez un exemple du contenu engendré par la méthode
*Debugger::trace()* dans un contrôleur. Lire la pile de bas en haut vous
montre l'ordre dans lequel les fonctions sont appelées. Dans cet
exemple, index.php a appelé *Dispatcher::dispatch()*, qui à son tour a
appelé *Dispatcher::\_invoke()*. La méthode *\_invoke()* à ensuite
appelé *MessagesController::index()*. Cette information est pratique
quand vous travaillez avec des opérations récursives ou des opérations
profondes dans la pile, pour identifier quelles fonctions sont en cours
d'exécution quand la fonction trace() est appelée.

excerpt($fichier, $ligne, $contexte)

Extrait un bout du fichier contenu dans $fichier (qui est un chemin
absolu), et met en évidence la ligne $ligne avec les $contexte lignes
l'entourant.

::

        pr( Debugger::excerpt(ROOT.DS.LIBS.'debugger.php', 321, 2) );
        
        // affichera ceci :
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

Bien que cette méthode soit souvent utilisée par la classe en interne,
elle peut être utile si vous voulez créer vos propres messages d'erreurs
ou *logs* pour une situation donnée.

exportVar($var, $recursion = 0)

Convertit une variable de n'importe quel type en une chaîne de caractère
pour l'utiliser dans une sortie de débogage. Cette méthode est également
utilisée par une grande partie du débogueur pour des conversions
internes de variables, et peut être aussi bien utilisée dans votre
propre débogueur.

invoke($debugger)

Remplace le débogueur CakePHP avec un nouveau message d'erreur.

Classe de déboguage
===================

La classe de déboguage est nouvelle dans CakePHP 1.2 et offre toujours
plus d'options pour obtenir des informations de déboguage. Elle contient
plusieurs fonctions qui sont invoquées par CakePHP, et fournit un
affichage de la mémoire, et des fonctions de gestion d'erreur.

La classe de déboguage surcharge les messages d'erreurs par défaut de
PHP, en les remplaçant par des messages plus pratiques. Ces nouveaux
messages sont utilisées par défaut dans CakePHP. Comme pour toutes les
fonctions de déboguage, la variable *Configure::debug* doit avoir une
valeur supérieure à 0.

Quand une erreur survient, le débogueur affiche l'erreur sur l'écran, et
l'enregistre dans le fichier error.log. Le rapport d'erreur est un
affichage à la fois de la pile d'instructions et de l'extrait du code
près de l'erreur. Cliquez sur le lien "Error" pour afficher la pile, et
sur "Code" pour avoir les lignes mises en cause dans l'erreur.
