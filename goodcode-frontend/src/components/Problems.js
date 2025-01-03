import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./styles/problems.css";

const Problems = ({ username }) => {
  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("problems-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("problems-page");
    };
  }, []);

  const navigate = useNavigate();

  const problems = {
    1: {
      id: 1,
      title: "Suma a două numere",
      difficulty: "Ușor",
    },
    2: {
      id: 2,
      title: "Adună două numere",
      difficulty: "Mediu",
    },
    3: {
      id: 3,
      title: "Cel mai lung subșir fără caractere repetate",
      difficulty: "Mediu",
    },
    4: {
      id: 4,
      title: "Mediana a două array-uri sortate",
      difficulty: "Grea",
    },
    5: {
      id: 5,
      title: "Cel mai lung subsir palindromic",
      difficulty: "Mediu",
    },
    6: {
      id: 6,
      title: "Conversie în zigzag",
      difficulty: "Mediu",
    },
    7: {
      id: 7,
      title: "Inversarea unui număr întreg",
      difficulty: "Mediu",
    },
    8: {
      id: 8,
      title: "Conversie de șir de caractere la număr întreg (atoi)",
      difficulty: "Mediu",
    },
    9: {
      id: 9,
      title: "Număr palindrom",
      difficulty: "Ușor",
    },
    10: {
      id: 10,
      title: "Potrivire cu expresie regulată",
      difficulty: "Grea",
    },
  };

  const handleClick = (id) => {
    navigate(`/problem/${id}`); // Navighează către pagina problemei
  };

  return (
    <div className="problems--container">
      <h1>Problems Page</h1>
      <p>Bine ai venit, {username}!</p>
      <p>
        Aceasta este lista de probleme pe care noi ti-o propunem,<br></br>{" "}
        speram ca te vei distra invatand cum sa le rezolvi! 😊
      </p>
      {Object.values(problems).map((problem) => (
        <div
          key={problem.id}
          onClick={() => handleClick(problem.id)}
          className="problem-card"
        >
          <h2 style={{ color: "#007BFF", margin: 0 }}>{problem.title}</h2>
          <p style={{ margin: "5px 0", color: "#555" }}>
            Dificultate:{" "}
            <span
              className={`difficulty-${problem.difficulty.toLocaleLowerCase()}`}
            >
              {problem.difficulty}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Problems;
