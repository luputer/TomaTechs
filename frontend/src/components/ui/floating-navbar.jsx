import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from "motion/react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const FloatingNav = ({
  navItems,
  className
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleBlogClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const blogSection = document.getElementById('blog');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      sessionStorage.setItem('scrollToBlog', '1');
      navigate('/');
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling to about
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent rounded-full bg-green-600 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}>
        {navItems.map((navItem, idx) => (
          navItem.name === "Blog" ? (
            <button
              key={`link=${idx}`}
              onClick={handleBlogClick}
              className={cn(
                "relative items-center flex space-x-1 text-white hover:text-gray-200 transition-transform duration-200 hover:scale-110 bg-transparent border-none outline-none cursor-pointer"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">Blog</span>
            </button>
          ) : navItem.name === "Tentang" ? (
            <button
              key={`link=${idx}`}
              onClick={handleAboutClick}
              className={cn(
                "relative items-center flex space-x-1 text-white hover:text-gray-200 transition-transform duration-200 hover:scale-110 bg-transparent border-none outline-none cursor-pointer"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">Tentang</span>
            </button>
          ) : (
            <Link
              key={`link=${idx}`}
              to={navItem.link}
              className={cn(
                "relative items-center flex space-x-1 text-white hover:text-gray-200 transition-transform duration-200 hover:scale-110"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          )
        ))}
        <button
          onClick={handleAuth}
          className="border text-sm font-medium relative border-white text-white hover:bg-green-700 px-4 py-2 rounded-full transition-colors">
          <span>masuk</span>
          <span
            className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
