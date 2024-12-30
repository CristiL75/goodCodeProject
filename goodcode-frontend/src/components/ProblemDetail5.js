import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const ProblemDetail5 = () => {
    const { id } = useParams();

    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [functionHeader, setFunctionHeader] = useState('function convert(s, numRows) { }');
    const [solutionCode, setSolutionCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const userId = localStorage.getItem('username');
    console.log("userId:", userId);
    console.log("id:", id); 

    const getFunctionHeader = (language) => {
        switch (language) {
            case 'python':
                return 'def convert(s, numRows):';
            case 'java':
                return 'public String convert(String s, int numRows) { }';
            case 'csharp':
                return 'public string Convert(string s, int numRows) { }';
            case 'cpp':
                return 'string convert(string s, int numRows) { return ""; }';
            default:
                return 'function convert(s, numRows) { }';
        }
    };

    useEffect(() => {
        const header = getFunctionHeader(language);
        setFunctionHeader(header);
        setSolutionCode(header + '\n');
    }, [language]);

    if (id !== '6') {
        return <div>Problema cu ID-ul {id} nu este disponibilă.</div>;
    }

    const problemDetails = {
        title: 'Conversie în zigzag',
        difficulty: 'Mediu',
        description: `
        ## Conversie în zigzag
    
        **Problema:**
        Șirul de caractere "PAYPALISHIRING" este scris într-un model zigzag pe un număr dat de rânduri astfel: (poate doriți să afișați acest model într-o fontă fixă pentru o mai bună lizibilitate)
    
        P   A   H   N
        A P L S I I G
        Y   I   R
    
        Apoi citiți linie cu linie: "PAHNAPLSIIGYIR"
    
        Scrieți codul care va lua un șir de caractere și va face această conversie dat un număr de rânduri:
    
        string convert(string s, int numRows);
    
        **Exemplu:**
        \`\`\`
        Exemplul 1:
        Input: s = "PAYPALISHIRING", numRows = 3
        Output: "PAHNAPLSIIGYIR"
    
        Exemplul 2:
        Input: s = "PAYPALISHIRING", numRows = 4
        Output: "PINALSIGYAHRPI"
        Explicație:
        P     I    N
        A   L S  I G
        Y A   H R
        P     I
    
        Exemplul 3:
        Input: s = "A", numRows = 1
        Output: "A"
        \`\`\`
    
        **Constrângeri:**
        \`\`\`
        1 <= s.length <= 1000
        s constă doar din litere englezești (majuscule și minuscule), ',' și '.'.
        1 <= numRows <= 1000
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
            input: { s: "PAYPALISHIRING", numRows: 3 },
            expectedOutput: "PAHNAPLSIIGYIR"
        },
        {
            input: { s: "PAYPALISHIRING", numRows: 4 },
            expectedOutput: "PINALSIGYAHRPI"
        },
        {
            input: { s: "A", numRows: 1 },
            expectedOutput: "A"
        }
    ];
    
    const hiddenTestCases = [
        {
            input: { s: "HELLO", numRows: 2 },
            expectedOutput: "HLOEL"
        },
        {
            input: { s: "ZIGZAGCONVERSION", numRows: 5 },
            expectedOutput: "ZCNVREIOGZASOIGN"
        },
        {
            input: { s: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", numRows: 6 },
            expectedOutput: "AKUBJLTVCIMSWDHNRXEGOPYFQZ"
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
                
                // Verifică dacă funcția convert() există înainte de a o apela
                if (typeof convert !== 'function') {
                    console.error('Funcția convert() nu este definită');
                    return;
                }
            
                // Mapează testele pentru testele vizibile
                const results = testCases.map(({ input, expectedOutput }, index) => {
                    const actualOutput = convert(input.s, input.numRows);
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
                    const actualOutput = convert(input.s, input.numRows);
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
                const allResults = results.concat(hiddenResults);
            
                if (!Array.isArray(allResults)) {
                    console.error('Rezultatele nu sunt un array valid:', allResults);
                    return;
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
            input_s = test_case['input']['s']
            input_numRows = test_case['input']['numRows']
            expected_output = test_case['expectedOutput']
            actual_output = convert(input_s, input_numRows)
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
            input_numRows = test_case['input']['numRows']
            expected_output = test_case['expectedOutput']
            actual_output = convert(input_s, input_numRows)
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
                        put("s", "PAYPALISHIRING");
                        put("numRows", 3);
                    }});
                    put("expectedOutput", "PAHNAPLSIIGYIR");
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "PAYPALISHIRING");
                        put("numRows", 4);
                    }});
                    put("expectedOutput", "PINALSIGYAHRPI");
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "A");
                        put("numRows", 1);
                    }});
                    put("expectedOutput", "A");
                }}
            );
    
            List<Map<String, Object>> hiddenTestCases = Arrays.asList(
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "HELLO");
                        put("numRows", 2);
                    }});
                    put("expectedOutput", "HLOEL");
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "ZIGZAGCONVERSION");
                        put("numRows", 5);
                    }});
                    put("expectedOutput", "ZCNVREIOGZASOIGN");
                }},
                new HashMap<String, Object>() {{
                    put("input", new HashMap<String, Object>() {{
                        put("s", "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                        put("numRows", 6);
                    }});
                    put("expectedOutput", "AKUBJLTVCIMSWDHNRXEGOPYFQZ");
                }}
            );
    
            List<Map<String, Object>> results = new ArrayList<>();
            for (int i = 0; i < testCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) testCases.get(i).get("input");
                String s = (String) input.get("s");
                int numRows = (int) input.get("numRows");
                String expectedOutput = (String) testCases.get(i).get("expectedOutput");
                String actualOutput = convert(s, numRows);
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
            for (int i = 0; i < hiddenTestCases.size(); i++) {
                Map<String, Object> input = (Map<String, Object>) hiddenTestCases.get(i).get("input");
                String s = (String) input.get("s");
                int numRows = (int) input.get("numRows");
                String expectedOutput = (String) hiddenTestCases.get(i).get("expectedOutput");
                String actualOutput = convert(s, numRows);
                boolean passed = actualOutput.equals(expectedOutput);
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
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "PAYPALISHIRING" }, { "numRows", 3 } } }, { "expectedOutput", "PAHNAPLSIIGYIR" } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "PAYPALISHIRING" }, { "numRows", 4 } } }, { "expectedOutput", "PINALSIGYAHRPI" } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "A" }, { "numRows", 1 } } }, { "expectedOutput", "A" } }
            };
    
            var hiddenTestCases = new List<Dictionary<string, object>> {
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "HELLO" }, { "numRows", 2 } } }, { "expectedOutput", "HLOEL" } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "ZIGZAGCONVERSION" }, { "numRows", 5 } } }, { "expectedOutput", "ZCNVREIOGZASOIGN" } },
                new Dictionary<string, object> { { "input", new Dictionary<string, object> { { "s", "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }, { "numRows", 6 } } }, { "expectedOutput", "AKUBJLTVCIMSWDHNRXEGOPYFQZ" } }
            };
    
            var results = new List<Dictionary<string, object>>();
            for (int i = 0; i < testCases.Count; i++) {
                var input = (Dictionary<string, object>)testCases[i]["input"];
                string s = (string)input["s"];
                int numRows = (int)input["numRows"];
                string expectedOutput = (string)testCases[i]["expectedOutput"];
                string actualOutput = Convert(s, numRows);
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
                int numRows = (int)input["numRows"];
                string expectedOutput = (string)hiddenTestCases[i]["expectedOutput"];
                string actualOutput = Convert(s, numRows);
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
    
    std::string convert(std::string s, int numRows);
    
    void runTests() {
        std::vector<std::pair<std::pair<std::string, int>, std::string>> testCases = {
            {{"PAYPALISHIRING", 3}, "PAHNAPLSIIGYIR"},
            {{"PAYPALISHIRING", 4}, "PINALSIGYAHRPI"},
            {{"A", 1}, "A"}
        };
    
        std::vector<std::pair<std::pair<std::string, int>, std::string>> hiddenTestCases = {
            {{"HELLO", 2}, "HLOEL"},
            {{"ZIGZAGCONVERSION", 5}, "ZCNVREIOGZASOIGN"},
            {{"ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6}, "AKUBJLTVCIMSWDHNRXEGOPYFQZ"}
        };
    
        std::vector<std::unordered_map<std::string, std::string>> results;
        for (int i = 0; i < testCases.size(); ++i) {
            std::string s = testCases[i].first.first;
            int numRows = testCases[i].first.second;
            std::string expectedOutput = testCases[i].second;
            std::string actualOutput = convert(s, numRows);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s + ", numRows: " + std::to_string(numRows);
            result["passed"] = passed ? "true" : "false";
            result["output"] = actualOutput;
            result["expected"] = expectedOutput;
            result["error"] = passed ? "" : "Output does not match expected result";
            results.push_back(result);
        }
        for (int i = 0; i < hiddenTestCases.size(); ++i) {
            std::string s = hiddenTestCases[i].first.first;
            int numRows = hiddenTestCases[i].first.second;
            std::string expectedOutput = hiddenTestCases[i].second;
            std::string actualOutput = convert(s, numRows);
            bool passed = actualOutput == expectedOutput;
            std::cout << "Hidden Test Case " << (i + 1) << ":\nExpected: " << expectedOutput << "\nActual: " << actualOutput << "\nResult: " << (passed ? "Passed" : "Failed") << std::endl;
            std::unordered_map<std::string, std::string> result;
            result["testCase"] = "s: " + s + ", numRows: " + std::to_string(numRows);
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

export default ProblemDetail5;