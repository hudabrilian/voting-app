import { HiChevronLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const Header = ({ title, children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-2 items-center">
        <button onClick={() => navigate(-1)}>
          <HiChevronLeft size={25} />
        </button>
        <h1 className="font-bold text-xl">{title}</h1>
      </div>
      {children}
    </div>
  );
};
