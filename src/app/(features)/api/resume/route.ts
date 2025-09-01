import { PDFSource, getPDFContent } from "@/lib/pdf-loader";
import { db } from "../../../../../db";
import { Resume } from "../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

export async function GET() {
  const user = await currentUser();
  if (!user || !user.primaryEmailAddress) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const resumes = await db
    .select()
    .from(Resume)
    .where(eq(Resume.userEmail, user.primaryEmailAddress.emailAddress));
  if (!resumes) {
    return new Response("No resumes found", { status: 404, headers: corsHeaders });
  }
  return new Response(JSON.stringify(resumes), { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response("No file uploaded", { status: 400, headers: corsHeaders });
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfSource: PDFSource = { type: "buffer", source: buffer };
    const content = await getPDFContent(pdfSource);
    const user = await currentUser();
    if (!user || !user.primaryEmailAddress) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    await db
      .insert(Resume)
      .values({
        name: file.name,
        jsonResume: JSON.stringify(content),
        userEmail: user.primaryEmailAddress.emailAddress,
      })
      .returning({ id: Resume.id });
    return new Response(JSON.stringify("Success updated resume"), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return new Response("Error processing request", { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const result = await db.delete(Resume).where(eq(Resume.id, parseInt(id)));
    if (result.rowCount < 1) {
      return new Response("Not Found Any Item", { status: 404, headers: corsHeaders });
    }
    return new Response("Resume deleted successfully", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return new Response("Error processing request", { status: 500, headers: corsHeaders });
  }
}