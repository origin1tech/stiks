import { IGroupedQueue } from './interfaces';
/**
 * Create
 * : Creates a new Grouped Queue.
 *
 * @param queues the sub queue names to be run.
 */
export declare function createQueue(...queues: (string | string[])[]): IGroupedQueue;
