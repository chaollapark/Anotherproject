import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface JobForEmail {
  _id: string;
  title: string;
  slug: string;
  companyName: string;
  city: string;
  country: string;
}

interface NewsletterEmailProps {
  jobs?: JobForEmail[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://eujobs.online';

export const NewsletterEmail = ({ jobs = [] }: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>Your weekly EU jobs digest from eujobs.co!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/favicon/android-chrome-192x192.png`}
          width="48"
          height="48"
          alt="eujobs.co"
        />
        <Text style={paragraph}>Hi there,</Text>
        <Text style={paragraph}>
          Here are the latest jobs from the Brussels bubble and beyond, curated just for you by eujobs.co.
        </Text>
        <Section style={jobSection}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id}>
                <Text style={jobTitle}>{job.title}</Text>
                <Text style={jobCompany}>{job.companyName} - {job.city}, {job.country}</Text>
                <Button style={button} href={`${baseUrl}/jobs/${job.slug}`}>
                  View & Apply
                </Button>
                <Hr style={hr} />
              </div>
            ))
          ) : (
            <Text>No new jobs this week. Check back soon!</Text>
          )}
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The eujobs.co Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>eujobs.co, Brussels, Belgium</Text>
      </Container>
    </Body>
  </Html>
);

export default NewsletterEmail;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'sans-serif',
};
const container = { margin: '0 auto', padding: '20px 0 48px' };
const jobSection = { padding: '0 20px' };
const paragraph = { fontSize: '16px', lineHeight: '26px' };
const jobTitle = { fontSize: '18px', fontWeight: 'bold' as const };
const jobCompany = { fontSize: '14px', color: '#555' };
const button = {
  backgroundColor: '#007bff',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  width: '100%',
};
const hr = { borderColor: '#cccccc', margin: '20px 0' };
const footer = { color: '#8898aa', fontSize: '12px' };
