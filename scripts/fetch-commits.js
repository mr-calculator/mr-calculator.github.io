import { writeFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env' })

let headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28'
};

if (!process.env.GITHUB_TOKEN)
    headers = {};

const res = await fetch(
    `https://api.github.com/repos/mr-calculator/mr-calculator.github.io/commits?per_page=100`,
    { headers }
)

if (!res.ok) {
    console.warn(`GitHub API failed (${res.status}), keeping existing cache.`)
    process.exit(0) // exit cleanly so the commit isn't blocked
}

const commits = await res.json()
writeFileSync('./app/assets/data/commits-cache.json', JSON.stringify(commits, null, 2))