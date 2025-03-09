function AmazonItem(props)
{
  const productMessage = 
  <>
    <h1>product detected</h1>
    <ul>
      {[props.productName, props.productDescription, props.productPrice].map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  
  </>

  const noProductMessage = <h1>no product detected</h1>
  return(props.isAmazonProductPage ? productMessage : noProductMessage )
}export default AmazonItem