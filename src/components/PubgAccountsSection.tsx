
import React from 'react';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { usePubgAccounts } from '../hooks/usePubgAccounts';
import { Link } from 'react-router-dom';
import PubgAccountCard from './PubgAccountCard';

const PubgAccountsSection = () => {
  const { accounts, loading } = usePubgAccounts();

  const availableAccounts = accounts.filter(account => account.isAvailable).slice(0, 6); // عرض أول 6 حسابات فقط
  const hasAccounts = accounts.filter(account => account.isAvailable).length > 0;

  if (loading) {
    return (
      <section id="pubg-accounts" className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Gamepad2 className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
            <p className="text-gray-300">جاري تحميل حسابات PUBG...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasAccounts) {
    return null;
  }

  return (
    <section id="pubg-accounts" className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gaming-gradient bg-clip-text text-transparent mb-4">
            حسابات PUBG
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            مجموعة مختارة من أفضل حسابات PUBG Mobile المتاحة للبيع
          </p>
        </div>

        {/* عرض الحسابات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableAccounts.map((account) => (
            <PubgAccountCard key={account.id} account={account} />
          ))}
        </div>

        {/* رابط لعرض المزيد */}
        <div className="text-center mt-12">
          <Link to="/pubg-accounts">
            <Button
              variant="outline"
              size="lg"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 group"
            >
              عرض جميع الحسابات
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PubgAccountsSection;
