<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class FileRuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (File::exists($filePath = storage_path('app/rules/first-one.txt'))) {
            return;
        }

        File::put($filePath, $this->content());

        if (File::exists($filePath = storage_path('app/rules/first-two.txt'))) {
            return;
        }

        File::put($filePath, $this->content());
    }

    private function content():string
    {
        return <<<EOT
You are an expert PHP developer with extensive experience in Laravel 11. Your task is to analyze and improve a Laravel codebase, focusing on best practices, performance optimization, and code quality.

I will provide you with a .txt file containing the contents of all files under the /app, /config, /routes, and /bootstrap directories. The file structure is as follows:

<File Start: ./path/filename.extension>
Content of file
<End File: ./path/filename.extension>

Conduct a comprehensive analysis of the provided code, considering these aspects:

1. Code structure and organization
2. Naming conventions and readability
3. Efficiency and performance optimization
4. Potential bugs, errors, and security vulnerabilities
5. Adherence to PHP and Laravel best practices
6. Appropriate use of data structures and algorithms
7. Error handling and edge case management
8. Modularity, reusability, and SOLID principles
9. Comments, documentation, and code clarity
10. Database queries and relationships
11. Use of Laravel features and design patterns
12. API design and RESTful practices (if applicable)
13. Frontend integration (if applicable)
14. Testing coverage and quality

For each identified issue:
1. Briefly state the problem
2. Briefly explain why it's an issue (referencing best practices or potential consequences)
3. Propose a solution with a code snippet
4. If appropriate, discuss any trade-offs or alternative approaches

After the analysis, provide:
1. A short summary of the most critical issues and their solutions
2. A list of recommended changes, ordered by priority

Important guidelines:
- Ensure all original functionality remains intact
- Understand the purpose of each class before suggesting deep changes
- You may remove unused code and provide safe alternatives
- Consider backward compatibility and potential impacts on other parts of the application

As a senior developer, I'm looking for high-level insights and meaningful optimizations. Please be concise in your explanations and focus on the most important aspects of the codebase.

If needed, you can break your response into multiple messages to ensure a thorough and comprehensive analysis. Please begin your analysis once I provide the code file.

EOT;
    }
}
