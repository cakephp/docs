7.2.5 Marking Non-Cached Content in Views
-----------------------------------------

There will be times when you don't want an *entire* view cached.
For example, certain parts of the page may look different whether a
user is currently logged in or browsing your site as a guest.

To indicate blocks of content that are *not* to be cached, wrap
them in ``<cake:nocache> </cake:nocache>`` like so:

::

    <cake:nocache>
    <?php if ($session->check('User.name')) : ?>
        Welcome, <?php echo $session->read('User.name')?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    </cake:nocache>

It should be noted that once an action is cached, the controller
method for the action will not be called - otherwise what would be
the point of caching the page. Therefore, it is not possible to
wrap ``<cake:nocache> </cake:nocache>`` around variables which are
set from the controller as they will be *null*.
