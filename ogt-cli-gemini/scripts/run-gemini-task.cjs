#!/usr/bin/env node
/**
 * run-gemini-task.cjs
 * 
 * Runs Gemini CLI with a prompt and returns the result.
 * Designed for sub-agent delegation with proper error handling.
 * 
 * Usage:
 *   node run-gemini-task.cjs "Your prompt here" [options]
 * 
 * Options:
 *   --model <model>     Model to use (gemini-2.5-flash, gemini-2.5-pro). Default: gemini-2.5-flash
 *   --timeout <secs>    Timeout in seconds. Default: 300
 *   --json              Output in JSON format
 *   --workdir <path>    Working directory for Gemini
 *   --yolo              Auto-approve tool calls (use with caution)
 * 
 * Examples:
 *   node run-gemini-task.cjs "Explain quantum computing"
 *   node run-gemini-task.cjs "Review this code" --model gemini-2.5-pro --timeout 600
 *   node run-gemini-task.cjs "Generate a report" --json
 */

const { spawn } = require('child_process');

function parseArgs(args) {
  const result = {
    prompt: null,
    model: 'gemini-2.5-flash',
    timeout: 300,
    json: false,
    workdir: process.cwd(),
    yolo: false,
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
    } else if (arg === '--yolo') {
      result.yolo = true;
    } else if (!arg.startsWith('--') && !result.prompt) {
      result.prompt = arg;
    }
    i++;
  }

  return result;
}

async function runGemini(options) {
  const { prompt, model, timeout, json, workdir, yolo } = options;

  if (!prompt) {
    console.error('Error: No prompt provided');
    console.error('Usage: node run-gemini-task.cjs "Your prompt" [--model gemini-2.5-flash|gemini-2.5-pro] [--timeout 300] [--json] [--yolo]');
    process.exit(1);
  }

  const args = ['-p', prompt, '-m', model];
  
  if (json) {
    args.push('--output-format', 'json');
  }
  
  if (yolo) {
    args.push('--yolo');
  }

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn('gemini', args, {
      cwd: workdir,
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      setTimeout(() => proc.kill('SIGKILL'), 5000);
    }, timeout * 1000);

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
        console.error(`Error: Gemini CLI exited with code ${code}`);
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
      if (err.code === 'ENOENT') {
        console.error('Error: Gemini CLI not found. Install with: npm install -g @google/gemini-cli');
      } else {
        console.error(`Error: Failed to run Gemini CLI: ${err.message}`);
      }
      process.exit(1);
    });
  });
}

// Main
const args = process.argv.slice(2);
const options = parseArgs(args);
runGemini(options);
