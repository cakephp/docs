Email
#####

Le composant Email est une manière simple d'ajouter une fonctionnalité
d'envoi de mail à votre application CakePHP. Utilisant les mêmes
concepts de fichiers dispositions (layout) et de vues pour envoyer des
emails au format html, texte ou les deux. Il offre le support de l'envoi
via la fonction incluse dans PHP, via un serveur smtp ou un mode debug
qui écrit dans un message flash de session. Il supporte l'envoi de
fichiers joints et opère quelques vérifications/filtrages basics sur le
header. Il y a quand même pas mal de choses que ce composant ne peut pas
faire pour vous, mais il offre des fonctionnalités de démarrage.

Attributs de la classe et variables
===================================

Ci-dessous les valeurs qu'on peut positionner avant d'appeler
``EmailComponent::send()``

to
    adresse de destination (string)
cc
    tableau des adresses en copie du message
bcc
    tableau des adresses en copie cachée *bcc (blind carbon copy)*
replyTo
    adresse de réponse (string)
return
    adresse email de retour utilisée en cas d'erreur (string) (pour les
    erreurs de démon de mail : *mail-daemon/errors*)
from
    adresse de provenance (string)
subject
    sujet du message (string)
template
    l'élément email à utiliser pour le message (situé dans
    ``app/views/elements/email/html/`` et
    ``app/views/elements/email/text/``)
layout
    le layout utilisé pour l'email (situé dans
    ``app/views/layouts/email/html/`` et
    ``app/views/layouts/email/text/``)
lineLength
    longueur à laquelle les lignes doivent être coupées. Défaut à 70.
    (integer)
sendAs
    format auquel vous souhaitez envoyer le message (string, valeurs
    possibles : ``text``, ``html`` ou ``both``)
attachments
    tableau des fichiers à joindre (chemin relatif ou absolu)
delivery
    comment envoyer le message (``mail``, ``smtp`` [requiert le
    positionnement des smtpOptions ci-dessous] et ``debug``)
smtpOptions
    tableau associatif d'options pour smtp mailer (``port``, ``host``,
    ``timeout``, ``username``, ``password``, ``client``)

Il y a quelques autres choses qui peuvent être paramétrées, mais vous
devriez vous référez à l'API pour plus d'informations

Envoyer des messages multiples dans une boucle
----------------------------------------------

Si vous désirez envoyer des emails multiples dans une boucle, vous aurez
besoin de re-initialiser les propriétés du composant avec la méthode
reset. Cette initialisation doit précéder le positionnement des
propriétés du nouvel email.

::

    $this->Email->reset()

Envoyer un message simple
=========================

Pour envoyer un message sans utiliser de template, passez simplement le
corps du message comme une chaîne (ou un tableau de lignes) à la méthode
send(). Par exemple :

::

    $this->Email->from    = 'Quelqu\'un <quelqu-un@exemple.com>';
    $this->Email->to      = 'Quelqu\'un d\'autre <quelqu-un-d-autre@exemple.com>';
    $this->Email->subject = 'Test';
    $this->Email->send('Corps du message !');

Mettre en place les gabarits
----------------------------

Pour obtenir à la fois des emails au format html et texte, vous aurez
besoin de créer deux gabarits (*layouts*), comme lorsque vous mettez en
place vos gabarits pour l'affichage de vos vues dans le navigateur. Vous
devrez mettre en place des gabarits par défaut pour les messages email.
Dans le répertoire ``app/views/layouts/``, il vous faudra placer la
structure minimum suivante :

::

        email/
            html/
                default.ctp
            text/
                default.ctp

Ce sont les fichiers qui contiennent les modèles de gabarits par défaut
pour vos messages. Des exemples ci-dessous :

``email/text/default.ctp``

::

        <?php echo $content_for_layout; ?>

``email/html/default.ctp``

::

    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <html>
        <body>
            <?php echo $content_for_layout; ?>
        </body>
    </html>

Mettre en place un élément email pour le corps du message
---------------------------------------------------------

Dans le répertoire de code ``app/views/elements/email/`` vous devrez
créer deux répertoires pour ``text`` et ``html`` à moins que vous ne
prévoyiez d'envoyer les messages que dans un des deux formats. Dans
chacun de ces répertoires, vous devrez créer les patrons (templates)
pour chaque type de message en se référant au contenu que vous envoyiez
à la vue en utilisant soit $this->set() soit le paramètre $contents de
la méthode send(). Quelques exemples simples sont montrés ci-dessous.
Pour ces exemples on appelle le patron (template) simple\_message.ctp

``text``

::

     Cher <?php echo $User['first']. ' ' . $User['last'] ?>,
       Merci de votre intérêt.

``html``

::

     <p>Cher <?php echo $User['first']. ' ' . $User['last'] ?>,<br />
     &nbsp;&nbsp;&nbsp;Merci de votre intérêt.</p>

Contrôleur
----------

Dans votre contrôleur, vous devrez ajouter le composant au tableau de
composants ``$components`` ou ajouter ce tableau $components à votre
contrôleur de cette façon :

::

    <?php
    var $components = array('Email');
    ?>

Dans cet exemple, nous allons écrire une méthode privée pour prendre en
charge les messages email vers un utilisateur identifié par son $id.
Dans votre contrôleur (le contrôleur User dans cet exemple) :

::

     
    <?php
    function _envoiMailNouvelUtilisateur($id) {
        $Utilisateur = $this->Utilisateur ->read(null,$id);
        $this->Email->to = $Utilisateur ['Utilisateur']['email'];
        $this->Email->bcc = array('secret@exemple.com');
        $this->Email->subject = 'Bienvenue à ce truc très cool';
        $this->Email->replyTo = 'support@exemple.com';
        $this->Email->from = 'Appli Web Extra Cool <app@exemple.com>';
        $this->Email->template = 'simple_message'; // notez l'absence de '.ctp'
        // Envoi en 'html', 'text' ou 'both' (par défaut c'est 'text')
        $this->Email->sendAs = 'both'; // parce que nous aimons envoyer de jolis emails
        // Positionner les variables comme d'habitude
        $this->set('Utilisateur', $Utilisateur);
        // Ne passer aucun argument à send()
        $this->Email->send();
     }
    ?>

Voilà pour l'envoi du message. Vous pourriez appeler cette méthode
depuis une autre méthode de cette façon :

::

     
    $this->_envoiMailNouvelUtilisateur( $this->Utilisateur->id );

Envoyer un Message par SMTP
===========================

Pour envoyer un email en utilisant un serveur SMTP, les étapes sont
similaires à l'envoi d'un message basique. Définissez la méthode de
distribution à ``smtp`` et assignez toutes les options à la propriété
``smtpOptions`` de l'objet Email. Vous pouvez aussi récupérer les
erreurs SMTP générées durant la session, en lisant la propriété
``smtpError`` du composant.

::

       /* Options SMTP */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'votre.serveur.smtp',
            'username'=>'votre_login_smtp',
            'password'=>'votre_mot_de_passe_smtp',
            'client' => 'nom_machine_smtp_helo'
       );

        /* Définir la méthode de distribution */
        $this->Email->delivery = 'smtp';

        /* Ne passer aucun argument à send() */
        $this->Email->send();

        /* Vérification des erreurs SMTP. */
        $this->set('smtp-errors', $this->Email->smtpError);

Si votre serveur SMTP nécessite une authentification, assurez-vous de
définir les parmètres nom d'utilisateur et mot de passe dans
``smtpOptions``, comme indiqué dans l'exemple.

Si vous ne savez pas ce qu'est un HELO SMTP, alors vous ne devriez pas
avoir besoin de définir le paramètre ``client`` dans ``smtpOptions``.
Celui-ci est seulement nécessaire pour les serveurs SMTP qui ne
respectent pas pleinement la RFC 821 (SMTP HELO).
