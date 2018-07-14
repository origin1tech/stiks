
import * as GroupedQueue from 'grouped-queue';
import { IGroupedQueue, IGroupedQueueOptions } from './interfaces';
import { flatten } from 'chek';

/**
 * Create
 * : Creates a new Grouped Queue.
 *
 * @param queues the sub queue names to be run.
 */
export function createQueue(...queues: (string | string[])[]) {
  let _queue: IGroupedQueue;
  _queue = new GroupedQueue(flatten(queues));
  return _queue;
}



