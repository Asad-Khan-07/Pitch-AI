import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ColorPalette from "./pages/Colorplatter";
import ImageGenerator from "./pages/ImageGenerator";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { UserContext } from "./authcontext";
import { ToastContainer } from "react-toastify";
import { Sparkles } from "lucide-react";
import Generated from "./pages/Generated";
import Chat from "./pages/Chat";
import supabase from "./supabasecreate";

const App = () => {
  const username = JSON.parse(localStorage.getItem("username"));
  const [user, setUser] = useState(username);


     const Dashboard = lazy(() => {
    return new Promise((resolve:any) => {
      setTimeout(() => resolve(import("./pages/History")), 2000);
    });
  });


  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        window.location.replace("/history");
      }
    });
  
    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
     <ToastContainer/>
      <BrowserRouter>
    
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
  path="/chat"
  element={
    user ? (
 
        <Chat />
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">401</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            Authentication is required
          </p>
          <a
            href="/signin"
            className="text-primary underline hover:text-primary/90"
          >
            Return to Sign in
          </a>
        </div>
      </div>
    )
  }
/>

          <Route
            path="/image-generator"
            element={
              user ? (
                <ImageGenerator />
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-muted">
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">401</h1>
                    <p className="mb-4 text-xl text-muted-foreground">
                      Authentication is required
                    </p>
                    <a
                      href="/signin"
                      className="text-primary underline hover:text-primary/90"
                    >
                      Return to Sign in
                    </a>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/history"
            element={
              user ? (
        <History/>
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-muted">
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">401</h1>
                    <p className="mb-4 text-xl text-muted-foreground">
                      Authentication is required
                    </p>
                    <a
                      href="/signin"
                      className="text-primary underline hover:text-primary/90"
                    >
                      Return to Sign in
                    </a>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/color"
            element={
              user ? (
                < ColorPalette/>
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-muted">
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">401</h1>
                    <p className="mb-4 text-xl text-muted-foreground">
                      Authentication is required
                    </p>
                    <a
                      href="/signin"
                      className="text-primary underline hover:text-primary/90"
                    >
                      Return to Sign in
                    </a>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/Generated"
            element={
              user ? (
                < Generated/>
              ) : (
                <div className="flex min-h-screen items-center justify-center bg-muted">
                  <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">401</h1>
                    <p className="mb-4 text-xl text-muted-foreground">
                      Authentication is required
                    </p>
                    <a
                      href="/signin"
                      className="text-primary underline hover:text-primary/90"
                    >
                      Return to Sign in
                    </a>
                  </div>
                </div>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
