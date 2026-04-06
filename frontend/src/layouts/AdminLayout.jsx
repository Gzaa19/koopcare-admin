// frontend/src/layouts/AdminLayout.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shovel, LayoutDashboard, Users, FileText, Wallet, HeartHandshake, LogOut, Bell } from 'lucide-react';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-light">
      {/* Sisi Kiri: Sidebar Modern */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shovel className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary leading-tight">KoopCare</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
            <LayoutDashboard size={20} /> Dashboard Utama
          </NavLink>
          <NavLink to="/kyc" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
            <Users size={20} /> Verifikasi KYC
          </NavLink>
          <NavLink to="/loans" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
            <FileText size={20} /> Manajemen Pembiayaan
          </NavLink>
          <NavLink to="/cashier" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
            <Wallet size={20} /> Kasir & Buku Besar
          </NavLink>
          <NavLink to="/taawun" className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}>
            <HeartHandshake size={20} /> Dana Ta'awun
          </NavLink>
        </nav>

        {/* Tombol Logout Area */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={20} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Sisi Kanan: Area Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar (Header) */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <h1 className="text-2xl font-bold text-dark">Ringkasan Operasional</h1>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-primary transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div> {/* Pembatas */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-dark">Ahmad Fauzi</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary text-dark flex items-center justify-center font-bold text-lg">
                AF
              </div>
            </div>
          </div>
        </header>

        {/* Konten Halaman (Dashboard dll akan masuk ke sini) */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;