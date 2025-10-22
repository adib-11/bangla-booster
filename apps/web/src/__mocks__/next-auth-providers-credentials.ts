// Mock for next-auth/providers/credentials module
const mockCredentials = jest.fn(() => ({
  id: 'credentials',
  name: 'Credentials',
  type: 'credentials',
}));

export default mockCredentials;
