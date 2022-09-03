Checking HTTP Cache
===================

.. php:class:: CheckHttpCacheComponent(ComponentCollection $collection, array $config = [])

.. versionadded:: 4.4.0
    La classe ``CheckHttpCacheComponent`` a été ajoutée.

Le modèle de validation du cache HTTP est un des process utilisés pour les
passerelles de cache, aussi connues comme mandataires inversés (*reverse
proxies*), pour déterminer si elles peuvent servir à stocker une copie de la
réponse au client. Dans ce modèle, vous économisez surtout de la bande passante,
mais quand vous l'utilisez correctement vous pouvez également économiser du CPU,
et réduire les temps de réponse::

    // dans un Controller
    public function initialize(): void
    {
        parent::initialize();

        $this->addComponent('CheckHttpCache');
    }

Le fait d'activer ``CheckHttpCacheComponent`` dans votre controller active
automatiquement une vérification de ``beforeRender``. Cette vérification compare
les en-têtes de cache définies dans l'objet response avec les en-têtes de cache
envoyées dans la requête, pour déterminer si la réponse n'a pas été modifiée
depuis la dernière fois que le client l'a demandée. Les en-têtes de requête
utilisées sont les suivantes:

* ``If-None-Match`` est comparée avec l'en-tête ``Etag`` de la réponse.
* ``If-Modified-Since`` est comparée avec l'en-tête ``Last-Modified`` de la
  réponse.

Si les en-têtes de la réponse correspondent aux critères des en-têtes de la
requête, alors on saute l'étape de rendu de la vue. Cela évite à votre
application de générer la vue, ce qui économise de la bande passante et du
temps. Lorsque les en-têtes de la réponse correspondent, on renvoie une réponse
vide avec le code de status ``304 Not Modified``.
