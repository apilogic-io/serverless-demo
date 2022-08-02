exports.up = (client, workingDirectory) => {
  return client.createIndex(
    'posts',
    workingDirectory,
    '/../indices/posts/index-settings.json',
    '/../indices/posts/v1_schema.json'
  );
};
