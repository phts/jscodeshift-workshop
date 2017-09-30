// Step #4
// On this step: Learn path objects

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
    // Recast itself relies heavily on ast-types which defines methods to traverse the AST,
    // access node fields and build new nodes.
    // ast-types wraps every AST node into a path object.
    // Paths contain meta-information and helper methods to process AST nodes.
    //
    // For example, the child-parent relationship between two nodes is not explicitly defined.
    // Given a plain AST node, it is not possible to traverse the tree up.
    // Given a path object however, the parent can be traversed to via path.parent.
    //
    // For more information about the path object API, please have a look at ast-types.
    // https://github.com/benjamn/ast-types
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
}
