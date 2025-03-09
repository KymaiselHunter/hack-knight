import Thumb from "./Thumb.jsx"

function ProgressBar(props)
{
  //category={data[1].category} 
  //spent={spentNonEssential} 
  //totalAmount={nonEssentialBudget}
  //color={data[1].color}
  //remaining={remainingNonEssential}  


  // Calculate progress bar width for spent and remaining
  const getProgressWidth = (spent, budget) => {
    return (spent / budget) * 100; // Calculate percentage of spent amount
  };

  return (
    <div key={props.category} style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "16px", marginBottom: "5px" }}>
        {props.category}
      </div>

      {/* Progress bar for spent amount */}
      <div
        style={{
          width: "90%",
          backgroundColor: "#cbffde",
          borderRadius: "10px",
          height: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${getProgressWidth(parseFloat(props.spent), parseFloat(props.totalAmount))}%`,
            backgroundColor: props.color,
            height: "100%",
            borderRadius: "10px 0 0 10px",
            transition: "width 0.5s ease-in-out",
          }}
        />
      </div>

      {/* Spent and Remaining on the same line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginTop: "5px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#f99bab" }}>
            Spent: ${parseFloat(props.spent).toLocaleString()}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#42c982" }}>
            Remaining: ${parseFloat(props.remaining).toLocaleString()}
          </span>
        </div>

        {/* Align thumbs icon */}
        <div style={{ marginLeft: "10px", alignSelf: "center" }}>
          <Thumb spent={props.spent} budget={props.totalAmount}/>
        </div>
      </div>
    </div>
  );

}export default ProgressBar