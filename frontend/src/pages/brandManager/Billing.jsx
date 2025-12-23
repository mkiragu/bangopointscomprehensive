import React, { useState, useEffect } from 'react';
import { Download, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalDue: 0,
    totalPaid: 0,
    pendingCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      // Simulated data - replace with actual API call
      const mockInvoices = [
        {
          id: 1,
          period: 'January 2025',
          transactions: 1245,
          fee: 2490,
          baseFee: 5000,
          discount: 750,
          tax: 1078,
          total: 7818,
          status: 'paid',
          dueDate: '2025-02-15',
          paidDate: '2025-02-10'
        },
        {
          id: 2,
          period: 'December 2024',
          transactions: 980,
          fee: 1960,
          baseFee: 5000,
          discount: 500,
          tax: 993,
          total: 7453,
          status: 'paid',
          dueDate: '2025-01-15',
          paidDate: '2025-01-12'
        },
        {
          id: 3,
          period: 'February 2025',
          transactions: 1567,
          fee: 3134,
          baseFee: 5000,
          discount: 950,
          tax: 1149,
          total: 8333,
          status: 'pending',
          dueDate: '2025-03-15',
          paidDate: null
        }
      ];

      setInvoices(mockInvoices);
      
      const totalPaid = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
      const totalDue = mockInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
      const pendingCount = mockInvoices.filter(inv => inv.status === 'pending').length;
      
      setSummary({ totalDue, totalPaid, pendingCount });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      setLoading(false);
    }
  };

  const downloadInvoice = (invoiceId) => {
    // Implement PDF download
    console.log(`Downloading invoice ${invoiceId}`);
    alert('Invoice download feature - integrate with PDF generation service');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-green-400 bg-green-900/30 border-green-700';
      case 'pending': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'overdue': return 'text-red-400 bg-red-900/30 border-red-700';
      default: return 'text-silver-400 bg-dark-300 border-silver-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'overdue': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-accent-primary">Billing & Invoices</h1>
        <div className="animate-pulse space-y-4">
          <div className="card h-32"></div>
          <div className="card h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">Billing & Invoices</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-accent-primary/10 to-transparent border-accent-primary/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Total Outstanding</p>
              <h3 className="text-3xl font-bold text-accent-primary mt-2">
                KES {summary.totalDue.toLocaleString()}
              </h3>
              <p className="text-xs text-silver-500 mt-1">{summary.pendingCount} pending invoice(s)</p>
            </div>
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Total Paid</p>
              <h3 className="text-3xl font-bold text-green-400 mt-2">
                KES {summary.totalPaid.toLocaleString()}
              </h3>
              <p className="text-xs text-silver-500 mt-1">Year to date</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Billing Cycle</p>
              <h3 className="text-2xl font-bold text-silver-200 mt-2">
                Monthly
              </h3>
              <p className="text-xs text-silver-500 mt-1">Auto-generated on 1st</p>
            </div>
            <div className="p-3 bg-dark-300 rounded-lg">
              <Clock className="w-6 h-6 text-silver-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure */}
      <div className="card">
        <h2 className="text-xl font-semibold text-accent-primary mb-4">Fee Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-300 rounded-lg">
            <h3 className="text-sm font-medium text-silver-300 mb-2">Transaction Fee</h3>
            <p className="text-2xl font-bold text-accent-primary">KES 2.00</p>
            <p className="text-xs text-silver-500 mt-1">Per approved receipt</p>
          </div>
          <div className="p-4 bg-dark-300 rounded-lg">
            <h3 className="text-sm font-medium text-silver-300 mb-2">Base Subscription</h3>
            <p className="text-2xl font-bold text-accent-primary">KES 5,000</p>
            <p className="text-xs text-silver-500 mt-1">Monthly platform fee</p>
          </div>
          <div className="p-4 bg-dark-300 rounded-lg">
            <h3 className="text-sm font-medium text-silver-300 mb-2">Volume Discount</h3>
            <p className="text-2xl font-bold text-green-400">10%</p>
            <p className="text-xs text-silver-500 mt-1">Over 1,000 transactions</p>
          </div>
          <div className="p-4 bg-dark-300 rounded-lg">
            <h3 className="text-sm font-medium text-silver-300 mb-2">Tax (VAT)</h3>
            <p className="text-2xl font-bold text-accent-primary">16%</p>
            <p className="text-xs text-silver-500 mt-1">Kenya standard rate</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-accent-primary">Invoice History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-silver-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Period</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Transactions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Total Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-silver-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-silver-800/50 hover:bg-dark-300/50">
                  <td className="py-4 px-4 font-medium text-silver-200">{invoice.period}</td>
                  <td className="py-4 px-4 text-silver-300">{invoice.transactions.toLocaleString()}</td>
                  <td className="py-4 px-4 font-semibold text-accent-primary">
                    KES {invoice.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-silver-300">{invoice.dueDate}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => downloadInvoice(invoice.id)}
                      className="btn-secondary text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Information */}
      <div className="card bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
        <h2 className="text-xl font-semibold text-accent-primary mb-4">Payment Information</h2>
        <div className="space-y-2 text-sm text-silver-300">
          <p><span className="font-semibold text-silver-200">Payment Terms:</span> Net 30 days</p>
          <p><span className="font-semibold text-silver-200">Payment Methods:</span> Bank Transfer, M-Pesa, Credit Card</p>
          <p><span className="font-semibold text-silver-200">Late Fee:</span> 2% per month on overdue balances</p>
          <p><span className="font-semibold text-silver-200">Support:</span> billing@bangopoints.com</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
