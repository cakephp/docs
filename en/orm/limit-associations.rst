Limit contained associations per record/group
#############################################

By default containing an association will always load all associated entities.
But in certain scenarios you only want to show the first few items sorted by e.g. ``created``.

In general this problem is called the ``greatest-n-per-group`` and here are a few ways how you can
achieve this behavior.

In the following scenarios lets image a database with a **Articles hasMany Abstracts** schema.

.. _a-library-solution:

A library solution
==================

With `icings/partitionable <https://github.com/icings/partitionable>`__ you have a
rather nice way to define ``partitionable`` associations like this ::

    // inside your table class initialize() method
    $this
        ->partitionableHasMany('TopAbstracts')
        ->setClassName('Abstracts')
        ->setLimit(1)
        ->setSort([
            'Abstracts.points' => 'DESC',
            'Abstracts.id' => 'ASC',
        ]);

``TopAbstracts`` can then be part of any ``contain`` query just like all other associations.

.. tip::

    Please make sure your DBMS is supported to do these kind of ``window`` functions in SQL.
    Check the plugins requirements for further information.


.. _custom-solutions-on-association-level:

Custom solutions on association level
=====================================

Select strategy - Using a join on a grouping, max-value subquery
----------------------------------------------------------------

This will select the top comments via a join query that is based on the max points::

    $this->hasOne('TopAbstracts', [
        'className' => 'Abstracts',
        'strategy' => 'select',
        'conditions' => function (\Cake\Database\Expression\QueryExpression $exp, \Cake\ORM\Query $query) {
            $query->innerJoin(
                [
                    'AbstractsFilter' => $query
                        ->getConnection()
                        ->newQuery()
                        ->select(['article_id', 'points' => $query->func()->max('points')])
                        ->from('abstracts')
                        ->group('article_id')
                ],
                [
                    'TopAbstracts.article_id = AbstractsFilter.article_id',
                    'TopAbstracts.points = AbstractsFilter.points'
                ]
            );
            return [];
        }
    ]);

this will look something like this::

    SELECT
        TopAbstracts.id AS `TopAbstracts__id`, ...
    FROM
        abstracts TopAbstracts
    INNER JOIN (
            SELECT
                article_id, (MAX(points)) AS `points`
            FROM
                abstracts
            GROUP BY
                article_id
        )
        AbstractsFilter ON (
            TopAbstracts.article_id = AbstractsFilter.article_id
            AND
            TopAbstracts.points = AbstractsFilter.points
        )
    WHERE
        TopAbstracts.article_id in (1,2,3,4,5,6,7,8, ...)


Select strategy - Using left self-join filtering
------------------------------------------------

Another alternative is self-joining like so::

    $this->hasOne('TopAbstracts', [
        'className' => 'Abstracts',
        'strategy' => 'select',
        'conditions' => function (\Cake\Database\Expression\QueryExpression $exp, \Cake\ORM\Query $query) {
            $query->leftJoin(
                ['AbstractsFilter' => 'abstracts'],
                [
                    'TopAbstracts.article_id = AbstractsFilter.article_id',
                    'TopAbstracts.points < AbstractsFilter.points'
                ]);
            return $exp->add(['AbstractsFilter.id IS NULL']);
        }
    ]);

This will use a self-join that filters based on the rows that don't have ``a.points < b.points``, it will look something like::

    SELECT
        TopAbstracts.id AS `TopAbstracts__id`, ...
    FROM
        abstracts TopAbstracts
    LEFT JOIN
        abstracts AbstractsFilter ON (
            TopAbstracts.article_id = AbstractsFilter.article_id
            AND
            TopAbstracts.points < AbstractsFilter.points
        )
    WHERE
        (AbstractsFilter.id IS NULL AND TopAbstracts.article_id in (1,2,3,4,5,6,7,8, ...))


Join strategy - Using a subquery for the join condition
-------------------------------------------------------

Another alternative is a subquery like so::

    $this->hasOne('TopAbstracts', [
        'className' => 'Abstracts',
        'foreignKey' => false,
        'conditions' => function (\Cake\Database\Expression\QueryExpression $exp, \Cake\ORM\Query $query) {
            $subquery = $query
                ->getConnection()
                ->newQuery()
                ->select(['SubTopAbstracts.id'])
                ->from(['SubTopAbstracts' => 'abstracts'])
                ->where(['Articles.id = SubTopAbstracts.article_id'])
                ->order(['SubTopAbstracts.points' => 'DESC'])
                ->limit(1);

            return $exp->add(['TopAbstracts.id' => $subquery]);
        }
    ]);

This will use a correlated subquery that uses a rather specific select with simple ordering and
limiting to pick the top comment.

Note that the foreignKey option is set to false in order to avoid an additional
`Articles.id = TopAbstracts.article_id` condition to be compiled into the join conditions.

The query will look like this::

    SELECT
        Articles.id AS `Articles__id`, ... ,
        TopAbstracts.id AS `TopAbstracts__id`, ...
    FROM
        articles Articles
    LEFT JOIN
        abstracts TopAbstracts ON (
            TopAbstracts.id = (
                SELECT
                    SubTopAbstracts.id
                FROM
                    abstracts SubTopAbstracts
                WHERE
                    Articles.id = SubTopAbstracts.article_id
                ORDER BY
                    SubTopAbstracts.points DESC
                LIMIT
                    1
            )
        )

All these 3 options will query and inject the records without any hackery, it's just not very "straightforward".


.. _a-manual-approach:

A manual approach
=================

If you want to go even deeper you can of course manually load the associated records yourself as well.

.. _window-functions:

Using window functions
----------------------

.. note::

    Please make sure your DBMS supports `window functions <https://mode.com/sql-tutorial/sql-window-functions/>`__

You could query all associated records in a single additional query. For example::

    $query = $this->Articles
        ->find()
        ->formatResults(function(\Cake\Collection\CollectionInterface $results) {
            // extract the article IDs from the results
            $articleIds = array_unique($results->extract('id')->toArray());

            // rank abstracts by points, partitioned by article
            $rankedAbstracts = $this->Articles->Abstracts
                ->find()
                ->select(function (\Cake\ORM\Query $query) {
                    return [
                        'id' => 'id',
                        // as of CakePHP 4.1
                        'row_num' => $query
                            ->func()
                            ->rowNumber()
                            ->over()
                            ->partition(['Abstracts.article_id'])
                            ->order(['Abstracts.points' => 'DESC']),
                        // in earlier CakePHP versions instead
                        /*
                        'row_num' => $query->newExpr('
                            ROW_NUMBER() OVER (
                                PARTITION BY Abstracts.article_id
                                ORDER BY Abstracts.points DESC
                            )
                        '),
                        */
                    ];
                })
                ->where([
                    'Abstracts.article_id IN' => $articleIds,
                ]);

            // fetch top abstracts by ranking
            $topAbstracts = $this->Articles->Abstracts
                ->find()
                ->innerJoin(
                    ['RankedAbstracts' => $rankedAbstracts],
                    function (
                        \Cake\Database\Expression\QueryExpression $exp,
                        \Cake\ORM\Query $query
                    ) {
                        return [
                            'RankedAbstracts.id' => $query->identifier(
                                'Abstracts.id'
                            ),
                            'RankedAbstracts.row_num' => 1,
                        ];
                    }
                )
                ->all();

            // inject the associated records into the results
            return $results->map(function ($row) use ($topAbstracts) {
                $row['top_abstract'] = $topAbstracts
                    ->filter(function ($value, $key) use ($row) {
                        return $value['article_id'] === $row['id'];
                    })
                    ->first();

                return $row;
            });
        })

Note that if one wanted to limit to more than 1 result, this could easily be achieved
by testing for ``'RankedAbstracts.row_num <=' => $limit`` instead,
and injecting all matching records by using ``->toList()`` instead of ``->first()``.

The query will look something like::

    SELECT
        Abstracts.id ...
    FROM
      abstracts Abstracts
    INNER JOIN
        (
            SELECT
                id AS id,
                ROW_NUMBER() OVER (
                    PARTITION BY Abstracts.article_id
                    ORDER BY Abstracts.points DESC
                ) AS row_num
            FROM
                abstracts Abstracts
            WHERE
                Abstracts.article_id IN (...)
        )
        RankedAbstracts ON
            RankedAbstracts.id = Abstracts.id AND
            RankedAbstracts.row_num = 1

See also :ref:`query-window-functions`


Fetch for each parent record individually
=========================================

If your DBMS is outdated and doesn't support window functions, then another
manual approach would be to issue an additional query for each article to
fetch the associated top abstract (eg. 100 articles would mean 100 additional queries!).

.. note::

    Usually one would try to avoid doing this, as it can very quickly perform
    rather badly depending on the size of the result set.

For example::

    $query = $this->Articles
        ->find()
        ->formatResults(function(\Cake\Collection\CollectionInterface $results) {
            return $results->map(function ($row) {
                // query the top abstract for the current article
                // and inject it into the result
                $row['top_abstract'] = $this->Articles->Abstracts
                    ->find()
                    ->where(['Abstracts.article_id' => $row['id']])
                    ->sort(['Abstracts.points' => 'DESC'])
                    ->limit(1)
                    ->all()
                    ->first();

                return $row;
            });
        });

See also :ref:`format-results`
