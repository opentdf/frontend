import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.REACT_APP_SERVER_BASE_PATH || '/',
	server: {
		host: 'localhost',
		port: 3000,
	},
	build: {
		outDir: 'build',
	},
	define: {
		'process.env.VITE_APP_SERVER_DATA': process.env.VITE_APP_SERVER_DATA,
	},
	publicDir: 'public',
	plugins: [
		react(),
		istanbul({
			include: 'src/*',
			exclude: ['node_modules', 'test/'],
			extension: ['.js', '.jsx', '.ts', '.tsx'],
			requireEnv: false,
			forceBuildInstrument: true,
		}),
	],
})