import validateConfig from '../validation.js'

test('fails with an undefined config', () => {
  expect(validateConfig).toThrow()
});

test('fails with missing keys', () => {
  const testConfig = {};
  const t = () => {
    validateConfig(testConfig);
  };

  expect(t).toThrow();
});
