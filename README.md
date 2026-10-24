# StepOne Playwright Automation

![Playwright Tests](https://github.com/Codewith-Rony/stepone-playwright-automation/actions/workflows/playwright.yml/badge.svg)

Automated end-to-end testing for the [StepOne registration website](https://stepone.jyteenskerala.org/) using **Playwright, TypeScript, and GitHub Actions**.

This project tests key website functionality, including page navigation, registration form interactions, field validation, dropdown selection, and automatic age calculation.

## Tech Stack

- **Playwright** — browser automation and end-to-end testing
- **TypeScript** — test implementation
- **Node.js & npm** — runtime and dependency management
- **GitHub Actions** — continuous integration (CI)
- **Chromium and Firefox** — cross-browser testing

## Test Coverage

The test suite covers:

- Homepage loading and page navigation
- Registration page visibility
- Form field interactions and value assertions
- Required field attributes
- Phone number and email validation
- Gender, zone, class, and payment mode dropdowns
- Automatic age calculation from date of birth
- Registration form behavior with multiple fields

**Latest verified result:** 56 tests passed locally and in the reported GitHub Actions run.

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Codewith-Rony/stepone-playwright-automation.git
cd stepone-playwright-automation
```

Install dependencies:

```bash
npm ci
```

Install the required Playwright browsers:

```bash
npx playwright install chromium firefox
```

### Run the Tests

Run the complete test suite:

```bash
npx playwright test
```

Run tests in Chromium only:

```bash
npx playwright test --project=chromium
```

Run tests in Firefox only:

```bash
npx playwright test --project=firefox
```

Run a specific test by its name:

```bash
npx playwright test --grep "StepOne homepage loads successfully"
```

### View the HTML Report

After a test run, generate and open the report:

```bash
npx playwright show-report
```

## Continuous Integration

This repository uses GitHub Actions to run the Playwright test suite automatically on pushes and pull requests targeting the configured `main` or `master` branches.

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs project dependencies.
4. Installs Playwright browsers and system dependencies.
5. Runs the test suite.
6. Uploads the HTML report as a workflow artifact.

[View GitHub Actions runs](https://github.com/Codewith-Rony/stepone-playwright-automation/actions)

## Project Structure

```text
stepone-playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── tests/
│   └── stepone.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.md
```

## Important Notes

- Tests run against the live StepOne website.
- The suite focuses on browser-side functionality and does not verify every server-side or database operation.
- Tests should not submit real participant registrations or trigger real payments.
- Test results may vary if the website is unavailable or changes.

## Author

**Rony Thomas**

GitHub: [@Codewith-Rony](https://github.com/Codewith-Rony)

---

*Built to practise browser automation, cross-browser testing, and continuous integration using Playwright and GitHub Actions.*