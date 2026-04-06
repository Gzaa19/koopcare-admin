// frontend/src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import KoopCareSlogan from '../../components/KoopCareSlogan';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sisi Kiri (Slogan) */}
      <KoopCareSlogan />

      {/* Sisi Kanan (Formulir) */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="max-w-md w-full">
          {/* Tab Menu */}
          <div className="flex border-b border-gray-100 mb-8">
            <NavLink to="/login" className={({ isActive }) => `pb-3 font-semibold text-lg flex-1 text-center border-b-2 ${isActive ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}>
              Sign In
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `pb-3 font-semibold text-lg flex-1 text-center border-b-2 ${isActive ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}>
              Register
            </NavLink>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">WhatsApp Number or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" className="koopcare-input" placeholder="e.g. +62 812 3456 7890" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Password / PIN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type={showPassword ? "text" : "password"} className="koopcare-input pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right mt-2.5">
                <a href="#" className="text-sm text-gray-500 hover:text-primary transition">Forgot Password?</a>
              </div>
            </div>

            <button type="submit" className="koopcare-button-primary">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;