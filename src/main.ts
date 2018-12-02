import { day1 } from './days/day1'
import { day2 } from './days/day2';

/**
 * Run `npm start <number>` to execute the solution for an specific day 
 */

const day = Number.parseInt(process.argv[2], 10) - 1

/**
 * Add reference to your solutions here
 */

const solutions = [
  day1,
  day2,
];

if (Number.isNaN(day) || day >= solutions.length || day < 0) {
  console.error(`First argument must be a integer between 1 and ${solutions.length}`)
  process.exit(1)
}

console.log(`Solution for day ${day + 1}:`)

solutions[day]().then(
  res => undefined,
  err => console.error(err)
)