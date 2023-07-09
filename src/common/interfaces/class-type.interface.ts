export interface IClassType<T = any> {
    new (...args: any[]): T;
}
