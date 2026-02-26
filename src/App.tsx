import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ColorPalette from "./pages/Colorplatter";
import ImageGenerator from "./pages/ImageGenerator";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

import { lazy, Suspense, useContext, useState, useEffect } from "react";
import { UserContext } from "./authcontext";
import { ToastContainer } from "react-toastify";
import { Sparkles } from "lucide-react";
import Generated from "./pages/Generated";
import Chat from "./pages/Chat";
import supabase from "./supabasecreate";

const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(UserContext);

  if (user === undefined) {
    // Session check ho rahi hai - wait karo
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">401</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            Authentication is required
          </p>
          <a href="/signin" className="text-primary underline hover:text-primary/90">
            Return to Sign in
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => {
  // ✅ undefined = loading, null = not logged in, object = logged in
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // ✅ App start hone par session check karo
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem("username", JSON.stringify(true));
        setUser(session.user);
      } else {
        setUser(null);
      }
    };

    checkSession();

    // ✅ Login/logout changes sunna
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem("username", JSON.stringify(true));
        setUser(session.user);
      } else {
        localStorage.removeItem("username");
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const Dashboard = lazy(() => {
    return new Promise((resolve: any) => {
      setTimeout(() => resolve(import("./pages/History")), 2000);
    });
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/chat" element={<AuthRequired><Chat /></AuthRequired>} />
          <Route path="/image-generator" element={<AuthRequired><ImageGenerator /></AuthRequired>} />
          <Route path="/history" element={<AuthRequired><History /></AuthRequired>} />
          <Route path="/color" element={<AuthRequired><ColorPalette /></AuthRequired>} />
          <Route path="/Generated" element={<AuthRequired><Generated /></AuthRequired>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;