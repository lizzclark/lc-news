exports.up = function(connection, Promise) {
  return connection.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articlesTable
      .string('username')
      .references('users.username')
      .notNullable();
    articlesTable.timestamps('created_at', true);
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('articles');
};
