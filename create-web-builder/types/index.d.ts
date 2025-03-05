declare module '@babel/helper-module-imports' {
  export function addSideEffect(path: any, source: string): any;
  export function addNamed(path: any, named: string, source: string, options?: any): any;
  export function addDefault(path: any, source: string, options?: any): any;
  export function addNamespace(path: any, source: string): any;
}