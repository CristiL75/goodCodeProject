import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";

const ProblemDetail4 = () => {
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
        return "def longestPalindrome(s):";
      case "java":
        return "public String longestPalindrome(String s) { }";
      case "csharp":
        return "public string LongestPalindrome(string s) { }";
      case "cpp":
        return 'string longestPalindrome(string s) { return ""; }';
      default:
        return "function longestPalindrome(s) { }";
    }
  };

  useEffect(() => {
    const header = getFunctionHeader(language);
    setFunctionHeader(header);
    setSolutionCode(header + "\n");
  }, [language]);

  if (id !== "5") {
    return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
  }

  const problemDetails = {
    title: "Cel mai lung subșir palindromic",
    difficulty: "Mediu",
    description: `
        ## Cel mai lung subșir palindromic
    
        **Problema:**
        Dat un șir de caractere \`s\`, returnați cel mai lung subșir palindromic din \`s\`.
    
        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: s = "babad"
        Output: "bab"
        Explicație: "aba" este de asemenea un răspuns valid.
    
        Exemplul 2:
        Input: s = "cbbd"
        Output: "bb"
        \`\`\`
    
        **Constrângeri:**
        \`\`\`
        1 <= s.length <= 1000
        s constă doar din cifre și litere englezești.
        \`\`\`
        `,
  };

  const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    csharp: 51,
    cpp: 54,
  };

  const testCases = [
    {
      input: "babad",
      expectedOutput: "bab",
    },
    {
      input: "cbbd",
      expectedOutput: "bb",
    },
  ];

  const getCompleteCode = (language, userCode) => {
    switch (language) {
      case "javascript":
        return `
    ${userCode}
    
    const testCases = ${JSON.stringify(testCases)};

    const runTests = () => {
        const results = testCases.map(({ input, expectedOutput }, index) => {
            try {
                const actualOutput = longestPalindrome(input); // Execută funcția utilizatorului
                const passed = actualOutput === expectedOutput; // Compară cu rezultatul așteptat
                console.log(\`Test Case \${index + 1}:\nExpected: \${expectedOutput}\nActual: \${actualOutput}\nResult: \${passed ? 'Passed' : 'Failed'}\`);
                return {
                    testCase: { input, expectedOutput },
                    passed,
                    output: actualOutput,
                    expected: expectedOutput,
                    error: passed ? '' : 'Output does not match expected result',
                };
            } catch (err) {
                // Gestionăm eventualele erori apărute la rularea testului
                return {
                    testCase: { input, expectedOutput },
                    passed: false,
                    output: null,
                    expected: expectedOutput,
                    error: err.message || 'Unknown error occurred',
                };
            }
        });
        return results; // Returnăm rezultatele pentru utilizare ulterioară
    };

    const results = runTests();
    results; // Asigurăm că eval returnează rezultatele
    `;
      case "python":
        return `
    ${userCode}
    
    def run_tests():
        test_cases = ${JSON.stringify(testCases)}
        results = []
        for index, test_case in enumerate(test_cases):
            input_str = test_case['input']
            expected_output = test_case['expectedOutput']
            actual_output = longestPalindrome(input_str)
            passed = actual_output == expected_output
            print(f"Test Case {index + 1}:\nExpected: {expected_output}\nActual: {actual_output}\nResult: {'Passed' if passed else 'Failed'}")
            results.append({
                "testCase": test_case,
                "passed": passed,
                "output": actual_output,
                "expected": expected_output,
                "error": "" if passed else "Output does not match expected result"
            })
        print(results)
    
    if __name__ == "__main__":
        run_tests()
    `;
      case "java":
        return `
    
    
    import java.util.*;
    
    public class Solution {
    ${userCode}
        public static void runTests() {
            List<Map<String, Object>> testCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", "babad");
                    put("expectedOutput", "bab");
                }},
                new HashMap<String, Object>() {{
                    put("input", "cbbd");
                    put("expectedOutput", "bb");
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                String input = (String) testCases.get(i).get("input");
                String expectedOutput = (String) testCases.get(i).get("expectedOutput");
                String actualOutput = longestPalindrome(input);
                boolean passed = actualOutput.equals(expectedOutput);
                System.out.println("Test Case " + (i + 1) + ":\nExpected: " + expectedOutput + "\nActual: " + actualOutput + "\nResult: " + (passed ? "Passed" : "Failed"));
                Map<String, Object> result = new HashMap<>();
                result.put("testCase", testCases.get(i));
                result.put("passed", passed);
                result.put("output", actualOutput);
                result.put("expected", expectedOutput);
                result.put("error", passed ? "" : "Output does not match expected result");
                results.add(result);
            }
            System.out.println(results);
        }
    
        public static void main(String[] args) {
            runTests();
        }
    }
    `;
      case "csharp":
        return `
    
    
    using System;
    using System.Collections.Generic;
    
    public class Solution {
    ${userCode}
        public static void RunTests() {
            var testCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", "babad" }, { "expectedOutput", "bab" } },
                new Dictionary<string, object> { { "input", "cbbd" }, { "expectedOutput", "bb" } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                string input = (string)testCases[i]["input"];
                string expectedOutput = (string)testCases[i]["expectedOutput"];
                string actualOutput = LongestPalindrome(input);
                bool passed = actualOutput == expectedOutput;
                Console.WriteLine($"Test Case {i + 1}:\nExpected: {expectedOutput}\nActual: {actualOutput}\nResult: {(passed ? "Passed" : "Failed")}");
                var result = new Dictionary<string, object> {
                    { "testCase", testCases[i] },
                    { "passed", passed },
                    { "output", actualOutput },
                    { "expected", expectedOutput },
                    { "error", passed ? "" : "Output does not match expected result" }
                };
                results.Add(result);
            }
            Console.WriteLine(results);
        }
    
        public static void Main(string[] args) {
            RunTests();
        }
    }
    `;
      case "cpp":
        return `
    ${userCode}
    
    #include <iostream>
    #include <vector>
    #include <string>
    #include <unordered_map>
    #include <sstream>
    
    std::string longestPalindrome(std::string s);
    
    void runTests() {
        std::vector<std::pair<std::string, std::string>> testCases = {
            {"babad", "bab"},
            {"cbbd", "bb"}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            std::string input = testCases[i].first;
            std::string expectedOutput = testCases[i].second;
            std::string actualOutput = longestPalindrome(input);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = input;
            result["passed"] = passed ? "true" : "false";
            result["output"] = actualOutput;
            result["expected"] = expectedOutput;
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (const auto& result : results) {
            std::cout << "{\n";
            for (const auto& [key, value] : result) {
                std::cout << "  \"" << key << "\": \"" << value << "\",\n";
            }
            std::cout << "}\n";
        }
    }
    
    int main() {
        runTests();
        return 0;
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
      const fullSolution = getCompleteCode(language, solutionCode); // Codul complet
      console.log("Full Solution Code:", fullSolution);

      // Evaluăm codul complet pentru a obține rezultatele testelor
      const results = eval(fullSolution); // Nu mai facem JSON.parse
      console.log("Test Results:", results);

      // Verificăm dacă results este un array valid
      if (!Array.isArray(results)) {
        throw new Error("Rezultatele testelor nu sunt un array valid.");
      }

      if (results.length === 0) {
        alert(
          "Nu există rezultate ale testelor. Asigură-te că testele au fost rulate corect."
        );
        return;
      }

      setTestResults(results); // Setăm rezultatele testelor în state

      const allTestsPassed = results.every((result) => result.passed); // Verificăm dacă toate testele au trecut

      if (allTestsPassed) {
        // Afișăm un mesaj de succes pentru utilizator
        alert("Toate testele au trecut!");

        console.log("User ID:", userId);
        console.log("Problem ID:", id);

        // Trimitem cererea POST pentru a salva problema rezolvată pe server
        const response = await fetch(
          "http://localhost:4000/api/solved-problems",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              problemId: id,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log(data.message); // Mesaj de succes din backend
        } else {
          console.error(data.message); // Mesaj de eroare din backend
          alert("A apărut o eroare la salvarea problemei.");
        }
      } else {
        const failedTests = results.filter((result) => !result.passed);
        let errorMessage = "Unele teste nu au trecut. Încearcă din nou!\n\n";
        failedTests.forEach((result, index) => {
          errorMessage += `Test Case ${index + 1}:\n`;
          errorMessage += `Input: ${JSON.stringify(result.testCase.input)}\n`;
          errorMessage += `Expected: ${JSON.stringify(result.expected)}\n`;
          errorMessage += `Actual: ${JSON.stringify(result.output)}\n`;
          errorMessage += `Error: ${result.error || "Unknown error"}\n\n`;
        });
        alert(errorMessage);
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
                <option value="cpp">C++</option>
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

export default ProblemDetail4;
