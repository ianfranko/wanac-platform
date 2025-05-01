export default function TakeAction() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-brand-navy mb-6">
          Take Action
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Whether you’re an individual or an organization, your support fuels
          our mission. Get involved and make a difference today:
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ul className="list-inside list-disc space-y-4 text-gray-600 text-lg">
            <li className="hover:text-brand-blue hover:underline transition-colors duration-300">
              Become a Volunteer
            </li>
            <li className="hover:text-brand-blue hover:underline transition-colors duration-300">
              Partner With Us
            </li>
            <li className="hover:text-brand-blue hover:underline transition-colors duration-300">
              Support Through Leadership Giving
            </li>
            <li className="hover:text-brand-blue hover:underline transition-colors duration-300">
              Explore Ways to Donate
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
