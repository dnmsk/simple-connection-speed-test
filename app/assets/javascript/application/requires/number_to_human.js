import defineProperty from './_define_property';

defineProperty(Number, 'toHumanString', function(beforeDot = 4, afterDot = 2, base=1000) {
  const sign = this < 0 ? '-' : '';
  let numberAbs = Math.abs(this);
  let n = Math.pow(10, beforeDot);
  if (numberAbs < n) {
    return sign + numberAbs;
  }
  const afterN = Math.pow(10, afterDot);
  n *= base;
  if (numberAbs < n) {
    return sign + parseInt(afterN * numberAbs / base) / afterN + 'k';
  }
  n *= base;
  if (numberAbs < n) {
    return sign + parseInt(afterN * numberAbs / (base**2)) / afterN + 'M';
  }
  return sign + parseInt(afterN * numberAbs / (base**3)) / afterN + 'G';
});
