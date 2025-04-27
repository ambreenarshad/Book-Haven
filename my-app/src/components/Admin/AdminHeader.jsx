import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import "../../main.css";

const AdminHeader = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="header">
      <h1 className="header-title">Admin Panel</h1>
      <div className="header-buttons">
        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme}>
          {isDarkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
        </button>

        {/* User Account Button */}
        <button>
          <AiOutlineUser />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
