import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dotenv from "dotenv";

// Load environment variables from .env
const env = dotenv.config().parsed;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
		"import.meta.env": {
			...env,
			VITE_API_URL: process.env.VITE_API_URL,
			VITE_WEB_SOCKET_URL: process.env.VITE_WEB_SOCKET_URL
		},
	},
})
