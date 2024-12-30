import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const ProblemDetail9 = () => {
    const { id } = useParams();

    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [functionHeader, setFunctionHeader] = useState('function isMatch(s, p) { }');
    const [solutionCode, setSolutionCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const userId = localStorage.getItem('username');
    console.log("userId:", userId);
    console.log("id:", id); 

    const getFunctionHeader = (language) => {
        switch (language) {
            case 'python':
                return 'def isMatch(s, p):';
            case 'java':
                return 'public boolean isMatch(String s, String p) { }';
            case 'csharp':
                return 'public bool IsMatch(string s, string p) { }';
            case 'cpp':
                return 'bool isMatch(std::string s, std::string p) { return false; }';
            default:
                return 'function isMatch(s, p) { }';
        }
    };

    useEffect(() => {
        const header = getFunctionHeader(language);
        setFunctionHeader(header);
        setSolutionCode(header + '\n');
    }, [language]);

    if (id !== '10') {
        return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
    }

    const problemDetails = {
        title: 'Potrivire cu expresie regulată',
        difficulty: 'Greu',
        description: `
        ## Potrivire cu expresie regulată

        **Problema:**
        Dat un șir de caractere \`s\` și un model \`p\`, implementați potrivirea expresiei regulate cu suport pentru '.' și '*' unde:

        - '.' Potrivește orice caracter unic.
        - '*' Potrivește zero sau mai multe din elementul precedent.

        Potrivirea ar trebui să acopere întregul șir de intrare (nu parțial).

        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: s = "aa", p = "a"
        Output: false

        Exemplul 2:
        Input: s = "aa", p = "a*"
        Output: true

        Exemplul 3:
        Input: s = "ab", p = ".*"
        Output: true
        \`\`\`

        **Constrângeri:**
        \`\`\`
        1 <= s.length <= 20
        1 <= p.length <= 20
        s conține doar litere mici englezești.
        p conține doar litere mici englezești, '.', și '*'.
        Este garantat că pentru fiecare apariție a caracterului '*', va exista un caracter valid anterior pentru a se potrivi.
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
            input: { s: "aa", p: "a" },
            expectedOutput: false
        },
        {
            input: { s: "aa", p: "a*" },
            expectedOutput: true
        },
        {
            input: { s: "ab", p: ".*" },
            expectedOutput: true
        },
        {
            input: { s: "aab", p: "c*a*b" },
            expectedOutput: true
        },
        {
            input: { s: "mississippi", p: "mis*is*p*." },
            expectedOutput: false
        }
    ];
    
    const hiddenTestCases = [
        {
            input: { s: "ab", p: ".*c" },
            expectedOutput: false
        },
        {
            input: { s: "aaa", p: "a*a" },
            expectedOutput: true
        },
        {
            input: { s: "aaa", p: "ab*a*c*a" },
            expectedOutput: true
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
                
                // Asigură-te că testCases și hiddenTestCases sunt array-uri
                if (!Array.isArray(testCases) || !Array.isArray(hiddenTestCases)) {
                    console.error('Test cases or hidden test cases are not valid arrays.');
                    return [];
                }
            
                const results = testCases.map(({ input, expectedOutput }, index) => {
                    const actualOutput = isMatch(input.s, input.p);
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
            
                const hiddenResults = hiddenTestCases.map(({ input, expectedOutput }, index) => {
                    const actualOutput = isMatch(input.s, input.p);
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
            
                const allResults = [...results, ...hiddenResults]; // Folosește spread pentru concatenare
            
                if (!Array.isArray(allResults)) {
                    console.error('Combined results are not a valid array:', allResults);
                    return [];
                }
            
                console.log('Final Results:', JSON.stringify(allResults, null, 2));
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
            input_p = test_case['input']['p']
            expected_output = test_case['expectedOutput']
            actual_output = isMatch(input_s, input_p)
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
            input_p = test_case['input']['p']
            expected_output = test_case['expectedOutput']
            actual_output = isMatch(input_s, input_p)
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
                        put("s", "aa");
                        put("p", "a");
                    }});
                    put("expectedOutput", false);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "aa");
                        put("p", "a*");
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "ab");
                        put("p", ".*");
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "aab");
                        put("p", "c*a*b");
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "mississippi");
                        put("p", "mis*is*p*.");
                    }});
                    put("expectedOutput", false);
                }}
            );
    
            List<Map<String, Object>> hiddenTestCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "ab");
                        put("p", ".*c");
                    }});
                    put("expectedOutput", false);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "aaa");
                        put("p", "a*a");
                    }});
                    put("expectedOutput", true);
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "aaa");
                        put("p", "ab*a*c*a");
                    }});
                    put("expectedOutput", true);
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) testCases.get(i).get("input");
                String s = (String) input.get("s");
                String p = (String) input.get("p");
                boolean expectedOutput = (boolean) testCases.get(i).get("expectedOutput");
                boolean actualOutput = isMatch(s, p);
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
                String p = (String) input.get("p");
                boolean expectedOutput = (boolean) hiddenTestCases.get(i).get("expectedOutput");
                boolean actualOutput = isMatch(s, p);
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
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "aa" }, { "p", "a" } } }, { "expectedOutput", false } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "aa" }, { "p", "a*" } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "ab" }, { "p", ".*" } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "aab" }, { "p", "c*a*b" } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "mississippi" }, { "p", "mis*is*p*." } } }, { "expectedOutput", false } }
            };
    
            var hiddenTestCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "ab" }, { "p", ".*c" } } }, { "expectedOutput", false } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "aaa" }, { "p", "a*a" } } }, { "expectedOutput", true } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "aaa" }, { "p", "ab*a*c*a" } } }, { "expectedOutput", true } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                var input = (Dictionary<string, object>)testCases[i]["input"];
                string s = (string)input["s"];
                string p = (string)input["p"];
                bool expectedOutput = (bool)testCases[i]["expectedOutput"];
                bool actualOutput = IsMatch(s, p);
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
                string p = (string)input["p"];
                bool expectedOutput = (bool)hiddenTestCases[i]["expectedOutput"];
                bool actualOutput = IsMatch(s, p);
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
    
    bool isMatch(std::string s, std::string p);
    
    void runTests() {
        std::vector<std::pair<std::pair<std::string, std::string>, bool>> testCases = {
            {{"aa", "a"}, false},
            {{"aa", "a*"}, true},
            {{"ab", ".*"}, true},
            {{"aab", "c*a*b"}, true},
            {{"mississippi", "mis*is*p*."}, false}
        };
    
        std::vector<std::pair<std::pair<std::string, std::string>, bool>> hiddenTestCases = {
            {{"ab", ".*c"}, false},
            {{"aaa", "a*a"}, true},
            {{"aaa", "ab*a*c*a"}, true}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            std::string s = testCases[i].first.first;
            std::string p = testCases[i].first.second;
            bool expectedOutput = testCases[i].second;
            bool actualOutput = isMatch(s, p);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s + ", p: " + p;
            result["passed"] = passed ? "true" : "false";
            result["output"] = actualOutput ? "true" : "false";
            result["expected"] = expectedOutput ? "true" : "false";
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (int i = 0; i < hiddenTestCases.size(); ++i) {
            std::string s = hiddenTestCases[i].first.first;
            std::string p = hiddenTestCases[i].first.second;
            bool expectedOutput = hiddenTestCases[i].second;
            bool actualOutput = isMatch(s, p);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Hidden Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s + ", p: " + p;
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
        setSolutionCode(value.trim());  // Salvăm codul introdus în editor, eliminând spațiile suplimentare
    };
    
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ width: '50%', padding: '20px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
                <h1>{problemDetails.title}</h1>
                <p>Problema cu ID-ul: <b>{id}</b></p>
                <p>Dificultate: <span style={{ color: 'red' }}>{problemDetails.difficulty}</span></p>
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

export default ProblemDetail9;