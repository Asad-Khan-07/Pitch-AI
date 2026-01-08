import { useEffect, useRef, useState } from "react";
import { Sparkles, Download, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { HfInference } from "@huggingface/inference";
import { uploadToStorage, uploadTotable } from "@/storage";
import supabase from "@/supabasecreate.ts";
import { toast } from "react-toastify";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState("");
  const [fetch, setFetch] = useState(false);
  const [style, setStyle] = useState("Modern, Professional");
  const [aspect, setAspect] = useState("1:1");
  const [loader, setLoader] = useState(false);
  const [func, setFunc] = useState(false);

  const isFirstRender = useRef(true);

  const MODEL = "black-forest-labs/FLUX.1-schnell";

  const aspectMap = {
    "1:1": { width: 500, height: 500 },
    "16:9": { width: 768, height: 432 },
    "9:16": { width: 432, height: 768 },
    "4:3": { width: 640, height: 480 },
  };

  const Generateimage = async (prompt: string) => {
    if (!prompt) {
      return;
    }
    try {
      setFetch(false);
      setImg("");
      setLoader(true);
      const hf = new HfInference(import.meta.env.VITE_IMG_KEY);
      const selectedAspect = aspectMap[aspect] || aspectMap["1:1"];
      const finalPrompt = `${prompt}, style: ${style}, high quality, detailed`;

      const blob = await (
        hf.textToImage as unknown as (args: any) => Promise<Blob>
      )({
        model: MODEL,
        inputs: finalPrompt,
        parameters: {
          num_inference_steps: 4,
          guidance_scale: 4,
          ...selectedAspect,
        },
        options: { wait_for_model: true },
      });

      const imgURL = URL.createObjectURL(blob);
      // setImg(imgURL);

      const fileName = await uploadToStorage(blob);

      if (fileName) {
        await uploadTotable(fileName); 
      }

      setFunc((prev) => !prev);
      
    } catch (error) {
      toast.error("Internal Error", { position: "bottom-right" });
    }
  };

  const fetchimages = async () => {
    try {



      const user = await supabase.auth.getUser();
      const { data, error } = await supabase

        .from("Images")
        .select("*")
        .eq("User", user.data.user.email)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message, {
          position: "bottom-right",

          style: {
            background: "linear-gradient(to right, #fa8638, #089faf)",
            color: "#ffffff",
            borderRadius: "0.75rem",
            fontWeight: "500",
            boxShadow: "0 0 15px rgba(16,185,129,0.3)",
          },
        });

        console.log(error.message);
      } else {
        setImg(data[0].images);
        console.log(data);
        
      }
    } catch (error) {
      toast.error(error.message, {
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
      setFetch(true);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }

    fetchimages();
  }, [func]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Image Generator
            </h1>
            <p className="text-muted-foreground">
              Create stunning visuals for your pitch presentations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="prompt"
                    className="text-base font-semibold mb-2 block text-foreground"
                  >
                    Describe Your Image
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Professional business chart showing growth metrics with teal and coral colors..."
                    className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      id="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="Modern, Professional">
                        Modern, Professional
                      </option>
                      <option value="Minimal, Clean">Minimal, Clean</option>
                      <option value="3D Render">3D Render</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Photorealistic">Photorealistic</option>
                    </select>
                  </div>
                  <div>
                    <select
                      id="aspect"
                      value={aspect}
                      onChange={(e) => setAspect(e.target.value)}
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="1:1">1:1</option>
                      <option value="16:9">16:9</option>
                      <option value="9:16">9:16</option>
                      <option value="4:3">4:3</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    Generateimage(prompt);
                  }}
                  className="w-full h-12 px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity text-lg font-medium inline-flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate Image
                </button>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-3 text-sm">Quick Prompts</h3>
                  <div className="space-y-2">
                    {[
                      "Growth chart with upward trend",
                      "Team collaboration illustration",
                      "Technology innovation concept",
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium inline-flex items-center justify-start gap-2"
                        onClick={() => setPrompt(suggestion)}
                      >
                        <Sparkles className="w-3 h-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Generated Images</h2>
                <div className="grid gap-4">
                  <div className="overflow-hidden flex flex-col rounded-lg border border-border bg-card group relative">
                    {fetch ? (
                      <div>
                        <img
                          src={img}
                          alt={`Generated `}
                          className="w-full h-64"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button className="px-3 py-2 h-9 rounded-md bg-white/90 hover:bg-white text-foreground transition-colors text-sm font-medium inline-flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="inset-0 transition-opacity flex flex-col items-center justify-center gap-3 h-52">
                        {loader ? (
                          <div className="loader-wrapper">
                            <span className="loader-letter">G</span>
                            <span className="loader-letter">e</span>
                            <span className="loader-letter">n</span>
                            <span className="loader-letter">e</span>
                            <span className="loader-letter">r</span>
                            <span className="loader-letter">a</span>
                            <span className="loader-letter">t</span>
                            <span className="loader-letter">i</span>
                            <span className="loader-letter">n</span>
                            <span className="loader-letter">g</span>

                            {/* <div className="loader"></div> */}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Sparkles size={50} className="text-primary" />
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              Generate Your Image
                            </h3>
                            <button className="px-3 py-2 h-9 rounded-md bg-white/90 hover:bg-white text-foreground transition-colors text-sm font-medium inline-flex items-center gap-2"></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about colors, style, and composition</li>
                  <li>• Mention the mood you want to convey</li>
                  <li>• Include relevant business context</li>
                  <li>• Try different aspect ratios for various uses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
