# Testing Strategy

## Testing Philosophy

  * **Approach:** Primarily **Unit Tests** for FE and BE logic.
  * **Coverage:** Aim for reasonable coverage (\>70%) on critical logic.

## Test Types and Organization

  * **Unit Tests (FE):** Jest + React Testing Library (`*.test.tsx` colocated). Mock API calls.
  * **Unit Tests (BE):** Jest (`*.test.ts` colocated). Mock DB calls, external APIs.
  * **Integration/E2E:** Out of scope for prototype.

## Test Data Management

  * Use simple mocks within test files.

## Continuous Testing

  * Run unit tests (`npm test`) in Vercel CI pipeline.

-----
