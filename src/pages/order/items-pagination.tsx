

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   if (totalPages <= 1) return null; // hide if only 1 page

//   return (
//     <div className="flex justify-center gap-4 mt-6">
//       {/* Previous Button */}
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
//           currentPage === 1
//             ? "bg-gray-300 cursor-not-allowed text-gray-600"
//             : "bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:scale-105"
//         }`}
//       >
//         Previous
//       </button>

//       {/* Next Button */}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
//           currentPage === totalPages
//             ? "bg-gray-300 cursor-not-allowed text-gray-600"
//             : "bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:scale-105"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;
