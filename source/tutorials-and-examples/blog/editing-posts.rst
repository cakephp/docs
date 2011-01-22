11.1.12 Editing Posts
---------------------

Post editing: here we go. You're a CakePHP pro by now, so you
should have picked up a pattern. Make the action, then the view.
Here's what the ``edit()`` action of the PostsController would look
like:

::

    function edit($id = null) {
        $this->Post->id = $id;
        if (empty($this->data)) {
            $this->data = $this->Post->read();
        } else {
            if ($this->Post->save($this->data)) {
                $this->Session->setFlash('Your post has been updated.');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

This action first checks for submitted form data. If nothing was
submitted, it finds the Post and hands it to the view. If some data
*has* been submitted, try to save the data using Post model (or
kick back and show the user the validation errors).

The edit view might look something like this:

::

    <!-- File: /app/views/posts/edit.ctp -->
        
    <h1>Edit Post</h1>
    <?php
        echo $this->Form->create('Post', array('action' => 'edit'));
        echo $this->Form->input('title');
        echo $this->Form->input('body', array('rows' => '3'));
        echo $this->Form->input('id', array('type' => 'hidden')); 
        echo $this->Form->end('Save Post');
    ?>

This view outputs the edit form (with the values populated), along
with any necessary validation error messages.

One thing to note here: CakePHP will assume that you are editing a
model if the 'id' field is present in the data array. If no 'id' is
present (look back at our add view), Cake will assume that you are
inserting a new model when ``save()`` is called.

You can now update your index view with links to edit specific
posts:

::

    <!-- File: /app/views/posts/index.ctp  (edit links added) -->
        
    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Action</th>
            <th>Created</th>
        </tr>
    
    <!-- Here's where we loop through our $posts array, printing out post info -->
    
    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'], array('action' => 'view', $post['Post']['id']));?>
                    </td>
                    <td>
                <?php echo $this->Html->link(
                    'Delete', 
                    array('action' => 'delete', $post['Post']['id']), 
                    null, 
                    'Are you sure?'
                )?>
                <?php echo $this->Html->link('Edit', array('action' => 'edit', $post['Post']['id']));?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
    <?php endforeach; ?>
    
    </table>
