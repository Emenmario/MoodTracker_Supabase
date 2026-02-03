import React from 'react'
import {Link} from "react-router-dom"
import "./List.css"
import Box from "./Box"
const List = () => {

  function handleFilter(e){
      const filtered=e.target.value==="All"?original:original.filter(mood=>mood.mood===e.target.value)
       setList(filtered)
  }
  const savedList= JSON.parse(localStorage.getItem('List'))

    const [list,setList]=React.useState(savedList)
    const [original,setOriginal]=React.useState(savedList)

    function handleDelete(mood){
        const filtered=list.filter(m=>m.mood!==mood)
        setList(filtered)
        localStorage.setItem("List",JSON.stringify(filtered))

    }
  
 
    const rendered=list.map(mood=>{

        return( 
            <Box mood={mood} handleDelete={handleDelete}/>
         
            )
    })
  return (
    <div className='list'>
       <div className='filter'>
      <p>filter by Mood</p>
        <label><input onClick={handleFilter} name='mood' value="All" type='radio'/>All</label>

        <label><input onClick={handleFilter} name='mood' value="Sad" type='radio'/>Sad</label>
        <label><input onClick={handleFilter} name='mood' value="Happy" type='radio'/>Happy</label>
        <label><input onClick={handleFilter} name='mood' value="Anxious" type='radio'/>Anxious</label>
        <label><input onClick={handleFilter} name='mood' value="Calm" type='radio'/>Calm</label>
        <label><input onClick={handleFilter} name='mood' value="Angry" type='radio'/>Angry</label>

    </div>
           <div style={{padding:"20px"}}className='third'>
        {rendered} 
           </div>
          
    <div className='stat'>
      <Link className="b" to="/Statistics">View statistics 📊</Link>
    </div>

    </div>
  )
}

export default List
