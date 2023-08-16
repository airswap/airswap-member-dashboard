import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { execSync } from "child_process";

const getGitData = () => {
  const hash = execSync("git rev-parse HEAD").toString().trim();
  const date = execSync("git log -1 --format=%cd").toString().trim();
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
