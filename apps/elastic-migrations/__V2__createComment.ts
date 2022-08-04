exports.up = (client, workingDirectory) => {
  return client.createIndex(
    'comments',
    workingDirectory,
    '/../indices/comments/index-settings.json',
    '/../indices/comments/v2_schema.json'
  );
};
