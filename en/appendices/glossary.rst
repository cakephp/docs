Glossary
########

.. glossary::

    routing array
        An array of attributes that are passed to :php:meth:`Router::url()`.

    html attributes
        An array of key => values that are composed into html attributes. For example::
            
            <?php
            // Given
            array('class' => 'my-class', '_target' => 'blank')

            // Would generate
            class="my-class" _target="blank"

        If an option can be minimized or accepts it's name as the value, then ``true`` 
        can be used::
        
            <?php
            // Given
            array('checked' => true)
            
            // Would generate
            checked="checked"
    
    plugin syntax
        Plugin syntax refers to the dot separated classname indicating classes
        are part of a plugin.  E.g. ``DebugKit.Toolbar`` The plugin is DebugKit,
        and the classname is Toolbar.
