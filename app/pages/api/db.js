// pages/api/db.js
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "db.json"); // 프로젝트 루트의 db.json
  const data = fs.readFileSync(filePath, "utf-8");
  res.status(200).json(JSON.parse(data));
}
