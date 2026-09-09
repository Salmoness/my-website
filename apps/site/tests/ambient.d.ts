declare module 'node:fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function existsSync(path: string): boolean;
  export function copyFileSync(src: string, dest: string): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function readdirSync(
    path: string,
    options?: { withFileTypes?: boolean },
  ): Array<{ name: string; isDirectory(): boolean }>;
}
declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function dirname(p: string): string;
  export function join(...paths: string[]): string;
}
declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}
