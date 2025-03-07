import { camelCase, isArray, transform, isObject } from 'lodash';  

export function camelize<T extends object>(obj: T): T {
  return transform(obj, (result, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key as string);
    
    // Use type assertion to ensure `result` maintains `T`'s structure
    (result as any)[camelKey] = isObject(value) ? camelize(value) : value;
  }, {} as T);
}