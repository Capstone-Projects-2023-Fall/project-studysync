import useUser from "./useUser";


const  DashboardCom = ()=> {

    const {user} = useUser();

    return (

      <div>
        This is the dashboard. 
      </div>
    );
  }
  
  export default DashboardCom;
  