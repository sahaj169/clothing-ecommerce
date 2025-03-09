import {
  PrismaClient,
  JobType,
  JobStatus,
  ExperienceLevel,
  Department,
} from "@prisma/client";
import { slugify } from "../../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  try {
    // Delete all careers first (since we'll recreate them)
    await prisma.career.deleteMany({});

    // Create sample careers
    const careers = [
      {
        title: "Senior Software Engineer",
        department: Department.ENGINEERING,
        location: "Remote",
        type: JobType.FULL_TIME,
        description:
          "We are looking for a Senior Software Engineer to join our team.",
        requirements: [
          "Bachelor's degree in Computer Science or related field",
          "5+ years of experience in software development",
          "Strong knowledge of JavaScript/TypeScript",
          "Experience with React and Node.js",
        ],
        responsibilities: [
          "Design and implement new features",
          "Write clean, maintainable code",
          "Mentor junior developers",
          "Participate in code reviews",
        ],
        status: JobStatus.OPEN,
        skills: ["React", "Node.js", "TypeScript", "MongoDB"],
        benefits: ["Health insurance", "Remote work", "401k", "Stock options"],
        positions: 2,
      },
      {
        title: "UI/UX Designer",
        department: Department.DESIGN,
        location: "Hybrid",
        type: JobType.FULL_TIME,
        description:
          "Looking for a talented UI/UX Designer to create beautiful user experiences.",
        requirements: [
          "Bachelor's degree in Design or related field",
          "3+ years of experience in UI/UX design",
          "Proficiency in Figma and Adobe Creative Suite",
        ],
        responsibilities: [
          "Create user-centered designs",
          "Develop wireframes and prototypes",
          "Conduct user research",
        ],
        status: JobStatus.OPEN,
        skills: ["Figma", "Adobe XD", "Sketch", "User Research"],
        benefits: ["Health insurance", "Flexible hours", "Learning budget"],
        positions: 1,
      },
    ];

    for (const career of careers) {
      await prisma.career.create({
        data: {
          ...career,
          slug: slugify(career.title),
          salary: {
            min: 100000,
            max: 150000,
            currency: "USD",
          },
          experience: ExperienceLevel.SENIOR,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("Successfully created sample careers");
  } catch (error) {
    console.error("Error updating careers:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
