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

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-blue-600 size-5" />
            <h2 className="text-lg font-semibold text-blue-900">
              Welcome to Si Her Publisher
            </h2>
          </div>
          <p className="text-blue-800 text-sm">
            This template helps you create a professional personal website.
            Follow these instructions to get the best results.
          </p>
        </div>

        {/* Quick Start */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="text-green-600 size-5" />
            Quick Start Guide
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full size-6 flex items-center justify-center text-sm font-semibold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Click on any section
                </p>
                <p className="text-sm text-gray-600">
                  Click on any section of your website to edit it
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full size-6 flex items-center justify-center text-sm font-semibold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Fill in your information
                </p>
                <p className="text-sm text-gray-600">
                  Add your personal details, images, and content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-800 rounded-full size-6 flex items-center justify-center text-sm font-semibold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Publish your site</p>
                <p className="text-sm text-gray-600">
                  Click the &ldquo;Publish&rdquo; or &ldquo;Update&rdquo; button
                  when ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="text-blue-600 size-5" />
            Section-by-Section Guide
          </h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                🏠 Landing Section
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Your main introduction and hero area
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add your full name and preferred pronouns</li>
                <li>
                  • Write a compelling headline that describes who you are
                </li>
                <li>• Upload a professional profile image</li>
                <li>• Add relevant hashtags and location</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                🎯 Value Section
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                What you offer and your expertise
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Describe your main value proposition</li>
                <li>• List your key skills and superpowers</li>
                <li>• Add your experience and background</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                📱 Media Section
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Showcase your work and content
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload images or add video URLs</li>
                <li>• Add wallet connection details if applicable</li>
                <li>• Include any media highlights</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                🏢 Organizations
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Your professional affiliations
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add companies you&apos;ve worked with</li>
                <li>• Include community affiliations</li>
                <li>• List any partnerships or collaborations</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">⏰ Timeline</h4>
              <p className="text-sm text-gray-600 mb-2">
                Your professional journey
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add key milestones and achievements</li>
                <li>• Include important dates and events</li>
                <li>• Show your career progression</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                🤝 Available For
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                How people can connect with you
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• List services you offer</li>
                <li>• Add call-to-action text and links</li>
                <li>• Upload a professional avatar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="text-green-600 size-5" />
            Best Practices
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Upload className="text-blue-600 size-5 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Image Guidelines</p>
                <p className="text-sm text-gray-600">
                  Use high-quality images (JPG, PNG under 2MB) for best results
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Save className="text-green-600 size-5 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Save Frequently</p>
                <p className="text-sm text-gray-600">
                  Your changes are saved automatically as you type
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="text-purple-600 size-5 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Preview Your Work</p>
                <p className="text-sm text-gray-600">
                  Click on sections to see how they&apos;ll look on your live
                  site
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-yellow-600 size-5" />
            <h3 className="text-lg font-semibold text-yellow-900">
              Publishing Information
            </h3>
          </div>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>
              • After clicking &ldquo;Publish&rdquo; or &ldquo;Update&rdquo;,
              wait 2-3 minutes for IPFS to republish your site
            </p>
            <p>• Your changes will be live once the IPFS process completes</p>
            <p>• You can continue editing while your site is being updated</p>
          </div>
        </div>

        {/* Troubleshooting */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="text-orange-600 size-5" />
            Troubleshooting
          </h3>
          <div className="space-y-3">
            <div className="border border-orange-200 rounded-lg p-3">
              <p className="font-medium text-gray-900 mb-1">Upload Issues</p>
              <p className="text-sm text-gray-600">
                If images won&apos;t upload, check file size (under 2MB) and
                format (JPG, PNG)
              </p>
            </div>
            <div className="border border-orange-200 rounded-lg p-3">
              <p className="font-medium text-gray-900 mb-1">
                Publishing Errors
              </p>
              <p className="text-sm text-gray-600">
                If publishing fails, try again. The system will show &ldquo;Not
                successful - Retry&rdquo; messages
              </p>
            </div>
            <div className="border border-orange-200 rounded-lg p-3">
              <p className="font-medium text-gray-900 mb-1">
                Content Not Showing
              </p>
              <p className="text-sm text-gray-600">
                Wait 2-3 minutes after publishing for IPFS to update your live
                site
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600">
            If you encounter any issues or need assistance, please contact our
            support team. We&apos;re here to help you create an amazing personal
            website!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadMeFields;
