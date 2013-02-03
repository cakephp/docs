CakePHP Development Process
###########################

Here we attempt to explain the process we use when developing the
CakePHP framework. We rely heavily on community interaction through
tickets and IRC chat. IRC is the best place to find members of the
`development team <https://github.com/cakephp?tab=members>`_ and discuss
ideas, the latest code, and make general comments. If something more
formal needs to be proposed or there is a problem with a release, the
ticket system is the best place to share your thoughts.

We currently maintain 4 versions of CakePHP.

-  **stable** : Tagged releases intended for production where stability
   is more important than features. Issues filed against these releases
   will be fixed in the related branch, and be part of the next release.
-  **maintenance branch** : Development branches become maintenance
   branches once a stable release point has been reached. Maintenance
   branches are where all bugfixes are committed before making their way
   into a stable release. Maintenance branches have the same name as the
   major version they are for example *1.2*. If you are using a stable
   release and need fixes that haven't made their way into a stable
   release check here.
-  **development branches** : Development branches contain leading edge
   fixes and features. They are named after the version number they are
   for example *1.3*. Once development branches have reached a stable
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

As always, if you have any questions or comments, visit us at #cakephp
on irc.freenode.net.


.. meta::
    :title lang=en: CakePHP Development Process
    :keywords lang=en: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
