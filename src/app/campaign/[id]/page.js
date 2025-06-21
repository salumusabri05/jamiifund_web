// app/campaign/[id]/page.js
import { campaigns } from "@/lib/data";
import Link from "next/link";

export default function CampaignDetails({ params }) {
  const campaign = campaigns.find((c) => c.id === params.id);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
        <Link href="/" className="text-green-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const pct = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>

      {/* Progress overview */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded h-3 mb-2">
          <div
            style={{ width: `${pct}%` }}
            className="h-full rounded bg-green-600"
          />
        </div>
        <p className="text-sm">
          <strong>TSh {campaign.raised.toLocaleString()}</strong> raised of{" "}
          <strong>TSh {campaign.goal.toLocaleString()}</strong> · {pct}% funded
        </p>
      </div>

      {/* Placeholder story / description */}
      <section className="prose prose-sm max-w-none mb-8">
        <p>{campaign.description}</p>
        <p>
          {/* More dummy text so you can see layout */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          facilisi. Integer pulvinar sem at elit consectetur, sed tempus justo
          porta. Pellentesque habitant morbi tristique senectus et netus.
        </p>
      </section>

      {/* Sticky donate panel (mobile‑friendly) */}
      <aside className="border-t pt-4">
        <Link
          href="#"
          className="block text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Donate Now
        </Link>
      </aside>
    </article>
  );
}
