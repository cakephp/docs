EmailComponent
##############

:php:class:`EmailComponent`  est maintenant déprécié, mais il continue à 
fonctionner. En interne cette classe utilise :php:class:`CakeEmail` pour 
envoyer des mails. Malheureusement, vous aurez besoin de déplacer vos fichiers 
depuis ``app/views/elements/emails`` vers ``app/View/Emails``. Renommez 
également le répertoire ``email`` en ``Emails`` dans le chemin des layouts.
Si cela affecte d'autres endroits dans votre application, nous vous 
recommandons d'utiliser des liens symboliques.
Nous vous recommandons de mettre à jour votre code pour utiliser la classe 
:php:class:`CakeEmail` au lieu de :php:class:`EmailComponent` . ci dessous
quelques conseils à propos de la migration.

-  L'entête n'est pas changée pour être X-... Ce que vous paramétrez est ce 
   qui est utilisé. Donc rappelez-vous de mettre X- dans vos entêtes perso 
-  La méthode ``send()`` ne reçoit uniquement que le contenu du message. Le 
   template et le layout devrons être paramétrés en utilisant la méthode 
   :php:meth:`CakeEmail::template()`.
   La liste des pièces-jointes devront être un tableau de fichiers 
   (qui apparaîtrons dans l’email) comme clef et valeur le chemin complet du 
   fichier réel.
-  A chaque erreur , :php:class:`CakeEmail` enverra une exception au lieu de 
   retourner false. Nous vous recommandons d'utiliser try/catch pour vous 
   assurer que vos messages sont délivrés correctement.

Ci dessous quelques exemples d'utilisation du composant Email
``EmailComponent ($component)`` et maintenant avec ``CakeEmail ($lib)``:

-  From ``$component->to = 'quelquechose@exemple.com';`` to
   ``$lib->to('quelquechose@exemple.com');``
-  From ``$component->to = 'Alias <quelquechose@exemple.com>';`` to
   ``$lib->to('quelquechose@exemple.com', 'Alias');`` or
   ``$lib->to(array('quelquechose@exemple.com' => 'Alias'));``
-  From ``$component->subject = 'Mon sujet';`` to
   ``$lib->subject('Mon sujet');``
-  From ``$component->date = 'Sun, 25 Apr 2011 01:00:00 -0300';`` to
   ``$lib->addHeaders(array('Date' => 'Sun, 25 Apr 2011 01:00:00 -0300'));``
-  From ``$component->header['Custom'] = 'only my';`` to
   ``$lib->addHeaders(array('X-Custom' => 'only my'));``
-  From ``$component->send(null, 'template', 'layout');`` to
   ``$lib->template('template', 'layout')->send();``
-  From ``$component->delivery = 'smtp';`` to ``$lib->transport('Smtp');``
-  From ``$component->smtpOptions = array('host' => 'smtp.exemple.com');`` to
   ``$lib->config(array('host' => 'smtp.exemple.com'));``
-  From ``$sent = $component->httpMessage;`` to
   ``$sent = $lib->message(CakeEmail::MESSAGE_HTML);``

Pour plus d'information vous devriez lire la documentation
:doc:`/core-utility-libraries/email`


.. meta::
    :title lang=fr: EmailComponent
    :keywords lang=fr: component subject,component delivery,php class,template layout,custom headers,template,method,filenames,alias,lib,array,email,migration,attachments,elements,sun
