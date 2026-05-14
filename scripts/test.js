import { run } from 'jest';

process.on('unhandledRejection', (err) => {
  throw err;
});

const argv = process.argv.slice(2);

if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  argv.push('--watch');
}

run(argv);
