11.1.11 Deleting Posts
----------------------

Next, let's make a way for users to delete posts. Start with a
``delete()`` action in the PostsController:

::

    function delete($id) {
        if ($this->Post->delete($id)) {
            $this->Session->setFlash('The post with id: ' . $id . ' has been deleted.');
            $this->redirect(array('action' => 'index'));
        }
    }

This logic deletes the post specified by $id, and uses
``$this->Session->setFlash()`` to show the user a confirmation
message after redirecting them on to /posts.

Because we're just executing some logic and redirecting, this
action has no view. You might want to update your index view with
links that allow users to delete posts, however:

::

    <!-- File: /app/views/posts/index.ctp -->
    
    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
                    <th>Actions</th>
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
            <?php echo $this->Html->link('Delete', array('action' => 'delete', $post['Post']['id']), null, 'Are you sure?')?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
    
    </table>

This view code also uses the HtmlHelper to prompt the user with a
JavaScript confirmation dialog before they attempt to delete a
post.
