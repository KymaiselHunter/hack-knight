function DataRow(props)
{
  //title
  //money
  return(
    <>
      <div style={{ display: "flex", justifyContent: "space-between",fontSize: "16px" }}>
          <span>{props.title}</span>
          <span style={{ color: "#42c982" }}>
            ${parseFloat(props.money).toLocaleString()}
          </span>
        </div>
    </>

  )
} export default DataRow