Containable
###########

Eine Neuerung im CakePHP Kern ist das ContainableBehavior. "To contain"
bedeutet "enthalten". Dieses Modell Verhalten erlaubt es Dir, Filter und
Beschränkungen für find() Operationen auf dem Modell zu einzusetzen. Der
Gebrauch von Containable wir Dir dabei helfen, unnötige
Datenbankabfragen zu verhindern, was im Ergebnis die Geschwindigkeit
Deiner Cake Anwendung erhöht. Diese Klasse wird Dir auch helfen, Deine
Daten sauber und konsistent zu suchen und zu filtern.

Um dieses neue Verhalten zu benutzen kannst Du $actsAs (Deutsch: "agiert
als") als Eigenschaft Deines Modells setzen:

::

    class Post extends AppModel {
        var $actsAs = array('Containable');
    }

Du kannst das Verhalten auch "on the fly" im Controller hervorrufen:

::

    $this->Post->Behaviors->attach('Containable');

Um zu sehen, wie Containable arbeitet, seheh wir uns einige Bespiele an.
Als erstesbeginnen wir mit einem find() Aufruf auf das Modell mit dem
Namen Post. Sagen wir, dass Post hasMany Comment, und Post
hasAndBelongsToMany Tag. Die gesammelten Daten aus einem normalen find()
Aufruf sind eher viele:

::

    debug($this->Post->find('all'));

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Second comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => A
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => B
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

Für einige Ansichten Deiner Anwendung brauchst Du wahrscheinlich nicht
all diese Daten aus dem Post model. ContainableBehavior kann Dir dabei
helfen, die Datenmenge zu reduzieren, die find() zurückliefert.

Um nur die post-relevanten Informationen anzufordern kannst Du folgendes
schreiben:

::

    $this->Post->contain();
    $this->Post->find('all');

Du kannst Containable auch innerhalb des find() Aufrufes einsetzen:

::

    $this->Post->find('all', array('contain' => false));

Dies hat zum Ergebnis die folgende Rückgabe:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

Diese Art von Hilfe ist aber nicht neu: genau genommen konntest Du das
bisher auch ohne das ContainableBehavior tun. Etwa so:

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable zeigt seinen wahren Glanz, wenn es um komplexere Beziehungen
geht und Du die Daten herausholen willst, die auf der selben Ebene
sitzen. Die $recursive Eigenschaft des Modells ist hilfreich, wenn Du
einen kompletten Zweig von Daten abhacken willst, jedoch nicht, wenn Du
auswählen willst, was Du an Daten behalten willst. Lasst uns mal sehen,
wie das mit der contain() Methode funktioniert. Das erste Argument der
contain Methode erwartet den Modell Namen bzw. ein Array, das die Namen
der zu liefernden Modelle enthält. Würden wir alle "Posts" und die damit
verknüpften "Tags" abfragen wollen (ohne die dazugehörigen Kommentare),
würden wir so etwas versuchen:

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Zu Erinnerung, wir können den contain Schlüssel auch in einem find()
Aufruf einsetzen:

::

    $this->Post->find('all', array('contain' => 'Tag'));

Ohne Containable würdest Du die unbindModel() Methode des Modells
einsetzen. Und zwar so oft, wie Du mit Deinem Modell verknüpfte Modelle
hast. Containable bietet einen saubereren Weg, dies zu erreichen.

Containable geht sogar einen Schritt weiter: Du kannst die abgefragten
Daten der *verknüpften* Modelle filtern. Wenn Du die Ergebnisse vom
ursprünglichen find() Aufruf ansiehst, sieh Dir das "Author" Feld mal
an. Wenn Dich in den Posts aber der Name des Kommentar Autors
interessiert —und nichts anderes— könntest Du folgendes schreiben:

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //oder..

    $this->Post->find('all', array('contain' => 'Comment.author'));

Hier haben wir Containable angewiesen, uns die Post Information zu
übergeben, sowie ausschließlich das "author" Feld den verknüpften
Modells "Comment". Die Ausgabe des find Aufrufs können etwa so aussehen:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

Wie Du sehen kannst enthält das Comments Array lediglich das Feld
"author" (und die post\_id, die CakePHP benötigt, um die
Abfrage-Ergebnisse zu zuzuordnen).

In dem Du eine Bedingung stellst, kannst Du die verknüpften Kommentare
sogar filtern :

::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //or...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

Im Ergebnis erhalten wir alle Posts zurückgeliefert, die einen Kommentar
von Daniel enthalten:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Zusätzliche Filter können mit den gewohnten\ ``Model->find()`` Optionen
gesetzt werden:

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Hier ist ein Beispiel zum Containble Verhalten, wenn Du tiefe, komplexe
Modell-Assoziationen hast.

Lass uns mal die folgende Modell-Assoziationen annehmen:

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

So erhalten wir die oben genannten Assoziationen mit Containable:

::

    $this->User->find('all', array(
        'contain'=>array(
            'Profile',
            'Account' => array(
                'AccountSummary'
            ),
            'Post' => array(
                'PostAttachment' => array(
                    'fields' => array('id', 'name'),
                    'PostAttachmentHistory' => array(
                        'HistoryNotes' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.name LIKE' => '%happy%')
                )
            )
        )
    ));

Merke Dir, das der 'contain' Schlüssel nur ein mal für das Haupt Modell
gesetzt wird, 'contain' wird danach nicht mehr für assoziierte Modelle
gesetzt.

Sei vorsichtig, wenn Du 'fields' zusammen mit 'contain' Optionen benutzt
- erwähne alle Fremdschlüssel, die Deine Abfrage direkt oder indirekt
benötigt. Nimm auch zur Kenntnis, dass Du das Containable Verhalten
möglicherweise zum AppModel hinzufügst, da es eh allen Modellen
zugeordnet werden muss, die es benutzen sollen.

Hier ist ein Beispiel für contain Assoziationen unter Benutzung von
paginating:

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

Using Containable
=================

To see how Containable works, let's look at a few examples. First, we'll
start off with a find() call on a model named Post. Let's say that Post
hasMany Comment, and Post hasAndBelongsToMany Tag. The amount of data
fetched in a normal find() call is rather extensive:

::

    debug($this->Post->find('all'));

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [post_id] => 1
                                [author] => Sam
                                [email] => sam@example.net
                                [website] => http://example.net
                                [comment] => Second comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
                [Tag] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [name] => Awesome
                            )
                        [1] => Array
                            (
                                [id] => 2
                                [name] => Baking
                            )
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (...

For some interfaces in your application, you may not need that much
information from the Post model. One thing the ``ContainableBehavior``
does is help you cut down on what find() returns.

For example, to get only the post-related information, you can do the
following:

::

    $this->Post->contain();
    $this->Post->find('all');

You can also invoke Containable's magic from inside the find() call:

::

    $this->Post->find('all', array('contain' => false));

Having done that, you end up with something a lot more concise:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
            )
    [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => Second article
                        [content] => bbb
                        [created] => 2008-05-19 00:00:00
                    )
            )

This sort of help isn't new: in fact, you can do that without the
``ContainableBehavior`` doing something like this:

::

    $this->Post->recursive = -1;
    $this->Post->find('all');

Containable really shines when you have complex associations, and you
want to pare down things that sit at the same level. The model's
``$recursive`` property is helpful if you want to hack off an entire
level of recursion, but not when you want to pick and choose what to
keep at each level. Let's see how it works by using the ``contain()``
method.

The contain method's first argument accepts the name, or an array of
names, of the models to keep in the find operation. If we wanted to
fetch all posts and their related tags (without any comment
information), we'd try something like this:

::

    $this->Post->contain('Tag');
    $this->Post->find('all');

Again, we can use the contain key inside a find() call:

::

    $this->Post->find('all', array('contain' => 'Tag'));

Without Containable, you'd end up needing to use the ``unbindModel()``
method of the model, multiple times if you're paring off multiple
models. Containable creates a cleaner way to accomplish this same task.

Containing deeper associations
==============================

Containable also goes a step deeper: you can filter the data of the
*associated* models. If you look at the results of the original find()
call, notice the author field in the Comment model. If you are
interested in the posts and the names of the comment authors — and
nothing else — you could do something like the following:

::

    $this->Post->contain('Comment.author');
    $this->Post->find('all');

    //or..

    $this->Post->find('all', array('contain' => 'Comment.author'));

Here, we've told Containable to give us our post information, and just
the author field of the associated Comment model. The output of the find
call might look something like this:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [author] => Daniel
                                [post_id] => 1
                            )
                        [1] => Array
                            (
                                [author] => Sam
                                [post_id] => 1
                            )
                    )
            )
    [1] => Array
            (...

As you can see, the Comment arrays only contain the author field (plus
the post\_id which is needed by CakePHP to map the results).

You can also filter the associated Comment data by specifying a
condition:

::

    $this->Post->contain('Comment.author = "Daniel"');
    $this->Post->find('all');

    //or...

    $this->Post->find('all', array('contain' => 'Comment.author = "Daniel"'));

This gives us a result that gives us posts with comments authored by
Daniel:

::

    [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => First article
                        [content] => aaa
                        [created] => 2008-05-18 00:00:00
                    )
                [Comment] => Array
                    (
                        [0] => Array
                            (
                                [id] => 1
                                [post_id] => 1
                                [author] => Daniel
                                [email] => dan@example.com
                                [website] => http://example.com
                                [comment] => First comment
                                [created] => 2008-05-18 00:00:00
                            )
                    )
            )

Additional filtering can be performed by supplying the standard
``Model->find()`` options:

::

    $this->Post->find('all', array('contain' => array(
        'Comment' => array(
            'conditions' => array('Comment.author =' => "Daniel"),
            'order' => 'Comment.created DESC'
        )
    )));

Here's an example of using the ``ContainableBehavior`` when you've got
deep and complex model relationships.

Let's consider the following model associations:

::

    User->Profile
    User->Account->AccountSummary
    User->Post->PostAttachment->PostAttachmentHistory->HistoryNotes
    User->Post->Tag

This is how we retrieve the above associations with Containable:

::

    $this->User->find('all', array(
        'contain'=>array(
            'Profile',
            'Account' => array(
                'AccountSummary'
            ),
            'Post' => array(
                'PostAttachment' => array(
                    'fields' => array('id', 'name'),
                    'PostAttachmentHistory' => array(
                        'HistoryNotes' => array(
                            'fields' => array('id', 'note')
                        )
                    )
                ),
                'Tag' => array(
                    'conditions' => array('Tag.name LIKE' => '%happy%')
                )
            )
        )
    ));

Keep in mind that ``contain`` key is only used once in the main model,
you don't need to use 'contain' again for related models

When using 'fields' and 'contain' options - be careful to include all
foreign keys that your query directly or indirectly requires. Please
also note that because Containable must to be attached to all models
used in containment, you may consider attaching it to your AppModel.

Using Containable with pagination
=================================

By including the 'contain' parameter in the ``$paginate`` property it
will apply to both the find('count') and the find('all') done on the
model

See the section `Using
Containable <https://book.cakephp.org/view/1324/Using-Containable>`_ for
further details.

Here's an example of how to contain associations when paginating.

::

    $this->paginate['User'] = array(
        'contain' => array('Profile', 'Account'),
        'order' => 'User.username'
    );

    $users = $this->paginate('User');

ContainableBehavior options
===========================

The ``ContainableBehavior`` has a number of options that can be set when
the Behavior is attached to a model. The settings allow you to fine tune
the behavior of Containable and work with other behaviors more easily.

-  **recursive** (boolean, optional) set to true to allow containable to
   automatically determine the recursiveness level needed to fetch
   specified models, and set the model recursiveness to this level.
   setting it to false disables this feature. The default value is
   ``true``.
-  **notices** (boolean, optional) issues E\_NOTICES for bindings
   referenced in a containable call that are not valid. The default
   value is ``true``.
-  **autoFields**: (boolean, optional) auto-add needed fields to fetch
   requested bindings. The default value is ``true``.

You can change ContainableBehavior settings at run time by reattaching
the behavior as seen in `Using
behaviors </de/view/1072/Using-Behaviors>`_

ContainableBehavior can sometimes cause issues with other behaviors or
queries that use aggregate functions and/or GROUP BY statements. If you
get invalid SQL errors due to mixing of aggregate and non-aggregate
fields, try disabling the ``autoFields`` setting.

::

    $this->Post->Behaviors->attach('Containable', array('autoFields' => false));

