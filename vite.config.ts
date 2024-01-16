import react from "@vitejs/plugin-react-swc";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

const getGitData = () => {
  const hash = fs.existsSync(".git")
    ? execSync("git rev-parse HEAD").toString().trim()
    : "DEV";
  const date = fs.existsSync(".git")
    ? execSync("git log -1 --format=%cd").toString().trim()
    : new Date().toLocaleDateString();
  return { hash, date };
};
const gitData = getGitData();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    "process.env.COMMIT_HASH": JSON.stringify(gitData.hash),
    "process.env.COMMIT_DATE": JSON.stringify(gitData.date),
  },
});
