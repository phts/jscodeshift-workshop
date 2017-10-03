// Step #2
// On this step: learn Collection methods like `find` and `forEach`.

module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);

  // In order to transform the AST, you have to traverse it and find the nodes
  // that need to be changed. jscodeshift is built around the idea of collections of
  // paths and thus provides a different way of processing an AST than recast or ast-types.
  //
  // A collection has methods to process the nodes inside a collection, often resulting
  // in a new collection. This results in a fluent interface, which can make the transform
  // more readable.
  //
  // To learn about the provided methods, have a look at the Collection.js and its extensions
  // see: https://github.com/facebook/jscodeshift/blob/master/src/Collection.js
  //
  // Find lodash expressions and transform it to native methods
  //
  // ast#find(type: TypeDefinition, filter?)
  // https://github.com/facebook/jscodeshift/blob/master/src/collections/Node.js#L34
  //
  // ast#forEach(callback: fn(path: NodePath))
  // https://github.com/facebook/jscodeshift/blob/master/src/Collection.js#L74
  ast
    .find(j.CallExpression, isLodashCallExpression)
    .forEach((path, index) => {
      console.log(index+1, path.node);
    });

  return ast.toSource();
};

/**
 * Checks if this node is lodash expression like _.forEach()
 */
function isLodashCallExpression(node) {
  return true;
}
