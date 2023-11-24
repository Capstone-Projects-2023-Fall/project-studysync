import useUser from "./useUser";
import WelcomePage from "./WelcomePage";
const  DashboardCom = ()=> {

  const {user} = useUser();
  if(!user){
    <WelcomePage />
  }else{
    return(<> Logged in</>)
  }
}
  
  export default DashboardCom;
  