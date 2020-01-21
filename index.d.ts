/**
 * Execute a command cross-platform.
 *
 * @param {string} cmd command to execute e.g. `"npm"`
 * @param {any[]} [args] command argument e.g. `["install", "-g", "git"]`
 * @param {Partial<crossSpawnPromise.CrossSpawnOptions>} [options] additional options.
 * @returns {Promise<Uint8Array>} a promise result with `stdout`
 */

/// <reference types="node" />

declare function crossSpawnPromise(cmd: string, args?: any[], options?: Partial<crossSpawnPromise.CrossSpawnOptions>): Promise<Uint8Array>;

import * as child_process from 'child_process';

declare namespace crossSpawnPromise {
	interface CrossSpawnOptions extends child_process.SpawnOptions {
		encoding: string;
	}

	interface CrossSpawnError {
		exitStatus: number;
		message: string;
		stack: string;
		stderr: Uint8Array;
		stdout: Uint8Array | null;
	}

}

export = crossSpawnPromise;
