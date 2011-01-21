3.12.2 Customizing Scaffold Views
---------------------------------

If you're looking for something a little different in your
scaffolded views, you can create templates. We still don't
recommend using this technique for production applications, but
such a customization may be useful during prototyping iterations.

Customization is done by creating view templates:

::

    Custom scaffolding views for a specific controller 
    (PostsController in this example) should be placed like so:
    
    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp
    
    Custom scaffolding views for all controllers should be placed like so:
    
    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

3.12.2 Customizing Scaffold Views
---------------------------------

If you're looking for something a little different in your
scaffolded views, you can create templates. We still don't
recommend using this technique for production applications, but
such a customization may be useful during prototyping iterations.

Customization is done by creating view templates:

::

    Custom scaffolding views for a specific controller 
    (PostsController in this example) should be placed like so:
    
    /app/views/posts/scaffold.index.ctp
    /app/views/posts/scaffold.show.ctp
    /app/views/posts/scaffold.edit.ctp
    /app/views/posts/scaffold.new.ctp
    
    Custom scaffolding views for all controllers should be placed like so:
    
    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp
