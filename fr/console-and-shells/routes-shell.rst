Shell Routes
############

.. versionadded:: 3.1
    RoutesShell a été ajoutée dans 3.1

RoutesShell fournit une interface CLI simple d'utilisation pour tester et
débugger les routes. Vous pouvez l'utiliser pour tester la façon dont les
routes sont parsées et ce que les paramètres de routing des URLs vont générer.

Récupérer une Liste de Toutes les Routes
----------------------------------------

::

    bin/cake routes

Tester le parsing de l'URL
--------------------------

Vous pouvez rapidement voir comment une URL sera parsée en utilisant la méthode
``check``::

    bin/cake routes check /bookmarks/edit/1

Si votre route contient un paramètre de query string, n'oubliez pas d'entourer
l'URL de guillemets::

    bin/cake routes check "/bookmarks/?page=1&sort=title&direction=desc"

Tester la Génération d'URL
--------------------------

Vous pouvez regarder la façon dont un :term:`tableau de routing` va générer
l'URL en utilisant la méthode ``generate``::

    bin/cake routes generate controller:Bookmarks action:edit 1
