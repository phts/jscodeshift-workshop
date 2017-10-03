// Step #5
// On this step:
// Transform lodash methods to native methods.
// Learn j#replaceWith(node) and builders.

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
    .filter(filterMappedMethods)
    .filter(filterLodashExpressionWithFunction)
    .forEach(path => {
      // ADDED:
      transform(j, path);
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

function filterMappedMethods(path) {
  const methodName = path.node.callee.property.name;
  return !!NATIVE_METHODS[methodName];
}

function filterLodashExpressionWithFunction(path) {
  return (
    path.node.arguments.length === 2 &&
    (
      path.node.arguments[1].type === 'FunctionExpression' ||
      path.node.arguments[1].type === 'ArrowFunctionExpression'
    )
  );
}

// ADDED:
function transform(j, path) {
  const methodName = path.node.callee.property.name;
  const nativeMapping = NATIVE_METHODS[methodName];

  // j#replaceWith(node)
  j(path).replaceWith(
    // j.callExpression, j.memberExpression - builders
    // j.callExpression(callee, arguments)
    // "The signature of each builder function is best learned by having a look at the definition files."
    // https://github.com/benjamn/ast-types/blob/master/def/
    j.callExpression(
      // j.memberExpression(object, property)
      // member expression like items.forEach
      j.memberExpression(
        // items
        path.node.arguments[0],
        // forEach
        j.identifier(nativeMapping)
      ),

      // getting arguments without first one: (items, arg1, arg2) ==> (arg1, arg2)
      path.node.arguments.slice(1)
    )
  );
}
