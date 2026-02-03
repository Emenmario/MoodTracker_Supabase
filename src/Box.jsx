import React from 'react'

const Box = ({mood,handleDelete}) => {
        const [on,setOn]=React.useState(false)

    function handleDetails(mood){
        setOn(!on)
       
 }
   
  function getMoodColor(mood) {
     switch(mood) {
         case "Happy":
             return "#ffd900dd"; 
         case "Sad":
             return "#1e8fffdb"; 
         case "Anxious":
             return "#800080"; 
         case "Angry":
             return "#ff4400ff"; 
         case "Calm":
             return "#4DD0E1"; 
         default:
             return "#B0B0B0"; 
     }
 }
  return (
    <div>
        <div
                className="box "
                 style={{
                    backgroundColor:getMoodColor(mood.mood),
                    color:"white"
                }} >
                    <button onClick={()=>handleDelete(mood.mood)} className='x'>X</button>
                    <h1>{mood.mood}</h1>
                    <div className='bruh' style={{display:"flex",flexDirection:"column"}}>
                        <button style={{}} onClick={()=>handleDetails(mood)}>{on?"hide details":"Details"}</button>
                        <div>{on&&mood.note}</div>
                    </div>


                    
                    <p>{mood.date}</p>
                    <span>on</span>
                    <span>{mood.time}</span>
                </div>
    </div>
  )
}

export default Box
