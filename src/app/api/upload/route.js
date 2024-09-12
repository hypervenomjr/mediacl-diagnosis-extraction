import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const fileBuffer = await file.arrayBuffer();  

  try {
    const llmResponse = await axios.post("YOUR_API_ENDPOINT", fileBuffer, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({ diagnosis: llmResponse.data.diagnosis });
  } catch (error) {
    console.error("Error sending file to LLM:", error);
    return NextResponse.json({ message: "Failed to extract diagnosis" }, { status: 500 });
  }
}
