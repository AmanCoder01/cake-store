import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cake, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login, reset } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, from, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl shadow-orange-500/5 border border-gray-50"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cake size={32} />
          </div>
          <h2 className="text-4xl font-black text-text mb-2">Welcome Back</h2>
          <p className="text-secondary font-medium">Sweet cravings are just a logout away!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-11 text-gray-400 z-10" size={18} />
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              className="pl-12"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-11 text-gray-400 z-10" size={18} />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="pl-12 pr-12"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-11 text-gray-400 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot Password?</a>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 group"
            isLoading={isLoading}
          >
            Login <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="mt-10 text-center text-secondary font-medium">
          Don't have an account? {' '}
          <Link to="/signup" className="text-primary font-black hover:underline">Create Account</Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-background rounded-2xl border border-primary/10">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Demo Credentials</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-bold">Admin:</span> admin@cakestore.com / password123</p>
            <p><span className="font-bold">User:</span> customer@example.com / 12345678</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
