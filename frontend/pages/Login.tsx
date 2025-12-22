import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../src/api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';

const MotionDiv = motion.div as any;

const Login: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', phoneOrEmail: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setIsLogin(false);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const { data } = await api.post(endpoint, formData);
      login(data);
      showToast(isLogin ? "Welcome back!" : "Account created successfully!", 'success');
      if (data.user.role === 'owner') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      showToast(handleApiError(err), 'error');
    }
  };

  return (

    <div className="max-w-md mx-auto mt-16 bg-white p-10 border border-gray-200 shadow-xl">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center text-[#008B9E]">{isLogin ? 'Login' : 'Join Us'}</h2>
      <p className="text-xs text-center text-gray-400 mb-8 uppercase tracking-wide">
        
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <input
            type="text"
            placeholder="FULL NAME"
            required
            className="w-full border-b border-gray-300 p-3 focus:outline-none focus:border-[#008B9E] text-sm"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        )}

        {isLogin ? (
          // LOGIN: Single Field
          <input
            type="text"
            placeholder="Phone number or Email"
            required
            className="w-full border-b border-gray-300 p-3 focus:outline-none focus:border-[#008B9E] text-sm placeholder:uppercase"
            value={formData.phoneOrEmail || formData.email || ''}
            onChange={e => setFormData({ ...formData, phoneOrEmail: e.target.value, email: e.target.value })}
          />
        ) : (
          // SIGNUP: Separate Fields
          <>
            <input
              type="text"
              placeholder="MOBILE NUMBER (10 DIGITS)"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              className="w-full border-b border-gray-300 p-3 focus:outline-none focus:border-[#008B9E] text-sm"
              value={formData.phone || ''}
              onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            />
            <input
              type="email"
              placeholder="EMAIL (OPTIONAL)"
              className="w-full border-b border-gray-300 p-3 focus:outline-none focus:border-[#008B9E] text-sm"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </>
        )}
        <input
          type="password"
          placeholder="PASSWORD"
          required
          className="w-full border-b border-gray-300 p-3 focus:outline-none focus:border-[#008B9E] text-sm"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
        />
        <AnimatedButton type="submit" className="w-full h-14 font-bold uppercase tracking-widest mt-4">
          {isLogin ? 'Login' : 'Create Account'}
        </AnimatedButton>
      </form>

      <div className="mt-8 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#008B9E] border-b border-transparent hover:border-[#008B9E] transition pb-1">
          {isLogin ? "New here? Create Account" : "Already have an account? Login"}
        </button>
      </div>
      <div className="mt-8 text-[10px] text-center text-gray-400 uppercase tracking-wider">
        
      </div>
    </div>
  );
};

export default Login;