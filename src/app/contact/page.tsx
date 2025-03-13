import { Theme } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const metadata = {
  title: 'Contact Us - EUjobs.co',
  description: 'Get in touch with the EUjobs.co team. Contact us for any questions about EU jobs and opportunities.',
};

export default function ContactPage() {
  return (
    <Theme>
      <div className="container max-w-2xl mx-auto py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Contact us</h1>

          <p className="text-gray-600 mb-8">
          Have questions or need assistance? Feel free to reach out to our team directly:
        </p>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-gray-700">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-6" />
              <div>
                <div className="font-medium">Madan Chaolla Park - CEO</div>
                <a href="mailto:ceo@zatjob.com" className="text-blue-600 hover:text-blue-700">
                ceo@zatjob.com
              </a>
              </div>
            </div>
            {/*
            <div className="flex items-center gap-3 text-gray-700">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              <div>
                <div className="font-medium">Mouise Bashir - CTO</div>
                <a href="mailto:mouise@eujobs.co" className="text-blue-600 hover:text-blue-700">
                  mouise@eujobs.co
                </a>
              </div>
            </div>
          */}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
            We typically respond to emails within 24-48 business hours. 
          </p>
          </div>
        </div>
      </div>
      </Theme>
  );
}
