// Step #1
// On this step: create empty transform function with boilerplate.

/**
 * @param fileInfo - Holds information about the currently processed file
 * @param fileInfo.path - File path
 * @param fileInfo.source - File source
 *
 * @param api - This object exposes the jscodeshift library and helper functions from the runner.
 * @param api.jscodeshift - A reference to the jscodeshift library
 * @param api.stats - A function to collect statistics during --dry runs
 *
 * @param options - Contains all options that have been passed to runner.
 */
module.exports = function (fileInfo, api, options) {
  const j = api.jscodeshift;

  // We will work with this AST
  const ast = j(fileInfo.source);


  // If a string is returned and it is different from passed source,
  // the transform is considered to be successful.
  // If a string is returned but it's the same as the source,
  // the transform is considered to be unsuccessful.
  // If nothing is returned, the file is not supposed to be transformed (which is ok).
  return ast.toSource();
};
