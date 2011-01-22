7.5.2 Creating a Javascript Engine
----------------------------------

Javascript engine helpers follow normal helper conventions, with a
few additional restrictions. They must have the ``Engine`` suffix.
``DojoHelper`` is not good, ``DojoEngineHelper`` is correct.
Furthermore, they should extend ``JsBaseEngineHelper`` in order to
leverage the most of the new API.
