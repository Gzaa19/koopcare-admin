// frontend/src/pages/Register/Register.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import KoopCareSlogan from '../../components/KoopCareSlogan';

const RegisterInput = ({ label, placeholder, type = "text", showEye = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-dark mb-1.5">{label}</label>
      <div className="relative">
        <input 
          type={showEye && showPassword ? "text" : type} 
          className="koopcare-input pl-4 pr-10" 
          placeholder={placeholder} 
          required 
        />
        {showEye && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        )}
      </div>
    </div>
  );
};

// 2. KOMPONEN UTAMA
const Register = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sisi Kiri (Slogan) */}
      <KoopCareSlogan />

      {/* Sisi Kanan (Formulir) */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
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

          <form className="space-y-5">
            <RegisterInput label="Kode Undangan" placeholder="Masukkan kode undangan" />
            <RegisterInput label="Full Name" placeholder="e.g. Ahmad Fauzi" />
            <RegisterInput label="NIK (National ID Number)" placeholder="16-digit number" />
            <RegisterInput label="WhatsApp Number" placeholder="+62 812-XXXX-XXXX" />
            <RegisterInput label="Create Security PIN / Password" placeholder="Buat PIN keamanan" type="password" showEye={true} />

            <div className="flex items-start gap-3 text-sm text-gray-600 pt-1">
              <input type="checkbox" className="h-4 w-4 mt-1 border-gray-300 rounded text-primary focus:ring-primary" required />
              <label>
                I agree to the Ta'awun (Mutual Assistance) principles and <a href="#" className="text-primary hover:underline">KoopCare Terms of Service</a>
              </label>
            </div>

            <button type="submit" className="koopcare-button-primary mt-6">
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;