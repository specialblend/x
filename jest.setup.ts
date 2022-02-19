const process_exit = process.exit;
const console_error = console.error;

beforeAll(() => {
  process.exit = jest.fn((code?): never => {
    throw new Error(String(code));
  });
  console.error = jest.fn(console_error);
});

afterAll(() => {
  process.exit = process_exit;
  console.error = console_error;
});
