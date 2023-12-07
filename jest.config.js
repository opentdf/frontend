module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src', '<rootDir>/tests/unit'],
	testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	coverageDirectory: 'coverage/jest',
	moduleNameMapper : {
		'\\.module\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'\\.(css|less|scss|sass)$': '<rootDir>/tests/unit/styleMock.js',
	}
};