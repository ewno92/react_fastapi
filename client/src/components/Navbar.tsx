import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-gray-100/[0.97] border-b border-zinc-300 z-[10] py-4 shadow-md">
      <nav className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <NavLink to="/">
          <p className="text-black font-extrabold text">AuxHelath</p>
        </NavLink>
        <ul>
          <li className="list-none">
            <NavLink to="/posts">Posts</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
