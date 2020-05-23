import * as React from "react";

export default (props) => { 
  let {time, style, className} = props;
  let p = (t) => String(t).padStart(2, "0");
  
  let t = new Date(time);
  
  let timeString = "";
  
  if(t.getUTCHours() > 0)
    timeString += p(t.getUTCHours()) + ":";
  
  timeString += p(t.getUTCMinutes()) + ":"
    
  timeString += p(t.getUTCSeconds()) + "." 
  timeString += Math.round(t.getUTCMilliseconds()/ 100).toString().substr(0, 1);
  return <div id='timeDisplay' style={style} className={className}>{timeString}</div>;
}