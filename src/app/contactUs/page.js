"use client";

import ReviewsSection from "@/components/ReviewsSection";
import { useState, useEffect, useRef } from "react";
import { Ubuntu } from "next/font/google";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
  });
  const [contacts, setContacts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const messageTimeoutRef = useRef(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/contactUs`);
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    try {
      const response = await fetch(`/api/contactUs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Always parse JSON

      if (response.ok && data.success) {
        setMessage(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", query: "" });
        fetchContacts(); // Optionally refresh the queries list
      } else {
        setMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending message. Please check your connection.");
      console.error("Error:", error);
    }

    setIsSubmitting(false);
    messageTimeoutRef.current = setTimeout(() => setMessage(""), 4000);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`${ubuntu.className} min-h-screen bg-[#140b29] font-sans text-white p-5 select-none`}>
      {/* Contact Form Section */}
      <div className="max-w-lg mx-auto p-10 rounded-3xl shadow-2xl border-2 backdrop-blur-2xl border-white/15">
        <h1 className="text-3xl text-center mb-8 font-normal text-white">
          Contact Us
        </h1>
        {message && (
          <div
            className={`mb-6 p-3 rounded text-center ${
              message.includes("success") ? "text-green-300" : "text-red-300"
            }`}
          >
            {message}
          </div>
        )}
        <div className="space-y-5">
          {/* Name */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-200 text-sm font-medium mb-2 uppercase tracking-wide"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full py-4 px-5 bg-white/8 border-2 border-white/20 rounded-xl text-white text-base outline-none focus:border-blue-400 focus:bg-white/12 placeholder:text-white/50"
            />
          </div>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-200 text-sm font-medium mb-2 uppercase tracking-wide"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="w-full py-4 px-5 bg-white/8 border-2 border-white/20 rounded-xl text-white text-base outline-none focus:border-blue-400 focus:bg-white/12 placeholder:text-white/50"
            />
          </div>
          {/* Query */}
          <div className="mb-6">
            <label
              htmlFor="query"
              className="block text-gray-200 text-sm font-medium mb-2 uppercase tracking-wide"
            >
              Query
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              placeholder="Please describe your query or message..."
              required
              rows="5"
              className="w-full py-4 px-5 bg-white/8 border-2 border-white/20 rounded-xl text-white text-base outline-none focus:border-blue-400 focus:bg-white/12 placeholder:text-white/50 resize-y"
              style={{ minHeight: "120px" }}
            />
          </div>
          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-[#231446] border-2 rounded-xl text-white text-base font-semibold uppercase tracking-wide mt-3 cursor-pointer transition-all duration-300 border-[#a594f9] hover:bg-[#9d8bfa] disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>

      <ReviewsSection />

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
        }
        input[type="text"],
        input[type="email"],
        textarea {
          background: #20194a !important;
          border-color: #3a2e6e !important;
          color: #b3a7e6 !important;
        }
        input[type="text"]::placeholder,
        input[type="email"]::placeholder,
        textarea::placeholder {
          color: #7c6bb3 !important;
          opacity: 1;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus {
          border-color: #7c6bb3 !important;
          background: #251e5a !important;
          color: #e0d6ff !important;
        }
      `}</style>
    </div>
  );
}
