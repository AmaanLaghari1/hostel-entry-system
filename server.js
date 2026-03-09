import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/save-photo", async (req, res) => {
  try {
    const { image } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const dir = path.join("captures", today);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${Date.now()}.jpg`;
    const filePath = path.join(dir, fileName);

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    fs.writeFileSync(filePath, base64Data, "base64");

    res.json({ success: true, file: fileName });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save image" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});