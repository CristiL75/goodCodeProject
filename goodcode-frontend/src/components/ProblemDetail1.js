import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import piston from "piston-client";
import "./styles/pb1.css";

const ProblemDetail1 = () => {
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
    "function addTwoNumbers(l1, l2) { }"
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
        return "def addTwoNumbers(l1, l2):";
      case "java":
        return "public ListNode addTwoNumbers(ListNode l1, ListNode l2) { }";
      case "csharp":
        return "public ListNode AddTwoNumbers(ListNode l1, ListNode l2) { }";
      case "cpp":
        return "ListNode* addTwoNumbers(ListNode* l1, ListNode* l2){ return {}; }";
      default:
        return "function addTwoNumbers(l1, l2) { }";
    }
  };

  useEffect(() => {
    const header = getFunctionHeader(language);
    setFunctionHeader(header);
    setSolutionCode(header + "\n");
  }, [language]);

  if (id !== "2") {
    return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
  }

  const problemDetails = {
    title: "Adună două numere.",
    difficulty: "Medie",
    description: `
        ## Adună două numere.
    
        **Problema:**
        Vi se dau două liste legate nevide care reprezintă două numere întregi nenegative. Cifrele sunt stocate în ordine inversă, iar fiecare nod al acestora conține o singură cifră. Adăugați cele două numere și returnați suma ca o listă legată.
        Puteți presupune că cele două numere nu conțin niciun zero inițial, cu excepția numărului 0 în sine.
    
        **Exemplu:**
        \`\`\`
        Input: l1 = [2,4,3], l2 = [5,6,4]
        Output: [7,0,8]
        Explicație: 342 + 465 = 807.
        \`\`\`
    
        **Constrângeri:**
        - Numărul de noduri din fiecare listă legată se află în intervalul [1, 100].
        - 0 <= Node.val <= 9.
        - Valoarea lui Node.val este între 0 și 9 (inclusiv).
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
      input: {
        l1: { val: 2, next: { val: 4, next: { val: 3, next: null } } },
        l2: { val: 5, next: { val: 6, next: { val: 4, next: null } } },
      },
      expectedOutput: {
        val: 7,
        next: {
          val: 0,
          next: {
            val: 8,
            next: null,
          },
        },
      },
    },
    {
      input: {
        l1: { val: 0, next: null },
        l2: { val: 0, next: null },
      },
      expectedOutput: {
        val: 0,
        next: null,
      },
    },
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
                const l1 = JSON.parse(input[0]);
                const l2 = JSON.parse(input[1]);
                const result = addTwoNumbers(l1, l2);
                console.log(JSON.stringify(result));
            });
            
            
            
            class ListNode {
                constructor(val = 0, next = null) {
                    this.val = val;
                    this.next = next;
                }
            }
            `;

      case "python":
        return `

import sys
import json



${userCode}

if __name__ == "__main__":

    l1 = [2, 4, 3]  # Prima listă
    l2 = [5, 6, 4]  # A doua listă


    # Calcularea rezultatului folosind funcția addTwoNumbers
    result = addTwoNumbers(l1, l2)

    # Afișarea rezultatului
    print(json.dumps(result))

    `;
      case "java":
        return `
import java.util.*;

class ListNode {
    int val;
    ListNode next;

    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Main {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Citirea inputului pentru cele două liste legate
        String l1Input = sc.nextLine();
        String l2Input = sc.nextLine();

        // Convertim inputul într-un format de tip ListNode
        ListNode l1 = stringToListNode(l1Input);
        ListNode l2 = stringToListNode(l2Input);

        // Apelăm funcția addTwoNumbers pentru a aduna cele două liste legate
        ListNode result = addTwoNumbers(l1, l2);

        // Afișăm rezultatul
        System.out.println(listNodeToString(result));
    }

    // Funcția pentru adunarea celor două liste legate
    public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode p = l1, q = l2, current = dummyHead;
        int carry = 0;

        while (p != null || q != null) {
            int x = (p != null) ? p.val : 0;
            int y = (q != null) ? q.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            current.next = new ListNode(sum % 10);
            current = current.next;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
        }

        if (carry > 0) {
            current.next = new ListNode(carry);
        }

        return dummyHead.next;
    }

    // Funcție pentru a converti un string într-o listă legată (fără folosirea JSON)
    public static ListNode stringToListNode(String input) {
        // Eliminăm caracterele inutile și parsează lista
        input = input.replace("[", "").replace("]", "").replace("{", "").replace("}", "").replace("\"", "");  // elimină caracterele {, }, [, ], "
        String[] values = input.split(",");

        ListNode dummyHead = new ListNode(0);
        ListNode current = dummyHead;

        for (String value : values) {
            if (!value.trim().isEmpty()) {
                current.next = new ListNode(Integer.parseInt(value.trim()));
                current = current.next;
            }
        }

        return dummyHead.next;
    }

    // Funcție pentru a transforma o listă legată într-un string pentru afișare
    public static String listNodeToString(ListNode node) {
        StringBuilder result = new StringBuilder();
        result.append("[");

        while (node != null) {
            result.append(node.val);
            if (node.next != null) result.append(", ");
            node = node.next;
        }

        result.append("]");
        return result.toString();
    }
}

                `;
      // Adăugați alte limbaje aici
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        const formattedInput = `${JSON.stringify(
          testCase.input.l1
        )}\n${JSON.stringify(testCase.input.l2)}`;

        try {
          const result = await client.execute(
            languageMap[language],
            fullSolution,
            {
              stdin: formattedInput,
            }
          );

          // Verificăm dacă stdout este definit înainte de a-l utiliza
          const actualOutput = result.run.stdout
            ? JSON.stringify(JSON.parse(result.run.stdout.trim()))
            : null;
          const expectedOutput = JSON.stringify(testCase.expectedOutput); // Asigurăm stringify

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

  const handleEditorChange = (value) => {
    setSolutionCode(value.trim());
  };

  return (
    <div className="problem1-container">
      <div className="problem1-details">
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

      <div className="pb1-editor-container">
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

export default ProblemDetail1;
