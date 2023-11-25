import useUser from "./useUser";
import Recents from "./Recents";
const DashboardCom = () => {
  return (
    <div style={styles.mainContainer}>
      <h4 style={{ paddingLeft: "1rem" }}>This is the dashboard.</h4>
      <Recents></Recents>
    </div>
  );
};

const styles = {
  mainContainer: {
    width: "70%",
  }
}

export default DashboardCom;
