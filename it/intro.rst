CakePHP in un occhiata
######################

CakePHP e' progettato per rendere semplici le attività comuni dello sviluppo web.
Provvedendo ad un toolbox all-in-one per iniziare con varie parti di un lavoro CakePHP
insieme o separatamente.

L'obbiettivo di questa overview è di introdurre i concetti generali di CakePHP
e darti una breve introduzione di come questi concetti sono implementati in CakePHP.
Se stai scalpitando per iniziare un nuovo progetto puoi :doc:`partire con il tutorial
 </tutorials-and-examples/bookmarks/intro>` oppure :doc:`immergerti nella documentazione
</topics>`.

Convenzioni oltre configurazioni
================================

CakePHP fornisce un organizzazione base che comprende nomi di classi, filename, nomi di tabelle
e altre altre convenzioni. Mentre le convenzioni richiedono un po di tempo per poterle apprendere,
seguendo le convenzioni CakePHP ti permette di omettere molte configurazioni e uniformare
la struttura dell'applicazione che rende semplici vari tipi di progetti. Il :doc:`capitolo delle convenzioni
</intro/conventions>` contiene le varie convenzioni usate in CakePHP.

Il Model Layer
===============

Il Model layer rappresenta la parte della tua applicazione che implementa la business logic.
Questo è responsabile di estrarre i dati e convertirli e renderli significativi per la tua
applicazione. Questo include processing, validazione, associazione o altre attività legate
alla gestione dei dati.

Nel caso di un social network, il Model layer dovrebbe aver cura di attività
di salvataggio dati utente, salvare le associazioni di amicizia, immagazzinare e reperire
foto degli utenti, trovare suggerimenti per nuovi amici, etc.
L'oggetto modello dovrebbe essere pensato come "Amico", "Utente", "Commento" o "Foto".
Se vogliamo caricare qualche dato sulla nostra tabella ``utenti`` dobbiamo fare::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

Avrai notato che non abbiamo scritto alcun codice prima di iniziare a lavorare
con i nostri dati. Con l'uso delle convensioni, CakePHP userà classi standard 
per tabelle e classi di entità che non sono ancora state definite.

Se vogliamo creare un nuovo utente e salvarlo (con la validazione) dovremmo scrivere
qualcosa come::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

Il View Layer
==============

Il View Layer genera la rappresentazione dei dati modellati. Essendo separato dagli 
oggetti modello, questo è responsabile di usare le informazioni ricevute e produrre
un interfaccia per rappresentare i dati come voluto nella tua applicazione.

Per esempio, la vista dovrebbe usare i model data per generare un modello vista HTML per
contenerli o un file formattato XML per atri usi::

    // In a view template file, we'll render an 'element' for each user.
    <?php foreach ($users as $user): ?>
        <li class="user">
            <?= $this->element('user', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

Il View layer fornisce molte estensioni come :ref:`view-templates`, :ref:`view-elements`
e :doc:`/views/cells` per permetterti di riutilizzare la logica di presentazione.

Il View layer non si limita soltanto alla generazione di dati formattati HTML o testo.
Può anche essere usato per fornire formati comuni come JSON, XML e tramite un architettura
di plugins qualsiasi altro formato tu desideri, come il CSV.

Il Controller Layer
====================

Il Controller Layer gestisce le richieste dagli utenti. Esso è responsabile di
generare una risposta con l'aiuto dei layers Model e View.

Un controller può essere visto come un manager che si assicura che tutte le risorse
necessarie al completamento dell'attività siano delegate ai corretti lavoratori.
Esso attende le petizioni dai clienti, controlla che la loro validita' sia in accordo
con autenticazione o regole di autorizzazione, delega il reperimento dei dati, scegli 
il tipo di rappresentazione che il cliente può accettare ed infine delega la rappresentazione
al View Layer. Un esempio di controller di registrazione utente::

    public function add()
    {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('You are now registered.'));
            } else {
                $this->Flash->error(__('There were some problems.'));
            }
        }
        $this->set('user', $user);
    }

Avrai notato che non è mai generata una vista. Una convensione di CakePHP assicura 
la scelta giusta della vista con i dati della vista che abbiamo preparato con ``set()``.

.. _ciclo_delle_richieste:

Ciclo delle richieste in CakePHP
================================

Ora che hai piu' familiarità con i differenti layer in CakePHP vediamo come 
funziona una richiesta in CakePHP:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt:Il diagramma mostra una tipica richiesta di CakePHP

Il ciclo di richiesta tipico in CakePHP inizia con la richiesta di una pagina o una risorsa
da parte di un utente all'interno dell'applicazione. Ad alto livello questa richiesta 
passa attraverso i seguenti passi:

#. Il server web tramite la rewrite rules redirige la richiesta a **webroot/index.php**.
#. La tua applicazione è caricata e confinata ad un ``HttpServer``.
#. Il middleware della tua applicazione è inizializzato.
#. La richiesta e la risposta sono inviate attravero il middleware PSR-7 
   usato dalla tua applicazione. Tipicamente questo include il trapping degli errori
   ed il routing.
#. Se nessuna risposta è restituita dal middleware e la richiesta contiene informazioni
   d'instradamento, un controller e un azione sono scelte.
#. L'azione del controllore viene chiamata e il controller interagisce con i
   moduli richiesti e componenti.
#. Il controller delega la creazione della risposta alla view che genera l'output
   dai dati.
#. La vista usa degli Helpers e Cells per generare il corpo di risposta e le intestazioni.
#. La risposta è spedita indietro attraverso il :doc:`/controllers/middleware`.
#. Il ``HttpServer`` emette la risposta al webserver.


Solo all'inizio
===============

Sperando che questa breve introduzione abbia stuzzicato i tuoi interessi. 
Altre ottime features in CakePHP sono:

* A :doc:`caching </core-libraries/caching>` framework that integrates with
  Memcached, Redis and other backends.
* Powerful :doc:`code generation tools
  </bake/usage>` so you can start immediately.
* :doc:`Integrated testing framework </development/testing>` so you can ensure
  your code works perfectly.

Il prossimo ovvio passo e' :doc:`download CakePHP </installation>`, leggere il
:doc:`tutorial and build something awesome
</tutorials-and-examples/bookmarks/intro>`.

Letture agguntive
=================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=it: Getting Started
    :keywords lang=it: folder structure,table names,initial request,database table,organizational structure,rst,filenames,conventions,mvc,web page,sit
