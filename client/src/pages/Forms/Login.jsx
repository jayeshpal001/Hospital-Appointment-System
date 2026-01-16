
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { GlassInput, GradientButton, showToast  } from "../../components/ui/Form";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

// Import UI components and the custom 'showToast' function
// import { GlassInput, GradientButton, showToast } from "../../components/ui/Form/FormComponents"; 

const Login = ({ onToggle }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {    
      const res = await api.post("/auth/login", data, { withCredentials: true });
      
      // UPGRADE: Premium Toast Notification
      localStorage.setItem("role", res.data.user.role);
    
      
      showToast("success", "Welcome Back! Login Successful.");
      console.log(res.data);
        if (res.data.user.role==="patient") {
        navigate("/findDoctors")
      }
      else{
         navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      // UPGRADE: Smart error message extraction
      const errorMsg = error.response?.data?.message || "Invalid email or password.";
      showToast("error", errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full px-10">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 mb-2 tracking-tight drop-shadow-lg">
        Login
      </h1>
      {/* Decorative Glow Line (Cyan/Blue theme for Login) */}
      <div className="h-1 w-16 bg-linear-to-r from-cyan-400 to-blue-600 rounded-full mb-8 shadow-[0_0_15px_rgba(0,242,254,0.6)]"></div>
      
      {/* Inputs */}
      <div className="w-full space-y-2">
        <GlassInput
            placeholder="Email Address"
            icon={FaUser}
            {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
            })}
            error={errors.email}
        />

        <GlassInput
            type="password"
            placeholder="Password"
            icon={FaLock}
            {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Min 6 chars" } 
            })}
            error={errors.password}
        />
      </div>

      <a href="#" className="text-sm text-gray-300 mt-2 mb-6 hover:text-cyan-300 transition-colors font-light self-end">
        Forgot password?
      </a>

      {/* Submit Button (Cyan Variant) */}
      <div className="w-48">
        <GradientButton loading={isSubmitting} variant="cyan">
            Sign In
        </GradientButton>
      </div>

      <p className="text-sm text-gray-400 mt-6 font-light">
        Don't have an account?{" "}
        <span 
            onClick={onToggle} 
            className="text-cyan-400 font-bold cursor-pointer hover:text-cyan-300 hover:underline transition-colors"
        >
          Sign Up
        </span>
      </p>
    </form>
  );
};

export default Login;