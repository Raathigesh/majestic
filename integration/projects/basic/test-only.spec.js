describe('describe', () => {
  it('it', () => {});
  test('test', () => {});
});

describe.only('describe.only', () => {
  it('it', () => {});
  test('test', () => {});
  it.only('it.only', () => {});
  test.only('test.only', () => {});
});

fdescribe('fdescribe', () => {
  it('it', () => {});
  fit('fit', () => {});
});
