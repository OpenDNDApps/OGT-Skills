# OGT-Skills

AI-powered skills for managing complex projects with a documentation-first approach. 30+ specialized skills covering docs management, CLI interactions, agents, and governance.

## Philosophy

**Documentation is the database of decisions. Code is merely its implementation.**

This repository provides a comprehensive skill system built around the principle that documentation should be the source of truth for project definitions, rules, and tasks.

## What's Included

### Documentation Skills (23 skills)
Complete workflow for docs-first project management:

- **Define** - Capture business, feature, code, marketing, and branding definitions
- **Rules** - Establish coding standards, git workflows, and domain-specific rules
- **Create** - Generate tasks, definitions, rules, and social content
- **Audit** - Verify documentation completeness and accuracy
- **Config & Init** - Set up and customize docs structure

### CLI Skills (6 skills)
Connect AI agents to your development workflow:

- **ogt-cli-copilot** - GitHub Copilot integration
- **ogt-cli-claude** - Anthropic Claude integration
- **ogt-cli-opencode** - OpenCode integration
- **ogt-cli-gemini** - Google Gemini integration
- **ogt-cli-agent** - General agent framework
- **ogt-agent-team** - Multi-agent coordination

### Utilities
- **ogt-agent-spawn** - Dynamic agent spawning
- **jq** - JSON query utilities

## Quick Start

### For Documentation Management

```bash
# Understand the docs-first approach
> ogt-docs

# Create a new task
> ogt-docs-create-task

# Define a new feature
> ogt-docs-define-feature

# Add coding rules
> ogt-docs-rules-code

# Audit documentation
> ogt-docs-audit
```

### For AI Integration

```bash
# Use GitHub Copilot as a skill
> ogt-cli-copilot

# Use Claude as a skill
> ogt-cli-claude

# Coordinate multiple agents
> ogt-agent-team
```

## Documentation Structure

Each skill contains:
- `SKILL.md` - Comprehensive skill documentation
- Supporting resources and templates
- Integration guides for seamless workflow

## Key Concepts

### The Folder-as-Entity Pattern
Every documentable item is a folder containing:
- Primary document (task.md, feature.md, etc.)
- Supporting files
- Signal files for status metadata

### The Workflow
```
DEFINE → REGULATE → IMPLEMENT → VERIFY
```

## How to Use

1. **Browse skills**: Each directory contains a `SKILL.md` file with complete documentation
2. **Follow the hierarchy**: Root skills route to specialized sub-skills
3. **Use templates**: Copy template files and customize for your project
4. **Track status**: Use signal files (.version, .priority, .approved, etc.) to track progress

## Core Skills Reference

### Documentation (ogt-docs-*)
| Skill | Purpose |
|-------|---------|
| `ogt-docs` | Root skill - understand the system |
| `ogt-docs-define` | Create definitions |
| `ogt-docs-rules` | Establish rules |
| `ogt-docs-create` | Create documentation entities |
| `ogt-docs-audit` | Verify completeness |
| `ogt-docs-init` | Set up new docs |
| `ogt-docs-config` | Configure workflow |
| `ogt-docs-changelog` | Manage changelog |

### CLI & Agents (ogt-cli-*, ogt-agent-*)
| Skill | Purpose |
|-------|---------|
| `ogt-cli-copilot` | GitHub Copilot integration |
| `ogt-cli-claude` | Claude integration |
| `ogt-cli-gemini` | Gemini integration |
| `ogt-cli-opencode` | OpenCode integration |
| `ogt-agent-team` | Multi-agent coordination |
| `ogt-agent-spawn` | Dynamic agent spawning |

## The Golden Rules

1. **If it's not documented, it doesn't exist**
2. **If code contradicts docs, code is wrong**
3. **Never trust "done" status without verification**
4. **Move folders, don't copy files**
5. **Signal with dot-files, don't edit status fields**

## Naming Conventions

- **Folder slugs**: snake_case (e.g., `user_auth`, `global_search`)
- **Primary files**: lowercase type (e.g., `task.md`, `feature.md`)
- **Signal files**: dot + snake_case (e.g., `.blocked`, `.approved`)

## Getting Help

Each skill is self-contained with:
- When to use guidelines
- Step-by-step instructions
- Templates and examples
- Validation checklists

Start with the root skill for your need:
- Need to manage docs? → `ogt-docs`
- Need to integrate AI? → `ogt-cli-{agent}`
- Need to coordinate agents? → `ogt-agent-team`

## Directory Structure

```
ogt-skills/
├── ogt-docs/                    # Root documentation skill
├── ogt-docs-{define,rules,create,audit}/  # Specialized doc skills
├── ogt-docs-{define,rules}-*/   # Sub-specializations
├── ogt-cli-{copilot,claude,gemini}/      # AI integrations
├── ogt-agent-{spawn,team}/      # Agent coordination
└── jq/                          # JSON utilities
```

## License

See individual skill directories for licensing information.