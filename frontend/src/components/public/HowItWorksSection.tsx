const STEPS = [
  { number: "1", title: "Choose a Campaign", description: "Browse active campaigns and pick a cause you care about." },
  { number: "2", title: "Make a Donation", description: "Contribute any amount securely in just a few clicks." },
  { number: "3", title: "Receive Certificate", description: "Get an instant donation certificate for your records." },
];

export function HowItWorksSection() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center">How It Works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-semibold flex items-center justify-center mx-auto">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mt-4">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
