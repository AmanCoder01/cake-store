import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Cake, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { signup, reset } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    dispatch(signup(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl shadow-orange-500/5 border border-gray-50"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cake size={32} />
          </div>
          <h2 className="text-4xl font-black text-text mb-2">Join Us</h2>
          <p className="text-secondary font-medium">Create an account to start your sweet journey!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-11 text-gray-400 z-10" size={18} />
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              className="pl-12"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              type="password"
              name="password"
              placeholder="••••••••"
              className="pl-12"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-sm text-secondary font-medium px-2">
            By signing up, you agree to our <a href="#" className="text-primary font-bold">Terms</a> and <a href="#" className="text-primary font-bold">Privacy Policy</a>.
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 group"
            isLoading={isLoading}
          >
            Create Account <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="mt-10 text-center text-secondary font-medium">
          Already have an account? {' '}
          <Link to="/login" className="text-primary font-black hover:underline">Login Now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
