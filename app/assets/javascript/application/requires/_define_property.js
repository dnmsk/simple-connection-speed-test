export default (obj, propertyName, func) => {
  if (typeof Object.defineProperty === 'function'){
    try {
      if (!obj.prototype[propertyName]) {
        Object.defineProperty(obj.prototype, propertyName, {value: func})
      }
    } catch(e) {}
  }
  if (!obj.prototype[propertyName]) obj.prototype[propertyName] = func;
}