import * as path from 'path';

export function PageModel(htmlPath : string, baseDir : string): ClassDecorator {
  return function (target: Function) {
    const original = target;
    // Yeni bir sınıf tanımlayarak extend edelim
    const newConstructor: any = function (...args: any[]) {
      target = new (original as any)(...args);
      target.prototype = [];
      target.prototype["ContentPath"] = path.join(baseDir, htmlPath);
      return target;
    };

    // Prototip zincirini koru
    newConstructor.prototype = original.prototype;
    return newConstructor;
  };
}