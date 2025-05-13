import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, feedback }),
      });
      if (!res.ok) {
        // Optionally show an error message
        alert("Failed to submit feedback.");
        return;
      }
      // Optionally show a success message
      setEmail("");
      setSubject("");
      setFeedback("");
      onClose();
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md z-10 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <Dialog.Title className="text-lg font-semibold mb-2">Send Feedback</Dialog.Title>
        <p className="text-sm text-gray-500 mb-4">
          Share your thoughts, suggestions, or report issues to help us improve the community platform.
        </p>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Email ID</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Subject</label>
          <input
            className="w-full border-2 border-orange-400 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="What's this about?"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Your Feedback</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Please share your feedback in detail..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            required
            rows={4}
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </Dialog>
  );
} 