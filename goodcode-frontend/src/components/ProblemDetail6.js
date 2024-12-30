import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const ProblemDetail6 = () => {
    const { id } = useParams();

    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [functionHeader, setFunctionHeader] = useState('function reverse(x) { }');
    const [solutionCode, setSolutionCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const userId = localStorage.getItem('username');
    console.log("userId:", userId);
    console.log("id:", id); 

    const getFunctionHeader = (language) => {
        switch (language) {
            case 'python':
                return 'def reverse(x):';
            case 'java':
                return 'public int reverse(int x) { }';
            case 'csharp':
                return 'public int Reverse(int x) { }';
            case 'cpp':
                return 'int reverse(int x) { return 0; }';
            default:
                return 'function reverse(x) { }';
        }
    };


    useEffect(() => {
        const header = getFunctionHeader(language);
        setFunctionHeader(header);
        setSolutionCode(header + '\n');
    }, [language]);

    if (id !== '7') {
        return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
    }

    const problemDetails = {
        title: 'Reverse Integer',
        difficulty: 'Mediu',
        description: `
        ## Reverse Integer

        **Problema:**
        Dat un întreg semnat pe 32 de biți \`x\`, returnați \`x\` cu cifrele inversate. Dacă inversarea lui \`x\` cauzează ca valoarea să depășească intervalul întreg semnat pe 32 de biți [-2^31, 2^31 - 1], atunci returnați 0.

        Presupuneți că mediul nu permite stocarea întregilor pe 64 de biți (semnați sau nesemnați).

        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: x = 123
        Output: 321

        Exemplul 2:
        Input: x = -123
        Output: -321

        Exemplul 3:
        Input: x = 120
        Output: 21
        \`\`\`

        **Constrângeri:**
        \`\`\`
        -2^31 <= x <= 2^31 - 1
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
            input: { x: 123 },
            expectedOutput: 321
        },
        {
            input: { x: -123 },
            expectedOutput: -321
        },
        {
            input: { x: 120 },
            expectedOutput: 21
        }
    ];
    
    const hiddenTestCases = [
        {
            input: { x: 1534236469 },
            expectedOutput: 0 // Overflow case
        },
        {
            input: { x: -2147483648 },
            expectedOutput: 0 // Overflow case
        },
        {
            input: { x: 0 },
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
                    
                    // Verifică dacă funcția reverse() există înainte de a o apela
                    if (typeof reverse !== 'function') {
                        console.error('Funcția reverse() nu este definită');
                        return;
                    }
                
                    // Mapează testele pentru testele vizibile
                    const results = testCases.map(({ input, expectedOutput }, index) => {
                        const actualOutput = reverse(input); // Folosim funcția reverse pentru test
                        const passed = actualOutput === expectedOutput;
                        console.log(\`Test Case \${index + 1}:\nExpected: \${expectedOutput}\nActual: \${actualOutput}\nResult: \${passed ? 'Passed' : 'Failed'}\`);
                        return {
                            testCase: { input, expectedOutput },
                            passed,
                            output: actualOutput,
                            expected: expectedOutput,
                            error: passed ? '' : 'Output does not match expected result'
                        };
                    });
            
                    // Mapează testele pentru testele ascunse
                    const hiddenResults = hiddenTestCases.map(({ input, expectedOutput }, index) => {
                        const actualOutput = reverse(input); // Folosim funcția reverse pentru test
                        const passed = actualOutput === expectedOutput;
                        console.log(\`Hidden Test Case \${index + 1}:\nExpected: \${expectedOutput}\nActual: \${actualOutput}\nResult: \${passed ? 'Passed' : 'Failed'}\`);
                        return {
                            testCase: { input, expectedOutput },
                            passed,
                            output: actualOutput,
                            expected: expectedOutput,
                            error: passed ? '' : 'Output does not match expected result'
                        };
                    });
            
                    // Concatenează rezultatele și verifică dacă este un array valid
                    const allResults = [...results, ...hiddenResults]; // Folosim spread operator pentru a concatena
            
                    if (!Array.isArray(allResults)) {
                        console.error('Rezultatele nu sunt un array valid:', allResults);
                        return []; // Returnează un array gol dacă ceva nu este valid
                    }
            
                    // Logare pentru debugging
                    console.log('Rezultatele testelor:', JSON.stringify(allResults, null, 2));
            
                    return allResults; // Returnează rezultatele ca un array valid
                };
            
                // Rulează testele
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
            input_x = test_case['input']['x']
            expected_output = test_case['expectedOutput']
            actual_output = reverse(input_x)
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
            input_x = test_case['input']['x']
            expected_output = test_case['expectedOutput']
            actual_output = reverse(input_x)
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
                        put("x", 123);
                    }});
                    put("expectedOutput", 321);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", -123);
                    }});
                    put("expectedOutput", -321);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 120);
                    }});
                    put("expectedOutput", 21);
                }}
            );
    
            List<Map<String, Object>> hiddenTestCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 1534236469);
                    }});
                    put("expectedOutput", 0); // Overflow case
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", -2147483648);
                    }});
                    put("expectedOutput", 0); // Overflow case
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 0);
                    }});
                    put("expectedOutput", 0);
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) testCases.get(i).get("input");
                int x = (int) input.get("x");
                int expectedOutput = (int) testCases.get(i).get("expectedOutput");
                int actualOutput = reverse(x);
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
                int x = (int) input.get("x");
                int expectedOutput = (int) hiddenTestCases.get(i).get("expectedOutput");
                int actualOutput = reverse(x);
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
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 123 } } }, { "expectedOutput", 321 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", -123 } } }, { "expectedOutput", -321 } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 120 } } }, { "expectedOutput", 21 } }
            };
    
            var hiddenTestCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 1534236469 } } }, { "expectedOutput", 0 } }, // Overflow case
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", -2147483648 } } }, { "expectedOutput", 0 } }, // Overflow case
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 0 } } }, { "expectedOutput", 0 } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                var input = (Dictionary<string, object>)testCases[i]["input"];
                int x = (int)input["x"];
                int expectedOutput = (int)testCases[i]["expectedOutput"];
                int actualOutput = Reverse(x);
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
                int x = (int)input["x"];
                int expectedOutput = (int)hiddenTestCases[i]["expectedOutput"];
                int actualOutput = Reverse(x);
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
    
    int reverse(int x);
    
    void runTests() {
        std::vector<std::pair<int, int>> testCases = {
            {123, 321},
            {-123, -321},
            {120, 21}
        };
    
        std::vector<std::pair<int, int>> hiddenTestCases = {
            {1534236469, 0}, // Overflow case
            {-2147483648, 0}, // Overflow case
            {0, 0}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            int x = testCases[i].first;
            int expectedOutput = testCases[i].second;
            int actualOutput = reverse(x);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "x: " + std::to_string(x);
            result["passed"] = passed ? "true" : "false";
            result["output"] = std::to_string(actualOutput);
            result["expected"] = std::to_string(expectedOutput);
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (int i = 0; i < hiddenTestCases.size(); ++i) {
            int x = hiddenTestCases[i].first;
            int expectedOutput = hiddenTestCases[i].second;
            int actualOutput = reverse(x);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Hidden Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "x: " + std::to_string(x);
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
        setSolutionCode(value.trim());  // Asigură-te că trimite doar text valid
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

export default ProblemDetail6;