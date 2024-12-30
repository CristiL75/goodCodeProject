import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const ProblemDetail7 = () => {
    const { id } = useParams();

    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [functionHeader, setFunctionHeader] = useState('function myAtoi(s) { }');
    const [solutionCode, setSolutionCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const userId = localStorage.getItem('username');
    console.log("userId:", userId);
    console.log("id:", id); 

    const getFunctionHeader = (language) => {
        switch (language) {
            case 'python':
                return 'def myAtoi(s):';
            case 'java':
                return 'public int myAtoi(String s) { }';
            case 'csharp':
                return 'public int MyAtoi(string s) { }';
            case 'cpp':
                return 'int myAtoi(string s) { return 0; }';
            default:
                return 'function myAtoi(s) { }';
        }
    };
    useEffect(() => {
        const header = getFunctionHeader(language);
        setFunctionHeader(header);
        setSolutionCode(header + '\n');
    }, [language]);

    if (id !== '8') {
        return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
    }

    const problemDetails = {
        title: 'String to Integer (atoi)',
        difficulty: 'Mediu',
        description: `
        ## String to Integer (atoi)

        **Problema:**
        Implementați funcția \`myAtoi(string s)\`, care convertește un șir de caractere într-un întreg semnat pe 32 de biți.

        Algoritmul pentru \`myAtoi(string s)\` este următorul:

        1. Ignorați orice spațiu alb de la început (" ").
        2. Determinați semnul verificând dacă următorul caracter este '-' sau '+', presupunând pozitivitatea dacă niciunul nu este prezent.
        3. Citiți întregul ignorând zerourile de la început până când este întâlnit un caracter non-cifric sau se ajunge la sfârșitul șirului. Dacă nu au fost citite cifre, atunci rezultatul este 0.
        4. Dacă întregul este în afara intervalului întreg semnat pe 32 de biți [-2^31, 2^31 - 1], atunci rotunjiți întregul pentru a rămâne în interval. În mod specific, întregii mai mici decât -2^31 ar trebui rotunjiți la -2^31, iar întregii mai mari decât 2^31 - 1 ar trebui rotunjiți la 2^31 - 1.
        5. Returnați întregul ca rezultat final.

        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: s = "42"
        Output: 42

        Exemplul 2:
        Input: s = "   -042"
        Output: -42

        Exemplul 3:
        Input: s = "1337c0d3"
        Output: 1337

        Exemplul 4:
        Input: s = "0-1"
        Output: 0

        Exemplul 5:
        Input: s = "words and 987"
        Output: 0
        \`\`\`

        **Constrângeri:**
        \`\`\`
        0 <= s.length <= 200
        s constă din litere englezești (majuscule și minuscule), cifre (0-9), ' ', '+', '-', și '.'.
        \`\`\`
        `
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
            input: { s: "42" },
            expectedOutput: 42
        },
        {
            input: { s: "   -042" },
            expectedOutput: -42
        },
        {
            input: { s: "1337c0d3" },
            expectedOutput: 1337
        },
        {
            input: { s: "0-1" },
            expectedOutput: 0
        },
        {
            input: { s: "words and 987" },
            expectedOutput: 0
        }
    ];
    
    const hiddenTestCases = [
        {
            input: { s: "2147483648" },
            expectedOutput: 2147483647 // Overflow case
        },
        {
            input: { s: "-2147483649" },
            expectedOutput: -2147483648 // Overflow case
        },
        {
            input: { s: "   +0 123" },
            expectedOutput: 0
        }
    ];
    
    const getCompleteCode = (language, userCode) => {
        switch (language) {
            case 'javascript':
                return `
                ${userCode}
            
                const runTests = () => {
                    const testCases = ${JSON.stringify(testCases)};
                    const hiddenTestCases = ${JSON.stringify(hiddenTestCases)};
            
                    const results = testCases.map(({ input, expectedOutput }, index) => {
                        try {
                            const actualOutput = myAtoi(input.s);
                            const passed = actualOutput === expectedOutput;
                            console.log(\`Test Case \${index + 1}:\nExpected: \${expectedOutput}\nActual: \${actualOutput}\nResult: \${passed ? 'Passed' : 'Failed'}\`);
                            return {
                                testCase: { input, expectedOutput },
                                passed,
                                output: actualOutput,
                                expected: expectedOutput,
                                error: passed ? '' : 'Output does not match expected result',
                            };
                        } catch (error) {
                            console.error(\`Error in Test Case \${index + 1}:\`, error);
                            return {
                                testCase: { input, expectedOutput },
                                passed: false,
                                output: null,
                                expected: expectedOutput,
                                error: error.message || 'Unknown error',
                            };
                        }
                    });
            
                    const hiddenResults = hiddenTestCases.map(({ input, expectedOutput }, index) => {
                        try {
                            const actualOutput = myAtoi(input.s);
                            const passed = actualOutput === expectedOutput;
                            console.log(\`Hidden Test Case \${index + 1}:\nExpected: \${expectedOutput}\nActual: \${actualOutput}\nResult: \${passed ? 'Passed' : 'Failed'}\`);
                            return {
                                testCase: { input, expectedOutput },
                                passed,
                                output: actualOutput,
                                expected: expectedOutput,
                                error: passed ? '' : 'Output does not match expected result',
                            };
                        } catch (error) {
                            console.error(\`Error in Hidden Test Case \${index + 1}:\`, error);
                            return {
                                testCase: { input, expectedOutput },
                                passed: false,
                                output: null,
                                expected: expectedOutput,
                                error: error.message || 'Unknown error',
                            };
                        }
                    });
            
                    const allResults = [...results, ...hiddenResults];
                    
                    // Verificăm dacă toate rezultatele sunt array-uri
                    if (!Array.isArray(allResults)) {
                        console.error('Rezultatele testelor nu sunt un array valid:', allResults);
                        return [];
                    }
            
                    // Returnăm rezultatele sub formă de JSON pentru a evita alte erori
                    console.log('Rezultatele testelor:', JSON.stringify(allResults, null, 2));
                    return allResults;
                };
            
                runTests();
                `;
            
            case 'python':
                return `
    ${userCode}
    
    def run_tests():
        test_cases = ${JSON.stringify(testCases)}
        hidden_test_cases = ${JSON.stringify(hiddenTestCases)}
        results = []
        for index, test_case in enumerate(test_cases):
            input_s = test_case['input']['s']
            expected_output = test_case['expectedOutput']
            actual_output = myAtoi(input_s)
            passed = actual_output == expected_output
            print(f"Test Case {index + 1}:\nExpected: {expected_output}\nActual: {actual_output}\nResult: {'Passed' if passed else 'Failed'}")
            results.append({
                "testCase": test_case,
                "passed": passed,
                "output": actual_output,
                "expected": expected_output,
                "error": "" if passed else "Output does not match expected result"
            })
        for index, test_case in enumerate(hidden_test_cases):
            input_s = test_case['input']['s']
            expected_output = test_case['expectedOutput']
            actual_output = myAtoi(input_s)
            passed = actual_output == expected_output
            print(f"Hidden Test Case {index + 1}:\nExpected: {expected_output}\nActual: {actual_output}\nResult: {'Passed' if passed else 'Failed'}")
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
            case 'java':
                return `
    
    
    import java.util.*;
    
    public class Solution {
    ${userCode}
        public static void runTests() {
            List<Map<String, Object>> testCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "42");
                    }});
                    put("expectedOutput", 42);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "   -042");
                    }});
                    put("expectedOutput", -42);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "1337c0d3");
                    }});
                    put("expectedOutput", 1337);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "0-1");
                    }});
                    put("expectedOutput", 0);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "words and 987");
                    }});
                    put("expectedOutput", 0);
                }}
            );
    
            List<Map<String, Object>> hiddenTestCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "2147483648");
                    }});
                    put("expectedOutput", 2147483647); // Overflow case
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "-2147483649");
                    }});
                    put("expectedOutput", -2147483648); // Overflow case
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "   +0 123");
                    }});
                    put("expectedOutput", 0);
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) testCases.get(i).get("input");
                String s = (String) input.get("s");
                int expectedOutput = (int) testCases.get(i).get("expectedOutput");
                int actualOutput = myAtoi(s);
                boolean passed = actualOutput == expectedOutput;
                System.out.println("Test Case " + (i + 1) + ":\nExpected: " + expectedOutput + "\nActual: " + actualOutput + "\nResult: " + (passed ? "Passed" : "Failed"));
                Map<String, Object> result = new HashMap<>();
                result.put("testCase", testCases.get(i));
                result.put("passed", passed);
                result.put("output", actualOutput);
                result.put("expected", expectedOutput);
                result.put("error", passed ? "" : "Output does not match expected result");
                results.add(result);
            }
            for (int i = 0; i < hiddenTestCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) hiddenTestCases.get(i).get("input");
                String s = (String) input.get("s");
                int expectedOutput = (int) hiddenTestCases.get(i).get("expectedOutput");
                int actualOutput = myAtoi(s);
                boolean passed = actualOutput == expectedOutput;
                System.out.println("Hidden Test Case " + (i + 1) + ":\nExpected: " + expectedOutput + "\nActual: " + actualOutput + "\nResult: " + (passed ? "Passed" : "Failed"));
                Map<String, Object> result = new HashMap<>();
                result.put("testCase", hiddenTestCases.get(i));
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
            case 'csharp':
                return `
    
    
    using System;
    using System.Collections.Generic;
    
    public class Solution {
    ${userCode}
        public static void RunTests() {
            var testCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "42" } } }, { "expectedOutput", 42 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "   -042" } } }, { "expectedOutput", -42 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "1337c0d3" } } }, { "expectedOutput", 1337 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "0-1" } } }, { "expectedOutput", 0 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "words and 987" } } }, { "expectedOutput", 0 } }
            };
    
            var hiddenTestCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "2147483648" } } }, { "expectedOutput", 2147483647 } }, // Overflow case
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "-2147483649" } } }, { "expectedOutput", -2147483648 } }, // Overflow case
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "   +0 123" } } }, { "expectedOutput", 0 } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                var input = (Dictionary<string, object>)testCases[i]["input"];
                string s = (string)input["s"];
                int expectedOutput = (int)testCases[i]["expectedOutput"];
                int actualOutput = MyAtoi(s);
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
            for (int i = 0; i < hiddenTestCases.Count; i++) {
                var input = (Dictionary<string, object>)hiddenTestCases[i]["input"];
                string s = (string)input["s"];
                int expectedOutput = (int)hiddenTestCases[i]["expectedOutput"];
                int actualOutput = MyAtoi(s);
                bool passed = actualOutput == expectedOutput;
                Console.WriteLine($"Hidden Test Case {i + 1}:\nExpected: {expectedOutput}\nActual: {actualOutput}\nResult: {(passed ? "Passed" : "Failed")}");
                var result = new Dictionary<string, object> {
                    { "testCase", hiddenTestCases[i] },
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
            case 'cpp':
                return `
    ${userCode}
    
    #include <iostream>
    #include <vector>
    #include <string>
    #include <unordered_map>
    #include <sstream>
    
    int myAtoi(std::string s);
    
    void runTests() {
        std::vector<std::pair<std::string, int>> testCases = {
            {"42", 42},
            {"   -042", -42},
            {"1337c0d3", 1337},
            {"0-1", 0},
            {"words and 987", 0}
        };
    
        std::vector<std::pair<std::string, int>> hiddenTestCases = {
            {"2147483648", 2147483647}, // Overflow case
            {"-2147483649", -2147483648}, // Overflow case
            {"   +0 123", 0}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            std::string s = testCases[i].first;
            int expectedOutput = testCases[i].second;
            int actualOutput = myAtoi(s);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s;
            result["passed"] = passed ? "true" : "false";
            result["output"] = std::to_string(actualOutput);
            result["expected"] = std::to_string(expectedOutput);
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (int i = 0; i < hiddenTestCases.size(); ++i) {
            std::string s = hiddenTestCases[i].first;
            int expectedOutput = hiddenTestCases[i].second;
            int actualOutput = myAtoi(s);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Hidden Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s;
            result["passed"] = passed ? "true" : "false";
            result["output"] = std::to_string(actualOutput);
            result["expected"] = std::to_string(expectedOutput);
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
            alert('Te rog să completezi soluția înainte de a o trimite.');
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
                alert('Nu există rezultate ale testelor. Asigură-te că testele au fost rulate corect.');
                return;
            }
    
            setTestResults(results); // Setăm rezultatele testelor în state
    
            const allTestsPassed = results.every(result => result.passed); // Verificăm dacă toate testele au trecut
    
            if (allTestsPassed) {
                // Afișăm un mesaj de succes pentru utilizator
                alert('Toate testele au trecut!');

                console.log('User ID:', userId);
                console.log('Problem ID:', id);

                // Trimitem cererea POST pentru a salva problema rezolvată pe server
                const response = await fetch('http://localhost:4000/api/solved-problems', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        problemId: id,
                    }),
                });
                
    
                const data = await response.json();
                if (response.ok) {
                    console.log(data.message); // Mesaj de succes din backend
                } else {
                    console.error(data.message); // Mesaj de eroare din backend
                    alert('A apărut o eroare la salvarea problemei.');
                }
            } else {
                const failedTests = results.filter(result => !result.passed);
                let errorMessage = 'Unele teste nu au trecut. Încearcă din nou!\n\n';
                failedTests.forEach((result, index) => {
                    errorMessage += `Test Case ${index + 1}:\n`;
                    errorMessage += `Input: ${JSON.stringify(result.testCase.input)}\n`;
                    errorMessage += `Expected: ${JSON.stringify(result.expected)}\n`;
                    errorMessage += `Actual: ${JSON.stringify(result.output)}\n`;
                    errorMessage += `Error: ${result.error || 'Unknown error'}\n\n`;
                });
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting solution:', error);
            alert('A apărut o eroare la trimiterea soluției.');
        }
    };
    
    const handleEditorChange = (value) => {
        setSolutionCode(value.trim());
    };
    

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ width: '50%', padding: '20px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
                <h1>{problemDetails.title}</h1>
                <p>Problema cu ID-ul: <b>{id}</b></p>
                <p>Dificultate: <span style={{ color: 'orange' }}>{problemDetails.difficulty}</span></p>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: problemDetails.description }} />
            </div>

            <div style={{ width: '50%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <label><b>Limbaj:</b>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="csharp">C#</option>
                                <option value="cpp">C++</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label><b>Temă:</b>
                            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                                <option value="vs-dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="hc-black">High Contrast</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <MonacoEditor
                        height="100%"
                        language={language}
                        value={solutionCode}
                        theme={theme}
                        onChange={handleEditorChange}
                        options={{
                            fontSize: 18,
                            wordWrap: 'on',
                        }}
                    />
                </div>

                <button
                    onClick={handleSolutionSubmit}
                    style={{
                        marginTop: '20px',
                        padding: '15px 30px',
                        fontSize: '18px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Trimite soluția
                </button>

                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>
                    <h3>Rezultate:</h3>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(testResults, null, 2)}</pre>
                </div>

                {isSuccess && (
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724' }}>
                        <strong>Succes!</strong> Toate testele au trecut.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDetail7;