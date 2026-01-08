import React, { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import supabase from "@/supabasecreate";

export default function GenerateColor() {
  const [history, setHistory] = useState([]);
  const [savedColors, setSavedColors] = useState([]);

  // Generate random hex color
  const randomHex = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

  // Generate 5 random colors as a group
  const generateRandomColor = () => {
    const newGroup = Array.from({ length: 5 }, randomHex);
    setHistory((prev) => [newGroup, ...prev]);
  };

  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);

  };

  // Save color group to Supabase
  const saveColors = async (group: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { error } = await supabase
        .from("Color")
        .insert([
          {
            User: user.data.user.email,
            Generated_Color: JSON.stringify(group), // Store as JSON string
          },
        ]);

      if (!error) {
        console.log("Color Platter Saved");
        fetchSavedColors(); // Refresh saved colors
      } else {
        console.log("Error saving colors:", error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const fetchSavedColors = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      const { data, error } = await supabase
        .from("Color")
        .select("*")
        .eq("User", user.data.user.email)
        .order("created_at", { ascending: false });

      if (!error) {
        const colors = data.map((item: any) => {
         
            return JSON.parse(item.Generated_Color);
         
        });
        setSavedColors(colors);
      } else {
        console.log("Error fetching saved colors:", error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSavedColors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col items-center">
      <Navbar />

      <div className="w-full mt-20 p-5 flex md:flex-row flex-col justify-around gap-6">
        {/* Random Color Generator */}
        <div className="rounded-3xl h-[650px] shadow-2xl bg-card p-5 overflow-auto flex-1">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Random Color Generator
            </h1>

            <button
              onClick={generateRandomColor}
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-90 font-semibold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <RefreshCw
                className="group-hover:rotate-180 transition-transform duration-500 mr-2"
                size={26}
              />
              Generate New Color
            </button>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 w-full mt-10 gap-4 justify-items-center">
            {history.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex gap-3 flex-col justify-center p-4 rounded-xl bg-muted w-full"
              >
                <div className="flex justify-center gap-2">
                  {group.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(color)}
                      className="w-12 h-12 rounded-lg shadow-md  text-transparent hover:text-white hover:scale-110 transition item-color"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 px-2">
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <Save
                    className="cursor-pointer text-[#089fafe6]"
                    onClick={() => saveColors(group)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Colors */}
        <div className="rounded-3xl h-[650px] shadow-2xl bg-card p-5 overflow-auto flex-1">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Saved Colors
          </h1>

          <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4 justify-items-center">
            {savedColors.length === 0 && (
              <p className="text-muted-foreground text-center col-span-full">
                No saved colors yet
              </p>
            )}

            {savedColors.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex gap-3 flex-col justify-center p-4 rounded-xl bg-muted w-full"
              >
                <div className="flex justify-center  gap-1">
                  {group.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(color)}
                      className="w-12 h-12 rounded-lg shadow-md text-xs text-transparent hover:text-white focus: hover:scale-110 transition item-color"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 px-2">
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <Save
                    className="cursor-pointer text-[#089fafe6]"
                    onClick={() => saveColors(group)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
