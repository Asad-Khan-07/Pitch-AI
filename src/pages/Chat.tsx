import { useEffect, useRef, useState } from "react";
import { Calendar, Download, Send, Sparkles, User, Wand2, ChevronDown, Monitor, ShoppingCart, Banknote, BookOpen, HeartPulse, UtensilsCrossed, Lightbulb, Rocket, TrendingUp, Building2, Zap, BarChart2, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import supabase from "@/supabasecreate";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Custom Select Component
const CustomSelect = ({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground 
                   flex items-center justify-between gap-2 
                   hover:border-primary/60 hover:bg-accent/50
                   focus:outline-none focus:ring-2 focus:ring-ring 
                   transition-all duration-200"
      >
        <span className={`flex items-center gap-2 ${selected ? "text-foreground text-sm" : "text-muted-foreground text-sm"}`}>
          {selected?.icon && (
            <span className="text-primary">{selected.icon}</span>
          )}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2
                         hover:bg-accent hover:text-accent-foreground transition-colors duration-150
                         ${value === opt.value
                           ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium"
                           : "text-foreground"
                         }`}
            >
              {opt.icon && (
                <span className={value === opt.value ? "text-primary" : "text-muted-foreground"}>
                  {opt.icon}
                </span>
              )}
              {opt.label}
              {value === opt.value && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary inline-block" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");
  const [depth, setDepth] = useState("");
  const [pitch, setPitch] = useState("");
  const [features, setFeatures] = useState([]);
  const isFirstRender = useRef(true);

  const sessionId = localStorage.getItem("chat_session");

  const bottom = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sent = async () => {
    if (!input.trim()) return;
    setLoader(true);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_AI_KEY
        }`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a senior venture capital advisor and startup strategist.

User input:
Idea: ${input}
Category: ${category}
Startup stage: ${stage}
Selected features: ${features.join(", ") || "Not specified"}
Pitch depth: ${depth}

Instructions:
- Adapt tone and detail level based on startup stage and pitch depth
- Improve weak points without rejecting the idea
- Fill gaps intelligently using realistic business assumptions
- Keep the pitch persuasive and investor-ready

Rules:
- Respond in **heading-wise paragraphs only**
- Each heading should be followed by its content in a new line
- Use plain text, no JSON, no symbols, no bullets
- Keep the headings exactly as below

Sections to include:
Business Name:
Tagline:
Market Problem:
Proposed Solution:
Key Features:
Target Customers:
Monetization Strategy:
Competitive Advantage:
Growth Roadmap:
Risks and Mitigation:
Future Vision:
`,
                },
              ],
            },
          ],
        }
      );

      const aiReply = res.data.candidates[0].content.parts[0].text;
      const user = await supabase.auth.getUser();

      const { error: aiError } = await supabase.from("Model").insert([
        {
          User_Startup: input,
          Generated_Pitch: aiReply,
          User: user.data.user.email,
          Session_id: sessionId,
        },
      ]);
      setRefresh(!refresh);
    } catch (error) {
      toast.success(`${error} error to sent`, {
        position: "bottom-right",
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchMessages();
  }, [refresh]);

  const fetchMessages = async () => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("Model")
      .select("*")
      .eq("User", user.data.user.email)
      .eq("Session_id", sessionId)
      .order("Time", { ascending: false });

    if (!error) {
      const formattedPitch = data[0].Generated_Pitch.split("\n").map(
        (line: string, index: number) => {
          if (line.endsWith(":")) {
            return (
              <h3 key={index} className="font-semibold mt-4 text-start">
                {line}
              </h3>
            );
          }
          return (
            <p key={index} className="ml-2">
              {line}
            </p>
          );
        }
      );
      setLoader(false);
      setPitch(formattedPitch);
    }
  };

  const isValidInput = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 5) return false;
    if (trimmed.split(" ").length < 1) return false;
    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Pitch Assistant
            </h1>
          </div>

          <div className="grid h-[700px] md:h-[500px] grid-cols-1 md:grid-cols-2 gap-5 justify-between">
            {/* ✅ Left Panel - Input */}
            <div className="h-[400px] flex flex-col rounded-lg border border-border bg-card">
              <div className="p-4 border-t border-border">
                <div className="grid grid-cols-1 gap-3">

                  {/* Input */}
                  <input
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your business idea..."
                    className="flex-1 h-12 px-3 py-2 rounded-md border border-input bg-background 
                               text-foreground placeholder:text-muted-foreground 
                               focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                               hover:border-primary/60 transition-all duration-200"
                  />

                  {/* ✅ Category Dropdown */}
                  <CustomSelect
                    value={category}
                    onChange={setCategory}
                    placeholder="Select Category"
                    options={[
                      { value: "SaaS", label: "SaaS", icon: <Monitor size={15} /> },
                      { value: "E-commerce", label: "E-commerce", icon: <ShoppingCart size={15} /> },
                      { value: "FinTech", label: "FinTech", icon: <Banknote size={15} /> },
                      { value: "EdTech", label: "EdTech", icon: <BookOpen size={15} /> },
                      { value: "HealthTech", label: "HealthTech", icon: <HeartPulse size={15} /> },
                      { value: "Food", label: "Food", icon: <UtensilsCrossed size={15} /> },
                    ]}
                  />

                  {/* ✅ Stage Dropdown */}
                  <CustomSelect
                    value={stage}
                    onChange={setStage}
                    placeholder="Startup Stage"
                    options={[
                      { value: "Idea", label: "Idea", icon: <Lightbulb size={15} /> },
                      { value: "MVP", label: "MVP", icon: <Rocket size={15} /> },
                      { value: "Scaling", label: "Scaling", icon: <TrendingUp size={15} /> },
                      { value: "Enterprise", label: "Enterprise", icon: <Building2 size={15} /> },
                    ]}
                  />

                  {/* ✅ Depth Dropdown */}
                  <CustomSelect
                    value={depth}
                    onChange={setDepth}
                    placeholder="Pitch Depth"
                    options={[
                      { value: "short", label: "Short Pitch (30 sec)", icon: <Zap size={15} /> },
                      { value: "medium", label: "Investor Pitch", icon: <BarChart2 size={15} /> },
                      { value: "deep", label: "Full Business Plan", icon: <ClipboardList size={15} /> },
                    ]}
                  />

                  {/* ✅ Generate Button */}
                  <button
                    disabled={!isValidInput(input) || !category}
                    onClick={sent}
                    className={`w-full h-12 rounded-md text-white font-medium transition-all duration-200
                      ${!isValidInput(input) || !category
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      }`}
                  >
                    Generate Pitch
                  </button>

                </div>
              </div>
            </div>

            {/* Right Panel - Output */}
            <div className="rounded-lg border bg-card hover:shadow-lg overflow-auto selector flex flex-col">
              {loader ? (
                <section className="loader-slider">
                  <div className="slider"></div>
                  <div className="slider"></div>
                  <div className="slider"></div>
                  <div className="slider"></div>
                  <div className="slider"></div>
                </section>
              ) : pitch.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Sparkles size={100} className="text-primary" />
                  <p className="text-muted-foreground text-center text-2xl font-semibold">
                    Create your perfect pitch through conversation!
                  </p>
                </div>
              ) : (
                <div className="p-6 overflow-auto">{pitch}</div>
              )}
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Quick Start</h3>
                  <p className="text-xs text-muted-foreground">
                    "I need a pitch for a SaaS platform"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Refine Existing</h3>
                  <p className="text-xs text-muted-foreground">
                    "Improve my value proposition"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent-foreground mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Get Feedback</h3>
                  <p className="text-xs text-muted-foreground">
                    "Review my pitch deck structure"
                  </p>
                </div>
          </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;