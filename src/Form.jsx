import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {Link} from "react-router-dom"
import "./Form.css"
import {Appcontext} from "./App"
const Form = () => {
  const {on,setOn}=useContext(Appcontext)
  const navigate = useNavigate();
  const [mood, setMood] = React.useState("");
  const [note, setNote] = React.useState("");
  const [Message,setMessage]=React.useState("")
  const [list, setList] = React.useState(() => {
    const saved = localStorage.getItem("List");
    return saved ? JSON.parse(saved) : [];
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (mood === "") {
      alert('Input can’t be empty');
      return;
    }

    const now = new Date();
    const updated = [
      ...list,
      {
        mood: mood,
        note: note,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      },
    ];
 
    setList(updated); 
    setMood("")
    setNote("")
   alert("your mood has been saved succesfully")
    
  }

  React.useEffect(() => {
    localStorage.setItem("List", JSON.stringify(list));
  }, [list]);

  return (
    <div className='homepage'>

      <form  onSubmit={handleSubmit}>
        <div style={{backgroundColor:on&&"#e1e1e11c"}} className='form'>
       
  <p style={{display:"block"}}>How are you feeling rn?</p>

  <div style={{display:"flex",gap:"10px"}}>
      <input 
       onClick={(e)=>setMood(e.target.value)} type="radio" id="Happy"  name="feels" value="Happy" />
      <label style={{color:on?"black":"white"}} htmlFor="Happy">Happy</label>
      <input 
       onClick={(e)=>setMood(e.target.value)} type="radio" id="Sad" name="feels" value="Sad" />
      <label  style={{color:on?"black":"white"}} htmlFor="Sad">Sad</label>
      <input 
        onClick={(e)=>setMood(e.target.value)}type="radio" id="Anxious" name="feels" value="Anxious" />
      <label  style={{color:on?"black":"white"}} htmlFor="Anxious">Anxious</label>
      <input 
       onClick={(e)=>setMood(e.target.value)} type="radio" id="Calm" name="feels" value="Calm" />
      <label  style={{color:on?"black":"white"}} htmlFor="Calm">Calm</label>
      <input 
       onClick={(e)=>setMood(e.target.value)} type="radio" id="Angry" name="feels" value="Angry" />
      <label  style={{color:on?"black":"white"}} htmlFor="Angry">Angry</label>
  </div>

          <div className='second'>
            <label style={{color:on?"black":"white"}} className='add' htmlFor='note'>Add a note (optional)</label>
            <textarea
            style={{boxShadow:"0 4px 15px rgba(0, 0, 0, 0.333)",color:on&&"black"}}
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button style={{marginRight:"10px"}} className='button'>Done</button>
          <Link to="/list" className='b'>mood history-></Link>
        </div>
      </form>.

    </div>
  );
};

export default Form;
