import Queue from 'queue-promise';

const queue = new Queue({
  concurrent: 1,
  interval: 2000
});

// queue.on('start', () => {
//   console.log('queue start', queue.size);
// });
// queue.on('stop', () => {
//   console.log('queue stop', queue.size);
// });
// queue.on('end', () => {
//   console.log('queue end', queue.size);
// });

queue.on('resolve', _ => console.log(`${queue.size} jobs left`));
queue.on('reject', error => console.error(error));

export default queue;
