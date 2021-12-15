// naive implementation
export function createPriorityQueue<TItem>(getCost: (item: TItem) => number) {
  let queue: TItem[] = [];

  function sortItemsByPriority(left: TItem, right: TItem) {
    return getCost(left) - getCost(right);
  }

  const priorityQueue = {
    push(item: TItem) {
      queue.push(item);
      queue.sort(sortItemsByPriority);
    },

    pop() {
      return queue.shift();
    },

    length: 0,
  };

  Object.defineProperty(priorityQueue, "length", {
    get() {
      return queue.length;
    },
  });

  return priorityQueue;
}
