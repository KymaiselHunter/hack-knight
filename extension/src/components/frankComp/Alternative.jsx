import "./Alternative.css";
import PropTypes  from 'prop-types';
function Alternative(financeAdvice)
{
    return(
        <div className ="Alternative-Container" >
            <h className = "Alternative-Header">AI-Advisor</h>
            <div className="subAlternative-Container">
                <div className= "textBox">
                    <p className = "textBox-Content">{financeAdvice.text}</p>
                </div>
            </div>
        </div>
    );
}

Alternative.PropTypes =
{
    text: PropTypes.string
}
Alternative.defaultProps = 
{
    text: "Manage your money wisely!" // ✅ Default value if not provided
}

export default Alternative
