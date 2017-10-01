// These should be transformed to native methods:
_.forEach(items, it => process(it));
_.forEach(items, function(it) {
  return process(it);
});
_.each(items, it => process(it));
const names = _.map(items, it => it.name);
_.forEach(items, function(it) {
  return it.name;
});
const enabledItems = _.filter(items, it => it.enabled);
const isAllEnabled = _.every(items, it => it.enabled);

// These should not be transformed:
ctrl.init();
ctrl.makeJob();
_.noob();
const ids = _.map(items, 'id');
const isAllDIsplayed = _.every(items, 'diplayed');
const obj = _.indexBy(items, 'id');
const groupped = _.groupBy(items, it => it.category);
