import React from "react";

const boardOfDirectors = [
  {
    name: "Jason Van Camp",
    role: "Founder & Executive Director",
    image: "/images/jason.jpg",
  },
  {
    name: "John Doe",
    role: "Board Member",
    image: "/images/john.jpg",
  },
];

const advisoryBoard = [
  {
    name: "Emily Taylor",
    role: "Advisor - Strategy",
    image: "/images/emily.jpg",
  },
];

const veteranAdvisoryBoard = [
  {
    name: "Sgt. Michael Reed",
    role: "Veteran Advisor",
    image: "/images/michael.jpg",
  },
];

const executiveStaff = [
  {
    name: "Sarah Kim",
    role: "Chief Operating Officer",
    image: "/images/sarah.jpg",
  },
];

const BoardSection = ({ title, members }) => (
  <section className="py-12 px-6 md:px-20">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h2>
    <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {members.map((member, idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition duration-300 p-6 text-center"
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-gray-200"
          />
          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      ))}
    </div>
  </section>
);

const BoardPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/board-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-white text-center">Board of Directors</h1>
      </section>

      {/* Board Sections */}
      <BoardSection title="Board of Directors" members={boardOfDirectors} />
      <BoardSection title="Advisory Board" members={advisoryBoard} />
      <BoardSection title="Veteran Advisory Board" members={veteranAdvisoryBoard} />
      <BoardSection title="Executive Staff" members={executiveStaff} />
    </div>
  );
};

export default BoardPage;
