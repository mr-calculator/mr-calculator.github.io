import { writeFileSync } from 'fs'

/**
 * Fetches all commits for this repo off of github's public api.
 * This script runs as a pre-commit automation. Obviously, not included with the repo, but it shouldn't since
 * anyone cloning/forking this wouldn't need this repo's commits.
 */
const res = await fetch(`https://api.github.com/repos/mr-calculator/mr-calculator.github.io/commits?per_page=100`)
const commits = await res.json()
writeFileSync('./app/assets/data/commits-cache.json', JSON.stringify(commits, null, 2))