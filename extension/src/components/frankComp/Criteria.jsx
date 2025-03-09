import "./Criteria.css";
import {FaCheckSquare } from "react-icons/fa";
import PropTypes  from 'prop-types';

function  Criteria(User){
   
    return(

        
        
        <div className = "Criteria-Container" >
            <h className = "Criteria-Header">Post-Purchase Result</h>

               

                <div className = "subCriteria-Container">
                    <div className = "subCriteria-Content">
                        
                    </div>
                </div>

                <div className = "subCriteria-Container">
                    <div className = "subCriteria-Content">
                        
                    </div>
                </div>
            
        </div>
    );

}
Criteria.PropTypes = 
{
    allocatedIncome: PropTypes.number,
    budget: PropTypes.number,
    canAffordEssentials:PropTypes.bool,
    canAffordNonEssentials: PropTypes.bool
}
Criteria.defaultProps = 
{
    allocatedIncome: 0,
    budget: 0,
    canAffordEssentials: false,
    canAffordNonEssentials: false


}



export default Criteria