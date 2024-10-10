import mongoose from "mongoose";
import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import SingleJobPage from "@/app/components/JobDescription";
import { addOrgAndUserData, JobModel } from "@/models/Job";
import { getUser } from "@workos-inc/authkit-nextjs";
import { Suspense } from "react";
import DynamicJobDescription from "@/app/components/DynamicJobDescription";


// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGO_URI as string, {
    serverSelectionTimeoutMS: 5000, // Increase this value if necessary
    socketTimeoutMS: 45000, // Increase this value if necessary
  });
};

export default async function Home() {
  await connectDB();  // Ensure connection is established
  const { user } = await getUser();
  const latestJobs = await addOrgAndUserData(
    await JobModel.find({}, {}, { sort: '-createdAt' }),
    user,
  );

  return (
    <>

      <Hero />
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-100">

      <Jobs header={''} jobs={latestJobs} />

      <Suspense fallback={<div>Loading job description...</div>}>
          <DynamicJobDescription jobs={latestJobs} initialJobId={latestJobs[0]?._id.toString()} />
        </Suspense>
      </div>

    </>

  );
}
