Le processus de développement CakePHP
#####################################

Ici, nous tenterons d'expliquer le processus que nous utilisons lors de 
l'élaboration du CakePHP. Nous comptons beaucoup sur l'interaction 
communautaire par le biais billets et par le chat IRC. IRC est le meilleur 
endroit pour trouver des membres de l'équipe de développement et pour discuter 
d'idées, du dernier code, et de faire des commentaires généraux. Si quelque 
chose de plus formel doit être proposé ou s'il y a un problème avec une version 
sortie, le système de ticket est le meilleur endroit pour partager vos idées.

Nous maintenons 4 versions de CakePHP.

-  **stable** : Versions taggées pour la production où la stabilité est plus 
   importante que les fonctionnalités. Les questions déposées pour ces versions 
   seront réglées dans la branche connexe, et feront parties de la prochaine 
   version.
-  **Branches de maintenance** : Les branches de Développement deviennent des 
   branches de maintenance une fois qu'un niveau stable de la version a été 
   atteint. Les branches de maintenance sont les endroits où toutes les 
   corrections de bugs sont committées avant de faire leur chemin vers une 
   version stable. Les branches de maintenance ont le même nom que la version 
   principale pour lesquelles elles sont faites. Par ex: *1.2*. Si vous 
   utilisez une version stable et avez besoin de correctifs qui n'ont pas fait 
   leur chemin vers une version stable, vérifiez ici.
-  **Branches de développement** : Les branches de Développement contiennent 
   des correctifs de pointe et des fonctionnalités. Ils sont nommés d'après le 
   numéro de version pour lesquels ils sont faits. Par ex: *1.3*. Une fois que 
   les branches de développement ont atteint un niveau de version stable, elles 
   deviennent des branches de maintenance, et plus aucune fonctionnalité 
   nouvelle n'est introduite, à moins que ce soit absolument nécéssaire.
-  **Branches de fonctionnalité** : Les branches de fonctionnalité contiennent 
   des fonctionnalités non-finies, possiblement instable et sont recommandées 
   uniquement pour les utilisateurs avertis interessés dans la fonctionnalité 
   la plus avancée et qui souhaitent contribuer à la communauté. Les branches 
   de fonctionnalité sont nommées selon la convention suivante de 
   *version-fonctionnalité*. Un exemple serait *1.3-routeur* qui contiendrait 
   de nouvelles fonctionnalités pour le Routeur dans 1.3.

Espèrons que cela vous aide à comprendre quel version est bonne pour vous.
Une fois que vous choisissez votre version, vous vous sentirez peut-être 
contraints de contribuer à un report de bug ou de faire des commentaires 
généraux sur le code.

-  Si vous utilisez une version stable ou une branche de maintenance, merci de 
   soumettre des tickets ou discuter avec nous sur IRC.
-  Si vous utilisez la branche de développement ou la branche de 
   fonctionnalité, le premier endroit où aller est IRC. Si vous avez un 
   commentaire et ne pouvez pas nous atteindre  sur IRC après un jour ou deux, 
   merci de nnous soumettre un ticket.

Si vous trouvez un problème, la meilleure réponse es d'écrire un test. Le 
meilleur conseil que nous pouvons offrir dans l'écriture des tests est de 
regarder ceux qui sont inclus dans le coeur.

Comme toujours, si vous avez n'importe quelle question ou commentaire, visitez 
nous sur #cakephp sur irc.freenode.net.


.. meta::
    :title lang=fr: Processus de développement de CakePHP
    :keywords lang=fr: branche de maintenance, interaction communautaire,fontionnalité communautaire,fonctionnalité nécessaire,version sortie stable,système de ticket,fonctionnalité avancée,utilisateurs puissants,feature set,chat irc,leading edge,router,nouvelles fonctionnalités,membres,tentative,branches de développement,branche de développement
