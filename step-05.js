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
    .find(j.CallExpression, isLodashExpression)
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

function transformNativeMethod(j, path) {
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

// There is a known issue. It transforms statements like _.map(items, 'field') to items.map('field') which
// is wrong syntax.
// We have to transform only if the second argument is FunctionExpression or ArrowFunctionExpression.
// It will be fixed in the next step.
