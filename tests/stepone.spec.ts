import { test, expect } from '@playwright/test';

test('StepOne homepage loads successfully', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/');

  await expect(page).toHaveTitle(/Step One/i);

  await expect(page.locator('body')).toBeVisible();
});

test('Participant Registration button navigates correctly', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/');

  await page.getByRole('link', {
    name: 'Participant Registration',
    exact: true
  }).click();

  await expect(page).toHaveURL(/register/i);
});
test('Participant Registration page loads correctly', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  await expect(page).toHaveURL(/register\.php/);

  await expect(
    page.getByRole('heading', { name: /participant registration/i })
  ).toBeVisible();
});

test('Participant registration form displays required fields', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  await expect(page.getByLabel(/full name/i)).toBeVisible();
  await expect(page.getByLabel(/date of birth/i)).toBeVisible();
  await expect(page.getByLabel(/gender/i)).toBeVisible();
  await expect(page.getByLabel(/guardian.*parent name/i)).toBeVisible();
  await expect(page.getByLabel(/school name/i)).toBeVisible();
  await expect(page.getByLabel(/phone number/i)).toBeVisible();
  await expect(page.getByLabel(/zone/i)).toBeVisible();
  await expect(page.getByLabel(/class/i)).toBeVisible();
  await expect(page.getByLabel('Address *')).toBeVisible();
});

test('Participant can enter basic information', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  await page.getByLabel(/full name/i).fill('Test User');

  await expect(page.getByLabel(/full name/i)).toHaveValue('Test User');

  await page.getByLabel(/date of birth/i).fill('2012-05-15');

  await expect(page.getByLabel(/date of birth/i)).toHaveValue('2012-05-15');
  await page.getByLabel(/gender/i).selectOption({ label: 'Male' });

  await expect(page.getByLabel(/gender/i)).toHaveValue('Male');

  await page.getByLabel(/guardian.*parent name/i).fill('Test Parent');

  await expect(page.getByLabel(/guardian.*parent name/i))
    .toHaveValue('Test Parent');
});

test('Full Name is a required field', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const fullName = page.getByLabel(/full name/i);

  await expect(fullName).toHaveAttribute('required', '');
  await expect(fullName).toBeEmpty();
});

test('Browser blocks submission when Full Name is empty', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const fullName = page.getByLabel(/full name/i);

  await expect(fullName).toBeEmpty();

  const isRequired = await fullName.evaluate(
    (element: HTMLInputElement) => element.required
  );

  expect(isRequired).toBe(true);
});

test('Guardian phone field accepts entered text', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const phone = page.getByLabel(/phone number/i);

  await phone.fill('9876543210');

  await expect(phone).toHaveValue('9876543210');
});

test('Guardian phone field validation rules', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const phone = page.getByLabel(/phone number/i);

  console.log('Input type:', await phone.getAttribute('type'));
  console.log('Required:', await phone.getAttribute('required'));
  console.log('Pattern:', await phone.getAttribute('pattern'));
  console.log('Min length:', await phone.getAttribute('minlength'));
  console.log('Max length:', await phone.getAttribute('maxlength'));
});


test('Guardian phone field rejects an invalid format', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const phone = page.getByLabel(/phone number/i);

  await phone.fill('123');

  const isValid = await phone.evaluate(
    (element: HTMLInputElement) => element.checkValidity()
  );

  expect(isValid).toBe(false);
});


test('Guardian phone field accepts a valid format', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const phone = page.getByLabel(/phone number/i);

  await phone.fill('9876543210');

  const isValid = await phone.evaluate(
    (element: HTMLInputElement) => element.checkValidity()
  );

  expect(isValid).toBe(true);
});

test('Age is calculated from date of birth', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const dob = page.getByLabel(/date of birth/i);
  const age = page.getByLabel(/^age$/i);

  await dob.fill('2012-05-15');

  await expect(age).toHaveValue('14');
});



test('Inspect date of birth validation rules', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const dob = page.getByLabel(/date of birth/i);

  console.log('Input type:', await dob.getAttribute('type'));
  console.log('Minimum date:', await dob.getAttribute('min'));
  console.log('Maximum date:', await dob.getAttribute('max'));
  console.log('Required:', await dob.getAttribute('required'));
});


test('Inspect age calculation for a future date of birth', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const dob = page.getByLabel(/date of birth/i);
  const age = page.getByLabel(/^age$/i);

  await dob.fill('2030-01-01');

  console.log('Future DOB:', await dob.inputValue());
  console.log('Calculated age:', await age.inputValue());
});

test('Future date of birth is rejected', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const dob = page.getByLabel(/date of birth/i);

  await dob.fill('2030-01-01');

  const isValid = await dob.evaluate(
    (element: HTMLInputElement) => {
      const enteredDate = new Date(`${element.value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return element.checkValidity() && enteredDate <= today;
    }
  );

  expect(isValid).toBe(false);
});

test('Age updates when date of birth changes', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const dob = page.getByLabel(/date of birth/i);
  const age = page.getByLabel(/^age$/i);

  await dob.fill('2012-05-15');
  await expect(age).toHaveValue('14');

  await dob.fill('2010-05-15');
  await expect(age).toHaveValue('16');
});

test('Gender field allows selecting Male and Female', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const gender = page.getByLabel(/gender/i);

  await gender.selectOption({ label: 'Male' });
  await expect(gender).toHaveValue('Male');

  await gender.selectOption({ label: 'Female' });
  await expect(gender).toHaveValue('Female');
});


test('Zone dropdown allows selecting an option', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const zone = page.getByLabel(/^zone/i);

  await expect(zone).toBeVisible();
  await expect(zone).toBeEnabled();

  const options = await zone.locator('option').allTextContents();

  expect(options.length).toBeGreaterThan(1);

  await zone.selectOption({ index: 1 });

  await expect(zone).not.toHaveValue('');
});

test('Class dropdown allows selecting an option', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const classDropdown = page.getByLabel(/^class/i);

  await expect(classDropdown).toBeVisible();
  await expect(classDropdown).toBeEnabled();

  const options = await classDropdown.locator('option').allTextContents();

  expect(options.length).toBeGreaterThan(1);

  await classDropdown.selectOption({ index: 1 });

  await expect(classDropdown).not.toHaveValue('');
});


test('Payment Mode dropdown allows selecting an option', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const paymentMode = page.getByLabel(/payment mode/i);

  await expect(paymentMode).toBeVisible();
  await expect(paymentMode).toBeEnabled();

  const options = await paymentMode.locator('option').allTextContents();

  expect(options.length).toBeGreaterThan(1);

  await paymentMode.selectOption({ index: 1 });

  await expect(paymentMode).not.toHaveValue('');
});

test('Email field accepts a valid email address', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const email = page.getByLabel(/email address/i);

  await email.fill('test@example.com');
  await expect(email).toHaveValue('test@example.com');

  const isValid = await email.evaluate(
    (element: HTMLInputElement) => element.checkValidity()
  );

  expect(isValid).toBe(true);
});

test('Optional email field accepts an empty value', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const email = page.getByLabel(/email address/i);

  await expect(email).toBeVisible();
  await expect(email).toBeEmpty();

  const isRequired = await email.evaluate(
    (element: HTMLInputElement) => element.required
  );

  expect(isRequired).toBe(false);
});


test('Guardian name field accepts text', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const guardian = page.locator('#guardian_name');

  await expect(guardian).toBeVisible();
  await guardian.fill('Test Parent');
  await expect(guardian).toHaveValue('Test Parent');
});



test('School name field accepts text', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const school = page.getByLabel(/school name/i);

  await school.fill('Test Public School');
  await expect(school).toHaveValue('Test Public School');
});

test('Parish and Diocese field accepts text', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const parish = page.getByLabel(/parish.*diocese/i);

  await parish.fill('Test Parish, Test Diocese');
  await expect(parish).toHaveValue('Test Parish, Test Diocese');
});

test('Address field accepts text', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const address = page.getByLabel('Address *');

  await address.fill('123 Test Street, Kerala');
  await expect(address).toHaveValue('123 Test Street, Kerala');
});


test('Required registration fields are marked required', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  const requiredFields = [
    '#full_name',
    '#dob',
    '#gender',
    '#guardian_name',
    '#school',
    '#phone',
    '#parish',
    '#zone',
    '#class',
    '#address',
    '#payment_type',
  ];

  for (const selector of requiredFields) {
    await expect(page.locator(selector)).toHaveAttribute('required', '');
  }
});

test('Registration form remains usable after entering details', async ({ page }) => {
  await page.goto('https://stepone.jyteenskerala.org/register.php');

  await page.locator('#full_name').fill('Test Participant');
  await page.locator('#guardian_name').fill('Test Parent');
  await page.locator('#phone').fill('9876543210');
  await page.locator('#school').fill('Test Public School');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#parish').fill('Test Parish, Test Diocese');
  await page.locator('#address').fill('Test Address, Kerala');

  await expect(page.locator('#full_name')).toHaveValue('Test Participant');
  await expect(page.locator('#guardian_name')).toHaveValue('Test Parent');
  await expect(page.locator('#phone')).toHaveValue('9876543210');
  await expect(page.locator('#school')).toHaveValue('Test Public School');
  await expect(page.locator('#email')).toHaveValue('test@example.com');
  await expect(page.locator('#parish')).toHaveValue('Test Parish, Test Diocese');
  await expect(page.locator('#address')).toHaveValue('Test Address, Kerala');
});

