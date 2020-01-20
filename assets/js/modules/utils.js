export const isEmpty = (object) => {
  for (let key in object ) {
    return false
  }
  return true
}

export const isNull = (value) => {
  return value === null
}

export const clone = (source) => {
  let target = {};
  for (let i in source) {
    if (source.hasOwnProperty(i)) {
      target[i] = source[i];
    }
  }
  return target;
}

export const cloneDeep = (source) => {
  // Handle string, int, boolean, null or undefined
  if (null == source || "object" != typeof source) {
    return source;
  }

  let copy;
  // Handle Date
  if (source instanceof Date) {
    copy = new Date();
    copy.setTime(source.getTime());
    return copy;
  }

  // Handle Array
  if (source instanceof Array) {
    copy = [];
    for (let i = 0, len = source.length; i < len; i++) {
      copy[i] = cloneDeep(source[i]);
    }
    return copy;
  }

  // Handle Object
  if (source instanceof Object) {
    copy = {};
    for (let attr in source) {
      if (source.hasOwnProperty(attr)) {
        copy[attr] = cloneDeep(source[attr]);
      }
    }
    return copy;
  }

  console.error("Unable to copy object! Its type isn't supported.", source);
}

export const fill = (source, target) => {
  for (let i in source) {
    if (source.hasOwnProperty(i) && target.hasOwnProperty(i)) {
      target[i] = source[i];
    }
  }
}

export const fillDeep = (source, target) => {
  // Handle string, int, boolean, null or undefined
  if (null == source || "object" != typeof source
    && "object" != typeof target) {
    target = source;
  }

  // Handle Date
  if (source instanceof Date
    && target instanceof Date) {
    target.setTime(source.getTime());
  }

  // Handle Array
  if (source instanceof Array
    && target instanceof Array) {
    for (let i = 0, len = source.length; i < len; i++) {
      target[i] = cloneDeep(source[i]);
    }
  }

  // Handle Object
  if (source instanceof Object
    && target instanceof Object) {
    for (let attr in source) {
      if (source.hasOwnProperty(attr) && target.hasOwnProperty(attr)) {
        target[attr] = cloneDeep(source[attr]);
      }
    }
  }

  console.error("Unable to fill target from object!", source, target);
}
