import { assets } from "@/assets/assets";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [residence, setResidence] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password, residence });
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          console.log('Token received on Sign Up:', data.data.token); // Debug: Check token received
          sessionStorage.setItem('token', JSON.stringify(data.data.token)); // Save token to session storage
          console.log('Stored token in sessionStorage:', sessionStorage.getItem('token')); // Debug: Verify storage
          navigate('/');
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          console.log('Token received on Login:', data.data.token); // Debug: Check token received
          sessionStorage.setItem('token', JSON.stringify(data.data.token)); // Save token to session storage
          console.log('Stored token in sessionStorage:', sessionStorage.getItem('token')); // Debug: Verify storage
          navigate('/');
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error('No response received from the server');
      } else {
        toast.error(error.message);
      }
    }
  };

  const nigeriaStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara", "Federal Capital Territory"
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate('/')} src={assets.logo} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className="text-center text-sm mb-6">{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.person_icon} />
                <input
                  onChange={e => setName(e.target.value)}
                  value={name} className="bg-transparent outline-none" type="text" placeholder="Full Name" required />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} />
                <input
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  className="bg-transparent outline-none" type="email" placeholder="Email ID" required />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.house_user} width={17} />
                <select
                  onChange={e => setResidence(e.target.value)}
                  value={residence}
                  className="bg-transparent outline-none w-full" required>
                  <option className="bg-[#333A5C]" value="" disabled>Select State of Residence</option>
                  {nigeriaStates.map((state) => (
                    <option className="bg-[#333A5C]" key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} />
                <input
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  className="bg-transparent outline-none" type="password" placeholder="Password" required />
              </div>
            </>
          )}
          {state === 'Login' && (
            <>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} />
                <input
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  className="bg-transparent outline-none" type="email" placeholder="Email ID" required />
              </div>
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} />
                <input
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  className="bg-transparent outline-none" type="password" placeholder="Password" required />
              </div>
              <p
                onClick={() => navigate('/reset-password')}
                className="mb-4 text-indigo-500 cursor-pointer">Forgot Password?</p>
            </>
          )}
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className="text-gray-400 text-center text-xs mt-4">Already have an account? {' '} <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline">Login here</span></p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">Don't have an account? {' '} <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline">Sign up</span></p>
        )}
      </div>
    </div>
  );
}

export default Login;
