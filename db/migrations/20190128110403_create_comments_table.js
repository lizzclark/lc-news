exports.up = function(connection, Promise) {
  return connection.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('username')
      .references('users.username')
      .notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.text('body').notNullable();
    commentsTable.timestamps('created_at', true);
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('comments');
};
