exports.up = function(connection, Promise) {
  return connection.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('username')
      .references('users.username')
      .notNullable();
    commentsTable.integer('article_id');
    commentsTable
      .foreign('article_id')
      .references('articles.article_id')
      .onDelete('cascade');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.text('body').notNullable();
    commentsTable.timestamp('created_at', true).defaultTo(connection.fn.now());
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable('comments');
};
