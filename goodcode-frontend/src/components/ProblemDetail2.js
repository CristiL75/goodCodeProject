import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import piston from "piston-client";
import "./styles/pb2.css";

const ProblemDetail2 = () => {
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
    "function lengthOfLongestSubstring(s) { }"
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
        return "def lengthOfLongestSubstring(s):";
      case "java":
        return "public int lengthOfLongestSubstring(String s) { }";
      case "csharp":
        return "public int LengthOfLongestSubstring(string s) { }";
      default:
        return "function lengthOfLongestSubstring(s) { }";
    }
  };

  useEffect(() => {
    const header = getFunctionHeader(language);
    setFunctionHeader(header);
    setSolutionCode(header + "\n");
  }, [language]);

  if (id !== "3") {
    return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
  }

  const problemDetails = {
    title: "Cel mai lung subșir fără caractere repetate.",
    difficulty: "Medie",
    description: `
        ## Cel mai lung subșir fără caractere repetate

        **Problema:**
        Dat un șir de caractere \`s\`, găsiți lungimea celui mai lung subșir fără caractere repetate.

        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: s = "abcabcbb"
        Output: 3
        Explicație: Răspunsul este "abc", cu lungimea de 3.

        Exemplul 2:
        Input: s = "bbbbb"
        Output: 1
        Explicație: Răspunsul este "b", cu lungimea de 1.

        Exemplul 3:
        Input: s = "pwwkew"
        Output: 3
        Explicație: Răspunsul este "wke", cu lungimea de 3.
        Notă: Răspunsul trebuie să fie un subșir, "pwke" este o subsequence și nu un subșir.
        \`\`\`

        **Hint:**
        Folosiți o fereastră glisantă pentru a verifica subșirurile fără caractere repetate.
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
      input: "abcabcbb",
      expectedOutput: 3,
    },
    {
      input: "bbbbb",
      expectedOutput: 1,
    },
    {
      input: "pwwkew",
      expectedOutput: 3,
    },
  ];

  const getCompleteCode = (language, userCode) => {
    switch (language) {
      case "javascript":
        return `
                  ${userCode}
    
                  // Read input from stdin
                  process.stdin.resume();
                  process.stdin.setEncoding('utf8');
                  let input = '';
                  
                  process.stdin.on('data', (chunk) => {
                      input += chunk;
                  });
    
                  process.stdin.on('end', () => {
                      const s = JSON.parse(input.trim()); // Parse the input string
                      const result = lengthOfLongestSubstring(s);
                      console.log(JSON.stringify(result)); // Output the result as JSON
                  });
                `;
      case "python":
        return `
${userCode}
import sys
import json

if __name__ == "__main__":
    input_data = sys.stdin.read().strip()
    s = json.loads(input_data)  # Parse input JSON string
    result = length_of_longest_substring(s)
    print(json.dumps(result))  # Output the re
                
                
                
                
                
                
                
                `;
      case "java":
        return ` 
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();

        // Remove JSON quotes
        input = input.substring(1, input.length() - 1);

        int result = lengthOfLongestSubstring(input);

        System.out.println(result); // Output result as plain integer
    }

    ${userCode}
}
                
                `;
      case "csharp":
        return ` 
                    using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        string input = Console.ReadLine();

        // Parse the input string from JSON format (remove quotes)
        input = input.Substring(1, input.Length - 2);

        int result = LengthOfLongestSubstring(input);

        // Output the result as plain integer
        Console.WriteLine(result);
    }

    ${userCode}
}
                    
                    
                    
                    
                    `;
      default:
        throw new Error("Unsupported language:");
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

      for (let testCase of testCases) {
        // Format the input properly as JSON
        const formattedInput = JSON.stringify(testCase.input);

        try {
          const result = await client.execute(
            languageMap[language],
            fullSolution,
            {
              stdin: formattedInput, // Pass properly formatted input
            }
          );

          // Parse and validate the output
          const actualOutput = result.run.stdout
            ? JSON.parse(result.run.stdout.trim())
            : null;
          const expectedOutput = testCase.expectedOutput;

          const isTestPassed = actualOutput === expectedOutput;

          results.push({
            testCase,
            passed: isTestPassed,
            output: actualOutput,
            expected: expectedOutput,
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
            error: error.message,
          });
        }

        // Așteaptă 1-2 secunde între fiecare cerere pentru a nu depăși limita
        await sleep(1000); // Pauză de 1 secundă
      }

      setTestResults(results);
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
    <div className="problem2-container">
      <div className="problem2-details">
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

      <div className="pb2-editor-container">
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

export default ProblemDetail2;
