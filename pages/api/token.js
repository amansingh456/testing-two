import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { payload } = req.body;

    if (!payload) {
      res.status(400).json({ message: "Email is required" });
    }

    const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error in /handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
