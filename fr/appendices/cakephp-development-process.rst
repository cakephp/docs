Le processus de développement CakePHP
#####################################

Ici, nous tenterons d'expliquer le processus que nous utilisons lors de l'élaboration du
CakePHP. Nous comptons beaucoup sur l'interaction communautaire par le biais
billets et par le chat IRC. IRC est le meilleur endroit pour trouver des membres de
l'équipe de développement et pour discuter d'idées, du dernier code, et de faire des
commentaires généraux. Si quelque chose de plus formel doit être proposé ou s'il y a un
problème avec une version sortie, le système de ticket est le meilleur endroit pour
partager vos idées.

Nous maintenons 4 versions de CakePHP.

-  **stable** : Tagged releases intended for production where stability
   is more important than features. Issues filed against these releases
   will be fixed in the related branch, and be part of the next release.
-  **maintenance branch** : Development branches become maintenance
   branches once a stable release point has been reached. Maintenance
   branches are where all bugfixes are committed before making their way
   into a stable release. Maintenance branches have the same name as the
   major version they are for. eg. *1.2*. If you are using a stable
   release and need fixes that haven't made their way into a stable
   release check here.
-  **development branches** : Development branches contain leading edge
   fixes and features. They are named after the version number they are
   for. eg. *1.3*. Once development branches have reached a stable
   release point they become maintenance branches, and no further new
   features are introduced unless absolutely necessary.
-  **feature branches** : Feature branches contain unfinished or
   possibly unstable features and are recommended only for power users
   interested in the most advanced feature set and willing to contribute
   back to the community. Feature branches are named with the following
   convention *version-feature*. An example would be *1.3-router* Which
   would contain new features for the Router for 1.3.

Hopefully this will help you understand what version is right for you.
Once you pick your version you may feel compelled to contribute a bug
report or make general comments on the code.

-  If you are using a stable version or maintenance branch, please submit
   tickets or discuss with us on IRC.
-  If you are using the development branch or feature branch, the first
   place to go is IRC. If you have a comment and cannot reach us in IRC
   after a day or two, please submit a ticket.

If you find an issue, the best answer is to write a test. The best
advice we can offer in writing tests is to look at the ones included in
the core.

Comme toujours, si vous avez n'importe quelle question ou commentaire, visitez nous
sur #cakephp sur irc.freenode.net.


.. meta::
    :title lang=fr: Processus de développement de CakePHP
    :keywords lang=fr: branche de maintenance, interaction communautaire,fontionnalité communautaire,fonctionnalité nécessaire,version sortie stable,système de ticket,fonctionnalité avancée,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branche de développement