import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Import Font Awesome icons

function Thumb(props)
{
  // // Determine if thumbs up or thumbs down should be shown
  if(props.spent > props.budget)
  {
    const iconStyle = {
      color: "green",
      fontSize: "20px",
      position: "relative",
      top: "-25px", // Adjust for alignment
    };
    return <FaThumbsUp style={iconStyle} />;
  }
  else
  {
    const iconStyle = {
      color: "red",
      fontSize: "20px",
      position: "relative",
      top: "-25px", // Adjust for alignment
    };
    return <FaThumbsDown style={iconStyle} />;
  }
}export default Thumb