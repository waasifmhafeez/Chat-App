import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  // const validateForm = () => {
  //   if (!formData.email.trim()) return toast.error("Email is required");
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(formData.email))
  //     return toast.error("Invalid email format");
  //   if (!formData.password) return toast.error("Password is required");
  //   if (formData.password.length < 6)
  //     return toast.error("Password must be at least 6 characters long");
  //   return true;
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    // const success = validateForm();
    // if (success === true)
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm-12 m-2">
        <div className="w-full space-y-8 max-w-md ">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your to account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* email */}
            <div className="form-control">
              <label className="label items-start w-full m-2">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    color="white"
                    className="size-5 text-base-content/40 z-10 absolute"
                  />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label items-start w-full m-2">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    color="white"
                    className="size-5 text-base-content/40 z-10 absolute"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="*******"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      color="white"
                      className="size-5  text-base-content/40"
                    />
                  ) : (
                    <Eye
                      color="white"
                      className="size-5  text-base-content/40"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              className={`btn btn-primary w-full `}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin size-5 mr-2" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">Don&apos;t have an account?</p>
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title="Welcome to ChatSphere!"
        subtitle="Connect, communicate, and collaborate in real-time with our cutting-edge chat platform."
      />
    </div>
  );
};

export default LoginPage;
