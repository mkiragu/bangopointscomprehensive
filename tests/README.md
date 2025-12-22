# BangoPoints Testing Guide

This document provides information about running tests for the BangoPoints platform.

## Test Structure

The test suite is organized into three categories:

### Unit Tests (`tests/unit/`)
Test individual functions and services in isolation:
- `pointsCalculator.test.js` - Points calculation logic
- `receiptProcessor.test.js` - Receipt processing workflows

### Integration Tests (`tests/integration/`)
Test API endpoints and their interactions:
- `auth.test.js` - Authentication endpoints

### E2E Tests (`tests/e2e/`)
Test complete user workflows (to be implemented)

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test File
```bash
npm test tests/unit/pointsCalculator.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should calculate points"
```

## Test Coverage Requirements

The project maintains the following coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Coverage reports are generated in the `coverage/` directory.

## Writing Tests

### Unit Test Example
```javascript
describe('MyService', () => {
  describe('myFunction', () => {
    it('should do something', () => {
      const result = MyService.myFunction(input);
      expect(result).toBe(expectedOutput);
    });
  });
});
```

### Integration Test Example
```javascript
describe('POST /api/endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send(data)
      .expect(200);
    
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

## Test Database

Integration tests use a separate test database (`bangopoints_test`). Ensure you have:
1. Created the test database
2. Run migrations on the test database
3. Set appropriate environment variables in test mode

## Mocking

The test setup automatically mocks:
- Logger (Winston) to reduce noise
- Environment variables for testing

## Continuous Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Manual workflow dispatch

## Troubleshooting

### Database Connection Errors
- Ensure MySQL is running
- Check test database credentials in `tests/setup.js`
- Verify test database exists and has proper schema

### Timeout Errors
- Default timeout is 10 seconds
- Increase timeout for specific tests: `jest.setTimeout(30000)`

### Coverage Not Meeting Threshold
- Add more test cases for untested code paths
- Check `coverage/lcov-report/index.html` for detailed coverage report

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Avoid real API calls
5. **Clean Up**: Remove test data after tests complete
6. **Fast Tests**: Keep unit tests under 100ms

## Future Test Plans

- [ ] Add more controller integration tests
- [ ] Implement E2E tests for critical user journeys
- [ ] Add performance/load tests
- [ ] Set up automated test reporting
- [ ] Add mutation testing for improved coverage quality
