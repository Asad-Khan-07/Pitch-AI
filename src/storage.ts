import jsPDF from "jspdf";
import supabase from "@/supabasecreate"
// const fileName = `image_${Date.now()}.png`;

export const uploadToStorage = async (blob:Blob) => {
  try {
    const fileName = `image_${Date.now()}.png`;

    const { data, error } = await supabase.storage
      .from("images") 
      .upload(fileName, blob, {
        contentType: "image/png",
      });

    if (error) {
      console.log("Upload error:", error);
    //   return null;
    }
        console.log("Image Uplode successfuly");
        return fileName        
    

    // console.log(data);
    
    // Public URL

    

    // return urlData.publicUrl;
  } catch (err) {
    console.log(err);
    // return null;
  }
};









export const uploadTotable = async (fileName) => {
  try {


    
    // Public URL
      const user=await supabase.auth.getUser()
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    // console.log(urlData);



    const { error } = await supabase
    .from("Images")
    .insert([{ images: urlData.publicUrl, User:user.data.user.email}]);

      if (error) {
      console.log("insert error:", error);
    //   return null;
    }else{
        console.log("Image insert successfuly");
        
    }


    

    // return urlData.publicUrl;
  } catch (err) {
    console.log(err);
    // return null;
  }
};



export const handleExport = (Generated_Pitch) => {
  const doc = new jsPDF();

const plainText = Generated_Pitch
    .map((el) => {
      
      return el.props.children;
    })
    .join("\n\n");


  doc.setFontSize(12);
  doc.text(plainText, 10, 35, { maxWidth: 180 });

  doc.save(`pitch.pdf`);
};



