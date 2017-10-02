// Step #3
// On this step:
// Find lodash expressions like _.method().
// Learn node objects.

module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);

  ast
    .find(j.CallExpression, isLodashCallExpression)
    .forEach(path => {
      console.log(path.node);
    });

  return ast.toSource();
};

function isLodashCallExpression(node) {
  // Node properties
  // An AST node is a plain JavaScript object with a specific set of fields.
  // The primary way to identify nodes is via their type.
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === '_'
  );
}
