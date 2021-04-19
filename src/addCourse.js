import React, { useState, useEffect } from "react";
import facade from "./apiFacade";



export default function AddCoursePage(){


    const init = {courseName: "", description:""}
    const [courseInfo, setCourseInfo] = useState(init)
    const [isAdded, setIsAdded] = useState()

    const newCourse = (evt) => {
        evt.preventDefault();
        facade.addCourse(courseInfo).then((res) => {
        console.log(courseInfo.info)
        setIsAdded(res)
       })

      };

    const onChange = (evt) => {
        setCourseInfo({
          ...courseInfo,
          [evt.target.id]: evt.target.value,
        });
      };

      useEffect(() =>{
        setIsAdded(false)
      },[])

    return(
        <div>
         <h1>Add new Course</h1>

         <form onChange={onChange}>
        <input placeholder="Course-Name:" id="courseName" />
        <input placeholder="Description:" id="description" />
        <button onClick={newCourse}>Create Course</button>
      </form>
      {isAdded && (<h2>New Course was created!</h2>)}
        </div>
    ) 
 }