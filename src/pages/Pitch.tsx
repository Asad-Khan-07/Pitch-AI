import jsPDF from 'jspdf';
import { Calendar, Download } from 'lucide-react'
import React, { useState } from 'react'

const Pitch = () => {
const [firstfive,setFirstfive]=useState([])
const [searchhistory,setSearchhistory]=useState(undefined)

const handleExport = (User_Startup,Generated_Pitch) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(User_Startup, 10, 20);

  doc.setFontSize(12);
  doc.text(Generated_Pitch, 10, 35, { maxWidth: 180 });

  doc.save(`${User_Startup}.pdf`);
};



    return (




<>
                <div className="grid md:grid-cols-2 gap-6">
            {firstfive.map((pitch,i) => (
              <div key={i}  className="overflow-auto rounded-lg border border-border bg-card hover:shadow-lg transition-shadow group">

                <div className="p-6" >
                  <div className="flex items-start justify-between mb-3">
                    <div className="overflow-auto">
                      <h3 className="text-lg font-semibold mb-1">{pitch.User_Startup}</h3>
                      <p className="text-sm text-muted-foreground text-justify flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(pitch.date).toLocaleDateString()}
                        {pitch.Generated_Pitch}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium `}
                    >
                      {pitch.status}
                      
                    </span>
                  
                    <button onClick={() => handleExport(pitch.User_Startup,pitch.Generated_Pitch)} className="flex-1 h-9 px-3 py-2 rounded-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          :<div className="grid md:grid-cols-2 gap-6 ">
            
            {searchhistory.map((pitch,i) => (
              <div  className="overflow-auto rounded-lg border border-border bg-card hover:shadow-lg transition-shadow group">

                <div className="p-6" key={i}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="overflow-auto">
                      <h3 className="text-lg font-semibold mb-1">{pitch.User_Startup}</h3>
                      <p className="text-sm text-muted-foreground text-justify flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(pitch.date).toLocaleDateString()}
                        {pitch.Generated_Pitch}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium `}
                    >
                      {pitch.status}
                      
                    </span>
                  
                    <button onClick={() => handleExport(pitch.User_Startup,pitch.Generated_Pitch)} className="flex-1 h-9 px-3 py-2 rounded-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

    </>
  )
}

export default Pitch
