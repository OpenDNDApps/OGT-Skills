#!/usr/bin/env node
/**
 * run-claude-task.cjs
 * 
 * Runs Claude CLI with a prompt and returns the result.
 * Designed for sub-agent delegation with proper error handling.
 * 
 * Usage:
 *   node run-claude-task.cjs "Your prompt here" [options]
 * 
 * Options:
 *   --model <model>     Model to use (sonnet, opus). Default: sonnet
 *   --timeout <secs>    Timeout in seconds. Default: 300
 *   --json              Output in JSON format
 *   --workdir <path>    Working directory for Claude
 * 
 * Examples:
 *   node run-claude-task.cjs "Explain quantum computing"
 *   node run-claude-task.cjs "Review this code" --model opus --timeout 600
 *   node run-claude-task.cjs "Generate a report" --json
 */

const { spawn } = require('child_process');

function parseArgs(args) {
  const result = {
    prompt: null,
    model: 'sonnet',
    timeout: 300,
    json: false,
    workdir: process.cwd(),
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    
    if (arg === '--model' && args[i + 1]) {
      result.model = args[++i];
    } else if (arg === '--timeout' && args[i + 1]) {
      result.timeout = parseInt(args[++i], 10);
    } else if (arg === '--json') {
      result.json = true;
    } else if (arg === '--workdir' && args[i + 1]) {
      result.workdir = args[++i];
    } else if (!arg.startsWith('--') && !result.prompt) {
      result.prompt = arg;
    }
    i++;
  }

  return result;
}

async function runClaude(options) {
  const { prompt, model, timeout, json, workdir } = options;

  if (!prompt) {
    console.error('Error: No prompt provided');
    console.error('Usage: node run-claude-task.cjs "Your prompt" [--model sonnet|opus] [--timeout 300] [--json]');
    process.exit(1);
  }

  const args = ['-p', '--model', model];
  
  if (json) {
    args.push('--output-format', 'json');
  }

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn('claude', args, {
      cwd: workdir,
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      setTimeout(() => proc.kill('SIGKILL'), 5000);
    }, timeout * 1000);

    // Pipe prompt to stdin instead of passing as argument
    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code, signal) => {
      clearTimeout(timer);

      if (timedOut) {
        console.error(`Error: Task timed out after ${timeout} seconds`);
        process.exit(124);
      }

      if (code !== 0) {
        console.error(`Error: Claude CLI exited with code ${code}`);
        if (stderr) {
          console.error('stderr:', stderr.trim());
        }
        process.exit(code || 1);
      }

      // Output the result
      console.log(stdout.trim());
      resolve();
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      console.error(`Error: Failed to run Claude CLI: ${err.message}`);
      process.exit(1);
    });
  });
}

// Main
const args = process.argv.slice(2);
const options = parseArgs(args);
runClaude(options);
