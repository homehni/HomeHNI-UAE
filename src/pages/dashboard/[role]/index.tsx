import React from 'react';
import RequireRole from '@/components/RequireRole';

type Props = {
  params: { role: string };
};

export default function RoleDashboard({ params }: Props) {
  const { role } = params;

  return (
    <RequireRole role={role}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold capitalize">{role} dashboard</h1>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">Total active leads</h3>
            <div className="text-2xl font-bold">—</div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">New leads today</h3>
            <div className="text-2xl font-bold">—</div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm text-gray-500">Wallet / credits</h3>
            <div className="text-2xl font-bold">—</div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-medium">Quick actions</h2>
          <div className="mt-3 flex gap-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded">Add Property</button>
            <button className="px-4 py-2 bg-gray-100 rounded">View Leads</button>
            <button className="px-4 py-2 bg-gray-100 rounded">Go to Wallet</button>
          </div>
        </section>
      </div>
    </RequireRole>
  );
}