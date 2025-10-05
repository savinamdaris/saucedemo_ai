# k6_PerformanceTesting

Comprehensive performance testing for [SauceDemo](https://www.saucedemo.com) using [k6](https://k6.io/).

---

## 📦 Requirements

- [k6](https://k6.io/docs/getting-started/installation/)
- (Optional) Node.js for npm scripts

---

## 🚀 Setup

```sh
# Install k6
brew install k6         # Mac
choco install k6        # Windows
sudo apt-get install k6 # Linux

# (Optional) Install npm dependencies
npm install
```

---

## 📂 Project Structure

```
k6_PerformanceTesting/
├── README.md
├── package.json
├── .gitignore
├── scripts/
│   ├── load-test.js
│   ├── stress-test.js
│   ├── spike-test.js
│   ├── endurance-test.js
│   └── advanced-login.js
└── reports/
```

---

## 🧪 Running Tests

- **Load Test:**  
  `npm run load-test`
- **Stress Test:**  
  `npm run stress-test`
- **Spike Test:**  
  `npm run spike-test`
- **Endurance Test:**  
  `npm run endurance-test`
- **Advanced Login Test:**  
  `npm run advanced-login`

---

## 📊 Reports

- CLI summary by default.
- For HTML reports, use [k6-reporter](https://github.com/szboynono/k6-reporter):
  ```sh
  npm install -g k6-reporter
  k6 run scripts/load-test.js --out json=reports/load-result.json
  k6-reporter --json reports/load-result.json --out reports/load-report.html
  ```
- Artifacts are saved in the `reports/` folder.

---

## 🛠️ Advanced Features

- Thresholds for response time and error rate
- Custom metrics (Counter, Gauge, Rate, Trend)
- Stages for realistic load patterns
- Checks and tags for validation and filtering
- Environment variables for configuration
- Data-driven testing with `SharedArray`
- Modular scripts for complex workflows

---

## 📝 Notes

- All scripts use descriptive comments and specify test type and requirements.
- Adjust VUs, durations, and thresholds as needed for your environment.
- See each script for more details and advanced k6 usage.