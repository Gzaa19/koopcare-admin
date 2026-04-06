import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserCheck, FileText, Wallet, BookOpen, LogOut, Search, Bell, ChevronDown, Shovel } from 'lucide-react';

const AdminLayout = ({ children }) => {
  // Warna sidebar menyesuaikan gambar desain (Hijau Olive/Zaitun)
  const sidebarBg = "bg-[#748754]"; 

  return (
    <div className="flex h-screen bg-[#F3F6F8] font-sans">
      {/* Sisi Kiri: Sidebar Solid Green */}
      <aside className={`w-64 ${sidebarBg} text-white flex flex-col hidden md:flex rounded-r-3xl my-4 ml-4 shadow-xl`}>
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Shovel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">KoopCare</h2>
              <p className="text-[11px] text-white/70 font-medium tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Home size={20} /> Dashboard
          </NavLink>
          <NavLink to="/kyc" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <UserCheck size={20} /> KYC Verification
          </NavLink>
          <NavLink to="/loans" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <FileText size={20} /> Loan Management
          </NavLink>
          <NavLink to="/cashier" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Wallet size={20} /> Cashier
          </NavLink>
          <NavLink to="/ledger" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <BookOpen size={20} /> General Ledger
          </NavLink>
        </nav>

        {/* Tombol Logout Area */}
        <div className="p-6 mb-4">
          <button className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all">
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Sisi Kanan: Area Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Modern */}
        <header className="h-24 flex items-center justify-between px-8 z-10 mt-4">
          {/* Search Bar */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search.." 
              className="block w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-[#748754] focus:border-transparent text-sm transition-all shadow-sm"
            />
          </div>
          
          {/* Kanan: Profil & Notifikasi */}
          <div className="flex items-center gap-6 bg-white py-2 px-4 rounded-full shadow-sm border border-gray-100">
            <button className="text-gray-400 hover:text-[#748754] transition-colors relative">
              <Bell size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#748754] text-white flex items-center justify-center font-bold text-sm">
                AF
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">Ahmad Fauzi</p>
                <p className="text-[11px] text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 ml-1" />
            </div>
          </div>
        </header>

        {/* Konten Halaman */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="max-w-7xl mx-auto mt-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;