module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/config/jest/styleMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest/preprocessor',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/coverage/'],
};
