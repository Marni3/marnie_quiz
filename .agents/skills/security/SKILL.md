---
name: security
description: Implement, harden, debug, and review security-sensitive code for web apps, APIs, authentication, authorization, cookies, JWTs, validation, secrets, encryption, data exposure, and public-facing features.
---

# Security

## Principle

Security is the one domain where existing codebase convention is not automatically authoritative. Follow established patterns for style and structure, but flag insecure conventions even when they're already in place — do not propagate them into new code. Use OWASP ASVS / Top 10 as a baseline lens, not a checklist to satisfy mechanically.

## Core checks

- Define the assets, actors, trust boundaries, entry points, and plausible abuse cases.
- Enforce authentication and object/action-level authorization server-side; never trust client-provided identity or frontend checks.
- Validate and constrain input; encode output and protect against injection, XSS, unsafe redirects, and path abuse.
- Protect cookie flows against CSRF and configure `httpOnly`, `secure`, `sameSite`, expiration, path, and domain deliberately.
- Minimize API responses, permissions, secret exposure, sensitive logs, and client-accessible configuration.
- Apply rate limits, auditability, and secure failure behavior to sensitive actions.
- Validate outbound requests against SSRF: allowlist destinations, block requests to internal/private IP ranges and cloud metadata endpoints, and never let user input construct an unvalidated fetch/redirect target.
- Validate uploads explicitly: allowlist content-types and extensions, enforce size limits, sanitize filenames, store outside the webroot or in object storage, and scan or re-encode when the risk warrants it.

## Credentials and secrets

Hash passwords with a modern adaptive algorithm (argon2id preferred, bcrypt acceptable) using the project's established cost factor, or a safe default if none exists. Never store or log plaintext passwords or secrets. Load secrets from environment/secret managers, not source control; verify none are checked into history before merging.

## Tokens and cryptography

For JWTs, verify signatures and allowed algorithms, use short-lived access tokens, rotate refresh tokens where appropriate, define revocation/invalidation, and exclude sensitive payload data.

Do not invent cryptography. Use established authenticated encryption such as AES-GCM, unique nonces/IVs as required, managed key storage and rotation, and explicit key derivation and use. Never log plaintext secrets.

## Headers and dependencies

Set security headers deliberately: CSP, HSTS, X-Content-Type-Options, X-Frame-Options/frame-ancestors, and Referrer-Policy. Use the project's established header configuration; otherwise apply safe defaults for a server-rendered or API context.

Check dependencies for known vulnerabilities (lockfile audit, automated scanning) before adding or upgrading packages, and pin versions for anything security-sensitive.

## Review output

Prioritize exploitable findings and explain the attack path, impact, evidence, and remediation. Use labels when helpful:

- **Critical:** directly exploitable or severe data exposure.
- **Major:** likely weakness with meaningful impact.
- **Minor:** limited hardening gap.
- **Suggestion:** defense in depth.

Prefer least privilege, explicit validation, safe defaults, and layered defenses. Do not rely on obscurity or wildcard permissions.
