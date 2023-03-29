export const consoleInitializer = (userLang) => {
    
    switch (userLang) {
      case "javascript":
        return 'console.log("Javascript mode active...")';

      case "java":
        return 'public class HelloWorld { public static void main(String[] args) { System.out.println("Java mode active..."); }}';

      case "python":
        return 'print("Python mode active...")';

      case "c++":
        return `#include <iostream>
        using namespace std;
        
        int main() {
            cout << "C++ mode active...";
            return 0;
        }`;

      case "c":
        return `#include <stdio.h>

        int main() {
           printf("C mode active...");
           return 0;
        }`;

      case "php":
        return `<?php
        echo "PHP mode active...";
        ?>`;

      case "perl":
        return `#!/usr/bin/perl
        use strict;
        use warnings;
        
        print "Perl mode active...";`;

      case "ruby":
        return `puts "Ruby mode active..."`;

      case "go":
        return `package main

        import "fmt"
        
        func main() {
            fmt.Println("Go mode active...")
        }`;

      case "pascal":
        return `program HelloWorld;
        
        begin
            writeln('Pascal mode active...');
        end.`;

      case "c#":
        return `using System;

        namespace HelloWorld
        {
            class Program
            {
                static void Main(string[] args)
                {
                    Console.WriteLine("C# mode active...");
                }
            }
        }`;

      case "rust":
        return `fn main() {
            println!("Rust mode active...");
        }`;

      case "dart":
        return `void main() {
          print('Dart mode active...');
        }`;

      case "f#":
        return `printfn "F# mode active..."`;

      default:
        return;
    }
};