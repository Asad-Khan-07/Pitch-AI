import {
  Search,
  FileText,
  Image,
  Calendar,
  Download,
  ArrowDown,
  ArrowRightSquare,
  Sparkles,
  Box,
  Inbox,
  Database,

} from "lucide-react";
import Navbar from "@/components/Navbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import supabase from "@/supabasecreate";

const History = () => {
  const [userhistory, setUserhistory] = useState([]);  
  const [image, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [pitch, setPitch] = useState([]);
  const [currenthistory, setCurrenthistory] = useState([]);
  const [colorlenght, setColorlenght] = useState(0);



useEffect(()=>{    
  const fetchImages = async () => {
    const user = await supabase.auth.getUser();
    
    const { data } = await supabase
    .from("Images")
    .select("*")
    .eq("User", user.data.user.email)
    .order("created_at", { ascending: false });
    console.log(data);
    
        setImages(data)

    };

    fetchImages();


    const fetchHistory = async () => {
      const user = await supabase.auth.getUser();

        const { data } = await supabase
        .from("Model")
        .select("*")
        .eq("User", user.data.user.email)
        .order("Time", { ascending: false });
        setUserhistory(data)
        // console.log(data);
        setPitch(data)
        setUser(user.data.user)

    };

    fetchHistory();



const fetchCurrent = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user.email;
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59
  ).toISOString();

  const { data, error } = await supabase
    .from("Model")
    .select("*")
    .eq("User", email)
    .gte("Time", startOfMonth)
    .lte("Time", endOfMonth)
    .order("Time", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setCurrenthistory(data);
 
};

fetchCurrent();



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
        console.log(data.length);
        
        setColorlenght(data.length);
      } else {
        console.log("Error fetching saved colors:", error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

fetchSavedColors()


},[])







  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 ">
        <div className="max-w-6xl mx-auto ">
          <div className="mb-8 flex items-center gap-5 md:flex-row flex-col">
            { user ? (
              <div className="bg-gradient-to-r from-primary to-secondary rounded-full w-28 h-28 ">
                {/* {user.email.splice(0,1) } */}
                {user.user_metadata.avatar_url ?
                <img src={user.user_metadata.avatar_url} alt="" className="w-28 h-28 rounded-full" />
              :""
              }
              </div>
             ) : ( 
              <Skeleton width={120} className="rounded-full" height={120} />
             )} 
            <div className="flex flex-col flex-wrap text-wrap">
              <p className="text-3xl text-center md:text-start font-bold text-foreground">
              
                {user ? " Welcom back" : <Skeleton width={200} />}
              </p>
              <h1 className="text-4xl text-center  font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {/* {user.user_metadata.full_name ? user.user_metadata.full_name : ""} */}
              </h1>
              <h1 className="text-lg  font-bold text-ellipsis mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {user ? user.email : <Skeleton width={300} />}
              </h1>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {user ? (
              <div className="p-6 rounded-lg border border-border bg-card transition-all ease-linear   shadow-lg hover:scale-110 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Pitches
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {userhistory.length}
                    </p>
                  </div>
                  <FileText className="w-10 h-10 text-primary/20" />
                </div>
              </div>
             ) : ( 
              <Skeleton width={290} height={100} />
            )}
             {user ? ( 
              <div className="p-6 rounded-lg border border-border bg-card transition-all ease-linear   shadow-lg hover:scale-110">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {currenthistory.length}
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-secondary/20" />
                </div>
              </div>
            ) : (
              <Skeleton width={290} height={100} />
            )}

             {user ? ( 
              <div className="p-6 rounded-lg border border-border bg-card transition-all ease-linear   shadow-lg hover:scale-110">
                <div className="flex items-center   justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Images Generated
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {image.length}
                    </p>
                  </div>
                  <Image className="w-10 h-10 text-accent-foreground/20" />
                </div>
              </div>
            ) : ( 
              <Skeleton width={290} height={100} />
             )}
             {user ? ( 
              <div className="p-6 rounded-lg border border-border bg-card transition-all ease-linear   shadow-lg hover:scale-110">
                <div className="flex items-center   justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Saved Platter
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {colorlenght}
                    </p>
                  </div>
                  <Image className="w-10 h-10 text-accent-foreground/20" />
                </div>
              </div>
            ) : ( 
              <Skeleton width={290} height={100} />
             )}
          </div>


     <div className="flex flex-col  justify-between  h-2/2  ">





                <div className="flex flex-row gap-10 justify-around items-center flex-wrap">

{user ?

<div className="w-96 ">
   

     <h1 className="text-3xl text-center md:text-start font-bold text-foreground">Last Pitch</h1>

                { pitch.length > 0 ? pitch.splice(0,1).map((pitch, i) => (
                  <div
                    key={i}
                    className="rounded-lg shadow-lg w-full bg-card"
                  >
                    <div className="p-8 ">
                      <h3 className="text-lg font-semibold">
                        {pitch.User_Startup}
                      </h3>

                      <p className="text-sm text-muted-foreground flex gap-2  items-center">
                        <Calendar size={14} />
                        {new Date(pitch.Time).toLocaleDateString()}
                      </p>

                 
                    </div>

                  </div>
)) : <div className=" p-4  bg-card rounded-lg shadow-lg">
                
                <div className="h-20 flex flex-col items-center justify-center">
                       <p className="text-center text-sm text-muted-foreground mb-1">
                      No Pitch Generated Yet
                    </p>
                      <FileText/>
                </div>
                
                </div>
              

}

</div>: <Skeleton width={290} height={100}/ >
}

{user ?

<div className=" w-96 ">

<h1 className="text-3xl text-center md:text-start font-bold text-foreground">Last Image</h1>




            <div className="rounded-lg  shadow-lg  bg-card">
             
              {
                image.length > 0 ?
                image.slice(0,1).map((img, i) => (
                  <div key={i} className=" p-4 ">
                  <img src={img.images} alt="" className="h-20"/>

                
                </div>
              )):<div className=" p-4 bg-card rounded-lg shadow-lg">
                
                <div className="h-20 flex flex-col items-center justify-center">
                       <p className="text-center text-sm text-muted-foreground mb-1">
                      No Image Generated Yet
                    </p>
                      <FileText/>
                </div>
                
                </div>
              
              
              }
              </div>





              </div>

:<Skeleton width={290} height={100}/ >
}
</div>




   <div className="mt-6 grid grid-cols-2 md:grid-cols-2  gap-4">
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
                <Sparkles className="w-5 h-5 text-accent-foreground mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Generation of Image</h3>
                  <p className="text-xs text-muted-foreground">
                    "Generate images in Seconds"
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
    </div>
  );
};

export default History;
