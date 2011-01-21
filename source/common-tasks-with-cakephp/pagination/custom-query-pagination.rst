4.9.4 Custom Query Pagination
-----------------------------

Fix me: Please add an example where overriding paginate is
justified

A good example of when you would need this is if the underlying DB
does not support the SQL LIMIT syntax. This is true of IBM's DB2.
You can still use the CakePHP pagination by adding the custom query
to the model.

Should you need to create custom queries to generate the data you
want to paginate, you can override the ``paginate()`` and
``paginateCount()`` model methods used by the pagination controller
logic.

Before continuing check you can't achieve your goal with the core
model methods.

The ``paginate()`` method uses the same parameters as
``Model::find()``. To use your own method/logic override it in the
model you wish to get the data from.

::

    /**
     * Overridden paginate method - group by week, away_team_id and home_team_id
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

You also need to override the core ``paginateCount()``, this method
expects the same arguments as ``Model::find('count')``. The example
below uses some Postgres-specifc features, so please adjust
accordingly depending on what database you are using.

::

    /**
     * Overridden paginateCount method
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

The observant reader will have noticed that the paginate method
we've defined wasn't actually necessary - All you have to do is add
the keyword in controller's ``$paginate`` class variable.

::

    /**
    * Add GROUP BY clause
    */
    var $paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );
    /**
    * Or on-the-fly from within the action
    */
    function index() {
        $this->paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );

However, it will still be necessary to override the
``paginateCount()`` method to get an accurate value.

4.9.4 Custom Query Pagination
-----------------------------

Fix me: Please add an example where overriding paginate is
justified

A good example of when you would need this is if the underlying DB
does not support the SQL LIMIT syntax. This is true of IBM's DB2.
You can still use the CakePHP pagination by adding the custom query
to the model.

Should you need to create custom queries to generate the data you
want to paginate, you can override the ``paginate()`` and
``paginateCount()`` model methods used by the pagination controller
logic.

Before continuing check you can't achieve your goal with the core
model methods.

The ``paginate()`` method uses the same parameters as
``Model::find()``. To use your own method/logic override it in the
model you wish to get the data from.

::

    /**
     * Overridden paginate method - group by week, away_team_id and home_team_id
     */
    function paginate($conditions, $fields, $order, $limit, $page = 1, $recursive = null, $extra = array()) {
        $recursive = -1;
        $group = $fields = array('week', 'away_team_id', 'home_team_id');
         return $this->find('all', compact('conditions', 'fields', 'order', 'limit', 'page', 'recursive', 'group'));
    }

You also need to override the core ``paginateCount()``, this method
expects the same arguments as ``Model::find('count')``. The example
below uses some Postgres-specifc features, so please adjust
accordingly depending on what database you are using.

::

    /**
     * Overridden paginateCount method
     */
    function paginateCount($conditions = null, $recursive = 0, $extra = array()) {
        $sql = "SELECT DISTINCT ON(week, home_team_id, away_team_id) week, home_team_id, away_team_id FROM games";
        $this->recursive = $recursive;
        $results = $this->query($sql);
        return count($results);
    }

The observant reader will have noticed that the paginate method
we've defined wasn't actually necessary - All you have to do is add
the keyword in controller's ``$paginate`` class variable.

::

    /**
    * Add GROUP BY clause
    */
    var $paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );
    /**
    * Or on-the-fly from within the action
    */
    function index() {
        $this->paginate = array(
        'MyModel' => array('limit' => 20, 
                               'order' => array('week' => 'desc'),
                               'group' => array('week', 'home_team_id', 'away_team_id'))
                              );

However, it will still be necessary to override the
``paginateCount()`` method to get an accurate value.
