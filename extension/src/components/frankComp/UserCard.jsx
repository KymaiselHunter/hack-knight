import "./UserCard.css";
import PropTypes  from 'prop-types'
function UserCard(props)
{
    return(
    
        <div className = "UserCard-Container"> 
            <div className = "UserCard-WhiteBackGround">
                 <p className="userInfo userName">Hello {props.name}</p>
                 <p className="userInfo userBudget">${props.budget.toFixed(2)}</p> 
                 <p className="userInfo budgetIcon"> Budget</p>
            </div>

           
        </div> 
    );
}
UserCard.PropTypes = 
{
    name: PropTypes.string,
    budget: PropTypes.number,
    
}
UserCard.defaultProps = {
    name: "None",
    budget: 0.01,
  
    
}

export default UserCard