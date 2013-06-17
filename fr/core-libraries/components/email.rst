EmailComponent
##############

:php:class:`EmailComponent` est maintenant déprécié, mais il continue à
fonctionner. En interne, cette classe utilise :php:class:`CakeEmail` pour
envoyer des mails. Malheureusement, vous aurez besoin de déplacer vos fichiers
depuis ``app/views/elements/emails`` vers ``app/View/Emails``. Renommez
également le répertoire ``email`` en ``Emails`` dans le chemin des layouts.
Si cela affecte d'autres endroits dans votre application, nous vous
recommandons d'utiliser des liens symboliques.

Nous vous recommandons de mettre à jour votre code pour utiliser la classe
:php:class:`CakeEmail` au lieu de :php:class:`EmailComponent`. Ci-dessous
quelques conseils à propos de la migration.

-  L'entête n'est pas changée pour être X-... Ce que vous paramétrez est ce
   qui est utilisé. Donc rappelez-vous de mettre X- dans vos entêtes perso
-  La méthode ``send()`` ne reçoit uniquement que le contenu du message. Le
   template et le layout devrons être paramétrés en utilisant la méthode
   :php:meth:`CakeEmail::template()`.
   La liste des pièces-jointes devront être un tableau de fichiers
   (qui apparaîtrons dans l’email) comme clé et valeur le chemin complet du
   fichier réel.
-  A chaque erreur, :php:class:`CakeEmail` enverra une exception au lieu de
   retourner false. Nous vous recommandons d'utiliser try/catch pour vous
   assurer que vos messages sont délivrés correctement.

Ci-dessous quelques exemples d'utilisation du component Email
``EmailComponent ($component)`` et maintenant avec ``CakeEmail ($lib)``:

-  De ``$component->to = 'quelquechose@exemple.com';`` vers
   ``$lib->to('quelquechose@exemple.com');``
-  De ``$component->to = 'Alias <quelquechose@exemple.com>';`` vers
   ``$lib->to('quelquechose@exemple.com', 'Alias');`` or
   ``$lib->to(array('quelquechose@exemple.com' => 'Alias'));``
-  De ``$component->subject = 'Mon sujet';`` vers
   ``$lib->subject('Mon sujet');``
-  De ``$component->date = 'Sun, 25 Apr 2011 01:00:00 -0300';`` vers
   ``$lib->addHeaders(array('Date' => 'Sun, 25 Apr 2011 01:00:00 -0300'));``
-  De ``$component->header['Custom'] = 'only my';`` vers
   ``$lib->addHeaders(array('X-Custom' => 'only my'));``
-  De ``$component->send(null, 'template', 'layout');`` vers
   ``$lib->template('template', 'layout')->send();``
-  De ``$component->delivery = 'smtp';`` vers ``$lib->transport('Smtp');``
-  De ``$component->smtpOptions = array('host' => 'smtp.exemple.com');`` vers
   ``$lib->config(array('host' => 'smtp.exemple.com'));``
-  De ``$sent = $component->httpMessage;`` vers
   ``$sent = $lib->message(CakeEmail::MESSAGE_HTML);``

Pour plus d'informations, vous devriez lire la documentation
:doc:`/core-utility-libraries/email`.


.. meta::
    :title lang=fr: EmailComponent
    :keywords lang=fr: component subject,component delivery,php class,template layout,custom headers,template,method,filenames,alias,lib,array,email,migration,attachments,elements,sun
