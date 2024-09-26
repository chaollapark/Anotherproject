import {AutoPaginatable, OrganizationMembership, User, WorkOS} from "@workos-inc/node";
import mongoose, {model, models, Schema} from 'mongoose';

export type Job = {
  _id: string;
  title: string;
  description: string;
  orgName?: string;
  remote: string;
  type: string;
  salary: number;
  country: string;
  state: string;
  city: string;
  countryId: string;
  stateId: string;
  cityId: string;
  jobIcon: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
};

const JobSchema = new Schema({
  title: {type: String },
  description: {type: String },
  type: {type: String },
  salary: {type: Number },
  country: {type: String },
  state: {type: String },
  city: {type: String },
  countryId: {type: String },
  stateId: {type: String },
  cityId: {type: String },
  jobIcon: {type: String},
  contactName: {type: String },
  contactPhone: {type: String },
  contactEmail: {type: String },
  orgId: {type: String },
}, {
  timestamps: true,
});

export async function addOrgAndUserData(jobsDocs:Job[], user:User|null) {
  jobsDocs = JSON.parse(JSON.stringify(jobsDocs));
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const workos = new WorkOS(process.env.WORKOS_API_KEY);
    let oms: AutoPaginatable<OrganizationMembership> | null = null;
    if (user) {
      oms = await workos.userManagement.listOrganizationMemberships({ userId: user?.id });
    }
    for (const job of jobsDocs) {
      const org = await workos.organizations.getOrganization(job.orgId);
      job.orgName = org.name;
      if (oms && oms.data.length > 0) {
        job.isAdmin = !!oms.data.find(om => om.organizationId === job.orgId);
      }
    }
  } catch (error) {
    console.error('Error in addOrgAndUserData:', error);
  }
  return jobsDocs;
}

export const JobModel = models?.Job || model('Job', JobSchema);
