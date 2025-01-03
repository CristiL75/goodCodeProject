import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import piston from "piston-client";
import "./styles/pb3.css";

const ProblemDetail3 = () => {
  useEffect(() => {
    // Adaugă o clasă pe body la montare
    document.body.classList.add("problem-page");

    // Elimină clasa la demontare
    return () => {
      document.body.classList.remove("problem-page");
    };
  }, []);

  const { id } = useParams();

  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [functionHeader, setFunctionHeader] = useState(
    "function findMedianSortedArrays(nums1, nums2) { }"
  );
  const [solutionCode, setSolutionCode] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const userId = localStorage.getItem("username");
  console.log("userId:", userId);
  console.log("id:", id);

  const getFunctionHeader = (language) => {
    switch (language) {
      case "python":
        return "def findMedianSortedArrays(nums1, nums2):";
      case "java":
        return "public double findMedianSortedArrays(int[] nums1, int[] nums2) { }";
      case "csharp":
        return "public double FindMedianSortedArrays(int[] nums1, int[] nums2) { }";
      default:
        return "function findMedianSortedArrays(nums1, nums2) { }";
    }
  };

  useEffect(() => {
    const header = getFunctionHeader(language);
    setFunctionHeader(header);
    setSolutionCode(header + "\n");
  }, [language]);

  if (id !== "4") {
    return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
  }

  const problemDetails = {
    title: "Mediana a două array-uri sortate",
    difficulty: "Grea",
    description: `
        ## Mediana a două array-uri sortate
    
        **Problema:**
        Dat două array-uri sortate \`nums1\` și \`nums2\` de dimensiuni \`m\` și \`n\` respectiv, returnați mediana celor două array-uri sortate.
    
        Complexitatea generală a timpului de rulare ar trebui să fie \`O(log (m+n))\`.
    
        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: nums1 = [1,3], nums2 = [2]
        Output: 2.00000
        Explicație: array-ul combinat = [1,2,3] și mediana este 2.
    
        Exemplul 2:
        Input: nums1 = [1,2], nums2 = [3,4]
        Output: 2.50000
        Explicație: array-ul combinat = [1,2,3,4] și mediana este (2 + 3) / 2 = 2.5.
        \`\`\`
    
        **Constrângeri:**
        \`\`\`
        nums1.length == m
        nums2.length == n
        0 <= m <= 1000
        0 <= n <= 1000
        1 <= m + n <= 2000
        -10^6 <= nums1[i], nums2[i] <= 10^6
        \`\`\`
        `,
  };

  const languageMap = {
    javascript: "javascript",
    python: "python",
    csharp: "csharp",
    java: "java",
  };
  const testCases = [
    {
      nums1: [1, 3],
      nums2: [2],
      expected: 2, // Corect
    },
    {
      nums1: [1, 2],
      nums2: [3, 4],
      expected: 2, // Corect
    },
    {
      nums1: [],
      nums2: [1],
      expected: 2, // Corect
    },
    {
      nums1: [2],
      nums2: [],
      expected: 2, // Corect
    },
  ];

  const getCompleteCode = (language, userCode) => {
    switch (language) {
      case "javascript":
        return `
    ${userCode}
    
    // Teste pentru cazurile de intrare
const testCases = [
    {
        nums1: [1, 3],
        nums2: [2],
        expected: 2 // Corect
    },
    {
        nums1: [1, 2],
        nums2: [3, 4],
        expected: 2.5 // Corect
    },
    {
        nums1: [0, 0],
        nums2: [0, 0],
        expected: 0 // Corect
    },
    {
        nums1: [],
        nums2: [1],
        expected: 1 // Corect
    },
    {
        nums1: [2],
        nums2: [],
        expected: 2 // Corect
    }
];


    // Testarea funcției cu fiecare caz
    testCases.forEach((testCase, index) => {
        const { nums1, nums2, expected } = testCase;

        // Verificăm dacă datele de intrare sunt corecte (fără a folosi trim())
        if (!Array.isArray(nums1) || !Array.isArray(nums2)) {
            console.error("Datele de intrare nu sunt array-uri valide.");
            return;
        }

        // Apelăm funcția pentru a obține rezultatul
        const result = findMedianSortedArrays(nums1, nums2);

        // Verificăm și formatăm corect rezultatul
        const formattedResult = parseFloat(result.toFixed(5)); // Formatează rezultatul cu 5 zecimale

        // Comparați rezultatul obținut cu cel așteptat
        const testPassed = formattedResult === expected;
        console.log(JSON.stringify(formattedResult));
        
      
    });
    `;

      case "python":
        return `
${userCode}
import json
# Teste pentru cazurile de intrare
testCases = [
    {
        "nums1": [1, 3],
        "nums2": [2],
        "expected": 2
    },
    {
        "nums1": [1, 2],
        "nums2": [3, 4],
        "expected": 2
    },

    {
        "nums1": [],
        "nums2": [1],
        "expected": 1
    },
    {
        "nums1": [2],
        "nums2": [],
        "expected": 2
    }
]


# Testarea funcției cu fiecare caz
for testCase in testCases:
    nums1 = testCase['nums1']
    nums2 = testCase['nums2']
    expected = testCase['expected']
    
    # Apelăm funcția pentru a obține rezultatul
    result = findMedianSortedArrays(nums1, nums2)
    
    # Comparăm rezultatul cu cel așteptat
    print(json.dumps(result))  # Output the re
    `;
      case "java":
        return `
    
    
   import java.util.*;

public class MedianSortedArrays {
    ${userCode}

    public static void main(String[] args) {
        // Teste pentru cazurile de intrare
        int[][][] testCases = {
            {{1, 3}, {2}, {2}},
            {{1, 2}, {3, 4}, {2}},
            {{}, {1}, {1}},
            {{2}, {}, {2}}
        };

        // Testarea funcției cu fiecare caz
        for (int[][] testCase : testCases) {
            int[] nums1 = testCase[0];
            int[] nums2 = testCase[1];
            double expected = testCase[2][0];

            // Apelăm funcția pentru a obține rezultatul
            double result = findMedianSortedArrays(nums1, nums2);

           System.out.println(result);
        }
    }
}
    `;
      case "csharp":
        return `
    
   using System;

public class MedianSortedArrays
{
    // Funcția ta găsită, trebuie să o înlocuiești cu implementarea reală
    ${userCode}
    public static void Main(string[] args)
    {
        // Teste pentru cazurile de intrare
        int[][][] testCases = {
            new int[][] { new int[] { 1, 3 }, new int[] { 2 }, new int[] { 2 } },
            new int[][] { new int[] { 1, 2 }, new int[] { 3, 4 }, new int[] { 2 } },
            new int[][] { new int[] { }, new int[] { 1 }, new int[] { 1 } },
            new int[][] { new int[] { 2 }, new int[] { }, new int[] { 2 } }
        };

        // Testarea funcției cu fiecare caz
        foreach (var testCase in testCases)
        {
            int[] nums1 = testCase[0];
            int[] nums2 = testCase[1];
            double expected = testCase[2][0];

            // Apelăm funcția pentru a obține rezultatul
            double result = FindMedianSortedArrays(nums1, nums2);

            // Afișăm rezultatul
            Console.WriteLine(result);
        }
    }
}
    `;

      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  };

  const handleSolutionSubmit = async () => {
    if (!solutionCode.trim()) {
      alert("Te rog să completezi soluția înainte de a o trimite.");
      return;
    }

    try {
      const userId = localStorage.getItem("username"); // Adaugă ID-ul utilizatorului curent
      const problemId = id;

      const fullSolution = getCompleteCode(language, solutionCode); // Codul complet
      const results = [];
      const client = piston({ server: "https://emkc.org" });

      // Test cases
      for (let testCase of testCases) {
        // Format the input properly as JSON
        const formattedInput = JSON.stringify({
          nums1: testCase.nums1,
          nums2: testCase.nums2,
        });

        try {
          const result = await client.execute(
            languageMap[language],
            fullSolution,
            {
              stdin: formattedInput,
            }
          );

          // Parse output and ensure proper float handling
          let actualOutput = result.run.stdout
            ? parseFloat(result.run.stdout.trim())
            : null;

          // Funcție de comparație toleranta
          const areEqual = (a, b) => {
            if (isNaN(a) || isNaN(b)) {
              return false; // Dacă oricare dintre valori este NaN, nu sunt egale
            }
            if (!isFinite(a) || !isFinite(b)) {
              return false; // Dacă oricare dintre valori este Infinity sau -Infinity, nu sunt egale
            }
            return Math.abs(a - b) < 0.0001;
          };

          const isTestPassed = areEqual(actualOutput, testCase.expected);

          results.push({
            testCase,
            passed: isTestPassed,
            output: actualOutput,
            expected: testCase.expected,
            error: result.run.stderr || result.run.signal || "",
          });
        } catch (error) {
          console.error(
            `Eroare pentru testul ${JSON.stringify(testCase)}:`,
            error
          );
          results.push({
            testCase,
            passed: false,
            output: null,
            expected: testCase.expected,
            error: error.message,
          });
        }
      }

      console.log("Test Results:", results);

      if (!results || results.length === 0) {
        alert(
          "Nu există rezultate ale testelor. Asigură-te că testele au fost rulate corect."
        );
        return;
      }

      setTestResults(results); // Setăm rezultatele testelor în state
      const allTestsPassed = results.every((result) => result.passed); // Verificăm dacă toate testele au trecut
      setIsSuccess(allTestsPassed);

      if (allTestsPassed) {
        alert("Problema a fost rezolvată cu succes!");
        await axios.post("http://localhost:4000/api/solved-problems", {
          userId,
          problemId,
          language,
        });
      } else {
        alert("Unele teste nu au trecut. Încearcă din nou!");
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert("A apărut o eroare la trimiterea soluției.");
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // Funcție pentru normalizarea ieșirilor

  const handleEditorChange = (value) => {
    setSolutionCode(value.trim());
  };

  return (
    <div className="problem3-container">
      <div className="problem3-details">
        <h1>{problemDetails.title}</h1>
        <p>
          Problema cu ID-ul: <b>{id}</b>
        </p>
        <p>
          Dificultate:{" "}
          <span className="difficulty">{problemDetails.difficulty}</span>
        </p>
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: problemDetails.description }}
        />
      </div>

      <div className="pb3-editor-container">
        <div className="editor-actions">
          <div>
            <label>
              <b>Limbaj:</b>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <b>Temă:</b>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </label>
          </div>
        </div>

        <div className="editor-container">
          <MonacoEditor
            height="80vh" /* sau orice altă valoare de înălțime */
            language={language}
            value={solutionCode}
            theme={theme}
            onChange={handleEditorChange}
            options={{
              fontSize: 20 /* Crește dimensiunea fontului */,
              wordWrap: "on",
            }}
          />
        </div>

        <button onClick={handleSolutionSubmit}>Trimite soluția</button>

        <div className="test-results">
          <h3>Rezultate:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        {isSuccess && (
          <div className="success-message">
            <strong>Succes!</strong> Toate testele au trecut.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail3;
