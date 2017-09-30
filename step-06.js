// Step #6
// On this step:
// Transform lodash methods only if two arguments and the second argument is a function.
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
    .find(j.CallExpression, isLodashExpression)
    // filter(callback: fn(path: NodePath) -> bool) -> Collection
    // https://github.com/facebook/jscodeshift/blob/master/src/Collection.js#L64
    .filter(filterLodashExpressionWithFunction)
    .forEach(transformExpression(j));

  return ast.toSource();
};

function transformExpression(j) {
  return path => {
    const methodName = path.node.callee.property.name;
    const nativeMapping = NATIVE_METHODS[methodName];
    if (nativeMapping) {
      transformNativeMethod(j, path);
    }
  };
}

function isLodashExpression(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === '_'
  );
}

function filterLodashExpressionWithFunction(path) {
  return (
    path.node.arguments.length === 2 &&
    (path.node.arguments[1].type === 'FunctionExpression' || path.node.arguments[1].type === 'ArrowFunctionExpression')
  );
}

function transformNativeMethod(j, path) {
  const methodName = path.node.callee.property.name;
  const nativeMapping = NATIVE_METHODS[methodName];

  j(path).replaceWith(
    j.callExpression(
      j.memberExpression(
        path.node.arguments[0],
        j.identifier(nativeMapping)
      ),

      path.node.arguments.slice(1)
    )
  );
}
