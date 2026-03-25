# Marvel Rivals Proficiency Calculator

Plan your grind. Know your time.

A web app that calculates **exactly how long it takes to unlock proficiency rewards** in Marvel Rivals — based on real match data and your personal performance.

---

## ✨ Features

- 🎯 **Accurate time estimates**
  - Calculates progression from your current level to any goal
  - Supports full path (e.g. Lord → Champion)

- 📊 **Personalized stats**
  - Input your own averages (healing, KOs, assists, etc.)
  - Or use realistic defaults based on real match data

- 🧠 **Smart planning tools**
  - “How many matches per day do I need?”
  - Weekly planner with customizable schedules

- 🦸 **All heroes supported**
  - Browse every hero and their rewards
  - Add custom heroes if new ones are missing

- 🎁 **Complete reward overview**
  - See all unlocks per level
  - Includes animated icons and rarity

- 💾 **No account needed**
  - Data stored locally in your browser

- 🔓 **Open source & free forever**

---

## 📈 How it works

The calculator estimates progression using:

- Your **average stats per 10 minutes**
- Points gained from:
  - Time played
  - Damage/Healing/Damage Taken
  - Final Hits/KOs + Assists

Then computes:

```
total_points_needed / avg_points_per_10min → total playtime
````
(for every rank and its mission requirements/rewards)

All formulas are transparent and customizable.

---

## 🚀 Live Demo

👉 https://mr-calculator.github.io

---

## 🛠️ Tech Stack

- Nuxt (SPA / static generation)
- Vue 3 (Composition API)
- TypeScript
- GSAP (animations)
- LocalStorage (user data persistence)

---

## 🧪 Development

```bash
# install dependencies
pnpm install

# start dev server
pnpm dev

# generate static site
pnpm generate
````

---

## 📦 Deployment

This project is designed to run on **GitHub Pages** via static generation.

Make sure:

```ts
app: {
  baseURL: '/repo-name/' // or '/' if using custom domain
}
```

---

## ⚠️ Disclaimer

This project is **not affiliated with or endorsed by**:

* NetEase Games
* Marvel Entertainment

All assets, names, and trademarks belong to their respective owners.

This is a **fan-made tool** for the community.

---

## 📬 Contact

Questions, feedback, or ideas?

* GitHub Issues
* Email (see site footer)

---

## 🧠 Why this exists

Because people keep asking:

> “How long until I get that Champion icon?”

Now you can know — exactly.
