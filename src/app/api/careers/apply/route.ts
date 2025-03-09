import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ApplicationStatus } from "@prisma/client";
// Import put conditionally to avoid errors in development
let blobStorage: any;
try {
  blobStorage = require("@vercel/blob");
} catch (error) {
  console.log("Vercel Blob not available, using mock storage");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      resume,
      coverLetter,
      careerId,
      experience,
      currentCompany,
      portfolio,
      linkedIn,
      github,
    } = body;

    // Validate required fields
    if (!userId || !resume || !careerId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if career exists
    const career = await prisma.career.findUnique({
      where: {
        id: careerId,
      },
    });

    if (!career) {
      return new NextResponse("Career not found", { status: 404 });
    }

    // Handle file upload - use Vercel Blob in production, mock in development
    let resumeUrl = "";

    if (process.env.NODE_ENV === "production" && blobStorage) {
      // Upload resume to Vercel Blob in production
      const blob = await blobStorage.put(resume.name, resume, {
        access: "public",
      });
      resumeUrl = blob.url;
    } else {
      // Mock file storage in development
      // Store file details but don't actually upload
      resumeUrl = `mock-storage://${resume.name}`;
      console.log(
        `[DEV] Mock file upload: ${resume.name}, size: ${resume.size} bytes`
      );
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        userId,
        resume: resumeUrl,
        coverLetter,
        careerId,
        status: ApplicationStatus.PENDING,
        experience,
        currentCompany,
        portfolio,
        linkedIn,
        github,
      },
    });

    // Here you would typically send notification emails
    // await sendApplicationConfirmationEmail(email, career.title);
    // await sendApplicationNotificationEmail(career.title, application.id);

    return NextResponse.json(application);
  } catch (error) {
    console.error("[CAREER_APPLY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
