import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Eye,
  Save,
} from "lucide-react";
import DrawerHeader from "./DrawerHeader";

const ReadMeFields = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <DrawerHeader
        label="Read Me - Template Instructions"
        toggleDrawer={toggleDrawer}
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="text-blue-600 size-6" />
            <h2 className="text-xl font-bold text-blue-900">
              Welcome to Si Her Publisher
            </h2>
          </div>
          <p className="text-blue-800 text-base leading-relaxed">
            This template helps you create a Web3 website for your personal
            brand. Follow these instructions to get the best results.
          </p>
        </div>

        {/* Quick Start */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600 size-6" />
            Quick Start Guide
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full size-6 flex items-center justify-center text-sm font-bold shadow-sm">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-2">
                  Access your content
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Click within the website editor and this will open up the
                  editable content fields in the right-hand side column.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full size-6 flex items-center justify-center text-sm font-bold shadow-sm">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-2">
                  Edit your content
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Add your text, images and media into the editable field.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full size-6 flex items-center justify-center text-sm font-bold shadow-sm">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-2">
                  Select your domain name
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Choose a domain name of your choice and type it into the
                  domain field at the top of the editor (siher.eth is
                  automatically be added to the end of the domain as an ENS
                  subdomain).
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> .link is
                    automatically added to the end of your website. This is
                    called a domain resolver, and allows your Web3 site to be
                    visible on all Web2 browsers. Click on the displayed domain
                    in the publisher to access it.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full size-6 flex items-center justify-center text-sm font-bold shadow-sm">
                4
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-2">
                  Publish your site
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Click the &ldquo;Publish&rdquo; button at the top of the page
                  when you are publishing your site for the first time, or the
                  &ldquo;Update&rdquo; button when making future publishes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Instructions */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Eye className="text-blue-600 size-6" />
            Section-by-Section Guide
          </h3>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                🏠 Landing Section
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Your main introduction and hero area
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Add your first name and preferred pronouns</span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Write a compelling headline that describes who you are
                  </span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Upload a profile image (professional or avatar works!)
                  </span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Add relevant hashtags and location</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                🎯 Value Section
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                What you offer and your expertise
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Describe your personal value proposition and vision
                  </span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Add &apos;What You Create&apos; in the black ticker
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                📱 Media Section
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Showcase your work and content
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Upload images and/or video URLs that represent you
                  </span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    (Optional): Add a crypto payment gateway or 0xname of your
                    choice to receive tips in crypto
                  </span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Include links from your public speaking at events and on
                    podcasts, or media of your choice
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                🏢 Organizations
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Your professional affiliations
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>
                    Add logos for organizations that you support - from
                    companies you work with, have founded, are am ambassador
                    for, and/or are sponsored by
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                ⏰ Timeline
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Your professional journey
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Add key milestones and achievements</span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Include important dates and events</span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Show your career progression</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">
                🤝 Available For
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                How people can connect with you
              </p>
              <ul className="text-sm text-gray-600 space-y-2 pl-4">
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>List services you offer</span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Add call-to-action text and links</span>
                </li>
                <li className="relative">
                  <span className="absolute -left-4 text-blue-500 font-bold">•</span>
                  <span>Upload an NFT or avatar of your choice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-600 size-6" />
            Best Practices
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Upload className="text-blue-600 size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  Image Guidelines
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use high-quality images (JPG, PNG under 2MB) for best results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Save className="text-green-600 size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  Save Frequently
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your changes are saved automatically as you type, but not
                  published live until you press &apos;Publish&apos; or
                  &apos;Update&apos;
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Eye className="text-purple-600 size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  Preview Your Work
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Click on sections to see how they&apos;ll look on your live
                  site
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Info */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-amber-600 size-6" />
            <h3 className="text-xl font-bold text-amber-900">
              Publishing Information
            </h3>
          </div>
          <div className="space-y-3 text-sm text-amber-800 pl-4">
            <div className="relative">
              <span className="absolute -left-4 text-amber-600 font-bold">•</span>
              <span>
                After clicking &ldquo;Publish&rdquo; or &ldquo;Update&rdquo;,
                wait 2-3 minutes for the IPFS to republish your site
              </span>
            </div>
            <div className="relative">
              <span className="absolute -left-4 text-amber-600 font-bold">•</span>
              <span>
                Your changes will be live once the IPFS process completes
              </span>
            </div>
            <div className="relative">
              <span className="absolute -left-4 text-amber-600 font-bold">•</span>
              <span>
                You can continue editing while your site is being updated
              </span>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <AlertCircle className="text-orange-600 size-6" />
            Troubleshooting
          </h3>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-base">
                Upload Issues
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                If images won&apos;t upload, check file size (under 2MB) and
                format (JPG, PNG)
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-base">
                Publishing Errors
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                If publishing fails, try again. The system will show &ldquo;Not
                successful - Retry&rdquo; messages
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-base">
                Content Not Showing
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Wait 2-3 minutes after publishing for IPFS to view your live
                site
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2 text-base">
                Domain Not Accessible
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your site has a .link at the end to be visible on all Web2
                browers. Click on the displayed domain in the publisher to view
                your site live on any domain after following the steps outlined
                in this guide.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you encounter any issues or need assistance, please contact our
            support team on members@si3.space. We&apos;re here to help you
            create a personal Web3 site you can be proud of!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadMeFields;
