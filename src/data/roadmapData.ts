import { DayData } from '../types/roadmap';

export const ROADMAP_DAYS: DayData[] = [
  {
    dayId: 1,
    dayNumber: 'Day 1',
    unitTitle: 'Unit I: Foundations & Syntax',
    theme: 'purple',
    subtitle: 'Python Basics, Execution Model, Keywords & Lexical Elements',
    colorHex: '#9333ea', // Purple
    islandPosition: [0, 0, 16],
    cameraTarget: [0, 1.2, 16],
    cameraPosition: [0, 5, 25],
    floatingLabels: [
      'Programming languages',
      'History and features',
      'Installing Python and IDE',
      'Program structure',
      'Keywords and identifiers',
    ],
    keyHighlights: [
      'Guido van Rossum (1991), named after Monty Python',
      'Interpreted, dynamically typed, multi-paradigm language',
      'Bytecode compilation (.pyc) & PVM (Python Virtual Machine)',
      '35 reserved keywords, case-sensitive identifiers',
      'PEP 8 indentation rules (4 spaces, no curly braces)',
    ],
    quickSummary:
      'Day 1 sets the groundwork: master the interpreted execution pipeline, identifier naming constraints, reserved keywords, and basic I/O (input(), print() with sep and end).',
    topics: [
      {
        id: 'u1-1',
        title: 'Programming Languages & Python History',
        description:
          'High-level vs low-level languages, compiled vs interpreted execution. Python created by Guido van Rossum in 1989/1991 at CWI in Netherlands.',
        codeSnippet: `# Python is interpreted and dynamic
print("Hello, Python End-Sem!")
print(type(42), type("Roadmap")) # Dynamic type inspection`,
        examTip:
          'Common 2-mark question: Differentiate between Compiler and Interpreter. Remember Python compiles source code to Bytecode (.pyc) which PVM runs.',
      },
      {
        id: 'u1-2',
        title: 'Features of Python',
        description:
          'Simple & readable syntax, open-source, dynamically typed, platform independent, extensive standard library, automatic garbage collection.',
        codeSnippet: `# Garbage collection and dynamic typing
a = 100
a = "Reassigned to string" # Allowed in Python`,
        examTip:
          'Always mention "Batteries Included" philosophy and PEP 20 (The Zen of Python) in long-form answers.',
      },
      {
        id: 'u1-3',
        title: 'Installing Python, Virtualenvs & IDEs',
        description:
          'CPython runtime, package management using pip, IDLE, VS Code, and script execution modes (interactive REPL vs batch script).',
        codeSnippet: `# Command-line execution:
# python -m venv myenv
# source myenv/bin/activate
# python solution.py`,
      },
      {
        id: 'u1-4',
        title: 'Program Structure & Indentation',
        description:
          'Whitespace significance in Python: indentation defines blocks instead of curly braces. Multi-line statements with \\ or parentheses.',
        codeSnippet: `if True:
    x = 10 # 4 spaces standard
    y = (1 + 2 +
         3 + 4) # Implicit line continuation`,
        examTip:
          'IndentationError: unexpected indent is a frequent output-prediction trap in exam questions.',
      },
      {
        id: 'u1-5',
        title: 'Keywords and Identifiers',
        description:
          'Identifiers must start with a letter (a-z, A-Z) or underscore (_), cannot start with a digit, and cannot be any of Python\'s reserved keywords.',
        codeSnippet: `import keyword
print("Total keywords:", len(keyword.kwlist))
# Valid: _total_score, student1, calculate_gpa
# Invalid: 1student, class, for, my-var`,
        examTip:
          'Identify invalid identifiers: "2var", "for", "global", "my$val". None, True, False are keywords that start with uppercase!',
      },
    ],
    highYieldExamQuestions: [
      {
        question: 'Explain Python\'s execution model with a block diagram (Source -> Bytecode -> PVM).',
        answer:
          '1. Source code (.py) is compiled into platform-independent Bytecode (.pyc) by the compiler. 2. The Python Virtual Machine (PVM) interprets Bytecode into machine code line-by-line for the host OS.',
        marks: 5,
      },
      {
        question: 'Which of the following are valid variable names? 1_num, _total, elif, student_name, eval$',
        answer: 'Valid: _total, student_name. Invalid: 1_num (starts with digit), elif (keyword), eval$ (invalid character $).',
        marks: 3,
      },
    ],
  },
  {
    dayId: 2,
    dayNumber: 'Days 2-3',
    unitTitle: 'Unit II: Data Types & Operators',
    theme: 'purple',
    subtitle: 'Primitive Types (int, float, str, bool) & Operator Precedence',
    colorHex: '#7c3aed',
    islandPosition: [8, 1.5, 8],
    cameraTarget: [8, 2.5, 8],
    cameraPosition: [12, 7, 16],
    floatingLabels: [
      'int, float, str, bool',
      '+ - * / // % **',
      '== != < > <= >=',
      'and or not',
      '+= -= *= /=',
      'in, not in',
      'is, is not',
    ],
    keyHighlights: [
      'Four core primitives: int (arbitrary precision), float (IEEE 754), str (immutable unicode), bool (subclass of int)',
      'Floor division // vs true division / (always returns float)',
      'Short-circuit evaluation of logical operators and / or',
      'Identity (is) tests object memory address (id()), equality (==) tests values',
      'Membership operators (in, not in) for collections & strings',
    ],
    quickSummary:
      'Days 2-3 dive into types and operators. Master integer division truncation, modulo quirks with negative numbers, string indexing/slicing, and the difference between == and is.',
    topics: [
      {
        id: 'u2-1',
        title: 'Data Types: int, float, str, bool',
        description:
          'Integers have unlimited precision in Python 3. Floats are 64-bit double precision. Strings are immutable sequences. Bools are True/False (numeric 1/0).',
        codeSnippet: `x = 2 ** 100 # Large integer handled automatically
s = "Python"
print(s[0], s[-1]) # Indexing: 'P', 'n'
print(isinstance(True, int)) # True! bool inherits from int`,
        examTip:
          'Remember strings in Python are IMMUTABLE. Calling s.replace() returns a new string and does not modify s in place.',
      },
      {
        id: 'u2-2',
        title: 'Arithmetic Operators (+, -, *, /, //, %, **)',
        description:
          'Division / always results in float. Floor division // truncates towards negative infinity. ** is right-associative power operator.',
        codeSnippet: `print(7 / 2)   # 3.5 (float)
print(7 // 2)  # 3 (integer)
print(-7 // 2) # -4 (rounds DOWN towards negative infinity)
print(2 ** 3 ** 2) # 512, right-associative: 2 ** (3 ** 2)`,
        examTip:
          'Frequent viva trap: What is -7 // 2? It is -4, not -3, because Python floors towards negative infinity!',
      },
      {
        id: 'u2-3',
        title: 'Relational & Comparison Operators (==, !=, <, >, <=, >=)',
        description:
          'Chained comparisons are valid in Python! e.g., 1 < x < 10 evaluates as (1 < x) and (x < 10).',
        codeSnippet: `x = 5
print(1 < x < 10) # True: chained comparison
print("apple" < "banana") # Lexicographical string comparison`,
      },
      {
        id: 'u2-4',
        title: 'Logical Operators (and, or, not) & Short-Circuit',
        description:
          'Python logical operators return the value that determined the truthiness, not just True/False!',
        codeSnippet: `print(0 or "Fallback") # 'Fallback'
print("Hello" and 42)   # 42 (short-circuits at end)
print(not [])           # True (empty list is falsy)`,
        examTip:
          'Know falsy values: None, False, 0, 0.0, empty collections ("", [], (), {}).',
      },
      {
        id: 'u2-5',
        title: 'Assignment, Membership (in) & Identity (is)',
        description:
          '== checks values equality; is checks object identity (same memory address). in checks container presence.',
        codeSnippet: `a = [1, 2]
b = [1, 2]
print(a == b) # True (same values)
print(a is b) # False (different heap locations)
print(2 in a) # True`,
        examTip:
          'Explain why "a is b" is False for two separate lists with identical items, but can be True for small cached integers (-5 to 256).',
      },
    ],
    highYieldExamQuestions: [
      {
        question: 'Differentiate between the "==" operator and the "is" operator in Python with an example.',
        answer:
          '"==" evaluates value equality (invokes __eq__), while "is" evaluates reference equality / object identity (checks if id(a) == id(b)). Example: a = [1]; b = [1] -> a == b is True, but a is b is False.',
        marks: 4,
      },
      {
        question: 'What is the output of print(2 ** 2 ** 3) and print(-13 // 5)?',
        answer: '2 ** 2 ** 3 evaluates as 2 ** (2 ** 3) = 2 ** 8 = 256. -13 // 5 evaluates to -3 (floored towards -inf).',
        marks: 3,
      },
    ],
  },
  {
    dayId: 3,
    dayNumber: 'Days 4-5',
    unitTitle: 'Unit III: Control Flow & Loops',
    theme: 'purple',
    subtitle: 'Conditionals (if/elif/else) & Loops (for/while, break/continue/pass)',
    colorHex: '#6d28d9',
    islandPosition: [-2, 3.5, -3],
    cameraTarget: [-2, 4.5, -3],
    cameraPosition: [-1, 10, 8],
    floatingLabels: [
      'if, if-else, nested if, elif',
      'while, for in range()',
      'break, continue, pass',
      'for-else & while-else',
    ],
    keyHighlights: [
      'Multi-way branching: if-elif-elif-else construct',
      'Nested conditions and boundary condition handling',
      'Definite loops with for ... in range(start, stop, step)',
      'Indefinite while loops and sentinel controlled iteration',
      'Loop control: break exits, continue skips, pass is a no-op placeholder',
      'The unique Python loop-else clause (runs if NO break occurred)',
    ],
    quickSummary:
      'The largest unit: Decision making and iterative execution. Pay special attention to range() parameters, off-by-one errors, infinite loops, and the Python loop "else" clause.',
    topics: [
      {
        id: 'u3-1',
        title: 'Decision Making: if, if-else, elif, and Nested if',
        description:
          'Evaluates boolean test expressions. Only the first truthy block executes in an if-elif ladder.',
        codeSnippet: `score = 85
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
else:
    grade = 'F'
print(f"Grade: {grade}")`,
        examTip:
          'Watch out for missing colon (:) syntax error or indentation mismatch in handwritten answers.',
      },
      {
        id: 'u3-2',
        title: 'For Loops & The range() Function',
        description:
          'Iterates over any sequence (strings, lists, tuples, range). range(start, stop, step) generates numbers up to stop-1.',
        codeSnippet: `# range(start, stop, step)
for i in range(1, 10, 2):
    print(i, end=' ') # 1 3 5 7 9
print()

for char in "Python":
    pass # Iterate characters directly`,
        examTip:
          'Remember: range(stop) defaults start=0, step=1. range(1, 5) produces 1, 2, 3, 4 (5 is excluded!).',
      },
      {
        id: 'u3-3',
        title: 'While Loops & Sentinel Variables',
        description:
          'Repeats while a condition is True. Ensure loop variable is updated to prevent infinite loops.',
        codeSnippet: `count = 3
while count > 0:
    print(f"T-minus {count}")
    count -= 1 # Loop variable modification`,
      },
      {
        id: 'u3-4',
        title: 'Jump Statements: break, continue, pass',
        description:
          'break terminates loop immediately; continue skips to next iteration; pass is a syntactically necessary null statement.',
        codeSnippet: `for n in range(10):
    if n == 2:
        continue # Skip printing 2
    if n == 6:
        break    # Stop iteration at 6
    print(n, end=' ')
# Output: 0 1 3 4 5`,
        examTip:
          'Differentiate pass and continue: continue skips the remainder of current iteration, pass does nothing and continues executing subsequent lines in that iteration.',
      },
      {
        id: 'u3-5',
        title: 'Loop-Else Construct (Unique to Python)',
        description:
          'The else block of a for/while loop executes ONLY if the loop completes normally without encountering a break.',
        codeSnippet: `target = 7
numbers = [1, 3, 5, 9]
for num in numbers:
    if num == target:
        print("Found!")
        break
else:
    print("Target not found in list") # Executes!`,
        examTip:
          'Very popular 3-mark trick question: Does the loop "else" run when break is executed? NO! It only runs on natural loop completion.',
      },
    ],
    highYieldExamQuestions: [
      {
        question: 'Explain the difference between "break", "continue", and "pass" with examples.',
        answer:
          'break: terminates loop entirely and moves execution to post-loop. continue: abandons rest of current iteration and jumps to condition check. pass: null statement placeholder to satisfy Python indentation grammar.',
        marks: 5,
      },
      {
        question: 'Write a Python program to check whether a given integer is Prime using a for-else loop.',
        answer:
          'n = int(input()); is_prime = True if n > 1 else False; for i in range(2, int(n**0.5)+1): if n % i == 0: is_prime = False; break; else: is_prime = True',
        marks: 5,
      },
    ],
  },
  {
    dayId: 4,
    dayNumber: 'Day 6',
    unitTitle: 'Unit IV: Mixed Practice & Timed Drills',
    theme: 'teal',
    subtitle: 'Comprehensive Problem Solving, Output Prediction & Mock Exam',
    colorHex: '#0d9488', // Teal
    islandPosition: [7, 5, -14],
    cameraTarget: [7, 6, -14],
    cameraPosition: [7, 11, -3],
    floatingLabels: [
      'Output prediction drills',
      'Trace tables & dry-runs',
      'Error debugging exercises',
      'Timed 60-min mock test',
      'Common exam traps',
    ],
    keyHighlights: [
      'Solve 15 output prediction questions under time pressure',
      'Draw trace tables for nested loops and accumulator variables',
      'Find and fix common syntax, semantic, and runtime errors',
      'Master pattern generation (stars, numbers) with nested loops',
      'Time management: allocate 1.5 minutes per mark in end-semesters',
    ],
    quickSummary:
      'Day 6 is rigorous practice. Test yourself on mock questions, debug intentional code bugs, and practice dry-running nested loops on paper.',
    topics: [
      {
        id: 'u4-1',
        title: 'Output Prediction Drills',
        description:
          'Sharpen mental execution by predicting outputs for tricky operator precedence and loop combinations.',
        codeSnippet: `x = 10
y = 20
x, y = y, x + y # Tuple packing/unpacking
print("x =", x, "y =", y) # x = 20, y = 30`,
        examTip:
          'Right-hand side of simultaneous assignment is evaluated completely BEFORE binding to left-hand variables.',
      },
      {
        id: 'u4-2',
        title: 'Nested Loop Patterns (Pyramids & Triangles)',
        description:
          'Classic 5-mark university exam questions: generate right-angled triangles, pyramids, and Floyd\'s triangle.',
        codeSnippet: `rows = 5
for i in range(1, rows + 1):
    print(" " * (rows - i) + "* " * i)`,
      },
      {
        id: 'u4-3',
        title: 'Debugging Common Exceptions',
        description:
          'Recognize TypeError, ValueError, IndexError, SyntaxError, and ZeroDivisionError before running code.',
        codeSnippet: `try:
    val = int("hello")
except ValueError as e:
    print("Handled expected conversion error:", e)`,
      },
      {
        id: 'u4-4',
        title: 'Fibonacci, Factorial & Palindrome Algorithms',
        description:
          'Standard iteration-based number theory programs tested in 80% of introductory end-sem papers.',
        codeSnippet: `def is_palindrome(s):
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

print(is_palindrome("racecar")) # True`,
      },
    ],
    highYieldExamQuestions: [
      {
        question: 'Predict the output: for i in range(1, 4): for j in range(i): print(i, end=""); print()',
        answer: 'Line 1: 1\\nLine 2: 22\\nLine 3: 333',
        marks: 3,
      },
      {
        question: 'Write a Python program to print the first N terms of the Fibonacci series without recursion.',
        answer: 'a, b = 0, 1; for _ in range(n): print(a, end=" "); a, b = b, a + b',
        marks: 5,
      },
    ],
  },
  {
    dayId: 5,
    dayNumber: 'Day 7',
    unitTitle: 'Unit V: Final Revision Summit',
    theme: 'teal',
    subtitle: 'Cheat Sheet Master Review, Formulae, Pitfalls & Exam Checklist',
    colorHex: '#14b8a6', // Teal
    islandPosition: [-4, 7, -25],
    cameraTarget: [-4, 8.5, -25],
    cameraPosition: [-4, 13, -13],
    floatingLabels: [
      '1-Page Cheat Sheet',
      'Operator precedence table',
      'Mutable vs Immutable types',
      'Last-minute revision checklist',
      'Exam hall strategy',
    ],
    keyHighlights: [
      'Complete 1-page Python master cheat sheet on the summit pedestal',
      'Operator precedence: () -> ** -> +x, -x -> *, /, //, % -> +, - -> in, is, ==, != -> not -> and -> or',
      'Strict memorization: id(), type(), input(), print(..., sep, end)',
      'Sleep well, bring your student ID and pens, write clean comments on paper',
      'Summit victory flag representing complete exam readiness!',
    ],
    quickSummary:
      'The highest summit: Day 7 is calm, focused review. Review the one-page cheat sheet, cement operator precedence, and enter the examination hall with full confidence.',
    topics: [
      {
        id: 'u5-1',
        title: 'Master Operator Precedence Table (Highest to Lowest)',
        description:
          '1. () Parentheses\\n2. ** Exponentiation (right-to-left)\\n3. +x, -x, ~x Unary\\n4. *, /, //, % Multiplication & Division\\n5. +, - Addition & Subtraction\\n6. in, not in, is, is not, <, <=, >, >=, ==, != Comparisons\\n7. not Logical NOT\\n8. and Logical AND\\n9. or Logical OR',
        codeSnippet: `# Precedence evaluation example:
res = 3 + 4 * 2 > 10 and not False
# 4 * 2 = 8 -> 3 + 8 = 11 -> 11 > 10 = True -> True and True -> True
print(res) # True`,
        examTip:
          'When in doubt on written papers, write explicit step-by-step parentheses to show the examiner your evaluation order!',
      },
      {
        id: 'u5-2',
        title: 'Mutable vs Immutable Memory Matrix',
        description:
          'Immutable: int, float, bool, str, tuple, frozenset. Mutable: list, dict, set, bytearray. Modifications on immutable types allocate new objects in heap.',
        codeSnippet: `x = 10
orig_id = id(x)
x += 1
print(orig_id == id(x)) # False! New int object created`,
      },
      {
        id: 'u5-3',
        title: 'End-Sem Exam Presentation Strategy',
        description:
          '1. Write comments in code answers for partial credit. 2. Mention time/space complexity if asked. 3. Always test edge cases (0, negative numbers, empty strings). 4. Use meaningful variable names.',
      },
    ],
    highYieldExamQuestions: [
      {
        question: 'Explain the difference between mutable and immutable data types in Python with 2 examples each.',
        answer:
          'Mutable objects can be modified in-place without changing their memory address (id). Examples: list, dict, set. Immutable objects cannot be modified after creation; any modification yields a new object. Examples: int, float, str, tuple.',
        marks: 5,
      },
      {
        question: 'Evaluate the expression: 10 + 5 * 2 ** 2 - 8 // 2',
        answer:
          'Step 1: 2 ** 2 = 4 (Exponentiation). Step 2: 5 * 4 = 20, 8 // 2 = 4 (Mul and Div). Step 3: 10 + 20 - 4 = 26 (Add and Sub). Result: 26.',
        marks: 4,
      },
    ],
  },
];

export const FULL_CHEAT_SHEET_CONTENT = {
  title: 'Python End-Semester Master Cheat Sheet',
  subtitle: 'High-Yield Quick Revision Reference (Units I - III & Exam Drills)',
  sections: [
    {
      category: '1. Syntax & Core Primitives',
      items: [
        { label: 'Identifiers', text: '[A-Za-z_][A-Za-z0-9_]*, case-sensitive, cannot be keyword' },
        { label: 'Keywords (35)', text: 'True, False, None (capitalized); if, elif, else, while, for, in, is, def, return, break, continue, pass, try, except, import...' },
        { label: 'Data Types', text: 'int (infinite precision), float (64-bit), str (immutable unicode), bool (subclass of int), list, tuple, dict, set' },
        { label: 'I/O', text: 'print(*args, sep=" ", end="\\n"), var = int(input("Prompt: "))' },
      ],
    },
    {
      category: '2. Operator Precedence Hierarchy',
      items: [
        { label: '1 (Highest)', text: '() Grouping parentheses' },
        { label: '2', text: '** Exponentiation (associates Right-to-Left: 2**3**2 = 512)' },
        { label: '3', text: '+x, -x, ~x Unary plus/minus/bitwise-not' },
        { label: '4', text: '*, /, //, % Multiplication, Division, Floor division, Remainder' },
        { label: '5', text: '+, - Addition and Subtraction' },
        { label: '6', text: '<, <=, >, >=, ==, !=, is, is not, in, not in Comparisons/Membership/Identity' },
        { label: '7', text: 'not Boolean NOT' },
        { label: '8', text: 'and Boolean AND (short-circuit: returns 1st falsy or last truthy)' },
        { label: '9 (Lowest)', text: 'or Boolean OR (short-circuit: returns 1st truthy or last falsy)' },
      ],
    },
    {
      category: '3. Division & Modulo Edge Traps',
      items: [
        { label: '7 / 2', text: '3.5 (Always returns float)' },
        { label: '7 // 2', text: '3 (Truncates down)' },
        { label: '-7 // 2', text: '-4 (Truncates towards negative infinity!)' },
        { label: '7 % 3', text: '1 (Remainder)' },
        { label: '-7 % 3', text: '2 (Formula: r = a - (b * (a // b)) -> -7 - (3 * -3) = 2)' },
      ],
    },
    {
      category: '4. Conditionals & Loops',
      items: [
        { label: 'Ladder', text: 'if cond: ... elif cond: ... else: ...' },
        { label: 'range()', text: 'range(start=0, stop, step=1) -> excludes stop value!' },
        { label: 'break', text: 'Immediately terminates the nearest enclosing loop' },
        { label: 'continue', text: 'Skips remainder of current iteration, jumps to condition check' },
        { label: 'pass', text: 'No-op statement placeholder for syntactically empty blocks' },
        { label: 'Loop-Else', text: 'for ... else: runs ONLY if loop completes WITHOUT hitting a break' },
      ],
    },
    {
      category: '5. Common Exam Pitfalls',
      items: [
        { label: '== vs is', text: '== compares values; is compares identity (memory addresses id())' },
        { label: 'String Immutability', text: 's[0] = "x" raises TypeError! Strings cannot be mutated in place' },
        { label: 'Falsy Values', text: 'None, False, 0, 0.0, "", [], (), {}, set()' },
        { label: 'Chained Compare', text: '1 < x < 5 is valid Python and means (1 < x) and (x < 5)' },
      ],
    },
  ],
};
