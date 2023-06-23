export const iterateOverObject = (obj: any, searchString: string): boolean => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (iterateOverObject(obj[i], searchString)) return true;
    }
  }
  if (typeof obj === "object" && !Number.isNaN(obj)) {
    for (const key in obj) {
      if (iterateOverObject(obj[key], searchString)) return true;
    }
  }
  if (typeof obj === "string" && obj.toLowerCase().includes(searchString)) {
    return true;
  }
  if (typeof obj === "number" && obj.toString().includes(searchString)) {
    return true;
  }
  return false;
};
