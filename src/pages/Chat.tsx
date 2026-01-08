import { useEffect, useRef, useState } from "react";
import { Calendar, Download, Send, Sparkles, User, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import axios from "axios";
import supabase from "@/supabasecreate";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    } finally {
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
    console.log(user);
    const { data, error } = await supabase

      .from("Model")
      .select("*")
      .eq("User", user.data.user.email)
      .eq("Session_id", sessionId)
      .order("Time", { ascending: false });

    if (!error) {
      console.log(data[0]);
      const formattedPitch = data[0].Generated_Pitch.split("\n").map(
        (line, index) => {
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

  const isValidInput = (text) => {
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
            <div className="h-[400px]  flex flex-col rounded-lg border border-border bg-card ">
              <div className="p-4 border-t border-border">
                <div className="grid grid-cols-1 gap-5 ">
                  <div>
                    <input
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your business idea..."
                      className="flex-1 h-12 px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>

                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 rounded-md border px-3"
                  >
                    <option value="Select Category">Select Category</option>
                    <option value="SaaS">SaaS</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="FinTech">FinTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="Food">Food</option>
                  </select>

                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full h-10 rounded-md border px-3"
                  >
                    <option value="">Startup Stage</option>
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Scaling">Scaling</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>

                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full h-10 rounded-md border px-3"
                  >
                    <option value="short">Short Pitch (30 sec)</option>
                    <option value="medium">Investor Pitch</option>
                    <option value="deep">Full Business Plan</option>
                  </select>

                  <button
                    disabled={!isValidInput(input) || !category}
                    onClick={sent}
                    className={`w-full h-12 rounded-md text-white ${
                      !isValidInput(input) || !category
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-secondary"
                    }`}
                  >
                    Generate Pitch
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card hover:shadow-lg overflow-auto selector flex flex-col ">
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
                  <h3 className="font-semibold text-sm mb-1">
                    Refine Existing
                  </h3>
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
