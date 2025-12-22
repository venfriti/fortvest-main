'use client';

import { Bell, Eye, HelpCircle, ArrowUpRight, ArrowDownLeft, PiggyBank, Briefcase, Wallet } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Hi John Doe <span className="text-2xl">😊</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              KYC Level 3 ✅
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">5th December, 2025</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 bg-white rounded-full shadow-sm border border-gray-100 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
              4
            </span>
          </button>
          <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
             {/* Replace with actual avatar if you have one */}
             <div className="bg-indigo-100 h-full w-full flex items-center justify-center text-indigo-600 font-bold">JD</div>
          </div>
        </div>
      </header>

      {/* Total Balance */}
      <section>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
          <Image src="/fortvest-logo-icon.png" alt="icon" width={16} height={16} className="opacity-50" /> 
          <span>Total Balance</span>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-extrabold text-gray-900">₦2,410,000</h2>
          <Eye size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: FortFlex (Purple) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EAE4FF] to-[#D0C3FF] relative text-indigo-900 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm">FortFlex</span>
            <HelpCircle size={16} className="opacity-50" />
          </div>
          <div>
             <div className="bg-white/40 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Wallet size={16} />
             </div>
             <p className="text-2xl font-bold">₦920,000</p>
          </div>
        </div>

        {/* Card 2: FortBank (Green) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] relative text-teal-900 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm">FortBank</span>
            <HelpCircle size={16} className="opacity-50" />
          </div>
          <div>
             <div className="bg-white/40 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <PiggyBank size={16} />
             </div>
             <p className="text-2xl font-bold">₦460,000</p>
          </div>
        </div>

        {/* Card 3: FortInvest (Red/Orange) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFE4E1] to-[#FECACA] relative text-red-900 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm">FortInvest</span>
            <HelpCircle size={16} className="opacity-50" />
          </div>
          <div>
             <div className="bg-white/40 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <Briefcase size={16} />
             </div>
             <p className="text-2xl font-bold">₦920,000</p>
          </div>
        </div>

        {/* Card 4: FortAdvance (Yellow) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FEF9C3] to-[#FDE047] relative text-yellow-900 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-bold text-sm">FortAdvance</span>
            <HelpCircle size={16} className="opacity-50" />
          </div>
          <div>
             <div className="bg-white/40 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                <ArrowUpRight size={16} />
             </div>
             <p className="text-2xl font-bold">₦10,000</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-gray-700 font-medium mb-4">Quick Actions</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { label: 'Deposit', icon: ArrowDownLeft, color: 'text-green-600' },
            { label: 'Withdraw', icon: ArrowUpRight, color: 'text-red-600' },
            { label: 'Start Saving', icon: PiggyBank, color: 'text-indigo-600' },
            { label: 'Loan Application', icon: Briefcase, color: 'text-yellow-600' },
            { label: 'Investment', icon: ArrowUpRight, color: 'text-green-600' },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-start p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-w-[140px]">
               <div className={`p-2 rounded-lg bg-gray-50 mb-3 ${action.color}`}>
                 <action.icon size={20} />
               </div>
               <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Recent Transaction</h3>
          <button className="text-sm text-[#F24E1E] font-medium hover:underline">View all</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Description</th>
                <th className="pb-4 font-medium">Transaction ID</th>
                <th className="pb-4 font-medium">Transaction Type</th>
                <th className="pb-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { date: '30 Nov 2025', time: '12:45am', desc: 'FortBank Deposit', id: 'FVW13ab13f91', type: 'FortVest', amount: 'N100,000', status: 'Success', statusColor: 'text-green-500' },
                { date: '30 Nov 2025', time: '1:15am', desc: 'FortBank Withdrawal', id: 'XJZ34cd34g92', type: 'FortGrow', amount: 'N50,000', status: 'Success', statusColor: 'text-green-500' },
                { date: '30 Nov 2025', time: '2:30am', desc: 'FortBank Transfer', id: 'YHK56ef56h93', type: 'FortSave', amount: 'N150,000', status: 'Pending', statusColor: 'text-yellow-500' },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-4 text-gray-900 font-medium">
                    {tx.date} <br /> <span className="text-gray-400 text-xs font-normal">{tx.time}</span>
                  </td>
                  <td className="py-4 text-gray-700">{tx.desc}</td>
                  <td className="py-4 text-gray-500">{tx.id}</td>
                  <td className="py-4 text-gray-700">{tx.type}</td>
                  <td className="py-4 text-right">
                    <div className="font-bold text-gray-900">{tx.amount}</div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${tx.statusColor}`}>
                       <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                       {tx.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}