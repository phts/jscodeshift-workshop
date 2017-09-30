// Step #3
// On this step:
// Find lodash expressions like _.method().
// Learn node objects.

module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);

  ast
    .find(j.CallExpression, isLodashExpression)
    .forEach(path => {
      console.log(path.node);
    });

  return ast.toSource();
};

function isLodashExpression(node) {
  // Node properties
  // An AST node is a plain JavaScript object with a specific set of fields,
  // in accordance with the Mozilla Parser API.
  // The primary way to identify nodes is via their type.
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === '_'
  );
}
