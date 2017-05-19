Serveur Shell
#############

``ServerShell`` vous permet de créer un serveur web simple en utilisant le
serveur web de PHP. Bien que ce serveur **ne** soit **pas** fait pour une
utilisation en production, il peut être pratique en développement quand vous
voulez rapidement essayer une idée et ne voulez pas passer du temps à configurer
Apache ou Nginx. Vous pouvez démarrer le serveur shell avec::

    $ bin/cake server

Vous pourrez voir le serveur démarré sur le port 8765. Vous pouvez visiter le
sever CLI en visitant ``http://localhost:8765`` dans votre navigateur. Vous
pouvez fermer le serveur en tapant ``CTRL-C`` dans votre terminal.

Changer le Port et le Document Root
===================================

Vous pouvez personnaliser le port et le document root en utilisant les options::

    $ bin/cake server --port 8080 --document_root path/to/app

