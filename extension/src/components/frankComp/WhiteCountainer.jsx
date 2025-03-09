import Alternative from "./Alternative";
import Criteria from "./Criteria";
import UserCard from "./UserCard";
import BudgetChart  from "../../../../src/BudgetChart";

function WhiteContainer()
{
    
    //UserCard 
    const nameVal = "Kyle"
    const budgetVal = 200.0//pass to Criteria Component as well 

    //Post-purchase  Component
    const allocatedIncomeVal = 400.0
    const canAffordEssentialsVal = true
    const canAffordNonEssentials = true 


    //Alternative Component - AI consultatin
    const textVal = ": (IN VOICE-OVER) There are things you can't fight, acts of God. You see a hurricane coming... you have to get out of the way. But when you're in a Jaeger, suddenly... you can fight the hurricane. You can win. (MEN SHOUTING INDISTINCTLY) MERRIT: Get them tied down... and go down below! Now! How far to the mainland? Seven miles off Anchorage, sir. But we won't even make"
    
    
    

    

    const parentWrapper = 
    {
        display:"flex",
        justifyContent: "space-between",
        alignItems: "stretch"

    }
    return(
        <>
        
        <div className = "WhiteContainer">
            <UserCard name = {nameVal} budget = {budgetVal} />

            <div style = {parentWrapper}>  
              
                <Alternative text = {textVal}/>
            </div>
            <Criteria allocatedIncome = {allocatedIncomeVal} 
                          budget = {budgetVal}
                          canAffordEssentials = {canAffordEssentialsVal} 
                          canAffordNonEssentials = {canAffordNonEssentials}/>
           
            
            
        </div>
        </>
        
    );
    
}
export default WhiteContainer
