import { useWorld } from './lib';

export * from './lib';

export const mcrx = (rootDir?: string) => useWorld({rootDir: rootDir || '.'})