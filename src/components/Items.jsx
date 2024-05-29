import PropType from "prop-types";
import "../App.css"

function Items({ total, postPerPage, setCurrentPage, currentPage }) {
  let pages = [];

  for (let i = 1; i <= Math.ceil(total / postPerPage); i++) {
    pages.push(i);
  }

  return (
    <>
      <div className="flex justify-center gap-x-4 mt-4">
        {pages.map((page, index) => {
          return (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={page == currentPage ? "w-5 h-5 p-4 border-2 flex items-center justify-center act" :"w-5 h-5 p-4 border-2 flex items-center justify-center"}
            >
              {page}
            </button>
          );
        })}
      </div>
    </>
  );
}

Items.propTypes = {
  total: PropType.number,
  postPerPage: PropType.number,
  setCurrentPage: PropType.number,
  currentPage: PropType.number,
};
export default Items;
