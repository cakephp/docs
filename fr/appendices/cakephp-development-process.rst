Le Processus de Développement CakePHP
#####################################

Ici, nous tenterons d'expliquer le processus que nous utilisons lors de
l'élaboration du CakePHP. Nous comptons beaucoup sur l'interaction
communautaire par le biais billets et par le chat IRC. IRC est le meilleur
endroit pour trouver des membres de
`l'équipe de développement <https://github.com/cakephp?tab=members>`_  et pour
discuter d'idées, du dernier code, et de faire des commentaires généraux. Si
quelque chose de plus formel doit être proposé ou s'il y a un problème avec une
version sortie, le système de ticket est le meilleur endroit pour partager vos
idées.

Nous maintenons 4 versions de CakePHP.

-  **version taggée** : Versions taggées pour la production où la stabilité est
   plus importante que les fonctionnalités. Les questions déposées pour ces
   versions seront réglées dans la branche connexe, et feront parti de la
   prochaine version.
-  **branche principale** : Ces branches contiennent tous les correctifs de bug.
   Les versions stables sont taggées à partir de ces branches. ``master`` est la
   branche principale pour les séries de versions actuelles. ``2.x`` est la
   branche de maintenance pour les séries de la version 2.x. Si vous utilisez
   une version stable et que vous avez besoin de correctifs qui n'ont pas fait
   leur chemin dans une version taggée, vérifiez ici.
-  **Branches de développement** : Les branches de développement contiennent
   les derniers correctifs et fonctionnalités. Elles sont nommées d'après le
   numéro de version pour lesquels elles sont faites. Par ex: *3.next*. Une fois
   que les branches de développement ont atteint un niveau de version stable,
   elles sont fusionnées dans la branche principale.
-  **Branches de fonctionnalité** : Les branches de fonctionnalité contiennent
   des fonctionnalités non-finies, possiblement instable et sont recommandées
   uniquement pour les utilisateurs avertis intéressés dans la fonctionnalité
   la plus avancée et qui souhaitent contribuer à la communauté. Les branches
   de fonctionnalité sont nommées selon la convention suivante de
   *version-fonctionnalité*. Un exemple serait *3.3-router* qui contiendrait
   de nouvelles fonctionnalités pour le Routeur dans 3.3.

Espérons que cela vous aide à comprendre quelle version est bonne pour vous.
Une fois que vous choisissez votre version, vous vous sentirez peut-être
contraints de contribuer à un report de bug ou de faire des commentaires
généraux sur le code.

- Si vous utilisez une version stable ou une branche de maintenance, merci de
  soumettre des tickets ou discuter avec nous sur IRC.
- Si vous utilisez la branche de développement ou la branche de fonctionnalité,
  le premier endroit où aller est IRC. Si vous avez un commentaire et ne pouvez
  pas nous atteindre sur IRC après un jour ou deux, merci de nous soumettre un
  ticket.

Si vous trouvez un problème, la meilleure réponse est d'écrire un test. Le
meilleur conseil que nous pouvons offrir dans l'écriture des tests est de
regarder ceux qui sont inclus dans le cœur.

Comme toujours, si vous avez n'importe quelle question ou commentaire,
rendez-nous une visite sur #cakephp sur irc.freenode.net.

.. meta::
    :title lang=fr: Processus de développement de CakePHP
    :keywords lang=fr: branche de maintenance, interaction communautaire,fontionnalité communautaire,fonctionnalité nécessaire,version sortie stable,système de ticket,fonctionnalité avancée,utilisateurs puissants,feature set,chat irc,leading edge,router,nouvelles fonctionnalités,membres,tentative,branches de développement,branche de développement
