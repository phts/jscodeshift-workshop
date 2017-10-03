// Step #4
// On this step:
// Filter only calls which can be mapped to native ones.
// Filter only calls which have a function as the second argument.
// Learn path objects.
// Learn `filter` method.

const NATIVE_METHODS = {
  forEach: 'forEach',
  each: 'forEach',
  map: 'map',
  filter: 'filter',
  every: 'every',
  // ...
};

module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);

  ast
    .find(j.CallExpression, isLodashCallExpression)
    // filter(callback: fn(path: NodePath) -> bool) -> Collection
    // https://github.com/facebook/jscodeshift/blob/master/src/Collection.js#L64
    .filter(filterMappedMethods)
    .filter(filterLodashExpressionWithFunction)
    .forEach((path, index) => {
      console.log(index+1, path.node);
    });

  return ast.toSource();
};

function isLodashCallExpression(node) {
  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === '_'
  );
}

// ADDED:
function filterMappedMethods(path) {
  const methodName = path.node.callee.property.name;
  return !!NATIVE_METHODS[methodName];
}

//ADDED:
function filterLodashExpressionWithFunction(path) {
  return (
    path.node.arguments.length === 2 &&
    (
      path.node.arguments[1].type === 'FunctionExpression' ||
      path.node.arguments[1].type === 'ArrowFunctionExpression'
    )
  );
}
