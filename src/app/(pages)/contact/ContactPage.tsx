"use client";
import {useState,useEffect} from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Instagram, Twitter, Globe ,Brush,SquareUserRound} from "lucide-react";
import ParallaxWrapper from "@/components/parallax/ParallaxContact";
import { useAppSelector } from "@/store/hooks";
import UserNav from "@/components/layout/UserNav"
import Footer from "@/components/layout/Footer"
import Loader from '@/components/ui/loader'
import Lenis from "@studio-freight/lenis";
import emailjs from "emailjs-com";
export default function ContactPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
      smoothTouch: false,
    } as unknown as ConstructorParameters<typeof Lenis>[0]);
    
  
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
  
    requestAnimationFrame(raf);
  
    return () => {
      lenis.destroy();
    };
  }, []);



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2000) 
  
      return () => clearTimeout(timer)
    }, [])

  const onSubmit = async (data: any) => {
    try {
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
              name: data.name,
              email: data.email,
              subject: data.subject,
              message: data.message,
              reply_to: data.email,
              time: new Date().toLocaleString(),
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          );
      alert("Message sent successfully!");
      reset();
    } catch (error) {
      alert("Failed to send message. Please try again.");
      console.error("EmailJS Error:", error);
    }
  };

  return (
    <>
    {/* {loading && <Loader />} */}
    <UserNav/>
    <ParallaxWrapper>
      <section
        className={`min-h-screen w-full py-20 px-4 md:px-12 lg:px-24 flex flex-col justify-center items-center space-y-16 transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white"
            : "bg-gradient-to-br from-white via-cyan-100 to-sky-200 text-black"
        }`}
      >
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl pt-10 sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"
          >
            Let’s Connect with Bharat Vibes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-xl"
          >
            We're here to hear from you — help us grow this cultural revolution.
          </motion.p>
        </div>

        <div className="w-fit mx-5 sm:mx-20 grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <motion.form
  onSubmit={handleSubmit(onSubmit)}
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className={`w-full max-w-md mx-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg ${
    isDarkMode
      ? "bg-black/50 backdrop-blur-md text-white border border-amber-600"
      : "bg-white/80 backdrop-blur-md text-black border"
  }`}
>
  <input
    {...register("name", { required: true })}
    placeholder="Name"
    className={`w-full px-4 py-3 text-sm rounded-2xl border transition-colors duration-300 ${
      isDarkMode
        ? "bg-black/30 text-white placeholder-white/70 border-white/20"
        : "bg-white text-black placeholder-black/60 border-black/40"
    }`}
  />
  {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

  <input
    {...register("email", { required: true })}
    placeholder="Email"
    className={`w-full px-4 py-3 text-sm rounded-2xl border transition-colors duration-300 ${
      isDarkMode
        ? "bg-black/30 text-white placeholder-white/70 border-white/20"
        : "bg-white text-black placeholder-black/60 border-black/40"
    }`}
  />
  {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

  <input
    {...register("subject", { required: true })}
    placeholder="Subject"
    className={`w-full px-4 py-3 text-sm rounded-2xl border transition-colors duration-300 ${
      isDarkMode
        ? "bg-black/30 text-white placeholder-white/70 border-white/20"
        : "bg-white text-black placeholder-black/60 border-black/40"
    }`}
  />
  {errors.subject && <p className="text-red-500 text-sm">Subject is required</p>}

  <textarea
    {...register("message", { required: true })}
    placeholder="Message"
    rows={4}
    className={`w-full px-4 py-3 text-sm rounded-2xl border transition-colors duration-300 resize-none ${
      isDarkMode
        ? "bg-black/30 text-white placeholder-white/70 border-white/20"
        : "bg-white text-black placeholder-black/60 border-black/40"
    }`}
  ></textarea>
  {errors.message && <p className="text-red-500 text-sm">Message is required</p>}

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type="submit"
    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-xl shadow-md"
  >
    Send Message
  </motion.button>
</motion.form>

          {/* Contact Info */}
          <div className="flex-col justify-center items-center ">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`rounded-2xl mb-4 p-6 border shadow-lg space-y-4 flex flex-col items-start justify-start ${
              isDarkMode ? "bg-black/50 border-rose-400" : "bg-white/80"
            }`}
          >
            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="mailto:bharatvibes.support@gmail.com"
            >
              <Mail className="text-pink-500" />
              bharatvibes.support@gmail.com
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="https://dynamicphillic.vercel.app"
              target="_blank"
            >
              <Globe className="text-blue-500" />
              dynamicphillic.vercel.app
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="https://instagram.com/bharatvibes.in"
              target="_blank"
            >
              <Instagram className="text-pink-600" />
              @bharatvibes.in
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="https://twitter.com/bharatvibes"
              target="_blank"
            >
              <Twitter className="text-blue-400" />
              @bharatvibes
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`rounded-2xl p-6 border shadow-lg space-y-4 flex flex-col items-start justify-start ${
              isDarkMode ? "bg-black/50 border-cyan-400" : "bg-white/80"
            }`}
          >
            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="mailto:bharatvibes.support@gmail.com"
            >
              <Brush className="text-cyan-500" />
              Created  by Team: DesiDynamiX
             
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-3 text-lg"
              href="mailto:bharatvibes.support@gmail.com"
            >
              <SquareUserRound className="text-green-500" />
              Member Name: Deepak Prasad
             
            </motion.a>
         

           
          </motion.div>
          </div>
        </div>

        <p className="text-center text-sm mt-12 max-w-xl mx-auto">
          Bharat Vibes is a cultural initiative to preserve, showcase, and share the magic of India.
        </p>
      </section>
    </ParallaxWrapper>
    <Footer/>
    </>
  );
}
