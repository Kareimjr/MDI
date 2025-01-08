import { assets } from "@/assets/assets";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function ResetPassword() {

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const inputRef = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map(e => e.value);
    setOtp(otpArray.join(''));
    
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-otp', { email, otp: otpArray.join('') });
      if (data.success) {
        setIsOtpValid(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      console.error("Error Response:", error.response); 
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={() => navigate('/')} src={assets.logo} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />

      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Password Reset</h1>
          <p className=" text-center mb-6 text-indigo-300 ">Enter your registered email address</p>
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className=" w-3 h-3" />
            <input type="email" placeholder='Email ID'
              className="bg-transparent outline-none text-white" required
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button className=" w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
        </form>
      }

      {!isOtpValid && isEmailSent &&
        <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className=" text-center mb-6 text-indigo-300 ">Enter the 6-digit code sent to your email ID</p>

          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6).fill().map((_, index) => (
              <input key={index} type="text" maxLength="1" required
                className=" w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={e => inputRef.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className=" w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Submit</button>
        </form>
      }

      {isOtpValid && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className=" text-center mb-6 text-indigo-300 ">Enter your new password below</p>
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className=" w-3 h-3" />
            <input type="password" placeholder='New Password'
              className="bg-transparent outline-none text-white" required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <button className=" w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
        </form>
      }
    </div>
  );
}

export default ResetPassword;
