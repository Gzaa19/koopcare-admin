// frontend/src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { TrendingUp, Users, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <AdminLayout>
      {/* Baris 1: Kartu Statistik Metrik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="koopcare-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Aset Koperasi</p>
              <h3 className="text-2xl font-bold text-dark">Rp 1.25M</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4 font-medium">+12.5% dari bulan lalu</p>
        </div>

        <div className="koopcare-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Anggota Aktif</p>
              <h3 className="text-2xl font-bold text-dark">842</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-4 font-medium">+24 anggota baru minggu ini</p>
        </div>

        <div className="koopcare-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pembiayaan Berjalan</p>
              <h3 className="text-2xl font-bold text-dark">124</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium">Rp 450 Juta tersalurkan</p>
        </div>

        <div className="koopcare-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Dana Ta'awun (Aman)</p>
              <h3 className="text-2xl font-bold text-dark">Rp 45Jt</h3>
            </div>
            <div className="p-3 bg-secondary/20 rounded-xl text-yellow-700">
              <ShieldCheck size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 font-medium">Rasio Risiko: 1.2% (Rendah)</p>
        </div>

      </div>

      {/* Baris 2: Tabel Aktivitas Terbaru */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-dark">Tugas Menunggu Review (KYC & Pengajuan)</h2>
          <button className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
            Lihat Semua <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ID Ref</th>
                <th className="table-header">Nama Anggota</th>
                <th className="table-header">Jenis Aktivitas</th>
                <th className="table-header">Waktu</th>
                <th className="table-header">Status AI Risk</th>
                <th className="table-header text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-mono text-xs text-gray-500">#KYC-8921</td>
                <td className="table-cell font-bold text-dark">Budi Santoso</td>
                <td className="table-cell text-gray-600">Verifikasi e-KTP</td>
                <td className="table-cell text-gray-500 text-xs">Hari ini, 10:45</td>
                <td className="table-cell">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Aman (98%)</span>
                </td>
                <td className="table-cell text-right">
                  <button className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition">Review</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-mono text-xs text-gray-500">#LON-4022</td>
                <td className="table-cell font-bold text-dark">Siti Aminah</td>
                <td className="table-cell text-gray-600">Pengajuan Pembiayaan</td>
                <td className="table-cell text-gray-500 text-xs">Kemarin, 14:20</td>
                <td className="table-cell">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Cek Manual (75%)</span>
                </td>
                <td className="table-cell text-right">
                  <button className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;