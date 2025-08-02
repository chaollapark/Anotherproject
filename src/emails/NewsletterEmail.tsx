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
  Text 
} from '@react-email/components';
import * as React from 'react';

// Define the shape of the job prop directly
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
  : 'http://localhost:3000';

export const NewsletterEmail = ({ jobs = [] }: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>Your weekly EU job digest is here!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/favicon/android-chrome-192x192.png`}
          width="48"
          height="48"
          alt="EU Job Board"
        />
        <Text style={paragraph}>Hi there,</Text>
        <Text style={paragraph}>
          Here are the latest jobs from the Brussels bubble and beyond, curated just for you.
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
          The EU Job Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>EU Job Board, Brussels, Belgium</Text>
      </Container>
    </Body>
  </Html>
);

export default NewsletterEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const jobSection = {
  padding: '0 20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const jobTitle = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  lineHeight: '22px',
};

const jobCompany = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#555'
}

const button = {
  backgroundColor: '#5E5DF0',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  width: '100%',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
