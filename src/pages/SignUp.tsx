import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import supabase from "@/supabasecreate";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
const SignUp = () => {

  const [useremail,SetUseremail]=useState("")
  const [userpassword,SetUserpassword]=useState("")
  const navigate=useNavigate()

type FormData = {
  email: string;
  password: string;
};


const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>();

const onSubmit = (data: FormData) => {
  handleSignup(data.email, data.password);
};



  const handleSignup = async (email:string, password:string) => {
    try {
    
        const { error } = await supabase.auth.signUp({ email, password });
        if (error){ 
          



      if (
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("registered")
      ) {
        toast.error("User already exists. Please sign in.", {
          position: "bottom-right",
        });
      } else {
        toast.error(error.message, {
          position: "bottom-right",
        });
      }

            
toast.info(error.message, {
  position: "bottom-right",
  icon: (
    <span
      style={{
        background: "linear-gradient(to right, #fa8638, #089faf)",
        WebkitBackgroundClip: "text",
        color: "#ffffff",
        fontSize: "1.3rem",
        fontWeight: "bold",
      }}
    >
      ✔
    </span>
  ),
  style: {
    background: "linear-gradient(to right, #fa8638, #089faf)",
    color: "#ffffff",
    borderRadius: "0.75rem",
    fontWeight: "500",
    boxShadow: "0 0 15px rgba(16,185,129,0.3)",
  },

});

navigate("/signin")
        
        
        }else {


          navigate("/signin")
          toast.success("Account SuccessFully Created", {
  position: "bottom-right",
  icon: (
    <span
      style={{
        background: "linear-gradient(to right, #fa8638, #089faf)",
        WebkitBackgroundClip: "text",
        color: "#ffffff",
        fontSize: "1.3rem",
        fontWeight: "bold",
      }}
    >
      ✔
    </span>
  ),
  style: {
    background: "linear-gradient(to right, #fa8638, #089faf)",
    color: "#ffffff",
    borderRadius: "0.75rem",
    fontWeight: "500",
    boxShadow: "0 0 15px rgba(16,185,129,0.3)",
  },

});


    
        }} catch (error) {

          toast.error(error.message, {
  position: "bottom-right",
  icon: (
    <span
      style={{
        background: "linear-gradient(to right, #fa8638, #089faf)",
        WebkitBackgroundClip: "text",
        color: "#ffffff",
        fontSize: "1.3rem",
        fontWeight: "bold",
      }}
    >
      ✔
    </span>
  ),
  style: {
    background: "linear-gradient(to right, #fa8638, #089faf)",
    color: "#ffffff",
    borderRadius: "0.75rem",
    fontWeight: "500",
    boxShadow: "0 0 15px rgba(16,185,129,0.3)",
  },

});

        }    
      };

// console.log(useremail,userpassword);


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-accent to-background">
      <div className="w-full max-w-md p-8 rounded-lg border border-border bg-card animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PitchAI
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Start creating winning pitches today</p>
        </div>

  <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

  {/* EMAIL */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">Email</label>
    <input
      type="email"
      placeholder="you@company.com"
      className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background
      focus:outline-none focus:ring-2 focus:ring-ring"
      {...register("email", {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address",
        },
      })}
    />
    {errors.email && (
      <p className="text-sm text-red-500">{errors.email.message}</p>
    )}
  </div>

  {/* PASSWORD */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">Password</label>
    <input
      type="password"
      placeholder="••••••••"
      className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background
      focus:outline-none focus:ring-2 focus:ring-ring"
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      })}
    />
    {errors.password && (
      <p className="text-sm text-red-500">{errors.password.message}</p>
    )}
  </div>

  <button
    type="submit"
    className="w-full h-11 rounded-md bg-gradient-to-r from-primary to-primary/90
    text-primary-foreground font-medium hover:opacity-90"
  >
    Create Account
  </button>

</form>


        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/signin" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>


        <p className="mt-6 text-xs text-center text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link to="#" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
