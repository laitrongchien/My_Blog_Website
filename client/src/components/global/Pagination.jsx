import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Pagination = ({ total, callback }) => {
  const [page, setPage] = useState(1);
  const num = new URLSearchParams(window.location.search).get("page") || 1;

  const newArr = [...Array(total)].map((_, i) => i + 1);
  //   console.log(newArr);
  const navigate = useNavigate();

  const isActive = (index) => {
    if (index === page) return "active";
    return "";
  };

  const handlePagination = (num) => {
    navigate(`?page=${num}`);
    callback(num);
  };

  useEffect(() => {
    setPage(Number(num));
  }, [num]);

  return (
    <nav aria-label="Page navigation example" style={{ cursor: "pointer" }}>
      <ul className="pagination" style={{ justifyContent: "center" }}>
        {page > 1 && (
          <li className="page-item" onClick={() => handlePagination(page - 1)}>
            <span className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </span>
          </li>
        )}

        {newArr.map((num) => (
          <li
            key={num}
            className={`page-item ${isActive(num)}`}
            onClick={() => handlePagination(num)}
          >
            <span className="page-link">{num}</span>
          </li>
        ))}

        {page < total && (
          <li className="page-item" onClick={() => handlePagination(page + 1)}>
            <span className="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
