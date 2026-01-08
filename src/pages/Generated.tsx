import { UserContext } from "@/authcontext";
import Navbar from "@/components/Navbar";
import { handleExport } from "@/storage";
import supabase from "@/supabasecreate";
import {
  ArrowDown,
  ArrowRightSquare,
  Calendar,
  Download,
  Search,
  Sparkles,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

const Generated = () => {
  const [segment, setSegment] = useState(true);
  const [loader, setLoader] = useState(false);



  const [userhistory, setUserhistory] = useState([]);
  const [firstfive, setFirstfive] = useState([]);

  const [searchinput, setSearchinput] = useState("");
  const [searchhistory, setSearchhistory] = useState([]);
  const [show, setShow] = useState(true);

  const [image, setImages] = useState([]);


  useEffect(() => {
    const fetchHistory = async () => {
      setLoader(true);
      const user = await supabase.auth.getUser();

      const { data } = await supabase
        .from("Model")
        .select("*")
        .eq("User", user.data.user.email)
        .order("Time", { ascending: false });
const formattedPitch = data.map((ech) => {
  return ech.Generated_Pitch.split("\n").map((line, index) => {
    if (line.endsWith(":")) {
      return (
        <h3 key={index} className="font-semibold mt-4 text-start">
          {line}
        </h3>
      );
    }
    return <p key={index} className="ml-2">{line}</p>;
  });
});




      setUserhistory(formattedPitch || []);
      setFirstfive((formattedPitch || []).slice(0, 6));
      setLoader(false);

      console.log(userhistory);
      
    };

    fetchHistory();




    
  }, []);

  const handleSearch = () => {
    if (!searchinput.trim()) return;

    const result = userhistory.filter((i) =>
      i.User_Startup?.toLowerCase().includes(
        searchinput.toLowerCase()
      )
    );

    setSearchhistory(result);
    setShow(false);
  };


  const handleBack = () => {
    setShow(true);
    setSearchinput("");
    setSearchhistory([]);
  };

  const Loadmore = () => {
    setFirstfive(userhistory);
  };


  useEffect(() => {
    const fetchImages = async () => {
      const user = await supabase.auth.getUser();

      const { data } = await supabase
        .from("Images")
        .select("*")
        .eq("User", user.data.user.email)
        .order("created_at", { ascending: false });

      setImages(data || []);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">


          {loader ? (
            <div className="flex justify-center icon-load h-20 w-full">
              <Sparkles size={80} className="text-primary items-center" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 my-10">
              <button
                className={`border-b-4 ${
                  segment ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSegment(true)}
              >
                Pitches
              </button>
              <button
                className={`border-b-4 ${
                  !segment ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSegment(false)}
              >
                Images
              </button>
            </div>
          )}


          {segment ? (
            <>
              {/* {userhistory.length > 0 && (
                <div className="p-6 mb-8 rounded-lg border bg-card ">
                  <div className="flex gap-3 flex-wrap">
                    <input
                      value={searchinput}
                      placeholder="Search pitches..."
                      className="flex-1 h-11 px-3 rounded-md border"
                      onChange={(e) => setSearchinput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSearch()
                      }
                    />

                    <button
                      onClick={show ? handleSearch : handleBack}
                      className="px-4 h-11 rounded-md border flex items-center gap-2"
                    >
                      {show ? (
                        <>
                          <Search size={16} /> Search
                        </>
                      ) : (
                        <>
                          <ArrowRightSquare size={16} /> Back
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )} */}


              <div className="grid md:grid-cols-2 gap-6">
                {(show ? firstfive : searchhistory).map((pitch, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card hover:shadow-lg "
                  >
                    <div className="p-6 ">
                      <h3 className="text-lg text-justify">
                        {pitch}
                      </h3>

                      {/* <p className="text-sm text-muted-foreground flex gap-2">
                        <Calendar size={14} />
                        {new Date(pitch).toLocaleDateString()}
                      </p>

                      <p className="mt-3 text-sm text-justify">
                        {pitch.Generated_Pitch}
                      </p> */}

                      <button
                        onClick={() =>
                          handleExport(
                            pitch
                          )
                        }
                        className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-primary text-white py-2"
                      >
                        <Download size={16} />
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>


              {!show && searchhistory.length === 0 && (
                <div className="text-center mt-10 text-muted-foreground">
                  No search results found
                </div>
              )}

              {userhistory.length === 0 && (
                <div className="text-center mt-10 text-muted-foreground">
                  No pitches found
                </div>
              )}


              {show && userhistory.length > 0 && (
                <div className="mt-8 flex justify-center">
                  {firstfive.length < userhistory.length ? (
                    <button
                      onClick={Loadmore}
                      className="px-6 py-3 border rounded-md flex items-center gap-2"
                    >
                      <ArrowDown />
                      Show More
                    </button>
                  ) : (
                    <div className="text-muted-foreground">
                      No more results
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (

            <div className="grid md:grid-cols-2 gap-6">
              {image.map((img, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <img src={img.images} alt="" />

                  <button
                    className="mt-3 w-full bg-primary text-white py-2 rounded-md flex justify-center gap-2"
                    onClick={async () => {
                      try {
                        const res = await fetch(img.images);
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "image.png";
                        a.click();
                        URL.revokeObjectURL(url);
                      } catch(error) {
                        toast.error(`${error} Download Failed`);
                      }
                    }}
                  >
                    <Download />
                    Download
                  </button>
                </div>
              ))}

              {image.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                  No images found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generated;
