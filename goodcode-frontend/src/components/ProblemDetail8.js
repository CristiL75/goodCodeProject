import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const ProblemDetail8 = () => {
    const { id } = useParams();

    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [functionHeader, setFunctionHeader] = useState('function isPalindrome(x) { }');
    const [solutionCode, setSolutionCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const userId = localStorage.getItem('username');
    console.log("userId:", userId);
    console.log("id:", id); 

    const getFunctionHeader = (language) => {
        switch (language) {
            case 'python':
                return 'def isPalindrome(x):';
            case 'java':
                return 'public boolean isPalindrome(int x) { }';
            case 'csharp':
                return 'public bool IsPalindrome(int x) { }';
            case 'cpp':
                return 'bool isPalindrome(int x) { return false; }';
            default:
                return 'function isPalindrome(x) { }';
        }
    };
    useEffect(() => {
        const header = getFunctionHeader(language);
        setFunctionHeader(header);
        setSolutionCode(header + '\n');
    }, [language]);

    if (id !== '9') {
        return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
    }

    const problemDetails = {
        title: 'Numar Palindrom',
        difficulty: 'Usor',
        description: `
        ## Palindrome Number

        **Problema:**
        Dat un întreg \`x\`, returnați \`true\` dacă \`x\` este un palindrom și \`false\` în caz contrar.

        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: x = 121
        Output: true

        Exemplul 2:
        Input: x = -121
        Output: false

        Exemplul 3:
        Input: x = 10
        Output: false
        \`\`\`

        **Constrângeri:**
        \`\`\`
        -2^31 <= x <= 2^31 - 1
        \`\`\`

        **Follow up:** Puteți rezolva problema fără a converti întregul într-un șir de caractere?
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
            input: { x: 121 },
            expectedOutput: true
        },
        {
            input: { x: -121 },
            expectedOutput: false
        },
        {
            input: { x: 10 },
            expectedOutput: false
        },
        {
            input: { x: 0 },
            expectedOutput: true
        },
        {
            input: { x: 12321 },
            expectedOutput: true
        }
    ];
    
    const hiddenTestCases = [
        {
            input: { x: 2147447412 },
            expectedOutput: true
        },
        {
            input: { x: -2147447412 },
            expectedOutput: false
        },
        {
            input: { x: 1234567899 },
            expectedOutput: false
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
                            const actualOutput = isPalindrome(input.x);
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
                            const actualOutput = isPalindrome(input.x);
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
            
                    // Validare array rezultat
                    if (!Array.isArray(allResults)) {
                        console.error('Rezultatele testelor nu sunt un array valid:', allResults);
                        return [];
                    }
            
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
            input_x = test_case['input']['x']
            expected_output = test_case['expectedOutput']
            actual_output = isPalindrome(input_x)
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
            actual_output = isPalindrome(input_x)
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
                        put("x", 121);
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", -121);
                    }});
                    put("expectedOutput", false);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 10);
                    }});
                    put("expectedOutput", false);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 0);
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 12321);
                    }});
                    put("expectedOutput", true);
                }}
            );
    
            List<Map<String, Object>> hiddenTestCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 2147447412);
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", -2147447412);
                    }});
                    put("expectedOutput", false);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("x", 1234567899);
                    }});
                    put("expectedOutput", false);
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) testCases.get(i).get("input");
                int x = (int) input.get("x");
                boolean expectedOutput = (boolean) testCases.get(i).get("expectedOutput");
                boolean actualOutput = isPalindrome(x);
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
                boolean expectedOutput = (boolean) hiddenTestCases.get(i).get("expectedOutput");
                boolean actualOutput = isPalindrome(x);
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
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 121 } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", -121 } } }, { "expectedOutput", false } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 10 } } }, { "expectedOutput", false } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 0 } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 12321 } } }, { "expectedOutput", true } }
            };
    
            var hiddenTestCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 2147447412 } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", -2147447412 } } }, { "expectedOutput", false } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "x", 1234567899 } } }, { "expectedOutput", false } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                var input = (Dictionary<string, object>)testCases[i]["input"];
                int x = (int)input["x"];
                bool expectedOutput = (bool)testCases[i]["expectedOutput"];
                bool actualOutput = IsPalindrome(x);
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
                bool expectedOutput = (bool)hiddenTestCases[i]["expectedOutput"];
                bool actualOutput = IsPalindrome(x);
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
    
    bool isPalindrome(int x);
    
    void runTests() {
        std::vector<std::pair<int, bool>> testCases = {
            {121, true},
            {-121, false},
            {10, false},
            {0, true},
            {12321, true}
        };
    
        std::vector<std::pair<int, bool>> hiddenTestCases = {
            {2147447412, true},
            {-2147447412, false},
            {1234567899, false}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            int x = testCases[i].first;
            bool expectedOutput = testCases[i].second;
            bool actualOutput = isPalindrome(x);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "x: " + std::to_string(x);
            result["passed"] = passed ? "true" : "false";
            result["output"] = actualOutput ? "true" : "false";
            result["expected"] = expectedOutput ? "true" : "false";
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (int i = 0; i < hiddenTestCases.size(); ++i) {
            int x = hiddenTestCases[i].first;
            bool expectedOutput = hiddenTestCases[i].second;
            bool actualOutput = isPalindrome(x);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Hidden Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "x: " + std::to_string(x);
            result["passed"] = passed ? "true" : "false";
            result["output"] = actualOutput ? "true" : "false";
            result["expected"] = expectedOutput ? "true" : "false";
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
        setSolutionCode(value.trim());  // Salvăm codul introdus în editor
    };
    

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ width: '50%', padding: '20px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
                <h1>{problemDetails.title}</h1>
                <p>Problema cu ID-ul: <b>{id}</b></p>
                <p>Dificultate: <span style={{ color: 'green' }}>{problemDetails.difficulty}</span></p>
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

export default ProblemDetail8;