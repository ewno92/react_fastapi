import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/Toaster";
import Navbar from "../components/Navbar";
import { PostsProvider } from "../context/PostsContext";
import { ScrollRestoration } from "react-router-dom";

const RootLayout = () => {
  return (
    <PostsProvider>
      <div className="bg text-slate-900 light min-h-screen pt-12 antialiased bg-zinc-100">
        <header>
          <Navbar />
        </header>
        <div className="container max-w-7xl mx-auto pt-12">
          <Outlet />
          <Toaster />
        </div>
      </div>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </PostsProvider>
  );
};

export default RootLayout;
