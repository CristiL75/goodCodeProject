import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import piston from "piston-client";
import "./styles/pb.css";

const ProblemDetail = () => {
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
    "function twoSum(nums, target) { }"
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
        return "def two_sum(nums, target):";
      case "java":
        return "public static int[] twoSum(int[] nums, int target) { }";
      case "csharp":
        return "public static int[] TwoSum(int[] nums, int target) { }";

      default:
        return "function twoSum(nums, target) { }";
    }
  };

  useEffect(() => {
    const header = getFunctionHeader(language);
    setFunctionHeader(header);
    setSolutionCode(header + "\n");
  }, [language]);

  if (id !== "1") {
    return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
  }

  const problemDetails = {
    title: "Suma a două numere",
    difficulty: "Ușor",
    description: `## Suma a două numere
            **Problema:**
            Dându-se un array de numere întregi \`nums\` și un număr întreg \`target\`, găsește indicii a două numere din array care, împreună, au suma egală cu \`target\`.

            **Exemplu:**
            \`\`\`
            Intrare: nums = [2, 7, 11, 15], target = 9
            Ieșire: [0, 1]
            Explicație: nums[0] + nums[1] = 2 + 7 = 9
            \`\`\`

            **Cerințe:**
            - Poți presupune că fiecare intrare are o singură soluție.
            - Poți să nu folosești același element de două ori.

            **Constrângeri:**
            - 2 <= nums.length <= 10^4
            - -10^9 <= nums[i] <= 10^9
            - -10^9 <= target <= 10^9
        `,
  };

  const languageMap = {
    javascript: "javascript",
    python: "python",
    java: "java",
    csharp: "csharp",
  };

  const testCases = [
    { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: "[0,1]" },
    { input: { nums: [1, 3, 5, 7], target: 8 }, expectedOutput: "[1,2]" },
    { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: "[1,2]" },
    { input: { nums: [3, 3], target: 6 }, expectedOutput: "[0,1]" },
  ];
  const getCompleteCode = (language, userCode) => {
    switch (language) {
      case "javascript":
        return `
                ${userCode}
                
                const readline = require("readline");
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                
                let input = [];
                rl.on("line", (line) => {
                    input.push(line.trim());
                }).on("close", () => {
                    const nums = JSON.parse(input[0]);
                    const target = parseInt(input[1]);
                    const result = twoSum(nums, target);
                    console.log(JSON.stringify(result)); // Rezultatul este acum stringify
                });
                `;

      case "python":
        return `
${userCode}

if __name__ == "__main__":
    import sys
    import json

    # Citirea array-ului și a target-ului de la stdin
    nums = json.loads(sys.stdin.readline().strip())
    target = int(sys.stdin.readline().strip())

    # Calcularea rezultatului folosind funcția definită de utilizator
    result = two_sum(nums, target)

    # Afișarea rezultatului
    print(result)

    `;
      case "java":
        return `
import java.util.*;
import java.util.HashMap;
import java.util.Map;
import java.util.*;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String numsInput = sc.nextLine();
        int target = Integer.parseInt(sc.nextLine());
        int[] nums = Arrays.stream(numsInput.replace("[", "").replace("]", "").split(","))
                           .mapToInt(Integer::parseInt).toArray();

        // Apelăm funcția twoSum pentru a obține rezultatul
        int[] result = twoSum(nums, target);

        // Afișăm rezultatul
        System.out.println(Arrays.toString(result));
    }

    ${userCode}
}


`;
      case "csharp":
        return `
 using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        // Citirea input-ului
        string numsInput = Console.ReadLine();
        int target = int.Parse(Console.ReadLine());
        int[] nums = numsInput.Trim('[', ']').Split(',').Select(int.Parse).ToArray();

        // Apelarea metodei TwoSum
        int[] result = TwoSum(nums, target);

        // Afișarea rezultatului
        Console.WriteLine($"[{string.Join(",", result)}]");
    }

    ${userCode}
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
      const problemId = id; // ID-ul problemei curente

      const fullSolution = getCompleteCode(language, solutionCode); // Codul complet
      const results = [];
      const client = piston({ server: "https://emkc.org" });

      for (let testCase of testCases) {
        const formattedInput = `${JSON.stringify(testCase.input.nums)}\n${
          testCase.input.target
        }`;

        try {
          const result = await client.execute(
            languageMap[language],
            fullSolution,
            {
              stdin: formattedInput,
            }
          );

          // Transformăm stdout într-un JSON stringificat, dacă este posibil
          const actualOutput = result.run.stdout
            ? JSON.stringify(JSON.parse(result.run.stdout.trim()))
            : null;
          const expectedOutput = testCase.expectedOutput; // Asigurăm stringify

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

  const handleEditorChange = (value) => {
    setSolutionCode(value.trim());
  };

  return (
    <div className="problem0-container">
      <div className="problem0-details">
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

      <div className="pb0-editor-container">
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

export default ProblemDetail;
